import type { DemoUser, RoleId } from "../types";

export const demoUsers: Record<RoleId, DemoUser> = {
  learner: {
    id: "u-learner",
    name: "Lindiwe Khumalo",
    role: "learner",
    email: "lindiwe.demo@donewell.co.za",
    meta: { grade: "Grade 12", school: "Ithemba Secondary School" },
  },
  parent: {
    id: "u-parent",
    name: "Mrs. Khumalo",
    role: "parent",
    email: "parent.demo@donewell.co.za",
    meta: { child: "Lindiwe Khumalo", grade: "Grade 12" },
  },
  teacher: {
    id: "u-teacher",
    name: "Ms. P. Dlamini",
    role: "teacher",
    email: "teacher.demo@donewell.co.za",
    meta: { subject: "Mathematical Literacy", school: "Ithemba Secondary School" },
  },
  school: {
    id: "u-school",
    name: "Ithemba Secondary School",
    role: "school",
    email: "admin.demo@donewell.co.za",
    meta: { role: "School Administrator" },
  },
};

export const roleLabels: Record<RoleId, string> = {
  learner: "Learner",
  parent: "Parent",
  teacher: "Teacher",
  school: "School",
};
