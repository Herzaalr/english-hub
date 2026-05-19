import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, Sparkles, BookOpen, Languages, Volume2, Lightbulb } from 'lucide-react'
import useLangStore from '../store/langStore'

const suggestedQuestions = {
  en: [
    'Explain the difference between "affect" and "effect"',
    'What\'s the difference between British and American English?',
    'How do I improve my English pronunciation?',
    'Give me 5 idioms about time',
    'What are the most common English mistakes Indonesians make?',
    'Explain conditionals in simple terms',
    'How do I use "have been" vs "had been"?',
    'What\'s the best way to learn vocabulary?',
  ],
  id: [
    'Jelaskan perbedaan "affect" dan "effect"',
    'Apa bedanya British English dan American English?',
    'Gimana cara memperbaiki pengucapan bahasa Inggris?',
    'Kasih 5 idiom tentang waktu',
    'Apa kesalahan bahasa Inggris paling umum orang Indonesia?',
    'Jelaskan conditionals dengan cara sederhana',
    'Kapan pakai "have been" vs "had been"?',
    'Cara terbaik belajar kosakata apa?',
  ],
}

// Simulated AI responses based on keywords
function getAIResponse(question, lang) {
  const q = question.toLowerCase()

  if (q.includes('affect') || q.includes('effect')) {
    return {
      en: `**Affect vs Effect** — the classic confusion!\n\n• **Affect** = verb (action). "The weather **affects** my mood."\n• **Effect** = noun (result). "The **effect** of the rain was flooding."\n\n💡 Memory trick: **A**ffect = **A**ction (verb), **E**ffect = **E**nd result (noun).\n\nException: "effect" can be a verb meaning "to bring about": "She **effected** real change." And "affect" as a noun in psychology refers to emotional state.`,
      id: `**Affect vs Effect** — kebingungan klasik!\n\n• **Affect** = kata kerja (aksi). "Cuaca **mempengaruhi** mood-ku."\n• **Effect** = kata benda (hasil). "Dampak hujan adalah banjir."\n\n💡 Trik: **A**ffect = **A**ksi (kata kerja), **E**ffect = **E**nd result (hasil).\n\nPengecualian: "effect" bisa jadi kata kerja artinya "mewujudkan": "Dia **mewujudkan** perubahan nyata." Dan "affect" sebagai kata benda dalam psikologi merujuk ke keadaan emosional.`
    }
  }

  if (q.includes('british') || q.includes('american')) {
    return {
      en: `**British vs American English** — main differences:\n\n🔹 **Vocabulary:**\n• British: lift, flat, biscuit, boot (of car)\n• American: elevator, apartment, cookie, trunk\n\n🔹 **Spelling:**\n• British: colour, organise, centre\n• American: color, organize, center\n\n🔹 **Pronunciation:**\n• British: "schedule" → /ˈʃedjuːl/\n• American: "schedule" → /ˈskedʒuːl/\n\n🔹 **Grammar:**\n• British: "I've just eaten" (present perfect)\n• American: "I just ate" (simple past) — both correct!\n\nNeither is "better" — just different standards. Pick one and be consistent.`,
      id: `**British vs American English** — perbedaan utama:\n\n🔹 **Kosakata:**\n• British: lift, flat, biscuit, boot\n• American: elevator, apartment, cookie, trunk\n\n🔹 **Ejaan:**\n• British: colour, organise, centre\n• American: color, organize, center\n\n🔹 **Pengucapan:**\n• British: "schedule" → /ˈʃedjuːl/\n• American: "schedule" → /ˈskedʒuːl/\n\n🔹 **Grammar:**\n• British: "I've just eaten" (present perfect)\n• American: "I just ate" (simple past) — keduanya benar!\n\nTidak ada yang "lebih baik" — cuma standar berbeda. Pilih satu dan konsisten.`
    }
  }

  if (q.includes('pronunciation') || q.includes('pengucapan')) {
    return {
      en: `**How to improve pronunciation:**\n\n1. **Learn IPA** — the International Phonetic Alphabet tells you exactly how to pronounce sounds.\n\n2. **Focus on problem sounds** for Indonesians:\n   • /θ/ and /ð/ (the "th" sounds) — think, this\n   • /v/ vs /w/ — "very" ≠ "wery"\n   • /æ/ vs /ɑː/ — "cat" vs "car"\n\n3. **Shadow native speakers** — listen and repeat in real-time. TED Talks are great for this.\n\n4. **Record yourself** — use the Speaking module to record and compare.\n\n5. **Learn connected speech** — native speakers say "wanna" not "want to", "gonna" not "going to".\n\n6. **Practice minimal pairs** — ship/sheep, bit/beat, bat/bet.\n\nConsistency > intensity. 10 minutes daily beats 2 hours weekly.`,
      id: `**Cara memperbaiki pengucapan:**\n\n1. **Pelajari IPA** — International Phonetic Alphabet memberitahu cara pasti mengucapkan bunyi.\n\n2. **Fokus pada bunyi bermasalah** untuk orang Indonesia:\n   • /θ/ dan /ð/ (bunyi "th") — think, this\n   • /v/ vs /w/ — "very" ≠ "wery"\n   • /æ/ vs /ɑː/ — "cat" vs "car"\n\n3. **Shadow penutur asli** — dengar dan ulangi secara real-time. TED Talk bagus untuk ini.\n\n4. **Rekam dirimu** — pakai modul Speaking untuk rekam dan bandingkan.\n\n5. **Pelajari connected speech** — penutur asli bilang "wanna" bukan "want to", "gonna" bukan "going to".\n\n6. **Latihan minimal pairs** — ship/sheep, bit/beat, bat/bet.\n\nKonsistensi > intensitas. 10 menit tiap hari lebih baik dari 2 jam seminggu.`
    }
  }

  // Default response
  return {
    en: `That's a great question! Let me break it down:\n\nI'm a simulated AI partner for this learning platform. In a production version, I'd connect to a real LLM API (like OpenAI or Anthropic) to give you detailed, personalized answers.\n\nFor now, try asking me about:\n• Specific grammar points (affect vs effect, conditionals, tenses)\n• British vs American English\n• Pronunciation tips\n• Vocabulary strategies\n• Idioms and slang\n\nWhat would you like to know?`,
    id: `Pertanyaan bagus! Mari saya jelaskan:\n\nAku adalah AI partner simulasi untuk platform belajar ini. Di versi produksi, aku akan terhubung ke API LLM nyata (seperti OpenAI atau Anthropic) untuk memberi jawaban detail dan personal.\n\nUntuk sekarang, coba tanyakan tentang:\n• Poin grammar spesifik (affect vs effect, conditionals, tenses)\n• British vs American English\n• Tips pengucapan\n• Strategi kosakata\n• Idiom dan bahasa gaul\n\nMau tahu apa?`
  }
}

