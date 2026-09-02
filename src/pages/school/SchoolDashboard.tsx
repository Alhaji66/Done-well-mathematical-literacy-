import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { demoSchool, schoolInterventionPriorities } from "../../data/school";
import { getTopic } from "../../data/topics";

const priorityTone = { high: "red", medium: "gold", low: "navy" } as const;

export function SchoolDashboard() {
  const activePercent = Math.round((demoSchool.activeLearnerCount / demoSchool.learnerCount) * 100);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-navy-500">School overview</p>
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">{demoSchool.name}</h1>
        <Badge tone="gold">Demo data · prototype</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm font-medium text-navy-500">Learners enrolled</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{demoSchool.learnerCount}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-navy-500">Active learners (30d)</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{demoSchool.activeLearnerCount}</p>
          <div className="mt-2">
            <ProgressBar percent={activePercent} colorClass="bg-navy-800" />
          </div>
        </Card>
        <Card>
          <p className="text-sm font-medium text-navy-500">Avg. practice score</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{demoSchool.averagePracticeScorePercent}%</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-navy-500">Test completion</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{demoSchool.testCompletionPercent}%</p>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-navy-500">Strongest topic</p>
            <p className="mt-1 font-display text-lg font-semibold text-navy-900">
              {getTopic(demoSchool.strongestTopicId)?.name}
            </p>
          </div>
          <Badge tone="green">Strong</Badge>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-navy-500">Weakest topic</p>
            <p className="mt-1 font-display text-lg font-semibold text-navy-900">
              {getTopic(demoSchool.weakestTopicId)?.name}
            </p>
          </div>
          <Badge tone="red">Needs attention</Badge>
        </Card>
      </div>

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
