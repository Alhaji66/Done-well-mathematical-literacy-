import { subjects } from '@/data/subjects'

/**
 * Audit log entries as sentences. Kept apart from the database client so it can
 * be exercised without one.
 */

export interface AuditEntry {
  id: number
  at: string
  actor_id: string | null
  actor_role: string | null
  action: string
  target_table: string
  target_id: string | null
  details: Record<string, unknown>
}

const ROLE: Record<string, string> = {
  learner: 'a learner',
  parent: 'a parent',
  teacher: 'a teacher',
  hod: 'a head of department',
  school: 'the school account',
}
const FIELD: Record<string, string> = { full_name: 'name', grade: 'grade', subject: 'subject' }

/** One log entry as a sentence a principal can read without a glossary. */
export function describeEntry(e: AuditEntry, names: Map<string, string>): string {
  const who = (id: string | null | undefined) =>
    id == null ? 'An administrator' : (names.get(id) ?? 'A deleted or departed account')
  const whom = (id: string | null | undefined) =>
    id == null ? 'an account' : (names.get(id) ?? 'a deleted or departed account')
  const actor = who(e.actor_id)
  const target = whom(e.target_id)
  const self = e.actor_id !== null && e.actor_id === e.target_id
  const d = e.details

  switch (e.action) {
    case 'profile.created':
      return `${who(e.target_id)} joined as ${ROLE[String(d.role)] ?? String(d.role)}${d.pending_staff ? ', waiting for staff approval' : ''}.`
    case 'profile.deleted':
      return `An account (${ROLE[String(d.role)] ?? String(d.role)}) was deleted.`
    case 'profile.role_changed':
      return `${actor} changed ${self ? 'their own' : `${target}'s`} role from ${String(d.from)} to ${String(d.to)}.`
    case 'staff.approved':
      return `${actor} approved ${target} as ${ROLE[String(d.role)] ?? 'staff'}.`
    case 'profile.school_changed':
      if (d.staff_request_declined) return `${actor} turned away ${target}'s request to join as staff.`
      return d.direction === 'joined' ? `${who(e.target_id)} joined the school.` : `${who(e.target_id)} left the school.`
    case 'profile.updated': {
      const fields = (Array.isArray(d.fields) ? d.fields : []).map((f) => FIELD[String(f)] ?? String(f))
      return `${actor} corrected ${self ? 'their own' : `${target}'s`} ${fields.join(' and ')}.`
    }
    case 'weekly_test.set':
    case 'weekly_test.changed':
    case 'weekly_test.removed': {
      const verb = e.action.endsWith('set') ? 'set' : e.action.endsWith('changed') ? 'changed' : 'removed'
      const subject = subjects.find((s) => s.id === d.subject)?.name ?? String(d.subject ?? '')
      return `${actor} ${verb} a Grade ${String(d.grade)} ${subject} weekly test.`
    }
    case 'consent.granted':
      return `Consent was recorded for ${target}${d.kind === 'guardian' ? ' by a parent or guardian' : ''}.`
    case 'consent.withdrawn':
      return `Consent was withdrawn for ${target}.`
    case 'parent_link.created':
      return `A parent was linked to ${target}.`
    case 'parent_link.removed':
      return `A parent was unlinked from ${target}.`
    default:
      return `${actor}: ${e.action}.`
  }
}
