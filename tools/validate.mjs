/** Validate the generated STL parts against tools/spec.json:
 *   - watertight (manifold-3d), non-empty (minTris)
 *   - bounding box within expected x/y/z ranges (catches the degenerate-screw
 *     ±150 blow-up, an empty/collapsed block, a clipped/too-tall part)
 * Writes tools/validate-report.json, prints a PASS/FAIL table, exits non-zero
 * if anything FAILs.
 *   node tools/validate.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { metrics } from './stl.mjs'

const COSMOS = new URL('../cosmos/', import.meta.url).pathname
const SPEC = JSON.parse(readFileSync(new URL('./spec.json', import.meta.url)))
const C = { ok: '\x1b[32m', bad: '\x1b[31m', dim: '\x1b[90m', off: '\x1b[0m' }

const within = (v, [lo, hi]) => v >= lo && v <= hi

async function main() {
  const report = []
  let fails = 0
  for (const [file, rule] of Object.entries(SPEC.parts)) {
    const path = COSMOS + file
    const entry = { file, checks: [], pass: true }
    if (!existsSync(path)) {
      entry.pass = false; entry.checks.push(['exists', false, 'missing file'])
      report.push(entry); fails++; continue
    }
    const m = await metrics(path)
    entry.metrics = { tris: m.tris, min: m.min, max: m.max, height: m.height, volume: m.volume, genus: m.genus, watertight: m.watertight }
    const check = (name, ok, detail) => { entry.checks.push([name, ok, detail]); if (!ok) entry.pass = false }

    if (rule.minTris != null) check('non-empty', m.tris >= rule.minTris, `${m.tris} tris (need ≥${rule.minTris})`)
    if (rule.footInSlot != null) check('foot-in-slot', m.min[2] <= rule.footInSlot, `foot min-Z ${m.min[2]} (need ≤${rule.footInSlot} = enters slot groove)`)
    if (rule.insideOf) {
      const o = await metrics(COSMOS + rule.insideOf)
      const tol = rule.insideTol ?? 0
      // hingeTolXmax: the knuckle hinge sits at the +X (pinky) edge and MUST protrude by its
      // radius to carry the pin — allow extra overage only on that one edge (by design).
      const xmaxTol = rule.hingeTolXmax ?? tol
      const inside = m.min[0] >= o.min[0] - tol && m.max[0] <= o.max[0] + xmaxTol && m.min[1] >= o.min[1] - tol && m.max[1] <= o.max[1] + tol
      check(`inside ${rule.insideOf}`, inside, `XY [${m.min[0]},${m.max[0]}]x[${m.min[1]},${m.max[1]}] vs case [${o.min[0]},${o.max[0]}]x[${o.min[1]},${o.max[1]}] (xmaxTol ${xmaxTol})`)
    }
    if (rule.watertight) check('watertight', m.watertight, m.error ? `error: ${m.error}` : `volume ${m.volume}`)
    for (const ax of ['x', 'y', 'z']) {
      if (rule[ax]) {
        const i = { x: 0, y: 1, z: 2 }[ax]
        const ok = within(m.min[i], rule[ax]) && within(m.max[i], rule[ax])
        check(`bbox.${ax}`, ok, `[${m.min[i]}, ${m.max[i]}] within [${rule[ax][0]}, ${rule[ax][1]}]`)
      }
    }
    if (!entry.pass) fails++
    report.push(entry)
  }

  // print
  for (const e of report) {
    const tag = e.pass ? `${C.ok}PASS${C.off}` : `${C.bad}FAIL${C.off}`
    console.log(`${tag}  ${e.file}${e.metrics ? `  ${C.dim}(${e.metrics.tris} tris, Z ${e.metrics.min?.[2]}..${e.metrics.max?.[2]}, vol ${e.metrics.volume})${C.off}` : ''}`)
    for (const [name, ok, detail] of e.checks) if (!ok) console.log(`        ${C.bad}✗ ${name}${C.off}: ${detail}`)
  }
  const out = new URL('./validate-report.json', import.meta.url).pathname
  writeFileSync(out, JSON.stringify({ when: 'now', fails, report }, null, 2))
  console.log(`\n${fails === 0 ? C.ok + 'ALL PASS' : C.bad + fails + ' FAILED'}${C.off}  → tools/validate-report.json`)
  process.exit(fails === 0 ? 0 : 1)
}
main().catch(e => { console.error(e); process.exit(2) })
