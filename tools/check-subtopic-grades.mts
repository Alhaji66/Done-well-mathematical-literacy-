/**
 * A question must not sit under a heading its own grade is not taught.
 *
 * WHAT THIS CATCHES. Most sub-topics are taught in every grade their topic is
 * taught in, and those are not checked here at all. A few are not: annuities
 * are Grade 12, the angle of inclination is Grade 11 onwards, hire purchase is
 * Grade 10. Those carry a `grades` list in topicNotes.ts, and a question landing
 * under one of them from a grade the list does not name is one of two things,
 * both worth knowing:
 *
 *   MIS-FILED      the question is fine and the classifier put it in the wrong
 *                  bucket. Nine Grade 10 hire-purchase questions sat under
 *                  Outstanding balance -- a Grade 12 heading -- because they say
 *                  "the balance owing after the deposit". The fix is a rule.
 *
 *   OUT OF SYLLABUS  the question really is about that sub-topic and really is
 *                  at that grade, which means it asks a grade for something its
 *                  syllabus does not teach. The fix is content.
 *
 * WHY IT IS A FAILURE AND NOT A REPORT. Unlike a content gap, this is decidable:
 * either the grade is on the list or it is not. It went to zero the moment the
 * hire-purchase rule was written, so anything it finds later is new.
 *
 * WHY THE `grades` LISTS ARE TRUSTWORTHY ENOUGH TO FAIL A BUILD OVER. Each one
 * is a single CAPS fact with its reason written beside it in topicNotes.ts, and
 * absent means "no restriction", so a sub-topic nobody has thought about cannot
 * fail this check. A wrong list is visible as a failure naming real questions,
 * not as silent wrong behaviour.
 *
 *   npm run check:subtopic-grades
 */
import { subjects } from '../src/data/subjects'
import { topicsForSubject } from '../src/data/topics'
import { questionsForSubject } from '../src/data/questionBank'
import { getTopicNote } from '../src/data/topicNotes'
import { subtopicFor } from '../src/data/subtopics'

let restricted = 0
let checked = 0
const problems: string[] = []

for (const subject of subjects) {
  const pool = await questionsForSubject(subject.id)
  for (const topic of topicsForSubject(subject.id)) {
    const subs = getTopicNote(topic.id)?.subtopics ?? []
    const limits = new Map(subs.filter((s) => s.grades).map((s) => [s.name, s.grades!]))
    if (!limits.size) continue
    restricted += limits.size

    for (const q of pool.filter((x) => x.topicId === topic.id)) {
      const name = subtopicFor(q)
      const grades = name ? limits.get(name) : undefined
      if (!grades) continue
      checked++
      if (grades.includes(q.grade)) continue
      problems.push(
        `${topic.id} / ${name} is taught in Grade${grades.length > 1 ? 's' : ''} ` +
          `${grades.join(' and ')}, but ${q.id} is Grade ${q.grade}:\n      ${q.prompt.slice(0, 96)}`,
      )
    }
  }
}

if (problems.length) {
  console.error(`${problems.length} question(s) filed under a heading their grade is not taught:\n`)
  for (const p of problems.slice(0, 20)) console.error('  ' + p)
  if (problems.length > 20) console.error(`  ... and ${problems.length - 20} more.`)
  console.error(
    '\nEither the classifier put them in the wrong bucket -- fix the rule in subtopics.ts --\n' +
      'or the content really is out of syllabus for that grade. Check which before changing\n' +
      "the sub-topic's grades list, because widening the list hides both.",
  )
  process.exit(1)
}

console.log(
  `${restricted} sub-topic(s) name the grades CAPS teaches them in, and all ${checked} question(s)\n` +
    'filed under one of them come from a grade on its list.',
)
