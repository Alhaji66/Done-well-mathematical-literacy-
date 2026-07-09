import { roundTo } from "../shared/rounding.js";

function assertNonEmpty(data: number[]): void {
  if (data.length === 0) {
    throw new RangeError("data must not be empty");
  }
}

export function mean(data: number[]): number {
  assertNonEmpty(data);
  return roundTo(data.reduce((sum, value) => sum + value, 0) / data.length);
}

export function median(data: number[]): number {
  assertNonEmpty(data);
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const value = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  return roundTo(value);
}

/** Returns all values that occur most frequently (empty array only for empty input). */
export function mode(data: number[]): number[] {
  assertNonEmpty(data);
  const counts = new Map<number, number>();
  for (const value of data) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const maxCount = Math.max(...counts.values());
  return [...counts.entries()].filter(([, count]) => count === maxCount).map(([value]) => value);
}

export function range(data: number[]): number {
  assertNonEmpty(data);
  return roundTo(Math.max(...data) - Math.min(...data));
}

/** Population standard deviation, as used in the Mathematical Literacy CAPS curriculum. */
export function standardDeviation(data: number[]): number {
  assertNonEmpty(data);
  const avg = data.reduce((sum, value) => sum + value, 0) / data.length;
  const variance = data.reduce((sum, value) => sum + (value - avg) ** 2, 0) / data.length;
  return roundTo(Math.sqrt(variance));
}

/** Simple theoretical probability of an event, expressed as favourable/total outcomes. */
export function probability(favourableOutcomes: number, totalOutcomes: number): number {
  if (totalOutcomes <= 0 || favourableOutcomes < 0 || favourableOutcomes > totalOutcomes) {
    throw new RangeError("favourableOutcomes must be between 0 and totalOutcomes, and totalOutcomes must be positive");
  }
  return roundTo(favourableOutcomes / totalOutcomes);
}
