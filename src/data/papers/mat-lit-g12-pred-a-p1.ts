import type { Paper } from './types'
import { SARS_2025_26, tableContext } from '@/data/taxTables'

/**
 * Mathematical Literacy Grade 12, Predicted Paper 1 Set A -- in the NSC format.
 *
 * WHERE ITS SHAPE COMES FROM. The real November 2023, 2024 and 2025 papers and
 * their marking guidelines: 150 marks, 3 hours, five questions of about 30
 * marks (here 30, 31, 29, 30 and 30); Question 1 all short Level 1 items;
 * Finance and Data Handling only, with probability; and marks at each
 * cognitive level close to what those memos show (46, 41, 35 and 28).
 *
 * A predicted paper taxes the latest year we know, so the income tax question
 * prints the 2025/2026 table; see taxTables.ts.
 *
 * Everything here is ORIGINAL, and figures that look like statistics are
 * invented for practice and labelled as such. Every item carries its own data
 * in `context`, because items are also shown one at a time outside the paper.
 */

// ---------------------------------------------------------------- contexts

const FUEL =
  'TABLE 1 shows the price of petrol (95) and diesel at the coast for the first six months of a year. (The prices are invented for practice.)\n' +
  '|+ TABLE 1: FUEL PRICES (RAND PER LITRE)\n| Month | Petrol | Diesel |\n|---|---|---|\n' +
  '| Jan | 21,54 | 19,88 |\n| Feb | 21,12 | 19,63 |\n| Mar | 21,79 | 20,15 |\n' +
  '| Apr | 22,31 | 20,48 |\n| May | 22,06 | 20,21 |\n| Jun | 21,68 | 19,95 |'

const VOUCHER =
  'Sipho buys prepaid electricity. His voucher shows the following:\n' +
  '|+ PREPAID ELECTRICITY VOUCHER\n| Item | Amount |\n|---|---|\n' +
  '| Amount paid | R500,00 |\n| VAT (15%) included | R65,22 |\n| Units bought | 172,4 kWh |\n| Free basic electricity | 50 kWh |'

const TERMS =
  'TABLE 2 gives definitions of some terms used in Mathematical Literacy.\n' +
  '|+ TABLE 2: DEFINITIONS OF TERMS\n| Letter | Definition |\n|---|---|\n' +
  '| A | Income tax that an employer deducts from a salary every month |\n' +
  '| B | A fund that pays a worker for a limited time after losing a job |\n' +
  '| C | Total earnings before any deductions |\n' +
  '| D | Interest calculated only on the amount first invested or borrowed |\n' +
  '| E | Interest calculated on the amount plus the interest already added |\n' +
  '| F | The value of one currency in terms of another currency |\n' +
  '| G | The middle value of a data set arranged in order |\n' +
  '| H | The difference between the upper and lower quartiles |\n' +
  'Match each term with its definition. Write only the letter (A–H).'

const SALARY =
  'Ayanda is 42 years old and earns a gross salary of R23 800 a month. Her employer deducts:\n' +
  '• UIF of 1% of her gross salary, but UIF is only charged on the first R17 712 of a monthly salary;\n' +
  '• a pension contribution of 7,5% of her gross salary.\n' +
  'Her pension contribution is deducted before tax, so her monthly taxable income is her gross salary minus her pension contribution. She has no other income and no bonus.'

const TAX = SALARY + '\n\n' + tableContext(SARS_2025_26)

const FOREX =
  'TABLE 3 shows exchange rates on one day. (The rates are invented for practice.)\n' +
  '|+ TABLE 3: EXCHANGE RATES\n| Currency | Rate |\n|---|---|\n' +
  '| 1 US dollar | R17,85 |\n| 1 euro (€) | R19,40 |\n| 1 British pound (£) | R22,95 |\n| R1 | 8,27 Japanese yen (¥) |'

const CLASSES =
  'The marks (%) of the Mathematical Literacy learners in two small classes, arranged in order, are:\n' +
  'Class A:  38   42   47   51   55   58   62   66   70   74   88\n' +
  'Class B:  30   36   44   52   60   64   67   71   79   85   94'

const NETWORK =
  'A survey asked 200 people which cellphone network they use. TABLE 4 shows the results by age group. (The figures are invented for practice.)\n' +
  '|+ TABLE 4: CELLPHONE NETWORK USED, BY AGE\n| Network | Under 25 | 25 and older | Total |\n|---|---|---|---|\n' +
  '| X | 46 | 38 | 84 |\n| Y | 30 | 42 | 72 |\n| Z | 14 | 30 | 44 |\n| TOTAL | 90 | 110 | 200 |'

