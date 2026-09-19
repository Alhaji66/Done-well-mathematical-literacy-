/** Items big enough to peel a short Level 1 recall part off, in one cell. */
import { papersForSubject } from '../src/data/papers/index.ts'
const g = Number(process.argv[2]), pn = Number(process.argv[3]), lvl = Number(process.argv[4])
const list: any[] = (await papersForSubject('mat-lit', pn as 1 | 2, g as any)) as any
let n = 0
for (const p of list.sort((a, b) => a.id.localeCompare(b.id)))
  for (const s of p.sections)
    for (const i of s.items) {
      if (i.cognitiveLevel !== lvl || i.marks < 4) continue
      n++
      console.log(`${i.id.padEnd(22)} ${i.marks}mk ${i.topicId.padEnd(14)} ${i.prompt.slice(0, 96)}`)
    }
console.log(`\n${n} candidates at L${lvl}, >=4 marks`)
