import { DEFAULT_TELEWORK_ALLOWANCE_PER_PAYSLIP } from '../data/teleworkAllowance.ts';

export interface SalaryFormData {
  grossSalary: number;
  grossSalaryPeriod: 'annual' | 'monthly';
  payPeriods: 12 | 14;
  contractType: 'indefinido' | 'temporal';
  ccaa: string;
  maritalStatus: 'single' | 'married';
  children: 0 | 1 | 2 | 3 | 4 | 5;
  isTeleworking: boolean;
  teleworkAllowancePerPayslip: number;
  irpfMode: 'auto' | 'manual';
  manualIrpfRate: number;
}

export const DEFAULT_SALARY_FORM_DATA: SalaryFormData = {
  grossSalary: 36_000,
  grossSalaryPeriod: 'annual',
  payPeriods: 12,
  contractType: 'indefinido',
  ccaa: 'madrid',
  maritalStatus: 'single',
  children: 0,
  isTeleworking: false,
  teleworkAllowancePerPayslip: DEFAULT_TELEWORK_ALLOWANCE_PER_PAYSLIP,
  irpfMode: 'auto',
  manualIrpfRate: 0,
};
