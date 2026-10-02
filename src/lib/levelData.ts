import type { AccountProfile } from '@/context/AccountAuthContext'
import { classesInView, fetchClassMembers, fetchClasses } from '@/lib/classes'
import { fetchSchoolLearners } from '@/lib/teacherRoster'
import { fetchSchoolName } from '@/lib/schools'
import { fetchSchoolTeachers } from '@/lib/schoolStaff'
import { fetchReplies } from '@/lib/parentReplies'
import { fetchMarksFor } from '@/lib/sbaMarks'
import { fetchAttemptsForTests, fetchTestsForSchool } from '@/lib/weeklyTests'
import { sbaResults, weeklyResults, type LevelData } from '@/lib/levels'

/**
 * Everything the Levels page and the early-warning card need, for one person:
 * the classes in their view, their learners, and every result from weekly
 * tests and the mark book this year. A teacher's results are their own
 * classes'; an HOD's their subject's; a principal's the school's. Names are
 * loaded only for the teacher and HOD, who see learners by name.
 */
export async function fetchLevelData(profile: AccountProfile): Promise<LevelData | null> {
  if (!profile.school_id) return null
  const schoolId = profile.school_id
  const teacher = profile.role === 'teacher'
  const named = teacher || profile.role === 'hod'
  const year = new Date().getFullYear()
  const [{ classes: all }, allTests, roster, school, staff] = await Promise.all([
    fetchClasses(schoolId),
    fetchTestsForSchool(schoolId),
    named ? fetchSchoolLearners(schoolId) : Promise.resolve([]),
    fetchSchoolName(schoolId),
    named ? fetchSchoolTeachers(schoolId) : Promise.resolve([]),
  ])
  const teacherName = new Map(staff.map((t) => [t.id, t.full_name]))
  const classes = classesInView(profile, all).map((c) => ({
    ...c,
    teacher: c.teacher_id === profile.id ? profile.full_name : c.teacher_id ? (teacherName.get(c.teacher_id) ?? null) : null,
  }))
  const ids = classes.map((c) => c.id)
  const subjectsInView = new Set(classes.map((c) => c.subject_id))
  if (profile.role === 'hod' && profile.subject_id) subjectsInView.add(profile.subject_id)
  // A principal sees every test; a teacher or HOD the tests in their subjects.
  const tests = allTests.filter((t) => profile.role === 'school' || subjectsInView.has(t.subject_id))
  const [members, rows, attempts, replies] = await Promise.all([
    fetchClassMembers(ids),
    fetchMarksFor(ids, year),
    fetchAttemptsForTests(tests.map((t) => t.id)),
    named ? fetchReplies(`${year}-01-01`) : Promise.resolve([]),
  ])
  const byClass = new Map<string, string[]>()
  for (const m of members) byClass.set(m.class_id, [...(byClass.get(m.class_id) ?? []), m.learner_id])
  let results = [...weeklyResults(tests, attempts, classes, byClass, year), ...sbaResults(rows ?? [], classes)]
  // A teacher's view is their own classes' learners.
  if (teacher) results = results.filter((r) => r.classId && ids.includes(r.classId))
  return { year, school, classes, names: new Map(roster.map((l) => [l.id, l.full_name])), members: byClass, results, replies }
}
