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
  SARS_2026_27 as TABLE,
  annualTax,
  bracketFor,
  medicalCreditsPerYear,
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
  // Tax-rate tables and rebates are introduced in Grade 12 (WCED ATP 2026,
  // Grade 12 Term 1). Lerato was Grade 11 and put this on Grade 11 worksheets.
  { name: 'Lerato', gross: 240_000, pensionPct: 0, age: 29, grade: 12 },
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
/* From payslip to tax: the full chain                                   */
/* ===================================================================== */

/**
 * The long Grade 12 taxation question: a salary with extras on top (a 13th
 * cheque, a travel allowance), deductions taken off it (pension, a retirement
 * annuity, a donation), the table, the rebates, and then the medical scheme
 * fees tax credit, which comes off the TAX and not off the income. Learners
 * lose this one at a different step each time, so each step is its own
 * question on the same employee, and the last ones put it all together.
 *
 * Every rule a learner needs is stated in the scenario, the way a paper states
 * it, rather than assumed: what share of a travel allowance is taxed, that the
 * deductions are allowed in full, and how net pay is defined.
 */
interface Employee {
  name: string
  age: number
  job: string
  /** Basic salary per month. */
  basic: number
  /** A 13th cheque equal to one month's basic salary. */
  bonus: boolean
  /** Pension contribution, as a percentage of the monthly basic salary. */
  pensionPct: number
  /** Retirement annuity, per month. */
  ra: number
  /** Travel allowance per month; 80% of it is taxable. */
  travel: number
  /** People on the medical scheme, the employee included. */
  medicalMembers: number
  /** The employee's medical scheme contribution per month. */
  medical: number
  /** A donation for the year to a registered public benefit organisation. */
  donation: number
}

const TRAVEL_TAXABLE_PCT = 80

const EMPLOYEES: Employee[] = [
  { name: 'Nokuthula', age: 36, job: 'a nursing manager at a district hospital', basic: 38_400, bonus: true, pensionPct: 7.5, ra: 1_000, travel: 0, medicalMembers: 3, medical: 4_200, donation: 2_400 },
  { name: 'Mr Pillay', age: 41, job: 'a sales representative for a seed company', basic: 29_500, bonus: false, pensionPct: 6, ra: 0, travel: 5_000, medicalMembers: 2, medical: 3_600, donation: 0 },
  { name: 'Mrs Khoza', age: 66, job: 'the principal of a secondary school', basic: 61_200, bonus: true, pensionPct: 7.5, ra: 2_500, travel: 0, medicalMembers: 2, medical: 6_800, donation: 5_000 },
  { name: 'Sizwe', age: 27, job: 'a junior technician at a cellphone tower company', basic: 14_500, bonus: false, pensionPct: 0, ra: 0, travel: 0, medicalMembers: 1, medical: 1_650, donation: 0 },
]

const pct = (n: number) => String(n).replace('.', ',')
const people = (e: Employee) =>
  e.medicalMembers === 1 ? `${e.name} only` : `${e.name} and ${e.medicalMembers === 2 ? 'one dependant' : `${e.medicalMembers - 1} dependants`}`

function payslipChain(e: Employee) {
  const salary = e.basic * 12
  const bonus = e.bonus ? e.basic : 0
  const travelYear = e.travel * 12
  const travelTaxed = (travelYear * TRAVEL_TAXABLE_PCT) / 100
  const income = salary + bonus + travelTaxed
  const pension = (salary * e.pensionPct) / 100
  const ra = e.ra * 12
  const deductions = pension + ra + e.donation
  const taxable = income - deductions
  const b = bracketFor(taxable, TABLE)
  const beforeRebates = taxBeforeRebates(taxable, TABLE)
  const rebate = rebateFor(e.age, TABLE)
  const afterRebates = Math.max(0, beforeRebates - rebate)
  const credits = medicalCreditsPerYear(e.medicalMembers, TABLE)
  const annual = Math.max(0, afterRebates - credits)
  const paye = annual / 12
  const net = e.basic + e.travel - paye - (e.basic * e.pensionPct) / 100 - e.ra - e.medical
  return { salary, bonus, travelYear, travelTaxed, income, pension, ra, deductions, taxable, b, beforeRebates, rebate, afterRebates, credits, annual, paye, net }
}

/** "The pension and donation may be deducted ...", naming only what this employee has. */
function deductible(e: Employee): string {
  const items = [e.pensionPct ? 'pension' : '', e.ra ? 'retirement annuity' : '', e.donation ? 'donation' : ''].filter(Boolean)
  if (!items.length) return ''
  const list = items.length === 1 ? items[0] : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
  return `The ${list} ${items.length === 1 ? 'amount' : 'amounts'} may be deducted in full from income before the tax table is used.`
}

