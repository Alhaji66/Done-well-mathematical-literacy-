import { questionsForSubject } from '../src/data/questionBank.ts'
import { groupBySubtopic } from '../src/data/subtopics.ts'
const pool = await questionsForSubject('mathematics')
for (const g of [10, 11, 12]) {
  const rows = pool.filter((q) => q.topicId === 'math-euclidean-geometry' && q.grade === g)
  console.log(`\nGrade ${g}: ${rows.length}`)
  for (const grp of groupBySubtopic('math-euclidean-geometry', rows)) console.log(`   ${String(grp.questions.length).padStart(3)}  ${grp.name}`)
}
console.log('\n--- the one G12 proportionality item ---')
const g12 = pool.filter((q) => q.topicId === 'math-euclidean-geometry' && q.grade === 12)
for (const q of g12.filter((q) => /proportion|similar|mid[- ]?point/i.test(q.prompt))) console.log(`  ${q.id} (${q.marks}mk): ${q.prompt.slice(0, 110)}`)
