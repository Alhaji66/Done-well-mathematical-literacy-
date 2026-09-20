/** Emit a relevel batch for one cell from the archetype judgements. */
import { papersForSubject } from '../src/data/papers/index.ts'
import type { Archetype } from './archetypes.mts'
import * as A from './archetypes.mts'
import * as P from './phys-archetypes.mts'

const g = Number(process.argv[2])
const pn = Number(process.argv[3])
const SUBJ = process.argv[5] ?? 'mathematics'
const set: Archetype[] = ((A as any)[process.argv[4]] ?? (P as any)[process.argv[4]])
const list: any[] = (await papersForSubject(SUBJ, pn as 1 | 2, g as any)) as any

const batch: any[] = []
const tally = new Map<string, { items: number; marks: number; level: number; why: string }>()
const unmatched = new Map<string, number>()

for (const p of list.sort((a, b) => a.id.localeCompare(b.id)))
  for (const s of p.sections)
    for (const i of s.items) {
      if (i.cognitiveLevel !== 2 && i.cognitiveLevel !== 3) continue
      const prompt = i.prompt.replace(/\s+/g, ' ')
      const hit = set.find((a) => a.re.test(prompt))
      if (!hit) {
        const key = prompt.replace(/-?[0-9]+([,.][0-9]+)?/g, '#').slice(0, 70)
        unmatched.set(key, (unmatched.get(key) ?? 0) + i.marks)
        continue
      }
      const k = hit.re.source
      const t = tally.get(k) ?? { items: 0, marks: 0, level: hit.level, why: hit.why }
      t.items++; t.marks += i.marks
      tally.set(k, t)
      if (i.cognitiveLevel !== hit.level) batch.push({ id: i.id, from: i.cognitiveLevel, to: hit.level })
    }

for (const [, t] of [...tally].sort((a, b) => b[1].marks - a[1].marks))
  console.error(`L${t.level}  ${String(t.items).padStart(3)} items ${String(t.marks).padStart(4)} marks   ${t.why}`)
let after2 = 0, after3 = 0
for (const [, t] of tally) (t.level === 2 ? (after2 += t.marks) : (after3 += t.marks))
const unMarks = [...unmatched.values()].reduce((a, b) => a + b, 0)
if (unmatched.size) {
  console.error(`\n${unmatched.size} archetype(s), ${unMarks} marks, keep the level they have:`)
  for (const [k, m] of [...unmatched].sort((a, b) => b[1] - a[1])) console.error(`   ${String(m).padStart(4)}mk  ${k}`)
}
console.error(`\nLevels 2 and 3 after this batch: L2 ${after2} marks, L3 ${after3} marks, ${unMarks} unjudged`)
console.error(`${batch.length} item(s) change level`)
console.log(JSON.stringify(batch, null, 1))
