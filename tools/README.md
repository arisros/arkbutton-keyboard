# Dev-cycle toolkit

One fast loop for iterating the keyboard + tent stand:
**develop → `cycle` → review → improve → repeat.**

## The loop
```bash
node tools/cycle.mjs <target>     # build(target) → validate → capture → summary
```
1. **develop** — edit a param (`Cosmos-Keyboards/src/model_gen/userconfig.ts`,
   `…/mesh-split.mjs`, or `dactyl-manuform-keyboard/cosmos/tent_stand.scad`).
2. **cycle** — regenerates only what the change needs, checks geometry, renders views.
3. **review** — read `tools/validate-report.json` (regressions auto-caught) +
   `tools/captures/*.png` + the live viewer at http://localhost:8011/viewer.html.
4. **improve** — adjust, run cycle again.

`target` ∈ `block | case | holder | plate | stand | labels | fullcase | all`
(what to rebuild). Default `all`.

## Tools (each runnable alone)
| tool | what |
|---|---|
| `node tools/build.mjs <target…>` | regenerate STLs per the dependency graph (bun gen-*.ts, node mesh-split.mjs, OpenSCAD stand export) |
| `node tools/validate.mjs` | watertight + non-empty + bbox-range checks vs `spec.json`; writes `validate-report.json`, non-zero exit on FAIL |
| `node tools/capture.mjs [set…]` | headless three.js multi-view PNGs → `captures/<set>-<view>.png` (reliable cameras; sets: assembly case stand io thumb) |
| `tools/stl.mjs` | shared lib: `bbox()`, `loadManifold()`, `metrics()` (binary + ASCII STL) |
| `tools/spec.json` | per-part assertions (edit to tighten as the design settles) |

## What each change needs rebuilt
- `userconfig.ts` (case/thumb) → `cycle case` (then `plate`+`stand` if footprint moved)
- `mesh-split.mjs` (I/O window/holes) → `cycle block`
- `tent_stand.scad` (hinge/leg/lock) → `cycle stand`

## Notes
- Capture renders the **exported STLs** through three.js (Z-up, explicit cameras) —
  this is the reliable replacement for OpenSCAD CLI `--camera`.
- OpenSCAD exports **ASCII** STL; the rest are binary — `stl.mjs` handles both.
- Keep `viewer.html`'s duplicated stand constants (HINGE_X, PIVOT_X, LEG_LEN,
  TB, TC, SLOT_XS, prop dims) in sync with `tent_stand.scad` by hand.
