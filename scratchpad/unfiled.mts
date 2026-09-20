import { topicsForSubject } from '../src/data/topics.ts'
import { questionsForSubject } from '../src/data/questionBank.ts'
import { groupBySubtopic, UNSORTED } from '../src/data/subtopics.ts'
let gt = 0, gu = 0
for (const s of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  const pool = await questionsForSubject(s)
  let tot = 0, un = 0
  for (const t of topicsForSubject(s)) {
    const rows = pool.filter((q) => q.topicId === t.id)
    if (!rows.length) continue
    for (const g of groupBySubtopic(t.id, rows)) { tot += g.questions.length; if (g.name === UNSORTED) un += g.questions.length }
  }
  gt += tot; gu += un
  console.log(`${s.padEnd(18)} ${String(un).padStart(4)} / ${String(tot).padStart(5)} unfiled  ${((un / tot) * 100).toFixed(1)}%`)
}
console.log(`${'TOTAL'.padEnd(18)} ${String(gu).padStart(4)} / ${String(gt).padStart(5)} unfiled  ${((gu / gt) * 100).toFixed(1)}%`)
