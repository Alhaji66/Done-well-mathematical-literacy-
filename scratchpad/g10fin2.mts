import { questionsForSubject } from '../src/data/questionBank.ts'
import { groupBySubtopic } from '../src/data/subtopics.ts'
const pool = await questionsForSubject('mathematics')
const g10 = pool.filter((q) => q.topicId === 'math-finance-growth' && q.grade === 10)
const themes: [string, RegExp][] = [
  ['hire purchase', /hire purchase|instalment|deposit/i],
  ['inflation', /inflation|cost of living|price .* rise/i],
  ['exchange rate', /exchange rate|rand.*dollar|dollar.*rand|\bpounds?\b|\beuros?\b|currency|forex/i],
  ['VAT', /\bVAT\b|value[- ]added/i],
  ['compound interest', /compound/i],
  ['simple interest', /simple interest/i],
  ['depreciation', /depreciat|book value/i],
]
const bucket = new Map<string, string[]>()
for (const q of g10) {
  const t = `${q.prompt} ${q.context ?? ''}`
  const hit = themes.find(([, re]) => re.test(t))?.[0] ?? '(none of these)'
  bucket.set(hit, [...(bucket.get(hit) ?? []), q.id])
}
for (const [k, v] of [...bucket].sort((a, b) => b[1].length - a[1].length)) console.log(`${String(v.length).padStart(3)}  ${k}`)
console.log('\n--- the ones matching none ---')
for (const id of bucket.get('(none of these)') ?? []) {
  const q = g10.find((x) => x.id === id)!
  console.log(`  ${q.id}: ${q.prompt.slice(0, 100)}`)
}
console.log('\n--- G11 and G12 theme spread, for comparison ---')
for (const g of [11, 12]) {
  const rows = pool.filter((q) => q.topicId === 'math-finance-growth' && q.grade === g)
  const b = new Map<string, number>()
  for (const q of rows) {
    const t = `${q.prompt} ${q.context ?? ''}`
    const hit = themes.find(([, re]) => re.test(t))?.[0] ?? '(none)'
    b.set(hit, (b.get(hit) ?? 0) + 1)
  }
  console.log(`  G${g}: ` + [...b].sort((a, c) => c[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', '))
}
