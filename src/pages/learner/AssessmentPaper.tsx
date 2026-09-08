import { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { demoLearner } from '@/data/learner'
import { getPaper, type Paper } from '@/data/papers'
import { getAnsweredItemIds, markItemAnswered, countPaperItems } from '@/lib/paperProgress'
import { PaperRunner } from '@/components/assessments/PaperRunner'
import { RouteLoading } from '@/components/layout/RouteLoading'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowLeftIcon } from '@/components/ui/Icons'

/**
 * Demo-mode equivalent of the real PaperPage (under /account/.../assessments/:paperId)
 * -- same real paper content and per-paper "answered" progress bar (tracked
 * locally per browser via paperProgress.ts), but no topic-mastery writes:
 * there's no signed-in account here to save them against.
 */
export function LearnerAssessmentPaper() {
  const { paperId } = useParams()
  const [paper, setPaper] = useState<Paper | null>(null)
  const [paperLoaded, setPaperLoaded] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)

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
        setAnsweredCount(result ? getAnsweredItemIds(demoLearner.id, result.id).size : 0)
        setPaperLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [paperId])

  if (!paperLoaded) return <RouteLoading />
  if (!paper) return <Navigate to=".." relative="path" replace />

  const totalItems = countPaperItems(paper)
  const hours = Math.round((paper.durationMinutes / 60) * 10) / 10

  return (
    <div className="space-y-6">
      <Link to=".." relative="path" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900">
        <ArrowLeftIcon className="h-4 w-4" /> Back to Assessments
      </Link>

      <SectionHeading eyebrow={`Paper ${paper.paperNumber}`} title={paper.title} description={`${paper.totalMarks} marks · suggested time ${hours} hours`} />

      <div className="rounded-lg border border-navy-200 bg-navy-50 p-3 text-xs text-navy-600">
        This is real DONE WELL content, but demo answers aren't saved.{' '}
        <Link to="/sign-in" className="font-semibold text-navy-800 underline underline-offset-2">
          Sign up
        </Link>{' '}
        to save your progress and track topic mastery for real.
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-navy-500">
          <span>Your progress on this paper</span>
          <span>
            {answeredCount} of {totalItems} answered
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-navy-100">
          <div
            className="h-full rounded-full bg-gold-500 transition-[width]"
            style={{ width: `${totalItems === 0 ? 0 : Math.round((answeredCount / totalItems) * 100)}%` }}
          />
        </div>
      </div>

      <PaperRunner
        paper={paper}
        onAttempt={() => {}}
        onItemAnswered={(itemId) => {
          markItemAnswered(demoLearner.id, paper.id, itemId)
          setAnsweredCount(getAnsweredItemIds(demoLearner.id, paper.id).size)
        }}
      />
    </div>
  )
}
