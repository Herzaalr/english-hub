import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, MicOff, Square, Send, Key, ChevronDown, Loader2, Bot, User, RotateCcw, StopCircle, Sparkles, ArrowRight, Settings2, AlertCircle } from 'lucide-react'
import useLangStore from '../store/langStore'
import useSettingsStore from '../store/settingsStore'

const SYSTEM_PROMPT = `You are a friendly, patient English conversation partner helping someone practice speaking English.

Rules:
- Keep responses SHORT (1-3 sentences max)
- Ask ONE follow-up question at a time
- Speak naturally, like a real conversation
- If the user makes a grammar mistake, gently correct it in parentheses after your response
- If the user seems stuck (short answer, says "I don't know"), offer a pattern hint like: "You could say: [example sentence]"
- Be encouraging but not excessive
- After 6-8 exchanges, ask if they want to continue or get feedback

When the user says "give me feedback" or similar, provide a summary with:
**Grammar:** (corrections)
**Vocabulary:** (suggested upgrades)
**Fluency:** (score 1-10 with brief comment)
**Confidence:** (score 1-10 with brief comment)
**Overall:** (brief encouraging summary)`

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'] },
  { id: 'openrouter', name: 'OpenRouter', models: ['openai/gpt-4o-mini', 'anthropic/claude-sonnet-4', 'meta-llama/llama-3.1-8b-instruct:free'] },
]

const MAX_TURNS = 15

