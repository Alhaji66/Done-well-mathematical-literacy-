/**
 * Generate Level 1 Mathematics items to split off longer questions.
 *
 * WHY GENERATED AND NOT HAND-TYPED. Mathematics needs roughly 800 new Level 1
 * items across six cells. Typing that many answers by hand would introduce
 * arithmetic errors at a rate no review would catch -- and a wrong answer key
 * is the one defect that actively teaches a learner something false. So the
 * FAMILIES are authored here, one per topic, and the numbers and answers are
 * computed. Every answer in the output is arithmetic this file performed, not
 * arithmetic anybody typed.
 *
 * WHAT MAKES THESE LEVEL 1. CAPS Level 1 in Mathematics is recall, reading a
 * value off, or one straight substitution into a formula that has been handed
 * over. Each family below is one of those three and nothing more: no family
 * requires choosing a method, and none has a second step. A two-mark family is
 * two such reads in one question -- which is how a real NSC paper opens a
 * question -- never one read plus one piece of reasoning.
 *
 * UNIQUENESS IS BY CONSTRUCTION, NOT BY LUCK. Each family's parameters are
 * decoded from the index with a mixed-radix split, so distinct indices give
 * distinct parameters and therefore distinct prompts, up to the family's
 * stated capacity. The caller keeps ONE counter per (topic, marks) across the
 * whole subject, so a prompt generated for Grade 10 can never reappear in
 * Grade 12 either. check:repeats fails the build on a question repeated inside
 * one paper and check:ambiguous fails on two items sharing a prompt with
 * different answers; neither should ever have anything to catch here.
 */

export type Item = { prompt: string; answer: string; explanation: string }
type Family = { cap: number; make: (n: number) => Item }

/* ---- formatting helpers, matching the corpus conventions ---- */

