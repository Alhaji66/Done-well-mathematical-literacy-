/**
 * The DBE 2024-2025 Programme of Assessment as a plain table, apart from the
 * task sheets and the question bank that sba.ts builds the tasks from, so that
 * a page needing only a task's name (a notification, an audit entry) does not
 * load them. See sba.ts for where each figure comes from.
 */
import type { SheetKind } from './sbaTaskSheets'
import type { Grade } from '@/types'

export type TaskKind = 'Test' | 'Assignment' | 'Examination' | SheetKind
export type ExamKind = 'mid-year' | 'preparatory' | 'end-of-year' | 'final'

/** [term, kind, title, raw total, term weight, SBA weight, exam, papers] */
export type Row = [1 | 2 | 3 | 4, TaskKind, string, number, number?, number?, ExamKind?, string?]

export const PROGRAMMES: Record<string, Row[]> = {
  // 26. Mathematics
  'mathematics-10': [
    [1, 'Investigation', 'Investigation or project', 50, 25, 15],
    [1, 'Test', 'Test', 50, 75, 14],
    [2, 'Assignment', 'Assignment', 50, 25, 15],
    [2, 'Examination', 'Mid-year examination', 100, 75, 14, 'mid-year'],
    [3, 'Test', 'Test 1', 50, 25, 14],
    [3, 'Test', 'Test 2', 50, 75, 14],
    [3, 'Test', 'Test 3', 50, 0, 14],
    [4, 'Examination', 'End-of-year examination', 200, undefined, undefined, 'end-of-year', '2 papers × 100 marks, 2 hours each'],
  ],
  'mathematics-11': [
    [1, 'Investigation', 'Investigation or project', 50, 25, 15],
    [1, 'Test', 'Test', 50, 75, 14],
    [2, 'Assignment', 'Assignment', 50, 25, 15],
    [2, 'Examination', 'Mid-year examination', 200, 75, 14, 'mid-year'],
    [3, 'Test', 'Test 1', 50, 25, 14],
    [3, 'Test', 'Test 2', 50, 75, 14],
    [3, 'Test', 'Test 3', 50, 0, 14],
    [4, 'Examination', 'End-of-year examination', 300, undefined, undefined, 'end-of-year', '2 papers × 150 marks'],
  ],
  'mathematics-12': [
    [1, 'Investigation', 'Investigation or project', 50, 25, 15],
    [1, 'Test', 'Test', 50, 75, 15],
    [2, 'Assignment', 'Assignment', 50, 25, 15],
    [2, 'Examination', 'Mid-year examination', 300, 75, 15, 'mid-year'],
    [3, 'Test', 'Test', 50, 25, 15],
    [3, 'Examination', 'Preparatory examination', 300, 75, 25, 'preparatory'],
    [4, 'Examination', 'NSC final examination', 300, undefined, undefined, 'final', '2 papers × 150 marks, 3 hours each'],
  ],
  // 25. Mathematical Literacy
  'mat-lit-10': [
    [1, 'Investigation', 'Investigation', 50, 40, 10],
    [1, 'Test', 'Controlled test 1', 50, 60, 20],
    [2, 'Assignment', 'Assignment', 50, 40, 10],
    [2, 'Examination', 'June examination', 100, 60, 30, 'mid-year', '2 papers × 50 marks, 1 hour each'],
    [3, 'Assignment', 'Assignment', 50, 40, 10],
    [3, 'Test', 'Controlled test 2', 50, 60, 20],
    [4, 'Examination', 'End-of-year examination', 150, undefined, undefined, 'end-of-year', '2 papers × 75 marks, 1,5 hours each'],
  ],
  'mat-lit-11': [
    [1, 'Investigation', 'Investigation', 50, 40, 10],
    [1, 'Test', 'Controlled test 1', 50, 60, 20],
    [2, 'Assignment', 'Assignment', 50, 40, 10],
    [2, 'Examination', 'June examination', 150, 60, 30, 'mid-year', '2 papers × 75 marks, 1,5 hours each'],
    [3, 'Assignment', 'Assignment', 50, 40, 10],
    [3, 'Test', 'Controlled test 2', 50, 60, 20],
    [4, 'Examination', 'End-of-year examination', 200, undefined, undefined, 'end-of-year', '2 papers × 100 marks, 2 hours each'],
  ],
  'mat-lit-12': [
    [1, 'Investigation', 'Investigation', 50, 25, 10],
    [1, 'Test', 'Controlled test 1', 50, 75, 15],
    [2, 'Assignment', 'Assignment', 50, 25, 10],
    [2, 'Examination', 'June examination or controlled test', 200, 75, 25, 'mid-year', '2 papers × 100 marks, 2 hours each'],
    [3, 'Test', 'Controlled test 2', 50, 25, 15],
    [3, 'Examination', 'Preparatory examination', 300, 75, 25, 'preparatory', '2 papers × 150 marks, 3 hours each'],
    [4, 'Examination', 'NSC final examination', 300, undefined, undefined, 'final', '2 papers × 150 marks, 3 hours each'],
  ],
  // 31. Physical Sciences
  'physical-sciences-10': [
    [1, 'Test', 'Controlled test', 75, 100, 25],
    [2, 'Examination', 'June examination', 100, 60, 25, 'mid-year'],
    [2, 'Experiment', 'Experiment', 50, 40, 12.5],
    [3, 'Test', 'Controlled test', 75, 40, 25],
    [3, 'Experiment', 'Experiment', 50, 60, 12.5],
    [4, 'Examination', 'End-of-year examination', 200, undefined, undefined, 'end-of-year', '2 papers × 100 marks, 2 hours each'],
  ],
  'physical-sciences-11': [
    [1, 'Test', 'Controlled test', 100, 60, 25],
    [1, 'Experiment', 'Experiment', 50, 40, 12.5],
    [2, 'Examination', 'June examination', 200, 100, 25, 'mid-year'],
    [3, 'Test', 'Controlled test', 100, 60, 25],
    [3, 'Experiment', 'Experiment', 50, 40, 12.5],
    [4, 'Examination', 'End-of-year examination', 300, undefined, undefined, 'end-of-year', '2 papers × 150 marks, 3 hours each'],
  ],
  'physical-sciences-12': [
    [1, 'Test', 'Controlled test', 100, 75, 20],
    [1, 'Experiment', 'Experiment', 50, 25, 15],
    [2, 'Examination', 'June examination or controlled test', 300, 100, 20, 'mid-year'],
    [3, 'Examination', 'Preparatory examination', 300, 75, 30, 'preparatory'],
    [3, 'Experiment', 'Experiment', 50, 25, 15],
    [4, 'Examination', 'NSC final examination', 300, undefined, undefined, 'final', '2 papers × 150 marks, 3 hours each'],
  ],
  // 24. Life Sciences
  'life-sciences-10': [
    [1, 'Practical task', 'Practical task 1', 30, 25, 10],
    [1, 'Test', 'Controlled test 1', 50, 75, 20],
    [2, 'Assignment', 'Assignment', 50, 25, 20],
    [2, 'Examination', 'June examination', 150, 75, 20, 'mid-year'],
    [3, 'Practical task', 'Practical task 2', 30, 25, 10],
    [3, 'Test', 'Controlled test 2', 50, 75, 20],
    [4, 'Examination', 'End-of-year examination', 300, undefined, undefined, 'end-of-year', '2 papers × 150 marks, 2,5 hours each'],
  ],
  'life-sciences-11': [
    [1, 'Practical task', 'Practical task 1', 30, 25, 10],
    [1, 'Test', 'Controlled test 1', 50, 75, 20],
    [2, 'Assignment', 'Assignment', 50, 25, 20],
    [2, 'Examination', 'June examination', 150, 75, 20, 'mid-year'],
    [3, 'Practical task', 'Practical task 2', 30, 25, 10],
    [3, 'Test', 'Controlled test 2', 50, 75, 20],
    [4, 'Examination', 'End-of-year examination', 300, undefined, undefined, 'end-of-year', '2 papers × 150 marks, 2,5 hours each'],
  ],
  'life-sciences-12': [
    [1, 'Practical task', 'Practical task 1', 30, 25, 10],
    [1, 'Test', 'Controlled test 1', 50, 75, 15],
    [2, 'Practical task', 'Practical task 2', 30, 50, 10],
    [2, 'Examination', 'Controlled test or June examination', 150, 50, 15, 'mid-year'],
    [3, 'Assignment', 'Assignment', 50, 25, 20],
    [3, 'Examination', 'Preparatory examination', 300, 75, 30, 'preparatory', '2 papers × 150 marks, 2,5 hours each'],
    [4, 'Examination', 'NSC final examination', 300, undefined, undefined, 'final', '2 papers × 150 marks, 2,5 hours each'],
  ],
}

/** A task's name from its mark-book slot ("t1-0"), e.g. "Controlled test 1". */
export function sbaTaskTitle(subjectId: string, grade: Grade, slot: string): string | undefined {
  const i = Number(/^t[1-4]-(\d+)$/.exec(slot)?.[1])
  return PROGRAMMES[`${subjectId}-${grade}`]?.[i]?.[2].split(':')[0]
}
