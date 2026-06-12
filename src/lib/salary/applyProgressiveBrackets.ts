export type ProgressiveTaxBracket = {
  upTo: number;
  rate: number;
};

export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function applyProgressiveBrackets(
  taxableBase: number,
  brackets: ProgressiveTaxBracket[],
): number {
  if (taxableBase <= 0) {
    return 0;
  }

  let tax = 0;
  let previousUpTo = 0;

  for (const bracket of brackets) {
    if (taxableBase <= previousUpTo) {
      break;
    }

    const taxableInBracket = Math.min(taxableBase, bracket.upTo) - previousUpTo;

    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }

    previousUpTo = bracket.upTo;
  }

  return roundCurrency(tax);
}
