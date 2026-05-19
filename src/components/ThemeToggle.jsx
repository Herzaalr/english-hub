import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import useThemeStore from '../store/themeStore'

export default function ThemeToggle() {
  const { isDark, toggle, init } = useThemeStore()

  useEffect(() => { init() }, [init])

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-surface-dark-3 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-dark"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 ${
          isDark ? 'left-7' : 'left-0.5'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-brand-500" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </div>
    </button>
  )
}
