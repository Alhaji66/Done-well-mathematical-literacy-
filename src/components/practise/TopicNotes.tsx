import { useEffect, useState } from 'react'
import { getTopicNote } from '@/data/topicNotes'
import { BookIcon, SparkleIcon, ChevronRightIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

/**
 * `showSubtopics` is off where the page renders each sub-topic's explanation
 * above its own questions -- Practise does. Printing the same points twice on
 * one screen is worse than printing them once in the right place.
 */
export function TopicNotes({
  topicId,
  defaultOpen = true,
  showSubtopics = true,
}: {
  topicId: string
  defaultOpen?: boolean
  showSubtopics?: boolean
}) {
  const note = getTopicNote(topicId)
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    setOpen(defaultOpen)
  }, [topicId, defaultOpen])

  if (!note) return null

  return (
    <div className="card overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-50 text-gold-700">
            <BookIcon className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-bold text-navy-900">Notes &amp; example</span>
            <span className="block text-xs text-navy-500">{note.summary}</span>
          </span>
        </span>
        <ChevronRightIcon className={cn('h-4 w-4 shrink-0 text-navy-400 transition-transform', open && 'rotate-90')} />
      </button>

      {open ? (
        <div className="space-y-5 border-t border-navy-100 p-4 pt-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-500">Key ideas</h4>
            <ul className="mt-2 space-y-1.5">
              {note.keyIdeas.map((idea, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-navy-700">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          {showSubtopics && note.subtopics?.length ? (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-500">What this topic covers</h4>
              <div className="mt-2 space-y-3">
                {note.subtopics.map((sub) => (
                  <div key={sub.name} className="rounded-lg border border-navy-100 p-3">
                    <h5 className="text-sm font-bold text-navy-900">{sub.name}</h5>
                    <ul className="mt-1.5 space-y-1">
                      {sub.points.map((point, i) => (
                        <li key={i} className="flex gap-2 text-sm leading-relaxed text-navy-700">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-navy-300" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {note.formulae?.length ? (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-500">Formulae to know</h4>
              <ul className="mt-2 space-y-1.5">
                {note.formulae.map((f, i) => (
                  <li
                    key={i}
                    className="rounded-md bg-navy-50 px-3 py-2 text-sm font-medium leading-relaxed text-navy-800"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {note.commonMistakes?.length ? (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-500">Watch out for</h4>
              <ul className="mt-2 space-y-1.5">
                {note.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-navy-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-rose-400 bg-rose-100" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {[note.example, ...(note.moreExamples ?? [])].map((example, exampleIndex) => (
            <div key={exampleIndex} className="rounded-lg bg-navy-50 p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-500">
                <SparkleIcon className="h-3.5 w-3.5 text-gold-700" />
                Worked example{note.moreExamples?.length ? ` ${exampleIndex + 1}` : ''}
              </h4>
              <p className="mt-2 text-sm font-medium leading-relaxed text-navy-900">{example.problem}</p>
              <ol className="mt-3 space-y-1.5">
                {example.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-navy-600">
                    <span className="shrink-0 font-semibold text-navy-500">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 border-t border-navy-100 pt-3 text-sm font-semibold text-navy-900">
                Answer: <span className="font-bold text-gold-700">{example.answer}</span>
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
