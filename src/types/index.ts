export type Grade = 10 | 11 | 12

export type Difficulty = 'Easy' | 'Moderate' | 'Challenge'

export interface Subject {
  id: string
  name: string
  grades: Grade[]
}

export interface Topic {
  id: string
  subjectId: string
  name: string
  description: string
  grades: Grade[]
  /**
   * The examination paper this topic is written in, where a subject splits its
   * content across two papers that are examined separately.
   *
   * Physical Sciences is the only subject here that does: Paper 1 is Physics and
   * Paper 2 is Chemistry, and a learner revising for one sits an exam that
   * contains none of the other. A flat list of 13 topics hides that entirely.
   *
   * Derived from the papers rather than typed by hand -- every Physical Sciences
   * topic appears in exactly one paper at every grade, with none ambiguous and
   * none unmapped, so the split is a fact about the corpus rather than a
   * judgement call. Subjects examined as one body of content leave this unset.
   */
  strand?: string
}

export type ResourceType = 'Learner Book' | 'Workbook' | 'Teacher Guide' | 'Test' | 'Memo'

export interface Resource {
  id: string
  title: string
  type: ResourceType
  grade: Grade
  subjectId: string
  topicId?: string
  pages?: number
  updated: string
  description: string
}

export interface QuestionOption {
  id: string
  label: string
}

/**
 * The CAPS cognitive level an exam question sits at. Each subject names its
 * four levels differently -- see capsWeighting.ts -- but the shape is common:
 * 1 is recall, 2 is understanding a familiar idea, 3 is applying it to
 * something new or working with data, 4 is judging, evaluating or arguing.
 *
 * This is SEPARATE from `difficulty` on purpose. Difficulty is what a learner
 * filters by and reads as "how hard will this feel"; cognitive level is what
 * CAPS weights an exam paper by. They usually agree, and where they do not
 * it is the cognitive level that decides whether a paper meets its target.
 */
export type CognitiveLevel = 1 | 2 | 3 | 4

export interface Question {
  id: string
  topicId: string
  grade: Grade
  difficulty: Difficulty
  /**
   * Optional so the field can be backfilled a subject at a time rather than
   * in one unreviewable sweep. Where it is absent the coverage report says
   * "not yet levelled" instead of guessing -- an absent level is honest, an
   * inferred one is not.
   */
  cognitiveLevel?: CognitiveLevel
  marks: number
  prompt: string
  context?: string
  options?: QuestionOption[]
  correctOptionId?: string
  answer: string
  explanation: string
  /**
   * The NSC-style marking memo: where each mark in this question is actually
   * earned. Optional, because writing one by hand for all 5 502 paper items is
   * not something that could be finished or kept current, and a GUESSED memo
   * is worse than none -- a learner will trust it and mis-mark their own work.
   * Where it is absent the card simply does not show a memo.
   */
  memo?: MemoStep[]
  /**
   * An inline SVG figure to show with the question, by id. Optional and rare:
   * a sweep found that no question in the corpus depends on a diagram, so a
   * figure is attached only where the picture genuinely teaches something the
   * prose cannot.
   */
  figure?: FigureId
  /**
   * A figure shown only once the answer is revealed.
   *
   * Separate from `figure` because placement is the whole point for a question
   * that asks the learner to DRAW something. "Draw a labelled free-body diagram
   * of the forces on the block" is the commonest opening in an NSC Paper 1, and
   * rendering the finished diagram beside the prompt would answer it for them.
   * They draw it on paper, then check it against this.
   */
  answerFigure?: FigureId
}

/** Figures live in src/components/practise/Figure.tsx. */
export type FigureId =
  | 'cast-diagram'
  | 'surd-number-line'
  | 'charges-on-a-line'
  | 'fbd-incline'
  | 'fbd-lift'
  | 'fbd-connected'

/**
 * A mark code as used in the official NSC marking guidelines.
 *
 * These are the codes a marker writes in the margin, and knowing them changes
 * how a learner writes an answer -- most obviously CA, which is why showing
 * your working is worth real marks: an early arithmetic slip costs one A mark
 * rather than the whole question, but only if the method after it is visible.
 */
export type MemoCode = 'M' | 'A' | 'CA' | 'S' | 'SF' | 'R' | 'RT' | 'C' | 'J'

export const MEMO_CODE_MEANINGS: Record<MemoCode, string> = {
  M: 'Method — for choosing and setting out a correct method, even if the number that comes out is wrong',
  A: 'Accuracy — for the correct value or statement',
  CA: 'Continued accuracy — for correctly carrying forward an earlier answer, even one that was wrong',
  S: 'Substitution — for putting the right values into the right places',
  SF: 'Substitution into a formula — for both quoting the formula and substituting correctly',
  R: 'Reason — for the justification, not the answer it supports',
  RT: 'Reading from a table, graph or diagram',
  C: 'Conversion — for converting to the correct unit',
  J: 'Justification — for the argument that settles the question',
}

export interface MemoStep {
  code: MemoCode
  /** Marks this step earns. The steps must add up to the question's marks. */
  marks: number
  /** What has to be on the page to earn them. */
  text: string
}

export type AssessmentStatus = 'upcoming' | 'completed' | 'missed' | 'in_progress'

export interface Assessment {
  id: string
  title: string
  grade: Grade
  subjectId: string
  topicIds: string[]
  type: 'Weekly Test' | 'Revision Test' | 'Formal Test'
  totalMarks: number
  durationMinutes: number
  date: string
  status: AssessmentStatus
  scorePercent?: number
}

export interface TopicProgress {
  topicId: string
  masteryPercent: number
  questionsAttempted: number
  trend: 'up' | 'down' | 'steady'
}

export interface WeeklyActivityPoint {
  label: string
  minutes: number
}

export interface LearnerProfile {
  id: string
  name: string
  grade: Grade
  subjectId: string
  avatarInitials: string
  weeklyActivity: WeeklyActivityPoint[]
  topicProgress: TopicProgress[]
  recentScores: { assessmentId: string; label: string; percent: number; date: string }[]
  overallMasteryPercent: number
  streakDays: number
}
