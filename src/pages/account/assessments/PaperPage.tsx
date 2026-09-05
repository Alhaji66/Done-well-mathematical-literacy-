import { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { getPaper } from '@/data/papers'
import { fetchLearnerProgress, recordAttempt, type ProgressRow } from '@/lib/learnerProgress'
import { getAnsweredItemIds, markItemAnswered, countPaperItems } from '@/lib/paperProgress'
import { PaperRunner } from '@/components/assessments/PaperRunner'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowLeftIcon } from '@/components/ui/Icons'

/**
 * Shared "take/review a paper" route for all three roles
 * (/account/{learner,teacher,school}/assessments/:paperId). Only a Learner's
 * answers get recorded to learner_progress; Teacher/School see the same
 * content read-only, since they aren't the ones whose mastery it tracks.
 */
export function PaperPage() {
  const { paperId } = useParams()
  const { profile } = useAccountAuth()
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [savedMessage, setSavedMessage] = useState('')

  const isLearner = profile?.role === 'learner'
  const paper = paperId ? getPaper(paperId) : undefined

  const [answeredCount, setAnsweredCount] = useState(0)

  useEffect(() => {
    if (isLearner && profile) fetchLearnerProgress(profile.id).then(setProgress)
  }, [profile, isLearner])

  useEffect(() => {
    if (isLearner && profile && paper) setAnsweredCount(getAnsweredItemIds(profile.id, paper.id).size)
  }, [profile, isLearner, paper])

  if (!profile) return null
  if (!paper) return <Navigate to=".." relative="path" replace />

  const totalItems = countPaperItems(paper)

  const handleAttempt = isLearner
    ? async (topicId: string, correct: boolean | null) => {
        const existing = progress.find((p) => p.topic_id === topicId)
        const updated = await recordAttempt(profile.id, topicId, correct, existing)
        if (updated) {
          setProgress((prev) => [...prev.filter((p) => p.topic_id !== topicId), updated])
          setSavedMessage('Progress saved')
          setTimeout(() => setSavedMessage(''), 2000)
        }
      }
    : undefined

  const handleItemAnswered = isLearner
    ? (itemId: string) => {
        markItemAnswered(profile.id, paper.id, itemId)
        setAnsweredCount(getAnsweredItemIds(profile.id, paper.id).size)
      }
    : undefined

  const hours = Math.round((paper.durationMinutes / 60) * 10) / 10

  return (
    <div className="space-y-6">
      <Link to=".." relative="path" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900">
        <ArrowLeftIcon className="h-4 w-4" /> Back to Assessments
      </Link>

      <SectionHeading eyebrow={`Paper ${paper.paperNumber}`} title={paper.title} description={`${paper.totalMarks} marks · suggested time ${hours} hours`} />

      {!isLearner ? (
        <div className="rounded-lg border border-navy-200 bg-navy-50 p-3 text-xs text-navy-600">
          Reviewing as {profile.role} — answers here aren't saved to any learner's progress.
        </div>
      ) : null}

      {isLearner && savedMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">{savedMessage}</div>
      ) : null}

      {isLearner ? (
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
      ) : null}

      <PaperRunner paper={paper} onAttempt={handleAttempt} onItemAnswered={handleItemAnswered} />
    </div>
  )
}
