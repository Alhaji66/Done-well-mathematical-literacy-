import { useState } from 'react'
import type { Question } from '@/types'
import { DifficultyBadge } from '@/components/ui/Badges'
import { CheckCircleIcon, XCircleIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  question: Question
  index: number
  /** Optional: called once per attempt. `correct` is null for open-ended questions
   * (self-assessed, not auto-gradable) and true/false for multiple choice. */
  onAttempt?: (correct: boolean | null) => void
}

export function QuestionCard({ question, index, onAttempt }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [attemptedText, setAttemptedText] = useState('')
  const [revealed, setRevealed] = useState(false)

  const isMcq = Boolean(question.options && question.correctOptionId)
  const hasAttempted = isMcq ? selectedOption !== null : attemptedText.trim().length > 0 || revealed
  const isCorrectMcq = isMcq && selectedOption === question.correctOptionId

  const reset = () => {
    setSelectedOption(null)
    setAttemptedText('')
    setRevealed(false)
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge-navy">Question {index + 1}</span>
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="badge-slate">{question.marks} marks</span>
      </div>

      {question.context ? (
        <p className="mt-3 rounded-lg bg-navy-50 p-3 text-sm text-navy-700">{question.context}</p>
      ) : null}

      <p className="mt-3 text-[15px] font-medium leading-relaxed text-navy-900">{question.prompt}</p>

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
            'mt-4 rounded-lg border p-4',
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
          <p className="mt-1.5 text-sm font-semibold text-navy-800">{question.answer}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{question.explanation}</p>
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
