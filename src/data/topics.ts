import type { GradeLevel, Topic } from "../types";

export const topics: Topic[] = [
  {
    id: "finance",
    subjectId: "maths-lit",
    name: "Finance",
    description: "Budgets, loans, interest, exchange rates and financial documents.",
    grades: [10, 11, 12],
    icon: "finance",
  },
  {
    id: "data-handling",
    subjectId: "maths-lit",
    name: "Data Handling",
    description: "Collecting, organising, summarising and interpreting data sets.",
    grades: [10, 11, 12],
    icon: "data",
  },
  {
    id: "maps-plans",
    subjectId: "maths-lit",
    name: "Maps and Plans",
    description: "Scale, distance, direction and reading building/floor plans.",
    grades: [10, 11, 12],
    icon: "maps",
  },
  {
    id: "measurement",
    subjectId: "maths-lit",
    name: "Measurement",
    description: "Length, area, volume, perimeter and conversions in context.",
    grades: [10, 11, 12],
    icon: "measurement",
  },
  {
    id: "probability",
    subjectId: "maths-lit",
    name: "Probability",
    description: "Chance, relative frequency and interpreting likelihood.",
    grades: [10, 11, 12],
    icon: "probability",
  },
  {
    id: "tariffs",
    subjectId: "maths-lit",
    name: "Tariffs",
    description: "Municipal accounts, water, electricity and telephone tariffs.",
    grades: [11, 12],
    icon: "tariffs",
  },
  {
    id: "profit-loss-breakeven",
    subjectId: "maths-lit",
    name: "Profit, Loss & Breakeven",
    description: "Income, expenses, cost/income graphs and breakeven analysis.",
    grades: [11, 12],
    icon: "profit",
  },
];

export function topicsForGrade(gradeLevel: GradeLevel) {
  return topics.filter((t) => t.grades.includes(gradeLevel));
}

export function getTopic(topicId: string) {
  return topics.find((t) => t.id === topicId);
}
