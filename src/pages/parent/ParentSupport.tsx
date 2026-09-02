import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { demoLearner } from "../../data/learner";
import { parentSupportTips } from "../../data/parentSupport";
import { getTopic } from "../../data/topics";
import { topicIconMap } from "../../lib/icons";

export function ParentSupport() {
  const masteryByTopic = new Map(demoLearner.topicProgress.map((tp) => [tp.topicId, tp.masteryPercent]));

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Support"
        title="How you can help — no maths expertise needed"
        description="Practical, everyday actions that translate each topic into something you can do together at home."
      />

      <div className="space-y-4">
        {parentSupportTips.map((tip) => {
          const topic = getTopic(tip.topicId);
          if (!topic) return null;
          const Icon = topicIconMap[topic.icon];
          const mastery = masteryByTopic.get(tip.topicId);
          return (
            <Card key={tip.topicId}>
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-800">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display font-semibold text-navy-900">{topic.name}</p>
                    {mastery !== undefined ? (
                      <Badge tone={mastery >= 70 ? "green" : mastery >= 50 ? "gold" : "red"}>
                        {mastery}% mastery
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-navy-500">
                    <span className="font-medium text-navy-700">Why it matters: </span>
                    {tip.whyItMatters}
                  </p>
                  <p className="mt-2 rounded-lg bg-navy-50/70 p-3 text-sm text-navy-700">
                    <span className="font-medium">Try this at home: </span>
                    {tip.homeAction}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
