import { papersForSubject } from '../src/data/papers/index.ts'
const list: any[] = (await papersForSubject('mathematics')) as any
const byCell = new Map<string, Map<string, { n2: number; n3: number }>>()
for (const p of list) {
  const k = `G${p.grade} P${p.paperNumber}`
  const m = byCell.get(k) ?? new Map()
  for (const s of p.sections) for (const i of s.items) {
    if (i.cognitiveLevel !== 2 && i.cognitiveLevel !== 3) continue
    const e = m.get(i.topicId) ?? { n2: 0, n3: 0 }
    if (i.marks >= 4) e[i.cognitiveLevel === 2 ? 'n2' : 'n3'] += 2
    else if (i.marks === 3) e[i.cognitiveLevel === 2 ? 'n2' : 'n3'] += 1
    m.set(i.topicId, e)
  }
  byCell.set(k, m)
}
for (const k of [...byCell.keys()].sort()) {
  console.log(k)
  for (const [t, e] of [...byCell.get(k)!].sort()) console.log(`   ${t.padEnd(28)} L2 ${String(e.n2).padStart(4)}  L3 ${String(e.n3).padStart(4)}`)
}
