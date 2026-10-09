/**
 * Mathematics question types that report:question-types found missing or
 * thin, as an NSC paper asks them:
 *
 *   Algebra -- linear inequalities (Grade 10); surd equations, word
 *     problems and the nature of the roots (Grade 11); factorising, the
 *     quadratic formula and simultaneous equations as Paper 1 Question 1
 *     sets them (Grade 12).
 *   Functions -- reading an inequality off two graphs (Grade 10).
 *   Trigonometry -- general solutions (Grade 11).
 *   Analytical geometry -- collinear points (Grade 12).
 *   Statistics -- cumulative frequency and ogives (Grade 11); outliers by the
 *     1,5 × IQR rule, and what removing one does (Grade 12).
 *   Finance -- inflation and population growth (Grades 10 to 12), hire
 *     purchase (Grade 10), effective and nominal rates.
 *   Number patterns -- which term has a given value (Grade 11).
 *   Probability -- Venn diagrams in every grade, contingency tables and
 *     independence (Grades 11 and 12).
 *
 * Every number in an answer is computed below from the data declared with
 * it, written with a decimal comma, and every question carries a marking memo
 * that adds up to its marks.
 */
import type { Grade, Question } from '@/types'

const n = (v: number, dp = 2): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(Math.abs(r)).split('.')
  return (r < 0 ? '−' : '') + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}
/** Rands to the cent: R150 536,65. */
const rand = (v: number): string => {
  const [whole, cents] = (Math.round(v * 100) / 100).toFixed(2).split('.')
  return `R${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')},${cents}`
}
const t = (topicId: string, grade: Grade) => ({ topicId, grade }) as const
const out: Question[] = []

// ================================================================ ALGEBRA

