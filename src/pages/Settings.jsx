import { useState } from 'react'
import { Settings as SettingsIcon, Globe, Palette, RotateCcw, Bell, Shield, Info } from 'lucide-react'
import useLangStore from '../store/langStore'
import useThemeStore from '../store/themeStore'
import useProgressStore from '../store/progressStore'

export default function Settings() {
  const t = useLangStore(s => s.t)
  const lang = useLangStore(s => s.lang)
  const setLang = useLangStore(s => s.setLang)
  const { isDark, toggle } = useThemeStore()
  const { resetProgress, weeklyGoal } = useProgressStore()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-gray-500" />
          {t('settings')}
        </h1>
      </div>

      {/* Language */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-brand-500" />
          <h2 className="font-semibold">{lang === 'en' ? 'Language' : 'Bahasa'}</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setLang('id')}
            className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
              lang === 'id'
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className="text-2xl">🇮🇩</span>
            <p className="text-sm font-medium mt-1">Bahasa Indonesia</p>
          </button>
          <button
            onClick={() => setLang('en')}
            className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
              lang === 'en'
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className="text-2xl">🇬🇧</span>
            <p className="text-sm font-medium mt-1">English</p>
          </button>
        </div>
      </div>

      {/* Theme */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-brand-500" />
            <div>
              <h2 className="font-semibold">{lang === 'en' ? 'Appearance' : 'Tampilan'}</h2>
              <p className="text-xs text-gray-400">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
            </div>
          </div>
          <button
            onClick={toggle}
            className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-surface-dark-3 transition-colors duration-300"
          >
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${isDark ? 'left-7' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-brand-500" />
          <h2 className="font-semibold">{lang === 'en' ? 'Data' : 'Data'}</h2>
        </div>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="btn-secondary text-sm text-red-500 hover:text-red-600"
          >
            <RotateCcw className="w-4 h-4 inline mr-1" />
            {lang === 'en' ? 'Reset All Progress' : 'Reset Semua Progres'}
          </button>
        ) : (
          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
            <p className="text-sm font-medium text-red-600 mb-2">
              {lang === 'en' ? 'Are you sure? This cannot be undone.' : 'Yakin? Ini tidak bisa dibatalkan.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { resetProgress(); setShowResetConfirm(false) }}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600"
              >
                {lang === 'en' ? 'Yes, Reset' : 'Ya, Reset'}
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="btn-secondary text-sm">
                {t('cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="card bg-gray-50 dark:bg-surface-dark-3">
        <div className="flex items-center gap-3 mb-2">
          <Info className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold text-sm">EnglishHub</h2>
        </div>
        <p className="text-xs text-gray-400">
          {lang === 'en'
            ? 'A comprehensive English learning platform built with React, TailwindCSS, and love. Features vocabulary, grammar (all 16 tenses), speaking, listening, reading, pronunciation, smart flashcards, real-world slang, media analytics, context & culture, AI pedagogy partner, research matrix, and thesis tracking.'
            : 'Platform belajar bahasa Inggris komprehensif dibuat dengan React, TailwindCSS, dan cinta. Fitur kosakata, grammar (16 tenses), speaking, listening, reading, pengucapan, kartu pintar, bahasa gaul, analisis media, konteks & budaya, mitra pedagogi AI, matriks riset, dan pelacak skripsi.'}
        </p>
        <p className="text-xs text-gray-400 mt-2">v1.0.0</p>
      </div>
    </div>
  )
}
