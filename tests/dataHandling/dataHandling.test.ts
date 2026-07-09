import { describe, expect, it } from "vitest";
import {
  mean,
  median,
  mode,
  probability,
  range,
  standardDeviation,
} from "../../src/dataHandling/index.js";

describe("mean", () => {
  it("computes the average", () => {
    expect(mean([2, 4, 6, 8])).toBe(5);
  });

  it("throws on empty data", () => {
    expect(() => mean([])).toThrow(RangeError);
  });
});

describe("median", () => {
  it("returns the middle value for odd-length data", () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it("averages the two middle values for even-length data", () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });
});

describe("mode", () => {
  it("returns the most frequent value", () => {
    expect(mode([1, 2, 2, 3])).toEqual([2]);
  });

  it("returns all values tied for most frequent (bimodal)", () => {
    expect(mode([1, 1, 2, 2, 3])).toEqual([1, 2]);
  });
});

describe("range", () => {
  it("computes max minus min", () => {
    expect(range([5, 1, 9, 3])).toBe(8);
  });
});

describe("standardDeviation", () => {
  it("computes the population standard deviation", () => {
    expect(standardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toBe(2);
  });

  it("is 0 for a data set of identical values", () => {
    expect(standardDeviation([5, 5, 5])).toBe(0);
  });
});

describe("probability", () => {
  it("computes favourable over total outcomes", () => {
    expect(probability(1, 6)).toBe(0.17);
  });

  it("rejects favourableOutcomes greater than totalOutcomes", () => {
    expect(() => probability(7, 6)).toThrow(RangeError);
  });

  it("rejects non-positive totalOutcomes", () => {
    expect(() => probability(0, 0)).toThrow(RangeError);
  });
});
