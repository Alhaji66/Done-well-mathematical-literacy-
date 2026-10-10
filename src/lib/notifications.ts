import { supabase } from '@/lib/supabaseClient'
import { getTopic } from '@/data/topics'
import { getSubject } from '@/data/subjects'
import { sbaTaskTitle } from '@/data/sbaProgramme'
import type { Grade } from '@/types'

/**
 * In-app notifications, written by the database (STEP 16) when something
 * happens that a person needs to know about. Each row holds what happened and
 * ids; the sentence is written here, so a name is looked up when shown rather
 * than copied into another table.
 */

export interface AppNotification {
  id: number
  kind: string
  data: Record<string, unknown>
  link: string | null
  created_at: string
  read_at: string | null
}

export async function fetchNotifications(limit = 30): Promise<{ items: AppNotification[]; names: Map<string, string> } | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('notifications')
    .select('id, kind, data, link, created_at, read_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return null
  const items = (data ?? []) as AppNotification[]
  const ids = [
    ...new Set(
      items.flatMap((n) => [n.data.profile_id, n.data.learner_id].filter((x): x is string => typeof x === 'string')),
    ),
  ]
  const names = new Map<string, string>()
  if (ids.length) {
    const { data: people } = await supabase.from('profiles').select('id, full_name').in('id', ids)
    for (const p of people ?? []) names.set(p.id as string, p.full_name as string)
  }
  return { items, names }
}

export async function markNotificationsRead(ids: number[]): Promise<void> {
  if (!supabase || ids.length === 0) return
  await supabase.from('notifications').update({ read_at: new Date().toISOString() }).in('id', ids)
}

const topicOf = (d: Record<string, unknown>) => getTopic(String(d.topic ?? ''))?.name ?? 'a topic'

/** "Mon 12 Oct" from a date in a notification. */
const dayOf = (v: unknown) =>
  new Date(`${String(v)}T00:00:00Z`).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

/** "Mathematical Literacy: Controlled test 1", from a release's subject, grade and task. */
const sbaTaskOf = (d: Record<string, unknown>) => {
  const subject = getSubject(String(d.subject ?? ''))?.name ?? 'SBA'
  return `${subject}: ${sbaTaskTitle(String(d.subject ?? ''), Number(d.grade) as Grade, String(d.task ?? '')) ?? 'a formal task'}`
}

