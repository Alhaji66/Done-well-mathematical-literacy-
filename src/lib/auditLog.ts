import { supabase } from '@/lib/supabaseClient'
import type { AuditEntry } from '@/lib/auditLogText'

/**
 * The school's audit log, read back as sentences.
 *
 * The log itself (STEP 13 of supabase/schema.sql) stores account ids, never
 * names, so that deleting an account does not leave its name behind in a
 * second table. Names are looked up here, at the moment the log is shown, from
 * the profiles the viewer is already allowed to read -- and an id that no
 * longer resolves is shown as "a deleted account", which is exactly what it is.
 */

export async function fetchAuditLog(schoolId: string, limit = 150): Promise<{ entries: AuditEntry[]; names: Map<string, string>; error?: string }> {
  if (!supabase) return { entries: [], names: new Map() }
  const [{ data, error }, people, classes] = await Promise.all([
    supabase
      .from('audit_log')
      .select('id, at, actor_id, actor_role, action, target_table, target_id, details')
      .eq('school_id', schoolId)
      .order('at', { ascending: false })
      .limit(limit),
    supabase.from('profiles').select('id, full_name').eq('school_id', schoolId),
    // Class names are looked up the same way, for the same reason. Before
    // STEP 14 this errors and simply contributes no names.
    supabase.from('classes').select('id, name').eq('school_id', schoolId),
  ])
  if (error) {
    // Before STEP 13 is run the table does not exist; say so rather than
    // showing an empty log that looks like nothing ever happened.
    return { entries: [], names: new Map(), error: error.message }
  }
  const names = new Map<string, string>([
    ...(people.data ?? []).map((p) => [p.id as string, p.full_name as string] as [string, string]),
    ...(classes.data ?? []).map((c) => [c.id as string, c.name as string] as [string, string]),
  ])
  return { entries: (data ?? []) as AuditEntry[], names }
}

export { describeEntry, type AuditEntry } from '@/lib/auditLogText'
