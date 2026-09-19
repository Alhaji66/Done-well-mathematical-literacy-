/**
 * Report how much of the corpus a learner can mark their own work against.
 *
 * A memo is what makes self-marking possible: it says where each mark comes
 * from, so a learner who got the right answer by the wrong route, or the wrong
 * answer by the right one, can see which. Without it, "3 out of 5" is a number
 * with no lesson attached.
 *
 * THIS REPORTS AND DOES NOT FAIL, because the honest position is that almost
 * nothing is covered yet and a failing build would say only that. What it does
 * enforce is direction: the count should never go down. check:memos is the
 * guard that fails, and it checks that the memos which DO exist balance.
 *
 * WHY THESE ARE NOT GENERATED. Every explanation in the corpus describes a
 * method, so a memo could be produced from one mechanically. The allocation
 * could not: deciding that a 5-mark question gives 1 mark for the formula, 2
 * for substitution and 2 for the answer is a judgement about what is being
 * tested. check-memos.mts puts it plainly -- a memo that allocates 4 marks to
 * a 5-mark question "is worse than showing no memo at all". Guessing at scale
 * would produce thousands of them.
 *
 *   npm run check:memo-coverage
 */
import { questions } from '../src/data/questions.ts'
import { papersForSubject } from '../src/data/papers/index.ts'

let bankWith = 0
for (const q of questions) if (q.memo?.length) bankWith++
console.log(`question bank: ${bankWith} of ${questions.length} items carry a memo`)

let total = 0
let withMemo = 0
const complete: string[] = []
const partial: string[] = []
for (const subject of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  for (const p of (await papersForSubject(subject)) as any[]) {
    let n = 0
    let m = 0
    for (const s of p.sections)
      for (const i of s.items) {
        n++
        if (i.memo?.length) m++
      }
    total += n
    withMemo += m
    if (m === n && n > 0) complete.push(`${p.id} (${n} items)`)
    else if (m > 0) partial.push(`${p.id} (${m} of ${n})`)
  }
}

console.log(`papers:        ${withMemo} of ${total} items carry a memo (${((withMemo / total) * 100).toFixed(1)}%)`)
console.log(`\nfully marked papers: ${complete.length}`)
for (const c of complete) console.log(`  ${c}`)
if (partial.length) {
  console.log(`\npartially marked, and worth finishing: ${partial.length}`)
  for (const p of partial) console.log(`  ${p}`)
}
console.log(
  `\nA paper is only useful for self-marking when EVERY item in it has a memo,\n` +
    `which is why the unit of work here is a whole paper and not a batch of items.`,
)
