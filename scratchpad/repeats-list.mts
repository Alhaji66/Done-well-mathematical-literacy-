import { papersForSubject } from '../src/data/papers/index.ts'
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
let i = 0
for (const subject of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const g = new Map<string, any[]>()
  for (const p of list)
    for (const s of p.sections)
      for (const it of s.items) {
        const k = `${subject}||${norm(it.prompt)}||${norm(it.context ?? '')}`
        g.set(k, [...(g.get(k) ?? []), { ...it, grade: p.grade, pn: p.paperNumber, paper: p.id }])
      }
  for (const [, v] of g) {
    if (v.length < 2) continue
    if (new Set(v.map((x: any) => x.paper)).size < v.length) continue
    if (new Set(v.map((x: any) => `${x.grade}/${x.pn}`)).size !== 1) continue
    if (!(v[0].marks >= 4 && /\d/.test(v[0].prompt))) continue
    i++
    console.log(`\n#${i}  ${subject} G${v[0].grade} P${v[0].pn}  ${v[0].marks}mk L${v[0].cognitiveLevel}  ${v.length} copies`)
    console.log(`    ids: ${v.map((x: any) => `${x.id} [${x.paper}]`).join('  ')}`)
    if (v[0].context) console.log(`    CTX: ${v[0].context}`)
    console.log(`    Q: ${v[0].prompt}`)
    console.log(`    A: ${v[0].answer}`)
  }
}
console.log(`\n${i} groups`)
