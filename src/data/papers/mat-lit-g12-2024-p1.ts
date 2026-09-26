import type { Paper } from './types'
import { SARS_2025_26, tableContext } from '@/data/taxTables'

/**
 * Mathematical Literacy Grade 12, 2024 Paper 1 -- in the NSC format.
 *
 * Rebuilt the same way as the 2025 papers (see mat-lit-g12-2025-p1.ts for why):
 * 150 marks, 3 hours, five questions. Its shape follows the real November 2024
 * Paper 1 and its marking guidelines -- questions of 29, 30, 29, 31 and 31
 * marks; Question 1 all short Level 1 items (reading a table, a till slip,
 * matching terms); then electricity, rent-to-own and income tax; data sets
 * with quartiles and an outlier; a cost-of-hire comparison; and a budget,
 * exchange rates and inflation to finish.
 *
 * Everything here is ORIGINAL. Only the structure, mark layout and kinds of
 * question mirror the real paper, which is the Department of Basic
 * Education's copyright. Figures that look like statistics are invented for
 * practice and are labelled as such.
 *
 * Every item carries its own table in `context`, because items are also shown
 * one at a time outside the paper (see tools/check-orphans.mts).
 */

// The brackets and rebates were the same in 2024/2025 as in 2025/2026 (see
// taxTables.ts), so this is the same table under the year a 2024 paper used.
const SARS_2024_25 = { ...SARS_2025_26, taxYear: '2024/2025' }

// ---------------------------------------------------------------- contexts

const TAXIS =
  'TABLE 1 shows the number of minibus taxis that left a taxi rank in each half-hour on one Saturday morning.\n' +
  '|+ TABLE 1: TAXIS LEAVING THE RANK ON A SATURDAY MORNING\n| Time | Number of taxis |\n|---|---|\n' +
  '| 06:00–06:30 | 8 |\n| 06:30–07:00 | 12 |\n| 07:00–07:30 | 15 |\n| 07:30–08:00 | 21 |\n' +
  '| 08:00–08:30 | 17 |\n| 08:30–09:00 | 9 |\n| 09:00–09:30 | 6 |\n| 09:30–10:00 | 7 |'

const SLIP =
  "Mrs Dube's till slip from a supermarket is shown below. Items marked * were on promotion.\n" +
  '|+ TILL SLIP\n| Item | Price |\n|---|---|\n' +
  '| Brown bread 700 g | R17,99 |\n| Full-cream milk 2 ℓ * | R32,49 |\n| Maize meal 5 kg | R64,99 |\n' +
  '| Eggs, tray of 30 | R79,50 |\n| Sugar 2,5 kg * | R48,75 |\n| Tomatoes 1 kg | R24,99 |\n' +
  '| Chicken portions 2 kg | R119,90 |\n| TOTAL | A |'

const TERMS =
  'TABLE 2 gives definitions of some terms used in Mathematical Literacy.\n' +
  '|+ TABLE 2: DEFINITIONS OF TERMS\n| Letter | Definition |\n|---|---|\n' +
  '| A | A tax added to the price of most goods and services |\n' +
  '| B | Income before any deductions are made |\n' +
  '| C | Income that is left after all deductions have been made |\n' +
  '| D | An agreement to pay for an item in instalments while using it, after which you own it |\n' +
  '| E | A group chosen from a population to collect data from |\n' +
  '| F | A value that is much bigger or much smaller than the rest of the data |\n' +
  '| G | The amount by which expenditure is more than income |\n' +
  '| H | The amount by which income is more than expenditure |\n' +
  'Match each term with its definition. Write only the letter (A–H).'

const ELECTRICITY =
  'Mr Khumalo bought prepaid electricity. Part of his slip is shown below; some values have been left out.\n' +
  '|+ PREPAID ELECTRICITY SLIP\n| Detail | Information |\n|---|---|\n' +
  '| Meter number | 14290 553 871 |\n| Amount tendered | R800,00 |\n| VAT (15%) | B |\n' +
  '| Amount for electricity (excluding VAT) | R695,65 |\n| Units bought (kWh) | C |\n' +
  'The municipality charges (excluding VAT): Block 1, the first 300 kWh bought in a month: R2,05 per kWh; ' +
  'Block 2, every kWh after the first 300 kWh in the month: R2,78 per kWh. This was his first purchase of the month.'

const FRIDGE =
  'Ayanda wants a fridge. The shop offers two ways to pay.\n' +
  '|+ PAYMENT OPTIONS FOR THE FRIDGE\n| Option | Details |\n|---|---|\n' +
  '| Cash | R13 800 (VAT included) |\n' +
  '| Rent-to-own | Deposit of 10% of the cash price, then 36 monthly payments of R549, plus a once-off delivery fee of R350 |'

const PAYE =
  'Lindiwe is 41 years old. Her monthly taxable income is R34 850,40, and she earns no other income during the 2024/2025 tax year.\n\n' +
  tableContext(SARS_2024_25)

