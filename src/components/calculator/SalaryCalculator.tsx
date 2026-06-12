import { useSalaryCalculator } from '../../hooks/useSalaryCalculator.ts'
import { Input } from '../ui/Input.tsx'
import { Select } from '../ui/Select.tsx'
import { Toggle } from '../ui/Toggle.tsx'
import type { SalaryFormData } from '../../types/salary.ts'
import type { SalaryCalculationResult } from '../../types/SalaryCalculationResult.ts'
import { SalaryCalculationError } from '../../lib/errors/SalaryCalculationError.ts'

const CCAA_OPTIONS = [
  { value: 'madrid', label: 'Madrid' },
  { value: 'cataluna', label: 'Cataluña' },
  { value: 'valencia', label: 'Comunidad Valenciana' },
  { value: 'andalucia', label: 'Andalucía' },
  { value: 'pais_vasco', label: 'País Vasco' },
  { value: 'galicia', label: 'Galicia' },
  { value: 'castilla_leon', label: 'Castilla y León' },
  { value: 'castilla_mancha', label: 'Castilla-La Mancha' },
  { value: 'canarias', label: 'Canarias' },
  { value: 'aragon', label: 'Aragón' },
  { value: 'murcia', label: 'Murcia' },
  { value: 'extremadura', label: 'Extremadura' },
  { value: 'baleares', label: 'Baleares' },
  { value: 'asturias', label: 'Asturias' },
  { value: 'navarra', label: 'Navarra' },
  { value: 'cantabria', label: 'Cantabria' },
  { value: 'la_rioja', label: 'La Rioja' },
  { value: 'ceuta', label: 'Ceuta' },
  { value: 'melilla', label: 'Melilla' },
]

const PAY_PERIODS_OPTIONS = [
  { value: '12', label: '12 pagas' },
  { value: '14', label: '14 pagas' },
]

const CONTRACT_TYPE_OPTIONS = [
  { value: 'indefinido', label: 'Indefinido' },
  { value: 'temporal', label: 'Temporal' },
]

const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Soltero/a' },
  { value: 'married', label: 'Casado/a' },
]

