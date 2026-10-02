/**
 * Mathematics questions for the thinnest sub-topics, as the sub-topic coverage
 * report counted them before this file:
 *
 *   Algebraic fractions -- 2; nature of the roots -- 2 (Grades 10 and 11).
 *   Outstanding balance -- 3; timelines and changing interest rates -- 5.
 *   Decimals and fractions, Grade 10 -- 3.
 *   Sigma notation, Grade 12 -- 4.
 *   Grouped data, histograms and frequency polygons -- 7.
 *   Gradients and equations of tangents, Grade 12 -- 8.
 *
 * Every figure is computed from the values declared with it, so a question,
 * its answer and its memo cannot drift apart. Numbers are written as the
 * Mathematics papers write them: a decimal comma and a space between
 * thousands.
 *
 * Algebraic fractions use letters other than x on purpose: the sub-topic rules
 * send anything containing "x²" to quadratic equations first.
 */
import type { Question } from '@/types'

/** A number with a decimal comma, to at most `dp` places. */
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

const round2 = (v: number) => Math.round(v * 100) / 100

const out: Question[] = []

/* ===================================================================== */
/* Algebraic fractions (Grades 10 and 11)                                 */
/* ===================================================================== */

const alg10 = { topicId: 'math-algebra', grade: 10 } as const
const alg11 = { topicId: 'math-algebra', grade: 11 } as const

out.push(
  {
    ...alg10,
    id: 'mtg-10-fraction-cancel-factors',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Simplify the fraction (a² − 9)/(a² + a − 6), and state the values of a for which it is undefined.',
    answer: '(a − 3)(a + 3)/((a + 3)(a − 2)) = (a − 3)/(a − 2), with a ≠ −3 and a ≠ 2.',
    explanation:
      'Factorise the numerator (a difference of two squares) and the denominator (a trinomial) first, then cancel the common FACTOR (a + 3). The restrictions come from the original denominator, so −3 is excluded even though (a + 3) has been cancelled.',
    memo: [
      { code: 'M', marks: 1, text: 'Numerator factorised: (a − 3)(a + 3)' },
      { code: 'M', marks: 1, text: 'Denominator factorised: (a + 3)(a − 2)' },
      { code: 'A', marks: 1, text: '(a − 3)/(a − 2), a ≠ −3; 2' },
    ],
  },
  {
    ...alg10,
    id: 'mtg-10-fraction-subtract-lcd',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Simplify 2/(m − 1) − 3/(m + 1), writing the answer as a single fraction.',
    answer: '[2(m + 1) − 3(m − 1)]/[(m − 1)(m + 1)] = (2m + 2 − 3m + 3)/(m² − 1) = (5 − m)/(m² − 1).',
    explanation:
      'The lowest common denominator is (m − 1)(m + 1). Multiply each numerator by the factor its denominator is missing, and keep the brackets: the minus sign applies to the whole of 3(m − 1), which is where most errors are made.',
    memo: [
      { code: 'M', marks: 1, text: 'LCD (m − 1)(m + 1)' },
      { code: 'M', marks: 1, text: '2(m + 1) − 3(m − 1)' },
      { code: 'A', marks: 1, text: 'Numerator 5 − m' },
      { code: 'CA', marks: 1, text: '(5 − m)/(m² − 1)' },
    ],
  },
  {
    ...alg10,
    id: 'mtg-10-fraction-divide',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Simplify the fraction (p² − 4p)/(p² − 16) ÷ 3p/(p + 4).',
    answer: 'p(p − 4)/((p − 4)(p + 4)) × (p + 4)/(3p) = 1/3.',
    explanation: 'To divide, multiply by the reciprocal of the second fraction. Once every numerator and denominator is factorised, p, (p − 4) and (p + 4) all cancel, leaving 1/3.',
    memo: [
      { code: 'M', marks: 1, text: 'Multiply by the reciprocal (p + 4)/(3p)' },
      { code: 'M', marks: 1, text: 'p(p − 4) and (p − 4)(p + 4) factorised' },
      { code: 'M', marks: 1, text: 'Common factors cancelled' },
      { code: 'A', marks: 1, text: '1/3' },
    ],
  },
  {
    ...alg10,
    id: 'mtg-10-fraction-cancel-terms-error',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'A learner simplifies the fraction (k + 6)/(k + 3) to 2 by "cancelling the k’s and dividing 6 by 3". Explain the error, and show with k = 1 that the answer is wrong.',
    answer: 'k is a term, not a factor, so it cannot be cancelled across the + sign. With k = 1: (1 + 6)/(1 + 3) = 7/4, not 2.',
    explanation: 'Only factors of the whole numerator and the whole denominator may be cancelled. (k + 6)/(k + 3) does not simplify at all.',
    memo: [
      { code: 'R', marks: 1, text: 'Terms cannot be cancelled -- only factors' },
      { code: 'A', marks: 1, text: 'k = 1 gives 7/4 ≠ 2' },
    ],
  },
  {
    ...alg11,
    id: 'mtg-11-fraction-cubes',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Simplify the fraction (a³ − 8)/(a² − 4).',
    answer: '(a − 2)(a² + 2a + 4)/((a − 2)(a + 2)) = (a² + 2a + 4)/(a + 2), a ≠ ±2.',
    explanation: 'The numerator is a difference of cubes and the denominator a difference of squares; both share the factor (a − 2).',
    memo: [
      { code: 'M', marks: 1, text: 'Difference of cubes: (a − 2)(a² + 2a + 4)' },
      { code: 'M', marks: 1, text: 'Difference of squares: (a − 2)(a + 2)' },
      { code: 'A', marks: 1, text: '(a² + 2a + 4)/(a + 2)' },
    ],
  },
  {
    ...alg11,
    id: 'mtg-11-fraction-equation',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: 'Solve for t: 3/(t − 2) + 1 = 6/(t² − 4). State the values t may not take, because a denominator would be zero.',
    answer:
      't ≠ ±2. Multiply by (t − 2)(t + 2): 3(t + 2) + (t² − 4) = 6, so t² + 3t − 4 = 0 and (t + 4)(t − 1) = 0. t = −4 or t = 1; neither is excluded.',
    explanation: 'Find the restrictions before solving, then check the solutions against them -- an equation with algebraic fractions can produce a solution that makes a denominator zero, which must be rejected.',
    memo: [
      { code: 'A', marks: 1, text: 't ≠ 2 and t ≠ −2' },
      { code: 'M', marks: 1, text: 'Multiplied by the LCD (t − 2)(t + 2)' },
      { code: 'A', marks: 1, text: 't² + 3t − 4 = 0' },
      { code: 'M', marks: 1, text: '(t + 4)(t − 1) = 0' },
      { code: 'A', marks: 1, text: 't = −4 or t = 1' },
    ],
  },
)

