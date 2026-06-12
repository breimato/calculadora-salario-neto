export const GrossSalaryPeriod = {
  ANNUAL: 'ANNUAL',
  MONTHLY: 'MONTHLY',
} as const;

export type GrossSalaryPeriod =
  (typeof GrossSalaryPeriod)[keyof typeof GrossSalaryPeriod];

export const PayPeriods = {
  TWELVE: 12,
  FOURTEEN: 14,
} as const;

export type PayPeriods = (typeof PayPeriods)[keyof typeof PayPeriods];

export const ContractType = {
  INDEFINIDO: 'INDEFINIDO',
  TEMPORAL: 'TEMPORAL',
} as const;

export type ContractType = (typeof ContractType)[keyof typeof ContractType];

export const AutonomousCommunity = {
  ANDALUCIA: 'ANDALUCIA',
  ARAGON: 'ARAGON',
  ASTURIAS: 'ASTURIAS',
  BALEARES: 'BALEARES',
  CANARIAS: 'CANARIAS',
  CANTABRIA: 'CANTABRIA',
  CASTILLA_LA_MANCHA: 'CASTILLA_LA_MANCHA',
  CASTILLA_Y_LEON: 'CASTILLA_Y_LEON',
  CATALUNA: 'CATALUNA',
  CEUTA: 'CEUTA',
  COMUNIDAD_VALENCIANA: 'COMUNIDAD_VALENCIANA',
  EXTREMADURA: 'EXTREMADURA',
  GALICIA: 'GALICIA',
  LA_RIOJA: 'LA_RIOJA',
  MADRID: 'MADRID',
  MELILLA: 'MELILLA',
  MURCIA: 'MURCIA',
  NAVARRA: 'NAVARRA',
  PAIS_VASCO: 'PAIS_VASCO',
} as const;

export type AutonomousCommunity =
  (typeof AutonomousCommunity)[keyof typeof AutonomousCommunity];

export const MaritalStatus = {
  SINGLE: 'SINGLE',
  MARRIED: 'MARRIED',
} as const;

export type MaritalStatus =
  (typeof MaritalStatus)[keyof typeof MaritalStatus];

export const IrpfMode = {
  AUTO: 'AUTO',
  MANUAL: 'MANUAL',
} as const;

export type IrpfMode = (typeof IrpfMode)[keyof typeof IrpfMode];

export type SalaryCalculationInput = {
  grossSalary: number;
  grossSalaryPeriod: GrossSalaryPeriod;
  payPeriods: PayPeriods;
  contractType: ContractType;
  autonomousCommunity: AutonomousCommunity;
  maritalStatus: MaritalStatus;
  children: 0 | 1 | 2 | 3 | 4 | 5;
  isTeleworking: boolean;
  teleworkAllowancePerPayslip: number;
  irpfMode: IrpfMode;
  manualIrpfRate: number;
};
