import { useState } from 'react'
import { Globe, Search, TrendingUp, Filter } from 'lucide-react'
import useLangStore from '../store/langStore'
import slangData from '../data/slang'

const categoryFilters = ['all', 'compliment', 'truth', 'agreement', 'skill', 'behavior', 'feelings', 'advice', 'reaction', 'expression', 'opinion']

export default function Slang() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [showTrendingOnly, setShowTrendingOnly] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const filtered = slangData.filter(s => {
    if (category !== 'all' && s.category !== category) return false
    if (showTrendingOnly && !s.trending) return false
    if (search && !s.term.toLowerCase().includes(search.toLowerCase()) && !s[`meaning_${lang}`].toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="w-6 h-6 text-orange-500" />
          {t('slangTitle')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('slangSubtitle')}</p>
      </div>

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
        <button
          onClick={() => setShowTrendingOnly(!showTrendingOnly)}
          className={`btn-${showTrendingOnly ? 'primary' : 'secondary'} text-sm`}
        >
          <TrendingUp className="w-4 h-4 inline mr-1" />
          {t('trending')}
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {categoryFilters.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              category === c
                ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 ring-1 ring-brand-300'
                : 'bg-gray-100 dark:bg-surface-dark-3 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      {/* Slang Cards */}
      <div className="grid gap-3">
        {filtered.map((slang) => (
          <div
            key={slang.id}
            className="card cursor-pointer"
            onClick={() => setExpandedId(expandedId === slang.id ? null : slang.id)}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">"{slang.term}"</h3>
                  {slang.trending && (
                    <span className="badge bg-orange-100 dark:bg-orange-900/30 text-orange-500">🔥 trending</span>
                  )}
                  <span className="badge bg-gray-100 dark:bg-surface-dark-3 text-gray-500">{slang.category}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{slang[`meaning_${lang}`]}</p>
              </div>
            </div>

            {expandedId === slang.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 animate-slide-up">
                <div className="p-3 bg-gray-50 dark:bg-surface-dark-3 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">English Example</p>
                  <p className="text-sm italic">{slang.example_en}</p>
                </div>
                <div className="p-3 bg-brand-50 dark:bg-brand-900/10 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Contoh Indonesia</p>
                  <p className="text-sm italic">{slang.example_id}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                  <p className="text-xs font-medium text-purple-500 mb-1">Origin</p>
                  <p className="text-sm">{slang.origin}</p>
                </div>
                <p className="text-xs text-gray-400">Region: {slang.region}</p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">{t('noResults')}</p>
        )}
      </div>
    </div>
  )
}
