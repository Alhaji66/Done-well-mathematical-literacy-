/** The questions a Life Sciences topic cannot file, so the missing sub-topics can be read off them. */
import { filterSubjectQuestions } from '../src/data/questionBank.ts'
import { topics } from '../src/data/topics.ts'
import { groupBySubtopic, UNSORTED } from '../src/data/subtopics.ts'
import { getTopicNote } from '../src/data/topicNotes.ts'

const only = process.argv[2]
for (const t of topics.filter((x) => x.subjectId === 'life-sciences')) {
  if (only && t.id !== only) continue
  const all: any[] = []
  for (const g of t.grades) all.push(...(await filterSubjectQuestions('life-sciences', { topicId: t.id, grade: g as any })))
  if (!all.length) continue
  const un = groupBySubtopic(t.id, all).find((x) => x.name === UNSORTED)?.questions ?? []
  if (!un.length) continue
  console.log(`\n${'='.repeat(78)}\n${t.id}  —  ${t.name}   (${un.length} of ${all.length} unsorted)`)
  console.log(`existing sub-topics: ${(getTopicNote(t.id)?.subtopics ?? []).map((s) => s.name).join(' | ')}`)
  for (const q of un) console.log(`   · ${q.prompt.replace(/\s+/g, ' ').slice(0, 104)}`)
}
