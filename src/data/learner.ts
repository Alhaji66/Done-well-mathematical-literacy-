import type { LearnerProfile } from "../types";
import { assessments } from "./assessments";

function offsetDate(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

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
    { topicId: "finance", masteryPercent: 76, questionsAttempted: 34, lastPractisedAt: offsetDate(-2) },
    { topicId: "data-handling", masteryPercent: 64, questionsAttempted: 21, lastPractisedAt: offsetDate(-4) },
    { topicId: "maps-plans", masteryPercent: 48, questionsAttempted: 12, lastPractisedAt: offsetDate(-9) },
    { topicId: "measurement", masteryPercent: 55, questionsAttempted: 15, lastPractisedAt: offsetDate(-11) },
    { topicId: "probability", masteryPercent: 70, questionsAttempted: 18, lastPractisedAt: offsetDate(-5) },
    { topicId: "tariffs", masteryPercent: 33, questionsAttempted: 6, lastPractisedAt: offsetDate(-30) },
    { topicId: "profit-loss-breakeven", masteryPercent: 41, questionsAttempted: 9, lastPractisedAt: offsetDate(-16) },
  ],
  recentScores: [
    { assessmentId: "as-1", scorePercent: 76, date: assessments.find((a) => a.id === "as-1")!.dueDate },
    { assessmentId: "as-2", scorePercent: 64, date: assessments.find((a) => a.id === "as-2")!.dueDate },
    { assessmentId: "as-3", scorePercent: 58, date: assessments.find((a) => a.id === "as-3")!.dueDate },
  ],
};

export function weakestTopics(count = 2) {
  return [...demoLearner.topicProgress].sort((a, b) => a.masteryPercent - b.masteryPercent).slice(0, count);
}