export default function ConversationMode() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const { apiKey, apiProvider, apiModel, setApiKey, setApiProvider, setApiModel } = useSettingsStore()

  const [phase, setPhase] = useState('setup') // setup | chatting | feedback
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [messages, setMessages] = useState([])
  const [turnCount, setTurnCount] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [showSettings, setShowSettings] = useState(!apiKey)
  const [error, setError] = useState('')
  const [feedbackSummary, setFeedbackSummary] = useState('')
  const [isFinishing, setIsFinishing] = useState(false)

  const recognitionRef = useRef(null)
  const synthRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const isListeningRef = useRef(false)

  const topics = [
    { id: 'free', icon: '💬', en: 'Free Talk', id: 'Ngobrol Bebas' },
    { id: 'intro', icon: '👋', en: 'Introduce Yourself', id: 'Perkenalan Diri' },
    { id: 'daily', icon: '☀️', en: 'Daily Routine', id: 'Rutinitas Harian' },
    { id: 'hobby', icon: '🎮', en: 'Hobbies', id: 'Hobi' },
    { id: 'food', icon: '🍜', en: 'Food & Cooking', id: 'Makanan & Memasak' },
    { id: 'travel', icon: '✈️', en: 'Travel', id: 'Perjalanan' },
    { id: 'work', icon: '💼', en: 'Work & Career', id: 'Pekerjaan & Karir' },
    { id: 'movie', icon: '🎬', en: 'Movies & Shows', id: 'Film & Serial' },
    { id: 'tech', icon: '💻', en: 'Technology', id: 'Teknologi' },
    { id: 'dream', icon: '🌟', en: 'Dreams & Goals', id: 'Mimpi & Tujuan' },
    { id: 'shopping', icon: '🛒', en: 'Shopping', id: 'Belanja' },
    { id: 'interview', icon: '📋', en: 'Job Interview', id: 'Wawancara Kerja' },
  ]

  useEffect(() => {
    synthRef.current = window.speechSynthesis
    return () => {
      if (synthRef.current) synthRef.current.cancel()
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAiTyping])

  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (!synthRef.current) { resolve(); return }
      synthRef.current.cancel()
      const clean = text.replace(/\*[^*]+\*/g, '').replace(/$$[^)]+$$/g, '').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()
      if (!clean) { resolve(); return }
      const u = new SpeechSynthesisUtterance(clean)
      u.lang = 'en-US'
      u.rate = 0.9
      u.pitch = 1
      u.onstart = () => setIsSpeaking(true)
      u.onend = () => { setIsSpeaking(false); resolve() }
      u.onerror = () => { setIsSpeaking(false); resolve() }
      synthRef.current.speak(u)
    })
  }, [])

  const callAI = useCallback(async (msgs) => {
    const provider = PROVIDERS.find(p => p.id === apiProvider) || PROVIDERS[0]
    const endpoint = apiProvider === 'openrouter'
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(apiProvider === 'openrouter' && { 'HTTP-Referer': window.location.origin }),
      },
      body: JSON.stringify({
        model: apiModel,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...msgs],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error?.message || `API error ${res.status}`)
    }

    const data = await res.json()
    return data.choices[0]?.message?.content?.trim() || "Sorry, I didn't catch that. Could you say it again?"
  }, [apiKey, apiProvider, apiModel])

  const handleAiResponse = useCallback(async (msgs) => {
    setIsAiTyping(true)
    setError('')
    try {
      const reply = await callAI(msgs)
      const aiMsg = { role: 'assistant', content: reply, time: Date.now() }
      setMessages(prev => [...prev, aiMsg])
      setTurnCount(c => c + 1)
      setIsAiTyping(false)

      if (isFinishing) {
        setFeedbackSummary(reply)
        setPhase('feedback')
        setIsFinishing(false)
        return
      }

      await speak(reply)
      setTimeout(() => {
        if (recognitionRef.current && isListeningRef.current === false) {
          try {
            recognitionRef.current.start()
            isListeningRef.current = true
            setIsListening(true)
          } catch {}
        }
      }, 300)
    } catch (err) {
      setIsAiTyping(false)
      setError(err.message)
    }
  }, [callAI, speak, isFinishing])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      try { recognitionRef.current.stop() } catch {}
      isListeningRef.current = false
      setIsListening(false)
      setInterimTranscript('')
    }
  }, [])

  const sendText = useCallback((text) => {
    if (!text.trim() || isAiTyping) return
    const userMsg = { role: 'user', content: text.trim(), time: Date.now() }
    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setTextInput('')
    handleAiResponse(newMsgs)
  }, [messages, isAiTyping, handleAiResponse])

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setError('Speech recognition not supported. Use Chrome or Edge.'); return }

    if (synthRef.current) synthRef.current.cancel()
    setIsSpeaking(false)

    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }

    const rec = new SR()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.maxAlternatives = 1
    recognitionRef.current = rec

    let finalText = ''

    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' '
        else interim += e.results[i][0].transcript
      }
      setInterimTranscript(interim || finalText)
    }

    rec.onend = () => {
      isListeningRef.current = false
      setIsListening(false)
      setInterimTranscript('')
      if (finalText.trim()) {
        const userMsg = { role: 'user', content: finalText.trim(), time: Date.now() }
        const newMsgs = [...messages, userMsg]
        setMessages(newMsgs)
        handleAiResponse(newMsgs)
      }
    }

    rec.onerror = (e) => {
      isListeningRef.current = false
      setIsListening(false)
      setInterimTranscript('')
      if (e.error !== 'aborted' && e.error !== 'no-speech') setError(`Mic error: ${e.error}`)
    }

    try {
      rec.start()
      isListeningRef.current = true
      setIsListening(true)
      setError('')
    } catch (err) {
      setError('Failed to start microphone. Try again.')
    }
  }, [messages, handleAiResponse])

  const startConversation = useCallback(async () => {
    if (!apiKey) { setShowSettings(true); setError('Please add your API key first.'); return }

    setMessages([])
    setTurnCount(0)
    setFeedbackSummary('')
    setError('')
    setPhase('chatting')

    const topic = selectedTopic
    const topicName = topic.en.toLowerCase()
    const greeting = topic.id === 'free'
      ? "Hey! Let's chat. What's on your mind today?"
      : `Great, let's talk about ${topicName}! ${topic.en === 'Job Interview' ? "I'll be the interviewer. Ready? Tell me about yourself." : "I'll start — " + getTopicQuestion(topic.id)}`

    const aiMsg = { role: 'assistant', content: greeting, time: Date.now() }
    setMessages([aiMsg])
    setTurnCount(1)
    await speak(greeting)
    setTimeout(() => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
          isListeningRef.current = true
          setIsListening(true)
        } catch {}
      }
    }, 300)
  }, [apiKey, selectedTopic, speak])

  function getTopicQuestion(id) {
    const q = {
      intro: "What's your name and where are you from?",
      daily: "Walk me through your typical morning.",
      hobby: "What do you enjoy doing in your free time?",
      food: "What's your all-time favorite meal?",
      travel: "What's the most interesting place you've been to?",
      work: "What do you do for work or study?",
      movie: "Seen anything good lately?",
      tech: "What app or gadget can you not live without?",
      dream: "If you could achieve one big thing in life, what would it be?",
      shopping: "What was the last thing you bought that you really liked?",
      interview: "Tell me about yourself and why you want this position.",
    }
    return q[id] || "Tell me something interesting about yourself."
  }

  const requestFeedback = useCallback(async () => {
    stopListening()
    if (synthRef.current) synthRef.current.cancel()
    setIsFinishing(true)
    setIsAiTyping(true)
    setError('')
    try {
      const feedbackMsgs = [
        ...messages,
        { role: 'user', content: 'Please give me feedback on my English. Score my grammar, vocabulary, fluency, and confidence 1-10.', time: Date.now() }
      ]
      const reply = await callAI(feedbackMsgs)
      setFeedbackSummary(reply)
      setPhase('feedback')
    } catch (err) {
      setError(err.message)
    }
    setIsAiTyping(false)
    setIsFinishing(false)
  }, [messages, stopListening, callAI])

  const resetConversation = useCallback(() => {
    stopListening()
    if (synthRef.current) synthRef.current.cancel()
    setPhase('setup')
    setMessages([])
    setTurnCount(0)
    setFeedbackSummary('')
    setError('')
    setIsFinishing(false)
  }, [stopListening])

  const fmtTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // ==================== FEEDBACK SCREEN ====================
  if (phase === 'feedback') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="card text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-1">{t('convFeedback')}</h2>
          <p className="text-sm text-gray-500 mb-1">{selectedTopic?.[lang] || selectedTopic?.en}</p>
          <p className="text-xs text-gray-400">{turnCount} {t('convExchanges')}</p>
        </div>

        <div className="card">
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: feedbackSummary
                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-brand-600 dark:text-brand-400">$1</strong>')
                .replace(/\n/g, '<br/>')
            }}
          />
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={resetConversation} className="btn-primary">
            <RotateCcw className="w-4 h-4 inline mr-2" />
            {t('convNewConv')}
          </button>
        </div>
      </div>
    )
  }

  // ==================== SETUP SCREEN ====================
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Settings */}
        <div className="card">
          <button onClick={() => setShowSettings(!showSettings)} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">{t('convApiSettings')}</span>
              {apiKey && <span className="badge bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px]">{t('convConfigured')}</span>}
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          </button>

          {showSettings && (
            <div className="mt-4 space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{t('convProvider')}</label>
                <select value={apiProvider} onChange={(e) => { setApiProvider(e.target.value); const p = PROVIDERS.find(x => x.id === e.target.value); if (p) setApiModel(p.models[0]) }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-3 text-sm">
                  {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{t('convModel')}</label>
                <select value={apiModel} onChange={(e) => setApiModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-3 text-sm">
                  {(PROVIDERS.find(p => p.id === apiProvider)?.models || []).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{t('convApiKey')}</label>
                <div className="flex gap-2">
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-3 text-sm font-mono" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {apiProvider === 'openai' ? 'platform.openai.com/api-keys' : 'openrouter.ai/keys'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Topic Selection */}
        <div>
          <h2 className="font-semibold mb-3">{t('convChooseTopic')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {topics.map(topic => (
              <button key={topic.id} onClick={() => setSelectedTopic(topic)}
                className={`card text-left ${selectedTopic?.id === topic.id ? 'ring-2 ring-brand-500 bg-brand-50 dark:bg-brand-900/10' : ''}`}>
                <span className="text-2xl block mb-1">{topic.icon}</span>
                <h3 className="font-medium text-sm">{topic[lang]}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        {selectedTopic && (
          <div className="text-center animate-slide-up">
            <button onClick={startConversation} className="btn-primary text-lg px-10 py-3">
              {t('convStart')}
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </button>
          </div>
        )}
      </div>
    )
  }

  // ==================== CHAT SCREEN ====================
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="card flex items-center justify-between !py-3 !px-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedTopic?.icon}</span>
          <div>
            <h3 className="font-semibold text-sm">{selectedTopic?.[lang]}</h3>
            <p className="text-[10px] text-gray-400">{turnCount} {t('convExchanges')}</p>
          </div>
        </div>
        <button onClick={requestFeedback} className="text-xs px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors">
          {t('convEndFeedback')}
        </button>
      </div>

      {/* Messages */}
      <div className="space-y-3 max-h-[50vh] overflow-y-auto px-1 py-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              </div>
            )}
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-brand-600 text-white rounded-br-md'
                : 'bg-gray-100 dark:bg-surface-dark-3 text-gray-800 dark:text-gray-200 rounded-bl-md'
            }`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-gray-500" />
              </div>
            )}
          </div>
        ))}

        {isAiTyping && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-brand-600" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-gray-100 dark:bg-surface-dark-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Interim transcript bubble */}
        {isListening && interimTranscript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-sm italic">
              {interimTranscript}...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Listening indicator */}
      {isListening && !interimTranscript && (
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            {t('convListening')}
          </span>
        </div>
      )}

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            {t('convSpeaking')}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="card !p-4">
        {/* Mic Button */}
        <div className="flex justify-center mb-4">
          {!isListening ? (
            <button onClick={startListening} disabled={isAiTyping || isSpeaking}
              className="w-16 h-16 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
              <Mic className="w-7 h-7" />
            </button>
          ) : (
            <button onClick={stopListening}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-lg animate-pulse active:scale-95">
              <Square className="w-7 h-7" />
            </button>
          )}
        </div>

        {/* Text Input */}
        <div className="flex gap-2">
          <input ref={inputRef} type="text" value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendText(textInput)}
            placeholder={t('convTypeHere')}
            disabled={isAiTyping || isListening}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50" />
          <button onClick={() => sendText(textInput)} disabled={!textInput.trim() || isAiTyping || isListening}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
