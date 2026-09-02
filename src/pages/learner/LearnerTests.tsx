import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { assessments } from "../../data/assessments";
import { getTopic } from "../../data/topics";
import { daysUntil, formatDate } from "../../lib/format";
import { IconClock } from "../../lib/icons";
import type { Assessment, AssessmentStatus } from "../../types";

const statusTone: Record<AssessmentStatus, "navy" | "gold" | "green" | "red" | "neutral"> = {
  upcoming: "gold",
  completed: "green",
  missed: "red",
  "in-progress": "navy",
};

const statusLabel: Record<AssessmentStatus, string> = {
  upcoming: "Upcoming",
  completed: "Completed",
  missed: "Missed",
  "in-progress": "In progress",
};

export function LearnerTests() {
  const sorted = [...assessments].sort((a, b) => (a.dueDate < b.dueDate ? 1 : -1));

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Tests"
        title="Weekly & revision tests"
        description="Sample tests linked to your topics, with marks and time allowed."
      />

      <div className="space-y-3">
        {sorted.map((a) => (
          <TestRow key={a.id} assessment={a} />
        ))}
      </div>
    </div>
  );
}

function TestRow({ assessment: a }: { assessment: Assessment }) {
  const [expanded, setExpanded] = useState(false);
  const topicNames = a.topicIds.map((id) => getTopic(id)?.name).filter(Boolean).join(", ");

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display font-semibold text-navy-900">{a.title}</p>
            <Badge tone={statusTone[a.status]}>{statusLabel[a.status]}</Badge>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-500">
            <span>{a.totalMarks} marks</span>
            <span className="flex items-center gap-1">
              <IconClock className="h-3.5 w-3.5" />
              {a.durationMinutes} min
            </span>
            <span>{topicNames}</span>
          </div>
          <p className="mt-1 text-xs text-navy-400">
            {a.status === "upcoming"
              ? `Due ${formatDate(a.dueDate)} · in ${daysUntil(a.dueDate)} days`
              : formatDate(a.dueDate)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
          {a.scorePercent !== undefined ? (
            <p className={`text-lg font-bold ${a.scorePercent >= 60 ? "text-emerald-600" : "text-gold-600"}`}>
              {a.scorePercent}%
            </p>
          ) : null}
          {a.status === "completed" ? (
            <Button size="sm" variant="outline" onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Hide results" : "View results"}
            </Button>
          ) : (
            <Button as="link" to={`/learner/practise?topic=${a.topicIds[0]}`} size="sm" variant="primary">
              {a.status === "missed" ? "Attempt now" : "Start test"}
            </Button>
          )}
        </div>
      </div>

      {expanded ? (
        <div className="mt-4 rounded-lg bg-navy-50/70 p-4">
          <p className="text-sm font-semibold text-navy-800">Result breakdown</p>
          <p className="mt-1 text-sm text-navy-600">
            You scored {a.scorePercent}% ({Math.round(((a.scorePercent ?? 0) / 100) * a.totalMarks)} / {a.totalMarks}{" "}
            marks) on {topicNames}.
          </p>
          <p className="mt-2 text-sm text-navy-500">
            Want to improve this score? Practise {topicNames} again before your next test.
          </p>
          <Button as="link" to={`/learner/practise?topic=${a.topicIds[0]}`} size="sm" variant="outline" className="mt-3">
            Practise this topic
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
