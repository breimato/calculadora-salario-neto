import { SalaryCalculator } from './components/calculator/SalaryCalculator.tsx'
import { ThemeToggle } from './components/ui/ThemeToggle.tsx'

export default function App() {
  return (
    <>
      <a href="#calculator-title" className="skip-link">
        Saltar al contenido principal
      </a>
      <header className="app-header">
        <ThemeToggle />
      </header>
      <main id="main-content" className="app-main">
        <SalaryCalculator />
      </main>
    </>
  )
}
