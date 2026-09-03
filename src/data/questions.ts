import type { Question } from '@/types'

export const questions: Question[] = [
  // Finance
  {
    id: 'fin-e1',
    topicId: 'finance',
    grade: 12,
    difficulty: 'Easy',
    marks: 2,
    prompt: 'Thabo earns a monthly salary of R14 500. He spends R4 200 on rent. What percentage of his salary goes to rent?',
    answer: '28.97%',
    explanation: 'Percentage = (4 200 ÷ 14 500) × 100 = 28.97%. Divide the part by the whole, then multiply by 100.',
  },
  {
    id: 'fin-m1',
    topicId: 'finance',
    grade: 12,
    difficulty: 'Moderate',
    marks: 4,
    prompt: 'A savings account offers 6.5% simple interest per year. If Nomvula invests R8 000, how much interest will she earn after 3 years?',
    context: 'First find one year\'s interest, then multiply by the number of years — with simple interest, every year earns interest on the original R8 000 only, never on interest already earned.',
    answer: 'R1 560',
    explanation: 'One year\'s interest: R8 000 × 6.5 ÷ 100 = R520. Over 3 years: R520 × 3 = R1 560. Simple interest is calculated only on the original amount each year, unlike compound interest.',
  },
  {
    id: 'fin-c1',
    topicId: 'finance',
    grade: 12,
    difficulty: 'Challenge',
    marks: 6,
    prompt: 'A loan of R12 000 is repaid with compound interest at 9% per year over 2 years. Calculate the total amount owed, rounded to the nearest rand.',
    context: 'Work it out year by year: add 9% interest to the balance at the end of each year, then use that new balance to calculate the next year\'s interest.',
    answer: 'R14 257',
    explanation: 'Year 1: R12 000 × 1.09 = R13 080.00. Year 2: R13 080.00 × 1.09 = R14 257.20 ≈ R14 257. Each year\'s interest is calculated on the previous year\'s total, not on the original R12 000 only — that\'s what makes it compound interest.',
  },
  {
    id: 'fin-e2',
    topicId: 'finance',
    grade: 11,
    difficulty: 'Easy',
    marks: 3,
    prompt: 'Which of these is NOT usually a fixed monthly expense in a household budget?',
    options: [
      { id: 'a', label: 'Rent' },
      { id: 'b', label: 'Groceries' },
      { id: 'c', label: 'Car instalment' },
      { id: 'd', label: 'Insurance premium' },
    ],
    correctOptionId: 'b',
    answer: 'Groceries',
    explanation: 'Groceries vary month to month depending on needs and prices, so they are a variable expense. Rent, car instalments and insurance are usually fixed.',
  },

  // Finance — Tariffs
  {
    id: 'tar-e1',
    topicId: 'finance',
    grade: 11,
    difficulty: 'Easy',
    marks: 2,
    prompt: 'A municipality charges a flat rate of R28.50 per kℓ of water used. What is the cost for 12 kℓ used in a month?',
    answer: 'R342.00',
    explanation: 'Cost = rate × quantity = 28.50 × 12 = R342.00.',
  },
  {
    id: 'tar-m1',
    topicId: 'finance',
    grade: 11,
    difficulty: 'Moderate',
    marks: 5,
    prompt: 'A cellphone contract costs R249 per month including 2GB of data. Extra data costs R59 per additional 500MB. If Lindiwe used 3.5GB in a month, what was her total bill?',
    answer: 'R426.00',
    explanation: 'Extra data used = 3.5GB − 2GB = 1.5GB = 3 × 500MB blocks. Extra cost = 3 × R59 = R177. Total = 249 + 177 = R426.00.',
  },
  {
    id: 'tar-c1',
    topicId: 'finance',
    grade: 12,
    difficulty: 'Challenge',
    marks: 6,
    prompt: 'Electricity is billed on a sliding scale: R1.85/kWh for the first 350kWh, and R2.45/kWh thereafter. Calculate the total bill for 480kWh used in a month.',
    answer: 'R966.00',
    explanation: 'First 350kWh: 350 × 1.85 = R647.50. Remaining 130kWh: 130 × 2.45 = R318.50. Total = 647.50 + 318.50 = R966.00.',
  },

  // Data Handling
  {
    id: 'dat-e1',
    topicId: 'data-handling',
    grade: 10,
    difficulty: 'Easy',
    marks: 3,
    prompt: 'A class recorded test scores: 45, 60, 55, 70, 60, 80. What is the mode of this data set?',
    answer: '60',
    explanation: 'The mode is the value that appears most often. 60 appears twice, more than any other value.',
  },
  {
    id: 'dat-m1',
    topicId: 'data-handling',
    grade: 11,
    difficulty: 'Moderate',
    marks: 4,
    prompt: 'Using the same data set (45, 60, 55, 70, 60, 80), calculate the mean score.',
    answer: '61.7 (rounded to 1 decimal)',
    explanation: 'Mean = sum ÷ count = (45+60+55+70+60+80) ÷ 6 = 370 ÷ 6 = 61.67 ≈ 61.7.',
  },
  {
    id: 'dat-c1',
    topicId: 'data-handling',
    grade: 12,
    difficulty: 'Challenge',
    marks: 5,
    prompt: 'A bar graph shows monthly clinic visits rising from 120 in January to 300 in June. Describe the trend and estimate the average monthly increase.',
    answer: 'Increasing trend; average increase ≈ 36 visits/month',
    explanation: 'Total increase = 300 − 120 = 180 over 5 intervals (Jan→Jun). Average monthly increase = 180 ÷ 5 = 36 visits per month. The trend is a steady increase.',
  },

  // Maps and Plans
  {
    id: 'map-e1',
    topicId: 'maps-plans',
    grade: 10,
    difficulty: 'Easy',
    marks: 2,
    prompt: 'A map has a scale of 1:50 000. If two towns are 6cm apart on the map, what is the actual distance in kilometres?',
    answer: '3 km',
    explanation: 'Actual distance = 6cm × 50 000 = 300 000cm = 3 000m = 3km. Convert cm to km by dividing by 100 000.',
  },
  {
    id: 'map-m1',
    topicId: 'maps-plans',
    grade: 11,
    difficulty: 'Moderate',
    marks: 4,
    prompt: 'On a house floor plan with a scale of 1:100, a bedroom measures 3.2cm by 4cm. What are the real dimensions in metres?',
    answer: '3.2 m × 4 m',
    explanation: 'Real length = 3.2cm × 100 = 320cm = 3.2m. Real width = 4cm × 100 = 400cm = 4m.',
  },
  {
    id: 'map-c1',
    topicId: 'maps-plans',
    grade: 12,
    difficulty: 'Challenge',
    marks: 6,
    prompt: 'A hiking map uses a bar scale where 2cm represents 1km. A trail measures 9cm on the map and gains 240m in elevation. Calculate the real trail distance and the average gradient as a percentage.',
    answer: '4.5 km; gradient ≈ 5.3%',
    explanation: 'Real distance = 9cm ÷ 2cm × 1km = 4.5km = 4500m. Gradient = (elevation gain ÷ horizontal distance) × 100 = (240 ÷ 4500) × 100 ≈ 5.3%.',
  },

  // Measurement
  {
    id: 'mea-e1',
    topicId: 'measurement',
    grade: 10,
    difficulty: 'Easy',
    marks: 3,
    prompt: 'Calculate the perimeter of a rectangular garden that is 8m long and 5m wide.',
    answer: '26 m',
    explanation: 'Perimeter = 2 × (length + width) = 2 × (8 + 5) = 2 × 13 = 26m.',
  },
  {
    id: 'mea-m1',
    topicId: 'measurement',
    grade: 11,
    difficulty: 'Moderate',
    marks: 4,
    prompt: 'A cylindrical water tank has a radius of 1.4m and a height of 2m. Calculate its volume (use π ≈ 3.14), rounded to 1 decimal.',
    context: 'V = πr²h',
    answer: '12.3 m³',
    explanation: 'V = 3.14 × 1.4² × 2 = 3.14 × 1.96 × 2 = 12.31 ≈ 12.3 m³.',
  },
  {
    id: 'mea-c1',
    topicId: 'measurement',
    grade: 12,
    difficulty: 'Challenge',
    marks: 6,
    prompt: 'A room measuring 5m by 4m needs new flooring. Tiles cost R189.99 per m² and come in boxes covering 1.8m² each. How many boxes are needed and what is the total cost?',
    answer: '12 boxes; R4 559.76',
    explanation: 'Area = 5 × 4 = 20m². Boxes needed = 20 ÷ 1.8 = 11.1, round up to 12 boxes. Cost = 12 × 1.8 × 189.99 = R4 103.78... using full boxes: 12 boxes × R189.99×1.8 ≈ R4 559.76 (always round up boxes; you cannot buy part of a box).',
  },

  // Data Handling — Probability (integrated, per CAPS)
  {
    id: 'pro-e1',
    topicId: 'data-handling',
    grade: 11,
    difficulty: 'Easy',
    marks: 2,
    prompt: 'A bag contains 4 red balls and 6 blue balls. What is the probability of randomly drawing a red ball?',
    answer: '0.4 (or 40%)',
    explanation: 'P(red) = favourable outcomes ÷ total outcomes = 4 ÷ 10 = 0.4.',
  },
  {
    id: 'pro-m1',
    topicId: 'data-handling',
    grade: 12,
    difficulty: 'Moderate',
    marks: 4,
    prompt: 'A dice is rolled 60 times. It lands on 6 a total of 8 times. What is the relative frequency of rolling a 6, and how does it compare to the theoretical probability?',
    answer: 'Relative frequency ≈ 0.133; theoretical is 0.167',
    explanation: 'Relative frequency = 8 ÷ 60 ≈ 0.133 (13.3%). Theoretical probability = 1 ÷ 6 ≈ 0.167 (16.7%). The observed result is slightly lower than expected.',
  },

  // Finance — Profit, Loss & Breakeven
  {
    id: 'plb-m1',
    topicId: 'finance',
    grade: 12,
    difficulty: 'Moderate',
    marks: 5,
    prompt: 'A learner bakes and sells muffins. Ingredients cost R3.50 per muffin and each muffin sells for R8.00. If fixed costs (oven electricity, packaging) are R120 per week, how many muffins must be sold to break even?',
    answer: '27 muffins (rounded up)',
    explanation: 'Profit per muffin = 8.00 − 3.50 = R4.50. Break-even quantity = fixed costs ÷ profit per unit = 120 ÷ 4.50 ≈ 26.7, round up to 27 muffins.',
  },
  {
    id: 'plb-c1',
    topicId: 'finance',
    grade: 12,
    difficulty: 'Challenge',
    marks: 7,
    prompt: 'A small car wash has fixed monthly costs of R2 400 and variable cost of R15 per car washed. Each wash is sold for R65. Calculate the break-even number of cars and the profit if 60 cars are washed in a month.',
    answer: 'Break-even = 48 cars; Profit at 60 cars = R600',
    explanation: 'Profit per car = 65 − 15 = R50. Break-even = 2400 ÷ 50 = 48 cars. At 60 cars: Income = 60×65 = 3900, Costs = 2400 + 60×15 = 3300, Profit = 3900 − 3300 = R600.',
  },
]

export const questionsForTopic = (topicId: string) => questions.filter((q) => q.topicId === topicId)

export const filterQuestions = (opts: { topicId?: string; difficulty?: string; grade?: number }) =>
  questions.filter(
    (q) =>
      (!opts.topicId || q.topicId === opts.topicId) &&
      (!opts.difficulty || q.difficulty === opts.difficulty) &&
      (!opts.grade || q.grade === opts.grade),
  )
