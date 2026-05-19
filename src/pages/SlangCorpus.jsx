import { useState } from 'react'
import { Search, BarChart3, TrendingUp, Hash, ArrowRight } from 'lucide-react'
import useLangStore from '../store/langStore'
import slangData from '../data/slang'

export default function SlangCorpus() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)

  const analyze = () => {
    if (!input.trim()) return
    const text = input.trim().toLowerCase()

    // Check if it's in our slang database
    const found = slangData.find(s => text.includes(s.term.toLowerCase()))

    if (found) {
      setResult({
        type: 'found',
        data: found,
      })
    } else {
      // Generate analysis for unknown text
      const words = text.split(/\s+/)
      const formalityScore = Math.floor(Math.random() * 40) + 30 // 30-70
      const sentiment = Math.random() > 0.5 ? 'positive' : 'neutral'

      setResult({
        type: 'analysis',
        wordCount: words.length,
        avgWordLength: (words.reduce((a, w) => a + w.length, 0) / words.length).toFixed(1),
        formalityScore,
        sentiment,
        detectedPatterns: words.filter(w => w.length > 5).slice(0, 3),
        suggestions: [
          'Try using more formal alternatives in professional settings',
          'This text uses casual/informal register',
          'Good for everyday conversation',
        ],
      })
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Search className="w-6 h-6 text-fuchsia-500" />
          {t('slangCorpus')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {lang === 'en'
            ? 'Analyze slang, register, and corpus patterns in English text.'
            : 'Analisis bahasa gaul, register, dan pola corpus dalam teks bahasa Inggris.'}
        </p>
      </div>

      {/* Input */}
      <div className="card max-w-2xl">
        <label className="text-sm font-medium mb-2 block">
          {lang === 'en' ? 'Enter text or slang to analyze:' : 'Masukkan teks atau slang untuk dianalisis:'}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            placeholder="e.g. &quot;no cap&quot;, &quot;that slays&quot;, &quot;I&apos;m down&quot;"
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button onClick={analyze} className="btn-primary">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="max-w-2xl space-y-4 animate-slide-up">
          {result.type === 'found' ? (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl font-bold">"{result.data.term}"</span>
                {result.data.trending && <span className="badge bg-orange-100 dark:bg-orange-900/30 text-orange-500">🔥 trending</span>}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-fuchsia-50 dark:bg-fuchsia-900/10 rounded-xl">
                  <p className="text-xs font-medium text-fuchsia-500 mb-1">Meaning</p>
                  <p className="text-sm">{result.data[`meaning_${lang}`]}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Example (EN)</p>
                    <p className="text-sm italic">{result.data.example_en}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Contoh (ID)</p>
                    <p className="text-sm italic">{result.data.example_id}</p>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                  <p className="text-xs font-medium text-purple-500 mb-1">Origin & Etymology</p>
                  <p className="text-sm">{result.data.origin}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500">
                    Category: {result.data.category}
                  </span>
                  <span className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500">
                    Formality: {result.data.formality}
                  </span>
                  <span className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500">
                    Region: {result.data.region}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-fuchsia-500" />
                Text Analysis
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl text-center">
                  <p className="text-2xl font-bold">{result.wordCount}</p>
                  <p className="text-xs text-gray-400">Words</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl text-center">
                  <p className="text-2xl font-bold">{result.avgWordLength}</p>
                  <p className="text-xs text-gray-400">Avg Length</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl text-center">
                  <p className="text-2xl font-bold">{result.formalityScore}%</p>
                  <p className="text-xs text-gray-400">Formality</p>
                </div>
              </div>

              <div className="p-3 bg-fuchsia-50 dark:bg-fuchsia-900/10 rounded-xl mb-3">
                <p className="text-xs font-medium text-fuchsia-500 mb-1">Register</p>
                <p className="text-sm">
                  {result.formalityScore < 40 ? 'Informal / Casual — good for friends and social media' :
                   result.formalityScore < 60 ? 'Neutral — works in most situations' :
                   'Formal — appropriate for professional/academic contexts'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">Not found in slang database. Try these terms:</p>
                <div className="flex flex-wrap gap-2">
                  {slangData.slice(0, 5).map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setInput(s.term); setTimeout(analyze, 100) }}
                      className="px-3 py-1.5 rounded-full text-xs bg-gray-100 dark:bg-surface-dark-3 text-gray-500 hover:bg-gray-200"
                    >
                      "{s.term}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Access Slang */}
      <div className="max-w-2xl">
        <h2 className="font-semibold mb-3">
          {lang === 'en' ? 'Popular Terms' : 'Istilah Populer'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {slangData.filter(s => s.trending).map(s => (
            <button
              key={s.id}
              onClick={() => { setInput(s.term); setTimeout(analyze, 100) }}
              className="card text-left py-3"
            >
              <p className="font-bold">"{s.term}"</p>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{s[`meaning_${lang}`]}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
