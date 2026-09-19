/**
 * Grade 10 Analytical Geometry.
 *
 * WHY THIS FILE EXISTS. CAPS puts analytical geometry in Grade 10 and the app
 * did not have it. The topic was registered for Grades 11 and 12 only, so the
 * Grade 10 teaching plan carried a Term 3 week with no topic behind it and a
 * Grade 10 teacher had nothing to set. That gap is what this closes.
 *
 * WHAT GRADE 10 ACTUALLY COVERS, and what it does not. CAPS gives Grade 10
 * three formulae derived from two points and nothing else: the distance
 * between them, the gradient of the segment joining them (which brings in the
 * conditions for parallel and perpendicular lines), and the midpoint of that
 * segment. The equation of a straight line and the angle of inclination are
 * Grade 11; circles are Grade 12. So nothing here asks for y = mx + c, for θ,
 * or for the equation of a circle, however naturally those follow -- a Grade 10
 * paper that asked for them would be out of syllabus. What Grade 10 does do
 * with the three formulae is prove things about figures: that a triangle is
 * right-angled, that a quadrilateral is a parallelogram, that three points lie
 * on one line.
 *
 * WHY THE ANSWERS ARE COMPUTED AND NOT TYPED. As with the taxation and
 * perimeter sets: every distance, gradient and midpoint below is worked out
 * from the coordinates declared once, so a question and its answer cannot
 * disagree. Where a distance is irrational the surd is simplified by the same
 * code that computes it, and where a gradient is a fraction it is reduced by
 * the same code, so the answer is in the form a marker expects.
 */
import type { Question } from '@/types'

/** A point, written the way a South African paper writes it: A(−3 ; 4). */
interface Pt {
  name: string
  x: number
  y: number
}

const P = (name: string, x: number, y: number): Pt => ({ name, x, y })

/** The real minus sign, U+2212, which is what the rest of the corpus uses. */
const n = (v: number): string => {
  const rounded = Math.round(v * 100) / 100
  return String(rounded).replace('-', '−').replace('.', ',')
}

const pt = (p: Pt) => `${p.name}(${n(p.x)} ; ${n(p.y)})`
const coords = (x: number, y: number) => `(${n(x)} ; ${n(y)})`

const dx = (a: Pt, b: Pt) => b.x - a.x
const dy = (a: Pt, b: Pt) => b.y - a.y
const distSquared = (a: Pt, b: Pt) => dx(a, b) ** 2 + dy(a, b) ** 2
const dist = (a: Pt, b: Pt) => Math.sqrt(distSquared(a, b))

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))

/** A gradient as an exact value: an integer, or a reduced fraction. */
const gradient = (a: Pt, b: Pt): string => {
  const rise = dy(a, b)
  const run = dx(a, b)
  if (run === 0) return 'undefined'
  if (rise % run === 0) return n(rise / run)
  const g = gcd(rise, run)
  const num = rise / g
  const den = run / g
  return den < 0 ? `${n(-num)}/${n(-den)}` : `${n(num)}/${n(den)}`
}

/** √k with the largest square factor taken outside, e.g. √52 becomes 2√13. */
const surd = (k: number): string => {
  if (Number.isInteger(Math.sqrt(k))) return n(Math.sqrt(k))
  let outside = 1
  let inside = k
  for (let f = 2; f * f <= inside; f++) {
    while (inside % (f * f) === 0) {
      outside *= f
      inside /= f * f
    }
  }
  return outside === 1 ? `√${inside}` : `${outside}√${inside}`
}

/** A value as it appears after a + or a − sign: −3 has to become (−3) to read. */
const term = (v: number) => (v < 0 ? `(${n(v)})` : n(v))

/** The substitution line a marker wants to see, with the subtraction shown. */
const sub = (a: Pt, b: Pt) => `(${n(b.x)} − ${term(a.x)})² + (${n(b.y)} − ${term(a.y)})²`

/** An exact gradient written straight from a rise and a run. */
const ratio = (rise: number, run: number) => gradient(P('', 0, 0), P('', run, rise))

const out: Question[] = []
const base = { topicId: 'math-analytical-geometry', grade: 10 } as const

/* ===================================================================== */
/* Distance between two points                                           */
/* ===================================================================== */

