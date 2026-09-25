import { subjects } from '@/data/subjects'
import { getTopic } from '@/data/topics'

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
    case 'class.created':
    case 'class.changed':
    case 'class.removed': {
      const subject = subjects.find((s) => s.id === d.subject)?.name ?? String(d.subject ?? '')
      const cls = names.get(e.target_id ?? '')
      const label = cls ? `the class ${cls}` : `a Grade ${String(d.grade)} ${subject} class`
      if (e.action === 'class.created') return `${actor} created ${label}.`
      if (e.action === 'class.removed') return `${actor} deleted a Grade ${String(d.grade)} ${subject} class.`
      if ('previous_teacher_id' in d) {
        return `${actor} handed ${label} to ${d.teacher_id ? whom(String(d.teacher_id)) : 'no class teacher'}.`
      }
      return `${actor} changed ${label}.`
    }
    case 'class_member.added':
    case 'class_member.removed': {
      const cls = names.get(String(d.class_id ?? ''))
      const where = cls ? `the class ${cls}` : 'a class'
      return e.action === 'class_member.added'
        ? `${actor} added ${target} to ${where}.`
        : `${actor} removed ${target} from ${where}.`
    }
    case 'intervention.started':
    case 'intervention.active':
    case 'intervention.completed':
    case 'intervention.cancelled': {
      const topic = getTopic(String(d.topic ?? ''))?.name ?? 'a topic'
      const verb = {
        'intervention.started': 'started',
        'intervention.active': 'reopened',
        'intervention.completed': 'completed',
        'intervention.cancelled': 'cancelled',
      }[e.action]
      return `${actor} ${verb} a Grade ${String(d.grade)} catch-up group on ${topic}.`
    }
    case 'intervention_learner.added':
      return `${actor} added ${target} to a catch-up group.`
    case 'intervention_learner.removed':
      return `${actor} removed ${target} from a catch-up group.`
    default:
      return `${actor}: ${e.action}.`
  }
}