/* ===================================================================== */
/* Nature of the roots (Grade 11)                                         */
/* ===================================================================== */

const disc = (a: number, b: number, c: number) => b * b - 4 * a * c

{
  const d = disc(2, -5, 3)
  out.push({
    ...alg11,
    id: 'mtg-11-roots-rational',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Without solving the equation, determine the nature of the roots of 2x² − 5x + 3 = 0.',
    answer: `Δ = b² − 4ac = (−5)² − 4(2)(3) = ${d}. Δ > 0 and is a perfect square, so the roots are real, rational and unequal.`,
    explanation: 'The discriminant decides real or non-real (its sign) and rational or irrational (whether it is a perfect square).',
    memo: [
      { code: 'SF', marks: 1, text: '(−5)² − 4(2)(3)' },
      { code: 'A', marks: 1, text: `Δ = ${d}` },
      { code: 'CA', marks: 1, text: 'Real, rational, unequal' },
    ],
  })
}
{
  const d = disc(3, 2, 5)
  out.push({
    ...alg11,
    id: 'mtg-11-roots-non-real',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Use the discriminant to determine the nature of the roots of 3x² + 2x + 5 = 0.',
    answer: `Δ = 2² − 4(3)(5) = ${n(d)}. Δ < 0, so the roots are non-real.`,
    explanation: 'A negative discriminant means the parabola does not cut the x-axis: there are no real roots.',
    memo: [
      { code: 'A', marks: 1, text: `Δ = ${n(d)}` },
      { code: 'CA', marks: 1, text: 'Non-real roots' },
    ],
  })
}
{
  const d = disc(1, -4, 1)
  out.push({
    ...alg11,
    id: 'mtg-11-roots-irrational',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Determine the nature of the roots of x² − 4x + 1 = 0 without solving it.',
    answer: `Δ = 16 − 4 = ${d}. Δ > 0 but ${d} is not a perfect square, so the roots are real, irrational and unequal.`,
    explanation: 'The roots are 2 ± √3: real and different, but irrational because the discriminant is not a perfect square.',
    memo: [
      { code: 'A', marks: 1, text: `Δ = ${d}` },
      { code: 'CA', marks: 1, text: 'Real, irrational, unequal' },
    ],
  })
}
out.push(
  {
    ...alg11,
    id: 'mtg-11-roots-real-k',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'For which values of k will x² + 4x + k = 0 have real roots? Use the discriminant.',
    answer: 'Real roots need Δ ≥ 0: 16 − 4k ≥ 0, so k ≤ 4.',
    explanation: 'Real roots include equal roots, so the inequality is ≥ 0, not > 0.',
    memo: [
      { code: 'M', marks: 1, text: 'Δ ≥ 0' },
      { code: 'A', marks: 1, text: '16 − 4k ≥ 0' },
      { code: 'A', marks: 1, text: 'k ≤ 4' },
    ],
  },
  {
    ...alg11,
    id: 'mtg-11-roots-equal-k',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Determine the value of k for which kx² − 6x + 3 = 0 has real and equal roots.',
    answer: 'Equal roots need Δ = 0: 36 − 12k = 0, so k = 3.',
    explanation: 'k = 0 is not allowed, since the equation would no longer be quadratic; k = 3 gives 3x² − 6x + 3 = 3(x − 1)², with the equal roots x = 1.',
    memo: [
      { code: 'M', marks: 1, text: 'Δ = 0' },
      { code: 'A', marks: 1, text: '36 − 12k = 0' },
      { code: 'A', marks: 1, text: 'k = 3' },
    ],
  },
  {
    ...alg11,
    id: 'mtg-11-roots-always-real',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 3,
    prompt: 'Prove that the roots of x² + px − 1 = 0 are real and unequal for every real value of p, using the discriminant.',
    answer: 'Δ = p² − 4(1)(−1) = p² + 4. p² ≥ 0 for every real p, so p² + 4 ≥ 4 > 0. Δ is always positive, so the roots are always real and unequal.',
    explanation: 'A proof for every p must not test particular values; it shows that the discriminant cannot be zero or negative.',
    memo: [
      { code: 'A', marks: 1, text: 'Δ = p² + 4' },
      { code: 'R', marks: 1, text: 'p² ≥ 0 for all real p' },
      { code: 'J', marks: 1, text: 'So Δ ≥ 4 > 0: real and unequal' },
    ],
  },
)

