import type { Paper } from './types'
import { tableContext } from '@/data/taxTables'

/**
 * Mathematical Literacy Grade 12, 2025 Paper 1 -- in the NSC format.
 *
 * WHY THIS PAPER LOOKS DIFFERENT FROM THE OTHER MAT LIT PAPERS. It was rebuilt
 * after checking the real November 2025 NSC papers, which showed the format
 * our Mat Lit papers had been written to was wrong: the NSC Grade 12 papers
 * are 150 marks and 3 hours, in FIVE questions of about 30 marks, not 100
 * marks in four. Paper 1 is Finance and Data Handling (with probability);
 * Measurement and Maps & Plans are Paper 2's. Each question is several short
 * contexts rather than one story, and the paper opens with an easy mixed
 * question -- reading a table, matching terms to definitions -- before the
 * multi-step work.
 *
 * Everything here is ORIGINAL. The structure, mark layout and kinds of
 * question mirror the real paper; the contexts, figures and wording do not,
 * because the real paper is the Department of Basic Education's copyright.
 * Figures that look like statistics (households, employment, tourism) are
 * invented for practice and are labelled as such.
 *
 * Every item carries its own table in `context`, because items are also shown
 * one at a time outside the paper (Practise, weekly tests, search), where the
 * table above them would otherwise be missing. See tools/check-orphans.mts.
 */

// ---------------------------------------------------------------- contexts

const STATIONERY =
  'TABLE 1 shows the prices of some back-to-school stationery at one shop in each of three cities.\n' +
  '|+ TABLE 1: PRICES OF STATIONERY IN THREE CITIES\n' +
  '| Item | Quantity | Pretoria | Gqeberha | Bloemfontein |\n|---|---|---|---|---|\n' +
  '| Exercise books | 10 books | R89,90 | R94,50 | R86,75 |\n' +
  '| Ballpoint pens | Box of 12 | R64,99 | R59,50 | R62,40 |\n' +
  '| Scientific calculator | 1 | R329,99 | R349,00 | R315,50 |\n' +
  '| Glue sticks | 3 | R42,50 | R39,99 | R44,20 |\n' +
  '| 30 cm ruler | 1 | R18,99 | R16,50 | R17,95 |\n' +
  '| Flip files | 5 | R74,95 | R69,99 | R79,00 |\n' +
  '| TOTAL | | ... | R629,48 | R605,80 |'

const TERMS =
  'TABLE 2 gives definitions of some terms used in Mathematical Literacy.\n' +
  '|+ TABLE 2: DEFINITIONS OF TERMS\n| Letter | Definition |\n|---|---|\n' +
  '| A | The middle value of a data set once the values are arranged in order |\n' +
  '| B | Interest calculated on the original amount only, so the same interest is added every period |\n' +
  '| C | A plan of expected income and expenditure for a period |\n' +
  '| D | The value that occurs most often in a data set |\n' +
  '| E | The general increase in the prices of goods and services over time |\n' +
  '| F | Interest calculated on the amount plus the interest already added |\n' +
  '| G | Money that comes in, such as a salary or a grant |\n' +
  '| H | The difference between the highest and the lowest value in a data set |\n' +
  'Match each term with its definition. Write only the letter (A–H).'

const HOUSEHOLDS =
  'TABLE 3 shows the number of households with internet access at home in each province. (The figures are invented for practice.)\n' +
  '|+ TABLE 3: HOUSEHOLDS WITH INTERNET ACCESS AT HOME, BY PROVINCE\n| Province | Households (thousands) |\n|---|---|\n' +
  '| Gauteng | 4 318 |\n| KwaZulu-Natal | 2 105 |\n| Western Cape | 1 766 |\n| Eastern Cape | 1 023 |\n' +
  '| Limpopo | ... |\n| Mpumalanga | 745 |\n| North West | 689 |\n| Free State | 571 |\n| Northern Cape | 214 |\n' +
  '| TOTAL | 12 243 |\n' +
  'The data was collected by asking a sample of households to complete a questionnaire.'

const PAYSLIP =
  "Sipho Ndlovu is 38 years old. An extract of his salary slip for one month of the 2025/2026 tax year is shown below; some values have been left out.\n" +
  '|+ SALARY SLIP: S NDLOVU — MONTHLY\n| Item | Amount |\n|---|---|\n' +
  '| Gross salary | R28 500,00 |\n| Pension fund (7,5% of gross salary) | P |\n| UIF | R177,12 |\n' +
  '| PAYE | T |\n| Medical aid (Sipho\'s share) | R2 180,00 |\n| NET SALARY | N |\n' +
  "Sipho's pension contribution is deducted before tax, so his monthly taxable income is his gross salary minus his pension contribution. He receives no bonus."

const TAX = PAYSLIP + '\n\n' + tableContext()

const FARES =
  'Sipho travels to work on a city bus service. TABLE 4 shows its fares.\n' +
  '|+ TABLE 4: BUS FARES\n| Fare type | Trips | Adult | Student | Pensioner (60+) |\n|---|---|---|---|---|\n' +
  '| Single trip | 1 | R16,50 | R11,00 | R6,50 |\n' +
  '| Bundle | 10 | R148,50 | – | – |\n' +
  '| Monthly pass | 40 | R540,00 | R360,00 | – |\n' +
  'A dash (–) means the fare is not offered to that category. Fares are loaded onto a travel card, which costs R25,00 once-off.'

const EMPLOYMENT =
  'TABLE 5 shows the number of people employed in six economic sectors, by gender. (The figures are invented for practice.)\n' +
  '|+ TABLE 5: EMPLOYMENT BY SECTOR AND GENDER\n| Sector | % male | Male (thousands) | % female | Female (thousands) |\n|---|---|---|---|---|\n' +
  '| Agriculture | 62% | 548 | 38% | 336 |\n| Mining | 86% | 404 | 14% | 66 |\n' +
  '| Manufacturing | 65% | 1 066 | 35% | 574 |\n| Construction | 88% | *** | 12% | 168 |\n' +
  '| Trade | 51% | 1 714 | 49% | 1 647 |\n| Community services | 39% | 1 407 | 61% | 2 201 |'

