import type { SalaryFormData } from '../../types/salary.ts';
import {
  AutonomousCommunity,
  ContractType,
  GrossSalaryPeriod,
  IrpfMode,
  MaritalStatus,
  PayPeriods,
  type SalaryCalculationInput,
} from '../../types/SalaryCalculationInput.ts';
import { roundCurrency } from './applyProgressiveBrackets.ts';

const CCAA_FORM_TO_ENUM: Record<string, AutonomousCommunity> = {
  andalucia: AutonomousCommunity.ANDALUCIA,
  aragon: AutonomousCommunity.ARAGON,
  asturias: AutonomousCommunity.ASTURIAS,
  baleares: AutonomousCommunity.BALEARES,
  canarias: AutonomousCommunity.CANARIAS,
  cantabria: AutonomousCommunity.CANTABRIA,
  castilla_mancha: AutonomousCommunity.CASTILLA_LA_MANCHA,
  castilla_leon: AutonomousCommunity.CASTILLA_Y_LEON,
  cataluna: AutonomousCommunity.CATALUNA,
  valencia: AutonomousCommunity.COMUNIDAD_VALENCIANA,
  extremadura: AutonomousCommunity.EXTREMADURA,
  galicia: AutonomousCommunity.GALICIA,
  la_rioja: AutonomousCommunity.LA_RIOJA,
  madrid: AutonomousCommunity.MADRID,
  murcia: AutonomousCommunity.MURCIA,
  navarra: AutonomousCommunity.NAVARRA,
  pais_vasco: AutonomousCommunity.PAIS_VASCO,
  ceuta: AutonomousCommunity.CEUTA,
  melilla: AutonomousCommunity.MELILLA,
};

export function mapFormDataToSalaryCalculationInput(
  salaryFormData: SalaryFormData,
): SalaryCalculationInput {
  const grossSalary =
    salaryFormData.grossSalaryPeriod === 'monthly'
      ? roundCurrency(salaryFormData.grossSalary * 12)
      : salaryFormData.grossSalary;

  return {
    grossSalary,
    grossSalaryPeriod: GrossSalaryPeriod.ANNUAL,
    payPeriods:
      salaryFormData.payPeriods === 14 ? PayPeriods.FOURTEEN : PayPeriods.TWELVE,
    contractType:
      salaryFormData.contractType === 'temporal'
        ? ContractType.TEMPORAL
        : ContractType.INDEFINIDO,
    autonomousCommunity:
      CCAA_FORM_TO_ENUM[salaryFormData.ccaa] ?? AutonomousCommunity.MADRID,
    maritalStatus:
      salaryFormData.maritalStatus === 'married'
        ? MaritalStatus.MARRIED
        : MaritalStatus.SINGLE,
    children: salaryFormData.children,
    isTeleworking: salaryFormData.isTeleworking,
    teleworkAllowancePerPayslip: salaryFormData.teleworkAllowancePerPayslip,
    irpfMode:
      salaryFormData.irpfMode === 'manual' ? IrpfMode.MANUAL : IrpfMode.AUTO,
    manualIrpfRate: salaryFormData.manualIrpfRate,
  };
}
