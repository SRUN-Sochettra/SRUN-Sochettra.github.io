#!/bin/sh
# ---------------------------------------------------------------------------
# cleanup-redesign.sh
# Removes the abandoned scroll-world identity and its heavy assets, plus the
# now-unused Tailwind toolchain. Run from the repo root AFTER the redesign
# builds clean, and AFTER you've committed a restore point (git branch).
#
#   git switch -c redesign            # restore point
#   sh cleanup-redesign.sh
#   npm run typecheck && npm run lint && npm run build
# ---------------------------------------------------------------------------
set -eu

say() { printf '  - %s\n' "$1"; }

echo "Removing dead scroll-world code + assets…"
rm -f  components/scroll-world.tsx        && say "components/scroll-world.tsx"
rm -f  cleanup-scrollworld.sh             && say "cleanup-scrollworld.sh (old script)"
rm -rf public/world                       && say "public/world/** (frames, stills — ~670 files)"
rm -rf production                         && say "production/** (raw video pipeline + prompts)"

echo "Removing unused Tailwind toolchain…"
rm -f  postcss.config.mjs                 && say "postcss.config.mjs"

echo
echo "Done. Verify nothing references the removed paths:"
echo "  grep -rn \"scroll-world\\|/world/\\|tailwind\\|@tailwindcss\" app components data || echo 'clean'"
echo
echo "Then run: npm run typecheck && npm run lint && npm run build"
