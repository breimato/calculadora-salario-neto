export const SalaryCalculationErrorCode = {
  INVALID_INPUT: 'INVALID_INPUT',
  INVALID_IRPF_RATE: 'INVALID_IRPF_RATE',
} as const;

export type SalaryCalculationErrorCode =
  (typeof SalaryCalculationErrorCode)[keyof typeof SalaryCalculationErrorCode];

export class SalaryCalculationError extends Error {
  readonly code: SalaryCalculationErrorCode;

  constructor(code: SalaryCalculationErrorCode, message: string) {
    super(message);
    this.name = 'SalaryCalculationError';
    this.code = code;
  }
}