const SOLAR =
  'TABLE 6 shows the number of rooftop solar installations in five provinces over three years. (The figures are invented for practice.)\n' +
  '|+ TABLE 6: ROOFTOP SOLAR INSTALLATIONS (THOUSANDS)\n| Province | 2022 | 2023 | 2024 |\n|---|---|---|---|\n' +
  '| Gauteng | 18,4 | 26,9 | 31,2 |\n| Western Cape | 21,6 | 29,8 | 33,5 |\n| KwaZulu-Natal | 9,7 | 14,2 | 18,6 |\n' +
  '| Limpopo | 4,8 | 7,5 | 9,6 |\n| Free State | 5,1 | 7,5 | 8,9 |'

const TENTS =
  'Busi rents out party tents. Her charges are:\n' +
  '• R800 refundable deposit per tent, returned if the tent comes back on time and undamaged\n' +
  '• R450 per day for a small tent\n' +
  '• R650 per day for a large tent\n' +
  '|+ TABLE 7: COST OF HIRING ONE TENT, DEPOSIT INCLUDED\n| Number of days | 1 | 2 | 4 | 6 | 8 |\n|---|---|---|---|---|---|\n' +
  '| Small tent | R1 250 | R1 700 | B | R3 500 | R4 400 |\n' +
  '| Large tent | R1 450 | R2 100 | R3 400 | R4 700 | R6 000 |'

const TOURISM =
  'TABLE 8 shows the number of foreign tourists who visited South Africa in one year, and how much they spent, by the region they came from. (The figures are invented for practice.)\n' +
  '|+ TABLE 8: FOREIGN TOURISTS AND THEIR SPENDING, BY REGION\n| Region | Tourists (thousands) | Total spent (R million) | Average spent per tourist (R) |\n|---|---|---|---|\n' +
  '| Africa (by land) | 5 840 | 17 520 | 3 000 |\n| Europe | 1 420 | 25 560 | 18 000 |\n| North America | 512 | 10 752 | 21 000 |\n' +
  '| Asia | 298 | 4 781 | V |\n| Australasia | 146 | 3 358 | 23 000 |\n| Middle East | 64 | 1 664 | 26 000 |\n' +
  '| Central and South America | 118 | 2 360 | 20 000 |'

const CONTRACT =
  'Lerato is moving to Dubai for two years and must choose a cellphone contract there. Prices are in UAE dirham (AED).\n' +
  '|+ TABLE 9: TWO CELLPHONE CONTRACT OPTIONS\n| Detail | Option A | Option B |\n|---|---|---|\n' +
  '| Contract period | 24 months | 24 months |\n| Once-off connection fee | AED 149 | AED 0 |\n' +
  '| Monthly subscription | AED 199 | AED 229 |\n| Monthly phone insurance | AED 25 | Included |\n' +
  'NOTE: All amounts EXCLUDE value-added tax, which is 5% in the UAE.'

const EXCHANGE =
  '|+ TABLE 10: EXCHANGE RATES\n| Currency | Rand per unit | Units per rand |\n|---|---|---|\n' +
  '| UAE dirham (AED) | 4,92 | 0,203 |\n| British pound (£) | 23,20 | 0,043 |'

const DIESEL =
  "Kagiso delivers bread in a bakkie with an 80 ℓ diesel tank.\n" +
  '|+ TABLE 11: INFLATION RATE AND DIESEL PRICE, JANUARY TO APRIL 2025 (figures invented for practice)\n| Month | Inflation rate (%) | Diesel price per litre |\n|---|---|---|\n' +
  '| January | 3,2 | R21,26 |\n| February | 3,2 | R20,55 |\n| March | C | R21,10 |\n| April | 2,8 | R20,87 |\n' +
  'The mean inflation rate over the four months was 3,2%.'

// ---------------------------------------------------------------- paper

