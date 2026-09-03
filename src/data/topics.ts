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
  {
    id: 'math-algebra',
    subjectId: 'mathematics',
    name: 'Algebra, Equations & Inequalities',
    description: 'Simplifying expressions, factorising, and solving linear, quadratic and simultaneous equations and inequalities.',
    grades: [10, 11, 12],
  },
  {
    id: 'math-functions',
    subjectId: 'mathematics',
    name: 'Functions & Graphs',
    description: 'Linear, quadratic, exponential and hyperbolic functions — sketching graphs, intercepts, asymptotes and turning points.',
    grades: [10, 11, 12],
  },
  {
    id: 'math-trigonometry',
    subjectId: 'mathematics',
    name: 'Trigonometry',
    description: 'Trig ratios, identities, reduction formulae, and solving trigonometric equations and triangles.',
    grades: [10, 11, 12],
  },
  {
    id: 'math-analytical-geometry',
    subjectId: 'mathematics',
    name: 'Analytical Geometry',
    description: 'Distance, gradient and midpoint between points, and equations of lines and circles on the Cartesian plane.',
    grades: [11, 12],
  },
  {
    id: 'math-statistics',
    subjectId: 'mathematics',
    name: 'Statistics',
    description: 'Measures of central tendency and spread, standard deviation, and interpreting statistical data and graphs.',
    grades: [10, 11, 12],
  },
  {
    id: 'math-finance-growth',
    subjectId: 'mathematics',
    name: 'Finance, Growth & Decay',
    description: 'Simple and compound growth and decay, and annuities, using algebraic financial formulae.',
    grades: [11, 12],
  },
  {
    id: 'math-number-patterns',
    subjectId: 'mathematics',
    name: 'Number Patterns, Sequences & Series',
    description: 'Arithmetic and geometric sequences and series, sigma notation, and the formulae for the sum of a series.',
    grades: [11, 12],
  },
  {
    id: 'math-calculus',
    subjectId: 'mathematics',
    name: 'Differential Calculus',
    description: 'Limits, the derivative from first principles, differentiation rules, and sketching and applying cubic graphs.',
    grades: [12],
  },
  {
    id: 'math-counting-probability',
    subjectId: 'mathematics',
    name: 'Counting Principle & Probability',
    description: 'Venn diagrams, tree diagrams, the addition and product rules, and the fundamental counting principle.',
    grades: [10, 11, 12],
  },
  {
    id: 'math-euclidean-geometry',
    subjectId: 'mathematics',
    name: 'Euclidean Geometry',
    description: 'Circle theorems, similar triangles, the proportionality theorem, and riders requiring formal proof.',
    grades: [10, 11, 12],
  },
]

export const getTopic = (id: string) => topics.find((t) => t.id === id)
export const topicsForSubject = (subjectId: string, grade?: Grade) =>
  topics.filter((t) => t.subjectId === subjectId && (grade ? t.grades.includes(grade) : true))
