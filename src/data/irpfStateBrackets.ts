export type IrpfTaxBracket = {
  lowerBound: number;
  upperBound: number | null;
  rate: number;
};

export const IRPF_STATE_BRACKETS_2025: IrpfTaxBracket[] = [
  { lowerBound: 0, upperBound: 12_450, rate: 0.095 },
  { lowerBound: 12_450, upperBound: 20_200, rate: 0.12 },
  { lowerBound: 20_200, upperBound: 35_200, rate: 0.15 },
  { lowerBound: 35_200, upperBound: 60_000, rate: 0.185 },
  { lowerBound: 60_000, upperBound: 300_000, rate: 0.225 },
  { lowerBound: 300_000, upperBound: null, rate: 0.245 },
];
