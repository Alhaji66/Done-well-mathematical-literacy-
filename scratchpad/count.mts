import { papersForSubject } from '../src/data/papers/index.ts'
const list: any[] = (await papersForSubject('life-sciences')) as any
const byGrade = new Map<number, {n:number, mk:number}>()
for (const p of list) for (const s of p.sections) for (const i of s.items) {
  if (!i.id.endsWith('-r')) continue
  const c = byGrade.get(p.grade) ?? { n: 0, mk: 0 }
  c.n++; c.mk += i.marks; byGrade.set(p.grade, c)
}
let tn = 0, tm = 0
for (const g of [10, 11, 12]) { const c = byGrade.get(g); if (c) { console.log(`Grade ${g}: ${c.n} new recall items, ${c.mk} marks`); tn += c.n; tm += c.mk } }
console.log(`total: ${tn} items, ${tm} marks`)
