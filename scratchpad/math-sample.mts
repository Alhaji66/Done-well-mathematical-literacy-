/**
 * Systematic sample of the Mathematics corpus for hand-labelling.
 *
 * Every 73rd item by id, so the sample is reproducible and cannot have been
 * chosen. The STORED LEVEL IS HIDDEN, because a label written after seeing the
 * machine's answer measures nothing.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
const list: any[] = (await papersForSubject('mathematics')) as any
const all: any[] = []
for (const p of list) for (const s of p.sections) for (const i of s.items) all.push({ ...i, grade: p.grade, pn: p.paperNumber })
all.sort((a, b) => a.id.localeCompare(b.id))
console.log(`${all.length} items; sampling every 73rd\n`)
for (let n = 0; n < all.length; n += 73) {
  const i = all[n]
  console.log(`'${i.id}':  [G${i.grade} P${i.pn} ${i.marks}mk]  ${i.prompt.slice(0, 118)}`)
}
