import { demoLearner } from '@/data/learner'
import { CheckMyWorking } from '@/components/tutor/CheckMyWorking'

/** The demo's "Check my working". Live checks need an account; see CheckMyWorking. */
export function LearnerTutor() {
  return <CheckMyWorking mode="demo" subjectId={demoLearner.subjectId} grade={demoLearner.grade} />
}
