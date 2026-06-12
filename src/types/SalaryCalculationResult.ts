import type { DeductionBreakdownItem } from './DeductionBreakdownItem.ts';

export type SalaryCalculationResult = {
  annualGross: number;
  monthlyGross: number;
  annualSocialSecurity: number;
  monthlySocialSecurity: number;
  annualIrpf: number;
  monthlyIrpf: number;
  effectiveIrpfRate: number;
  annualNet: number;
  monthlyNet: number;
  personalMinimum: number;
  teleworkAllowanceAnnual: number;
  teleworkAllowancePerPayslip: number;
  breakdownItems: DeductionBreakdownItem[];
};
