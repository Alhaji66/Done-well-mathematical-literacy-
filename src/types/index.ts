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

export interface Question {
  id: string
  topicId: string
  grade: Grade
  difficulty: Difficulty
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
