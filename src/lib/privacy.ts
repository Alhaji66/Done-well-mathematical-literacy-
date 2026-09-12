import { supabase } from '@/lib/supabaseClient'

/**
 * POPIA data-subject rights, in code.
 *
 * Sections 23 and 24 give a person the right to know what is held about them,
 * to correct it, and to have it deleted. A notice promising those rights is not
 * worth much if exercising one means emailing someone and waiting, so the three
 * that can be automated are automated here.
 *
 * The notice version is recorded with every consent. If the notice is rewritten
 * in a way that changes what people are agreeing to, bump this, because a
 * consent is only a consent to the text that was actually shown.
 */
export const POPIA_NOTICE_VERSION = '2026-09-12'

export type ConsentKind = 'guardian' | 'self'

export interface ConsentRow {
  id: string
  profile_id: string
  kind: ConsentKind
  notice_version: string
  guardian_name: string | null
  guardian_email: string | null
  granted_at: string
  withdrawn_at: string | null
}

/**
 * Record the consent that made processing lawful.
 *
 * Called during onboarding, before any learner data is worth anything, so that
 * the consent and the profile it covers are created together.
 */
export async function recordConsent(input: {
  profileId: string
  kind: ConsentKind
  guardianName?: string
  guardianEmail?: string
}): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Accounts are unavailable right now.' }
  const { error } = await supabase.from('consents').insert({
    profile_id: input.profileId,
    kind: input.kind,
    notice_version: POPIA_NOTICE_VERSION,
    guardian_name: input.kind === 'guardian' ? (input.guardianName ?? null) : null,
    guardian_email: input.kind === 'guardian' ? (input.guardianEmail ?? null) : null,
  })
  return { error: error ? error.message : null }
}

export async function fetchConsents(profileId: string): Promise<ConsentRow[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('consents')
    .select('*')
    .eq('profile_id', profileId)
    .order('granted_at', { ascending: false })
  return (data as ConsentRow[]) ?? []
}

/** Withdrawing consent is a right; the record of it is kept, stamped as withdrawn. */
export async function withdrawConsent(consentId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Accounts are unavailable right now.' }
  const { error } = await supabase
    .from('consents')
    .update({ withdrawn_at: new Date().toISOString() })
    .eq('id', consentId)
  return { error: error ? error.message : null }
}

export interface PersonalDataExport {
  exported_at: string
  notice_version: string
  account: Record<string, unknown> | null
  profile: Record<string, unknown> | null
  progress: Record<string, unknown>[]
  people_linked_to_you: Record<string, unknown>[]
  consents: ConsentRow[]
  /** What this export does not and cannot contain, stated rather than left to be discovered. */
  not_included: string[]
}

/**
 * Everything the app holds about the signed-in person, in one JSON file.
 *
 * This is the section 23 right to access. It reads through the same row-level
 * security every other query uses, so it can only ever return rows this person
 * is already entitled to see.
 */
export async function exportMyData(profileId: string): Promise<PersonalDataExport> {
  if (!supabase) throw new Error('Accounts are unavailable right now.')
  const [{ data: userData }, { data: profile }, { data: progress }, { data: links }, consents] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('profiles').select('*').eq('id', profileId).maybeSingle(),
    supabase.from('learner_progress').select('*').eq('learner_id', profileId),
    supabase.from('parent_learner_links').select('*').or(`parent_id.eq.${profileId},learner_id.eq.${profileId}`),
    fetchConsents(profileId),
  ])

  return {
    exported_at: new Date().toISOString(),
    notice_version: POPIA_NOTICE_VERSION,
    account: userData?.user ? { id: userData.user.id, email: userData.user.email, created_at: userData.user.created_at } : null,
    profile: (profile as Record<string, unknown>) ?? null,
    progress: (progress as Record<string, unknown>[]) ?? [],
    people_linked_to_you: (links as Record<string, unknown>[]) ?? [],
    consents,
    not_included: [
      'Sign-in history and the technical logs Supabase keeps to operate the service.',
      'The curriculum itself — subjects, topics, notes, questions and papers are the same for everyone and are not personal information.',
      'Answers you typed into a question. Those stay in your own browser and are never sent to us.',
    ],
  }
}

/** Hand the export to the person as a file, which is the point of the right. */
export function downloadExport(data: PersonalDataExport, fullName: string) {
  const safeName = fullName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'my'
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `done-well-${safeName}-data.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export interface LinkedPerson {
  profileId: string
  fullName: string
  role: string
  /** 'parent' means they can see this account's progress; 'child' means this account can see theirs. */
  relationship: 'parent' | 'child'
}

/** Who can see this learner's progress, so that it can be seen and then undone. */
export async function fetchLinkedPeople(profileId: string): Promise<LinkedPerson[]> {
  if (!supabase) return []
  const { data: links } = await supabase
    .from('parent_learner_links')
    .select('parent_id, learner_id')
    .or(`parent_id.eq.${profileId},learner_id.eq.${profileId}`)

  const rows = (links as { parent_id: string; learner_id: string }[]) ?? []
  if (!rows.length) return []

  const otherIds = rows.map((r) => (r.parent_id === profileId ? r.learner_id : r.parent_id))
  const { data: people } = await supabase.from('profiles').select('id, full_name, role').in('id', otherIds)
  const byId = new Map((((people as { id: string; full_name: string; role: string }[]) ?? [])).map((p) => [p.id, p]))

  return rows.map((r) => {
    const isParentOfMe = r.learner_id === profileId
    const otherId = isParentOfMe ? r.parent_id : r.learner_id
    const person = byId.get(otherId)
    return {
      profileId: otherId,
      fullName: person?.full_name ?? 'Unknown person',
      role: person?.role ?? 'unknown',
      relationship: isParentOfMe ? 'parent' : 'child',
    }
  })
}

export async function removeLink(profileId: string, otherProfileId: string, relationship: 'parent' | 'child') {
  if (!supabase) return { error: 'Accounts are unavailable right now.' }
  const parentId = relationship === 'parent' ? otherProfileId : profileId
  const learnerId = relationship === 'parent' ? profileId : otherProfileId
  const { error } = await supabase
    .from('parent_learner_links')
    .delete()
    .eq('parent_id', parentId)
    .eq('learner_id', learnerId)
  return { error: error ? error.message : null }
}

/**
 * Delete everything about this person that the browser can reach.
 *
 * One database function does the whole thing, so a deletion cannot stop half
 * way and leave progress rows behind a removed profile. The email address in
 * Supabase's own auth table needs the service role and cannot be removed from
 * here, so the caller is told to say so rather than implying a total erasure.
 */
export async function deleteMyAccount(): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Accounts are unavailable right now.' }
  const { error } = await supabase.rpc('delete_my_account')
  if (error) return { error: error.message }
  await supabase.auth.signOut()
  return { error: null }
}
