export interface ClassLearner {
  id: string
  name: string
  masteryPercent: number
  lastActive: string
  trend: 'up' | 'down' | 'steady'
  riskLevel: 'low' | 'medium' | 'high'
}

export const classLearners: ClassLearner[] = [
  { id: 'l-1', name: 'Karabo Mokoena', masteryPercent: 59, lastActive: 'Today', trend: 'up', riskLevel: 'medium' },
  { id: 'l-2', name: 'Ayesha Patel', masteryPercent: 84, lastActive: 'Today', trend: 'up', riskLevel: 'low' },
  { id: 'l-3', name: 'Sipho Ndlovu', masteryPercent: 38, lastActive: '2 days ago', trend: 'down', riskLevel: 'high' },
  { id: 'l-4', name: 'Lerato Dlamini', masteryPercent: 71, lastActive: 'Yesterday', trend: 'steady', riskLevel: 'low' },
  { id: 'l-5', name: 'Johan van der Merwe', masteryPercent: 45, lastActive: '3 days ago', trend: 'down', riskLevel: 'high' },
  { id: 'l-6', name: 'Naledi Khumalo', masteryPercent: 63, lastActive: 'Today', trend: 'up', riskLevel: 'medium' },
  { id: 'l-7', name: 'Kagiso Mahlangu', masteryPercent: 90, lastActive: 'Today', trend: 'steady', riskLevel: 'low' },
  { id: 'l-8', name: 'Precious Nkosi', masteryPercent: 29, lastActive: '5 days ago', trend: 'down', riskLevel: 'high' },
]

export interface TeacherProfile {
  id: string
  name: string
  subjectId: string
  grades: number[]
  classes: { id: string; name: string; grade: number; learnerCount: number }[]
}

export const demoTeacher: TeacherProfile = {
  id: 'teacher-1',
  name: 'Alhaji T',
  subjectId: 'mat-lit',
  grades: [11, 12],
  classes: [
    { id: 'c-12a', name: 'Grade 12A', grade: 12, learnerCount: 34 },
    { id: 'c-12b', name: 'Grade 12B', grade: 12, learnerCount: 31 },
    { id: 'c-11a', name: 'Grade 11A', grade: 11, learnerCount: 36 },
  ],
}

export interface TopicPerformance {
  topicId: string
  averagePercent: number
}

export const classTopicPerformance: TopicPerformance[] = [
  { topicId: 'finance', averagePercent: 64 },
  { topicId: 'data-handling', averagePercent: 71 },
  { topicId: 'maps-plans', averagePercent: 49 },
  { topicId: 'measurement', averagePercent: 65 },
]

export interface QuestionPerformance {
  questionId: string
  correctPercent: number
}

export const questionPerformance: QuestionPerformance[] = [
  { questionId: 'fin-m1', correctPercent: 74 },
  { questionId: 'tar-c1', correctPercent: 38 },
  { questionId: 'dat-m1', correctPercent: 81 },
  { questionId: 'map-c1', correctPercent: 29 },
  { questionId: 'plb-m1', correctPercent: 45 },
]

export interface SchoolStats {
  learnerCount: number
  activeLearners: number
  averagePracticeScore: number
  strongestTopicId: string
  weakestTopicId: string
  testCompletionPercent: number
}

export const schoolStats: SchoolStats = {
  learnerCount: 842,
  activeLearners: 611,
  averagePracticeScore: 63,
  strongestTopicId: 'data-handling',
  weakestTopicId: 'maps-plans',
  testCompletionPercent: 76,
}

export interface SchoolTeacherSummary {
  id: string
  name: string
  subjectId: string
  grades: number[]
  learnerCount: number
  classAverage: number
}

export const schoolTeachers: SchoolTeacherSummary[] = [
  { id: 't-1', name: 'Alhaji T', subjectId: 'mat-lit', grades: [11, 12], learnerCount: 101, classAverage: 63 },
  { id: 't-2', name: 'Mangyani T.S', subjectId: 'mat-lit', grades: [10], learnerCount: 118, classAverage: 58 },
  { id: 't-3', name: 'Ms. F. Adams', subjectId: 'mathematics', grades: [10, 11], learnerCount: 96, classAverage: 66 },
  { id: 't-4', name: 'Mr. T. Sithole', subjectId: 'life-sciences', grades: [11, 12], learnerCount: 88, classAverage: 61 },
]

export interface SchoolGradeSummary {
  grade: number
  learnerCount: number
  averageScore: number
  testCompletionPercent: number
}

export const schoolGradeSummaries: SchoolGradeSummary[] = [
  { grade: 10, learnerCount: 298, averageScore: 59, testCompletionPercent: 71 },
  { grade: 11, learnerCount: 276, averageScore: 62, testCompletionPercent: 77 },
  { grade: 12, learnerCount: 268, averageScore: 66, testCompletionPercent: 81 },
]

export interface InterventionPriority {
  id: string
  label: string
  detail: string
  severity: 'high' | 'medium'
}

export const interventionPriorities: InterventionPriority[] = [
  {
    id: 'ip-1',
    label: 'Profit, Loss & Breakeven (within Finance) — Grade 12',
    detail: 'This Finance sub-area is averaging 40% across all Grade 12 classes, well below the Finance topic average. Recommend targeted small-group revision before the next formal test.',
    severity: 'high',
  },
  {
    id: 'ip-2',
    label: 'Maps and Plans — Grade 11',
    detail: 'Average of 49%. Common error pattern: scale conversion mistakes. Suggest a focused workbook session.',
    severity: 'high',
  },
  {
    id: 'ip-3',
    label: '19 learners inactive for 5+ days',
    detail: 'Spread across Grade 10 and 11. A reminder nudge or parent contact is recommended.',
    severity: 'medium',
  },
]
