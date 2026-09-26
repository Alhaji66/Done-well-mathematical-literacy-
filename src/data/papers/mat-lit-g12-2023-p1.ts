import type { Paper } from './types'
import { SARS_2025_26, tableContext } from '@/data/taxTables'

/**
 * Mathematical Literacy Grade 12, 2023 Paper 1 -- in the NSC format.
 *
 * Rebuilt the same way as the 2024 and 2025 papers (see mat-lit-g12-2025-p1.ts
 * for why): 150 marks, 3 hours, five questions. Its shape follows the real
 * November 2023 Paper 1 and its marking guidelines, which vary the question
 * sizes more than the later papers do -- 29, 40, 27, 33 and 21 marks, with a
 * 40-mark finance question -- and the marks at each cognitive level match the
 * real memo's: 46, 41, 35 and 28.
 *
 * Everything here is ORIGINAL. Only the structure, mark layout and kinds of
 * question mirror the real paper, which is the Department of Basic
 * Education's copyright. Figures that look like statistics are invented for
 * practice and are labelled as such.
 *
 * Every item carries its own data in `context`, because items are also shown
 * one at a time outside the paper (see tools/check-orphans.mts).
 */

// The 2023/2024 brackets and rebates are the ones 2024/2025 and 2025/2026 kept
// unchanged (see taxTables.ts), so this is the same table under its own year.
const SARS_2023_24 = { ...SARS_2025_26, taxYear: '2023/2024' }

// ---------------------------------------------------------------- contexts

const CANDIDATES =
  'TABLE 1 shows the number of candidates who wrote the Grade 12 examinations in one province. (The figures are invented for practice.)\n' +
  '|+ TABLE 1: GRADE 12 CANDIDATES IN A PROVINCE\n| Year | Full-time | Part-time |\n|---|---|---|\n' +
  '| 2019 | 84 316 | 12 405 |\n| 2020 | 87 902 | 14 118 |\n| 2021 | 91 427 | 15 890 |\n| 2022 | 93 305 | 13 752 |\n| 2023 | 96 041 | 12 986 |'

const BOOKSHOP =
  "Palesa's till slip from a bookshop is shown below; one amount has been left out. All prices include VAT.\n" +
  '|+ TILL SLIP\n| Item | Qty | Unit price | Amount |\n|---|---|---|---|\n' +
  '| Novel | 2 | R189,95 | R379,90 |\n| Exam study guide | 1 | R245,00 | R245,00 |\n' +
  '| Pens (pack of 6) | 1 | R53,94 | R53,94 |\n| Batteries (pack of 4) | 3 | R38,50 | P |'

const CAR =
  'Tumi earns a gross monthly income of R24 600 and wants to buy a car. A dealer advertises the car as follows: ' +
  'price R289 900; no deposit; 72 monthly repayments of R6 180.'

const BANK =
  'Kagiso compares three bank accounts. TABLE 2 shows their fees; all fees include VAT.\n' +
  '|+ TABLE 2: MONTHLY BANK FEES\n| Account | Monthly fee | ATM (each) | Debit order (each) | Swipes |\n|---|---|---|---|---|\n' +
  '| Basic | R5,50 | R10,00 | R4,50 | Free |\n| Plus | R69,00 | Free | Free | Free |\n| Elite | R245,00 | Free | Free | Free |\n' +
  'In a month Kagiso makes 6 ATM withdrawals, pays 5 debit orders and swipes his card 20 times.'

const PAYSLIP =
  'Kagiso is 34 years old. His monthly salary slip for the 2023/2024 tax year shows the items below; his net salary has been left out.\n' +
  '|+ SALARY SLIP: K MOLOI — MONTHLY\n| Item | Amount |\n|---|---|\n' +
  '| Gross salary | R31 450,00 |\n| PAYE (income tax) | R4 546,81 |\n| UIF | 1% of gross salary |\n' +
  '| Pension fund | 7,5% of gross salary |\n| Medical aid | R2 316,00 |\n| NET SALARY | A |\n' +
  'His pension contribution is deducted before tax, so his monthly taxable income is his gross salary minus his pension contribution. He has no other income and no bonus.'

const TAX = PAYSLIP + '\n\n' + tableContext(SARS_2023_24)

const SCHOOL =
  "TABLE 3 shows a school's income and expenditure for 2023, in thousands of rand. (The figures are invented for practice.)\n" +
  '|+ TABLE 3: INCOME AND EXPENDITURE (R THOUSANDS)\n| Item | Amount |\n|---|---|\n' +
  '| INCOME | |\n| School fees | 3 480 |\n| Government grants | 1 250 |\n| Fundraising | 186 |\n| Donations | 94 |\n' +
  '| EXPENDITURE | |\n| Salaries of staff paid by the school | 3 120 |\n| Municipal services | 842 |\n| Maintenance | 415 |\n' +
  '| Learning materials | 506 |\n| Transport | 238 |'

