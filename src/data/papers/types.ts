import type { Question, Grade } from '@/types'

/**
 * Full-length practice papers ("Assessments"), organised the way a real NSC
 * Mathematical Literacy/Mathematics paper is: numbered questions, each made
 * up of several sub-questions sharing one context/scenario.
 *
 * These are ORIGINAL papers written by DONE WELL -- modelled on the real
 * exam's style, topic weighting and difficulty, not transcriptions of any
 * actual past exam. We don't have a verified, accurate copy of the real
 * 2020-2025 papers to reproduce, so presenting invented content as if it
 * were the literal historical paper would risk misleading learners
 * studying for a real national exam. Every paper here is clearly labelled
 * "DONE WELL Practice Paper" in its title for exactly that reason -- see
 * the disclaimer shown in the Assessments UI.
 *
 * "Predicted" papers are DONE WELL's own best guess at likely topics and
 * question styles, not a guarantee of what will appear in the real exam.
 * Three independent sets are provided per paper so learners practise a
 * range of framings rather than memorising one specific set of numbers.
 *
 * Like the rest of the curriculum content in this app, papers are static
 * data (not database rows) -- only a learner's answers/progress are
 * persisted, via the same learner_progress table and recordAttempt() flow
 * used by ordinary topic practice (each sub-question already carries a
 * topicId).
 */

export interface PaperQuestionItem extends Question {
  /** Exam-style sub-question label, e.g. "1.1", "2.4". */
  label: string
}

export interface PaperSection {
  /** "QUESTION 1", "QUESTION 2", ... */
  number: number
  title: string
  topicId: string
  marks: number
  items: PaperQuestionItem[]
}

export type PaperKind = 'predicted' | 'past'

export interface Paper {
  id: string
  subjectId: string
  paperNumber: 1 | 2
  grade: Grade
  kind: PaperKind
  /** Only set when kind === 'past'. */
  year?: number
  /** Only set when kind === 'predicted'. */
  setLabel?: 'A' | 'B' | 'C'
  title: string
  durationMinutes: number
  totalMarks: number
  sections: PaperSection[]
}
