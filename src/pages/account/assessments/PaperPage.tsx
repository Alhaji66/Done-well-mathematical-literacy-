import { useEffect, useState } from 'react'
import { useParams, Navigate, Link, useSearchParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { getPaper, type Paper } from '@/data/papers'
import { PaperRunner } from '@/components/assessments/PaperRunner'
import { PaperExam } from '@/components/assessments/PaperExam'
import { RouteLoading } from '@/components/layout/RouteLoading'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowLeftIcon } from '@/components/ui/Icons'

/**
 * Shared "take/review a paper" route for all three roles
 * (/account/{learner,teacher,school}/assessments/:paperId).
 *
 * A learner WRITES the paper under exam conditions (PaperExam, STEP 41): the
 * memo stays closed until they hand in or the time runs out, then the paper
 * is marked and their teacher sees the result. Teacher and school see the
 * same content read-only, with a memo copy to print.
 */
export function PaperPage() {
  const { paperId } = useParams()
  const { profile } = useAccountAuth()

  const isLearner = profile?.role === 'learner'
  // Staff can open the memo copy: every answer and marking memo showing, ready
  // to print. Learners never get it -- the memo opens only after the paper.
  const [params, setParams] = useSearchParams()
  const memoView = !isLearner && params.get('view') === 'memo'
  const setView = (memo: boolean) => {
    const next = new URLSearchParams(params)
    if (memo) next.set('view', 'memo')
    else next.delete('view')
    setParams(next, { replace: true })
  }
  const [paper, setPaper] = useState<Paper | null>(null)
  const [paperLoaded, setPaperLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    setPaperLoaded(false)
    setPaper(null)
    if (!paperId) {
      setPaperLoaded(true)
      return
    }
    getPaper(paperId).then((result) => {
      if (!cancelled) {
        setPaper(result ?? null)
        setPaperLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [paperId])

  if (!profile) return null
  if (!paperLoaded) return <RouteLoading />
  if (!paper) return <Navigate to=".." relative="path" replace />

  const hours = Math.round((paper.durationMinutes / 60) * 10) / 10

  return (
    <div className="space-y-6">
      <Link to=".." relative="path" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900">
        <ArrowLeftIcon className="h-4 w-4" /> Back to Assessments
      </Link>

      <SectionHeading eyebrow={`Paper ${paper.paperNumber}`} title={paper.title} description={`${paper.totalMarks} marks · ${hours} hours`} />

      {!isLearner ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-navy-200 bg-navy-50 p-3 text-xs text-navy-600 print:hidden">
          <span>Reviewing as {profile.role} — answers here aren't saved to any learner's progress.</span>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-navy-200 bg-white p-0.5">
              {([false, true] as const).map((memo) => (
                <button
                  key={String(memo)}
                  type="button"
                  aria-pressed={memoView === memo}
                  onClick={() => setView(memo)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${memoView === memo ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50'}`}
                >
                  {memo ? 'Memo' : 'Questions'}
                </button>
              ))}
            </div>
            {memoView ? (
              <button type="button" onClick={() => window.print()} className="btn-outline btn-sm">
                Print memo
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {isLearner ? <PaperExam paper={paper} /> : <PaperRunner paper={paper} showAnswers={memoView} />}
    </div>
  )
}
