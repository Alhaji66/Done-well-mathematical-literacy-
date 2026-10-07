/**
 * No question asks a grade for a concept CAPS teaches only in a later grade.
 *
 *   npm run check:caps-concepts
 *
 * Reads every question in the bank and every paper item, and tests its text
 * against the concept rules in caps-concepts.mts. A hit means a question from
 * a grade that is not taught the concept, such as Grade 11 calculating income
 * tax from the SARS tax-rate table, which is Grade 12 work.
 */
import { subjects } from '../src/data/subjects'
import { subjectContent } from '../src/data/contentSource'
import { conceptRules, reviewedAllowed } from '../src/data/capsConcepts'
import type { Question } from '../src/types'

const verbose = process.argv.includes('--list')
const textOf = (q: Question) => [q.prompt, q.context ?? '', ...(q.options ?? []).map((o) => o.text)].join('\n')

const problems: string[] = []
const tally = new Map<string, number>()
let scanned = 0
for (const s of subjects) {
  const content = await subjectContent(s.id)
  const items: { q: Question; where: string }[] = content.questions.map((q) => ({ q, where: 'bank' }))
  for (const p of content.papers) for (const sec of p.sections) for (const q of sec.items) items.push({ q: { ...q, grade: p.grade }, where: `paper ${p.id} Q${q.label}` })
  const rules = conceptRules.filter((r) => r.subject === s.id)
  for (const { q, where } of items) {
    scanned++
    if (reviewedAllowed[q.id]) continue
    const text = textOf(q)
    for (const r of rules) {
      if (r.grades.includes(q.grade as 10 | 11 | 12)) continue
      const m = text.match(r.pattern)
      if (!m) continue
      const key = `${s.id} G${q.grade} ${r.concept}`
      tally.set(key, (tally.get(key) ?? 0) + 1)
      problems.push(`${s.id} G${q.grade} [${where}] ${q.id}: "${m[0]}" -> ${r.concept} (grades ${r.grades.join(', ') || 'none'})\n    ${q.prompt.slice(0, 160).replace(/\n/g, ' ')}`)
    }
  }
}

if (problems.length) {
  for (const [k, n] of [...tally].sort()) console.error(`${String(n).padStart(4)}  ${k}`)
  if (verbose) console.error('\n' + problems.join('\n'))
  console.error(`\n${problems.length} question(s) ask for a concept their grade is not taught. Run with --list to see them.`)
  process.exit(1)
}
console.log(`CAPS concepts: ${conceptRules.length} rules, ${scanned} questions and paper items, none ask a grade for a concept it is not taught.`)
