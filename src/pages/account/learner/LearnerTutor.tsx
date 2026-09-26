import { useAccountAuth } from '@/context/AccountAuthContext'
import { CheckMyWorking } from '@/components/tutor/CheckMyWorking'

export function LearnerTutor() {
  const { profile } = useAccountAuth()
  if (!profile) return null
  return <CheckMyWorking mode="account" subjectId={profile.subject_id ?? 'mat-lit'} grade={profile.grade ?? 12} />
}
