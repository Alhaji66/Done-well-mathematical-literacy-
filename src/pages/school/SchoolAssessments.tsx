import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { assessments } from "../../data/assessments";
import { schoolGradeBreakdown } from "../../data/school";
import { getTopic } from "../../data/topics";
import { formatDate } from "../../lib/format";
import type { AssessmentStatus } from "../../types";

const statusTone: Record<AssessmentStatus, "navy" | "gold" | "green" | "red" | "neutral"> = {
  upcoming: "gold",
  completed: "green",
  missed: "red",
  "in-progress": "navy",
};

export function SchoolAssessments() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Assessments"
        title="School-wide assessments"
        description="Test completion across the school, sourced from Done Well weekly and revision tests."
      />

      <Card padded={false} className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-400">
            <tr>
              <th className="px-5 py-3 font-medium sm:px-6">Assessment</th>
              <th className="px-5 py-3 font-medium sm:px-6">Topic</th>
              <th className="px-5 py-3 font-medium sm:px-6">Due date</th>
              <th className="px-5 py-3 font-medium sm:px-6">Status</th>
              <th className="px-5 py-3 font-medium sm:px-6">Completion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {assessments.map((a) => {
              const gradeStats = schoolGradeBreakdown.find((g) => g.gradeLevel === a.gradeLevel);
              return (
                <tr key={a.id}>
                  <td className="px-5 py-3.5 font-medium text-navy-900 sm:px-6">{a.title}</td>
                  <td className="px-5 py-3.5 text-navy-600 sm:px-6">
                    {a.topicIds.map((id) => getTopic(id)?.name).filter(Boolean).join(", ")}
                  </td>
                  <td className="px-5 py-3.5 text-navy-600 sm:px-6">{formatDate(a.dueDate)}</td>
                  <td className="px-5 py-3.5 sm:px-6">
                    <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-navy-700 sm:px-6">
                    {gradeStats ? `${gradeStats.testCompletionPercent}%` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
