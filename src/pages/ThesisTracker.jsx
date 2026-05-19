import { useState } from 'react'
import { FileText, Plus, Check, Circle, ChevronRight, Trash2, Calendar } from 'lucide-react'
import useLangStore from '../store/langStore'

const defaultMilestones = [
  { id: 1, title: 'Define research question', done: true, due: '2026-05-01' },
  { id: 2, title: 'Literature review (20+ sources)', done: true, due: '2026-05-15' },
  { id: 3, title: 'Methodology design', done: false, due: '2026-05-25' },
  { id: 4, title: 'Data collection', done: false, due: '2026-06-15' },
  { id: 5, title: 'Data analysis', done: false, due: '2026-07-01' },
  { id: 6, title: 'Write Discussion chapter', done: false, due: '2026-07-15' },
  { id: 7, title: 'First draft complete', done: false, due: '2026-08-01' },
  { id: 8, title: 'Supervisor review feedback', done: false, due: '2026-08-15' },
  { id: 9, title: 'Revisions', done: false, due: '2026-09-01' },
  { id: 10, title: 'Final submission', done: false, due: '2026-09-15' },
]

export default function ThesisTracker() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const [milestones, setMilestones] = useState(() => {
    try { return JSON.parse(localStorage.getItem('thesisMilestones') || 'null') || defaultMilestones } catch { return defaultMilestones }
  })
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDue, setNewDue] = useState('')

  const toggleMilestone = (id) => {
    const updated = milestones.map(m => m.id === id ? { ...m, done: !m.done } : m)
    setMilestones(updated)
    localStorage.setItem('thesisMilestones', JSON.stringify(updated))
  }

  const addMilestone = () => {
    if (!newTitle.trim()) return
    const updated = [...milestones, { id: Date.now(), title: newTitle, done: false, due: newDue || null }]
    setMilestones(updated)
    localStorage.setItem('thesisMilestones', JSON.stringify(updated))
    setNewTitle('')
    setNewDue('')
    setIsAdding(false)
  }

  const deleteMilestone = (id) => {
    const updated = milestones.filter(m => m.id !== id)
    setMilestones(updated)
    localStorage.setItem('thesisMilestones', JSON.stringify(updated))
  }

  const completedCount = milestones.filter(m => m.done).length
  const progress = (completedCount / milestones.length) * 100

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            {t('thesisTracker')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {lang === 'en'
              ? 'Track your thesis/research progress with milestones and deadlines.'
              : 'Lacak progres skripsi/risetmu dengan milestone dan deadline.'}
          </p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary text-sm">
          <Plus className="w-4 h-4 inline mr-1" />
          Add Milestone
        </button>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">{lang === 'en' ? 'Overall Progress' : 'Progres Keseluruhan'}</span>
          <span className="text-sm text-gray-400">{completedCount}/{milestones.length}</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-surface-dark-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{progress.toFixed(0)}% complete</p>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="card border-2 border-dashed border-blue-300 dark:border-blue-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={lang === 'en' ? 'Milestone title...' : 'Judul milestone...'}
              className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm"
            />
            <input
              type="date"
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm"
            />
            <button onClick={addMilestone} className="btn-primary text-sm"><Check className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Milestone Timeline */}
      <div className="space-y-2">
        {milestones.map((milestone, i) => {
          const isOverdue = milestone.due && !milestone.done && new Date(milestone.due) < new Date()
          return (
            <div key={milestone.id} className="card flex items-center gap-3">
              <button onClick={() => toggleMilestone(milestone.id)} className="flex-shrink-0">
                {milestone.done ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${milestone.done ? 'line-through text-gray-400' : 'font-medium'}`}>
                  {milestone.title}
                </p>
                {milestone.due && (
                  <p className={`text-xs flex items-center gap-1 mt-0.5 ${
                    isOverdue ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    {new Date(milestone.due).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {isOverdue && ' (overdue)'}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-400 font-mono">#{i + 1}</span>
              <button onClick={() => deleteMilestone(milestone.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
