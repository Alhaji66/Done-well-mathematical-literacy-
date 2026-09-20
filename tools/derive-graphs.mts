/**
 * Work out which questions can carry a plotted graph, and write them out.
 *
 * Run with `--write` to regenerate `src/data/derivedGraphs.ts`; without it,
 * prints what it would do. `npm run check:graphs` runs it in check mode and
 * fails if the checked-in file has drifted from what the corpus now says --
 * the same discipline as a lockfile, so a question whose equation is edited
 * cannot keep an old graph.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { questions } from '../src/data/questions'
import { papersForSubject } from '../src/data/papers'
import { subjects } from '../src/data/subjects'
import { getTopic } from '../src/data/topics'
import { curveFrom, equationsIn, windowFor } from '../src/data/graphSpecs'
import type { GraphSpec } from '../src/types'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'src/data/derivedGraphs.ts')
const write = process.argv.includes('--write')

interface Item {
  id: string
  subject: string
  prompt: string
  context?: string
  hasGraph: boolean
}

const items: Item[] = []
for (const q of questions) {
  items.push({
    id: q.id,
    subject: getTopic(q.topicId)?.subjectId ?? '?',
    prompt: q.prompt,
    context: q.context,
    hasGraph: Boolean(q.graph),
  })
}
for (const s of subjects) {
  for (const p of await papersForSubject(s.id)) {
    for (const sec of p.sections) {
      for (const it of sec.items) {
        items.push({ id: it.id, subject: s.id, prompt: it.prompt, context: it.context, hasGraph: Boolean(it.graph) })
      }
    }
  }
}

/**
 * Only questions that are ABOUT a graph get one.
 *
 * "Solve for x: x² − 9 = 0" names the same expression as "for which x does the
 * graph of f(x) = x² − 9 lie below the x-axis", but the first is an algebra
 * question and putting a parabola above it hands the learner the answer.
 */
const IS_GRAPH_QUESTION =
  /\bgraph|axes|intercepts?\b|turning point|asymptote|sketch|parabola|hyperbola|straight line\b/i


/**
 * Does the picture belong beside the QUESTION, or with the ANSWER?
 *
 * This is the difference between a graph that teaches and a graph that cheats.
 * "For which values of x does the graph of f lie below the x-axis?" is a
 * READING question -- an NSC paper prints the graph and the learner reads the
 * interval between the intercepts off it, which is the skill being assessed.
 * "Determine the coordinates of the turning point of f(x) = −x² + 6x − 5" is a
 * FINDING question: the learner is meant to complete the square or use
 * x = −b/2a, and a plotted parabola with its vertex sitting on a gridline
 * hands them the answer for nothing.
 *
 * So a finding question gets its graph only once the answer is revealed, where
 * it does the job the corpus already uses `answerFigure` for: the learner does
 * the work, then checks the picture against what they got. Anything this
 * cannot classify confidently goes to the answer side, because a graph shown
 * too late costs a learner a little and a graph shown too early costs them the
 * question.
 */
const READING_QUESTION =
  /\bfor which values?\b|\blies? (below|above)\b|\bdescribe\b|\bcompare\b|\bdiffers? from\b|\bexplain\b|\binterpret\b|\bread off\b|\bhow many (x-)?intercepts\b|\bincreasing\b|\bdecreasing\b|\bconcave\b|\bdomain\b|\brange\b|\bintersect\b/i

const derivedPrompt = new Map<string, GraphSpec>()
const derivedAnswer = new Map<string, GraphSpec>()
let considered = 0
const rejected: string[] = []

for (const item of items) {
  if (item.hasGraph) continue
  const text = `${item.prompt} ${item.context ?? ''}`
  if (!IS_GRAPH_QUESTION.test(text)) continue
  considered += 1

  const curves: GraphSpec['curves'] = []
  const names: string[] = []
  for (const { name, rhs } of equationsIn(text)) {
    const curve = curveFrom(rhs)
    if (!curve) {
      rejected.push(`${item.id}: ${rhs}`)
      continue
    }
    // The same function named twice in one question is one curve.
    if (names.includes(name)) continue
    names.push(name)
    curves.push({ ...curve, label: name === 'y' ? undefined : name })
  }
  if (!curves.length) continue

  // One window that holds every curve in the question.
  const windows = curves.map((c) => windowFor(c))
  const xRange: [number, number] = [
    Math.min(...windows.map((w) => w.xRange[0])),
    Math.max(...windows.map((w) => w.xRange[1])),
  ]
  const yRange: [number, number] = [
    Math.min(...windows.map((w) => w.yRange[0])),
    Math.max(...windows.map((w) => w.yRange[1])),
  ]

  const title =
    curves.length === 1 && names[0] !== 'y'
      ? `The graph of ${names[0]}`
      : `The graph${curves.length > 1 ? 's' : ''} in this question`
  const spec: GraphSpec = { title, xRange, yRange, curves }
  if (READING_QUESTION.test(item.prompt)) derivedPrompt.set(item.id, spec)
  else derivedAnswer.set(item.id, spec)
}

const total = derivedPrompt.size + derivedAnswer.size
console.log(`${considered} graph question(s) examined; ${total} can be plotted.`)
console.log(`  beside the question (reading questions): ${derivedPrompt.size}`)
console.log(`  with the answer (finding questions):     ${derivedAnswer.size}`)
console.log(`${rejected.length} right-hand side(s) not recognised (no graph attached).`)
if (process.argv.includes('--rejected')) for (const r of rejected.slice(0, 60)) console.log('  ', r)

const body = `/* GENERATED by tools/derive-graphs.mts -- do not edit by hand.
 *
 * Each entry is a graph derived from the equation the question itself states,
 * and verified against it: see src/data/graphSpecs.ts. Regenerate with
 * \`npm run graphs:write\`; \`npm run check:graphs\` fails if this file has
 * drifted from the corpus.
 */
import type { GraphSpec } from '@/types'

/** Shown beside the question: reading questions, where the picture IS the task. */
export const derivedGraphs: Record<string, GraphSpec> = ${JSON.stringify(
  Object.fromEntries([...derivedPrompt.entries()].sort(([a], [b]) => a.localeCompare(b))),
  null,
  2,
)}

/** Shown only with the revealed answer: finding questions, where the picture
 *  would otherwise do the learner's work for them. */
export const derivedAnswerGraphs: Record<string, GraphSpec> = ${JSON.stringify(
  Object.fromEntries([...derivedAnswer.entries()].sort(([a], [b]) => a.localeCompare(b))),
  null,
  2,
)}
`

const existing = (() => {
  try {
    return readFileSync(OUT, 'utf8')
  } catch {
    return ''
  }
})()

if (write) {
  writeFileSync(OUT, body)
  console.log(`wrote ${OUT}`)
} else if (existing !== body) {
  console.error(
    '\nsrc/data/derivedGraphs.ts is out of date with the corpus.\n' +
      'A question\'s equation changed, or new graph questions were added.\n' +
      'Run `npm run graphs:write` and commit the result.',
  )
  process.exit(1)
} else {
  console.log('src/data/derivedGraphs.ts is up to date.')
}
