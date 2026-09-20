import type { CircuitElement, CircuitSpec } from '@/types'

/**
 * Read a circuit out of a question's own words, and check it against the
 * question's own answer before believing it.
 *
 * WHY DERIVE. Around a hundred Physical Sciences questions describe a circuit
 * and none had a diagram. The description is already in the prompt -- "a 4 Ω
 * resistor and an 8 Ω resistor are connected in series to a 12 V battery" -- so
 * drawing it by hand would mean re-typing the same resistances into a second
 * place, where they could disagree with the first.
 *
 * HOW IT IS CHECKED, and this is the part that matters. A wrong circuit is far
 * worse than no circuit: a learner who sees two resistors drawn in series when
 * the question says parallel will add them instead of adding reciprocals, and
 * get a confidently wrong answer. So a parsed circuit is only attached when the
 * resistance IT computes matches a figure the question states INDEPENDENTLY --
 * in the marking answer, written by a person, or as an explicit current in the
 * question itself. Those are two separate routes to the same number, and they
 * have to agree. An arrangement that has been misread almost never survives,
 * because series and parallel give different totals: 6 Ω and 12 Ω come to 18 Ω
 * one way and 4 Ω the other, and only one of those is in the memo.
 *
 * That guard has already earned its keep. `psci-series-mt1` asks about "the
 * 6 ohm resistor" in its prompt and then lists "4 ohm and 6 ohm" in its
 * context, so reading the two fields together finds three resistors and totals
 * 16 Ω. The memo says 10 Ω, the candidate was dropped, and reading the context
 * on its own then gave the right pair.
 */

/* ------------------------------------------------------------------ */
/* Reading the components                                              */
/* ------------------------------------------------------------------ */

/** A resistance as the corpus writes it: "4 Ω", "4 ohm", "4,5 Ω", "2.5 Ω". */
const OHM = String.raw`(\d+(?:[,.]\d+)?)\s*(?:Ω|ohm(?:s)?\b)`
const num = (s: string) => Number(s.replace(',', '.'))

/** Every resistance named in the text, in the order they are named. */
function resistancesIn(text: string): number[] {
  return [...text.matchAll(new RegExp(OHM, 'gi'))].map((m) => num(m[1]))
}

/**
 * The emf, in volts, or null when the question gives no source.
 *
 * Null is a real answer, not a failure: "calculate the equivalent resistance of
 * the combination" names no battery because the answer does not depend on one,
 * and those get an open network drawn instead of a loop.
 */
function emfIn(text: string): number | null {
  const m = /(\d+(?:[,.]\d+)?)\s*V\b(?!\w)/.exec(text) ?? /(\d+(?:[,.]\d+)?)\s*volt/i.exec(text)
  return m ? num(m[1]) : null
}

/**
 * Internal resistance, where the question gives one.
 *
 * The `r =` form is matched case-SENSITIVELY on purpose. These questions are
 * written "(ε = 9 V, r = 0,5 Ω, R = 2,5 Ω)", where lower-case r is the internal
 * resistance and capital R is the external one; a case-insensitive match would
 * read the external resistor as internal and draw the circuit with nothing in
 * it.
 */
function internalIn(text: string): number | undefined {
  const m = new RegExp(String.raw`internal resistance\s*(?:of\s*)?${OHM}`, 'i').exec(text)
  if (m) return num(m[1])
  const m2 = new RegExp(String.raw`(?<![A-Za-z])r\s*=\s*${OHM}`).exec(text)
  return m2 ? num(m2[1]) : undefined
}

/**
 * Which arrangement the sentence describes.
 *
 * Null means the words name no arrangement. That is not always a refusal: a
 * battery with internal resistance driving ONE resistor is still a loop this
 * can draw, and a paper writes no arrangement word for it because with one
 * component there is nothing to be in series WITH. That case is recognised from
 * the components instead -- see `candidate` -- rather than from a phrase,
 * because the corpus is not consistent about which phrase it uses: the same
 * question appears both as "connected to an external resistor of 2,5 Ω" and as
 * a bare "(ε = 6 V, r = 0,4 Ω, R = 2,6 Ω)", and keying on the wording drew half
 * of them and skipped the rest.
 */
