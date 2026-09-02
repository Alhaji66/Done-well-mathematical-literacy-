import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QuestionCard } from "../../components/practice/QuestionCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { questionsFor } from "../../data/questions";
import { topics } from "../../data/topics";
import { topicIconMap } from "../../lib/icons";
import type { Difficulty } from "../../types";

const difficulties: { id: Difficulty; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "moderate", label: "Moderate" },
  { id: "challenge", label: "Challenge" },
];

export function LearnerPractise() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topicId = searchParams.get("topic") ?? topics[0].id;
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [index, setIndex] = useState(0);

  const topic = topics.find((t) => t.id === topicId) ?? topics[0];
  const questionList = useMemo(() => questionsFor(topic.id, difficulty), [topic.id, difficulty]);
  const currentQuestion = questionList[index % Math.max(questionList.length, 1)];
  const TopicIcon = topicIconMap[topic.icon];

  function selectTopic(id: string) {
    setSearchParams({ topic: id });
    setIndex(0);
  }

  function selectDifficulty(d: Difficulty) {
    setDifficulty(d);
    setIndex(0);
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Practise"
        title="Sharpen your skills"
        description="Choose a topic and difficulty, then work through questions at your own pace."
      />

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {topics.map((t) => {
          const Icon = topicIconMap[t.icon];
          const active = t.id === topic.id;
          return (
            <button
              key={t.id}
              onClick={() => selectTopic(t.id)}
              className={[
                "focus-ring flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                active ? "bg-navy-900 text-white" : "bg-white text-navy-600 ring-1 ring-navy-200 hover:bg-navy-50",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {t.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {difficulties.map((d) => (
          <button
            key={d.id}
            onClick={() => selectDifficulty(d.id)}
            className={[
              "focus-ring rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              difficulty === d.id
                ? "bg-gold-500 text-navy-950"
                : "bg-white text-navy-600 ring-1 ring-navy-200 hover:bg-navy-50",
            ].join(" ")}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-navy-500">
        <TopicIcon className="h-4 w-4" />
        {topic.name}
        {questionList.length > 0 ? (
          <span>
            · Question {(index % questionList.length) + 1} of {questionList.length}
          </span>
        ) : null}
      </div>

      {currentQuestion ? (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onNext={() => setIndex((i) => i + 1)}
        />
      ) : (
        <EmptyState
          title="No questions at this level yet"
          description={`We're still adding ${difficulties.find((d) => d.id === difficulty)?.label.toLowerCase()} questions for ${topic.name}. Try a different difficulty or topic.`}
        />
      )}
    </div>
  );
}
