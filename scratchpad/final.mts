/**
 * Check every subject/grade/paper cell against its CAPS weighting.
 *
 * This is the report the Level 4 and Level 1 content work was measured
 * against: it reads the stored cognitiveLevel on every paper item, converts
 * to a share of marks, and compares each level with the published target
 * inside WEIGHTING_TOLERANCE.
 *
 * ONE VALUE IS HARDCODED, and it is worth knowing why. capsWeighting.ts
 * stores a single entry for Physical Sciences covering both papers, because
 * Levels 3 and 4 come to 50% either way and the app's three-tier view cannot
 * tell them apart. The published guideline does differ by paper -- P1 is
 * 15/35/40/10 and P2 is 15/40/35/10 -- so the P2 target below is written out
 * rather than read from the table. If capsWeighting.ts is ever split by
 * paper, delete this override and read it from there instead.
 *
 * Run:  npx tsx scratchpad/final.mts
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import { capsWeightingFor, WEIGHTING_TOLERANCE } from '../src/data/capsWeighting.ts'

for (const subj of ['life-sciences', 'physical-sciences']) {
  console.log(`\n=== ${subj} ===`)
  const list: any[] = (await papersForSubject(subj)) as any
  const cells = new Map<string, any>()
  for (const p of list) {
    const key = `G${p.grade} P${p.paperNumber}`
    const c = cells.get(key) ?? { m: { 1: 0, 2: 0, 3: 0, 4: 0 }, t: 0, g: p.grade, pn: p.paperNumber }
    for (const s of p.sections) for (const i of s.items) { c.m[i.cognitiveLevel] += i.marks; c.t += i.marks }
    cells.set(key, c)
  }
  for (const key of [...cells.keys()].sort()) {
    const c = cells.get(key)!
    const w = capsWeightingFor(subj, c.g)!
    // Physical Sciences differs by paper in the L3/L4 split only; L1/L2 are shared.
    const target = subj === 'physical-sciences' && c.pn === 2 ? [15, 40, 35, 10] : [w.level1, w.level2, w.level3, w.level4]
    const row = [1, 2, 3, 4].map((l) => {
      const pct = (c.m[l] / c.t) * 100
      const ok = Math.abs(pct - target[l - 1]) <= WEIGHTING_TOLERANCE
      return `L${l} ${pct.toFixed(1).padStart(5)}% (${String(target[l - 1]).padStart(2)}) ${ok ? 'ok ' : 'OUT'}`
    })
    console.log(`  ${key}  ${row.join('  ')}`)
  }
}
