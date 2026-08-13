# Constraint Deck

"What should you build today?" — a card-drawing tool for creative constraints. Draw three cards at once (a Theme, a Constraint, and a Twist) to spark an app/project idea, star the good draws, and build up a history of prompts to return to.

There was no real README before this — the repo had the unedited Vite starter template. This documents what's actually here.

## Quick Start

```bash
npm install
npm run dev
```

## How It Works

Three independent decks:

| Deck | Answers | Example entries |
|---|---|---|
| **Theme** | Who/what it's for | "for escape room owners," "civic / local pride," "for someone avoiding their inbox" |
| **Constraint** | A hard rule to build inside | "no backend, ever," "must work fully offline," "no scrolling — one screen" |
| **Twist** | An unexpected angle | "gets funnier the more you use it," "the opposite of productive," "works better at 2am" |

Press **Draw Cards** and one random entry from each deck flips face-up simultaneously — deliberately avoiding repeating the exact same value as the previous draw on each deck. Any single card can be redrawn on its own without touching the other two. Draws can be starred, annotated with a note, copied to clipboard, and are kept in a scrollable history you can reload from.

**Manage Decks** (the gear icon) lets you add, edit, or delete entries in any of the three decks — the starter set (6 entries per deck) is just a seed, not a fixed list.

## Project Structure

| File/Folder | Purpose |
|---|---|
| `src/types.ts` | `Decks`, `Draw`, `AppStore` types, plus the `STARTER_DECKS` seed content and per-deck color mapping |
| `src/hooks/usestore.ts` | All state logic — `doDraw`, `drawOne` (avoids immediate repeats), deck CRUD, localStorage persistence |
| `src/App.tsx` | The flip-card UI, draw button, star/note/copy actions, history panel |
| `src/components/managedecks.tsx` | The deck-editing modal |

All state lives in `localStorage` under `constraint-deck-v1` — no backend, no auth, single device.

## How to Modify

- **Change the starter deck content:** edit `STARTER_DECKS` in `src/types.ts` (only affects first run — after that, decks live in localStorage and are edited via Manage Decks in the UI).
- **Change deck colors:** edit `DECK_COLORS` in `src/types.ts` (used to generate the violet/amber/rose Tailwind classes throughout `App.tsx`).
- **Add a fourth deck:** extend the `Decks` interface and `DeckKey` type in `types.ts`, add matching entries to `STARTER_DECKS`, `DECK_LABELS`, `DECK_COLORS`, and add a card to the grid + color-mapping functions in `App.tsx`.

## Tech Stack

React 19 + TypeScript + Vite + Tailwind CSS v4, Lucide icons, PWA-installable.
