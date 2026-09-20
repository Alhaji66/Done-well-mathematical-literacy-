import type { Question } from '@/types'

/**
 * Mathematics content for the sub-topics the coverage report found thin.
 *
 * WHY THESE EIGHT. Four are graph sub-topics that CAPS examines every year and
 * that held almost nothing -- Transformations of graphs had four questions,
 * Stationary points and concavity three, Sketching cubic graphs five, Inverse
 * functions five. The other four are sub-topics that stop or start partway up
 * the grades, each for no curricular reason:
 *
 *   Word problems and setting up equations -- four at Grade 10, one at Grade 11,
 *     none at Grade 12, although every NSC Paper 1 sets one.
 *   Exponential and logarithmic functions -- nothing at Grade 10, where
 *     y = ab^x + q is first taught, long before logarithms arrive in Grade 12.
 *   Tree diagrams and two-way tables -- nothing at Grade 10, where two events
 *     and a two-way table are introduced.
 *   Volume and surface area of solids -- twenty-seven at Grade 10, none at
 *     Grade 11, which is where the effect of multiplying a dimension by a
 *     factor k is examined.
 *
 * EVERY NUMBER IS COMPUTED. The cubics are declared in factored form and their
 * roots, stationary points and concavity are worked out from the coefficients
 * below, so a question and its answer cannot disagree: if a coefficient is
 * edited, the answer moves with it.
 */

/** A number as this corpus writes it: true minus sign, at most two decimals. */
const n = (v: number, dp = 2): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  return String(r).replace('-', '−')
}

/** A coordinate pair, semicolon-separated as an NSC paper writes it. */
const pt = (x: number, y: number): string => `(${n(x)} ; ${n(y)})`

const out: Question[] = []

/* ===================================================================== */
/* Transformations of graphs (Grades 10-12)                              */
/* ===================================================================== */

const fn = (grade: 10 | 11 | 12) => ({ topicId: 'math-functions', grade }) as const

out.push({
  ...fn(10),
  id: 'gap-transform-g10-shift-right',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 3,
  prompt:
    'The graph of f(x) = x² is shifted 3 units to the right to give g. Write down the equation of g and the coordinates of its turning point.',
  answer: 'g(x) = (x − 3)², with turning point (3 ; 0).',
  explanation:
    'A shift to the RIGHT subtracts inside the bracket: replacing x by (x − 3) moves every point 3 units right. This is the step learners most often reverse, because "right" and "minus" feel like opposites. Test it on one point: the turning point of f is at (0 ; 0), and it must end up at (3 ; 0). Putting x = 3 into (x − 3)² gives 0, so (3 ; 0) is on g — the equation checks out. Putting x = 3 into (x + 3)² gives 36, which does not.',
  memo: [
    { code: 'A', marks: 1, text: 'x replaced by (x − 3)' },
    { code: 'A', marks: 1, text: 'g(x) = (x − 3)²' },
    { code: 'A', marks: 1, text: 'turning point (3 ; 0)' },
  ],
})

out.push({
  ...fn(10),
  id: 'gap-transform-g10-reflections',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 4,
  prompt:
    'The point A(2 ; 5) lies on a graph. Write down the coordinates of the image of A after (a) a reflection in the x-axis, and (b) a reflection in the y-axis. State which coordinate changes sign in each case.',
  answer:
    '(a) (2 ; −5): reflecting in the x-axis changes the sign of the y-coordinate. (b) (−2 ; 5): reflecting in the y-axis changes the sign of the x-coordinate.',
  explanation:
    'Reflecting in an AXIS leaves the coordinate measured along that axis alone and reverses the other one. In the x-axis, the point keeps its horizontal position and flips vertically, so x stays 2 and y becomes −5. In the y-axis it keeps its height and flips sideways, so y stays 5 and x becomes −2. The name of the axis tells you what is NOT changing, which is the opposite of what most learners assume.',
  memo: [
    { code: 'A', marks: 1, text: '(2 ; −5)' },
    { code: 'A', marks: 1, text: 'y-coordinate changes sign' },
    { code: 'A', marks: 1, text: '(−2 ; 5)' },
    { code: 'A', marks: 1, text: 'x-coordinate changes sign' },
  ],
})

out.push({
  ...fn(11),
  id: 'gap-transform-g11-two-shifts',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 4,
  prompt:
    'The graph of y = x² − 4 is translated 1 unit to the left and 2 units up. Determine the equation of the new graph in the form y = a(x + p)² + q, and write down its turning point.',
  answer: 'y = (x + 1)² − 2, with turning point (−1 ; −2).',
  explanation:
    'Do the two shifts separately. y = x² − 4 has its turning point at (0 ; −4). One unit LEFT replaces x by (x + 1); two units UP adds 2 to the whole expression, taking the −4 to −2. That gives y = (x + 1)² − 2, and the turning point moves from (0 ; −4) to (−1 ; −2), which is exactly one left and two up — the check that the algebra matched the description.',
  memo: [
    { code: 'M', marks: 1, text: 'x replaced by (x + 1) for the shift left' },
    { code: 'M', marks: 1, text: '−4 + 2 = −2 for the shift up' },
    { code: 'A', marks: 1, text: 'y = (x + 1)² − 2' },
    { code: 'A', marks: 1, text: 'turning point (−1 ; −2)' },
  ],
})