function scenario(e: Employee): string {
  const lines = [
    `${e.name} (${e.age}) is ${e.job}, earning a basic salary of ${rand(e.basic)} per month.`,
    e.bonus ? `In December ${e.name} also receives a 13th cheque equal to one month's basic salary.` : '',
    e.travel ? `${e.name} receives a travel allowance of ${rand(e.travel)} per month. SARS taxes ${TRAVEL_TAXABLE_PCT}% of a travel allowance.` : '',
    e.pensionPct ? `${e.name} contributes ${pct(e.pensionPct)}% of the basic salary to a pension fund every month.` : '',
    e.ra ? `${e.name} pays ${rand(e.ra)} per month into a retirement annuity.` : '',
    e.donation ? `During the year ${e.name} donates ${rand(e.donation)} to a registered public benefit organisation and receives a tax certificate for it.` : '',
    `${e.name}'s medical scheme covers ${people(e)}, at ${rand(e.medical)} per month.`,
    deductible(e),
  ].filter(Boolean)
  return lines.join(' ')
}

for (const e of EMPLOYEES) {
  const c = payslipChain(e)
  const id = `taxslip-${e.name.toLowerCase().replace(/[^a-z]/g, '')}`
  const base = { topicId: 'finance', grade: 12 as const, context: `${scenario(e)}\n\n${ctx}` }
  const incomeParts = [
    `basic salary ${rand(e.basic)} × 12 = ${rand(c.salary)}`,
    e.bonus ? `13th cheque ${rand(c.bonus)}` : '',
    e.travel ? `taxable travel allowance ${TRAVEL_TAXABLE_PCT}% × (${rand(e.travel)} × 12) = ${TRAVEL_TAXABLE_PCT}% × ${rand(c.travelYear)} = ${rands(c.travelTaxed)}` : '',
  ].filter(Boolean)

  out.push({
    ...base,
    id: `${id}-income`,
    difficulty: e.travel || e.bonus ? 'Moderate' : 'Easy',
    cognitiveLevel: 2,
    marks: e.travel || e.bonus ? 3 : 2,
    prompt: `Calculate ${e.name}'s total income for the year that SARS taxes, before any deductions.`,
    answer: `${incomeParts.join('; ')}. Total = ${rands(c.income)}.`,
    explanation: `${e.bonus ? 'The 13th cheque is salary too, so it is taxed: leaving it out is the commonest slip here. ' : ''}${e.travel ? `Only ${TRAVEL_TAXABLE_PCT}% of the travel allowance is added, because that is the share SARS taxes; the whole allowance still arrives on the payslip. ` : ''}Everything is worked out for the YEAR, because the tax table is an annual table.`,
  })

  if (c.deductions > 0) {
    const parts = [
      e.pensionPct ? `pension ${pct(e.pensionPct)}% × ${rand(c.salary)} = ${rands(c.pension)}` : '',
      e.ra ? `retirement annuity ${rand(e.ra)} × 12 = ${rand(c.ra)}` : '',
      e.donation ? `donation ${rand(e.donation)}` : '',
    ].filter(Boolean)
    out.push({
      ...base,
      id: `${id}-taxable`,
      difficulty: 'Moderate',
      cognitiveLevel: 2,
      marks: 4,
      prompt: `${e.name}'s income for the year that SARS taxes is ${rands(c.income)}. Calculate the total deductions and hence ${e.name}'s taxable income.`,
      answer: `Deductions: ${parts.join('; ')}. Total deductions = ${rands(c.deductions)}. Taxable income = ${rands(c.income)} − ${rands(c.deductions)} = ${rands(c.taxable)}.`,
      explanation: `${e.pensionPct ? `The pension is ${pct(e.pensionPct)}% of the BASIC salary only, so it is ${pct(e.pensionPct)}% of ${rand(c.salary)}${e.bonus ? ', not of the salary plus the 13th cheque' : ''}. ` : ''}The deductions come off the income BEFORE the table is read: they lower the income the tax is worked out on. The medical scheme contribution is not one of them, because medical costs are handled later, as a credit against the tax.`,
    })
  }

  out.push({
    ...base,
    id: `${id}-annual-tax`,
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 7,
    prompt: `${e.name}'s taxable income for the year is ${rands(c.taxable)}. Use the tax table to calculate the income tax ${e.name} must pay for the year, after rebates and the medical scheme fees tax credit.`,
    answer: `${rands(c.taxable)} is in the bracket ${bandOf(c.b)}. Tax = ${c.b.base ? `${rand(c.b.base)} + ${c.b.rate}% × (${rands(c.taxable)} − ${rand(c.b.from - 1)})` : `${c.b.rate}% × ${rands(c.taxable)}`} = ${rands(c.beforeRebates)}. Rebates at age ${e.age}: ${e.age >= 65 ? `${rand(TABLE.rebates.primary)} + ${rand(TABLE.rebates.secondary)} = ${rand(c.rebate)}` : rand(c.rebate)}. After rebates: ${rands(c.beforeRebates)} − ${rand(c.rebate)} = ${rands(c.afterRebates)}. Medical tax credit: ${medicalCreditWorking(e.medicalMembers)} = ${rand(c.credits)} for the year. Tax for the year = ${rands(c.afterRebates)} − ${rand(c.credits)} = ${rands(c.annual)}.`,
    explanation: `The order matters: the table gives tax on the taxable income, the rebates come off that tax, and the medical credit comes off what is left. Both the rebates and the medical credit are taken off the TAX, never off the income. The credit in the table is per MONTH, so it is multiplied by 12 before it is subtracted from an annual tax.`,
  })

  out.push({
    ...base,
    id: `${id}-net-pay`,
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 5,
    prompt: `${e.name}'s income tax for the year is ${rands(c.annual)}, deducted in 12 equal monthly amounts (PAYE). Calculate ${e.name}'s net (take-home) pay ${e.bonus ? 'in a month with no 13th cheque' : 'for a month'}, where net pay = basic salary${e.travel ? ' + travel allowance' : ''} − PAYE${e.pensionPct ? ' − pension' : ''}${e.ra ? ' − retirement annuity' : ''} − medical scheme contribution.`,
    answer: `PAYE = ${rands(c.annual)} ÷ 12 = ${rands(c.paye)}. Net pay = ${rand(e.basic)}${e.travel ? ` + ${rand(e.travel)}` : ''} − ${rands(c.paye)}${e.pensionPct ? ` − ${rands((e.basic * e.pensionPct) / 100)}` : ''}${e.ra ? ` − ${rand(e.ra)}` : ''} − ${rand(e.medical)} = ${rands(c.net)}.`,
    explanation: `Net pay uses MONTHLY amounts throughout, so the annual tax is divided by 12 first.${e.travel ? ` The whole travel allowance is paid out, even though only ${TRAVEL_TAXABLE_PCT}% of it was taxed.` : ''}${e.pensionPct ? ` The pension is ${pct(e.pensionPct)}% of one month's basic salary: ${pct(e.pensionPct)}% × ${rand(e.basic)} = ${rands((e.basic * e.pensionPct) / 100)}.` : ''}`,
  })
}

