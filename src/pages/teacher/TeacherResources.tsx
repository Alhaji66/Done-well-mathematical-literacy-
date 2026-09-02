import { useMemo, useState, type ReactNode } from "react";
import { ResourceCard } from "../../components/resources/ResourceCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { resourceTypeLabels, resources } from "../../data/resources";
import { subjects } from "../../data/subjects";
import { topics } from "../../data/topics";
import type { ResourceType } from "../../types";

const grades = [10, 11, 12] as const;

export function TeacherResources() {
  const [grade, setGrade] = useState<(typeof grades)[number] | "all">("all");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [topicId, setTopicId] = useState<string>("all");
  const [type, setType] = useState<ResourceType | "all">("all");

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (grade !== "all" && r.gradeLevel !== grade) return false;
      if (subjectId !== "all" && r.subjectId !== subjectId) return false;
      if (topicId !== "all" && r.topicId !== topicId) return false;
      if (type !== "all" && r.type !== type) return false;
      return true;
    });
  }, [grade, subjectId, topicId, type]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Resources"
        title="Teaching resources"
        description="Filter by grade, subject, topic and resource type."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Grade" value={grade} onChange={(v) => setGrade(v === "all" ? "all" : (Number(v) as (typeof grades)[number]))}>
          <option value="all">All grades</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </Select>

        <Select label="Subject" value={subjectId} onChange={setSubjectId}>
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>

        <Select label="Topic" value={topicId} onChange={setTopicId}>
          <option value="all">All topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>

        <Select label="Resource type" value={type} onChange={(v) => setType(v as ResourceType | "all")}>
          <option value="all">All types</option>
          {(Object.keys(resourceTypeLabels) as ResourceType[]).map((t) => (
            <option key={t} value={t}>
              {resourceTypeLabels[t]}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No resources match these filters"
          description="Try widening your search — for example, select 'All topics' or a different grade."
        />
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</span>
      <select
        className="focus-ring w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-800"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </label>
  );
}
