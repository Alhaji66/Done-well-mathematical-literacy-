/**
 * Where Mathematical Literacy stands against CAPS, cell by cell, and how many
 * marks of Level 4 each cell still needs.
 *
 * Run after every batch: the "need" column is the authoring queue.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import { capsWeightingFor } from '../src/data/capsWeighting.ts'

const list: any[] = (await papersForSubject('mat-lit')) as any
const cells = new Map<string, { mk: Record<number, number>; t: number }>()
for (const p of list) {
  const key = `G${p.grade} P${p.paperNumber}`
  const c = cells.get(key) ?? { mk: { 1: 0, 2: 0, 3: 0, 4: 0 }, t: 0 }
  for (const s of p.sections)
    for (const i of s.items) {
      c.mk[i.cognitiveLevel] += i.marks
      c.t += i.marks
    }
  cells.set(key, c)
}

const w = capsWeightingFor('mat-lit', 12)!
const target = { 1: w.level1, 2: w.level2, 3: w.level3, 4: w.level4 }
console.log('cell       total   L1      L2      L3      L4      L4 need (to hit 20%)')
let needTotal = 0
for (const key of [...cells.keys()].sort()) {
  const c = cells.get(key)!
  const pct = (l: number) => ((c.mk[l] / c.t) * 100).toFixed(1).padStart(5)
  const need = Math.max(0, Math.ceil((target[4] / 100) * c.t - c.mk[4]))
  needTotal += need
  console.log(
    `${key}  ${String(c.t).padStart(5)}  ${pct(1)}%  ${pct(2)}%  ${pct(3)}%  ${pct(4)}%   ${String(need).padStart(4)} mk`,
  )
}
console.log(`\ntarget L1 ${target[1]}%  L2 ${target[2]}%  L3 ${target[3]}%  L4 ${target[4]}%`)
console.log(`TOTAL Level 4 shortfall: ${needTotal} marks`)
