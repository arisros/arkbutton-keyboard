# Tent Plate Print — Findings & Next Steps

## ✅✅ BREAKTHROUGH (2026-07-08/09) — IT PRINTS. Two root fixes.

After ~10 failed FLAT attempts in one session, the RIGHT plate printed **complete** (LEFT
printing after). Two things were wrong the whole time:

### 1. WRONG ORIENTATION — print VERTICAL, not flat.
The designer's readme says **"Print them vertically"** (see
`Charybdis/.../tenting-stand-with-wrist-pads/assets/print-position.png`): plate stands on its
long edge, anchored by a wide brim; the hinge knuckles become **gussets on the vertical wall**.
Printed **FLAT** (`*_print.stl`, body-down) the knuckles are thin tall tabs → they curl / nest
EVERY time (bare, with support, glue, any offset, Elegoo or our pipeline — all fail ~L4-5 or 76%).
**Use `plate_solid_{RIGHT,LEFT}_vert.stl` (147×14 footprint, 138mm tall).** Bonus: the vertical
footprint is a thin strip in the **bed CENTRE** (good adhesion) instead of spanning the warped
corners. Profile: **`proc_solid_supbrim`** (support@50° for pockets/knuckle overhangs + brim),
`--orient 0` (do NOT auto-orient — it lays it flat again), `--fan 255`, ~60% speed cap (tall part).

### 2. Z0 DRIFTS EVERY G28 (~±0.15mm) — use the NO-REHOME technique.
Root cause of the endless "ga nempel / hancur" first layers: the nozzle-contact home gives a
different Z0 each G28 (observed true Z0 ranged −1.31 … −1.52 in ONE session). Any injected offset
is wrong after the print re-homes. **Fix: home ONCE, paper-verify true Z0 at centre, then print
with G28 STRIPPED so it reuses that verified home.** Post-process the slice.py gcode:
- delete the `G28 ;home` line,
- replace `BED_MESH_CALIBRATE...` → `BED_MESH_PROFILE LOAD=6` (mesh must already be live),
- change the prime `G1 Z0 F300` → `G1 Z2 F300` (else it crashes with the offset applied).
Keep `homed_axes=xyz` valid between prints (don't power-cycle / don't re-home). Verify before each
start: `curl .../printer/objects/query?toolhead | ...homed_axes`.

