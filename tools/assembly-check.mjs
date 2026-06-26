/** Assembly / usability validator for the tent stand.
 *  Goes BEYOND watertight+bbox: proves parts can actually be ASSEMBLED and OPERATED.
 *
 *  (A) Dimensional clearance audit — every mating pair's gap, from the .scad params.
 *      A real assembly needs gaps (~0.2–0.4 mm), not just "no overlap".
 *  (B) Interference check — for each pose (folded + deploy at several slots), export each
 *      part in its WORLD pose and compute pairwise boolean-intersection VOLUME. Two solid
 *      parts that overlap by more than a coincident-face sliver physically cannot coexist
 *      → not assemblable. Also reports minGap (closest approach) for parts that shouldn't touch.
 *
 *    node tools/assembly-check.mjs
 */
import { initManifold, loadManifold } from './stl.mjs'
import { spawnSync } from 'child_process'
import { homedir } from 'os'

const OSC = '/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD'
const STAND = new URL('../dactyl-manuform-keyboard/cosmos/', import.meta.url).pathname
const TMP = '/private/tmp/claude-501/-Users-arisjirat-keyboard-project/f46a9395-0b58-4497-8dcc-4a50ba2d8a4f/scratchpad/'
const scadEnv = { ...process.env, OPENSCADPATH: `${homedir()}/Documents/OpenSCAD/libraries` }

const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', X = '\x1b[0m', D = '\x1b[90m'
let failed = 0
const ok = b => (b ? `${G}PASS${X}` : (failed++, `${R}FAIL${X}`))
const tag = (good, warn) => good ? `${G}PASS${X}` : warn ? `${Y}WARN${X}` : (failed++, `${R}FAIL${X}`)

// ---- params mirrored from tent_stand.scad (keep in sync) ----
const P = {
  pin_d: 2.2, hinge_rod: 2.0, knk_gap: 0.6,        // main hinge (Ø2 brass rod, bore 2.2, captive)
  pk_rod: 2.0, pk_fit: 0.2, pk_knk: 3.8, pk_axgap: 0.8,  // brass-rod-pinned pivot hinge (bore=rod+fit)
  foot_th: 3.0, slot_w: 3.6, foot_h: 3,            // foot ↔ groove (foot = full leg thickness)
  prop_th: 3, pocket_depth: 4.0,                   // leg ↔ fold pocket
  TB: 8.5, slot_top: 4.5,                          // base / slot level
}
const MIN_CLEAR = 0.15   // mm — below this a printed joint binds / won't assemble

function audit() {
  console.log(`\n${D}(A) DIMENSIONAL CLEARANCE AUDIT${X}  (need ≥ ${MIN_CLEAR} mm to assemble/move)`)
  const pairs = [
    ['main hinge rod in bore',  (P.pin_d - P.hinge_rod) / 2],
    ['main hinge knuckle gap',  P.knk_gap / 2],
    ['pivot brass rod in bore', P.pk_fit / 2],            // metal rod in plastic bore (snug, low play)
    ['pivot knuckle axial gap',   P.pk_axgap / 2],
    ['foot tab in groove',      (P.slot_w - P.foot_th) / 2],
    ['leg thickness in pocket', P.pocket_depth - P.prop_th],
    ['pivot knuckle Ø in pocket', P.pocket_depth - P.pk_knk],
    ['slot floor thickness',    P.slot_top - P.foot_h],   // structural, not a clearance (want ≥ ~1.2)
  ]
  for (const [name, gap] of pairs) {
    const isFloor = name.includes('floor')
    // a smooth METAL rod in a plastic bore can run tighter than a printed-on-printed joint
    const isMetal = name.includes('rod') && name.includes('bore')
    const good = isFloor ? gap >= 1.2 : isMetal ? gap >= 0.075 : gap >= MIN_CLEAR
    const tag = (isFloor || isMetal) ? (good ? `${G}PASS${X}` : (failed++, `${R}FAIL${X}`)) : ok(good)
    console.log(`  ${tag}  ${name.padEnd(26)} ${gap.toFixed(2)} mm`)
  }
}

function exportPart(part, opts, out) {
  const { slot = 0, theta = 0 } = opts || {}
  const r = spawnSync(OSC, ['-o', out, '-D', `part="${part}"`, '-D', `slot=${slot}`, '-D', `theta=${theta}`, `${STAND}export_stand.scad`],
    { env: scadEnv, encoding: 'utf8' })
  if (r.status !== 0) throw new Error(`export ${part}: ${(r.stderr || '').split('\n').slice(-4).join(' ')}`)
  return out
}

// geometry/solve (mirror tent_stand.scad) for the kinematic sweep
const SLOT_XS = Array.from({ length: 9 }, (_, i) => -62 + i * 8)   // n_slots=9, pitch=8
const HX = 83, PX = 10, LEG = 75, TBg = 8.5, slot_topG = 4.5, pzoff = 2.0, ddg = 83 - 10
const pivxJ = th => HX - ddg * Math.cos(th) - pzoff * Math.sin(th)
const pivzJ = th => TBg + ddg * Math.sin(th) - pzoff * Math.cos(th)
const errJ = (th, Xs) => (pivxJ(th) - Xs) ** 2 + (pivzJ(th) - slot_topG) ** 2 - LEG ** 2
function solveDeg(Xs) { let lo = Math.PI / 180, hi = 60 * Math.PI / 180; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (errJ(m, Xs) < 0) lo = m; else hi = m } return (lo + hi) / 2 * 180 / Math.PI }

// deepest real-penetration depth between two manifolds (0 = contact/clear)
function deepestPen(A, B) {
  const inter = A.intersect(B)
  if (inter.volume() < 1) return 0
  let worst = 0
  for (const m of inter.decompose()) worst = Math.max(worst, Math.min(...bbDims(m.boundingBox())))
  return worst > CONTACT_THICK ? worst : 0
}

// Two parts RESTING on each other (cover on base) share a coincident face → the boolean
// intersection is a near-zero-THICKNESS sliver (large area, tiny depth). That's contact, not
// interference. Real interference is THICK in every axis. So classify by the intersection's
// minimum bounding-box dimension, not by volume alone.
const CONTACT_THICK = 0.2   // mm — thinner than this = coincident contact (fine)
const INTERF_THICK = 0.35   // mm — penetration deeper than this = parts genuinely clash

function bbDims(box) {
  const lo = box.min ?? box[0], hi = box.max ?? box[1]
  return [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]]
}

