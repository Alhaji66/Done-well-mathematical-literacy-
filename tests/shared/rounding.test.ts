import { describe, expect, it } from "vitest";
import { roundTo } from "../../src/shared/rounding.js";

describe("roundTo", () => {
  it("rounds to 2 decimals by default", () => {
    expect(roundTo(1.005)).toBe(1.01);
    expect(roundTo(1.004)).toBe(1);
  });

  it("rounds to a custom number of decimals", () => {
    expect(roundTo(1.2345, 3)).toBe(1.235);
    expect(roundTo(1.25, 0)).toBe(1);
  });

  it("handles negative numbers", () => {
    expect(roundTo(-1.005)).toBe(-1);
  });
});
