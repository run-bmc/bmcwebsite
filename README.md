# bmc-website

Personal site for Blake McDowall: a canvas space-shooter on the home page and a **Garden Library** at `/garden` (Airtable-backed plants and sections).

Stack: Next.js, React, TypeScript, Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The garden needs Airtable env vars (see below) to load live data; without them you will see the configured error state.

## Environment (garden)

Create a `.env.local` with:

- `AIRTABLE_TOKEN` — personal access token with read access to the base
- `AIRTABLE_BASE_ID` — base ID for the garden data

## Edit name and links

Update [`src/config/site.ts`](src/config/site.ts).

## Architecture

**Home**

- `src/app/page.tsx` — entry; mounts the game
- `src/components/TopNav.tsx` — external links nav
- `src/components/GameShell.tsx` — canvas host
- `src/components/Overlay.tsx` — idle / game over / mobile messaging
- `src/components/ScoreDisplay.tsx` — score chip
- `src/game/*` — state, loop, render, input, spawn, collision, entities

**Garden**

- `src/app/garden/*` — library home, plants, sections, export
- `src/lib/garden/*` — Airtable fetch, types, slugs, normalization
- `src/components/garden/*` — UI shell, cards, filters, export

## Notes

- Desktop game: `Left`, `Right`, and `Space`.
- Mobile home: same shell and motion; preview mode by design (no full play controls).
