import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { assessments } from "../../data/assessments";
import { demoLearner } from "../../data/learner";
import { getTopic } from "../../data/topics";
import { formatDate, masteryColorClasses, masteryLabel } from "../../lib/format";
import { topicIconMap } from "../../lib/icons";

export function ParentMyChild() {
  const completedTests = assessments.filter((a) => a.status === "completed");

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 font-display text-lg font-bold text-gold-400">
          {demoLearner.avatarInitials}
        </span>
        <div>
          <h1 className="text-xl font-bold text-navy-900 sm:text-2xl">{demoLearner.name}</h1>
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge tone="navy">Grade {demoLearner.gradeLevel}</Badge>
            <Badge tone="gold">Mathematical Literacy</Badge>
          </div>
        </div>
      </div>

      <section>
        <SectionHeading eyebrow="By topic" title="Subject progress" />
        <div className="mt-4 space-y-3">
          {demoLearner.topicProgress.map((tp) => {
            const topic = getTopic(tp.topicId);
            if (!topic) return null;
            const Icon = topicIconMap[topic.icon];
            const colors = masteryColorClasses(tp.masteryPercent);
            return (
              <Card key={tp.topicId}>
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium text-navy-900">{topic.name}</p>
                      <span className={`shrink-0 text-sm font-semibold ${colors.text}`}>{tp.masteryPercent}%</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar percent={tp.masteryPercent} colorClass={colors.bar} />
                    </div>
                    <p className="mt-1.5 text-xs text-navy-400">{masteryLabel(tp.masteryPercent)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="History" title="Completed tests" />
        <Card className="mt-4" padded={false}>
          <div className="divide-y divide-navy-100">
            {completedTests.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy-900">{a.title}</p>
                  <p className="text-sm text-navy-500">{formatDate(a.dueDate)}</p>
                </div>
                <p className={`shrink-0 text-lg font-bold ${(a.scorePercent ?? 0) >= 60 ? "text-emerald-600" : "text-gold-600"}`}>
                  {a.scorePercent}%
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
