import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import { Menu, X } from 'lucide-react'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop: always visible, mobile: drawer */}
      <div className={`
        lg:block
        ${mobileOpen ? 'block' : 'hidden'}
      `}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Main Content */}
      <main className={`
        min-h-screen transition-all duration-300
        lg:ml-[240px]
        ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'}
      `}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-14 lg:h-16 flex items-center justify-between px-4 lg:px-6 bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-surface-dark-3"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Mobile Logo — clickable to Dashboard */}
          <button
            onClick={() => window.location.href = '/'}
            className="lg:hidden font-bold text-sm"
          >
            English<span className="text-brand-500">Hub</span>
          </button>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
              H
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8 max-w-[1400px] pb-24 lg:pb-8">
          <Outlet />

          {/* Footer */}
          <footer className="mt-12 pb-6 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Created by <span className="font-semibold text-gray-500 dark:text-gray-400">Herzaalr</span>
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
