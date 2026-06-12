import {
  SOCIAL_SECURITY_MONTHLY_MAX_BASE,
  SOCIAL_SECURITY_MONTHLY_MIN_BASE,
  SOCIAL_SECURITY_WORKER_RATES,
} from '../../data/socialSecurityRates.ts';
import {
  ContractType,
  type ContractType as ContractTypeValue,
} from '../../types/SalaryCalculationInput.ts';
import { roundCurrency } from './applyProgressiveBrackets.ts';

export type SocialSecurityBreakdown = {
  cc: number;
  unemployment: number;
  fp: number;
  mei: number;
};

export type SocialSecurityCalculationResult = {
  annualTotal: number;
  monthlyContributionBase: number;
  annualContributionBase: number;
  breakdown: SocialSecurityBreakdown;
};

export function calculateSocialSecurity(
  annualGross: number,
  contractType: ContractTypeValue,
): SocialSecurityCalculationResult {
  const monthlyGross = annualGross / 12;
  const monthlyContributionBase = roundCurrency(
    Math.min(
      Math.max(monthlyGross, SOCIAL_SECURITY_MONTHLY_MIN_BASE),
      SOCIAL_SECURITY_MONTHLY_MAX_BASE,
    ),
  );
  const annualContributionBase = roundCurrency(monthlyContributionBase * 12);

  const unemploymentRate =
    contractType === ContractType.INDEFINIDO
      ? SOCIAL_SECURITY_WORKER_RATES.unemploymentIndefinite
      : SOCIAL_SECURITY_WORKER_RATES.unemploymentTemporal;

  const cc = roundCurrency(
    annualContributionBase * SOCIAL_SECURITY_WORKER_RATES.cc,
  );
  const unemployment = roundCurrency(annualContributionBase * unemploymentRate);
  const fp = roundCurrency(annualContributionBase * SOCIAL_SECURITY_WORKER_RATES.fp);
  const mei = roundCurrency(annualContributionBase * SOCIAL_SECURITY_WORKER_RATES.mei);
  const annualTotal = roundCurrency(cc + unemployment + fp + mei);

  return {
    annualTotal,
    monthlyContributionBase,
    annualContributionBase,
    breakdown: {
      cc,
      unemployment,
      fp,
      mei,
    },
  };
}
