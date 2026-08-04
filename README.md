# Trib Portfolio — Pacific Rim / Jaeger Edition

Personal portfolio site for **Tribhuvan** (AI/ML Engineer & Full-Stack Developer).
Single-page, cockpit/"Shatterdome"-themed Next.js app with an interactive 3D
Jaeger (Gipsy Danger), light/dark theming, smooth scroll, and a live GitHub
contribution feed. Wanted a neo brutalism to make it feel a lil gud

> This README is the project map — read it first to understand what lives where.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js **16** (App Router) + React **19** + TypeScript |
| Bundler | Turbopack |
| Styling | Tailwind **4** (CSS-first `@theme` in `globals.css`), theme switched via `data-theme` attribute |
| 3D | `three` + `@react-three/fiber` + `@react-three/drei` |
| Motion | `framer-motion`, `lenis` (smooth scroll), `gsap` |
| Icons | `lucide-react`, `react-icons` |
| GitHub feed | `react-activity-calendar` + GitHub GraphQL API (server route) |
| HTTP | `axios` |
| Deploy | Vercel |

> ⚠️ **Next.js 16 caveat:** per `AGENTS.md`, this Next version may differ from
> training-data conventions. Check `node_modules/next/dist/docs/` before writing
> Next-specific code.

---

## Run

```bash
npm install
npm run dev      # http://localhost:3000 (Turbopack)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

### Environment (`.env.local`, gitignored)

| Var | Required | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | for the contribution graph | GitHub PAT (read-only) used by `/api/contributions` to query the GraphQL contributions calendar. Without it the Signals section shows a feed error. |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical site URL for metadata / OG / sitemap / robots. Defaults to the Vercel URL. |

There is **no contact-form backend** — the Contact section is social links + a `mailto:`.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # root layout: metadata, fonts, JSON-LD,
│   │                           #   pre-paint theme script (localStorage / prefers-color-scheme)
│   ├── page.tsx                # page composition (section order lives here)
│   ├── globals.css             # Tailwind 4 @theme tokens + light/dark CSS vars
│   ├── opengraph-image.tsx     # generated OG image
│   ├── robots.ts / sitemap.ts  # SEO routes
│   └── api/contributions/route.ts   # GitHub GraphQL → {total, data[]}, revalidate 1h
│
├── components/                 # all UI (see table below)
│
└── config/                     # editable data (no DB)
    ├── social.ts               # name, role, bio, email, social handles
    ├── projects.ts             # project cards (Project[])
    └── trajectory.ts           # "Kaiju" engagement log (KaijuEntry[], category I–V)

public/models/                  # 3D assets (see "3D model" below)
scripts/fbx_to_glb.py           # headless Blender FBX→GLB converter
```

### Components

| Component | Role |
|---|---|
| `Nav` | top nav / title bar + `ThemeToggle` |
| `Hero` | landing: tagline + rotating role headline (`ShiftingText`) + the 3D `Mecha` |
| `Mecha` | R3F canvas rendering **Gipsy Danger** GLB — auto-rotate, drag-orbit, cursor-follow tilt, boot overlay. Runtime material overrides force the reactor + **visor** to glow gold (see note). |
| `Trajectory` | "Kaiju timeline" — engagement log from `config/trajectory.ts` |
| `About` | channel-switcher bio (multiple "transmissions") |
| `Signals` | GitHub contribution calendar (theme-aware palette) from `/api/contributions` |
| `Contact` | social links + email (`mailto:`) |
| `Footer` | links + attribution |
| `HazardTicker` | scrolling hazard-stripe marquee strips between sections |
| `Section` | shared numbered section-header wrapper |
| `ShiftingText` / `DecryptedText` | animated text effects |
| `TechIcon` | brand/tech icon lookup (`hasIcon` guard) |
| `Cursor` | custom gold cursor |
| `SmoothScroll` | Lenis smooth-scroll provider |
| `Logo` | custom angular "winged V" mark |
| `ThemeToggle` | toggles `data-theme` + persists to localStorage |

Page order (`page.tsx`): `SmoothScroll` · `Cursor` · `Nav` · **Hero → Trajectory → ticker → About → ticker → Signals → ticker → Contact** · `Footer`.

---

## Theming

- Two themes: **dark** (default, "Shatterdome") and **light** ("concrete hangar"),
  driven by `data-theme` on `<html>`.
- A pre-paint inline script in `layout.tsx` sets the theme before first paint
  (localStorage → `prefers-color-scheme`) to avoid flash.
- All colors are CSS variables defined per-theme in `globals.css` and exposed to
  Tailwind via `@theme inline` (`bg-bg`, `text-fg`, `text-accent`, `border-line`, …).
- **Rule of thumb:** use the theme tokens, not raw hex, so both modes stay correct.
  Intentionally hard-coded exceptions: the 3D scene lights/materials in `Mecha.tsx`,
  the custom cursor glow, and the `Signals` calendar palette (its own light/dark arrays).

---

## 3D model (Gipsy Danger)

`public/models/`:

| File | Purpose |
|---|---|
| `GipsyDanger.glb` | **the asset the site loads** (`Mecha.tsx`) — rigged, animated, embedded textures |
| `GipsyDanger.blend` | Blender source (edit colors/materials here) |
| `GipsyDanger.fbx` | original FBX source |
| `UV Color Palette.png` | texture palette |

Pipeline: edit `.blend` in Blender → export GLB to `public/models/GipsyDanger.glb`
→ commit. `scripts/fbx_to_glb.py` regenerates the GLB from the FBX headlessly
(`blender --background --python scripts/fbx_to_glb.py`).

**Important — visor/reactor color is set in code, not the model.** `Mecha.tsx`
traverses the scene at load and overrides materials: the reactor ("spinning blade")
and the **visor** are forced gold so they read against any background/theme. The
visor uses a dedicated `VISOR` color (decoupled from the general `ACCENT`) so
changing the accent doesn't dull it. Recoloring the visor in Blender alone will
**not** change it on the site — update `Mecha.tsx`.

---

## Editing content

Swap real data in `src/config/` — no database:

- `social.ts` — identity, bio, social/email links
- `projects.ts` — project cards (`Project[]`)
- `trajectory.ts` — engagement timeline (`KaijuEntry[]`, Pacific Rim category 1–5)

---

## Conventions

- `AGENTS.md` / `CLAUDE.md` hold agent instructions (checked in). `CLAUDE.md`
  just imports `AGENTS.md`.
- Commit style: short scoped prefix, e.g. `mecha: …`, `signals: …`, `hero: …`.

## Credits

Gipsy Danger / Jaeger aesthetic inspired by *Pacific Rim* (Legendary Pictures, 2013).
