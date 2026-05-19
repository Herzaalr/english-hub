import { useState, useRef } from 'react'
import { Headphones, Play, Pause, Check, X, ChevronDown, Volume2 } from 'lucide-react'
import useLangStore from '../store/langStore'
import useProgressStore from '../store/progressStore'
import listeningData from '../data/listening'

export default function Listening() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const { addListeningMinutes, addXP } = useProgressStore()
  const [selected, setSelected] = useState(null)
  const [showTranscript, setShowTranscript] = useState(false)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const synthRef = useRef(null)

  const speak = (text) => {
    speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = 0.85
    utter.onend = () => setIsPlaying(false)
    synthRef.current = utter
    speechSynthesis.speak(utter)
    setIsPlaying(true)
  }

  const stopSpeech = () => {
    speechSynthesis.cancel()
    setIsPlaying(false)
  }

  const handleAnswer = (qIndex, answer) => {
    setAnswers(prev => ({ ...prev, [qIndex]: answer }))
  }

  const checkAnswers = () => {
    setShowResults(true)
    const correct = selected.questions.filter((q, i) => answers[i] === q.answer).length
    addXP(correct * 15)
    addListeningMinutes(5)
  }

  const resetQuiz = () => {
    setAnswers({})
    setShowResults(false)
  }

  if (!selected) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Headphones className="w-6 h-6 text-violet-500" />
            {t('listeningTitle')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('listeningSubtitle')}</p>
        </div>

        <div className="grid gap-4">
          {listeningData.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSelected(item); resetQuiz(); setShowTranscript(false) }}
              className="card text-left hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-violet-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge ${
                      item.level === 'beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                      item.level === 'intermediate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600'
                    }`}>{item.level}</span>
                    <span className="text-xs text-gray-400">{item.duration}</span>
                    <span className="text-xs text-gray-400">{item.category}</span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
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
          <span className="text-sm text-gray-400">{selected.duration}</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="card flex items-center gap-4">
        <button
          onClick={() => isPlaying ? stopSpeech() : speak(selected.transcript)}
          className="w-12 h-12 rounded-full bg-violet-500 hover:bg-violet-600 text-white flex items-center justify-center transition-all"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium">{isPlaying ? 'Playing...' : 'Tap to listen'}</p>
          <p className="text-xs text-gray-400">Uses browser speech synthesis</p>
        </div>
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="btn-secondary text-xs"
        >
          {showTranscript ? 'Hide' : 'Show'} Transcript
        </button>
      </div>

      {/* Transcript */}
      {showTranscript && (
        <div className="card bg-gray-50 dark:bg-surface-dark-3">
          <p className="text-sm leading-relaxed whitespace-pre-line">{selected.transcript}</p>
        </div>
      )}

      {/* Vocabulary Focus */}
      <div className="card">
        <h3 className="font-semibold text-sm mb-2">Key Vocabulary</h3>
        <div className="flex flex-wrap gap-2">
          {selected.vocabulary_focus.map(v => (
            <span key={v} className="badge bg-violet-100 dark:bg-violet-900/30 text-violet-600">{v}</span>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h3 className="font-semibold">Comprehension Questions</h3>
        {selected.questions.map((q, qi) => (
          <div key={qi} className="card">
            <p className="font-medium text-sm mb-3">{q[`q_${lang}`]}</p>
            <div className="grid grid-cols-2 gap-2">
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
                      'bg-gray-50 dark:bg-surface-dark-3 hover:bg-gray-100 dark:hover:bg-gray-700'
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

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!showResults ? (
          <button
            onClick={checkAnswers}
            disabled={Object.keys(answers).length < selected.questions.length}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4 inline mr-1" />
            {t('checkAnswer')}
          </button>
        ) : (
          <>
            <button onClick={resetQuiz} className="btn-secondary">
              <X className="w-4 h-4 inline mr-1" />
              {t('tryAgain')}
            </button>
            <span className="flex items-center gap-2 text-sm text-gray-500">
              {t('score')}: {selected.questions.filter((q, i) => answers[i] === q.answer).length}/{selected.questions.length}
            </span>
          </>
        )}
      </div>

      {/* Cultural Note */}
      {(selected.cultural_note_en || selected.cultural_note_id) && (
        <div className="card bg-purple-50 dark:bg-purple-900/10">
          <p className="text-xs font-medium text-purple-500 mb-1">🌍 Cultural Note</p>
          <p className="text-sm">{selected[`cultural_note_${lang}`]}</p>
        </div>
      )}
    </div>
  )
}
