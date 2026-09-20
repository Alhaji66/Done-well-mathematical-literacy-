import { filterSubjectQuestions } from '../src/data/questionBank.ts'
import { groupBySubtopic } from '../src/data/subtopics.ts'
for (const g of [10, 11, 12] as const) {
  const rows = await filterSubjectQuestions('mat-lit', { topicId: 'measurement', grade: g })
  const groups = groupBySubtopic('measurement', rows)
  console.log(`G${g}: ` + groups.map((x) => `${x.name} ${x.questions.length}`).join(' | '))
}
