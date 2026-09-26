/**
 * Measure tools/cognitive-level.mts against hand labels, on Mathematical
 * Literacy.
 *
 * WHY THIS EXISTS. Of the four subjects, only Life Sciences was levelled by
 * hand. Mat Lit, Mathematics and Physical Sciences were levelled from their
 * wording by cognitive-level.mts, and Life Sciences is also the only subject
 * that comes out compliant against CAPS. That is a suspicious coincidence: the
 * compliance report for the other three may be measuring the classifier rather
 * than the content, and before anybody authors hundreds of marks of new Mat Lit
 * material it is worth knowing which.
 *
 * The 24 items below were sampled SYSTEMATICALLY -- every 71st item of the
 * corpus sorted by id, via scratchpad/matlit-sample.mts -- so the sample cannot
 * have been chosen to flatter or damn the classifier, and the same 24 come back
 * on every run. They were labelled by reading the prompt against the CAPS Mat
 * Lit taxonomy, WITH THE STORED LEVEL HIDDEN, for the obvious reason that a
 * label written after seeing the machine's answer measures nothing.
 *
 * Four of the 24 have since gone: the 2022 and 2024 papers they came from were
 * rebuilt in the NSC format. They are excluded below rather than relabelled or
 * replaced, so the score is on 20. The tool had all four of them right, which
 * is why agreement fell from 15/24 to 11/20 -- the tool did not get worse. A
 * sample this small is now worth redrawing before it is relied on again.
 *
 * THE CAPS MAT LIT TAXONOMY, as applied here:
 *
 *   L1 Knowing -- recall a fact or definition, classify something, read a
 *      value off, or carry out a single routine calculation on numbers that
 *      are handed to you.
 *   L2 Applying routine procedures in familiar contexts -- a well-practised
 *      method in a familiar setting. More than one step is fine as long as the
 *      method is obvious from the question.
 *   L3 Applying multi-step procedures in a variety of contexts -- the learner
 *      has to CHOOSE the procedure, the steps are not all signalled, and the
 *      information may come from more than one place.
 *   L4 Reasoning and reflecting -- form a judgement and defend it, compare and
 *      comment, decide between options, or say what a result actually means.
 *
 * Note that Mat Lit's Level 1 is more generous than Mathematics' -- a single
 * routine calculation counts -- which is why several two-mark "calculate the
 * total" items below are labelled 1 rather than 2.
 *
 *   npm run check:matlit-level
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import { classify } from './cognitive-level.mts'

type Level = 1 | 2 | 3 | 4

/** Hand labels. The note on each says what decided it, not what the tool said. */
const TRUTH: Record<string, { level: Level; why: string }> = {
  'ml-g10-p1-20-1-1': { level: 1, why: 'one addition on two numbers handed over' },
  'ml-g10-p1-22-1-3': { level: 2, why: 'weekly spend then subtract; familiar, method obvious' },
  'ml-g10-p1-24-1-6': { level: 3, why: 'non-uniform saving with a once-off, must model then round up' },
  'ml-g10-p1-a-1-9': { level: 1, why: 'classify a cash flow as income -- recall' },
  'ml-g10-p1-c-2-4': { level: 2, why: 'tile area then multiply by the box count' },
  'ml-g10-p2-21-3-3': { level: 4, why: 'ends by asking whether paying a share means OWNING that share' },
  'ml-g10-p2-24-1-10': { level: 1, why: 'one percentage on numbers given' },
  'ml-g10-p2-a-2-3': { level: 1, why: 'state what a 1:250 scale means -- definition' },
  'ml-g10-p2-c-4-1': { level: 3, why: 'volume, percentage of a load, then whether two beds fit' },
  'ml-g11-p1-21-4-8': { level: 3, why: 'data handling into finance across several unsignalled steps' },
  'ml-g11-p1-24-1-4': { level: 2, why: 'combine two savers over five weeks' },
  'ml-g11-p1-a-2-1': { level: 1, why: 'area of a rectangle, both sides given' },
  'ml-g11-p1-c-2-6': { level: 1, why: 'which unit suits an area -- knowing' },
  'ml-g11-p2-21-3-6': { level: 2, why: 'difference then express as a percentage of the original' },
  'ml-g11-p2-24-1-4': { level: 3, why: 'percentage increase, then check it against a stated criterion' },
  'ml-g11-p2-a-2-6': { level: 4, why: 'two defensible chair counts, then which one the clinic should use' },
  'ml-g11-p2-c-4-4': { level: 1, why: 'metres to centimetres' },
  // 'ml-p1-22-1-4' was here ('seedlings to whole packs, then cost'). EXCLUDED: the 2022
  // papers were rebuilt in the NSC format.
  // 'ml-p1-24-2-3' was here, hand-labelled L4 ('which of two unit prices is the
  // right basis for comparing suppliers'). EXCLUDED rather than relabelled: the
  // 2024 Paper 1 it belonged to was rebuilt in the NSC format, so the prompt is gone.
  // 'ml-p1-a-3-1' was here, hand-labelled L2 ('scale conversion with a unit
  // change'). EXCLUDED: Predicted Set A was rebuilt in the NSC format.
  'ml-p1-c-4-10': { level: 4, why: 'mean and median, then justify which represents a typical cost' },
  // 'ml-p2-22-1-2' was here ('why beating a target on average is not meeting it reliably'). EXCLUDED: the 2022
  // papers were rebuilt in the NSC format.
  // 'ml-p2-24-2-2' was here, hand-labelled L3 ('speed, inverse time, then the gap
  // -- several rate steps'). EXCLUDED: the 2024 Paper 2 was rebuilt in the NSC format.
  // 'ml-p2-a-3-4' was here, hand-labelled L1 ('classify a bank fee as an expense
  // -- recall'). EXCLUDED: Predicted Set A was rebuilt in the NSC format.
}

