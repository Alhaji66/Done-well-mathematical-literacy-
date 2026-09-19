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
 * Laid out as rows of "taxable income | rates of tax", which is how SARS and
 * every NSC paper print it.
 */
export function tableContext(t: TaxTable = SARS_2025_26): string {
  const rows = t.brackets.map((b) => {
    const band = b.to === null ? `${rand(b.from)} and above` : `${rand(b.from)} – ${rand(b.to)}`
    const charge =
      b.base === 0
        ? `${b.rate}% of taxable income`
        : `${rand(b.base)} + ${b.rate}% of taxable income above ${rand(b.from - 1)}`
    return `${band}: ${charge}`
  })
  return (
    `SARS TAX TABLE — ${t.taxYear} year of assessment (annual figures)\n` +
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
