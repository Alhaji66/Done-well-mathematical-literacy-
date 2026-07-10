import { roundTo } from "../shared/rounding.js";

/** Simple interest: A = P(1 + i*n). Returns the final amount, rounded to 2 decimals. */
export function simpleInterestAmount(principal: number, annualRate: number, years: number): number {
  if (principal < 0 || annualRate < 0 || years < 0) {
    throw new RangeError("principal, annualRate and years must be non-negative");
  }
  return roundTo(principal * (1 + annualRate * years));
}

/** Compound interest: A = P(1 + i/n)^(n*t). Returns the final amount, rounded to 2 decimals. */
export function compoundInterestAmount(
  principal: number,
  annualRate: number,
  years: number,
  compoundsPerYear = 1
): number {
  if (principal < 0 || annualRate < 0 || years < 0 || compoundsPerYear <= 0) {
    throw new RangeError("principal, annualRate and years must be non-negative and compoundsPerYear must be positive");
  }
  return roundTo(principal * (1 + annualRate / compoundsPerYear) ** (compoundsPerYear * years));
}

/** Converts an amount from one currency to another given the exchange rate (target per source). */
export function convertCurrency(amount: number, exchangeRate: number): number {
  if (amount < 0 || exchangeRate < 0) {
    throw new RangeError("amount and exchangeRate must be non-negative");
  }
  return roundTo(amount * exchangeRate);
}

/** Applies a percentage-based inflation increase to a value over a number of years. */
export function inflationAdjustedValue(value: number, inflationRate: number, years: number): number {
  if (value < 0 || years < 0) {
    throw new RangeError("value and years must be non-negative");
  }
  return roundTo(value * (1 + inflationRate) ** years);
}
