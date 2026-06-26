/** Shared STL helpers: binary-STL bbox + manifold-3d load/metrics.
 * Replaces the ad-hoc python bbox parsing scattered through the project. */
import { readFileSync } from 'fs'

const MANIFOLD = new URL('../Cosmos-Keyboards/node_modules/manifold-3d/manifold.js', import.meta.url)
let _wasm = null
export async function initManifold() {
  if (!_wasm) {
    const { default: Module } = await import(MANIFOLD.href)
    _wasm = await Module()
    _wasm.setup()
  }
  return _wasm
}

/** Parse STL (binary OR ASCII — OpenSCAD exports ASCII) -> {tris, verts:Float32Array(9*tris)}. */
export function parseSTL(path) {
  const buf = readFileSync(path)
  const n = buf.length >= 84 ? buf.readUInt32LE(80) : 0
  if (n > 0 && buf.length === 84 + n * 50) { // binary
    const verts = new Float32Array(n * 9)
    let o = 84
    for (let i = 0; i < n; i++) {
      o += 12
      for (let j = 0; j < 9; j++) { verts[i * 9 + j] = buf.readFloatLE(o); o += 4 }
      o += 2
    }
    return { tris: n, verts }
  }
  // ASCII (parseFloat handles signed exponents like 2.43e-16 that a char-class regex would split)
  const re = /vertex\s+(\S+)\s+(\S+)\s+(\S+)/g
  const text = buf.toString('latin1')
  const vs = []
  let m
  while ((m = re.exec(text))) vs.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]))
  return { tris: vs.length / 9, verts: new Float32Array(vs) }
}

/** bbox: triangle count + min/max/size. */
export function bbox(path) {
  const { tris, verts } = parseSTL(path)
  const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]
  for (let i = 0; i < verts.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const c = verts[i + k]
      if (c < mn[k]) mn[k] = c
      if (c > mx[k]) mx[k] = c
    }
  }
  return { tris, min: mn, max: mx, size: [mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]] }
}

/** Load STL into a manifold-3d Manifold (verts merged -> watertight if closed). */
export async function loadManifold(path) {
  const w = await initManifold()
  const { Manifold, Mesh } = w
  const { tris: n, verts } = parseSTL(path)
  const tris = new Uint32Array(n * 3)
  for (let i = 0; i < n; i++) { tris[i * 3] = i * 3; tris[i * 3 + 1] = i * 3 + 1; tris[i * 3 + 2] = i * 3 + 2 }
  const mesh = new Mesh({ numProp: 3, vertProperties: verts, triVerts: tris })
  mesh.merge()
  return new Manifold(mesh)
}

const r1 = x => Math.round(x * 10) / 10

/** Full metrics for one STL: bbox/size/height + manifold volume/genus/watertight. */
export async function metrics(path) {
  const bb = bbox(path)
  const out = {
    tris: bb.tris,
    min: bb.min.map(r1), max: bb.max.map(r1), size: bb.size.map(r1),
    height: r1(bb.size[2]),
    volume: 0, genus: null, watertight: false, error: null,
  }
  try {
    const m = await loadManifold(path)
    out.volume = r1(m.volume())
    out.genus = m.genus()
    // manifold-3d only yields a non-empty positive-volume manifold for a valid
    // watertight (closed, oriented) mesh; degenerate input collapses to vol 0.
    out.watertight = out.volume > 1
  } catch (e) {
    out.error = e.message
  }
  return out
}
