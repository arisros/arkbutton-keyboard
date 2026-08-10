# ArkButton — split keyboard build

Working files for a **handwired wireless split keyboard**: Bastard Keyboards
*Scylla* / *Charybdis* geometry, 24 finger keys + 5 thumb keys per hand
(**58 keys**, the innermost thumb position stays unpopulated), 2× HwThinker Pro
Micro nRF52840 (nice!nano v2 compatible) running ZMK, printed on an Elegoo
Neptune 4 Pro, on an articulated tenting stand.

Everything here is **source and notes**. The STL / GCODE / PNG / UF2 output is
deliberately not committed — it is regenerated (see below).

## Layout

| Path | What |
|---|---|
| `PRINT-QUEUE.md` | what to print, in what order, which slicer profile — includes the verified handedness correction (upstream file names are mirrored) |
| `SHOPPING-LIST.md` / `.csv` | parts, decisions (solder-direct, no hotswap) and what's already bought |
| `preview-*.html` | three.js viewers: `preview.html` (Charybdis 6-thumb + tenting), `preview-tenting.html` (stand + articulated arm), `preview-full-assembly-magnet.html`, `preview-wiring.html` (wiring sheet), `preview-keymap.html` (keymap) |
| `tools/` | the dev-cycle toolkit — build → validate → capture. See `tools/README.md` |
| `tools/tent/` | OpenSCAD sources for the tenting plate / cover / hinge / magnet mount, plus `PRINT-FINDINGS.md` (why the plate must print vertically) |
| `cosmos/` | OpenSCAD sources + viewers for the earlier Cosmos/Dactyl case and its I/O block |
| `firmware/` | `flash` (drop a .uf2 on a nice!nano) and `kbstatus` (Bluetooth state on macOS) |
| `upstream-mods/` | our own sources that live *inside* the gitignored upstream clones — see `upstream-mods/README.md` |

## Setup

The upstream repos are not vendored here (each has its own remote), but the tools
and viewers reference them by path. Restore them with:

```bash
tools/fetch-upstream.sh      # clones Charybdis, Scylla, Cosmos-Keyboards,
                             # dactyl-manuform-keyboard, STL-to-OpenSCAD-Converter
                             # at their pinned commits, then copies upstream-mods/ in
```

Then the normal loop (details in `tools/README.md`):

```bash
node tools/cycle.mjs <target>    # build → validate → capture → summary
node tools/capture.mjs <set…>    # headless multi-view PNGs into tools/captures/
```

If you edit anything *inside* a clone, run `tools/save-mods.sh` before committing —
otherwise the change only exists on this machine.

## Firmware

The ZMK config lives in its own repo: **https://github.com/arisros/charybdis-wireless-zmk**.
Its GitHub Actions build produces the `.uf2` files; download the `firmware` artifact,
unzip into `firmware/`, then:

```bash
firmware/flash left | right | reset
firmware/kbstatus
```

## Not in git

`*.stl` `*.3mf` `*.gcode` `*.uf2`, `out/`, `tools/captures/`, render PNGs, the
upstream clones, and `node_modules/`. All of it is regenerated from what *is* here.