/** One notification as a sentence. */
export function describeNotification(n: AppNotification, names: Map<string, string>): string {
  const d = n.data
  switch (n.kind) {
    case 'weekly_test.set': {
      const due = d.due_at ? new Date(String(d.due_at)).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' }) : ''
      const what = d.catch_up ? 'New catch-up test' : d.kind === 'topic' ? 'New topic test' : d.kind === 'monthly' ? 'New monthly check' : 'New weekly test'
      return `${what}: “${String(d.title ?? '')}”${due ? `, due ${due}` : ''}.`
    }
    case 'intervention.joined':
      return `Your teacher has put you in a catch-up group on ${topicOf(d)}.`
    case 'intervention.child_joined':
      return `${names.get(String(d.learner_id)) ?? 'Your child'} has been put in a catch-up group on ${topicOf(d)} at school.`
    case 'staff.pending':
      return `${names.get(String(d.profile_id)) ?? 'Someone'} is waiting for you to approve them as staff.`
    case 'staff.approved':
      return 'A colleague has approved you as staff. You can now see your school’s learners.'
    case 'learner.pending':
      return 'Learners have joined with your school code and are waiting for you to approve them.'
    case 'learner.approved':
      return `${d.school ? String(d.school) : 'Your school'} has approved you. Your school’s tests and classes now appear here.`
    case 'lesson_plan.submitted':
      return `${names.get(String(d.profile_id)) ?? 'A teacher'} submitted a Grade ${String(d.grade)} week for sign-off: “${String(d.title ?? '')}”.`
    case 'lesson_plan.signed':
      return `Your head of department signed off “${String(d.title ?? '')}”.`
    case 'lesson_plan.returned':
      return `Your head of department returned “${String(d.title ?? '')}” with a comment. Open it to see what to change.`
    case 'sba_marks.released':
      return `Your mark for ${sbaTaskOf(d)} is out.`
    case 'sba_marks.child_released':
      return `${names.get(String(d.learner_id)) ?? 'Your child'}’s mark for ${sbaTaskOf(d)} is out.`
    case 'sba_moderation.accepted':
      return `Your marks for ${sbaTaskOf(d)} were moderated and accepted.`
    case 'sba_moderation.returned':
      return `Your marks for ${sbaTaskOf(d)} were returned after moderation. Open the mark book to read the comment.`
    case 'sba_date.set':
      return `${sbaTaskOf(d)} ${d.moved ? 'has moved to' : 'is on'} ${dayOf(d.due_on)}.`
    case 'sba_date.tomorrow':
      return `Reminder: ${sbaTaskOf(d)} is tomorrow.${d.note ? ` ${String(d.note).replace(/\.$/, '')}.` : ''}`
    case 'sba_date.child_tomorrow':
      return `Reminder: ${names.get(String(d.learner_id)) ?? 'Your child'}’s ${sbaTaskOf(d)} is tomorrow.${d.note ? ` ${String(d.note).replace(/\.$/, '')}.` : ''}`
    case 'sba_date.child_set':
      return `${names.get(String(d.learner_id)) ?? 'Your child'}’s ${sbaTaskOf(d)} ${d.moved ? 'has moved to' : 'is on'} ${dayOf(d.due_on)}.`
    case 'paper.marked': {
      const who = names.get(String(d.learner_id)) ?? 'A learner'
      return `${who} wrote “${String(d.title ?? 'a paper')}”: ${String(d.percent)}% (Level ${String(d.level)}). Open Paper results to see where marks were lost.`
    }
    case 'classwork.set': {
      const due = d.due_at ? new Date(String(d.due_at)).toLocaleString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''
      return `New class work from your teacher: “${String(d.title ?? '')}”${due ? `, due ${due}` : ''}.`
    }
    case 'classwork.marked':
      return `Your class work “${String(d.title ?? '')}” is marked${d.percent !== undefined && d.percent !== null ? `: ${String(d.percent)}%` : ''}. Open it to see your marks and the memo.`
    case 'paper.own_marked':
      return `Your paper “${String(d.title ?? '')}” is marked: ${String(d.percent)}% (Level ${String(d.level)}). Open it to see where you lost marks.`
    case 'level.early_warning': {
      const who = names.get(String(d.learner_id)) ?? 'A learner'
      const what = d.reason === 'below_40' ? `scored ${String(d.percent)}% (Level ${String(d.level)})` : `dropped from Level ${String(d.previous_level)} to Level ${String(d.level)} (${String(d.percent)}%)`
      return `Early warning: ${who} ${what} on “${String(d.title ?? '')}”. Open Levels to start a catch-up group.`
    }
    case 'level.weekly_digest': {
      const n = (k: string) => Number(d[k] ?? 0)
      const plural = (x: number, one: string, many: string) => `${x} ${x === 1 ? one : many}`
      const subject = d.subject ? ` in ${getSubject(String(d.subject))?.name ?? 'your subject'}` : ''
      const bySubject = d.subject
        ? ''
        : Object.entries((d.subjects ?? {}) as Record<string, number>)
            .sort((a, b) => b[1] - a[1])
            .map(([id, x]) => `${getSubject(id)?.name ?? id} ${x}`)
            .join(', ')
      const classes = ((d.classes ?? []) as { name: string; teacher: string | null; flagged: number }[])
        .map((c) => `${c.name}${c.teacher ? ` (${c.teacher})` : ''} ${c.flagged}`)
        .join(', ')
      return (
        `Early warnings for the week of ${dayOf(d.week_start)}${subject}: ${plural(n('flagged'), 'learner', 'learners')} flagged, ` +
        `${n('recovered')} back at Level 4 or above, ${plural(n('groups'), 'catch-up group', 'catch-up groups')} started; ` +
        `${plural(n('tests'), 'test', 'tests')} set and ${n('handed_in')} handed in.` +
        (bySubject ? ` By subject: ${bySubject}.` : '') +
        (classes ? ` Most flags: ${classes}.` : '')
      )
    }
    case 'level.child_early_warning': {
      const who = names.get(String(d.learner_id))?.split(' ')[0] ?? 'Your child'
      const subject = getSubject(String(d.subject ?? ''))?.name ?? 'a subject'
      const why =
        d.reason === 'below_40' ? 'below 40%' : `down from Level ${String(d.previous_level)} on the test before`
      return `Early warning: ${who} scored ${String(d.percent)}% (Level ${String(d.level)}) on “${String(d.title ?? '')}” in ${subject}, ${why}. See what it means and how you can help at home.`
    }
    case 'level.parent_reply': {
      const who = names.get(String(d.learner_id)) ?? 'a learner'
      const said = d.choice === 'call' ? 'asks you to call them' : 'has seen it and will practise at home'
      return `The parent of ${who} replied to the early warning on “${String(d.title ?? '')}”: ${said}.${d.message ? ` “${String(d.message)}”` : ''}`
    }
    case 'licence.ending':
      return `Your school’s DONE WELL licence ends on ${dayOf(d.ends_on)}, in ${String(d.days)} days. Contact DONE WELL to renew it, so learners and teachers keep the full question bank.`
    case 'licence.ended':
      return `Your school’s DONE WELL licence ended on ${dayOf(d.ends_on)}. New learners wait to be let in, and everyone sees only a sample until it is renewed.`
    case 'licence.admin_ending':
      return `${String(d.school ?? 'A school')}: licence ends on ${dayOf(d.ends_on)}, in ${String(d.days)} days.`
    case 'licence.admin_ended':
      return `${String(d.school ?? 'A school')}: licence ended on ${dayOf(d.ends_on)}.`
    case 'plan.ending':
      return `Your DONE WELL plan ends on ${dayOf(d.ends_on)}. Renew it to keep every question and paper.`
    case 'trial.ending':
      return 'Your free trial ends in 2 days. After that you see a sample of each topic, unless your school has a licence or you get a plan.'
    case 'parent_link.created':
      return 'A parent or guardian has linked to your account. You can see and remove links under Privacy & data.'
    default:
      return 'Something changed in your account.'
  }
}