type Arrangement = 'series' | 'parallel' | 'series-parallel' | 'single' | null
function arrangementIn(text: string): Arrangement {
  const series = /\bin series\b/i.test(text)
  const parallel = /\bin parallel\b|parallel combination|parallel with\b/i.test(text)
  if (series && parallel) return 'series-parallel'
  if (series) return 'series'
  if (parallel) return 'parallel'
  return null
}

/**
 * How many resistors "two resistors, each 8 Ω" means.
 *
 * A question that gives a count and one value is describing that many identical
 * resistors, and naming the value once is not the same as there being one.
 */
const COUNTS: Record<string, number> = { two: 2, three: 3, four: 4 }
function statedCount(text: string): number | null {
  const m = /\b(two|three|four)\s+(?:identical\s+)?resistors?\b/i.exec(text)
  return m ? COUNTS[m[1].toLowerCase()] : null
}

/* ------------------------------------------------------------------ */
/* The physics, computed here and nowhere else                         */
/* ------------------------------------------------------------------ */

const parallelOf = (rs: number[]) => 1 / rs.reduce((a, r) => a + 1 / r, 0)

export function resistanceOfElement(el: CircuitElement): number {
  return el.kind === 'resistor' ? el.ohms : parallelOf(el.of.map((r) => r.ohms))
}

export function totalOf(spec: CircuitSpec): number {
  return spec.elements.reduce((a, el) => a + resistanceOfElement(el), 0) + (spec.internalResistance ?? 0)
}

/* ------------------------------------------------------------------ */
/* Building a candidate circuit                                        */
/* ------------------------------------------------------------------ */

/**
 * A circuit the words describe, before it has been checked.
 *
 * Deliberately conservative. It draws four shapes and no others: resistors in
 * series, resistors in parallel, one resistor in series with a parallel pair,
 * and a single external resistor across a battery with internal resistance.
 * Anything more elaborate is left alone rather than guessed at -- a guess here
 * draws a circuit that is not the one the question is about, and the learner
 * has no way of knowing.
 */
function candidate(text: string, title: string): CircuitSpec | null {
  const emf = emfIn(text)
  const internal = internalIn(text)

  // The internal resistance is one of the numbers matched, so take that one
  // occurrence out of the list before treating the rest as components.
  const named = resistancesIn(text)
  let components = named
  if (internal !== undefined) {
    const at = named.indexOf(internal)
    if (at >= 0) components = [...named.slice(0, at), ...named.slice(at + 1)]
  }

  // A cell with internal resistance driving one resistor is a loop even though
  // no arrangement word is written, since there is nothing for the one resistor
  // to be in series WITH.
  const arrangement =
    arrangementIn(text) ??
    (emf !== null && internal !== undefined && components.length === 1 ? 'single' : null)
  if (arrangement === null) return null

  // "Two resistors, each 8 Ω": one value, two of them.
  const count = statedCount(text)
  if (count !== null && components.length === 1 && /\beach\b/i.test(text)) {
    components = Array.from({ length: count }, () => components[0])
  }
  // A count that disagrees with how many values were found means something in
  // the sentence was misread, and a misread circuit is the thing to avoid.
  if (count !== null && components.length !== count) return null

  let elements: CircuitElement[]
  if (arrangement === 'single') {
    if (emf === null || internal === undefined || components.length !== 1) return null
    elements = [{ kind: 'resistor', ohms: components[0] }]
  } else if (arrangement === 'series') {
    if (components.length < 2 || components.length > 3) return null
    elements = components.map((ohms) => ({ kind: 'resistor', ohms }))
  } else if (arrangement === 'parallel') {
    if (components.length < 2 || components.length > 3) return null
    elements = [{ kind: 'parallel', of: components.map((ohms) => ({ ohms })) }]
  } else {
    // "in series with a parallel combination of X and Y": the first named
    // resistance is the series one, the rest are the parallel bank.
    if (components.length !== 3) return null
    const [first, ...rest] = components
    elements = [
      { kind: 'resistor', ohms: first },
      { kind: 'parallel', of: rest.map((ohms) => ({ ohms })) },
    ]
  }

  return {
    title,
    ...(emf === null ? {} : { emf }),
    ...(internal === undefined ? {} : { internalResistance: internal }),
    elements,
  }
}

