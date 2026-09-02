import type { SchoolSummary } from "../types";

export const demoSchool: SchoolSummary = {
  name: "Ithemba Secondary School",
  learnerCount: 612,
  activeLearnerCount: 487,
  teacherCount: 24,
  averagePracticeScorePercent: 61,
  strongestTopicId: "finance",
  weakestTopicId: "tariffs",
  testCompletionPercent: 82,
};

export interface SchoolGradeBreakdown {
  gradeLevel: 10 | 11 | 12;
  learnerCount: number;
  averageScorePercent: number;
  testCompletionPercent: number;
}

export const schoolGradeBreakdown: SchoolGradeBreakdown[] = [
  { gradeLevel: 10, learnerCount: 215, averageScorePercent: 58, testCompletionPercent: 79 },
  { gradeLevel: 11, learnerCount: 204, averageScorePercent: 63, testCompletionPercent: 84 },
  { gradeLevel: 12, learnerCount: 193, averageScorePercent: 64, testCompletionPercent: 85 },
];

export interface SchoolTeacherRow {
  id: string;
  name: string;
  subjects: string;
  classes: number;
  learners: number;
  averageScorePercent: number;
}

export const schoolTeachers: SchoolTeacherRow[] = [
  { id: "t-1", name: "Ms. P. Dlamini", subjects: "Mathematical Literacy", classes: 3, learners: 108, averageScorePercent: 66 },
  { id: "t-2", name: "Mr. S. van Wyk", subjects: "Mathematical Literacy", classes: 2, learners: 74, averageScorePercent: 59 },
  { id: "t-3", name: "Mrs. N. Mokoena", subjects: "Mathematics", classes: 3, learners: 96, averageScorePercent: 61 },
  { id: "t-4", name: "Mr. T. Naidoo", subjects: "Mathematical Literacy", classes: 2, learners: 68, averageScorePercent: 71 },
];

export const schoolInterventionPriorities = [
  { id: "sip-1", title: "Tariffs — school-wide weak spot", detail: "Average 39% across all Grade 12 classes. Recommend a shared re-teach resource.", priority: "high" as const },
  { id: "sip-2", title: "Grade 10 test completion lagging", detail: "79% completion vs 85% in Grade 12. Follow up with Grade 10 teachers on test scheduling.", priority: "medium" as const },
  { id: "sip-3", title: "125 learners inactive this month", detail: "612 enrolled vs 487 active in the last 30 days. Consider a practice-reminder campaign.", priority: "medium" as const },
];
