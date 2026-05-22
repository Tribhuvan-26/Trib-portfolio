# Trib Portfolio — Pacific Rim Mecha Edition

Interactive personal portfolio for **Tribhuvan** (AI/ML Engineer & Full-Stack Dev). Cockpit-themed Next.js 16 + R3F site.

![status](https://img.shields.io/badge/STATUS-ONLINE-00d4ff?style=flat-square)
![stack](https://img.shields.io/badge/STACK-Next.js%2016%20·%20R3F%20·%20GSAP%20·%20Tailwind%204-39ff14?style=flat-square)

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind 4 + CSS-first theme |
| 3D | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Motion | Framer Motion + Lenis smooth scroll + scroll-driven R3F |
| Icons | lucide-react (+ inline SVG for brands) |
| Contact | Formspree |
| Deploy | Vercel |

## Sections

1. **BootScreen** — cockpit boot sequence loading screen
2. **Hero** — interactive procedural Jaeger (drag-rotate, scroll-driven arm raise, click-to-tooltip body parts). Mobile: SVG silhouette fallback.
3. **PowerLevels** — animated skill bars across 5 categories
4. **DeployedUnits** — project cards w/ tilt + dossier modal + status filters
5. **KaijuTimeline** — engagement log w/ threat-level bars + XP
6. **NeuralFeeds** — GitHub stats, Spotify, Pinterest (hardcoded fallbacks)
7. **ContactForm** — Formspree-ready transmission form
8. **Footer** — social links + Sketchfab attribution

## Develop

```bash
npm install
npm run dev          # localhost:3000
npm run build        # production bundle
```

## Configure

Create `.env.local` (gitignored):

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_FORMSPREE_ID=xxxxxxxx
```

Edit `src/config/` to swap placeholder data:

- `social.ts` — name, email, social handles
- `skills.ts` — skill categories and proficiency
- `projects.ts` — your real projects
- `timeline.ts` — career engagements

## Real Jaeger model (Phase 2)

The Hero uses a procedural box-mecha for now. To swap in the Sketchfab Gipsy Danger:

1. Download from [Sketchfab — Gipsy Danger Animated](https://sketchfab.com/3d-models/gipsy-danger-animated-10341a9567c84f448e5b87ecefc7ad8b) (Free Standard, attribute author ReyhanGTZ).
2. Place glTF in `public/models/jaeger.glb`.
3. Optionally compress with Draco: `npx gltf-pipeline -i jaeger.glb -o jaeger.glb -d`.
4. Replace `ProceduralJaeger` w/ a `useGLTF` + `useAnimations` component in `src/components/jaeger/`.

## Deploy

```bash
# Push to GitHub, then Vercel auto-detects Next.js.
# Set env vars in Vercel dashboard:
#   NEXT_PUBLIC_SITE_URL
#   NEXT_PUBLIC_FORMSPREE_ID
```

## Credits

- Jaeger silhouette inspiration: Sketchfab models by ReyhanGTZ and oiopu (CC-BY).
- Aesthetic: Pacific Rim (Legendary Pictures, 2013).