out.push({
  ...fn(11),
  id: 'gap-transform-g11-hyperbola-asymptotes',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 4,
  prompt:
    'The graph of y = 6/x is translated so that its asymptotes become x = 2 and y = −1. Determine the equation of the translated graph, and state the coordinates of the point where it cuts the y-axis.',
  answer: 'y = 6/(x − 2) − 1. At x = 0: y = 6/(−2) − 1 = −3 − 1 = −4, so it cuts the y-axis at (0 ; −4).',
  explanation:
    'The asymptotes of y = a/(x − p) + q are x = p and y = q, so reading them off the required asymptotes gives p = 2 and q = −1 directly. The value of a does not change, because a translation does not stretch the graph. Then the y-intercept is found the way every y-intercept is found, by putting x = 0 — there is no special rule for hyperbolas.',
  memo: [
    { code: 'A', marks: 1, text: 'p = 2 from the vertical asymptote' },
    { code: 'A', marks: 1, text: 'q = −1 from the horizontal asymptote' },
    { code: 'M', marks: 1, text: 'x = 0 substituted' },
    { code: 'A', marks: 1, text: '(0 ; −4)' },
  ],
})

out.push({
  ...fn(12),
  id: 'gap-transform-g12-exp-shift-down',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 4,
  prompt:
    'Given f(x) = 2ˣ. The graph of f is shifted 3 units down to give g. Write down the equation of the asymptote of g, the coordinates of its y-intercept, and state whether g has an x-intercept.',
  answer:
    'The asymptote of g is y = −3. Its y-intercept is at (0 ; −2), since g(0) = 2⁰ − 3 = 1 − 3 = −2. It does have an x-intercept, where 2ˣ = 3.',
  explanation:
    'Subtracting 3 moves the whole graph down 3, and the asymptote moves with it, from y = 0 to y = −3. Everything else about the shape is unchanged. The x-intercept question is the interesting one: f(x) = 2ˣ never reaches zero, so f has no x-intercept, but g is f pushed below the axis, so it must cross. That is the difference a vertical shift makes, and it is what the question is really testing.',
  memo: [
    { code: 'A', marks: 1, text: 'asymptote y = −3' },
    { code: 'M', marks: 1, text: 'g(0) = 2⁰ − 3' },
    { code: 'A', marks: 1, text: 'y-intercept (0 ; −2)' },
    { code: 'A', marks: 1, text: 'yes, it has an x-intercept (the graph now crosses y = 0)' },
  ],
})

out.push({
  ...fn(12),
  id: 'gap-transform-g12-describe',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 4,
  prompt:
    'Describe, in words, the single transformation that takes the graph of y = f(x) to the graph of y = −f(x), and the single transformation that takes it to y = f(−x). Explain why these two are different for f(x) = 2ˣ but the same for f(x) = x².',
  answer:
    'y = −f(x) is a reflection in the x-axis; y = f(−x) is a reflection in the y-axis. For f(x) = 2ˣ they differ: −2ˣ lies entirely below the x-axis, while 2⁻ˣ lies entirely above it and decreases. For f(x) = x² they give the same graph, because x² is symmetrical about the y-axis, so reflecting it in the y-axis leaves it unchanged — but −x² and x² are still different, so only f(−x) = f(x) holds here, not −f(x) = f(x).',
  explanation:
    'The minus OUTSIDE the function negates the output, so every point drops to the other side of the x-axis. The minus INSIDE negates the input, so the graph is read backwards and flips sideways. They agree only when the function is already symmetrical in the relevant way, and x² is an even function, so f(−x) = f(x) and the y-axis reflection does nothing. The careful part of the answer is that this does NOT make −f(x) the same as f(x) — the question rewards noticing that only one of the two reflections is trivial here.',
  memo: [
    { code: 'A', marks: 1, text: 'y = −f(x): reflection in the x-axis' },
    { code: 'A', marks: 1, text: 'y = f(−x): reflection in the y-axis' },
    { code: 'R', marks: 1, text: '2ˣ: −2ˣ is below the axis, 2⁻ˣ is above and decreasing, so they differ' },
    { code: 'R', marks: 1, text: 'x² is even, so f(−x) = f(x); the y-axis reflection leaves it unchanged' },
  ],
})

/* ===================================================================== */
/* Inverse functions (Grade 12)                                          */
/* ===================================================================== */

out.push({
  ...fn(12),
  id: 'gap-inverse-g12-linear',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 4,
  prompt: 'Given f(x) = 3x − 6. Determine the equation of f⁻¹(x), and the coordinates of the point where f and f⁻¹ intersect.',
  answer:
    'Let y = 3x − 6, swap x and y: x = 3y − 6, so 3y = x + 6 and f⁻¹(x) = (x + 6)/3. They intersect where f(x) = x: 3x − 6 = x gives 2x = 6, so x = 3 and the point is (3 ; 3).',
  explanation:
    'The inverse is found by swapping x and y and solving for y again — the swap is what the reflection in the line y = x does algebraically. For the intersection there is a shortcut worth knowing: a function and its inverse are mirror images in y = x, so where they meet, they meet ON that line. Setting f(x) = x is therefore enough, and it is far quicker than solving f(x) = f⁻¹(x) directly.',
  memo: [
    { code: 'M', marks: 1, text: 'x and y interchanged: x = 3y − 6' },
    { code: 'A', marks: 1, text: 'f⁻¹(x) = (x + 6)/3' },
    { code: 'M', marks: 1, text: '3x − 6 = x' },
    { code: 'A', marks: 1, text: '(3 ; 3)' },
  ],
})

