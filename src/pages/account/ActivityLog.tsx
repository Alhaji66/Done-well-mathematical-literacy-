import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { ClockIcon } from '@/components/ui/Icons'
import { describeEntry, fetchAuditLog, type AuditEntry } from '@/lib/auditLog'

/**
 * Who changed what at this school, and when.
 *
 * Shown to approved staff only -- the database refuses the log to anyone else,
 * so this page cannot show more than the viewer is already entitled to. It is
 * read-only by design: nobody in the app can edit or delete an entry.
 */
export function ActivityLog() {
  const { profile } = useAccountAuth()
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!profile?.school_id) {
      setLoading(false)
      return
    }
    let active = true
    fetchAuditLog(profile.school_id).then((r) => {
      if (!active) return
      setEntries(r.entries)
      setNames(r.names)
      setError(r.error ?? '')
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [profile?.school_id])

  // Group by day, newest first, so a week's changes read as a diary.
  const days = new Map<string, AuditEntry[]>()
  for (const e of entries) {
    const day = new Date(e.at).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    days.set(day, [...(days.get(day) ?? []), e])
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Security"
        title="Activity log"
        description="Every change to who can see what at your school — staff approvals, role changes, people joining or leaving, classes, parent links, consent and weekly tests. Nobody can edit or delete these entries."
      />
      {loading ? (
        <p className="text-sm text-navy-500">Loading activity…</p>
      ) : error ? (
        <div className="card border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          The activity log is not switched on yet. Your administrator needs to run the latest database update (STEP 13).
        </div>
      ) : entries.length === 0 ? (
        <EmptyState icon={<ClockIcon className="h-5 w-5" />} title="Nothing recorded yet" description="Changes will appear here as they happen." />
      ) : (
        [...days].map(([day, rows]) => (
          <section key={day} className="card p-4 sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-navy-500">{day}</h2>
            <ul className="mt-2 divide-y divide-navy-100">
              {rows.map((e) => (
                <li key={e.id} className="flex gap-3 py-2.5">
                  <span className="w-12 shrink-0 pt-0.5 text-xs tabular-nums text-navy-500">
                    {new Date(e.at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-sm text-navy-800">{describeEntry(e, names)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
