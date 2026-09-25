/**
 * Every tree diagram and Venn diagram must be well formed, and must agree with
 * the memo.
 *
 * The diagrams are built from the question's words by
 * src/lib/probabilityDiagrams.ts. This reads each one back a second way.
 *
 * 1. SHAPE. The branches leaving any node of a tree add up to 1. The regions of
 *    a Venn diagram are never negative and add up to the whole group -- the
 *    total, 100%, or 1 -- and mutually exclusive events share nothing.
 *
 * 2. AGREEMENT. Where a diagram highlights the event the question asks about,
 *    the highlighted branches or regions add up to a value, and the answer has
 *    to state that value -- as a count, a fraction, a decimal or a percentage.
 *    A diagram that parsed the words wrongly, or a memo that did its sum
 *    wrongly, disagrees here, and the learner would be shown two different
 *    answers to one question.
 *
 * 3. COVERAGE. A question in the "Tree diagrams" or "Venn diagrams" sub-topic
 *    must get its diagram, or be listed in `exempt` below with the reason.
 */
import { questions } from '../src/data/questions'
import { papersForSubject } from '../src/data/papers'
import { subtopicFor } from '../src/data/subtopics'
import { topicNotes } from '../src/data/topicNotes'
import { probabilityDiagramsFor, probValue } from '../src/lib/probabilityDiagrams'
import type { Prob, Question, TreeSpec, VennSpec } from '../src/types'

/** Questions in those sub-topics that rightly have no diagram. */
const exempt: Record<string, string> = {
  'gap-tree-g10-two-way-table': 'Its data is a two-way table, printed with the question -- the table is the diagram.',
}

const items: Question[] = [...questions]
for (const s of ['mathematics', 'mat-lit'] as const)
  for (const p of await papersForSubject(s)) for (const sec of p.sections) items.push(...sec.items)

const problems: string[] = []
const fail = (id: string, msg: string) => problems.push(`${id}: ${msg}`)
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9

/* Shape ------------------------------------------------------------- */

function sumsToOne(id: string, where: string, ps: Prob[]) {
  if (ps.some((p) => (typeof p === 'number' ? p < 0 || p > 1 : p[0] < 0 || p[1] <= 0 || p[0] > p[1])))
    fail(id, `${where}: a branch probability is outside 0 to 1`)
  if (!close(ps.reduce((s, p) => s + probValue(p), 0), 1)) fail(id, `${where}: the branches do not add up to 1`)
}

function checkTree(id: string, t: TreeSpec) {
  sumsToOne(id, `${t.title}, first stage`, t.branches.map((b) => b.p))
  for (const b of t.branches) if (b.next) sumsToOne(id, `${t.title}, after ${b.name}`, b.next.map((n) => n.p))
  const paths = t.branches.flatMap((b) => (b.next ?? []).map((n) => b.label + n.label))
  for (const h of t.highlight ?? []) if (!paths.includes(h)) fail(id, `${t.title}: highlights ${h}, which is not a path on the tree`)
}

function checkVenn(id: string, v: VennSpec) {
  const regions = [v.onlyA, v.both, v.onlyB, v.neither]
  if (regions.some((r) => r < 0)) fail(id, `${v.title}: a region is negative`)
  if (!close(regions.reduce((a, b) => a + b, 0), v.total)) fail(id, `${v.title}: the regions do not add up to ${v.total}`)
  if (v.disjoint && v.both !== 0) fail(id, `${v.title}: mutually exclusive, but the circles share ${v.both}`)
  if (v.unit === 'p' && v.total !== 1) fail(id, `${v.title}: probabilities must add up to 1`)
  if (v.unit === '%' && v.total !== 100) fail(id, `${v.title}: percentages must add up to 100`)
}

/* Agreement --------------------------------------------------------- */

