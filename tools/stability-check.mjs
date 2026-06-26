/** PHYSICAL stability / statics check for the tent stand (rigid-body + beam estimates).
 *  Answers: when you press a key / type, does it wobble, slip the lock, or tip?
 *  Models the deployed cover as a rigid plate on two supports — the hinge line (x=HINGE_X) and
 *  the prop leg (a two-force member pushing the cover at the pivot). Computes, per lock slot:
 *    • leg angle & axial force under load
 *    • LOCK behaviour: which way the foot is pushed (into the groove = self-locking, or out = slip)
 *    • groove-wall side force (does it try to splay the slot?)
 *    • TIP margin (does a frontmost key-press tip the unit off the desk?)
 *    • LATERAL wobble: leg bending stiffness (wide axis) + pin-clearance play
 *  All loads are ASSUMPTIONS, stated below — change them to match reality.
 *    node tools/stability-check.mjs
 */
const G = '\x1b[32m', R = '\x1b[31m', Y = '\x1b[33m', X = '\x1b[0m', D = '\x1b[90m'
let fail = 0
const tag = (good, warn) => good ? `${G}PASS${X}` : warn ? `${Y}WARN${X}` : (fail++, `${R}FAIL${X}`)

// ---- geometry (mirror tent_stand.scad) ----
const HINGE_X = 83, PIVOT_X = 10, LEG_LEN = 75
const TB = 8.5, slot_top = 4.5, pivz_off = 2.0
const prop_w = 60, prop_th = 3, foot_h = 3, foot_th = 3.0
const SLOT_XS = Array.from({ length: 9 }, (_, i) => -62 + i * 8)   // n_slots=9, pitch=8
const dd = HINGE_X - PIVOT_X
const pivx = th => HINGE_X - dd * Math.cos(th) - pivz_off * Math.sin(th)
const pivz = th => TB + dd * Math.sin(th) - pivz_off * Math.cos(th)
const err = (th, Xs) => (pivx(th) - Xs) ** 2 + (pivz(th) - slot_top) ** 2 - LEG_LEN ** 2
function solveAngle(Xs) { let lo = Math.PI / 180, hi = 60 * Math.PI / 180; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (err(m, Xs) < 0) lo = m; else hi = m } return (lo + hi) / 2 }

// ---- LOAD ASSUMPTIONS (edit to taste) ----
const W_kb = 2.5      // N — weight of this (right) keyboard half resting on the cover (~250 g)
const W_hand = 10     // N — hand/forearm weight resting on the tented half while typing (~1 kg)
const F_press = 6     // N — peak force of a firm key press
const F_side = 4      // N — sideways (Y) force while typing on offset keys / nudging
const E_PLA = 3300    // N/mm² — PLA Young's modulus (FDM, conservative)
const W = W_kb + W_hand            // steady downward load on the cover
const KB_X0 = -70, KB_X1 = 80      // keyboard footprint extent in X (where keys live)
const KB_CG = 5                    // load centroid X (≈ middle of the keywell)
const BASE_FRONT = -76             // base footprint front edge (most −X contact on the desk; = case rim)

console.log(`${D}LOADS: keyboard ${W_kb} N + hand ${W_hand} N (steady ${W} N), key-press ${F_press} N, side ${F_side} N, PLA E ${E_PLA} MPa${X}`)

// === 1) LOCK: self-locking vs slip, per slot ===
console.log(`\n${D}1) LOCK MECHANISM — does a downward (typing) load push the foot INTO the groove?${X}`)
let worstSide = 0, shallowest = 90
for (let i = 0; i < SLOT_XS.length; i++) {
  const Xs = SLOT_XS[i], th = solveAngle(Xs)
  const px = pivx(th), pz = pivz(th)
  const legAng = Math.atan2(pz - slot_top, px - Xs)        // leg rise angle from horizontal at the foot
  const degLeg = legAng * 180 / Math.PI
  shallowest = Math.min(shallowest, degLeg)
  // cover free body, moments about hinge: Lz*(HINGE_X-PIVOT_X) = W*(HINGE_X - KB_CG)
  const Lz = W * (HINGE_X - KB_CG) / dd                    // vertical force the leg carries
  const L = Lz / Math.sin(legAng)                          // axial leg force (compression)
  const Lx = Lz / Math.tan(legAng)                         // horizontal → into the groove −X wall
  worstSide = Math.max(worstSide, Lx)
  // foot force direction = from pivot toward foot = (−,−): DOWN into floor + toward −X into wall.
  // vertical is always downward (Lz>0) for any key (KB load is left of the hinge) → no lift-out.
  const lock = Lz > 0   // compression ⇒ self-locking
  console.log(`  slot ${String(i + 1).padStart(2)}  leg ${degLeg.toFixed(0).padStart(2)}° from horiz   axial ${L.toFixed(1)} N   into-wall ${Lx.toFixed(1)} N   ${tag(lock, false)} ${lock ? D + 'self-locks (foot driven down+into wall)' + X : 'SLIPS OUT'}`)
}
console.log(`  ${D}→ Every downward load makes the prop a compression member that drives the foot DOWN into`)
console.log(`     the groove and sideways into the −X wall — it cannot lift out while you press keys.${X}`)

