import { papersForSubject } from '../src/data/papers/index.ts'

const subject = process.argv[2] ?? 'physical-sciences'
const list: any[] = (await papersForSubject(subject)) as any

type Cell = { marks: Record<number, number>; total: number; items: number }
const cells = new Map<string, Cell>()

for (const p of list) {
  const key = `G${p.grade} P${p.paperNumber}`
  const c = cells.get(key) ?? { marks: { 1: 0, 2: 0, 3: 0, 4: 0 }, total: 0, items: 0 }
  for (const s of p.sections)
    for (const it of s.items) {
      const l = it.cognitiveLevel ?? 0
      c.marks[l] = (c.marks[l] ?? 0) + it.marks
      c.total += it.marks
      c.items++
    }
  cells.set(key, c)
}

for (const key of [...cells.keys()].sort()) {
  const c = cells.get(key)!
  const pct = (n: number) => ((n / c.total) * 100).toFixed(1).padStart(5)
  console.log(
    `${key}  ${String(c.items).padStart(4)} items  ${String(c.total).padStart(5)} mk   ` +
      [1, 2, 3, 4].map((l) => `L${l} ${String(c.marks[l]).padStart(5)} ${pct(c.marks[l])}%`).join('  '),
  )
}
