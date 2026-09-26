import { useState } from 'react'
import type { Question } from '@/types'
import { DifficultyBadge } from '@/components/ui/Badges'
import { CheckCircleIcon, XCircleIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import { MathText } from '@/components/practise/MathText'
import { QuestionText } from '@/components/practise/QuestionText'
import { MarkingMemo } from '@/components/practise/MarkingMemo'
import { Figure } from '@/components/practise/Figure'
import { Graph } from '@/components/practise/Graph'
import { Circuit } from '@/components/practise/Circuit'
import { Chart } from '@/components/practise/Chart'
import { ProbabilityDiagrams } from '@/components/practise/ProbabilityDiagrams'
import { GeometryDiagram } from '@/components/practise/GeometryDiagram'
import { geometryDiagramFor } from '@/lib/geometryDiagrams'
import { physicsDiagramsFor } from '@/lib/physicsDiagrams'
import { lifeSciDiagramsFor } from '@/lib/lifeSciDiagrams'
import { derivedGraphs, derivedAnswerGraphs } from '@/data/derivedGraphs'
import { derivedFigures, derivedAnswerFigures } from '@/data/derivedFigures'
import { derivedCircuits, derivedAnswerCircuits } from '@/data/derivedCircuits'
import { chartSpecs } from '@/data/chartSpecs'

interface QuestionCardProps {
  question: Question
  index: number
  /** Optional: called once per attempt. `correct` is null for open-ended questions
   * (self-assessed, not auto-gradable) and true/false for multiple choice. */
  onAttempt?: (correct: boolean | null) => void
  /** Optional: overrides the "Question {index+1}" badge text -- used for exam-style
   * sub-question numbering (e.g. "1.1") when this card is part of a Paper section. */
  label?: string
  /**
   * Optional: whether the learner got it right, for My Mistakes. Multiple
   * choice reports itself; an open question is answered by the learner marking
   * themselves against the memo, so it is only reported once they say how it
   * went -- never guessed from the fact that they looked at the answer.
   */
  onResult?: (correct: boolean) => void
}

export function QuestionCard({ question, index, onAttempt, label, onResult }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [attemptedText, setAttemptedText] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [selfMark, setSelfMark] = useState<boolean | null>(null)

  // A figure or graph written on the question always wins; otherwise one
  // derived from the question's own words. See src/data/graphSpecs.ts and
  // tools/derive-figures.mts.
  const promptGraph = question.graph ?? derivedGraphs[question.id]
  const answerGraph = question.answerGraph ?? derivedAnswerGraphs[question.id]
  const promptFigure = question.figure ?? derivedFigures[question.id]
  const answerFigureId = question.answerFigure ?? derivedAnswerFigures[question.id]
  const promptCircuit = question.circuit ?? derivedCircuits[question.id]
  const answerCircuit = question.answerCircuit ?? derivedAnswerCircuits[question.id]
  const promptChart = question.chart ?? chartSpecs[question.id]?.chart
  const answerChart = question.answerChart ?? chartSpecs[question.id]?.answerChart
  // A sketch read off the question's words, when nothing else is drawn for it.
  const drawnAlready = Boolean(promptFigure || promptGraph || promptCircuit || promptChart)
  const promptSketch = drawnAlready ? null : geometryDiagramFor(question)
  const physics = physicsDiagramsFor(question)
  const lifeSci = lifeSciDiagramsFor(question)
  const answerDrawnAlready = Boolean(answerFigureId || answerGraph || answerCircuit || answerChart)

  const isMcq = Boolean(question.options && question.correctOptionId)
  const hasAttempted = isMcq ? selectedOption !== null : attemptedText.trim().length > 0 || revealed
  const isCorrectMcq = isMcq && selectedOption === question.correctOptionId

  const reset = () => {
    setSelectedOption(null)
    setAttemptedText('')
    setRevealed(false)
    setSelfMark(null)
  }

  return (
    <div className="card break-words p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-navy">{label ?? `Question ${index + 1}`}</span>
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="badge-slate">{question.marks} marks</span>
      </div>

      {question.context ? (
        <QuestionText className="mt-3 rounded-lg bg-navy-50 p-3 text-sm text-navy-700">
          {question.context}
        </QuestionText>
      ) : null}

      <p className="mt-3 text-[15px] font-medium leading-relaxed text-navy-900">
        <MathText>{question.prompt}</MathText>
      </p>

      {promptFigure ? <Figure id={promptFigure} /> : null}
      {promptGraph ? <Graph spec={promptGraph} /> : null}
      {promptCircuit ? <Circuit spec={promptCircuit} /> : null}
      {promptChart ? <Chart spec={promptChart} /> : null}
      {promptSketch ? <GeometryDiagram spec={promptSketch} /> : null}
      {drawnAlready ? null : [...physics.prompt, ...lifeSci.prompt].map((s) => <GeometryDiagram key={s.title} spec={s} />)}

      {isMcq ? (
        <div className="mt-4 space-y-2">
          {question.options!.map((opt) => {
            const isSelected = selectedOption === opt.id
            const isCorrect = opt.id === question.correctOptionId
            const showState = selectedOption !== null
            return (
              <button
                key={opt.id}
                type="button"
                disabled={selectedOption !== null}
                onClick={() => {
                  setSelectedOption(opt.id)
                  onAttempt?.(opt.id === question.correctOptionId)
                  onResult?.(opt.id === question.correctOptionId)
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default',
                  !showState && 'border-navy-200 hover:border-navy-400 hover:bg-navy-50',
                  showState && isCorrect && 'border-emerald-400 bg-emerald-50 text-emerald-800',
                  showState && isSelected && !isCorrect && 'border-rose-400 bg-rose-50 text-rose-800',
                  showState && !isSelected && !isCorrect && 'border-navy-100 text-navy-400',
                )}
              >
                <span>{opt.label}</span>
                {showState && isCorrect ? <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-600" /> : null}
                {showState && isSelected && !isCorrect ? <XCircleIcon className="h-4 w-4 shrink-0 text-rose-600" /> : null}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mt-4">
          <label className="text-xs font-medium text-navy-500" htmlFor={`attempt-${question.id}`}>
            Your working / answer (optional, for your own reference)
          </label>
          <textarea
            id={`attempt-${question.id}`}
            value={attemptedText}
            onChange={(e) => setAttemptedText(e.target.value)}
            disabled={revealed}
            rows={2}
            className="input mt-1.5 disabled:bg-navy-50"
            placeholder="Type your answer or working here before checking..."
          />
        </div>
      )}

      {!isMcq && !revealed ? (
        <button
          type="button"
          onClick={() => {
            setRevealed(true)
            onAttempt?.(null)
          }}
          className="btn-secondary btn-sm mt-4"
        >
          Check answer
        </button>
      ) : null}

      {(revealed || (isMcq && hasAttempted)) && (
        <div
          className={cn(
            'mt-4 rounded-lg border p-3 sm:p-4',
            isMcq
              ? isCorrectMcq
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-amber-200 bg-amber-50'
              : 'border-navy-200 bg-navy-50',
          )}
        >
          <p className="text-sm font-semibold text-navy-900">
            {isMcq ? (isCorrectMcq ? 'Correct!' : 'Not quite — here\'s the answer:') : 'Answer & explanation'}
          </p>
          <p className="mt-1.5 text-sm font-semibold text-navy-800">
            <MathText>{question.answer}</MathText>
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-navy-600">
            <MathText>{question.explanation}</MathText>
          </p>
          {/* Shown only now, with the answer. A question asking the learner to
              DRAW a free-body diagram is answered for them if the finished
              diagram sits beside the prompt. */}
          {answerFigureId ? <Figure id={answerFigureId} /> : null}
          {answerGraph ? <Graph spec={answerGraph} /> : null}
          {answerCircuit ? <Circuit spec={answerCircuit} /> : null}
          {answerChart ? <Chart spec={answerChart} /> : null}
          <ProbabilityDiagrams question={question} />
          {answerDrawnAlready ? null : physics.answer.map((s) => <GeometryDiagram key={s.title} spec={s} />)}
          {lifeSci.answer.map((s) => <GeometryDiagram key={s.title} spec={s} />)}
          {question.memo?.length ? <MarkingMemo steps={question.memo} totalMarks={question.marks} /> : null}
          {!isMcq && onResult ? (
            selfMark === null ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-navy-200 pt-3">
                <span className="text-xs font-medium text-navy-600">How did you do?</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelfMark(true)
                    onResult(true)
                  }}
                  className="btn-outline btn-sm"
                >
                  I got it right
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelfMark(false)
                    onResult(false)
                  }}
                  className="btn-outline btn-sm"
                >
                  Not yet — save to My Mistakes
                </button>
              </div>
            ) : (
              <p className="mt-3 border-t border-navy-200 pt-3 text-xs text-navy-500">
                {selfMark ? 'Marked as right.' : 'Saved to My Mistakes, so you can come back to it.'}
              </p>
            )
          ) : null}
        </div>
      )}

      {(revealed || (isMcq && hasAttempted)) && (
        <button type="button" onClick={reset} className="btn-ghost btn-sm mt-3">
          Try again
        </button>
      )}
    </div>
  )
}