function medicalCreditWorking(members: number): string {
  const m = TABLE.medicalCredits!
  const parts = [rand(m.member)]
  if (members >= 2) parts.push(rand(m.firstDependant))
  if (members > 2) parts.push(`${members - 2} × ${rand(m.eachAdditional)}`)
  return parts.length === 1 ? `${parts[0]} × 12` : `(${parts.join(' + ')}) × 12`
}

/** The two slips this chain is lost on, put to the learner to find. */
{
  const e = EMPLOYEES[1]
  const c = payslipChain(e)
  const wrongTable = (c.taxable * c.b.rate) / 100
  out.push({
    topicId: 'finance',
    grade: 12,
    context: `${scenario(e)}\n\n${ctx}`,
    id: 'taxslip-pillay-find-the-errors',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 6,
    prompt: `${e.name}'s taxable income is ${rands(c.taxable)}. A learner worked out his tax like this: "${c.b.rate}% × ${rands(c.taxable)} = ${rands(wrongTable)}. Then ${rands(wrongTable)} − ${rand(c.rebate)} − ${rand(c.credits / 12)} = ${rands(wrongTable - c.rebate - c.credits / 12)}." Identify the TWO mistakes, and calculate the correct tax for the year.`,
    answer: `Mistake 1: the ${c.b.rate}% applies only to the part of the income above ${rand(c.b.from - 1)}, with ${rand(c.b.base)} added for the income below it. Mistake 2: the medical tax credit in the table is per month, so it must be multiplied by 12 (${rand(c.credits / 12)} × 12 = ${rand(c.credits)}) before it is subtracted from an annual tax. Correct: ${rand(c.b.base)} + ${c.b.rate}% × (${rands(c.taxable)} − ${rand(c.b.from - 1)}) = ${rands(c.beforeRebates)}; − ${rand(c.rebate)} = ${rands(c.afterRebates)}; − ${rand(c.credits)} = ${rands(c.annual)}.`,
    explanation: `Both mistakes come from not reading the table's own words: "of taxable income ABOVE" a figure, and a credit stated "per month" next to an annual table. Here the first mistake happens to overcharge and the second undercharges, so the wrong answer can even look reasonable, which is why checking each step against the table matters more than whether the total looks about right.`,
  })
}

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
