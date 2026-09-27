/** The CAPS seven-point scale of achievement. */
export function capsLevel(percent: number): { level: number; name: string } {
  const levels: [number, string][] = [
    [80, 'Outstanding achievement'],
    [70, 'Meritorious achievement'],
    [60, 'Substantial achievement'],
    [50, 'Adequate achievement'],
    [40, 'Moderate achievement'],
    [30, 'Elementary achievement'],
    [0, 'Not achieved'],
  ]
  const i = levels.findIndex(([min]) => percent >= min)
  return { level: 7 - i, name: levels[i][1] }
}
