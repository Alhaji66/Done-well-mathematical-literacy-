import { Link } from 'react-router-dom'
import { sbaTaskTitle } from '@/data/sbaProgramme'
import { programmeFor, topicsFor } from '@/data/sba'
import { getSubject as subjectOf } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { shortDate, todayIso, upcoming, type TaskDate } from '@/lib/sbaSchedule'
import type { Grade } from '@/types'

/** The tasks coming up in the next six weeks, soonest first. */
export function ComingUp({
  dates,
  topicLink,
  revise = 'Revise',
}: {
  dates: TaskDate[]
  /** Where a topic opens: practice for a learner, the topic guide for a parent. Leave out to list topics without links. */
  topicLink?: (subjectId: string, grade: Grade, topicId: string) => string
  /** The word before the topics: "Revise" for a learner, "Covers" for a parent. */
  revise?: string
}) {
  const today = todayIso()
  const soon = upcoming(dates).sort((a, b) => a.due_on.localeCompare(b.due_on))
  if (!soon.length) return null
  return (
    <section className="card p-5">
      <h3 className="text-sm font-bold text-navy-900">Coming up</h3>
      <ul className="mt-2 divide-y divide-navy-100">
        {soon.map((d) => {
          const days = Math.round((Date.parse(d.due_on) - Date.parse(today)) / 86_400_000)
          const task = programmeFor(d.subject_id, d.grade).find((t) => t.slot === d.task_key)
          const topics = task ? topicsFor(d.subject_id, d.grade, task).filter((id) => getTopic(id)) : []
          return (
            <li key={`${d.class_id}|${d.task_key}`} className="flex items-baseline justify-between gap-3 py-2 text-sm">
              <span className="min-w-0">
                <span className="font-medium text-navy-900">{sbaTaskTitle(d.subject_id, d.grade, d.task_key) ?? 'A formal task'}</span>
                <span className="block text-[11px] text-navy-500">
                  {subjectOf(d.subject_id)?.name ?? d.subject_id}
                  {d.note ? ` · ${d.note}` : ''}
                </span>
                {topics.length ? (
                  <span className="mt-1 flex flex-wrap items-center gap-1 text-[11px]">
                    <span className="text-navy-500">{revise}:</span>
                    {topics.slice(0, 5).map((id) =>
                      topicLink ? (
                        <Link
                          key={id}
                          to={topicLink(d.subject_id, d.grade, id)}
                          className="rounded-full bg-navy-50 px-2 py-0.5 font-medium text-navy-700 hover:bg-navy-100"
                        >
                          {getTopic(id)!.name}
                        </Link>
                      ) : (
                        <span key={id} className="rounded-full bg-navy-50 px-2 py-0.5 text-navy-700">
                          {getTopic(id)!.name}
                        </span>
                      ),
                    )}
                    {topics.length > 5 ? <span className="text-navy-500">+{topics.length - 5} more</span> : null}
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-right font-semibold tabular-nums text-navy-800">
                {shortDate(d.due_on)}
                <span className="block text-[11px] font-normal text-navy-500">{days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default ComingUp