const POPULATION =
  'TABLE 4 shows the population of a municipality by age group and sex. (The figures are invented for practice.)\n' +
  '|+ TABLE 4: POPULATION BY AGE GROUP AND SEX\n| Age group (years) | Male | Female |\n|---|---|---|\n' +
  '| 0–4 | 18 420 | 17 960 |\n| 5–14 | 34 105 | 33 870 |\n| 15–34 | 61 230 | 63 480 |\n| 35–64 | 45 610 | 52 740 |\n' +
  '| 65 and older | 8 950 | 13 215 |\n| TOTAL | 168 315 | 181 265 |'

const GROWTH =
  'At the clinic, a baby’s length is compared with the length-for-age percentiles in TABLE 5. (The values are approximate.)\n' +
  '|+ TABLE 5: LENGTH-FOR-AGE OF BOYS (cm)\n| Age (months) | 3rd percentile | 50th percentile | 97th percentile |\n|---|---|---|---|\n' +
  '| 1 | 50,8 | 54,7 | 58,6 |\n| 6 | 63,6 | 67,6 | 71,6 |\n| 12 | 71,3 | 75,7 | 80,2 |\n| 18 | 76,9 | 82,3 | 87,7 |\n' +
  'Baby Lwazi was 56,1 cm long at 1 month and 81,0 cm long at 18 months.'

const SCREEN =
  'Naledi asked 13 friends in her class how many hours they spend on screens in a week. Her results, in order, are:\n' +
  '6   9   12   16   18   20   21   23   27   P   31   38   45\n' +
  'For her data, the minimum is 6, the lower quartile 14, the median 21, the upper quartile 29 and the maximum 45 hours.'

const GROCERIES =
  'TABLE 6 compares the prices of some grocery items in a store and on the same shop’s website. An online order also costs a R35 delivery fee.\n' +
  '|+ TABLE 6: GROCERY PRICES IN STORE AND ONLINE\n| Item | In store | Online |\n|---|---|---|\n' +
  '| Rice 2 kg | R42,99 | R39,99 |\n| Cooking oil 2 ℓ | R79,99 | R82,49 |\n| Tea bags (100) | R54,99 | R52,99 |\n' +
  '| Tinned fish | R24,99 | R22,49 |\n| Flour 2,5 kg | R36,99 | R36,99 |\n| Washing powder 2 kg | R89,99 | R84,99 |\n| Toothpaste | R27,99 | R29,99 |'

const VETKOEK =
  'Ayanda sells vetkoek at a school market. Her fixed costs for a market day are R150 for the stall and R60 for gas. ' +
  'The ingredients for one vetkoek cost R3,50, and she sells each vetkoek for R8,50.\n' +
  '|+ TABLE 7: INCOME AND COST FOR ONE MARKET DAY\n| Vetkoek sold | Income | Total cost |\n|---|---|---|\n' +
  '| 0 | R0 | R210 |\n| 20 | R170 | R280 |\n| 40 | R340 | R350 |\n| 60 | R510 | R420 |\n| 80 | R680 | R490 |'

const AIRLINES =
  'TABLE 8 shows the number of passengers flown by five airlines in 2019 and in 2021. (The figures are invented for practice.)\n' +
  '|+ TABLE 8: PASSENGERS FLOWN (MILLIONS)\n| Airline | 2019 | 2021 |\n|---|---|---|\n' +
  '| Airline A | 42,6 | 18,3 |\n| Airline B | 35,1 | 21,7 |\n| Airline C | 28,4 | B |\n| Airline D | 17,9 | 9,6 |\n' +
  '| Airline E | 12,2 | 8,1 |\n| TOTAL | 136,2 | 70,5 |'

const RUPEE =
  'Sipho is planning a trip to India, where the currency is the rupee (₹). On 1 March, R1 = ₹4,52. On 1 June, R1 = ₹4,31. ' +
  'Also on 1 June, 1 US dollar = R19,35.'

// ---------------------------------------------------------------- paper

