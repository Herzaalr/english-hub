import { useState } from 'react'
import { BookText, Clock, ChevronRight, Check, X } from 'lucide-react'
import useLangStore from '../store/langStore'
import useProgressStore from '../store/progressStore'
import readingData from '../data/reading'

export default function Reading() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const { addReadingMinutes, addXP } = useProgressStore()
  const [selected, setSelected] = useState(null)
  const [showVocab, setShowVocab] = useState(false)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (qi, answer) => setAnswers(prev => ({ ...prev, [qi]: answer }))

  const checkAnswers = () => {
    setShowResults(true)
    const correct = selected.questions.filter((q, i) => answers[i] === q.answer).length
    addXP(correct * 20)
    addReadingMinutes(10)
  }

  if (!selected) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookText className="w-6 h-6 text-amber-500" />
            {t('readingTitle')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('readingSubtitle')}</p>
        </div>

        <div className="grid gap-4">
          {readingData.map((article) => (
            <button
              key={article.id}
              onClick={() => { setSelected(article); setAnswers({}); setShowResults(false); setShowVocab(false) }}
              className="card text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-2xl">
                  📖
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{article.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${
                      article.level === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                      article.level === 'intermediate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600'
                    }`}>{article.level}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.reading_time}
                    </span>
                    <span className="text-xs text-gray-400">{article.category}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
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

      <div>
        <h1 className="text-2xl font-bold">{selected.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`badge ${
            selected.level === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
            selected.level === 'intermediate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
            'bg-red-100 dark:bg-red-900/30 text-red-600'
          }`}>{selected.level}</span>
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {selected.reading_time}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <div className="card prose dark:prose-invert max-w-none">
        <div className="text-sm leading-relaxed whitespace-pre-line">{selected.content}</div>
      </div>

      {/* Vocabulary */}
      <div className="card">
        <button onClick={() => setShowVocab(!showVocab)} className="w-full flex items-center justify-between">
          <h3 className="font-semibold text-sm">📚 Key Vocabulary ({selected.vocabulary.length})</h3>
          <ChevronRight className={`w-4 h-4 transition-transform ${showVocab ? 'rotate-90' : ''}`} />
        </button>
        {showVocab && (
          <div className="mt-3 space-y-2 animate-slide-up">
            {selected.vocabulary.map((v, i) => (
              <div key={i} className="p-2.5 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
                <p className="font-medium text-sm">{v.word}</p>
                <p className="text-xs text-gray-500">{v[`def_${lang}`]}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comprehension Questions */}
      <div className="space-y-4">
        <h3 className="font-semibold">📝 {t('comprehension')}</h3>
        {selected.questions.map((q, qi) => (
          <div key={qi} className="card">
            <p className="font-medium text-sm mb-3">{q[`q_${lang}`]}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt) => {
                const isSelected = answers[qi] === opt
                const isCorrect = showResults && opt === q.answer
                const isWrong = showResults && isSelected && opt !== q.answer
                return (
                  <button
                    key={opt}
                    onClick={() => !showResults && handleAnswer(qi, opt)}
                    disabled={showResults}
                    className={`p-3 rounded-xl text-sm text-left transition-all ${
                      isCorrect ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 ring-2 ring-emerald-400' :
                      isWrong ? 'bg-red-100 dark:bg-red-900/30 text-red-700 ring-2 ring-red-400' :
                      isSelected ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 ring-2 ring-brand-400' :
                      'bg-gray-50 dark:bg-surface-dark-3 hover:bg-gray-100'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {!showResults ? (
        <button
          onClick={checkAnswers}
          disabled={Object.keys(answers).length < selected.questions.length}
          className="btn-primary disabled:opacity-50"
        >
          <Check className="w-4 h-4 inline mr-1" />
          {t('checkAnswer')}
        </button>
      ) : (
        <div className="card bg-emerald-50 dark:bg-emerald-900/10">
          <p className="font-semibold text-emerald-600">
            {t('score')}: {selected.questions.filter((q, i) => answers[i] === q.answer).length}/{selected.questions.length}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            +{selected.questions.filter((q, i) => answers[i] === q.answer).length * 20} XP earned
          </p>
        </div>
      )}

      {/* Cultural Note */}
      {selected[`cultural_note_${lang}`] && (
        <div className="card bg-purple-50 dark:bg-purple-900/10">
          <p className="text-xs font-medium text-purple-500 mb-1">🌍 Cultural Note</p>
          <p className="text-sm">{selected[`cultural_note_${lang}`]}</p>
        </div>
      )}
    </div>
  )
}
