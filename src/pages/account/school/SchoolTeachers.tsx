import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchSchoolTeachers, type SchoolTeacher } from '@/lib/schoolStaff'
import { setAccountRole } from '@/lib/teacherScope'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { SchoolIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

function formatJoinedDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

const staffRoles = [
  { role: 'teacher' as const, label: 'Teacher' },
  { role: 'hod' as const, label: 'Head of Department' },
]

export function SchoolTeachers() {
  const { profile } = useAccountAuth()
  const [teachers, setTeachers] = useState<SchoolTeacher[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!profile?.school_id) {
      setLoading(false)
      return
    }
    let active = true
    fetchSchoolTeachers(profile.school_id).then((rows) => {
      if (active) {
        setTeachers(rows)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [profile?.school_id])

  if (!profile) return null

  /**
   * Correcting a colleague's role.
   *
   * Every account picks its role on the first screen it ever sees, so mistaps
   * are inevitable, and until now a teacher who meant to pick Head of
   * Department had no way back -- the teacher dashboard can only correct
   * LEARNERS, and nothing could correct staff at all. The principal is the
   * right authority for this, so it lives on their staff list.
   */
  const changeRole = async (id: string, role: 'teacher' | 'hod') => {
    setSaving(id)
    const message = await setAccountRole(id, role)
    setSaving(null)
    if (message) {
      setError(message)
      return
    }
    setError('')
    setTeachers((rows) => rows.map((t) => (t.id === id ? { ...t, role } : t)))
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Teachers"
        title="Teaching staff"
        description="Everyone signed up as a teacher or head of department at your school."
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : teachers.length === 0 ? (
        <EmptyState
          icon={<SchoolIcon className="h-6 w-6" />}
          title="No teachers have joined yet"
          description="Give them the join code from your dashboard. Once a teacher signs up and enters it, they'll show up here automatically."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {teachers.map((t) => {
            // A principal changing their OWN row here would drop themselves out
            // of the school view with no way back in, so their own row is shown
            // without the control rather than with a control that traps them.
            const isSelf = t.id === profile.id
            return (
              <div key={t.id} className="card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                    <SchoolIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-900">{t.full_name}</p>
                    <p className="text-xs text-navy-500">
                      {t.role === 'hod' ? 'Head of Department' : 'Teacher'} · joined {formatJoinedDate(t.created_at)}
                    </p>
                  </div>
                </div>

                {isSelf ? null : (
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-navy-100 pt-3">
                    <span className="text-xs font-medium text-navy-500">Role</span>
                    {staffRoles.map((r) => (
                      <button
                        key={r.role}
                        type="button"
                        disabled={saving === t.id}
                        aria-pressed={t.role === r.role}
                        onClick={() => changeRole(t.id, r.role)}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs font-medium disabled:opacity-50',
                          t.role === r.role
                            ? 'border-navy-900 bg-navy-900 text-white'
                            : 'border-navy-200 bg-white text-navy-600',
                        )}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <p className="text-xs leading-relaxed text-navy-400">
        A head of department sees every teacher and every learner in their own subject, across all three grades. A
        teacher sees only the learners they teach. Changing this does not change anybody's subject.
      </p>
    </div>
  )
}
