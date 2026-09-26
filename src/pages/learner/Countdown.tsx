import { useMemo } from 'react'
import { demoLearner } from '@/data/learner'
import { recordDemoAnswer } from '@/lib/demoMistakes'
import { demoExampleExamDate } from '@/lib/revisionPlan'
import { ExamCountdown } from '@/components/revision/ExamCountdown'

/**
 * The demo's exam countdown, planned from Karabo's marks. It opens on an
 * example exam date five weeks out, so the plan is there on first look.
 */
export function LearnerCountdown() {
  const marks = useMemo(() => demoLearner.topicProgress.map((t) => ({ topicId: t.topicId, mastery: t.masteryPercent })), [])
  const exampleDate = useMemo(demoExampleExamDate, [])
  return (
    <ExamCountdown
      scope="demo"
      subjectId={demoLearner.subjectId}
      grade={demoLearner.grade}
      marks={marks}
      exampleDate={exampleDate}
      onResult={(q, correct) => recordDemoAnswer(q, 'practice', correct)}
    />
  )
}
