/**
 * How many paper items carry a marking memo.
 *
 * THE ANSWER, at the time of writing, IS NONE OF THEM: 0 of 7 685.
 *
 * This is worth a script rather than a memory, because `npm run check:memos`
 * reports "Checked 55 marking memo(s)" and that number reads like coverage
 * when it is not. All 55 live in the small standalone set in
 * src/data/questions.ts. Every item in a full paper -- everything a learner
 * meets in Assessments or a weekly test -- has none.
 *
 * What that costs: the weekly-test marking screen asks a learner to award
 * themselves marks against a model answer with no mark allocation to award
 * them from. They can see the working; they cannot see where the 5 marks are.
 *
 * Run:  npx tsx scratchpad/memo.mts
 */
import { papersForSubject } from '../src/data/papers/index.ts'
let total = 0, withMemo = 0
for (const s of ['mat-lit','mathematics','life-sciences','physical-sciences']) {
  const list: any[] = (await papersForSubject(s)) as any
  for (const p of list) for (const sec of p.sections) for (const i of sec.items) {
    total++
    if ((i as any).memo?.length) withMemo++
  }
}
console.log(`paper items: ${total}; carrying a marking memo: ${withMemo} (${((withMemo/total)*100).toFixed(1)}%)`)
