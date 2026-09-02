import type { Subject } from "../types";

export const subjects: Subject[] = [
  { id: "maths-lit", name: "Mathematical Literacy", grades: [10, 11, 12] },
  { id: "maths", name: "Mathematics", grades: [10, 11, 12] },
  { id: "english-hl", name: "English Home Language", grades: [10, 11, 12] },
];

// The demo experience is built out fully for Mathematical Literacy; other
// subjects appear in selectors to show the platform's intended breadth.
export const primarySubjectId = "maths-lit";
