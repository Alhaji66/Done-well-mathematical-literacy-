/**
 * Every marking memo must add up to its question's marks.
 *
 * A memo is a promise about where marks come from, and a learner uses it to
 * mark their own work. One that allocates 4 marks to a 5-mark question teaches
 * them to expect the wrong total, which is worse than showing no memo at all --
 * so this is a build failure, not a warning.
 *
 * The card does degrade gracefully if one slips through (it prints a note
 * saying the split is a guide), but that is a safety net for data loaded at
 * runtime, not a licence to ship a memo that does not balance.
 */
import { questions } from '../src/data/questions.ts'
import { papersForSubject } from '../src/data/papers/index.ts'
import { MEMO_CODE_MEANINGS, type Question } from '../src/types/index.ts'

const problems: string[] = []
let withMemo = 0

function check(q: Question, where: string) {
  if (!q.memo?.length) return
  withMemo++

  const allocated = q.memo.reduce((sum, s) => sum + s.marks, 0)
  if (allocated !== q.marks) {
    problems.push(`${where} ${q.id}: memo allocates ${allocated} but the question is worth ${q.marks}`)
  }
  for (const step of q.memo) {
    if (!(step.code in MEMO_CODE_MEANINGS)) {
      problems.push(`${where} ${q.id}: unknown mark code "${step.code}"`)
    }
    if (step.marks < 1) {
      problems.push(`${where} ${q.id}: a "${step.code}" step is worth ${step.marks} marks`)
    }
    if (!step.text.trim()) {
      problems.push(`${where} ${q.id}: a "${step.code}" step has no text`)
    }
  }
}

for (const q of questions) check(q, 'bank')

for (const subject of ['mat-lit', 'mathematics', 'physical-sciences', 'life-sciences']) {
  for (const paper of await papersForSubject(subject)) {
    for (const section of paper.sections) {
      for (const item of section.items) check(item, paper.id)
    }
  }
}

if (problems.length) {
  for (const p of problems) console.error(`  ${p}`)
  console.error(`\n${problems.length} memo problem(s).`)
  process.exit(1)
}
console.log(`Checked ${withMemo} marking memo(s). Every one adds up to its question's marks.`)
