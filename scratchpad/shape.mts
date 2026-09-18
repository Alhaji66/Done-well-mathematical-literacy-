import { papersForSubject } from '../src/data/papers/index.ts'
const [g, pn] = [Number(process.argv[2]), Number(process.argv[3])]
const list: any[] = (await papersForSubject('physical-sciences', pn as 1|2, g as any)) as any
const p = list.sort((a,b)=>a.id.localeCompare(b.id))[0]
console.log(p.id, p.title)
for (const s of p.sections) {
  console.log(`  Q${s.number} ${s.title} [${s.marks}]`)
  for (const i of s.items) console.log(`    ${i.label.padEnd(5)} L${i.cognitiveLevel} ${String(i.marks).padStart(2)}mk  ${i.prompt.slice(0,78)}`)
}
