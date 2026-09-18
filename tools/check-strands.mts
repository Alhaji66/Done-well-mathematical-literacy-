/**
 * A topic's `strand` must agree with the paper its questions are actually in.
 *
 * The strand tells a Physical Sciences learner which exam a topic belongs to:
 * Paper 1 is Physics, Paper 2 is Chemistry, and revising for one gains nothing
 * towards the other. A label that drifts out of step with the papers is worse
 * than no label, because it would send a learner to revise the wrong exam.
 *
 * The values were derived from the papers rather than typed by hand, so this
 * check is what keeps that true as papers change. It also catches the reverse
 * error: a topic that gains a strand in a subject whose content is examined as
 * one body, where the label would be meaningless.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import { topicsForSubject } from '../src/data/topics.ts'
import { subjects } from '../src/data/subjects.ts'

const PAPER_STRAND: Record<number, string> = { 1: 'Physics', 2: 'Chemistry' }

const problems: string[] = []
let checked = 0

for (const subject of subjects) {
  const papers = await papersForSubject(subject.id)
  if (!papers.length) continue

  // Which paper number each topic's questions appear in.
  const papersFor = new Map<string, Set<number>>()
  for (const paper of papers) {
    for (const section of paper.sections) {
      const seen = papersFor.get(section.topicId) ?? new Set<number>()
      seen.add(paper.paperNumber)
      papersFor.set(section.topicId, seen)
    }
  }

  // Only Physical Sciences splits its content across two examined papers.
  const splitSubject = subject.id === 'physical-sciences'

  for (const topic of topicsForSubject(subject.id)) {
    if (!splitSubject) {
      if (topic.strand) {
        problems.push(`${topic.id}: has strand "${topic.strand}", but ${subject.id} is not examined as separate strands`)
      }
      continue
    }

    checked++
    const seen = papersFor.get(topic.id)
    if (!seen?.size) {
      problems.push(`${topic.id}: no paper contains this topic, so its strand cannot be verified`)
      continue
    }
    if (seen.size > 1) {
      problems.push(`${topic.id}: appears in papers ${[...seen].sort().join(' and ')}, so it has no single strand`)
      continue
    }
    const expected = PAPER_STRAND[[...seen][0]]
    if (topic.strand !== expected) {
      problems.push(`${topic.id}: strand is ${topic.strand ? `"${topic.strand}"` : 'unset'}, but its questions are in Paper ${[...seen][0]} (${expected})`)
    }
  }
}

if (problems.length) {
  for (const p of problems) console.error(`  ${p}`)
  console.error(`\n${problems.length} topic strand(s) that do not match the papers.`)
  process.exit(1)
}
console.log(`Checked ${checked} topic strand(s). Every one matches the paper its questions are in.`)
