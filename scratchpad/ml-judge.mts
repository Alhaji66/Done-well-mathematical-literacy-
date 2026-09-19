/**
 * How many Mat Lit Level 3 items END on a demand for a defended judgement?
 *
 * Deliberately conservative: the clause must be the LAST one in the prompt
 * (nothing after it but the full stop), because a judgement asked in the
 * middle is usually scene-setting, and it must be introduced by a command
 * verb rather than merely mention an evaluative word.
 */
import { papersForSubject } from '../src/data/papers/index.ts'

const FINAL_JUDGEMENT =
  /,\s*and\s+(state|say|explain|comment on|decide|justify|give (a|one) reason)\b[^.]*\.?\s*$/i

const list: any[] = (await papersForSubject('mat-lit')) as any
const cells = new Map<string, { hit: number; hitMk: number; l3: number; l3Mk: number; t: number; l4Mk: number }>()
const samples: string[] = []
for (const p of list) {
  const key = `G${p.grade} P${p.paperNumber}`
  const c = cells.get(key) ?? { hit: 0, hitMk: 0, l3: 0, l3Mk: 0, t: 0, l4Mk: 0 }
  for (const s of p.sections)
    for (const i of s.items) {
      c.t += i.marks
      if (i.cognitiveLevel === 4) c.l4Mk += i.marks
      if (i.cognitiveLevel !== 3) continue
      c.l3++
      c.l3Mk += i.marks
      if (FINAL_JUDGEMENT.test(i.prompt)) {
        c.hit++
        c.hitMk += i.marks
        samples.push(`${i.id} [${i.marks}mk] ${i.prompt.slice(-150)}`)
      }
    }
  cells.set(key, c)
}
console.log('cell       L3 items  of which ending on a judgement   marks    L4 now   L4 if those moved')
for (const key of [...cells.keys()].sort()) {
  const c = cells.get(key)!
  console.log(
    `${key}  ${String(c.l3).padStart(8)}  ${String(c.hit).padStart(6)} (${((c.hit / c.l3) * 100).toFixed(0).padStart(2)}%)` +
      `                ${String(c.hitMk).padStart(5)}    ${((c.l4Mk / c.t) * 100).toFixed(1).padStart(5)}%   ${(((c.l4Mk + c.hitMk) / c.t) * 100).toFixed(1).padStart(5)}%`,
  )
}
const tot = [...cells.values()].reduce((s, c) => s + c.hitMk, 0)
console.log(`\ntotal marks sitting in L3 that end on a judgement: ${tot}`)
console.log(`\n--- systematic sample (every 25th):`)
for (let i = 0; i < samples.length; i += 25) console.log(`  ${samples[i]}`)
