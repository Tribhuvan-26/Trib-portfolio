# Trib Portfolio — Editorial Brutalist Edition

Personal portfolio site for **Tribhuvan** (AI/ML Engineer & Full-Stack Developer).
Single-page Next.js app styled as a neo-brutalist "engineering dossier": risograph
paper, cobalt + marker-yellow accents, hard offset shadows, light/dark theming,
smooth scroll, a ⌘K command palette, a live GitHub contribution graph and a live
Spotify now-playing card.

> This README is the project map — read it first to understand what lives where.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js **16** (App Router) + React **19** + TypeScript |
| Bundler | Turbopack (Next 16 default) |
| Styling | Tailwind **4** (CSS-first `@theme inline` in `globals.css`), theme switched via a `.dark` class on `<html>` |
| Motion | `framer-motion`, `lenis` (smooth scroll) |
| Fonts | Bricolage Grotesque (display), Inter (sans), JetBrains Mono (mono) — `next/font/google` |
| Icons | `lucide-react`, `react-icons` |
| GitHub feed | `react-activity-calendar` + GitHub GraphQL API (server route) |
| Spotify feed | Spotify Web API refresh-token flow (server route) |
| Deploy | Vercel |

> ⚠️ **Next.js 16 caveat:** per `AGENTS.md`, this Next version may differ from
> training-data conventions. Check `node_modules/next/dist/docs/` before writing
> Next-specific code.

---

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

### Environment (`.env.local`, gitignored)

| Var | Required | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | for the contribution graph | GitHub PAT (read-only) used by `/api/contributions`. Without it the route 500s and Signals shows a feed error. |
| `SPOTIFY_CLIENT_ID` | for now-playing | Spotify app client id. |
| `SPOTIFY_CLIENT_SECRET` | for now-playing | Spotify app client secret. |
| `SPOTIFY_REFRESH_TOKEN` | for now-playing | Long-lived refresh token with the `user-read-currently-playing` + `user-read-playback-state` + `user-read-recently-played` scopes. |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical site URL for metadata / OG / sitemap / robots. Defaults to `https://trib-portfolio.vercel.app`. |

Missing all three Spotify vars is handled gracefully — the route returns
`{ error: "not_configured" }` and the `NowPlaying` card renders nothing.

There is **no contact-form backend** — Contact is social links + a `mailto:`.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # root layout: metadata, fonts, JSON-LD,
│   │                           #   pre-paint theme script, ThemeProvider
│   ├── page.tsx                # page composition (section order lives here)
│   ├── globals.css             # Tailwind 4 @theme tokens, light/dark vars,
│   │                           #   .brut / .mark / marquee / eq-bar / spotlight
│   ├── opengraph-image.tsx     # generated OG image
│   ├── robots.ts / sitemap.ts  # SEO routes
│   └── api/
│       ├── contributions/route.ts   # GitHub GraphQL → {total, data[], year}
│       └── spotify/route.ts         # Spotify player → current/last track
│
├── components/                 # all UI (see table below)
│
├── lib/
│   ├── theme.tsx               # ThemeProvider + useTheme + themeInitScript
│   └── useMod.ts               # "⌘" on Apple, "Ctrl" elsewhere
│
└── config/                     # editable data (no DB)
    ├── social.ts               # name, role, bio, location, email, handles
    └── projects.ts             # project cards (Project[])

