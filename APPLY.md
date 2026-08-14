# SRUN — Systems in Motion · Redesign drop-in

Technical-editorial / East–West typesetting redesign. Scrollworld fully removed.
All copy is drawn from your existing verified content — nothing invented.

---

## 1. What's in this bundle

```
data/portfolio.ts              # content model: featured flag, bio, principle, index split
app/layout.tsx                 # new fonts: Instrument Serif + Geist + IBM Plex Mono
app/globals.css                # full editorial system (paper/ink/vermilion, 12-col grid, vertical rails)
app/page.tsx                   # poster hero, 3 featured compositions, index, profile, contact
app/projects/[slug]/page.tsx   # editorial case study + prev/next nav
app/not-found.tsx              # rewritten (no "outside the world" copy)
app/error.tsx                  # rewritten (no journey copy)
```

Every `.tsx` was verified with the TypeScript compiler (`jsx: preserve`) so the
JSX bytes are intact — no chat-renderer corruption. `globals.css` braces are
balanced (195/195).

## 2. How to apply

1. Back up your current files (or just work on a branch).
2. Copy each file to the same path in your repo, overwriting the old one.
3. Fonts are all on Google Fonts and pulled via `next/font/google` — no install
   needed. `Geist` requires a recent Next 15 (you're already on it).
4. Run locally:

   ```bash
   npm run lint
   npm run typecheck
   npm run dev
   ```

5. GitHub Pages build (unchanged from your setup):

   ```powershell
   $env:BUILD_TARGET="gh-pages"; npm run build; Remove-Item Env:\BUILD_TARGET
   ```

`next.config.ts`, `package.json`, `tsconfig.json`, sitemap/robots, and the
GitHub Actions workflow do **not** need changes.

## 3. Adding real screenshots (recommended next step)

Featured cards render a hatched placeholder with the project number until a real
screenshot exists. To light them up, drop a WebP in `/public/projects/` and set
it in `data/portfolio.ts`:

```ts
evidence: {
  image: "/projects/eggscan.webp",
  imageAlt: "EggScan dashboard showing a scored GitHub profile with feedback cards.",
  // ...
}
```

The same `image` powers the case-study poster. No image = no broken block.

## 4. What changed conceptually

- **No scrollworld.** No canvas, no frame scrubbing, no intro gate.
- **Type is the signature.** Serif poster hero, vertical English metadata rails
  (`writing-mode: vertical-rl`), asymmetric 12-col grid.
- **Proof first.** 3 featured case studies (EggScan, HyperspaceOS, Research AI)
  with large media; everything else in a dense index.
- **Light/dark rhythm.** Rice-paper default, one ink profile section, vermilion
  accent (signal-lime dropped).
- **Merged sections.** About + Capabilities + Approach + Additional → one
  Profile block.
- **Removed the `resumePath: null` debug aside** from the public page.
- **Mobile:** real `:target` menu, vertical rails collapse to horizontal, no
  hover-dependent info, no horizontal scroll.
- **Motion:** scroll-reveals via `animation-timeline: view()`, fully disabled
  under `prefers-reduced-motion`.

## 5. Vertical text note

The vertical rails use **English** only (`DATABASE → INTERFACE`, stack, location).
No Japanese copy is inserted, because none is verified — fake language would
undercut the design. If you ever want real Japanese, add properly translated
strings and keep them secondary to the English.

## 6. Decommission scrollworld (do AFTER the redesign builds clean)

Run `cleanup-scrollworld.sh` from the repo root, or delete manually:

```
components/scroll-world.tsx
public/world/**                      (frames, stills, video — ~670 images)
production/**                        (prompts, scripts, manifest, brand-kit, qa)
```

Then confirm nothing imports them:

```bash
grep -rn "scroll-world\|ScrollWorld\|/world/\|scenes\b" app components data
```

Expect **zero** results. Then update `README.md` (the architecture section still
describes the 7-scene canvas journey) and re-run lint / typecheck / build.

> Verify → delete → re-build. Don't delete blind.
