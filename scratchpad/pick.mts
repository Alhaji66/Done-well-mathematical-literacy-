import { papersForSubject } from '../src/data/papers/index.ts'

const subject = process.argv[2]
const grade = Number(process.argv[3])
const paperNo = Number(process.argv[4])
const level = Number(process.argv[5])
const list: any[] = (await papersForSubject(subject, paperNo as 1 | 2, grade as any)) as any

for (const p of list.sort((a, b) => a.id.localeCompare(b.id))) {
  const rows = p.sections.flatMap((s: any) =>
    s.items.filter((i: any) => i.cognitiveLevel === level).map((i: any) => ({ ...i, sec: s.title })),
  )
  if (!rows.length) continue
  console.log(`\n### ${p.id}  (${p.title})`)
  for (const i of rows)
    console.log(`  ${i.id.padEnd(26)} ${i.label.padEnd(6)} [${i.marks}mk] ${i.sec.slice(0, 28).padEnd(28)} ${i.prompt.slice(0, 110)}`)
}
