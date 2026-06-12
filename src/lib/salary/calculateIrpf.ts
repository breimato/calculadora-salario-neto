import { getRegionalBrackets } from '../../data/irpfRegionalBrackets.ts';
import { IRPF_STATE_BRACKETS_2025 } from '../../data/irpfStateBrackets.ts';
import type { IrpfTaxBracket } from '../../data/irpfStateBrackets.ts';
import {
  CHILD_MINIMUMS,
  MARRIED_JOINT_MINIMUM,
  PERSONAL_MINIMUM,
} from '../../data/personalMinimums.ts';
import {
  type AutonomousCommunity,
  type MaritalStatus,
  MaritalStatus as MaritalStatusEnum,
} from '../../types/SalaryCalculationInput.ts';
import {
  SalaryCalculationError,
  SalaryCalculationErrorCode,
} from '../errors/SalaryCalculationError.ts';
import {
  applyProgressiveBrackets,
  roundCurrency,
  type ProgressiveTaxBracket,
} from './applyProgressiveBrackets.ts';

export type IrpfAutomaticResult = {
  annualIrpf: number;
  stateQuota: number;
  regionalQuota: number;
  effectiveRateOnGross: number;
  personalMinimum: number;
  taxableBase: number;
};

export type IrpfManualResult = {
  annualIrpf: number;
  effectiveRateOnGross: number;
};

type CalculateIrpfAutomaticOptions = {
  annualGross: number;
  maritalStatus: MaritalStatus;
  children: 0 | 1 | 2 | 3 | 4 | 5;
};

function toProgressiveBrackets(
  brackets: IrpfTaxBracket[],
): ProgressiveTaxBracket[] {
  return brackets.map((bracket) => ({
    upTo: bracket.upperBound ?? Number.POSITIVE_INFINITY,
    rate: bracket.rate,
  }));
}

function calculatePersonalMinimum(
  maritalStatus: MaritalStatus,
  children: 0 | 1 | 2 | 3 | 4 | 5,
): number {
  let minimum = PERSONAL_MINIMUM;

  for (let index = 0; index < children; index += 1) {
    minimum += CHILD_MINIMUMS[index];
  }

  if (maritalStatus === MaritalStatusEnum.MARRIED) {
    minimum += MARRIED_JOINT_MINIMUM;
  }

  return minimum;
}

function calculateStateAndRegionalQuotas(
  taxableBase: number,
  ccaa: AutonomousCommunity,
): { stateQuota: number; regionalQuota: number } {
  const stateQuota = applyProgressiveBrackets(
    taxableBase,
    toProgressiveBrackets(IRPF_STATE_BRACKETS_2025),
  );
  const regionalQuota = applyProgressiveBrackets(
    taxableBase,
    toProgressiveBrackets(getRegionalBrackets(ccaa)),
  );

  return { stateQuota, regionalQuota };
}

export function calculateIrpfAutomatic(
  baseRetencion: number,
  ccaa: AutonomousCommunity,
  options: CalculateIrpfAutomaticOptions,
): IrpfAutomaticResult {
  const personalMinimum = calculatePersonalMinimum(
    options.maritalStatus,
    options.children,
  );
  const taxableBase = roundCurrency(Math.max(0, baseRetencion - personalMinimum));
  const { stateQuota, regionalQuota } = calculateStateAndRegionalQuotas(
    taxableBase,
    ccaa,
  );
  const annualIrpf = roundCurrency(stateQuota + regionalQuota);
  const effectiveRateOnGross =
    options.annualGross > 0
      ? roundCurrency((annualIrpf / options.annualGross) * 100)
      : 0;

  return {
    annualIrpf,
    stateQuota,
    regionalQuota,
    effectiveRateOnGross,
    personalMinimum,
    taxableBase,
  };
}

export function calculateIrpfManual(
  baseRetencion: number,
  annualGross: number,
  manualRate: number,
): IrpfManualResult {
  if (manualRate < 0 || manualRate > 100) {
    throw new SalaryCalculationError(
      SalaryCalculationErrorCode.INVALID_IRPF_RATE,
      'El tipo de IRPF manual debe estar entre 0 y 100.',
    );
  }

  const annualIrpf = roundCurrency((baseRetencion * manualRate) / 100);

  return {
    annualIrpf,
    effectiveRateOnGross:
      annualGross > 0 ? roundCurrency((annualIrpf / annualGross) * 100) : 0,
  };
}
