/**
 * How much of each topic the sub-topic rules actually place.
 *
 * Run: npx tsx tools/subtopic-coverage.mts
 *
 * Prints, per topic, the share of questions that landed in a named sub-topic
 * rather than in the unsorted bucket, and the size of each group. A topic with
 * a large unsorted bucket, or one group swallowing everything, means a rule in
 * src/data/subtopics.ts needs work.
 */
import { subjects } from '../src/data/subjects'
import { topicsForSubject } from '../src/data/topics'
import { questionsForSubject } from '../src/data/questionBank'
import { groupBySubtopic, UNSORTED } from '../src/data/subtopics'

const BAR = (pct: number) => '█'.repeat(Math.round(pct / 5)).padEnd(20, '·')

let grandTotal = 0
let grandPlaced = 0
const weak: string[] = []

for (const subject of subjects) {
  const topics = topicsForSubject(subject.id)
  if (!topics.length) continue
  const pool = await questionsForSubject(subject.id)
  if (!pool.length) continue

  console.log(`\n=== ${subject.name} ===`)
  for (const topic of topics) {
    const qs = pool.filter((q) => q.topicId === topic.id)
    if (!qs.length) continue
    const groups = groupBySubtopic(topic.id, qs)
    const unsorted = groups.find((g) => g.name === UNSORTED)?.questions.length ?? 0
    const placed = qs.length - unsorted
    const pct = (placed / qs.length) * 100
    grandTotal += qs.length
    grandPlaced += placed

    const named = groups.filter((g) => g.name !== UNSORTED)
    const biggest = named.length ? Math.max(...named.map((g) => g.questions.length)) : 0
    const dominance = qs.length ? (biggest / qs.length) * 100 : 0

    console.log(
      `${BAR(pct)} ${pct.toFixed(0).padStart(3)}%  ${topic.id.padEnd(30)} ` +
        `${String(qs.length).padStart(5)} items, ${named.length} groups, ` +
        `largest ${dominance.toFixed(0)}%`,
    )
    if (pct < 80 || dominance > 70) {
      weak.push(`${topic.id}: ${pct.toFixed(0)}% placed, largest group ${dominance.toFixed(0)}%`)
    }
    if (process.argv.includes('--detail')) {
      for (const g of groups) console.log(`        ${String(g.questions.length).padStart(5)}  ${g.name}`)
    }
  }
}

console.log(
  `\nOverall: ${grandPlaced} of ${grandTotal} questions placed in a named sub-topic ` +
    `(${((grandPlaced / grandTotal) * 100).toFixed(1)}%)`,
)
if (weak.length) {
  console.log('\nNeeds attention (under 80% placed, or one group over 70%):')
  for (const w of weak) console.log('  ' + w)
}

/**
 * Sub-topics that hold questions somewhere, but none at one of the grades that
 * teaches the topic.
 *
 * This is the report that is missing above, and it is the one a teacher feels.
 * The totals per topic can look healthy while a whole grade has nothing on a
 * sub-topic: Measurement read 95% placed while Grade 11 had no perimeter
 * question at all and Grade 10 had one, against eight in Grade 12. Nothing said
 * so, because the topic as a whole was fine.
 *
 * A sub-topic with nothing anywhere is left out -- check:subtopic-rules already
 * reports those, and this list is about content that exists for some grades and
 * not others, which is the case that looks finished and is not.
 */
const holes: string[] = []
const otherUneven: string[] = []
for (const subject of subjects) {
  const pool = await questionsForSubject(subject.id)
  for (const topic of topicsForSubject(subject.id)) {
    const rows = pool.filter((q) => q.topicId === topic.id)
    if (!rows.length) continue
    const names = groupBySubtopic(topic.id, rows)
      .filter((g) => g.name !== UNSORTED)
      .map((g) => g.name)

    for (const name of names) {
      const perGrade = topic.grades.map(
        (g) =>
          groupBySubtopic(
            topic.id,
            rows.filter((q) => q.grade === g),
          ).find((x) => x.name === name)?.questions.length ?? 0,
      )
      const counts = topic.grades.map((g, i) => `G${g} ${perGrade[i]}`).join(', ')
      const first = perGrade.findIndex((n) => n > 0)
      const last = perGrade.length - 1 - [...perGrade].reverse().findIndex((n) => n > 0)
      for (let i = 0; i < perGrade.length; i++) {
        if (perGrade[i] > 0) continue
        // Between two grades that have it: content stops and starts again.
        if (i > first && i < last) holes.push(`${topic.id} / ${name}: nothing in Grade ${topic.grades[i]} (${counts})`)
        else otherUneven.push(`${topic.id} / ${name}: nothing in Grade ${topic.grades[i]} (${counts})`)
      }
    }
  }
}

if (holes.length) {
  console.log(`\n${holes.length} sub-topic(s) with a HOLE -- content either side of a grade that has none:`)
  for (const h of holes) console.log('  ' + h)
  console.log('  (A heading a teacher of that grade opens and finds empty, while the grades above and')
  console.log('   below have it. This is the shape the missing Grade 11 perimeter content had.)')
}
if (otherUneven.length) {
  console.log(
    `\n${otherUneven.length} more sub-topic(s) start or stop partway up the grades` +
      (process.argv.includes('--detail') ? ':' : ' -- run with --detail to list them.'),
  )
  // Mostly correct: CAPS introduces annuities, inverses and sigma notation in
  // Grade 12, so those headings SHOULD be empty lower down. Listed on request
  // rather than in the default output, where they would bury the holes above.
  if (process.argv.includes('--detail')) for (const u of otherUneven) console.log('  ' + u)
}
