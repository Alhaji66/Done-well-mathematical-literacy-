import type { Subject } from '@/types'

export const subjects: Subject[] = [
  { id: 'mat-lit', name: 'Mathematical Literacy', grades: [10, 11, 12] },
  { id: 'mathematics', name: 'Mathematics', grades: [10, 11, 12] },
  { id: 'english-fal', name: 'English FAL', grades: [10, 11, 12] },
  { id: 'life-sciences', name: 'Life Sciences', grades: [10, 11, 12] },
]

export const getSubject = (id: string) => subjects.find((s) => s.id === id)
