/**
 * Measure the stored Mathematics cognitive levels against hand labels.
 *
 * WHY. Mathematics fails all 24 CAPS cells, and the headline numbers are
 * extreme: Level 4 sits at 0.0% in five of six papers against a 10-15% target,
 * Level 1 at 1-7% against 20-25%. Before authoring anything against those
 * numbers it is worth knowing whether they describe the CONTENT or only the
 * classifier -- the same question that turned out to matter for Mathematical
 * Literacy, where most of the Level 4 "gap" was items the classifier could not
 * read rather than items that were not there.
 *
 * cognitive-level.mts says outright that it must not be trusted on symbolic
 * work: it reads the command verb, and "Solve for x", "Factorise fully" and
 * "Prove the identity" tell you almost nothing about cognitive demand in
 * Mathematics, where the demand lives in the algebra.
 *
 * THE SAMPLE. Every 73rd item by id across the whole corpus, via
 * scratchpad/math-sample.mts -- reproducible, and not chosen. Labelled from
 * the prompt WITH THE STORED LEVEL HIDDEN.
 *
 * THE CAPS MATHEMATICS TAXONOMY, as applied here:
 *
 *   L1 Knowledge (20-25%) -- the answer is available without carrying out a
 *      procedure: recall, reading a value off, or one straight substitution
 *      into a formula that has been handed over.
 *   L2 Routine procedures (35-45%) -- one well-known, drilled procedure, in a
 *      familiar form. Solving a linear equation, factorising, differentiating
 *      a polynomial, applying Tn = a + (n-1)d.
 *   L3 Complex procedures (20-30%) -- the learner must choose or combine
 *      procedures, or work in an unfamiliar arrangement. Several steps that
 *      the question does not signal.
 *   L4 Problem solving (10-15%) -- non-routine. The route is not apparent, the
 *      problem must be broken up, or a general result must be argued.
 *
 * Note what makes Mathematics different from Mathematical Literacy: a bare
 * "Prove the identity" is NOT automatically Level 4. Proving tan θ · cos θ =
 * sin θ is one substitution of tan = sin/cos, which is Level 2 wearing the
 * vocabulary of a proof.
 *
 *   npm run check:math-level
 */
import { papersForSubject } from '../src/data/papers/index.ts'

type Level = 1 | 2 | 3 | 4

/** Hand labels. The note says what decided it, not what the tool said. */
const TRUTH: Record<string, { level: Level; why: string }> = {
  'math-g10-p1-20-1-1': { level: 2, why: 'solve a linear equation -- one drilled procedure' },
  'math-g10-p1-21-5-6': { level: 2, why: 'one known rule, P(A or B), applied directly' },
  'math-g10-p1-23-5-3': { level: 3, why: 'must build the Venn relationship before any arithmetic' },
  'math-g10-p1-25-4-9': { level: 2, why: 'asymptotes read from the form, then one substitution' },
  'math-g10-p1-b-4-6': { level: 1, why: 'both answers read straight off a stated turning point' },
  'math-g10-p2-20-3-1': { level: 1, why: 'the method is NAMED in the prompt; one subtraction' },
  'math-g10-p2-22-3-4': { level: 2, why: 'a standard ratio or Pythagoras step' },
  'math-g10-p2-24-3-9': { level: 2, why: 'formula spelled out in the prompt, then substitution' },
  'math-g10-p2-b-1-4': { level: 2, why: 'five-number summary is a drilled routine' },
  'math-g11-p1-20-2-2': { level: 2, why: 'identify a and d, apply the Sn formula' },
  'math-g11-p1-22-4-4': { level: 2, why: 'turning point then y-intercept, both standard' },
  'math-g11-p1-25-1-1': { level: 2, why: 'solve a linear equation' },
  'math-g11-p1-b-2-4': { level: 2, why: 'apply Tn = a + (n-1)d' },
  'math-g11-p2-20-4-3': { level: 3, why: 'must recognise WHICH circle theorem the tangent-chord case needs' },
  'math-g11-p2-23-3-5': { level: 2, why: 'one substitution of tan = sin/cos -- a proof in name only' },
  'math-g11-p2-a-2-7': { level: 3, why: 'several analytical-geometry procedures combined in one item' },
  'math-p1-20-2-1': { level: 2, why: 'apply Tn = a + (n-1)d' },
  'math-p1-22-1-5': { level: 3, why: 'factorise, then reason about the sign of a product' },
  'math-p1-24-1-2': { level: 2, why: 'a standard trinomial factorisation' },
  'math-p1-25-6-3': { level: 3, why: 'without replacement -- the second probability depends on the first' },
  'math-p1-b-5-8': { level: 2, why: 'differentiate a monomial, then substitute' },
  'math-p2-21-1-4': { level: 1, why: 'a and b are given; one substitution into y = a + bx' },
  'math-p2-23-4-2': { level: 2, why: 'a standard angle calculation' },
  'math-p2-a-3-2': { level: 2, why: 'a reduction formula that has been drilled' },
}

const list: any[] = (await papersForSubject('mathematics')) as any
const all = new Map<string, any>()
for (const p of list) for (const s of p.sections) for (const i of s.items) all.set(i.id, i)

let agree = 0
let n = 0
const rows: string[] = []
const confusion = new Map<string, number>()
const handCount = new Map<Level, number>()
const storedCount = new Map<Level, number>()

for (const [id, truth] of Object.entries(TRUTH)) {
  const item = all.get(id)
  if (!item) {
    rows.push(`  MISSING ${id} -- the sample is stale, re-run scratchpad/math-sample.mts`)
    continue
  }
  n++
  handCount.set(truth.level, (handCount.get(truth.level) ?? 0) + 1)
  const stored = item.cognitiveLevel as Level
  storedCount.set(stored, (storedCount.get(stored) ?? 0) + 1)
  if (stored === truth.level) agree++
  else {
    const key = `hand L${truth.level} -> stored L${stored}`
    confusion.set(key, (confusion.get(key) ?? 0) + 1)
    rows.push(`  ${id.padEnd(22)} hand L${truth.level}, stored L${stored}  (${truth.why})`)
  }
}

console.log(`AGREEMENT WITH HAND LABELS: ${agree}/${n} (${Math.round((agree / n) * 100)}%)`)
const commonest = [...handCount.entries()].sort((a, b) => b[1] - a[1])[0]
console.log(
  `Baseline, labelling everything L${commonest[0]} unread: ${commonest[1]}/${n} (${Math.round((commonest[1] / n) * 100)}%)`,
)
console.log(
  `\n  hand:   ${[1, 2, 3, 4].map((l) => `L${l}=${handCount.get(l as Level) ?? 0}`).join('  ')}`,
)
console.log(
  `  stored: ${[1, 2, 3, 4].map((l) => `L${l}=${storedCount.get(l as Level) ?? 0}`).join('  ')}`,
)

if (confusion.size) {
  console.log('\nWhere it goes wrong, and in which direction:')
  for (const [k, v] of [...confusion.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(26)} ${v}`)
}
if (rows.length) {
  console.log('\nDisagreements:')
  for (const r of rows) console.log(r)
}

console.log(
  '\nThe hand column is the one to read against the CAPS targets. Where hand and\n' +
    'stored agree that a level is nearly absent, that is a statement about the\n' +
    'CONTENT, and no amount of relabelling will produce it.',
)
