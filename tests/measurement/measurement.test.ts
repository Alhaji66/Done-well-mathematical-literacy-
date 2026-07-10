import { describe, expect, it } from "vitest";
import {
  circleArea,
  convertLength,
  cylinderVolume,
  rectangleArea,
  rectangularPrismVolume,
} from "../../src/measurement/index.js";

describe("rectangleArea", () => {
  it("computes length times width", () => {
    expect(rectangleArea(4, 3)).toBe(12);
  });

  it("rejects negative dimensions", () => {
    expect(() => rectangleArea(-1, 3)).toThrow(RangeError);
  });
});

describe("circleArea", () => {
  it("computes pi * r^2", () => {
    expect(circleArea(7)).toBe(153.94);
  });
});

describe("rectangularPrismVolume", () => {
  it("computes length * width * height", () => {
    expect(rectangularPrismVolume(2, 3, 4)).toBe(24);
  });
});

describe("cylinderVolume", () => {
  it("computes pi * r^2 * h", () => {
    expect(cylinderVolume(3, 5)).toBe(141.37);
  });
});

describe("convertLength", () => {
  it("converts metres to centimetres", () => {
    expect(convertLength(2, "m", "cm")).toBe(200);
  });

  it("converts kilometres to metres", () => {
    expect(convertLength(1.5, "km", "m")).toBe(1500);
  });

  it("converts millimetres to metres", () => {
    expect(convertLength(2500, "mm", "m")).toBe(2.5);
  });

  it("returns the same value for identical units", () => {
    expect(convertLength(42, "cm", "cm")).toBe(42);
  });

  it("rejects negative values", () => {
    expect(() => convertLength(-1, "m", "cm")).toThrow(RangeError);
  });
});