export default function PedagogyPartner() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: lang === 'en'
        ? "Hello! I'm your AI English Pedagogy Partner. Ask me anything about English grammar, vocabulary, pronunciation, or culture. I'm here to help you learn!"
        : "Halo! Aku Mitra Pedagogi AI bahasa Inggrismu. Tanya apa saja tentang grammar, kosakata, pengucapan, atau budaya. Aku di sini untuk membantumu belajar!"
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const response = getAIResponse(userMsg, lang)
      setMessages(prev => [...prev, { role: 'assistant', content: response[lang] }])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const askSuggestion = (q) => {
    setInput(q)
    setTimeout(() => send(), 100)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6 text-purple-500" />
          {t('pedTitle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('pedSubtitle')}</p>
      </div>

      {/* Chat Area */}
      <div className="card p-0 overflow-hidden max-w-3xl mx-auto">
        <div className="h-[350px] sm:h-[500px] overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-purple-500" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-500 text-white rounded-br-md'
                  : 'bg-gray-100 dark:bg-surface-dark-3 rounded-bl-md'
              }`}>
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-brand-500" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-purple-500" />
              </div>
              <div className="bg-gray-100 dark:bg-surface-dark-3 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-3">
          <form
            onSubmit={(e) => { e.preventDefault(); send() }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('askQuestion')}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button type="submit" className="btn-primary px-4">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="max-w-3xl mx-auto">
        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <Lightbulb className="w-3 h-3" /> Try asking:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions[lang].slice(0, 6).map((q, i) => (
            <button
              key={i}
              onClick={() => { setInput(q); setTimeout(send, 50) }}
              className="px-3 py-1.5 rounded-full text-xs bg-gray-100 dark:bg-surface-dark-3 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
