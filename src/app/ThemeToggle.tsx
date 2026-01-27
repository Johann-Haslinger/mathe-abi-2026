import { Monitor, Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'

export function ThemeToggle(props: { className?: string }) {
  const preference = useThemeStore((s) => s.preference)
  const setPreference = useThemeStore((s) => s.setPreference)

  const ThemeIcon = preference === 'dark' ? Moon : preference === 'light' ? Sun : Monitor

  return (
    <button
      type="button"
      onClick={() => {
        const next = preference === 'system' ? 'light' : preference === 'light' ? 'dark' : 'system'
        setPreference(next)
      }}
      className={
        props.className ??
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm text-black dark:text-white/80 hover:bg-black/10 dark:hover:bg-white/10'
      }
      title="Theme wechseln (System/Light/Dark)"
      aria-label="Theme wechseln (System/Light/Dark)"
    >
      <ThemeIcon className="h-4 w-4" />
      <span className="hidden sm:inline">
        {preference === 'system' ? 'System' : preference === 'light' ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}

