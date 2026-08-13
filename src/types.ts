export interface Decks {
  themes: string[]
  constraints: string[]
  twists: string[]
}

export interface Draw {
  id: string
  date: string
  theme: string
  constraint: string
  twist: string
  note: string
  starred: boolean
}

export interface AppStore {
  decks: Decks
  draws: Draw[]
}

export type DeckKey = keyof Decks

export const DECK_LABELS: Record<DeckKey, string> = {
  themes: 'Theme',
  constraints: 'Constraint',
  twists: 'Twist',
}

export const DECK_COLORS: Record<DeckKey, string> = {
  themes: 'violet',
  constraints: 'amber',
  twists: 'rose',
}

export const STARTER_DECKS: Decks = {
  themes: [
    'for escape room owners',
    'for solo travelers',
    'nostalgia for a decade you didn\'t live through',
    'civic / local pride',
    'for someone avoiding their inbox',
    'a tool that only works once a day',
  ],
  constraints: [
    'no backend, ever',
    'must work fully offline',
    'single input field only',
    'black and white only, no color',
    'no scrolling — one screen',
    'must be usable one-handed',
  ],
  twists: [
    'for someone who says they hate apps',
    'gets funnier the more you use it',
    'turns into a game after 3 uses',
    'designed for a waiting room',
    'the opposite of productive',
    'works better at 2am',
  ],
}
