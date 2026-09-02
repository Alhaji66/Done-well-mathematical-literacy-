import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { assessments } from "../../data/assessments";
import { demoLearner } from "../../data/learner";
import { getSupportTip } from "../../data/parentSupport";
import { getTopic } from "../../data/topics";
import { daysUntil, formatDate } from "../../lib/format";
import { IconClock } from "../../lib/icons";

export function ParentDashboard() {
  const sortedByMastery = [...demoLearner.topicProgress].sort((a, b) => b.masteryPercent - a.masteryPercent);
  const strengths = sortedByMastery.slice(0, 2);
  const attentionNeeded = [...sortedByMastery].reverse().slice(0, 2);
  const upcoming = assessments.find((a) => a.status === "upcoming");
  const topTip = getSupportTip(attentionNeeded[0]?.topicId);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-navy-500">Your child's progress</p>
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">{demoLearner.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone="navy">Grade {demoLearner.gradeLevel}</Badge>
          <Badge tone="gold">Mathematical Literacy</Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-navy-500">Overall mastery</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{demoLearner.overallMasteryPercent}%</p>
          <div className="mt-3">
            <ProgressBar percent={demoLearner.overallMasteryPercent} colorClass="bg-navy-800" />
          </div>
        </Card>
        <Card>
          <p className="text-sm font-medium text-navy-500">This week's activity</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{demoLearner.weeklyActivityMinutes} min</p>
          <p className="mt-1 text-xs text-navy-400">Target: {demoLearner.weeklyTarget} min/week</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-navy-500">Upcoming assessment</p>
          {upcoming ? (
            <>
              <p className="mt-1 truncate text-lg font-bold text-navy-900">{upcoming.title}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-500">
                <IconClock className="h-4 w-4" />
                In {daysUntil(upcoming.dueDate)} days · {formatDate(upcoming.dueDate)}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-navy-400">Nothing scheduled right now.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionHeading eyebrow="Doing well" title="Strengths" />
          <div className="mt-4 space-y-3">
            {strengths.map((tp) => {
              const topic = getTopic(tp.topicId);
              if (!topic) return null;
              return (
                <Card key={tp.topicId} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy-900">{topic.name}</p>
                    <p className="text-sm text-navy-500">{tp.masteryPercent}% mastery</p>
                  </div>
                  <Badge tone="green">Strong</Badge>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Focus areas" title="Needs attention" />
          <div className="mt-4 space-y-3">
            {attentionNeeded.map((tp) => {
              const topic = getTopic(tp.topicId);
              if (!topic) return null;
              return (
                <Card key={tp.topicId} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy-900">{topic.name}</p>
                    <p className="text-sm text-navy-500">{tp.masteryPercent}% mastery</p>
                  </div>
                  <Badge tone="red">Needs attention</Badge>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      {topTip ? (
        <Card className="border-gold-300 bg-gold-50/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">How can I help?</p>
          <p className="mt-1.5 font-display text-lg font-semibold text-navy-900">
            Support {getTopic(topTip.topicId)?.name} at home — no maths expertise needed
          </p>
          <p className="mt-2 text-sm text-navy-600">{topTip.homeAction}</p>
          <Button as="link" to="/parent/support" variant="outline" className="mt-4">
            See all support guidance
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
