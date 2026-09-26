import { useEffect, useMemo, useRef, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchLearnerProgress, recordAttempt, type ProgressRow } from '@/lib/learnerProgress'
import { recordAnswer } from '@/lib/mistakes'
import { logActivity } from '@/lib/activity'
import { ExamCountdown } from '@/components/revision/ExamCountdown'
import type { Question } from '@/types'

/**
 * A signed-in learner's exam countdown, planned from their own marks. The exam
 * date and the ticked-off days are kept on this phone; answers to the day's
 * questions count towards progress and My Mistakes like any other practice.
 */
export function LearnerCountdown() {
  const { profile } = useAccountAuth()
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [loading, setLoading] = useState(true)
  /** The rows as saved, kept apart from `progress` so answering does not re-plan. */
  const latest = useRef<ProgressRow[]>([])

  useEffect(() => {
    if (!profile) return
    let active = true
    fetchLearnerProgress(profile.id).then((rows) => {
      if (active) {
        setProgress(rows)
        latest.current = rows
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [profile])

  const marks = useMemo(() => progress.map((p) => ({ topicId: p.topic_id, mastery: p.mastery_percent })), [progress])

  if (!profile) return null

  // Marks are not updated mid-page: the plan would reshuffle under the learner
  // while they answer. They are saved, and the next visit plans from them.
  const onAttempt = async (q: Question, correct: boolean | null) => {
    void logActivity(profile.id, 'practice_answer', q.topicId)
    const updated = await recordAttempt(profile.id, q.topicId, correct, latest.current.find((p) => p.topic_id === q.topicId))
    if (updated) latest.current = [...latest.current.filter((p) => p.topic_id !== q.topicId), updated]
  }

  return (
    <ExamCountdown
      scope={profile.id}
      subjectId={profile.subject_id ?? 'mat-lit'}
      grade={profile.grade ?? 12}
      marks={marks}
      loading={loading}
      onAttempt={(q, correct) => void onAttempt(q, correct)}
      onResult={(q, correct) => recordAnswer(q.id, q.topicId, 'practice', correct)}
    />
  )
}
