import { papersForSubject } from '../src/data/papers/index.ts'
import { capsWeightingFor } from '../src/data/capsWeighting.ts'
const list: any[] = (await papersForSubject('mathematics')) as any
const cells = new Map<string, { mk: Record<number, number>; t: number; g: number }>()
for (const p of list) {
  const k = `G${p.grade} P${p.paperNumber}`
  const c = cells.get(k) ?? { mk: { 1: 0, 2: 0, 3: 0, 4: 0 }, t: 0, g: p.grade }
  for (const s of p.sections) for (const i of s.items) { c.mk[i.cognitiveLevel] += i.marks; c.t += i.marks }
  cells.set(k, c)
}
console.log('cell       total   L4 now   L4 target   marks of L4 still needed')
let need = 0
for (const k of [...cells.keys()].sort()) {
  const c = cells.get(k)!
  const w = capsWeightingFor('mathematics', c.g as any)!
  const n = Math.max(0, Math.ceil((w.level4 / 100) * c.t - c.mk[4]))
  need += n
  console.log(`${k}  ${String(c.t).padStart(5)}   ${((c.mk[4] / c.t) * 100).toFixed(1).padStart(5)}%      ${String(w.level4).padStart(2)}%        ${String(n).padStart(4)} mk`)
}
console.log(`\nTOTAL Level 4 shortfall in Mathematics: ${need} marks`)
