import { useState } from 'react'
import { GraduationCap, Check, AlertTriangle, FileText, BookOpen } from 'lucide-react'
import useLangStore from '../store/langStore'

export default function PedagogyTools() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const [draftText, setDraftText] = useState('')
  const [analysis, setAnalysis] = useState(null)

  const analyzeDraft = () => {
    if (!draftText.trim()) return
    const sentences = draftText.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = draftText.split(/\s+/).filter(Boolean)
    const avgSentenceLength = words.length / Math.max(sentences.length, 1)
    const complexWords = words.filter(w => w.length > 6).length
    const passiveVoice = (draftText.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || []).length

    // Readability approximation (Flesch-like)
    const readabilityScore = Math.max(0, Math.min(100, 206.835 - (1.015 * avgSentenceLength) - (84.6 * (complexWords / words.length))))
    const grade = readabilityScore > 80 ? 'Easy (Grade 5-6)' :
                  readabilityScore > 60 ? 'Standard (Grade 7-8)' :
                  readabilityScore > 40 ? 'Difficult (Grade 9-12)' :
                  'Very Difficult (College+)'

    const issues = []
    if (avgSentenceLength > 25) issues.push({ type: 'warning', text: lang === 'en' ? 'Average sentence length is high. Try breaking up long sentences.' : 'Rata-rata kalimat terlalu panjang. Coba pecah kalimat panjang.' })
    if (passiveVoice > 2) issues.push({ type: 'warning', text: lang === 'en' ? `Found ${passiveVoice} passive voice instances. Active voice is usually clearer.` : `Ditemukan ${passiveVoice} kalimat pasif. Kalimat aktif biasanya lebih jelas.` })
    if (complexWords / words.length > 0.3) issues.push({ type: 'info', text: lang === 'en' ? 'High proportion of complex words. Consider simplifying for broader audience.' : 'Proporsi kata kompleks tinggi. Pertimbangkan menyederhanakan.' })
    if (issues.length === 0) issues.push({ type: 'success', text: lang === 'en' ? 'Looking good! Clear and readable text.' : 'Bagus! Teks jelas dan mudah dibaca.' })

    setAnalysis({
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgSentenceLength: avgSentenceLength.toFixed(1),
      complexWords,
      passiveVoice,
      readabilityScore: readabilityScore.toFixed(0),
      grade,
      issues,
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-indigo-500" />
          {t('pedagogyTools')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {lang === 'en'
            ? 'Check your teaching drafts, papers, and materials for readability and quality.'
            : 'Cek draf materi ajar, paper, dan materi untuk keterbacaan dan kualitas.'}
        </p>
      </div>

      {/* Draft Checker */}
      <div className="card">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          {lang === 'en' ? 'Draft Readability Checker' : 'Pemeriksa Keterbacaan Draf'}
        </h2>
        <textarea
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          placeholder={lang === 'en' ? 'Paste your teaching material, paper draft, or any English text here...' : 'Tempel materi ajar, draf paper, atau teks bahasa Inggris di sini...'}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-surface-dark-3 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[200px] resize-y"
        />
        <button onClick={analyzeDraft} className="btn-primary mt-3">
          {lang === 'en' ? 'Analyze Draft' : 'Analisis Draf'}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4 animate-slide-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card text-center">
              <p className="text-2xl font-bold text-indigo-500">{analysis.wordCount}</p>
              <p className="text-xs text-gray-400">{lang === 'en' ? 'Words' : 'Kata'}</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-indigo-500">{analysis.sentenceCount}</p>
              <p className="text-xs text-gray-400">{lang === 'en' ? 'Sentences' : 'Kalimat'}</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-indigo-500">{analysis.avgSentenceLength}</p>
              <p className="text-xs text-gray-400">{lang === 'en' ? 'Avg Words/Sentence' : 'Rata-kata Kata/Kalimat'}</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-indigo-500">{analysis.readabilityScore}</p>
              <p className="text-xs text-gray-400">{lang === 'en' ? 'Readability' : 'Keterbacaan'}</p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-sm mb-2">
              {lang === 'en' ? 'Reading Level' : 'Level Baca'}: {analysis.grade}
            </h3>
            <div className="h-3 bg-gray-100 dark:bg-surface-dark-3 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  analysis.readabilityScore > 60 ? 'bg-emerald-500' : analysis.readabilityScore > 40 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${analysis.readabilityScore}%` }}
              />
            </div>

            <div className="space-y-2">
              {analysis.issues.map((issue, i) => (
                <div key={i} className={`p-3 rounded-xl flex items-start gap-2 ${
                  issue.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/10' :
                  issue.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10' :
                  'bg-blue-50 dark:bg-blue-900/10'
                }`}>
                  {issue.type === 'success' ? <Check className="w-4 h-4 text-emerald-500 mt-0.5" /> :
                   issue.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" /> :
                   <BookOpen className="w-4 h-4 text-blue-500 mt-0.5" />}
                  <p className="text-sm">{issue.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
