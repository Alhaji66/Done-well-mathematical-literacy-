/** The recurring terms in each Life Sciences topic's unsorted bucket. */
import { filterSubjectQuestions } from '../src/data/questionBank.ts'
import { topics } from '../src/data/topics.ts'
import { groupBySubtopic, UNSORTED } from '../src/data/subtopics.ts'
import { getTopicNote } from '../src/data/topicNotes.ts'

const STOP = new Set(('the a an and or of to in for that this these those with from by on at is are was were be been it its as which what state name describe explain give two three one their they them how why when where would could than then also other such each between during more most some any than into out up down over under after before while both not no only same such very can may might must shall should will'.split(' ')))

for (const t of topics.filter((x) => x.subjectId === 'life-sciences')) {
  const all: any[] = []
  for (const g of t.grades) all.push(...(await filterSubjectQuestions('life-sciences', { topicId: t.id, grade: g as any })))
  if (!all.length) continue
  const un = groupBySubtopic(t.id, all).find((x) => x.name === UNSORTED)?.questions ?? []
  if (un.length < 8) continue
  const freq = new Map<string, number>()
  for (const q of un) {
    const seen = new Set((q.prompt.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? []).filter((w: string) => !STOP.has(w)))
    for (const w of seen) freq.set(w, (freq.get(w) ?? 0) + 1)
  }
  const top = [...freq].filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]).slice(0, 14)
  console.log(`\n${t.id}  (${un.length}/${all.length} unsorted)`)
  console.log(`  have: ${(getTopicNote(t.id)?.subtopics ?? []).map((s) => s.name).join(' | ')}`)
  console.log(`  terms: ${top.map(([w, n]) => `${w}(${n})`).join(' ')}`)
}
