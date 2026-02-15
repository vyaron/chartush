const THEME_KEY = 'theme'

export type Theme = 'light' | 'dark'

export function loadTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  
  return 'dark'
}

export function saveTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme)
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
}
