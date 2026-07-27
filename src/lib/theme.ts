export type Theme = 'light' | 'dark'

// Keep in sync with the inline anti-flash script in index.html — that script
// runs before this module loads, so it can't import this constant directly.
export const THEME_STORAGE_KEY = 'pawn-calculator-theme'

export function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}
