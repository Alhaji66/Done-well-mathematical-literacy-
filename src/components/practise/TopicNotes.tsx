import { useEffect, useState } from 'react'
import { getTopicNote } from '@/data/topicNotes'
import { BookIcon, SparkleIcon, ChevronRightIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

export function TopicNotes({ topicId, defaultOpen = true }: { topicId: string; defaultOpen?: boolean }) {
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

          <div className="rounded-lg bg-navy-50 p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-500">
              <SparkleIcon className="h-3.5 w-3.5 text-gold-600" /> Worked example
            </h4>
            <p className="mt-2 text-sm font-medium leading-relaxed text-navy-900">{note.example.problem}</p>
            <ol className="mt-3 space-y-1.5">
              {note.example.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-navy-600">
                  <span className="shrink-0 font-semibold text-navy-400">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 border-t border-navy-100 pt-3 text-sm font-semibold text-navy-900">
              Answer: <span className="font-bold text-gold-700">{note.example.answer}</span>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
