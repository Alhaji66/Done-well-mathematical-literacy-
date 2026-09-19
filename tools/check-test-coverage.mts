/**
 * A topic test must cover every sub-topic in the topic.
 *
 * WHAT THIS IS GUARDING. The builder used to shuffle the whole topic and take
 * the first N. That reaches whichever sub-topics the seed happens to land on:
 * measured across 107 topic/grade cells, an 8-question test reached 4.0 of Data
 * Handling's 8 sub-topics, and 2.3 of Grade 10 Statistics' 5. Half the topic
 * went untested, differently for every teacher, and nothing said so.
 *
 * The builder now takes questions round-robin across the sub-topics, so this
 * check asserts the promise that makes: for every topic/grade cell, a test as
 * long as the sub-topic count reaches ALL of them, and a shorter test reaches
 * as many as it has questions. Both are checked over several test ids, because
 * the failure being guarded against was seed-dependent and a single id could
 * pass by luck.
 *
 * It also checks the two things that must not regress:
 *   - the same test id builds the same paper twice, so a learner who reloads
 *     mid-test gets their own paper back rather than a new one;
 *   - a test limited to chosen sub-topics draws from those and nothing else.
 *
 * Run:  npm run check:test-coverage
 */
import { buildTestPaper, qualify, missingSubtopics, type TestSpec } from '../src/lib/testPaper.ts'
import { questionsForSubject } from '../src/data/questionBank.ts'
import { topics } from '../src/data/topics.ts'
import { subtopicFor, UNSORTED } from '../src/data/subtopics.ts'

const SEEDS = 5

const spec = (over: Partial<TestSpec> & Pick<TestSpec, 'id' | 'subject_id' | 'grade' | 'topic_ids' | 'question_count'>): TestSpec => ({
  subtopics: null,
  ...over,
})

let failures = 0
let cells = 0
let shortfall = 0

for (const topic of topics) {
  for (const grade of topic.grades) {
    const all = await questionsForSubject(topic.subjectId)
    const pool = all.filter((q) => q.grade === grade && q.topicId === topic.id)
    if (pool.length < 10) continue
    cells++

    const subs = [...new Set(pool.map((q) => qualify(q.topicId, subtopicFor(q) ?? UNSORTED)))]
    const where = `${topic.subjectId} G${grade} ${topic.name}`

    for (let s = 0; s < SEEDS; s++) {
      // A test exactly as long as the sub-topic count must reach every one.
      const full = spec({
        id: `cov-${topic.id}-${grade}-${s}`,
        subject_id: topic.subjectId,
        grade: grade as never,
        topic_ids: [topic.id],
        question_count: subs.length,
      })
      const paper = await buildTestPaper(full)
      const covered = new Set(paper.map((q) => qualify(q.topicId, subtopicFor(q) ?? UNSORTED)))
      const missed = subs.filter((k) => !covered.has(k))
      if (missed.length) {
        console.log(`  FAIL  ${where}: ${subs.length}-question test missed ${missed.length} sub-topic(s)`)
        console.log(`        ${missed.map((m) => m.split('::')[1]).join(' | ')}`)
        failures++
        break
      }

      // A SHORTER test cannot reach them all, but must reach as many as it has
      // questions -- never two questions from one sub-topic while another gets
      // none.
      const short = spec({ ...full, id: `${full.id}-short`, question_count: 4 })
      if (subs.length > 4) {
        const shortPaper = await buildTestPaper(short)
        const shortCovered = new Set(shortPaper.map((q) => qualify(q.topicId, subtopicFor(q) ?? UNSORTED)))
        if (shortPaper.length === 4 && shortCovered.size < 4) {
          console.log(`  FAIL  ${where}: 4-question test repeated a sub-topic while ${subs.length - shortCovered.size} had none`)
          failures++
          break
        }
      }
      shortfall += subs.length - covered.size
    }

    // Determinism: the same id, twice.
    const twice = spec({
      id: `stable-${topic.id}-${grade}`,
      subject_id: topic.subjectId,
      grade: grade as never,
      topic_ids: [topic.id],
      question_count: 8,
    })
    const a = await buildTestPaper(twice)
    const b = await buildTestPaper(twice)
    if (a.map((q) => q.id).join() !== b.map((q) => q.id).join()) {
      console.log(`  FAIL  ${where}: the same test id built two different papers`)
      failures++
    }

    // A week's test draws only from the sub-topics it names.
    if (subs.length >= 2) {
      const pick = subs.slice(0, 2)
      const week = spec({
        id: `week-${topic.id}-${grade}`,
        subject_id: topic.subjectId,
        grade: grade as never,
        topic_ids: [topic.id],
        subtopics: pick,
        question_count: 6,
      })
      const paper = await buildTestPaper(week)
      const stray = paper.filter((q) => !pick.includes(qualify(q.topicId, subtopicFor(q) ?? UNSORTED)))
      if (stray.length) {
        console.log(`  FAIL  ${where}: a 2-sub-topic test pulled ${stray.length} question(s) from elsewhere`)
        failures++
      }
      const left = await missingSubtopics(week)
      if (left.length) {
        console.log(`  FAIL  ${where}: missingSubtopics reported ${left.join(', ')} on a test that should cover both`)
        failures++
      }
    }
  }
}

console.log(`\nChecked ${cells} topic/grade cells over ${SEEDS} test ids each.`)
if (failures) {
  console.log(`${failures} cell(s) failed.`)
  process.exit(1)
}
console.log('Every topic test covers every sub-topic in its topic, every paper is stable, and a')
console.log('week’s test stays inside the sub-topics it names.')
