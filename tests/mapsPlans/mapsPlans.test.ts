import { describe, expect, it } from "vitest";
import {
  actualDistanceToMap,
  compassBearing,
  mapDistanceToActual,
  parseScale,
} from "../../src/mapsPlans/index.js";

describe("parseScale", () => {
  it("parses a well-formed 1:n scale", () => {
    expect(parseScale("1:50000")).toBe(50000);
  });

  it("tolerates surrounding whitespace and spacing around the colon", () => {
    expect(parseScale(" 1 : 2500 ")).toBe(2500);
  });

  it("throws for a malformed scale", () => {
    expect(() => parseScale("2:50000")).toThrow(RangeError);
    expect(() => parseScale("not a scale")).toThrow(RangeError);
  });
});

describe("mapDistanceToActual", () => {
  it("converts a map distance in cm to an actual distance in metres", () => {
    // 4 cm on a 1:50000 map -> 2000 m
    expect(mapDistanceToActual(4, "1:50000")).toBe(2000);
  });

  it("rejects negative map distances", () => {
    expect(() => mapDistanceToActual(-1, "1:50000")).toThrow(RangeError);
  });
});

describe("actualDistanceToMap", () => {
  it("converts an actual distance in metres to a map distance in cm", () => {
    // 2000 m on a 1:50000 map -> 4 cm
    expect(actualDistanceToMap(2000, "1:50000")).toBe(4);
  });

  it("round-trips with mapDistanceToActual", () => {
    const actual = mapDistanceToActual(6.5, "1:10000");
    expect(actualDistanceToMap(actual, "1:10000")).toBe(6.5);
  });
});

describe("compassBearing", () => {
  it("returns the bearing for each of the 8 principal directions", () => {
    expect(compassBearing("N")).toBe(0);
    expect(compassBearing("E")).toBe(90);
    expect(compassBearing("S")).toBe(180);
    expect(compassBearing("W")).toBe(270);
  });

  it("throws for an unknown direction", () => {
    expect(() => compassBearing("NNE" as never)).toThrow(RangeError);
  });
});
