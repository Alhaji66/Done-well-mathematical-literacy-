import { useEffect, useMemo, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchSchoolLearners, fetchProgressForLearners, averageMastery, type RosterLearner, type RosterProgressRow } from '@/lib/teacherRoster'
import { learnersInScope, scopeSubjectFor, ALL_GRADES } from '@/lib/teacherScope'
import { subjects } from '@/data/subjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { UsersIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

/**
 * Every learner taking this HOD's subject, across all three grades.
 *
 * The grade control here is a VIEW filter and nothing else -- it is not stored,
 * and it starts with every grade on. That is the opposite of the teacher
 * dashboard, where the grade selection is remembered because it describes an
 * allocation. An HOD is responsible for all three grades whether or not they
 * are looking at all three today.
 */
export function HodLearners() {
  const { profile } = useAccountAuth()
  const subjectId = scopeSubjectFor(profile)

  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [loading, setLoading] = useState(true)
  const [grades, setGrades] = useState<number[]>([...ALL_GRADES])

  useEffect(() => {
    if (!profile?.school_id || !subjectId) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    const load = async () => {
      const roster = learnersInScope(await fetchSchoolLearners(profile.school_id!), subjectId)
      const rows = roster.length ? await fetchProgressForLearners(roster.map((l) => l.id)) : []
      if (!active) return
      setLearners(roster)
      setProgress(rows)
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [profile?.school_id, subjectId])

  const visible = useMemo(
    () =>
      learners
        .filter((l) => l.grade !== null && grades.includes(l.grade))
        .sort((a, b) => (a.grade ?? 0) - (b.grade ?? 0) || a.full_name.localeCompare(b.full_name)),
    [learners, grades],
  )

  if (!profile) return null
  const subjectName = subjects.find((s) => s.id === subjectId)?.name ?? 'your subject'

  const toggleGrade = (g: number) =>
    setGrades((current) =>
      // Turning off the last grade would show an empty list with no way back
      // that reads as "no learners" rather than "no grades selected".
      current.includes(g) ? (current.length === 1 ? current : current.filter((x) => x !== g)) : [...current, g],
    )

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Learners"
        title={`${subjectName} learners`}
        description="Everyone taking this subject at your school, whoever teaches them."
      />

      <div className="card flex flex-wrap items-center gap-2 p-4">
        <span className="text-xs font-medium text-navy-500">Show grades</span>
        {ALL_GRADES.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={grades.includes(g)}
            onClick={() => toggleGrade(g)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm font-medium',
              grades.includes(g)
                ? 'border-navy-900 bg-navy-900 text-white'
                : 'border-navy-200 bg-white text-navy-600',
            )}
          >
            Grade {g}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-6 w-6" />}
          title={learners.length > 0 ? 'No learners in the grades you selected' : 'No learners in this department yet'}
          description={
            learners.length > 0
              ? `You have ${learners.length} learner${learners.length === 1 ? '' : 's'} in ${subjectName}, but none in the grades above.`
              : `Give them your school's join code. A learner who signs up and picks ${subjectName} appears here automatically.`
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-100 bg-navy-50 text-xs uppercase tracking-wide text-navy-500">
              <tr>
                <th className="px-4 py-3 font-medium">Learner</th>
                <th className="px-4 py-3 font-medium">Grade</th>
                <th className="px-4 py-3 font-medium">Average mastery</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => {
                const avg = averageMastery(l.id, progress)
                return (
                  <tr key={l.id} className="border-b border-navy-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-navy-900">{l.full_name}</td>
                    <td className="px-4 py-3 text-navy-600">{l.grade ?? '—'}</td>
                    <td className="px-4 py-3 text-navy-600">
                      {avg === null ? <span className="text-navy-400">Not practised yet</span> : `${avg}%`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
