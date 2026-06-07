import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import useThemeStore from './store/themeStore'
import useProgressStore from './store/progressStore'

import Dashboard from './pages/Dashboard'
import Vocabulary from './pages/Vocabulary'
import Grammar from './pages/Grammar'
import Speaking from './pages/Speaking'
import Listening from './pages/Listening'
import Reading from './pages/Reading'
import Pronunciation from './pages/Pronunciation'
import Flashcards from './pages/Flashcards'
import Slang from './pages/Slang'
import MediaAnalytics from './pages/MediaAnalytics'
import ContextCulture from './pages/ContextCulture'
import PedagogyPartner from './pages/PedagogyPartner'
import SlangCorpus from './pages/SlangCorpus'
import ResearchMatrix from './pages/ResearchMatrix'
import PedagogyTools from './pages/PedagogyTools'
import ThesisTracker from './pages/ThesisTracker'
import AccentTrainer from './pages/AccentTrainer'
import Settings from './pages/Settings'

export default function App() {
  const init = useThemeStore(s => s.init)
  const updateStreak = useProgressStore(s => s.updateStreak)

  useEffect(() => {
    init()
    updateStreak()
  }, [init, updateStreak])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="vocabulary" element={<Vocabulary />} />
        <Route path="grammar" element={<Grammar />} />
        <Route path="speaking" element={<Speaking />} />
        <Route path="listening" element={<Listening />} />
        <Route path="reading" element={<Reading />} />
        <Route path="pronunciation" element={<Pronunciation />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="slang" element={<Slang />} />
        <Route path="media" element={<MediaAnalytics />} />
        <Route path="culture" element={<ContextCulture />} />
        <Route path="pedagogy" element={<PedagogyPartner />} />
        <Route path="corpus" element={<SlangCorpus />} />
        <Route path="research" element={<ResearchMatrix />} />
        <Route path="tools" element={<PedagogyTools />} />
        <Route path="thesis" element={<ThesisTracker />} />
        <Route path="accent" element={<AccentTrainer />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
