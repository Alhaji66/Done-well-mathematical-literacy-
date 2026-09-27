import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchRecordsForReview } from '@/lib/lessonPlanRecords'
import { CalendarIcon, ChevronRightIcon } from '@/components/ui/Icons'

/**
 * A line on the HOD's dashboard saying how many recorded weeks are waiting
 * for sign-off, linking to the page where they are signed. Given `waiting`,
 * it shows that number (the demo); given a school, it counts the real ones.
 */
export function PlanSignoffCard({ schoolId, subjectId, waiting: given }: { schoolId?: string | null; subjectId?: string | null; waiting?: number }) {
  const [waiting, setWaiting] = useState<number | null>(given ?? null)

  useEffect(() => {
    if (given !== undefined || !schoolId) return
    let live = true
    fetchRecordsForReview(schoolId, subjectId ?? null).then(({ records, notSetUp }) => {
      if (live) setWaiting(notSetUp ? null : records.filter((r) => r.status === 'submitted').length)
    })
    return () => {
      live = false
    }
  }, [schoolId, subjectId, given])

  return (
    <Link to="../plan-signoff" relative="path" className="card flex items-center gap-3 p-4 transition hover:bg-navy-50">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
        <CalendarIcon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-navy-900">Plan sign-off</span>
        <span className="block text-xs text-navy-500">
          {waiting === null
            ? 'Recorded lesson plans to sign off, and ATP coverage by teacher'
            : waiting === 0
              ? 'Nothing waiting for you. See ATP coverage by teacher.'
              : `${waiting} recorded week${waiting === 1 ? '' : 's'} waiting for your sign-off`}
        </span>
      </span>
      <ChevronRightIcon className="h-5 w-5 text-navy-400" />
    </Link>
  )
}
