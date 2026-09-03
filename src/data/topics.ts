import type { Grade, Topic } from '@/types'

export const topics: Topic[] = [
  {
    id: 'finance',
    subjectId: 'mat-lit',
    name: 'Finance',
    description:
      'Financial documents, budgets, loans, interest, taxation, tariffs (electricity, water, phone, municipal), income & expenditure, profit/loss and break-even analysis.',
    grades: [10, 11, 12],
  },
  {
    id: 'data-handling',
    subjectId: 'mat-lit',
    name: 'Data Handling',
    description:
      'Collecting, organising, summarising and interpreting data using tables, graphs and averages — including probability, chance and relative frequency applied to real data.',
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
]

export const getTopic = (id: string) => topics.find((t) => t.id === id)
export const topicsForSubject = (subjectId: string, grade?: Grade) =>
  topics.filter((t) => t.subjectId === subjectId && (grade ? t.grades.includes(grade) : true))
