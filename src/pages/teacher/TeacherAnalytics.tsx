import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeading } from "../../components/ui/SectionHeading";
import {
  classTopicPerformance,
  demoClasses,
  interventionRecommendations,
  questionPerformance,
} from "../../data/teacher";
import { getTopic } from "../../data/topics";
import { questions } from "../../data/questions";
import { masteryColorClasses } from "../../lib/format";

const priorityTone = { high: "red", medium: "gold", low: "navy" } as const;

export function TeacherAnalytics() {
  const overallAverage = Math.round(
    demoClasses.reduce((sum, c) => sum + c.averageScorePercent, 0) / demoClasses.length,
  );

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Analytics"
        title="Class performance"
        description="A simple view of where your classes are doing well — and where to focus next."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-navy-500">Overall average</p>
          <p className="mt-1 text-3xl font-bold text-navy-900">{overallAverage}%</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-navy-500">Total learners</p>
          <p className="mt-1 text-3xl font-bold text-navy-900">
            {demoClasses.reduce((sum, c) => sum + c.learnerCount, 0)}
          </p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-navy-500">Classes tracked</p>
          <p className="mt-1 text-3xl font-bold text-navy-900">{demoClasses.length}</p>
        </Card>
      </div>

      <section>
        <SectionHeading eyebrow="By class" title="Average score per class" />
        <Card className="mt-4 space-y-4">
          {demoClasses.map((c) => (
            <div key={c.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-navy-800">{c.name}</span>
                <span className="font-semibold text-navy-600">{c.averageScorePercent}%</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar percent={c.averageScorePercent} colorClass="bg-navy-800" />
              </div>
            </div>
          ))}
        </Card>
      </section>

      <section>
        <SectionHeading eyebrow="By topic" title="Performance by topic" />
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
        <SectionHeading eyebrow="By question" title="Performance by question" />
        <Card className="mt-4 space-y-4">
          {questionPerformance.map((qp) => {
            const question = questions.find((q) => q.id === qp.questionId);
            const colors = masteryColorClasses(qp.correctPercent);
            if (!question) return null;
            return (
              <div key={qp.questionId}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="min-w-0 truncate font-medium text-navy-800">{question.prompt}</span>
                  <span className={`shrink-0 font-semibold ${colors.text}`}>{qp.correctPercent}% correct</span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar percent={qp.correctPercent} colorClass={colors.bar} />
                </div>
              </div>
            );
          })}
        </Card>
      </section>

      <section>
        <SectionHeading eyebrow="Recommended" title="Intervention priorities" />
        <div className="mt-4 space-y-3">
          {interventionRecommendations.map((rec) => (
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
