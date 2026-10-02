import type { AccountProfile } from '@/context/AccountAuthContext'
import { fetchInterventionLearners, fetchInterventions, outcomesFor, type Intervention, type InterventionLearner } from '@/lib/interventions'
import { fetchAttemptsForTests, fetchTestsForSchool, type TestAttempt, type WeeklyTest } from '@/lib/weeklyTests'
import type { ImpactGroup } from '@/lib/catchUpImpact'

/** The catch-up groups a person looks after: a teacher's own, an HOD's subject's, a principal's school's. */
export function interventionsInView(profile: Pick<AccountProfile, 'id' | 'role' | 'subject_id'>, all: Intervention[]): Intervention[] {
  return all.filter((iv) =>
    profile.role === 'teacher' ? iv.created_by === profile.id : profile.role === 'hod' && profile.subject_id ? iv.subject_id === profile.subject_id : true,
  )
}

/** Groups with each learner's starting point and latest reassessment, ready to add up. */
export function toImpactGroups(
  interventions: Intervention[],
  members: InterventionLearner[],
  tests: WeeklyTest[],
  attempts: Record<string, TestAttempt[]>,
): ImpactGroup[] {
  return interventions.map((iv) => ({
    id: iv.id,
    subjectId: iv.subject_id,
    grade: iv.grade,
    topicId: iv.topic_id,
    classId: iv.class_id,
    createdBy: iv.created_by,
    status: iv.status,
    createdAt: iv.created_at,
    outcomes: outcomesFor(
      members.filter((m) => m.intervention_id === iv.id),
      tests.filter((t) => t.intervention_id === iv.id),
      attempts,
    ),
  }))
}

/** Everything the dashboard card needs, for one person. */
export async function fetchImpactGroups(profile: AccountProfile): Promise<ImpactGroup[]> {
  if (!profile.school_id) return []
  const [{ interventions: all }, tests] = await Promise.all([fetchInterventions(profile.school_id), fetchTestsForSchool(profile.school_id)])
  const interventions = interventionsInView(profile, all)
  if (!interventions.length) return []
  const ids = new Set(interventions.map((iv) => iv.id))
  const reassessments = tests.filter((t) => t.intervention_id && ids.has(t.intervention_id))
  const [members, rows] = await Promise.all([fetchInterventionLearners([...ids]), fetchAttemptsForTests(reassessments.map((t) => t.id))])
  const attempts: Record<string, TestAttempt[]> = {}
  for (const a of rows) (attempts[a.test_id] ??= []).push(a)
  return toImpactGroups(interventions, members, reassessments, attempts)
}