// --- Grade 10: linear inequalities
out.push(
  {
    id: 'mty-10-ineq-linear',
    ...t('math-algebra', 10),
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Solve the inequality 3(x − 2) − 5 > 7x + 2, and write the solution in interval notation.',
    answer: 'x < −13/4, that is x < −3¼; in interval notation x ∈ (−∞ ; −3¼).',
    explanation:
      'Expand: 3x − 6 − 5 > 7x + 2, so 3x − 11 > 7x + 2. Collect the x terms: −4x > 13. Dividing by −4, a NEGATIVE number, reverses the inequality sign: x < −13/4 = −3¼. The end point is not included, so the bracket is round.',
    memo: [
      { code: 'M', marks: 1, text: 'expanding: 3x − 6 − 5' },
      { code: 'A', marks: 1, text: '−4x > 13' },
      { code: 'M', marks: 1, text: 'reversing the sign when dividing by −4' },
      { code: 'A', marks: 1, text: 'x < −3¼, (−∞ ; −3¼)' },
    ],
  },
  {
    id: 'mty-10-ineq-compound',
    ...t('math-algebra', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Solve −5 ≤ 2x + 3 < 9. Write the solution in interval notation, and list the integers that satisfy the inequality.',
    answer: '−4 ≤ x < 3, that is x ∈ [−4 ; 3). Integers: −4; −3; −2; −1; 0; 1; 2.',
    explanation:
      'Do the same thing to all three parts. Subtract 3: −8 ≤ 2x < 6. Divide by 2 (positive, so the signs stay): −4 ≤ x < 3. −4 is included (square bracket); 3 is not (round bracket), so 3 is not in the list of integers.',
    memo: [
      { code: 'M', marks: 1, text: 'subtracting 3 from all three parts' },
      { code: 'A', marks: 1, text: '−4 ≤ x < 3' },
      { code: 'A', marks: 1, text: '[−4 ; 3)' },
      { code: 'CA', marks: 1, text: '−4; −3; −2; −1; 0; 1; 2' },
    ],
  },
  {
    id: 'mty-10-ineq-fractions',
    ...t('math-algebra', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Solve the inequality x/2 − (x − 1)/3 ≤ 2, and write down the largest integer value of x.',
    answer: 'x ≤ 10; the largest integer is 10.',
    explanation:
      'Multiply every term by the LCD, 6 (positive, so the sign stays): 3x − 2(x − 1) ≤ 12. Expand: 3x − 2x + 2 ≤ 12, so x + 2 ≤ 12 and x ≤ 10. 10 itself is allowed, because the sign is ≤.',
    memo: [
      { code: 'M', marks: 1, text: '× 6: 3x − 2(x − 1) ≤ 12' },
      { code: 'A', marks: 1, text: 'x ≤ 10' },
      { code: 'CA', marks: 1, text: '10' },
    ],
  },
)
{
  const money = 250
  const book = 85
  const pen = 12.5
  const most = Math.floor((money - book) / pen)
  out.push({
    id: 'mty-10-ineq-word',
    ...t('math-algebra', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Thandi has ${rand(money)}. She buys a book for ${rand(book)} and wants to spend the rest on pens at ${rand(pen)} each. Write down an inequality for the number of pens, p, she can buy, solve it, and state the greatest number of pens she can buy.`,
    answer: `${n(pen)}p + ${book} ≤ ${money}; p ≤ ${n((money - book) / pen)}; at most ${most} pens.`,
    explanation: `What she spends may not exceed what she has: ${n(pen)}p + ${book} ≤ ${money}. Then ${n(pen)}p ≤ ${money - book}, so p ≤ ${money - book} ÷ ${n(pen)} = ${n((money - book) / pen)}. p must be a whole number, so she can buy at most ${most} pens (${most + 1} would cost ${rand((most + 1) * pen + book)} in all).`,
    memo: [
      { code: 'A', marks: 1, text: `${n(pen)}p + ${book} ≤ ${money}` },
      { code: 'M', marks: 1, text: `${n(pen)}p ≤ ${money - book}` },
      { code: 'A', marks: 1, text: `p ≤ ${n((money - book) / pen)}` },
      { code: 'CA', marks: 1, text: `${most} pens` },
    ],
  })
}

// --- Grade 11: surd equations and word problems
out.push(
  {
    id: 'mty-11-surd-equation',
    ...t('math-algebra', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: 'Solve for x: √(x + 7) = x − 5.',
    answer: 'x = 9 (x = 2 is rejected).',
    explanation:
      'Square both sides: x + 7 = x² − 10x + 25, so x² − 11x + 18 = 0 and (x − 9)(x − 2) = 0, giving x = 9 or x = 2. Squaring can introduce false roots, so check each in the ORIGINAL equation. x = 9: √16 = 4 and 9 − 5 = 4 ✓. x = 2: √9 = 3 but 2 − 5 = −3 ✗ (a square root is never negative). So x = 9 only.',
    memo: [
      { code: 'M', marks: 1, text: 'squaring both sides' },
      { code: 'A', marks: 1, text: 'x² − 11x + 18 = 0' },
      { code: 'A', marks: 1, text: '(x − 9)(x − 2) = 0' },
      { code: 'M', marks: 1, text: 'checking both values in the original equation' },
      { code: 'CA', marks: 1, text: 'x = 9; x ≠ 2' },
    ],
  },
  {
    id: 'mty-11-surd-equation-isolate',
    ...t('math-algebra', 11),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: 'Solve for x: x − √(2x + 6) = 1.',
    answer: 'x = 5 (x = −1 is rejected).',
    explanation:
      'Isolate the surd first: x − 1 = √(2x + 6). Square: x² − 2x + 1 = 2x + 6, so x² − 4x − 5 = 0 and (x − 5)(x + 1) = 0: x = 5 or x = −1. Check x = 5: 5 − √16 = 5 − 4 = 1 ✓. Check x = −1: −1 − √4 = −3 ≠ 1 ✗. So x = 5. Squaring before isolating the surd leaves a √ term in the square and does not remove it.',
    memo: [
      { code: 'M', marks: 1, text: 'isolating the surd: x − 1 = √(2x + 6)' },
      { code: 'A', marks: 1, text: 'x² − 4x − 5 = 0' },
      { code: 'A', marks: 1, text: 'x = 5 or x = −1' },
      { code: 'M', marks: 1, text: 'checking in the original equation' },
      { code: 'CA', marks: 1, text: 'x = 5 only' },
    ],
  },
  {
    id: 'mty-11-word-consecutive',
    ...t('math-algebra', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'The product of two consecutive positive odd integers is 143. Set up an equation and solve it to find the two integers.',
    answer: '11 and 13.',
    explanation:
      'Let the integers be n and n + 2 (consecutive ODD integers differ by 2). n(n + 2) = 143, so n² + 2n − 143 = 0 and (n + 13)(n − 11) = 0: n = 11 or n = −13. The integers must be positive, so n = 11 and the integers are 11 and 13. Check: 11 × 13 = 143.',
    memo: [
      { code: 'M', marks: 1, text: 'n(n + 2) = 143' },
      { code: 'A', marks: 1, text: 'n² + 2n − 143 = 0' },
      { code: 'A', marks: 1, text: '(n + 13)(n − 11) = 0' },
      { code: 'CA', marks: 1, text: '11 and 13 (−13 rejected)' },
    ],
  },
)
{
  const d = 60
  const faster = 5
  // 60/v − 60/(v + 5) = 1  →  v² + 5v − 300 = 0
  const disc = faster * faster + 4 * d * faster
  const v = (-faster + Math.sqrt(disc)) / 2
  out.push({
    id: 'mty-11-word-speed',
    ...t('math-algebra', 11),
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `A cyclist rides ${d} km at a constant speed. Had she ridden ${faster} km/h faster, the trip would have taken 1 hour less. Let x be her speed in km/h. Set up an equation and determine her speed.`,
    answer: `${n(v)} km/h`,
    explanation: `Time = distance ÷ speed, so ${d}/x − ${d}/(x + ${faster}) = 1. Multiply by x(x + ${faster}): ${d}(x + ${faster}) − ${d}x = x(x + ${faster}), so ${d * faster} = x² + ${faster}x and x² + ${faster}x − ${d * faster} = 0. Factorise: (x + ${v + faster})(x − ${v}) = 0. A speed cannot be negative, so x = ${n(v)} km/h. Check: ${d} ÷ ${v} = ${d / v} h and ${d} ÷ ${v + faster} = ${d / (v + faster)} h, 1 hour less.`,
    memo: [
      { code: 'M', marks: 1, text: `${d}/x − ${d}/(x + ${faster}) = 1` },
      { code: 'M', marks: 1, text: `multiplying by x(x + ${faster})` },
      { code: 'A', marks: 1, text: `x² + ${faster}x − ${d * faster} = 0` },
      { code: 'A', marks: 1, text: `(x + ${v + faster})(x − ${v}) = 0` },
      { code: 'CA', marks: 1, text: `${n(v)} km/h` },
    ],
  })
}

// --- Grade 12: Paper 1 Question 1
out.push(
  {
    id: 'mty-12-factorise-solve',
    ...t('math-algebra', 12),
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Solve the quadratic equation x(x − 5) = 14 by factorising.',
    answer: 'x = 7 or x = −2',
    explanation:
      'A product equal to 14 tells you nothing about either factor -- only a product equal to ZERO does. So expand and make one side zero first: x² − 5x − 14 = 0. Factorise: (x − 7)(x + 2) = 0, so x = 7 or x = −2.',
    memo: [
      { code: 'A', marks: 1, text: 'standard form: x² − 5x − 14 = 0' },
      { code: 'A', marks: 1, text: '(x − 7)(x + 2) = 0' },
      { code: 'CA', marks: 1, text: 'x = 7 or x = −2' },
    ],
  },
)
{
  const [a, b, c] = [3, -5, -4]
  const disc = b * b - 4 * a * c
  const x1 = (-b + Math.sqrt(disc)) / (2 * a)
  const x2 = (-b - Math.sqrt(disc)) / (2 * a)
  out.push({
    id: 'mty-12-quadratic-formula',
    ...t('math-algebra', 12),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Solve 3x² − 5x − 4 = 0 using the quadratic formula. Give your answers correct to TWO decimal places.',
    answer: `x = (5 ± √${disc})/6, so x = ${n(x1)} or x = ${n(x2)}`,
    explanation: `a = 3, b = −5, c = −4. x = [−b ± √(b² − 4ac)]/(2a) = [5 ± √(25 − 4(3)(−4))]/6 = (5 ± √${disc})/6. √${disc} = ${n(Math.sqrt(disc), 4)}, so x = ${n(x1, 4)} ≈ ${n(x1)} or x = ${n(x2, 4)} ≈ ${n(x2)}. Watch the signs: −b = +5, and −4ac = +48.`,
    memo: [
      { code: 'SF', marks: 1, text: 'formula with a = 3, b = −5, c = −4 substituted' },
      { code: 'A', marks: 1, text: `(5 ± √${disc})/6` },
      { code: 'A', marks: 1, text: `x = ${n(x1)}` },
      { code: 'A', marks: 1, text: `x = ${n(x2)}` },
    ],
  })
}
out.push(
  {
    id: 'mty-11-nature-roots-k',
    ...t('math-algebra', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Use the discriminant to determine the values of k for which 2x² − 4x + k = 0 has (a) two unequal real roots, and (b) equal roots.',
    answer: '(a) k < 2; (b) k = 2.',
    explanation:
      'Δ = b² − 4ac = (−4)² − 4(2)(k) = 16 − 8k. Two unequal real roots need Δ > 0: 16 − 8k > 0, so k < 2. Equal roots need Δ = 0: k = 2. (For k > 2, Δ < 0 and there are no real roots.)',
    memo: [
      { code: 'SF', marks: 1, text: 'Δ = 16 − 8k' },
      { code: 'M', marks: 1, text: 'Δ > 0 for unequal real roots' },
      { code: 'A', marks: 1, text: 'k < 2' },
      { code: 'A', marks: 1, text: 'k = 2' },
    ],
  },
  {
    id: 'mty-11-nature-roots-prove',
    ...t('math-algebra', 11),
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Prove that the roots of x² − (k + 2)x + 2k = 0 are real and rational for every rational value of k. Determine the nature of the roots when k = 2.',
    answer: 'Δ = (k − 2)², a perfect square that is never negative, so the roots are real and rational. When k = 2, Δ = 0: the roots are equal (and rational).',
    explanation:
      'a = 1, b = −(k + 2), c = 2k. Δ = (k + 2)² − 4(1)(2k) = k² + 4k + 4 − 8k = k² − 4k + 4 = (k − 2)². A square is never negative, so Δ ≥ 0 and the roots are real; and Δ is the square of the rational number k − 2, so √Δ is rational and so are the roots. When k = 2, Δ = 0, so the two roots are equal.',
    memo: [
      { code: 'SF', marks: 1, text: 'Δ = (k + 2)² − 8k' },
      { code: 'A', marks: 1, text: 'Δ = (k − 2)²' },
      { code: 'R', marks: 1, text: 'a perfect square, ≥ 0: real and rational' },
      { code: 'A', marks: 1, text: 'k = 2: equal roots' },
    ],
  },
)
{
  const [adult, child, sold, takings] = [60, 35, 240, 11650]
  const a = (takings - child * sold) / (adult - child)
  const c = sold - a
  out.push({
    id: 'mty-12-simultaneous-tickets',
    ...t('math-algebra', 12),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A school concert sold ${sold} tickets and took in ${rand(takings)}. The price of an adult ticket was ${rand(adult)} and of a child's ticket ${rand(child)}. Set up two equations and solve them simultaneously to find how many of each were sold.`,
    answer: `${a} adult tickets and ${c} child tickets`,
    explanation: `Let a and c be the numbers of adult and child tickets. a + c = ${sold} and ${adult}a + ${child}c = ${n(takings)}. From the first, c = ${sold} − a. Substitute: ${adult}a + ${child}(${sold} − a) = ${n(takings)}, so ${adult - child}a + ${n(child * sold)} = ${n(takings)} and a = ${n(takings - child * sold)} ÷ ${adult - child} = ${a}. Then c = ${sold} − ${a} = ${c}. Check: ${adult} × ${a} + ${child} × ${c} = ${n(adult * a + child * c)}.`,
    memo: [
      { code: 'A', marks: 1, text: `a + c = ${sold}` },
      { code: 'A', marks: 1, text: `${adult}a + ${child}c = ${n(takings)}` },
      { code: 'M', marks: 1, text: 'substitution' },
      { code: 'CA', marks: 1, text: `a = ${a}; c = ${c}` },
    ],
  })
}
out.push({
  id: 'mty-12-simultaneous-quadratic',
  ...t('math-algebra', 12),
  difficulty: 'Challenge',
  cognitiveLevel: 3,
  marks: 5,
  prompt: 'Solve for x and y simultaneously: y + 1 = 2x and x² − xy + y² = 7.',
  answer: 'x = 2, y = 3 or x = −1, y = −3',
  explanation:
    'From the linear equation, y = 2x − 1. Substitute into the other: x² − x(2x − 1) + (2x − 1)² = 7, so x² − 2x² + x + 4x² − 4x + 1 = 7, which gives 3x² − 3x − 6 = 0 and x² − x − 2 = 0. (x − 2)(x + 1) = 0: x = 2 or x = −1. Then y = 2(2) − 1 = 3, or y = 2(−1) − 1 = −3. Check (2 ; 3): 4 − 6 + 9 = 7 ✓.',
  memo: [
    { code: 'A', marks: 1, text: 'y = 2x − 1' },
    { code: 'M', marks: 1, text: 'substituting into the quadratic equation' },
    { code: 'A', marks: 1, text: 'x² − x − 2 = 0' },
    { code: 'A', marks: 1, text: 'x = 2 or x = −1' },
    { code: 'CA', marks: 1, text: 'y = 3 or y = −3' },
  ],
})

// ============================================================== FUNCTIONS

// --- Grade 10: inequalities read off two graphs
out.push(
  {
    id: 'mty-10-graph-ineq-parabola-line',
    ...t('math-functions', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 6,
    prompt: 'The graphs of f(x) = −x² + 4 and g(x) = x + 2 are drawn. They intersect at A and B. Determine the coordinates of A and B. For which values of x is f(x) ≥ g(x)? For which values of x is f(x) < 0?',
    answer: 'A(−2 ; 0) and B(1 ; 3). f(x) ≥ g(x) for −2 ≤ x ≤ 1. f(x) < 0 for x < −2 or x > 2.',
    explanation:
      'At the intersections f(x) = g(x): −x² + 4 = x + 2, so x² + x − 2 = 0 and (x + 2)(x − 1) = 0: x = −2 or x = 1, with g(−2) = 0 and g(1) = 3. The parabola is ON or ABOVE the line between the two intersections, so −2 ≤ x ≤ 1. f(x) < 0 where the parabola is below the x-axis, outside its x-intercepts ±2: x < −2 or x > 2.',
    memo: [
      { code: 'M', marks: 1, text: '−x² + 4 = x + 2' },
      { code: 'A', marks: 1, text: 'x = −2 or x = 1' },
      { code: 'A', marks: 1, text: 'A(−2 ; 0), B(1 ; 3)' },
      { code: 'RT', marks: 1, text: '−2 ≤ x ≤ 1' },
      { code: 'A', marks: 1, text: 'x-intercepts ±2' },
      { code: 'RT', marks: 1, text: 'x < −2 or x > 2' },
    ],
  },
  {
    id: 'mty-10-graph-ineq-hyperbola-line',
    ...t('math-functions', 10),
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: 'The hyperbola h(x) = 6/x and the straight line g(x) = x + 1 are drawn. Determine the x-coordinates of the points where they intersect. For which values of x is h(x) > g(x)?',
    answer: 'x = −3 and x = 2. h(x) > g(x) for x < −3 or 0 < x < 2.',
    explanation:
      '6/x = x + 1 gives 6 = x² + x, so x² + x − 6 = 0 and (x + 3)(x − 2) = 0: x = −3 or x = 2. Read the graph: the hyperbola is above the line between x = 0 (the asymptote) and x = 2, and again to the left of x = −3. Between −3 and 0 the hyperbola is below the line. x = 0 is excluded because h is undefined there.',
    memo: [
      { code: 'M', marks: 1, text: '6/x = x + 1' },
      { code: 'A', marks: 1, text: 'x = −3 or x = 2' },
      { code: 'RT', marks: 1, text: 'x < −3' },
      { code: 'RT', marks: 1, text: '0 < x < 2' },
      { code: 'R', marks: 1, text: 'x = 0 excluded: the asymptote' },
    ],
  },
  {
    id: 'mty-10-graph-ineq-exponential',
    ...t('math-functions', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'The graph of the exponential function f(x) = 2ˣ − 4 is drawn. Write down the equation of its asymptote and its y-intercept. For which values of x is f(x) > 0? For which values of x is f(x) ≤ −3?',
    answer: 'Asymptote y = −4; y-intercept (0 ; −3). f(x) > 0 for x > 2. f(x) ≤ −3 for x ≤ 0.',
    explanation:
      'The graph of 2ˣ is moved 4 units down, so the asymptote is y = −4 and f(0) = 1 − 4 = −3. f(x) > 0 means 2ˣ > 4 = 2², and since 2ˣ increases, x > 2 (the x-intercept is at x = 2). f(x) ≤ −3 means 2ˣ ≤ 1 = 2⁰, so x ≤ 0: on or to the left of the y-intercept.',
    memo: [
      { code: 'A', marks: 1, text: 'y = −4 and (0 ; −3)' },
      { code: 'A', marks: 1, text: 'x-intercept at x = 2' },
      { code: 'RT', marks: 1, text: 'x > 2' },
      { code: 'RT', marks: 1, text: 'x ≤ 0' },
    ],
  },
)

// =========================================================== TRIGONOMETRY

// --- Grade 11: general solutions
{
  const s = 0.6
  const ref = (Math.asin(s) * 180) / Math.PI
  out.push({
    id: 'mty-11-trig-general-sin',
    ...t('math-trigonometry', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Determine the general solution of 5 sin θ − 3 = 0. Round angles to two decimal places.',
    answer: `θ = ${n(ref)}° + k·360° or θ = ${n(180 - ref)}° + k·360°, k ∈ ℤ`,
    explanation: `sin θ = 3/5 = 0,6. The reference angle is sin⁻¹(0,6) = ${n(ref)}°. Sine is positive in the first and second quadrants: θ = ${n(ref)}° or θ = 180° − ${n(ref)}° = ${n(180 - ref)}°. Sine repeats every 360°, so add k·360° to each, k ∈ ℤ.`,
    memo: [
      { code: 'A', marks: 1, text: 'sin θ = 0,6' },
      { code: 'A', marks: 1, text: `${n(ref)}° + k·360°` },
      { code: 'A', marks: 1, text: `${n(180 - ref)}° + k·360°` },
      { code: 'A', marks: 1, text: 'k ∈ ℤ' },
    ],
  })
}
out.push({
  id: 'mty-11-trig-general-quadratic',
  ...t('math-trigonometry', 11),
  difficulty: 'Challenge',
  cognitiveLevel: 3,
  marks: 5,
  prompt: 'Determine the general solution of 2cos²x − cos x − 1 = 0.',
  answer: 'x = 120° + k·360° or x = 240° + k·360° or x = k·360°, k ∈ ℤ',
  explanation:
    'Treat it as a quadratic in cos x: (2cos x + 1)(cos x − 1) = 0, so cos x = −½ or cos x = 1. cos x = −½: the reference angle is 60°, and cosine is negative in the second and third quadrants, so x = 180° − 60° = 120° or x = 180° + 60° = 240° (+ k·360°). cos x = 1: x = 0° + k·360°.',
  memo: [
    { code: 'A', marks: 1, text: '(2cos x + 1)(cos x − 1) = 0' },
    { code: 'A', marks: 1, text: 'cos x = −½ or cos x = 1' },
    { code: 'A', marks: 1, text: '120° + k·360°' },
    { code: 'A', marks: 1, text: '240° + k·360°' },
    { code: 'A', marks: 1, text: 'k·360°, k ∈ ℤ' },
  ],
})
{
  const ref = (Math.atan(2 / 3) * 180) / Math.PI
  out.push({
    id: 'mty-11-trig-general-tan',
    ...t('math-trigonometry', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Determine the general solution of 3 sin x = 2 cos x, and hence write down the solutions in the interval x ∈ [−180° ; 180°]. Round to two decimal places.',
    answer: `x = ${n(ref)}° + k·180°, k ∈ ℤ; in [−180° ; 180°]: x = ${n(ref)}° or x = ${n(ref - 180)}°`,
    explanation: `Divide both sides by 3 cos x (cos x ≠ 0, since then sin x = ±1 and the equation fails): tan x = 2/3. Reference angle tan⁻¹(2/3) = ${n(ref)}°. Tan repeats every 180°, so x = ${n(ref)}° + k·180°. k = 0 gives ${n(ref)}°; k = −1 gives ${n(ref - 180)}°; any other k falls outside the interval.`,
    memo: [
      { code: 'M', marks: 1, text: 'tan x = sin x/cos x = 2/3' },
      { code: 'A', marks: 1, text: `${n(ref)}° + k·180°, k ∈ ℤ` },
      { code: 'CA', marks: 1, text: `${n(ref)}°` },
      { code: 'CA', marks: 1, text: `${n(ref - 180)}°` },
    ],
  })
}

// ==================================================== ANALYTICAL GEOMETRY

// --- Grade 12: collinear points
{
  const incl = (Math.atan(2) * 180) / Math.PI
  out.push(
    {
      id: 'mty-12-ag-collinear-show',
      ...t('math-analytical-geometry', 12),
      difficulty: 'Moderate',
      cognitiveLevel: 2,
      marks: 5,
      prompt: 'Show that A(−2 ; −1), B(1 ; 5) and C(3 ; 9) are collinear. Determine the equation of the line through them and its angle of inclination.',
      answer: `m(AB) = m(BC) = 2 and B is common, so A, B and C are collinear. y = 2x + 3; inclination ${n(incl)}°.`,
      explanation: `m(AB) = (5 − (−1))/(1 − (−2)) = 6/3 = 2 and m(BC) = (9 − 5)/(3 − 1) = 4/2 = 2. Equal gradients alone only make the lines parallel; because the two segments share the point B, they lie on ONE line. y − 5 = 2(x − 1), so y = 2x + 3. tan θ = 2, so θ = ${n(incl)}°.`,
      memo: [
        { code: 'A', marks: 1, text: 'm(AB) = 2' },
        { code: 'A', marks: 1, text: 'm(BC) = 2' },
        { code: 'R', marks: 1, text: 'equal gradients and a common point B' },
        { code: 'A', marks: 1, text: 'y = 2x + 3' },
        { code: 'A', marks: 1, text: `θ = ${n(incl)}°` },
      ],
    },
    {
      id: 'mty-12-ag-collinear-find-k',
      ...t('math-analytical-geometry', 12),
      difficulty: 'Moderate',
      cognitiveLevel: 3,
      marks: 3,
      prompt: 'P(k ; 7), Q(1 ; 1) and R(−1 ; −3) are collinear. Determine the value of k.',
      answer: 'k = 4',
      explanation: 'Collinear points give equal gradients. m(QR) = (1 − (−3))/(1 − (−1)) = 4/2 = 2. So m(PQ) = (7 − 1)/(k − 1) = 2, which gives 6 = 2(k − 1) and k = 4. Check: m(PQ) = 6/3 = 2.',
      memo: [
        { code: 'A', marks: 1, text: 'm(QR) = 2' },
        { code: 'M', marks: 1, text: '(7 − 1)/(k − 1) = 2' },
        { code: 'CA', marks: 1, text: 'k = 4' },
      ],
    },
  )
}

// ============================================================= STATISTICS

// --- Grade 11: cumulative frequency and ogives
{
  const classes = [0, 20, 40, 60, 80, 100]
  const freq = [4, 9, 20, 18, 9]
  const total = freq.reduce((a, b) => a + b, 0)
  const cum = freq.map((_, i) => freq.slice(0, i + 1).reduce((a, b) => a + b, 0))
  const half = total / 2
  const mi = cum.findIndex((c) => c >= half)
  const below = mi === 0 ? 0 : cum[mi - 1]
  const median = classes[mi] + ((half - below) / freq[mi]) * (classes[mi + 1] - classes[mi])
  const table = `|+ TABLE: TEST MARKS (%) OF ${total} LEARNERS\n| Marks | Frequency | Cumulative frequency |\n|---|---|---|\n${freq.map((f, i) => `| ${classes[i]} ≤ x < ${classes[i + 1]} | ${f} | ${i < 2 ? cum[i] : '?'} |`).join('\n')}`
  out.push({
    id: 'mty-11-ogive-table',
    ...t('math-statistics', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 6,
    context: table,
    prompt: 'Complete the cumulative frequency column. Write down the coordinates of the points you would plot to draw the ogive. How many learners scored less than 40%? In which class does the median lie, and estimate the median.',
    answer: `Cumulative frequencies ${cum.join('; ')}. Points: (0 ; 0), ${classes.slice(1).map((c, i) => `(${c} ; ${cum[i]})`).join(', ')}. ${cum[1]} learners scored below 40%. The median lies in ${classes[mi]} ≤ x < ${classes[mi + 1]}; estimate ≈ ${n(median, 0)}%.`,
    explanation: `Add each frequency to the total before it: ${cum.join('; ')}. An ogive plots each cumulative frequency against the UPPER boundary of its class, starting at (0 ; 0). Below 40%: the cumulative frequency at 40 is ${cum[1]}. The median is the ${half}th value; ${below} learners are below ${classes[mi]} and ${cum[mi]} below ${classes[mi + 1]}, so it lies in that class. Reading the ogive at a cumulative frequency of ${half}: ${classes[mi]} + (${half} − ${below})/${freq[mi]} × ${classes[mi + 1] - classes[mi]} ≈ ${n(median, 0)}%.`,
    memo: [
      { code: 'A', marks: 1, text: `${cum.slice(2).join('; ')}` },
      { code: 'M', marks: 1, text: 'upper class boundaries, starting at (0 ; 0)' },
      { code: 'A', marks: 1, text: 'the points' },
      { code: 'RT', marks: 1, text: `${cum[1]}` },
      { code: 'A', marks: 1, text: `${classes[mi]} ≤ x < ${classes[mi + 1]}` },
      { code: 'CA', marks: 1, text: `≈ ${n(median, 0)}%` },
    ],
  })
}
{
  const upper = [10, 20, 30, 40, 50, 60]
  const cum = [6, 22, 50, 68, 76, 80]
  const total = cum[cum.length - 1]
  const freq = cum.map((c, i) => (i === 0 ? c : c - cum[i - 1]))
  const modal = freq.indexOf(Math.max(...freq))
  out.push({
    id: 'mty-11-ogive-read',
    ...t('math-statistics', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    context: `The ogive of the times (in minutes) that ${total} commuters took to get to work passes through these points (upper class boundary ; cumulative frequency):\n|+ TABLE: POINTS ON THE OGIVE\n| Time (minutes) | 0 | ${upper.join(' | ')} |\n|---|---|${upper.map(() => '---').join('|')}|\n| Cumulative frequency | 0 | ${cum.join(' | ')} |`,
    prompt: 'How many commuters took at least 20 minutes but less than 40 minutes? What percentage took 40 minutes or longer? How many took between 30 and 40 minutes, and which is the modal class?',
    answer: `${cum[3] - cum[1]} commuters; ${n(((total - cum[3]) / total) * 100)}%; ${freq[3]} commuters; modal class ${upper[modal] - 10} ≤ t < ${upper[modal]} (${freq[modal]} commuters).`,
    explanation: `Between two boundaries, subtract the cumulative frequencies: ${cum[3]} − ${cum[1]} = ${cum[3] - cum[1]}. 40 minutes or longer: ${total} − ${cum[3]} = ${total - cum[3]}, and ${total - cum[3]} ÷ ${total} × 100 = ${n(((total - cum[3]) / total) * 100)}%. The class 30 ≤ t < 40: ${cum[3]} − ${cum[2]} = ${freq[3]}. Class frequencies: ${freq.join('; ')}; the largest, ${freq[modal]}, is in ${upper[modal] - 10} ≤ t < ${upper[modal]}, where the ogive is steepest.`,
    memo: [
      { code: 'RT', marks: 1, text: `${cum[3]} − ${cum[1]} = ${cum[3] - cum[1]}` },
      { code: 'M', marks: 1, text: `(${total} − ${cum[3]}) ÷ ${total} × 100` },
      { code: 'A', marks: 1, text: `${n(((total - cum[3]) / total) * 100)}%` },
      { code: 'A', marks: 1, text: `${freq[3]}` },
      { code: 'A', marks: 1, text: `${upper[modal] - 10} ≤ t < ${upper[modal]}` },
    ],
  })
}

// --- Grade 12: outliers
{
  const data = [12, 15, 17, 18, 18, 20, 21, 22, 23, 24, 25, 26, 28, 30, 52]
  const med = (xs: number[]) => (xs.length % 2 ? xs[(xs.length - 1) / 2] : (xs[xs.length / 2 - 1] + xs[xs.length / 2]) / 2)
  const half = Math.floor(data.length / 2)
  const q1 = med(data.slice(0, half))
  const q3 = med(data.slice(data.length - half))
  const m = med(data)
  const iqr = q3 - q1
  const lo = q1 - 1.5 * iqr
  const hi = q3 + 1.5 * iqr
  const outliers = data.filter((x) => x < lo || x > hi)
  out.push({
    id: 'mty-12-outliers-iqr',
    ...t('math-statistics', 12),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    context: `The number of push-ups ${data.length} learners did in one minute: ${data.join('; ')}.`,
    prompt: 'Determine the five-number summary and the interquartile range. Use the rule that a value more than 1,5 × IQR below the lower quartile or above the upper quartile is an outlier to identify any outliers.',
    answer: `Minimum ${data[0]}; Q1 = ${q1}; median ${m}; Q3 = ${q3}; maximum ${data[data.length - 1]}. IQR = ${iqr}. Fences ${n(lo)} and ${n(hi)}: ${outliers.join(', ')} is an outlier.`,
    explanation: `The data are already in order. Median = the ${(data.length + 1) / 2}th value = ${m}. Q1 is the median of the ${half} values below it (${q1}); Q3 of the ${half} above it (${q3}). IQR = ${q3} − ${q1} = ${iqr}; 1,5 × IQR = ${n(1.5 * iqr)}. Lower fence ${q1} − ${n(1.5 * iqr)} = ${n(lo)}; upper fence ${q3} + ${n(1.5 * iqr)} = ${n(hi)}. Only ${outliers.join(', ')} lies outside them.`,
    memo: [
      { code: 'A', marks: 1, text: `median ${m}` },
      { code: 'A', marks: 1, text: `Q1 = ${q1}, Q3 = ${q3}, min ${data[0]}, max ${data[data.length - 1]}` },
      { code: 'A', marks: 1, text: `IQR = ${iqr}` },
      { code: 'M', marks: 1, text: `fences ${n(lo)} and ${n(hi)}` },
      { code: 'CA', marks: 1, text: `${outliers.join(', ')} is an outlier` },
    ],
  })
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
  const sd = (xs: number[]) => Math.sqrt(xs.reduce((a, x) => a + (x - mean(xs)) ** 2, 0) / xs.length)
  const without = data.filter((x) => !outliers.includes(x))
  out.push({
    id: 'mty-12-outlier-effect',
    ...t('math-statistics', 12),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    context: `The number of push-ups ${data.length} learners did in one minute: ${data.join('; ')}. The value ${outliers[0]} is an outlier.`,
    prompt: `Calculate the mean and the standard deviation with and without the outlier, correct to two decimal places. Explain which measure of central tendency better describes the typical learner, and why.`,
    answer: `With ${outliers[0]}: mean ${n(mean(data))}, standard deviation ${n(sd(data))}. Without: mean ${n(mean(without))}, standard deviation ${n(sd(without))}. The median (${m}) is better: it is not pulled up by the one extreme value, while the mean is.`,
    explanation: `Use the statistics mode of the calculator (population standard deviation, σ). With all ${data.length} values: x̄ = ${data.reduce((a, b) => a + b, 0)} ÷ ${data.length} = ${n(mean(data))} and σ = ${n(sd(data))}. Without ${outliers[0]}: x̄ = ${without.reduce((a, b) => a + b, 0)} ÷ ${without.length} = ${n(mean(without))} and σ = ${n(sd(without))}. One value moved the mean up by ${n(mean(data) - mean(without))} and the standard deviation by ${n(sd(data) - sd(without))}; the median hardly changes (${m} to ${n(med(without))}).`,
    memo: [
      { code: 'A', marks: 1, text: `x̄ = ${n(mean(data))}, σ = ${n(sd(data))}` },
      { code: 'A', marks: 1, text: `x̄ = ${n(mean(without))}` },
      { code: 'A', marks: 1, text: `σ = ${n(sd(without))}` },
      { code: 'A', marks: 1, text: 'the median' },
      { code: 'R', marks: 1, text: 'the mean (and σ) is affected by the outlier; the median is not' },
    ],
  })
}

// ================================================================ FINANCE

// --- Grade 10: inflation and population growth
{
  const p = 18.5
  const i = 0.058
  const yrs = 6
  const a = p * (1 + i) ** yrs
  out.push({
    id: 'mty-10-inflation',
    ...t('math-finance-growth', 10),
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A loaf of bread costs ${rand(p)} today. If inflation averages ${n(i * 100, 1)}% per year, use the compound growth formula to calculate what the loaf will cost in ${yrs} years' time.`,
    answer: rand(a),
    explanation: `Inflation compounds: each year's price increase is on the previous year's price. A = P(1 + i)ⁿ = ${n(p)}(1 + 0,058)^${yrs} = ${n(p)} × ${n((1 + i) ** yrs, 4)} = ${rand(a)}.`,
    memo: [
      { code: 'SF', marks: 1, text: `A = ${n(p)}(1 + 0,058)^${yrs}` },
      { code: 'M', marks: 1, text: 'compound growth formula' },
      { code: 'A', marks: 1, text: rand(a) },
    ],
  })
  const pop = 45000
  const g = 0.023
  const y2 = 8
  out.push({
    id: 'mty-10-population',
    ...t('math-finance-growth', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `The population of a town is ${n(pop)} and shows compound growth of ${n(g * 100, 1)}% per year. Calculate the population after ${y2} years, and the increase over the ${y2} years.`,
    answer: `${n(Math.round(pop * (1 + g) ** y2))}; an increase of ${n(Math.round(pop * (1 + g) ** y2) - pop)}`,
    explanation: `Population growth is compound growth: A = P(1 + i)ⁿ = ${n(pop)}(1,023)^${y2} = ${n(pop * (1 + g) ** y2)}. People come in whole numbers: ${n(Math.round(pop * (1 + g) ** y2))}. Increase: ${n(Math.round(pop * (1 + g) ** y2))} − ${n(pop)} = ${n(Math.round(pop * (1 + g) ** y2) - pop)}.`,
    memo: [
      { code: 'SF', marks: 1, text: `${n(pop)}(1,023)^${y2}` },
      { code: 'A', marks: 1, text: n(Math.round(pop * (1 + g) ** y2)) },
      { code: 'M', marks: 1, text: 'subtracting the starting population' },
      { code: 'CA', marks: 1, text: n(Math.round(pop * (1 + g) ** y2) - pop) },
    ],
  })
}

// --- Grade 10: hire purchase
{
  const price = 12600
  const deposit = 0.1 * price
  const bal = price - deposit
  const r = 0.14
  const yrs = 3
  const interest = bal * r * yrs
  const inst = (bal + interest) / (yrs * 12)
  out.push({
    id: 'mty-10-hire-purchase-instalment',
    ...t('math-finance-growth', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 5,
    prompt: `A fridge costs ${rand(price)}. It is bought on hire purchase with a 10% deposit; the balance is charged ${n(r * 100)}% simple interest per year over ${yrs} years. Calculate the monthly instalment, and how much more than the cash price the fridge costs in total.`,
    answer: `Instalment ${rand(inst)}; ${rand(interest)} more than the cash price (total ${rand(deposit + bal + interest)})`,
    explanation: `Deposit = 10% × ${rand(price)} = ${rand(deposit)}; balance = ${rand(bal)}. Hire purchase charges SIMPLE interest on the balance after the deposit: ${rand(bal)} × ${n(r)} × ${yrs} = ${rand(interest)}. ${rand(bal + interest)} is repaid over ${yrs * 12} months: ${rand(bal + interest)} ÷ ${yrs * 12} = ${rand(inst)}. In total ${rand(deposit)} + ${rand(bal + interest)} = ${rand(deposit + bal + interest)}, which is the interest, ${rand(interest)}, more than the cash price.`,
    memo: [
      { code: 'A', marks: 1, text: `balance ${rand(bal)}` },
      { code: 'SF', marks: 1, text: `${rand(bal)} × ${n(r)} × ${yrs}` },
      { code: 'M', marks: 1, text: `÷ ${yrs * 12}` },
      { code: 'CA', marks: 1, text: rand(inst) },
      { code: 'CA', marks: 1, text: `${rand(interest)} more` },
    ],
  })
}
// --- Grade 11: effective and nominal rates; compound decay
{
  const effM = (1 + 0.09 / 12) ** 12 - 1
  const effQ = (1 + 0.092 / 4) ** 4 - 1
  out.push({
    id: 'mty-11-effective-compare',
    ...t('math-finance-growth', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: 'Bank A offers 9% per year compounded monthly. Bank B offers 9,2% per year compounded quarterly. Calculate the effective annual rate of each, and state which is the better investment.',
    answer: `Bank A: ${n(effM * 100)}%; Bank B: ${n(effQ * 100)}%. Bank ${effQ > effM ? 'B' : 'A'} is better.`,
    explanation: `1 + i_eff = (1 + i_nom/m)^m. Bank A: (1 + 0,09/12)¹² − 1 = ${n(effM, 5)} = ${n(effM * 100)}%. Bank B: (1 + 0,092/4)⁴ − 1 = ${n(effQ, 5)} = ${n(effQ * 100)}%. Nominal rates with different compounding periods cannot be compared directly; effective rates can.`,
    memo: [
      { code: 'SF', marks: 1, text: '(1 + 0,09/12)¹² − 1' },
      { code: 'A', marks: 1, text: `${n(effM * 100)}%` },
      { code: 'SF', marks: 1, text: '(1 + 0,092/4)⁴ − 1' },
      { code: 'A', marks: 1, text: `${n(effQ * 100)}%` },
      { code: 'CA', marks: 1, text: `Bank ${effQ > effM ? 'B' : 'A'}` },
    ],
  })
  const nom = 12 * (1.1 ** (1 / 12) - 1)
  out.push({
    id: 'mty-11-nominal-from-effective',
    ...t('math-finance-growth', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'An investment earns an effective rate of 10% per year. Calculate the equivalent nominal rate per year compounded monthly.',
    answer: `${n(nom * 100)}% per year compounded monthly`,
    explanation: `1 + 0,1 = (1 + i/12)¹², so 1 + i/12 = 1,1^(1/12) = ${n(1.1 ** (1 / 12), 6)} and i = 12 × ${n(1.1 ** (1 / 12) - 1, 6)} = ${n(nom, 5)} = ${n(nom * 100)}%. The nominal rate is lower than the effective rate, because monthly compounding adds interest on interest during the year.`,
    memo: [
      { code: 'SF', marks: 1, text: '1,1 = (1 + i/12)¹²' },
      { code: 'M', marks: 1, text: 'taking the 12th root' },
      { code: 'A', marks: 1, text: `${n(nom * 100)}%` },
    ],
  })
  const herd = 1800
  const drop = 0.06
  const y = 5
  out.push({
    id: 'mty-11-population-decline',
    ...t('math-finance-growth', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: `A rhino population of ${n(herd)} is declining at ${drop * 100}% per year because of poaching. Use compound decay to estimate the population after ${y} years, and the number of rhinos lost.`,
    answer: `About ${n(Math.round(herd * (1 - drop) ** y))} rhinos; ${n(herd - Math.round(herd * (1 - drop) ** y))} lost`,
    explanation: `Compound decay: A = P(1 − i)ⁿ = ${n(herd)}(1 − 0,06)^${y} = ${n(herd)} × ${n((1 - drop) ** y, 4)} = ${n(herd * (1 - drop) ** y)}, about ${n(Math.round(herd * (1 - drop) ** y))}. Lost: ${n(herd)} − ${n(Math.round(herd * (1 - drop) ** y))} = ${n(herd - Math.round(herd * (1 - drop) ** y))}. Using 6% × ${y} = 30% of the starting number would be simple decay, which overstates the loss.`,
    memo: [
      { code: 'SF', marks: 1, text: `${n(herd)}(1 − 0,06)^${y}` },
      { code: 'A', marks: 1, text: n(Math.round(herd * (1 - drop) ** y)) },
      { code: 'CA', marks: 1, text: n(herd - Math.round(herd * (1 - drop) ** y)) },
    ],
  })
}

// --- Grade 12: inflation into a sinking fund (and a Grade 10 hire-purchase rate)
{
  const today = 2000000
  const infl = 0.055
  const yrs = 25
  const target = today * (1 + infl) ** yrs
  const i = 0.1 / 12
  const nPay = yrs * 12
  const x = (target * i) / ((1 + i) ** nPay - 1)
  out.push({
    id: 'mty-12-inflation-sinking-fund',
    ...t('math-finance-growth', 12),
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 6,
    prompt: `Sipho wants to retire in ${yrs} years with savings worth ${rand(today)} in today's money. Inflation is expected to average ${n(infl * 100, 1)}% per year. Calculate the amount he needs in ${yrs} years' time, and the monthly deposit he must make into a sinking fund earning 10% per year compounded monthly to reach it. His first payment is in one month and his last on the day he retires.`,
    answer: `Target ${rand(target)}; monthly payment ${rand(x)}`,
    explanation: `Inflation first: ${rand(today)}(1,055)^${yrs} = ${rand(target)}. This is the future value of ${nPay} monthly payments: F = x[(1 + i)ⁿ − 1]/i with i = 0,1/12 and n = ${nPay}. So x = ${rand(target)} × (0,1/12) ÷ [(1 + 0,1/12)^${nPay} − 1] = ${rand(x)}. Saving for ${rand(today)} without allowing for inflation would leave him with about a quarter of the buying power he planned for.`,
    memo: [
      { code: 'SF', marks: 1, text: `${rand(today)}(1,055)^${yrs}` },
      { code: 'A', marks: 1, text: rand(target) },
      { code: 'A', marks: 1, text: `i = 0,1/12 and n = ${nPay}` },
      { code: 'SF', marks: 1, text: `${rand(target)} = x[(1 + 0,1/12)^${nPay} − 1]/(0,1/12)` },
      { code: 'M', marks: 1, text: 'making x the subject' },
      { code: 'CA', marks: 1, text: rand(x) },
    ],
  })
}
{
  const cash = 8999
  const inst = 420
  const months = 30
  const total = inst * months
  const rate = (total - cash) / (cash * (months / 12))
  out.push({
    id: 'mty-10-hire-purchase-rate',
    ...t('math-finance-growth', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A television costs ${rand(cash)} cash. On hire purchase it costs no deposit and ${months} monthly instalments of ${rand(inst)}. Calculate the simple interest rate per year charged on the hire-purchase agreement.`,
    answer: `${n(rate * 100, 1)}% per year`,
    explanation: `Total paid = ${months} × ${rand(inst)} = ${rand(total)}. Interest = ${rand(total)} − ${rand(cash)} = ${rand(total - cash)}. Hire purchase is simple interest on the amount financed: I = Pin, with n = ${months}/12 = ${n(months / 12, 1)} years. So i = ${n(total - cash)} ÷ (${n(cash)} × ${n(months / 12, 1)}) = ${n(rate, 4)} = ${n(rate * 100, 1)}%.`,
    memo: [
      { code: 'A', marks: 1, text: `total ${rand(total)}` },
      { code: 'A', marks: 1, text: `interest ${rand(total - cash)}` },
      { code: 'SF', marks: 1, text: `${n(total - cash)} = ${n(cash)} × i × ${n(months / 12, 1)}` },
      { code: 'CA', marks: 1, text: `${n(rate * 100, 1)}%` },
    ],
  })
}

// ======================================================== NUMBER PATTERNS

// --- Grade 11: which term has a given value
{
  // 3; 8; 15; 24; ...  Tₙ = n² + 2n
  const target = 399
  const k = (-2 + Math.sqrt(4 + 4 * target)) / 2
  out.push({
    id: 'mty-11-which-term-quadratic',
    ...t('math-number-patterns', 11),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `Consider the quadratic pattern 3; 8; 15; 24; … Determine the general term, and which term of the pattern is equal to ${target}.`,
    answer: `Tₙ = n² + 2n; T${k} = ${target}, so it is the ${k}th term.`,
    explanation: `First differences 5; 7; 9; second difference 2, so 2a = 2 and a = 1. 3a + b = 5 gives b = 2; a + b + c = 3 gives c = 0. Tₙ = n² + 2n. Set n² + 2n = ${target}: n² + 2n − ${target} = 0, so (n + ${k + 2})(n − ${k}) = 0 and n = ${k} (n must be a positive integer). Check: ${k}² + 2(${k}) = ${k * k + 2 * k}.`,
    memo: [
      { code: 'A', marks: 1, text: 'second difference 2, a = 1' },
      { code: 'A', marks: 1, text: 'b = 2, c = 0' },
      { code: 'M', marks: 1, text: `n² + 2n = ${target}` },
      { code: 'A', marks: 1, text: `(n + ${k + 2})(n − ${k}) = 0` },
      { code: 'CA', marks: 1, text: `n = ${k}` },
    ],
  })
  const a = 7
  const d = 4
  const v1 = 251
  const v2 = 302
  out.push({
    id: 'mty-11-which-term-linear',
    ...t('math-number-patterns', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `Consider the linear pattern ${a}; ${a + d}; ${a + 2 * d}; ${a + 3 * d}; … Which term is equal to ${v1}? Is ${v2} a term of the pattern? Justify your answer.`,
    answer: `Tₙ = ${d}n + ${a - d}; ${v1} is term ${(v1 - (a - d)) / d}. ${v2} is not a term: it would need n = ${n((v2 - (a - d)) / d)}, which is not a natural number.`,
    explanation: `Constant difference ${d}, so Tₙ = ${d}n + ${a - d} (T₁ = ${a}). ${d}n + ${a - d} = ${v1} gives ${d}n = ${v1 - (a - d)} and n = ${(v1 - (a - d)) / d}. ${d}n + ${a - d} = ${v2} gives n = ${v2 - (a - d)}/${d} = ${n((v2 - (a - d)) / d)}. A term number must be a natural number, so ${v2} is not in the pattern.`,
    memo: [
      { code: 'A', marks: 1, text: `Tₙ = ${d}n + ${a - d}` },
      { code: 'A', marks: 1, text: `n = ${(v1 - (a - d)) / d}` },
      { code: 'A', marks: 1, text: `n = ${n((v2 - (a - d)) / d)}` },
      { code: 'R', marks: 1, text: 'n is not a natural number' },
    ],
  })
}

// ============================================================ PROBABILITY

// --- Grade 10: Venn diagrams
{
  const total = 40
  const [s, nb, both] = [22, 15, 6]
  const neither = total - (s + nb - both)
  out.push({
    id: 'mty-10-venn-counts',
    ...t('math-counting-probability', 10),
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 5,
    context: `In a class of ${total} learners, ${s} play soccer (S), ${nb} play netball (N) and ${both} play both.`,
    prompt: 'Draw a Venn diagram to show the information. How many learners play neither sport? If a learner is chosen at random, determine the probability that the learner plays soccer only, and the probability that the learner plays soccer or netball.',
    answer: `Regions: soccer only ${s - both}, both ${both}, netball only ${nb - both}, neither ${neither}. Neither: ${neither}. P(soccer only) = ${s - both}/${total} = ${n((s - both) / total)}. P(S or N) = ${s + nb - both}/${total} = ${n((s + nb - both) / total, 3)}.`,
    explanation: `Fill the overlap FIRST: ${both} play both. Soccer only = ${s} − ${both} = ${s - both}; netball only = ${nb} − ${both} = ${nb - both}. Neither = ${total} − (${s - both} + ${both} + ${nb - both}) = ${neither}. P(S or N) = P(S) + P(N) − P(S and N) = (${s} + ${nb} − ${both})/${total} = ${s + nb - both}/${total}: the ${both} who play both would be counted twice otherwise.`,
    memo: [
      { code: 'A', marks: 1, text: `${both} in the overlap` },
      { code: 'A', marks: 1, text: `${s - both} and ${nb - both} in the outer regions` },
      { code: 'CA', marks: 1, text: `${neither} play neither` },
      { code: 'CA', marks: 1, text: `${s - both}/${total}` },
      { code: 'CA', marks: 1, text: `${s + nb - both}/${total}` },
    ],
  })
}
{
  const total = 50
  const [g, h, neither] = [28, 30, 4]
  const both = g + h + neither - total
  out.push({
    id: 'mty-10-venn-unknown-overlap',
    ...t('math-counting-probability', 10),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    context: `In a survey of ${total} learners, ${g} take Geography (G), ${h} take History (H) and ${neither} take neither.`,
    prompt: 'Let x be the number of learners who take both subjects. Draw a Venn diagram in terms of x, and calculate x. Then determine the probability that a learner chosen at random takes exactly one of the two subjects.',
    answer: `(${g} − x) + x + (${h} − x) + ${neither} = ${total}, so x = ${both}. P(exactly one) = ${g - both + h - both}/${total} = ${n((g - both + h - both) / total)}.`,
    explanation: `Regions: Geography only ${g} − x, both x, History only ${h} − x, neither ${neither}. They add up to ${total}: ${g + h + neither} − x = ${total}, so x = ${both}. Exactly one: ${g - both} + ${h - both} = ${g - both + h - both}, so P = ${g - both + h - both}/${total}. ${g} + ${h} = ${g + h} is more than the ${total - neither} who take a subject -- the overlap is what accounts for the difference.`,
    memo: [
      { code: 'A', marks: 1, text: `regions ${g} − x, x, ${h} − x, ${neither}` },
      { code: 'M', marks: 1, text: `the regions add up to ${total}` },
      { code: 'A', marks: 1, text: `x = ${both}` },
      { code: 'CA', marks: 1, text: `${g - both + h - both}/${total}` },
    ],
  })
}
out.push({
  id: 'mty-10-venn-probabilities',
  ...t('math-counting-probability', 10),
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 4,
  context: 'For two events, P(A) = 0,45, P(B) = 0,3 and P(A or B) = 0,6.',
  prompt: 'Calculate P(A and B) and draw a Venn diagram showing the probability in each region. Determine whether A and B are mutually exclusive, and the probability that neither A nor B happens.',
  answer: 'P(A and B) = 0,15. Not mutually exclusive, because P(A and B) ≠ 0. P(neither) = 0,4.',
  explanation:
    'P(A or B) = P(A) + P(B) − P(A and B), so 0,6 = 0,45 + 0,3 − P(A and B) and P(A and B) = 0,15. Regions: A only 0,45 − 0,15 = 0,3; both 0,15; B only 0,3 − 0,15 = 0,15; outside 1 − 0,6 = 0,4. Mutually exclusive events cannot happen together, so they would have P(A and B) = 0.',
  memo: [
    { code: 'SF', marks: 1, text: '0,6 = 0,45 + 0,3 − P(A and B)' },
    { code: 'A', marks: 1, text: '0,15' },
    { code: 'R', marks: 1, text: 'not mutually exclusive: P(A and B) ≠ 0' },
    { code: 'A', marks: 1, text: 'P(neither) = 0,4' },
  ],
})

// --- Grade 11: Venn diagrams and independence; contingency tables
out.push({
  id: 'mty-11-venn-independent',
  ...t('math-counting-probability', 11),
  difficulty: 'Moderate',
  cognitiveLevel: 2,
  marks: 4,
  context: 'A and B are independent events with P(A) = 0,4 and P(B) = 0,5.',
  prompt: 'Calculate P(A and B) and P(A or B), and draw a Venn diagram showing the probability in each region. What is the probability that only A happens?',
  answer: 'P(A and B) = 0,2; P(A or B) = 0,7; P(only A) = 0,2.',
  explanation:
    'For independent events P(A and B) = P(A) × P(B) = 0,4 × 0,5 = 0,2. P(A or B) = 0,4 + 0,5 − 0,2 = 0,7. Regions: A only 0,4 − 0,2 = 0,2; both 0,2; B only 0,5 − 0,2 = 0,3; outside 1 − 0,7 = 0,3. Independent is not the same as mutually exclusive: these events overlap.',
  memo: [
    { code: 'M', marks: 1, text: 'P(A) × P(B) for independent events' },
    { code: 'A', marks: 1, text: '0,2' },
    { code: 'CA', marks: 1, text: '0,7' },
    { code: 'CA', marks: 1, text: 'only A: 0,2' },
  ],
})
{
  const total = 120
  const [a, b, both] = [48, 50, 20]
  const pa = a / total
  const pb = b / total
  out.push({
    id: 'mty-11-venn-test-independence',
    ...t('math-counting-probability', 11),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    context: `In a group of ${total} learners, ${a} study Accounting (A), ${b} study Biology (B) and ${both} study both.`,
    prompt: 'Draw a Venn diagram. Determine, with calculations, whether studying Accounting and studying Biology are independent events.',
    answer: `Regions: A only ${a - both}, both ${both}, B only ${b - both}, neither ${total - (a + b - both)}. P(A) × P(B) = ${a}/${total} × ${b}/${total} = ${n(pa * pb, 4)} = P(A and B) = ${both}/${total}, so the events are ${Math.abs(pa * pb - both / total) < 1e-9 ? 'independent' : 'not independent'}.`,
    explanation: `P(A) = ${a}/${total} = ${n(pa, 4)}; P(B) = ${b}/${total} = ${n(pb, 4)}; P(A) × P(B) = ${n(pa * pb, 4)}. P(A and B) = ${both}/${total} = ${n(both / total, 4)}. They are equal, so the events are independent: knowing a learner studies Accounting does not change the chance that they study Biology. Use the exact fractions (1/6 both ways) rather than rounded decimals to decide.`,
    memo: [
      { code: 'A', marks: 1, text: `Venn regions ${a - both}; ${both}; ${b - both}; ${total - (a + b - both)}` },
      { code: 'A', marks: 1, text: `P(A) = ${a}/${total}, P(B) = ${b}/${total}` },
      { code: 'M', marks: 1, text: 'comparing P(A) × P(B) with P(A and B)' },
      { code: 'A', marks: 1, text: `both equal ${both}/${total}` },
      { code: 'C', marks: 1, text: 'independent' },
    ],
  })
}
{
  // homework vs passed: dependent
  const [hp, hf, np, nf] = [72, 8, 18, 22]
  const total = hp + hf + np + nf
  const pH = (hp + hf) / total
  const pP = (hp + np) / total
  out.push({
    id: 'mty-11-contingency-dependent',
    ...t('math-counting-probability', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    context: `|+ TABLE: HOMEWORK AND TEST RESULTS OF ${total} LEARNERS (a two-way table)\n| | Passed | Failed | Total |\n|---|---|---|---|\n| Did the homework | ${hp} | ${hf} | ${hp + hf} |\n| Did not do the homework | ${np} | ${nf} | ${np + nf} |\n| Total | ${hp + np} | ${hf + nf} | ${total} |`,
    prompt: 'A learner is chosen at random. Determine the probability that the learner did the homework, the probability that the learner passed, and whether doing the homework and passing are independent events.',
    answer: `P(homework) = ${hp + hf}/${total} = ${n(pH, 4)}; P(passed) = ${hp + np}/${total} = ${n(pP, 2)}. P(homework) × P(passed) = ${n(pH * pP, 2)}, but P(homework and passed) = ${hp}/${total} = ${n(hp / total, 2)}, so they are NOT independent.`,
    explanation: `Totals come from the margins of the table: ${hp + hf} did the homework and ${hp + np} passed. The joint probability comes from the cell where the row and column meet: ${hp}/${total} = ${n(hp / total, 2)}. If the events were independent, this would equal ${n(pH, 4)} × ${n(pP, 2)} = ${n(pH * pP, 2)}. It is larger: learners who did the homework passed more often than the others.`,
    memo: [
      { code: 'RT', marks: 1, text: `P(homework) = ${hp + hf}/${total}` },
      { code: 'RT', marks: 1, text: `P(passed) = ${hp + np}/${total}` },
      { code: 'A', marks: 1, text: `P(homework) × P(passed) = ${n(pH * pP, 2)}` },
      { code: 'RT', marks: 1, text: `P(homework and passed) = ${hp}/${total}` },
      { code: 'C', marks: 1, text: 'not independent' },
    ],
  })
}
{
  // public transport by gender, with gaps: independent
  const [my, mn, fy, fn] = [60, 40, 90, 60]
  const total = my + mn + fy + fn
  out.push({
    id: 'mty-11-contingency-complete',
    ...t('math-counting-probability', 11),
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 6,
    context: `|+ TABLE: DO YOU USE PUBLIC TRANSPORT? (a two-way table)\n| | Yes | No | Total |\n|---|---|---|---|\n| Male | ${my} | a | ${my + mn} |\n| Female | b | ${fn} | c |\n| Total | ${my + fy} | ${mn + fn} | ${total} |`,
    prompt: 'Calculate the values of a, b and c. Then determine whether being male and using public transport are independent events.',
    answer: `a = ${mn}, b = ${fy}, c = ${fy + fn}. P(male) × P(yes) = ${n((my + mn) / total, 1)} × ${n((my + fy) / total, 1)} = ${n((((my + mn) / total) * (my + fy)) / total, 2)} = P(male and yes) = ${my}/${total}, so the events are independent.`,
    explanation: `Rows and columns add up to their totals: a = ${my + mn} − ${my} = ${mn}; b = ${my + fy} − ${my} = ${fy}; c = ${total} − ${my + mn} = ${fy + fn} (check: ${fy} + ${fn} = ${fy + fn}). P(male) = ${my + mn}/${total} = ${n((my + mn) / total, 1)}; P(yes) = ${my + fy}/${total} = ${n((my + fy) / total, 1)}; their product is ${n((((my + mn) / total) * (my + fy)) / total, 2)}. P(male and yes) = ${my}/${total} = ${n(my / total, 2)}. Equal, so independent.`,
    memo: [
      { code: 'A', marks: 1, text: `a = ${mn}` },
      { code: 'A', marks: 1, text: `b = ${fy}` },
      { code: 'A', marks: 1, text: `c = ${fy + fn}` },
      { code: 'A', marks: 1, text: `P(male) × P(yes) = ${n((((my + mn) / total) * (my + fy)) / total, 2)}` },
      { code: 'A', marks: 1, text: `P(male and yes) = ${n(my / total, 2)}` },
      { code: 'C', marks: 1, text: 'independent' },
    ],
  })
}

// --- Grade 12: Venn diagram and contingency tables
{
  const total = 80
  const [w, tk, neither] = [45, 38, 12]
  const both = w + tk + neither - total
  const pw = w / total
  const pt = tk / total
  out.push({
    id: 'mty-12-venn-apps',
    ...t('math-counting-probability', 12),
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 6,
    context: `In a group of ${total} learners, ${w} use WhatsApp (W), ${tk} use TikTok (T) and ${neither} use neither.`,
    prompt: 'Draw a Venn diagram and determine how many learners use both apps. Determine the probability that a learner chosen at random uses exactly one of the apps. Are the events W and T independent? Show your calculations.',
    answer: `Both: ${both}. Regions W only ${w - both}, both ${both}, T only ${tk - both}, neither ${neither}. P(exactly one) = ${w - both + tk - both}/${total} = ${n((w - both + tk - both) / total, 4)}. P(W) × P(T) = ${n(pw * pt, 4)} ≠ P(W and T) = ${n(both / total, 4)}, so not independent.`,
    explanation: `${w} + ${tk} = ${w + tk}, but only ${total} − ${neither} = ${total - neither} use at least one app, so ${w + tk} − ${total - neither} = ${both} were counted twice: they use both. Exactly one: ${w - both} + ${tk - both} = ${w - both + tk - both}. P(W) = ${w}/${total} = ${n(pw, 4)}; P(T) = ${tk}/${total} = ${n(pt, 3)}; P(W) × P(T) = ${n(pw * pt, 4)}, while P(W and T) = ${both}/${total} = ${n(both / total, 4)}. They differ, so the events are dependent.`,
    memo: [
      { code: 'M', marks: 1, text: `${w} + ${tk} − x + ${neither} = ${total}` },
      { code: 'A', marks: 1, text: `${both} use both` },
      { code: 'CA', marks: 1, text: 'the Venn regions' },
      { code: 'CA', marks: 1, text: `${w - both + tk - both}/${total}` },
      { code: 'M', marks: 1, text: 'P(W) × P(T) compared with P(W and T)' },
      { code: 'C', marks: 1, text: 'not independent' },
    ],
  })
}
{
  // Under 30 / 30 and over vs coffee / tea; x found from independence
  const [tea1, coffee2, tea2] = [40, 90, 60]
  // x·T = (x + tea1)(x + coffee2) with T = x + tea1 + coffee2 + tea2
  const x = (tea1 * coffee2) / tea2
  const total = x + tea1 + coffee2 + tea2
  out.push({
    id: 'mty-12-contingency-find-x',
    ...t('math-counting-probability', 12),
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    context: `|+ TABLE: PREFERRED HOT DRINK (a two-way table)\n| | Coffee | Tea | Total |\n|---|---|---|---|\n| Under 30 | x | ${tea1} | |\n| 30 and over | ${coffee2} | ${tea2} | |\n| Total | | | |`,
    prompt: 'Being under 30 and preferring coffee are independent events. Calculate the value of x, and then the probability that a person chosen at random is under 30 or prefers coffee.',
    answer: `x = ${x}. P(under 30 or coffee) = ${x + tea1 + coffee2}/${total} = ${n((x + tea1 + coffee2) / total, 2)}.`,
    explanation: `Total = x + ${tea1 + coffee2 + tea2}. Independence: P(under 30 and coffee) = P(under 30) × P(coffee), so x/(x + ${tea1 + coffee2 + tea2}) = [(x + ${tea1})/(x + ${tea1 + coffee2 + tea2})] × [(x + ${coffee2})/(x + ${tea1 + coffee2 + tea2})]. Multiply by (x + ${tea1 + coffee2 + tea2})²: x(x + ${tea1 + coffee2 + tea2}) = (x + ${tea1})(x + ${coffee2}), so x² + ${tea1 + coffee2 + tea2}x = x² + ${tea1 + coffee2}x + ${tea1 * coffee2}, giving ${tea2}x = ${tea1 * coffee2} and x = ${x}. Total ${total}. P(under 30 or coffee) = P(under 30) + P(coffee) − P(both) = (${x + tea1} + ${x + coffee2} − ${x})/${total} = ${x + tea1 + coffee2}/${total}.`,
    memo: [
      { code: 'M', marks: 1, text: 'P(under 30 and coffee) = P(under 30) × P(coffee)' },
      { code: 'SF', marks: 1, text: `x(x + ${tea1 + coffee2 + tea2}) = (x + ${tea1})(x + ${coffee2})` },
      { code: 'A', marks: 1, text: `x = ${x}` },
      { code: 'M', marks: 1, text: 'P(A or B) = P(A) + P(B) − P(A and B)' },
      { code: 'CA', marks: 1, text: `${x + tea1 + coffee2}/${total}` },
    ],
  })
}
{
  const rows: [string, number, number][] = [
    ['Grade 10', 35, 45],
    ['Grade 11', 28, 52],
    ['Grade 12', 42, 38],
  ]
  const total = rows.reduce((a, [, y, no]) => a + y + no, 0)
  const yes = rows.reduce((a, [, y]) => a + y, 0)
  const g12 = rows[2][1] + rows[2][2]
  out.push({
    id: 'mty-12-contingency-grades',
    ...t('math-counting-probability', 12),
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 5,
    context: `|+ TABLE: DO YOU WALK TO SCHOOL? (a two-way table)\n| | Walks | Does not walk |\n|---|---|---|\n${rows.map(([g, y, no]) => `| ${g} | ${y} | ${no} |`).join('\n')}`,
    prompt: 'A learner is chosen at random from the learners in the table. Determine the probability that the learner (a) walks to school, (b) is in Grade 12 and walks, (c) is in Grade 12 or walks. Determine whether being in Grade 12 and walking to school are independent.',
    answer: `(a) ${yes}/${total} = ${n(yes / total, 4)}; (b) ${rows[2][1]}/${total} = ${n(rows[2][1] / total, 4)}; (c) ${g12 + yes - rows[2][1]}/${total} = ${n((g12 + yes - rows[2][1]) / total, 4)}. P(Gr 12) × P(walks) = ${n((g12 / total) * (yes / total), 4)} ≠ ${n(rows[2][1] / total, 4)}: not independent.`,
    explanation: `Add the row and column totals first: ${total} learners, ${yes} walk, ${g12} in Grade 12. (a) ${yes}/${total}. (b) The Grade 12 / walks cell: ${rows[2][1]}/${total}. (c) P(G12) + P(W) − P(G12 and W) = (${g12} + ${yes} − ${rows[2][1]})/${total} = ${g12 + yes - rows[2][1]}/${total}. P(G12) × P(W) = ${g12}/${total} × ${yes}/${total} = ${n((g12 / total) * (yes / total), 4)}, which is not equal to ${n(rows[2][1] / total, 4)}.`,
    memo: [
      { code: 'A', marks: 1, text: `${yes}/${total}` },
      { code: 'RT', marks: 1, text: `${rows[2][1]}/${total}` },
      { code: 'M', marks: 1, text: 'P(A or B) = P(A) + P(B) − P(A and B)' },
      { code: 'CA', marks: 1, text: `${g12 + yes - rows[2][1]}/${total}` },
      { code: 'C', marks: 1, text: 'not independent' },
    ],
  })
}

export const mathTypes: Question[] = out
