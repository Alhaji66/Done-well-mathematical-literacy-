import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { assessments } from "../../data/assessments";
import { demoLearner, weakestTopics } from "../../data/learner";
import { getTopic } from "../../data/topics";
import { daysUntil, formatDate, masteryColorClasses } from "../../lib/format";
import { IconArrowRight, IconClock } from "../../lib/icons";

export function LearnerDashboard() {
  const upcoming = assessments.find((a) => a.status === "upcoming");
  const recommended = weakestTopics(2);
  const activityPercent = Math.round(
    (demoLearner.weeklyActivityMinutes / demoLearner.weeklyTarget) * 100,
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-navy-500">Welcome back,</p>
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">{demoLearner.name.split(" ")[0]} 👋</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone="navy">Grade {demoLearner.gradeLevel}</Badge>
          <Badge tone="gold">Mathematical Literacy</Badge>
          <Badge tone="green">{demoLearner.streakDays}-day streak</Badge>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-navy-500">Weekly activity</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">
            {demoLearner.weeklyActivityMinutes}
            <span className="text-base font-medium text-navy-400"> / {demoLearner.weeklyTarget} min</span>
          </p>
          <div className="mt-3">
            <ProgressBar percent={activityPercent} colorClass="bg-navy-800" />
          </div>
        </Card>
        <Card>
          <p className="text-sm font-medium text-navy-500">Overall mastery</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{demoLearner.overallMasteryPercent}%</p>
          <div className="mt-3">
            <ProgressBar percent={demoLearner.overallMasteryPercent} colorClass="bg-gold-500" />
          </div>
        </Card>
        <Card>
          <p className="text-sm font-medium text-navy-500">Upcoming test</p>
          {upcoming ? (
            <>
              <p className="mt-1 truncate text-lg font-bold text-navy-900">{upcoming.title}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-500">
                <IconClock className="h-4 w-4" />
                In {daysUntil(upcoming.dueDate)} days · {formatDate(upcoming.dueDate)}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-navy-400">No upcoming tests scheduled.</p>
          )}
        </Card>
      </div>

      {/* Recommended practice */}
      <section>
        <SectionHeading
          eyebrow="For you"
          title="Recommended practice"
          description="Based on your recent results, these topics need the most attention."
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {recommended.map((tp) => {
            const topic = getTopic(tp.topicId);
            const colors = masteryColorClasses(tp.masteryPercent);
            if (!topic) return null;
            return (
              <Card key={tp.topicId} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display font-semibold text-navy-900">{topic.name}</p>
                  <p className="mt-1 text-sm text-navy-500">{topic.description}</p>
                  <div className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {tp.masteryPercent}% mastery
                  </div>
                </div>
                <Button
                  as="link"
                  to={`/learner/practise?topic=${topic.id}`}
                  size="sm"
                  variant="outline"
                  icon={<IconArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Practise
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Recent scores */}
      <section>
        <SectionHeading eyebrow="Track record" title="Recent scores" />
        <Card className="mt-4" padded={false}>
          <div className="divide-y divide-navy-100">
            {demoLearner.recentScores.map((score) => {
              const assessment = assessments.find((a) => a.id === score.assessmentId);
              return (
                <div key={score.assessmentId} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy-900">{assessment?.title ?? "Assessment"}</p>
                    <p className="text-sm text-navy-500">{formatDate(score.date)}</p>
                  </div>
                  <p className={`shrink-0 text-lg font-bold ${score.scorePercent >= 60 ? "text-emerald-600" : "text-gold-600"}`}>
                    {score.scorePercent}%
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
        <div className="mt-3 text-right">
          <Link to="/learner/tests" className="text-sm font-semibold text-navy-700 hover:text-gold-600">
            View all tests →
          </Link>
        </div>
      </section>
    </div>
  );
}
