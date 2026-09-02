import type { Question } from "../types";

export const questions: Question[] = [
  // Finance
  {
    id: "q-fin-1",
    topicId: "finance",
    gradeLevel: 12,
    difficulty: "easy",
    marks: 2,
    prompt: "Thabo earns a monthly salary of R14,500. He saves 12% of his salary each month. How much does he save?",
    options: [
      { id: "a", label: "R1,450" },
      { id: "b", label: "R1,740" },
      { id: "c", label: "R1,650" },
      { id: "d", label: "R1,200" },
    ],
    correctOptionId: "b",
    explanation:
      "Savings = 12% × R14,500 = 0.12 × 14,500 = R1,740. Convert the percentage to a decimal before multiplying.",
  },
  {
    id: "q-fin-2",
    topicId: "finance",
    gradeLevel: 12,
    difficulty: "moderate",
    marks: 4,
    prompt:
      "Nomsa takes out a loan of R8,000 at a simple interest rate of 9% per year. How much interest will she pay after 3 years?",
    context: "Use the simple interest formula: I = P × i × n",
    correctAnswer: "R2,160",
    explanation:
      "I = P × i × n = 8,000 × 0.09 × 3 = R2,160. Simple interest is calculated only on the original amount (the principal) each year.",
  },
  {
    id: "q-fin-3",
    topicId: "finance",
    gradeLevel: 12,
    difficulty: "challenge",
    marks: 6,
    prompt:
      "A family's total monthly income is R22,400. Their expenses are: rent R6,500, groceries R3,800, transport R1,950, electricity R1,200, and other R2,100. What percentage of their income is left over as savings, to one decimal place?",
    correctAnswer: "30.6%",
    explanation:
      "Total expenses = 6,500+3,800+1,950+1,200+2,100 = R15,550. Savings = 22,400 − 15,550 = R6,850. Percentage = (6,850 ÷ 22,400) × 100 ≈ 30.6%. Always add all expense items carefully before subtracting from income.",
  },

  // Data Handling
  {
    id: "q-dat-1",
    topicId: "data-handling",
    gradeLevel: 12,
    difficulty: "easy",
    marks: 2,
    prompt: "What is the mean of this data set: 4, 8, 6, 10, 12?",
    options: [
      { id: "a", label: "8" },
      { id: "b", label: "9" },
      { id: "c", label: "7" },
      { id: "d", label: "10" },
    ],
    correctOptionId: "a",
    explanation: "Mean = (4+8+6+10+12) ÷ 5 = 40 ÷ 5 = 8. Add all the values, then divide by how many values there are.",
  },
  {
    id: "q-dat-2",
    topicId: "data-handling",
    gradeLevel: 12,
    difficulty: "moderate",
    marks: 3,
    prompt:
      "A class recorded test scores (out of 20): 12, 15, 18, 9, 14, 20, 11, 16. Determine the median score.",
    correctAnswer: "14.5",
    explanation:
      "Order the data: 9,11,12,14,15,16,18,20. With 8 values, the median is the average of the 4th and 5th values: (14+15) ÷ 2 = 14.5.",
  },
  {
    id: "q-dat-3",
    topicId: "data-handling",
    gradeLevel: 12,
    difficulty: "challenge",
    marks: 5,
    prompt:
      "A survey of 200 learners found that 45 walk to school, 80 use taxis, 55 are driven by a parent, and the rest cycle. What percentage of learners cycle?",
    correctAnswer: "10%",
    explanation:
      "Learners accounted for = 45+80+55 = 180. Cyclists = 200 − 180 = 20. Percentage = (20 ÷ 200) × 100 = 10%.",
  },

  // Maps and Plans
  {
    id: "q-map-1",
    topicId: "maps-plans",
    gradeLevel: 12,
    difficulty: "easy",
    marks: 2,
    prompt: "On a map with a scale of 1:50,000, a distance measures 4 cm. What is the actual distance in kilometres?",
    options: [
      { id: "a", label: "0.5 km" },
      { id: "b", label: "2 km" },
      { id: "c", label: "20 km" },
      { id: "d", label: "5 km" },
    ],
    correctOptionId: "b",
    explanation:
      "Actual distance = 4 cm × 50,000 = 200,000 cm = 2,000 m = 2 km. Multiply the map distance by the scale factor, then convert units.",
  },
  {
    id: "q-map-2",
    topicId: "maps-plans",
    gradeLevel: 12,
    difficulty: "moderate",
    marks: 4,
    prompt:
      "A rectangular classroom on a floor plan measures 6 cm by 4 cm. The plan's scale is 1:100. Calculate the actual floor area of the classroom in square metres.",
    correctAnswer: "24 m²",
    explanation:
      "Actual length = 6×100 = 600 cm = 6 m. Actual width = 4×100 = 400 cm = 4 m. Area = 6 × 4 = 24 m². Convert each dimension to real-world units before multiplying for area.",
  },

  // Measurement
  {
    id: "q-mea-1",
    topicId: "measurement",
    gradeLevel: 12,
    difficulty: "easy",
    marks: 2,
    prompt: "Convert 2.5 litres to millilitres.",
    options: [
      { id: "a", label: "25 ml" },
      { id: "b", label: "250 ml" },
      { id: "c", label: "2,500 ml" },
      { id: "d", label: "25,000 ml" },
    ],
    correctOptionId: "c",
    explanation: "1 litre = 1,000 ml, so 2.5 litres = 2.5 × 1,000 = 2,500 ml.",
  },
  {
    id: "q-mea-2",
    topicId: "measurement",
    gradeLevel: 12,
    difficulty: "moderate",
    marks: 4,
    prompt: "A cylindrical water tank has a radius of 0.7 m and a height of 1.5 m. Calculate its volume in m³ (use π ≈ 3.142), rounded to 2 decimal places.",
    correctAnswer: "2.31 m³",
    explanation:
      "Volume = π r² h = 3.142 × 0.7² × 1.5 = 3.142 × 0.49 × 1.5 ≈ 2.31 m³. Square the radius first, then multiply by π and the height.",
  },

  // Probability
  {
    id: "q-pro-1",
    topicId: "probability",
    gradeLevel: 12,
    difficulty: "easy",
    marks: 2,
    prompt: "A bag contains 5 red balls and 3 blue balls. What is the probability of drawing a blue ball?",
    options: [
      { id: "a", label: "3/8" },
      { id: "b", label: "5/8" },
      { id: "c", label: "3/5" },
      { id: "d", label: "1/3" },
    ],
    correctOptionId: "a",
    explanation: "P(blue) = blue balls ÷ total balls = 3 ÷ (5+3) = 3/8.",
  },
  {
    id: "q-pro-2",
    topicId: "probability",
    gradeLevel: 12,
    difficulty: "challenge",
    marks: 4,
    prompt:
      "Over 250 school days, it rained on 40 days. Based on this relative frequency, estimate the probability that it will rain on a randomly chosen school day (as a percentage, 1 decimal place).",
    correctAnswer: "16.0%",
    explanation: "Relative frequency = 40 ÷ 250 = 0.16 = 16.0%. Relative frequency from past data is used to estimate probability.",
  },

  // Tariffs
  {
    id: "q-tar-1",
    topicId: "tariffs",
    gradeLevel: 12,
    difficulty: "moderate",
    marks: 4,
    prompt:
      "A municipality charges R1.85 per kWh for electricity plus a fixed monthly charge of R95. Calculate the total bill for a household using 450 kWh in a month.",
    correctAnswer: "R927.50",
    explanation:
      "Usage cost = 450 × R1.85 = R832.50. Total = R832.50 + R95 (fixed charge) = R927.50. Always add the fixed charge after calculating the usage-based cost.",
  },

  // Profit, Loss & Breakeven
  {
    id: "q-plb-1",
    topicId: "profit-loss-breakeven",
    gradeLevel: 12,
    difficulty: "moderate",
    marks: 5,
    prompt:
      "A small business sells caps for R120 each. It costs R45 to make each cap, plus fixed monthly costs of R3,000. How many caps must be sold to break even?",
    correctAnswer: "40 caps",
    explanation:
      "Profit per cap = R120 − R45 = R75. Breakeven quantity = fixed costs ÷ profit per unit = 3,000 ÷ 75 = 40 caps.",
  },
  {
    id: "q-plb-2",
    topicId: "profit-loss-breakeven",
    gradeLevel: 12,
    difficulty: "challenge",
    marks: 6,
    prompt:
      "A stall's income is given by I(x) = 25x and its costs by C(x) = 12x + 780, where x is the number of items sold. Determine the breakeven number of items.",
    correctAnswer: "60 items",
    explanation:
      "At breakeven, I(x) = C(x): 25x = 12x + 780 → 13x = 780 → x = 60. Set income equal to cost and solve for x.",
  },
];

export function questionsFor(topicId: string, difficulty?: Question["difficulty"]) {
  return questions.filter(
    (q) => q.topicId === topicId && (difficulty ? q.difficulty === difficulty : true),
  );
}
