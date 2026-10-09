import { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { getPaper, type Paper } from '@/data/papers'
import { DemoPaperExam } from '@/components/assessments/PaperExam'
import { RouteLoading } from '@/components/layout/RouteLoading'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowLeftIcon } from '@/components/ui/Icons'

/**
 * Demo-mode equivalent of the real PaperPage (under /account/.../assessments/:paperId):
 * the same paper, written the same way -- memo closed until it is handed in or
 * the time is up -- but nothing saved and only multiple choice scored.
 */
export function LearnerAssessmentPaper() {
  const { paperId } = useParams()
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

  if (!paperLoaded) return <RouteLoading />
  if (!paper) return <Navigate to=".." relative="path" replace />

  const hours = Math.round((paper.durationMinutes / 60) * 10) / 10

  return (
    <div className="space-y-6">
      <Link to=".." relative="path" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900">
        <ArrowLeftIcon className="h-4 w-4" /> Back to Assessments
      </Link>

      <SectionHeading eyebrow={`Paper ${paper.paperNumber}`} title={paper.title} description={`${paper.totalMarks} marks · suggested time ${hours} hours`} />

      <DemoPaperExam paper={paper} />
    </div>
  )
}
