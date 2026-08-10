#!/usr/bin/env bash
# Clone the upstream keyboard repos this project builds on, then drop our own
# sources (upstream-mods/) into them. Safe to re-run: existing clones are left
# alone, only the mods are re-copied.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# dir <TAB> url <TAB> pinned commit (the revision this project was built against)
REPOS=(
  "Charybdis|https://github.com/Bastardkb/Charybdis.git|c8d19c50a257a2e246a09f3fe79d80ceb3371d17"
  "Scylla|https://github.com/Bastardkb/Scylla.git|0bc5333"
  "Cosmos-Keyboards|https://github.com/rianadon/Cosmos-Keyboards.git|ae44f71213b467bf014e5b7ce11bb26de3585191"
  "dactyl-manuform-keyboard|https://github.com/arisros/dactyl-manuform-keyboard.git|66e5801fe56bf99fcb24dea9728a05cc30390ce3"
  "STL-to-OpenSCAD-Converter|https://github.com/raviriley/STL-to-OpenSCAD-Converter.git|"
)

for entry in "${REPOS[@]}"; do
  IFS='|' read -r dir url pin <<< "$entry"
  if [ -d "$dir/.git" ]; then
    echo "✓ $dir sudah ada — skip clone"
  else
    echo "→ clone $dir"
    git clone "$url" "$dir"
    if [ -n "$pin" ]; then
      git -C "$dir" checkout --quiet "$pin"
      echo "  pinned at $pin"
    fi
  fi
done

echo
echo "→ copy upstream-mods/ ke dalam clone"
for dir in upstream-mods/*/; do
  name="$(basename "$dir")"
  [ -d "$name" ] || { echo "  ! $name belum di-clone, skip"; continue; }
  # -R with /. copies the contents, keeping the mirrored subpaths
  cp -R "$dir." "$name/"
  echo "  ✓ $name"
done

echo
echo "Selesai. Lanjut: node tools/cycle.mjs   (lihat tools/README.md)"
