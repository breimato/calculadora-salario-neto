export const DeductionBreakdownCategory = {
  SOCIAL_SECURITY: 'SOCIAL_SECURITY',
  IRPF_STATE: 'IRPF_STATE',
  IRPF_REGIONAL: 'IRPF_REGIONAL',
  IRPF_MANUAL: 'IRPF_MANUAL',
  REDUCTION: 'REDUCTION',
  TELEWORK_ALLOWANCE: 'TELEWORK_ALLOWANCE',
} as const;

export type DeductionBreakdownCategory =
  (typeof DeductionBreakdownCategory)[keyof typeof DeductionBreakdownCategory];

export type DeductionBreakdownItem = {
  label: string;
  amount: number;
  category: DeductionBreakdownCategory;
};
