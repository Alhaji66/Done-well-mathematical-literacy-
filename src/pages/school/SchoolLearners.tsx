import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { schoolGradeBreakdown } from "../../data/school";
import { masteryColorClasses } from "../../lib/format";

export function SchoolLearners() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Learners"
        title="Learners by grade"
        description="A snapshot of enrolment and performance across each grade."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {schoolGradeBreakdown.map((g) => {
          const colors = masteryColorClasses(g.averageScorePercent);
          return (
            <Card key={g.gradeLevel}>
              <p className="font-display font-semibold text-navy-900">Grade {g.gradeLevel}</p>
              <p className="mt-1 text-sm text-navy-500">{g.learnerCount} learners</p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-500">Average score</span>
                  <span className={`font-semibold ${colors.text}`}>{g.averageScorePercent}%</span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar percent={g.averageScorePercent} colorClass={colors.bar} />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-500">Test completion</span>
                  <span className="font-semibold text-navy-700">{g.testCompletionPercent}%</span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar percent={g.testCompletionPercent} colorClass="bg-navy-800" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