/** Every value the answer states, each with how precisely it was written. */
function statedValues(answer: string): { v: number; tol: number }[] {
  const out: { v: number; tol: number }[] = []
  const s = answer.replace(/(\d) (\d{3})\b/g, '$1$2')
  for (const m of s.matchAll(/(\d+)\s*\/\s*(\d+)/g)) out.push({ v: Number(m[1]) / Number(m[2]), tol: 1e-9 })
  for (const m of s.matchAll(/(\d+(?:[.,]\d+)?)\s*%/g)) {
    const places = m[1].split(/[.,]/)[1]?.length ?? 0
    out.push({ v: Number(m[1].replace(',', '.')) / 100, tol: 0.5 * 10 ** -(places + 2) + 1e-9 })
  }
  for (const m of s.matchAll(/(?<![\d/])(\d+(?:[.,]\d+)?)(?![\d/%]|\s*\/)/g)) {
    const places = m[1].split(/[.,]/)[1]?.length ?? 0
    out.push({ v: Number(m[1].replace(',', '.')), tol: places ? 0.5 * 10 ** -places + 1e-9 : 1e-9 })
  }
  return out
}

const states = (answer: string, value: number) => statedValues(answer).some(({ v, tol }) => Math.abs(v - value) <= tol)

function leafValue(t: TreeSpec, path: string): number {
  for (const b of t.branches) for (const n of b.next ?? []) if (b.label + n.label === path) return probValue(b.p) * probValue(n.p)
  return NaN
}

let drawn = 0
let agreed = 0
const unhighlighted: string[] = []

for (const q of items) {
  const { trees, venn } = probabilityDiagramsFor(q)
  const sub = subtopicFor(q)
  const answer = [q.answer, q.explanation ?? ''].join(' ')

  for (const t of trees) {
    drawn++
    checkTree(q.id, t)
    if (t.highlight?.length) {
      const v = t.highlight.reduce((s, p) => s + leafValue(t, p), 0)
      if (states(answer, v)) agreed++
      else fail(q.id, `${t.title}: the highlighted paths ${t.highlight.join(' + ')} make ${v.toFixed(4)}, which the answer does not state`)
    } else {
      // Two questions in one -- "both red, and both blue". Nothing is
      // highlighted, but each of the two paths must still be in the answer.
      const asked = [
        [/\bboth\b[\w ]{0,20}?\bred\b/i, 'RR'],
        [/\bboth\b[\w ]{0,20}?\bblue\b/i, 'BB'],
      ] as const
      const hits = asked.filter(([re]) => re.test(q.prompt))
      if (hits.length === 2) {
        for (const [, path] of hits)
          if (states(answer, leafValue(t, path))) agreed++
          else fail(q.id, `${t.title}: path ${path} is ${leafValue(t, path).toFixed(4)}, which the answer does not state`)
      } else unhighlighted.push(`${q.id} (tree)`)
    }
  }

  if (venn) {
    drawn++
    checkVenn(q.id, venn)
    if (venn.highlight?.length) {
      const regions = { onlyA: venn.onlyA, both: venn.both, onlyB: venn.onlyB, neither: venn.neither }
      const v = venn.highlight.reduce((s, r) => s + regions[r], 0)
      // A count can be answered as itself or as a probability out of the total.
      const ok = states(answer, v) || (venn.unit !== 'p' && states(answer, v / venn.total))
      if (ok) agreed++
      else fail(q.id, `${venn.title}: the highlighted ${venn.highlightName} is ${v}, which the answer does not state`)
    } else unhighlighted.push(`${q.id} (Venn)`)
  }

  const needs = sub === 'Tree diagrams and two-way tables' || sub === 'Venn diagrams'
  if (needs && !trees.length && !venn && !exempt[q.id]) fail(q.id, `is in "${sub}" but gets no diagram -- extend src/lib/probabilityDiagrams.ts or list it in exempt with the reason`)
}

// The model diagrams in the Learn notes are held to the same shape rules.
for (const note of topicNotes)
  for (const sub of note.subtopics ?? []) {
    if (sub.tree) checkTree(`${note.topicId} note "${sub.name}"`, sub.tree)
    if (sub.venn) checkVenn(`${note.topicId} note "${sub.name}"`, sub.venn)
  }

console.log(`${drawn} probability diagrams; ${agreed} values read back from them and found in the memo; ${unhighlighted.length} diagrams answer a question with no single sum to check, and are shape-checked only.`)
if (process.argv.includes('--list')) console.log(unhighlighted.join('\n'))
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n${problems.join('\n')}`)
  process.exit(1)
}
