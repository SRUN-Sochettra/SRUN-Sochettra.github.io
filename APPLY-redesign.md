# SRUN — "Executable Editorial" redesign · apply guide

A type-driven overhaul built **on top of your existing `data/portfolio.ts`** — no
content, links, metrics, or project details were invented or changed. Every
value still comes from your source of truth. Type-checked clean (`tsc` exit 0).

## What's in this drop

| File | Action | Notes |
|---|---|---|
| `app/globals.css` | **replace** | New "Executable Editorial" system. Drops Tailwind import + old scroll-world CSS. |
| `app/layout.tsx` | **replace** | Swaps Instrument Serif → **Anybody** variable (wght + wdth axes). Theme color updated. |
| `app/page.tsx` | **replace** | Kinetic hero, 3 distinct featured spreads, interactive index, manifesto profile, carbon contact finale. |
| `app/projects/[slug]/page.tsx` | **replace** | Case-study **dossier** with sticky contents rail. |
| `components/kinetic-wordmark.tsx` | **add** | Client island: variable-width hero name + subtle pointer response. |
| `components/project-index.tsx` | **add** | Client island: catalogue with anchored preview (real `<Link>`s, works w/o JS). |
| `package.json` | **replace** | Removes `tailwindcss` + `@tailwindcss/postcss`. |
| `cleanup-redesign.sh` | **add** | Deletes scroll-world + `public/world` + `production` + `postcss.config.mjs`. |

Unchanged (keep yours): `data/portfolio.ts`, `app/not-found.tsx`, `app/error.tsx`
(both use the `.status`/`.eyebrow` classes that still exist), `robots.ts`,
`sitemap.ts`, `opengraph-image.tsx`, `next.config.ts`, `tsconfig.json`,
`eslint.config.mjs`, `.github/workflows/deploy.yml`.

## Steps

```bash
git switch -c redesign                    # restore point
# copy the files above into place, then:
sh cleanup-redesign.sh                     # remove dead identity + Tailwind
rm -f postcss.config.mjs                    # (cleanup script also does this)
npm install                                 # refresh lockfile without tailwind
npm run typecheck && npm run lint && npm run build
```

For the GitHub Pages export you already use:

```powershell
$env:BUILD_TARGET="gh-pages"; npm run build; Remove-Item Env:\BUILD_TARGET
```

## One thing to verify locally (font axis)

`layout.tsx` loads Anybody with the width axis:

```ts
const display = Anybody({ subsets:["latin"], style:["normal","italic"], axes:["wdth"], variable:"--font-display", display:"swap" });
```

Anybody exposes UltraCondensed→ExtraExpanded width, so `axes:["wdth"]` is valid.
If `next build` ever rejects the axis for your Next version, drop `axes:["wdth"]`
— the weight axis still animates and the design degrades gracefully (widths
just stop varying). Everything else is unaffected.

## The signature mechanism

`app/globals.css` registers `--wm-*` as `@property … <number>`, so the hero's
**weight + width axes animate** as CSS transitions. Line 1 (`SRUN`) settles from
condensed/light → expanded/heavy; line 2 (`Sochettra`) does the inverse. On
pointer-fine devices the top line's width tracks the cursor within a tiny 135–165
range. `prefers-reduced-motion` pins the final axes and disables pointer work.

## Guardrails honored

- No canvas / WebGL / video background / custom cursor / blocking loader / marquee.
- No invented metrics, screenshots, or claims — projects without a verified image
  render as intentional **typographic panels** (number + category), not placeholders.
- All rows are real links; index + nav work with JS disabled and via keyboard.
- Reduced-motion, focus-visible, skip link, `aria-current`-free but landmarked.
- One carbon inversion (contact) instead of a template-y dark profile block.

## Suggested QA before merge

Keyboard-only nav · 200% zoom · reduced motion · touch (no hover) · slow 3G ·
failed images · long project names · JS disabled · GH Pages subpath · Lighthouse.
