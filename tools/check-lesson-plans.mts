/**
 * Every ATP week must produce a usable lesson plan.
 *
 * Lesson plans are assembled from the ATP, the topic notes and the question
 * bank (src/data/lessonPlans.ts). A change to any of them can quietly leave a
 * week with a plan whose lessons have nothing to teach or nothing to practise,
 * and a teacher finds out with the printout in hand. So every week of every
 * plan is built here, for both period lengths, and checked:
 *
 *   FAIL  a teaching week with no lessons, a lesson whose phases do not add up
 *         to the period, a sub-topic the plan never teaches, a question used
 *         twice in one plan.
 *   WARN  a lesson with no classwork questions -- the content is thin there,
 *         which is worth seeing but is not a broken plan.
 *
 * Run:  npm run check:lesson-plans
 */
import { allAtps } from '../src/data/atp.ts'
import { buildLessonPlan, LESSON_LENGTHS } from '../src/data/lessonPlans.ts'
import { questionsForSubject } from '../src/data/questionBank.ts'
import type { Grade } from '../src/types/index.ts'

let failures = 0
let plans = 0
let lessonsTotal = 0
const thin: string[] = []

const fail = (msg: string) => {
  failures++
  console.log(`  FAIL  ${msg}`)
}

for (const atp of allAtps) {
  const questions = await questionsForSubject(atp.subjectId)
  for (const minutes of LESSON_LENGTHS) {
    atp.weeks.forEach((w, i) => {
      const where = `${atp.subjectId} G${atp.grade} T${w.term} ${w.weeks} "${w.label}" (${minutes} min)`
      const plan = buildLessonPlan({ atp, weekIndex: i, grade: atp.grade as Grade, questions, lessonMinutes: minutes })
      if (!plan) return fail(`${where}: no plan`)
      plans++
      if (plan.examOnly) return
      if (!plan.lessons.length) return fail(`${where}: no lessons`)
      lessonsTotal += plan.lessons.length

      const seen = new Set<string>()
      for (const l of plan.lessons) {
        const sum = l.phases.reduce((s, p) => s + p.minutes, 0)
        if (sum !== minutes) fail(`${where}: lesson ${l.number} phases add up to ${sum}, not ${minutes}`)
        for (const q of [l.warmUp, ...l.classwork, ...l.homework]) {
          if (!q) continue
          if (seen.has(q.id)) fail(`${where}: ${q.id} used twice`)
          seen.add(q.id)
        }
        if (!l.classwork.length && minutes === 60) thin.push(`${where}: lesson ${l.number} (${l.title}) has no classwork`)
      }

      if (w.topicId) {
        const taught = new Set(plan.lessons.map((l) => l.title))
        for (const s of plan.subtopics) if (!taught.has(s)) fail(`${where}: sub-topic "${s}" is never taught`)
        if (!plan.notes.length) fail(`${where}: no teacher notes`)
      }
    })
  }
}

if (thin.length) {
  console.log(`\n${thin.length} lesson(s) with no classwork questions (content is thin there):`)
  for (const t of thin.slice(0, 40)) console.log('  ' + t)
  if (thin.length > 40) console.log(`  … and ${thin.length - 40} more`)
}

console.log(`\n${plans} plans built, ${lessonsTotal} lessons.`)
if (failures) {
  console.log(`${failures} failure(s).`)
  process.exit(1)
}
console.log('Every ATP week builds a complete lesson plan.')
