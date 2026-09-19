/**
 * Mathematical Literacy taxation questions, built from the SARS table.
 *
 * WHY THESE ARE BUILT AND NOT TYPED. Every answer here is arithmetic on the
 * table in taxTables.ts, and a tax answer typed by hand is a number nobody can
 * check without redoing the whole chain. Computing them means the answer can
 * never disagree with the table printed above the question, and a new tax year
 * updates the answers by updating the table.
 *
 * THE CHAIN THESE DRILL. A Mat Lit taxation question is one long procedure and
 * learners lose it at a different step each time, so the set walks it:
 *
 *   gross income  →  minus pension/retirement contributions  →  TAXABLE income
 *   →  read the SARS table  →  minus rebates  →  annual tax  →  ÷ 12 for PAYE
 *
 * Each question states its own figures and carries the table in `context`, the
 * way an NSC paper prints it, so none of them depends on another.
 */
import type { Question } from '@/types'
import {
  SARS_2025_26 as TABLE,
  annualTax,
  bracketFor,
  rand,
  rands,
  rebateFor,
  tableContext,
  taxBeforeRebates,
} from '@/data/taxTables'

const ctx = tableContext(TABLE)

/** One taxpayer's full chain, so every question about them agrees. */
function chain(grossAnnual: number, pensionPct: number, age: number) {
  const pension = (grossAnnual * pensionPct) / 100
  const taxable = grossAnnual - pension
  const b = bracketFor(taxable, TABLE)
  const beforeRebates = taxBeforeRebates(taxable, TABLE)
  const rebate = rebateFor(age, TABLE)
  const annual = annualTax(taxable, age, TABLE)
  return { pension, taxable, b, beforeRebates, rebate, annual, monthly: annual / 12 }
}

const bandOf = (b: ReturnType<typeof bracketFor>) =>
  b.to === null ? `${rand(b.from)} and above` : `${rand(b.from)} – ${rand(b.to)}`

interface Person {
  name: string
  gross: number
  pensionPct: number
  age: number
  grade: 10 | 11 | 12
}

const PEOPLE: Person[] = [
  { name: 'Nomsa', gross: 348_000, pensionPct: 7.5, age: 41, grade: 12 },
  { name: 'Sipho', gross: 512_000, pensionPct: 6, age: 52, grade: 12 },
  { name: 'Mrs Adams', gross: 286_800, pensionPct: 5, age: 67, grade: 12 },
  { name: 'Mr Khumalo', gross: 720_000, pensionPct: 10, age: 58, grade: 12 },
  { name: 'Lerato', gross: 240_000, pensionPct: 0, age: 29, grade: 11 },
]

const out: Question[] = []