for (const [id, a, b, level, marks] of [
  ['dist-basic', P('A', 2, 3), P('B', 10, 9), 2, 3],
  ['dist-negatives', P('P', -4, 1), P('Q', 1, 13), 2, 3],
  ['dist-origin', P('O', 0, 0), P('T', -8, 15), 2, 3],
] as const) {
  const d = dist(a, b)
  out.push({
    ...base,
    id: `ag10-${id}`,
    difficulty: 'Easy',
    cognitiveLevel: level,
    marks,
    prompt: `Calculate the distance between ${pt(a)} and ${pt(b)}.`,
    answer: `d = √[${sub(a, b)}] = √[${n(dx(a, b) ** 2)} + ${n(dy(a, b) ** 2)}] = √${n(distSquared(a, b))} = ${n(d)} units`,
    explanation:
      'The distance formula is Pythagoras written in coordinates: the horizontal gap is the difference in the x-values, the vertical gap is the difference in the y-values, and the distance between the points is the hypotenuse of the right-angled triangle they make. Both differences are squared, so it makes no difference which point is called the first one — squaring removes the sign.',
    memo: [
      { code: 'M', marks: 1, text: 'Correct substitution into the distance formula' },
      { code: 'M', marks: 1, text: `√${n(distSquared(a, b))}` },
      { code: 'A', marks: 1, text: `${n(d)} units` },
    ],
  })
}

{
  const a = P('M', -3, 2)
  const b = P('N', 1, 8)
  /** The largest perfect square dividing the squared distance, named for the explanation. */
  const square = (() => {
    let best = 1
    for (let f = 2; f * f <= distSquared(a, b); f++) if (distSquared(a, b) % (f * f) === 0) best = f * f
    return best
  })()
  out.push({
    ...base,
    id: 'ag10-dist-surd',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `Calculate the distance between ${pt(a)} and ${pt(b)}. Leave your answer in simplest surd form.`,
    answer: `d = √[${sub(a, b)}] = √[${n(dx(a, b) ** 2)} + ${n(dy(a, b) ** 2)}] = √${n(distSquared(a, b))} = ${surd(distSquared(a, b))} units`,
    explanation: `Most distances are not whole numbers, and "leave in surd form" means do not reach for the calculator. √${n(distSquared(a, b))} is simplified by finding the largest perfect square that divides ${n(distSquared(a, b))} — here ${n(square)}, since ${n(distSquared(a, b))} = ${n(square)} × ${n(distSquared(a, b) / square)} — and taking its square root outside the sign. The decimal ${n(dist(a, b))} is an approximation; the surd is exact, and in a later grade it is the surd that carries through the next line of working without rounding error.`,
    memo: [
      { code: 'M', marks: 1, text: 'Correct substitution into the distance formula' },
      { code: 'A', marks: 1, text: `√${n(distSquared(a, b))}` },
      { code: 'M', marks: 1, text: 'Largest square factor taken out' },
      { code: 'A', marks: 1, text: `${surd(distSquared(a, b))} units` },
    ],
  })
}

{
  // Two answers, because squaring loses the sign. That is the whole question.
  const a = P('A', 1, 3)
  const bx = 7
  const d = 10
  const run = bx - a.x
  const rise = Math.sqrt(d ** 2 - run ** 2)
  const k1 = a.y + rise
  const k2 = a.y - rise
  out.push({
    ...base,
    id: 'ag10-dist-find-k',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `The distance between ${pt(a)} and B(${n(bx)} ; k) is ${n(d)} units. Calculate the two possible values of k.`,
    answer: `${n(d)}² = (${n(bx)} − ${n(a.x)})² + (k − ${n(a.y)})², so ${n(d ** 2)} = ${n(run ** 2)} + (k − ${n(a.y)})². Then (k − ${n(a.y)})² = ${n(d ** 2 - run ** 2)}, so k − ${n(a.y)} = ${n(rise)} or k − ${n(a.y)} = ${n(-rise)}. Therefore k = ${n(k1)} or k = ${n(k2)}.`,
    explanation: `Running the distance formula backwards means squaring both sides to clear the root, which is where the second answer comes from: (k − ${n(a.y)})² = ${n(d ** 2 - run ** 2)} has two solutions, not one, because squaring a negative gives the same result as squaring its positive. Geometrically both are real: B can sit ${n(rise)} units above A's height or ${n(rise)} units below it, and either position is exactly ${n(d)} units from A. Giving only the positive root loses a mark, and it is the commonest loss in this question.`,
    memo: [
      { code: 'M', marks: 1, text: 'Distance formula set equal to the given distance and squared' },
      { code: 'M', marks: 1, text: `(k − ${n(a.y)})² = ${n(d ** 2 - run ** 2)}` },
      { code: 'M', marks: 1, text: 'Both square roots taken' },
      { code: 'A', marks: 1, text: `k = ${n(k1)}` },
      { code: 'A', marks: 1, text: `k = ${n(k2)}` },
    ],
  })
}

