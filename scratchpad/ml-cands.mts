/** Dump Level 3 candidates for a Mat Lit cell, full text, for rewriting to Level 4. */
import { papersForSubject } from '../src/data/papers/index.ts'
const g = Number(process.argv[2])
const pn = Number(process.argv[3])
const paperFilter = process.argv[4] ?? ''
const list: any[] = (await papersForSubject('mat-lit', pn as 1 | 2, g as any)) as any
for (const p of list.sort((a, b) => a.id.localeCompare(b.id))) {
  if (paperFilter && !p.id.includes(paperFilter)) continue
  const rows = p.sections.flatMap((s: any) =>
    s.items.filter((i: any) => i.cognitiveLevel === 3).map((i: any) => ({ ...i, sec: s.title })),
  )
  if (!rows.length) continue
  console.log(`\n### ${p.id}  (${p.title})`)
  for (const i of rows) {
    console.log(`--- ${i.id}  [${i.label}] ${i.marks}mk  topic=${i.topicId}  diff=${i.difficulty}`)
    if (i.context) console.log(`    CTX: ${i.context}`)
    console.log(`    Q: ${i.prompt}`)
    console.log(`    A: ${i.answer}`)
    console.log(`    E: ${i.explanation}`)
  }
}
