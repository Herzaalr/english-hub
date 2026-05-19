import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import useLangStore from '../store/langStore'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const lang = useLangStore(s => s.lang)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 min-h-screen ${
          collapsed ? 'ml-[68px]' : 'ml-[240px]'
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-end px-6 gap-4 bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
            H
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8 max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
