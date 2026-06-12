import type { PayPeriods } from '../types/SalaryCalculationInput.ts';

export const DEFAULT_TELEWORK_ALLOWANCE_PER_PAYSLIP = 40;

export function calculateTeleworkAllowanceAnnual(
  isTeleworking: boolean,
  allowancePerPayslip: number,
  payPeriods: PayPeriods,
): number {
  if (!isTeleworking || allowancePerPayslip <= 0) {
    return 0;
  }

  return allowancePerPayslip * payPeriods;
}
