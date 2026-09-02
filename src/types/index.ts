// Core content model for the DONE WELL platform.
// This mirrors what a future Supabase schema would look like, so the mock
// data layer in src/data can be swapped for real API calls without the UI
// changing shape.

export type RoleId = "learner" | "parent" | "teacher" | "school";

export type GradeLevel = 10 | 11 | 12;

export interface Grade {
  id: string;
  level: GradeLevel;
  label: string;
}

export interface Subject {
  id: string;
  name: string;
  grades: GradeLevel[];
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  grades: GradeLevel[];
  icon: TopicIcon;
}

export type TopicIcon =
  | "finance"
  | "data"
  | "maps"
  | "measurement"
  | "probability"
  | "tariffs"
  | "profit";

export type ResourceType = "learner-book" | "workbook" | "teacher-guide" | "test" | "memo";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  gradeLevel: GradeLevel;
  subjectId: string;
  topicId?: string;
  description: string;
  fileSizeKb: number;
  updatedAt: string; // ISO date
}

export type Difficulty = "easy" | "moderate" | "challenge";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  topicId: string;
  gradeLevel: GradeLevel;
  difficulty: Difficulty;
  marks: number;
  prompt: string;
  context?: string;
  options?: QuestionOption[];
  correctOptionId?: string;
  correctAnswer?: string;
  explanation: string;
}

export type AssessmentStatus = "upcoming" | "completed" | "missed" | "in-progress";

export interface Assessment {
  id: string;
  title: string;
  gradeLevel: GradeLevel;
  subjectId: string;
  topicIds: string[];
  totalMarks: number;
  durationMinutes: number;
  dueDate: string; // ISO date
  status: AssessmentStatus;
  scorePercent?: number;
}

export interface TopicProgress {
  topicId: string;
  masteryPercent: number; // 0-100
  questionsAttempted: number;
  lastPractisedAt?: string;
}

export interface LearnerProfile {
  id: string;
  name: string;
  gradeLevel: GradeLevel;
  subjectId: string;
  avatarInitials: string;
  weeklyActivityMinutes: number;
  weeklyTarget: number;
  overallMasteryPercent: number;
  streakDays: number;
  topicProgress: TopicProgress[];
  recentScores: { assessmentId: string; scorePercent: number; date: string }[];
}

export interface ClassSummary {
  id: string;
  name: string;
  gradeLevel: GradeLevel;
  learnerCount: number;
  averageScorePercent: number;
}

export interface SchoolSummary {
  name: string;
  learnerCount: number;
  activeLearnerCount: number;
  teacherCount: number;
  averagePracticeScorePercent: number;
  strongestTopicId: string;
  weakestTopicId: string;
  testCompletionPercent: number;
}

export interface DemoUser {
  id: string;
  name: string;
  role: RoleId;
  email: string;
  meta?: Record<string, string>;
}
