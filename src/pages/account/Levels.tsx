import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { classesInView, fetchClassMembers, fetchClasses } from '@/lib/classes'
import { fetchSchoolLearners } from '@/lib/teacherRoster'
import { fetchMarksFor } from '@/lib/sbaMarks'
import { fetchAttemptsForTests, fetchTestsForSchool } from '@/lib/weeklyTests'
import { sbaResults, weeklyResults, type LevelData } from '@/lib/levels'
import { LevelsView } from '@/components/levels/LevelsView'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Learners' levels, 1 to 7, from weekly tests and SBA tasks. A class teacher
 * sees each of their learners; a head of department sees how many learners
 * in their subject are at each level and, class by class, who they are; a
 * principal sees how many learners in the school are at each level.
 */
export function Levels() {
  const { profile } = useAccountAuth()
  const [data, setData] = useState<LevelData | null>(null)
  const teacher = profile?.role === 'teacher'
  const hod = profile?.role === 'hod'
  // Names are loaded only for the views that show them.
  const named = teacher || hod

  useEffect(() => {
    if (!profile?.school_id) return
    let live = true
    const schoolId = profile.school_id
    const year = new Date().getFullYear()
    Promise.all([fetchClasses(schoolId), fetchTestsForSchool(schoolId), named ? fetchSchoolLearners(schoolId) : Promise.resolve([])]).then(
      async ([{ classes: all }, allTests, roster]) => {
        const classes = classesInView(profile, all)
        const ids = classes.map((c) => c.id)
        const subjectsInView = new Set(classes.map((c) => c.subject_id))
        if (profile.role === 'hod' && profile.subject_id) subjectsInView.add(profile.subject_id)
        // A principal sees every test; a teacher or HOD the tests in their subjects.
        const tests = allTests.filter((t) => profile.role === 'school' || subjectsInView.has(t.subject_id))
        const [members, rows, attempts] = await Promise.all([
          fetchClassMembers(ids),
          fetchMarksFor(ids, year),
          fetchAttemptsForTests(tests.map((t) => t.id)),
        ])
        if (!live) return
        const byClass = new Map<string, string[]>()
        for (const m of members) byClass.set(m.class_id, [...(byClass.get(m.class_id) ?? []), m.learner_id])
        let results = [...weeklyResults(tests, attempts, classes, byClass, year), ...sbaResults(rows ?? [], classes)]
        // A teacher's view is their own classes' learners.
        if (teacher) results = results.filter((r) => r.classId && ids.includes(r.classId))
        setData({ year, classes, names: new Map(roster.map((l) => [l.id, l.full_name])), members: byClass, results })
      },
    )
    return () => {
      live = false
    }
  }, [profile, teacher, named])

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="CAPS levels"
        title={teacher ? 'My learners’ levels' : 'Levels across the school'}
        description={
          teacher
            ? 'Each learner’s level, 1 to 7, on every weekly test and SBA task, and for the term or year.'
            : profile?.role === 'hod'
              ? 'How many learners in your subject are at each level, 1 to 7, by grade, class and test. Switch to Learners to see each learner’s level, class by class.'
              : 'How many learners are at each level, 1 to 7, in every subject and grade, then by class and by test.'
        }
      />
      {data ? <LevelsView data={data} mode={teacher ? 'learners' : hod ? 'both' : 'tally'} /> : <p className="text-sm text-navy-500">Loading levels…</p>}
    </div>
  )
}