const CHILDREN_OPTIONS = [
  { value: '0', label: '0 hijos' },
  { value: '1', label: '1 hijo' },
  { value: '2', label: '2 hijos' },
  { value: '3', label: '3 hijos' },
  { value: '4', label: '4 hijos' },
  { value: '5', label: '5 hijos' },
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPercent(value: number): string {
  return `${value.toLocaleString('es-ES', { maximumFractionDigits: 2 })} %`
}

interface ResultsPanelProps {
  salaryFormData: SalaryFormData
  salaryCalculationResult: SalaryCalculationResult | null
  salaryCalculationError: SalaryCalculationError | null
}

function ResultsPanel({
  salaryFormData,
  salaryCalculationResult,
  salaryCalculationError,
}: ResultsPanelProps) {
  if (salaryCalculationError !== null) {
    return (
      <aside className="calculator-results" aria-live="polite">
        <div role="alert" className="results-error">
          <p>{salaryCalculationError.message}</p>
          <p className="form-hint">
            Revisa el salario bruto y el tipo de IRPF manual introducido.
          </p>
        </div>
      </aside>
    )
  }

  if (salaryCalculationResult === null) {
    return null
  }

  return (
    <aside className="calculator-results" aria-live="polite" aria-atomic="true">
      <p className="calculator-results__eyebrow">Tu salario neto estimado</p>
      <p className="calculator-results__monthly">
        {formatCurrency(salaryCalculationResult.monthlyNet)}
        <span className="calculator-results__period">
          /{salaryFormData.payPeriods === 14 ? 'paga' : 'mes'}
        </span>
      </p>

      <dl className="calculator-results__stats">
        <div>
          <dt>Bruto anual</dt>
          <dd>{formatCurrency(salaryCalculationResult.annualGross)}</dd>
        </div>
        <div>
          <dt>Retenciones IRPF</dt>
          <dd>{formatCurrency(salaryCalculationResult.annualIrpf)}</dd>
        </div>
        <div>
          <dt>Cuotas Seguridad Social</dt>
          <dd>{formatCurrency(salaryCalculationResult.annualSocialSecurity)}</dd>
        </div>
        <div>
          <dt>Sueldo neto anual</dt>
          <dd>{formatCurrency(salaryCalculationResult.annualNet)}</dd>
        </div>
        <div>
          <dt>Tipo retención sobre la nómina</dt>
          <dd>{formatPercent(salaryCalculationResult.effectiveIrpfRate)}</dd>
        </div>
      </dl>

      <p className="calculator-results__note">
        {salaryFormData.irpfMode === 'auto'
          ? 'Cálculo estimado según tramos estatal y autonómico y mínimo personal.'
          : 'IRPF aplicado con el tipo manual que has indicado.'}
        {salaryFormData.isTeleworking &&
          ` Complemento teletrabajo: +${formatCurrency(salaryCalculationResult.teleworkAllowancePerPayslip)} por nómina.`}
      </p>

      <details className="calculator-results__details">
        <summary>Ver desglose</summary>
        <table className="results-breakdown">
          <tbody>
            {salaryCalculationResult.breakdownItems.map((breakdownItem) => (
              <tr key={breakdownItem.label}>
                <td>{breakdownItem.label}</td>
                <td>{formatCurrency(breakdownItem.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </aside>
  )
}

export function SalaryCalculator() {
  const {
    formData,
    updateFormData,
    salaryCalculationResult,
    salaryCalculationError,
  } = useSalaryCalculator()

  const grossSalaryHint =
    formData.grossSalaryPeriod === 'annual'
      ? 'importe anual en euros'
      : 'importe mensual en euros'

  return (
    <div className="calculator-layout">
      <section className="calculator-form" aria-labelledby="calculator-title">
        <header className="calculator-form__header">
          <h1 id="calculator-title">Calculadora de salario neto</h1>
          <p className="form-hint">
            Introduce tu salario bruto y situación personal. El neto se actualiza al instante.
          </p>
        </header>

        <div className="calculator-form__fields">
          <Input
            label="Salario bruto"
            type="number"
            inputMode="decimal"
            min={0}
            step={100}
            value={formData.grossSalary}
            onChange={(event) =>
              updateFormData({ grossSalary: Number(event.target.value) || 0 })
            }
            hint={grossSalaryHint}
          />

          <Toggle
            label="Introducir salario mensual"
            description="Desactivado: introduces el bruto anual. Activado: introduces el bruto mensual."
            checked={formData.grossSalaryPeriod === 'monthly'}
            onChange={(event) =>
              updateFormData({
                grossSalaryPeriod: event.target.checked ? 'monthly' : 'annual',
              })
            }
          />

          <div className="calculator-form__row">
            <Select
              label="Número de pagas"
              options={PAY_PERIODS_OPTIONS}
              value={String(formData.payPeriods)}
              onChange={(event) =>
                updateFormData({
                  payPeriods: Number(event.target.value) as SalaryFormData['payPeriods'],
                })
              }
            />
            <Select
              label="Tipo de contrato"
              options={CONTRACT_TYPE_OPTIONS}
              value={formData.contractType}
              onChange={(event) =>
                updateFormData({
                  contractType: event.target.value as SalaryFormData['contractType'],
                })
              }
            />
          </div>

          <div className="calculator-form__row">
            <Select
              label="Comunidad autónoma"
              options={CCAA_OPTIONS}
              value={formData.ccaa}
              onChange={(event) => updateFormData({ ccaa: event.target.value })}
            />
            <Select
              label="Estado civil"
              options={MARITAL_STATUS_OPTIONS}
              value={formData.maritalStatus}
              onChange={(event) =>
                updateFormData({
                  maritalStatus: event.target.value as SalaryFormData['maritalStatus'],
                })
              }
            />
          </div>

          <Select
            label="Hijos a cargo"
            options={CHILDREN_OPTIONS}
            value={String(formData.children)}
            onChange={(event) =>
              updateFormData({
                children: Number(event.target.value) as SalaryFormData['children'],
              })
            }
          />

          <fieldset className="calculator-form__taxes">
            <legend className="form-label">Teletrabajo</legend>
            <Toggle
              label="Teletrabajo habitual"
              description="Suma un complemento en cada nómina (no modifica la retención de IRPF)."
              checked={formData.isTeleworking}
              onChange={(event) =>
                updateFormData({ isTeleworking: event.target.checked })
              }
            />
            {formData.isTeleworking && (
              <Input
                label="Complemento por nómina"
                type="number"
                inputMode="decimal"
                min={0}
                step={1}
                value={formData.teleworkAllowancePerPayslip}
                onChange={(event) =>
                  updateFormData({
                    teleworkAllowancePerPayslip: Number(event.target.value) || 0,
                  })
                }
                hint="Importe neto extra en cada paga (p. ej. 40 €)."
              />
            )}
          </fieldset>

          <fieldset className="calculator-form__taxes">
            <legend className="form-label">Retención de IRPF</legend>
            <Toggle
              label="Introducir IRPF manualmente"
              description="Desactivado: calculamos el tipo según tus datos. Activado: introduces el porcentaje de retención."
              checked={formData.irpfMode === 'manual'}
              onChange={(event) =>
                updateFormData({
                  irpfMode: event.target.checked ? 'manual' : 'auto',
                })
              }
            />

            {formData.irpfMode === 'manual' ? (
              <Input
                label="Tipo de IRPF"
                type="number"
                inputMode="decimal"
                min={0}
                max={50}
                step={0.1}
                value={formData.manualIrpfRate}
                onChange={(event) =>
                  updateFormData({ manualIrpfRate: Number(event.target.value) || 0 })
                }
                hint="% sobre la base de retención"
              />
            ) : (
              salaryCalculationResult !== null && (
                <Input
                  label="Tipo de IRPF calculado"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  value={formatPercent(salaryCalculationResult.effectiveIrpfRate)}
                  hint="Tipo sobre el bruto anual."
                  aria-readonly="true"
                />
              )
            )}
          </fieldset>
        </div>
      </section>

      <ResultsPanel
        salaryFormData={formData}
        salaryCalculationResult={salaryCalculationResult}
        salaryCalculationError={salaryCalculationError}
      />
    </div>
  )
}