out.push({
  ...fn(12),
  id: 'gap-inverse-g12-parabola-restrict',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 5,
  prompt:
    'Given f(x) = x² for x ∈ ℝ. Explain why f⁻¹ is not a function, state a restriction on the domain of f that makes f⁻¹ a function, and write down the equation of f⁻¹ for your restricted domain.',
  answer:
    'For every positive output there are two inputs — f(2) = f(−2) = 4 — so the inverse relation gives two y-values for one x-value and is not a function. Restricting f to x ≥ 0 makes f one-to-one; then f⁻¹(x) = √x for x ≥ 0. (Restricting to x ≤ 0 works equally well and gives f⁻¹(x) = −√x.)',
  explanation:
    'The inverse of a graph is its reflection in y = x, and reflecting a parabola that opens upwards gives a sideways parabola, which fails the vertical line test. The restriction has to cut the graph down to one arm, and the vertex is where the two arms meet, so x ≥ 0 or x ≤ 0 are the natural choices. Whichever arm is kept decides the SIGN of the square root in the answer, and dropping that sign is the commonest way marks are lost here: √x alone is only correct for the right-hand arm.',
  memo: [
    { code: 'R', marks: 1, text: 'two x-values give the same y, e.g. f(2) = f(−2) = 4' },
    { code: 'R', marks: 1, text: 'so the inverse gives two y-values for one x and fails the vertical line test' },
    { code: 'A', marks: 1, text: 'restriction x ≥ 0 (or x ≤ 0)' },
    { code: 'A', marks: 1, text: 'f⁻¹(x) = √x' },
    { code: 'A', marks: 1, text: 'domain of f⁻¹ stated as x ≥ 0' },
  ],
})

out.push({
  ...fn(12),
  id: 'gap-inverse-g12-exponential',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 4,
  prompt:
    'Given f(x) = 3ˣ. Determine the equation of f⁻¹(x) in logarithmic form, write down the domain of f⁻¹, and state the coordinates of the x-intercept of f⁻¹.',
  answer:
    'Swapping gives x = 3ʸ, so f⁻¹(x) = log₃x. Its domain is x > 0. Its x-intercept is where log₃x = 0, which is x = 1, so the point is (1 ; 0).',
  explanation:
    'A logarithm IS an exponent: log₃x is the power 3 must be raised to in order to give x. Swapping x and y in y = 3ˣ therefore lands directly on the log. Every feature of f⁻¹ is the mirror image of a feature of f: f has a y-intercept at (0 ; 1), so f⁻¹ has an x-intercept at (1 ; 0); f has range y > 0, so f⁻¹ has domain x > 0. Reading them off f rather than re-deriving them is both quicker and harder to get wrong.',
  memo: [
    { code: 'M', marks: 1, text: 'x = 3ʸ after interchanging' },
    { code: 'A', marks: 1, text: 'f⁻¹(x) = log₃x' },
    { code: 'A', marks: 1, text: 'domain x > 0' },
    { code: 'A', marks: 1, text: 'x-intercept (1 ; 0)' },
  ],
})

out.push({
  ...fn(12),
  id: 'gap-inverse-g12-point-on-inverse',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 3,
  prompt:
    'The point (4 ; 7) lies on the graph of a one-to-one function f. Write down a point that must lie on f⁻¹, and explain why, without knowing the equation of f.',
  answer:
    '(7 ; 4) lies on f⁻¹. The inverse is the reflection of f in the line y = x, and reflecting in that line interchanges the coordinates of every point, so (4 ; 7) becomes (7 ; 4).',
  explanation:
    'This is worth being able to do instantly, because it is often the fastest route into a harder question. The inverse undoes the function: f takes 4 to 7, so f⁻¹ takes 7 back to 4. No equation is needed, and none is available here. The same idea gives the intercepts — an x-intercept of f is a y-intercept of f⁻¹ and the other way round.',
  memo: [
    { code: 'A', marks: 1, text: '(7 ; 4)' },
    { code: 'R', marks: 1, text: 'f⁻¹ is the reflection of f in the line y = x' },
    { code: 'R', marks: 1, text: 'reflection in y = x interchanges the coordinates' },
  ],
})

/* ===================================================================== */
/* Sketching cubic graphs, and stationary points (Grade 12)              */
/* ===================================================================== */

const calc = { topicId: 'math-calculus', grade: 12 } as const

/**
 * The cubics used below, declared once as coefficients so that every root,
 * stationary point and concavity claim in the questions is computed rather
 * than typed. f(x) = ax³ + bx² + cx + d.
 */
const CUBICS = {
  /** x³ − 6x² + 9x = x(x − 3)² */
  a: { a: 1, b: -6, c: 9, d: 0 },
  /** x³ − 9x² + 24x − 16 = (x − 1)(x − 4)² */
  b: { a: 1, b: -9, c: 24, d: -16 },
  /** x³ + 3x² − 9x − 27 = (x − 3)(x + 3)² */
  c: { a: 1, b: 3, c: -9, d: -27 },
} as const

type Cubic = (typeof CUBICS)[keyof typeof CUBICS]
const f = (k: Cubic, x: number) => k.a * x ** 3 + k.b * x * x + k.c * x + k.d
const f1 = (k: Cubic, x: number) => 3 * k.a * x * x + 2 * k.b * x + k.c
/** The two stationary x-values, smaller first. */
const stationary = (k: Cubic): [number, number] => {
  const disc = Math.sqrt(4 * k.b * k.b - 12 * k.a * k.c)
  return [(-2 * k.b - disc) / (6 * k.a), (-2 * k.b + disc) / (6 * k.a)].sort((p, q) => p - q) as [number, number]
}
/** Where the second derivative is zero: 6ax + 2b = 0. */
const inflectX = (k: Cubic) => (-2 * k.b) / (6 * k.a)

