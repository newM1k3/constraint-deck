# Constraint Deck

Constraint Deck is a small idea generator for answering the question: **“What should I build today?”** Each draw combines three cards—a Theme, a Constraint, and a Twist—to create a project prompt that is specific enough to start but unusual enough to encourage experimentation.

The application runs entirely in the browser. Users can redraw one card, star a useful combination, attach a note, copy a prompt, revisit previous draws, and customize every deck. It is also configured as an installable Progressive Web App (PWA).

> **Project status:** The core drawing, deck management, history, note, star, clipboard, local persistence, and PWA flows are implemented. There is no backend, account system, cloud synchronization, or automated test suite.

## How it works

| Deck | Purpose | Example |
|---|---|---|
| Theme | Defines the audience, subject, or setting. | “for escape room owners” |
| Constraint | Adds a hard implementation or experience rule. | “must work fully offline” |
| Twist | Introduces an unexpected behavior or tone. | “gets funnier the more you use it” |

Press **Draw Cards** to choose one value from each deck. The drawing logic avoids immediately repeating the previous value from an individual deck when alternatives exist. Any card can then be redrawn independently.

Each complete draw is added to browser history. The latest draw can be starred, annotated, or copied, and older entries can be reopened from the history panel. **Manage Decks** allows entries to be added, edited, or deleted.

## Project organization

```text
.
├── src/
│   ├── components/
│   │   └── ManageDecks.tsx  # Deck-editing modal
│   ├── hooks/
│   │   └── useStore.ts      # Draw logic, deck CRUD, history, and persistence
│   ├── App.tsx              # Main card, actions, history, and settings UI
│   ├── main.tsx             # React entry point
│   ├── index.css            # Tailwind import and custom card animations
│   └── types.ts             # Shared types, starter decks, labels, and colors
├── public/                  # Static icons used by the PWA
├── vite.config.ts           # React, Tailwind, and PWA configuration
├── .oxlintrc.json           # Lint configuration
└── package.json             # Scripts and dependencies
```

`useStore.ts` is the application’s state layer. It seeds the three starter decks on first use, creates draws, updates the latest record, manages deck entries, and serializes the complete store to `localStorage`. `App.tsx` renders that state and coordinates the card animations and controls.

## Technology

| Area | Technology |
|---|---|
| Interface | React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Build tooling | Vite 8, npm |
| Linting | Oxlint |
| PWA support | `vite-plugin-pwa` and Workbox |
| Icons | Lucide React |
| Persistence | Browser `localStorage` |

## Requirements

Use a current Node.js release compatible with the checked-in toolchain; **Node.js 20 or newer is recommended**. No environment variables, API keys, database, or external service are required.

## Quick start

```bash
git clone https://github.com/newM1k3/constraint-deck.git
cd constraint-deck
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Available commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local Vite development server. |
| `npm run lint` | Run Oxlint across the source tree. |
| `npm run build` | Type-check the project and create a production build in `dist/`. |
| `npm run preview` | Serve the completed production build locally. |

## Local data and resets

All mutable data is stored under the browser key:

```text
constraint-deck-v1
```

This includes customized decks, draw history, notes, and starred state. Data is tied to the current browser profile and origin; it is not synchronized to other devices or browsers.

The **Clear** control removes draw history but keeps customized deck entries. To return completely to the checked-in starter decks, remove the `constraint-deck-v1` value through the browser’s developer tools and reload the application. Clearing site data has the same effect.

Changes to `STARTER_DECKS` in `src/types.ts` affect new storage only. Existing users continue to load their saved browser copy until it is reset or migrated.

## PWA and offline behavior

`vite.config.ts` configures an installable manifest and Workbox asset caching. After a successful production visit and service-worker installation, supported browsers can install the app and reuse cached static assets offline.

Development mode does not exactly reproduce production service-worker behavior. Validate installation, updates, and offline loading against a production build served over `localhost` or HTTPS.

## Production build and deployment

```bash
npm ci
npm run lint
npm run build
npm run preview
```

The deployable static site is written to `dist/`. It can be hosted on a static provider such as Netlify, Cloudflare Pages, GitHub Pages, or another service that can serve a Vite single-page application.

If the deployment uses a subpath rather than a domain root, review Vite’s `base` setting and the generated service-worker asset paths. Use HTTPS in production so browsers can register the service worker.

## Validation

The current repository has no automated unit or component tests. Before committing a change, run:

```bash
npm ci
npm run lint
npm run build
npm audit
```

Manual validation should cover full draws, single-card redraws, starring, notes, clipboard behavior, history loading and clearing, deck add/edit/delete operations, page reload persistence, and PWA installation.

## Known limitations and review priorities

| Priority | Improvement |
|---|---|
| High | Add unit tests for non-repeating draws, history mutations, deck CRUD, malformed storage, and empty-deck behavior. |
| High | Improve the custom modal’s keyboard focus management, Escape handling, dialog semantics, and accessible labels. |
| Medium | Handle `localStorage` write failures and quota exhaustion instead of allowing persistence errors to reach the React effect. |
| Medium | Add an explicit export/import or reset workflow before changing the persisted schema. |
| Medium | Split the large `App.tsx` into focused card, action, and history components. |
| Low | Lazy-load the deck-management interface and add continuous integration for lint, build, audit, and future tests. |

## Extending the decks

Edit `STARTER_DECKS` in `src/types.ts` to change first-run content. Deck labels and visual mappings are defined in the same file. Adding a fourth deck requires updates to the shared types, starter data, draw logic, state shape, and card grid; it is more than a content-only change.

## License

No license file is currently included. Until the owner selects a license, normal copyright restrictions apply.