/* ===================================================================== */
/* Outstanding balance (Grade 12)                                         */
/* ===================================================================== */

const fin12 = { topicId: 'math-finance-growth', grade: 12 } as const
const fin11 = { topicId: 'math-finance-growth', grade: 11 } as const

/** Payment that repays `p` over `k` periods at `i` per period, to the cent. */
const payment = (p: number, i: number, k: number) => round2((p * i) / (1 - (1 + i) ** -k))
/** Present value of `k` payments of `x` at `i` per period. */
const pv = (x: number, i: number, k: number) => (x * (1 - (1 + i) ** -k)) / i
/** Future value of `k` payments of `x` at `i` per period. */
const fv = (x: number, i: number, k: number) => (x * ((1 + i) ** k - 1)) / i

{
  const [p, rate, years, paid] = [850_000, 0.11, 20, 96]
  const i = rate / 12
  const x = payment(p, i, years * 12)
  const left = years * 12 - paid
  const balance = pv(x, i, left)
  out.push({
    ...fin12,
    id: 'mtg-12-outstanding-home',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A home loan of ${rand(p)} is repaid over ${years} years at ${n(rate * 100)}% p.a. compounded monthly, with monthly payments of ${rand(x)} starting one month after the loan is granted. Calculate the outstanding balance immediately after the ${paid}th payment.`,
    answer: `${left} payments remain. Balance = present value of the remaining payments = ${rand(x)} × [1 − (1 + ${n(rate)}/12)^−${left}] ÷ (${n(rate)}/12) = ${rand(balance)}.`,
    explanation: `The outstanding balance is what the payments still to come are worth today. After ${paid} of ${years * 12} payments, ${left} remain -- counting them correctly is where most errors are made.`,
    memo: [
      { code: 'A', marks: 1, text: `n = ${left}` },
      { code: 'A', marks: 1, text: `i = ${n(rate)}/12` },
      { code: 'SF', marks: 1, text: 'Present value formula with x, i and n substituted' },
      { code: 'CA', marks: 1, text: rand(balance) },
    ],
  })
}
{
  const [p, rate, years, paid] = [320_000, 0.12, 6, 36]
  const i = rate / 12
  const x = payment(p, i, years * 12)
  const grown = p * (1 + i) ** paid
  const made = fv(x, i, paid)
  const balance = grown - made
  out.push({
    ...fin12,
    id: 'mtg-12-outstanding-car-fv',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `A car loan of ${rand(p)} is repaid over ${years} years at ${n(rate * 100)}% p.a. compounded monthly, with monthly payments of ${rand(x)}. Use the future value method to calculate the outstanding balance immediately after the ${paid}th payment.`,
    answer: `Grow the loan forward: ${rand(p)} × (1,01)^${paid} = ${rand(grown)}. Future value of the ${paid} payments made: ${rand(x)} × [(1,01)^${paid} − 1] ÷ 0,01 = ${rand(made)}. Outstanding balance = ${rand(grown)} − ${rand(made)} = ${rand(balance)}.`,
    explanation: 'The future value method compares what the loan would have grown to with what the payments made have grown to; the difference is still owed. It must agree with the present value of the remaining payments, up to rounding of the payment.',
    memo: [
      { code: 'SF', marks: 1, text: `${rand(p)}(1,01)^${paid}` },
      { code: 'A', marks: 1, text: rand(grown) },
      { code: 'SF', marks: 1, text: `Future value of ${paid} payments of ${rand(x)}` },
      { code: 'A', marks: 1, text: rand(made) },
      { code: 'CA', marks: 1, text: rand(balance) },
    ],
  })
}
{
  const [p, rate, x] = [60_000, 0.15, 2_000]
  const i = rate / 12
  const exact = -Math.log(1 - (p * i) / x) / Math.log(1 + i)
  const full = Math.floor(exact)
  const owing = p * (1 + i) ** full - fv(x, i, full)
  const last = owing * (1 + i)
  out.push({
    ...fin12,
    id: 'mtg-12-final-payment',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 6,
    prompt: `A loan of ${rand(p)} at ${n(rate * 100)}% p.a. compounded monthly is repaid with payments of ${rand(x)} at the end of each month, with a smaller final payment one month after the last full one. Calculate the number of full payments and the value of the final payment.`,
    answer: `Solve ${rand(p)} = ${rand(x)}[1 − (1 + i)^−n]/i with i = ${n(rate)}/12: n = ${n(exact)}, so there are ${full} full payments. Balance outstanding after ${full} payments: ${rand(p)}(1 + i)^${full} − ${rand(x)}[(1 + i)^${full} − 1]/i = ${rand(owing)}. The final payment, one month later, is ${rand(owing)} × (1 + i) = ${rand(last)}.`,
    explanation: 'n is not a whole number, so the loan ends with a part payment: the balance outstanding after the last full payment, plus one month’s interest.',
    memo: [
      { code: 'SF', marks: 1, text: 'Present value formula set equal to the loan' },
      { code: 'A', marks: 1, text: `n = ${n(exact)}` },
      { code: 'CA', marks: 1, text: `${full} full payments` },
      { code: 'M', marks: 1, text: `Balance after ${full} payments by the future value method` },
      { code: 'A', marks: 1, text: rand(owing) },
      { code: 'CA', marks: 1, text: `Final payment ${rand(last)}` },
    ],
  })
}
out.push({
  ...fin12,
  id: 'mtg-12-outstanding-more-than-half',
  difficulty: 'Moderate',
  cognitiveLevel: 3,
  marks: 2,
  prompt: 'Halfway through the term of a 20-year home loan, the outstanding balance is much more than half of the amount borrowed. Explain why.',
  answer: 'Each payment covers the month’s interest first, and only the rest reduces the capital. In the early years the balance is large, so most of each payment is interest and the balance falls slowly; capital is repaid faster only later.',
  explanation: 'This is why extra payments early in a loan save so much interest.',
  memo: [
    { code: 'R', marks: 1, text: 'Early payments are mostly interest' },
    { code: 'R', marks: 1, text: 'So the balance outstanding falls slowly at first' },
  ],
})

/* ===================================================================== */
/* Timelines and changing interest rates (Grades 11 and 12)               */
/* ===================================================================== */

{
  const [p, r1, y1, r2, y2] = [20_000, 0.08, 3, 0.09, 2]
  const a = p * (1 + r1 / 2) ** (y1 * 2) * (1 + r2) ** y2
  out.push({
    ...fin11,
    id: 'mtg-11-timeline-rate-change',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `${rand(p)} is invested at ${n(r1 * 100)}% p.a. compounded half-yearly. After ${y1} years the rate changes to ${n(r2 * 100)}% p.a. compounded annually. Draw a timeline and calculate the value of the investment ${y1 + y2} years after it was made.`,
    answer: `A = ${rand(p)} × (1 + ${n(r1)}/2)^${y1 * 2} × (1 + ${n(r2)})^${y2} = ${rand(a)}.`,
    explanation: 'Split the calculation where the rate changes: the first rate applies only to the first period, and its result grows at the second rate for the rest of the time.',
    memo: [
      { code: 'SF', marks: 1, text: `(1 + ${n(r1)}/2)^${y1 * 2}` },
      { code: 'SF', marks: 1, text: `(1 + ${n(r2)})^${y2}` },
      { code: 'M', marks: 1, text: 'The two growth factors multiplied' },
      { code: 'A', marks: 1, text: rand(a) },
    ],
  })
}
{
  const r = 0.075
  const a = 5000 * (1 + r) ** 5 + 3000 * (1 + r) ** 3 - 2000 * (1 + r) ** 2
  out.push({
    ...fin11,
    id: 'mtg-11-timeline-deposits-withdrawal',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `Nomsa deposited R5 000 into an account paying ${n(r * 100)}% p.a. compounded annually. Two years later she deposited R3 000, and one year after that she withdrew R2 000. Use a timeline to calculate the balance five years after her first deposit.`,
    answer: `Move each amount to year 5: 5 000(1,075)^5 + 3 000(1,075)^3 − 2 000(1,075)^2 = ${rand(a)}.`,
    explanation: 'Each amount grows only from the date it was deposited or withdrawn; the withdrawal is subtracted, together with the interest it would have earned.',
    memo: [
      { code: 'A', marks: 1, text: '5 000(1,075)^5' },
      { code: 'A', marks: 1, text: '3 000(1,075)^3' },
      { code: 'A', marks: 1, text: '2 000(1,075)^2' },
      { code: 'M', marks: 1, text: 'Withdrawal subtracted' },
      { code: 'CA', marks: 1, text: rand(a) },
    ],
  })
}
{
  const [p, r1, r2] = [15_000, 0.18, 0.14]
  const a = p * (1 + r1 / 2) ** 3 * (1 + r2) ** 2
  out.push({
    ...fin12,
    id: 'mtg-12-timeline-debt-rate-change',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A debt of ${rand(p)} grows at ${n(r1 * 100)}% p.a. compounded half-yearly for 18 months. The interest rate then changes to ${n(r2 * 100)}% p.a. compounded annually. Calculate the amount owed 3½ years after the debt began.`,
    answer: `18 months is 3 half-years; the remaining 2 years are at the new rate. A = ${rand(p)} × (1 + ${n(r1)}/2)^3 × (1 + ${n(r2)})^2 = ${rand(a)}.`,
    explanation: 'Count compounding periods for each rate separately: 18 months at half-yearly compounding is 3 periods, not 18.',
    memo: [
      { code: 'A', marks: 1, text: 'n = 3 half-years, then n = 2 years' },
      { code: 'SF', marks: 1, text: `(1 + ${n(r1)}/2)^3` },
      { code: 'SF', marks: 1, text: `(1 + ${n(r2)})^2` },
      { code: 'A', marks: 1, text: rand(a) },
    ],
  })
}
{
  const [p, r1, r2, w] = [40_000, 0.09, 0.1, 10_000]
  const atThree = p * (1 + r1) ** 3 - w * (1 + r1)
  const a = atThree * (1 + r2) ** 2
  out.push({
    ...fin12,
    id: 'mtg-12-timeline-withdrawal-then-change',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `Lerato invested ${rand(p)} at ${n(r1 * 100)}% p.a. compounded annually. After 2 years she withdrew ${rand(w)}, and one year after that the rate changed to ${n(r2 * 100)}% p.a. compounded annually. Calculate the value of her investment 5 years after she made it.`,
    answer: `Value at year 3: ${rand(p)}(1,09)^3 − ${rand(w)}(1,09) = ${rand(atThree)}. Value at year 5: ${rand(atThree)} × (1,1)^2 = ${rand(a)}.`,
    explanation: 'Work to the date of the rate change first, including the withdrawal and the interest it no longer earns; then grow that single balance at the new rate.',
    memo: [
      { code: 'A', marks: 1, text: `${rand(p)}(1,09)^3` },
      { code: 'A', marks: 1, text: `${rand(w)}(1,09)` },
      { code: 'CA', marks: 1, text: rand(atThree) },
      { code: 'M', marks: 1, text: 'Grown at the new rate for 2 years' },
      { code: 'CA', marks: 1, text: rand(a) },
    ],
  })
}

