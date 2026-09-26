import type { Paper } from './types'
import { SARS_2022_23, tableContext } from '@/data/taxTables'

/**
 * Mathematical Literacy Grade 12, 2022 Paper 1 -- in the NSC format.
 *
 * WHERE ITS SHAPE COMES FROM. The 2023, 2024 and 2025 papers were rebuilt
 * against the real November papers and their marking guidelines. No 2022
 * paper was available, so this one follows the pattern those three years
 * share rather than any one paper: 150 marks, 3 hours, five questions of
 * about 30 marks (here 30, 31, 29, 30 and 30); Question 1 all short Level 1
 * items; Finance and Data Handling only, with probability; and marks at each
 * cognitive level of 46, 42, 34 and 28 -- the average of those three memos.
 *
 * The income tax question prints the 2022/2023 table, because that is the
 * year a November 2022 paper taxed; see taxTables.ts.
 *
 * Everything here is ORIGINAL, and figures that look like statistics are
 * invented for practice and labelled as such. Every item carries its own data
 * in `context`, because items are also shown one at a time outside the paper.
 */

// ---------------------------------------------------------------- contexts

const DATA =
  'TABLE 1 shows the prepaid data bundles sold by one cellphone network.\n' +
  '|+ TABLE 1: PREPAID DATA BUNDLES\n| Bundle | Price | Valid for |\n|---|---|---|\n' +
  '| 100 MB | R29 | 1 day |\n| 500 MB | R69 | 7 days |\n| 1 GB | R99 | 30 days |\n' +
  '| 2 GB | R149 | 30 days |\n| 5 GB | R249 | 30 days |\n| 10 GB | R399 | 30 days |'

const STOKVEL =
  'Nomsa belongs to a stokvel with 12 members. Every member pays R500 into the stokvel each month, ' +
  'and each month ONE member receives the whole amount paid in that month, until every member has had a turn.'

const TERMS =
  'TABLE 2 gives definitions of some terms used in Mathematical Literacy.\n' +
  '|+ TABLE 2: DEFINITIONS OF TERMS\n| Letter | Definition |\n|---|---|\n' +
  '| A | Money paid for the use of borrowed money |\n' +
  '| B | The percentage by which prices rise over a year |\n' +
  '| C | Money put aside regularly for a future purpose |\n' +
  '| D | A cost that stays the same no matter how many items are made |\n' +
  '| E | A cost that changes with the number of items made |\n' +
  '| F | The point at which income is exactly equal to costs |\n' +
  '| G | The middle value of a data set arranged in order |\n' +
  '| H | The value that occurs most often in a data set |\n' +
  'Match each term with its definition. Write only the letter (A–H).'

const WATER =
  'A municipality charges for water in steps, as shown in TABLE 3. Tariffs include VAT. There is also a fixed sewerage charge of R185,00 a month.\n' +
  '|+ TABLE 3: MONTHLY WATER TARIFFS\n| Water used in the month | Tariff per kℓ |\n|---|---|\n' +
  '| First 6 kℓ | R0,00 (free basic water) |\n| More than 6 kℓ, up to 15 kℓ | R22,40 |\n' +
  '| More than 15 kℓ, up to 30 kℓ | R31,85 |\n| More than 30 kℓ | R48,60 |\n' +
  'The Mokoena household used 24 kℓ of water in June.'

const TV =
  'Sipho buys a television on hire purchase. The cash price is R8 999. He pays a deposit of 10% of the cash price, ' +
  'then 24 monthly instalments of R438,50. He must also pay insurance of R35 a month for the 24 months.'

const TAX =
  'Mrs Dlamini is 67 years old. Her annual taxable income for the 2022/2023 tax year is R412 600.\n\n' + tableContext(SARS_2022_23)

const RAIN =
  'TABLE 4 shows the average monthly rainfall in two towns. (The figures are invented for practice.)\n' +
  '|+ TABLE 4: AVERAGE MONTHLY RAINFALL (mm)\n| Month | Town A | Town B |\n|---|---|---|\n' +
  '| Jan | 112 | 8 |\n| Feb | 98 | 12 |\n| Mar | 85 | 20 |\n| Apr | 40 | 48 |\n| May | 15 | 76 |\n| Jun | 6 | 92 |\n' +
  '| Jul | 4 | 88 |\n| Aug | 9 | 70 |\n| Sep | 22 | 41 |\n| Oct | 58 | 30 |\n| Nov | 90 | 14 |\n| Dec | 104 | 10 |'

