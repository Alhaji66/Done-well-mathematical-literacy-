import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchSchoolTeachers, type SchoolTeacher } from '@/lib/schoolStaff'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { SchoolIcon } from '@/components/ui/Icons'

function formatJoinedDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function SchoolTeachers() {
  const { profile } = useAccountAuth()
  const [teachers, setTeachers] = useState<SchoolTeacher[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Teachers" title="Teaching staff" description="Everyone signed up as a teacher at your school." />

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : teachers.length === 0 ? (
        <EmptyState
          icon={<SchoolIcon className="h-6 w-6" />}
          title="No teachers have joined yet"
          description="Once a teacher signs up and enters this same school name, they'll show up here automatically."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {teachers.map((t) => (
            <div key={t.id} className="card flex items-center gap-3 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                <SchoolIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy-900">{t.full_name}</p>
                <p className="text-xs text-navy-500">Joined {formatJoinedDate(t.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