/* ===================================================================== */
/* Decimals and fractions (Grade 10)                                      */
/* ===================================================================== */

const num10 = { topicId: 'math-number-systems', grade: 10 } as const

out.push(
  {
    ...num10,
    id: 'mtg-10-recurring-two-digit',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Write the recurring decimal 0,363636… (the digits 36 repeat) as a common fraction in simplest form.',
    answer: 'Let x = 0,3636…; then 100x = 36,3636…. Subtract: 99x = 36, so x = 36/99 = 4/11.',
    explanation: 'Multiply by 100 because two digits repeat, so the repeating parts line up and cancel when you subtract.',
    memo: [
      { code: 'M', marks: 1, text: '100x = 36,3636…' },
      { code: 'M', marks: 1, text: '99x = 36' },
      { code: 'A', marks: 1, text: '4/11' },
    ],
  },
  {
    ...num10,
    id: 'mtg-10-recurring-delayed',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Write the recurring decimal 0,1666… (only the 6 repeats) as a common fraction in simplest form.',
    answer: 'Let x = 0,1666…; 10x = 1,666… and 100x = 16,666…. Subtract: 90x = 15, so x = 15/90 = 1/6.',
    explanation: 'The repeat starts in the second decimal place, so line up 10x and 100x, which have the same repeating tail.',
    memo: [
      { code: 'M', marks: 1, text: '10x and 100x written down' },
      { code: 'M', marks: 1, text: '90x = 15' },
      { code: 'A', marks: 1, text: '1/6' },
    ],
  },
  {
    ...num10,
    id: 'mtg-10-terminating-to-fraction',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Write the terminating decimal 0,375 as a fraction in simplest form.',
    answer: '0,375 = 375/1 000 = 3/8.',
    explanation: 'Three decimal places means thousandths; then divide numerator and denominator by their highest common factor, 125.',
    memo: [
      { code: 'A', marks: 1, text: '375/1 000' },
      { code: 'A', marks: 1, text: '3/8' },
    ],
  },
)
{
  const rounded = Math.round(Math.sqrt(7) * 100) / 100
  const sq = rounded * rounded
  out.push({
    ...num10,
    id: 'mtg-10-rounding-early',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Round √7 to two decimal places and square the rounded value. Compare the result with the exact value of (√7)², and explain why you should round only at the end of a calculation.',
    answer: `√7 ≈ ${n(rounded)}; ${n(rounded)}² = ${n(sq, 4)}, but (√7)² = 7 exactly. Rounding early introduced an error of ${n(sq - 7, 4)}, and further steps would make it larger, so keep full values and round only the final answer.`,
    explanation: 'Every rounding throws away part of the number; when that rounded number is used again, the error is carried forward and grows.',
    memo: [
      { code: 'A', marks: 1, text: `√7 ≈ ${n(rounded)}` },
      { code: 'A', marks: 1, text: `${n(rounded)}² = ${n(sq, 4)} ≠ 7` },
      { code: 'R', marks: 1, text: 'Rounding errors accumulate, so round only at the end' },
    ],
  })
}

