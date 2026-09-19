import { papersForSubject } from '../src/data/papers/index.ts'
const byMarks = new Map<number, number>()
let total = 0, withMemo = 0
for (const s of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  for (const p of (await papersForSubject(s)) as any[])
    for (const sec of p.sections) for (const i of sec.items) {
      total++
      if (i.memo?.length) withMemo++
      byMarks.set(i.marks, (byMarks.get(i.marks) ?? 0) + 1)
    }
}
console.log(`${withMemo} of ${total} paper items carry a memo (${((withMemo/total)*100).toFixed(1)}%)`)
console.log('\nitems by mark value:')
for (const [m, n] of [...byMarks.entries()].sort((a,b)=>a[0]-b[0]))
  console.log(`  ${String(m).padStart(2)} mark(s): ${String(n).padStart(4)} items  ${(n*m).toString().padStart(5)} marks`)