const BAKERY =
  'TABLE 3 shows the number of branches of two bakery chains, A and B, from 2019 to 2023, and the number of people each chain employed in 2023. (The figures are invented for practice.)\n' +
  '|+ TABLE 3: BRANCHES OF TWO BAKERY CHAINS\n| Year | Chain A | Chain B |\n|---|---|---|\n' +
  '| 2019 | 1 845 | 1 210 |\n| 2020 | 1 902 | 1 256 |\n| 2021 | 1 876 | 1 318 |\n| 2022 | 1 950 | 1 402 |\n| 2023 | 2 014 | 1 455 |\n' +
  'Employees in 2023: Chain A 86 590; Chain B 64 020.'

const TRAVEL =
  'Some of the 1 120 learners at a school were asked how many minutes it takes them to get to school. Their answers, arranged in ascending order, are:\n' +
  '5   8   10   12   12   15   15   18   20   20   22   25   25   28   30   95'

const CASTLE =
  'Two companies hire out jumping castles for children’s parties.\n' +
  'Company A: R450 for up to 4 hours, plus R120 for every hour after the first 4 hours.\n' +
  'Company B: R180 per hour.\n' +
  '|+ TABLE 4: COST OF HIRING A JUMPING CASTLE\n| Hours | Company A | Company B |\n|---|---|---|\n' +
  '| 2 | P | R360 |\n| 4 | R450 | R720 |\n| 6 | Q | R |\n| 8 | R930 | R1 440 |'

const ABSENT =
  'TABLE 5 shows the number of learners absent from a school on nine school days in Term 1 and nine school days in Term 3.\n' +
  '|+ TABLE 5: LEARNERS ABSENT\n| Day | Term 1 | Term 3 |\n|---|---|---|\n' +
  '| 1 | 14 | 27 |\n| 2 | 22 | 11 |\n| 3 | 18 | 35 |\n| 4 | 9 | 19 |\n| 5 | 25 | 8 |\n' +
  '| 6 | 18 | 24 |\n| 7 | 31 | 41 |\n| 8 | 12 | 15 |\n| 9 | 16 | 30 |'

const BUDGET =
  'A municipality’s budget for one year is summarised below. (The figures are invented for practice.)\n' +
  'Total income: R2 450 million. Total expenditure: R2 510 million.\n' +
  '|+ TABLE 6: WHERE THE INCOME COMES FROM\n| Source | % of income |\n|---|---|\n' +
  '| Property rates | 28% |\n| Electricity sales | 34% |\n| Water sales | 12% |\n| Grants from national government | A |\n| Other income | 9% |\n\n' +
  '|+ TABLE 7: WHAT THE MONEY IS SPENT ON\n| Item | Amount (R million) |\n|---|---|\n' +
  '| Salaries | 890 |\n| Bulk electricity purchases | 720 |\n| Water and sanitation | 310 |\n' +
  '| Roads and transport | 245 |\n| Repairs and maintenance | 180 |\n| Interest on loans | 165 |'

const KENYA =
  'A news report says a Kenyan company’s sales for the year were KES 352,5 billion (KES is the Kenyan shilling; the figure is invented for practice). On that day, R1 = KES 7,12.'

const INFLATION =
  'TABLE 8 shows the annual inflation rate in a country from 2020 to 2024. (The figures are invented for practice.)\n' +
  '|+ TABLE 8: ANNUAL INFLATION RATE\n| Year | Inflation rate |\n|---|---|\n' +
  '| 2020 | 3,1% |\n| 2021 | 4,6% |\n| 2022 | 7,1% |\n| 2023 | 5,8% |\n| 2024 | 4,2% |'

// ---------------------------------------------------------------- paper

