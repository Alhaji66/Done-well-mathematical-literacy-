/**
 * Questions a single learner can actually meet twice.
 *
 * Same grade, same paper number, different predicted set -- A, B and C are
 * written to be sat back to back, so a question in two of them is the same
 * question twice for one learner. Repeats across GRADES or across PAPER
 * NUMBERS are not this: nobody sits Grade 10 and Grade 11, or Paper 1 as
 * Paper 2.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
let n = 0
for (const subject of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const g = new Map<string, any[]>()
  for (const p of list) for (const s of p.sections) for (const i of s.items)
    g.set(`${subject}||${norm(i.prompt)}||${norm(i.context ?? '')}`,
      [...(g.get(`${subject}||${norm(i.prompt)}||${norm(i.context ?? '')}`) ?? []), { ...i, grade: p.grade, pn: p.paperNumber, paper: p.id }])
  for (const [, v] of g) {
    if (v.length < 2) continue
    const cells = new Set(v.map((i: any) => `${i.grade}/${i.pn}`))
    if (cells.size !== 1) continue
    if (new Set(v.map((i: any) => i.paper)).size !== v.length) continue
    n++
    console.log(`${subject} G${v[0].grade} P${v[0].pn} [${v[0].marks}mk]  ${v.map((i: any) => i.id).join('  ')}`)
    console.log(`   ${v[0].prompt.slice(0, 100)}`)
  }
}
console.log(`\n${n} group(s) a single learner could meet twice`)
