# Lingabhairavi Devi — Name Recognition Game

An immersive, spiritually aesthetic web game where devotees test their knowledge of the 33 names and forms of Lingabhairavi Devi, as presented by Sadhguru.

## What It Does

Players are shown images of Devi's 33 manifestations one at a time and must identify the correct name from a parchment-scroll dropdown within 11 seconds. Scores accumulate across all 33 rounds (max 363 points), and results are saved to a local leaderboard.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React 19 + TanStack Router v1) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS variables |
| Fonts | Cinzel Decorative, Cinzel, Cormorant Garamond (Google Fonts) |
| Persistence | `localStorage` (leaderboard) |
| Deployment | Netlify |

## Running Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Adding Game Images

Place 33 `.jpg` files in `public/images/`. Each filename (without extension) must exactly match one of the 33 names defined in `src/components/DeviGame.tsx` → `DEVI_NAMES`.

```
public/images/nageshwari.jpg
public/images/bhairavi.jpg
...
```

The landing page hero image is `public/images/nageshwari.jpg`. Missing images show a decorative `🕉` placeholder — the game is fully playable without them for development.

## Customizing the Name List

Edit the `DEVI_NAMES` array in `src/components/DeviGame.tsx` to match your actual image filenames. Names are displayed in Title Case automatically.

## Production Build

```bash
npm run build
```

Output is in `dist/client/`. Deploy via Netlify drag-and-drop or connect the repo.
