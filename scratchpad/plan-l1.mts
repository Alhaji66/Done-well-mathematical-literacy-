/** Per cell: how many marks must move from L2 to L1, and whether the supply exists. */
import { papersForSubject } from '../src/data/papers/index.ts'
import { capsWeightingFor, WEIGHTING_TOLERANCE as TOL } from '../src/data/capsWeighting.ts'
const subj = process.argv[2]
const list: any[] = (await papersForSubject(subj)) as any
const cells = new Map<string, any>()
for (const p of list) {
  const k = `G${p.grade} P${p.paperNumber}`
  const c = cells.get(k) ?? { mk: {1:0,2:0,3:0,4:0}, t: 0, g: p.grade, supply2: 0, supply3: 0 }
  for (const s of p.sections) for (const i of s.items) {
    c.mk[i.cognitiveLevel] += i.marks; c.t += i.marks
    if (i.marks >= 4) { if (i.cognitiveLevel === 2) c.supply2 += 2; if (i.cognitiveLevel === 3) c.supply3 += 2 }
  }
  cells.set(k, c)
}
console.log('cell      L1 now  ->  L1 min   need   from L2 (avail)   from L3 (avail)   L2 after   L3 after')
for (const k of [...cells.keys()].sort()) {
  const c = cells.get(k)!
  const w = capsWeightingFor(subj, c.g as any)!
  const l1min = Math.ceil(((w.level1 - TOL) / 100) * c.t)
  const need = Math.max(0, l1min - c.mk[1] + Math.ceil(0.015 * c.t)) // aim just inside the band
  const l2max = Math.floor(((w.level2 + TOL) / 100) * c.t)
  const fromL2 = Math.min(need, Math.max(0, c.mk[2] - Math.ceil(((w.level2 - TOL)/100) * c.t)))
  const fromL3 = need - fromL2
  console.log(
    `${k}  ${((c.mk[1]/c.t)*100).toFixed(1).padStart(5)}%  ->  ${((l1min/c.t)*100).toFixed(0)}%   ${String(need).padStart(4)}   ` +
    `${String(fromL2).padStart(4)} (${String(c.supply2).padStart(4)})      ${String(fromL3).padStart(4)} (${String(c.supply3).padStart(4)})    ` +
    `${(((c.mk[2]-fromL2)/c.t)*100).toFixed(1)}%     ${(((c.mk[3]-fromL3)/c.t)*100).toFixed(1)}%   [L2 band ${w.level2-TOL}-${w.level2+TOL}, L3 band ${w.level3-TOL}-${w.level3+TOL}]`,
  )
}
