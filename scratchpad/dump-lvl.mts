/** Every item in one cell at one level, for reading. */
import { papersForSubject } from '../src/data/papers/index.ts'
const SUBJ = process.argv[5] ?? "mathematics"
const g = Number(process.argv[2]), pn = Number(process.argv[3]), lvl = Number(process.argv[4])
const list: any[] = (await papersForSubject(SUBJ, pn as 1 | 2, g as any)) as any
let marks = 0, n = 0
for (const p of list.sort((a, b) => a.id.localeCompare(b.id)))
  for (const s of p.sections)
    for (const i of s.items) {
      if (i.cognitiveLevel !== lvl) continue
      marks += i.marks; n++
      console.log(`${i.id}\t${i.marks}\t${i.prompt.replace(/\s+/g, ' ')}`)
    }
console.error(`${n} items, ${marks} marks at L${lvl} in G${g} P${pn}`)
