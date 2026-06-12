import {
  FINANCE_HUB_PATH,
  FINANCE_SERVICES,
  type FinanceServiceId,
} from '../../data/financeServices.ts'

interface FinanceNavProps {
  currentServiceId: Exclude<FinanceServiceId, 'hub'>
}

export function FinanceNav({ currentServiceId }: FinanceNavProps) {
  return (
    <nav className="finance-nav" aria-label="Navegación de calculadoras">
      <a href={FINANCE_HUB_PATH} className="finance-nav__link">
        Inicio
      </a>
      {FINANCE_SERVICES.map((service) => (
        <a
          key={service.id}
          href={service.href}
          className="finance-nav__link"
          aria-current={service.id === currentServiceId ? 'page' : undefined}
        >
          {service.title}
        </a>
      ))}
    </nav>
  )
}
