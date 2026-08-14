# SRUN / Systems Field Notes — prototype vertical slice

## Replace
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/project-index.tsx`

## Add
- `components/identity-mark.tsx`

## Delete
- `components/kinetic-wordmark.tsx`

No changes are required in `data/portfolio.ts`.

## Verification performed
- `npm run typecheck` — passed
- `npm run lint` — passed with one pre-existing warning in `app/projects/[slug]/page.tsx` for its existing raw `<img>`
- Static GitHub Pages build — passed with Next.js 16.2.10 using webpack and mocked font downloads because this execution environment received HTTP 403 from Google Fonts
- Static routes generated for `/`, `/projects/eggscan`, `/projects/hyperspace-os`, `/projects/research-ai`, the remaining project routes, and `404.html`

## Run locally
```powershell
npm run lint
npm run typecheck
$env:BUILD_TARGET="gh-pages"; npm run build; Remove-Item Env:\BUILD_TARGET
```

Then manually test keyboard-only navigation, touch, reduced motion, 200% zoom, JavaScript disabled, missing images, and slow images.
