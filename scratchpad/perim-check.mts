import { perimeterQuestions } from '../src/data/perimeterQuestions.ts'
import { subtopicFor } from '../src/data/subtopics.ts'
for (const q of perimeterQuestions) {
  const memoSum = (q.memo ?? []).reduce((a, s) => a + s.marks, 0)
  const bucket = subtopicFor(q) ?? '*** UNSORTED ***'
  console.log(`G${q.grade} ${q.id.padEnd(30)} ${q.marks}mk memo=${memoSum} L${q.cognitiveLevel} ${bucket}`)
}
console.log('\n--- full text of three, to read ---')
for (const q of [perimeterQuestions[5], perimeterQuestions[10], perimeterQuestions[13]]) {
  console.log('\nQ:', q.prompt)
  if (q.context) console.log('CTX:', q.context)
  console.log('A:', q.answer)
}
