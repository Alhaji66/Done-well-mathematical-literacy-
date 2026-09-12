import { useState, type ReactNode } from 'react'
import { ChevronRightIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

/**
 * One sub-topic: its name, its explanation, then its own questions.
 *
 * Practise used to render a topic as a single list of everything, with the
 * whole note stacked on top. On Finance that is several hundred questions, so a
 * learner who is weak on taxation had to wade through budgets, tariffs and
 * break-even to reach one. Teaching order is sub-topic, explanation, questions
 * on that sub-topic -- so that is the order here.
 *
 * Sections open by default: a learner who came to work should see questions, not
 * a row of closed drawers. They collapse so a long topic can be skimmed.
 */
export function SubtopicSection({
  name,
  points,
  count,
  index,
  children,
}: {
  name: string
  points?: string[]
  count: number
  index: number
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  const headingId = `subtopic-${index}`

  return (
    <section className="space-y-4" aria-labelledby={headingId}>
      <div className="card overflow-hidden p-0">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-3 p-4 text-left"
        >
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-navy-900 text-xs font-bold text-gold-400">
                {index + 1}
              </span>
              <h3 id={headingId} className="text-base font-bold text-navy-900">
                {name}
              </h3>
            </span>
            <span className="mt-1 block text-xs font-medium text-navy-500">
              {count} {count === 1 ? 'question' : 'questions'}
            </span>
          </span>
          <ChevronRightIcon
            className={cn('mt-1 h-4 w-4 shrink-0 text-navy-400 transition-transform', open && 'rotate-90')}
          />
        </button>

        {open && points?.length ? (
          <div className="border-t border-navy-100 bg-navy-50 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-navy-500">What you need to know</h4>
            <ul className="mt-2 space-y-1.5">
              {points.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-navy-700">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {open ? <div className="space-y-4">{children}</div> : null}
    </section>
  )
}