const TRAVEL =
  'A school asked all 240 of its learners how they usually travel to school.\n' +
  '|+ TABLE 5: HOW LEARNERS TRAVEL TO SCHOOL\n| Transport | Learners |\n|---|---|\n' +
  '| Walk | 96 |\n| Taxi | 72 |\n| Bus | 42 |\n| Car | 24 |\n| Bicycle | 6 |\n| TOTAL | 240 |'

const CAKES =
  'Lerato bakes birthday cakes to order. Her fixed costs are R1 200 a month, the ingredients for one cake cost R85, and she sells each cake for R245.\n' +
  '|+ TABLE 6: INCOME AND COSTS FOR ONE MONTH\n| Cakes sold | Income | Total cost |\n|---|---|---|\n' +
  '| 0 | R0 | R1 200 |\n| 5 | R1 225 | R1 625 |\n| 10 | R2 450 | R2 050 |\n| 15 | A | B |'

const INVEST =
  'Thabo invests R15 000 for 3 years at 7,5% per year compound interest, added once a year. ' +
  'His friend Kabelo invests R15 000 for 3 years at 8% per year simple interest.'

const BUDGET =
  'The Zulu family’s monthly budget is shown below; the amount for "Other" has been left out.\n' +
  '|+ TABLE 7: MONTHLY BUDGET\n| Item | Amount |\n|---|---|\n' +
  '| INCOME | |\n| Salary | R18 400 |\n| Child support grants (2 × R530) | R1 060 |\n' +
  '| EXPENSES | |\n| Rent | R5 200 |\n| Food | R4 800 |\n| Transport | R2 100 |\n| Electricity | R1 150 |\n' +
  '| School fees | R900 |\n| Clothing account | R850 |\n| Savings | R1 000 |\n| Other | X |\n' +
  'The budget is balanced: total expenses equal total income.'

const MARKS =
  'The Mathematical Literacy marks (%) of 15 learners in a class, arranged in order, are:\n' +
  '34   41   45   48   52   55   58   60   63   66   70   72   78   85   92'

// ---------------------------------------------------------------- paper

