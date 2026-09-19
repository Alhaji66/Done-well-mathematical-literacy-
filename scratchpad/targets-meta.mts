import { papersForSubject } from '../src/data/papers/index.ts'
const ids = process.argv.slice(2)
const rows: any[] = []
for (const s of ['mat-lit', 'mathematics', 'physical-sciences']) {
  const ps: any[] = (await papersForSubject(s)) as any
  for (const p of ps) for (const sec of p.sections) for (const i of sec.items)
    if (ids.includes(i.id)) rows.push({ id: i.id, difficulty: i.difficulty, cognitiveLevel: i.cognitiveLevel, marks: i.marks, explanation: i.explanation })
}
console.log(JSON.stringify(rows, null, 1))
