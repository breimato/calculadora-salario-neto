import { useTheme } from '../../hooks/useTheme.ts'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDarkTheme = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDarkTheme ? 'Activar modo claro' : 'Activar modo oscuro'}
      aria-pressed={isDarkTheme}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDarkTheme ? '☀' : '☽'}
      </span>
      <span className="theme-toggle__label">{isDarkTheme ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  )
}
