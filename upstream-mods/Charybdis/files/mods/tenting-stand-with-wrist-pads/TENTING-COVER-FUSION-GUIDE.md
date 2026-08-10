# Integrated Tenting Bottom-Cover — Fusion Build Guide

**Goal:** one bottom cover that (a) **seals our `scylla_v3_36` case** perfectly, (b) has the **tenting hinge + arm-attach** that mate the existing stand (`bottom.3mf` + `tenting-arm.3mf`), (c) sits **flat & seamless** when off the stand. Built in Fusion from the parametric source (raw-STL boolean can't do a clean bracket — hull gives a blob).

## Files
- **Parametric source:** `charybdis adjustable plate v3.f3d` (has the hinge + arm-attach + bracket already).
- **Our case bottom outline:** `Scylla/files/MK2/scylla_v3_36_plate_right.stl` (= the LEFT case bottom; mirror for right). This is the outline that seals our case.
- **Stand mates (don't modify):** `bottom.3mf` (base foot), `tenting-arm.3mf` (arm).

## Measured specs (all verified from the STLs this session)
> Reference frame = the shared **assembly frame** the 3mf files use (native, **Y = up**), where `bottom`+`plate`+`arm` are pre-assembled. Use these as the target positions on the cover.

| Feature | Position (assembly frame) | Notes |
|---|---|---|
| **Hinge pin** | **X=160.5, Y=5.0**, axis ∥ Z (spans Z≈−55…25) | cover hinges to base here; Ø~4.2mm (r≈2.1) |
| **Arm-attach boss** | **X=99.5, Y=40** (Y=43 on source), axis ∥ Z | arm top pivot bolts here; Ø~4.2mm |
| **Base notch rack (pin-lock)** | Y=7, X ∈ {70, 80, 90, 100} | 4 discrete tent angles |
| **Design tent angle** | **≈24–26°** (plate face normal 24° from vertical) | |
| **Arm length** | **35 mm** (foot↔top pivot) | foot in base notch, top on cover |
| Arm foot (design) | X=95, Y=4.5 | sits in a base notch |

Frame-independent relationships (safest to trust):
- **Hinge → arm-attach:** ~**70 mm** apart; arm-attach is **~61 mm inward** (toward case centre) and **~35 mm up** from the hinge pin.
- Pin-lock tent angles ≈ **17° / 21° / 25° / 29°** (X70/80/90/100 notches). Design ≈ 24°.

## Approach (recommended: edit the parametric source)
The source `charybdis adjustable plate v3.f3d` already generated the working `left-case-bottom-scylla` (correct hinge+arm+bracket) — it's just built on a **different Scylla outline**. So **swap the plate outline to ours, keep the hinge/arm/bracket features.**

1. Open `charybdis adjustable plate v3.f3d` in Fusion. Inspect the timeline — find the **plate body / base sketch** (the flat case-outline part) vs the **hinge knuckles**, **arm-attach boss**, and **bracket** features.
2. **Import our outline:** Insert → Mesh → `scylla_v3_36_plate_right.stl`. (Mirror if you're doing the right hand.) Convert/trace its perimeter into a sketch (Create Sketch on its plane, project the outline). This is the sealing outline.
3. **Replace the plate profile:** edit the plate base sketch so its outline = our traced outline (delete the old profile, use ours). Keep the plate thickness (~2–3 mm) and the **mounting-hole pattern that matches our case** (from `scylla_v3_36_plate_right.stl` — it already has them). Line the plate up so its holes match our case's bottom bosses.
4. **Keep the bracket + hinge + arm features** — they hang off the plate's hinge edge. Verify (or set) their positions to the specs above: hinge pin along the hinge edge, arm-attach ~61 mm inward / ~35 mm up. The bracket = gusset walls dropping from the plate edge down to the knuckle bar (spans the ~30 mm to base level).
5. If the hinge/arm don't auto-follow the new outline, reposition them: put the **knuckle bar on the plate's inner/back edge** so, when the cover is at 24° tent, the knuckles reach the base's hinge and the arm reaches a notch (arm length 35 mm).

## Alt approach (if the source is hard to parametrize)
Combine in Fusion instead of parametrizing:
1. Insert our plate STL (sealing outline) **and** `left-case-bottom-scylla.stl`.
2. From the remix, **keep only the hinge knuckles + arm-attach boss + bracket gussets** (delete its plate body).
3. Align the kept bracket to our plate's hinge edge (match the hinge-pin & arm-attach specs above).
4. **Combine (join)** our plate + the bracket into one solid. Add fillets at the bracket/plate join for strength.

## Flat-seamless requirement (user-approved)
So the cover sits **flat & closed** when used without the stand:
- Make the **hinge knuckles flush** with (or recessed into) the plate's bottom plane, OR
- Add a thin **flat skid** on the underside so the part rests flat (knuckles not proud).
- Goal: off the stand it looks like a normal sealed keyboard bottom.

## Verify before export
- [ ] Cover outline = our case bottom (seals `scylla_v3_36`, holes match).
- [ ] Hinge knuckles interleave with `bottom.3mf`'s knuckles on the same Ø4 pin.
- [ ] Arm-attach Ø4 reaches `tenting-arm.3mf` top; foot reaches base notches (arm 35 mm).
- [ ] At 0°/flat the underside sits flat (skid/flush hinge).
- [ ] Watertight (Fusion solid).

## After
- Export STL. **Print orientation:** cover flat / bracket per `assets/print-position.png` (hinge vertical for strength if needed).
- Hardware: **M4 bolts ≥14mm ×8 + M4 nuts ×8** (already in SHOPPING-LIST).
- Mirror for the other hand.
