import { subjects } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { sbaTaskTitle } from '@/data/sbaProgramme'
import type { Grade } from '@/types'

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
    case 'lesson_plan.submitted':
    case 'lesson_plan.signed':
    case 'lesson_plan.returned': {
      const week = `the Grade ${String(d.grade)} lesson plan “${String(d.title ?? '')}”`
      if (e.action === 'lesson_plan.submitted') return `${actor} submitted ${week} for sign-off.`
      const teacher = d.teacher_id ? whom(String(d.teacher_id)) : 'the teacher'
      return e.action === 'lesson_plan.signed' ? `${actor} signed off ${week} by ${teacher}.` : `${actor} returned ${week} to ${teacher}.`
    }
    case 'sba_mark.insert':
    case 'sba_mark.update':
    case 'sba_mark.delete':
    case 'sba_release.released':
    case 'sba_release.withdrawn':
    case 'sba_moderation.accepted':
    case 'sba_moderation.returned':
    case 'sba_moderation.reopened':
    case 'sba_date.set':
    case 'sba_date.moved':
    case 'sba_date.cleared': {
      const task = sbaTaskTitle(String(d.subject ?? ''), Number(d.grade) as Grade, String(d.task ?? ''))
      const subject = subjects.find((s) => s.id === d.subject)?.name ?? String(d.subject ?? '')
      const cls = names.get(String(d.class_id ?? ''))
      const what = `the ${task ?? 'formal task'} (${subject}, Grade ${String(d.grade)}${cls ? `, ${cls}` : ''})`
      const mark = (v: unknown) => (v === 'absent' ? 'absent' : v === 'exempt' ? 'excused' : `${String(v).replace(/\.0$/, '').replace('.', ',')}/${String(d.out_of)}`)
      const sample = `${String(d.sample_size)} script${d.sample_size === 1 ? '' : 's'}, average difference ${String(d.mean_difference).replace('.', ',')} points`
      const on = (v: unknown) =>
        new Date(`${String(v)}T00:00:00Z`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', timeZone: 'UTC' })
      if (e.action === 'sba_date.set') return `${actor} set ${what} for ${on(d.due_on)}.`
      if (e.action === 'sba_date.moved' && d.from === d.due_on) return `${actor} changed the note for ${what}.`
      if (e.action === 'sba_date.moved') return `${actor} moved ${what} from ${on(d.from)} to ${on(d.due_on)}.`
      if (e.action === 'sba_date.cleared') return `${actor} cleared the date of ${what}.`
      if (e.action === 'sba_moderation.accepted') return `${actor} moderated ${what} and accepted the marks (${sample}).`
      if (e.action === 'sba_moderation.returned') return `${actor} moderated ${what} and returned the marks to the teacher (${sample}).`
      if (e.action === 'sba_moderation.reopened') return `${actor} reopened the moderation of ${what}.`
      if (e.action === 'sba_release.released') return `${actor} released the marks for ${what} to learners and parents.`
      if (e.action === 'sba_release.withdrawn') return `${actor} hid the marks for ${what} from learners and parents again.`
      if (e.action === 'sba_mark.insert')
        return d.to === 'absent' || d.to === 'exempt'
          ? `${actor} marked ${target} ${mark(d.to)} for ${what}.`
          : `${actor} entered ${target}'s mark for ${what}: ${mark(d.to)}.`
      if (e.action === 'sba_mark.delete') return `${actor} cleared ${target}'s mark for ${what} (was ${mark(d.from)}).`
      return `${actor} changed ${target}'s mark for ${what} from ${mark(d.from)} to ${mark(d.to)}.`
    }
    case 'school.suspended':
      return 'DONE WELL paused the school’s access. Staff cannot see learner data until it is reactivated.'
    case 'school.reactivated':
      return 'DONE WELL reactivated the school’s access.'
    case 'subscription.created':
    case 'subscription.changed':
    case 'subscription.removed': {
      const plan = { pilot: 'pilot', school: 'school licence', sponsored: 'sponsored programme place' }[String(d.plan)] ?? 'licence'
      const verb = e.action.endsWith('created') ? 'recorded' : e.action.endsWith('changed') ? 'updated' : 'removed'
      const seats = d.seats != null ? ` for ${String(d.seats)} learners` : ''
      return `DONE WELL ${verb} the school’s ${plan}${seats}.`
    }
    default:
      return `${actor}: ${e.action}.`
  }
}
