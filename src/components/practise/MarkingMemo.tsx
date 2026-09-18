import { useState } from 'react'
import { MEMO_CODE_MEANINGS, type MemoStep } from '@/types'
import { MathText } from '@/components/practise/MathText'

/**
 * The marking memo: where each mark in this question is actually earned.
 *
 * A worked answer tells a learner what the right answer is. It does not tell
 * them why they scored 3 out of 5 when their final number was wrong, and that
 * is the thing that changes how they write the next answer. The single most
 * useful idea in an NSC memo is CA -- continued accuracy -- because it is the
 * concrete reason "show your working" is advice worth taking: an arithmetic
 * slip in line one costs one accuracy mark rather than the whole question, but
 * only if the method after it is visible to the marker.
 *
 * The codes are explained on demand rather than in a permanent legend. A
 * learner meeting "SF" for the first time needs the expansion; one who has
 * seen it fifty times does not, and a legend under every question would be
 * noise by the third question of a paper.
 */

interface MarkingMemoProps {
  steps: MemoStep[]
  /** The question's marks, so a memo that does not add up can be caught. */
  totalMarks: number
}

export function MarkingMemo({ steps, totalMarks }: MarkingMemoProps) {
  const [openCode, setOpenCode] = useState<string | null>(null)
  if (!steps.length) return null

  const allocated = steps.reduce((sum, s) => sum + s.marks, 0)

  return (
    <div className="mt-4 rounded-lg border border-navy-200 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-sm font-semibold text-navy-900">How the marks are awarded</h4>
        <p className="text-xs text-navy-500">
          {allocated} of {totalMarks} mark{totalMarks === 1 ? '' : 's'}
        </p>
      </div>

      <ol className="mt-3 space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpenCode(openCode === `${i}` ? null : `${i}`)}
              aria-expanded={openCode === `${i}`}
              className="mt-0.5 h-6 shrink-0 rounded border border-navy-300 bg-navy-50 px-1.5 font-mono text-xs font-bold text-navy-800 hover:bg-navy-100"
              title={MEMO_CODE_MEANINGS[step.code]}
            >
              {step.code}
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-navy-800">
                <MathText>{step.text}</MathText>
                <span className="ml-1.5 whitespace-nowrap font-semibold text-navy-600">
                  ({step.marks} mark{step.marks === 1 ? '' : 's'})
                </span>
              </p>
              {openCode === `${i}` && (
                <p className="mt-1 rounded bg-navy-50 px-2 py-1.5 text-xs leading-relaxed text-navy-600">
                  {MEMO_CODE_MEANINGS[step.code]}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {allocated !== totalMarks && (
        // Visible rather than silent: a memo that does not add up is a content
        // bug, and hiding it would leave a learner quietly mis-marking.
        <p className="mt-3 rounded bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
          This memo allocates {allocated} marks but the question is worth {totalMarks}. Treat the split as a guide
          rather than an exact total.
        </p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-navy-500">
        Tap a code to see what it means. The one worth remembering is <strong>CA</strong>: if you make a slip early
        but your method afterwards is correct and visible, you still earn those later marks — which is exactly why
        showing your working pays.
      </p>
    </div>
  )
}
