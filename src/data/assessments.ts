import type { Assessment } from "../types";

function offsetDate(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const assessments: Assessment[] = [
  {
    id: "as-1",
    title: "Weekly Test: Finance Basics",
    gradeLevel: 12,
    subjectId: "maths-lit",
    topicIds: ["finance"],
    totalMarks: 25,
    durationMinutes: 30,
    dueDate: offsetDate(-26),
    status: "completed",
    scorePercent: 76,
  },
  {
    id: "as-2",
    title: "Weekly Test: Data Handling",
    gradeLevel: 12,
    subjectId: "maths-lit",
    topicIds: ["data-handling"],
    totalMarks: 20,
    durationMinutes: 25,
    dueDate: offsetDate(-19),
    status: "completed",
    scorePercent: 64,
  },
  {
    id: "as-3",
    title: "Revision Test: Maps & Plans",
    gradeLevel: 12,
    subjectId: "maths-lit",
    topicIds: ["maps-plans"],
    totalMarks: 30,
    durationMinutes: 40,
    dueDate: offsetDate(-12),
    status: "completed",
    scorePercent: 58,
  },
  {
    id: "as-4",
    title: "Term Test: Finance & Measurement",
    gradeLevel: 12,
    subjectId: "maths-lit",
    topicIds: ["finance", "measurement"],
    totalMarks: 50,
    durationMinutes: 60,
    dueDate: offsetDate(10),
    status: "upcoming",
  },
  {
    id: "as-5",
    title: "Weekly Test: Probability",
    gradeLevel: 12,
    subjectId: "maths-lit",
    topicIds: ["probability"],
    totalMarks: 20,
    durationMinutes: 25,
    dueDate: offsetDate(17),
    status: "upcoming",
  },
  {
    id: "as-6",
    title: "Revision Test: Tariffs",
    gradeLevel: 12,
    subjectId: "maths-lit",
    topicIds: ["tariffs"],
    totalMarks: 25,
    durationMinutes: 30,
    dueDate: offsetDate(-33),
    status: "missed",
  },
];

export function getAssessment(id: string) {
  return assessments.find((a) => a.id === id);
}