{
  const k = CUBICS.a
  const [s1, s2] = stationary(k)
  out.push({
    ...calc,
    id: 'gap-cubic-g12-sketch-a',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 6,
    prompt:
      'Given f(x) = x³ − 6x² + 9x. Determine the x-intercepts of f, the coordinates of its stationary points, and hence sketch the graph of f.',
    answer:
      `x³ − 6x² + 9x = x(x² − 6x + 9) = x(x − 3)², so the x-intercepts are x = 0 and x = 3, and x = 3 is a double root where the graph touches the axis without crossing. ` +
      `f′(x) = 3x² − 12x + 9 = 3(x − 1)(x − 3), so the stationary points are at x = ${n(s1)} and x = ${n(s2)}: a local maximum at ${pt(s1, f(k, s1))} and a local minimum at ${pt(s2, f(k, s2))}. ` +
      `The graph rises from the bottom left, turns at ${pt(s1, f(k, s1))}, comes down to touch the x-axis at ${pt(s2, f(k, s2))} and rises again.`,
    explanation:
      'Take out the common factor first — x³ − 6x² + 9x has an x in every term, which turns a cubic into a quadratic inside a bracket and avoids any need for the factor theorem. The double root is the feature this question is really about: because (x − 3) appears twice, the graph TOUCHES the x-axis at x = 3 rather than crossing it, and that touching point is also the local minimum. Seeing that the minimum and the double root are the same point is what makes the sketch fall out with no extra work.',
    memo: [
      { code: 'M', marks: 1, text: 'common factor x taken out' },
      { code: 'A', marks: 1, text: 'x(x − 3)², giving x = 0 and x = 3 (double)' },
      { code: 'M', marks: 1, text: 'f′(x) = 3x² − 12x + 9 set equal to 0' },
      { code: 'A', marks: 1, text: `local maximum ${pt(s1, f(k, s1))}` },
      { code: 'A', marks: 1, text: `local minimum ${pt(s2, f(k, s2))}` },
      { code: 'A', marks: 1, text: 'shape correct: touches the axis at x = 3, rises either side' },
    ],
  })
}

{
  const k = CUBICS.b
  const [s1, s2] = stationary(k)
  out.push({
    ...calc,
    id: 'gap-cubic-g12-sketch-b',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    prompt:
      'Given the cubic function f(x) = x³ − 9x² + 24x − 16. Show that x = 1 is a root, factorise f(x) completely, and determine the coordinates of its stationary points.',
    answer:
      `f(1) = 1 − 9 + 24 − 16 = 0, so x = 1 is a root and (x − 1) is a factor. Dividing gives f(x) = (x − 1)(x² − 8x + 16) = (x − 1)(x − 4)². ` +
      `f′(x) = 3x² − 18x + 24 = 3(x − 2)(x − 4), so the stationary points are ${pt(s1, f(k, s1))}, a local maximum, and ${pt(s2, f(k, s2))}, a local minimum.`,
    explanation:
      'Showing that x = 1 is a root means substituting and getting zero — it is not enough to say the factor theorem applies. Once (x − 1) is out, the quadratic that remains is a perfect square, so x = 4 is a double root and the graph touches the axis there. Notice the agreement between the two halves of the question: the double root at x = 4 must also be a stationary point, and f′ does indeed vanish at x = 4. If those two disagreed, one of them would be wrong, and checking them against each other costs nothing.',
    memo: [
      { code: 'M', marks: 1, text: 'f(1) = 1 − 9 + 24 − 16 evaluated' },
      { code: 'A', marks: 1, text: '= 0, so x = 1 is a root' },
      { code: 'A', marks: 1, text: 'f(x) = (x − 1)(x − 4)²' },
      { code: 'M', marks: 1, text: 'f′(x) = 3x² − 18x + 24 set equal to 0' },
      { code: 'A', marks: 1, text: `local maximum ${pt(s1, f(k, s1))}` },
      { code: 'A', marks: 1, text: `local minimum ${pt(s2, f(k, s2))}` },
    ],
  })
}

{
  const k = CUBICS.c
  const [s1, s2] = stationary(k)
  out.push({
    ...calc,
    id: 'gap-cubic-g12-sketch-c',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt:
      'Given f(x) = x³ + 3x² − 9x − 27. Factorise f(x) completely by grouping, and determine the coordinates of the turning points of f.',
    answer:
      `Grouping: x³ + 3x² − 9x − 27 = x²(x + 3) − 9(x + 3) = (x + 3)(x² − 9) = (x + 3)(x − 3)(x + 3) = (x − 3)(x + 3)². ` +
      `f′(x) = 3x² + 6x − 9 = 3(x + 3)(x − 1), so the turning points are ${pt(s1, f(k, s1))} and ${pt(s2, f(k, s2))}.`,
    explanation:
      'Grouping works here because the first two terms and the last two share the same bracket, (x + 3), which is what makes it faster than the factor theorem: no trial substitution is needed. Watch the double factor — (x + 3) comes out of the grouping AND out of x² − 9, so it appears twice. The graph touches the x-axis at x = −3, and that is also where the local maximum sits, which is the check that the factorising and the differentiating agree.',
    memo: [
      { code: 'M', marks: 1, text: 'grouped as x²(x + 3) − 9(x + 3)' },
      { code: 'A', marks: 1, text: 'f(x) = (x − 3)(x + 3)²' },
      { code: 'M', marks: 1, text: 'f′(x) = 3x² + 6x − 9 set equal to 0' },
      { code: 'A', marks: 1, text: `${pt(s1, f(k, s1))}` },
      { code: 'A', marks: 1, text: `${pt(s2, f(k, s2))}` },
    ],
  })
}

