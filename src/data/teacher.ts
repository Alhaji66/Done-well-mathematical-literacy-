import type { ClassSummary } from "../types";

export const demoClasses: ClassSummary[] = [
  { id: "class-12a", name: "Grade 12A", gradeLevel: 12, learnerCount: 38, averageScorePercent: 66 },
  { id: "class-12b", name: "Grade 12B", gradeLevel: 12, learnerCount: 35, averageScorePercent: 59 },
  { id: "class-11a", name: "Grade 11A", gradeLevel: 11, learnerCount: 40, averageScorePercent: 61 },
];

export interface TopicPerformance {
  topicId: string;
  averagePercent: number;
}

export const classTopicPerformance: TopicPerformance[] = [
  { topicId: "finance", averagePercent: 71 },
  { topicId: "data-handling", averagePercent: 63 },
  { topicId: "maps-plans", averagePercent: 47 },
  { topicId: "measurement", averagePercent: 58 },
  { topicId: "probability", averagePercent: 66 },
  { topicId: "tariffs", averagePercent: 39 },
  { topicId: "profit-loss-breakeven", averagePercent: 52 },
];

export interface QuestionPerformance {
  questionId: string;
  correctPercent: number;
}

export const questionPerformance: QuestionPerformance[] = [
  { questionId: "q-fin-1", correctPercent: 88 },
  { questionId: "q-fin-2", correctPercent: 61 },
  { questionId: "q-fin-3", correctPercent: 34 },
  { questionId: "q-dat-1", correctPercent: 91 },
  { questionId: "q-dat-2", correctPercent: 55 },
  { questionId: "q-map-1", correctPercent: 68 },
  { questionId: "q-map-2", correctPercent: 29 },
  { questionId: "q-tar-1", correctPercent: 37 },
];

export const interventionRecommendations = [
  {
    id: "int-1",
    title: "Tariffs needs a re-teach",
    detail: "Class average is 39% — the lowest of all topics. Revisit fixed-vs-usage charges before the next test.",
    priority: "high" as const,
    topicId: "tariffs",
  },
  {
    id: "int-2",
    title: "Maps & Plans: scale conversions",
    detail: "Learners struggle converting map distance to real-world units. Consider a worked-example drill.",
    priority: "high" as const,
    topicId: "maps-plans",
  },
  {
    id: "int-3",
    title: "Profit/Loss graphs need more practice",
    detail: "Breakeven questions involving equations (not just tables) show the biggest drop in accuracy.",
    priority: "medium" as const,
    topicId: "profit-loss-breakeven",
  },
];
