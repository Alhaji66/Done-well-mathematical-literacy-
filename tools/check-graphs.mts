/**
 * Every plotted graph must be right, and must show what it was drawn for.
 *
 * Two separate failures, both of which shipped in a first draft of this and
 * neither of which a build error would have caught:
 *
 *   1. A curve that disagrees with the equation printed above it. Guarded by
 *      re-deriving the curve from the question's own words and requiring the
 *      checked-in spec to match.
 *   2. A curve that is RIGHT but drawn through a window that hides the thing
 *      the question is about. y = x² − 36 has its vertex and its y-intercept
 *      both at −36, and a window built from those two numbers put the roots
 *      at (±6 ; 0) off the top of the picture -- a graph of a parabola with
 *      no visible x-intercepts, above a question asking where it cuts the
 *      x-axis.
 */
import { questions } from '../src/data/questions'
import { papersForSubject } from '../src/data/papers'
import { subjects } from '../src/data/subjects'
import { derivedGraphs, derivedAnswerGraphs } from '../src/data/derivedGraphs'
import { curveFrom, equationsIn, evalExpr, normalise } from '../src/data/graphSpecs'
import type { GraphCurve, GraphSpec } from '../src/types'

const text = new Map<string, string>()
for (const q of questions) text.set(q.id, `${q.prompt} ${q.context ?? ''}`)
for (const s of subjects)
  for (const p of await papersForSubject(s.id))
    for (const sec of p.sections)
      for (const it of sec.items) text.set(it.id, `${it.prompt} ${it.context ?? ''}`)

function evaluateCurve(curve: GraphCurve, x: number): number | null {
  switch (curve.kind) {
    case 'line':
      return curve.m * x + curve.c
    case 'parabola':
      return curve.a * x * x + curve.b * x + curve.c
    case 'cubic':
      return curve.a * x ** 3 + curve.b * x * x + curve.c * x + curve.d
    case 'hyperbola':
      return x === curve.p ? null : curve.a / (x - curve.p) + curve.q
    case 'exponential':
      return curve.a * curve.b ** (x - (curve.p ?? 0)) + (curve.q ?? 0)
    default:
      return null
  }
}

const problems: string[] = []
let checked = 0
let matchedToText = 0

for (const [where, table] of [
  ['beside the question', derivedGraphs],
  ['with the answer', derivedAnswerGraphs],
] as const) {
  for (const [id, spec] of Object.entries(table as Record<string, GraphSpec>)) {
    checked += 1
    const source = text.get(id)
    if (!source) {
      problems.push(`${id}: a graph for a question that no longer exists.`)
      continue
    }

    // 1. Every curve must still be one the question's own text describes.
    for (const curve of spec.curves) {
      const found = equationsIn(source).some(({ rhs }) => {
        const other = curveFrom(rhs)
        return other !== null && JSON.stringify({ ...other, label: undefined }) === JSON.stringify({ ...curve, label: undefined })
      })
      if (found) matchedToText += 1
      else problems.push(`${id} (${where}): plots ${JSON.stringify(curve)}, which its text does not state.`)
    }

    // 2. The window must show the x-axis and the curve's own features.
    const [y0, y1] = spec.yRange
    const [x0, x1] = spec.xRange
    if (y0 > 0 || y1 < 0) {
      problems.push(`${id} (${where}): y range ${y0}..${y1} does not include the x-axis.`)
    }
    if (x1 <= x0) problems.push(`${id} (${where}): empty x range.`)

    for (const curve of spec.curves) {
      if (curve.kind === 'parabola') {
        const vx = -curve.b / (2 * curve.a)
        const vy = evaluateCurve(curve, vx)!
        if (vx < x0 || vx > x1 || vy < y0 || vy > y1) {
          problems.push(
            `${id} (${where}): turning point (${vx} ; ${vy}) is outside the window ${x0}..${x1} by ${y0}..${y1}.`,
          )
        }
        const disc = curve.b * curve.b - 4 * curve.a * curve.c
        if (disc >= 0) {
          const r = Math.sqrt(disc) / (2 * Math.abs(curve.a))
          for (const root of [vx - r, vx + r]) {
            if (root < x0 || root > x1) {
              problems.push(`${id} (${where}): the root x = ${root.toFixed(2)} is off the picture.`)
            }
          }
        }
      }
      if (curve.kind === 'hyperbola') {
        if (curve.p <= x0 || curve.p >= x1) problems.push(`${id} (${where}): vertical asymptote x = ${curve.p} is off the picture.`)
        if (curve.q < y0 || curve.q > y1) problems.push(`${id} (${where}): horizontal asymptote y = ${curve.q} is off the picture.`)
      }
      // 3. Some of the curve must actually be inside the box. A window that
      //    technically contains the axis but none of the curve draws nothing.
      let visible = 0
      for (let i = 0; i <= 100; i += 1) {
        const x = x0 + ((x1 - x0) * i) / 100
        const y = evaluateCurve(curve, x)
        if (y !== null && Number.isFinite(y) && y >= y0 && y <= y1) visible += 1
      }
      if (visible < 8) {
        problems.push(`${id} (${where}): only ${visible} of 101 sampled points are on screen -- the curve is barely drawn.`)
      }
    }
  }
}

if (problems.length) {
  console.error(`${problems.length} graph problem(s):\n`)
  for (const p of problems.slice(0, 40)) console.error('  ' + p)
  if (problems.length > 40) console.error(`  ... and ${problems.length - 40} more`)
  process.exit(1)
}

console.log(
  `${checked} plotted graph(s) checked: every curve matches an equation its own question states ` +
    `(${matchedToText} curve matches), the x-axis is on screen in all of them, and every turning point, ` +
    `root and asymptote is inside its window.`,
)
// A sanity check on the checker itself: the evaluator it leans on must work.
if (evalExpr(normalise('−x² + 6x − 5'), 3) !== 4) {
  console.error('The expression evaluator is wrong; the checks above mean nothing.')
  process.exit(1)
}
