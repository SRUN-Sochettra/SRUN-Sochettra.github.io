# Portfolio improvements applied

## Changed

- Replaced the duplicated anchor-based homepage menu with the accessible `SiteHeader` client component.
- Removed the closed mobile dialog from the keyboard/accessibility tree while preserving focus trapping, Escape-to-close, focus restoration, and body scroll locking while open.
- Added missing CSS for verified flagship screenshots rendered with `next/image` and `fill`.
- Fixed the empty fallback sentence in the flagship evidence panel.
- Refocused contact copy toward backend/full-stack internship recruiting.
- Rewrote the profile biography in a direct first-person voice.
- Added lint and type-check gates to the GitHub Pages deployment workflow.
- Removed stale redesign guides, patches, build caches, and the dead kinetic wordmark implementation.

## Intentionally not fabricated

Screenshots and a resume were not added because those assets were not present in the supplied repository. Add only real assets:

- Project screenshots under `public/projects/`, then set `evidence.image` and `evidence.imageAlt` in `data/portfolio.ts`.
- A current resume under `public/`, then add a link only after verifying the final path.

The strongest first screenshots are EggScan, HyperspaceOS, and Research AI.

## Required verification in the real repository

```powershell
npm install
npm run lint
npm run typecheck
$env:BUILD_TARGET="gh-pages"; npm run build; Remove-Item Env:\BUILD_TARGET
```

Then test the mobile menu, keyboard focus, 200% zoom, reduced motion, failed images, all external links, and the GitHub Pages URL.
