import { questionsForSubject } from '../src/data/questionBank.ts'
const pool = (await questionsForSubject('mathematics')).filter((q: any) => q.topicId === 'math-functions')
const NARROW = /\b(for which values? of x|point(s)? of intersection|read off the graph|lies? (above|below))\b|f\(x\) *[<>]|f\(x\) ?[·×] ?g\(x\)/i
let n = 0
for (const q of pool) { if (NARROW.test(`${q.prompt} ${q.context ?? ''}`)) { n++; if (n <= 14) console.log(' •', q.prompt.slice(0, 120)) } }
console.log(`\n${n} of ${pool.length} math-functions questions are cross-graph interpretation asks.`)
