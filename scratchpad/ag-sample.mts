import { filterSubjectQuestions } from '../src/data/questionBank.ts'
const qs = await filterSubjectQuestions('mathematics', { topicId: 'math-analytical-geometry', grade: 11 })
for (const q of qs.slice(0, 8)) {
  console.log('---', q.id, q.marks + 'mk', 'L' + q.cognitiveLevel, q.difficulty)
  console.log('Q:', q.prompt)
  console.log('A:', q.answer)
  console.log('E:', (q.explanation ?? '').slice(0, 200))
}
console.log('\ncount G11 =', qs.length)
