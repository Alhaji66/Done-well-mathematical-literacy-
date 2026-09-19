/**
 * Items that PROVABLY depend on information they do not state.
 *
 * Not a heuristic. If two items show the learner exactly the same prompt and
 * exactly the same context, and the marking answers differ, then the thing
 * that decides the answer is not in front of the learner. At least one of the
 * two is unanswerable as shown, and no reading of the wording can rescue it.
 *
 * This catches what the demonstrative rule in check-orphans.mts cannot:
 * "Calculate the wasted tiled area beyond what the floor needs" names no
 * "this" or "that", so it reads as self-contained -- but it appears nine times
 * with seven different answers, because each paper's floor was established
 * several items earlier.
 */
import { papersForSubject } from '../src/data/papers/index.ts'

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')

/*
 * Compare answers by their NUMBERS, not their wording.
 *
 * Wording varies harmlessly: "Define photosynthesis" is answered two
 * acceptable ways in Life Sciences, and flagging that as ambiguity produced 29
 * false groups in that subject alone. What cannot vary harmlessly is the
 * arithmetic. If the same prompt with the same context yields answers
 * containing DIFFERENT NUMBERS, the quantity that decides the answer is not in
 * front of the learner.
 *
 * Thousands separators are stripped first, so "4 500" is one number and not
 * two, and a decimal comma is normalised to a point so that "2,4" and "2.4"
 * are the same value rather than two different ones.
 */
const valuesOf = (s: string): number[] => {
  const cleaned = s.replace(/(\d)[  ](?=\d{3}\b)/g, '$1').replace(/(\d),(\d)/g, '$1.$2')
  return (cleaned.match(/\d+(?:\.\d+)?/g) ?? []).map(Number).sort((a, b) => a - b)
}

/*
 * Do two answers disagree about the arithmetic?
 *
 * A 1% tolerance, because differing PRECISION is not disagreement. The same
 * photon-energy question is answered 3.978 x 10^-19 J in one paper and
 * 3.98 x 10^-19 J in another, and the same critical angle 48.75 and 48.77
 * degrees -- rounding, not a contradiction. Comparing digit strings flagged
 * all four Physical Sciences groups and both Life Sciences ones, and all six
 * were false.
 *
 * Different COUNTS of numbers also do not settle it, since one memo may show
 * an intermediate step the other omits, so only the values common to both
 * positions are compared.
 */
const disagree = (a: string, b: string): boolean => {
  const x = valuesOf(a)
  const y = valuesOf(b)
  if (!x.length || !y.length) return false
  const n = Math.min(x.length, y.length)
  for (let k = 0; k < n; k++) {
    const scale = Math.max(Math.abs(x[k]), Math.abs(y[k]), 1e-30)
    if (Math.abs(x[k] - y[k]) / scale > 0.01) return true
  }
  return false
}

for (const subject of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const groups = new Map<string, any[]>()
  let total = 0
  for (const p of list)
    for (const s of p.sections)
      for (const i of s.items) {
        total++
        const key = `${norm(i.prompt)}||${norm(i.context ?? '')}`
        groups.set(key, [...(groups.get(key) ?? []), { ...i, paper: p.id }])
      }
  const bad: any[] = []
  for (const [, v] of groups) {
    if (v.length < 2) continue
    if (!v.some((i: any) => disagree(i.answer, v[0].answer))) continue
    bad.push(v)
  }
  const items = bad.reduce((n, v) => n + v.length, 0)
  console.log(`\n=== ${subject}: ${bad.length} group(s), ${items} items of ${total}`)
  for (const v of bad.sort((a, b) => b.length - a.length).slice(0, Number(process.argv[2] ?? 4))) {
    console.log(`\n  ×${v.length} [${v[0].marks}mk]  PROMPT: ${v[0].prompt}`)
    console.log(`        CONTEXT: ${(v[0].context ?? '(none)').replace(/\n/g, ' | ').slice(0, 200)}`)
    for (const i of v.slice(0, 4)) console.log(`        ${i.id.padEnd(22)} ANS: ${i.answer.slice(0, 80)}`)
  }
}
