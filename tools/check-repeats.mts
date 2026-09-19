/**
 * Report where a single learner meets the same question twice.
 *
 * WHY THIS REPORTS RATHER THAN FAILS. Repetition is not automatically a fault.
 * A real exam asks "State Ohm's Law" most years, and a learner working through
 * six past papers SHOULD meet the core definitions six times -- that is spaced
 * repetition, not laziness. What the build can insist on is the one case that
 * is always a mistake: the same question twice inside ONE paper, awarding the
 * same marks for the same recall.
 *
 * The scope distinctions matter more than the totals:
 *
 *   INSIDE ONE PAPER -- always a mistake, and a hard failure below.
 *   SAME GRADE AND PAPER NUMBER -- one learner can meet both. Fine for a
 *     definition, poor for a long calculation, where an identical 7-mark
 *     question in two papers is a wasted opportunity rather than practice.
 *   ACROSS GRADES OR PAPER NUMBERS -- nobody sits Grade 10 and Grade 11, or
 *     Paper 1 as Paper 2. Not reported.
 *
 * The long-calculation count is the one worth acting on, and it is deliberately
 * NOT auto-fixed: varying the numbers means regenerating answers and worked
 * explanations, and a wrong answer key does a learner more harm than a repeated
 * question. Those need a person.
 *
 *   npm run check:repeats
 */
import { papersForSubject } from '../src/data/papers/index.ts'

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')

let insidePaper = 0
let sameCell = 0
let longCalc = 0
const examples: string[] = []

for (const subject of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const g = new Map<string, any[]>()
  for (const p of list)
    for (const s of p.sections)
      for (const i of s.items) {
        const k = `${subject}||${norm(i.prompt)}||${norm(i.context ?? '')}`
        g.set(k, [...(g.get(k) ?? []), { ...i, grade: p.grade, pn: p.paperNumber, paper: p.id }])
      }
  for (const [, v] of g) {
    if (v.length < 2) continue
    if (new Set(v.map((i: any) => i.paper)).size < v.length) {
      insidePaper++
      console.error(`  SAME PAPER  ${v.map((i: any) => i.id).join(' ')}\n      ${v[0].prompt.slice(0, 88)}`)
      continue
    }
    if (new Set(v.map((i: any) => `${i.grade}/${i.pn}`)).size !== 1) continue
    sameCell++
    // A long question carrying its own numbers is a calculation, not a definition.
    if (v[0].marks >= 4 && /\d/.test(v[0].prompt)) {
      longCalc++
      if (examples.length < 6) examples.push(`  ${v[0].marks}mk  ${v.map((i: any) => i.id).join(' ')}\n      ${v[0].prompt.slice(0, 88)}`)
    }
  }
}

if (insidePaper) {
  console.error(`\n${insidePaper} question(s) repeat inside a single paper. That is always a mistake.`)
  process.exit(1)
}
console.log(`No question repeats inside a single paper.`)
console.log(`${sameCell} repeat within a grade and paper number, which one learner can meet twice.`)
console.log(`Of those, ${longCalc} are calculations of 4 marks or more -- worth varying by hand:`)
for (const e of examples) console.log(e)
