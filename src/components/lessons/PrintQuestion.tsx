import type { Question } from '@/types'
import { MathText } from '@/components/practise/MathText'
import { QuestionText } from '@/components/practise/QuestionText'
import { Figure } from '@/components/practise/Figure'
import { Graph } from '@/components/practise/Graph'
import { Circuit } from '@/components/practise/Circuit'
import { Chart } from '@/components/practise/Chart'
import { ProbabilityDiagrams } from '@/components/practise/ProbabilityDiagrams'
import { GeometryDiagram } from '@/components/practise/GeometryDiagram'
import { geometryDiagramFor } from '@/lib/geometryDiagrams'
import { physicsDiagramsFor } from '@/lib/physicsDiagrams'
import { lifeSciDiagramsFor } from '@/lib/lifeSciDiagrams'
import { derivedGraphs } from '@/data/derivedGraphs'
import { derivedFigures } from '@/data/derivedFigures'
import { derivedCircuits } from '@/data/derivedCircuits'
import { chartSpecs } from '@/data/chartSpecs'
import { levelName } from '@/data/lessonPlans'

/**
 * A question laid out for paper: its context, prompt and every picture the app
 * would draw for it on screen, and -- on the teacher's copy -- the answer and
 * the mark-by-mark memo written out in full, because a printed page cannot be
 * tapped to open anything.
 *
 * The pictures follow QuestionCard exactly, so a question prints with the same
 * graph, chart, circuit or sketch a learner sees in Practise.
 */
export function PrintQuestion({
  question,
  number,
  showAnswer,
  learner = false,
}: {
  question: Question
  number: string
  showAnswer: boolean
  /** The learner's copy shows marks but not the cognitive level, which is for the teacher. */
  learner?: boolean
}) {
  const graph = question.graph ?? derivedGraphs[question.id]
  const figure = question.figure ?? derivedFigures[question.id]
  const circuit = question.circuit ?? derivedCircuits[question.id]
  const chart = question.chart ?? chartSpecs[question.id]?.chart
  const drawn = Boolean(figure || graph || circuit || chart)
  const sketch = drawn ? null : geometryDiagramFor(question)
  const physics = physicsDiagramsFor(question)
  const lifeSci = lifeSciDiagramsFor(question)

  return (
    <div className="print-avoid-break border-t border-navy-100 pt-3 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm font-semibold text-navy-900">{number}</p>
        <p className="text-xs text-navy-500">
          {learner ? '' : `${levelName(question)} · `}
          ({question.marks} {question.marks === 1 ? 'mark' : 'marks'})
        </p>
      </div>
      {question.context ? <QuestionText className="mt-1.5 text-sm text-navy-600">{question.context}</QuestionText> : null}
      <p className="mt-1.5 text-sm font-medium leading-relaxed text-navy-900">
        <MathText>{question.prompt}</MathText>
      </p>
      {figure ? <Figure id={figure} /> : null}
      {graph ? <Graph spec={graph} /> : null}
      {circuit ? <Circuit spec={circuit} /> : null}
      {chart ? <Chart spec={chart} /> : null}
      {sketch ? <GeometryDiagram spec={sketch} /> : null}
      {drawn ? null : [...physics.prompt, ...lifeSci.prompt].map((s) => <GeometryDiagram key={s.title} spec={s} />)}
      <ProbabilityDiagrams question={question} />
      {question.options?.length ? (
        <ul className="mt-1.5 space-y-0.5 pl-4 text-sm text-navy-700">
          {question.options.map((o) => (
            <li key={o.id}>
              {o.id.toUpperCase()}) {o.label}
            </li>
          ))}
        </ul>
      ) : null}
      {showAnswer ? (
        <div className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          <p>
            <span className="font-semibold">Answer: </span>
            <MathText>{question.answer}</MathText>
          </p>
          {question.memo?.length ? (
            <ul className="mt-1.5 space-y-0.5 text-emerald-800">
              {question.memo.map((m, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 font-semibold tabular-nums">
                    {m.code} {m.marks}
                  </span>
                  <span>
                    <MathText>{m.text}</MathText>
                  </span>
                </li>
              ))}
            </ul>
          ) : question.explanation ? (
            <p className="mt-1 text-emerald-800">
              <MathText>{question.explanation}</MathText>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
