import { useState, type ReactNode } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { assessments } from "../../data/assessments";
import { questionsFor } from "../../data/questions";
import { formatDate } from "../../lib/format";

export function TeacherAssessments() {
  const [selectedId, setSelectedId] = useState(assessments[0]?.id ?? null);
  const [tab, setTab] = useState<"learner" | "memo">("learner");
  const [createOpen, setCreateOpen] = useState(false);

  const selected = assessments.find((a) => a.id === selectedId);
  const relatedQuestions = selected
    ? selected.topicIds.flatMap((topicId) => questionsFor(topicId).slice(0, 3))
    : [];

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Assessments"
        title="Weekly & revision tests"
        description="Select a test to view the learner version or the teacher memo."
        action={<Button onClick={() => setCreateOpen(true)}>Create assessment</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {assessments.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setSelectedId(a.id);
                setTab("learner");
              }}
              className={[
                "focus-ring block w-full rounded-xl border px-4 py-3 text-left transition-colors",
                selectedId === a.id
                  ? "border-navy-800 bg-navy-900 text-white"
                  : "border-navy-100 bg-white text-navy-700 hover:bg-navy-50",
              ].join(" ")}
            >
              <p className="text-sm font-semibold">{a.title}</p>
              <p className={`mt-0.5 text-xs ${selectedId === a.id ? "text-navy-300" : "text-navy-400"}`}>
                {formatDate(a.dueDate)} · {a.totalMarks} marks
              </p>
            </button>
          ))}
        </div>

        {selected ? (
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 pb-4">
              <div>
                <p className="font-display text-lg font-semibold text-navy-900">{selected.title}</p>
                <p className="text-sm text-navy-500">
                  Grade {selected.gradeLevel} · {selected.totalMarks} marks · {selected.durationMinutes} min
                </p>
              </div>
              <div className="flex gap-2 rounded-lg bg-navy-50 p-1">
                <button
                  onClick={() => setTab("learner")}
                  className={`focus-ring rounded-md px-3 py-1.5 text-sm font-medium ${tab === "learner" ? "bg-white text-navy-900 shadow-sm" : "text-navy-500"}`}
                >
                  Learner version
                </button>
                <button
                  onClick={() => setTab("memo")}
                  className={`focus-ring rounded-md px-3 py-1.5 text-sm font-medium ${tab === "memo" ? "bg-white text-navy-900 shadow-sm" : "text-navy-500"}`}
                >
                  Teacher memo
                </button>
              </div>
            </div>

            <ol className="mt-5 space-y-5">
              {relatedQuestions.map((q, i) => (
                <li key={q.id} className="border-b border-navy-50 pb-5 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-navy-900">
                      <span className="text-navy-400">{i + 1}.</span> {q.prompt}
                    </p>
                    <Badge tone="neutral">{q.marks} marks</Badge>
                  </div>
                  {tab === "memo" ? (
                    <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                      <p className="font-semibold">
                        Memo: {q.options ? q.options.find((o) => o.id === q.correctOptionId)?.label : q.correctAnswer}
                      </p>
                      <p className="mt-1 text-emerald-700">{q.explanation}</p>
                    </div>
                  ) : q.options ? (
                    <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                      {q.options.map((opt) => (
                        <li key={opt.id} className="text-sm text-navy-600">
                          {opt.id.toUpperCase()}) {opt.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-2 h-8 border-b border-dashed border-navy-200" />
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => window.print()}>
                Print / Save PDF
              </Button>
            </div>
          </Card>
        ) : null}
      </div>

      {createOpen ? (
        <Modal title="Create assessment" onClose={() => setCreateOpen(false)}>
          <CreateAssessmentForm onClose={() => setCreateOpen(false)} />
        </Modal>
      ) : null}
    </div>
  );
}

function CreateAssessmentForm({ onClose }: { onClose: () => void }) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <Field label="Title">
        <input className="focus-ring w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm" placeholder="e.g. Weekly Test: Measurement" />
      </Field>
      <Field label="Topic">
        <select className="focus-ring w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm">
          {["Finance", "Data Handling", "Maps and Plans", "Measurement", "Probability", "Tariffs", "Profit, Loss & Breakeven"].map(
            (t) => (
              <option key={t}>{t}</option>
            ),
          )}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Total marks">
          <input type="number" defaultValue={25} className="focus-ring w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm" />
        </Field>
        <Field label="Duration (min)">
          <input type="number" defaultValue={30} className="focus-ring w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm" />
        </Field>
      </div>
      <p className="text-xs text-navy-400">
        This prototype builds tests from curated demo questions. Custom question authoring will be added with the
        full question bank.
      </p>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create assessment</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</span>
      {children}
    </label>
  );
}
