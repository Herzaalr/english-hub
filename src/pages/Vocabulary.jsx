import { useState, useMemo } from 'react'
import {
  BookOpen, ChevronRight, ChevronLeft, Volume2, Star, StarOff,
  Search, Filter, ArrowRight, Check, X, Shuffle
} from 'lucide-react'
import useLangStore from '../store/langStore'
import useProgressStore from '../store/progressStore'
import vocabularyData from '../data/vocabulary'

const categories = [
  { id: 'all', emoji: '📚' },
  { id: 'daily', emoji: '🏠' },
  { id: 'emotions', emoji: '💭' },
  { id: 'academic', emoji: '🎓' },
  { id: 'business', emoji: '💼' },
  { id: 'social', emoji: '🗣️' },
  { id: 'technology', emoji: '💻' },
  { id: 'travel', emoji: '✈️' },
  { id: 'literature', emoji: '📖' },
  { id: 'science', emoji: '🔬' },
  { id: 'phrasal', emoji: '🔗' },
  { id: 'philosophy', emoji: '🧠' },
]

const levels = ['all', 'beginner', 'intermediate', 'advanced']

export default function Vocabulary() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const { learnVocab, addXP, addFlashcardReview, flashcardDeck } = useProgressStore()

  const [category, setCategory] = useState('all')
  const [level, setLevel] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('browse') // browse | study
  const [studyIndex, setStudyIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vocabFavorites') || '[]') } catch { return [] }
  })

  const filtered = useMemo(() => {
    let words = [...vocabularyData]
    if (category !== 'all') words = words.filter(w => w.category === category)
    if (level !== 'all') words = words.filter(w => w.level === level)
    if (search) {
      const s = search.toLowerCase()
      words = words.filter(w =>
        w.word.toLowerCase().includes(s) ||
        w[`definition_${lang}`].toLowerCase().includes(s)
      )
    }
    return words
  }, [category, level, search, lang])

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = 0.9
    speechSynthesis.speak(utter)
  }

  const toggleFavorite = (id) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]
    setFavorites(next)
    localStorage.setItem('vocabFavorites', JSON.stringify(next))
  }

  const handleStudy = (quality) => {
    const word = filtered[studyIndex]
    if (word) {
      addFlashcardReview(word.id, quality)
      if (quality >= 3) {
        learnVocab(1)
        addXP(10)
      }
    }
    setShowAnswer(false)
    setStudyIndex((i) => (i + 1) % filtered.length)
  }

  const shuffleStudy = () => {
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setStudyIndex(0)
    setShowAnswer(false)
  }

  const currentWord = filtered[studyIndex]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" />
          {t('vocabTitle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('vocabSubtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-500">{vocabularyData.length}</p>
          <p className="text-xs text-gray-500">{t('newWords')}</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-amber-500">{Object.keys(flashcardDeck).length}</p>
          <p className="text-xs text-gray-500">{t('review')}</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-emerald-500">
            {Object.values(flashcardDeck).filter(c => c.repetitions >= 3).length}
          </p>
          <p className="text-xs text-gray-500">{t('mastered')}</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('browse')}
          className={`btn-${view === 'browse' ? 'primary' : 'secondary'} text-sm`}
        >
          Browse
        </button>
        <button
          onClick={() => { setView('study'); setStudyIndex(0); setShowAnswer(false) }}
          className={`btn-${view === 'study' ? 'primary' : 'secondary'} text-sm`}
        >
          Study Mode
        </button>
        <button onClick={shuffleStudy} className="btn-secondary text-sm" title="Shuffle">
          <Shuffle className="w-4 h-4" />
        </button>
      </div>

      {view === 'browse' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search')}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm"
            >
              {levels.map(l => (
                <option key={l} value={l}>{l === 'all' ? 'All Levels' : t(l)}</option>
              ))}
            </select>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map(({ id, emoji }) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-all min-h-[36px] ${
                  category === id
                    ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 ring-1 ring-brand-300'
                    : 'bg-gray-100 dark:bg-surface-dark-3 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {emoji} {id === 'all' ? 'All' : id}
              </button>
            ))}
          </div>

          {/* Word List */}
          <div className="grid gap-3">
            {filtered.map((word) => (
              <WordCard
                key={word.id}
                word={word}
                lang={lang}
                t={t}
                speak={speak}
                isFav={favorites.includes(word.id)}
                onToggleFav={() => toggleFavorite(word.id)}
                deck={flashcardDeck[word.id]}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-12">{t('noResults')}</p>
            )}
          </div>
        </>
      ) : (
        /* Study Mode */
        currentWord && (
          <div className="max-w-lg mx-auto">
            <div className="card text-center min-h-[300px] flex flex-col justify-between">
              <div>
                <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
                  {currentWord.level} · {currentWord.category}
                </span>
                <h2 className="text-3xl font-bold mt-2">{currentWord.word}</h2>
                <p className="text-gray-400 text-sm mt-1">{currentWord.phonetic}</p>
                <button onClick={() => speak(currentWord.word)} className="mt-2 text-brand-500 hover:text-brand-600">
                  <Volume2 className="w-5 h-5" />
                </button>

                {!showAnswer ? (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="btn-primary mt-6"
                  >
                    {t('showAnswer')}
                  </button>
                ) : (
                  <div className="mt-4 text-left space-y-3 animate-slide-up">
                    <div className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
                      <p className="text-xs text-gray-400 mb-1">{t('definition')}</p>
                      <p className="text-sm">{currentWord[`definition_${lang}`]}</p>
                    </div>
                    <div className="p-3 bg-brand-50 dark:bg-brand-900/10 rounded-xl">
                      <p className="text-xs text-gray-400 mb-1">{t('example')}</p>
                      <p className="text-sm italic">{currentWord[`example_${lang}`]}</p>
                    </div>
                    {currentWord.synonyms && (
                      <div className="flex flex-wrap gap-1.5">
                        {currentWord.synonyms.map(s => (
                          <span key={s} className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500">{s}</span>
                        ))}
                      </div>
                    )}
                    {currentWord.slang_note && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl">
                        <p className="text-xs font-medium text-orange-500 mb-1">Slang Note</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{currentWord.slang_note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {showAnswer && (
                <div className="flex justify-center gap-3 mt-6">
                  <button onClick={() => handleStudy(1)} className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 hover:scale-105 transition-transform">
                    <X className="w-5 h-5" />
                    <span className="text-[10px]">{t('again')}</span>
                  </button>
                  <button onClick={() => handleStudy(3)} className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-amber-100 dark:bg-amber-900/20 text-amber-600 hover:scale-105 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                    <span className="text-[10px]">{t('hard')}</span>
                  </button>
                  <button onClick={() => handleStudy(4)} className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 hover:scale-105 transition-transform">
                    <Check className="w-5 h-5" />
                    <span className="text-[10px]">{t('good')}</span>
                  </button>
                  <button onClick={() => handleStudy(5)} className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 hover:scale-105 transition-transform">
                    <Star className="w-5 h-5" />
                    <span className="text-[10px]">{t('easy')}</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-center text-xs text-gray-400 mt-3">
              {studyIndex + 1} / {filtered.length}
            </p>
          </div>
        )
      )}
    </div>
  )
}

function WordCard({ word, lang, t, speak, isFav, onToggleFav, deck }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{word.word}</h3>
            <span className="text-gray-400 text-xs">{word.phonetic}</span>
            <span className={`badge ${
              word.level === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
              word.level === 'intermediate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
              'bg-red-100 dark:bg-red-900/30 text-red-600'
            }`}>{word.level}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {word[`definition_${lang}`]}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={(e) => { e.stopPropagation(); speak(word.word) }} className="p-2.5 hover:bg-gray-100 dark:hover:bg-surface-dark-3 rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onToggleFav() }} className="p-2.5 hover:bg-gray-100 dark:hover:bg-surface-dark-3 rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center">
            {isFav ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : <StarOff className="w-4 h-4 text-gray-400" />}
          </button>
          {deck && (
            <span className="badge bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 text-[10px]">
              ×{deck.repetitions}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">{t('definition')} (EN)</p>
              <p className="text-sm">{word.definition_en}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">{t('definition')} (ID)</p>
              <p className="text-sm">{word.definition_id}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">{t('example')}</p>
              <p className="text-sm italic">{word.example_en}</p>
              <p className="text-xs text-gray-400 mt-1">{word.example_id}</p>
            </div>
            {word.collocations && (
              <div className="p-3 bg-brand-50 dark:bg-brand-900/10 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Collocations</p>
                <div className="flex flex-wrap gap-1.5">
                  {word.collocations.map(c => <span key={c} className="badge bg-white dark:bg-surface-dark-2 text-gray-600 dark:text-gray-300">{c}</span>)}
                </div>
              </div>
            )}
          </div>
          {word.slang_note && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl">
              <p className="text-xs font-medium text-orange-500 mb-1">Slang Note</p>
              <p className="text-xs">{word.slang_note}</p>
            </div>
          )}
          {word.synonyms && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Synonyms</p>
              <div className="flex flex-wrap gap-1.5">
                {word.synonyms.map(s => <span key={s} className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500">{s}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Missing import for the chevron
function ChevronDown(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}