{
  const k = CUBICS.a
  const ix = inflectX(k)
  out.push({
    ...calc,
    id: 'gap-concavity-g12-second-derivative',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt:
      'Given f(x) = x³ − 6x² + 9x. Determine f″(x), find the value of x where f″(x) = 0, and state the interval on which the graph is concave down.',
    answer:
      `f′(x) = 3x² − 12x + 9 and f″(x) = 6x − 12. Setting 6x − 12 = 0 gives x = ${n(ix)}. For x < ${n(ix)}, f″(x) < 0, so the graph is concave down on x < ${n(ix)}; for x > ${n(ix)} it is concave up.`,
    explanation:
      'The second derivative measures how the GRADIENT is changing, not how the function is changing. Where f″ is negative the gradient is falling, so the curve bends downwards like a frown; where f″ is positive it bends upwards like a smile. Since f″(x) = 6x − 12 is linear, it changes sign exactly once, which is why a cubic always has exactly one place where its concavity changes. Testing a value on each side — f″(0) = −12 and f″(3) = 6 — is the evidence the marker wants, not just the value of x.',
    memo: [
      { code: 'A', marks: 1, text: 'f′(x) = 3x² − 12x + 9' },
      { code: 'A', marks: 1, text: 'f″(x) = 6x − 12' },
      { code: 'M', marks: 1, text: '6x − 12 = 0' },
      { code: 'A', marks: 1, text: `x = ${n(ix)}` },
      { code: 'A', marks: 1, text: `concave down for x < ${n(ix)}` },
    ],
  })
}

{
  const k = CUBICS.b
  const [s1, s2] = stationary(k)
  out.push({
    ...calc,
    id: 'gap-concavity-g12-increasing',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt:
      'Given f(x) = x³ − 9x² + 24x − 16 with f′(x) = 3(x − 2)(x − 4). Determine the values of x for which f is increasing, and explain why f is increasing on an interval that contains values of x where f(x) is negative.',
    answer:
      `f is increasing where f′(x) > 0, which is where (x − 2)(x − 4) > 0: that is x < ${n(s1)} or x > ${n(s2)}. ` +
      'Increasing describes the DIRECTION the graph is travelling, not its position: for x < 1 the graph is below the x-axis and still climbing towards the root at x = 1, so f(x) is negative while f is increasing. The two ideas are independent — the sign of f(x) says where the graph is, the sign of f′(x) says which way it is going.',
    explanation:
      'This is the confusion the question is built around, and it costs marks every year. "Increasing" and "positive" are different claims: a graph deep below the axis and rising steeply is increasing, and a graph high above the axis and falling is decreasing but positive. Solve the sign of the DERIVATIVE, not of the function. A quick sign table for 3(x − 2)(x − 4) settles it: positive, negative, positive across the two roots.',
    memo: [
      { code: 'M', marks: 1, text: 'f′(x) > 0 required' },
      { code: 'M', marks: 1, text: 'sign of (x − 2)(x − 4) considered on the three intervals' },
      { code: 'A', marks: 1, text: `x < ${n(s1)}` },
      { code: 'A', marks: 1, text: `or x > ${n(s2)}` },
      { code: 'R', marks: 1, text: 'the sign of f′ gives direction; the sign of f gives position — they are independent' },
    ],
  })
}

out.push({
  ...calc,
  id: 'gap-concavity-g12-from-derivative-signs',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 4,
  prompt:
    'For a function g it is given that g′(2) = 0 and that the second derivative g″(2) = −6. State, with a reason, whether the stationary point at x = 2 is a local maximum or a local minimum, and explain what the sign of g″(2) tells you about the concavity of the graph there.',
  answer:
    'g has a local MAXIMUM at x = 2. The gradient is zero there, so it is a stationary point, and g″(2) = −6 is negative, which means the graph is concave down at that point — it bends downwards, so the stationary point is a peak rather than a trough.',
  explanation:
    'This is the second derivative test, and it is quicker than a sign table when the second derivative is easy to evaluate. The logic is worth holding onto rather than memorising: a negative second derivative means the gradient is decreasing, so the graph goes from climbing, to flat, to falling — which is a maximum. A positive second derivative gives the opposite and a minimum. If g″(2) had been zero the test would say nothing, and a sign table for g′ would be needed instead.',
  memo: [
    { code: 'A', marks: 1, text: 'local maximum' },
    { code: 'R', marks: 1, text: "g'(2) = 0, so x = 2 is a stationary point" },
    { code: 'R', marks: 1, text: 'g″(2) < 0, so the graph is concave down there' },
    { code: 'R', marks: 1, text: 'the gradient is decreasing through the stationary point, so it is a peak' },
  ],
})

/* ===================================================================== */
/* Word problems and setting up equations (Grade 12)                     */
/* ===================================================================== */

const alg12 = { topicId: 'math-algebra', grade: 12 } as const

out.push({
  ...alg12,
  id: 'gap-word-g12-consecutive',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 5,
  prompt:
    'The sum of two numbers is 21 and the sum of their squares is 261. Let x be the smaller number, form an equation in x alone, and determine both numbers.',
  answer:
    'Let x be the smaller number and y the larger: x + y = 21 and x² + y² = 261. From the first, y = 21 − x. Substituting: x² + (21 − x)² = 261, so x² + 441 − 42x + x² = 261, giving 2x² − 42x + 180 = 0 and x² − 21x + 90 = 0. Factorising: (x − 6)(x − 15) = 0, so x = 6 or x = 15. Since x is the smaller number, x = 6 and y = 15. Check: 6 + 15 = 21 and 36 + 225 = 261. ✓',
  explanation:
    'Name the unknowns before writing anything else — "let x be the smaller number" is a mark in itself, and without it the two roots cannot be told apart at the end. Substitute into the LINEAR equation as always, and divide out the common factor of 2 before factorising to keep the numbers manageable. The last step is the one learners skip: the quadratic gives 6 and 15, and the definition of x decides which is which. Checking both conditions at the end catches an arithmetic slip in seconds.',
  memo: [
    { code: 'A', marks: 1, text: 'x + y = 21 and x² + y² = 261' },
    { code: 'M', marks: 1, text: 'y = 21 − x substituted' },
    { code: 'M', marks: 1, text: 'x² − 21x + 90 = 0' },
    { code: 'CA', marks: 1, text: '(x − 6)(x − 15) = 0' },
    { code: 'A', marks: 1, text: 'the numbers are 6 and 15' },
  ],
})

