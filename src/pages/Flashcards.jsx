import { useState, useMemo } from 'react'
import { Layers, Check, X, Star, ArrowRight, RotateCcw } from 'lucide-react'
import useLangStore from '../store/langStore'
import useProgressStore from '../store/progressStore'
import vocabularyData from '../data/vocabulary'

export default function Flashcards() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const { addFlashcardReview, flashcardDeck, learnVocab, addXP, getDueCards } = useProgressStore()
  const [mode, setMode] = useState(null) // null | 'study' | 'browse'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 })

  const dueCards = useMemo(() => {
    const now = Date.now()
    return vocabularyData.filter(w => {
      const card = flashcardDeck[w.id]
      return !card || card.nextReview <= now
    })
  }, [flashcardDeck])

  const allCards = vocabularyData
  const masteredCount = Object.values(flashcardDeck).filter(c => c.repetitions >= 3).length

  const startStudy = () => {
    setMode('study')
    setCurrentIndex(0)
    setShowAnswer(false)
    setSessionStats({ reviewed: 0, correct: 0 })
  }

  const handleReview = (quality) => {
    const card = dueCards[currentIndex]
    if (!card) return

    addFlashcardReview(card.id, quality)
    if (quality >= 3) {
      learnVocab(1)
      addXP(10)
      setSessionStats(s => ({ ...s, reviewed: s.reviewed + 1, correct: s.correct + 1 }))
    } else {
      setSessionStats(s => ({ ...s, reviewed: s.reviewed + 1 }))
    }

    setShowAnswer(false)
    if (currentIndex + 1 >= dueCards.length) {
      setMode(null) // Session complete
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  const currentCard = mode === 'study' ? dueCards[currentIndex] : null

  if (!mode) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-500" />
            {t('flashTitle')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('flashSubtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-3xl font-bold text-cyan-500">{dueCards.length}</p>
            <p className="text-xs text-gray-500">{t('dueCards')}</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-emerald-500">{masteredCount}</p>
            <p className="text-xs text-gray-500">{t('mastered')}</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-gray-400">{allCards.length}</p>
            <p className="text-xs text-gray-500">{t('totalCards')}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={startStudy}
            disabled={dueCards.length === 0}
            className="btn-primary disabled:opacity-50"
          >
            {dueCards.length > 0 ? `Study ${dueCards.length} Cards` : 'No cards due!'}
          </button>
          <button onClick={() => setMode('browse')} className="btn-secondary">
            Browse All
          </button>
        </div>

        {/* Session Summary */}
        {sessionStats.reviewed > 0 && (
          <div className="card bg-emerald-50 dark:bg-emerald-900/10">
            <p className="font-semibold text-emerald-600">Last Session</p>
            <p className="text-sm text-gray-500">
              {sessionStats.correct}/{sessionStats.reviewed} correct · +{sessionStats.correct * 10} XP
            </p>
          </div>
        )}

        {/* Browse Mode */}
        {mode === 'browse' && (
          <div className="space-y-2">
            {allCards.map(w => {
              const card = flashcardDeck[w.id]
              return (
                <div key={w.id} className="card flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-medium">{w.word}</p>
                    <p className="text-xs text-gray-400">{w[`definition_${lang}`]}</p>
                  </div>
                  {card ? (
                    <span className={`badge ${card.repetitions >= 3 ? 'bg-emerald-100 text-emerald-500' : 'bg-amber-100 text-amber-500'}`}>
                      ×{card.repetitions}
                    </span>
                  ) : (
                    <span className="badge bg-gray-100 text-gray-400">new</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Study mode
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => setMode(null)} className="text-sm text-brand-500 hover:underline">
          ← Back
        </button>
        <span className="text-sm text-gray-400">
          {currentIndex + 1} / {dueCards.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 dark:bg-surface-dark-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
        />
      </div>

      {currentCard && (
        <div className="max-w-lg mx-auto">
          <div className="card text-center min-h-[300px] flex flex-col justify-between">
            <div>
              <span className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500 mb-3">
                {currentCard.level} · {currentCard.category}
              </span>
              <h2 className="text-3xl font-bold mt-2">{currentCard.word}</h2>
              <p className="text-gray-400 text-sm mt-1">{currentCard.phonetic}</p>

              {!showAnswer ? (
                <button onClick={() => setShowAnswer(true)} className="btn-primary mt-8">
                  {t('showAnswer')}
                </button>
              ) : (
                <div className="mt-4 text-left space-y-3 animate-slide-up">
                  <div className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">{t('definition')}</p>
                    <p className="text-sm font-medium">{currentCard[`definition_${lang}`]}</p>
                    <p className="text-xs text-gray-400 mt-1">{currentCard[`definition_${lang === 'en' ? 'id' : 'en'}`]}</p>
                  </div>
                  <div className="p-3 bg-brand-50 dark:bg-brand-900/10 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">{t('example')}</p>
                    <p className="text-sm italic">{currentCard[`example_${lang}`]}</p>
                  </div>
                </div>
              )}
            </div>

            {showAnswer && (
              <div className="flex justify-center gap-3 mt-6">
                <button onClick={() => handleReview(1)} className="flex flex-col items-center gap-1 px-5 py-2.5 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 hover:scale-105 transition-transform">
                  <X className="w-5 h-5" />
                  <span className="text-[10px]">{t('again')}</span>
                </button>
                <button onClick={() => handleReview(3)} className="flex flex-col items-center gap-1 px-5 py-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/20 text-amber-600 hover:scale-105 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                  <span className="text-[10px]">{t('hard')}</span>
                </button>
                <button onClick={() => handleReview(4)} className="flex flex-col items-center gap-1 px-5 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 hover:scale-105 transition-transform">
                  <Check className="w-5 h-5" />
                  <span className="text-[10px]">{t('good')}</span>
                </button>
                <button onClick={() => handleReview(5)} className="flex flex-col items-center gap-1 px-5 py-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 hover:scale-105 transition-transform">
                  <Star className="w-5 h-5" />
                  <span className="text-[10px]">{t('easy')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
