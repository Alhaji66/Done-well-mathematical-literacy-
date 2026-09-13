/**
 * Every paper's marks must add up, at both levels.
 *
 *   sum(item.marks) === section.marks       for every section
 *   sum(section.marks) === paper.totalMarks for every paper
 *
 * These totals are what the paper runner shows a learner and what the coverage
 * report divides by, so a paper whose parts do not sum to its whole quietly
 * misstates every percentage derived from it.
 *
 * Nothing checked this before. It held anyway across all 1 071 sections, which
 * is exactly why it needed a guard: an invariant that has always been true by
 * hand is the one most likely to break the first time anything edits marks in
 * bulk -- splitting a six-mark item into a two-mark opener and a four-mark
 * remainder, say, where dropping a digit leaves the section one mark short and
 * nothing complains.
 */
import { papersForSubject } from '../src/data/papers/index.ts'

const SUBJECTS = ['mat-lit', 'mathematics', 'physical-sciences', 'life-sciences']

const problems: string[] = []
let sections = 0
let papers = 0

for (const subject of SUBJECTS) {
  for (const paper of await papersForSubject(subject)) {
    papers++
    let sectionSum = 0

    for (const section of paper.sections) {
      sections++
      const itemSum = section.items.reduce((sum, item) => sum + (item.marks ?? 0), 0)
      if (itemSum !== section.marks) {
        problems.push(
          `${paper.id} Q${section.number} (${section.title}): items total ${itemSum}, section says ${section.marks}`,
        )
      }
      sectionSum += section.marks
    }

    if (sectionSum !== paper.totalMarks) {
      problems.push(`${paper.id}: sections total ${sectionSum}, paper says ${paper.totalMarks}`)
    }
  }
}

if (problems.length) {
  for (const p of problems) console.error(`  ${p}`)
  console.error(`\n${problems.length} paper(s) whose marks do not add up.`)
  process.exit(1)
}
console.log(`Checked ${sections} sections across ${papers} papers. Every paper's marks add up.`)
