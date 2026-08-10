# upstream-mods

Source files of *ours* that physically live inside the upstream clones
(`Charybdis/`, `Cosmos-Keyboards/`, `Scylla/`, `dactyl-manuform-keyboard/`).
Those clones are gitignored — they each have their own remote — so anything we
edit or add in there would otherwise exist on this machine only.

The tree here mirrors the path inside the clone exactly:

```
upstream-mods/Cosmos-Keyboards/src/model_gen/userconfig.ts
        ↕
              Cosmos-Keyboards/src/model_gen/userconfig.ts
```

Text sources only (`.scad` / `.ts` / `.mjs` / `.md`). The STLs they produce stay
out of git — regenerate them with `node tools/build.mjs`.

## Two directions

```bash
tools/fetch-upstream.sh   # clone the upstream repos + copy these files INTO them
tools/save-mods.sh        # copy them back OUT of the clones into this repo
```

Run `tools/save-mods.sh` before committing whenever you have been editing inside a
clone, otherwise the change stays untracked in ignored territory.

## What's here

| Path | What it is |
|---|---|
| `Cosmos-Keyboards/src/model_gen/userconfig.ts` | the Cosmos case definition — the source every `cosmos/*.stl` is generated from |
| `Cosmos-Keyboards/src/model_gen/mesh-split.mjs`, `gen-*.ts` | export/split helpers driven by `tools/build.mjs` |
| `Cosmos-Keyboards/src/lib/worker/{api.ts,pro-patch/rounded.ts}` | local patches to upstream worker code |
| `Charybdis/files/mods/trackball-plug-6key/` | trackball-hole plug + 6-thumb demo CAD |
| `Charybdis/files/mods/tenting-stand-with-wrist-pads/TENTING-COVER-FUSION-GUIDE.md` | notes on grafting the tenting cover |
| `Scylla/files/MK2/` | 6-thumb variant, SuperMini cradle and flat holder |
| `dactyl-manuform-keyboard/cosmos/` | tent stand / module / MCU housing OpenSCAD |
