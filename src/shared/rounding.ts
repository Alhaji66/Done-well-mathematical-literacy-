/**
 * Rounds to a fixed number of decimal places using standard "round half up"
 * behaviour, matching how Mathematical Literacy exam memos round answers.
 */
export function roundTo(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