/** South African decimal comma. */
const za = (n: number): string => {
  const s = Number.isInteger(n) ? String(n) : String(Number(n.toFixed(6)))
  return s.replace('.', ',')
}
/** A signed term as it is written in an expression: "+ 5" or "− 5". */
const sign = (n: number): string => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`)
/** A negative number as it is read aloud, with the proper minus glyph. */
const neg = (n: number): string => (n < 0 ? `−${Math.abs(n)}` : String(n))
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const sup = (n: number): string => String(n).split('').map((d) => SUP[Number(d)]).join('')

/** Skip zero, keeping the map monotonic: [-6..4] becomes [-6..-1, 1..5]. */
const nz = (v: number): number => (v >= 0 ? v + 1 : v)

/** Decode index n into digits over the given radices. Injective while n < product. */
const digits = (n: number, radices: number[]): number[] => {
  const out: number[] = []
  for (const r of radices) {
    out.push(n % r)
    n = Math.floor(n / r)
  }
  return out
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
const frac = (num: number, den: number): string => {
  const g = gcd(Math.abs(num), Math.abs(den)) || 1
  const n = num / g
  const d = den / g
  return d === 1 ? neg(n) : `${neg(n)}/${d}`
}
/** Rands the way the corpus writes them: thin-spaced thousands, comma decimal. */
const rand = (n: number): string => {
  const v = Number(n.toFixed(2))
  const [whole, dec] = String(v).split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `R${grouped}${dec ? ',' + dec.padEnd(2, '0') : ''}`
}
/** Collapse the double spaces left where an optional coefficient of 1 is dropped. */
const tidy = (s: string): string => s.replace(/ {2,}/g, ' ').replace(/ ([;,.])/g, '$1')

/* ================================ ALGEBRA ================================ */

const ALGEBRA_1: Family[] = [
  {
    cap: 24, // base 2..9 x exponent 2..4
    make: (n) => {
      const [i, j] = digits(n, [8, 3])
      const b = 2 + i
      const e = 2 + j
      return {
        prompt: `Evaluate ${b}${sup(e)} without using a calculator.`,
        answer: String(b ** e),
        explanation: `${b}${sup(e)} means ${Array(e).fill(b).join(' × ')} = ${b ** e}. The exponent counts how many times the base appears in the product; it is not a multiplier, so a power is always worked out by repeated multiplication and never by multiplying the base by the exponent.`,
      }
    },
  },
  {
    cap: 24, // p 5..12 x q 2..4, so q < p holds for every pair
    make: (n) => {
      const [i, j] = digits(n, [8, 3])
      const p = 5 + i
      const q = 2 + j
      return {
        prompt: `Simplify, leaving your answer in exponential form: x${sup(p)} ÷ x${sup(q)}`,
        answer: p - q === 1 ? 'x' : `x${sup(p - q)}`,
        explanation: `Dividing powers of the same base subtracts the exponents: ${p} − ${q} = ${p - q}. The base itself never changes, so the answer is a power of x, not a power of anything else.`,
      }
    },
  },
  {
    cap: 11, // k 2..12 -- the only parameter the prompt actually shows
    make: (n) => {
      const k = 2 + (n % 11)
      return {
        prompt: `Solve for x: x${sup(2)} = ${k * k}, given that x is NEGATIVE.`,
        answer: `−${k}`,
        explanation: `Both ${k} and −${k} square to ${k * k}, so x² = ${k * k} has two solutions. The condition that x is negative rules out ${k}, leaving x = −${k}. A square root sign on its own would have given only the positive root, which is why the question states the sign it wants.`,
      }
    },
  },
  {
    cap: 121, // a 2..12, b 2..12
    make: (n) => {
      const [i, j] = digits(n, [11, 11])
      const a = 2 + i
      const b = 2 + j
      return {
        prompt: `Solve for x: ${a}x ${sign(-b * a)} = 0`,
        answer: String(b),
        explanation: `Adding ${b * a} to both sides gives ${a}x = ${b * a}, and dividing both sides by ${a} gives x = ${b}. Whatever is done to one side of an equation must be done to the other.`,
      }
    },
  },
  {
    cap: 11, // k 2..12
    make: (n) => {
      const k = 2 + (n % 11)
      return {
        prompt: `Factorise: x${sup(2)} − ${k * k}`,
        answer: `(x − ${k})(x + ${k})`,
        explanation: `This is a difference of two squares, since ${k * k} = ${k}². The pattern a² − b² = (a − b)(a + b) applies directly. Note a SUM of two squares, x² + ${k * k}, cannot be factorised over the real numbers.`,
      }
    },
  },
]

const ALGEBRA_2: Family[] = [
  {
    cap: 144, // p 2..13 x q 2..13
    make: (n) => {
      const [i, j] = digits(n, [12, 12])
      const p = 2 + i
      const q = 2 + j
      return {
        prompt: `Solve for x: (x − ${p})(x + ${q}) = 0`,
        answer: `x = ${p} or x = ${neg(-q)}`,
        explanation: `If a product is zero then at least one factor is zero, so x − ${p} = 0 or x + ${q} = 0. That gives x = ${p} or x = −${q}. The signs flip: the factor (x − ${p}) gives the POSITIVE root ${p}.`,
      }
    },
  },
  {
    cap: 108, // a 2..10 x c 2..13
    make: (n) => {
      const [i, j] = digits(n, [9, 12])
      const a = 2 + i
      const c = 2 + j
      const b = 3 + ((i + j) % 7)
      return {
        prompt: `Write down the coefficient of x${sup(2)} and the constant term of f(x) = ${a}x${sup(2)} ${sign(-b)}x ${sign(-c)}.`,
        answer: `Coefficient of x²: ${a}; constant term: ${neg(-c)}`,
        explanation: `The coefficient is the number multiplying the term, so it is ${a}, and the constant term is the one with no x in it, ${neg(-c)}. The sign in front of a term belongs to that term, which is why the constant is negative here and not ${c}.`,
      }
    },
  },
  {
    cap: 72, // p 5..12 x q 2..9
    make: (n) => {
      const [i, j] = digits(n, [8, 9])
      const p = 5 + i
      const q = 2 + j
      return {
        prompt: `Simplify, leaving your answers in exponential form: x${sup(p)} × x${sup(q)}, and then (x${sup(p)})${sup(q)}`,
        answer: `x${sup(p + q)} and x${sup(p * q)}`,
        explanation: `Multiplying powers of the same base ADDS the exponents: ${p} + ${q} = ${p + q}. Raising a power to a power MULTIPLIES them: ${p} × ${q} = ${p * q}. These two laws are easy to swap by mistake, which is why they are asked together.`,
      }
    },
  },
]

/* ============================ NUMBER PATTERNS ============================ */

const PATTERNS_1: Family[] = [
  {
    cap: 154, // a 2..15 x d 2..12
    make: (n) => {
      const [i, j] = digits(n, [14, 11])
      const a = 2 + i
      const d = 2 + j
      const seq = [a, a + d, a + 2 * d, a + 3 * d]
      return {
        prompt: `Write down the next term of the sequence: ${seq.join('; ')}; …`,
        answer: String(a + 4 * d),
        explanation: `Each term is ${d} more than the one before, so the next term is ${a + 3 * d} + ${d} = ${a + 4 * d}. The constant difference is what makes this an arithmetic sequence.`,
      }
    },
  },
  {
    cap: 154, // a 3..16 x d 2..12
    make: (n) => {
      const [i, j] = digits(n, [14, 11])
      const a = 3 + i
      const d = 2 + j
      return {
        prompt: `Write down the common difference of the sequence: ${a}; ${a + d}; ${a + 2 * d}; …`,
        answer: String(d),
        explanation: `The common difference is any term minus the one before it: ${a + d} − ${a} = ${d}. It must give the same answer wherever in the sequence it is taken, which is what distinguishes an arithmetic sequence from any other.`,
      }
    },
  },
  {
    cap: 18, // a 1..6 x r 2..4
    make: (n) => {
      const [i, j] = digits(n, [6, 3])
      const a = 1 + i
      const r = 2 + j
      return {
        prompt: `Write down the common ratio of the sequence: ${a}; ${a * r}; ${a * r * r}; …`,
        answer: String(r),
        explanation: `The common ratio is any term DIVIDED by the one before it: ${a * r} ÷ ${a} = ${r}. Subtracting instead of dividing would give the common difference, which this sequence does not have.`,
      }
    },
  },
]

const PATTERNS_2: Family[] = [
  {
    cap: 110, // a 2..11 x b 1..12
    make: (n) => {
      const [i, j] = digits(n, [10, 11])
      const a = 2 + i
      const b = 1 + j
      return {
        prompt: `Write down the first TWO terms of the sequence with general term T${'ₙ'} = ${a}n ${sign(b)}.`,
        answer: `T₁ = ${a + b} and T₂ = ${2 * a + b}`,
        explanation: `Substitute n = 1: ${a}(1) + ${b} = ${a + b}. Then n = 2: ${a}(2) + ${b} = ${2 * a + b}. The counter n starts at 1, not 0 — starting at 0 would give ${b}, which is not a term of this sequence.`,
      }
    },
  },
  {
    cap: 132, // a 2..13 x d 2..12
    make: (n) => {
      const [i, j] = digits(n, [12, 11])
      const a = 2 + i
      const d = 2 + j
      return {
        prompt: `For the sequence ${a}; ${a + d}; ${a + 2 * d}; …, write down the common difference and the fifth term.`,
        answer: `d = ${d} and T₅ = ${a + 4 * d}`,
        explanation: `The common difference is ${a + d} − ${a} = ${d}. The fifth term is four steps past the first, so T₅ = ${a} + 4(${d}) = ${a + 4 * d}. Four steps, not five — the first term is already there before any step is taken.`,
      }
    },
  },
]

/* =============================== FUNCTIONS =============================== */

const FUNCTIONS_1: Family[] = [
  {
    cap: 144, // m 2..13 x c 2..13
    make: (n) => {
      const [i, j] = digits(n, [12, 12])
      const m = 2 + i
      const c = 2 + j
      return {
        prompt: `Write down the y-intercept of the graph of y = ${m}x ${sign(-c)}.`,
        answer: `${neg(-c)}`,
        explanation: `The y-intercept is the value of y when x = 0, and in the form y = mx + c that is just c — here ${neg(-c)}. No substitution is needed once the equation is written this way.`,
      }
    },
  },
  {
    cap: 144, // m 2..13 x c 1..12
    make: (n) => {
      const [i, j] = digits(n, [12, 12])
      const m = 2 + i
      const c = 1 + j
      return {
        prompt: `Write down the gradient of the line y = ${neg(-m)}x ${sign(c)}.`,
        answer: `${neg(-m)}`,
        explanation: `In y = mx + c the gradient is m, the number multiplying x, so it is ${neg(-m)}. The minus sign is part of the gradient and is what makes this line fall from left to right.`,
      }
    },
  },
  {
    cap: 132, // p 1..12 x q -6..5
    make: (n) => {
      const [i, j] = digits(n, [12, 11])
      const p = 1 + i
      const q = nz(-6 + j)
      return {
        prompt: `Write down the equation of the axis of symmetry of y = (x − ${p})${sup(2)} ${sign(q)}.`,
        answer: `x = ${p}`,
        explanation: `In the form y = (x − p)² + q the graph is symmetrical about the vertical line x = p, so here x = ${p}. The value ${neg(q)} shifts the parabola up or down and has no effect on where the axis of symmetry sits.`,
      }
    },
  },
  {
    cap: 121, // k 2..12 x q -5..5
    make: (n) => {
      const [i, j] = digits(n, [11, 11])
      const k = 2 + i
      const q = nz(-5 + j)
      return {
        prompt: `Write down the equation of the horizontal asymptote of y = ${k}/x ${sign(q)}.`,
        answer: `y = ${neg(q)}`,
        explanation: `As x grows large, ${k}/x becomes very small but never reaches zero, so y settles towards ${neg(q)} without ever getting there. The asymptote is a LINE, so the answer is written as an equation, not as a single number.`,
      }
    },
  },
  {
    cap: 121, // q -5..5 x a 1..11
    make: (n) => {
      const [i, j] = digits(n, [11, 11])
      const q = nz(-5 + i)
      const a = 1 + j
      return {
        prompt: `Write down the range of y = ${a === 1 ? '' : a}x${sup(2)} ${sign(q)}.`,
        answer: `y ≥ ${neg(q)}`,
        explanation: `Since x² is never negative, ${a === 1 ? '' : a + ' × '}x² is at its smallest, zero, when x = 0, and y is then ${neg(q)}. Every other x makes y larger, so the range is y ≥ ${neg(q)}.`,
      }
    },
  },
]

const FUNCTIONS_2: Family[] = [
  {
    cap: 156, // m 2..14 x c 2..13
    make: (n) => {
      const [i, j] = digits(n, [13, 12])
      const m = 2 + i
      const c = 2 + j
      return {
        prompt: `Write down the gradient and the y-intercept of the line y = ${m}x ${sign(-c)}.`,
        answer: `Gradient = ${m}; y-intercept = ${neg(-c)}`,
        explanation: `The equation is already in the form y = mx + c, so the gradient is the number multiplying x and the y-intercept is the constant. Reading them off in any other form first requires rearranging.`,
      }
    },
  },
  {
    cap: 132, // p 1..12 x q -6..5
    make: (n) => {
      const [i, j] = digits(n, [12, 11])
      const p = 1 + i
      const q = nz(-6 + j)
      return {
        prompt: `Write down the coordinates of the turning point of y = (x − ${p})${sup(2)} ${sign(q)}.`,
        answer: `(${p} ; ${neg(q)})`,
        explanation: `In the form y = (x − p)² + q the turning point is (p ; q), so it is (${p} ; ${neg(q)}). The sign of p flips: the bracket reads x − ${p}, so p is ${p} and not −${p}.`,
      }
    },
  },
  {
    cap: 121, // p 1..11 x q -5..5
    make: (n) => {
      const [i, j] = digits(n, [11, 11])
      const p = 1 + i
      const q = nz(-5 + j)
      const k = 2 + ((i + j) % 8)
      return {
        prompt: `Write down the equations of the asymptotes of y = ${k}/(x − ${p}) ${sign(q)}.`,
        answer: `x = ${p} and y = ${neg(q)}`,
        explanation: `The vertical asymptote is where the denominator would be zero, x − ${p} = 0, so x = ${p}. The horizontal asymptote is the value y settles towards as x grows, which is the ${neg(q)} added on. Both are lines, so both are written as equations.`,
      }
    },
  },
]

/* ============================ FINANCE & GROWTH =========================== */

const PERIODS: Array<[string, number]> = [
  ['annually', 1],
  ['half-yearly', 2],
  ['quarterly', 4],
  ['monthly', 12],
]

const FINANCE_1: Family[] = [
  {
    cap: 36, // r 4..21 x half-step
    make: (n) => {
      const [i, j] = digits(n, [18, 2])
      const rate = 4 + i + (j === 1 ? 0.5 : 0)
      return {
        prompt: `Write ${za(rate)}% as a decimal.`,
        answer: za(rate / 100),
        explanation: `A percentage is a number of hundredths, so it is divided by 100 to become a decimal: ${za(rate)} ÷ 100 = ${za(rate / 100)}. This is the form the interest formulas need for i.`,
      }
    },
  },
  {
    cap: 56, // years 2..15 x 4 compounding periods
    make: (n) => {
      const [i, j] = digits(n, [14, 4])
      const y = 2 + i
      const [word, per] = PERIODS[j]
      return {
        prompt: `Money is invested for ${y} years at interest compounded ${word}. Write down the value of n to be used in A = P(1 + i)ⁿ.`,
        answer: String(y * per),
        explanation: `n counts COMPOUNDING PERIODS, not years. Interest is added ${per} time${per === 1 ? '' : 's'} a year for ${y} years, so n = ${y} × ${per} = ${y * per}.`,
      }
    },
  },
  {
    cap: 90, // P 1000..(step 500) x r
    make: (n) => {
      const [i, j] = digits(n, [15, 6])
      const P = 1000 + i * 500
      const r = 5 + j
      const interest = (P * r) / 100
      return {
        prompt: `Calculate the SIMPLE interest earned on ${rand(P)} invested at ${r}% per annum for one year.`,
        answer: rand(interest),
        explanation: `One year of simple interest is ${r}% of the principal: ${za(r / 100)} × ${rand(P)} = ${rand(interest)}. This is the interest alone — the accumulated amount would be ${rand(P + interest)}.`,
      }
    },
  },
]

const FINANCE_2: Family[] = [
  {
    cap: 56, // years 2..15 x 4 periods
    make: (n) => {
      const [i, j] = digits(n, [14, 4])
      const y = 2 + i
      const [word, per] = PERIODS[j]
      const r = 6 + ((i + j) % 8)
      return {
        prompt: `An amount is invested for ${y} years at ${r}% per annum compounded ${word}. Write down the values of i and n to be used in A = P(1 + i)ⁿ.`,
        answer: `i = ${za(r / 100 / per)} and n = ${y * per}`,
        explanation: `Both i and n must be per PERIOD, not per year. The rate is divided by the ${per} period${per === 1 ? '' : 's'} in a year: ${za(r / 100)} ÷ ${per} = ${za(r / 100 / per)}. The number of periods is ${y} × ${per} = ${y * per}.`,
      }
    },
  },
  {
    cap: 96, // P x r
    make: (n) => {
      const [i, j] = digits(n, [16, 6])
      const P = 2000 + i * 500
      const r = 5 + j
      const A = P * (1 + r / 100)
      return {
        prompt: `Calculate the accumulated amount if ${rand(P)} is invested for ONE year at ${r}% per annum compounded annually. Use A = P(1 + i)ⁿ.`,
        answer: rand(A),
        explanation: `Substituting P = ${P}, i = ${za(r / 100)} and n = 1: A = ${P}(1 + ${za(r / 100)})¹ = ${rand(A)}. Over one year compound and simple interest agree — they only separate once interest starts earning interest.`,
      }
    },
  },
]

/* =============================== CALCULUS ================================ */

const CALCULUS_1: Family[] = [
  {
    cap: 20, // k 3..22
    make: (n) => {
      const k = 3 + (n % 20)
      return {
        prompt: `Determine f′(x) if f(x) = ${k}.`,
        answer: '0',
        explanation: `A constant function has the same value everywhere, so its graph is a horizontal line and its gradient is 0 at every point. The size of the constant makes no difference — ${k} and 3 have the same derivative.`,
      }
    },
  },
  {
    cap: 5, // p 2..6
    make: (n) => {
      const p = 2 + (n % 5)
      return {
        prompt: `Determine f′(x) if f(x) = x${sup(p)}.`,
        answer: p === 2 ? '2x' : `${p}x${sup(p - 1)}`,
        explanation: `The power rule brings the exponent down as a coefficient and reduces it by one: the derivative of xⁿ is nxⁿ⁻¹, so here it is ${p}x${p - 1 === 1 ? '' : sup(p - 1)}.`,
      }
    },
  },
  {
    cap: 60, // a 2..13 x p 1..5
    make: (n) => {
      const [i, j] = digits(n, [12, 5])
      const a = 2 + i
      const p = 1 + j
      const c = a * p
      return {
        prompt: `Determine the derivative of f(x) = ${a}x${p === 1 ? '' : sup(p)}.`,
        answer: p === 1 ? String(a) : p === 2 ? `${c}x` : `${c}x${sup(p - 1)}`,
        explanation: `The coefficient stays in place while the power rule acts on the x: ${a} × ${p} = ${c}, and the exponent drops to ${p - 1}. ${p === 1 ? 'A term in x alone has derivative equal to its coefficient, since its graph is a straight line of that gradient.' : 'The coefficient is multiplied by the old exponent, not by the new one.'}`,
      }
    },
  },
]

const CALCULUS_2: Family[] = [
  {
    cap: 144, // a 2..13 x c 2..13
    make: (n) => {
      const [i, j] = digits(n, [12, 12])
      const a = 2 + i
      const c = 2 + j
      const p = 2 + ((i + j) % 4)
      return {
        prompt: `Determine f′(x) if f(x) = ${a}x${sup(p)} ${sign(-c)}.`,
        answer: `${a * p}x${p - 1 === 1 ? '' : sup(p - 1)}`,
        explanation: `Differentiate term by term. The first term gives ${a} × ${p} = ${a * p}, with the exponent dropping to ${p - 1}. The constant ${neg(-c)} differentiates to 0, so it disappears entirely — a vertical shift of the graph does not change any of its gradients.`,
      }
    },
  },
  {
    cap: 121, // a 2..12 x b 2..12
    make: (n) => {
      const [i, j] = digits(n, [11, 11])
      const a = 2 + i
      const b = 2 + j
      return {
        prompt: `Determine the derivative of f(x) = ${a}x${sup(3)} ${sign(-b)}x${sup(2)}.`,
        answer: `${3 * a}x${sup(2)} − ${2 * b}x`,
        explanation: `Each term is handled separately by the power rule: ${a} × 3 = ${3 * a} with the exponent falling to 2, and ${b} × 2 = ${2 * b} with the exponent falling to 1. The minus sign is carried across with its term.`,
      }
    },
  },
]

/* =============================== STATISTICS ============================== */

const STATS_1: Family[] = [
  {
    cap: 120, // lo 2..13 x spread 7..16
    make: (n) => {
      const [i, j] = digits(n, [12, 10])
      const lo = 2 + i
      const vals = [lo + 3, lo + 7 + j, lo, lo + 6, lo + 5 + j]
      // Read the extremes off the data that is actually printed, never off the
      // parameters that generated it -- the two disagreed here once already.
      const hi = Math.max(...vals)
      const mn = Math.min(...vals)
      return {
        prompt: `Write down the range of the data set: ${vals.join('; ')}.`,
        answer: String(hi - mn),
        explanation: `Range = highest − lowest = ${hi} − ${mn} = ${hi - mn}. Only the two extreme values are used, so the values in between do not affect it at all.`,
      }
    },
  },
  {
    cap: 90, // base 2..13 x repeated value offset
    make: (n) => {
      const [i, j] = digits(n, [12, 8])
      const b = 2 + i
      const m = b + 4 + j
      const vals = [b, m, b + 1, m, b + 3]
      // b, b+1 and b+3 are distinct and all below m, so m is the only repeat.
      const counts = new Map<number, number>()
      for (const v of vals) counts.set(v, (counts.get(v) ?? 0) + 1)
      const mode = [...counts].sort((x, y) => y[1] - x[1])[0][0]
      return {
        prompt: `Write down the mode of the data set: ${vals.join('; ')}.`,
        answer: String(mode),
        explanation: `The mode is the value that appears most often, and ${mode} appears twice while every other value appears once. A data set can have more than one mode, or none at all if no value repeats.`,
      }
    },
  },
  {
    cap: 110, // first 2..12 x step 2..11, five sorted values
    make: (n) => {
      const [i, j] = digits(n, [11, 10])
      const a = 2 + i
      const d = 2 + j
      const vals = [a, a + d, a + 2 * d, a + 3 * d, a + 4 * d]
      return {
        prompt: `Write down the median of the data set: ${vals.join('; ')}.`,
        answer: String(a + 2 * d),
        explanation: `The values are already in order and there are five of them, so the median is the third one, ${a + 2 * d}. With an even number of values the median would instead be the average of the middle two.`,
      }
    },
  },
]

const STATS_2: Family[] = [
  {
    cap: 121, // lo 2..12 x spread 4..14
    make: (n) => {
      const [i, j] = digits(n, [11, 11])
      const lo = 2 + i
      const vals = [lo + 2, lo + 5 + j, lo, lo + 4 + j, lo + 3]
      const hi = Math.max(...vals)
      const mn = Math.min(...vals)
      return {
        prompt: `Write down the smallest value and the range of the data set: ${vals.join('; ')}.`,
        answer: `Smallest = ${mn}; range = ${hi - mn}`,
        explanation: `The smallest value is ${mn} and the largest is ${hi}, so the range is ${hi} − ${mn} = ${hi - mn}. The range is a single number measuring spread, not the pair of extremes it is worked out from.`,
      }
    },
  },
  {
    cap: 108, // mean of five values chosen to divide exactly
    make: (n) => {
      const [i, j] = digits(n, [12, 9])
      const mean = 6 + i
      const d = 1 + j
      const vals = [mean - 2 * d, mean - d, mean, mean + d, mean + 2 * d]
      const total = vals.reduce((s, v) => s + v, 0)
      // The five values are symmetrical about `mean`, so the division is exact.
      if (total !== 5 * mean) throw new Error('mean family: values do not average to the mean')
      return {
        prompt: `Calculate the mean of the data set: ${vals.join('; ')}.`,
        answer: String(total / 5),
        explanation: `The five values add up to ${total}, and ${total} ÷ 5 = ${mean}. The mean uses every value, which is why one unusually large or small value pulls it about while the median stays put.`,
      }
    },
  },
]

/* ========================== ANALYTICAL GEOMETRY ========================== */

const ANALYTICAL_1: Family[] = [
  {
    cap: 144, // m 2..13 x c 1..12
    make: (n) => {
      const [i, j] = digits(n, [12, 12])
      const m = 2 + i
      const c = 1 + j
      return {
        prompt: `Write down the gradient of any line PARALLEL to y = ${m}x ${sign(c)}.`,
        answer: String(m),
        explanation: `Parallel lines have equal gradients, so the gradient is ${m}. The constant ${sign(c).replace('+ ', '+')} shifts the line up or down but never changes its slope.`,
      }
    },
  },
  {
    cap: 144, // m 2..13 x c 1..12
    make: (n) => {
      const [i, j] = digits(n, [12, 12])
      const m = 2 + i
      const c = 1 + j
      return {
        prompt: `Write down the gradient of any line PERPENDICULAR to y = ${m}x ${sign(-c)}.`,
        answer: frac(-1, m),
        explanation: `Perpendicular gradients multiply to −1, so the gradient is −1 ÷ ${m} = ${frac(-1, m)}. It is the negative RECIPROCAL, so both the sign and the fraction must be flipped, not just one of them.`,
      }
    },
  },
  {
    cap: 121, // a -5..5 x b -5..5
    make: (n) => {
      const [i, j] = digits(n, [11, 11])
      const a = -5 + i
      const b = nz(-5 + j)
      return {
        prompt: `Write down the coordinates of the image of A(${neg(a)} ; ${neg(b)}) after it is reflected in the x-axis.`,
        answer: `(${neg(a)} ; ${neg(-b)})`,
        explanation: `Reflecting in the x-axis keeps the x-coordinate and changes the sign of the y-coordinate, giving (${neg(a)} ; ${neg(-b)}). Reflecting in the y-axis would do the opposite.`,
      }
    },
  },
]

const ANALYTICAL_2: Family[] = [
  {
    cap: 144, // even coords so the midpoint is whole
    make: (n) => {
      const [i, j] = digits(n, [12, 12])
      const x1 = -6 + i
      const y1 = -6 + j
      const x2 = x1 + 2 * (2 + (i % 5))
      const y2 = y1 + 2 * (2 + (j % 5))
      return {
        prompt: `Write down the coordinates of the midpoint of the line segment joining A(${neg(x1)} ; ${neg(y1)}) and B(${neg(x2)} ; ${neg(y2)}).`,
        answer: `(${neg((x1 + x2) / 2)} ; ${neg((y1 + y2) / 2)})`,
        explanation: `The midpoint averages the two x-coordinates and, separately, the two y-coordinates: (${neg(x1)} + ${neg(x2)}) ÷ 2 = ${neg((x1 + x2) / 2)} and (${neg(y1)} + ${neg(y2)}) ÷ 2 = ${neg((y1 + y2) / 2)}. Subtracting instead of adding would start the distance formula, which answers a different question.`,
      }
    },
  },
  {
    cap: 132, // m 2..13 x c 1..11
    make: (n) => {
      const [i, j] = digits(n, [12, 11])
      const m = 2 + i
      const c = 1 + j
      return {
        prompt: `A line has equation y = ${m}x ${sign(c)}. Write down the gradient of a line parallel to it, and the gradient of a line perpendicular to it.`,
        answer: `Parallel: ${m}; perpendicular: ${frac(-1, m)}`,
        explanation: `Parallel lines share a gradient, so that one is ${m}. Perpendicular gradients have a product of −1, so the other is ${frac(-1, m)}. Asking for both together is a check that the negative reciprocal is not being confused with simply changing the sign.`,
      }
    },
  },
]

/* ============================= TRIGONOMETRY ============================== */

const TRIG_1: Family[] = [
  {
    cap: 8, // the special angles worth knowing by heart
    make: (n) => {
      const opts = [
        ['sin 30°', '½', 'in a 30-60-90 triangle the side opposite 30° is exactly half the hypotenuse'],
        ['cos 60°', '½', 'it equals sin 30°, because 30° and 60° are complementary angles'],
        ['tan 45°', '1', 'in a 45-45-90 triangle the opposite and adjacent sides are equal, so their ratio is 1'],
        ['sin 90°', '1', 'at 90° the side opposite the angle IS the hypotenuse, so the ratio reaches its maximum of 1'],
        ['cos 0°', '1', 'at 0° the adjacent side coincides with the hypotenuse, so the ratio is 1'],
        ['tan 0°', '0', 'at 0° the opposite side has zero length, so opposite ÷ adjacent is 0'],
        ['sin 0°', '0', 'at 0° the opposite side has zero length, so opposite ÷ hypotenuse is 0'],
        ['cos 90°', '0', 'at 90° the adjacent side has shrunk to nothing, so the ratio is 0'],
      ][n % 8]
      return {
        prompt: `Write down the value of ${opts[0]} without using a calculator.`,
        answer: opts[1],
        explanation: `This is a special angle: ${opts[2]}. These values are worth knowing by heart, since a calculator is not allowed for them.`,
      }
    },
  },
  {
    cap: 54, // a 1..9 x k 1..6
    make: (n) => {
      const [i, j] = digits(n, [9, 6])
      const a = 1 + i
      const k = 1 + j
      return {
        prompt: `Write down the amplitude of y = ${a === 1 ? '' : a} sin ${k === 1 ? '' : k}x.`,
        answer: String(a),
        explanation: `The amplitude is how far the graph reaches above and below its middle, which is the size of the coefficient of sin, so it is ${a}. The ${k === 1 ? 'coefficient of x' : k} inside the function changes the PERIOD instead, not the amplitude.`,
      }
    },
  },
  {
    cap: 48, // k 1..8 x sin/cos
    make: (n) => {
      const [i, j] = digits(n, [8, 6])
      const k = 1 + i
      const f = j % 2 === 0 ? 'sin' : 'cos'
      const a = 1 + Math.floor(j / 2)
      return {
        prompt: `Write down the period of y = ${a === 1 ? '' : a} ${f} ${k === 1 ? '' : k}x.`,
        answer: `${za(360 / k)}°`,
        explanation: `The period of ${f} x is 360°, and a coefficient of ${k} inside the function completes the cycle ${k} times as fast: 360° ÷ ${k} = ${za(360 / k)}°. The ${a === 1 ? 'coefficient in front' : a + ' in front'} stretches the graph vertically and leaves the period alone.`,
      }
    },
  },
  {
    cap: 110, // opposite 2..12 x adjacent 2..12
    make: (n) => {
      const [i, j] = digits(n, [11, 10])
      const opp = 2 + i
      const adj = 3 + j
      return {
        prompt: `In △PQR, Q̂ = 90°, PQ = ${adj} units and QR = ${opp} units. Write down tan P.`,
        answer: frac(opp, adj),
        explanation: `tan is opposite ÷ adjacent. The side opposite P̂ is QR = ${opp} and the side next to it is PQ = ${adj}, so tan P = ${frac(opp, adj)}. The hypotenuse PR plays no part in the tan ratio.`,
      }
    },
  },
]

const TRIG_2: Family[] = [
  {
    cap: 54, // a 1..9 x k 1..6
    make: (n) => {
      const [i, j] = digits(n, [9, 6])
      const a = 1 + i
      const k = 1 + j
      return {
        prompt: `Write down the amplitude and the period of y = ${a === 1 ? '' : a} cos ${k === 1 ? '' : k}x.`,
        answer: `Amplitude = ${a}; period = ${za(360 / k)}°`,
        explanation: `The number in FRONT sets the amplitude, ${a}, and the number INSIDE sets the period: 360° ÷ ${k} = ${za(360 / k)}°. Swapping the two is the usual mistake, which is why they are asked together.`,
      }
    },
  },
  {
    cap: 153, // a 1..9 x c -8..8
    make: (n) => {
      const [i, j] = digits(n, [9, 17])
      const a = 1 + i
      const c = nz(-8 + j)
      return {
        prompt: `Write down the maximum and minimum values of y = ${a === 1 ? '' : a} sin x ${sign(c)}.`,
        answer: `Maximum = ${a + c}; minimum = ${neg(-a + c)}`,
        explanation: `sin x runs between −1 and 1, so ${a === 1 ? '' : a + ' × '}sin x runs between ${neg(-a)} and ${a}, and the ${sign(c).replace('+ ', '+')} shifts both ends: maximum ${a} + (${neg(c)}) = ${a + c} and minimum ${neg(-a)} + (${neg(c)}) = ${neg(-a + c)}.`,
      }
    },
  },
  {
    cap: 110, // legs of a right-angled triangle
    make: (n) => {
      const [i, j] = digits(n, [11, 10])
      const a = 2 + i
      const b = 3 + j
      return {
        prompt: `In △ABC, B̂ = 90°, AB = ${a} units and BC = ${b} units. Write down tan A and tan C.`,
        answer: `tan A = ${frac(b, a)} and tan C = ${frac(a, b)}`,
        explanation: `tan is opposite ÷ adjacent, and the two acute angles swap which side is which: opposite A is BC = ${b} while opposite C is AB = ${a}. So the two ratios are reciprocals of each other, ${frac(b, a)} and ${frac(a, b)}.`,
      }
    },
  },
]

/* =========================== EUCLIDEAN GEOMETRY ========================== */

const EUCLID_1: Family[] = [
  {
    cap: 5, // the facts worth recalling outright
    make: (n) => {
      const opts = [
        ['the sum of the interior angles of a triangle', '180°', 'This holds for every triangle, whatever its shape or size.'],
        ['the sum of the interior angles of a quadrilateral', '360°', 'A quadrilateral splits into two triangles, and 2 × 180° = 360°.'],
        ['the sum of the angles on a straight line', '180°', 'A straight line is half a revolution.'],
        ['the sum of the angles around a point', '360°', 'Angles around a point make one complete revolution.'],
        ['the size of each interior angle of an equilateral triangle', '60°', 'All three angles are equal and must total 180°, so each is 180° ÷ 3.'],
      ][n % 5]
      return {
        prompt: `Write down ${opts[0]}.`,
        answer: opts[1],
        explanation: `${opts[2]} It is a fact to recall, not something to derive in the exam.`,
      }
    },
  },
  {
    cap: 120, // A 20..49 x B 40..51
    make: (n) => {
      const [i, j] = digits(n, [12, 10])
      const A = 25 + i * 2
      const B = 42 + j * 3
      return {
        prompt: `In △ABC, Â = ${A}° and B̂ = ${B}°. Write down the size of Ĉ.`,
        answer: `${180 - A - B}°`,
        explanation: `The interior angles of a triangle add up to 180°, so Ĉ = 180° − ${A}° − ${B}° = ${180 - A - B}°. No construction or theorem beyond that sum is needed.`,
      }
    },
  },
  {
    cap: 120, // x 20..139
    make: (n) => {
      const x = 22 + (n % 120)
      return {
        prompt: `ABCD is a parallelogram with Â = ${x}°. Write down the size of Ĉ.`,
        answer: `${x}°`,
        explanation: `The opposite angles of a parallelogram are equal, so Ĉ = Â = ${x}°. It is B̂ and D̂ that would instead be 180° − ${x}° = ${180 - x}°, being co-interior with Â.`,
      }
    },
  },
  {
    cap: 115, // x 25..139
    make: (n) => {
      const x = 25 + (n % 115)
      return {
        prompt: `ABCD is a cyclic quadrilateral with Â = ${x}°. Write down the size of Ĉ.`,
        answer: `${180 - x}°`,
        explanation: `The opposite angles of a cyclic quadrilateral are supplementary, so Ĉ = 180° − ${x}° = ${180 - x}°. Supplementary means adding to 180°, not being equal — that would be a parallelogram.`,
      }
    },
  },
  {
    cap: 16, // n 3..18 sides
    make: (n) => {
      const s = 3 + (n % 16)
      return {
        prompt: `Write down the size of each exterior angle of a regular polygon with ${s} sides.`,
        answer: `${za(Number((360 / s).toFixed(2)))}°`,
        explanation: `The exterior angles of any polygon add up to one full turn, 360°, and in a regular polygon they are all equal: 360° ÷ ${s} = ${za(Number((360 / s).toFixed(2)))}°. This works straight from the number of sides, with no need for the interior angle first.`,
      }
    },
  },
]

const EUCLID_2: Family[] = [
  {
    cap: 120, // x 25..144
    make: (n) => {
      const x = 25 + (n % 120)
      return {
        prompt: `ABCD is a parallelogram with B̂ = ${x}°. Write down the sizes of D̂ and Â.`,
        answer: `D̂ = ${x}° and Â = ${180 - x}°`,
        explanation: `Opposite angles of a parallelogram are equal, so D̂ = B̂ = ${x}°. Â is co-interior with B̂ between the parallel sides AD and BC, so Â = 180° − ${x}° = ${180 - x}°.`,
      }
    },
  },
  {
    cap: 110, // A x B
    make: (n) => {
      const [i, j] = digits(n, [11, 10])
      const A = 26 + i * 3
      const B = 41 + j * 4
      return {
        prompt: `In △ABC, Â = ${A}° and B̂ = ${B}°. Write down the size of Ĉ and the size of the exterior angle of the triangle at C.`,
        answer: `Ĉ = ${180 - A - B}° and the exterior angle = ${A + B}°`,
        explanation: `Ĉ = 180° − ${A}° − ${B}° = ${180 - A - B}°. The exterior angle at C is 180° − ${180 - A - B}° = ${A + B}°, which is exactly ${A}° + ${B}° — the exterior angle of a triangle equals the sum of the two opposite interior angles.`,
      }
    },
  },
  {
    cap: 16, // n 3..18 sides
    make: (n) => {
      const s = 3 + (n % 16)
      const total = (s - 2) * 180
      return {
        prompt: `Write down the sum of the interior angles of a polygon with ${s} sides, and the size of each interior angle if the polygon is regular.`,
        answer: `${total}° and ${za(Number((total / s).toFixed(2)))}°`,
        explanation: `A polygon with ${s} sides splits into ${s - 2} triangles, so the interior angles total ${s - 2} × 180° = ${total}°. Regular means all ${s} angles are equal, so each is ${total}° ÷ ${s} = ${za(Number((total / s).toFixed(2)))}°.`,
      }
    },
  },
]

/* ========================= COUNTING & PROBABILITY ======================== */

const PROB_1: Family[] = [
  {
    cap: 110, // red 1..11 x blue 2..11
    make: (n) => {
      const [i, j] = digits(n, [11, 10])
      const r = 1 + i
      const b = 2 + j
      return {
        prompt: `A bag contains ${r} red marble${r === 1 ? '' : 's'} and ${b} blue marbles, identical apart from colour. One marble is drawn at random. Write down the probability that it is red.`,
        answer: frac(r, r + b),
        explanation: `There ${r === 1 ? 'is 1 favourable outcome' : `are ${r} favourable outcomes`} out of ${r + b} equally likely ones, so the probability is ${frac(r, r + b)}. The denominator counts EVERY marble in the bag, not just the ones of the other colour.`,
      }
    },
  },
  {
    cap: 6, // faces 1..6 on a fair die
    make: (n) => {
      const face = 1 + (n % 6)
      return {
        prompt: `An ordinary six-sided die is rolled once. Write down the probability of rolling a ${face}.`,
        answer: '1/6',
        explanation: `There is one favourable outcome out of six equally likely ones. On a fair die every face has the same probability, so which number is asked for makes no difference to the answer.`,
      }
    },
  },
  {
    cap: 6, // n 3..8 objects
    make: (n) => {
      const k = 3 + (n % 6)
      const f = Array.from({ length: k }, (_, t) => t + 1).reduce((a, b) => a * b, 1)
      return {
        prompt: `In how many different ways can ${k} different books be arranged in a row on a shelf?`,
        answer: String(f),
        explanation: `Any of the ${k} books can go first, any of the remaining ${k - 1} second, and so on, giving ${k}! = ${Array.from({ length: k }, (_, t) => k - t).join(' × ')} = ${f} arrangements.`,
      }
    },
  },
  {
    cap: 95, // P(not A) as a percentage 5..99
    make: (n) => {
      const p = 5 + (n % 95)
      return {
        prompt: `The probability that an event A does NOT happen is ${za(p / 100)}. Write down P(A).`,
        answer: za(Number((1 - p / 100).toFixed(2))),
        explanation: `An event either happens or it does not, so the two probabilities add to 1: P(A) = 1 − ${za(p / 100)} = ${za(Number((1 - p / 100).toFixed(2)))}. This is the complementary rule.`,
      }
    },
  },
]

const PROB_2: Family[] = [
  {
    cap: 120, // red x blue x green
    make: (n) => {
      const [i, j] = digits(n, [12, 10])
      const r = 2 + i
      const b = 3 + j
      const g = 1 + ((i + j) % 6)
      const t = r + b + g
      return {
        prompt: `A bag contains ${r} red, ${b} blue and ${g} green marbles, identical apart from colour. One marble is drawn at random. Write down P(red) and P(not red).`,
        answer: `P(red) = ${frac(r, t)} and P(not red) = ${frac(b + g, t)}`,
        explanation: `There are ${t} marbles altogether, of which ${r} are red and the other ${b + g} are not. The two probabilities add to 1, which is the quickest check that neither has been worked out wrongly.`,
      }
    },
  },
  {
    cap: 121, // P(A) x P(B) as percentages, mutually exclusive
    make: (n) => {
      const [i, j] = digits(n, [11, 11])
      const a = 5 + i * 3
      const b = 5 + j * 3
      return {
        prompt: `A and B are mutually exclusive events with P(A) = ${za(a / 100)} and P(B) = ${za(b / 100)}. Write down P(A and B) and P(A or B).`,
        answer: `P(A and B) = 0 and P(A or B) = ${za(Number(((a + b) / 100).toFixed(2)))}`,
        explanation: `Mutually exclusive means the two events cannot both happen, so P(A and B) = 0. With no overlap to subtract, P(A or B) is simply ${za(a / 100)} + ${za(b / 100)} = ${za(Number(((a + b) / 100).toFixed(2)))}.`,
      }
    },
  },
]

/* ================================ WIRING ================================= */

const BY_TOPIC: Record<string, { one: Family[]; two: Family[] }> = {
  'math-algebra': { one: ALGEBRA_1, two: ALGEBRA_2 },
  'math-number-patterns': { one: PATTERNS_1, two: PATTERNS_2 },
  'math-functions': { one: FUNCTIONS_1, two: FUNCTIONS_2 },
  'math-finance-growth': { one: FINANCE_1, two: FINANCE_2 },
  'math-calculus': { one: CALCULUS_1, two: CALCULUS_2 },
  'math-statistics': { one: STATS_1, two: STATS_2 },
  'math-analytical-geometry': { one: ANALYTICAL_1, two: ANALYTICAL_2 },
  'math-trigonometry': { one: TRIG_1, two: TRIG_2 },
  'math-euclidean-geometry': { one: EUCLID_1, two: EUCLID_2 },
  'math-counting-probability': { one: PROB_1, two: PROB_2 },
}

/**
 * The n-th Level 1 item for a topic at the given mark value.
 *
 * Indices are spread across the topic's families round-robin, so a paper draws
 * evenly from all of them rather than exhausting one before starting the next.
 * Each family is asked for index floor(n / familyCount), which stays inside its
 * capacity as long as the caller does not ask for more than the total the
 * families can supply -- `capacity` below reports that total, and the caller
 * is expected to check it.
 */
export function generate(topicId: string, marks: 1 | 2, n: number): Item {
  const set = BY_TOPIC[topicId]
  if (!set) throw new Error(`no Level 1 families authored for topic ${topicId}`)
  const fams = marks === 1 ? set.one : set.two
  // Walk families round-robin, but skip one that has run out of parameters.
  let k = 0
  for (let pass = 0; pass < 10_000; pass++) {
    const f = fams[pass % fams.length]
    const within = Math.floor(pass / fams.length)
    if (within >= f.cap) continue
    if (k === n) {
      const it = f.make(within)
      return { prompt: tidy(it.prompt), answer: tidy(it.answer), explanation: tidy(it.explanation) }
    }
    k++
  }
  throw new Error(`topic ${topicId} at ${marks} mark(s) is exhausted at index ${n}`)
}

/** How many distinct items this topic can supply at the given mark value. */
export function capacity(topicId: string, marks: 1 | 2): number {
  const set = BY_TOPIC[topicId]
  if (!set) return 0
  return (marks === 1 ? set.one : set.two).reduce((s, f) => s + f.cap, 0)
}