{
  const a = P('A', 0, 0)
  const b = P('B', 6, 0)
  const c = P('C', 3, 4)
  const ab = dist(a, b)
  const ac = dist(a, c)
  const bc = dist(b, c)
  out.push({
    ...base,
    id: 'ag10-dist-isosceles',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `Triangle ABC has vertices ${pt(a)}, ${pt(b)} and ${pt(c)}. Calculate the length of each side and hence show that the triangle is isosceles.`,
    answer: `AB = √[${sub(a, b)}] = √${n(distSquared(a, b))} = ${n(ab)} units. AC = √[${sub(a, c)}] = √${n(distSquared(a, c))} = ${n(ac)} units. BC = √[${sub(b, c)}] = √${n(distSquared(b, c))} = ${n(bc)} units. AC = BC = ${n(ac)} units, so two sides are equal and triangle ABC is isosceles.`,
    explanation:
      'Isosceles means two equal sides, so the proof is three distance calculations and one comparison. The conclusion has to be stated, not left for the marker to notice: the final mark is for saying WHICH two sides are equal and naming the property that follows. Working out all three sides rather than the two you expect to be equal is worth the extra line, because it also shows the third side is different and so rules out equilateral.',
    memo: [
      { code: 'M', marks: 1, text: 'Distance formula used with correct substitution' },
      { code: 'A', marks: 1, text: `AB = ${n(ab)}` },
      { code: 'A', marks: 1, text: `AC = ${n(ac)}` },
      { code: 'A', marks: 1, text: `BC = ${n(bc)}` },
      { code: 'S', marks: 1, text: 'AC = BC stated, therefore isosceles' },
    ],
  })
}

{
  const a = P('A', 0, 0)
  const b = P('B', 6, 0)
  const c = P('C', 3, 4)
  const perim = dist(a, b) + dist(b, c) + dist(a, c)
  out.push({
    ...base,
    id: 'ag10-dist-perimeter',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `Calculate the perimeter of triangle ABC with vertices ${pt(a)}, ${pt(b)} and ${pt(c)}.`,
    answer: `AB = ${n(dist(a, b))}, BC = ${n(dist(b, c))} and AC = ${n(dist(a, c))} units. Perimeter = ${n(dist(a, b))} + ${n(dist(b, c))} + ${n(dist(a, c))} = ${n(perim)} units.`,
    explanation:
      'Perimeter on the Cartesian plane is the same idea as perimeter anywhere else — the distance all the way around — except that each side has to be calculated from its two endpoints first. There are always as many distance calculations as the figure has sides, so a quadrilateral needs four, and forgetting the side that closes the figure back to the starting vertex is the usual slip.',
    memo: [
      { code: 'M', marks: 1, text: 'Distance formula applied to each side' },
      { code: 'A', marks: 1, text: `AB = ${n(dist(a, b))}` },
      { code: 'A', marks: 1, text: `BC = ${n(dist(b, c))} and AC = ${n(dist(a, c))}` },
      { code: 'CA', marks: 1, text: `Perimeter = ${n(perim)} units` },
    ],
  })
}

/* ===================================================================== */
/* Midpoint                                                              */
/* ===================================================================== */

for (const [id, a, b, marks] of [
  ['mid-basic', P('A', 3, 7), P('B', 11, 1), 2],
  ['mid-negatives', P('P', -5, 2), P('Q', 3, -8), 2],
] as const) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  out.push({
    ...base,
    id: `ag10-${id}`,
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks,
    prompt: `Calculate the coordinates of the midpoint of ${pt(a)} and ${pt(b)}.`,
    answer: `M = [(${n(a.x)} + ${term(b.x)}) ÷ 2 ; (${n(a.y)} + ${term(b.y)}) ÷ 2] = ${coords(mx, my)}`,
    explanation:
      'The midpoint is the average of the two x-values and the average of the two y-values, handled completely separately. Nothing is subtracted here — that is the distance and gradient formulae — so a midpoint answer that came out near zero when both points are far from the origin is a sign that a subtraction has crept in.',
    memo: [
      { code: 'M', marks: 1, text: 'Averages of the x-values and of the y-values' },
      { code: 'A', marks: 1, text: `${coords(mx, my)}` },
    ],
  })
}

