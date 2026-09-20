import { questionsForSubject } from '../src/data/questionBank.ts'
import { groupBySubtopic } from '../src/data/subtopics.ts'
const pool = await questionsForSubject('mathematics')
for (const [topic, name] of [
  ['math-finance-growth', 'Outstanding balance'],
  ['math-euclidean-geometry', 'Proportionality and the mid-point theorem'],
] as const) {
  console.log(`\n===== ${topic} / ${name}`)
  for (const g of [10, 11, 12]) {
    const rows = pool.filter((q) => q.topicId === topic && q.grade === g)
    const grp = groupBySubtopic(topic, rows).find((x) => x.name === name)
    console.log(` -- Grade ${g}: ${grp?.questions.length ?? 0}`)
    for (const q of (grp?.questions ?? []).slice(0, 4)) console.log(`      ${q.prompt.slice(0, 120)}`)
  }
}
