import type { LearnerProfile } from "../types";

export const demoLearner: LearnerProfile = {
  id: "learner-1",
  name: "Lindiwe Khumalo",
  gradeLevel: 12,
  subjectId: "maths-lit",
  avatarInitials: "LK",
  weeklyActivityMinutes: 95,
  weeklyTarget: 150,
  overallMasteryPercent: 62,
  streakDays: 4,
  topicProgress: [
    { topicId: "finance", masteryPercent: 76, questionsAttempted: 34, lastPractisedAt: "2026-02-27" },
    { topicId: "data-handling", masteryPercent: 64, questionsAttempted: 21, lastPractisedAt: "2026-02-25" },
    { topicId: "maps-plans", masteryPercent: 48, questionsAttempted: 12, lastPractisedAt: "2026-02-20" },
    { topicId: "measurement", masteryPercent: 55, questionsAttempted: 15, lastPractisedAt: "2026-02-18" },
    { topicId: "probability", masteryPercent: 70, questionsAttempted: 18, lastPractisedAt: "2026-02-24" },
    { topicId: "tariffs", masteryPercent: 33, questionsAttempted: 6, lastPractisedAt: "2026-01-30" },
    { topicId: "profit-loss-breakeven", masteryPercent: 41, questionsAttempted: 9, lastPractisedAt: "2026-02-10" },
  ],
  recentScores: [
    { assessmentId: "as-1", scorePercent: 76, date: "2026-02-06" },
    { assessmentId: "as-2", scorePercent: 64, date: "2026-02-13" },
    { assessmentId: "as-3", scorePercent: 58, date: "2026-02-20" },
  ],
};

export function weakestTopics(count = 2) {
  return [...demoLearner.topicProgress].sort((a, b) => a.masteryPercent - b.masteryPercent).slice(0, count);
}
