/**
 * The SARS personal income tax table, as data.
 *
 * WHY IT IS DATA AND NOT PROSE. An NSC Mathematical Literacy paper always
 * PRINTS the tax table inside the question -- the learner is never expected to
 * know the brackets, only to read them. So every taxation question here carries
 * the table in its `context`, and building that context from one table means a
 * question cannot quietly disagree with the table above it, and a new tax year
 * is one edit rather than a search through the corpus.
 *
 * THESE FIGURES HAVE A DATE ON THEM. Brackets, rebates and thresholds are set
 * each year in the Budget. `taxYear` says which year a table is for, and it is
 * printed with the table so nobody has to guess. Check the figures against the
 * current SARS table before a new school year: the structure of the questions
 * does not change, only the numbers in here.
 */

export interface TaxBracket {
  /** Lower limit of the bracket, in rands. */
  from: number
  /** Upper limit, or null for the top bracket. */
  to: number | null
  /** The rand amount stated at the start of the row. Zero in the first bracket. */
  base: number
  /** Percentage charged on income above `from`. */
  rate: number
}

export interface TaxTable {
  taxYear: string
  brackets: TaxBracket[]
  rebates: { primary: number; secondary: number; tertiary: number }
  thresholds: { under65: number; from65: number; from75: number }
}

/**
 * 2025/2026 year of assessment (1 March 2025 to 28 February 2026).
 *
 * The brackets and rebates were left unchanged from 2024/2025 in that Budget,
 * so a paper written for either year reads the same table.
 */
export const SARS_2025_26: TaxTable = {
  taxYear: '2025/2026',
  brackets: [
    { from: 1, to: 237_100, base: 0, rate: 18 },
    { from: 237_101, to: 370_500, base: 42_678, rate: 26 },
    { from: 370_501, to: 512_800, base: 77_362, rate: 31 },
    { from: 512_801, to: 673_000, base: 121_475, rate: 36 },
    { from: 673_001, to: 857_900, base: 179_147, rate: 39 },
    { from: 857_901, to: 1_817_000, base: 251_258, rate: 41 },
    { from: 1_817_001, to: null, base: 644_489, rate: 45 },
  ],
  rebates: { primary: 17_235, secondary: 9_444, tertiary: 3_145 },
  thresholds: { under65: 95_750, from65: 148_217, from75: 165_689 },
}

/*
 * Earlier years, for the past papers set in them. A November 2022 paper taxed
 * a 2022/2023 income, and the brackets then were lower, so printing today's
 * table above it would make the paper's own figures wrong. Each table is
 * checked by check:matlit-method the same way as the current one: every row's
 * base follows from the row before, and every threshold reconciles with the
 * rebates.
 */

/** 2022/2023 year of assessment (1 March 2022 to 28 February 2023). */
export const SARS_2022_23: TaxTable = {
  taxYear: '2022/2023',
  brackets: [
    { from: 1, to: 226_000, base: 0, rate: 18 },
    { from: 226_001, to: 353_100, base: 40_680, rate: 26 },
    { from: 353_101, to: 488_700, base: 73_726, rate: 31 },
    { from: 488_701, to: 641_400, base: 115_762, rate: 36 },
    { from: 641_401, to: 817_600, base: 170_734, rate: 39 },
    { from: 817_601, to: 1_731_600, base: 239_452, rate: 41 },
    { from: 1_731_601, to: null, base: 614_192, rate: 45 },
  ],
  rebates: { primary: 16_425, secondary: 9_000, tertiary: 2_997 },
  thresholds: { under65: 91_250, from65: 141_250, from75: 157_900 },
}

/** 2021/2022 year of assessment (1 March 2021 to 28 February 2022). */
export const SARS_2021_22: TaxTable = {
  taxYear: '2021/2022',
  brackets: [
    { from: 1, to: 216_200, base: 0, rate: 18 },
    { from: 216_201, to: 337_800, base: 38_916, rate: 26 },
    { from: 337_801, to: 467_500, base: 70_532, rate: 31 },
    { from: 467_501, to: 613_600, base: 110_739, rate: 36 },
    { from: 613_601, to: 782_200, base: 163_335, rate: 39 },
    { from: 782_201, to: 1_656_600, base: 229_089, rate: 41 },
    { from: 1_656_601, to: null, base: 587_593, rate: 45 },
  ],
  rebates: { primary: 15_714, secondary: 8_613, tertiary: 2_871 },
  thresholds: { under65: 87_300, from65: 135_150, from75: 151_100 },
}