public/
├── resume.pdf                  # served by the Résumé download buttons
└── covers/                     # cover art shuffled behind the now-playing card
```

### Components

| Component | Role |
|---|---|
| `Nav` | fixed top bar: links, résumé download, ⌘K button, theme toggle, CTA, mobile sheet |
| `Hero` | headline + intro + CTAs + "index card" spec sheet |
| `Ticker` | infinite marquee band of keywords between hero and work |
| `Work` | project cards from `config/projects.ts` (dot-grid cover band, stack chips, links) |
| `About` | positioning copy + two columns + four stat tiles |
| `Stack` | tech grouped into 5 layers, chips resolved through `TechIcon` |
| `Signals` | GitHub contribution calendar (theme-aware cobalt ramp), polls `/api/contributions` every 5s, + `NowPlaying` |
| `NowPlaying` | Spotify card — polls `/api/spotify` every 2s, live playhead, shuffled cover art |
| `Contact` | big email card + social tiles |
| `Footer` | name, role, source link |
| `Command` | ⌘K / Ctrl+K palette — navigate, jump to a project, links, copy email, résumé, theme |
| `StatHUD` | floating bottom-left readout that swaps a stat per section (dismissible) |
| `Spotlight` | cursor-tracked cobalt light pool over the grid (CSS vars, no re-renders) |
| `SmoothScroll` | Lenis provider + smooth anchor-link scrolling |
| `Section` | shared numbered section-header wrapper (`§01`, label, title, kicker) |
| `TechIcon` | brand icon lookup with a `hasIcon` guard |

Page order (`page.tsx`): `SmoothScroll` · `Spotlight` · `Command` · `StatHUD` ·
`Nav` · **Hero → Ticker → Work → About → Stack → Signals → Contact** · `Footer`.

Section ids used by nav / command palette / StatHUD: `top`, `work`, `about`,
`stack`, `signals`, `contact` (plus each project's `id` for deep links).

---

## Theming

- Two themes: **light** (default, "risograph paper") and **dark** ("dark dossier"),
  driven by a `.dark` class on `<html>`.
- `themeInitScript` in `lib/theme.tsx` is inlined into `<head>` and runs before
  paint (localStorage → `prefers-color-scheme`) so there's no flash.
- `ThemeProvider` exposes `{ theme, toggle }` via `useTheme()`; `toggle` flips the
  class and persists to `localStorage`.
- Colors are CSS vars per theme in `globals.css`, exposed to Tailwind via
  `@theme inline`: `bg-paper`, `bg-paper-2`, `text-ink`, `text-muted`, `text-faint`,
  `text-accent` (cobalt), `bg-pop` (marker yellow), `text-pop-ink`.
- `--pop` and `--pop-ink` deliberately **do not** invert in dark mode — yellow stays
  yellow and its ink stays dark, so marker surfaces stay readable in both themes.
- **Rule of thumb:** use the tokens, not raw hex. Intentional exception: the
  `Signals` calendar palette, which needs its own light/dark hex arrays.

### Utility classes (`globals.css`)

| Class | Effect |
|---|---|
| `.brut` | 2.5px ink border + 6px hard offset shadow |
| `.brut-hover` | shifts the card into its shadow on hover |
| `.brut-accent` | cobalt shadow instead of ink |
| `.mark` | marker-pen highlight swipe behind text |
| `.animate-marquee` | ticker scroll |
| `.eq-bar` | now-playing equalizer bars |
| `.spotlight` | cursor light pool (fed `--mx` / `--my` by `Spotlight`) |

Reduced-motion is respected globally, plus explicit opt-outs in `Spotlight` and `.eq-bar`.

---

## Data routes

**`/api/contributions`** — `force-dynamic`, Node runtime. Queries the GitHub GraphQL
contributions calendar for `social.githubHandle` over the **whole current year**,
then trims the result to `date <= today`. Both halves matter: GitHub pads every day
past today with a zero (leave them in and the graph renders ~5 months of empty
cells), and `today` is computed in **+05:30**, not UTC, or same-day commits made
past local midnight fall off the end. Returns
`{ total, data: [{date, count, level}], year }` with `s-maxage=5` — no
`stale-while-revalidate`, which would hand back data older than the client poll.

`total` is GitHub's own calendar-year figure, so it will not match the "last year"
number on a GitHub profile page — that one is a rolling 12 months.

**`/api/spotify`** — `force-dynamic`, Node runtime. Refresh-token → access-token
exchange, cached in module scope until 60s before expiry. Reads
`/v1/me/player` (covers paused tracks too), falls back to recently-played when no
device is active, else returns `{ idle: true }`. Responses are `no-store`.

---

## Editing content

Swap real data in `src/config/` — no database:

- `social.ts` — identity, role, location, bio, email, social links, GitHub handle
- `projects.ts` — project cards (`Project[]`: id, year, title, summary, role, stack, links, metric)

Other content that lives inline in components: hero copy + `FACTS` (`Hero.tsx`),
about copy + `STATS` (`About.tsx`), `LAYERS` (`Stack.tsx`), ticker words
(`Ticker.tsx`), `STATS` (`StatHUD.tsx`).

---

## Known loose ends

- `package.json` depends on `react-github-calendar`, but `Signals.tsx` imports
  `react-activity-calendar` (its transitive dep). Works, but the direct dep should
  be declared.
- Unused and safe to delete: `three` / `@react-three/*` / `gsap` / `axios` deps,
  `src/config/trajectory.ts`, `src/components/Logo.tsx`,
  `src/components/DecryptedText.tsx`, `public/models/`, `scripts/fbx_to_glb.py`
  (leftovers from the previous Pacific Rim / 3D-Jaeger version of this site).
- `StatHUD`'s stack count (`27`) is hardcoded from `Stack.tsx`'s `LAYERS` — bump it
  if that list grows.
- `opengraph-image.tsx` still uses the old dark palette, not the dossier tokens.
- `Signals`' 5s poll keeps running on a hidden tab and while the section is
  off-screen. Gate it on `document.visibilityState` if the API budget gets tight.

---

## Conventions

- `AGENTS.md` / `CLAUDE.md` hold agent instructions (checked in). `CLAUDE.md`
  just imports `AGENTS.md`.
- Commit style: short scoped prefix, e.g. `feat(cmdk): …`, `fix(theme): …`.
