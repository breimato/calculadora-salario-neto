import {
  AutonomousCommunity,
  type AutonomousCommunity as AutonomousCommunityType,
} from '../types/SalaryCalculationInput.ts';
import type { IrpfTaxBracket } from './irpfStateBrackets.ts';

const GENERAL_REGIONAL_BRACKETS: IrpfTaxBracket[] = [
  { lowerBound: 0, upperBound: 12_450, rate: 0.095 },
  { lowerBound: 12_450, upperBound: 20_200, rate: 0.12 },
  { lowerBound: 20_200, upperBound: 35_200, rate: 0.15 },
  { lowerBound: 35_200, upperBound: 60_000, rate: 0.185 },
  { lowerBound: 60_000, upperBound: 300_000, rate: 0.225 },
  { lowerBound: 300_000, upperBound: null, rate: 0.225 },
];

const MADRID_REGIONAL_BRACKETS: IrpfTaxBracket[] = [
  { lowerBound: 0, upperBound: 12_450, rate: 0.095 },
  { lowerBound: 12_450, upperBound: 20_200, rate: 0.12 },
  { lowerBound: 20_200, upperBound: 35_200, rate: 0.15 },
  { lowerBound: 35_200, upperBound: 60_000, rate: 0.185 },
  { lowerBound: 60_000, upperBound: 300_000, rate: 0.215 },
  { lowerBound: 300_000, upperBound: null, rate: 0.215 },
];

const CATALUNA_REGIONAL_BRACKETS: IrpfTaxBracket[] = [
  { lowerBound: 0, upperBound: 12_450, rate: 0.095 },
  { lowerBound: 12_450, upperBound: 20_200, rate: 0.12 },
  { lowerBound: 20_200, upperBound: 35_200, rate: 0.15 },
  { lowerBound: 35_200, upperBound: 60_000, rate: 0.185 },
  { lowerBound: 60_000, upperBound: 300_000, rate: 0.235 },
  { lowerBound: 300_000, upperBound: null, rate: 0.235 },
];

const REGIONAL_BRACKETS_BY_COMMUNITY: Partial<
  Record<AutonomousCommunityType, IrpfTaxBracket[]>
> = {
  [AutonomousCommunity.MADRID]: MADRID_REGIONAL_BRACKETS,
  [AutonomousCommunity.CATALUNA]: CATALUNA_REGIONAL_BRACKETS,
};

export function getRegionalBrackets(
  autonomousCommunity: AutonomousCommunityType,
): IrpfTaxBracket[] {
  return (
    REGIONAL_BRACKETS_BY_COMMUNITY[autonomousCommunity] ??
    GENERAL_REGIONAL_BRACKETS
  );
}
