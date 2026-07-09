import { roundTo } from "../shared/rounding.js";

/**
 * Parses a map scale given as "1:n" and returns n.
 * Throws for malformed scales rather than returning NaN, since a bad
 * scale string should never silently propagate into a distance calculation.
 */
export function parseScale(scale: string): number {
  const match = /^1\s*:\s*(\d+(?:\.\d+)?)$/.exec(scale.trim());
  if (!match) {
    throw new RangeError(`invalid scale format: "${scale}", expected "1:n"`);
  }
  return Number(match[1]);
}

/** Converts a distance measured on the map (in cm) to the actual distance (in metres). */
export function mapDistanceToActual(mapDistanceCm: number, scale: string): number {
  if (mapDistanceCm < 0) {
    throw new RangeError("mapDistanceCm must be non-negative");
  }
  const n = parseScale(scale);
  return roundTo((mapDistanceCm * n) / 100);
}

/** Converts an actual distance (in metres) to the equivalent distance on the map (in cm). */
export function actualDistanceToMap(actualDistanceM: number, scale: string): number {
  if (actualDistanceM < 0) {
    throw new RangeError("actualDistanceM must be non-negative");
  }
  const n = parseScale(scale);
  return roundTo((actualDistanceM * 100) / n);
}

const COMPASS_BEARINGS: Record<string, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};

/** Returns the compass bearing in degrees for one of the 8 principal directions. */
export function compassBearing(direction: keyof typeof COMPASS_BEARINGS): number {
  const bearing = COMPASS_BEARINGS[direction];
  if (bearing === undefined) {
    throw new RangeError(`unknown direction: "${direction}"`);
  }
  return bearing;
}
