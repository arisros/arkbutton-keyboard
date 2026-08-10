/** Robust mesh-boolean split using manifold-3d (OCC booleans fail on the flat
 * Cosmos wall geometry). Reads clean_case.stl (uncut clean bowl) + holder.stl,
 * writes case_main.stl (bowl with coakan window) and block.stl (ONE watertight
 * part = wall panel + connector holes + holder + reset boss).
 *   node src/model_gen/mesh-split.mjs
 */
import Module from '../../node_modules/manifold-3d/manifold.js'
import { readFileSync, writeFileSync } from 'fs'

const DIR = '/Users/arisjirat/keyboard-project/cosmos'
const wasm = await Module()
wasm.setup()
const { Manifold, Mesh } = wasm

// --- coakan box + connector hole positions (case STL frame) ------------------
const BX0 = -40, BX1 = 12, BY0 = 72, BY1 = 106, BZ0 = -2, BZ1 = 12  // window top lowered to 12 (thinner)
// all three I/O in ONE low row (z=6) so nothing tall sticks up; reset to the
// right (x=5), clear of the RP2040 board (which ends ~x=1).
const TRRS = [-28, 6], USB = [-10, 6], RESET = [5, 6]
const TRRS_D = 9, USB_W = 13, USB_H = 6, RESET_D = 7   // TRRS shrunk 12->9 so it fits under BZ1=12

function loadManifold(path) {
  const buf = readFileSync(path)
  const n = buf.readUInt32LE(80)
  const verts = new Float32Array(n * 9)
  const tris = new Uint32Array(n * 3)
  let o = 84
  for (let i = 0; i < n; i++) {
    o += 12
    for (let j = 0; j < 9; j++) { verts[i * 9 + j] = buf.readFloatLE(o); o += 4 }
    tris[i * 3] = i * 3; tris[i * 3 + 1] = i * 3 + 1; tris[i * 3 + 2] = i * 3 + 2
    o += 2
  }
  const mesh = new Mesh({ numProp: 3, vertProperties: verts, triVerts: tris })
  mesh.merge()
  return new Manifold(mesh)
}

function saveManifold(man, path) {
  const m = man.getMesh()
  const vp = m.vertProperties, tv = m.triVerts, nt = tv.length / 3
  const buf = Buffer.alloc(84 + nt * 50)
  buf.writeUInt32LE(nt, 80)
  let o = 84
  for (let t = 0; t < nt; t++) {
    o += 12 // normal left 0
    for (let k = 0; k < 3; k++) {
      const vi = tv[t * 3 + k]
      buf.writeFloatLE(vp[vi * 3], o); buf.writeFloatLE(vp[vi * 3 + 1], o + 4); buf.writeFloatLE(vp[vi * 3 + 2], o + 8)
      o += 12
    }
    o += 2
  }
  writeFileSync(path, buf)
  console.log('OK', path.split('/').pop(), nt, 'tris')
}

// bore along Y (out the back): cylinder along Z -> rotate to Y
const boreY = (d, x, z) => Manifold.cylinder(40, d / 2, d / 2, 64, true).rotate([90, 0, 0]).translate([x, 90, z])
const slotY = (w, h, x, z) => Manifold.cube([w, 40, h], true).translate([x, 90, z])

const caseM = loadManifold(`${DIR}/clean_case.stl`)
const box = Manifold.cube([BX1 - BX0, BY1 - BY0, BZ1 - BZ0], false).translate([BX0, BY0, BZ0])

// bowl with clean window
saveManifold(caseM.subtract(box), `${DIR}/case_main.stl`)

// wall panel = case ∩ box, with connector holes bored
let panel = caseM.intersect(box)
panel = panel.subtract(boreY(TRRS_D, TRRS[0], TRRS[1]))
panel = panel.subtract(slotY(USB_W, USB_H, USB[0], USB[1]))
panel = panel.subtract(boreY(RESET_D, RESET[0], RESET[1]))

// holder (RP2040-Zero + TRRS) + reset boss, UNIONed into one watertight part
const holder = loadManifold(`${DIR}/holder.stl`)
// short reset boss (z 3..12) at the low reset position, with a 6.6 mm switch pocket
// reset boss sits on the floor (z3) up to ~z11, with a 6.6 mm switch pocket
const resetBoss = Manifold.cube([11, 10, 8], true).translate([RESET[0], 86, 7])
  .subtract(Manifold.cube([6.6, 6.6, 8], true).translate([RESET[0], 88, RESET[1]]))

const block = panel.add(holder).add(resetBoss)
saveManifold(block, `${DIR}/block.stl`)
console.log('done')