{
  const a = P('A', -2, 5)
  const b = P('B', 3, 6)
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  out.push({
    ...base,
    id: 'ag10-mid-halves',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `Calculate the coordinates of the midpoint of ${pt(a)} and ${pt(b)}.`,
    answer: `M = [(${n(a.x)} + ${term(b.x)}) ÷ 2 ; (${n(a.y)} + ${term(b.y)}) ÷ 2] = [${n(a.x + b.x)} ÷ 2 ; ${n(a.y + b.y)} ÷ 2] = ${coords(mx, my)}`,
    explanation: `Nothing says a midpoint has to have whole-number coordinates, and ${coords(mx, my)} is a perfectly good answer. Rounding it to ${coords(Math.round(mx), Math.round(my))} would put the point off the line joining A and B altogether. Halves are the only fractions that can appear, because the only division is by 2.`,
    memo: [
      { code: 'M', marks: 1, text: `Sums: ${n(a.x + b.x)} and ${n(a.y + b.y)}` },
      { code: 'M', marks: 1, text: 'Each divided by 2' },
      { code: 'A', marks: 1, text: `${coords(mx, my)}` },
    ],
  })
}

{
  const a = P('A', -2, 3)
  const m = P('M', 4, -1)
  const bx = 2 * m.x - a.x
  const by = 2 * m.y - a.y
  out.push({
    ...base,
    id: 'ag10-mid-find-endpoint',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `${pt(m)} is the midpoint of the line segment joining ${pt(a)} and B. Calculate the coordinates of B.`,
    answer: `For the x-values: (${n(a.x)} + x_B) ÷ 2 = ${n(m.x)}, so ${n(a.x)} + x_B = ${n(2 * m.x)} and x_B = ${n(bx)}. For the y-values: (${n(a.y)} + y_B) ÷ 2 = ${n(m.y)}, so ${n(a.y)} + y_B = ${n(2 * m.y)} and y_B = ${n(by)}. B is ${coords(bx, by)}.`,
    explanation:
      'Running the midpoint formula backwards gives two small equations, one in x and one in y, and each is cleared by multiplying by 2 first. There is a shortcut worth knowing once the method is secure: B is as far past M as A is short of it, so doubling the midpoint and subtracting A gives B directly. Both earn full marks, but the two equations are what the memo is written for.',
    memo: [
      { code: 'M', marks: 1, text: `(${n(a.x)} + x_B) ÷ 2 = ${n(m.x)}` },
      { code: 'A', marks: 1, text: `x_B = ${n(bx)}` },
      { code: 'M', marks: 1, text: `(${n(a.y)} + y_B) ÷ 2 = ${n(m.y)}` },
      { code: 'A', marks: 1, text: `y_B = ${n(by)}, so B${coords(bx, by)}` },
    ],
  })
}

{
  const a = P('A', -1, 2)
  const b = P('B', 4, 3)
  const c = P('C', 6, -1)
  const mx = (a.x + c.x) / 2
  const my = (a.y + c.y) / 2
  const dX = 2 * mx - b.x
  const dY = 2 * my - b.y
  out.push({
    ...base,
    id: 'ag10-mid-fourth-vertex',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `ABCD is a parallelogram with ${pt(a)}, ${pt(b)} and ${pt(c)}. Use the fact that the diagonals of a parallelogram bisect each other to calculate the coordinates of D.`,
    answer: `The diagonals are AC and BD, and they bisect each other, so they share a midpoint. Midpoint of AC = [(${n(a.x)} + ${term(c.x)}) ÷ 2 ; (${n(a.y)} + ${term(c.y)}) ÷ 2] = ${coords(mx, my)}. This is also the midpoint of BD, so (${n(b.x)} + x_D) ÷ 2 = ${n(mx)} giving x_D = ${n(dX)}, and (${n(b.y)} + y_D) ÷ 2 = ${n(my)} giving y_D = ${n(dY)}. D is ${coords(dX, dY)}.`,
    explanation:
      'The step that makes this work is choosing the right pair of points for the diagonal. In parallelogram ABCD the vertices are named in order around the shape, so the diagonals join opposite vertices — A to C and B to D — not A to B. Taking the midpoint of AB instead is the error that sinks this question, and it is worth marking the four points roughly on a sketch to see which pairs are opposite before starting. Once that is right, the midpoint found from the diagonal you know serves as the midpoint of the one you do not.',
    memo: [
      { code: 'S', marks: 1, text: 'AC and BD identified as the diagonals' },
      { code: 'M', marks: 1, text: 'Midpoint of AC calculated' },
      { code: 'A', marks: 1, text: `${coords(mx, my)}` },
      { code: 'M', marks: 1, text: 'Set equal to the midpoint of BD' },
      { code: 'CA', marks: 1, text: `D${coords(dX, dY)}` },
    ],
  })
}

