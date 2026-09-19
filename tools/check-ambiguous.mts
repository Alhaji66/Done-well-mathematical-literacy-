/**
 * Fail if any item PROVABLY depends on information it does not show.
 *
 * NOT A HEURISTIC, which is what makes this worth failing a build over. If two
 * items put exactly the same prompt and exactly the same context in front of
 * the learner, and their marking answers disagree about the arithmetic, then
 * the thing that decides the answer is not on screen. At least one of the two
 * is unanswerable as shown, and no reading of the wording rescues it.
 *
 * It found 156 such items -- "Determine the mean of the data set" with no data
 * set, appearing nine times with nine different answers; "the axis of symmetry
 * of g" where g is never defined. They are invisible in review because they are
 * only broken in the place nobody re-reads them: outside their paper, in topic
 * practice and the weekly test.
 *
 * WHY ANSWERS ARE COMPARED AS NUMBERS AND NOT AS TEXT. Wording varies
 * harmlessly -- "Define photosynthesis" is answered two acceptable ways in Life
 * Sciences -- and comparing text flagged 29 Life Sciences groups and 39
 * Physical Sciences ones, all of them false. Only the arithmetic cannot vary.
 *
 * WHY THERE IS A 1% TOLERANCE. Differing PRECISION is not disagreement. The
 * same photon-energy question is answered 3.978 x 10^-19 J in one paper and
 * 3.98 x 10^-19 J in another, and the same critical angle 48.75 and 48.77
 * degrees. Exact comparison flagged all six remaining science groups, and all
 * six were rounding rather than contradiction.
 *
 *   npm run check:ambiguous
 */
import { papersForSubject } from '../src/data/papers/index.ts'

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')

const valuesOf = (s: string): number[] => {
  // Thousands separators first, so "4 500" is one number and not two, and a
  // decimal comma normalised, so "2,4" and "2.4" are the same value.
  const c = s.replace(/(\d)[  ](?=\d{3}\b)/g, '$1').replace(/(\d),(\d)/g, '$1.$2')
  return (c.match(/\d+(?:\.\d+)?/g) ?? []).map(Number).sort((a, b) => a - b)
}

/** Different counts of numbers do not settle it -- one memo may show a step the other omits. */
const disagree = (a: string, b: string): boolean => {
  const x = valuesOf(a)
  const y = valuesOf(b)
  if (!x.length || !y.length) return false
  for (let k = 0; k < Math.min(x.length, y.length); k++) {
    const scale = Math.max(Math.abs(x[k]), Math.abs(y[k]), 1e-30)
    if (Math.abs(x[k] - y[k]) / scale > 0.01) return true
  }
  return false
}

/**
 * Items known to be under-specified and not yet repaired.
 *
 * This list may only ever SHRINK. It exists so that the 49 still outstanding
 * do not hide the arrival of a new one; it is not permission to leave them.
 * Each needs its data restated in the prompt, recoverable from its own worked
 * explanation. The ones repaired so far were fixed two ways: 78 by restoring a
 * context verified against the item's own working, and 29 by following a
 * cross-reference the prompt names outright ("using your answer to 3.1").
 * What is left names no part and shares no numbers with its neighbours.
 */
const KNOWN = new Set<string>([
  'math-g10-p1-20-4-6',
  'math-g10-p1-21-4-6',
  'math-g10-p1-22-4-6',
  'math-g10-p1-23-4-6',
  'math-g10-p1-24-4-6',
  'math-g10-p1-25-4-6',
  'math-g10-p1-a-4-6',
  'math-g10-p1-b-4-6',
  'math-g10-p1-c-4-6',
  'math-p2-21-2-4',
  'math-p2-22-2-4',
  'math-p2-24-2-4',
  'math-p2-25-2-4',
  'math-p2-c-2-4',
  'ml-g10-p1-20-2-9',
  'ml-g10-p1-21-2-4',
  'ml-g10-p1-21-2-9',
  'ml-g10-p1-22-2-9',
  'ml-g10-p1-23-2-9',
  'ml-g10-p1-24-2-9',
  'ml-g10-p1-25-2-4',
  'ml-g10-p1-25-2-9',
  'ml-g10-p1-a-2-9',
  'ml-g10-p1-b-2-9',
  'ml-g10-p1-b-4-2',
  'ml-g10-p1-c-2-9',
  'ml-g10-p2-20-1-2',
  'ml-g10-p2-20-3-2',
  'ml-g10-p2-22-1-2',
  'ml-g10-p2-22-3-2',
  'ml-g10-p2-23-3-2',
  'ml-g10-p2-24-1-2',
  'ml-g10-p2-24-3-2',
  'ml-g10-p2-a-1-2',
  'ml-g10-p2-b-1-2',
  'ml-g10-p2-b-3-2',
  'ml-g10-p2-c-1-2',
  'ml-g10-p2-c-3-2',
  'ml-g11-p1-a-4-2',
  'ml-g11-p2-20-1-3',
  'ml-g11-p2-21-1-3',
  'ml-g11-p2-23-1-3',
  'ml-g11-p2-25-1-3',
  'ml-g11-p2-b-1-3',
  'ml-p1-21-1-3',
  'ml-p1-21-1-4',
  'ml-p1-24-1-3',
  'ml-p1-24-1-4',
  'ml-p2-c-1-3',
])

let fresh = 0
let stale = 0
const seen = new Set<string>()
for (const subject of ['mat-lit', 'mathematics', 'life-sciences', 'physical-sciences']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const groups = new Map<string, any[]>()
  for (const p of list)
    for (const s of p.sections)
      for (const i of s.items) {
        const key = `${norm(i.prompt)}||${norm(i.context ?? '')}`
        groups.set(key, [...(groups.get(key) ?? []), { ...i, paper: p.id }])
      }
  for (const [, v] of groups) {
    if (v.length < 2) continue
    if (!v.some((i: any) => disagree(i.answer, v[0].answer))) continue
    for (const i of v) {
      seen.add(i.id)
      if (KNOWN.has(i.id)) continue
      fresh++
      console.error(`  NEW  ${i.paper} ${i.id}\n       ${i.prompt.slice(0, 96)}`)
    }
  }
}
for (const id of KNOWN) if (!seen.has(id)) stale++

if (fresh) {
  console.error(
    `\n${fresh} item(s) depend on information they do not show, and are not on the known list.\n` +
      'Restate the data in the prompt, or give the item a context of its own.',
  )
  process.exit(1)
}
console.log(`No new under-specified items. ${KNOWN.size - stale} known remaining, ${stale} since repaired.`)
if (stale) console.log('Trim the repaired ids out of KNOWN in tools/check-ambiguous.mts.')
