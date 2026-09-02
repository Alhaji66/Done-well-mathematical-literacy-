import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { demoLearner, weakestTopics } from "../../data/learner";
import { getTopic } from "../../data/topics";
import { formatDate, masteryColorClasses, masteryLabel } from "../../lib/format";
import { topicIconMap } from "../../lib/icons";

export function LearnerProgress() {
  const nextUp = weakestTopics(1)[0];
  const nextTopic = nextUp ? getTopic(nextUp.topicId) : undefined;

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Progress"
        title="Your topic mastery"
        description="Mastery is based on your recent practice accuracy per topic."
      />

      <div className="space-y-3">
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
                  <p className="mt-1.5 text-xs text-navy-400">
                    {masteryLabel(tp.masteryPercent)} · {tp.questionsAttempted} questions attempted
                    {tp.lastPractisedAt ? ` · last practised ${formatDate(tp.lastPractisedAt)}` : ""}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {nextTopic ? (
        <Card className="border-gold-300 bg-gold-50/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">What to practise next</p>
          <p className="mt-1.5 font-display text-lg font-semibold text-navy-900">{nextTopic.name}</p>
          <p className="mt-1 text-sm text-navy-600">
            This is your lowest-mastery topic at {nextUp.masteryPercent}%. A short practice session here will have
            the biggest impact on your next test.
          </p>
          <Button as="link" to={`/learner/practise?topic=${nextTopic.id}`} className="mt-4">
            Practise {nextTopic.name}
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
