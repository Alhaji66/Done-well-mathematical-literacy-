import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { IconCheck } from "../../lib/icons";
import { difficultyLabel } from "../../lib/format";
import type { Question } from "../../types";

const difficultyTone = {
  easy: "green",
  moderate: "gold",
  challenge: "red",
} as const;

export function QuestionCard({ question, onNext }: { question: Question; onNext?: () => void }) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isMcq = Boolean(question.options && question.correctOptionId);
  const canCheck = isMcq ? Boolean(selectedOptionId) : typedAnswer.trim().length > 0;

  const isCorrect = isMcq
    ? selectedOptionId === question.correctOptionId
    : normalize(typedAnswer) === normalize(question.correctAnswer ?? "");

  function reset() {
    setSelectedOptionId(null);
    setTypedAnswer("");
    setSubmitted(false);
  }

  function handleNext() {
    reset();
    onNext?.();
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={difficultyTone[question.difficulty]}>{difficultyLabel(question.difficulty)}</Badge>
        <Badge tone="neutral">{question.marks} marks</Badge>
      </div>

      {question.context ? <p className="mt-3 text-sm italic text-navy-500">{question.context}</p> : null}
      <p className="mt-3 text-base font-medium text-navy-900 sm:text-lg">{question.prompt}</p>

      {isMcq ? (
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {question.options!.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isRight = submitted && opt.id === question.correctOptionId;
            const isWrongPick = submitted && isSelected && opt.id !== question.correctOptionId;
            return (
              <button
                key={opt.id}
                disabled={submitted}
                onClick={() => setSelectedOptionId(opt.id)}
                className={[
                  "focus-ring rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                  isRight
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : isWrongPick
                      ? "border-rose-300 bg-rose-50 text-rose-700"
                      : isSelected
                        ? "border-navy-700 bg-navy-50 text-navy-900"
                        : "border-navy-200 bg-white text-navy-700 hover:bg-navy-50",
                  submitted ? "cursor-default" : "cursor-pointer",
                ].join(" ")}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-navy-600">Your answer</label>
          <input
            type="text"
            disabled={submitted}
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            placeholder="Type your answer, e.g. R2,160"
            className="focus-ring w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm disabled:bg-navy-50"
          />
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <Button disabled={!canCheck} onClick={() => setSubmitted(true)}>
            Check answer
          </Button>
        ) : (
          <Button variant="outline" onClick={handleNext}>
            Next question
          </Button>
        )}
      </div>

      {submitted ? (
        <div
          className={[
            "mt-5 rounded-xl border p-4",
            isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50",
          ].join(" ")}
        >
          <p className={`flex items-center gap-1.5 font-display font-semibold ${isCorrect ? "text-emerald-700" : "text-amber-800"}`}>
            {isCorrect ? <IconCheck className="h-5 w-5" /> : null}
            {isCorrect ? "Correct!" : "Not quite — here's how to get there"}
          </p>
          {!isMcq ? (
            <p className="mt-1.5 text-sm text-navy-700">
              Correct answer: <span className="font-semibold">{question.correctAnswer}</span>
            </p>
          ) : null}
          <p className="mt-1.5 text-sm text-navy-600">{question.explanation}</p>
        </div>
      ) : null}
    </Card>
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "").replace(/,/g, "");
}
