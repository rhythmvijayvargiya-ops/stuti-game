# AGENTS.md

## Project Overview

Lingabhairavi Devi Name Recognition Game — an immersive, temple-aesthetic quiz app built on TanStack Start, deployed on Netlify. Players identify the 33 forms of Lingabhairavi Devi from images within an 11-second timer.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS (no utility classes) |
| Fonts | Cinzel Decorative, Cinzel, Cormorant Garamond (Google Fonts CDN) |
| Persistence | `localStorage` (leaderboard) |
| Language | TypeScript 5.7 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
├── public/
│   ├── images/           # Game images: {name}.jpg — filename IS the answer key
│   │   └── README.txt    # Instructions for placing image files
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── DeviGame.tsx  # All game logic and UI (single file, multi-component)
│   ├── routes/
│   │   ├── __root.tsx    # Root shell: Google Fonts links, page title, HTML wrapper
│   │   └── index.tsx     # Entry route → renders <DeviGame />
│   ├── router.tsx        # TanStack Router setup
│   └── styles.css        # All custom CSS — CSS custom properties + .devi-* classes
├── netlify.toml          # Build: vite build → dist/client
├── package.json
├── tsconfig.json         # ES2022, strict, @/* alias for src/*
└── vite.config.ts        # TanStack Start + Netlify + Tailwind plugins
```

## Key Concepts

### Game Flow

Three screens managed by a `screen` state in `DeviGame` (root orchestrator):

1. **Landing** — player name input + hero image + leaderboard link
2. **Game** — 33 rounds, randomized order, 11-second SVG arc timer, parchment-scroll dropdown
3. **Results** — score, correct/missed collapsibles, leaderboard tab

### Image-Filename-as-Answer-Key

The `DEVI_NAMES` array in `DeviGame.tsx` is the source of truth. Images load from `/images/{name}.jpg`. A graceful `onError` handler shows a decorative `🕉` placeholder — the game is fully playable without images during development.

### Timer Implementation

SVG arc timer using `strokeDashoffset` interpolation. Color transitions gold → red as time runs out. `lockedRef` prevents double-advance on simultaneous timeout + user selection.

### Styling Approach

All styling uses CSS custom properties (`:root` in `styles.css`) with `.devi-*` class names. Tailwind is imported but **no utility classes are used** — pure custom CSS for cohesive temple aesthetic. Color palette: deep crimsons, warm golds, soft blacks, dusty rose.

### localStorage Leaderboard

Key: `devi_leaderboard`. Entry format: `{ name, score, correct, date }`. Top 20 shown, sorted by score descending. No backend required.

## Development Commands

```bash
npm run dev      # Start dev server (port 3000, Netlify CLI on 8888)
npm run build    # Production build → dist/client
```

## Conventions

- Components: PascalCase
- CSS classes: `.devi-*` prefix
- No CSS Modules — single global stylesheet
- TypeScript strict mode; import paths use `@/` alias

## Adding / Changing Names

Edit `DEVI_NAMES` in `src/components/DeviGame.tsx`. The dropdown, shuffle, scoring, and results all derive from this array. Add matching `.jpg` files to `public/images/`.
