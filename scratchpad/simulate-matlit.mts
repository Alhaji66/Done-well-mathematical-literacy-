import { papersForSubject } from '../src/data/papers/index.ts'
import { capsWeightingFor, WEIGHTING_TOLERANCE } from '../src/data/capsWeighting.ts'

const CANDIDATE =
  /\b((state|explain|say|decide) (whether|which|why)[^.]{0,80}\b(better|best|more useful|more appropriate|more reliable|more representative|should (be )?(use|used|rely|relied|choose|chosen|take|taken)|actually means|really means|means that|is the same as|qualifies as|counts as)\b)/i

const list: any[] = (await papersForSubject('mat-lit')) as any
const cells = new Map<string, any>()
for (const p of list) {
  const key = `G${p.grade} P${p.paperNumber}`
  const c = cells.get(key) ?? { now: {1:0,2:0,3:0,4:0}, after: {1:0,2:0,3:0,4:0}, t: 0, g: p.grade }
  for (const s of p.sections) for (const i of s.items) {
    const stored = i.cognitiveLevel as 1|2|3|4
    const after = stored !== 4 && CANDIDATE.test(i.prompt) ? 4 : stored
    c.now[stored] += i.marks
    c.after[after] += i.marks
    c.t += i.marks
  }
  cells.set(key, c)
}

const w = capsWeightingFor('mat-lit', 12)!
const target = [w.level1, w.level2, w.level3, w.level4]
console.log('Mat Lit, Level 4 only, against a 20% target (tolerance ±5, so ≥15% passes)\n')
for (const key of [...cells.keys()].sort()) {
  const c = cells.get(key)!
  const nowPct = (c.now[4] / c.t) * 100
  const aftPct = (c.after[4] / c.t) * 100
  console.log(
    `  ${key}  now ${nowPct.toFixed(1).padStart(5)}%  ->  after relabel ${aftPct.toFixed(1).padStart(5)}%` +
      `   (${c.now[4]} -> ${c.after[4]} marks of ${c.t})`,
  )
}
const totNow = [...cells.values()].reduce((s, c) => s + c.now[4], 0)
const totAft = [...cells.values()].reduce((s, c) => s + c.after[4], 0)
const totT = [...cells.values()].reduce((s, c) => s + c.t, 0)
console.log(`\n  subject total: ${totNow} -> ${totAft} marks of ${totT}  (${((totNow/totT)*100).toFixed(1)}% -> ${((totAft/totT)*100).toFixed(1)}%)`)
console.log(`  target ${target[3]}%, so the shortfall is ${Math.round(totT*target[3]/100 - totAft)} marks AFTER relabelling`)
