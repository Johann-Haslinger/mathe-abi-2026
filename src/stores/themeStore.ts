import { create } from 'zustand'

export type ThemePreference = 'system' | 'light' | 'dark'
export type EffectiveTheme = 'light' | 'dark'

const STORAGE_KEY = 'spina.themePreference'

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  return 'system'
}

function getSystemTheme(): EffectiveTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function computeEffective(preference: ThemePreference, systemTheme: EffectiveTheme): EffectiveTheme {
  if (preference === 'system') return systemTheme
  return preference
}

type ThemeState = {
  preference: ThemePreference
  effectiveTheme: EffectiveTheme
  setPreference: (next: ThemePreference) => void
  setSystemTheme: (systemTheme: EffectiveTheme) => void
}

export const useThemeStore = create<ThemeState>((set, get) => {
  const preference = readStoredPreference()
  const systemTheme = getSystemTheme()

  return {
    preference,
    effectiveTheme: computeEffective(preference, systemTheme),

    setPreference: (next) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next)
      }
      const currentSystem = getSystemTheme()
      set({ preference: next, effectiveTheme: computeEffective(next, currentSystem) })
    },

    setSystemTheme: (systemTheme) => {
      const pref = get().preference
      if (pref !== 'system') return
      set({ effectiveTheme: computeEffective(pref, systemTheme) })
    },
  }
})

