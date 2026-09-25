import { supabase } from '@/lib/supabaseClient'
import type { Grade } from '@/types'
import type { TestAttempt, WeeklyTest } from '@/lib/weeklyTests'

/**
 * Interventions -- "catch-up groups" in the app.
 *
 * The step after analysis in the spec's assessment cycle: a teacher sees that
 * some learners are behind on a topic, groups them, records where each one
 * started, teaches them, and reassesses them with a test set for the group
 * alone. The before-and-after is the point: it is how a school knows the extra
 * lessons worked. Access rules are in STEP 15 of supabase/schema.sql.
 */

export type InterventionStatus = 'active' | 'completed' | 'cancelled'

export interface Intervention {
  id: string
  school_id: string
  class_id: string | null
  subject_id: string
  grade: Grade
  topic_id: string
  subtopic: string | null
  plan: string
  diagnostic_test_id: string | null
  status: InterventionStatus
  created_by: string | null
  created_at: string
  closed_at: string | null
}

export interface InterventionLearner {
  intervention_id: string
  learner_id: string
  baseline_percent: number | null
  added_at: string
}

const isMissing = (error: { code?: string; message?: string }) =>
  error.code === '42P01' || error.code === 'PGRST205' || /does not exist|schema cache/i.test(error.message ?? '')

export async function fetchInterventions(schoolId: string): Promise<{ interventions: Intervention[]; notSetUp: boolean }> {
  if (!supabase) return { interventions: [], notSetUp: true }
  const { data, error } = await supabase
    .from('interventions')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
  if (error) {
    if (!isMissing(error)) console.error('Failed to load catch-up groups:', error)
    return { interventions: [], notSetUp: isMissing(error) }
  }
  return { interventions: (data ?? []) as Intervention[], notSetUp: false }
}

export async function fetchInterventionLearners(ids: string[]): Promise<InterventionLearner[]> {
  if (!supabase || ids.length === 0) return []
  const { data, error } = await supabase.from('intervention_learners').select('*').in('intervention_id', ids)
  if (error) {
    if (!isMissing(error)) console.error('Failed to load catch-up group members:', error)
    return []
  }
  return (data ?? []) as InterventionLearner[]
}

/**
 * The interventions some learners are in, with their own rows. Used by a
 * learner for themselves and by a parent for their linked children -- the
 * database shows each of them only those rows.
 */
export async function fetchInterventionsFor(
  learnerIds: string[],
): Promise<{ interventions: Intervention[]; places: InterventionLearner[] }> {
  if (!supabase || learnerIds.length === 0) return { interventions: [], places: [] }
  const { data: places, error } = await supabase.from('intervention_learners').select('*').in('learner_id', learnerIds)
  if (error || !places?.length) return { interventions: [], places: [] }
  const { data } = await supabase
    .from('interventions')
    .select('*')
    .in('id', [...new Set(places.map((p) => p.intervention_id as string))])
  return { interventions: (data ?? []) as Intervention[], places: places as InterventionLearner[] }
}

export async function startIntervention(input: {
  schoolId: string
  createdBy: string
  classId: string | null
  subjectId: string
  grade: Grade
  topicId: string
  subtopic: string | null
  plan: string
  diagnosticTestId: string | null
  learners: { id: string; baseline: number | null }[]
}): Promise<{ intervention?: Intervention; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const { data, error } = await supabase
    .from('interventions')
    .insert({
      school_id: input.schoolId,
      created_by: input.createdBy,
      class_id: input.classId,
      subject_id: input.subjectId,
      grade: input.grade,
      topic_id: input.topicId,
      subtopic: input.subtopic,
      plan: input.plan.trim(),
      diagnostic_test_id: input.diagnosticTestId,
    })
    .select('*')
    .single()
  if (error) {
    console.error('Failed to start the catch-up group:', error)
    return { error: error.message }
  }
  const intervention = data as Intervention
  if (input.learners.length) {
    const { error: addError } = await supabase.from('intervention_learners').insert(
      input.learners.map((l) => ({
        intervention_id: intervention.id,
        learner_id: l.id,
        baseline_percent: l.baseline === null ? null : Math.max(0, Math.min(100, Math.round(l.baseline))),
      })),
    )
    if (addError) {
      console.error('Failed to add learners to the catch-up group:', addError)
      return { intervention, error: `The group was started, but its learners could not be added: ${addError.message}` }
    }
  }
  return { intervention }
}

export async function setInterventionStatus(id: string, status: InterventionStatus): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase
    .from('interventions')
    .update({ status, closed_at: status === 'active' ? null : new Date().toISOString() })
    .eq('id', id)
  if (error) {
    console.error('Failed to update the catch-up group:', error)
    return error.message
  }
  return undefined
}

export async function removeInterventionLearner(id: string, learnerId: string): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.from('intervention_learners').delete().eq('intervention_id', id).eq('learner_id', learnerId)
  return error ? error.message : undefined
}

/** A submitted attempt as a percentage, or null if it has no marks. */
export function attemptPercent(a: Pick<TestAttempt, 'marks_awarded' | 'marks_total'>): number | null {
  if (!a.marks_total) return null
  return Math.round(((a.marks_awarded ?? 0) / a.marks_total) * 100)
}

export interface Outcome {
  learnerId: string
  baseline: number | null
  /** The learner's latest reassessment, as a percentage. */
  latest: number | null
  change: number | null
}

/**
 * Where each learner in a group started and where they are now.
 *
 * "Now" is their latest handed-in reassessment -- a test set for this group --
 * not their practice mastery, so the comparison is test against test where
 * the group was started from a test.
 */
export function outcomesFor(
  members: InterventionLearner[],
  reassessments: WeeklyTest[],
  attempts: Record<string, TestAttempt[]>,
): Outcome[] {
  const order = [...reassessments].sort((a, b) => a.due_at.localeCompare(b.due_at))
  return members.map((m) => {
    let latest: number | null = null
    for (const t of order) {
      const a = (attempts[t.id] ?? []).find((x) => x.learner_id === m.learner_id && x.submitted_at)
      const pct = a ? attemptPercent(a) : null
      if (pct !== null) latest = pct
    }
    const change = latest !== null && m.baseline_percent !== null ? latest - m.baseline_percent : null
    return { learnerId: m.learner_id, baseline: m.baseline_percent, latest, change }
  })
}

/** The catch-up groups a learner is in, by id -- for deciding which tests are theirs. */
export async function fetchMyInterventionIds(learnerId: string): Promise<string[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('intervention_learners').select('intervention_id').eq('learner_id', learnerId)
  if (error) return []
  return (data ?? []).map((r) => r.intervention_id as string)
}
