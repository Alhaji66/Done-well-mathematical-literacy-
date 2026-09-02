import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { assessments } from "../../data/assessments";
import { classTopicPerformance, demoClasses } from "../../data/teacher";
import { getTopic } from "../../data/topics";
import { formatDate } from "../../lib/format";

export function TeacherDashboard() {
  const sortedTopics = [...classTopicPerformance].sort((a, b) => b.averagePercent - a.averagePercent);
  const strongest = sortedTopics.slice(0, 2);
  const weakest = [...sortedTopics].reverse().slice(0, 2);
  const recentAssessments = assessments.filter((a) => a.status === "completed").slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-navy-500">Welcome back,</p>
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">Ms. P. Dlamini</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone="navy">Mathematical Literacy</Badge>
          <Badge tone="gold">Ithemba Secondary School</Badge>
        </div>
      </div>

      <section>
        <SectionHeading eyebrow="Your classes" title="Class overview" />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {demoClasses.map((c) => (
            <Card key={c.id}>
              <p className="font-display font-semibold text-navy-900">{c.name}</p>
              <p className="mt-1 text-sm text-navy-500">{c.learnerCount} learners</p>
              <p className="mt-3 text-2xl font-bold text-navy-900">{c.averageScorePercent}%</p>
              <p className="text-xs text-navy-400">average score</p>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionHeading eyebrow="Class analytics" title="Topic strengths" />
          <div className="mt-4 space-y-3">
            {strongest.map((tp) => {
              const topic = getTopic(tp.topicId);
              if (!topic) return null;
              return (
                <Card key={tp.topicId} className="flex items-center justify-between">
                  <p className="font-medium text-navy-900">{topic.name}</p>
                  <Badge tone="green">{tp.averagePercent}% avg</Badge>
                </Card>
              );
            })}
          </div>
        </section>
        <section>
          <SectionHeading eyebrow="Class analytics" title="Needs attention" />
          <div className="mt-4 space-y-3">
            {weakest.map((tp) => {
              const topic = getTopic(tp.topicId);
              if (!topic) return null;
              return (
                <Card key={tp.topicId} className="flex items-center justify-between">
                  <p className="font-medium text-navy-900">{topic.name}</p>
                  <Badge tone="red">{tp.averagePercent}% avg</Badge>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      <section>
        <SectionHeading eyebrow="Recent" title="Recent assessments" />
        <Card className="mt-4" padded={false}>
          <div className="divide-y divide-navy-100">
            {recentAssessments.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy-900">{a.title}</p>
                  <p className="text-sm text-navy-500">{formatDate(a.dueDate)}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-navy-700">{a.totalMarks} marks</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <SectionHeading eyebrow="Quick actions" title="Get started" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Button as="link" to="/teacher/question-bank" variant="outline" size="lg" className="justify-start">
            Generate a worksheet
          </Button>
          <Button as="link" to="/teacher/assessments" variant="outline" size="lg" className="justify-start">
            Create an assessment
          </Button>
          <Button as="link" to="/teacher/analytics" variant="outline" size="lg" className="justify-start">
            View full analytics
          </Button>
        </div>
      </section>
    </div>
  );
}
