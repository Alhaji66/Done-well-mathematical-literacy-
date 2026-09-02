import { ResourceCard } from "../../components/resources/ResourceCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { demoLearner } from "../../data/learner";
import { resources } from "../../data/resources";

export function ParentResources() {
  const relevant = resources.filter(
    (r) => r.gradeLevel === demoLearner.gradeLevel && r.type !== "memo",
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Resources"
        title={`Grade ${demoLearner.gradeLevel} resources`}
        description={`Learner Books, Workbooks and tests you can look at alongside ${demoLearner.name.split(" ")[0]}.`}
      />

      {relevant.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relevant.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      ) : (
        <EmptyState title="No resources found" description="Try checking back later for new resources." />
      )}
    </div>
  );
}
