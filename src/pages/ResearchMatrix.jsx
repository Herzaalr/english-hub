import { useState } from 'react'
import { FlaskConical, Plus, X, Check, Edit3, Trash2 } from 'lucide-react'
import useLangStore from '../store/langStore'

const defaultMatrix = [
  { id: 1, character: 'Hamlet (Hamlet)', work: 'Shakespeare', traits: ['indecisive', 'philosophical', 'melancholic'], analysis: 'Represents the struggle between action and inaction. His famous soliloquy "To be or not to be" encapsulates existential doubt.', tags: ['tragedy', 'philosophy'] },
  { id: 2, character: 'Elizabeth Bennet', work: 'Pride and Prejudice — Austen', traits: ['witty', 'independent', 'prejudiced'], analysis: 'Challenges social norms of her era. Her prejudice mirrors Darcy\'s pride, showing how first impressions can be misleading.', tags: ['romance', 'social commentary'] },
  { id: 3, character: 'Atticus Finch', work: 'To Kill a Mockingbird — Lee', traits: ['principled', 'compassionate', 'courageous'], analysis: 'Embodies moral integrity in the face of systemic racism. Teaches empathy through his defense of Tom Robinson.', tags: ['justice', 'moral courage'] },
]

export default function ResearchMatrix() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('researchMatrix') || 'null') || defaultMatrix } catch { return defaultMatrix }
  })
  const [isAdding, setIsAdding] = useState(false)
  const [newEntry, setNewEntry] = useState({ character: '', work: '', traits: '', analysis: '', tags: '' })
  const [filterTag, setFilterTag] = useState('all')

  const allTags = [...new Set(entries.flatMap(e => e.tags))]

  const filtered = filterTag === 'all' ? entries : entries.filter(e => e.tags.includes(filterTag))

  const addEntry = () => {
    if (!newEntry.character || !newEntry.work) return
    const entry = {
      id: Date.now(),
      character: newEntry.character,
      work: newEntry.work,
      traits: newEntry.traits.split(',').map(t => t.trim()).filter(Boolean),
      analysis: newEntry.analysis,
      tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    const updated = [...entries, entry]
    setEntries(updated)
    localStorage.setItem('researchMatrix', JSON.stringify(updated))
    setNewEntry({ character: '', work: '', traits: '', analysis: '', tags: '' })
    setIsAdding(false)
  }

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem('researchMatrix', JSON.stringify(updated))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-emerald-500" />
            {t('researchMatrix')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {lang === 'en'
              ? 'Analyze characters from literature, film, and academic works. Build your research matrix.'
              : 'Analisis karakter dari sastra, film, dan karya akademis. Bangun matriks risetmu.'}
          </p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary text-sm">
          <Plus className="w-4 h-4 inline mr-1" />
          Add Entry
        </button>
      </div>

      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterTag('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium ${filterTag === 'all' ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 ring-1 ring-brand-300' : 'bg-gray-100 dark:bg-surface-dark-3 text-gray-500'}`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${filterTag === tag ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 ring-1 ring-brand-300' : 'bg-gray-100 dark:bg-surface-dark-3 text-gray-500'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="card border-2 border-dashed border-brand-300 dark:border-brand-700">
          <h3 className="font-semibold mb-3">New Entry</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Character name" value={newEntry.character} onChange={(e) => setNewEntry({ ...newEntry, character: e.target.value })} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm" />
            <input type="text" placeholder="Work / Source" value={newEntry.work} onChange={(e) => setNewEntry({ ...newEntry, work: e.target.value })} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm" />
            <input type="text" placeholder="Traits (comma separated)" value={newEntry.traits} onChange={(e) => setNewEntry({ ...newEntry, traits: e.target.value })} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm" />
            <input type="text" placeholder="Tags (comma separated)" value={newEntry.tags} onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm" />
            <textarea placeholder="Analysis" value={newEntry.analysis} onChange={(e) => setNewEntry({ ...newEntry, analysis: e.target.value })} className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm sm:col-span-2" rows={3} />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={addEntry} className="btn-primary text-sm"><Check className="w-4 h-4 inline mr-1" />Save</button>
            <button onClick={() => setIsAdding(false)} className="btn-secondary text-sm"><X className="w-4 h-4 inline mr-1" />Cancel</button>
          </div>
        </div>
      )}

      {/* Matrix Cards */}
      <div className="space-y-3">
        {filtered.map((entry) => (
          <div key={entry.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">{entry.character}</h3>
                <p className="text-sm text-gray-500">{entry.work}</p>
              </div>
              <button onClick={() => deleteEntry(entry.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {entry.traits.map(t => (
                <span key={t} className="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">{t}</span>
              ))}
            </div>
            <p className="text-sm mt-3 leading-relaxed">{entry.analysis}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {entry.tags.map(tag => (
                <span key={tag} className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
