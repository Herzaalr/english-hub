import { useState } from 'react'
import { Volume2, ChevronDown, Mic } from 'lucide-react'
import useLangStore from '../store/langStore'
import pronunciationData from '../data/pronunciation'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'consonant', label: 'Consonants' },
  { id: 'vowel', label: 'Vowels' },
  { id: 'stress', label: 'Stress' },
  { id: 'connected', label: 'Connected Speech' },
]

export default function Pronunciation() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = activeCategory === 'all'
    ? pronunciationData
    : pronunciationData.filter(p => p.category === activeCategory)

  const speak = (text, rate = 0.8) => {
    speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = rate
    speechSynthesis.speak(utter)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Volume2 className="w-6 h-6 text-pink-500" />
          {t('pronunTitle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('pronunSubtitle')}</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === id
                ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 ring-1 ring-brand-300'
                : 'bg-gray-100 dark:bg-surface-dark-3 text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sound Cards */}
      <div className="space-y-3">
        {filtered.map((sound) => {
          const isExpanded = expandedId === sound.id
          return (
            <div key={sound.id} className="card overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : sound.id)}
                className="w-full flex items-center gap-4 text-left"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${
                  sound.difficulty === 'hard' ? 'bg-red-100 dark:bg-red-900/20 text-red-500' :
                  sound.difficulty === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-500' :
                  'bg-green-100 dark:bg-green-900/20 text-green-500'
                }`}>
                  {sound.symbol}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{sound.name}</h3>
                  <p className="text-xs text-gray-400">{sound[`description_${lang}`]?.substring(0, 60)}...</p>
                </div>
                <span className={`badge ${
                  sound.difficulty === 'hard' ? 'bg-red-100 dark:bg-red-900/30 text-red-500' :
                  sound.difficulty === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500' :
                  'bg-green-100 dark:bg-green-900/30 text-green-500'
                }`}>{sound.difficulty}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4 animate-slide-up">
                  {/* Description */}
                  <div className="p-3 bg-pink-50 dark:bg-pink-900/10 rounded-xl">
                    <p className="text-sm font-medium">{sound[`description_${lang}`]}</p>
                  </div>

                  {/* Examples */}
                  <div>
                    <h4 className="text-xs text-gray-400 mb-2">Examples</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {sound.examples.map((ex, i) => (
                        <button
                          key={i}
                          onClick={() => speak(ex.word)}
                          className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        >
                          <p className="text-lg font-bold">{ex.word}</p>
                          <p className="text-xs text-gray-400">{ex.ipa}</p>
                          <Volume2 className="w-3 h-3 mx-auto mt-1 text-brand-500" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Common Mistakes */}
                  <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                    <p className="text-xs font-medium text-red-500 mb-1">⚠️ Common Mistakes</p>
                    <p className="text-sm">{sound[`common_mistakes_${lang}`]}</p>
                  </div>

                  {/* Practice Sentences */}
                  <div>
                    <h4 className="text-xs text-gray-400 mb-2">Practice Sentences</h4>
                    {sound.practice_sentences.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-surface-dark-3 rounded-xl mb-2">
                        <p className="flex-1 text-sm italic">{s}</p>
                        <button onClick={() => speak(s, 0.7)} className="p-1.5 hover:bg-white dark:hover:bg-surface-dark-2 rounded-lg">
                          <Volume2 className="w-4 h-4 text-brand-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