/* ===================================================================== */
/* Gradient, parallel and perpendicular lines                            */
/* ===================================================================== */

for (const [id, a, b, note] of [
  ['grad-basic', P('A', 1, -2), P('B', 5, 6), 'A positive gradient means the line rises from left to right.'],
  ['grad-negative', P('P', -3, 7), P('Q', 3, -5), 'A negative gradient means the line falls from left to right.'],
  [
    'grad-fraction',
    P('A', 2, 1),
    P('B', 9, 5),
    'A gradient is left as a fraction in simplest form unless a decimal is asked for; 4/7 is exact and 0,57 is not.',
  ],
] as const) {
  out.push({
    ...base,
    id: `ag10-${id}`,
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `Calculate the gradient of the line passing through ${pt(a)} and ${pt(b)}.`,
    answer: `m = (y₂ − y₁) ÷ (x₂ − x₁) = (${n(b.y)} − ${n(a.y)}) ÷ (${n(b.x)} − ${n(a.x)}) = ${n(dy(a, b))} ÷ ${n(dx(a, b))} = ${gradient(a, b)}`,
    explanation: `Gradient is rise over run: the change in y on top, the change in x underneath. Getting them the wrong way up gives the reciprocal, which is a different line entirely. ${note}`,
    memo: [
      { code: 'M', marks: 1, text: 'Correct substitution, y-difference over x-difference' },
      { code: 'M', marks: 1, text: `${n(dy(a, b))} ÷ ${n(dx(a, b))}` },
      { code: 'A', marks: 1, text: `m = ${gradient(a, b)}` },
    ],
  })
}

{
  const h1 = P('A', -4, 3)
  const h2 = P('B', 6, 3)
  const v1 = P('C', 5, -1)
  const v2 = P('D', 5, 8)
  out.push({
    ...base,
    id: 'ag10-grad-special-lines',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Calculate the gradient of the line through ${pt(h1)} and ${pt(h2)}, and the gradient of the line through ${pt(v1)} and ${pt(v2)}. Explain what is different about the second answer.`,
    answer: `Through A and B: m = (${n(h2.y)} − ${n(h1.y)}) ÷ (${n(h2.x)} − ${n(h1.x)}) = 0 ÷ ${n(dx(h1, h2))} = 0. Through C and D: m = (${n(v2.y)} − ${n(v1.y)}) ÷ (${n(v2.x)} − ${n(v1.x)}) = ${n(dy(v1, v2))} ÷ 0, which is undefined. A and B have the same y-value, so the line is horizontal and there is no rise: the gradient is zero. C and D have the same x-value, so the line is vertical and there is no run: division by zero is not defined, so the line has no gradient at all.`,
    explanation:
      'These two cases are marked strictly and are constantly confused. A horizontal line has gradient ZERO — a real number, and a perfectly ordinary answer. A vertical line has NO gradient — "undefined" or "does not exist", never "zero" and never "infinity". The test is which difference lands on the bottom of the fraction: a zero on top is fine, a zero underneath is not.',
    memo: [
      { code: 'M', marks: 1, text: 'Both substitutions shown' },
      { code: 'A', marks: 1, text: 'm = 0 for AB' },
      { code: 'A', marks: 1, text: 'Gradient of CD undefined' },
      { code: 'J', marks: 1, text: 'Zero rise gives zero; zero run gives division by zero, which is undefined' },
    ],
  })
}

{
  const a = P('A', -2, 1)
  const b = P('B', 2, 7)
  const c = P('C', 0, -3)
  const d = P('D', 4, 3)
  out.push({
    ...base,
    id: 'ag10-grad-parallel',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Show that the line through ${pt(a)} and ${pt(b)} is parallel to the line through ${pt(c)} and ${pt(d)}.`,
    answer: `m_AB = (${n(b.y)} − ${n(a.y)}) ÷ (${n(b.x)} − ${n(a.x)}) = ${n(dy(a, b))} ÷ ${n(dx(a, b))} = ${gradient(a, b)}. m_CD = (${n(d.y)} − ${n(c.y)}) ÷ (${n(d.x)} − ${n(c.x)}) = ${n(dy(c, d))} ÷ ${n(dx(c, d))} = ${gradient(c, d)}. m_AB = m_CD, and since the lines have equal gradients they are parallel.`,
    explanation:
      'Parallel lines have equal gradients — that is the entire test, and it is a two-way statement: equal gradients prove parallel, and parallel guarantees equal gradients. The final sentence is worth a mark on its own. "m_AB = m_CD" is a calculation; "therefore AB ∥ CD" is the conclusion the question asked for, and a solution that stops at the two gradients has not shown anything yet.',
    memo: [
      { code: 'M', marks: 1, text: 'Gradient of AB' },
      { code: 'A', marks: 1, text: `m_AB = ${gradient(a, b)}` },
      { code: 'A', marks: 1, text: `m_CD = ${gradient(c, d)}` },
      { code: 'S', marks: 1, text: 'Equal gradients stated, therefore parallel' },
    ],
  })
}