export const matLitG12P1Y2024: Paper = {
  id: 'ml-p1-2024',
  subjectId: 'mat-lit',
  paperNumber: 1,
  grade: 12,
  kind: 'past',
  year: 2024,
  title: '2024 Paper 1',
  durationMinutes: 180,
  totalMarks: 150,
  sections: [
    {
      number: 1,
      title: 'A taxi rank, a till slip and terms',
      topicId: 'finance',
      marks: 29,
      items: [
        {
          id: 'ml-p1-24n-1-1-1',
          label: '1.1.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TAXIS,
          prompt: 'Write down the number of half-hour periods in which FEWER than 10 taxis left the rank.',
          answer: '4',
          explanation: 'Fewer than 10 taxis left at 06:00–06:30 (8), 08:30–09:00 (9), 09:00–09:30 (6) and 09:30–10:00 (7): four periods.',
          memo: [{ code: 'A', marks: 2, text: '4' }],
        },
        {
          id: 'ml-p1-24n-1-1-2',
          label: '1.1.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TAXIS,
          prompt: 'Write down the half-hour period in which the MOST taxis left the rank.',
          answer: '07:30–08:00',
          explanation: 'The largest number in the table is 21, in the period 07:30–08:00.',
          memo: [
            { code: 'A', marks: 1, text: '07:30' },
            { code: 'A', marks: 1, text: '08:00' },
          ],
        },
        {
          id: 'ml-p1-24n-1-1-3',
          label: '1.1.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TAXIS,
          prompt: 'Which ONE of the following is the range of the number of taxis that left in a half-hour period?',
          options: [
            { id: 'a', label: '6' },
            { id: 'b', label: '15' },
            { id: 'c', label: '21' },
            { id: 'd', label: '27' },
          ],
          correctOptionId: 'b',
          answer: '15',
          explanation: 'Range = highest − lowest = 21 − 6 = 15.',
          memo: [{ code: 'A', marks: 2, text: 'Option 15' }],
        },
        {
          id: 'ml-p1-24n-1-1-4',
          label: '1.1.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TAXIS,
          prompt: 'In a survey of 80 passengers at the rank, 36 said they travel by taxi every day. Write, as a common fraction in its simplest form, the probability that a passenger chosen at random travels by taxi every day.',
          answer: '9/20',
          explanation: '36 out of 80 = 36/80, and dividing the top and bottom by 4 gives 9/20.',
          memo: [
            { code: 'A', marks: 1, text: '36/80' },
            { code: 'A', marks: 1, text: '9/20 (simplified)' },
          ],
        },
        {
          id: 'ml-p1-24n-1-1-5',
          label: '1.1.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: TAXIS,
          prompt: 'Calculate the total number of taxis that left the rank between 07:00 and 08:00.',
          answer: '36 taxis',
          explanation: 'Two half-hour periods: 07:00–07:30 (15) and 07:30–08:00 (21). 15 + 21 = 36.',
          memo: [
            { code: 'RT', marks: 1, text: '15 and 21' },
            { code: 'M', marks: 1, text: 'Adding the two values' },
            { code: 'A', marks: 1, text: '36' },
          ],
        },
        {
          id: 'ml-p1-24n-1-2-1',
          label: '1.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: SLIP,
          prompt: 'Name the TWO items that were on promotion.',
          answer: 'Full-cream milk and sugar',
          explanation: 'The items marked * on the slip are the 2 ℓ full-cream milk and the 2,5 kg sugar.',
          memo: [
            { code: 'RT', marks: 2, text: 'First correct item' },
            { code: 'RT', marks: 1, text: 'Second correct item' },
          ],
        },
        {
          id: 'ml-p1-24n-1-2-2',
          label: '1.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: SLIP,
          prompt: 'Calculate the value of A, the total on the till slip.',
          answer: 'R388,61',
          explanation: 'R17,99 + R32,49 + R64,99 + R79,50 + R48,75 + R24,99 + R119,90 = R388,61.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding ALL seven prices' },
            { code: 'A', marks: 1, text: 'R388,61' },
          ],
        },
        {
          id: 'ml-p1-24n-1-2-3',
          label: '1.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: SLIP,
          prompt: 'Calculate the price per dozen of the eggs Mrs Dube bought.',
          answer: 'R31,80',
          explanation: 'A tray of 30 eggs costs R79,50, so one egg costs R79,50 ÷ 30 = R2,65, and a dozen (12) costs 12 × R2,65 = R31,80.',
          memo: [
            { code: 'M', marks: 1, text: 'R79,50 ÷ 30 × 12' },
            { code: 'A', marks: 1, text: 'R31,80' },
          ],
        },
        {
          id: 'ml-p1-24n-1-2-4',
          label: '1.2.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: SLIP,
          prompt: 'The same brown bread costs R16,49 at a spaza shop. Write the ratio of the supermarket price to the spaza shop price of the bread in the form 1 : ...',
          answer: '1 : 0,92',
          explanation: 'Supermarket : spaza = R17,99 : R16,49. Divide both by 17,99: 1 : 0,9166… ≈ 1 : 0,92.',
          memo: [
            { code: 'RT', marks: 1, text: 'R17,99' },
            { code: 'RT', marks: 1, text: 'R16,49' },
            { code: 'A', marks: 1, text: '1 : 0,92 in the correct order' },
          ],
        },
        ...(
          [
            ['1.3.1', 'NET INCOME', 'C', ['B', 'C', 'G', 'H'], 'Net income is what is left after deductions; B is gross income, before deductions.'],
            ['1.3.2', 'VALUE-ADDED TAX (VAT)', 'A', ['A', 'D', 'H', 'B'], 'VAT is the tax added to the price of most goods and services.'],
            ['1.3.3', 'OUTLIER', 'F', ['E', 'G', 'F', 'C'], 'An outlier is a value far above or below the rest of the data.'],
            ['1.3.4', 'SAMPLE', 'E', ['F', 'B', 'D', 'E'], 'A sample is the group chosen from a population to collect data from.'],
          ] as const
        ).map(([label, term, right, letters, why], k) => ({
          id: 'ml-p1-24n-1-3-' + (k + 1),
          label,
          topicId: k === 2 || k === 3 ? 'data-handling' : 'finance',
          grade: 12 as const,
          difficulty: 'Easy' as const,
          cognitiveLevel: 1 as const,
          marks: 2,
          context: TERMS,
          prompt: 'Which letter matches the term ' + term + '?',
          options: letters.map((l, i) => ({ id: 'abcd'[i], label: l })),
          correctOptionId: 'abcd'[(letters as readonly string[]).indexOf(right)],
          answer: right,
          explanation: why,
        })),
      ],
    },
    {
      number: 2,
      title: 'Electricity, a fridge and income tax',
      topicId: 'finance',
      marks: 30,
      items: [
        {
          id: 'ml-p1-24n-2-1-1',
          label: '2.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: ELECTRICITY,
          prompt: 'Write down the meter number on the slip.',
          answer: '14290 553 871',
          explanation: 'Read it straight off the slip.',
          memo: [{ code: 'RT', marks: 2, text: '14290 553 871' }],
        },
        {
          id: 'ml-p1-24n-2-1-2',
          label: '2.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: ELECTRICITY,
          prompt: 'Calculate the value of B, the VAT on the purchase.',
          answer: 'R104,35',
          explanation: 'The amount tendered includes VAT, so VAT = R800,00 − R695,65 = R104,35. (Check: 15% of R695,65 = R104,35.)',
          memo: [
            { code: 'RT', marks: 1, text: 'R800,00 and R695,65' },
            { code: 'M', marks: 1, text: 'Subtracting' },
            { code: 'A', marks: 1, text: 'R104,35' },
          ],
        },
        {
          id: 'ml-p1-24n-2-1-3',
          label: '2.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 7,
          context: ELECTRICITY,
          prompt: 'Calculate C, the number of units (kWh) Mr Khumalo received, rounded to two decimal places.',
          answer: '≈ 329,01 kWh',
          explanation:
            'Block 1: 300 kWh × R2,05 = R615,00. Money left for Block 2: R695,65 − R615,00 = R80,65. ' +
            'Block 2 units: R80,65 ÷ R2,78 = 29,01 kWh. Total = 300 + 29,01 = 329,01 kWh. Work with the amount WITHOUT VAT, because the tariffs exclude VAT.',
          memo: [
            { code: 'M', marks: 1, text: '300 × R2,05' },
            { code: 'CA', marks: 1, text: 'R615,00' },
            { code: 'M', marks: 1, text: 'R695,65 − R615,00' },
            { code: 'M', marks: 1, text: 'Dividing R80,65 by R2,78' },
            { code: 'CA', marks: 1, text: '29,01 kWh' },
            { code: 'M', marks: 1, text: 'Adding 300 kWh' },
            { code: 'CA', marks: 1, text: '329,01 kWh' },
          ],
        },
        {
          id: 'ml-p1-24n-2-2-1',
          label: '2.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: FRIDGE,
          prompt: 'Write down the amount of each monthly payment on the rent-to-own option.',
          answer: 'R549',
          explanation: 'Read from the table: 36 monthly payments of R549.',
          memo: [{ code: 'RT', marks: 2, text: 'R549' }],
        },
        {
          id: 'ml-p1-24n-2-2-2',
          label: '2.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: FRIDGE,
          prompt: 'Calculate the cash price of the fridge EXCLUDING VAT.',
          answer: 'R12 000',
          explanation: 'The cash price includes 15% VAT, so it is 115% of the price without VAT: R13 800 ÷ 1,15 = R12 000.',
          memo: [
            { code: 'RT', marks: 1, text: 'R13 800' },
            { code: 'M', marks: 1, text: 'Dividing by 1,15' },
            { code: 'A', marks: 1, text: 'R12 000' },
          ],
        },
        {
          id: 'ml-p1-24n-2-2-3',
          label: '2.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: FRIDGE,
          prompt: 'Calculate how much MORE Ayanda will pay altogether if she uses the rent-to-own option instead of paying cash.',
          answer: 'R7 694 more',
          explanation:
            'Deposit = 10% × R13 800 = R1 380. Payments = 36 × R549 = R19 764. Rent-to-own total = R1 380 + R19 764 + R350 = R21 494. ' +
            'Difference = R21 494 − R13 800 = R7 694.',
          memo: [
            { code: 'A', marks: 1, text: 'Deposit R1 380' },
            { code: 'M', marks: 1, text: '36 × R549' },
            { code: 'M', marks: 1, text: 'Adding deposit, payments and delivery fee' },
            { code: 'CA', marks: 1, text: 'R21 494' },
            { code: 'CA', marks: 1, text: 'R7 694' },
          ],
        },
        {
          id: 'ml-p1-24n-2-3-1',
          label: '2.3.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: PAYE,
          prompt: 'Calculate Lindiwe’s annual taxable income, and write down the taxable income bracket it falls in.',
          answer: 'R418 204,80, in the bracket R370 501 – R512 800',
          explanation: 'R34 850,40 × 12 = R418 204,80, which lies between R370 501 and R512 800.',
          memo: [
            { code: 'M', marks: 1, text: 'Multiplying by 12' },
            { code: 'A', marks: 1, text: 'R418 204,80' },
            { code: 'CA', marks: 1, text: 'Bracket R370 501 – R512 800' },
          ],
        },
        {
          id: 'ml-p1-24n-2-3-2',
          label: '2.3.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: PAYE,
          prompt: 'Lindiwe’s annual taxable income is R418 204,80. Calculate her annual income tax payable.',
          answer: 'R74 915,49',
          explanation:
            'Tax before rebates = R77 362 + 31% × (R418 204,80 − R370 500) = R77 362 + 31% × R47 704,80 = R77 362 + R14 788,49 = R92 150,49. ' +
            'She is under 65, so only the primary rebate applies: R92 150,49 − R17 235 = R74 915,49.',
          memo: [
            { code: 'SF', marks: 1, text: 'R77 362 + 31% × (R418 204,80 − R370 500)' },
            { code: 'CA', marks: 1, text: 'R92 150,49' },
            { code: 'RT', marks: 1, text: 'Primary rebate R17 235' },
            { code: 'M', marks: 1, text: 'Subtracting the rebate' },
            { code: 'CA', marks: 1, text: 'R74 915,49' },
          ],
        },
      ],
    },
    {
      number: 3,
      title: 'Bakery branches and travel times',
      topicId: 'data-handling',
      marks: 29,
      items: [
        {
          id: 'ml-p1-24n-3-1-1',
          label: '3.1.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: BAKERY,
          prompt: 'Write down the year in which Chain A had FEWER branches than the year before.',
          answer: '2021',
          explanation: 'Chain A went from 1 902 branches in 2020 to 1 876 in 2021 — the only drop.',
          memo: [{ code: 'RT', marks: 2, text: '2021' }],
        },
        {
          id: 'ml-p1-24n-3-1-2',
          label: '3.1.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: BAKERY,
          prompt: 'Chain B plans to grow its 2023 number of branches by 38,5% by 2030. Calculate the projected number of Chain B branches in 2030.',
          answer: '2 015 branches',
          explanation: '1 455 × 1,385 = 2 015,2, so about 2 015 branches (a part of a branch makes no sense, so round to a whole number).',
          memo: [
            { code: 'RT', marks: 1, text: '1 455' },
            { code: 'M', marks: 1, text: 'Increasing by 38,5%' },
            { code: 'CA', marks: 1, text: '2 015' },
          ],
        },
        {
          id: 'ml-p1-24n-3-1-3',
          label: '3.1.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 6,
          context: BAKERY,
          prompt: 'A journalist says that in 2023 a Chain B branch employed, on average, MORE people than a Chain A branch. Verify, showing ALL calculations, whether the journalist is correct.',
          answer: 'Chain A ≈ 42,99 people per branch; Chain B ≈ 44,00. The journalist is CORRECT.',
          explanation:
            'Average per branch = employees ÷ branches. Chain A: 86 590 ÷ 2 014 = 42,99. Chain B: 64 020 ÷ 1 455 = 44,00. ' +
            'Chain A has more employees in total, but Chain B has more per branch, so the statement is valid.',
          memo: [
            { code: 'RT', marks: 1, text: '86 590 and 2 014' },
            { code: 'M', marks: 1, text: 'Dividing employees by branches' },
            { code: 'CA', marks: 1, text: 'Chain A: 42,99' },
            { code: 'RT', marks: 1, text: '64 020 and 1 455' },
            { code: 'CA', marks: 1, text: 'Chain B: 44,00' },
            { code: 'J', marks: 1, text: 'CORRECT' },
          ],
        },
        {
          id: 'ml-p1-24n-3-1-4',
          label: '3.1.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: BAKERY,
          prompt: 'In one town Chain A has 10 branches, and 3 of them are open 24 hours. One of these branches is chosen at random. Determine, as a percentage, the probability that it is open 24 hours.',
          answer: '30%',
          explanation: '3 favourable out of 10 possible: 3/10 × 100% = 30%.',
          memo: [
            { code: 'A', marks: 1, text: 'Numerator 3' },
            { code: 'A', marks: 1, text: 'Denominator 10' },
            { code: 'CA', marks: 1, text: '30%' },
          ],
        },
        {
          id: 'ml-p1-24n-3-2-1',
          label: '3.2.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: TRAVEL,
          prompt: 'Write down the size of the sample and the size of the population.',
          answer: 'Sample: 16 learners. Population: 1 120 learners.',
          explanation: 'Count the answers to get the sample (16). The population is the whole group the survey is about: all 1 120 learners.',
          memo: [
            { code: 'A', marks: 1, text: 'Counting 16 values' },
            { code: 'A', marks: 1, text: 'Sample 16' },
            { code: 'A', marks: 1, text: 'Population 1 120' },
          ],
        },
        {
          id: 'ml-p1-24n-3-2-2',
          label: '3.2.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TRAVEL,
          prompt: 'Which ONE of the following describes the travel times?',
          options: [
            { id: 'a', label: 'Categorical, nominal' },
            { id: 'b', label: 'Categorical, ordinal' },
            { id: 'c', label: 'Numerical, discrete' },
            { id: 'd', label: 'Numerical, continuous' },
          ],
          correctOptionId: 'd',
          answer: 'Numerical, continuous',
          explanation: 'Time is measured, not counted, and can take any value (12,5 minutes is possible), so it is continuous numerical data.',
          memo: [{ code: 'A', marks: 2, text: 'Numerical, continuous' }],
        },
        {
          id: 'ml-p1-24n-3-2-3',
          label: '3.2.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: TRAVEL,
          prompt: 'Explain why 95 minutes is regarded as an outlier.',
          answer: '95 is 65 minutes more than the next highest time (30 minutes); it is far away from all the other values.',
          explanation: 'An outlier sits far from the rest of the data. Every other time is between 5 and 30 minutes.',
          memo: [{ code: 'J', marks: 2, text: 'Far more than the next highest value (30)' }],
        },
        {
          id: 'ml-p1-24n-3-2-4a',
          label: '3.2.4(a)',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: TRAVEL,
          prompt: 'Determine the upper quartile (Q3) of the travel times.',
          answer: '25 minutes',
          explanation: 'There are 16 values. Q3 is the median of the top 8 values (20, 20, 22, 25, 25, 28, 30, 95): (25 + 25) ÷ 2 = 25.',
          memo: [
            { code: 'RT', marks: 1, text: 'The 12th and 13th values, 25 and 25' },
            { code: 'M', marks: 1, text: 'Concept of a quartile (middle of the upper half)' },
            { code: 'CA', marks: 1, text: '25' },
          ],
        },
        {
          id: 'ml-p1-24n-3-2-4b',
          label: '3.2.4(b)',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 5,
          context: TRAVEL + '\nThe lower quartile (Q1) of all 16 values is 12 minutes.',
          prompt: 'Thandi says that if the outlier (95) is left out, the interquartile range (IQR) stays the same. Verify, showing ALL calculations, whether she is correct.',
          answer: 'With all 16 values: IQR = 25 − 12 = 13. Without 95: Q1 = 12, Q3 = 25, IQR = 13. She is CORRECT.',
          explanation:
            'With all 16 values Q1 = 12 and Q3 = 25, so IQR = 13. Without 95 there are 15 values and the median is the 8th (18). ' +
            'The lower 7 values are 5, 8, 10, 12, 12, 15, 15, so Q1 = 12; the upper 7 are 20, 20, 22, 25, 25, 28, 30, so Q3 = 25. IQR = 25 − 12 = 13, the same.',
          memo: [
            { code: 'M', marks: 1, text: 'IQR of all 16 values: 25 − 12 = 13' },
            { code: 'A', marks: 1, text: 'New Q1 = 12' },
            { code: 'A', marks: 1, text: 'New Q3 = 25' },
            { code: 'CA', marks: 1, text: 'New IQR = 13' },
            { code: 'J', marks: 1, text: 'CORRECT' },
          ],
        },
      ],
    },
    {
      number: 4,
      title: 'Jumping castles and school absences',
      topicId: 'finance',
      marks: 31,
      items: [
        {
          id: 'ml-p1-24n-4-1-1a',
          label: '4.1.1(a)',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: CASTLE,
          prompt: 'Write down a formula to calculate Company A’s cost for a party of MORE than 4 hours.',
          answer: 'Cost = R450 + R120 × (number of hours − 4)',
          explanation: 'R450 covers the first 4 hours; every hour after that adds R120.',
          memo: [
            { code: 'A', marks: 1, text: 'R450' },
            { code: 'A', marks: 1, text: '+ R120 ×' },
            { code: 'A', marks: 1, text: '(number of hours − 4)' },
          ],
        },
        {
          id: 'ml-p1-24n-4-1-1b',
          label: '4.1.1(b)',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: CASTLE,
          prompt: 'Determine the values of P, Q and R in TABLE 4.',
          answer: 'P = R450, Q = R690, R = R1 080',
          explanation: 'P: 2 hours is within the first 4, so R450. Q: R450 + R120 × 2 = R690. R: 6 × R180 = R1 080.',
          memo: [
            { code: 'A', marks: 1, text: 'P = R450' },
            { code: 'M', marks: 1, text: 'R450 + R120 × 2' },
            { code: 'A', marks: 1, text: 'Q = R690' },
            { code: 'A', marks: 1, text: 'R = R1 080' },
          ],
        },
        {
          id: 'ml-p1-24n-4-1-2',
          label: '4.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: CASTLE,
          prompt: 'Determine the length of a party, in hours and minutes, for which both companies charge the same amount.',
          answer: '2 hours 30 minutes',
          explanation:
            'Up to 4 hours Company A charges a flat R450, while Company B charges R180 per hour. They are equal when R180 × hours = R450, so hours = 450 ÷ 180 = 2,5 hours = 2 hours 30 minutes. ' +
            'After that Company B is always dearer, because it is already dearer at 4 hours (R720 against R450) and goes up faster.',
          memo: [
            { code: 'M', marks: 1, text: 'R180 × hours = R450' },
            { code: 'S', marks: 1, text: 'hours = 450 ÷ 180' },
            { code: 'CA', marks: 1, text: '2,5 hours' },
            { code: 'C', marks: 1, text: '2 hours 30 minutes' },
          ],
        },
        {
          id: 'ml-p1-24n-4-1-3',
          label: '4.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: CASTLE,
          prompt: 'A family has R1 000 to spend on hiring a jumping castle. Calculate how many MORE whole hours they can hire from Company A than from Company B.',
          answer: '3 more hours (8 hours from A, 5 hours from B)',
          explanation:
            'Company A: R1 000 − R450 = R550 left for extra hours; R550 ÷ R120 = 4,58, so 4 whole extra hours: 4 + 4 = 8 hours (R930). ' +
            'Company B: R1 000 ÷ R180 = 5,56, so 5 whole hours. 8 − 5 = 3 more hours.',
          memo: [
            { code: 'M', marks: 1, text: '(R1 000 − R450) ÷ R120' },
            { code: 'CA', marks: 1, text: '8 hours from Company A' },
            { code: 'M', marks: 1, text: 'R1 000 ÷ R180' },
            { code: 'CA', marks: 1, text: '5 hours from Company B' },
            { code: 'CA', marks: 1, text: '3 more hours' },
          ],
        },
        {
          id: 'ml-p1-24n-4-1-4',
          label: '4.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: CASTLE,
          prompt: 'Company A is cheaper for a long party. Give ONE reason why a family might still choose Company B.',
          answer: 'For a party shorter than 2½ hours, Company B is cheaper (e.g. 2 hours costs R360 against R450).',
          explanation: 'Company A charges R450 even for a short party. Other valid reasons: Company B is closer, more reliable or has better reviews.',
          memo: [{ code: 'J', marks: 2, text: 'Any valid reason, e.g. B is cheaper for a party under 2½ hours' }],
        },
        {
          id: 'ml-p1-24n-4-2-1',
          label: '4.2.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: ABSENT,
          prompt: 'One of the Term 1 days is chosen at random. Determine, as a percentage, the probability that MORE than 20 learners were absent on that day.',
          answer: '≈ 33,3%',
          explanation: 'More than 20 were absent on 3 of the 9 days (22, 25 and 31). 3/9 × 100% = 33,3%.',
          memo: [
            { code: 'A', marks: 1, text: '3 days' },
            { code: 'M', marks: 1, text: '3/9 × 100%' },
            { code: 'CA', marks: 1, text: '33,3%' },
          ],
        },
        {
          id: 'ml-p1-24n-4-2-2',
          label: '4.2.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: ABSENT,
          prompt: 'Arrange the Term 3 numbers in ascending order and determine the median.',
          answer: '8; 11; 15; 19; 24; 27; 30; 35; 41 — median 24',
          explanation: 'With 9 values, the median is the 5th value in order: 24.',
          memo: [
            { code: 'A', marks: 1, text: 'Arranging in ascending order' },
            { code: 'M', marks: 1, text: 'Choosing the middle (5th) value' },
            { code: 'CA', marks: 1, text: '24' },
          ],
        },
        {
          id: 'ml-p1-24n-4-2-3',
          label: '4.2.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 5,
          context: ABSENT,
          prompt: 'The principal says the number of absent learners was more spread out in Term 3 than in Term 1. Use the range to verify whether the principal is correct.',
          answer: 'Range Term 1 = 31 − 9 = 22; Range Term 3 = 41 − 8 = 33. The principal is CORRECT.',
          explanation: 'The range measures spread. 33 is larger than 22, so the Term 3 numbers are more spread out.',
          memo: [
            { code: 'M', marks: 1, text: 'Term 1: 31 − 9' },
            { code: 'A', marks: 1, text: '22' },
            { code: 'M', marks: 1, text: 'Term 3: 41 − 8' },
            { code: 'A', marks: 1, text: '33' },
            { code: 'J', marks: 1, text: 'CORRECT' },
          ],
        },
        {
          id: 'ml-p1-24n-4-2-4',
          label: '4.2.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: ABSENT,
          prompt: 'Write down the modal number of learners absent in Term 1.',
          answer: '18',
          explanation: '18 appears twice in the Term 1 column; every other number appears once.',
          memo: [{ code: 'A', marks: 2, text: '18' }],
        },
      ],
    },
    {
      number: 5,
      title: 'A municipal budget, exchange rates and inflation',
      topicId: 'finance',
      marks: 31,
      items: [
        {
          id: 'ml-p1-24n-5-1-1',
          label: '5.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: BUDGET,
          prompt: 'Write down whether the municipality’s budget shows a SURPLUS or a DEFICIT.',
          answer: 'A deficit',
          explanation: 'Expenditure (R2 510 million) is more than income (R2 450 million).',
          memo: [{ code: 'A', marks: 2, text: 'Deficit' }],
        },
        {
          id: 'ml-p1-24n-5-1-2',
          label: '5.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: BUDGET,
          prompt: 'Calculate the value of A, the percentage of income from grants from national government.',
          answer: '17%',
          explanation: 'The percentages add up to 100%: 100% − (28% + 34% + 12% + 9%) = 17%.',
          memo: [
            { code: 'RT', marks: 1, text: 'ALL four given percentages' },
            { code: 'M', marks: 1, text: 'Subtracting their sum from 100%' },
            { code: 'A', marks: 1, text: '17%' },
          ],
        },
        {
          id: 'ml-p1-24n-5-1-3',
          label: '5.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: BUDGET,
          prompt: 'Calculate the income from electricity sales, in rand million.',
          answer: 'R833 million',
          explanation: '34% of R2 450 million = 0,34 × 2 450 = R833 million.',
          memo: [
            { code: 'RT', marks: 1, text: '34%' },
            { code: 'M', marks: 1, text: '34% × R2 450 million' },
            { code: 'A', marks: 1, text: 'R833 million' },
          ],
        },
        {
          id: 'ml-p1-24n-5-1-4',
          label: '5.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: BUDGET,
          prompt: 'Calculate salaries as a percentage of the total expenditure.',
          answer: '≈ 35,5%',
          explanation: 'R890 million ÷ R2 510 million × 100% = 35,46% ≈ 35,5%.',
          memo: [
            { code: 'RT', marks: 1, text: 'R890 million' },
            { code: 'M', marks: 1, text: '÷ R2 510 million × 100%' },
            { code: 'CA', marks: 1, text: '35,5%' },
          ],
        },
        {
          id: 'ml-p1-24n-5-1-5',
          label: '5.1.5',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 6,
          context: BUDGET,
          prompt: 'A councillor says that cutting repairs and maintenance by 20% and roads and transport by 8% would be enough to get rid of the deficit. Verify, showing ALL calculations, whether the councillor is correct.',
          answer: 'Deficit = R60 million; the cuts save R36 million + R19,6 million = R55,6 million. The councillor is NOT correct.',
          explanation:
            'Deficit = R2 510 million − R2 450 million = R60 million. Cuts: 20% × R180 million = R36 million; 8% × R245 million = R19,6 million. ' +
            'Total saved = R55,6 million, which is R4,4 million short of the R60 million deficit.',
          memo: [
            { code: 'A', marks: 1, text: 'Deficit R60 million' },
            { code: 'M', marks: 1, text: '20% × R180 million' },
            { code: 'M', marks: 1, text: '8% × R245 million' },
            { code: 'CA', marks: 1, text: 'R36 million and R19,6 million' },
            { code: 'CA', marks: 1, text: 'Total R55,6 million' },
            { code: 'J', marks: 1, text: 'NOT correct' },
          ],
        },
        {
          id: 'ml-p1-24n-5-2-1',
          label: '5.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: KENYA,
          prompt: 'Write KES 352,5 billion in full, as a number.',
          answer: 'KES 352 500 000 000',
          explanation: 'One billion is 1 000 000 000, so 352,5 billion = 352,5 × 1 000 000 000 = 352 500 000 000.',
          memo: [
            { code: 'M', marks: 1, text: 'Multiplying by 1 000 000 000' },
            { code: 'A', marks: 1, text: '352 500 000 000' },
          ],
        },
        {
          id: 'ml-p1-24n-5-2-2',
          label: '5.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: KENYA,
          prompt: 'Convert KES 352,5 billion to rand. Give your answer in rand million, rounded to one decimal place.',
          answer: '≈ R49 508,4 million',
          explanation:
            'R1 buys KES 7,12, so rand = shillings ÷ 7,12: 352 500 000 000 ÷ 7,12 = R49 508 426 966. ' +
            'In millions: 49 508 426 966 ÷ 1 000 000 = 49 508,4 million.',
          memo: [
            { code: 'M', marks: 1, text: 'Dividing by 7,12' },
            { code: 'CA', marks: 1, text: 'R49 508 426 966' },
            { code: 'C', marks: 1, text: 'Converting to millions' },
            { code: 'R', marks: 1, text: 'R49 508,4 million' },
          ],
        },
        {
          id: 'ml-p1-24n-5-3-1',
          label: '5.3.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: INFLATION,
          prompt: 'Describe the trend in the annual inflation rate from 2020 to 2024.',
          answer: 'It rose every year from 2020 to a peak in 2022, then fell in 2023 and 2024.',
          explanation: '3,1% → 4,6% → 7,1% is a rise; 7,1% → 5,8% → 4,2% is a fall.',
          memo: [
            { code: 'J', marks: 1, text: 'Increased to 2022' },
            { code: 'J', marks: 1, text: 'Decreased after 2022' },
          ],
        },
        {
          id: 'ml-p1-24n-5-3-2',
          label: '5.3.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 6,
          context: INFLATION,
          prompt: 'A bag of maize meal cost R65,00 at the start of 2022. Its price rose each year by that year’s inflation rate. Calculate its price at the end of 2024.',
          answer: '≈ R76,75',
          explanation:
            'End of 2022: R65,00 × 1,071 = R69,62. End of 2023: R69,62 × 1,058 = R73,65. End of 2024: R73,65 × 1,042 = R76,75. ' +
            'Each year’s increase is on the NEW price, so the percentages cannot simply be added.',
          memo: [
            { code: 'M', marks: 1, text: 'R65,00 × 1,071' },
            { code: 'A', marks: 1, text: 'R69,62' },
            { code: 'M', marks: 1, text: '× 1,058' },
            { code: 'CA', marks: 1, text: 'R73,65' },
            { code: 'M', marks: 1, text: '× 1,042' },
            { code: 'CA', marks: 1, text: 'R76,75' },
          ],
        },
      ],
    },
  ],
}