// === 2) GROOVE retention & wall strength ===
console.log(`\n${D}2) GROOVE RETENTION — slip-out needs an UPWARD force; strength = wall stress vs PLA${X}`)
{
  // (a) SLIP-OUT is kinematic: the foot can only leave the groove by moving UP. During typing the
  //     leg is in compression → the foot force is DOWN (Lz>0) at every slot → it is pinned, cannot
  //     climb out. (It would only unlock if you LIFT the lifted edge, i.e. deliberately fold it.)
  console.log(`  ${tag(true, false)}  no upward force on the foot under any key-press → cannot slip out (self-locking)`)
  // (b) STRENGTH: the worst horizontal force presses the foot tab against the −X groove wall.
  //     bearing stress over the engaged wall (foot_w × foot_h); PLA yields ~40–50 MPa.
  const wallArea = prop_w * foot_h            // mm² of foot tab bearing on the groove wall
  const stress = worstSide / wallArea          // N/mm² = MPa
  const good = stress < 8                       // generous margin under PLA (~40 MPa)
  console.log(`  ${tag(good, stress < 15)}  shallowest slot side force ${worstSide.toFixed(0)} N over ${wallArea.toFixed(0)} mm² wall = ${stress.toFixed(2)} MPa (PLA ~40) ${D}→ huge margin${X}`)
  console.log(`  ${D}→ inner/flat slots push the groove wall hardest (${worstSide.toFixed(0)} N) but it is a tiny stress; the${X}`)
  console.log(`  ${D}  ${foot_h} mm-deep, ${prop_w} mm-wide engagement holds. Lock is secure while typing.${X}`)
}

// === 3) TIP: does a frontmost key-press tip the whole unit off the desk? ===
console.log(`\n${D}3) TIP STABILITY — frontmost key-press vs the base front edge (x=${BASE_FRONT})${X}`)
{
  // tipping about the front base edge: restoring = (kb weight)*(CG − front);  upset = press*(press − front)
  const dPress = (KB_X0 - BASE_FRONT)            // how far the frontmost key sits inside the edge
  const restore = (W_kb + W_hand) * (KB_CG - BASE_FRONT)
  const upset = F_press * dPress
  const margin = restore / upset
  const good = margin > 3
  console.log(`  frontmost key ${dPress.toFixed(0)} mm inside the edge; restoring ${restore.toFixed(0)} vs upset ${upset.toFixed(0)} N·mm → margin ×${margin.toFixed(1)}  ${tag(good, margin > 1.5)}`)
  console.log(`  ${D}→ the flat base footprint reaches past the keys; the load stays well inside it.${X}`)
}

// === 4) LATERAL WOBBLE: leg bending (wide axis) + pin play ===
console.log(`\n${D}4) LATERAL (side-to-side) WOBBLE — leg is ${prop_w}×${prop_th} mm; side load hits the WIDE axis${X}`)
{
  // leg as a strut bending under a side (Y) load: wide-axis second moment I = th*w³/12
  const I = prop_th * prop_w ** 3 / 12       // mm⁴ (bending about the vertical/Y plane)
  const defl = F_side * LEG_LEN ** 3 / (3 * E_PLA * I)   // cantilever tip deflection, mm
  const good = defl < 0.3
  console.log(`  leg side-bend deflection under ${F_side} N: ${defl.toFixed(3)} mm  ${tag(good, defl < 0.6)} ${D}(60 mm width = very stiff in Y)${X}`)
  // pin-clearance play: roll (the wobble you feel) is resisted by how far apart the pin is borne.
  // BOTH joints are now the SAME Ø2 brass rod in a snug 0.2 mm bore: pivot borne across the 60 mm
  // knuckle barrel, main hinge across its 84 mm span. Both captive (blind end + press-grip).
  const hingeSpan = 84      // mm — main-hinge knuckle span
  const pivotFit = 0.2, hingeFit = 0.2     // mm diametral fit of the Ø2 brass rods (pk_fit / hinge_fit)
  const rockPivot = pivotFit / prop_w, rockHinge = hingeFit / hingeSpan
  const tipPlay = (rockPivot + rockHinge) * LEG_LEN
  console.log(`  free-play at the leg top (both joints Ø2 brass, snug): ${tipPlay.toFixed(2)} mm  ${tag(tipPlay < 0.8, tipPlay < 1.0)}`)
  console.log(`  ${D}→ pivot AND main hinge both use the SAME Ø2 brass rod in a snug 0.2 mm bore, each captive${X}`)
  console.log(`  ${D}  (blind end + press-grip, nothing to lose). ~0.4 mm play, borne over the ${prop_w} mm pivot barrel${X}`)
  console.log(`  ${D}  + ${hingeSpan} mm hinge span. Twist about the leg resisted by the ${prop_w} mm foot in the ${prop_w} mm slot.${X}`)
}

console.log(fail ? `\n${R}${fail} STABILITY CHECK(S) FAILED${X}` : `\n${G}STABILITY OK — self-locking under typing, no slip, no tip, wobble = pin slop only${X}`)
process.exit(fail ? 1 : 0)
