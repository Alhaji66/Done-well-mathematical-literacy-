import { papersForSubject } from '../src/data/papers/index.ts'
const ps: any[] = (await papersForSubject('mathematics', 2, 10 as any)) as any
for (const p of ps) {
  const s = p.sections[0]
  const shared = s.items.filter((i: any) => /Data set: 12, 15, 9, 18, 15, 21, 15/.test(i.context ?? '') || /answer to 1\.4|range of the data set\.$|any outliers/.test(i.prompt))
  console.log(`--- ${p.id}: ${shared.length} items on the shared set`)
  for (const i of shared) console.log(`   ${i.label} ${i.id} ${i.marks}mk :: ${i.prompt.slice(0, 80)} => ${i.answer.slice(0, 60)}`)
}