/* ===================================================================== */
/* Sigma notation (Grade 12)                                              */
/* ===================================================================== */

const pat12 = { topicId: 'math-number-patterns', grade: 12 } as const

{
  const terms = Array.from({ length: 20 }, (_, k) => 3 * (k + 1) - 1)
  const s = terms.reduce((a, b) => a + b, 0)
  out.push({
    ...pat12,
    id: 'mtg-12-sigma-arithmetic',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Evaluate the sum written in sigma notation: ∑ (3k − 1) from k = 1 to k = 20.',
    answer: `The terms ${terms[0]}; ${terms[1]}; ${terms[2]}; … form an arithmetic series with a = ${terms[0]}, d = 3 and n = 20. S₂₀ = 20/2 [2(${terms[0]}) + 19(3)] = ${s}.`,
    explanation: 'Write out the first few terms to see whether the series is arithmetic or geometric, then use the matching sum formula.',
    memo: [
      { code: 'A', marks: 1, text: `a = ${terms[0]}, d = 3` },
      { code: 'A', marks: 1, text: 'n = 20' },
      { code: 'CA', marks: 1, text: `${s}` },
    ],
  })
}
{
  const s = (2 * (3 ** 6 - 1)) / (3 - 1)
  out.push({
    ...pat12,
    id: 'mtg-12-sigma-geometric',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Evaluate the sum given in sigma notation: ∑ 2·3^(k − 1) from k = 1 to k = 6.',
    answer: `The terms 2; 6; 18; … form a geometric series with a = 2, r = 3 and n = 6. S₆ = 2(3⁶ − 1)/(3 − 1) = ${s}.`,
    explanation: 'The power (k − 1) starts at 0, so the first term is 2·3⁰ = 2.',
    memo: [
      { code: 'A', marks: 1, text: 'a = 2, r = 3' },
      { code: 'A', marks: 1, text: 'n = 6' },
      { code: 'CA', marks: 1, text: `${s}` },
    ],
  })
}
{
  const [lo, hi] = [5, 30]
  const count = hi - lo + 1
  const first = 2 * lo + 1
  const last = 2 * hi + 1
  const s = (count / 2) * (first + last)
  out.push({
    ...pat12,
    id: 'mtg-12-sigma-lower-limit',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Determine the number of terms in the sum ∑ (2k + 1) from k = ${lo} to k = ${hi}, written in sigma notation, and then evaluate the sum.`,
    answer: `Number of terms = ${hi} − ${lo} + 1 = ${count}. First term ${first}, last term ${last}. S = ${count}/2 (${first} + ${last}) = ${s}.`,
    explanation: 'The number of terms is the upper limit minus the lower limit plus one -- not the upper limit.',
    memo: [
      { code: 'A', marks: 1, text: `${count} terms` },
      { code: 'A', marks: 1, text: `First term ${first}, last term ${last}` },
      { code: 'SF', marks: 1, text: `${count}/2 (${first} + ${last})` },
      { code: 'CA', marks: 1, text: `${s}` },
    ],
  })
}
out.push(
  {
    ...pat12,
    id: 'mtg-12-sigma-write-series',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Write the series 5 + 9 + 13 + … + 101 in sigma notation.',
    answer: 'Tₖ = 4k + 1. The last term: 4k + 1 = 101 gives k = 25. Series = ∑ (4k + 1) from k = 1 to k = 25.',
    explanation: 'Find the general term first, then solve for the k that gives the last term to find the upper limit.',
    memo: [
      { code: 'A', marks: 1, text: 'Tₖ = 4k + 1' },
      { code: 'A', marks: 1, text: 'Upper limit 25' },
      { code: 'A', marks: 1, text: '∑ (4k + 1), k = 1 to 25' },
    ],
  },
  {
    ...pat12,
    id: 'mtg-12-sigma-solve-n',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Solve for n if the sum in sigma notation ∑ (2k + 3) from k = 1 to k = n equals 140.',
    answer: 'The series 5 + 7 + 9 + … is arithmetic with a = 5, d = 2: Sₙ = n/2 [10 + 2(n − 1)] = n² + 4n. n² + 4n − 140 = 0, so (n + 14)(n − 10) = 0 and n = 10 (n must be positive).',
    explanation: 'Set up the sum formula in n, solve the quadratic, and reject the negative value: a number of terms is a natural number.',
    memo: [
      { code: 'A', marks: 1, text: 'a = 5, d = 2' },
      { code: 'SF', marks: 1, text: 'n/2 [10 + 2(n − 1)] = 140' },
      { code: 'M', marks: 1, text: 'n² + 4n − 140 = 0' },
      { code: 'A', marks: 1, text: 'n = 10' },
    ],
  },
)

/* ===================================================================== */
/* Grouped data, histograms and frequency polygons (Grades 10 to 12)      */
/* ===================================================================== */

{
  const classes: [number, number, number][] = [
    [0, 10, 4],
    [10, 20, 7],
    [20, 30, 12],
    [30, 40, 9],
    [40, 50, 3],
  ]
  const total = classes.reduce((s, [, , f]) => s + f, 0)
  const sumFx = classes.reduce((s, [lo, hi, f]) => s + ((lo + hi) / 2) * f, 0)
  const mean = sumFx / total
  const modal = classes.reduce((a, b) => (b[2] > a[2] ? b : a))
  const medianPos = (total + 1) / 2
  let run = 0
  const medianClass = classes.find(([, , f]) => (run += f) >= medianPos)!
  const context = `The times (in minutes) that ${total} learners took to finish a task are grouped in class intervals.\n|+ TABLE: TIME TO FINISH THE TASK\n| Time t (minutes) | Frequency |\n|---|---|\n${classes.map(([lo, hi, f]) => `| ${lo} ≤ t < ${hi} | ${f} |`).join('\n')}`
  const stat = (grade: 10 | 11 | 12) => ({ topicId: 'math-statistics', grade, context }) as const

  out.push(
    {
      ...stat(11),
      id: 'mtg-11-grouped-mean',
      difficulty: 'Moderate',
      cognitiveLevel: 2,
      marks: 4,
      prompt: 'Estimate the mean time from the grouped data, using the midpoint of each class interval.',
      answer: `Midpoints: ${classes.map(([lo, hi]) => (lo + hi) / 2).join('; ')}. Σfx = ${classes.map(([lo, hi, f]) => `${(lo + hi) / 2}(${f})`).join(' + ')} = ${sumFx}. Estimated mean = ${sumFx} ÷ ${total} = ${n(mean)} minutes.`,
      explanation: 'Each learner in a class is taken to be at the midpoint of the interval, so the result is an estimate.',
      memo: [
        { code: 'A', marks: 1, text: 'Midpoints of each interval' },
        { code: 'M', marks: 1, text: 'Midpoint × frequency, summed' },
        { code: 'A', marks: 1, text: `Σfx = ${sumFx}` },
        { code: 'CA', marks: 1, text: `${n(mean)} minutes` },
      ],
    },
    {
      ...stat(11),
      id: 'mtg-11-grouped-modal-median-class',
      difficulty: 'Easy',
      cognitiveLevel: 2,
      marks: 3,
      prompt: 'Write down the modal class of the grouped data, and determine the class interval in which the median lies.',
      answer: `Modal class: ${modal[0]} ≤ t < ${modal[1]} (highest frequency, ${modal[2]}). The median is the ${medianPos}th value; the cumulative frequencies are ${classes.map((_, k) => classes.slice(0, k + 1).reduce((s, c) => s + c[2], 0)).join('; ')}, so it lies in ${medianClass[0]} ≤ t < ${medianClass[1]}.`,
      explanation: 'With grouped data you can name the class the median falls in, but not its exact value.',
      memo: [
        { code: 'A', marks: 1, text: `Modal class ${modal[0]} ≤ t < ${modal[1]}` },
        { code: 'A', marks: 1, text: `Median is the ${medianPos}th value` },
        { code: 'CA', marks: 1, text: `Median class ${medianClass[0]} ≤ t < ${medianClass[1]}` },
      ],
    },
    {
      ...stat(10),
      id: 'mtg-10-histogram-polygon',
      difficulty: 'Easy',
      cognitiveLevel: 1,
      marks: 3,
      prompt: 'The grouped data is drawn as a histogram. Explain why the bars of the histogram touch, and describe how to draw a frequency polygon from it.',
      answer: 'Time is continuous, so the class intervals follow on from one another with no gaps, and neither do the bars. For the frequency polygon, plot a point at the midpoint of the top of each bar and join the points with straight lines.',
      explanation: 'A bar graph of categories has gaps; a histogram of a continuous variable does not.',
      memo: [
        { code: 'R', marks: 1, text: 'Continuous data / no gaps between intervals' },
        { code: 'A', marks: 1, text: 'Points at the midpoints of the tops of the bars' },
        { code: 'A', marks: 1, text: 'Joined with straight lines' },
      ],
    },
    {
      ...stat(12),
      id: 'mtg-12-grouped-estimate-why',
      difficulty: 'Moderate',
      cognitiveLevel: 3,
      marks: 2,
      prompt: 'Explain why a mean calculated from grouped data is only an estimate, and state when it would be exactly right.',
      answer: 'The actual values are not known -- each value is replaced by the midpoint of its class interval. It would be exact only if the values in every class averaged out to that class’s midpoint.',
      explanation: 'Grouping loses the individual values; the midpoint is a stand-in for all of them.',
      memo: [
        { code: 'R', marks: 1, text: 'Values replaced by class midpoints' },
        { code: 'A', marks: 1, text: 'Exact only if each class’s values average to its midpoint' },
      ],
    },
  )
}

/* ===================================================================== */
/* Gradients and equations of tangents (Grade 12)                         */
/* ===================================================================== */

const calc = { topicId: 'math-calculus', grade: 12 } as const

{
  const f = (x: number) => x ** 3 - 3 * x ** 2 + 2
  const df = (x: number) => 3 * x ** 2 - 6 * x
  const [x0, y0, m] = [3, f(3), df(3)]
  const c = y0 - m * x0
  out.push({
    ...calc,
    id: 'mtg-12-tangent-at-point',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `Determine the equation of the tangent to f(x) = x³ − 3x² + 2 at x = ${x0}.`,
    answer: `f(${x0}) = ${y0}, so the point is (${x0} ; ${y0}). f′(x) = 3x² − 6x and f′(${x0}) = ${m}. y − ${y0} = ${m}(x − ${x0}), so y = ${m}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}.`,
    explanation: 'Substitute into f for the y-coordinate and into f′ for the gradient; then use y − y₁ = m(x − x₁).',
    memo: [
      { code: 'A', marks: 1, text: `Point (${x0} ; ${y0})` },
      { code: 'A', marks: 1, text: "f′(x) = 3x² − 6x" },
      { code: 'A', marks: 1, text: `Gradient ${m}` },
      { code: 'CA', marks: 1, text: `y = ${m}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}` },
    ],
  })
}
out.push(
  {
    ...calc,
    id: 'mtg-12-tangent-parallel',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Determine the coordinates of the points on f(x) = x³ − 6x where the tangent is parallel to the line y = 6x + 1.',
    answer: "Parallel means a gradient of 6: f′(x) = 3x² − 6 = 6, so x² = 4 and x = ±2. f(2) = −4 and f(−2) = 4. The points are (2 ; −4) and (−2 ; 4).",
    explanation: 'Set the derivative equal to the given gradient and solve; there can be more than one point with the same gradient.',
    memo: [
      { code: 'M', marks: 1, text: 'f′(x) = 6' },
      { code: 'A', marks: 1, text: '3x² − 6 = 6' },
      { code: 'A', marks: 1, text: 'x = ±2' },
      { code: 'CA', marks: 1, text: '(2 ; −4) and (−2 ; 4)' },
    ],
  },
  {
    ...calc,
    id: 'mtg-12-tangent-given-gradient',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'The tangent to g(x) = 2x² − 4x + 1 has a gradient of 4 at a point P. Determine the coordinates of P and the equation of the tangent at P.',
    answer: "g′(x) = 4x − 4 = 4, so x = 2. g(2) = 8 − 8 + 1 = 1, so P(2 ; 1). y − 1 = 4(x − 2), so y = 4x − 7.",
    explanation: 'The gradient fixes the x-coordinate; g gives the y-coordinate.',
    memo: [
      { code: 'A', marks: 1, text: "g′(x) = 4x − 4" },
      { code: 'A', marks: 1, text: 'x = 2' },
      { code: 'A', marks: 1, text: 'P(2 ; 1)' },
      { code: 'CA', marks: 1, text: 'y = 4x − 7' },
    ],
  },
  {
    ...calc,
    id: 'mtg-12-tangent-find-c',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'The line y = 2x + c is a tangent to f(x) = x² − 4x + 7. Determine the value of c.',
    answer: "The tangent’s gradient is 2: f′(x) = 2x − 4 = 2, so x = 3. f(3) = 9 − 12 + 7 = 4, so the point of contact is (3 ; 4). Then 4 = 2(3) + c, so c = −2.",
    explanation: 'The point of contact lies on both the curve and the tangent, so it satisfies both equations.',
    memo: [
      { code: 'M', marks: 1, text: "f′(x) = 2" },
      { code: 'A', marks: 1, text: 'x = 3' },
      { code: 'A', marks: 1, text: 'Point (3 ; 4)' },
      { code: 'CA', marks: 1, text: 'c = −2' },
    ],
  },
)

export const mathThinGaps: Question[] = out
