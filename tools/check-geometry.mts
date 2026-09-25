/**
 * Every geometry sketch must agree with its own labels and with its question.
 *
 * The sketches are built from the question's words by
 * src/lib/geometryDiagrams.ts. This reads each one back:
 *
 * 1. LABELS COME FROM THE QUESTION. Every number printed on a sketch -- a
 *    length, an angle, a scale -- has to be a number the question states. A
 *    sketch may not add information, only draw what is given; the one thing it
 *    adds is "?" on what is asked.
 *
 * 2. DRAWN TO ITS LABELS. For sketches marked `toScale`, every labelled angle is
 *    measured off the coordinates and must match its label to within half a
 *    degree, every right-angle mark must be 90°, and every labelled length must
 *    be in the same proportion to its drawn length as every other. A triangle
 *    whose 35° angle is drawn at 50° teaches the eye something false.
 *
 * 3. WELL FORMED. Every segment and angle names points that exist.
 */
import { questions } from '../src/data/questions'
import { papersForSubject } from '../src/data/papers'
import { geometryDiagramFor } from '../src/lib/geometryDiagrams'
import { physicsDiagramsFor } from '../src/lib/physicsDiagrams'
import { lifeSciDiagramsFor } from '../src/lib/lifeSciDiagrams'
import type { Question, SceneSpec } from '../src/types'

const items: Question[] = [...questions]
const seen = new Set(items.map((q) => q.id))
for (const s of ['mat-lit', 'mathematics', 'physical-sciences', 'life-sciences'] as const)
  for (const p of await papersForSubject(s)) for (const sec of p.sections) for (const it of sec.items) if (!seen.has(it.id)) (seen.add(it.id), items.push(it))

const problems: string[] = []
const fail = (id: string, msg: string) => problems.push(`${id}: ${msg}`)

const numbersIn = (text: string) =>
  [...text.replace(/(\d) (\d{3})\b/g, '$1$2').matchAll(/\d+(?:[.,]\d+)?/g)].map((m) => Number(m[0].replace(',', '.')))
const labelNumber = (label: string) => {
  const m = label.replace(/(\d) (\d{3})\b/g, '$1$2').match(/\d+(?:[.,]\d+)?/)
  return m ? Number(m[0].replace(',', '.')) : null
}

function check(id: string, text: string, s: SceneSpec) {
  const P = new Map(s.points.map((p) => [p.id, p]))
  const stated = numbersIn(text)
  const labels = [
    ...(s.segments ?? []).map((g) => g.label),
    ...(s.angles ?? []).map((a) => a.label),
    ...(s.notes ?? []),
    ...(s.texts ?? []).map((x) => x.text),
    ...(s.discs ?? []).map((x) => x.text),
  ].filter((l): l is string => !!l)
  for (const l of labels) {
    for (const n of numbersIn(l)) if (!stated.some((v) => Math.abs(v - n) < 1e-9)) fail(id, `"${l}" on the sketch is not a number the question states`)
  }
  for (const g of s.segments ?? []) if (!P.has(g.a) || !P.has(g.b)) fail(id, `segment ${g.a}${g.b} names a missing point`)
  for (const a of s.angles ?? []) if (!P.has(a.at) || !P.has(a.a) || !P.has(a.b)) fail(id, `angle at ${a.at} names a missing point`)
  for (const c of s.circles ?? []) if (!P.has(c.c)) fail(id, `circle centre ${c.c} is missing`)
  if (problems.length && problems[problems.length - 1].startsWith(id + ': ') && /missing/.test(problems[problems.length - 1])) return

  if (!s.toScale) return
  for (const a of s.angles ?? []) {
    const o = P.get(a.at)!
    const p = P.get(a.a)!
    const q = P.get(a.b)!
    const v1 = [p.x - o.x, p.y - o.y]
    const v2 = [q.x - o.x, q.y - o.y]
    const measured = (Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(v1[0], v1[1]) * Math.hypot(v2[0], v2[1]))) * 180) / Math.PI
    const want = a.right ? 90 : a.label && /°/.test(a.label) ? labelNumber(a.label) : null
    if (want !== null && Math.abs(measured - want) > 0.5) fail(id, `the angle at ${a.at} is labelled ${want}° but drawn at ${measured.toFixed(1)}°`)
  }
  const ratios = (s.segments ?? [])
    .filter((g) => g.label && labelNumber(g.label) !== null && !/[x?]/.test(g.label))
    .map((g) => {
      const a = P.get(g.a)!
      const b = P.get(g.b)!
      return { g, r: labelNumber(g.label!)! / Math.hypot(b.x - a.x, b.y - a.y) }
    })
  // A circle's radius is drawn as a segment too, so it joins the same scale.
  if (ratios.length > 1) {
    const base = ratios[0].r
    for (const { g, r } of ratios) if (Math.abs(r / base - 1) > 0.015) fail(id, `${g.a}${g.b} (${g.label}) is out of proportion with ${ratios[0].g.a}${ratios[0].g.b} (${ratios[0].g.label})`)
  }
}

let drawn = 0
for (const q of items) {
  const text = [q.context ?? '', q.prompt].join(' ')
  const s = geometryDiagramFor(q)
  if (s) {
    drawn++
    check(q.id, text, s)
  }
  const phys = physicsDiagramsFor(q)
  const ls = lifeSciDiagramsFor(q)
  phys.prompt.push(...ls.prompt)
  phys.answer.push(...ls.answer)
  for (const p of phys.prompt) {
    drawn++
    check(q.id, text, p)
  }
  // A figure shown with the answer may use the answer's numbers too.
  for (const p of phys.answer) {
    drawn++
    check(q.id, [text, q.answer, q.explanation ?? ''].join(' '), p)
  }
}
console.log(`${drawn} geometry sketches checked.`)
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n${problems.slice(0, 60).join('\n')}`)
  process.exit(1)
}