export const matLitG12P1Y2022: Paper = {
  id: 'ml-p1-2022',
  subjectId: 'mat-lit',
  paperNumber: 1,
  grade: 12,
  kind: 'past',
  year: 2022,
  title: '2022 Paper 1',
  durationMinutes: 180,
  totalMarks: 150,
  sections: [
    {
      number: 1,
      title: 'Data bundles, a stokvel and terms',
      topicId: 'finance',
      marks: 30,
      items: [
        {
          id: 'ml-p1-22n-1-1-1',
          label: '1.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: DATA,
          prompt: 'Write down the price of the 2 GB bundle.',
          answer: 'R149',
          explanation: 'Read from TABLE 1.',
          memo: [{ code: 'RT', marks: 2, text: 'R149' }],
        },
        {
          id: 'ml-p1-22n-1-1-2',
          label: '1.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: DATA,
          prompt: 'How many of the bundles are valid for 30 days?',
          answer: '4',
          explanation: 'The 1 GB, 2 GB, 5 GB and 10 GB bundles.',
          memo: [{ code: 'A', marks: 2, text: '4' }],
        },
        {
          id: 'ml-p1-22n-1-1-3',
          label: '1.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: DATA,
          prompt: 'Which ONE of the following is equal to 1 GB?',
          options: [
            { id: 'a', label: '10 MB' },
            { id: 'b', label: '100 MB' },
            { id: 'c', label: '1 024 MB' },
            { id: 'd', label: '10 000 MB' },
          ],
          correctOptionId: 'c',
          answer: '1 024 MB',
          explanation: 'In computing, 1 GB = 1 024 MB.',
          memo: [{ code: 'A', marks: 2, text: '1 024 MB' }],
        },
        {
          id: 'ml-p1-22n-1-1-4',
          label: '1.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: DATA,
          prompt: 'Calculate the cost per GB of the 10 GB bundle.',
          answer: 'R39,90 per GB',
          explanation: 'R399 ÷ 10 = R39,90.',
          memo: [
            { code: 'RT', marks: 1, text: 'R399' },
            { code: 'M', marks: 1, text: '÷ 10' },
            { code: 'A', marks: 1, text: 'R39,90' },
          ],
        },
        {
          id: 'ml-p1-22n-1-1-5',
          label: '1.1.5',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: DATA,
          prompt: 'Write the price of the 5 GB bundle in words.',
          answer: 'Two hundred and forty-nine rand',
          explanation: 'R249 = two hundred and forty-nine rand.',
          memo: [{ code: 'A', marks: 2, text: 'Two hundred and forty-nine rand' }],
        },
        {
          id: 'ml-p1-22n-1-2-1',
          label: '1.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: STOKVEL,
          prompt: 'Calculate the amount paid out to one member each month.',
          answer: 'R6 000',
          explanation: '12 members × R500 = R6 000.',
          memo: [
            { code: 'M', marks: 1, text: '12 × R500' },
            { code: 'A', marks: 1, text: 'R6 000' },
          ],
        },
        {
          id: 'ml-p1-22n-1-2-2',
          label: '1.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: STOKVEL,
          prompt: 'How many months does it take for every member to receive a payout once?',
          answer: '12 months',
          explanation: 'One member is paid each month and there are 12 members.',
          memo: [{ code: 'A', marks: 2, text: '12 months' }],
        },
        {
          id: 'ml-p1-22n-1-2-3',
          label: '1.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: STOKVEL,
          prompt: 'Nomsa receives her payout in month 5. Calculate how much she has paid into the stokvel by the end of month 5.',
          answer: 'R2 500',
          explanation: '5 months × R500 = R2 500.',
          memo: [
            { code: 'RT', marks: 1, text: '5 months and R500' },
            { code: 'M', marks: 1, text: '5 × R500' },
            { code: 'A', marks: 1, text: 'R2 500' },
          ],
        },
        {
          id: 'ml-p1-22n-1-2-4',
          label: '1.2.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: STOKVEL,
          prompt: 'In Nomsa’s own budget, is her monthly R500 payment INCOME or EXPENDITURE?',
          answer: 'Expenditure',
          explanation: 'It is money going out of her budget each month.',
          memo: [{ code: 'A', marks: 2, text: 'Expenditure' }],
        },
        ...(
          [
            ['1.3.1', 'VARIABLE COST', 'E', ['D', 'E', 'F', 'C'], 'A variable cost changes with the number of items made; D, a fixed cost, does not.'],
            ['1.3.2', 'BREAK-EVEN POINT', 'F', ['F', 'B', 'G', 'D'], 'At the break-even point, income is exactly equal to costs.'],
            ['1.3.3', 'INTEREST', 'A', ['C', 'H', 'A', 'B'], 'Interest is the money paid for the use of borrowed money.'],
            ['1.3.4', 'MODE', 'H', ['G', 'A', 'E', 'H'], 'The mode occurs most often; G, the median, is the middle value.'],
            ['1.3.5', 'INFLATION RATE', 'B', ['B', 'C', 'D', 'F'], 'The inflation rate is the percentage by which prices rise over a year.'],
          ] as const
        ).map(([label, term, right, letters, why], k) => ({
          id: 'ml-p1-22n-1-3-' + (k + 1),
          label,
          topicId: k === 3 ? 'data-handling' : 'finance',
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
      title: 'A water bill, hire purchase and income tax',
      topicId: 'finance',
      marks: 31,
      items: [
        {
          id: 'ml-p1-22n-2-1-1',
          label: '2.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: WATER,
          prompt: 'How many kilolitres of water does a household get free each month?',
          answer: '6 kℓ',
          explanation: 'The first 6 kℓ are charged at R0,00.',
          memo: [{ code: 'RT', marks: 2, text: '6 kℓ' }],
        },
        {
          id: 'ml-p1-22n-2-1-2',
          label: '2.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: WATER,
          prompt: 'Calculate the cost of the WATER ONLY for a household that used 13 kℓ in a month.',
          answer: 'R156,80',
          explanation: 'The first 6 kℓ are free. The other 13 − 6 = 7 kℓ are in the second step: 7 × R22,40 = R156,80.',
          memo: [
            { code: 'RT', marks: 1, text: 'R22,40 per kℓ' },
            { code: 'M', marks: 1, text: '13 − 6 = 7 kℓ' },
            { code: 'M', marks: 1, text: '7 × R22,40' },
            { code: 'A', marks: 1, text: 'R156,80' },
          ],
        },
        {
          id: 'ml-p1-22n-2-1-3',
          label: '2.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 6,
          context: WATER,
          prompt: 'Calculate the Mokoena household’s total bill for June (water and sewerage).',
          answer: 'R673,25',
          explanation:
            'First 6 kℓ: free. Next 9 kℓ (to 15 kℓ): 9 × R22,40 = R201,60. Last 9 kℓ (15 to 24 kℓ): 9 × R31,85 = R286,65. ' +
            'Water = R488,25. Add sewerage: R488,25 + R185,00 = R673,25.',
          memo: [
            { code: 'A', marks: 1, text: '9 kℓ at R22,40' },
            { code: 'CA', marks: 1, text: 'R201,60' },
            { code: 'A', marks: 1, text: '9 kℓ at R31,85' },
            { code: 'CA', marks: 1, text: 'R286,65' },
            { code: 'M', marks: 1, text: 'Adding the R185 sewerage charge' },
            { code: 'CA', marks: 1, text: 'R673,25' },
          ],
        },
        {
          id: 'ml-p1-22n-2-1-4',
          label: '2.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: WATER,
          prompt: 'Give ONE reason why the municipality charges more per kilolitre for households that use a lot of water.',
          answer: 'To discourage waste and encourage people to save water.',
          explanation: 'Other valid reasons: heavy users pay a fairer share, or the extra income helps pay for free basic water.',
          memo: [{ code: 'J', marks: 2, text: 'Any valid reason, e.g. to discourage waste' }],
        },
        {
          id: 'ml-p1-22n-2-2-1',
          label: '2.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TV,
          prompt: 'Calculate the deposit Sipho pays.',
          answer: 'R899,90',
          explanation: '10% × R8 999 = R899,90.',
          memo: [
            { code: 'M', marks: 1, text: '10% × R8 999' },
            { code: 'A', marks: 1, text: 'R899,90' },
          ],
        },
        {
          id: 'ml-p1-22n-2-2-2',
          label: '2.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: TV,
          prompt: 'Calculate the total amount Sipho pays for the television, including the deposit and insurance.',
          answer: 'R12 263,90',
          explanation: 'Deposit R899,90 + instalments 24 × R438,50 = R10 524 + insurance 24 × R35 = R840. Total R12 263,90.',
          memo: [
            { code: 'M', marks: 1, text: '24 × R438,50 and 24 × R35' },
            { code: 'M', marks: 1, text: 'Adding the deposit' },
            { code: 'CA', marks: 1, text: 'R12 263,90' },
          ],
        },
        {
          id: 'ml-p1-22n-2-2-3',
          label: '2.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 4,
          context: TV + '\nAltogether Sipho pays R12 263,90.',
          prompt: 'Sipho says that buying on hire purchase costs him MORE than a third extra, compared with the cash price. Verify whether he is correct.',
          answer: 'Extra = R3 264,90; a third of R8 999 is R2 999,67. He pays more than a third extra, so he is CORRECT.',
          explanation: 'R12 263,90 − R8 999 = R3 264,90, and R8 999 ÷ 3 = R2 999,67.',
          memo: [
            { code: 'M', marks: 1, text: 'R12 263,90 − R8 999' },
            { code: 'CA', marks: 1, text: 'R3 264,90' },
            { code: 'M', marks: 1, text: 'R8 999 ÷ 3 = R2 999,67' },
            { code: 'J', marks: 1, text: 'CORRECT' },
          ],
        },
        {
          id: 'ml-p1-22n-2-3-1',
          label: '2.3.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: TAX,
          prompt: 'Write down the tax bracket Mrs Dlamini’s income falls in, and calculate the total rebate she qualifies for.',
          answer: 'Bracket R353 101 – R488 700; rebate R25 425',
          explanation: 'She is 67, so she gets the primary and the secondary rebate: R16 425 + R9 000 = R25 425.',
          memo: [
            { code: 'RT', marks: 1, text: 'Bracket R353 101 – R488 700' },
            { code: 'RT', marks: 1, text: 'Primary and secondary rebates' },
            { code: 'CA', marks: 1, text: 'R25 425' },
          ],
        },
        {
          id: 'ml-p1-22n-2-3-2',
          label: '2.3.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: TAX,
          prompt: 'Calculate Mrs Dlamini’s annual income tax.',
          answer: 'R66 746',
          explanation:
            'Tax before rebates = R73 726 + 31% × (R412 600 − R353 100) = R73 726 + 31% × R59 500 = R73 726 + R18 445 = R92 171. ' +
            'Less rebates of R25 425: R92 171 − R25 425 = R66 746.',
          memo: [
            { code: 'SF', marks: 1, text: 'R73 726 + 31% × (R412 600 − R353 100)' },
            { code: 'CA', marks: 1, text: 'R18 445' },
            { code: 'CA', marks: 1, text: 'R92 171' },
            { code: 'M', marks: 1, text: '− R25 425' },
            { code: 'CA', marks: 1, text: 'R66 746' },
          ],
        },
      ],
    },
    {
      number: 3,
      title: 'Rainfall and how learners travel',
      topicId: 'data-handling',
      marks: 29,
      items: [
        {
          id: 'ml-p1-22n-3-1-1',
          label: '3.1.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: RAIN,
          prompt: 'In which month does Town B get the MOST rain?',
          answer: 'June',
          explanation: 'Town B’s highest value is 92 mm, in June.',
          memo: [{ code: 'RT', marks: 2, text: 'June' }],
        },
        {
          id: 'ml-p1-22n-3-1-2',
          label: '3.1.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: RAIN,
          prompt: 'Determine the range of Town A’s monthly rainfall.',
          answer: '108 mm',
          explanation: 'Highest 112 mm − lowest 4 mm = 108 mm.',
          memo: [
            { code: 'RT', marks: 1, text: '112 and 4' },
            { code: 'M', marks: 1, text: 'Subtracting' },
            { code: 'A', marks: 1, text: '108 mm' },
          ],
        },
        {
          id: 'ml-p1-22n-3-1-3',
          label: '3.1.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: RAIN,
          prompt: 'Calculate the mean monthly rainfall of Town B.',
          answer: '≈ 42,4 mm',
          explanation: 'The 12 values add up to 509 mm. 509 ÷ 12 = 42,4 mm.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding ALL 12 values' },
            { code: 'A', marks: 1, text: '509' },
            { code: 'M', marks: 1, text: '÷ 12' },
            { code: 'CA', marks: 1, text: '42,4 mm' },
          ],
        },
        {
          id: 'ml-p1-22n-3-1-4',
          label: '3.1.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: RAIN,
          prompt: 'One of the towns is in the Western Cape, where most rain falls in winter. Which town is it? Explain your answer.',
          answer: 'Town B: it gets most of its rain from May to August, the winter months.',
          explanation: 'Town A gets most of its rain in summer (November to March).',
          memo: [{ code: 'J', marks: 2, text: 'Town B, because most of its rain falls in winter' }],
        },
        {
          id: 'ml-p1-22n-3-1-5',
          label: '3.1.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: RAIN,
          prompt: 'Determine the median monthly rainfall of Town A.',
          answer: '49 mm',
          explanation: 'In order: 4, 6, 9, 15, 22, 40, 58, 85, 90, 98, 104, 112. With 12 values, the median is halfway between the 6th and 7th: (40 + 58) ÷ 2 = 49 mm.',
          memo: [
            { code: 'A', marks: 1, text: 'Arranging in order' },
            { code: 'M', marks: 1, text: 'The two middle values, 40 and 58' },
            { code: 'M', marks: 1, text: '(40 + 58) ÷ 2' },
            { code: 'CA', marks: 1, text: '49 mm' },
          ],
        },
        {
          id: 'ml-p1-22n-3-2-1',
          label: '3.2.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TRAVEL,
          prompt: 'Is the type of transport CATEGORICAL or NUMERICAL data?',
          answer: 'Categorical',
          explanation: 'The answers are categories (walk, taxi, bus …), not numbers.',
          memo: [{ code: 'A', marks: 2, text: 'Categorical' }],
        },
        {
          id: 'ml-p1-22n-3-2-2',
          label: '3.2.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: TRAVEL,
          prompt: 'Calculate the percentage of learners who travel by taxi.',
          answer: '30%',
          explanation: '72 ÷ 240 × 100% = 30%.',
          memo: [
            { code: 'RT', marks: 1, text: '72 and 240' },
            { code: 'M', marks: 1, text: '÷ 240 × 100%' },
            { code: 'A', marks: 1, text: '30%' },
          ],
        },
        {
          id: 'ml-p1-22n-3-2-3',
          label: '3.2.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: TRAVEL,
          prompt: 'A learner is chosen at random. Determine, as a decimal, the probability that the learner does NOT walk to school.',
          answer: '0,6',
          explanation: '240 − 96 = 144 learners do not walk. 144 ÷ 240 = 0,6.',
          memo: [
            { code: 'M', marks: 1, text: '240 − 96' },
            { code: 'A', marks: 1, text: '144' },
            { code: 'CA', marks: 1, text: '0,6' },
          ],
        },
        {
          id: 'ml-p1-22n-3-2-4',
          label: '3.2.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: TRAVEL,
          prompt: 'Explain why a pie chart is a suitable graph for this data.',
          answer: 'The categories together make up one whole group (all 240 learners), and a pie chart shows each category’s share of that whole.',
          explanation: 'Pie charts show parts of a whole.',
          memo: [{ code: 'J', marks: 2, text: 'It shows each category as part of the whole' }],
        },
        {
          id: 'ml-p1-22n-3-2-5',
          label: '3.2.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 4,
          context: TRAVEL,
          prompt: 'The principal says that MORE than half of the learners use public transport (taxi or bus). Verify whether the principal is correct.',
          answer: '114 of 240 learners = 47,5%, which is less than half. The principal is NOT correct.',
          explanation: 'Taxi + bus = 72 + 42 = 114. 114 ÷ 240 × 100% = 47,5%.',
          memo: [
            { code: 'A', marks: 1, text: '72 + 42 = 114' },
            { code: 'M', marks: 1, text: '÷ 240 × 100%' },
            { code: 'CA', marks: 1, text: '47,5%' },
            { code: 'J', marks: 1, text: 'NOT correct' },
          ],
        },
      ],
    },
    {
      number: 4,
      title: 'A cake business and two investments',
      topicId: 'finance',
      marks: 30,
      items: [
        {
          id: 'ml-p1-22n-4-1-1',
          label: '4.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CAKES,
          prompt: 'Write down Lerato’s fixed costs for a month.',
          answer: 'R1 200',
          explanation: 'Read from the description, or from TABLE 6 at 0 cakes.',
          memo: [{ code: 'RT', marks: 2, text: 'R1 200' }],
        },
        {
          id: 'ml-p1-22n-4-1-2',
          label: '4.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: CAKES,
          prompt: 'Calculate the values of A and B.',
          answer: 'A = R3 675; B = R2 475',
          explanation: 'A = 15 × R245 = R3 675. B = R1 200 + 15 × R85 = R2 475.',
          memo: [
            { code: 'M', marks: 1, text: '15 × R245' },
            { code: 'A', marks: 1, text: 'A = R3 675' },
            { code: 'CA', marks: 1, text: 'B = R2 475' },
          ],
        },
        {
          id: 'ml-p1-22n-4-1-3',
          label: '4.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: CAKES,
          prompt: 'Write down a formula for Lerato’s total cost for a month in which she bakes n cakes.',
          answer: 'Total cost = R1 200 + R85 × n',
          explanation: 'The fixed costs, plus R85 for each cake.',
          memo: [
            { code: 'A', marks: 1, text: 'R1 200' },
            { code: 'A', marks: 1, text: '+ R85' },
            { code: 'A', marks: 1, text: '× n' },
          ],
        },
        {
          id: 'ml-p1-22n-4-1-4',
          label: '4.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: CAKES,
          prompt: 'Calculate the number of cakes Lerato must sell in a month to break even.',
          answer: '8 cakes (7,5 rounded up)',
          explanation: '245n = 1 200 + 85n, so 160n = 1 200 and n = 7,5. She cannot sell half a cake, so she needs 8 to cover her costs.',
          memo: [
            { code: 'SF', marks: 1, text: 'Income = R245 × n' },
            { code: 'M', marks: 1, text: '245n = 1 200 + 85n' },
            { code: 'S', marks: 1, text: '160n = 1 200' },
            { code: 'CA', marks: 1, text: 'n = 7,5' },
            { code: 'R', marks: 1, text: '8 cakes' },
          ],
        },
        {
          id: 'ml-p1-22n-4-1-5',
          label: '4.1.5',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 4,
          context: CAKES,
          prompt: 'Lerato says that if she sells 20 cakes, her profit will be MORE than double her profit from 15 cakes. Verify whether she is correct.',
          answer: 'Profit at 15 cakes = R1 200; at 20 cakes = R2 000. Double R1 200 is R2 400, so she is NOT correct.',
          explanation: '15 cakes: R3 675 − R2 475 = R1 200. 20 cakes: 20 × R245 = R4 900; cost R1 200 + 20 × R85 = R2 900; profit R2 000.',
          memo: [
            { code: 'CA', marks: 1, text: 'Profit at 15 cakes: R1 200' },
            { code: 'M', marks: 1, text: 'Income and cost for 20 cakes' },
            { code: 'CA', marks: 1, text: 'Profit at 20 cakes: R2 000' },
            { code: 'J', marks: 1, text: 'NOT correct (R2 000 < R2 400)' },
          ],
        },
        {
          id: 'ml-p1-22n-4-2-1',
          label: '4.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: INVEST,
          prompt: 'Write down the interest rate on Thabo’s investment.',
          answer: '7,5% per year',
          explanation: 'Read from the description.',
          memo: [{ code: 'RT', marks: 2, text: '7,5%' }],
        },
        {
          id: 'ml-p1-22n-4-2-2',
          label: '4.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: INVEST,
          prompt: 'Calculate the total SIMPLE interest Kabelo earns in 3 years.',
          answer: 'R3 600',
          explanation: 'Simple interest is the same every year: 8% × R15 000 = R1 200 a year. 3 × R1 200 = R3 600.',
          memo: [
            { code: 'M', marks: 1, text: '8% × R15 000' },
            { code: 'A', marks: 1, text: 'R1 200 a year' },
            { code: 'M', marks: 1, text: '× 3' },
            { code: 'CA', marks: 1, text: 'R3 600' },
          ],
        },
        {
          id: 'ml-p1-22n-4-2-3',
          label: '4.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: INVEST,
          prompt: 'Calculate the value of Thabo’s investment after 3 years. Show the value at the end of EACH year.',
          answer: 'R18 634,45',
          explanation:
            'Year 1: R15 000 × 1,075 = R16 125,00. Year 2: R16 125,00 × 1,075 = R17 334,38. Year 3: R17 334,38 × 1,075 = R18 634,45. ' +
            'Each year the interest is worked out on the new, larger amount.',
          memo: [
            { code: 'M', marks: 1, text: 'R15 000 × 1,075' },
            { code: 'A', marks: 1, text: 'R16 125,00' },
            { code: 'CA', marks: 1, text: 'R17 334,38' },
            { code: 'M', marks: 1, text: 'Third year on the new amount' },
            { code: 'CA', marks: 1, text: 'R18 634,45' },
          ],
        },
        {
          id: 'ml-p1-22n-4-2-4',
          label: '4.2.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: INVEST + '\nAfter 3 years Thabo has R18 634,45 and Kabelo has R18 600,00.',
          prompt: 'Thabo’s interest rate is lower, but he ends with more money. Explain why.',
          answer: 'Compound interest is earned on the interest already added, so Thabo’s balance grows faster each year, while Kabelo earns the same R1 200 every year.',
          explanation: 'Over a longer time the gap would keep growing in Thabo’s favour.',
          memo: [{ code: 'J', marks: 2, text: 'Compound interest earns interest on interest' }],
        },
      ],
    },
    {
      number: 5,
      title: 'A family budget and class marks',
      topicId: 'finance',
      marks: 30,
      items: [
        {
          id: 'ml-p1-22n-5-1-1',
          label: '5.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: BUDGET,
          prompt: 'Calculate the family’s total monthly income.',
          answer: 'R19 460',
          explanation: 'R18 400 + R1 060 = R19 460.',
          memo: [
            { code: 'M', marks: 1, text: 'R18 400 + R1 060' },
            { code: 'A', marks: 1, text: 'R19 460' },
          ],
        },
        {
          id: 'ml-p1-22n-5-1-2',
          label: '5.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: BUDGET + '\nTotal income is R19 460.',
          prompt: 'Calculate the value of X.',
          answer: 'R3 460',
          explanation: 'The listed expenses add up to R16 000. X = R19 460 − R16 000 = R3 460.',
          memo: [
            { code: 'RT', marks: 1, text: 'ALL seven listed expenses' },
            { code: 'M', marks: 1, text: 'R19 460 − R16 000' },
            { code: 'A', marks: 1, text: 'R3 460' },
          ],
        },
        {
          id: 'ml-p1-22n-5-1-3',
          label: '5.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: BUDGET + '\nTotal income is R19 460.',
          prompt: 'Calculate rent as a percentage of the family’s total income.',
          answer: '≈ 26,7%',
          explanation: 'R5 200 ÷ R19 460 × 100% = 26,7%.',
          memo: [
            { code: 'RT', marks: 1, text: 'R5 200' },
            { code: 'M', marks: 1, text: '÷ R19 460 × 100%' },
            { code: 'CA', marks: 1, text: '26,7%' },
          ],
        },
        {
          id: 'ml-p1-22n-5-1-4',
          label: '5.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: BUDGET + '\n"Other" is R3 460.',
          prompt: 'Food prices rise by 12%. The family keeps the budget balanced by spending less on "Other". Calculate the new amount for "Other".',
          answer: 'R2 884',
          explanation: '12% × R4 800 = R576 more on food, so "Other" drops by R576: R3 460 − R576 = R2 884.',
          memo: [
            { code: 'M', marks: 1, text: '12% × R4 800' },
            { code: 'A', marks: 1, text: 'R576' },
            { code: 'CA', marks: 1, text: 'R2 884' },
          ],
        },
        {
          id: 'ml-p1-22n-5-1-5',
          label: '5.1.5',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 4,
          context: BUDGET + '\nTotal income is R19 460.',
          prompt: 'A financial adviser says a family should save at least 10% of its income. Verify whether the Zulu family does, and by how much they are short or over.',
          answer: '10% of R19 460 = R1 946. They save R1 000, which is R946 SHORT, so they do not meet the advice.',
          explanation: 'Compare what they save with 10% of the total income.',
          memo: [
            { code: 'M', marks: 1, text: '10% × R19 460' },
            { code: 'A', marks: 1, text: 'R1 946' },
            { code: 'J', marks: 1, text: 'They do NOT save enough' },
            { code: 'CA', marks: 1, text: 'R946 short' },
          ],
        },
        {
          id: 'ml-p1-22n-5-2-1',
          label: '5.2.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: MARKS,
          prompt: 'Write down the lowest mark.',
          answer: '34%',
          explanation: 'The first value in the ordered list.',
          memo: [{ code: 'RT', marks: 2, text: '34%' }],
        },
        {
          id: 'ml-p1-22n-5-2-2',
          label: '5.2.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: MARKS,
          prompt: 'Write down the median mark.',
          answer: '60%',
          explanation: 'With 15 marks, the median is the 8th: 60%.',
          memo: [
            { code: 'M', marks: 1, text: 'The 8th value' },
            { code: 'A', marks: 1, text: '60%' },
          ],
        },
        {
          id: 'ml-p1-22n-5-2-3',
          label: '5.2.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: MARKS,
          prompt: 'Determine the interquartile range of the marks.',
          answer: '24',
          explanation: 'Lower 7 values: 34 … 58, so Q1 = 48 (the 4th). Upper 7 values: 63 … 92, so Q3 = 72. IQR = 72 − 48 = 24.',
          memo: [
            { code: 'A', marks: 1, text: 'Q1 = 48' },
            { code: 'A', marks: 1, text: 'Q3 = 72' },
            { code: 'M', marks: 1, text: 'Q3 − Q1' },
            { code: 'CA', marks: 1, text: '24' },
          ],
        },
        {
          id: 'ml-p1-22n-5-2-4',
          label: '5.2.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: MARKS,
          prompt: 'Calculate the percentage of learners who scored 50% or more.',
          answer: '≈ 73,3%',
          explanation: '11 of the 15 marks are 50 or more (from 52 upwards). 11 ÷ 15 × 100% = 73,3%.',
          memo: [
            { code: 'A', marks: 1, text: '11 learners' },
            { code: 'M', marks: 1, text: '÷ 15 × 100%' },
            { code: 'CA', marks: 1, text: '73,3%' },
          ],
        },
        {
          id: 'ml-p1-22n-5-2-5',
          label: '5.2.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 4,
          context: MARKS + '\nThis class has a median of 60% and an interquartile range of 24. Last year’s class had a median of 58% and an interquartile range of 30.',
          prompt: 'The teacher says this class did better than last year’s class. Use BOTH the median and the interquartile range to comment on her claim.',
          answer: 'The median is higher (60% against 58%), so the typical learner did better. The IQR is smaller (24 against 30), so the middle half of the marks were closer together and more consistent. Both support her claim.',
          explanation: 'The median describes the typical mark; the IQR describes how spread out the middle half is.',
          memo: [
            { code: 'J', marks: 2, text: 'Higher median: the typical learner did better' },
            { code: 'J', marks: 2, text: 'Smaller IQR: the marks are more consistent' },
          ],
        },
      ],
    },
  ],
}
