import { supabase } from '@/lib/supabaseClient'
import type { Grade } from '@/types'

export interface LinkedChild {
  id: string
  full_name: string
  grade: Grade | null
  subject_id: string | null
}

export async function fetchLinkedChildren(parentId: string): Promise<LinkedChild[]> {
  if (!supabase) return []

  const { data: links, error: linksError } = await supabase
    .from('parent_learner_links')
    .select('learner_id')
    .eq('parent_id', parentId)
  if (linksError || !links?.length) return []

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, grade, subject_id')
    .in(
      'id',
      links.map((l) => l.learner_id),
    )
  if (error) {
    console.error('Failed to load linked children:', error)
    return []
  }
  return data ?? []
}

/**
 * Links the signed-in parent to a learner via the "family link code" (the
 * learner's own profile id, shown on their real dashboard) -- see
 * public.link_child in supabase/schema.sql. Throws with a message safe to
 * show the parent directly (the RPC's own error messages are user-facing).
 */
export async function linkChild(code: string): Promise<{ learnerId: string; learnerFullName: string }> {
  if (!supabase) throw new Error('Not configured')
  const { data, error } = await supabase.rpc('link_child', { learner_code: code.trim() })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  return { learnerId: row.learner_id, learnerFullName: row.learner_full_name }
}