{
  const a = P('A', 1, 2)
  const b = P('B', 4, 6)
  const c = P('C', 2, 9)
  const dyCD = 3 - 9
  const mAB = dy(a, b) / dx(a, b)
  const mCD = -1 / mAB
  const k = c.x + dyCD / mCD
  out.push({
    ...base,
    id: 'ag10-grad-perpendicular-k',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `The line through ${pt(a)} and ${pt(b)} is perpendicular to the line through ${pt(c)} and D(k ; 3). Calculate the value of k.`,
    answer: `m_AB = (${n(b.y)} − ${n(a.y)}) ÷ (${n(b.x)} − ${n(a.x)}) = ${gradient(a, b)}. For perpendicular lines m_AB × m_CD = −1, so m_CD = −1 ÷ ${gradient(a, b)} = ${ratio(-3, 4)}. Then (3 − ${n(c.y)}) ÷ (k − ${n(c.x)}) = ${ratio(-3, 4)}, so ${n(dyCD)} ÷ (k − ${n(c.x)}) = ${ratio(-3, 4)}. Cross-multiplying: ${n(dyCD)} × 4 = ${n(-3)}(k − ${n(c.x)}), so ${n(dyCD * 4)} = ${n(-3)}k + ${n(3 * c.x)} and k = ${n(k)}.`,
    explanation:
      'Perpendicular gradients multiply to −1, so one is the negative reciprocal of the other: turn the fraction upside down and change the sign. Both steps are needed. Flipping without changing the sign, or changing the sign without flipping, each produces a line that is not perpendicular, and each is a common way to lose all five marks while writing something that looks like working.',
    memo: [
      { code: 'M', marks: 1, text: `m_AB = ${gradient(a, b)}` },
      { code: 'S', marks: 1, text: 'm₁ × m₂ = −1 used' },
      { code: 'A', marks: 1, text: `m_CD = ${ratio(-3, 4)}` },
      { code: 'M', marks: 1, text: 'Gradient of CD written in terms of k and set equal' },
      { code: 'CA', marks: 1, text: `k = ${n(k)}` },
    ],
  })
}