for (const p of PEOPLE) {
  const c = chain(p.gross, p.pensionPct, p.age)
  const id = p.name.toLowerCase().replace(/[^a-z]/g, '')
  const base = { topicId: 'finance', grade: p.grade, context: ctx } as const

  if (p.pensionPct > 0) {
    out.push({
      ...base,
      id: `tax-${id}-taxable`,
      difficulty: 'Moderate',
      cognitiveLevel: 2,
      marks: 3,
      prompt: `${p.name} earns a gross annual salary of ${rand(p.gross)} and contributes ${String(p.pensionPct).replace('.', ',')}% of it to a pension fund. Calculate ${p.name}'s TAXABLE income for the year.`,
      answer: `Pension contribution = ${String(p.pensionPct).replace('.', ',')}% of ${rand(p.gross)} = ${rands(c.pension)}. Taxable income = ${rand(p.gross)} − ${rands(c.pension)} = ${rands(c.taxable)}.`,
      explanation:
        'The pension contribution comes off BEFORE the tax table is used, which is the whole point of the deduction: it lowers the income the table is read against. The percentage is of GROSS salary, not of taxable income, so it has to be worked out first. Reading the table with the gross figure overcharges the tax and loses every mark after it.',
    })
  }

  out.push({
    ...base,
    id: `tax-${id}-table`,
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: `${p.name}'s taxable income for the year is ${rands(c.taxable)}. Use the tax table to calculate the tax payable BEFORE rebates.`,
    answer: `${rands(c.taxable)} falls in the bracket ${bandOf(c.b)}. Tax = ${rand(c.b.base)} + ${c.b.rate}% of (${rands(c.taxable)} − ${rand(c.b.from - 1)}) = ${rand(c.b.base)} + ${c.b.rate}% of ${rands(c.taxable - (c.b.from - 1))} = ${rand(c.b.base)} + ${rands(((c.taxable - (c.b.from - 1)) * c.b.rate) / 100)} = ${rands(c.beforeRebates)}.`,
    explanation: `Only the income ABOVE ${rand(c.b.from - 1)} is charged at ${c.b.rate}%. The ${rand(c.b.base)} in front of the row is already the tax on everything below that point, worked out at the lower rates — which is why applying ${c.b.rate}% to the whole ${rands(c.taxable)} is wrong, and wrong by a large amount.`,
  })

  out.push({
    ...base,
    id: `tax-${id}-annual`,
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `${p.name} is ${p.age} years old and has a taxable income of ${rands(c.taxable)} for the year. Calculate the annual tax payable after rebates, and hence the monthly PAYE deducted from ${p.name}'s salary.`,
    answer: `From the table: ${rand(c.b.base)} + ${c.b.rate}% of (${rands(c.taxable)} − ${rand(c.b.from - 1)}) = ${rands(c.beforeRebates)}. At ${p.age}, ${p.name} qualifies for ${p.age >= 75 ? 'the primary, secondary and tertiary rebates' : p.age >= 65 ? 'the primary and secondary rebates' : 'the primary rebate only'}, totalling ${rand(c.rebate)}. Annual tax = ${rands(c.beforeRebates)} − ${rand(c.rebate)} = ${rands(c.annual)}. Monthly PAYE = ${rands(c.annual)} ÷ 12 = ${rands(c.monthly)}.`,
    explanation: `The rebate is taken off the TAX, not off the income — subtracting it from ${rands(c.taxable)} first would change which bracket applies and give a different, wrong answer. Age decides which rebates apply: everyone gets the primary one, the secondary is added from 65 and the tertiary from 75, and they stack.${p.age >= 65 ? ` ${p.name} is ${p.age}, so both the primary and secondary apply.` : ''} Dividing by 12 at the end turns the annual figure into what actually comes off a payslip each month.`,
  })
}

/** One question on the threshold, which is where the rebate idea pays off. */
out.push({
  topicId: 'finance',
  grade: 12,
  context: ctx,
  id: 'tax-threshold-why',
  difficulty: 'Challenge',
  cognitiveLevel: 4,
  marks: 4,
  prompt: `A learner says the tax threshold of ${rand(TABLE.thresholds.under65)} for a person under 65 is "a separate rule SARS made up". Use the tax table to show that it is not, and explain what the threshold actually is.`,
  answer: `Reading the table at ${rand(TABLE.thresholds.under65)}: it falls in the ${bandOf(TABLE.brackets[0])} bracket, so the tax is ${TABLE.brackets[0].rate}% of ${rand(TABLE.thresholds.under65)} = ${rands(taxBeforeRebates(TABLE.thresholds.under65, TABLE))}. The primary rebate is ${rand(TABLE.rebates.primary)}. Subtracting it gives ${rands(taxBeforeRebates(TABLE.thresholds.under65, TABLE))} − ${rand(TABLE.rebates.primary)} = R0,00. So the threshold is simply the income at which the tax from the table is exactly cancelled by the rebate — below it the rebate is larger than the tax, and no tax is payable.`,
  explanation:
    'The threshold is not an extra rule, it is a consequence of the two rules already in the table. Showing that the arithmetic comes out at exactly zero is the whole answer, and it explains why the threshold moves whenever either the rebate or the first bracket changes.',
})


/* ===================================================================== */
/* Compound interest, the Mathematical Literacy way                      */
/* ===================================================================== */

