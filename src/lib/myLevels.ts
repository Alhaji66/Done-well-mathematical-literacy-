import { supabase } from '@/lib/supabaseClient'
import { sbaResults, weeklyResults, type LevelClass, type LevelResult } from '@/lib/levels'
import type { SbaMarkRow } from '@/lib/sbaMarks'
import type { TestAttempt, WeeklyTest } from '@/lib/weeklyTests'

/**
 * The level results a learner, or a parent for their linked children, may
 * see: their own handed-in weekly tests and the SBA marks the teacher has
 * released. The database decides what comes back (a learner reads only their
 * own rows; a parent only their linked children's, and only released marks).
 *
 * `hiddenTests` counts, per learner, attempts whose test could not be read -- a parent
 * before STEP 27 of the database set-up -- so the page can say so instead of
 * quietly leaving weekly tests out.
 */
export async function fetchLevelsFor(learnerIds: string[], year = new Date().getFullYear()): Promise<{ results: LevelResult[]; hiddenTests: Map<string, number> }> {
  if (!supabase || learnerIds.length === 0) return { results: [], hiddenTests: new Map() }
  const [attemptsRes, marksRes] = await Promise.all([
    supabase.from('weekly_test_attempts').select('*').in('learner_id', learnerIds).not('submitted_at', 'is', null),
    supabase.from('sba_marks').select('class_id, learner_id, subject_id, grade, year, task_key, mark, status, out_of').in('learner_id', learnerIds).eq('year', year),
  ])
  const attempts = (attemptsRes.data ?? []) as TestAttempt[]
  const testIds = [...new Set(attempts.map((a) => a.test_id))]
  const tests: WeeklyTest[] = []
  for (let i = 0; i < testIds.length; i += 100) {
    const { data } = await supabase.from('weekly_tests').select('*').in('id', testIds.slice(i, i + 100))
    tests.push(...((data ?? []) as WeeklyTest[]))
  }
  const seen = new Set(tests.map((t) => t.id))
  const hiddenTests = new Map<string, number>()
  for (const a of attempts) if (!seen.has(a.test_id)) hiddenTests.set(a.learner_id, (hiddenTests.get(a.learner_id) ?? 0) + 1)

  // A mark row carries its class's subject and grade, which is all sbaResults needs of a class.
  const rows = (marksRes.data ?? []) as Pick<SbaMarkRow, 'class_id' | 'learner_id' | 'subject_id' | 'grade' | 'task_key' | 'mark' | 'status' | 'out_of'>[]
  const classes: LevelClass[] = [...new Map(rows.map((r) => [r.class_id, { id: r.class_id, name: '', subject_id: r.subject_id, grade: r.grade }])).values()]

  return { results: [...weeklyResults(tests, attempts, [], new Map(), year), ...sbaResults(rows, classes)], hiddenTests }
}