export const matLitG12P1Y2025: Paper = {
  id: 'ml-p1-2025',
  subjectId: 'mat-lit',
  paperNumber: 1,
  grade: 12,
  kind: 'past',
  year: 2025,
  title: '2025 Paper 1',
  durationMinutes: 180,
  totalMarks: 150,
  sections: [
    {
      number: 1,
      title: 'Stationery prices, finance terms and internet access',
      topicId: 'finance',
      marks: 30,
      items: [
        {
          id: 'ml-p1-25n-1-1-1',
          label: '1.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: STATIONERY,
          prompt: 'Name the city where the scientific calculator is the cheapest.',
          answer: 'Bloemfontein (R315,50)',
          explanation: 'Compare the three calculator prices: R329,99, R349,00 and R315,50. The lowest is Bloemfontein.',
          memo: [
            { code: 'RT', marks: 1, text: 'Reading the three calculator prices' },
            { code: 'A', marks: 1, text: 'Bloemfontein' },
          ],
        },
        {
          id: 'ml-p1-25n-1-1-2',
          label: '1.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: STATIONERY,
          prompt: 'Calculate the price of ONE exercise book in Pretoria.',
          answer: 'R8,99',
          explanation: 'Ten books cost R89,90, so one costs R89,90 ÷ 10 = R8,99.',
          memo: [
            { code: 'M', marks: 1, text: 'Dividing R89,90 by 10' },
            { code: 'A', marks: 1, text: 'R8,99' },
          ],
        },
        {
          id: 'ml-p1-25n-1-1-3',
          label: '1.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: STATIONERY,
          prompt:
            'Determine, as a unit ratio rounded to THREE decimal places, the price of the calculator in Gqeberha compared to its price in Bloemfontein, in the form 1 : ...',
          answer: '1 : 0,904',
          explanation:
            'Gqeberha : Bloemfontein = R349,00 : R315,50. Divide both sides by 349,00 to make the first term 1: 1 : 315,50 ÷ 349,00 = 1 : 0,904.',
          memo: [
            { code: 'RT', marks: 1, text: 'R349,00 : R315,50 in the correct order' },
            { code: 'M', marks: 1, text: 'Dividing both terms by 349,00' },
            { code: 'A', marks: 1, text: '1 : 0,904' },
          ],
        },
        {
          id: 'ml-p1-25n-1-1-4',
          label: '1.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: STATIONERY,
          prompt: 'Calculate the TOTAL price of all the items in Pretoria.',
          answer: 'R621,32',
          explanation: 'R89,90 + R64,99 + R329,99 + R42,50 + R18,99 + R74,95 = R621,32.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding all six Pretoria prices' },
            { code: 'A', marks: 1, text: 'R621,32' },
          ],
        },
        {
          id: 'ml-p1-25n-1-2-1',
          label: '1.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TERMS,
          prompt: 'Which letter matches the term SIMPLE INTEREST?',
          options: [
            { id: 'a', label: 'B' },
            { id: 'b', label: 'E' },
            { id: 'c', label: 'F' },
            { id: 'd', label: 'G' },
          ],
          correctOptionId: 'a',
          answer: 'B',
          explanation: 'Simple interest is worked out on the original amount only, so it is the same every period. F describes compound interest.',
        },
        {
          id: 'ml-p1-25n-1-2-2',
          label: '1.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TERMS,
          prompt: 'Which letter matches the term BUDGET?',
          options: [
            { id: 'a', label: 'G' },
            { id: 'b', label: 'C' },
            { id: 'c', label: 'E' },
            { id: 'd', label: 'A' },
          ],
          correctOptionId: 'b',
          answer: 'C',
          explanation: 'A budget is a plan of expected income and expenditure. G is income on its own, not a plan.',
        },
        {
          id: 'ml-p1-25n-1-2-3',
          label: '1.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TERMS,
          prompt: 'Which letter matches the term INFLATION?',
          options: [
            { id: 'a', label: 'F' },
            { id: 'b', label: 'H' },
            { id: 'c', label: 'E' },
            { id: 'd', label: 'C' },
          ],
          correctOptionId: 'c',
          answer: 'E',
          explanation: 'Inflation is the general rise in prices over time.',
        },
        {
          id: 'ml-p1-25n-1-2-4',
          label: '1.2.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TERMS,
          prompt: 'Which letter matches the term MEDIAN?',
          options: [
            { id: 'a', label: 'D' },
            { id: 'b', label: 'A' },
            { id: 'c', label: 'H' },
            { id: 'd', label: 'B' },
          ],
          correctOptionId: 'b',
          answer: 'A',
          explanation: 'The median is the middle value once the data is in order. D is the mode and H the range.',
        },
        {
          id: 'ml-p1-25n-1-3-1',
          label: '1.3.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: HOUSEHOLDS,
          prompt: 'Write down the province with the SECOND lowest number of households with internet access.',
          answer: 'Free State (571 thousand)',
          explanation: 'The lowest is the Northern Cape (214 thousand); the next lowest is the Free State (571 thousand).',
          memo: [
            { code: 'RT', marks: 1, text: 'Identifying the Northern Cape as the lowest' },
            { code: 'A', marks: 1, text: 'Free State' },
          ],
        },
        {
          id: 'ml-p1-25n-1-3-2',
          label: '1.3.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: HOUSEHOLDS,
          prompt: 'State whether the number of households represents DISCRETE or CONTINUOUS data.',
          options: [
            { id: 'a', label: 'Discrete' },
            { id: 'b', label: 'Continuous' },
          ],
          correctOptionId: 'a',
          answer: 'Discrete',
          explanation: 'Households are counted in whole numbers — there is no such thing as half a household — so the data is discrete.',
        },
        {
          id: 'ml-p1-25n-1-3-3',
          label: '1.3.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: HOUSEHOLDS,
          prompt: 'Name the type of data-collection instrument that was used.',
          answer: 'A questionnaire',
          explanation: 'The note under the table says households completed a questionnaire.',
          memo: [
            { code: 'RT', marks: 1, text: 'Using the note under the table' },
            { code: 'A', marks: 1, text: 'Questionnaire' },
          ],
        },
        {
          id: 'ml-p1-25n-1-3-4',
          label: '1.3.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: HOUSEHOLDS,
          prompt: 'Determine the missing number of households for Limpopo.',
          answer: '812 thousand',
          explanation:
            'Add the eight known provinces: 4 318 + 2 105 + 1 766 + 1 023 + 745 + 689 + 571 + 214 = 11 431. Limpopo = 12 243 − 11 431 = 812 thousand.',
          memo: [
            { code: 'M', marks: 1, text: 'Subtracting the sum of the other provinces from the total' },
            { code: 'A', marks: 1, text: '812 thousand' },
          ],
        },
        {
          id: 'ml-p1-25n-1-3-5',
          label: '1.3.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: HOUSEHOLDS,
          prompt:
            'The number of households in Gauteng is four million three hundred and eighteen thousand. Write this number in numerals.',
          answer: '4 318 000',
          explanation: 'Four million = 4 000 000; three hundred and eighteen thousand = 318 000. Together: 4 318 000.',
          memo: [
            { code: 'M', marks: 1, text: 'Millions and thousands in the correct places' },
            { code: 'A', marks: 1, text: '4 318 000' },
          ],
        },
        {
          id: 'ml-p1-25n-1-3-6',
          label: '1.3.6',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: HOUSEHOLDS,
          prompt: 'Express the number of households with internet access in the Western Cape as a percentage of the total.',
          answer: '≈ 14,4%',
          explanation: '1 766 ÷ 12 243 × 100 = 14,42…% ≈ 14,4%.',
          memo: [
            { code: 'RT', marks: 1, text: '1 766 and 12 243' },
            { code: 'M', marks: 1, text: 'Dividing and multiplying by 100' },
            { code: 'A', marks: 1, text: '14,4%' },
          ],
        },
      ],
    },
    {
      number: 2,
      title: 'A salary slip, income tax and bus fares',
      topicId: 'finance',
      marks: 32,
      items: [
        {
          id: 'ml-p1-25n-2-1-1',
          label: '2.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: PAYSLIP,
          prompt: 'Write the acronym PAYE in words.',
          answer: 'Pay As You Earn',
          explanation: 'PAYE is income tax that the employer deducts from each salary and pays to SARS on the employee’s behalf.',
          memo: [{ code: 'A', marks: 2, text: 'Pay As You Earn' }],
        },
        {
          id: 'ml-p1-25n-2-1-2',
          label: '2.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: PAYSLIP,
          prompt: "Calculate Sipho's monthly pension fund contribution, P.",
          answer: 'P = R2 137,50',
          explanation: '7,5% of R28 500 = 0,075 × 28 500 = R2 137,50.',
          memo: [
            { code: 'M', marks: 1, text: '7,5% × R28 500' },
            { code: 'A', marks: 1, text: 'R2 137,50' },
          ],
        },
        {
          id: 'ml-p1-25n-2-1-3',
          label: '2.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: PAYSLIP,
          prompt:
            "Sipho's share of R2 180,00 is 60% of the total monthly medical aid contribution; his employer pays the other 40%. Calculate the employer's contribution.",
          answer: 'R1 453,33',
          explanation: 'Total contribution = R2 180,00 ÷ 0,6 = R3 633,33. Employer = 40% × R3 633,33 = R1 453,33.',
          memo: [
            { code: 'M', marks: 1, text: 'Dividing R2 180 by 60% to find the total' },
            { code: 'M', marks: 1, text: 'Taking 40% of the total' },
            { code: 'CA', marks: 1, text: 'R1 453,33' },
          ],
        },
        {
          id: 'ml-p1-25n-2-1-4a',
          label: '2.1.4(a)',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: TAX,
          prompt: "Show that Sipho's ANNUAL taxable income is R316 350.",
          answer: 'Monthly taxable = R28 500 − R2 137,50 = R26 362,50; annual = R26 362,50 × 12 = R316 350.',
          explanation: 'The pension contribution comes off before tax, and the tax table is annual, so the monthly figure is multiplied by 12.',
          memo: [
            { code: 'M', marks: 1, text: 'Subtracting the pension contribution from the gross salary' },
            { code: 'M', marks: 1, text: 'Multiplying by 12 to reach R316 350' },
          ],
        },
        {
          id: 'ml-p1-25n-2-1-4b',
          label: '2.1.4(b)',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 6,
          context: TAX,
          prompt: 'Sipho\'s annual taxable income is R316 350. Use the tax table to calculate his MONTHLY PAYE, T.',
          answer:
            'Bracket R237 101 – R370 500. Tax = R42 678 + 26% × (R316 350 − R237 100) = R42 678 + 0,26 × R79 250 = R42 678 + R20 605 = R63 283. Less the primary rebate: R63 283 − R17 235 = R46 048 a year. Monthly: R46 048 ÷ 12 = R3 837,33.',
          explanation:
            'Choose the bracket first, then apply its rate only to the income ABOVE the bracket’s starting point. Sipho is under 65, so only the primary rebate applies. The table and rebate are annual, so divide by 12 last.',
          memo: [
            { code: 'RT', marks: 1, text: 'Selecting the R237 101 – R370 500 bracket' },
            { code: 'SF', marks: 1, text: 'R42 678 + 26% × (R316 350 − R237 100)' },
            { code: 'CA', marks: 1, text: 'R63 283 before rebates' },
            { code: 'M', marks: 1, text: 'Subtracting the primary rebate of R17 235' },
            { code: 'M', marks: 1, text: 'Dividing the annual tax by 12' },
            { code: 'CA', marks: 1, text: 'R3 837,33' },
          ],
        },
        {
          id: 'ml-p1-25n-2-1-4c',
          label: '2.1.4(c)',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 5,
          context: PAYSLIP + '\nSipho\'s pension contribution is R2 137,50 and his monthly PAYE is R3 837,33.',
          prompt: 'Sipho says his net salary is more than R22 000 a month. Verify, showing ALL calculations, whether his statement is VALID.',
          answer:
            'Deductions = R2 137,50 + R177,12 + R3 837,33 + R2 180,00 = R8 331,95. Net salary = R28 500,00 − R8 331,95 = R20 168,05. This is LESS than R22 000, so his statement is NOT valid.',
          explanation:
            'Net salary is what is left after EVERY deduction, including his share of medical aid. The employer’s medical-aid contribution is not taken from his salary, so it is not subtracted.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding all four deductions' },
            { code: 'CA', marks: 1, text: 'R8 331,95' },
            { code: 'M', marks: 1, text: 'Subtracting the deductions from the gross salary' },
            { code: 'CA', marks: 1, text: 'R20 168,05' },
            { code: 'J', marks: 1, text: 'NOT valid: R20 168,05 is less than R22 000' },
          ],
        },
        {
          id: 'ml-p1-25n-2-2-1',
          label: '2.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: FARES,
          prompt: 'Calculate the percentage a pensioner saves on a single trip compared to an adult.',
          answer: '≈ 60,6%',
          explanation: 'Saving = R16,50 − R6,50 = R10,00. As a percentage of the adult fare: R10,00 ÷ R16,50 × 100 = 60,6%.',
          memo: [
            { code: 'M', marks: 1, text: 'Difference R10,00' },
            { code: 'M', marks: 1, text: 'Dividing by the ADULT fare and multiplying by 100' },
            { code: 'A', marks: 1, text: '60,6%' },
          ],
        },
        {
          id: 'ml-p1-25n-2-2-2',
          label: '2.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 5,
          context: FARES,
          prompt:
            'Sipho, an adult, makes 44 trips a month. Determine the cheapest way for him to pay for 44 trips, and how much it saves compared with paying a single fare for every trip.',
          answer:
            'All singles: 44 × R16,50 = R726,00. Four bundles + 4 singles: 4 × R148,50 + 4 × R16,50 = R660,00. Monthly pass + 4 singles: R540,00 + 4 × R16,50 = R606,00. The cheapest is a monthly pass plus 4 single trips, saving R726,00 − R606,00 = R120,00.',
          explanation:
            'The monthly pass covers 40 trips, so the extra 4 have to be paid some other way — here singles, since a whole bundle of 10 would cost more than 4 singles.',
          memo: [
            { code: 'M', marks: 1, text: 'Cost of 44 single trips: R726,00' },
            { code: 'M', marks: 1, text: 'Cost of at least one other combination' },
            { code: 'CA', marks: 1, text: 'Monthly pass + 4 singles: R606,00' },
            { code: 'J', marks: 1, text: 'Choosing the monthly pass + 4 singles as cheapest' },
            { code: 'CA', marks: 1, text: 'Saving R120,00' },
          ],
        },
        {
          id: 'ml-p1-25n-2-2-3',
          label: '2.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: FARES,
          prompt: 'Write down the probability that a student buys a 10-trip bundle.',
          answer: '0 (impossible)',
          explanation: 'The table shows a dash for students under “Bundle”: the bundle is not offered to students, so it cannot happen.',
          memo: [
            { code: 'RT', marks: 1, text: 'Reading the dash in the Student column' },
            { code: 'A', marks: 1, text: '0 / impossible' },
          ],
        },
        {
          id: 'ml-p1-25n-2-2-4',
          label: '2.2.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: FARES,
          prompt:
            'A new adult passenger pays R400,00 in total for a travel card with single-trip fares loaded on it. Calculate the maximum number of single trips they can take.',
          answer: '22 trips',
          explanation: 'R400,00 − R25,00 for the card = R375,00. R375,00 ÷ R16,50 = 22,7, so only 22 whole trips.',
          memo: [
            { code: 'M', marks: 1, text: 'Subtracting the R25 card and dividing by R16,50' },
            { code: 'A', marks: 1, text: '22 trips (rounded DOWN)' },
          ],
        },
      ],
    },
    {
      number: 3,
      title: 'Employment by gender and rooftop solar',
      topicId: 'data-handling',
      marks: 30,
      items: [
        {
          id: 'ml-p1-25n-3-1-1',
          label: '3.1.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: EMPLOYMENT,
          prompt: 'Calculate the median percentage of male workers across the six sectors.',
          answer: '63,5%',
          explanation: 'In order: 39; 51; 62; 65; 86; 88. There are six values, so the median is the mean of the 3rd and 4th: (62 + 65) ÷ 2 = 63,5%.',
          memo: [
            { code: 'M', marks: 1, text: 'Arranging the six percentages in order' },
            { code: 'M', marks: 1, text: 'Identifying the two middle values, 62 and 65' },
            { code: 'M', marks: 1, text: 'Finding their mean' },
            { code: 'A', marks: 1, text: '63,5%' },
          ],
        },
        {
          id: 'ml-p1-25n-3-1-2',
          label: '3.1.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: EMPLOYMENT,
          prompt: 'Determine, as a decimal, the probability of randomly choosing a sector in which there were MORE female workers than male workers.',
          answer: '≈ 0,17',
          explanation: 'Only Community services has more women (61%) than men. Probability = 1 ÷ 6 = 0,166… ≈ 0,17.',
          memo: [
            { code: 'RT', marks: 1, text: 'Identifying Community services as the only such sector' },
            { code: 'M', marks: 1, text: '1 out of 6 sectors' },
            { code: 'A', marks: 1, text: '0,17' },
          ],
        },
        {
          id: 'ml-p1-25n-3-1-3a',
          label: '3.1.3(a)',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: EMPLOYMENT,
          prompt: 'Determine the TOTAL number of people employed in Construction.',
          answer: '1 400 thousand (1 400 000)',
          explanation: 'Women are 12% of Construction workers and there are 168 thousand of them, so the total is 168 ÷ 0,12 = 1 400 thousand.',
          memo: [
            { code: 'M', marks: 1, text: '168 ÷ 12%' },
            { code: 'A', marks: 1, text: '1 400 thousand' },
          ],
        },
        {
          id: 'ml-p1-25n-3-1-3b',
          label: '3.1.3(b)',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 4,
          context: EMPLOYMENT + '\n1 400 thousand people are employed in Construction.',
          prompt:
            'Thabo says that in Construction there are 1 064 000 more men employed than women. Verify, showing ALL calculations, whether his statement is VALID.',
          answer:
            'Men = 1 400 − 168 = 1 232 thousand. Difference = 1 232 − 168 = 1 064 thousand = 1 064 000. His statement is VALID.',
          explanation: 'The male figure is missing from the table, so it has to be found from the total before the difference can be checked.',
          memo: [
            { code: 'M', marks: 1, text: 'Male workers = total − female' },
            { code: 'CA', marks: 1, text: '1 232 thousand' },
            { code: 'CA', marks: 1, text: 'Difference 1 064 thousand' },
            { code: 'J', marks: 1, text: 'VALID' },
          ],
        },
        {
          id: 'ml-p1-25n-3-2-1',
          label: '3.2.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: SOLAR,
          prompt: 'Name the type of graph that would best compare the three years side by side for each province.',
          options: [
            { id: 'a', label: 'Pie chart' },
            { id: 'b', label: 'Multiple (compound) bar graph' },
            { id: 'c', label: 'Histogram' },
            { id: 'd', label: 'Scatter plot' },
          ],
          correctOptionId: 'b',
          answer: 'Multiple (compound) bar graph',
          explanation: 'Three bars per province, one for each year, show the comparison directly. A pie chart shows parts of one whole, not change over years.',
        },
        {
          id: 'ml-p1-25n-3-2-2a',
          label: '3.2.2(a)',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: SOLAR,
          prompt: 'Write down the names of the TWO provinces that had the same number of installations in 2023.',
          answer: 'Limpopo and Free State (7,5 thousand each)',
          explanation: 'Read down the 2023 column: Limpopo and the Free State both show 7,5.',
          memo: [
            { code: 'RT', marks: 1, text: 'Limpopo' },
            { code: 'RT', marks: 1, text: 'Free State' },
          ],
        },
        {
          id: 'ml-p1-25n-3-2-2b',
          label: '3.2.2(b)',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: SOLAR,
          prompt: 'Calculate the percentage increase in the number of installations in Limpopo from 2022 to 2024.',
          answer: '100%',
          explanation: 'Increase = 9,6 − 4,8 = 4,8 thousand. As a percentage of the 2022 figure: 4,8 ÷ 4,8 × 100 = 100% — the number doubled.',
          memo: [
            { code: 'M', marks: 1, text: 'Increase 9,6 − 4,8' },
            { code: 'M', marks: 1, text: 'Dividing by the ORIGINAL (2022) value × 100' },
            { code: 'A', marks: 1, text: '100%' },
          ],
        },
        {
          id: 'ml-p1-25n-3-2-2c',
          label: '3.2.2(c)',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: SOLAR,
          prompt: 'Calculate the range of the number of installations in the five provinces in 2022.',
          answer: '16,8 thousand',
          explanation: 'Highest 2022 value (Western Cape, 21,6) minus lowest (Limpopo, 4,8) = 16,8 thousand.',
          memo: [
            { code: 'RT', marks: 1, text: '21,6 and 4,8' },
            { code: 'A', marks: 1, text: '16,8 thousand' },
          ],
        },
        {
          id: 'ml-p1-25n-3-2-3',
          label: '3.2.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: SOLAR,
          prompt: 'Calculate the mean number of installations per year in Gauteng over the three years.',
          answer: '25,5 thousand',
          explanation: '(18,4 + 26,9 + 31,2) ÷ 3 = 76,5 ÷ 3 = 25,5 thousand.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding the three Gauteng values' },
            { code: 'M', marks: 1, text: 'Dividing by 3' },
            { code: 'A', marks: 1, text: '25,5 thousand' },
          ],
        },
        {
          id: 'ml-p1-25n-3-2-4',
          label: '3.2.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: SOLAR,
          prompt:
            'Determine, as a fraction, the probability of randomly choosing a province that had FEWER than 60 thousand installations in total over the three years.',
          answer: '3/5',
          explanation:
            'Totals: Gauteng 76,5; Western Cape 84,9; KwaZulu-Natal 42,5; Limpopo 21,9; Free State 21,5. Three of the five are below 60, so P = 3/5.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding the three years for each province' },
            { code: 'A', marks: 1, text: 'Correct totals' },
            { code: 'M', marks: 1, text: 'Counting the provinces below 60 thousand' },
            { code: 'CA', marks: 1, text: '3/5' },
          ],
        },
        {
          id: 'ml-p1-25n-3-2-5',
          label: '3.2.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 1,
          context: SOLAR,
          prompt: 'Describe the trend in the number of installations in the Western Cape from 2022 to 2024.',
          answer: 'It increased every year (from 21,6 to 29,8 to 33,5 thousand).',
          explanation: 'A trend describes the direction of change over time. Every year was higher than the one before, though the rise slowed in 2024.',
          memo: [{ code: 'J', marks: 1, text: 'Increasing every year' }],
        },
      ],
    },
    {
      number: 4,
      title: 'Tent hire and tourist spending',
      topicId: 'finance',
      marks: 28,
      items: [
        {
          id: 'ml-p1-25n-4-1-1',
          label: '4.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: TENTS,
          prompt: 'Write down a formula to calculate the cost, deposit included, of hiring ONE LARGE tent, in the form Cost = ...',
          answer: 'Cost = R800 + R650 × number of days',
          explanation: 'The deposit is paid once, whatever the number of days; the daily rate is paid for every day.',
          memo: [
            { code: 'A', marks: 1, text: 'R800 fixed amount' },
            { code: 'A', marks: 1, text: '+ R650 × number of days' },
          ],
        },
        {
          id: 'ml-p1-25n-4-1-2',
          label: '4.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TENTS,
          prompt: 'Calculate the missing value B.',
          answer: 'B = R2 600',
          explanation: 'Small tent for 4 days: R800 + R450 × 4 = R800 + R1 800 = R2 600.',
          memo: [
            { code: 'SF', marks: 1, text: 'R800 + R450 × 4' },
            { code: 'A', marks: 1, text: 'R2 600' },
          ],
        },
        {
          id: 'ml-p1-25n-4-1-3a',
          label: '4.1.3(a)',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 5,
          context:
            TENTS + '\nOn one Saturday Busi hired out THREE small and FOUR large tents, each for one day. One large tent came back a day late, and she kept one extra day\'s rent out of its deposit before refunding the rest. All the other deposits were refunded in full.',
          prompt: 'Busi says her income for that hire, after refunding the deposits, was R4 750. Verify, showing ALL calculations, whether her statement is VALID.',
          answer:
            'Rent for one day: 3 × R450 + 4 × R650 = R1 350 + R2 600 = R3 950. Extra day kept from the late tent’s deposit: R650. Income = R3 950 + R650 = R4 600. Her statement is NOT valid — her income was R4 600, R150 less than she said.',
          explanation:
            'Deposits are not income: they are held and refunded. Only the part of the deposit she kept (one day’s rent) counts as income.',
          memo: [
            { code: 'M', marks: 1, text: 'Rent for the small tents: 3 × R450' },
            { code: 'M', marks: 1, text: 'Rent for the large tents: 4 × R650' },
            { code: 'M', marks: 1, text: 'Adding the R650 kept for the late day' },
            { code: 'CA', marks: 1, text: 'R4 600' },
            { code: 'J', marks: 1, text: 'NOT valid' },
          ],
        },
        {
          id: 'ml-p1-25n-4-1-3b',
          label: '4.1.3(b)',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context:
            TENTS + '\nA different tent came back with a torn side panel. The repair quotation was:\n• Canvas patch kit: R185\n• Labour: R320 per hour or part of an hour\n• Time needed: 2 hours 10 minutes',
          prompt: 'Verify, showing ALL calculations, whether the R800 deposit is enough to cover the whole repair.',
          answer:
            '2 hours 10 minutes is charged as 3 hours ("or part of an hour"). Labour = 3 × R320 = R960. Total = R960 + R185 = R1 145. The deposit of R800 is NOT enough; it is R345 short.',
          explanation: '“Per hour or part thereof” means any started hour is charged in full, so 2 h 10 min rounds UP to 3 hours.',
          memo: [
            { code: 'M', marks: 1, text: 'Rounding 2 h 10 min up to 3 hours' },
            { code: 'M', marks: 1, text: 'Labour 3 × R320 plus the R185 kit' },
            { code: 'CA', marks: 1, text: 'R1 145' },
            { code: 'J', marks: 1, text: 'NOT enough' },
          ],
        },
        {
          id: 'ml-p1-25n-4-2-1',
          label: '4.2.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: TOURISM,
          prompt: 'Determine, rounded to the nearest thousand rand, the missing value V.',
          answer: 'V ≈ R16 000',
          explanation:
            'Average per tourist = total spent ÷ number of tourists = R4 781 000 000 ÷ 298 000 = R16 043,62 ≈ R16 000. (Mind the units: R million and thousands.)',
          memo: [
            { code: 'C', marks: 1, text: 'Converting R million and thousands to full numbers' },
            { code: 'M', marks: 1, text: 'Dividing total spent by number of tourists' },
            { code: 'A', marks: 1, text: 'R16 000' },
          ],
        },
        {
          id: 'ml-p1-25n-4-2-2',
          label: '4.2.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TOURISM,
          prompt: 'Write down the region that had the SECOND largest number of tourists.',
          answer: 'Europe (1 420 thousand)',
          explanation: 'The largest is Africa by land (5 840 thousand); the second largest is Europe.',
          memo: [
            { code: 'RT', marks: 1, text: 'Ordering the tourist numbers' },
            { code: 'A', marks: 1, text: 'Europe' },
          ],
        },
        {
          id: 'ml-p1-25n-4-2-3',
          label: '4.2.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: TOURISM,
          prompt: 'Calculate the mean total amount spent per region, in R million.',
          answer: '≈ R9 427,86 million',
          explanation: '17 520 + 25 560 + 10 752 + 4 781 + 3 358 + 1 664 + 2 360 = 65 995. Mean = 65 995 ÷ 7 = R9 427,86 million.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding the seven totals' },
            { code: 'M', marks: 1, text: 'Dividing by 7' },
            { code: 'A', marks: 1, text: 'R9 427,86 million' },
          ],
        },
        {
          id: 'ml-p1-25n-4-2-4a',
          label: '4.2.4(a)',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TOURISM,
          prompt: 'Arrange the numbers of tourists (in thousands) in ASCENDING order.',
          answer: '64; 118; 146; 298; 512; 1 420; 5 840',
          explanation: 'Ascending means from smallest to largest.',
          memo: [{ code: 'A', marks: 2, text: 'All seven values in the correct order' }],
        },
        {
          id: 'ml-p1-25n-4-2-4b',
          label: '4.2.4(b)',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context:
            TOURISM + '\nIn ascending order the numbers of tourists (thousands) are 64; 118; 146; 298; 512; 1 420; 5 840. The lower quartile (Q1) is 118 thousand.',
          prompt: 'Determine the upper quartile (Q3), and then calculate the interquartile range (IQR = Q3 − Q1) of the numbers of tourists.',
          answer: 'Q3 = 1 420 thousand; IQR = 1 420 − 118 = 1 302 thousand',
          explanation:
            'The median is the 4th of 7 values (298). Q3 is the middle of the upper three values (512; 1 420; 5 840), which is 1 420. IQR = 1 420 − 118 = 1 302 thousand.',
          memo: [
            { code: 'A', marks: 1, text: 'Q3 = 1 420' },
            { code: 'SF', marks: 1, text: '1 420 − 118' },
            { code: 'CA', marks: 1, text: '1 302 thousand' },
          ],
        },
        {
          id: 'ml-p1-25n-4-2-5',
          label: '4.2.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 2,
          context: TOURISM,
          prompt: 'Explain why the MEAN number of tourists per region is not a good measure of a typical region in this table.',
          answer:
            'Africa (by land), with 5 840 thousand tourists, is far larger than every other region. It pulls the mean up well above most regions, so the median (298 thousand) describes a typical region better.',
          explanation: 'The mean is sensitive to an extreme value (an outlier); the median is not.',
          memo: [
            { code: 'R', marks: 1, text: 'Naming the extreme value (Africa by land)' },
            { code: 'J', marks: 1, text: 'It distorts the mean; the median is more typical' },
          ],
        },
      ],
    },
    {
      number: 5,
      title: 'A contract abroad, inflation and diesel prices',
      topicId: 'finance',
      marks: 30,
      items: [
        {
          id: 'ml-p1-25n-5-1-1',
          label: '5.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CONTRACT,
          prompt: 'Calculate the total phone insurance paid over the contract period for OPTION A, excluding VAT.',
          answer: 'AED 600',
          explanation: '24 months × AED 25 = AED 600.',
          memo: [
            { code: 'M', marks: 1, text: '24 × AED 25' },
            { code: 'A', marks: 1, text: 'AED 600' },
          ],
        },
        {
          id: 'ml-p1-25n-5-1-2a',
          label: '5.1.2(a)',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: CONTRACT,
          prompt: 'Give ONE possible reason why Lerato might choose OPTION B.',
          answer: 'Any one: there is no connection fee to pay up front; insurance is included; the monthly amount is fixed with nothing extra to add.',
          explanation: 'Option B costs more per month but asks for nothing at the start, which matters when moving countries and money is tight.',
          memo: [{ code: 'J', marks: 2, text: 'Any valid reason' }],
        },
        {
          id: 'ml-p1-25n-5-1-2b',
          label: '5.1.2(b)',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: CONTRACT,
          prompt: 'Calculate the total amount, INCLUDING VAT, that Lerato would pay over the whole contract for OPTION A.',
          answer: 'AED 5 801,25',
          explanation:
            'Monthly = AED 199 + AED 25 = AED 224. Over 24 months = AED 5 376. Add the connection fee: AED 5 376 + AED 149 = AED 5 525. Add 5% VAT: AED 5 525 × 1,05 = AED 5 801,25.',
          memo: [
            { code: 'M', marks: 1, text: 'Monthly total including insurance: AED 224' },
            { code: 'M', marks: 1, text: '× 24 months' },
            { code: 'M', marks: 1, text: 'Adding the connection fee' },
            { code: 'M', marks: 1, text: 'Adding 5% VAT' },
            { code: 'CA', marks: 1, text: 'AED 5 801,25' },
          ],
        },
        {
          id: 'ml-p1-25n-5-1-2c',
          label: '5.1.2(c)',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: CONTRACT + '\nOver the whole contract, Option A costs AED 5 801,25 including VAT.',
          prompt: 'Determine which option is cheaper over the whole contract, including VAT, and by how much.',
          answer: 'Option B: 24 × AED 229 × 1,05 = AED 5 770,80. Option B is cheaper by AED 5 801,25 − AED 5 770,80 = AED 30,45.',
          explanation: 'Compare like with like: both totals must include VAT and cover the full 24 months.',
          memo: [
            { code: 'M', marks: 1, text: 'Option B total including VAT' },
            { code: 'CA', marks: 1, text: 'AED 5 770,80' },
            { code: 'CA', marks: 1, text: 'Option B, cheaper by AED 30,45' },
          ],
        },
        {
          id: 'ml-p1-25n-5-1-3',
          label: '5.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: CONTRACT + '\n' + EXCHANGE,
          prompt:
            "Lerato's mother in South Africa offers to pay the connection fee and the FIRST month of Option A (subscription and insurance), including VAT. Calculate this amount in rand.",
          answer: '≈ R1 926,92',
          explanation: 'AED 149 + AED 199 + AED 25 = AED 373. With VAT: AED 373 × 1,05 = AED 391,65. In rand: 391,65 × 4,92 = R1 926,92.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding the connection fee and the first month' },
            { code: 'M', marks: 1, text: 'Adding 5% VAT: AED 391,65' },
            { code: 'M', marks: 1, text: 'Multiplying by R4,92 (rand per dirham)' },
            { code: 'CA', marks: 1, text: 'R1 926,92' },
          ],
        },
        {
          id: 'ml-p1-25n-5-2-1',
          label: '5.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: DIESEL,
          prompt: 'Calculate the missing inflation rate C for March.',
          answer: 'C = 3,6%',
          explanation: 'Mean 3,2% over 4 months means the four rates add up to 3,2 × 4 = 12,8. C = 12,8 − (3,2 + 3,2 + 2,8) = 12,8 − 9,2 = 3,6%.',
          memo: [
            { code: 'M', marks: 1, text: 'Total of the four rates: 3,2 × 4 = 12,8' },
            { code: 'M', marks: 1, text: 'Subtracting the three known rates' },
            { code: 'A', marks: 1, text: '3,6%' },
          ],
        },
        {
          id: 'ml-p1-25n-5-2-2',
          label: '5.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 5,
          context: DIESEL,
          prompt:
            'Kagiso says a full tank of diesel cost R40 more in March than in February. Verify, showing ALL calculations, whether his statement is VALID.',
          answer:
            'February: 80 × R20,55 = R1 644,00. March: 80 × R21,10 = R1 688,00. Difference = R1 688,00 − R1 644,00 = R44,00. His statement is NOT valid — the difference was R44.',
          explanation: 'Alternatively: price difference R0,55 per litre × 80 ℓ = R44,00.',
          memo: [
            { code: 'RT', marks: 1, text: 'R20,55 and R21,10' },
            { code: 'M', marks: 1, text: 'Multiplying by the 80 ℓ tank' },
            { code: 'CA', marks: 1, text: 'R1 644,00 and R1 688,00' },
            { code: 'CA', marks: 1, text: 'Difference R44,00' },
            { code: 'J', marks: 1, text: 'NOT valid' },
          ],
        },
        {
          id: 'ml-p1-25n-5-2-3',
          label: '5.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: DIESEL,
          prompt:
            'The diesel price rose from December 2024 to January 2025 by exactly January’s inflation rate. Calculate the price per litre in December 2024.',
          answer: 'R20,60',
          explanation:
            'January’s price is December’s price increased by 3,2%: January = December × 1,032. So December = R21,26 ÷ 1,032 = R20,60. (Taking 3,2% OFF R21,26 would be wrong — the 3,2% was worked on December’s price, not January’s.)',
          memo: [
            { code: 'RT', marks: 1, text: 'January price R21,26 and rate 3,2%' },
            { code: 'M', marks: 1, text: 'Dividing by 1,032 (103,2%)' },
            { code: 'A', marks: 1, text: 'R20,60' },
          ],
        },
        {
          id: 'ml-p1-25n-5-2-4',
          label: '5.2.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 3,
          context: DIESEL + '\nThe March inflation rate, C, was 3,6%.',
          prompt: 'Describe the trend in the inflation rate from January to April 2025.',
          answer: 'It stayed the same from January to February (3,2%), rose in March (3,6%), then fell in April (2,8%) — it fluctuated.',
          explanation: 'Describe each change in order; there is no single upward or downward trend over these four months.',
          memo: [
            { code: 'J', marks: 1, text: 'Constant January–February' },
            { code: 'J', marks: 1, text: 'Increase in March' },
            { code: 'J', marks: 1, text: 'Decrease in April' },
          ],
        },
      ],
    },
  ],
}
