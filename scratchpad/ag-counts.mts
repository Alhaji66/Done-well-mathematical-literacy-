import { subtopicQuestionCounts, topicQuestionCounts } from '../src/data/questionBank.ts'
const c = await subtopicQuestionCounts('mathematics', 10)
console.log('G10 analytical geometry sub-topics:', c['math-analytical-geometry'])
const t = await topicQuestionCounts('mathematics', 10)
console.log('G10 topic counts:', t)
