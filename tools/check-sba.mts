/**
 * Every task in every Programme of Assessment must be usable.
 *
 *   FAIL  a practical, investigation or experiment with no task sheet; a task
 *         sheet whose topic the grade is not taught; a test or assignment that
 *         cannot reach 80% of its marks from the term's topics; a term with no
 *         topics for its test.
 *   INFO  how close each test lands to the CAPS cognitive-level targets.
 *
 * Run:  npm run check:sba
 */
import { programmeFor, topicsFor, sheetForTask, buildTest } from '../src/data/sba.ts'
import { taskSheets, sheetMarks } from '../src/data/sbaTaskSheets.ts'
import { getTopic } from '../src/data/topics.ts'
import { questionsForSubject } from '../src/data/questionBank.ts'
import type { Grade } from '../src/types/index.ts'

let failures = 0
const fail = (m: string) => {
  failures++
  console.log(`  FAIL  ${m}`)
}

for (const s of taskSheets) {
  const t = getTopic(s.topicId)
  if (!t) fail(`${s.id}: unknown topic ${s.topicId}`)
  else if (!t.grades.includes(s.grade)) fail(`${s.id}: ${s.topicId} is not taught in Grade ${s.grade}`)
  if (sheetMarks(s) < 20) fail(`${s.id}: rubric totals only ${sheetMarks(s)}`)
}

for (const subjectId of ['mathematics', 'mat-lit', 'physical-sciences', 'life-sciences']) {
  const questions = await questionsForSubject(subjectId)
  for (const grade of [10, 11, 12] as Grade[]) {
    const prog = programmeFor(subjectId, grade)
    if (!prog.length) fail(`${subjectId} G${grade}: no programme`)
    console.log(`\n${subjectId} Grade ${grade}`)
    for (const task of prog) {
      const where = `${subjectId} G${grade} T${task.term} ${task.title}`
      if (task.exam) {
        console.log(`  ok    T${task.term} ${task.title}`)
        continue
      }
      if (task.kind === 'Test' || task.kind === 'Assignment') {
        const topics = topicsFor(subjectId, grade, task)
        if (!topics.length) {
          fail(`${where}: no topics in the term`)
          continue
        }
        const t = buildTest({ subjectId, grade, topicIds: topics, questions, marks: task.marks!, kind: task.kind, version: 0 })
        const line = `T${task.term} ${task.title}: ${t.marks}/${task.marks} marks, levels ${t.levels.join('/')} (target ${t.targets.join('/')})`
        if (t.marks < 0.8 * task.marks!) fail(`${where}: only ${t.marks} of ${task.marks} marks`)
        else console.log(`  ok    ${line}`)
        continue
      }
      const sheet = sheetForTask(subjectId, grade, task)
      if (!sheet) fail(`${where}: no task sheet`)
      else console.log(`  ok    T${task.term} ${task.title} (${sheetMarks(sheet)} marks)`)
    }
  }
}

if (failures) {
  console.log(`\n${failures} failure(s).`)
  process.exit(1)
}
console.log('\nEvery programme task is ready to use.')
