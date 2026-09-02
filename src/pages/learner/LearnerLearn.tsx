import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { demoLearner } from "../../data/learner";
import { primarySubjectId, subjects } from "../../data/subjects";
import { topicsForGrade } from "../../data/topics";
import { topicIconMap } from "../../lib/icons";
import type { GradeLevel } from "../../types";

const grades: GradeLevel[] = [10, 11, 12];

export function LearnerLearn() {
  const [grade, setGrade] = useState<GradeLevel>(demoLearner.gradeLevel);
  const navigate = useNavigate();
  const subject = subjects.find((s) => s.id === primarySubjectId)!;
  const topics = topicsForGrade(grade);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Learn"
        title="Browse topics by grade"
        description="Start with Mathematical Literacy — other subjects are coming soon."
      />

      <div className="flex flex-wrap items-center gap-2">
        {grades.map((g) => (
          <button
            key={g}
            onClick={() => setGrade(g)}
            className={[
              "focus-ring rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              grade === g ? "bg-navy-900 text-white" : "bg-white text-navy-600 ring-1 ring-navy-200 hover:bg-navy-50",
            ].join(" ")}
          >
            Grade {g}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="gold">{subject.name}</Badge>
        <span className="text-sm text-navy-400">More subjects launching soon</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          const Icon = topicIconMap[topic.icon];
          return (
            <Card
              key={topic.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(`/learner/practise?topic=${topic.id}`)}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-800">
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-4 font-display font-semibold text-navy-900">{topic.name}</p>
              <p className="mt-1 text-sm text-navy-500">{topic.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
