import { roundTo } from "../shared/rounding.js";

export function rectangleArea(length: number, width: number): number {
  if (length < 0 || width < 0) {
    throw new RangeError("length and width must be non-negative");
  }
  return roundTo(length * width);
}

export function circleArea(radius: number): number {
  if (radius < 0) {
    throw new RangeError("radius must be non-negative");
  }
  return roundTo(Math.PI * radius ** 2);
}

export function rectangularPrismVolume(length: number, width: number, height: number): number {
  if (length < 0 || width < 0 || height < 0) {
    throw new RangeError("length, width and height must be non-negative");
  }
  return roundTo(length * width * height);
}

export function cylinderVolume(radius: number, height: number): number {
  if (radius < 0 || height < 0) {
    throw new RangeError("radius and height must be non-negative");
  }
  return roundTo(Math.PI * radius ** 2 * height);
}

type LengthUnit = "mm" | "cm" | "m" | "km";

const METRES_PER_UNIT: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
};

/** Converts a length between metric units (mm, cm, m, km). */
export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  if (value < 0) {
    throw new RangeError("value must be non-negative");
  }
  const metres = value * METRES_PER_UNIT[from];
  return roundTo(metres / METRES_PER_UNIT[to]);
}
