import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, Languages, Mic, Headphones, BookText, Volume2, Layers,
  Globe, Film, MessageCircle, Bot, Search, CheckCircle2, Circle,
  Flame, Star, Target, TrendingUp, Zap, AlertTriangle
} from 'lucide-react'
import useLangStore from '../store/langStore'
import useProgressStore from '../store/progressStore'
import useSupervisorStore from '../store/supervisorStore'

const quickActions = [
  { to: '/vocabulary', icon: BookOpen, color: 'from-blue-500 to-blue-600', key: 'vocabulary' },
  { to: '/grammar', icon: Languages, color: 'from-emerald-500 to-emerald-600', key: 'grammar' },
  { to: '/speaking', icon: Mic, color: 'from-rose-500 to-rose-600', key: 'speaking' },
  { to: '/listening', icon: Headphones, color: 'from-violet-500 to-violet-600', key: 'listening' },
  { to: '/reading', icon: BookText, color: 'from-amber-500 to-amber-600', key: 'reading' },
  { to: '/pronunciation', icon: Volume2, color: 'from-pink-500 to-pink-600', key: 'pronunciation' },
  { to: '/flashcards', icon: Layers, color: 'from-cyan-500 to-cyan-600', key: 'flashcards' },
  { to: '/slang', icon: Globe, color: 'from-orange-500 to-orange-600', key: 'slang' },
  { to: '/media', icon: Film, color: 'from-teal-500 to-teal-600', key: 'mediaAnalytics' },
  { to: '/culture', icon: MessageCircle, color: 'from-indigo-500 to-indigo-600', key: 'contextCulture' },
  { to: '/pedagogy', icon: Bot, color: 'from-purple-500 to-purple-600', key: 'pedagogyPartner' },
  { to: '/corpus', icon: Search, color: 'from-fuchsia-500 to-fuchsia-600', key: 'slangCorpus' },
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Dashboard() {
  const t = useLangStore(s => s.t)
  const navigate = useNavigate()
  const { vocabLearned, grammarCompleted, streak, xp, level, speakingMinutes, listeningMinutes, readingMinutes } = useProgressStore()
  const { tasks, toggleTask, getHighPriority } = useSupervisorStore()

  const highPriority = getHighPriority()
  const weeklyData = [45, 30, 60, 25, 50, 35, 0]
  const maxMin = Math.max(...weeklyData, 30)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t('welcomeBack')} 👋</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('keepGoing')}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard icon={<Flame className="w-5 h-5" />} label={t('dayStreak')} value={streak} color="from-orange-500 to-red-500" bg="bg-orange-50 dark:bg-orange-900/20" />
        <StatCard icon={<Star className="w-5 h-5" />} label={t('totalXP')} value={xp.toLocaleString()} color="from-amber-500 to-yellow-500" bg="bg-amber-50 dark:bg-amber-900/20" />
        <StatCard icon={<Zap className="w-5 h-5" />} label={t('level')} value={level} color="from-brand-500 to-brand-600" bg="bg-brand-50 dark:bg-brand-900/20" />
        <StatCard icon={<BookOpen className="w-5 h-5" />} label={t('wordsLearned')} value={vocabLearned} color="from-emerald-500 to-green-500" bg="bg-emerald-50 dark:bg-emerald-900/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Weekly Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm lg:text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-500" />
                {t('weeklyProgress')}
              </h2>
              <span className="text-[10px] lg:text-xs text-gray-400">Today: {weeklyData[new Date().getDay() - 1] || 0} min</span>
            </div>
            <div className="flex items-end gap-2 lg:gap-3 h-24 lg:h-32">
              {weekDays.map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gray-100 dark:bg-surface-dark-3 rounded-lg overflow-hidden relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-lg transition-all duration-700"
                      style={{ height: `${(weeklyData[i] / maxMin) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] lg:text-[10px] text-gray-400 font-medium">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="font-semibold text-sm lg:text-base mb-3">{t('quickActions')}</h2>
            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-3">
              {quickActions.map(({ to, icon: Icon, color, key }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="card group text-center py-3 px-2 hover:shadow-md"
                >
                  <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-1.5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <span className="text-[10px] lg:text-[11px] font-medium text-gray-600 dark:text-gray-300 leading-tight block">
                    {t(key)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 lg:space-y-6">
          {/* Supervisor Tasks */}
          <div className="card border-l-4 border-l-amber-500">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold text-sm">{t('supervisorTasks')}</h2>
              {highPriority.length > 0 && (
                <span className="badge bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px]">
                  {highPriority.length}
                </span>
              )}
            </div>
            <div className="space-y-2 max-h-[300px] lg:max-h-[400px] overflow-y-auto scrollbar-thin">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-all ${
                    task.done ? 'bg-gray-50 dark:bg-surface-dark-3 opacity-60' : 'bg-amber-50/50 dark:bg-amber-900/10'
                  }`}
                >
                  <button onClick={() => toggleTask(task.id)} className="mt-0.5 flex-shrink-0">
                    {task.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${task.done ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                      {task.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge text-[10px] ${
                        task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                        task.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-500'
                      }`}>{task.priority}</span>
                      {task.dueDate && (
                        <span className="text-[10px] text-gray-400">
                          {new Date(task.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Mini */}
          <div className="card">
            <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-500" />
              {t('progress')}
            </h2>
            <div className="space-y-3">
              <MiniProgress label={t('vocabulary')} current={vocabLearned} total={4000} color="bg-blue-500" />
              <MiniProgress label={t('grammar')} current={grammarCompleted} total={16} color="bg-emerald-500" />
              <MiniProgress label={t('speaking')} current={speakingMinutes} total={100} color="bg-rose-500" suffix="min" />
              <MiniProgress label={t('listening')} current={listeningMinutes} total={100} color="bg-violet-500" suffix="min" />
              <MiniProgress label={t('reading')} current={readingMinutes} total={100} color="bg-amber-500" suffix="min" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className={`stat-card ${bg}`}>
      <div className={`absolute -right-2 -top-2 w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${color} opacity-10`} />
      <div className="flex items-center gap-2.5 lg:gap-3">
        <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-xl lg:text-2xl font-bold">{value}</p>
          <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  )
}

function MiniProgress({ label, current, total, color, suffix = '' }) {
  const pct = Math.min((current / total) * 100, 100)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="text-gray-400">{current}{suffix}/{total}{suffix}</span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-surface-dark-3 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
