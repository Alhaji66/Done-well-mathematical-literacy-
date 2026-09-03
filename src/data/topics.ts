import type { Grade, Topic } from '@/types'

export const topics: Topic[] = [
  {
    id: 'finance',
    subjectId: 'mat-lit',
    name: 'Finance',
    description: 'Budgets, income & expenditure, loans, interest, exchange rates and financial documents.',
    grades: [10, 11, 12],
  },
  {
    id: 'tariffs',
    subjectId: 'mat-lit',
    name: 'Tariffs',
    description: 'Municipal accounts, electricity & water tariffs, phone contracts and cost comparisons.',
    grades: [10, 11, 12],
  },
  {
    id: 'data-handling',
    subjectId: 'mat-lit',
    name: 'Data Handling',
    description: 'Collecting, organising, summarising and interpreting data using tables, graphs and averages.',
    grades: [10, 11, 12],
  },
  {
    id: 'maps-plans',
    subjectId: 'mat-lit',
    name: 'Maps and Plans',
    description: 'Reading scale, distance, direction on maps and floor plans, elevation and layout diagrams.',
    grades: [10, 11, 12],
  },
  {
    id: 'measurement',
    subjectId: 'mat-lit',
    name: 'Measurement',
    description: 'Length, weight, volume, perimeter, area and conversions between units.',
    grades: [10, 11, 12],
  },
  {
    id: 'probability',
    subjectId: 'mat-lit',
    name: 'Probability',
    description: 'Chance, likelihood, relative frequency and simple probability calculations, applied across other topics.',
    grades: [10, 11, 12],
  },
  {
    id: 'profit-loss-breakeven',
    subjectId: 'mat-lit',
    name: 'Profit, Loss & Breakeven',
    description: 'Cost and income functions, break-even analysis and small business scenarios.',
    grades: [12],
  },
]

export const getTopic = (id: string) => topics.find((t) => t.id === id)
export const topicsForSubject = (subjectId: string, grade?: Grade) =>
  topics.filter((t) => t.subjectId === subjectId && (grade ? t.grades.includes(grade) : true))