**Offset math (don't confuse paper-Z with print-offset):** light paper drag at machineZ `m` ⇒
true Z0 `K = 0.1 − m`. Print offset for gap ~0.12 first layer ≈ `−(K)` (e.g. K=1.31 → ~−1.36).
**Glue raises the bed ~0.05-0.08mm → use a LESS negative offset** (with glue this session: −1.36).
Krak-krek mid-print = over-squish → babystep the offset UP live; curling/not-sticking = babystep DOWN.
**RE-GLUE ⇒ RE-PAPER-TEST, always.** Glue thickness varies wildly per application (observed true Z0
swung −1.23 (thick) … −1.34 (thin) just from re-gluing) — never reuse a prior offset after re-gluing.
30-sec routine: `SET_GCODE_OFFSET Z=0`, jog centre down to light paper drag at machineZ `m`, print
offset ≈ `m − 0.05` (a touch more squish for big flat parts / anchors). Big flat parts (base 130×130)
reach the warped corners → glue the 4 corners a bit heavier + use a brim; verified offset makes them hold.

### Assembly (fully documented — no need to invent a join):
- Plate → keyboard case: **8× M4 bolts 14mm + 8 nuts** (countersunk holes already in plate).
- Plate → tent base: **hinge knuckles + Ø4 pin** to `bottom.stl`, + **tenting-arm (35mm)** foot into
  base notches for the tent angle (17/21/25/29°, design ~24°). Hardware in SHOPPING-LIST.
- Next parts: LEFT plate (mirror ✓ made `plate_solid_LEFT_vert.stl`), then `bottom.stl` + `tenting-arm.stl`.

---

## Older notes (2026-07-07) — mostly SUPERSEDED by the breakthrough above

Marathon debug session on the Neptune 4 Pro printing the RIGHT tent plate (magnet mod).
This captures everything learned so tomorrow is a clean execution.

## ⚠️⚠️ CRITICAL: Z0 DRIFTS EVERY SESSION — paper-test EVERY power-on

The nozzle-contact home gives a **different Z0 each time the printer is power-cycled** (~0.05–0.10 mm).
This was the hidden cause of most "won't stick / balls on nozzle / menggumpal" failures — the injected
offset from a previous session is wrong after a reboot → nozzle prints too high → in air → clumps.

**MANDATORY each session before printing:** paper-test at bed center to find the touch point, then
`offset = touch_Z − 0.10`. Observed: 2026-07-06 touch −1.10 → offset **−1.20**; 2026-07-07 touch −1.20
→ offset **−1.30**. Procedure: `G28; BED_MESH_CLEAR; SET_GCODE_OFFSET Z=0; G1 X117 Y117; G1 Z-1.20`
(descend in 0.05 steps until light paper drag), then patch the gcode `SET_GCODE_OFFSET Z=<touch−0.10>`.
Homing needs a CLEAN nozzle tip (wipe first) or Z0 reads high.

## ✅ SOLVED

- **First-layer adhesion** — the #1 blocker all session. Fixed by **three things together**:
  0. **Paper-test the Z offset fresh EVERY session** (see the CRITICAL note above — this was the
     real recurring killer).
  1. **Degrease the bed** (IPA/alcohol or dish-soap+water, dry, don't touch surface after). PLA
     would not stick at a good gap until the bed was degreased — oils from all the handling.
  2. **Correct Z offset = −1.20** (NOT −1.11/−1.18 we used all night). Verified by **paper test
     at bed center**: light drag (~0.1 mm) at raw `G1 Z-1.10` (offset 0) ⇒ true Z0 correction
     ≈ 1.20. We were ~0.1 mm too high the whole time → gap ~0.29 instead of ~0.2 → not sticking
     / balling on nozzle. **Proof it works:** photo IMG_9028 — left/main body first layer is
     clean & stuck; only the right tabs failed (that's the extruder issue below, not adhesion).
- **Solid plate design** — the generic honeycomb `plate.3mf` is UNPRINTABLE (thin struts curl →
  stringy mess). Fixed by filling the honeycomb solid: `plate_solid_RIGHT_print.stl`
  (offset-close of the projection + extrude, magnet pockets re-cut). Body prints clean.
- **PLA temp** — 205 °C nozzle (NOT 220 → too hot, curls), bed 65 °C, fan max (255).
- **Bed trammed** — tilt 0.329 → 0.264 mm (4-corner paper tram). Mesh (profile 6) fresh.

## 🔧 IN PROGRESS — NOZZLE SWAP (confirmed needed, 2026-07-07)

After systematically ruling out EVERYTHING else, the nozzle still balls/clumps ("nyangkut / nempel
ke nozzle") → the **nozzle itself is worn/damaged** (dozens of blobs + needle pokes + cold pulls all
session). Ruled out this session: offset (paper-tested touch −1.20 → offset −1.30), 4-corner tram
(3 rounds — but tilt stayed **0.270**, because the bed is **WARPED/concave** (front+back edges dip
~0.18 mm), which tram can't fix — mesh compensates it during print, so tram wasn't the fix), fresh
mesh, degreased bed. Balling persisted → **swap the nozzle** (spare in the Neptune 4 box).

**Swap procedure:** heat 230 °C → unload filament → remove silicone sock → hold heater block with a
wrench + unscrew nozzle with the nozzle socket (CCW) → screw new nozzle in by hand, snug it **while
hot** (leak-free) → re-fit sock. **After swap: extrude-test (should flow straight/smooth) + RE-PAPER-
TEST the offset** (new nozzle = new tip height = new Z0). Was mid-swap when we stopped to rest.

## ⚠️ (was) extruder under-extrusion (partial clog) — superseded by nozzle swap above

Symptom: **"cetak cetek"** (extruder skipping/clicking) + right side of print bolong/blobby while
left side perfect = classic **under-extrusion / partial nozzle clog** (from all the blobs cleaned).
- **Fix: clean the nozzle internally** — unclog needle (from bed at ~205 °C) + cold pull. If it
  persists, swap the nozzle (cheap).
- After clean: verify with a clean extrusion (should flow smooth, no clicking).

## ⚠️ REMAINING — knuckle geometry (fails at ~76 %)

The plate's hinge knuckles print as a **forest of thin tall tabs** (Z-slice: 10–16 separate
islands above Z≈3). Bare → curl at 76 %. With support → support itself fails at 18 %. Vertical →
138 mm-tall 14 mm-thin wall = tippy + horizontal pockets. **NONE work.**
- **Next approach: SPLIT or REDESIGN.** Print the solid body alone (proven, prints to 100 % once
  adhesion is right), and either (a) a separate chunky hinge bracket bolted/glued on, or
  (b) redesign knuckles chunkier/shorter, or (c) simplify base attachment (bolt-on, no
  interleaving knuckles — tent angle is set by the arm notches anyway).

## KNOWN-GOOD RECIPE (use this tomorrow)

```
# 1. Cold-pull / needle-clean nozzle first. Degrease bed. Home with CLEAN nozzle.
# 2. Slice:
cd ~/Documents/neptune4-print-toolkit
python3 scripts/slice.py --stl /Users/arisjirat/keyboard-project/tools/tent/plate_solid_RIGHT_print.stl \
  --copies 1 --orient 0 --process profiles_local/proc_tent_lowstring.json \
  --filament profiles_local/filament_pla_cool.json --fan 255 --out /tmp/plate_solid_R.gcode
# 3. Patch (macOS sed needs -i.bak): nozzle 205, offset -1.20, bed 65:
sed -i.bak -e 's/ S220/ S205/g' -e 's/^M104 S220/M104 S205/' -e 's/^M109 S220/M109 S205/' \
  -e 's/SET_GCODE_OFFSET Z=-1.18/SET_GCODE_OFFSET Z=-1.20/' \
  -e 's/^M140 S60/M140 S65/' -e 's/^M190 S60/M190 S65/' /tmp/plate_solid_R.gcode
# 4. Send (upload+start via API — printer.py send times out; network flaky):
IP=192.168.1.164
curl -s --max-time 120 -F "file=@/tmp/plate_solid_R.gcode;filename=plate_solid_R.gcode" "http://$IP/server/files/upload"
curl -s -X POST "http://$IP/printer/print/start" -H "Content-Type: application/json" -d '{"filename":"plate_solid_R.gcode"}'
```

- **Live gap reads during print are confounded by mesh compensation** — don't trust `z+1.20`
  while printing (nozzle follows the mesh). Trust the paper test (mesh cleared) for the baseline,
  and your eyes for adhesion.
- If extruder skips again (over-squish) babystep UP; if not sticking babystep DOWN, live:
  `SET_GCODE_OFFSET Z=<val> MOVE=1` via Moonraker.

## FILES (all in tools/tent/)
- `plate_solid_RIGHT_print.stl` — solid plate, print-oriented (flat, body down), 5 magnet
  pockets ⌀8.3×1.5 blind + knuckles. **This is the one to print.**
- `plate_mag_RIGHT.stl` / `cover_magfeet_RIGHT.stl` — native-frame magnet-mod plate + cover.
- `plate_solid_RIGHT_vert.stl` — vertical orient (rejected, tippy).
- LEFT mirrors: `plate_mag_LEFT.stl`, `cover_magfeet_LEFT.stl` (need re-do for solid version).

## Magnet / hardware
- Magnet **⌀8×1.5 mm N52 ×10** (5 pairs/half), pockets drilled identical in plate+cover → auto-align.
- Rubber feet **⌀8** ×~16 (cover corners + base).
- Cover pockets are blind (no through-hole, no boss) — verified inner face flat.
