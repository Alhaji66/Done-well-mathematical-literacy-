import type { LearnerProfile } from '@/types'

export const demoLearner: LearnerProfile = {
  id: 'learner-1',
  name: 'Karabo Mokoena',
  grade: 12,
  subjectId: 'mat-lit',
  avatarInitials: 'KM',
  weeklyActivity: [
    { label: 'Mon', minutes: 25 },
    { label: 'Tue', minutes: 40 },
    { label: 'Wed', minutes: 15 },
    { label: 'Thu', minutes: 35 },
    { label: 'Fri', minutes: 20 },
    { label: 'Sat', minutes: 50 },
    { label: 'Sun', minutes: 10 },
  ],
  topicProgress: [
    { topicId: 'finance', masteryPercent: 72, questionsAttempted: 34, trend: 'up' },
    { topicId: 'tariffs', masteryPercent: 58, questionsAttempted: 21, trend: 'up' },
    { topicId: 'data-handling', masteryPercent: 64, questionsAttempted: 26, trend: 'steady' },
    { topicId: 'maps-plans', masteryPercent: 41, questionsAttempted: 12, trend: 'down' },
    { topicId: 'measurement', masteryPercent: 69, questionsAttempted: 19, trend: 'up' },
    { topicId: 'probability', masteryPercent: 55, questionsAttempted: 9, trend: 'steady' },
    { topicId: 'profit-loss-breakeven', masteryPercent: 33, questionsAttempted: 6, trend: 'down' },
  ],
  recentScores: [
    { assessmentId: 'as-2', label: 'Revision Test: Tariffs & Measurement', percent: 78, date: '2026-08-28' },
    { assessmentId: 'as-3', label: 'Weekly Test: Data Handling', percent: 64, date: '2026-08-21' },
    { assessmentId: 'as-5', label: 'Formal Test: Finance, Tariffs & Probability', percent: 71, date: '2026-08-07' },
  ],
  overallMasteryPercent: 56,
  streakDays: 4,
}
