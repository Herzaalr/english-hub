import { useState, useRef } from 'react'
import { Volume2, ChevronDown, Mic, Square, Play, RotateCcw, Check, Ear } from 'lucide-react'
import useLangStore from '../store/langStore'
import useProgressStore from '../store/progressStore'
import accentLessons from '../data/accentTrainer'

const categories = [
  { id: 'all', label: 'All', icon: '🎯' },
  { id: 'r-sounds', label: 'R Sounds', icon: '🇺🇸' },
  { id: 'flap-t', label: 'Flap T', icon: '💧' },
  { id: 'dark-l', label: 'Dark L', icon: '🥛' },
  { id: 'vowels', label: 'Vowels', icon: '🫦' },
  { id: 'linking', label: 'Linking', icon: '🔗' },
  { id: 'am-vs-brit', label: 'US vs UK', icon: '🇬🇧' },
  { id: 'expressions', label: 'Expressions', icon: '🗣️' },
]

export default function AccentTrainer() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const { addXP } = useProgressStore()

  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [activeTab, setActiveTab] = useState({}) // { [lessonId]: 'tip' | 'examples' | 'shadow' | 'pairs' }
  const [completedShadow, setCompletedShadow] = useState({})
  const [isRecording, setIsRecording] = useState(false)
  const [recordingFor, setRecordingFor] = useState(null)
  const [recordings, setRecordings] = useState([])
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const filtered = activeCategory === 'all'
    ? accentLessons
    : accentLessons.filter(l => l.category === activeCategory)

  const speak = (text, rate = 0.85) => {
    speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = rate
    // Try to pick a US voice
    const voices = speechSynthesis.getVoices()
    const usVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
                    voices.find(v => v.lang === 'en-US') ||
                    voices.find(v => v.lang.startsWith('en'))
    if (usVoice) utter.voice = usVoice
    speechSynthesis.speak(utter)
  }

  const speakSlow = (text) => speak(text, 0.55)

  const getTab = (lessonId) => activeTab[lessonId] || 'tip'

  const setTab = (lessonId, tab) => setActiveTab(prev => ({ ...prev, [lessonId]: tab }))

  const toggleShadowComplete = (lessonId, idx) => {
    const key = `${lessonId}-${idx}`
    setCompletedShadow(prev => {
      const next = { ...prev, [key]: !prev[key] }
      if (next[key]) addXP(3)
      return next
    })
  }

  const startRecording = async (sentence) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setRecordings(prev => [{ url, sentence, timestamp: Date.now() }, ...prev])
        addXP(5)
        stream.getTracks().forEach(t => t.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingFor(sentence)
    } catch {
      alert('Microphone access denied. Please allow microphone access.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingFor(null)
    }
  }

  const difficultyColor = (d) => {
    if (d === 'hard') return 'bg-red-100 dark:bg-red-900/30 text-red-500'
    if (d === 'medium') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-500'
    return 'bg-green-100 dark:bg-green-900/30 text-green-500'
  }

  const tabs = [
    { id: 'tip', label: lang === 'id' ? 'Tips' : 'Tips', icon: '💡' },
    { id: 'examples', label: lang === 'id' ? 'Contoh' : 'Examples', icon: '📖' },
    { id: 'shadow', label: 'Shadowing', icon: '🎤' },
    { id: 'pairs', label: lang === 'id' ? 'Pasangan' : 'Pairs', icon: '👂' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-2xl">🇺🇸</span>
          {lang === 'id' ? 'Pelatih Aksen Amerika' : 'American Accent Trainer'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {lang === 'id'
            ? 'Kuasai aksen Amerika: R berat, flap T, reduksi, dan ritme natural.'
            : 'Master the American accent: heavy R, flap T, reductions, and natural rhythm.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{accentLessons.length}</p>
          <p className="text-xs text-gray-400">{lang === 'id' ? 'Pelajaran' : 'Lessons'}</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Object.keys(completedShadow).filter(k => completedShadow[k]).length}
          </p>
          <p className="text-xs text-gray-400">{lang === 'id' ? 'Shadow Selesai' : 'Shadows Done'}</p>
        </div>
        <div className="card text-center py-3">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{recordings.length}</p>
          <p className="text-xs text-gray-400">{lang === 'id' ? 'Rekaman' : 'Recordings'}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeCategory === id
                ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 ring-1 ring-brand-300'
                : 'bg-gray-100 dark:bg-surface-dark-3 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Lesson Cards */}
      <div className="space-y-3">
        {filtered.map((lesson) => {
          const isExpanded = expandedId === lesson.id
          const tab = getTab(lesson.id)

          return (
            <div key={lesson.id} className="card overflow-hidden">
              {/* Card Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : lesson.id)}
                className="w-full flex items-center gap-4 text-left"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                  lesson.difficulty === 'hard' ? 'bg-red-100 dark:bg-red-900/20' :
                  lesson.difficulty === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20' :
                  'bg-green-100 dark:bg-green-900/20'
                }`}>
                  {lesson.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <p className="text-xs text-gray-400 truncate">{lesson.subtitle}</p>
                </div>
                <span className={`badge text-xs ${difficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-slide-up">
                  {/* Tab Navigation */}
                  <div className="flex gap-1 mb-4 p-1 bg-gray-100 dark:bg-surface-dark-3 rounded-xl">
                    {tabs.map(({ id: tabId, label, icon }) => (
                      <button
                        key={tabId}
                        onClick={() => setTab(lesson.id, tabId)}
                        className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          tab === tabId
                            ? 'bg-white dark:bg-surface-dark-2 shadow-sm text-gray-900 dark:text-gray-100'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <span>{icon}</span>
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab: Tips */}
                  {tab === 'tip' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">💡</span>
                          <div>
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                              {lang === 'id' ? 'Cara Pengucapan' : 'How to Pronounce'}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {lesson[`tip_${lang}`]}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">🇮🇩</span>
                          <div>
                            <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-1">
                              {lang === 'id' ? 'Perbedaan dengan Indonesia' : 'Indonesian Speaker Note'}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {lesson[`key_difference_${lang}`]}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => speak(lesson.examples[0].word)}
                          className="btn-primary text-sm"
                        >
                          <Volume2 className="w-4 h-4 inline mr-1.5" />
                          {lang === 'id' ? 'Dengarkan Contoh' : 'Listen to Example'}
                        </button>
                        <button
                          onClick={() => speakSlow(lesson.examples[0].word)}
                          className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-surface-dark-3 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                        >
                          <Ear className="w-4 h-4 inline mr-1.5" />
                          {lang === 'id' ? 'Pelan' : 'Slow'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab: Examples */}
                  {tab === 'examples' && (
                    <div className="space-y-2">
                      {lesson.examples.map((ex, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">{ex.word}</span>
                              <span className="text-xs text-gray-400 font-mono">{ex.ipa}</span>
                            </div>
                            <p className="text-sm text-gray-500 italic mt-0.5">{ex.sentence}</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => speak(ex.word)}
                              className="p-2 hover:bg-white dark:hover:bg-surface-dark-2 rounded-lg transition-all"
                              title="Normal speed"
                            >
                              <Volume2 className="w-4 h-4 text-brand-500" />
                            </button>
                            <button
                              onClick={() => speakSlow(ex.word)}
                              className="p-2 hover:bg-white dark:hover:bg-surface-dark-2 rounded-lg transition-all"
                              title="Slow speed"
                            >
                              <Ear className="w-4 h-4 text-green-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab: Shadowing */}
                  {tab === 'shadow' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl mb-3">
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                          {lang === 'id'
                            ? 'Shadow = dengarkan lalu langsung ulangi. Rekam dirimu untuk bandingkan!'
                            : 'Shadow = listen then repeat immediately. Record yourself to compare!'}
                        </p>
                      </div>
                      {lesson.shadowing.map((sentence, i) => {
                        const key = `${lesson.id}-${i}`
                        const done = completedShadow[key]
                        return (
                          <div key={i} className={`p-3 rounded-xl border-2 transition-all ${
                            done
                              ? 'border-green-300 bg-green-50 dark:bg-green-900/10 dark:border-green-700'
                              : 'border-gray-100 dark:border-gray-800'
                          }`}>
                            <p className="text-sm font-medium mb-2">{sentence}</p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => speak(sentence)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-medium hover:bg-brand-200 dark:hover:bg-brand-900/50 transition-all"
                              >
                                <Play className="w-3 h-3" />
                                {lang === 'id' ? 'Dengar' : 'Listen'}
                              </button>
                              <button
                                onClick={() => speakSlow(sentence)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-surface-dark-3 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                              >
                                <Ear className="w-3 h-3" />
                                {lang === 'id' ? 'Pelan' : 'Slow'}
                              </button>
                              <button
                                onClick={() => {
                                  if (isRecording && recordingFor === sentence) {
                                    stopRecording()
                                  } else {
                                    startRecording(sentence)
                                  }
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  isRecording && recordingFor === sentence
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-gray-100 dark:bg-surface-dark-3 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                              >
                                {isRecording && recordingFor === sentence ? (
                                  <><Square className="w-3 h-3" /> {lang === 'id' ? 'Stop' : 'Stop'}</>
                                ) : (
                                  <><Mic className="w-3 h-3" /> {lang === 'id' ? 'Rekam' : 'Record'}</>
                                )}
                              </button>
                              <button
                                onClick={() => toggleShadowComplete(lesson.id, i)}
                                className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  done
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 dark:bg-surface-dark-3 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                              >
                                <Check className="w-3 h-3" />
                                {done ? (lang === 'id' ? 'Selesai' : 'Done') : (lang === 'id' ? 'Selesai' : 'Mark Done')}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Tab: Minimal Pairs */}
                  {tab === 'pairs' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl mb-3">
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          {lang === 'id'
                            ? 'Minimal pairs = kata yang hanya beda satu bunyi. Dengarkan bedanya!'
                            : 'Minimal pairs = words differing by only one sound. Listen for the difference!'}
                        </p>
                      </div>
                      {lesson.minimal_pairs.map((pair, i) => (
                        <div key={i} className="p-4 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <button
                              onClick={() => speak(pair.a)}
                              className="flex-1 p-3 bg-white dark:bg-surface-dark-2 rounded-xl text-center hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all mr-2"
                            >
                              <p className="font-bold text-lg">{pair.a}</p>
                              <Volume2 className="w-3 h-3 mx-auto mt-1 text-brand-500" />
                            </button>
                            <span className="text-gray-400 font-bold">vs</span>
                            <button
                              onClick={() => speak(pair.b)}
                              className="flex-1 p-3 bg-white dark:bg-surface-dark-2 rounded-xl text-center hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all ml-2"
                            >
                              <p className="font-bold text-lg">{pair.b}</p>
                              <Volume2 className="w-3 h-3 mx-auto mt-1 text-brand-500" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 text-center">{pair.hint}</p>
                          <div className="flex justify-center mt-2">
                            <button
                              onClick={() => {
                                speechSynthesis.cancel()
                                const u1 = new SpeechSynthesisUtterance(pair.a)
                                u1.lang = 'en-US'
                                u1.rate = 0.85
                                u1.onend = () => {
                                  setTimeout(() => {
                                    const u2 = new SpeechSynthesisUtterance(pair.b)
                                    u2.lang = 'en-US'
                                    u2.rate = 0.85
                                    speechSynthesis.speak(u2)
                                  }, 500)
                                }
                                speechSynthesis.speak(u1)
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-medium hover:bg-brand-200 dark:hover:bg-brand-900/50 transition-all"
                            >
                              <Play className="w-3 h-3" />
                              {lang === 'id' ? 'Dengarkan Berurutan' : 'Listen Back-to-Back'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Recordings History */}
      {recordings.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Mic className="w-4 h-4 text-purple-500" />
            {lang === 'id' ? 'Rekamanmu' : 'Your Recordings'}
          </h2>
          <div className="space-y-2">
            {recordings.map((rec, i) => (
              <div key={i} className="card flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 truncate mb-1">"{rec.sentence}"</p>
                  <audio controls src={rec.url} className="w-full h-8" />
                </div>
                <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-500 text-xs flex-shrink-0">
                  +5 XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