{
  const a = P('A', -3, -4)
  const b = P('B', 0, 2)
  const c = P('C', 2, 6)
  out.push({
    ...base,
    id: 'ag10-grad-collinear',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Show that the points ${pt(a)}, ${pt(b)} and ${pt(c)} are collinear.`,
    answer: `m_AB = (${n(b.y)} − ${n(a.y)}) ÷ (${n(b.x)} − ${n(a.x)}) = ${n(dy(a, b))} ÷ ${n(dx(a, b))} = ${gradient(a, b)}. m_BC = (${n(c.y)} − ${n(b.y)}) ÷ (${n(c.x)} − ${n(b.x)}) = ${n(dy(b, c))} ÷ ${n(dx(b, c))} = ${gradient(b, c)}. The two gradients are equal and the segments share the point B, so A, B and C all lie on one straight line: they are collinear.`,
    explanation:
      'Collinear means "on one line", and equal gradients alone do not prove it — two parallel segments somewhere else on the plane also have equal gradients. What finishes the argument is the SHARED POINT: AB and BC have the same gradient and both pass through B, so they are not merely parallel, they are the same line. Saying so is the mark most often dropped here.',
    memo: [
      { code: 'M', marks: 1, text: 'Gradients of two of the three segments' },
      { code: 'A', marks: 1, text: `m_AB = ${gradient(a, b)}` },
      { code: 'A', marks: 1, text: `m_BC = ${gradient(b, c)}` },
      { code: 'S', marks: 1, text: 'Equal gradients AND a common point B stated, therefore collinear' },
    ],
  })
}

{
  const a = P('A', 2, 3)
  const b = P('B', 6, 11)
  out.push({
    ...base,
    id: 'ag10-grad-order',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: `A learner calculating the gradient of the line through ${pt(a)} and ${pt(b)} is unsure which point to call the first one. Calculate the gradient both ways round and explain why the order cannot matter, then explain why the order DOES matter within a single calculation.`,
    answer: `Taking A first: m = (${n(b.y)} − ${n(a.y)}) ÷ (${n(b.x)} − ${n(a.x)}) = ${n(dy(a, b))} ÷ ${n(dx(a, b))} = ${gradient(a, b)}. Taking B first: m = (${n(a.y)} − ${n(b.y)}) ÷ (${n(a.x)} − ${n(b.x)}) = ${n(-dy(a, b))} ÷ ${n(-dx(a, b))} = ${gradient(b, a)}. The answers are the same. Swapping the points changes the sign of the top and the sign of the bottom, and a negative divided by a negative is positive, so the two sign changes cancel. What does matter is being consistent WITHIN the calculation: taking y from one order and x from the other gives ${n(dy(a, b))} ÷ ${n(-dx(a, b))} = ${ratio(8, -4)}, the negative of the true gradient, which describes a line sloping the other way.`,
    explanation:
      'The reason to understand this rather than memorise a rule is that it tells you exactly what the danger is. The choice of starting point is free; mixing the two choices halfway through is not. The mixed version is not a small error either — it reverses the slope of the line, so a line that rises is reported as falling. Writing the two coordinates one above the other before subtracting makes the mix impossible to commit by accident.',
    memo: [
      { code: 'A', marks: 1, text: `${gradient(a, b)} taking A first` },
      { code: 'A', marks: 1, text: `${gradient(b, a)} taking B first — the same` },
      { code: 'J', marks: 1, text: 'Both differences change sign, and the signs cancel in the division' },
      { code: 'J', marks: 1, text: 'Mixing the orders negates the gradient, reversing the slope' },
    ],
  })
}

/* ===================================================================== */
/* Putting the three formulae to work on a figure                        */
/* ===================================================================== */

{
  const a = P('A', -2, 1)
  const b = P('B', 2, 4)
  const c = P('C', 5, 0)
  out.push({
    ...base,
    id: 'ag10-figure-right-angled',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 6,
    prompt: `Triangle ABC has vertices ${pt(a)}, ${pt(b)} and ${pt(c)}. Show that AB is perpendicular to BC, so that the triangle is right-angled at B, and show that the triangle is also isosceles.`,
    answer: `m_AB = (${n(b.y)} − ${n(a.y)}) ÷ (${n(b.x)} − ${n(a.x)}) = ${gradient(a, b)} and m_BC = (${n(c.y)} − ${n(b.y)}) ÷ (${n(c.x)} − ${n(b.x)}) = ${gradient(b, c)}. Their product is ${gradient(a, b)} × ${gradient(b, c)} = −1, so AB ⊥ BC and the angle at B is a right angle. For the sides: AB = √[${sub(a, b)}] = √${n(distSquared(a, b))} = ${n(dist(a, b))} units and BC = √[${sub(b, c)}] = √${n(distSquared(b, c))} = ${n(dist(b, c))} units. AB = BC, so the triangle is isosceles as well — a right-angled isosceles triangle, with the right angle between the two equal sides.`,
    explanation:
      'Two different tools answer the two halves, and choosing the wrong one for each half is what makes this question hard. An ANGLE is a question about gradients, so a right angle is proved by m₁ × m₂ = −1. A SIDE is a question about distances, so equal sides are proved by the distance formula. There is a second route to the right angle — show AB² + BC² = AC² and quote the converse of Pythagoras — and it is worth full marks, but it takes three distance calculations where the gradient method takes two gradients. Note also that the right angle is at B because B is the vertex the two perpendicular sides share; stating the right angle at the wrong vertex loses the mark even when the arithmetic is right.',
    memo: [
      { code: 'M', marks: 1, text: 'Gradients of AB and BC' },
      { code: 'A', marks: 1, text: `m_AB = ${gradient(a, b)}, m_BC = ${gradient(b, c)}` },
      { code: 'S', marks: 1, text: 'Product = −1, therefore perpendicular, right angle at B' },
      { code: 'M', marks: 1, text: 'Distance formula for AB and BC' },
      { code: 'A', marks: 1, text: `AB = BC = ${n(dist(a, b))} units` },
      { code: 'S', marks: 1, text: 'Therefore isosceles' },
    ],
  })
}

{
  const a = P('A', -1, 2)
  const b = P('B', 4, 3)
  const c = P('C', 6, -1)
  const d = P('D', 1, -2)
  out.push({
    ...base,
    id: 'ag10-figure-parallelogram',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 6,
    prompt: `Quadrilateral ABCD has vertices ${pt(a)}, ${pt(b)}, ${pt(c)} and ${pt(d)}. Show that ABCD is a parallelogram by proving that both pairs of opposite sides are parallel.`,
    answer: `m_AB = (${n(b.y)} − ${n(a.y)}) ÷ (${n(b.x)} − ${n(a.x)}) = ${gradient(a, b)} and m_DC = (${n(c.y)} − ${n(d.y)}) ÷ (${n(c.x)} − ${n(d.x)}) = ${gradient(d, c)}, so AB ∥ DC. m_AD = (${n(d.y)} − ${n(a.y)}) ÷ (${n(d.x)} − ${n(a.x)}) = ${gradient(a, d)} and m_BC = (${n(c.y)} − ${n(b.y)}) ÷ (${n(c.x)} − ${n(b.x)}) = ${gradient(b, c)}, so AD ∥ BC. Both pairs of opposite sides are parallel, therefore ABCD is a parallelogram.`,
    explanation:
      'The vertices of a quadrilateral are named in order around the shape, so the opposite sides of ABCD are AB with DC, and AD with BC — never AB with BC, which are adjacent and meet at a corner. Four gradients are needed, in two matching pairs, and the conclusion must name the property being used: both pairs of opposite sides parallel is the definition of a parallelogram. There are other valid proofs — one pair of opposite sides both equal and parallel, or diagonals that bisect each other — and any one of them is enough on its own; what is not enough is proving a single pair parallel, which is true of a trapezium too.',
    memo: [
      { code: 'M', marks: 1, text: 'Gradients of AB and DC' },
      { code: 'A', marks: 1, text: `both ${gradient(a, b)}, so AB ∥ DC` },
      { code: 'M', marks: 1, text: 'Gradients of AD and BC' },
      { code: 'A', marks: 1, text: `both ${gradient(a, d)}, so AD ∥ BC` },
      { code: 'S', marks: 1, text: 'Both pairs of opposite sides parallel' },
      { code: 'S', marks: 1, text: 'Therefore ABCD is a parallelogram' },
    ],
  })
}

{
  const a = P('A', 0, 0)
  const b = P('B', 4, 3)
  const c = P('C', 8, 0)
  const d = P('D', 4, -3)
  out.push({
    ...base,
    id: 'ag10-figure-rhombus',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `Quadrilateral ABCD has vertices ${pt(a)}, ${pt(b)}, ${pt(c)} and ${pt(d)}. Calculate the length of each side and hence show that ABCD is a rhombus.`,
    answer: `AB = √[${sub(a, b)}] = √${n(distSquared(a, b))} = ${n(dist(a, b))} units. BC = √[${sub(b, c)}] = √${n(distSquared(b, c))} = ${n(dist(b, c))} units. CD = √[${sub(c, d)}] = √${n(distSquared(c, d))} = ${n(dist(c, d))} units. DA = √[${sub(d, a)}] = √${n(distSquared(d, a))} = ${n(dist(d, a))} units. All four sides are ${n(dist(a, b))} units, and a quadrilateral with four equal sides is a rhombus.`,
    explanation: `Four equal sides is the definition of a rhombus, so four distance calculations settle it — and all four are needed, because two adjacent equal sides prove nothing at all. It is worth noticing what this figure is NOT: the diagonals here are ${n(dist(a, c))} units and ${n(dist(b, d))} units, so they are unequal, which rules out a square. A square is a rhombus with equal diagonals, so showing four equal sides establishes a rhombus and leaves the square question open until the diagonals are compared.`,
    memo: [
      { code: 'M', marks: 1, text: 'Distance formula applied to all four sides' },
      { code: 'A', marks: 1, text: `AB = ${n(dist(a, b))}` },
      { code: 'A', marks: 1, text: `BC = ${n(dist(b, c))}` },
      { code: 'A', marks: 1, text: `CD = ${n(dist(c, d))} and DA = ${n(dist(d, a))}` },
      { code: 'S', marks: 1, text: 'Four equal sides, therefore a rhombus' },
    ],
  })
}

/** Everything above, in one list. Exported last so it cannot be read before it is filled. */
export const analyticalGeometryG10: Question[] = out