const CARWASH =
  'Themba runs a car wash. His fixed costs are R3 600 a month, the water, soap and wages for one wash cost R14, and he charges R60 a wash.\n' +
  '|+ TABLE 5: INCOME AND COSTS FOR ONE MONTH\n| Washes | Income | Total cost |\n|---|---|---|\n' +
  '| 0 | R0 | R3 600 |\n| 50 | R3 000 | R4 300 |\n| 100 | R6 000 | R5 000 |\n| 150 | A | B |'

const FOOD =
  'The Mahlangu household has a monthly income of R28 400 and spends R4 850 of it on food. Over the next year food prices are expected to rise by 4,8%, ' +
  'and their income will rise by 3,5%. They plan to buy exactly the same food.'

const HOUSE =
  'The Naidoo family can buy a house or keep renting.\n' +
  'BUYING: price R950 000; deposit 10% of the price; the rest is a bond repaid at R9 170 a month for 20 years; transfer and bond registration costs R48 500, paid once.\n' +
  'RENTING: rent is R7 800 a month in the first year and rises by 6% at the start of each new year.'

const JOBS =
  'TABLE 6 shows the unemployment rate in each province in one quarter. (The figures are invented for practice.)\n' +
  '|+ TABLE 6: UNEMPLOYMENT RATE BY PROVINCE (%)\n| Province | Rate |\n|---|---|\n' +
  '| Eastern Cape | 37,8 |\n| Free State | 35,1 |\n| Gauteng | 33,4 |\n| KwaZulu-Natal | 30,2 |\n| Limpopo | 34,9 |\n' +
  '| Mpumalanga | 36,6 |\n| Northern Cape | 28,7 |\n| North West | 39,2 |\n| Western Cape | 21,9 |'

// ---------------------------------------------------------------- paper

