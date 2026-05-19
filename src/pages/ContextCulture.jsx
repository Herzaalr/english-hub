import { useState } from 'react'
import { MessageCircle, ChevronRight, Globe, BookOpen } from 'lucide-react'
import useLangStore from '../store/langStore'
import contextCultureData from '../data/contextCulture'

export default function ContextCulture() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const [selected, setSelected] = useState(null)
  const [expandedScenario, setExpandedScenario] = useState(null)

  if (!selected) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-indigo-500" />
            {t('cultureTitle')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('cultureSubtitle')}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {contextCultureData.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="card text-left"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item[`description_${lang}`]}</p>
                  <span className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500 mt-2">{item.category}</span>
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
        ← Back
      </button>

      <div className="flex items-start gap-3">
        <span className="text-4xl">{selected.icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{selected.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{selected[`description_${lang}`]}</p>
        </div>
      </div>

      {/* Scenarios */}
      <div className="space-y-3">
        <h2 className="font-semibold">{t('scenarios')}</h2>
        {selected.scenarios.map((scenario, i) => (
          <div
            key={i}
            className="card cursor-pointer"
            onClick={() => setExpandedScenario(expandedScenario === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-sm font-bold text-indigo-500">
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">{scenario[`situation_${lang}`]}</h3>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedScenario === i ? 'rotate-90' : ''}`} />
            </div>

            {expandedScenario === i && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 animate-slide-up">
                {scenario.dialogue.map((line, li) => (
                  <div key={li} className="flex gap-3">
                    <span className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500 flex-shrink-0">
                      {line.speaker}
                    </span>
                    <div>
                      <p className="text-sm">{line.en}</p>
                      <p className="text-xs text-gray-400">{line.id}</p>
                    </div>
                  </div>
                ))}

                {scenario[`tips_${lang}`] && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                    <p className="text-xs font-medium text-amber-500 mb-1">💡 Tips</p>
                    <p className="text-sm">{scenario[`tips_${lang}`]}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cultural Notes */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-500" />
          {t('culturalNotes')}
        </h3>
        <div className="space-y-2">
          {selected.cultural_notes.map((note, i) => (
            <div key={i} className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl">
              <p className="text-sm">{note[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
