import { useState, type ReactNode } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { questions } from "../../data/questions";
import { topics } from "../../data/topics";
import type { Difficulty, GradeLevel, Question } from "../../types";

const grades: GradeLevel[] = [10, 11, 12];
const targetMarksOptions = [20, 30, 50];

export function TeacherQuestionBank() {
  const [grade, setGrade] = useState<GradeLevel>(12);
  const [topicId, setTopicId] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [targetMarks, setTargetMarks] = useState(30);
  const [worksheet, setWorksheet] = useState<Question[] | null>(null);
  const [showMemo, setShowMemo] = useState(false);

  function generate() {
    const pool = questions.filter(
      (q) =>
        q.gradeLevel === grade &&
        (topicId === "all" || q.topicId === topicId) &&
        (difficulty === "all" || q.difficulty === difficulty),
    );

    const selected: Question[] = [];
    let total = 0;
    for (const q of pool) {
      if (total >= targetMarks) break;
      selected.push(q);
      total += q.marks;
    }
    setWorksheet(selected);
    setShowMemo(false);
  }

  const worksheetMarks = worksheet?.reduce((sum, q) => sum + q.marks, 0) ?? 0;

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Question Bank"
        title="Generate a worksheet"
        description="Select criteria to build a printable worksheet from curated Done Well questions."
      />

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Grade">
            <select
              className="focus-ring w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-800"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
            >
              {grades.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Topic">
            <select
              className="focus-ring w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-800"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
            >
              <option value="all">All topics</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Difficulty">
            <select
              className="focus-ring w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-800"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | "all")}
            >
              <option value="all">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenge">Challenge</option>
            </select>
          </Field>

          <Field label="Target marks">
            <select
              className="focus-ring w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-800"
              value={targetMarks}
              onChange={(e) => setTargetMarks(Number(e.target.value))}
            >
              {targetMarksOptions.map((m) => (
                <option key={m} value={m}>
                  {m} marks
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Button className="mt-5" onClick={generate}>
          Generate worksheet
        </Button>
      </Card>

      {worksheet ? (
        worksheet.length > 0 ? (
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 pb-4">
              <div>
                <p className="font-display text-lg font-semibold text-navy-900">
                  Grade {grade} Mathematical Literacy Worksheet
                </p>
                <p className="text-sm text-navy-500">
                  {worksheet.length} questions · {worksheetMarks} marks
                  {topicId !== "all" ? ` · ${topics.find((t) => t.id === topicId)?.name}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowMemo((v) => !v)}>
                  {showMemo ? "Hide memo" : "View memo"}
                </Button>
                <Button size="sm" onClick={() => window.print()}>
                  Print / Save PDF
                </Button>
              </div>
            </div>

            <ol className="mt-5 space-y-5">
              {worksheet.map((q, i) => (
                <li key={q.id} className="border-b border-navy-50 pb-5 last:border-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-navy-900">
                      <span className="text-navy-400">{i + 1}.</span> {q.prompt}
                    </p>
                    <Badge tone="neutral">{q.marks} marks</Badge>
                  </div>
                  {q.context ? <p className="mt-1 text-sm italic text-navy-500">{q.context}</p> : null}
                  {q.options ? (
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

                  {showMemo ? (
                    <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                      <p className="font-semibold">
                        Memo: {q.options ? q.options.find((o) => o.id === q.correctOptionId)?.label : q.correctAnswer}
                      </p>
                      <p className="mt-1 text-emerald-700">{q.explanation}</p>
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </Card>
        ) : (
          <EmptyState
            title="No matching questions"
            description="Try a different grade, topic or difficulty — the demo question bank has broader coverage for Grade 12 Finance and Data Handling."
          />
        )
      ) : null}
    </div>
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
