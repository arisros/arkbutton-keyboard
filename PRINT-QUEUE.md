# Print Queue: Scylla wireless build (Neptune 4 Pro)

> Historical working note. The build was finished in July 2026 (see `docs/BUILD-LOG.md`); statuses below are as of the last edit during printing.

Final functional keyboard = **Scylla 5-thumb default** (no case mods) + handwired wireless.
Print **one part at a time** (toolkit §4). Slicer must emit `gcode_flavor=klipper`.
Slice via: `python3 ~/Documents/neptune4-print-toolkit/scripts/slice.py --stl <file> --orient 1 --process <profile>`
(slice.py injects fresh bed mesh + Z offset automatically).

All files watertight ✓. Bed 235×235×280, everything fits.

> ⚠️ **HANDEDNESS CORRECTION (2026-06-30): the file naming in the upstream repo is SWAPPED** (verified: render comparison against Charybdis `_right` + plate IoU). What is in the repo:
> - `scylla_v3_36.stl` & `supermini_cradle.stl` = **LEFT** → RIGHT hand = **mirror X**.
> - `..._plate_right.stl` = actually the **LEFT plate**; `..._plate_left.stl` = actually the **RIGHT plate**.
> The "File" column below is already corrected to the real hand. Mirrors are made via `tools/` (e.g. `tools/case_RIGHT_up.stl`).

| # | Part | Qty | Actual file (correct hand) | Size (mm) | Profile | Orientation & notes |
|---|---|---|---|---|---|---|
| **1** | SuperMini cradle (LEFT) | 1 | `Scylla/files/MK2/supermini_cradle.stl` (=LEFT) | 30×8×34 | **process_parts_safe** | ✅ PRINTED (first assumed to be "R", turned out LEFT). Keep for the left half |
| **2** | SuperMini cradle (RIGHT) | 1 | mirror X of #1 | 30×8×34 | process_parts_safe | Not printed yet |
| **3** | Bottom plate (LEFT) | 1 | `Scylla/files/MK2/scylla_v3_36_plate_right.stl` (file "right" = LEFT) | 155×159×2 | **process_draft** | Flat; thin, 2mm. Rotate Y-up→Z-up before slicing |
| **4** | Bottom plate (RIGHT) | 1 | `Scylla/files/MK2/scylla_v3_36_plate_left.stl` (file "left" = RIGHT) | 155×159×2 | process_draft | Flat |
| **5** | Case (LEFT) | 1 | `Scylla/files/MK2/scylla_v3_36.stl` (=LEFT) | 159×163×58 | **process_parts_safe** | Open-bottom DOWN, keys up, ~58mm. Support ON. Print ~23h. (partially printed once) |
| **6** | Case (RIGHT) | 1 | mirror X → `tools/case_RIGHT_up.stl` | 159×163×58 | process_parts_safe | ⏳ Was printing when this was written. gcode: `out/case_RIGHT_safe.gcode` |

## Profile notes
- **process_parts** = normal quality (for the case: switch hole precision & fit matter).
- **process_parts_safe** = safe profile for small parts / overhangs (cradle).
- **process_draft** = fast, for the flat plates.
- **process_brim** / `--brim`: turn on a brim for thin / small parts (#1 to #4).
- filament_fast + machine_train = filament & machine profile (used by default by slice.py).

## Suggested order
1 (cradle, test) → 3,4 (plates, fast) → 5,6 (cases, long). Cradle first so the profile & first layer are verified before committing to a case print that takes many hours.

## Tenting stand: ✅ VERIFIED READY (2026-07-05), integrated cover, base stand, no wrist pad
**Integrated cover** (seal plate + hinge as ONE part), replaces the plain plates #3/#4. Verified:
- **Alignment to the case: outline IoU 0.9989** vs the official plate; flush all round in the overlay render (`tools/captures/tentfit-*.png`); protrusion only 0.2% = the hinge knuckles (functional).
- **Watertight** ✓ L+R (genus 14, vol 65.3cm³); 7 countersunk M4 screw holes in the official pattern; knuckle spacing 70.0mm; M4 bore horizontal when printed vertically.
- History: the old `final_cover_dl` was left in the **deployed pose (rotY −30°)** & turned out to be the RIGHT hand → un-posed (rotY −30.05, rotX −0.15), registered, unioned via manifold-3d (the OpenSCAD backend rejects the mesh), mirrored → LEFT.
- **SMOOTH pass (5 Jul):** the underside used to have a *ledge* (the repo's smaller intbottom plate hung 2mm below the seal) → laminated into a **uniform 4mm slab across the whole seal outline** (a copy of the seal shifted −1.6, inset 0.05mm so the boolean is clean) → the bottom face is ONE flat plane, the hinge gussets blend in smoothly. Genus −7 = the 7 old countersink voids got buried (harmless; the screw heads sit in the new countersinks on the bottom face). ⚠️ The plate is now ~3.7mm: use **M4 10mm bolts** into the case (8mm is a bit short).

Profile **`proc_tent`** (process_parts base: infill **25%**, brim 5mm, **support OFF**: the knuckle gussets are self-supporting, matching the repo photos). Fresh gcode in `out/` (5 Jul):

| Part | Qty | Est | gcode | Source STL | Orientation |
|---|---|---|---|---|---|
| Tent-cover LEFT | 1 | ~9h 26m | `out/tent_cover_LEFT.gcode` | `tools/tent/cover_tent_LEFT_vert.stl` | **vertical** (already baked into the STL; slice `--orient 0`) |
| Tent-cover RIGHT | 1 | ~9h 28m | `out/tent_cover_RIGHT.gcode` | `tools/tent/cover_tent_RIGHT_vert.stl` | vertical |
| Base bottom LEFT | 1 | ~2h 56m | `out/tent_bottom_LEFT.gcode` | `tools/tent/bottom.stl` | flat (auto) |
| Base bottom RIGHT | 1 | ~2h 57m | `out/tent_bottom_RIGHT.gcode` | `tools/tent/bottom_R.stl` | flat |
| Tenting arm | **2** | ~1h 47m /pc | `out/tent_arm.gcode` (print 2×) | `tools/tent/tenting-arm.stl` | flat (auto) |

Total ~30 hours. Flat-pose STLs (case frame, for preview/CAD): `tools/tent/cover_tent_LEFT.stl` / `_RIGHT.stl`; display assembly: `tools/assembled_LEFT.stl` / `_RIGHT.stl`. Hardware: 8× M4 bolts ≥14mm + 8× M4 nuts.

## Not queued yet (on purpose, later)
- Battery holder, cradle mount to the case: postponed until the keyboard is functional.
- Gel wrist pad: optional, parts in `tools/tent/wrist-pad-variant-parts/` (+12 M4, +2 gel pads).
- ~~6-thumb~~: aborted, using the 5-thumb default.