/* ------------------------------------------------------------------ */
/* Checking it against what the question states                        */
/* ------------------------------------------------------------------ */

/** Every number written anywhere in a piece of text. */
function numbersIn(text: string): number[] {
  return [...text.matchAll(/(\d+(?:[,.]\d+)?)/g)].map((m) => num(m[1]))
}

/**
 * A current the question itself asserts, as in "(ε = 9 V, r = 0,5 Ω, R = 2,5 Ω,
 * I = 3 A)".
 *
 * Checking against this is NOT circular, even though the resistances came from
 * the same sentence. The current is a consequence of them by physics, and the
 * question states it separately; if the components were misread, the current
 * computed from them will not be the one written down.
 */
function statedCurrent(text: string): number | null {
  const m = /(?<![A-Za-z])I\s*=\s*(\d+(?:[,.]\d+)?)\s*A\b/.exec(text)
  return m ? num(m[1]) : null
}

/**
 * Does the circuit's own arithmetic agree with a figure stated elsewhere?
 *
 * The answer to a circuit question almost always contains the total resistance,
 * the current, or both. Recomputing them from the drawn circuit and finding one
 * of them is the evidence that the arrangement was read correctly.
 *
 * The tolerance is 1%, or 0,05 for small values, because a memo rounds: 1/9 +
 * 1/18 gives 6 Ω exactly but 1/4 + 1/6 gives 2,4 Ω against a memo that may say
 * 2,4 or 2,40.
 */
export function agreesWithAnswer(spec: CircuitSpec, answer: string, text = ''): boolean {
  const stated = numbersIn(answer)
  if (!stated.length) return false
  const close = (v: number, pool: number[]) =>
    pool.some((s) => Math.abs(s - v) < Math.max(0.05, Math.abs(v) * 0.01))

  const rTotal = totalOf(spec)
  if (close(rTotal, stated)) return true
  if (spec.emf !== undefined && rTotal > 0) {
    const current = spec.emf / rTotal
    if (close(current, stated)) return true
    const asserted = statedCurrent(text)
    if (asserted !== null && close(current, [asserted])) return true
  }
  return false
}

/**
 * The circuit a question describes, or null.
 *
 * WHY IT READS THE CONTEXT AND THE PROMPT SEPARATELY. The description sits in
 * whichever of the two the author put it in, and the other field often mentions
 * the same resistors again in passing -- "determine the potential difference
 * across the 6 ohm resistor" beside a context that already lists 4 Ω and 6 Ω.
 * Reading the two together then finds three resistors where there are two. So
 * each framing of the sentence is tried in turn and the first one that AGREES
 * WITH THE ANSWER wins; a framing that disagrees is discarded, which is the
 * same guard as before rather than a second chance at passing it.
 *
 * Null whenever no framing describes an arrangement this can draw, or none of
 * them agrees. Both mean "no diagram", which costs a learner a picture; the
 * alternative costs them the question.
 */
export function circuitFrom(prompt: string, context: string | undefined, answer: string): CircuitSpec | null {
  const title = 'The circuit described in this question'
  const framings = [context ?? '', prompt, `${prompt} ${context ?? ''}`]
  for (const text of framings) {
    if (!text.trim()) continue
    const spec = candidate(text, title)
    if (spec && agreesWithAnswer(spec, answer, text)) return spec
  }
  return null
}