/**
 * Compound interest worked ONE YEAR AT A TIME.
 *
 * Mathematical Literacy does not use A = P(1 + i)ⁿ. It is not in the
 * curriculum, it is not supplied in the exam, and the marks are written for a
 * year-by-year table: opening balance, interest for the year, closing balance,
 * with the closing balance carried forward. So these answers show that table,
 * and every figure in it is computed here rather than typed.
 */
function yearByYear(principal: number, ratePct: number, years: number) {
  const rows: { year: number; open: number; interest: number; close: number }[] = []
  let balance = principal
  for (let year = 1; year <= years; year++) {
    const interest = (balance * ratePct) / 100
    rows.push({ year, open: balance, interest, close: balance + interest })
    balance += interest
  }
  return rows
}

const COMPOUND: { name: string; p: number; rate: number; years: number; grade: 10 | 11 | 12 }[] = [
  { name: 'Thandi', p: 12_000, rate: 8, years: 3, grade: 11 },
  { name: 'Mr Botha', p: 25_000, rate: 6.5, years: 2, grade: 11 },
  { name: 'Zanele', p: 8_000, rate: 9, years: 4, grade: 12 },
  { name: 'The Mokoena family', p: 45_000, rate: 7, years: 3, grade: 12 },
]

for (const c of COMPOUND) {
  const rows = yearByYear(c.p, c.rate, c.years)
  const last = rows[rows.length - 1]
  const simple = c.p + (c.p * c.rate * c.years) / 100
  const rateText = String(c.rate).replace('.', ',')
  const id = c.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)

  out.push({
    topicId: 'finance',
    grade: c.grade,
    id: `ci-${id}-table`,
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: c.years + 2,
    prompt: `${c.name} invests ${rand(c.p)} at ${rateText}% per year compound interest for ${c.years} years. Work out the value of the investment at the end of each year, and state what it is worth after ${c.years} years.`,
    answer:
      rows
        .map(
          (r) =>
            `Year ${r.year}: ${rands(r.open)} + ${rateText}% of ${rands(r.open)} (= ${rands(r.interest)}) = ${rands(r.close)}`,
        )
        .join('. ') + `. After ${c.years} years the investment is worth ${rands(last.close)}.`,
    explanation: `Each year's interest is worked out on the balance at the START of that year, and the closing balance is carried forward to become the next year's opening balance. That carrying forward is what makes it compound. A quick way to do each line is to multiply by ${String(1 + c.rate / 100).replace('.', ',')}, but the year-by-year working is what the method marks are for, and it is the only way to fill in the table a question like this usually asks for.`,
  })

  out.push({
    topicId: 'finance',
    grade: c.grade,
    id: `ci-${id}-vs-simple`,
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `${c.name} invests ${rand(c.p)} for ${c.years} years at ${rateText}% per year. Calculate how much more the investment is worth under COMPOUND interest than under SIMPLE interest, and explain where the difference comes from.`,
    answer: `Simple interest: ${rateText}% of ${rand(c.p)} = ${rands((c.p * c.rate) / 100)} added each year, so after ${c.years} years the value is ${rand(c.p)} + ${c.years} × ${rands((c.p * c.rate) / 100)} = ${rands(simple)}. Compound interest, year by year: ${rows.map((r) => `${rands(r.close)}`).join(', then ')}. The difference is ${rands(last.close)} − ${rands(simple)} = ${rands(last.close - simple)}. It comes from the interest EARNING interest: under simple interest every year's interest is worked out on the original ${rand(c.p)}, while under compound interest year 2 onwards is worked out on a balance that already includes the earlier interest.`,
    explanation: `The two are identical after one year — ${rands(rows[0].interest)} either way — and only separate from year 2, which is the point worth making in the explanation. The reasoning marks are for naming the mechanism rather than just reporting that compound is bigger.`,
  })
}

/** Everything above, in one list. Exported last so it cannot be read before it is filled. */
export const taxQuestions: Question[] = out
