export type FinanceServiceId = 'hub' | 'salario-neto' | 'hipoteca' | 'calculadora-intereses'

export interface FinanceService {
  id: FinanceServiceId
  title: string
  href: string
}

export const FINANCE_HUB_PATH = '/finanzas/'

export const FINANCE_SERVICES: FinanceService[] = [
  { id: 'salario-neto', title: 'Salario neto', href: '/salario-neto/' },
  { id: 'hipoteca', title: 'Hipoteca', href: '/hipoteca/' },
  { id: 'calculadora-intereses', title: 'Interés compuesto', href: '/calculadora-intereses/' },
]
