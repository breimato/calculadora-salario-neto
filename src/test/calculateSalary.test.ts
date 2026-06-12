import { describe, expect, it } from 'vitest'
import {
  AutonomousCommunity,
  ContractType,
  GrossSalaryPeriod,
  IrpfMode,
  MaritalStatus,
  PayPeriods,
  type SalaryCalculationInput,
} from '../types/SalaryCalculationInput.ts'
import { calculateSalary } from '../lib/salary/calculateSalary.ts'
import { DEFAULT_TELEWORK_ALLOWANCE_PER_PAYSLIP } from '../data/teleworkAllowance.ts'

function createSalaryCalculationInput(
  salaryCalculationInputOverrides: Partial<SalaryCalculationInput> = {},
): SalaryCalculationInput {
  return {
    grossSalary: 30_000,
    grossSalaryPeriod: GrossSalaryPeriod.ANNUAL,
    payPeriods: PayPeriods.FOURTEEN,
    contractType: ContractType.INDEFINIDO,
    autonomousCommunity: AutonomousCommunity.MADRID,
    maritalStatus: MaritalStatus.SINGLE,
    children: 0,
    isTeleworking: false,
    teleworkAllowancePerPayslip: DEFAULT_TELEWORK_ALLOWANCE_PER_PAYSLIP,
    irpfMode: IrpfMode.AUTO,
    manualIrpfRate: 0,
    ...salaryCalculationInputOverrides,
  }
}

describe('calculateSalary', () => {
  /** Benchmark El País / Cinco Días: 36k Madrid 12 pagas. */
  it('execute_whenAnnualGross36kMadrid12Pagas_thenMatchesElPaisBenchmark', () => {
    // Given
    const salaryCalculationInput = createSalaryCalculationInput({
      grossSalary: 36_000,
      payPeriods: PayPeriods.TWELVE,
    })

    // When
    const salaryCalculationResult = calculateSalary(salaryCalculationInput)

    // Then
    expect(salaryCalculationResult.annualSocialSecurity).toBeCloseTo(2332.8, 1)
    expect(salaryCalculationResult.annualIrpf).toBeGreaterThanOrEqual(6600)
    expect(salaryCalculationResult.annualIrpf).toBeLessThanOrEqual(6610)
    expect(salaryCalculationResult.monthlyNet).toBeGreaterThanOrEqual(2250)
    expect(salaryCalculationResult.monthlyNet).toBeLessThanOrEqual(2256)
    expect(salaryCalculationResult.effectiveIrpfRate).toBeGreaterThanOrEqual(18.3)
    expect(salaryCalculationResult.effectiveIrpfRate).toBeLessThanOrEqual(18.4)
  })

  /** Test execute when telework enabled then monthly net increases by allowance without changing IRPF. */
  it('execute_whenTeleworkEnabled_thenMonthlyNetIncreasesByAllowanceAndIrpfUnchanged', () => {
    // Given
    const withoutTelework = createSalaryCalculationInput({
      grossSalary: 36_000,
      payPeriods: PayPeriods.TWELVE,
      isTeleworking: false,
    })
    const withTelework = createSalaryCalculationInput({
      grossSalary: 36_000,
      payPeriods: PayPeriods.TWELVE,
      isTeleworking: true,
      teleworkAllowancePerPayslip: 40,
    })

    // When
    const withoutTeleworkResult = calculateSalary(withoutTelework)
    const withTeleworkResult = calculateSalary(withTelework)

    // Then
    expect(withTeleworkResult.annualIrpf).toBe(withoutTeleworkResult.annualIrpf)
    expect(withTeleworkResult.effectiveIrpfRate).toBe(withoutTeleworkResult.effectiveIrpfRate)
    expect(withTeleworkResult.monthlyNet).toBeCloseTo(
      withoutTeleworkResult.monthlyNet + 40,
      2,
    )
    expect(withTeleworkResult.teleworkAllowanceAnnual).toBe(480)
  })

  /** Test execute when manual IRPF 15 percent then monthly net is lower than auto. */
  it('execute_whenManualIrpf15Percent_thenMonthlyNetDiffersFromAuto', () => {
    // Given
    const autoSalaryCalculationInput = createSalaryCalculationInput()
    const manualSalaryCalculationInput = createSalaryCalculationInput({
      irpfMode: IrpfMode.MANUAL,
      manualIrpfRate: 15,
    })

    // When
    const autoSalaryCalculationResult = calculateSalary(autoSalaryCalculationInput)
    const manualSalaryCalculationResult = calculateSalary(manualSalaryCalculationInput)

    // Then
    expect(manualSalaryCalculationResult.monthlyNet).not.toBe(autoSalaryCalculationResult.monthlyNet)
  })

  /** Test execute when one child then annual IRPF is lower than zero children. */
  it('execute_whenOneChild_thenAnnualIrpfLowerThanZeroChildren', () => {
    // Given
    const zeroChildrenSalaryCalculationInput = createSalaryCalculationInput({ children: 0 })
    const oneChildSalaryCalculationInput = createSalaryCalculationInput({ children: 1 })

    // When
    const zeroChildrenSalaryCalculationResult = calculateSalary(zeroChildrenSalaryCalculationInput)
    const oneChildSalaryCalculationResult = calculateSalary(oneChildSalaryCalculationInput)

    // Then
    expect(oneChildSalaryCalculationResult.annualIrpf).toBeLessThan(
      zeroChildrenSalaryCalculationResult.annualIrpf,
    )
  })
})
