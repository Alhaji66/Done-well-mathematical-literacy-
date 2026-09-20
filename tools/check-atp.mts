/**
 * Every ATP week must point at real content.
 *
 * The ATP ties a week to its questions through sub-topic NAMES, matched
 * against topicNotes.ts. A name with a typo, or one left behind when a
 * sub-topic was renamed, does not fail loudly -- it produces a week that
 * silently selects nothing, and a teacher finds out when the worksheet comes
 * out empty the morning they need it. So the names are checked here instead.
 *
 * The check also reports how many questions each week actually has. A week
 * that resolves correctly but has almost nothing behind it is not a build
 * failure -- the content is simply thin there -- but it is worth seeing, so
 * it prints as a warning rather than passing in silence.
 *
 * Run:  npm run check:atp
 */
import { allAtps } from '../src/data/atp.ts'
import { getTopic } from '../src/data/topics.ts'
import { getTopicNote } from '../src/data/topicNotes.ts'
import { filterSubjectQuestions } from '../src/data/questionBank.ts'
import { subtopicFor } from '../src/data/subtopics.ts'

/** Weeks with fewer than this many questions are called out. */
const THIN = 8

let failures = 0
const thin: string[] = []

for (const atp of allAtps) {
  console.log(`\n${atp.source}`)
  for (const w of atp.weeks) {
    const where = `T${w.term} wk ${w.weeks}`

    if (!w.topicId) {
      // Revision and examination weeks carry no topic on purpose.
      if (w.subtopics?.length) {
        console.log(`  FAIL  ${where}: has sub-topics but no topicId`)
        failures++
      }
      console.log(`  ----  ${where.padEnd(12)} ${w.label}`)
      continue
    }

    const topic = getTopic(w.topicId)
    if (!topic) {
      console.log(`  FAIL  ${where}: topicId '${w.topicId}' is not a topic`)
      failures++
      continue
    }
    if (!topic.grades.includes(atp.grade as never)) {
      console.log(`  FAIL  ${where}: '${topic.name}' is not taught in Grade ${atp.grade}`)
      failures++
      continue
    }

    const known = new Set((getTopicNote(w.topicId)?.subtopics ?? []).map((s) => s.name))
    for (const name of w.subtopics ?? []) {
      if (known.has(name)) continue
      console.log(`  FAIL  ${where}: '${name}' is not a sub-topic of ${topic.name}`)
      console.log(`        known: ${[...known].join(' | ')}`)
      failures++
    }

    const pool = await filterSubjectQuestions(atp.subjectId, {
      topicId: w.topicId,
      grade: atp.grade as never,
    })
    const wanted = new Set(w.subtopics ?? [])
    const hits = wanted.size ? pool.filter((q) => wanted.has(subtopicFor(q) ?? '')) : pool
    const marks = hits.reduce((s, q) => s + q.marks, 0)
    const flag = hits.length < THIN ? 'THIN' : ' ok '
    if (hits.length < THIN) thin.push(`${atp.source} ${where} (${hits.length}) ${w.label}`)
    console.log(
      `  ${flag}  ${where.padEnd(12)} ${String(hits.length).padStart(4)} questions ${String(marks).padStart(5)} marks   ${w.label}`,
    )
  }
}

if (thin.length) {
  console.log(`\n${thin.length} week(s) with fewer than ${THIN} questions -- thin content, not a broken link:`)
  for (const t of thin) console.log(`  ${t}`)
}

if (failures) {
  console.log(`\n${failures} ATP week(s) point at content that does not exist.`)
  process.exit(1)
}
console.log('\nEvery ATP week resolves to a real topic and real sub-topics.')
