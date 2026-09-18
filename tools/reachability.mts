/**
 * Every question count Learn advertises must be reachable through Practise.
 *
 * Run: npx tsx tools/reachability.mts
 *
 * The four-subject review found a topic card advertising a large sample count
 * that, once opened, said "No sample questions at this difficulty yet". That is
 * the failure this guards against: Learn counts through one path (subject +
 * grade) and Practise queries through another (subject + grade + topic +
 * difficulty), and the two drifting apart is invisible until a learner hits it.
 *
 * Checks, for every subject / grade / topic:
 *   1. the advertised count equals what Practise returns at "All" difficulty;
 *   2. the three difficulty buckets add back up to that same total;
 *   3. no topic offered for a grade is empty at that grade.
 *
 * Exits non-zero on any mismatch, so it can run in CI.
 */
import { subjects } from '../src/data/subjects'
import { topicsForSubject } from '../src/data/topics'
import { filterSubjectQuestions, topicQuestionCounts } from '../src/data/questionBank'
import type { Difficulty, Grade } from '../src/types'

const GRADES: Grade[] = [10, 11, 12]
const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenge']

const problems: string[] = []
let checked = 0
let empties = 0

for (const subject of subjects) {
  for (const grade of GRADES) {
    const topics = topicsForSubject(subject.id, grade)
    if (!topics.length) continue
    const advertised = await topicQuestionCounts(subject.id, grade)

    for (const topic of topics) {
      checked++
      const claimed = advertised[topic.id] ?? 0
      const reachable = (await filterSubjectQuestions(subject.id, { topicId: topic.id, grade })).length

      if (claimed !== reachable) {
        problems.push(
          `${subject.id} G${grade} ${topic.id}: Learn advertises ${claimed}, Practise returns ${reachable}`,
        )
      }

      let byDifficulty = 0
      for (const difficulty of DIFFICULTIES) {
        byDifficulty += (await filterSubjectQuestions(subject.id, { topicId: topic.id, grade, difficulty })).length
      }
      if (byDifficulty !== reachable) {
        problems.push(
          `${subject.id} G${grade} ${topic.id}: difficulty buckets total ${byDifficulty}, ` +
            `but the topic holds ${reachable}`,
        )
      }

      if (reachable === 0) {
        empties++
        problems.push(`${subject.id} G${grade} ${topic.id}: offered to this grade but has no questions at all`)
      }
    }
  }
}

console.log(`Checked ${checked} subject/grade/topic combinations.`)
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`)
  for (const p of problems) console.log('  ' + p)
  if (empties) console.log(`\n(${empties} of those are topics with no content yet for that grade.)`)
  process.exit(1)
}
console.log('Every advertised count is reachable, and every difficulty split adds up.')
