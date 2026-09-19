import { papersForSubject } from '../src/data/papers/index.ts'
const g = Number(process.argv[2]), pn = Number(process.argv[3]), min = Number(process.argv[4] ?? 5)
const list: any[] = (await papersForSubject('mathematics', pn as 1 | 2, g as any)) as any
let n = 0
for (const p of list.sort((a, b) => a.id.localeCompare(b.id)))
  for (const s of p.sections)
    for (const i of s.items) {
      if (i.cognitiveLevel === 4 || i.marks < min) continue
      n++
      console.log(`${i.id.padEnd(22)} ${i.marks}mk L${i.cognitiveLevel} ${i.topicId.padEnd(16)} ${i.prompt.slice(0, 82)}`)
    }
console.log(`\n${n} candidates`)
