import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { classTopicPerformance } from "../../data/teacher";
import { schoolGradeBreakdown, schoolInterventionPriorities } from "../../data/school";
import { getTopic } from "../../data/topics";
import { masteryColorClasses } from "../../lib/format";

const priorityTone = { high: "red", medium: "gold", low: "navy" } as const;

export function SchoolAnalytics() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Analytics"
        title="School-wide performance"
        description="Simple, at-a-glance analytics across all grades — not a full BI dashboard."
      />

      <section>
        <SectionHeading eyebrow="By grade" title="Average score per grade" />
        <Card className="mt-4 space-y-4">
          {schoolGradeBreakdown.map((g) => {
            const colors = masteryColorClasses(g.averageScorePercent);
            return (
              <div key={g.gradeLevel}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-navy-800">Grade {g.gradeLevel}</span>
                  <span className={`font-semibold ${colors.text}`}>{g.averageScorePercent}%</span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar percent={g.averageScorePercent} colorClass={colors.bar} />
                </div>
              </div>
            );
          })}
        </Card>
      </section>

      <section>
        <SectionHeading eyebrow="By topic" title="Performance by topic (school-wide)" />
        <Card className="mt-4 space-y-4">
          {classTopicPerformance
            .slice()
            .sort((a, b) => b.averagePercent - a.averagePercent)
            .map((tp) => {
              const topic = getTopic(tp.topicId);
              const colors = masteryColorClasses(tp.averagePercent);
              if (!topic) return null;
              return (
                <div key={tp.topicId}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-navy-800">{topic.name}</span>
                    <span className={`font-semibold ${colors.text}`}>{tp.averagePercent}%</span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar percent={tp.averagePercent} colorClass={colors.bar} />
                  </div>
                </div>
              );
            })}
        </Card>
      </section>

      <section>
        <SectionHeading eyebrow="Recommended" title="Intervention priorities" />
        <div className="mt-4 space-y-3">
          {schoolInterventionPriorities.map((rec) => (
            <Card key={rec.id} className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-navy-900">{rec.title}</p>
                <p className="mt-1 text-sm text-navy-500">{rec.detail}</p>
              </div>
              <Badge tone={priorityTone[rec.priority]}>{rec.priority} priority</Badge>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
