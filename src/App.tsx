import { useState, useCallback } from 'react'
import type { DeckKey, Draw } from './types'
import { useStore } from './hooks/useStore'
import { Shuffle, Star, ChevronDown, ChevronUp, History, Settings, Copy, Check, Trash2, RotateCcw } from 'lucide-react'
import ManageDecks from './components/ManageDecks'

export default function App() {
  const {
    store, doDraw, drawOne, updateLatestDraw,
    clearHistory, addDeckEntry, updateDeckEntry, deleteDeckEntry,
  } = useStore()

  const [currentDraw, setCurrentDraw] = useState<Draw | null>(store.draws.length > 0 ? store.draws[store.draws.length - 1] : null)
  const [flipped, setFlipped] = useState(currentDraw !== null)
  const [note, setNote] = useState(currentDraw?.note ?? '')
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDraw = useCallback(() => {
    const draw = doDraw()
    setCurrentDraw(draw)
    setNote('')
    // Reset flip state for animation
    setFlipped(false)
    // Trigger flip on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlipped(true))
    })
  }, [doDraw])

  const handleRedrawCard = useCallback((deckKey: DeckKey) => {
    if (!currentDraw) return
    const key = deckKey === 'themes' ? 'theme' : deckKey === 'constraints' ? 'constraint' : 'twist'
    const newVal = drawOne(deckKey, currentDraw[key])
    // Quick un-flip + re-flip for that card
    setFlipped(false)
    const updated = { ...currentDraw, [key]: newVal }
    setCurrentDraw(updated)
    updateLatestDraw({ [key]: newVal })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlipped(true))
    })
  }, [currentDraw, drawOne, updateLatestDraw])

  const handleNoteChange = (val: string) => {
    setNote(val)
    updateLatestDraw({ note: val })
  }

  const handleToggleStar = () => {
    if (!currentDraw) return
    const newStarred = !currentDraw.starred
    setCurrentDraw({ ...currentDraw, starred: newStarred })
    updateLatestDraw({ starred: newStarred })
  }

  const handleCopy = async () => {
    if (!currentDraw) return
    const text = `Theme: ${currentDraw.theme} | Constraint: ${currentDraw.constraint} | Twist: ${currentDraw.twist}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* fallback */ }
  }

  const copyHistoryEntry = async (draw: Draw) => {
    const text = `Theme: ${draw.theme} | Constraint: ${draw.constraint} | Twist: ${draw.twist}`
    try { await navigator.clipboard.writeText(text) } catch { /* fallback */ }
  }

  const loadHistoryDraw = (draw: Draw) => {
    setCurrentDraw(draw)
    setNote(draw.note)
    setFlipped(true)
    setShowHistory(false)
  }

  const glowClass = (deckKey: DeckKey) =>
    deckKey === 'themes' ? 'glow-violet' : deckKey === 'constraints' ? 'glow-amber' : 'glow-rose'

  const borderColor = (deckKey: DeckKey) =>
    deckKey === 'themes' ? 'border-violet-500/30' : deckKey === 'constraints' ? 'border-amber-500/30' : 'border-rose-500/30'

  const textColor = (deckKey: DeckKey) =>
    deckKey === 'themes' ? 'text-violet-400' : deckKey === 'constraints' ? 'text-amber-400' : 'text-rose-400'

  const labelColor = (deckKey: DeckKey) =>
    deckKey === 'themes' ? 'text-violet-500' : deckKey === 'constraints' ? 'text-amber-500' : 'text-rose-500'

  const deckKeys: DeckKey[] = ['themes', 'constraints', 'twists']

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Constraint Deck
        </h1>
        <p className="text-sm text-slate-500 mt-1.5">What should you build today?</p>
      </div>

      {/* Draw button */}
      <button
        onClick={handleDraw}
        className="group relative px-10 py-4 rounded-2xl bg-white text-slate-950 text-lg font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-white/5 mb-10 flex items-center gap-2"
      >
        <Shuffle size={22} className="group-hover:rotate-12 transition-transform" />
        Draw Cards
      </button>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
        {deckKeys.map((dk, i) => {
          const value = currentDraw ? (dk === 'themes' ? currentDraw.theme : dk === 'constraints' ? currentDraw.constraint : currentDraw.twist) : null
          const label = dk === 'themes' ? 'Theme' : dk === 'constraints' ? 'Constraint' : 'Twist'

          return (
            <div key={dk} className="card-container h-48">
              <div className={`card-inner ${flipped && value ? 'flipped' : ''} ${flipped ? `flip-${i}` : ''}`}>
                {/* Front (face-down placeholder) */}
                <div className={`card-front ${glowClass(dk)} flex-col gap-3`}>
                  <span className={`text-sm font-semibold uppercase tracking-wider ${labelColor(dk)}`}>
                    {label}
                  </span>
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center">
                    <Shuffle size={20} className="text-slate-600" />
                  </div>
                </div>
                {/* Back (revealed card) */}
                <div className={`card-back border ${borderColor(dk)} ${glowClass(dk)}`} style={{
                  background: dk === 'themes' ? 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.02))' :
                             dk === 'constraints' ? 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02))' :
                             'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(244,63,94,0.02))'
                }}>
                  <div className="flex flex-col items-center text-center gap-1.5 w-full">
                    <span className={`text-[10px] font-semibold uppercase tracking-widest ${labelColor(dk)}`}>
                      {label}
                    </span>
                    {value && (
                      <p className="text-base font-bold leading-snug text-slate-100">
                        {value}
                      </p>
                    )}
                    {currentDraw && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRedrawCard(dk) }}
                        className={`mt-2 p-1.5 rounded-lg ${textColor(dk)} hover:bg-white/5 transition-colors`}
                        title="Redraw this card"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions row */}
      {currentDraw && (
        <div className="w-full max-w-3xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          <button
            onClick={handleToggleStar}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              currentDraw.starred
                ? 'border-amber-400/30 bg-amber-400/10 text-amber-400'
                : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <Star size={15} fill={currentDraw.starred ? 'currentColor' : 'none'} />
            {currentDraw.starred ? 'Starred' : 'Star'}
          </button>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={note}
              onChange={e => handleNoteChange(e.target.value)}
              placeholder="Add a note about this draw..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}

      {/* Bottom controls */}
      <div className="w-full max-w-3xl flex items-center gap-4 border-t border-slate-800 pt-6">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
        >
          <History size={15} />
          History
          {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
        >
          <Settings size={15} />
          Manage Decks
        </button>
        {store.draws.length > 0 && (
          <button
            onClick={() => { if (confirm('Clear all history?')) { clearHistory(); setCurrentDraw(null); setFlipped(false) } }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-rose-400 hover:bg-rose-400/5 transition-colors ml-auto"
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </div>

      {/* History panel */}
      {showHistory && store.draws.length > 0 && (
        <div className="w-full max-w-3xl mt-4 space-y-2">
          {[...store.draws].reverse().map(draw => (
            <div
              key={draw.id}
              onClick={() => loadHistoryDraw(draw)}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                draw.starred
                  ? 'border-amber-400/10 bg-amber-400/5 hover:bg-amber-400/10'
                  : 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/50'
              }`}
            >
              <div className={`mt-0.5 ${draw.starred ? 'text-amber-400' : 'text-slate-600'}`}>
                <Star size={14} fill={draw.starred ? 'currentColor' : 'none'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <span className="text-violet-400 font-medium truncate">{draw.theme}</span>
                  <span className="text-amber-400 font-medium truncate">{draw.constraint}</span>
                  <span className="text-rose-400 font-medium truncate">{draw.twist}</span>
                </div>
                {draw.note && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{draw.note}</p>}
                <p className="text-[10px] text-slate-600 mt-1.5">
                  {new Date(draw.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); copyHistoryEntry(draw) }}
                className="p-1.5 rounded text-slate-600 hover:text-slate-300 hover:bg-slate-800 shrink-0"
              >
                <Copy size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <ManageDecks
          decks={store.decks}
          onAdd={addDeckEntry}
          onUpdate={updateDeckEntry}
          onDelete={deleteDeckEntry}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
