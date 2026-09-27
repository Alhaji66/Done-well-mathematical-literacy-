import { useAccountAuth } from '@/context/AccountAuthContext'
import { PROGRAMME_SOURCE } from '@/data/sba'
import { LearnerSbaReports } from '@/components/markbook/SbaReport'
import { SectionHeading } from '@/components/ui/SectionHeading'

/** The learner's own SBA marks, as their teachers enter them in the mark book. */
export function LearnerSbaMarks() {
  const { profile } = useAccountAuth()
  if (!profile) return null
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Formal assessment"
        title="My SBA marks"
        description={`Your marks for the formal tasks of the ${PROGRAMME_SOURCE}, as your teacher enters them, and what they add up to so far.`}
      />
      <LearnerSbaReports
        learnerId={profile.id}
        topicLink={(subject, grade, topic) => `/account/learner/practise?subject=${subject}&grade=${grade}&topic=${topic}`}
        empty="Your marks will show here once your teacher enters them in the class mark book."
      />
    </div>
  )
}