const list: any[] = (await papersForSubject('mat-lit')) as any
const all = new Map<string, any>()
for (const p of list) for (const s of p.sections) for (const i of s.items) all.set(i.id, i)

let agree = 0
let n = 0
const rows: string[] = []
const confusion = new Map<string, number>()

for (const [id, truth] of Object.entries(TRUTH)) {
  const item = all.get(id)
  if (!item) {
    rows.push(`  MISSING ${id} -- sample is stale, re-run scratchpad/matlit-sample.mts`)
    continue
  }
  n++
  const got = classify(item) as { level: Level } | Level
  const level = (typeof got === 'number' ? got : got.level) as Level
  if (level === truth.level) {
    agree++
  } else {
    const key = `hand L${truth.level} -> tool L${level}`
    confusion.set(key, (confusion.get(key) ?? 0) + 1)
    rows.push(`  ${id.padEnd(20)} hand L${truth.level}, tool L${level}  (${truth.why})`)
  }
}

console.log(`AGREEMENT WITH HAND LABELS: ${agree}/${n} (${Math.round((agree / n) * 100)}%)`)

// The baseline worth beating: always guessing the commonest hand label.
const counts = new Map<Level, number>()
for (const t of Object.values(TRUTH)) counts.set(t.level, (counts.get(t.level) ?? 0) + 1)
const commonest = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
console.log(`Baseline, labelling everything L${commonest[0]} unread: ${commonest[1]}/${n} (${Math.round((commonest[1] / n) * 100)}%)`)

console.log(`\nHand-label distribution: ${[1, 2, 3, 4].map((l) => `L${l}=${counts.get(l as Level) ?? 0}`).join('  ')}`)

if (confusion.size) {
  console.log('\nWhere it goes wrong, and in which direction:')
  for (const [k, v] of [...confusion.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(26)} ${v}`)
}
if (rows.length) {
  console.log('\nDisagreements:')
  for (const r of rows) console.log(r)
}
