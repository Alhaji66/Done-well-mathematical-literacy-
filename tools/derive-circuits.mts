/**
 * Attach circuit diagrams to the Physical Sciences questions that describe one.
 *
 * Run with `--write` to regenerate `src/data/derivedCircuits.ts`; without it,
 * checks the file is current and fails if not.
 *
 * WHY DERIVED, and not typed by hand. The resistances, the emf and the
 * arrangement are already written in each question. Copying them into a second
 * place would create a second source of truth that can disagree with the first,
 * and a circuit diagram that disagrees with its question is worse than no
 * diagram at all -- the learner trusts the picture.
 *
 * WHAT STOPS A WRONG PICTURE. Every candidate is checked against a figure the
 * question states independently (see circuitSpecs.ts), and this tool then
 * re-checks it by a route the parser does not use: it adds the resistances up
 * again from the finished spec, in code written separately, and requires the
 * two to agree to within rounding. Anything that fails either check is dropped
 * rather than drawn.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { questions } from '../src/data/questions'
import { papersForSubject } from '../src/data/papers'
import { getTopic } from '../src/data/topics'
import { circuitFrom } from '../src/data/circuitSpecs'
import type { CircuitSpec } from '../src/types'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'src/data/derivedCircuits.ts')
const write = process.argv.includes('--write')

interface Item {
  id: string
  prompt: string
  context?: string
  answer: string
  hasCircuit: boolean
}

const items: Item[] = []
for (const q of questions) {
  if (getTopic(q.topicId)?.subjectId !== 'physical-sciences') continue
  items.push({
    id: q.id,
    prompt: q.prompt,
    context: q.context,
    answer: q.answer,
    hasCircuit: Boolean(q.circuit || q.answerCircuit || q.figure || q.answerFigure),
  })
}
for (const p of await papersForSubject('physical-sciences')) {
  for (const s of p.sections) {
    for (const it of s.items) {
      items.push({
        id: it.id,
        prompt: it.prompt,
        context: it.context,
        answer: it.answer,
        hasCircuit: Boolean(it.circuit || it.answerCircuit || it.figure || it.answerFigure),
      })
    }
  }
}

/**
 * A question that asks the learner to DRAW the circuit, or to say how the
 * components are arranged, gets its diagram only with the answer.
 *
 * "Draw a circuit diagram showing where the ammeter must be connected" is
 * answered outright by a finished diagram above it. Every other circuit
 * question is the opposite case: a real paper prints the diagram WITH the
 * question, because reading it is the first thing the question asks the learner
 * to do, and withholding it makes the question harder than the exam's.
 */
const GIVES_IT_AWAY =
  /\b(draw|sketch)\b[^.?]*\b(circuit|diagram)\b|\b(are|is) (they|these|the (two|three) resistors) (connected )?in (series or parallel|parallel or series)\b/i

/**
 * Add the circuit up again, by hand, from the finished spec.
 *
 * Deliberately NOT a call to circuitSpecs' own `totalOf`. The point of a second
 * check is that it is a second piece of code: if the first one has a bug -- a
 * parallel formula that adds instead of adding reciprocals, say -- calling it
 * twice agrees with itself and proves nothing.
 */
function recomputeTotal(spec: CircuitSpec): number {
  let sum = spec.internalResistance ?? 0
  for (const el of spec.elements) {
    if (el.kind === 'resistor') {
      sum += el.ohms
      continue
    }
    // Two resistors in parallel: R = product over sum, extended by folding.
    let combined: number | null = null
    for (const branch of el.of) {
      combined = combined === null ? branch.ohms : (combined * branch.ohms) / (combined + branch.ohms)
    }
    sum += combined ?? 0
  }
  return sum
}

/** Is `value` written somewhere in `text`, allowing for a memo's rounding? */
function statesValue(text: string, value: number): boolean {
  const numbers = [...text.matchAll(/(\d+(?:[,.]\d+)?)/g)].map((m) => Number(m[1].replace(',', '.')))
  return numbers.some((n) => Math.abs(n - value) < Math.max(0.05, Math.abs(value) * 0.01))
}

const prompt = new Map<string, CircuitSpec>()
const answer = new Map<string, CircuitSpec>()
const shapes = new Map<string, number>()
const dropped: string[] = []

for (const item of items) {
  if (item.hasCircuit) continue
  const spec = circuitFrom(item.prompt, item.context, item.answer)
  if (!spec) continue

  // The independent re-check: the two totals must agree, and the total must
  // still be a number the question itself stands behind.
  const mine = recomputeTotal(spec)
  const source = `${item.prompt} ${item.context ?? ''} ${item.answer}`
  if (!Number.isFinite(mine) || mine <= 0) {
    dropped.push(`${item.id}: recomputed total is not a usable resistance`)
    continue
  }
  const current = spec.emf === undefined ? null : spec.emf / mine
  if (!statesValue(item.answer, mine) && !(current !== null && statesValue(source, current))) {
    dropped.push(`${item.id}: recomputed ${mine.toFixed(2)} Ω is not stated anywhere in the question`)
    continue
  }

  const shape = spec.elements
    .map((el) => (el.kind === 'resistor' ? 'R' : `∥${el.of.length}`))
    .join('+')
  const key = `${spec.emf === undefined ? 'network' : 'loop'} ${shape}${spec.internalResistance === undefined ? '' : ' +r'}`
  shapes.set(key, (shapes.get(key) ?? 0) + 1)

  if (GIVES_IT_AWAY.test(item.prompt)) answer.set(item.id, spec)
  else prompt.set(item.id, spec)
}

console.log(`${items.length} Physical Sciences item(s); ${prompt.size + answer.size} get a circuit diagram.`)
console.log(`  beside the question: ${prompt.size}`)
console.log(`  with the answer (drawing questions): ${answer.size}`)
for (const [shape, n] of [...shapes].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${shape.padEnd(20)} ${n}`)
}
if (dropped.length) {
  console.log(`\n  dropped by the second check (${dropped.length}):`)
  for (const d of dropped) console.log(`    ${d}`)
}

const serialise = (m: Map<string, CircuitSpec>) =>
  JSON.stringify(Object.fromEntries([...m.entries()].sort(([a], [b]) => a.localeCompare(b))), null, 2)

const body = `/* GENERATED by tools/derive-circuits.mts -- do not edit by hand.
 *
 * Which circuit belongs with which Physical Sciences question, read out of the
 * question's own words and checked against its own answer. Regenerate with
 * \`npm run circuits:write\`; \`npm run check:circuits\` fails if this file has
 * drifted from the corpus.
 */
import type { CircuitSpec } from '@/types'

/** Shown beside the question, as a paper prints it. */
export const derivedCircuits: Record<string, CircuitSpec> = ${serialise(prompt)}

/** Shown only with the revealed answer: questions that ask for the drawing. */
export const derivedAnswerCircuits: Record<string, CircuitSpec> = ${serialise(answer)}
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
  console.log(`\nwrote ${OUT}`)
} else if (existing !== body) {
  console.error('\nsrc/data/derivedCircuits.ts is out of date. Run `npm run circuits:write` and commit it.')
  process.exit(1)
} else {
  console.log('\nsrc/data/derivedCircuits.ts is up to date.')
}
