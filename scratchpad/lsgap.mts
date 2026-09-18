import { papersForSubject } from '../src/data/papers/index.ts'
for (const g of [10, 11] as const) {
  const list: any[] = (await papersForSubject('life-sciences', undefined, g)) as any
  let total = 0, l1 = 0, items = 0, oneMark = 0
  const dist = new Map<number, number>()
  for (const p of list) for (const s of p.sections) for (const i of s.items) {
    total += i.marks; items++
    if (i.cognitiveLevel === 1) l1 += i.marks
    if (i.marks === 1) oneMark++
    dist.set(i.marks, (dist.get(i.marks) ?? 0) + 1)
  }
  const want = Math.round(total * 0.40)
  console.log(`Grade ${g}: ${list.length} papers, ${items} items, ${total} mk`)
  console.log(`  L1 ${l1} (${((l1/total)*100).toFixed(1)}%)  target 40% = ${want} mk  SHORTFALL ${want - l1}`)
  console.log(`  1-mark items: ${oneMark}   mark sizes: ${[...dist.entries()].sort((a,b)=>a[0]-b[0]).map(([m,n])=>`${m}mk×${n}`).join(' ')}`)
}