export const matLitG12P1Y2023: Paper = {
  id: 'ml-p1-2023',
  subjectId: 'mat-lit',
  paperNumber: 1,
  grade: 12,
  kind: 'past',
  year: 2023,
  title: '2023 Paper 1',
  durationMinutes: 180,
  totalMarks: 150,
  sections: [
    {
      number: 1,
      title: 'Exam candidates, a till slip and buying a car',
      topicId: 'data-handling',
      marks: 29,
      items: [
        {
          id: 'ml-p1-23n-1-1-1',
          label: '1.1.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CANDIDATES,
          prompt: 'Is the number of candidates DISCRETE or CONTINUOUS data?',
          answer: 'Discrete',
          explanation: 'Candidates are counted in whole numbers; you cannot have part of a candidate.',
          memo: [{ code: 'A', marks: 2, text: 'Discrete' }],
        },
        {
          id: 'ml-p1-23n-1-1-2',
          label: '1.1.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CANDIDATES,
          prompt: 'Write the number of full-time candidates in 2021 in words.',
          answer: 'Ninety-one thousand four hundred and twenty-seven',
          explanation: '91 427 = 91 thousand, 4 hundreds, 27.',
          memo: [
            { code: 'A', marks: 1, text: 'Ninety-one thousand' },
            { code: 'A', marks: 1, text: 'four hundred and twenty-seven' },
          ],
        },
        {
          id: 'ml-p1-23n-1-1-3',
          label: '1.1.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CANDIDATES,
          prompt: 'In which year were there the MOST part-time candidates?',
          options: [
            { id: 'a', label: '2019' },
            { id: 'b', label: '2021' },
            { id: 'c', label: '2022' },
            { id: 'd', label: '2023' },
          ],
          correctOptionId: 'b',
          answer: '2021',
          explanation: 'The largest number in the part-time column is 15 890, in 2021.',
          memo: [{ code: 'RT', marks: 2, text: '2021' }],
        },
        {
          id: 'ml-p1-23n-1-1-4',
          label: '1.1.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CANDIDATES,
          prompt: 'Did the number of part-time candidates INCREASE or DECREASE from 2022 to 2023?',
          answer: 'Decrease',
          explanation: 'It went from 13 752 in 2022 down to 12 986 in 2023.',
          memo: [{ code: 'A', marks: 2, text: 'Decrease' }],
        },
        {
          id: 'ml-p1-23n-1-1-5',
          label: '1.1.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: CANDIDATES,
          prompt: 'Write the ratio of part-time candidates to full-time candidates in 2023 in the form 1 : ...',
          answer: '1 : 7,40',
          explanation: 'Part-time : full-time = 12 986 : 96 041. Divide both by 12 986: 1 : 7,40.',
          memo: [
            { code: 'A', marks: 1, text: '12 986 : 96 041 in the correct order' },
            { code: 'M', marks: 1, text: 'Dividing both by 12 986' },
            { code: 'A', marks: 1, text: '1 : 7,40' },
          ],
        },
        {
          id: 'ml-p1-23n-1-2-1',
          label: '1.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: BOOKSHOP,
          prompt: 'Write down in full what the abbreviation VAT stands for.',
          answer: 'Value-added tax',
          explanation: 'VAT is the tax added to the price of most goods and services.',
          memo: [{ code: 'A', marks: 2, text: 'Value-added tax' }],
        },
        {
          id: 'ml-p1-23n-1-2-2',
          label: '1.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: BOOKSHOP,
          prompt: 'Calculate the value of P.',
          answer: 'R115,50',
          explanation: '3 packs × R38,50 = R115,50.',
          memo: [
            { code: 'RT', marks: 1, text: '3 and R38,50' },
            { code: 'M', marks: 1, text: 'Multiplying' },
            { code: 'A', marks: 1, text: 'R115,50' },
          ],
        },
        {
          id: 'ml-p1-23n-1-2-3',
          label: '1.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: BOOKSHOP,
          prompt: 'Calculate the price of ONE pen.',
          answer: 'R8,99',
          explanation: 'A pack of 6 costs R53,94, so one pen costs R53,94 ÷ 6 = R8,99.',
          memo: [
            { code: 'RT', marks: 1, text: 'R53,94' },
            { code: 'M', marks: 1, text: 'Dividing by 6' },
            { code: 'A', marks: 1, text: 'R8,99' },
          ],
        },
        {
          id: 'ml-p1-23n-1-2-4',
          label: '1.2.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: BOOKSHOP + '\nThe batteries cost R115,50 altogether.',
          prompt: 'Calculate the total amount Palesa paid.',
          answer: 'R794,34',
          explanation: 'R379,90 + R245,00 + R53,94 + R115,50 = R794,34.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding ALL four amounts' },
            { code: 'A', marks: 1, text: 'R794,34' },
          ],
        },
        {
          id: 'ml-p1-23n-1-2-5',
          label: '1.2.5',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: BOOKSHOP + '\nThe total on the slip is R794,34.',
          prompt: 'Palesa paid with a R1 000 note. Calculate her change.',
          answer: 'R205,66',
          explanation: 'R1 000,00 − R794,34 = R205,66.',
          memo: [
            { code: 'M', marks: 1, text: 'R1 000 − R794,34' },
            { code: 'A', marks: 1, text: 'R205,66' },
          ],
        },
        {
          id: 'ml-p1-23n-1-3-1',
          label: '1.3.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CAR,
          prompt: 'Explain what is meant by GROSS monthly income.',
          answer: 'The income earned in a month before any deductions (such as tax, UIF or pension) are taken off.',
          explanation: 'Gross is before deductions; net is what is left after them.',
          memo: [{ code: 'A', marks: 2, text: 'Income before deductions' }],
        },
        {
          id: 'ml-p1-23n-1-3-2',
          label: '1.3.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CAR,
          prompt: 'Write down the advertised price of the car.',
          answer: 'R289 900',
          explanation: 'Read it from the advert.',
          memo: [{ code: 'RT', marks: 2, text: 'R289 900' }],
        },
        {
          id: 'ml-p1-23n-1-3-3',
          label: '1.3.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CAR,
          prompt: 'Calculate the total of all the monthly repayments.',
          answer: 'R444 960',
          explanation: '72 × R6 180 = R444 960 — far more than the R289 900 price, because of interest.',
          memo: [
            { code: 'M', marks: 1, text: '72 × R6 180' },
            { code: 'A', marks: 1, text: 'R444 960' },
          ],
        },
      ],
    },
    {
      number: 2,
      title: 'Bank fees, a salary slip and a school’s finances',
      topicId: 'finance',
      marks: 40,
      items: [
        {
          id: 'ml-p1-23n-2-1-1',
          label: '2.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: BANK,
          prompt: 'Which account has the HIGHEST monthly fee?',
          answer: 'Elite',
          explanation: 'R245,00 a month is the highest monthly fee in the table.',
          memo: [{ code: 'RT', marks: 2, text: 'Elite' }],
        },
        {
          id: 'ml-p1-23n-2-1-2',
          label: '2.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: BANK,
          prompt: 'Calculate Kagiso’s total bank fees for one month on the Basic account.',
          answer: 'R88,00',
          explanation: 'R5,50 + 6 × R10,00 + 5 × R4,50 = R5,50 + R60,00 + R22,50 = R88,00. Card swipes are free.',
          memo: [
            { code: 'RT', marks: 1, text: 'R5,50, R10,00 and R4,50' },
            { code: 'M', marks: 1, text: 'R5,50 + 6 × R10 + 5 × R4,50' },
            { code: 'A', marks: 1, text: 'R88,00' },
          ],
        },
        {
          id: 'ml-p1-23n-2-1-3',
          label: '2.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 7,
          context: PAYSLIP,
          prompt: 'Kagiso says his net salary (A) is more than R22 000. Verify, showing ALL calculations, whether he is correct.',
          answer: 'Net salary = R21 913,94, which is LESS than R22 000. He is NOT correct.',
          explanation:
            'UIF = 1% × R31 450 = R314,50. Pension = 7,5% × R31 450 = R2 358,75. ' +
            'Net = R31 450 − R4 546,81 − R314,50 − R2 358,75 − R2 316,00 = R21 913,94.',
          memo: [
            { code: 'M', marks: 1, text: '1% × R31 450' },
            { code: 'A', marks: 1, text: 'UIF R314,50' },
            { code: 'M', marks: 1, text: '7,5% × R31 450' },
            { code: 'A', marks: 1, text: 'Pension R2 358,75' },
            { code: 'M', marks: 1, text: 'Subtracting ALL deductions from the gross salary' },
            { code: 'CA', marks: 1, text: 'R21 913,94' },
            { code: 'J', marks: 1, text: 'NOT correct' },
          ],
        },
        {
          id: 'ml-p1-23n-2-1-4',
          label: '2.1.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: BANK,
          prompt: 'Calculate the Elite account’s monthly fee EXCLUDING VAT, and the amount of VAT in it.',
          answer: 'R213,04 excluding VAT; VAT R31,96',
          explanation: 'The fee includes 15% VAT, so it is 115% of the price without VAT: R245,00 ÷ 1,15 = R213,04. VAT = R245,00 − R213,04 = R31,96.',
          memo: [
            { code: 'RT', marks: 1, text: 'R245,00' },
            { code: 'M', marks: 1, text: '÷ 1,15' },
            { code: 'CA', marks: 1, text: 'R213,04' },
            { code: 'M', marks: 1, text: 'R245,00 − R213,04' },
            { code: 'CA', marks: 1, text: 'R31,96' },
          ],
        },
        {
          id: 'ml-p1-23n-2-2-1',
          label: '2.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: TAX,
          prompt: 'Calculate Kagiso’s ANNUAL taxable income.',
          answer: 'R349 095',
          explanation: 'Pension = 7,5% × R31 450 = R2 358,75. Monthly taxable income = R31 450 − R2 358,75 = R29 091,25. × 12 = R349 095.',
          memo: [
            { code: 'M', marks: 1, text: 'R31 450 − 7,5% pension' },
            { code: 'M', marks: 1, text: '× 12' },
            { code: 'CA', marks: 1, text: 'R349 095' },
          ],
        },
        {
          id: 'ml-p1-23n-2-2-2',
          label: '2.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 6,
          context: TAX + '\nKagiso’s annual taxable income is R349 095.',
          prompt: 'Kagiso says the PAYE on his salary slip (R4 546,81 a month) is correct. Verify, showing ALL calculations, whether he is correct.',
          answer: 'Annual tax = R54 561,70, which is R4 546,81 a month. He is CORRECT.',
          explanation:
            'R349 095 is in the bracket R237 101 – R370 500. Tax before rebates = R42 678 + 26% × (R349 095 − R237 100) = R42 678 + R29 118,70 = R71 796,70. ' +
            'He is under 65, so only the primary rebate: R71 796,70 − R17 235 = R54 561,70 a year. ÷ 12 = R4 546,81 a month.',
          memo: [
            { code: 'SF', marks: 1, text: 'R42 678 + 26% × (R349 095 − R237 100)' },
            { code: 'CA', marks: 1, text: 'R71 796,70' },
            { code: 'RT', marks: 1, text: 'Primary rebate R17 235' },
            { code: 'CA', marks: 1, text: 'R54 561,70' },
            { code: 'M', marks: 1, text: '÷ 12 = R4 546,81' },
            { code: 'J', marks: 1, text: 'CORRECT' },
          ],
        },
        {
          id: 'ml-p1-23n-2-3-1',
          label: '2.3.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: SCHOOL,
          prompt: 'Name the income item that the school receives from the state.',
          answer: 'Government grants',
          explanation: 'Read it from the income section of the table.',
          memo: [{ code: 'RT', marks: 2, text: 'Government grants' }],
        },
        {
          id: 'ml-p1-23n-2-3-2',
          label: '2.3.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: SCHOOL,
          prompt: 'Calculate the school’s total income, and write it in rand (not in thousands).',
          answer: 'R5 010 000',
          explanation: '3 480 + 1 250 + 186 + 94 = 5 010 thousand = R5 010 000.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding the four income items' },
            { code: 'CA', marks: 1, text: '5 010 thousand' },
            { code: 'C', marks: 1, text: 'R5 010 000' },
          ],
        },
        {
          id: 'ml-p1-23n-2-3-3',
          label: '2.3.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: SCHOOL + '\nTotal income: R5 010 thousand.',
          prompt: 'Calculate the school’s net deficit for 2023, in R thousands.',
          answer: 'R111 thousand',
          explanation: 'Expenditure = 3 120 + 842 + 415 + 506 + 238 = 5 121 thousand. Deficit = 5 121 − 5 010 = 111 thousand.',
          memo: [
            { code: 'RT', marks: 1, text: 'ALL five expenditure items' },
            { code: 'M', marks: 1, text: '5 121 − 5 010' },
            { code: 'CA', marks: 1, text: 'R111 thousand' },
          ],
        },
        {
          id: 'ml-p1-23n-2-3-4',
          label: '2.3.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: SCHOOL + '\nThe school had a net deficit of R111 thousand in 2023.',
          prompt: 'Explain what the deficit means for the school.',
          answer: 'The school spent R111 000 more than it received, so it must use its savings, borrow money or owe suppliers to cover the difference.',
          explanation: 'A deficit is a shortfall: expenditure is bigger than income.',
          memo: [{ code: 'J', marks: 2, text: 'Spent more than it received; must cover the gap from savings or borrowing' }],
        },
        {
          id: 'ml-p1-23n-2-3-5',
          label: '2.3.5',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: SCHOOL + '\nIn 2023 total income was R5 010 thousand and total expenditure R5 121 thousand.',
          prompt: 'Next year the school will raise its school fees by 6%, and everything else stays the same. Determine whether the school will then have a surplus or a deficit, and how much it will be.',
          answer: 'A surplus of R97,8 thousand (R97 800)',
          explanation: '6% × 3 480 = 208,8 thousand more income: 5 010 + 208,8 = 5 218,8. 5 218,8 − 5 121 = 97,8 thousand, a surplus.',
          memo: [
            { code: 'M', marks: 1, text: '6% × 3 480' },
            { code: 'A', marks: 1, text: '208,8 thousand' },
            { code: 'M', marks: 1, text: 'New income − expenditure' },
            { code: 'CA', marks: 1, text: 'Surplus of R97,8 thousand' },
          ],
        },
      ],
    },
    {
      number: 3,
      title: 'Population, a baby’s growth and a class survey',
      topicId: 'data-handling',
      marks: 27,
      items: [
        {
          id: 'ml-p1-23n-3-1-1',
          label: '3.1.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: POPULATION,
          prompt: 'Which sex is in the majority in the 0–4 age group?',
          answer: 'Male',
          explanation: 'There are 18 420 males and 17 960 females aged 0–4.',
          memo: [{ code: 'RT', marks: 2, text: 'Male' }],
        },
        {
          id: 'ml-p1-23n-3-1-2',
          label: '3.1.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: POPULATION,
          prompt: 'Calculate how many more females than males are 65 and older.',
          answer: '4 265',
          explanation: '13 215 − 8 950 = 4 265.',
          memo: [
            { code: 'RT', marks: 1, text: '13 215 and 8 950' },
            { code: 'M', marks: 1, text: 'Subtracting' },
            { code: 'A', marks: 1, text: '4 265' },
          ],
        },
        {
          id: 'ml-p1-23n-3-1-3',
          label: '3.1.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: POPULATION,
          prompt: 'Describe how the number of females compares with the number of males as the age groups get older, and give a possible reason.',
          answer: 'In the young groups there are slightly more males, but from 15–34 onwards there are more females, and the gap is widest at 65 and older. A likely reason is that women, on average, live longer than men.',
          explanation: 'Compare the two columns row by row; the female share grows in each older group.',
          memo: [
            { code: 'J', marks: 1, text: 'More females in the older groups, gap widest at 65+' },
            { code: 'J', marks: 2, text: 'Women on average live longer than men' },
          ],
        },
        {
          id: 'ml-p1-23n-3-1-4',
          label: '3.1.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: POPULATION,
          prompt: 'Calculate the percentage of the whole population that is 65 or older.',
          answer: '≈ 6,34%',
          explanation: 'People 65+ = 8 950 + 13 215 = 22 165. Total = 168 315 + 181 265 = 349 580. 22 165 ÷ 349 580 × 100% = 6,34%.',
          memo: [
            { code: 'RT', marks: 1, text: '22 165 and 349 580' },
            { code: 'M', marks: 1, text: '÷ total × 100%' },
            { code: 'CA', marks: 1, text: '6,34%' },
          ],
        },
        {
          id: 'ml-p1-23n-3-1-5',
          label: '3.1.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: POPULATION,
          prompt: 'One person is chosen at random from the municipality. Determine the probability, as a decimal rounded to three decimal places, that the person is a female aged 15–34.',
          answer: '≈ 0,182',
          explanation: 'Total population = 168 315 + 181 265 = 349 580. Females aged 15–34 = 63 480. 63 480 ÷ 349 580 = 0,182.',
          memo: [
            { code: 'M', marks: 1, text: 'Total population 349 580' },
            { code: 'A', marks: 1, text: '63 480 ÷ 349 580' },
            { code: 'CA', marks: 1, text: '0,182' },
          ],
        },
        {
          id: 'ml-p1-23n-3-2-1',
          label: '3.2.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: GROWTH,
          prompt: 'Write down the 50th percentile length of a 12-month-old boy.',
          answer: '75,7 cm',
          explanation: 'Read from the 12-month row, 50th percentile column.',
          memo: [{ code: 'RT', marks: 2, text: '75,7 cm' }],
        },
        {
          id: 'ml-p1-23n-3-2-2',
          label: '3.2.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: GROWTH,
          prompt: 'At which of the listed ages is the difference between the 3rd and the 97th percentile the GREATEST?',
          answer: '18 months (10,8 cm)',
          explanation: 'Differences: 1 month 7,8 cm; 6 months 8,0 cm; 12 months 8,9 cm; 18 months 10,8 cm.',
          memo: [
            { code: 'M', marks: 1, text: '97th − 3rd for each age' },
            { code: 'A', marks: 1, text: '18 months' },
          ],
        },
        {
          id: 'ml-p1-23n-3-2-3',
          label: '3.2.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: GROWTH,
          prompt: 'Lwazi was above the median length at 1 month but below it at 18 months. His mother is worried. Explain whether she should be.',
          answer: 'No. At 18 months he is 81,0 cm, still well between the 3rd (76,9 cm) and 97th (87,7 cm) percentiles, which is the normal range; being a little below the median is not a problem.',
          explanation: 'Half of all healthy boys are below the median. What matters is staying inside the normal range.',
          memo: [{ code: 'J', marks: 2, text: 'Not worried: 81,0 cm is between the 3rd and 97th percentiles' }],
        },
        {
          id: 'ml-p1-23n-3-3-1',
          label: '3.3.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: SCREEN,
          prompt: 'What percentage of Naledi’s friends spend 29 hours or less on screens in a week?',
          answer: '75%',
          explanation: '29 hours is the upper quartile, and three-quarters of the data lies at or below the upper quartile.',
          memo: [{ code: 'RT', marks: 2, text: '75%' }],
        },
        {
          id: 'ml-p1-23n-3-3-2',
          label: '3.3.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: SCREEN,
          prompt: 'Determine the value of P.',
          answer: 'P = 27',
          explanation:
            'The 6 values above the median are 23, 27, P, 31, 38 and 45. The upper quartile is the middle of these: (P + 31) ÷ 2 = 29, so P + 31 = 58 and P = 27.',
          memo: [
            { code: 'M', marks: 1, text: '(P + 31) ÷ 2 = 29' },
            { code: 'S', marks: 1, text: 'P = 58 − 31' },
            { code: 'CA', marks: 1, text: '27' },
          ],
        },
        {
          id: 'ml-p1-23n-3-3-3',
          label: '3.3.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: SCREEN,
          prompt: 'Explain why Naledi’s results might NOT represent all the Grade 12 learners at her school.',
          answer: 'She asked only 13 people, and they were her friends, who probably have similar habits. The sample is small and not chosen at random, so it is biased.',
          explanation: 'A fair sample is large enough and chosen at random from the whole group.',
          memo: [{ code: 'J', marks: 2, text: 'Small sample of friends, not random, so biased' }],
        },
      ],
    },
    {
      number: 4,
      title: 'Online groceries and a vetkoek stall',
      topicId: 'finance',
      marks: 33,
      items: [
        {
          id: 'ml-p1-23n-4-1-1',
          label: '4.1.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: GROCERIES,
          prompt: 'Name the item that costs the same in store and online.',
          answer: 'Flour 2,5 kg',
          explanation: 'Flour is R36,99 both in store and online.',
          memo: [{ code: 'RT', marks: 2, text: 'Flour' }],
        },
        {
          id: 'ml-p1-23n-4-1-2',
          label: '4.1.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: GROCERIES,
          prompt: 'Write down the number of items that are CHEAPER online than in store.',
          answer: '4',
          explanation: 'Rice, tea bags, tinned fish and washing powder are cheaper online.',
          memo: [{ code: 'A', marks: 2, text: '4' }],
        },
        {
          id: 'ml-p1-23n-4-1-3',
          label: '4.1.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: GROCERIES,
          prompt: 'Calculate the total cost of ordering one of each item online, including delivery.',
          answer: 'R384,93',
          explanation: 'R39,99 + R82,49 + R52,99 + R22,49 + R36,99 + R84,99 + R29,99 = R349,93. Add the R35 delivery fee: R384,93.',
          memo: [
            { code: 'RT', marks: 1, text: 'ALL seven online prices' },
            { code: 'M', marks: 1, text: 'Adding them' },
            { code: 'A', marks: 1, text: 'R349,93' },
            { code: 'CA', marks: 1, text: '+ R35 = R384,93' },
          ],
        },
        {
          id: 'ml-p1-23n-4-1-4',
          label: '4.1.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: GROCERIES,
          prompt: 'Determine the median in-store price.',
          answer: 'R42,99',
          explanation: 'In order: R24,99; R27,99; R36,99; R42,99; R54,99; R79,99; R89,99. With 7 prices, the median is the 4th: R42,99.',
          memo: [
            { code: 'A', marks: 1, text: 'Arranging in order' },
            { code: 'A', marks: 1, text: 'ALL seven prices in the correct order' },
            { code: 'M', marks: 1, text: 'Choosing the middle (4th) value' },
            { code: 'CA', marks: 1, text: 'R42,99' },
          ],
        },
        {
          id: 'ml-p1-23n-4-1-5',
          label: '4.1.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: GROCERIES,
          prompt: 'One item is chosen at random from the table. Determine, as a percentage, the probability that it is CHEAPER in store than online.',
          answer: '≈ 28,6%',
          explanation: 'Only cooking oil and toothpaste are cheaper in store: 2 of the 7 items. 2/7 × 100% = 28,6%.',
          memo: [
            { code: 'A', marks: 1, text: '2 items' },
            { code: 'M', marks: 1, text: '2/7 × 100%' },
            { code: 'CA', marks: 1, text: '28,6%' },
          ],
        },
        {
          id: 'ml-p1-23n-4-2-1',
          label: '4.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: VETKOEK,
          prompt: 'Write down Ayanda’s total cost if she makes 60 vetkoek.',
          answer: 'R420',
          explanation: 'Read from TABLE 7: 60 vetkoek, total cost R420.',
          memo: [{ code: 'RT', marks: 2, text: 'R420' }],
        },
        {
          id: 'ml-p1-23n-4-2-2',
          label: '4.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 6,
          context: VETKOEK,
          prompt: 'Calculate the number of vetkoek Ayanda must sell to break even.',
          answer: '42 vetkoek',
          explanation:
            'Income = R8,50 × number sold. Total cost = R210 + R3,50 × number sold. At break-even they are equal: ' +
            '8,50n = 210 + 3,50n, so 5n = 210 and n = 42.',
          memo: [
            { code: 'SF', marks: 1, text: 'Income = R8,50 × n' },
            { code: 'SF', marks: 1, text: 'Cost = R210 + R3,50 × n' },
            { code: 'M', marks: 1, text: 'Income = cost' },
            { code: 'S', marks: 1, text: '5n = 210' },
            { code: 'CA', marks: 1, text: 'n = 42' },
            { code: 'CA', marks: 1, text: '42 vetkoek' },
          ],
        },
        {
          id: 'ml-p1-23n-4-2-3',
          label: '4.2.3',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: VETKOEK,
          prompt: 'Ayanda says that if she sells 40 vetkoek she makes a profit. Do you agree? Give a reason.',
          answer: 'Disagree. At 40 vetkoek her income is R340 but her cost is R350, so she makes a loss of R10.',
          explanation: 'Profit needs income greater than cost.',
          memo: [
            { code: 'J', marks: 1, text: 'Disagree' },
            { code: 'J', marks: 2, text: 'Income R340 is less than cost R350' },
          ],
        },
        {
          id: 'ml-p1-23n-4-2-4',
          label: '4.2.4',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: VETKOEK,
          prompt: 'If Ayanda got her gas for free, would her break-even point be HIGHER or LOWER? Explain.',
          answer: 'Lower. Her fixed costs drop from R210 to R150, so fewer sales are needed to cover them (150 ÷ 5 = 30 vetkoek instead of 42).',
          explanation: 'Each vetkoek contributes R8,50 − R3,50 = R5 towards the fixed costs; smaller fixed costs are covered sooner.',
          memo: [
            { code: 'A', marks: 1, text: 'Lower' },
            { code: 'J', marks: 2, text: 'Smaller fixed costs are covered by fewer sales' },
          ],
        },
        {
          id: 'ml-p1-23n-4-2-5',
          label: '4.2.5',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: VETKOEK,
          prompt: 'Ayanda sells 80 vetkoek. Calculate her profit as a percentage of her total cost.',
          answer: '≈ 38,8%',
          explanation: 'Profit = R680 − R490 = R190. R190 ÷ R490 × 100% = 38,8%.',
          memo: [
            { code: 'RT', marks: 1, text: 'R680 and R490' },
            { code: 'M', marks: 1, text: 'R680 − R490' },
            { code: 'M', marks: 1, text: '÷ R490 × 100%' },
            { code: 'CA', marks: 1, text: '38,8%' },
          ],
        },
      ],
    },
    {
      number: 5,
      title: 'Airline passengers and exchange rates',
      topicId: 'data-handling',
      marks: 21,
      items: [
        {
          id: 'ml-p1-23n-5-1-1',
          label: '5.1.1',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: AIRLINES,
          prompt: 'Which airline flew the MOST passengers in 2021?',
          answer: 'Airline B',
          explanation: 'Airline C’s 2021 value is missing, but it must be 70,5 − 57,7 = 12,8 million, so Airline B (21,7 million) is the highest.',
          memo: [{ code: 'RT', marks: 2, text: 'Airline B' }],
        },
        {
          id: 'ml-p1-23n-5-1-2',
          label: '5.1.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: AIRLINES,
          prompt: 'Calculate the percentage decrease in Airline A’s passengers from 2019 to 2021.',
          answer: '≈ 57,0%',
          explanation: 'Decrease = 42,6 − 18,3 = 24,3 million. 24,3 ÷ 42,6 × 100% = 57,0%.',
          memo: [
            { code: 'M', marks: 1, text: '42,6 − 18,3' },
            { code: 'A', marks: 1, text: '24,3 million' },
            { code: 'M', marks: 1, text: '÷ 42,6 × 100%' },
            { code: 'CA', marks: 1, text: '57,0%' },
          ],
        },
        {
          id: 'ml-p1-23n-5-1-3',
          label: '5.1.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: AIRLINES,
          prompt: 'Determine the range of the 2019 passenger numbers.',
          answer: '30,4 million',
          explanation: 'Highest 42,6 − lowest 12,2 = 30,4 million.',
          memo: [
            { code: 'RT', marks: 1, text: '42,6 and 12,2' },
            { code: 'M', marks: 1, text: 'Subtracting' },
            { code: 'A', marks: 1, text: '30,4 million' },
          ],
        },
        {
          id: 'ml-p1-23n-5-1-4',
          label: '5.1.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: AIRLINES,
          prompt: 'Calculate the value of B.',
          answer: '12,8 million',
          explanation: '18,3 + 21,7 + 9,6 + 8,1 = 57,7. B = 70,5 − 57,7 = 12,8 million.',
          memo: [
            { code: 'RT', marks: 1, text: 'The four known 2021 values' },
            { code: 'M', marks: 1, text: 'Adding them' },
            { code: 'M', marks: 1, text: '70,5 − 57,7' },
            { code: 'CA', marks: 1, text: '12,8 million' },
          ],
        },
        {
          id: 'ml-p1-23n-5-1-5',
          label: '5.1.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: AIRLINES,
          prompt: 'A 2021 passenger of Airline D or Airline E is chosen at random. Determine, as a percentage, the probability that the passenger flew with Airline E.',
          answer: '≈ 45,8%',
          explanation: 'Together D and E flew 9,6 + 8,1 = 17,7 million. 8,1 ÷ 17,7 × 100% = 45,8%.',
          memo: [
            { code: 'M', marks: 1, text: '9,6 + 8,1 = 17,7' },
            { code: 'M', marks: 1, text: '8,1 ÷ 17,7 × 100%' },
            { code: 'CA', marks: 1, text: '45,8%' },
          ],
        },
        {
          id: 'ml-p1-23n-5-2-1',
          label: '5.2.1',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: RUPEE,
          prompt: 'Did the rand get STRONGER or WEAKER against the rupee from 1 March to 1 June?',
          answer: 'Weaker',
          explanation: 'On 1 June one rand buys fewer rupees (₹4,31) than on 1 March (₹4,52).',
          memo: [{ code: 'A', marks: 2, text: 'Weaker' }],
        },
        {
          id: 'ml-p1-23n-5-2-2',
          label: '5.2.2',
          topicId: 'finance',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: RUPEE,
          prompt: 'Use the 1 June rates to calculate how many rupees 1 US dollar would buy.',
          answer: '≈ ₹83,40',
          explanation: '1 US dollar = R19,35, and each rand buys ₹4,31: 19,35 × 4,31 = ₹83,40.',
          memo: [
            { code: 'A', marks: 1, text: '1 US dollar = R19,35' },
            { code: 'M', marks: 1, text: '× 4,31' },
            { code: 'CA', marks: 1, text: '₹83,40' },
          ],
        },
      ],
    },
  ],
}
