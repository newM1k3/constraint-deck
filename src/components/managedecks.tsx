import { useState } from 'react'
import { X, Plus, Pencil, Trash2, Check } from 'lucide-react'
import type { Decks, DeckKey } from '../types'
import { DECK_LABELS, DECK_COLORS } from '../types'

interface Props {
  decks: Decks
  onAdd: (deckKey: DeckKey, entry: string) => void
  onUpdate: (deckKey: DeckKey, index: number, value: string) => void
  onDelete: (deckKey: DeckKey, index: number) => void
  onClose: () => void
}

const TABS: DeckKey[] = ['themes', 'constraints', 'twists']

export default function ManageDecks({ decks, onAdd, onUpdate, onDelete, onClose }: Props) {
  const [tab, setTab] = useState<DeckKey>('themes')
  const [newEntry, setNewEntry] = useState('')
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editVal, setEditVal] = useState('')

  const handleAdd = () => {
    if (!newEntry.trim()) return
    onAdd(tab, newEntry.trim())
    setNewEntry('')
  }

  const startEdit = (idx: number, val: string) => {
    setEditingIdx(idx)
    setEditVal(val)
  }

  const saveEdit = () => {
    if (editingIdx === null || !editVal.trim()) return
    onUpdate(tab, editingIdx, editVal.trim())
    setEditingIdx(null)
    setEditVal('')
  }

  const tabColor = (t: DeckKey) =>
    t === 'themes' ? 'violet' : t === 'constraints' ? 'amber' : 'rose'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-slate-100">Manage Decks</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setEditingIdx(null) }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === t
                  ? `text-${tabColor(t)}-400 border-b-2 border-${tabColor(t)}-400`
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={tab === t ? {
                color: t === 'themes' ? '#a78bfa' : t === 'constraints' ? '#fbbf24' : '#fb7185',
                borderBottomColor: t === 'themes' ? '#a78bfa' : t === 'constraints' ? '#fbbf24' : '#fb7185',
                borderBottomWidth: '2px',
              } : {}}
            >
              {DECK_LABELS[t]}s
              <span className="ml-1.5 text-xs text-slate-600">{decks[t].length}</span>
            </button>
          ))}
        </div>

        {/* Entry list */}
        <div className="px-5 py-4 max-h-80 overflow-y-auto space-y-1.5">
          {decks[tab].length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No entries yet. Add one below.</p>
          ) : (
            decks[tab].map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2 group py-1">
                {editingIdx === idx ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editVal}
                      onChange={e => setEditVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit() }}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="p-1.5 rounded text-emerald-400 hover:bg-emerald-400/10">
                      <Check size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-slate-300 truncate">{entry}</span>
                    <button
                      onClick={() => startEdit(idx, entry)}
                      className="p-1 rounded text-slate-600 hover:text-slate-300 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this entry?')) onDelete(tab, idx) }}
                      className="p-1 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add new */}
        <div className="px-5 py-4 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={newEntry}
            onChange={e => setNewEntry(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
            placeholder={`Add a ${DECK_LABELS[tab].toLowerCase()}...`}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
          />
          <button
            onClick={handleAdd}
            disabled={!newEntry.trim()}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-white text-slate-950 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
