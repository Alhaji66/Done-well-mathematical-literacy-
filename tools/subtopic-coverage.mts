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