out.push({
  ...alg12,
  id: 'gap-word-g12-rectangle-area',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 5,
  prompt:
    'A rectangular vegetable bed is 3 m longer than it is wide, and its area is 88 m². Let x be the width in metres, set up an equation, and determine the dimensions of the bed.',
  answer:
    'Let the width be x metres; then the length is (x + 3) metres and x(x + 3) = 88. So x² + 3x − 88 = 0, which factorises as (x + 11)(x − 8) = 0, giving x = −11 or x = 8. A width cannot be negative, so x = 8. The bed is 8 m wide and 11 m long. Check: 8 × 11 = 88 m². ✓',
  explanation:
    'Every measurement word problem ends with a check that the answer makes physical sense, and here that check does real work: the quadratic has two roots and one of them is a negative length, which does not exist. Discarding it with a stated reason earns the mark; discarding it silently does not. Note also that the question asks for the DIMENSIONS, so giving x = 8 alone is an incomplete answer — the length must be worked out and stated too.',
  memo: [
    { code: 'A', marks: 1, text: 'length = x + 3' },
    { code: 'A', marks: 1, text: 'x(x + 3) = 88' },
    { code: 'M', marks: 1, text: 'x² + 3x − 88 = 0 factorised' },
    { code: 'CA', marks: 1, text: 'x = 8 (x = −11 rejected: a width cannot be negative)' },
    { code: 'A', marks: 1, text: '8 m by 11 m' },
  ],
})

out.push({
  ...alg12,
  id: 'gap-word-g12-speed-time',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 6,
  prompt:
    'A cyclist rides 60 km to a town and returns along the same route 5 km/h faster. Let x be the average speed in km/h on the outward trip. The return trip takes 1 hour less than the outward trip. Set up an equation in x and determine the speed on the outward trip.',
  answer:
    'Time out = 60/x hours; time back = 60/(x + 5) hours. The return is 1 hour less, so 60/x − 60/(x + 5) = 1. Multiplying through by x(x + 5): 60(x + 5) − 60x = x(x + 5), so 60x + 300 − 60x = x² + 5x, giving x² + 5x − 300 = 0. Factorising: (x + 20)(x − 15) = 0, so x = −20 or x = 15. A speed cannot be negative, so the outward speed is 15 km/h. Check: 60/15 = 4 hours out, 60/20 = 3 hours back — one hour less. ✓',
  explanation:
    'Distance, speed and time problems come down to one relationship, time = distance ÷ speed, applied twice. Write both times as expressions in x before writing any equation; the sentence "takes 1 hour less" then translates directly into subtracting them. The slower trip takes LONGER, so the outward time must be the larger of the two — putting the subtraction the wrong way round gives x² + 5x + 300 = 0, which has no real roots, and that is itself a signal to go back and swap them.',
  memo: [
    { code: 'A', marks: 1, text: 'time out = 60/x' },
    { code: 'A', marks: 1, text: 'time back = 60/(x + 5)' },
    { code: 'A', marks: 1, text: '60/x − 60/(x + 5) = 1' },
    { code: 'M', marks: 1, text: 'multiplied through by x(x + 5)' },
    { code: 'CA', marks: 1, text: 'x² + 5x − 300 = 0' },
    { code: 'A', marks: 1, text: '15 km/h (x = −20 rejected: a speed cannot be negative)' },
  ],
})

/* ===================================================================== */
/* Exponential functions (Grade 10)                                      */
/* ===================================================================== */

out.push({
  ...fn(10),
  id: 'gap-exp-g10-table-and-shape',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 4,
  prompt:
    'For the exponential function y = 2ˣ, calculate y when x = −2, 0 and 3, and state the equation of the asymptote.',
  answer:
    'When x = −2, y = 2⁻² = 1/4 = 0,25. When x = 0, y = 2⁰ = 1. When x = 3, y = 2³ = 8. The asymptote is y = 0.',
  explanation:
    'A negative exponent does not make the answer negative — it makes it a fraction: 2⁻² means 1 ÷ 2², which is 0,25. And 2⁰ = 1, as any non-zero base raised to the power 0 is. Those two facts are what keep the whole graph above the x-axis: no power of 2 is ever zero or negative, however far left you go, which is exactly why y = 0 is an asymptote the curve approaches but never reaches.',
  memo: [
    { code: 'A', marks: 1, text: 'y = 0,25 when x = −2' },
    { code: 'A', marks: 1, text: 'y = 1 when x = 0' },
    { code: 'A', marks: 1, text: 'y = 8 when x = 3' },
    { code: 'A', marks: 1, text: 'asymptote y = 0' },
  ],
})

out.push({
  ...fn(10),
  id: 'gap-exp-g10-growth-decay',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 4,
  prompt:
    'Two exponential functions are given: f(x) = 3ˣ and g(x) = (1/3)ˣ. State which one shows growth and which shows decay, write down the coordinates of the point both graphs pass through, and explain why they meet there.',
  answer:
    'f(x) = 3ˣ shows growth, because the base 3 is greater than 1, so y increases as x increases. g(x) = (1/3)ˣ shows decay, because the base is between 0 and 1. Both pass through (0 ; 1), because any non-zero base raised to the power 0 equals 1.',
  explanation:
    'The BASE decides everything about the shape. A base bigger than 1 multiplies by more than one each step, so the graph climbs; a base between 0 and 1 multiplies by less than one, so it falls. Every graph of the form y = bˣ passes through (0 ; 1) for the same reason, which makes that point a useful anchor when sketching any of them. Note too that (1/3)ˣ is the same as 3⁻ˣ, so g is f reflected in the y-axis.',
  memo: [
    { code: 'A', marks: 1, text: 'f shows growth (base 3 > 1)' },
    { code: 'A', marks: 1, text: 'g shows decay (base 1/3 is between 0 and 1)' },
    { code: 'A', marks: 1, text: '(0 ; 1)' },
    { code: 'R', marks: 1, text: 'any non-zero base to the power 0 is 1' },
  ],
})

