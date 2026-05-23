import { useState, useRef } from 'react'
import { Mic, Square, Play, RotateCcw, Clock, MessageSquare, Bot, Volume2 } from 'lucide-react'
import useLangStore from '../store/langStore'
import useProgressStore from '../store/progressStore'
import ConversationMode from './ConversationMode'

const topics = [
  { id: 'intro', label_en: 'Introduce yourself', label_id: 'Perkenalkan dirimu', prompt_en: 'Tell me about yourself. What\'s your name, where are you from, and what do you do?', prompt_id: 'Ceritakan tentang dirimu. Siapa namamu, dari mana, dan apa pekerjaanmu?' },
  { id: 'hobby', label_en: 'Talk about your hobby', label_id: 'Ceritakan hobimu', prompt_en: 'What do you do in your free time? Why do you enjoy it?', prompt_id: 'Apa yang kamu lakukan di waktu luang? Kenapa kamu menikmatinya?' },
  { id: 'food', label_en: 'Describe your favorite food', label_id: 'Deskripsikan makanan favoritmu', prompt_en: 'What\'s your favorite food? Describe how it tastes, smells, and looks.', prompt_id: 'Apa makanan favoritmu? Deskripsikan rasanya, baunya, dan penampilannya.' },
  { id: 'travel', label_en: 'Describe a place you visited', label_id: 'Deskripsikan tempat yang pernah kamu kunjungi', prompt_en: 'Tell me about a memorable trip. Where did you go? What did you see?', prompt_id: 'Ceritakan perjalanan berkesan. Ke mana? Apa yang kamu lihat?' },
  { id: 'dream', label_en: 'Talk about your dream', label_id: 'Ceritakan mimpimu', prompt_en: 'What is your biggest dream for the future? What steps are you taking?', prompt_id: 'Apa mimpimu yang terbesar? Langkah apa yang kamu ambil?' },
  { id: 'movie', label_en: 'Review a movie/show', label_id: 'Review film/serial', prompt_en: 'Tell me about a movie or show you recently watched. Would you recommend it?', prompt_id: 'Ceritakan film atau serial yang baru kamu tonton. Kamu rekomendasikan?' },
  { id: 'daily', label_en: 'Describe your daily routine', label_id: 'Deskripsikan rutinitas harianmu', prompt_en: 'Walk me through a typical day. What do you do from morning to night?', prompt_id: 'Jelaskan hari tipikalmu. Apa yang kamu lakukan dari pagi sampai malam?' },
  { id: 'work', label_en: 'Talk about your work/studies', label_id: 'Ceritakan pekerjaan/studimu', prompt_en: 'What do you do for work or study? What do you like or dislike about it?', prompt_id: 'Apa pekerjaan atau studimu? Apa yang kamu suka atau tidak suka?' },
  { id: 'friend', label_en: 'Describe your best friend', label_id: 'Deskripsikan sahabatmu', prompt_en: 'Tell me about your best friend. How did you meet? What makes them special?', prompt_id: 'Ceritakan tentang sahabatmu. Bagaimana kalian bertemu? Apa yang membuatnya spesial?' },
  { id: 'city', label_en: 'Describe your city/town', label_id: 'Deskripsikan kotamu', prompt_en: 'Describe the city or town you live in. What do you like about it? What would you change?', prompt_id: 'Deskripsikan kota tempat tinggalmu. Apa yang kamu suka? Apa yang mau kamu ubah?' },
  { id: 'music', label_en: 'Talk about music you love', label_id: 'Ceritakan musik yang kamu suka', prompt_en: 'What kind of music do you listen to? Who is your favorite artist? Why?', prompt_id: 'Kamu dengar musik apa? Siapa artis favoritmu? Kenapa?' },
  { id: 'book', label_en: 'Recommend a book', label_id: 'Rekomendasikan buku', prompt_en: 'Tell me about a book that changed your thinking. What is it about? Why should others read it?', prompt_id: 'Ceritakan buku yang mengubah pikiranmu. Tentang apa? Kenapa orang lain harus baca?' },
  { id: 'problem', label_en: 'Describe a problem you solved', label_id: 'Deskripsikan masalah yang kamu selesaikan', prompt_en: 'Tell me about a difficult problem you faced. How did you solve it? What did you learn?', prompt_id: 'Ceritakan masalah sulit yang kamu hadapi. Bagaimana kamu selesaikan? Apa yang kamu pelajari?' },
  { id: 'future', label_en: 'Describe your ideal future', label_id: 'Deskripsikan masa depan idealmu', prompt_en: 'Where do you see yourself in 10 years? Describe your ideal life.', prompt_id: 'Di mana kamu melihat dirimu 10 tahun lagi? Deskripsikan hidup idealmu.' },
  { id: 'technology', label_en: 'Talk about technology you use', label_id: 'Ceritakan teknologi yang kamu pakai', prompt_en: 'What technology or app can you not live without? Why is it important to you?', prompt_id: 'Teknologi atau app apa yang nggak bisa kamu tinggalkan? Kenapa penting?' },
  { id: 'weather', label_en: 'Talk about your favorite season', label_id: 'Ceritakan musim favoritmu', prompt_en: 'What is your favorite season or weather? What do you enjoy doing during that time?', prompt_id: 'Apa musim atau cuaca favoritmu? Apa yang kamu nikmati saat itu?' },
  { id: 'shopping', label_en: 'Describe a shopping experience', label_id: 'Deskripsikan pengalaman belanja', prompt_en: 'Tell me about a recent shopping trip. What did you buy? Was it a good experience?', prompt_id: 'Ceritakan pengalaman belanja terakhir. Apa yang kamu beli? Pengalaman bagus?' },
  { id: 'health', label_en: 'Talk about staying healthy', label_id: 'Ceritakan tentang tetap sehat', prompt_en: 'What do you do to stay healthy? Do you exercise, eat well, or have other habits?', prompt_id: 'Apa yang kamu lakukan untuk tetap sehat? Olahraga, makan sehat, atau kebiasaan lain?' },
  { id: 'school', label_en: 'Describe your school experience', label_id: 'Deskripsikan pengalaman sekolahmu', prompt_en: 'What was your favorite subject in school? Who was your favorite teacher? Why?', prompt_id: 'Apa mata pelajaran favoritmu di sekolah? Siapa guru favoritmu? Kenapa?' },
  { id: 'culture', label_en: 'Talk about your culture', label_id: 'Ceritakan budayamu', prompt_en: 'Describe a tradition or custom from your culture that is important to you.', prompt_id: 'Deskripsikan tradisi atau adat dari budayamu yang penting bagimu.' },
  { id: 'superpower', label_en: 'If you had a superpower...', label_id: 'Kalau kamu punya kekuatan super...', prompt_en: 'If you could have any superpower, what would it be? How would you use it?', prompt_id: 'Kalau kamu bisa punya kekuatan super, apa yang kamu pilih? Bagaimana kamu pakai?' },
  { id: 'advice', label_en: 'Give advice to your younger self', label_id: 'Beri saran ke dirimu yang lebih muda', prompt_en: 'If you could talk to your 10-year-old self, what advice would you give?', prompt_id: 'Kalau kamu bisa bicara ke dirimu umur 10 tahun, saran apa yang kamu beri?' },
  { id: 'restaurant', label_en: 'Order food at a restaurant', label_id: 'Pesan makanan di restoran', prompt_en: 'Imagine you are at a restaurant. Order a meal, ask about the menu, and talk to the waiter.', prompt_id: 'Bayangkan kamu di restoran. Pesan makanan, tanya menu, dan bicara ke pelayan.' },
  { id: 'interview', label_en: 'Practice a job interview', label_id: 'Latihan wawancara kerja', prompt_en: 'Introduce yourself in a job interview. Talk about your skills, experience, and why you are a good fit.', prompt_id: 'Perkenalkan dirimu di wawancara kerja. Ceritakan skill, pengalaman, dan kenapa kamu cocok.' },
  { id: 'news', label_en: 'Summarize a news story', label_id: 'Rangkum berita', prompt_en: 'Tell me about a recent news story you heard. What happened? What do you think about it?', prompt_id: 'Ceritakan berita terbaru yang kamu dengar. Apa yang terjadi? Apa pendapatmu?' },
]

export default function Speaking() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const { addSpeakingMinutes, addXP } = useProgressStore()

  const [mode, setMode] = useState('solo') // solo | conversation
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

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-surface-dark-3 rounded-xl w-fit">
        <button onClick={() => setMode('solo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'solo'
              ? 'bg-white dark:bg-surface-dark-2 shadow-sm text-gray-900 dark:text-gray-100'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}>
          <Volume2 className="w-4 h-4" />
          {t('convModeSolo')}
        </button>
        <button onClick={() => setMode('conversation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'conversation'
              ? 'bg-white dark:bg-surface-dark-2 shadow-sm text-gray-900 dark:text-gray-100'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}>
          <Bot className="w-4 h-4" />
          {t('convModeAI')}
        </button>
      </div>

      {/* AI Conversation Mode */}
      {mode === 'conversation' && <ConversationMode />}

      {/* Solo Practice Mode */}
      {mode === 'solo' && (
        <>
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
        </>
      )}
    </div>
  )
}