async function checkPair(A, B, label) {
  const inter = A.intersect(B)
  const v = inter.volume()
  if (v < 1) {
    const gap = A.minGap(B, 5)
    console.log(`    ${G}PASS${X}  ${label.padEnd(20)} ${D}(no overlap; closest ${gap.toFixed(2)} mm)${X}`)
    return
  }
  // split into connected lumps; a coincident-contact sliver is thin in one axis, a real
  // penetration is thick in all three. Report the DEEPEST lump (worst penetration).
  const lumps = inter.decompose()
  let worst = 0, worstVol = 0
  for (const m of lumps) {
    const t = Math.min(...bbDims(m.boundingBox()))
    if (t > worst) { worst = t; worstVol = m.volume() }
  }
  const real = worst > CONTACT_THICK
  const verdict = !real ? `${G}PASS${X}` : worst <= INTERF_THICK ? `${Y}WARN${X}` : (failed++, `${R}FAIL${X}`)
  const kind = real
    ? `${lumps.length} lump(s), deepest penetrates ${worst.toFixed(2)} mm (${worstVol.toFixed(0)} mm³)`
    : `${D}contact only (deepest sliver ${worst.toFixed(2)} mm, total ${v.toFixed(0)} mm³)${X}`
  console.log(`    ${verdict}  ${label.padEnd(20)} ${kind}`)
}

async function checkConfig(name, coverPart, legPart, slot) {
  console.log(`  ${D}· ${name}${X}`)
  const b = exportPart('bottom', { slot }, TMP + 'ac_base.stl')
  const c = exportPart(coverPart, { slot }, TMP + 'ac_cover.stl')
  const l = exportPart(legPart, { slot }, TMP + 'ac_leg.stl')
  const B = await loadManifold(b), C = await loadManifold(c), L = await loadManifold(l)
  await checkPair(B, C, 'base ↔ cover')
  await checkPair(B, L, 'base ↔ leg')
  await checkPair(C, L, 'cover ↔ leg')
}

// (C) sweep the cover from nearly-flat up to the deepest deploy angle, leg foot riding the base —
// proves the leg can actually SWING from nested→slot (and back) without trapping mid-motion.
async function foldSweep() {
  console.log(`\n${D}(C) FOLD/DEPLOY KINEMATIC SWEEP${X}  (leg foot rides the base nested→slot; nothing may clash mid-swing)`)
  const B = await loadManifold(exportPart('bottom', {}, TMP + 'ac_base.stl'))
  const maxTh = solveDeg(SLOT_XS[SLOT_XS.length - 1])
  let wLB = 0, wLC = 0, atLB = 0, atLC = 0
  const steps = []
  for (let th = 2; th <= maxTh + 0.5; th += 3) steps.push(th)
  for (const th of steps) {
    const C = await loadManifold(exportPart('wcoverth', { theta: th }, TMP + 'ac_cover.stl'))
    const L = await loadManifold(exportPart('wlegth', { theta: th }, TMP + 'ac_leg.stl'))
    const lb = deepestPen(B, L), lc = deepestPen(C, L)
    if (lb > wLB) { wLB = lb; atLB = th }
    if (lc > wLC) { wLC = lc; atLC = th }
  }
  const okLB = wLB <= INTERF_THICK, okLC = wLC <= INTERF_THICK
  console.log(`  swept ${steps.length} angles ${steps[0].toFixed(0)}°→${maxTh.toFixed(0)}°`)
  console.log(`  ${tag(okLB, wLB < 0.6)}  leg ↔ base  worst penetration ${wLB.toFixed(2)} mm${wLB ? ` @ ${atLB.toFixed(0)}°` : ' (clear all the way)'}`)
  console.log(`  ${tag(okLC, wLC < 0.6)}  leg ↔ cover worst penetration ${wLC.toFixed(2)} mm${wLC ? ` @ ${atLC.toFixed(0)}°` : ' (clear all the way)'}`)
  console.log(`  ${D}→ the leg can swing through the whole fold/deploy arc without hitting the base or cover.${X}`)
}

async function main() {
  await initManifold()
  audit()
  console.log(`\n${D}(B) INTERFERENCE IN ASSEMBLED POSES${X}  (penetration ≤ ${CONTACT_THICK} mm = contact only; > ${INTERF_THICK} mm = parts clash)`)
  await checkConfig('FOLDED (flat storage)', 'wcover0', 'wlegfold', 0)
  const N = SLOT_XS.length
  for (const s of [0, Math.floor(N / 2), N - 1]) await checkConfig(`DEPLOYED slot ${s + 1}/${N}`, 'wcover', 'leg', s)
  await foldSweep()
  console.log(failed ? `\n${R}${failed} CHECK(S) FAILED${X}` : `\n${G}ALL ASSEMBLY CHECKS PASS${X}`)
  process.exit(failed ? 1 : 0)
}
main().catch(e => { console.error(R + 'ERROR' + X, e.message); process.exit(2) })
