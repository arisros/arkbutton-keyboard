#!/usr/bin/env bash
# Opposite of fetch-upstream.sh: pull our own sources back OUT of the gitignored
# clones into upstream-mods/, so edits made inside a clone end up in git.
# Run it before committing whenever you have been working inside a clone.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

changed=0
missing=0

while IFS= read -r tracked; do
  src="${tracked#upstream-mods/}"          # path inside the clone
  [ "$src" = "README.md" ] && continue     # this dir's own readme
  if [ ! -f "$src" ]; then
    echo "! hilang di clone: $src"
    missing=$((missing + 1))
    continue
  fi
  if ! cmp -s "$src" "$tracked"; then
    cp "$src" "$tracked"
    echo "↑ updated $tracked"
    changed=$((changed + 1))
  fi
done < <(find upstream-mods -type f)

echo
echo "$changed file diperbarui, $missing hilang di clone."
[ "$changed" -gt 0 ] && echo "Review dengan: git diff upstream-mods/"
exit 0
