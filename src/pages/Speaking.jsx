import { useState, useRef } from 'react'
import { Mic, Square, Play, RotateCcw, Clock, MessageSquare } from 'lucide-react'
import useLangStore from '../store/langStore'
import useProgressStore from '../store/progressStore'

const topics = [
  { id: 'intro', label_en: 'Introduce yourself', label_id: 'Perkenalkan dirimu', prompt_en: 'Tell me about yourself. What\'s your name, where are you from, and what do you do?', prompt_id: 'Ceritakan tentang dirimu. Siapa namamu, dari mana, dan apa pekerjaanmu?' },
  { id: 'hobby', label_en: 'Talk about your hobby', label_id: 'Ceritakan hobimu', prompt_en: 'What do you do in your free time? Why do you enjoy it?', prompt_id: 'Apa yang kamu lakukan di waktu luang? Kenapa kamu menikmatinya?' },
  { id: 'food', label_en: 'Describe your favorite food', label_id: 'Deskripsikan makanan favoritmu', prompt_en: 'What\'s your favorite food? Describe how it tastes, smells, and looks.', prompt_id: 'Apa makanan favoritmu? Deskripsikan rasanya, baunya, dan penampilannya.' },
  { id: 'travel', label_en: 'Describe a place you visited', label_id: 'Deskripsikan tempat yang pernah kamu kunjungi', prompt_en: 'Tell me about a memorable trip. Where did you go? What did you see?', prompt_id: 'Ceritakan perjalanan berkesan. Ke mana? Apa yang kamu lihat?' },
  { id: 'dream', label_en: 'Talk about your dream', label_id: 'Ceritakan mimpimu', prompt_en: 'What is your biggest dream for the future? What steps are you taking?', prompt_id: 'Apa mimpimu yang terbesar? Langkah apa yang kamu ambil?' },
  { id: 'movie', label_en: 'Review a movie/show', label_id: 'Review film/serial', prompt_en: 'Tell me about a movie or show you recently watched. Would you recommend it?', prompt_id: 'Ceritakan film atau serial yang baru kamu tonton. Kamu rekomendasikan?' },
]

export default function Speaking() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const { addSpeakingMinutes, addXP } = useProgressStore()

  const [selectedTopic, setSelectedTopic] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState([])
  const [timer, setTimer] = useState(0)
  const timerRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const duration = timer
        setRecordings(prev => [{ url, duration, topic: selectedTopic?.id, timestamp: Date.now() }, ...prev])
        addSpeakingMinutes(Math.ceil(duration / 60))
        addXP(Math.ceil(duration / 10) * 5)
        stream.getTracks().forEach(t => t.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setTimer(0)
      timerRef.current = setInterval(() => setTimer(s => s + 1), 1000)
    } catch (err) {
      alert('Microphone access denied. Please allow microphone access.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(timerRef.current)
    }
  }

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mic className="w-6 h-6 text-rose-500" />
          {t('speakingTitle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('speakingSubtitle')}</p>
      </div>

      {/* Topic Selection */}
      <div>
        <h2 className="font-semibold mb-3">{t('topic')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className={`card text-left ${selectedTopic?.id === topic.id ? 'ring-2 ring-rose-500 bg-rose-50 dark:bg-rose-900/10' : ''}`}
            >
              <h3 className="font-medium text-sm">{topic[`label_${lang}`]}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Recording Area */}
      {selectedTopic && (
        <div className="card text-center max-w-lg mx-auto">
          <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl mb-4">
            <p className="text-sm text-gray-500 mb-1">Prompt:</p>
            <p className="font-medium">{selectedTopic[`prompt_${lang}`]}</p>
          </div>

          {/* Timer */}
          <div className="mb-4">
            <span className="text-4xl font-mono font-light text-gray-800 dark:text-gray-200">
              {formatTime(timer)}
            </span>
          </div>

          {/* Record Button */}
          <div className="flex justify-center gap-3">
            {!isRecording ? (
              <button onClick={startRecording} className="btn-primary">
                <Mic className="w-5 h-5 inline mr-2" />
                {t('startRecording')}
              </button>
            ) : (
              <button onClick={stopRecording} className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all animate-pulse">
                <Square className="w-5 h-5 inline mr-2" />
                {t('stopRecording')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recordings History */}
      {recordings.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">Your Recordings</h2>
          <div className="space-y-2">
            {recordings.map((rec, i) => (
              <div key={i} className="card flex items-center gap-3">
                <audio controls src={rec.url} className="flex-1 h-8" />
                <span className="text-xs text-gray-400">{formatTime(rec.duration)}</span>
                <span className="badge bg-rose-100 dark:bg-rose-900/30 text-rose-500">
                  +{Math.ceil(rec.duration / 10) * 5} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