out.push({
  ...fn(10),
  id: 'gap-exp-g10-bacteria',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 5,
  prompt:
    'A colony of 200 bacteria doubles every hour, so the number after t hours is N = 200 × 2ᵗ. Calculate the number of bacteria after 4 hours, determine after how many whole hours the colony first exceeds 5 000, and explain why this growth is exponential rather than linear.',
  answer:
    'After 4 hours: N = 200 × 2⁴ = 200 × 16 = 3 200. Testing whole hours: at t = 4, N = 3 200; at t = 5, N = 200 × 32 = 6 400, which exceeds 5 000. So it first exceeds 5 000 after 5 hours. The growth is exponential because the colony is MULTIPLIED by 2 each hour rather than having a fixed number added, so the increase itself gets bigger every hour.',
  explanation:
    'The distinction in the last part is the whole point of the topic. Linear growth adds the same amount each step; exponential growth multiplies by the same factor each step. Here the colony gains 200 in the first hour, then 400, then 800 — the increases grow, which a straight line can never do. For the middle part, substituting whole values of t is the Grade 10 method and is perfectly acceptable; solving 200 × 2ᵗ = 5 000 needs logarithms, which arrive in Grade 12.',
  memo: [
    { code: 'M', marks: 1, text: 'N = 200 × 2⁴' },
    { code: 'A', marks: 1, text: '3 200 bacteria' },
    { code: 'M', marks: 1, text: 't = 5 tested: 200 × 32 = 6 400' },
    { code: 'A', marks: 1, text: 'first exceeds 5 000 after 5 hours' },
    { code: 'R', marks: 1, text: 'multiplied by a constant factor each hour, not increased by a constant amount' },
  ],
})

/* ===================================================================== */
/* Tree diagrams and two-way tables (Grade 10)                           */
/* ===================================================================== */

const prob10 = { topicId: 'math-counting-probability', grade: 10 } as const

out.push({
  ...prob10,
  id: 'gap-tree-g10-two-coins',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 4,
  prompt:
    'A fair coin is tossed twice. Draw a tree diagram in your workbook to show all the outcomes, then write down the probability of getting two heads, and the probability of getting exactly one head.',
  answer:
    'The tree has two branches at each toss, giving four equally likely outcomes: HH, HT, TH and TT. P(two heads) = P(HH) = 1/4. Exactly one head happens in two of the four outcomes, HT and TH, so P(exactly one head) = 2/4 = 1/2.',
  explanation:
    'The tree is worth drawing even when the answer feels obvious, because it is what stops the commonest error here: treating "exactly one head" as a single outcome worth 1/4. It is two outcomes, HT and TH, because the order matters on a tree even though it does not matter to the description. Each complete path has probability 1/2 × 1/2 = 1/4, and the probabilities of all four paths add to 1, which is the check that no branch has been missed.',
  memo: [
    { code: 'A', marks: 1, text: 'four outcomes: HH, HT, TH, TT' },
    { code: 'A', marks: 1, text: 'P(HH) = 1/4' },
    { code: 'M', marks: 1, text: 'exactly one head = HT and TH' },
    { code: 'A', marks: 1, text: 'P(exactly one head) = 1/2' },
  ],
})

out.push({
  ...prob10,
  id: 'gap-tree-g10-two-way-table',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 5,
  context:
    '|+ 80 learners, by grade and whether they walk to school\n| | Walks | Does not walk | Total |\n|---|---|---|---|\n| Grade 10 | 18 | 27 | 45 |\n| Grade 11 | 14 | 21 | 35 |\n| Total | 32 | 48 | 80 |',
  prompt:
    'Using the two-way table, determine the probability that a learner chosen at random walks to school, the probability that a learner is in Grade 10 and walks, and state whether being in Grade 10 and walking to school are independent events.',
  answer:
    'P(walks) = 32/80 = 0,4. P(Grade 10 and walks) = 18/80 = 0,225. For independence, P(Grade 10) × P(walks) = 45/80 × 32/80 = 0,5625 × 0,4 = 0,225, which equals P(Grade 10 and walks). So the two events ARE independent.',
  explanation:
    'A two-way table answers "and" questions by reading a single cell, and single-event questions by reading a total — no calculation is needed to find either. The independence test is the part worth practising: multiply the two separate probabilities and compare with the cell. They agree here, which means knowing a learner is in Grade 10 tells you nothing about whether they walk. Comparing 0,225 with 0,225 is the evidence; simply asserting independence earns nothing.',
  memo: [
    { code: 'A', marks: 1, text: 'P(walks) = 32/80 = 0,4' },
    { code: 'A', marks: 1, text: 'P(Grade 10 and walks) = 18/80 = 0,225' },
    { code: 'M', marks: 1, text: 'P(Grade 10) × P(walks) = 45/80 × 32/80' },
    { code: 'CA', marks: 1, text: '= 0,225' },
    { code: 'R', marks: 1, text: 'equal to P(Grade 10 and walks), so the events are independent' },
  ],
})

