import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'finanzas-theme'
const LEGACY_THEME_KEYS = [
  'salario-neto-theme',
  'hipotecas-theme',
  'calculadora-interes-compuesto-theme',
]

function readStoredTheme(key: string): Theme | null {
  try {
    const storedTheme = localStorage.getItem(key)
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  } catch {
    return null
  }
  return null
}

function getStoredTheme(): Theme | null {
  for (const key of [THEME_STORAGE_KEY, ...LEGACY_THEME_KEYS]) {
    const storedTheme = readStoredTheme(key)
    if (storedTheme) return storedTheme
  }
  return null
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme(): Theme {
  const documentTheme = document.documentElement.getAttribute('data-theme')
  if (documentTheme === 'light' || documentTheme === 'dark') return documentTheme
  return getStoredTheme() ?? getSystemTheme()
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Safari modo privado u otros entornos sin almacenamiento persistente
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((previousTheme) => (previousTheme === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, toggleTheme }
}
