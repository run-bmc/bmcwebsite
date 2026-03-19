# Personal Space Demo

Single-page personal website built with Next.js, React, TypeScript, Tailwind CSS, and an HTML5 canvas game loop.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit name and links

Update [`src/config/site.ts`](/Users/blakemcdowall/Documents/New project/src/config/site.ts).

## Architecture

- `src/app/page.tsx`: one-page entry point
- `src/components/TopNav.tsx`: persistent external-only nav
- `src/components/GameShell.tsx`: canvas host and React bridge
- `src/components/Overlay.tsx`: idle, game over, and mobile preview messaging
- `src/components/ScoreDisplay.tsx`: in-game score chip
- `src/game/state.ts`: world model and game states
- `src/game/loop.ts`: requestAnimationFrame update step
- `src/game/render.ts`: canvas drawing
- `src/game/input.ts`: keyboard input handling
- `src/game/spawn.ts`: target spawn timing and difficulty ramp
- `src/game/collision.ts`: simple AABB collision checks
- `src/game/entities/*`: player, bullet, and target shapes

## Notes

- Desktop supports `Left`, `Right`, and `Space`.
- Mobile keeps the same visual shell and animated scene, but stays in preview mode by design.
- The temporary scaffold folder `codex-space-site/` can be removed if you do not want to keep it.
