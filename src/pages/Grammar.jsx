import { useState } from 'react'
import { Languages, ChevronDown, ChevronRight, Check, BookOpen, Lightbulb, Puzzle } from 'lucide-react'
import useLangStore from '../store/langStore'
import useProgressStore from '../store/progressStore'
import grammarData from '../data/grammar'

const groups = [
  { id: 'present', label: 'Present', color: 'blue', emoji: '🔵' },
  { id: 'past', label: 'Past', color: 'amber', emoji: '🟡' },
  { id: 'future', label: 'Future', color: 'emerald', emoji: '🟢' },
  { id: 'mixed', label: 'Mixed', color: 'purple', emoji: '🟣' },
]

export default function Grammar() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const { completeLesson, addXP, completedLessons } = useProgressStore()
  const [expandedId, setExpandedId] = useState(null)
  const [activeGroup, setActiveGroup] = useState('all')
  const [quizMode, setQuizMode] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 })

  const filtered = activeGroup === 'all'
    ? grammarData
    : grammarData.filter(g => g.group === activeGroup)

  const handleComplete = (id) => {
    completeLesson(id)
    addXP(25)
  }

  // Simple quiz: show positive sentence, user identifies the tense
  const quizTenses = grammarData.map(g => ({
    tense: g.tense,
    example: g.positive.en,
    id: g.id,
  }))

  const startQuiz = () => {
    setQuizMode(true)
    setQuizIndex(0)
    setQuizAnswer(null)
    setQuizScore({ correct: 0, total: 0 })
  }

  const handleQuizAnswer = (selected) => {
    const correct = quizTenses[quizIndex].tense === selected
    setQuizAnswer({ selected, correct })
    setQuizScore(s => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
    }))
    setTimeout(() => {
      setQuizAnswer(null)
      setQuizIndex((i) => (i + 1) % quizTenses.length)
    }, 1500)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Languages className="w-6 h-6 text-emerald-500" />
          {t('grammarTitle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('grammarSubtitle')}</p>
      </div>

      {/* Group Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveGroup('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeGroup === 'all'
              ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 ring-1 ring-brand-300'
              : 'bg-gray-100 dark:bg-surface-dark-3 text-gray-500'
          }`}
        >
          All 16 Tenses
        </button>
        {groups.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => setActiveGroup(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeGroup === id
                ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 ring-1 ring-brand-300'
                : 'bg-gray-100 dark:bg-surface-dark-3 text-gray-500'
            }`}
          >
            {emoji} {label}
          </button>
        ))}
        <button onClick={startQuiz} className="btn-primary text-sm ml-auto">
          <Puzzle className="w-4 h-4 inline mr-1" />
          Quiz Mode
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 dark:bg-surface-dark-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
            style={{ width: `${(completedLessons.filter(id => grammarData.find(g => g.id === id)).length / grammarData.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">
          {completedLessons.filter(id => grammarData.find(g => g.id === id)).length}/{grammarData.length}
        </span>
      </div>

      {quizMode ? (
        /* Quiz Mode */
        <div className="max-w-lg mx-auto">
          <div className="card text-center">
            <p className="text-xs text-gray-400 mb-2">
              Question {quizIndex + 1} · {t('score')}: {quizScore.correct}/{quizScore.total}
            </p>
            <p className="text-sm text-gray-400 mb-1">Which tense is this?</p>
            <p className="text-lg font-semibold mt-2 italic">"{quizTenses[quizIndex].example}"</p>

            <div className="grid grid-cols-2 gap-2 mt-6">
              {grammarData.slice(0, 8).map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleQuizAnswer(g.tense)}
                  disabled={!!quizAnswer}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    quizAnswer?.selected === g.tense
                      ? quizAnswer.correct
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 ring-2 ring-emerald-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 ring-2 ring-red-400'
                      : 'bg-gray-50 dark:bg-surface-dark-3 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {g.tense}
                </button>
              ))}
            </div>

            <button onClick={() => setQuizMode(false)} className="btn-secondary text-sm mt-4">
              Exit Quiz
            </button>
          </div>
        </div>
      ) : (
        /* Tense List */
        <div className="space-y-3">
          {filtered.map((grammar, index) => {
            const isExpanded = expandedId === grammar.id
            const isCompleted = completedLessons.includes(grammar.id)
            const groupColor = groups.find(g => g.id === grammar.group)?.color || 'blue'

            return (
              <div key={grammar.id} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : grammar.id)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                    isCompleted ? 'bg-emerald-500' :
                    `bg-${groupColor}-500`
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{grammar.tense}</h3>
                    <p className="text-xs text-gray-400">{grammar.structure_en}</p>
                  </div>
                  <span className={`badge ${
                    grammar.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                    grammar.difficulty === 'intermediate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                    'bg-red-100 dark:bg-red-900/30 text-red-600'
                  }`}>
                    {grammar.difficulty}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4 animate-slide-up">
                    {/* Structure */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                        <p className="text-xs font-medium text-blue-500 mb-1">{t('structure')}</p>
                        <p className="text-sm font-mono">{grammar.structure_en}</p>
                        <p className="text-xs text-gray-400 mt-1">{grammar.structure_id}</p>
                      </div>
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                        <p className="text-xs font-medium text-emerald-500 mb-1">{t('usage')}</p>
                        <p className="text-sm">{grammar.usage_en}</p>
                        <p className="text-xs text-gray-400 mt-1">{grammar.usage_id}</p>
                      </div>
                    </div>

                    {/* Signal Words */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">{t('signalWords')}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {grammar.signal_words.map(w => (
                          <span key={w} className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-600 dark:text-gray-300">{w}</span>
                        ))}
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="space-y-2">
                      <ExampleRow label="✅ Positive" en={grammar.positive.en} id={grammar.positive.id} />
                      <ExampleRow label="❌ Negative" en={grammar.negative.en} id={grammar.negative.id} />
                      <ExampleRow label="❓ Question" en={grammar.question.en} id={grammar.question.id} />
                    </div>

                    {/* Fun Example */}
                    {grammar.fun_example && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                        <p className="text-xs font-medium text-amber-500 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Fun Example</p>
                        <p className="text-sm italic mt-1">{grammar.fun_example}</p>
                      </div>
                    )}

                    {/* Tips */}
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                      <p className="text-xs font-medium text-purple-500 mb-1">💡 Tips</p>
                      <p className="text-sm">{grammar[`tips_${lang}`]}</p>
                    </div>

                    {/* Complete Button */}
                    {!isCompleted && (
                      <button
                        onClick={() => handleComplete(grammar.id)}
                        className="btn-primary w-full text-sm"
                      >
                        {t('completeLesson')} (+25 XP)
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ExampleRow({ label, en, id }) {
  return (
    <div className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
      <span className="text-xs mt-0.5">{label}</span>
      <div className="flex-1">
        <p className="text-sm font-medium">{en}</p>
        <p className="text-xs text-gray-400">{id}</p>
      </div>
    </div>
  )
}
