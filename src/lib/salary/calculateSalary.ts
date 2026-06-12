import {
  DeductionBreakdownCategory,
  type DeductionBreakdownItem,
} from '../../types/DeductionBreakdownItem.ts';
import { calculateTeleworkAllowanceAnnual } from '../../data/teleworkAllowance.ts';
import {
  IrpfMode,
  type SalaryCalculationInput,
} from '../../types/SalaryCalculationInput.ts';
import type { SalaryCalculationResult } from '../../types/SalaryCalculationResult.ts';
import {
  SalaryCalculationError,
  SalaryCalculationErrorCode,
} from '../errors/SalaryCalculationError.ts';
import { roundCurrency } from './applyProgressiveBrackets.ts';
import {
  calculateIrpfAutomatic,
  calculateIrpfManual,
} from './calculateIrpf.ts';
import { calculateSocialSecurity } from './calculateSocialSecurity.ts';

export function calculateSalary(
  salaryCalculationInput: SalaryCalculationInput,
): SalaryCalculationResult {
  validateSalaryCalculationInput(salaryCalculationInput);

  const annualGross = roundCurrency(salaryCalculationInput.grossSalary);
  const socialSecurity = calculateSocialSecurity(
    annualGross,
    salaryCalculationInput.contractType,
  );
  const baseRetencion = roundCurrency(
    annualGross - socialSecurity.annualTotal,
  );
  const payPeriods = salaryCalculationInput.payPeriods;
  const teleworkAllowancePerPayslip = salaryCalculationInput.isTeleworking
    ? salaryCalculationInput.teleworkAllowancePerPayslip
    : 0;
  const teleworkAllowanceAnnual = calculateTeleworkAllowanceAnnual(
    salaryCalculationInput.isTeleworking,
    salaryCalculationInput.teleworkAllowancePerPayslip,
    payPeriods,
  );

  let annualIrpf: number;
  let effectiveIrpfRate: number;
  let personalMinimum = 0;
  let breakdownItems: DeductionBreakdownItem[];

  if (salaryCalculationInput.irpfMode === IrpfMode.MANUAL) {
    const manualIrpf = calculateIrpfManual(
      baseRetencion,
      annualGross,
      salaryCalculationInput.manualIrpfRate,
    );
    annualIrpf = manualIrpf.annualIrpf;
    effectiveIrpfRate = manualIrpf.effectiveRateOnGross;
    breakdownItems = buildBreakdownItems({
      socialSecurity,
      irpfMode: IrpfMode.MANUAL,
      annualIrpf,
      teleworkAllowanceAnnual,
    });
  } else {
    const automaticIrpf = calculateIrpfAutomatic(
      baseRetencion,
      salaryCalculationInput.autonomousCommunity,
      {
        annualGross,
        maritalStatus: salaryCalculationInput.maritalStatus,
        children: salaryCalculationInput.children,
      },
    );
    annualIrpf = automaticIrpf.annualIrpf;
    effectiveIrpfRate = automaticIrpf.effectiveRateOnGross;
    personalMinimum = automaticIrpf.personalMinimum;
    breakdownItems = buildBreakdownItems({
      socialSecurity,
      irpfMode: IrpfMode.AUTO,
      annualIrpf,
      stateQuota: automaticIrpf.stateQuota,
      regionalQuota: automaticIrpf.regionalQuota,
      personalMinimum,
      teleworkAllowanceAnnual,
    });
  }

  const annualNetBeforeTelework = roundCurrency(
    annualGross - socialSecurity.annualTotal - annualIrpf,
  );
  const annualNet = roundCurrency(annualNetBeforeTelework + teleworkAllowanceAnnual);
  const netPerPayslip = roundCurrency(annualNetBeforeTelework / payPeriods);

  return {
    annualGross,
    monthlyGross: roundCurrency(annualGross / payPeriods),
    annualSocialSecurity: socialSecurity.annualTotal,
    monthlySocialSecurity: roundCurrency(socialSecurity.annualTotal / 12),
    annualIrpf,
    monthlyIrpf: roundCurrency(annualIrpf / 12),
    effectiveIrpfRate,
    annualNet,
    monthlyNet: roundCurrency(netPerPayslip + teleworkAllowancePerPayslip),
    personalMinimum,
    teleworkAllowanceAnnual,
    teleworkAllowancePerPayslip,
    breakdownItems,
  };
}

function validateSalaryCalculationInput(
  salaryCalculationInput: SalaryCalculationInput,
): void {
  if (
    !Number.isFinite(salaryCalculationInput.grossSalary) ||
    salaryCalculationInput.grossSalary <= 0
  ) {
    throw new SalaryCalculationError(
      SalaryCalculationErrorCode.INVALID_INPUT,
      'El salario bruto debe ser un importe mayor que cero.',
    );
  }

  if (
    salaryCalculationInput.irpfMode === IrpfMode.MANUAL &&
    (salaryCalculationInput.manualIrpfRate < 0 ||
      salaryCalculationInput.manualIrpfRate > 100)
  ) {
    throw new SalaryCalculationError(
      SalaryCalculationErrorCode.INVALID_IRPF_RATE,
      'El tipo de IRPF manual debe estar entre 0 y 100.',
    );
  }
}

type BuildBreakdownItemsInput = {
  socialSecurity: ReturnType<typeof calculateSocialSecurity>;
  irpfMode: typeof IrpfMode.AUTO | typeof IrpfMode.MANUAL;
  annualIrpf: number;
  stateQuota?: number;
  regionalQuota?: number;
  personalMinimum?: number;
  teleworkAllowanceAnnual?: number;
};

function buildBreakdownItems({
  socialSecurity,
  irpfMode,
  annualIrpf,
  stateQuota,
  regionalQuota,
  personalMinimum,
  teleworkAllowanceAnnual,
}: BuildBreakdownItemsInput): DeductionBreakdownItem[] {
  const breakdownItems: DeductionBreakdownItem[] = [
    {
      label: 'Seguridad Social (trabajador)',
      amount: socialSecurity.annualTotal,
      category: DeductionBreakdownCategory.SOCIAL_SECURITY,
    },
  ];

  if (irpfMode === IrpfMode.AUTO) {
    if (personalMinimum && personalMinimum > 0) {
      breakdownItems.push({
        label: 'Mínimo personal y familiar',
        amount: personalMinimum,
        category: DeductionBreakdownCategory.REDUCTION,
      });
    }

    breakdownItems.push(
      {
        label: 'IRPF estatal',
        amount: stateQuota ?? 0,
        category: DeductionBreakdownCategory.IRPF_STATE,
      },
      {
        label: 'IRPF autonómico',
        amount: regionalQuota ?? 0,
        category: DeductionBreakdownCategory.IRPF_REGIONAL,
      },
    );
  } else {
    breakdownItems.push({
      label: 'IRPF (tipo manual)',
      amount: annualIrpf,
      category: DeductionBreakdownCategory.IRPF_MANUAL,
    });
  }

  if (teleworkAllowanceAnnual && teleworkAllowanceAnnual > 0) {
    breakdownItems.push({
      label: 'Complemento teletrabajo',
      amount: teleworkAllowanceAnnual,
      category: DeductionBreakdownCategory.TELEWORK_ALLOWANCE,
    });
  }

  return breakdownItems;
}
