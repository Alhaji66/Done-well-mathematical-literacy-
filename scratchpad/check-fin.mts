import { getTopicNote } from '../src/data/topicNotes.ts'
const note = getTopicNote('finance')!
console.log('=== Mat Lit Finance: FORMULAE ===')
;(note.formulae ?? []).forEach((f, i) => console.log(`  [${i}] ${f}`))
console.log('\n=== KEY IDEAS ===')
;(note.keyIdeas ?? []).forEach((f, i) => console.log(`  [${i}] ${f.slice(0, 110)}`))
console.log('\n=== SUB-TOPICS ===')
for (const s of note.subtopics ?? []) console.log('  -', s.name)