/** 2020/2021 year of assessment (1 March 2020 to 28 February 2021). */
export const SARS_2020_21: TaxTable = {
  taxYear: '2020/2021',
  brackets: [
    { from: 1, to: 205_900, base: 0, rate: 18 },
    { from: 205_901, to: 321_600, base: 37_062, rate: 26 },
    { from: 321_601, to: 445_100, base: 67_144, rate: 31 },
    { from: 445_101, to: 584_200, base: 105_429, rate: 36 },
    { from: 584_201, to: 744_800, base: 155_505, rate: 39 },
    { from: 744_801, to: 1_577_300, base: 218_139, rate: 41 },
    { from: 1_577_301, to: null, base: 559_464, rate: 45 },
  ],
  rebates: { primary: 14_958, secondary: 8_199, tertiary: 2_736 },
  thresholds: { under65: 83_100, from65: 128_650, from75: 143_850 },
}

/** Every table held here, newest first -- what check:matlit-method verifies. */
export const SARS_TABLES: TaxTable[] = [SARS_2025_26, SARS_2022_23, SARS_2021_22, SARS_2020_21]

/** Rands the way a South African paper prints them: R1 234 567. */
export const rand = (n: number): string =>
  'R' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/** Rands with cents, for an answer. */
export const rands = (n: number): string => {
  const v = Math.round(n * 100) / 100
  const [whole, dec = '00'] = v.toFixed(2).split('.')
  return 'R' + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + dec
}

/**
 * The table as a learner sees it above a question.
 *
 * Laid out in the two columns SARS and every NSC paper print -- "taxable
 * income" against "rates of tax" -- using the pipe syntax that `QuestionText`
 * turns into a ruled table. It used to emit `band: charge` on plain lines,
 * which rendered as one unbroken paragraph of seven brackets run together:
 * the learner could not see where one row ended and the next began, which is
 * the only thing the table is for.
 *
 * The rebates and thresholds stay as sentences under the table, which is also
 * where a real paper puts them -- they are notes on the table, not rows of it.
 */
export function tableContext(t: TaxTable = SARS_2025_26): string {
  const rows = t.brackets.map((b) => {
    const band = b.to === null ? `${rand(b.from)} and above` : `${rand(b.from)} – ${rand(b.to)}`
    const charge =
      b.base === 0
        ? `${b.rate}% of taxable income`
        : `${rand(b.base)} + ${b.rate}% of taxable income above ${rand(b.from - 1)}`
    return `| ${band} | ${charge} |`
  })
  return (
    `|+ SARS TAX TABLE — ${t.taxYear} year of assessment (annual figures)\n` +
    `| Taxable income | Rates of tax |\n|---|---|\n` +
    rows.join('\n') +
    `\nTax rebates: primary ${rand(t.rebates.primary)}; secondary (65 and older) ${rand(t.rebates.secondary)}; ` +
    `tertiary (75 and older) ${rand(t.rebates.tertiary)}.\n` +
    `Tax thresholds: under 65 ${rand(t.thresholds.under65)}; 65 to 74 ${rand(t.thresholds.from65)}; ` +
    `75 and older ${rand(t.thresholds.from75)}.`
  )
}

/** The bracket a taxable income falls in. */
export function bracketFor(taxable: number, t: TaxTable = SARS_2025_26): TaxBracket {
  return t.brackets.find((b) => taxable >= b.from && (b.to === null || taxable <= b.to)) ?? t.brackets[0]
}

/** Tax before rebates, straight off the table. */
export function taxBeforeRebates(taxable: number, t: TaxTable = SARS_2025_26): number {
  const b = bracketFor(taxable, t)
  return b.base + ((taxable - (b.from - 1)) * b.rate) / 100
}

/** Rebates a taxpayer of this age qualifies for. They stack. */
export function rebateFor(age: number, t: TaxTable = SARS_2025_26): number {
  let total = t.rebates.primary
  if (age >= 65) total += t.rebates.secondary
  if (age >= 75) total += t.rebates.tertiary
  return total
}

/** Annual tax payable: table, then rebates, never below zero. */
export function annualTax(taxable: number, age: number, t: TaxTable = SARS_2025_26): number {
  return Math.max(0, taxBeforeRebates(taxable, t) - rebateFor(age, t))
}
