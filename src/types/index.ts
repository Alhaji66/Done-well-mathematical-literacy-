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
