import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchDepartmentTeachers, type SchoolTeacher } from '@/lib/schoolStaff'
import { scopeSubjectFor } from '@/lib/teacherScope'
import { subjects } from '@/data/subjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { SchoolIcon } from '@/components/ui/Icons'

function formatJoinedDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

/**
 * The teachers in this HOD's own department.
 *
 * Deliberately a roll, not a ranking. The per-teacher class averages an HOD
 * would want here cannot be built honestly yet: nothing in the data says WHICH
 * teacher a learner belongs to -- a learner row carries a subject and a grade,
 * not a teacher. Inventing an attribution from the grade would hand a teacher a
 * number for a class that is not theirs, which is the exact bug that made the
 * grade filter necessary in the first place.
 */
export function HodTeachers() {
  const { profile } = useAccountAuth()
  const subjectId = scopeSubjectFor(profile)
  const [teachers, setTeachers] = useState<SchoolTeacher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.school_id || !subjectId) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    fetchDepartmentTeachers(profile.school_id, subjectId).then((rows) => {
      if (!active) return
      setTeachers(rows)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [profile?.school_id, subjectId])

  if (!profile) return null
  const subjectName = subjects.find((s) => s.id === subjectId)?.name ?? 'your subject'

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Teachers"
        title={`${subjectName} teachers`}
        description="Everyone at your school teaching this subject, including you."
      />

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : teachers.length === 0 ? (
        <EmptyState
          icon={<SchoolIcon className="h-6 w-6" />}
          title="No teachers in this department yet"
          description={`Give them your school's join code. A teacher who signs up and picks ${subjectName} appears here automatically.`}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {teachers.map((t) => (
            <div key={t.id} className="card flex items-center gap-3 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                <SchoolIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy-900">
                  {t.full_name}
                  {t.id === profile.id ? <span className="ml-2 text-xs font-medium text-navy-500">(you)</span> : null}
                </p>
                <p className="text-xs text-navy-500">Joined {formatJoinedDate(t.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
