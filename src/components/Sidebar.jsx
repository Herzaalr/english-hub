import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Languages, Mic, Headphones, BookText,
  Volume2, Layers, Globe, Film, MessageCircle, Bot, Search,
  FlaskConical, GraduationCap, FileText, Settings, ChevronLeft,
  ChevronRight, Zap
} from 'lucide-react'
import useLangStore from '../store/langStore'
import useProgressStore from '../store/progressStore'

const mainLinks = [
  { to: '/', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/vocabulary', icon: BookOpen, key: 'vocabulary' },
  { to: '/grammar', icon: Languages, key: 'grammar' },
  { to: '/speaking', icon: Mic, key: 'speaking' },
  { to: '/listening', icon: Headphones, key: 'listening' },
  { to: '/reading', icon: BookText, key: 'reading' },
  { to: '/pronunciation', icon: Volume2, key: 'pronunciation' },
  { to: '/accent', icon: Zap, key: 'accentTrainer' },
  { to: '/flashcards', icon: Layers, key: 'flashcards' },
]

const featureLinks = [
  { to: '/slang', icon: Globe, key: 'slang' },
  { to: '/media', icon: Film, key: 'mediaAnalytics' },
  { to: '/culture', icon: MessageCircle, key: 'contextCulture' },
]

const aiLinks = [
  { to: '/pedagogy', icon: Bot, key: 'pedagogyPartner' },
  { to: '/corpus', icon: Search, key: 'slangCorpus' },
]

const researchLinks = [
  { to: '/research', icon: FlaskConical, key: 'researchMatrix' },
  { to: '/tools', icon: GraduationCap, key: 'pedagogyTools' },
  { to: '/thesis', icon: FileText, key: 'thesisTracker' },
]

function SidebarSection({ label, links, collapsed }) {
  const t = useLangStore(s => s.t)
  return (
    <div className="mb-2">
      {label && !collapsed && (
        <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {label}
        </p>
      )}
      {links.map(({ to, icon: Icon, key }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
          }
          title={collapsed ? t(key) : undefined}
        >
          <Icon className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="truncate">{t(key)}</span>}
        </NavLink>
      ))}
    </div>
  )
}

export default function Sidebar({ collapsed, onToggle }) {
  const t = useLangStore(s => s.t)
  const toggleLang = useLangStore(s => s.toggleLang)
  const { level, xp, streak } = useProgressStore()

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-50 flex flex-col
        border-r border-gray-100 dark:border-gray-800
        bg-white dark:bg-surface-dark transition-all duration-300
        w-[280px] lg:w-auto
        ${collapsed ? 'lg:w-[68px]' : 'lg:w-[240px]'}
      `}
    >
      {/* Logo — clickable to Dashboard */}
      <a href="/" className="flex items-center gap-2.5 px-4 h-14 lg:h-16 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-surface-dark-3 transition-colors">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight">
            English<span className="text-brand-500">Hub</span>
          </span>
        )}
      </a>

      {/* XP Bar */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-brand-600 dark:text-brand-400">Level {level}</span>
            <span className="text-gray-400">{xp % 500}/500 XP</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-surface-dark-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-500"
              style={{ width: `${(xp % 500) / 5}%` }}
            />
          </div>
          {streak > 0 && (
            <p className="text-[10px] text-gray-400 mt-1">🔥 {streak} {t('dayStreak').toLowerCase()}</p>
          )}
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        <SidebarSection links={mainLinks} collapsed={collapsed} />
        <SidebarSection label={collapsed ? null : 'Features'} links={featureLinks} collapsed={collapsed} />
        <SidebarSection label={collapsed ? null : 'AI Tools'} links={aiLinks} collapsed={collapsed} />
        <SidebarSection label={collapsed ? null : 'Research'} links={researchLinks} collapsed={collapsed} />
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-3 space-y-2">
        <button
          onClick={toggleLang}
          className={`sidebar-link w-full ${collapsed ? 'justify-center px-0' : ''}`}
          title="Switch language"
        >
          <Globe className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="text-xs">{t('switchLang')}</span>}
        </button>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
          }
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>{t('settings')}</span>}
        </NavLink>

        {/* Collapse Toggle — desktop only */}
        <button
          onClick={onToggle}
          className="sidebar-link w-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hidden lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px]" />
          ) : (
            <>
              <ChevronLeft className="w-[18px] h-[18px]" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
