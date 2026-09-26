import { Link } from 'react-router-dom'
import { buildPlan, loadExamDate, topicName, type TopicMark } from '@/lib/revisionPlan'
import { CalendarIcon, ChevronRightIcon, SparkleIcon } from '@/components/ui/Icons'
import type { Grade } from '@/types'

/**
 * Two cards for a learner's Home: the exam countdown with today's topic, and
 * "Check my working". On a phone neither has a tab of its own, so Home is
 * where they are found.
 */
export function PlanShortcuts({
  basePath,
  scope,
  subjectId,
  grade,
  marks,
  exampleDate,
}: {
  basePath: string
  scope: string
  subjectId: string
  grade: Grade
  marks: TopicMark[]
  exampleDate?: string
}) {
  const examDate = loadExamDate(scope, subjectId, grade) ?? exampleDate ?? null
  const plan = examDate ? buildPlan({ subjectId, grade, examDate, marks }) : null
  const today = plan?.days[0]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Link to={`${basePath}/countdown`} className="card flex items-center gap-4 p-4 transition-colors hover:bg-navy-50">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
          {plan ? <span className="text-sm font-extrabold tabular-nums">{plan.daysLeft}</span> : <CalendarIcon className="h-5 w-5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy-900">Exam countdown</span>
          <span className="block text-sm text-navy-600">
            {plan
              ? `${plan.daysLeft} ${plan.daysLeft === 1 ? 'day' : 'days'} to go${today ? ` · Today: ${topicName(today.topicId)}` : ''}`
              : 'Set your exam date and get a plan from your weakest topics'}
          </span>
        </span>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-navy-400" />
      </Link>
      <Link to={`${basePath}/tutor`} className="card flex items-center gap-4 p-4 transition-colors hover:bg-navy-50">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
          <SparkleIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-navy-900">Check my working</span>
          <span className="block text-sm text-navy-600">Type a question or take a photo, and see where it went wrong</span>
        </span>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-navy-400" />
      </Link>
    </div>
  )
}
