import { questionsForSubject } from '../src/data/questionBank.ts'
const pool = await questionsForSubject('mathematics')
for (const q of pool.filter((x) => /hire[- ]?purchase/i.test(`${x.prompt} ${x.context ?? ''}`))) {
  console.log(`G${q.grade} ${q.topicId} ${q.id}: ${(q.context ?? '').slice(0, 70)} || ${q.prompt.slice(0, 70)}`)
}
