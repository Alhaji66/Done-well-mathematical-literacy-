/**
 * Every data chart must be well formed, and must agree with its question.
 *
 * THREE KINDS OF CHECK.
 *
 * 1. SHAPE. A pie whose slices do not add to 100%, a box whose quartiles are
 *    out of order, a histogram with one bar too few -- each draws a picture that
 *    looks plausible and teaches something false.
 *
 * 2. FAITHFULNESS, for the charts in chartSpecs.ts. Those were added to
 *    questions that already described their chart in words, so the words came
 *    first and the chart must not contradict them: every value on the chart has
 *    to be a number the question (prompt, context or answer) states. A chart
 *    that invented a value would be two sources of truth disagreeing, with the
 *    learner's eye on the wrong one. The one allowed exception is a pie slice
 *    marked `remainder`, which must equal 100% minus the others exactly.
 *
 *    Charts authored WITH a question (the `chart` field) are the question's own
 *    data -- "use the box-and-whisker diagram to write down the median" -- so
 *    they are not required to repeat themselves in words.
 *
 * 3. BMI BANDS, read a second way. For every child plotted on a BMI-for-age
 *    chart, this re-reads the band from the raw curve table with its own
 *    interpolation, not by calling the app's `bandFor`, and requires the answer
 *    to name that band. It also requires each child to sit clearly inside a band:
 *    a point almost on a curve is one two careful learners can read either way,
 *    and the memo would then mark one of them wrong for an honest reading.
 *
 * And one coverage check: a Mat Lit question that describes a chart ("a
 * histogram shows ...") must have one, or be listed in `chartExempt` with the
 * reason it cannot -- so a new one cannot be written that quietly skips it.
 */
import { questions } from '../src/data/questions'
import { papersForSubject } from '../src/data/papers'
import { getTopic } from '../src/data/topics'
import { chartSpecs, chartExempt } from '../src/data/chartSpecs'
import { BMI_TABLE, PERCENTILES } from '../src/data/bmiReference'
import type { ChartSpec, Question } from '../src/types'

type Item = Pick<Question, 'id' | 'topicId' | 'prompt' | 'context' | 'answer' | 'chart' | 'answerChart'>

const items: Item[] = [...questions]
for (const p of await papersForSubject('mat-lit')) for (const s of p.sections) items.push(...s.items)
const byId = new Map(items.map((i) => [i.id, i]))

const problems: string[] = []
const fail = (id: string, msg: string) => problems.push(`${id}: ${msg}`)

