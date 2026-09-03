import type { Resource } from '@/types'

export const resources: Resource[] = [
  {
    id: 'res-lb-12',
    title: 'Mathematical Literacy Learner Book — Grade 12',
    type: 'Learner Book',
    grade: 12,
    subjectId: 'mat-lit',
    pages: 212,
    updated: '2026 edition',
    description: 'Full CAPS-aligned learner book covering all Grade 12 Mathematical Literacy topics with worked examples.',
  },
  {
    id: 'res-wb-12',
    title: 'Mathematical Literacy Workbook — Grade 12',
    type: 'Workbook',
    grade: 12,
    subjectId: 'mat-lit',
    pages: 96,
    updated: '2026 edition',
    description: 'Extra practice exercises per topic, designed for daily consolidation and homework.',
  },
  {
    id: 'res-tg-12',
    title: 'Teacher Guide — Grade 12 Mathematical Literacy',
    type: 'Teacher Guide',
    grade: 12,
    subjectId: 'mat-lit',
    pages: 140,
    updated: '2026 edition',
    description: 'Lesson pacing, teaching notes, common misconceptions and full memoranda for the Learner Book.',
  },
  {
    id: 'res-test-fin-12',
    title: 'Finance Topic Test — Grade 12',
    type: 'Test',
    grade: 12,
    subjectId: 'mat-lit',
    topicId: 'finance',
    updated: 'Term 1',
    description: '45-minute topic test covering budgets, interest and financial documents. 40 marks.',
  },
  {
    id: 'res-memo-fin-12',
    title: 'Finance Topic Test Memo — Grade 12',
    type: 'Memo',
    grade: 12,
    subjectId: 'mat-lit',
    topicId: 'finance',
    updated: 'Term 1',
    description: 'Full marking memorandum with method marks indicated for the Finance topic test.',
  },
  {
    id: 'res-lb-11',
    title: 'Mathematical Literacy Learner Book — Grade 11',
    type: 'Learner Book',
    grade: 11,
    subjectId: 'mat-lit',
    pages: 198,
    updated: '2026 edition',
    description: 'Full CAPS-aligned learner book for Grade 11 with real-life South African contexts.',
  },
  {
    id: 'res-wb-11',
    title: 'Mathematical Literacy Workbook — Grade 11',
    type: 'Workbook',
    grade: 11,
    subjectId: 'mat-lit',
    pages: 88,
    updated: '2026 edition',
    description: 'Structured practice with increasing difficulty across all Grade 11 topics.',
  },
  {
    id: 'res-tg-11',
    title: 'Teacher Guide — Grade 11 Mathematical Literacy',
    type: 'Teacher Guide',
    grade: 11,
    subjectId: 'mat-lit',
    pages: 128,
    updated: '2026 edition',
    description: 'Term-by-term teaching plan aligned to the Grade 11 Learner Book and Workbook.',
  },
  {
    id: 'res-test-tar-11',
    title: 'Tariffs & Data Handling Test — Grade 11',
    type: 'Test',
    grade: 11,
    subjectId: 'mat-lit',
    topicId: 'finance',
    updated: 'Term 2',
    description: 'Combined topic test with municipal accounts and data interpretation questions. 50 marks.',
  },
  {
    id: 'res-memo-tar-11',
    title: 'Tariffs & Data Handling Memo — Grade 11',
    type: 'Memo',
    grade: 11,
    subjectId: 'mat-lit',
    topicId: 'finance',
    updated: 'Term 2',
    description: 'Marking guideline for the Tariffs & Data Handling topic test.',
  },
  {
    id: 'res-lb-10',
    title: 'Mathematical Literacy Learner Book — Grade 10',
    type: 'Learner Book',
    grade: 10,
    subjectId: 'mat-lit',
    pages: 176,
    updated: '2026 edition',
    description: 'Foundation-building learner book introducing core Mathematical Literacy skills.',
  },
  {
    id: 'res-wb-10',
    title: 'Mathematical Literacy Workbook — Grade 10',
    type: 'Workbook',
    grade: 10,
    subjectId: 'mat-lit',
    pages: 80,
    updated: '2026 edition',
    description: 'Guided practice exercises to build confidence with numbers, measurement and data.',
  },
  {
    id: 'res-tg-10',
    title: 'Teacher Guide — Grade 10 Mathematical Literacy',
    type: 'Teacher Guide',
    grade: 10,
    subjectId: 'mat-lit',
    pages: 110,
    updated: '2026 edition',
    description: 'Foundational teaching notes and full memoranda for the Grade 10 Learner Book.',
  },
]

export const filterResources = (opts: {
  grade?: number
  subjectId?: string
  topicId?: string
  type?: string
}) =>
  resources.filter(
    (r) =>
      (!opts.grade || r.grade === opts.grade) &&
      (!opts.subjectId || r.subjectId === opts.subjectId) &&
      (!opts.topicId || r.topicId === opts.topicId) &&
      (!opts.type || r.type === opts.type),
  )