export const matLitG12P1SetA: Paper = {
  id: 'ml-p1-pred-a',
  subjectId: 'mat-lit',
  paperNumber: 1,
  grade: 12,
  kind: 'predicted',
  setLabel: 'A',
  title: 'Predicted Paper 1 — Set A',
  durationMinutes: 180,
  totalMarks: 150,
  sections: [
    {
      number: 1,
      title: 'Fuel prices, prepaid electricity and terms',
      topicId: 'finance',
      marks: 30,
      items: [
        {
          id: 'ml-p1-an-1-1-1',
          label: '1.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: FUEL,
          prompt: 'Write down the price of one litre of petrol in April.',
          answer: 'R22,31',
          explanation: 'Read from TABLE 1.',
          memo: [{ code: 'RT', marks: 2, text: 'R22,31' }],
        },
        {
          id: 'ml-p1-an-1-1-2',
          label: '1.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: FUEL,
          prompt: 'In which month was diesel the cheapest?',
          answer: 'February',
          explanation: 'R19,63 in February is the lowest diesel price in TABLE 1.',
          memo: [{ code: 'RT', marks: 2, text: 'February' }],
        },
        {
          id: 'ml-p1-an-1-1-3',
          label: '1.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: FUEL,
          prompt: 'Calculate the difference between the price of petrol and the price of diesel in March.',
          answer: 'R1,64',
          explanation: 'R21,79 − R20,15 = R1,64.',
          memo: [
            { code: 'M', marks: 1, text: 'R21,79 − R20,15' },
            { code: 'A', marks: 1, text: 'R1,64' },
          ],
        },
        {
          id: 'ml-p1-an-1-1-4',
          label: '1.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: FUEL,
          prompt: 'Calculate the cost of filling a car with 40 litres of petrol in June.',
          answer: 'R867,20',
          explanation: '40 × R21,68 = R867,20.',
          memo: [
            { code: 'RT', marks: 1, text: 'R21,68' },
            { code: 'M', marks: 1, text: '40 × R21,68' },
            { code: 'A', marks: 1, text: 'R867,20' },
          ],
        },
        {
          id: 'ml-p1-an-1-1-5',
          label: '1.1.5',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: FUEL,
          prompt: 'Between which two months did the price of petrol rise the MOST?',
          options: [
            { id: 'a', label: 'January and February' },
            { id: 'b', label: 'February and March' },
            { id: 'c', label: 'March and April' },
            { id: 'd', label: 'May and June' },
          ],
          correctOptionId: 'b',
          answer: 'February and March',
          explanation: 'February to March: R21,79 − R21,12 = R0,67, more than the R0,52 rise from March to April. The price fell from January to February and from May to June.',
          memo: [{ code: 'A', marks: 2, text: 'February and March' }],
        },
        {
          id: 'ml-p1-an-1-2-1',
          label: '1.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: VOUCHER,
          prompt: 'Calculate the amount Sipho paid EXCLUDING VAT.',
          answer: 'R434,78',
          explanation: 'R500,00 − R65,22 = R434,78.',
          memo: [
            { code: 'M', marks: 1, text: 'R500,00 − R65,22' },
            { code: 'A', marks: 1, text: 'R434,78' },
          ],
        },
        {
          id: 'ml-p1-an-1-2-2',
          label: '1.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: VOUCHER,
          prompt: 'Calculate the total number of units Sipho received, including the free basic electricity.',
          answer: '222,4 kWh',
          explanation: '172,4 kWh + 50 kWh = 222,4 kWh.',
          memo: [
            { code: 'M', marks: 1, text: '172,4 + 50' },
            { code: 'A', marks: 1, text: '222,4 kWh' },
          ],
        },
        {
          id: 'ml-p1-an-1-2-3',
          label: '1.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: VOUCHER,
          prompt: 'Calculate the price of ONE unit (kWh) that Sipho bought, EXCLUDING VAT. Round to the nearest cent.',
          answer: 'R2,52 per kWh',
          explanation: 'R434,78 ÷ 172,4 kWh = R2,52 per kWh. The free units are not bought, so they are left out.',
          memo: [
            { code: 'RT', marks: 1, text: 'R434,78 and 172,4' },
            { code: 'M', marks: 1, text: 'R434,78 ÷ 172,4' },
            { code: 'A', marks: 1, text: 'R2,52' },
          ],
        },
        {
          id: 'ml-p1-an-1-2-4',
          label: '1.2.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: VOUCHER,
          prompt: 'Write down what the unit kWh stands for.',
          answer: 'Kilowatt-hour',
          explanation: 'kWh stands for kilowatt-hour, the unit in which electricity is sold.',
          memo: [{ code: 'A', marks: 2, text: 'Kilowatt-hour' }],
        },
        ...(
          [
            ['1.3.1', 'SIMPLE INTEREST', 'D', ['E', 'D', 'A', 'F'], 'Simple interest is calculated only on the amount first invested or borrowed; E is compound interest.'],
            ['1.3.2', 'EXCHANGE RATE', 'F', ['C', 'G', 'F', 'B'], 'An exchange rate gives the value of one currency in terms of another.'],
            ['1.3.3', 'PAYE', 'A', ['A', 'B', 'C', 'H'], 'PAYE (pay as you earn) is the income tax an employer deducts every month; B is UIF.'],
            ['1.3.4', 'INTERQUARTILE RANGE', 'H', ['G', 'D', 'E', 'H'], 'The interquartile range is the upper quartile minus the lower quartile; G is the median.'],
            ['1.3.5', 'COMPOUND INTEREST', 'E', ['D', 'E', 'F', 'A'], 'Compound interest is also calculated on interest already added; D is simple interest.'],
          ] as const
        ).map(([label, term, right, letters, why], k) => ({
          id: 'ml-p1-an-1-3-' + (k + 1),
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
      title: 'A salary, income tax and exchange rates',
      topicId: 'finance',
      marks: 31,
      items: [
        {
          id: 'ml-p1-an-2-1-1',
          label: '2.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: SALARY,
          prompt: 'Calculate the UIF deducted from Ayanda’s salary each month.',
          answer: 'R177,12',
          explanation: 'UIF is only charged on the first R17 712, so UIF = 1% × R17 712 = R177,12 (not 1% of R23 800).',
          memo: [
            { code: 'M', marks: 1, text: '1% × R17 712' },
            { code: 'A', marks: 1, text: 'R177,12' },
          ],
        },
        {
          id: 'ml-p1-an-2-1-2',
          label: '2.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: SALARY,
          prompt: 'Calculate Ayanda’s monthly pension contribution.',
          answer: 'R1 785',
          explanation: '7,5% × R23 800 = 0,075 × R23 800 = R1 785.',
          memo: [
            { code: 'RT', marks: 1, text: 'R23 800' },
            { code: 'M', marks: 1, text: '7,5% × R23 800' },
            { code: 'A', marks: 1, text: 'R1 785' },
          ],
        },
        {
          id: 'ml-p1-an-2-1-3',
          label: '2.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 5,
          context: SALARY,
          prompt:
            'The union wants the employer to add 6,5% of each worker’s gross salary to their pension every month. The employer offers 5% of the gross salary every month plus a once-off R3 000 a year. ' +
            'Ayanda says the union’s option gives her more pension money in a year. Verify her statement, showing ALL calculations.',
          answer: 'Union: R18 564 a year; employer: R17 280 a year. She is CORRECT (R1 284 more).',
          explanation:
            'Union: 6,5% × R23 800 = R1 547 a month × 12 = R18 564. Employer: 5% × R23 800 = R1 190 a month × 12 = R14 280, + R3 000 = R17 280. ' +
            'R18 564 > R17 280, so the union’s option gives R1 284 more. Her statement is correct.',
          memo: [
            { code: 'M', marks: 1, text: '6,5% × R23 800 × 12' },
            { code: 'CA', marks: 1, text: 'R18 564' },
            { code: 'M', marks: 1, text: '5% × R23 800 × 12 + R3 000' },
            { code: 'CA', marks: 1, text: 'R17 280' },
            { code: 'J', marks: 1, text: 'CORRECT' },
          ],
        },
        {
          id: 'ml-p1-an-2-2-1',
          label: '2.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: TAX,
          prompt: 'Calculate Ayanda’s ANNUAL taxable income.',
          answer: 'R264 180',
          explanation: 'Monthly taxable income = R23 800 − R1 785 = R22 015. × 12 = R264 180.',
          memo: [
            { code: 'M', marks: 1, text: 'R23 800 − R1 785' },
            { code: 'M', marks: 1, text: '× 12' },
            { code: 'CA', marks: 1, text: 'R264 180' },
          ],
        },
        {
          id: 'ml-p1-an-2-2-2',
          label: '2.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: TAX + '\nAyanda’s annual taxable income is R264 180.',
          prompt: 'Calculate the income tax Ayanda must pay for the year.',
          answer: 'R32 483,80',
          explanation:
            'R264 180 is in the bracket R237 101 – R370 500. Tax before rebates = R42 678 + 26% × (R264 180 − R237 100) = R42 678 + R7 040,80 = R49 718,80. ' +
            'She is under 65, so only the primary rebate applies: R49 718,80 − R17 235 = R32 483,80.',
          memo: [
            { code: 'RT', marks: 1, text: 'Correct bracket' },
            { code: 'SF', marks: 1, text: 'R42 678 + 26% × (R264 180 − R237 100)' },
            { code: 'CA', marks: 1, text: 'R49 718,80' },
            { code: 'RT', marks: 1, text: 'Primary rebate R17 235' },
            { code: 'CA', marks: 1, text: 'R32 483,80' },
          ],
        },
        {
          id: 'ml-p1-an-2-2-3',
          label: '2.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: TAX + '\nAyanda’s annual income tax is R32 483,80.',
          prompt: 'Ayanda’s payslip shows PAYE of R2 850,00 a month. Is her employer deducting the right amount? Show how much too much or too little is deducted each month.',
          answer: 'No. The monthly tax should be R2 706,98, so R143,02 too much is deducted each month.',
          explanation: 'R32 483,80 ÷ 12 = R2 706,98 a month. R2 850,00 − R2 706,98 = R143,02 too much.',
          memo: [
            { code: 'M', marks: 1, text: 'R32 483,80 ÷ 12 = R2 706,98' },
            { code: 'CA', marks: 1, text: 'R143,02' },
            { code: 'J', marks: 1, text: 'Too much is deducted' },
          ],
        },
        {
          id: 'ml-p1-an-2-3-1',
          label: '2.3.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: FOREX,
          prompt: 'How many Japanese yen will a traveller get for R1?',
          answer: '¥8,27',
          explanation: 'Read from TABLE 3.',
          memo: [{ code: 'RT', marks: 2, text: '¥8,27' }],
        },
        {
          id: 'ml-p1-an-2-3-2',
          label: '2.3.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: FOREX,
          prompt: 'Calculate the cost, in rand, of buying €250.',
          answer: 'R4 850',
          explanation: '€250 × R19,40 = R4 850.',
          memo: [
            { code: 'RT', marks: 1, text: 'R19,40' },
            { code: 'M', marks: 1, text: '250 × R19,40' },
            { code: 'A', marks: 1, text: 'R4 850' },
          ],
        },
        {
          id: 'ml-p1-an-2-3-3',
          label: '2.3.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: FOREX,
          prompt:
            'A cellphone costs 899 US dollars in an American online shop and R17 499 in a South African shop. Ignoring shipping and import costs, determine where the phone is cheaper, and by how much.',
          answer: 'In the American shop, by R1 451,85',
          explanation: '899 × R17,85 = R16 047,15. R17 499 − R16 047,15 = R1 451,85, so the American shop is cheaper by R1 451,85.',
          memo: [
            { code: 'RT', marks: 1, text: 'R17,85' },
            { code: 'M', marks: 1, text: '899 × R17,85' },
            { code: 'CA', marks: 1, text: 'R16 047,15' },
            { code: 'M', marks: 1, text: 'R17 499 − R16 047,15' },
            { code: 'CA', marks: 1, text: 'American shop, R1 451,85 cheaper' },
          ],
        },
      ],
    },
    {
      number: 3,
      title: 'Class marks and cellphone networks',
      topicId: 'data-handling',
      marks: 29,
      items: [
        {
          id: 'ml-p1-an-3-1-1',
          label: '3.1.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CLASSES,
          prompt: 'Write down the highest mark in Class B.',
          answer: '94%',
          explanation: 'The last mark in the ordered list for Class B.',
          memo: [{ code: 'A', marks: 2, text: '94' }],
        },
        {
          id: 'ml-p1-an-3-1-2',
          label: '3.1.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CLASSES,
          prompt: 'Calculate the range of the Class A marks.',
          answer: '50',
          explanation: 'Range = highest − lowest = 88 − 38 = 50.',
          memo: [
            { code: 'M', marks: 1, text: '88 − 38' },
            { code: 'A', marks: 1, text: '50' },
          ],
        },
        {
          id: 'ml-p1-an-3-1-3',
          label: '3.1.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CLASSES,
          prompt: 'Write down the median mark of Class A.',
          answer: '58%',
          explanation: 'There are 11 marks, so the median is the 6th mark: 58.',
          memo: [{ code: 'A', marks: 2, text: '58' }],
        },
        {
          id: 'ml-p1-an-3-1-4',
          label: '3.1.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: CLASSES,
          prompt: 'Determine the lower quartile, the upper quartile and the interquartile range of the Class B marks.',
          answer: 'Lower quartile 44; upper quartile 79; IQR 35',
          explanation:
            'The median is the 6th mark (64). The lower half is 30, 36, 44, 52, 60, so the lower quartile is 44; the upper half is 67, 71, 79, 85, 94, so the upper quartile is 79. IQR = 79 − 44 = 35.',
          memo: [
            { code: 'A', marks: 1, text: 'Lower quartile 44' },
            { code: 'A', marks: 1, text: 'Upper quartile 79' },
            { code: 'M', marks: 1, text: '79 − 44' },
            { code: 'CA', marks: 1, text: '35' },
          ],
        },
        {
          id: 'ml-p1-an-3-1-5',
          label: '3.1.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: CLASSES,
          prompt: 'Calculate the mean mark of Class A, rounded to TWO decimal places.',
          answer: '59,18%',
          explanation: 'Sum = 38 + 42 + 47 + 51 + 55 + 58 + 62 + 66 + 70 + 74 + 88 = 651. Mean = 651 ÷ 11 = 59,18.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding all 11 marks = 651' },
            { code: 'M', marks: 1, text: '÷ 11' },
            { code: 'CA', marks: 1, text: '59,18' },
          ],
        },
        {
          id: 'ml-p1-an-3-1-6',
          label: '3.1.6',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: CLASSES + '\nThe interquartile range of Class B is 35.',
          prompt: 'The teacher says the marks of Class A are more consistent than those of Class B. Use the interquartile ranges to verify whether she is correct.',
          answer: 'Class A IQR = 70 − 47 = 23, less than Class B’s 35, so she is CORRECT.',
          explanation:
            'Class A: lower quartile 47, upper quartile 70, IQR = 23. A smaller IQR means the middle half of the marks are closer together, so Class A is more consistent. She is correct.',
          memo: [
            { code: 'M', marks: 1, text: '70 − 47' },
            { code: 'CA', marks: 1, text: '23' },
            { code: 'J', marks: 1, text: 'CORRECT: 23 < 35' },
          ],
        },
        {
          id: 'ml-p1-an-3-2-1',
          label: '3.2.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: NETWORK,
          prompt: 'How many people aged 25 and older use network Y?',
          answer: '42',
          explanation: 'Read from TABLE 4.',
          memo: [{ code: 'RT', marks: 2, text: '42' }],
        },
        {
          id: 'ml-p1-an-3-2-2',
          label: '3.2.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: NETWORK,
          prompt: 'Calculate the percentage of all the people surveyed who use network Z.',
          answer: '22%',
          explanation: '44 ÷ 200 × 100% = 22%.',
          memo: [
            { code: 'M', marks: 1, text: '44 ÷ 200 × 100%' },
            { code: 'A', marks: 1, text: '22%' },
          ],
        },
        {
          id: 'ml-p1-an-3-2-3',
          label: '3.2.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: NETWORK,
          prompt: 'One person UNDER 25 is chosen at random. Determine the probability, as a percentage, that this person uses network X.',
          answer: '51,1%',
          explanation: 'Only the 90 people under 25 can be chosen, and 46 of them use X: 46 ÷ 90 × 100% = 51,1%.',
          memo: [
            { code: 'RT', marks: 1, text: '46 and 90' },
            { code: 'M', marks: 1, text: '46 ÷ 90 × 100%' },
            { code: 'CA', marks: 1, text: '51,1%' },
          ],
        },
        {
          id: 'ml-p1-an-3-2-4',
          label: '3.2.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: NETWORK,
          prompt:
            'A marketer says network X is more popular with people under 25 than with people aged 25 and older, because a bigger percentage of each group uses it. Verify this statement.',
          answer: 'Under 25: 51,1%; 25 and older: 34,5%. The statement is CORRECT.',
          explanation: 'Under 25: 46 ÷ 90 = 51,1%. 25 and older: 38 ÷ 110 = 34,5%. 51,1% > 34,5%, so the statement is correct.',
          memo: [
            { code: 'M', marks: 1, text: '46 ÷ 90 = 51,1%' },
            { code: 'M', marks: 1, text: '38 ÷ 110 = 34,5%' },
            { code: 'J', marks: 1, text: 'CORRECT' },
          ],
        },
        {
          id: 'ml-p1-an-3-2-5',
          label: '3.2.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: NETWORK,
          prompt: 'Write the total number of users of network Y to the total number of users of network Z as a ratio in its simplest form.',
          answer: '18 : 11',
          explanation: 'Y : Z = 72 : 44. Divide both by 4: 18 : 11.',
          memo: [
            { code: 'RT', marks: 1, text: '72 and 44' },
            { code: 'M', marks: 1, text: '72 : 44' },
            { code: 'CA', marks: 1, text: '18 : 11' },
          ],
        },
      ],
    },
    {
      number: 4,
      title: 'A car wash and the cost of food',
      topicId: 'finance',
      marks: 30,
      items: [
        {
          id: 'ml-p1-an-4-1-1',
          label: '4.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: CARWASH,
          prompt: 'Write down a formula for Themba’s total monthly cost, in rand, for n washes.',
          answer: 'Total cost = 3 600 + 14 × n',
          explanation: 'The fixed cost of R3 600 is paid whatever the number of washes, plus R14 for each wash.',
          memo: [
            { code: 'A', marks: 1, text: '3 600' },
            { code: 'A', marks: 1, text: '+ 14 × n' },
          ],
        },
        {
          id: 'ml-p1-an-4-1-2',
          label: '4.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: CARWASH,
          prompt: 'Calculate the missing values A and B in TABLE 5.',
          answer: 'A = R9 000; B = R5 700',
          explanation: 'A = 150 × R60 = R9 000. B = R3 600 + 150 × R14 = R3 600 + R2 100 = R5 700.',
          memo: [
            { code: 'M', marks: 1, text: '150 × R60' },
            { code: 'A', marks: 1, text: 'A = R9 000' },
            { code: 'A', marks: 1, text: 'B = R5 700' },
          ],
        },
        {
          id: 'ml-p1-an-4-1-3',
          label: '4.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: CARWASH,
          prompt: 'Determine the smallest number of washes Themba needs in a month to make a profit.',
          answer: '79 washes',
          explanation:
            'Each wash brings in R60 − R14 = R46 towards the fixed costs. R3 600 ÷ R46 = 78,26 washes. 78 washes still make a loss, so he needs at least 79 washes.',
          memo: [
            { code: 'M', marks: 1, text: 'R60 − R14 = R46' },
            { code: 'M', marks: 1, text: 'R3 600 ÷ R46' },
            { code: 'CA', marks: 1, text: '78,26' },
            { code: 'R', marks: 1, text: 'Rounding up' },
            { code: 'CA', marks: 1, text: '79 washes' },
          ],
        },
        {
          id: 'ml-p1-an-4-1-4',
          label: '4.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 4,
          context: CARWASH,
          prompt: 'Themba says that if he does 200 washes in a month, his profit will be at least R5 000. Verify, showing ALL calculations, whether he is correct.',
          answer: 'Profit = R12 000 − R6 400 = R5 600, which is at least R5 000. He is CORRECT.',
          explanation: 'Income = 200 × R60 = R12 000. Cost = R3 600 + 200 × R14 = R6 400. Profit = R12 000 − R6 400 = R5 600 ≥ R5 000.',
          memo: [
            { code: 'M', marks: 1, text: '200 × R60 = R12 000' },
            { code: 'M', marks: 1, text: 'R3 600 + 200 × R14 = R6 400' },
            { code: 'CA', marks: 1, text: 'R5 600' },
            { code: 'J', marks: 1, text: 'CORRECT' },
          ],
        },
        {
          id: 'ml-p1-an-4-1-5',
          label: '4.1.5',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: CARWASH + '\nFor 100 washes his profit is R1 000, and for 200 washes it is R5 600.',
          prompt: 'Themba’s friend says that doubling the number of washes will double his profit. Use the profits for 100 and 200 washes to explain whether the friend is correct.',
          answer: 'Not correct. Profit rises from R1 000 to R5 600, more than five times, because the fixed cost is paid only once.',
          explanation:
            'Doubling the washes from 100 to 200 raises the profit from R1 000 to R5 600, which is 5,6 times as much, not double. The fixed cost of R3 600 stays the same, so every extra wash adds its full R46 to the profit.',
          memo: [
            { code: 'A', marks: 1, text: 'R5 600 ÷ R1 000 = 5,6 (not 2)' },
            { code: 'R', marks: 1, text: 'Fixed cost is paid only once' },
            { code: 'J', marks: 1, text: 'NOT correct' },
          ],
        },
        {
          id: 'ml-p1-an-4-2-1',
          label: '4.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: FOOD,
          prompt: 'Write 4,8% as a decimal number.',
          answer: '0,048',
          explanation: '4,8 ÷ 100 = 0,048.',
          memo: [{ code: 'A', marks: 2, text: '0,048' }],
        },
        {
          id: 'ml-p1-an-4-2-2',
          label: '4.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: FOOD,
          prompt: 'Calculate the household’s expected monthly food bill after the price increase.',
          answer: 'R5 082,80',
          explanation: 'R4 850 × 1,048 = R5 082,80.',
          memo: [
            { code: 'M', marks: 1, text: '100% + 4,8%' },
            { code: 'M', marks: 1, text: 'R4 850 × 1,048' },
            { code: 'CA', marks: 1, text: 'R5 082,80' },
          ],
        },
        {
          id: 'ml-p1-an-4-2-3',
          label: '4.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: FOOD + '\nThe new monthly food bill will be R5 082,80.',
          prompt: 'Calculate the percentage of their monthly income spent on food NOW and NEXT YEAR. Round to two decimal places.',
          answer: 'Now 17,08%; next year 17,29%',
          explanation: 'Now: R4 850 ÷ R28 400 × 100% = 17,08%. New income = R28 400 × 1,035 = R29 394. Next year: R5 082,80 ÷ R29 394 × 100% = 17,29%.',
          memo: [
            { code: 'M', marks: 1, text: 'R4 850 ÷ R28 400 × 100%' },
            { code: 'CA', marks: 1, text: '17,08%' },
            { code: 'M', marks: 1, text: 'R28 400 × 1,035 = R29 394' },
            { code: 'M', marks: 1, text: 'R5 082,80 ÷ R29 394 × 100%' },
            { code: 'CA', marks: 1, text: '17,29%' },
          ],
        },
        {
          id: 'ml-p1-an-4-2-4',
          label: '4.2.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: FOOD + '\nFood takes 17,08% of their income now and will take 17,29% next year.',
          prompt: 'Mr Mahlangu says their buying power will stay the same because their income is going up. Explain why he is NOT correct.',
          answer: 'Food prices rise by 4,8% but income by only 3,5%, so food takes a bigger share of income and less money is left for other things: buying power falls.',
          explanation:
            'Buying power stays the same only if income rises at least as fast as prices. Here prices rise faster (4,8% > 3,5%), so the same food takes a bigger share of income (17,29% instead of 17,08%) and the household can buy less with what is left.',
          memo: [
            { code: 'R', marks: 1, text: '4,8% is more than 3,5%' },
            { code: 'R', marks: 1, text: 'Food takes a bigger share of income' },
            { code: 'J', marks: 1, text: 'Buying power decreases' },
          ],
        },
      ],
    },
    {
      number: 5,
      title: 'Buying or renting a house, and unemployment',
      topicId: 'finance',
      marks: 30,
      items: [
        {
          id: 'ml-p1-an-5-1-1',
          label: '5.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: HOUSE,
          prompt: 'Calculate the deposit on the house.',
          answer: 'R95 000',
          explanation: '10% × R950 000 = R95 000.',
          memo: [
            { code: 'M', marks: 1, text: '10% × R950 000' },
            { code: 'A', marks: 1, text: 'R95 000' },
          ],
        },
        {
          id: 'ml-p1-an-5-1-2',
          label: '5.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: HOUSE,
          prompt: 'Calculate the total of all the bond repayments over the 20 years.',
          answer: 'R2 200 800',
          explanation: '20 years × 12 = 240 repayments. 240 × R9 170 = R2 200 800.',
          memo: [
            { code: 'M', marks: 1, text: '20 × 12 = 240' },
            { code: 'M', marks: 1, text: '240 × R9 170' },
            { code: 'CA', marks: 1, text: 'R2 200 800' },
          ],
        },
        {
          id: 'ml-p1-an-5-1-3',
          label: '5.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: HOUSE + '\nThe bond repayments add up to R2 200 800.',
          prompt: 'Calculate the total cost of buying the house, and how many times the price of the house this is. Round to two decimal places.',
          answer: 'R2 344 300, which is 2,47 times the price',
          explanation: 'Total = R95 000 + R2 200 800 + R48 500 = R2 344 300. R2 344 300 ÷ R950 000 = 2,47.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding deposit, repayments and costs' },
            { code: 'CA', marks: 1, text: 'R2 344 300' },
            { code: 'M', marks: 1, text: '÷ R950 000' },
            { code: 'CA', marks: 1, text: '2,47' },
          ],
        },
        {
          id: 'ml-p1-an-5-1-4',
          label: '5.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: HOUSE,
          prompt: 'Calculate the total rent the family will pay over the first THREE years.',
          answer: 'R297 984,96',
          explanation:
            'Year 1: R7 800 × 12 = R93 600. Year 2: R93 600 × 1,06 = R99 216. Year 3: R99 216 × 1,06 = R105 168,96. Total = R297 984,96.',
          memo: [
            { code: 'M', marks: 1, text: 'R7 800 × 12 = R93 600' },
            { code: 'M', marks: 1, text: '× 1,06 each year' },
            { code: 'CA', marks: 1, text: 'R99 216 and R105 168,96' },
            { code: 'CA', marks: 1, text: 'R297 984,96' },
          ],
        },
        {
          id: 'ml-p1-an-5-1-5',
          label: '5.1.5',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: HOUSE + '\nBuying costs R2 344 300 in total. Three years of rent cost R297 984,96.',
          prompt: 'Mrs Naidoo says they should keep renting because buying costs more than twice the price of the house. Give THREE reasons why buying could still be the better choice.',
          answer: 'After 20 years they own the house; houses usually rise in value; rent keeps rising every year while the bond repayment is fixed or changes only with the interest rate.',
          explanation:
            'Rent is money spent with nothing owned at the end, and at 6% a year it keeps growing for 20 years. Bond repayments buy an asset that usually gains value and that the family owns once the bond is paid off.',
          memo: [
            { code: 'R', marks: 1, text: 'They own the house at the end' },
            { code: 'R', marks: 1, text: 'Property usually increases in value' },
            { code: 'R', marks: 1, text: 'Rent keeps increasing every year' },
          ],
        },
        {
          id: 'ml-p1-an-5-2-1',
          label: '5.2.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: JOBS,
          prompt: 'Which province had the lowest unemployment rate?',
          answer: 'Western Cape',
          explanation: '21,9% is the lowest rate in TABLE 6.',
          memo: [{ code: 'RT', marks: 2, text: 'Western Cape' }],
        },
        {
          id: 'ml-p1-an-5-2-2',
          label: '5.2.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: JOBS,
          prompt: 'Calculate the range of the unemployment rates.',
          answer: '17,3 percentage points',
          explanation: '39,2% − 21,9% = 17,3 percentage points.',
          memo: [
            { code: 'M', marks: 1, text: '39,2 − 21,9' },
            { code: 'A', marks: 1, text: '17,3' },
          ],
        },
        {
          id: 'ml-p1-an-5-2-3',
          label: '5.2.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: JOBS,
          prompt: 'Determine the median unemployment rate, and name the province that has it.',
          answer: '34,9%, Limpopo',
          explanation: 'In order: 21,9; 28,7; 30,2; 33,4; 34,9; 35,1; 36,6; 37,8; 39,2. The 5th of 9 values is 34,9%, which is Limpopo.',
          memo: [
            { code: 'M', marks: 1, text: 'Arranging in order' },
            { code: 'M', marks: 1, text: 'Middle (5th) value' },
            { code: 'CA', marks: 1, text: '34,9%' },
            { code: 'CA', marks: 1, text: 'Limpopo' },
          ],
        },
        {
          id: 'ml-p1-an-5-2-4',
          label: '5.2.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: JOBS,
          prompt: 'Calculate the mean of the nine provincial unemployment rates. Round to two decimal places.',
          answer: '33,09%',
          explanation: 'Sum = 297,8. Mean = 297,8 ÷ 9 = 33,09%.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding all nine rates = 297,8' },
            { code: 'M', marks: 1, text: '÷ 9' },
            { code: 'CA', marks: 1, text: '33,09%' },
          ],
        },
        {
          id: 'ml-p1-an-5-2-5',
          label: '5.2.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: JOBS + '\nThe mean of the nine rates is 33,09%.',
          prompt: 'A learner says the unemployment rate for the whole country must be 33,09%. Explain why this is probably NOT correct.',
          answer: 'The provinces have very different numbers of people in the labour force, so each province should count according to its size, not equally.',
          explanation:
            'The mean of the nine rates gives every province the same weight. A province with many job seekers, such as Gauteng, affects the national rate far more than a small one, such as the Northern Cape. The national rate is total unemployed ÷ total labour force.',
          memo: [
            { code: 'R', marks: 1, text: 'Provinces have different sizes' },
            { code: 'R', marks: 1, text: 'The mean treats every province equally' },
            { code: 'J', marks: 1, text: 'Not correct' },
          ],
        },
      ],
    },
  ],
}
