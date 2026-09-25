import { supabase } from '@/lib/supabaseClient'
import { getTopic } from '@/data/topics'

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

/** One notification as a sentence. */
export function describeNotification(n: AppNotification, names: Map<string, string>): string {
  const d = n.data
  switch (n.kind) {
    case 'weekly_test.set': {
      const due = d.due_at ? new Date(String(d.due_at)).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' }) : ''
      return `${d.catch_up ? 'New catch-up test' : 'New weekly test'}: “${String(d.title ?? '')}”${due ? `, due ${due}` : ''}.`
    }
    case 'intervention.joined':
      return `Your teacher has put you in a catch-up group on ${topicOf(d)}.`
    case 'intervention.child_joined':
      return `${names.get(String(d.learner_id)) ?? 'Your child'} has been put in a catch-up group on ${topicOf(d)} at school.`
    case 'staff.pending':
      return `${names.get(String(d.profile_id)) ?? 'Someone'} is waiting for you to approve them as staff.`
    case 'staff.approved':
      return 'A colleague has approved you as staff. You can now see your school’s learners.'
    case 'parent_link.created':
      return 'A parent or guardian has linked to your account. You can see and remove links under Privacy & data.'
    default:
      return 'Something changed in your account.'
  }
}
