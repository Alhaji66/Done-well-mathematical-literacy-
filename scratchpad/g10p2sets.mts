import { papersForSubject } from '../src/data/papers/index.ts'
const ps: any[] = (await papersForSubject('mathematics', 2, 10 as any)) as any
for (const p of ps) {
  const s = p.sections[0]
  for (const i of s.items) {
    if (/^1\.(1|2|3|4)\.2$/.test(i.label ?? '')) console.log(`${p.id} ${i.label} CTX=${(i.context ?? '(none)').slice(0, 60)} | ${i.prompt.slice(0, 55)} => ${i.answer.slice(0, 50)}`)
  }
}
