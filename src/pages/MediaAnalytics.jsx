import { useState } from 'react'
import { Film, Music, Newspaper, ChevronRight, Volume2, BookOpen } from 'lucide-react'
import useLangStore from '../store/langStore'
import mediaAnalyticsData from '../data/mediaAnalytics'

const typeFilters = [
  { id: 'all', icon: BookOpen, label: 'All' },
  { id: 'movie', icon: Film, label: 'Movies' },
  { id: 'song', icon: Music, label: 'Songs' },
  { id: 'news', icon: Newspaper, label: 'News' },
]

export default function MediaAnalytics() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const [activeType, setActiveType] = useState('all')
  const [selected, setSelected] = useState(null)
  const [expandedScene, setExpandedScene] = useState(null)

  const filtered = activeType === 'all'
    ? mediaAnalyticsData
    : mediaAnalyticsData.filter(m => m.type === activeType)

  const speak = (text) => {
    speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = 0.85
    speechSynthesis.speak(utter)
  }

  if (!selected) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Film className="w-6 h-6 text-teal-500" />
            {t('mediaTitle')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('mediaSubtitle')}</p>
        </div>

        <div className="flex gap-2">
          {typeFilters.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveType(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeType === id
                  ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 ring-1 ring-brand-300'
                  : 'bg-gray-100 dark:bg-surface-dark-3 text-gray-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSelected(item); setExpandedScene(null) }}
              className="card text-left"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{item.thumbnail}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item[`description_${lang}`]}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`badge ${
                      item.level === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                      item.level === 'intermediate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600'
                    }`}>{item.level}</span>
                    <span className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500">{item.type}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => setSelected(null)} className="text-sm text-brand-500 hover:underline">
        ← Back to list
      </button>

      <div className="flex items-start gap-3">
        <span className="text-4xl">{selected.thumbnail}</span>
        <div>
          <h1 className="text-2xl font-bold">{selected.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{selected[`description_${lang}`]}</p>
          <div className="flex gap-2 mt-2">
            <span className={`badge ${
              selected.level === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
              selected.level === 'intermediate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
              'bg-red-100 dark:bg-red-900/30 text-red-600'
            }`}>{selected.level}</span>
          </div>
        </div>
      </div>

      {/* Key Scenes */}
      <div className="space-y-3">
        <h2 className="font-semibold">Key Scenes / Sections</h2>
        {selected.key_scenes.map((scene, i) => (
          <div
            key={i}
            className="card cursor-pointer"
            onClick={() => setExpandedScene(expandedScene === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h3 className="font-medium">{scene.scene}</h3>
                {scene.timestamp && <p className="text-xs text-gray-400">{scene.timestamp}</p>}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); speak(scene.transcript_en) }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-surface-dark-3 rounded-lg"
              >
                <Volume2 className="w-4 h-4 text-brand-500" />
              </button>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedScene === i ? 'rotate-90' : ''}`} />
            </div>

            {expandedScene === i && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 animate-slide-up">
                <div className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Transcript</p>
                  <p className="text-sm italic leading-relaxed">{scene.transcript_en}</p>
                  <p className="text-xs text-gray-400 mt-2">{scene.transcript_id}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                    <p className="text-[10px] font-medium text-blue-500">Vocabulary</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {scene.vocabulary.map(v => <span key={v} className="text-xs">{v}</span>)}
                    </div>
                  </div>
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                    <p className="text-[10px] font-medium text-emerald-500">Grammar Focus</p>
                    <p className="text-xs mt-1">{scene.grammar_focus}</p>
                  </div>
                  <div className="p-2.5 bg-pink-50 dark:bg-pink-900/10 rounded-xl">
                    <p className="text-[10px] font-medium text-pink-500">Pronunciation</p>
                    <p className="text-xs mt-1">{scene.pronunciation_focus}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Learning Points */}
      <div className="card bg-teal-50 dark:bg-teal-900/10">
        <p className="text-xs font-medium text-teal-500 mb-1">🎓 Learning Points</p>
        <p className="text-sm">{selected[`learning_points_${lang}`]}</p>
      </div>
    </div>
  )
}
