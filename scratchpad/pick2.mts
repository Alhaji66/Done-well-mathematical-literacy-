import { papersForSubject } from '../src/data/papers/index.ts'
const [subj, g, pn, lvl, minMk] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4]), Number(process.argv[5]), Number(process.argv[6] ?? 4)]
const list: any[] = (await papersForSubject(subj, pn as 1|2, g as any)) as any
for (const p of list.sort((a,b)=>a.id.localeCompare(b.id))) {
  const rows = p.sections.flatMap((s: any) => s.items.filter((i: any) => i.cognitiveLevel === lvl && i.marks >= minMk).map((i: any) => ({...i, sec: s.title})))
  if (!rows.length) continue
  console.log(`### ${p.id}`)
  for (const i of rows) console.log(`  ${i.id.padEnd(24)} ${i.label.padEnd(5)} ${i.marks}mk ${i.sec.slice(0,22).padEnd(22)} ${i.prompt.slice(0,92)}`)
}
