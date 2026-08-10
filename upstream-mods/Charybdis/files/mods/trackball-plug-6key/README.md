# trackball-plug-6key

Drop-in plug for the Charybdis 4x6 that **fills the 34 mm trackball cavity and mounts the
6th thumb switch** (MX Gateron hotswap), turning the stock 5-key thumb into a 6-key thumb
without touching the main case STL.

## Files
- `plug.scad` — parametric source (right hand). Tune via the params block at the top.
- `plug_right.stl` / `plug_left.stl` — exported, validated (watertight, bbox 45.6×45.5×21 mm).
- `plug_left.scad` — X-mirror wrapper of the right STL (fixes hotswap/LED orientation for the left half).

## How it fits (grounded in the stock parts)
- Body Ø **41.7 mm** drops into the case's **42 mm** trackball bore; flange Ø **45.6 mm** rests on the rim
  (mimics `../../4x6/adapter_v4_v4_top.stl`). Depth into bore ~18 mm; cavity is ~20 mm deep.
- The switch plate is **recessed 4 mm** and **counter-rotated ~14°** so the cap lands at **~15° tilt**
  (the cavity opening itself is 29° from horizontal). The flange notch marks the **user/thumb side**.

## ⚠️ First-print checklist (this is the one thing to verify)
1. Print **one** `plug_right.stl`, dry-fit into your printed `charybdis_v4_247_right.stl`.
2. Check: body seats in the bore, flange sits flush, an MX switch + keycap clears the wall.
3. **Feel the ~15° thumb angle.** If it leans the wrong way / too steep, flip the sign of `tilt_corr`
   in `plug.scad` (or adjust the value) and re-export — only the small plug reprints, not the case.
4. The MX **hotswap socket pocket** (pin holes + slide-in mouth) is parametric and may need a tweak
   (`hs_depth`, `hs_w`, `pin_d`) for a snug Gateron socket — adjust after the fit is confirmed.

## Re-export after editing params
```
/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD -o plug_right.stl plug.scad
/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD -o plug_left.stl  plug_left.scad
```
Validate: `node -e` with `metrics()` from `../../../../tools/stl.mjs` (watertight + bbox check).
