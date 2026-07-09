import { describe, expect, it } from "vitest";
import {
  compoundInterestAmount,
  convertCurrency,
  inflationAdjustedValue,
  simpleInterestAmount,
} from "../../src/finance/index.js";

describe("simpleInterestAmount", () => {
  it("computes A = P(1 + i*n)", () => {
    // R10 000 at 8% p.a. simple interest for 3 years -> R12 400
    expect(simpleInterestAmount(10000, 0.08, 3)).toBe(12400);
  });

  it("returns the principal unchanged over 0 years", () => {
    expect(simpleInterestAmount(5000, 0.1, 0)).toBe(5000);
  });

  it("rejects negative inputs", () => {
    expect(() => simpleInterestAmount(-100, 0.05, 1)).toThrow(RangeError);
    expect(() => simpleInterestAmount(100, -0.05, 1)).toThrow(RangeError);
    expect(() => simpleInterestAmount(100, 0.05, -1)).toThrow(RangeError);
  });
});

describe("compoundInterestAmount", () => {
  it("computes A = P(1 + i/n)^(n*t) for annual compounding", () => {
    // R10 000 at 8% p.a. compounded annually for 3 years -> R12 597.12
    expect(compoundInterestAmount(10000, 0.08, 3)).toBe(12597.12);
  });

  it("computes monthly compounding correctly", () => {
    // R10 000 at 12% p.a. compounded monthly for 1 year -> R11 268.25
    expect(compoundInterestAmount(10000, 0.12, 1, 12)).toBe(11268.25);
  });

  it("rejects non-positive compoundsPerYear", () => {
    expect(() => compoundInterestAmount(1000, 0.05, 1, 0)).toThrow(RangeError);
  });
});

describe("convertCurrency", () => {
  it("multiplies the amount by the exchange rate", () => {
    expect(convertCurrency(100, 18.5)).toBe(1850);
  });

  it("rejects negative exchange rates", () => {
    expect(() => convertCurrency(100, -1)).toThrow(RangeError);
  });
});

describe("inflationAdjustedValue", () => {
  it("compounds a value forward at the inflation rate", () => {
    // R1000 at 6% inflation for 2 years -> R1123.60
    expect(inflationAdjustedValue(1000, 0.06, 2)).toBe(1123.6);
  });

  it("returns the same value over 0 years", () => {
    expect(inflationAdjustedValue(500, 0.1, 0)).toBe(500);
  });
});