out.push({
  ...prob10,
  id: 'gap-tree-g10-without-replacement',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 5,
  prompt:
    'A bag holds 4 red marbles and 6 blue marbles. Two marbles are drawn one after the other without replacement. Determine the probability that both are red, and explain how the answer would change if the first marble were replaced before the second draw.',
  answer:
    'Without replacement: P(red, then red) = 4/10 × 3/9 = 12/90 = 2/15 ≈ 0,133. With replacement the bag is back to 4 red out of 10 for the second draw, so P = 4/10 × 4/10 = 16/100 = 4/25 = 0,16, which is larger.',
  explanation:
    'Without replacement, BOTH numbers on the second branch change: one red has gone, so it is 3 reds out of 9 marbles, not 3 out of 10. Forgetting to reduce the denominator is the standard slip. The comparison at the end explains why the two answers differ in the direction they do: taking a red out first makes the bag proportionally less red, so a second red becomes less likely — which is exactly what 2/15 < 4/25 says.',
  memo: [
    { code: 'A', marks: 1, text: 'P(first red) = 4/10' },
    { code: 'A', marks: 1, text: 'P(second red | first red) = 3/9' },
    { code: 'CA', marks: 1, text: '4/10 × 3/9 = 2/15' },
    { code: 'A', marks: 1, text: 'with replacement: 4/10 × 4/10 = 4/25' },
    { code: 'R', marks: 1, text: 'larger, because removing a red leaves the bag proportionally less red' },
  ],
})

/* ===================================================================== */
/* Volume and surface area of solids (Grade 11)                          */
/* ===================================================================== */

const meas11 = { topicId: 'math-euclidean-geometry', grade: 11 } as const

out.push({
  ...meas11,
  id: 'gap-volume-g11-cylinder',
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 5,
  prompt:
    'A closed cylindrical water tank has a radius of 1,5 m and a height of 4 m. Calculate its volume and its total surface area, using π = 3,14 and rounding to two decimal places.',
  answer:
    'Volume = πr²h = 3,14 × 1,5² × 4 = 3,14 × 2,25 × 4 = 28,26 m³. Total surface area = 2πr² + 2πrh = 2 × 3,14 × 2,25 + 2 × 3,14 × 1,5 × 4 = 14,13 + 37,68 = 51,81 m².',
  explanation:
    'A CLOSED cylinder has three surfaces: two circular ends and the curved side. The curved surface is a rectangle rolled up, and its width is the circumference of the circle, 2πr, which is where 2πrh comes from. Leaving out one of the two ends is the commonest error, and the word "closed" in the question is the warning that both are there. Keep the units apart: volume is in cubic metres, area in square metres.',
  memo: [
    { code: 'M', marks: 1, text: 'V = πr²h with r = 1,5 and h = 4' },
    { code: 'CA', marks: 1, text: 'V = 28,26 m³' },
    { code: 'M', marks: 1, text: 'TSA = 2πr² + 2πrh' },
    { code: 'CA', marks: 1, text: '14,13 + 37,68' },
    { code: 'A', marks: 1, text: 'TSA = 51,81 m²' },
  ],
})

out.push({
  ...meas11,
  id: 'gap-volume-g11-factor-k',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 5,
  prompt:
    'A cube has sides of 4 cm. Each side is then multiplied by 3. Calculate the volume of the original cube and of the enlarged cube, state the factor by which the volume has increased, and explain why that factor is not 3.',
  answer:
    'Original volume = 4³ = 64 cm³. Enlarged side = 3 × 4 = 12 cm, so the new volume = 12³ = 1 728 cm³. The volume has increased by a factor of 1 728 ÷ 64 = 27. It is not 3 because volume depends on THREE dimensions, and each of them has been multiplied by 3, so the volume is multiplied by 3 × 3 × 3 = 27.',
  explanation:
    'This is the Grade 11 addition to measurement and it is tested almost every year. Multiplying every dimension by k multiplies length by k, area by k² and volume by k³. Here k = 3, so the volume factor is 3³ = 27 and the surface area factor would be 3² = 9. The general rule is worth stating in the answer, not just the arithmetic — a question phrased with an unknown k cannot be answered by calculating two volumes.',
  memo: [
    { code: 'A', marks: 1, text: 'original volume = 64 cm³' },
    { code: 'M', marks: 1, text: 'new side = 12 cm' },
    { code: 'CA', marks: 1, text: 'new volume = 1 728 cm³' },
    { code: 'A', marks: 1, text: 'factor = 27' },
    { code: 'R', marks: 1, text: 'volume has three dimensions, each multiplied by 3, so the factor is 3³' },
  ],
})

out.push({
  ...meas11,
  id: 'gap-volume-g11-prism-capacity',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 5,
  prompt:
    'A rectangular prism-shaped reservoir measures 6 m long, 2,5 m wide and 1,8 m deep. Calculate its volume in cubic metres, convert this to litres given that 1 m³ = 1 000 ℓ, and determine how many full days it would supply a village using 4 500 ℓ per day.',
  answer:
    'Volume = 6 × 2,5 × 1,8 = 27 m³. In litres: 27 × 1 000 = 27 000 ℓ. Days = 27 000 ÷ 4 500 = 6 days exactly.',
  explanation:
    'The volume of any prism is the area of its cross-section times its length, and for a rectangular prism that is simply length × width × depth. The conversion is where marks are lost: 1 m³ is 1 000 ℓ, not 100 or 10 000, and getting it wrong changes the answer by a factor of ten. The last step divides a capacity by a rate to get a time, and because it divides exactly here there is no rounding decision to make — when it does not divide exactly, the answer is always rounded DOWN, since a part-day of supply is not a full day.',
  memo: [
    { code: 'M', marks: 1, text: 'V = 6 × 2,5 × 1,8' },
    { code: 'A', marks: 1, text: 'V = 27 m³' },
    { code: 'M', marks: 1, text: '27 × 1 000' },
    { code: 'CA', marks: 1, text: '27 000 ℓ' },
    { code: 'A', marks: 1, text: '6 days' },
  ],
})

export const mathGraphGaps: Question[] = out
