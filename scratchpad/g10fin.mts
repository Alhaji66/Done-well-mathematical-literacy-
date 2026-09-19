import { questionsForSubject } from '../src/data/questionBank.ts'
import { groupBySubtopic } from '../src/data/subtopics.ts'
const pool = await questionsForSubject('mathematics')
for (const g of [10, 11, 12]) {
  const rows = pool.filter((q) => q.topicId === 'math-finance-growth' && q.grade === g)
  console.log(`\n--- Grade ${g}: ${rows.length} finance questions`)
  for (const grp of groupBySubtopic('math-finance-growth', rows)) console.log(`     ${String(grp.questions.length).padStart(3)}  ${grp.name}`)
}
console.log('\n--- what the Grade 10 "Outstanding balance" items actually ask ---')
const g10 = pool.filter((q) => q.topicId === 'math-finance-growth' && q.grade === 10)
const grp = groupBySubtopic('math-finance-growth', g10).find((x) => x.name === 'Outstanding balance')
for (const q of grp?.questions ?? []) console.log(`  ${q.id}: ${(q.context ?? '').slice(0, 90)} || ${q.prompt.slice(0, 90)}`)
