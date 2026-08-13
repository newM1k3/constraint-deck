import { useState, useCallback, useEffect } from 'react'
import type { AppStore, Draw, Decks, DeckKey } from '../types'
import { STARTER_DECKS } from '../types'

const STORAGE_KEY = 'constraint-deck-v1'

function loadStore(): AppStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppStore
      if (parsed.decks && parsed.draws) return parsed
    }
  } catch { /* corrupted */ }
  return { decks: { ...STARTER_DECKS, themes: [...STARTER_DECKS.themes], constraints: [...STARTER_DECKS.constraints], twists: [...STARTER_DECKS.twists] }, draws: [] }
}

function saveStore(store: AppStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function useStore() {
  const [store, setStore] = useState<AppStore>(loadStore)

  useEffect(() => { saveStore(store) }, [store])

  // draw one random entry, avoiding repeat of last draw's value for that deck
  const drawOne = useCallback((deckKey: DeckKey, avoid?: string): string => {
    const deck = store.decks[deckKey]
    if (deck.length === 0) return '—'
    if (deck.length === 1) return deck[0]
    const candidates = avoid ? deck.filter(e => e !== avoid) : deck
    const pool = candidates.length > 0 ? candidates : deck
    return pool[Math.floor(Math.random() * pool.length)]
  }, [store.decks])

  const lastDraw = store.draws.length > 0 ? store.draws[store.draws.length - 1] : null

  const doDraw = useCallback((): Draw => {
    const draw: Draw = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      theme: drawOne('themes', lastDraw?.theme),
      constraint: drawOne('constraints', lastDraw?.constraint),
      twist: drawOne('twists', lastDraw?.twist),
      note: '',
      starred: false,
    }
    setStore(prev => ({ ...prev, draws: [...prev.draws, draw] }))
    return draw
  }, [drawOne, lastDraw])

  const updateLatestDraw = useCallback((patch: Partial<Draw>) => {
    setStore(prev => ({
      ...prev,
      draws: prev.draws.map((d, i) => i === prev.draws.length - 1 ? { ...d, ...patch } : d),
    }))
  }, [])

  const updateDraw = useCallback((id: string, patch: Partial<Draw>) => {
    setStore(prev => ({
      ...prev,
      draws: prev.draws.map(d => d.id === id ? { ...d, ...patch } : d),
    }))
  }, [])

  const clearHistory = useCallback(() => {
    setStore(prev => ({ ...prev, draws: [] }))
  }, [])

  // deck management
  const addDeckEntry = useCallback((deckKey: DeckKey, entry: string) => {
    setStore(prev => ({
      ...prev,
      decks: { ...prev.decks, [deckKey]: [...prev.decks[deckKey], entry] },
    }))
  }, [])

  const updateDeckEntry = useCallback((deckKey: DeckKey, index: number, value: string) => {
    setStore(prev => {
      const updated = [...prev.decks[deckKey]]
      updated[index] = value
      return { ...prev, decks: { ...prev.decks, [deckKey]: updated } }
    })
  }, [])

  const deleteDeckEntry = useCallback((deckKey: DeckKey, index: number) => {
    setStore(prev => ({
      ...prev,
      decks: { ...prev.decks, [deckKey]: prev.decks[deckKey].filter((_, i) => i !== index) },
    }))
  }, [])

  return {
    store,
    doDraw,
    drawOne,
    updateLatestDraw,
    updateDraw,
    clearHistory,
    addDeckEntry,
    updateDeckEntry,
    deleteDeckEntry,
  }
}