/** Every number in a piece of text, as a South African paper writes them. */
function numbersIn(text: string): number[] {
  return [...text.matchAll(/\d{1,3}(?:[  ]\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?/g)].map((m) =>
    Number(m[0].replace(/[  ]/g, '').replace(',', '.')),
  )
}
const states = (text: string, v: number) => numbersIn(text).some((n) => Math.abs(n - v) < 1e-6)

/* ------------------------------------------------------------------ */

function checkShape(id: string, spec: ChartSpec) {
  switch (spec.kind) {
    case 'bar': {
      if (spec.categories.length !== spec.values.length) fail(id, 'bar graph has a different number of categories and values')
      const from = spec.yFrom ?? 0
      if (Math.min(...spec.values) < from) fail(id, `a bar is below the axis start of ${from}`)
      if (spec.yTo !== undefined && Math.max(...spec.values) > spec.yTo) fail(id, `a bar is above the axis top of ${spec.yTo}`)
      break
    }
    case 'histogram': {
      if (spec.counts.length !== spec.edges.length - 1) fail(id, 'histogram needs exactly one more class boundary than bars')
      if (spec.edges.some((e, i) => i > 0 && e <= spec.edges[i - 1])) fail(id, 'histogram class boundaries are not increasing')
      if (spec.counts.some((c) => c < 0)) fail(id, 'histogram has a negative frequency')
      break
    }
    case 'pie': {
      const names = spec.pies[0].slices.map((s) => s.label).join('|')
      for (const pie of spec.pies) {
        if (pie.slices.map((s) => s.label).join('|') !== names)
          fail(id, 'pies drawn side by side must share categories in the same order -- they share one legend')
        if (pie.slices.some((s) => s.value <= 0)) fail(id, 'a pie slice has no size')
        if (spec.unit === '%') {
          const total = pie.slices.reduce((a, s) => a + s.value, 0)
          if (Math.abs(total - 100) > 1e-6) fail(id, `pie${pie.label ? ` "${pie.label}"` : ''} adds to ${total}%, not 100%`)
        }
        for (const s of pie.slices.filter((s) => s.remainder)) {
          const others = pie.slices.filter((t) => t !== s).reduce((a, t) => a + t.value, 0)
          if (spec.unit !== '%' || Math.abs(s.value - (100 - others)) > 1e-6)
            fail(id, `remainder slice "${s.label}" is not 100% minus the other slices`)
        }
      }
      break
    }
    case 'boxplot': {
      for (const b of spec.boxes) {
        const five = [b.min, b.q1, b.median, b.q3, b.max]
        if (five.some((v, i) => i > 0 && v < five[i - 1])) fail(id, `box${b.label ? ` "${b.label}"` : ''}: five-number summary is out of order`)
        if (b.min < spec.axis[0] || b.max > spec.axis[1]) fail(id, 'a box runs off its number line')
      }
      break
    }
    case 'bmi-for-age':
      for (const p of spec.points ?? []) {
        if (p.age < 2 || p.age > 20 || p.bmi < 12 || p.bmi > 32) fail(id, `point ${p.label} is off the chart`)
      }
      break
  }
}

/** Every value a chart shows, for the faithfulness check. */
function valuesOf(spec: ChartSpec): number[] {
  switch (spec.kind) {
    case 'bar':
      return [...spec.values, ...(spec.yFrom ? [spec.yFrom] : [])]
    case 'histogram':
      return [...spec.counts, ...spec.edges]
    case 'pie':
      return spec.pies.flatMap((p) => p.slices.filter((s) => !s.remainder).map((s) => s.value))
    case 'boxplot':
      return spec.boxes.flatMap((b) => [b.min, b.q1, b.median, b.q3, b.max])
    case 'bmi-for-age':
      return (spec.points ?? []).flatMap((p) => [p.age, p.bmi])
  }
}

/* ------------------------------------------------------------------ */
/* The independent BMI reading                                         */
/* ------------------------------------------------------------------ */

function curveFromTable(sex: 'girl' | 'boy', col: number, age: number): number {
  // Deliberately written again rather than imported: a second route.
  const ages = Object.keys(BMI_TABLE[sex]).map(Number).sort((a, b) => a - b)
  const below = ages.filter((a) => a <= age).pop() ?? ages[0]
  const above = ages.find((a) => a >= age) ?? ages[ages.length - 1]
  if (below === above) return BMI_TABLE[sex][below][col]
  const f = (age - below) / (above - below)
  return BMI_TABLE[sex][below][col] + f * (BMI_TABLE[sex][above][col] - BMI_TABLE[sex][below][col])
}

const BAND_WORDS = ['underweight', 'healthy weight', 'overweight', 'obese']
/** Smallest distance, in BMI units, a child may sit from a curve. */
const MIN_CLEARANCE = 0.6

function checkBmi(item: Item, spec: Extract<ChartSpec, { kind: 'bmi-for-age' }>) {
  for (const p of spec.points ?? []) {
    const curves = PERCENTILES.map((_, col) => curveFromTable(spec.sex, col, p.age))
    // Band index: how many of the 5th, 85th and 95th curves the point is at or above.
    const band = [curves[0], curves[2], curves[3]].filter((c) => p.bmi >= c).length
    const clearance = Math.min(...curves.map((c) => Math.abs(p.bmi - c)))
    if (clearance < MIN_CLEARANCE)
      fail(item.id, `${p.label} (age ${p.age}, BMI ${p.bmi}) sits ${clearance.toFixed(2)} from a curve -- too close to read reliably`)
    const word = BAND_WORDS[band]
    // "overweight" also appears inside no other band name, but "healthy weight"
    // contains "weight" -- so match whole phrases, and make sure an answer for an
    // overweight child does not merely say "weight".
    if (!new RegExp(`\\b${word}\\b`, 'i').test(item.answer))
      fail(item.id, `${p.label} reads as "${word}" on the chart, but the answer does not say so`)
  }
}

/* ------------------------------------------------------------------ */

let charted = 0
for (const [id, pair] of Object.entries(chartSpecs)) {
  const item = byId.get(id)
  if (!item) {
    fail(id, 'chartSpecs names a question that does not exist')
    continue
  }
  const text = `${item.prompt} ${item.context ?? ''} ${item.answer}`
  for (const spec of [pair.chart, pair.answerChart]) {
    if (!spec) continue
    charted += 1
    checkShape(id, spec)
    for (const v of valuesOf(spec)) {
      if (!states(text, v)) fail(id, `chart shows ${v}, which the question never states`)
    }
  }
}

for (const item of items) {
  for (const spec of [item.chart, item.answerChart]) {
    if (!spec) continue
    charted += 1
    checkShape(item.id, spec)
    if (spec.kind === 'bmi-for-age') checkBmi(item, spec)
  }
}

// Coverage: a question that describes a chart must have one, or say why not.
const DESCRIBES =
  /\b(a|two|the) (box[- ]and[- ]whisker diagrams?|histograms?|pie charts?|bar graphs?)\b[^.]{0,40}\b(shows?|of|compare|has|whose)\b/i
for (const item of items) {
  if (getTopic(item.topicId)?.subjectId !== 'mat-lit') continue
  const text = `${item.prompt} ${item.context ?? ''}`
  if (!DESCRIBES.test(text)) continue
  const has = item.chart || item.answerChart || chartSpecs[item.id]
  if (!has && !chartExempt[item.id])
    fail(item.id, 'describes a chart but has none -- add one to chartSpecs.ts, or list it in chartExempt with the reason')
}
for (const id of Object.keys(chartExempt)) {
  if (!byId.has(id)) fail(id, 'chartExempt names a question that does not exist')
  if (chartSpecs[id]) fail(id, 'is both charted and exempt')
}

if (problems.length) {
  console.error(`${problems.length} chart problem(s):\n`)
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log(
  `${charted} chart(s) checked: every shape is sound, every chart added to an existing question states only ` +
    `its own numbers, and every plotted child is read into the band its answer names.`,
)
