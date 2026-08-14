
# SRUN / Systems in Motion

A type-driven, evidence-first portfolio for Srun Sochettra. The implementation uses Next.js App Router, strict TypeScript, semantic HTML, a 14-column editorial grid, and minimal client JavaScript.

## What changed

- Replaced the previous generic portfolio composition with an executable-editorial visual system.
- Added a polished variable-font SRUN identity mark.
- Added sticky translucent navigation, visible focus treatment, a skip link, and a keyboard-trapped mobile menu with Escape support.
- Promoted EggScan into a flagship system trace and moved every other verified project into an accessible project ledger.
- Preserved verified project facts and direct source/live links without inventing screenshots or outcomes.
- Rebuilt case studies around overview, problem, capabilities, engineering decisions, credits, and next-project navigation.
- Added responsive 14 → 8 → 4 column behavior, reduced-motion handling, forced-colors support, 404/error recovery, SEO metadata, sitemap, robots, and Open Graph output.
- Kept GitHub Pages static export support behind `BUILD_TARGET=gh-pages`.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint
npm run typecheck
npm run build
```

For the GitHub Pages build in PowerShell:

```powershell
$env:BUILD_TARGET="gh-pages"; npm run build; Remove-Item Env:\BUILD_TARGET
```

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin when deploying.
