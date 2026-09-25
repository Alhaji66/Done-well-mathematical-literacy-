import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Difficulty, Grade } from '@/types'

/**
 * Content written in the app (STEP 18 of supabase/schema.sql): lessons,
 * videos, worksheets and the rest of the spec's resource types, moving through
 * Draft -> Review -> Approved -> Published -> Archived. Only published items
 * reach the resource centre, and teacher-only items only reach school staff --
 * the database decides both; nothing here widens what a person can read.
 */

export type ContentKind =
  | 'lesson'
  | 'video'
  | 'worksheet'
  | 'practice'
  | 'assessment'
  | 'memo'
  | 'study_guide'
  | 'revision'
  | 'teacher_resource'
  | 'question'

export type ContentStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived'

/** The nine resource types of the spec's resource centre, plus questions. */
export const KIND_LABEL: Record<ContentKind, string> = {
  lesson: 'Lesson',
  video: 'Video',
  worksheet: 'Worksheet',
  practice: 'Practice',
  assessment: 'Assessment',
  memo: 'Memo',
  study_guide: 'Study guide',
  revision: 'Revision material',
  teacher_resource: 'Teacher resource',
  question: 'Question',
}

export const RESOURCE_KINDS: ContentKind[] = [
  'lesson',
  'video',
  'worksheet',
  'practice',
  'assessment',
  'memo',
  'study_guide',
  'revision',
  'teacher_resource',
]

export const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: 'Draft',
  review: 'In review',
  approved: 'Approved',
  published: 'Published',
  archived: 'Archived',
}

export interface ContentItem {
  id: string
  kind: ContentKind
  title: string
  summary: string
  body: string
  url: string | null
  subject_id: string | null
  grade: Grade | null
  topic_id: string | null
  difficulty: Difficulty | null
  answer: string | null
  marks: number | null
  audience: 'everyone' | 'teachers'
  status: ContentStatus
  created_by: string | null
  approved_by: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface ContentEvent {
  id: number
  content_id: string
  from_status: ContentStatus | null
  to_status: ContentStatus
  actor_id: string | null
  note: string | null
  at: string
}

/** What the signed-in person may do with content. */
export function useContentAccess(userId: string | undefined) {
  const [state, setState] = useState({ editor: false, reviewer: false, checked: false })
  useEffect(() => {
    if (!supabase || !userId) {
      setState({ editor: false, reviewer: false, checked: true })
      return
    }
    let active = true
    Promise.all([supabase.rpc('is_content_editor'), supabase.rpc('is_content_reviewer')]).then(([e, r]) => {
      if (active) setState({ editor: Boolean(!e.error && e.data), reviewer: Boolean(!r.error && r.data), checked: true })
    })
    return () => {
      active = false
    }
  }, [userId])
  return state
}

/**
 * Every item the signed-in person may read. For most people that is the
 * published items for them; for an editor it is everything, and the caller
 * filters by status.
 */
export async function fetchContent(): Promise<ContentItem[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('content_items').select('*').order('updated_at', { ascending: false }).limit(1000)
  if (error) return []
  return (data ?? []) as ContentItem[]
}

export async function fetchContentItem(id: string): Promise<ContentItem | null> {
  if (!supabase) return null
  const { data } = await supabase.from('content_items').select('*').eq('id', id).maybeSingle()
  return (data as ContentItem | null) ?? null
}

export type ContentDraft = Pick<
  ContentItem,
  'kind' | 'title' | 'summary' | 'body' | 'url' | 'subject_id' | 'grade' | 'topic_id' | 'difficulty' | 'answer' | 'marks' | 'audience'
>

export async function saveContent(draft: ContentDraft, id?: string): Promise<{ id?: string; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const clean = {
    ...draft,
    title: draft.title.trim(),
    url: draft.url?.trim() || null,
    answer: draft.answer?.trim() || null,
  }
  if (id) {
    const { error } = await supabase.from('content_items').update(clean).eq('id', id)
    return error ? { error: error.message } : { id }
  }
  const { data, error } = await supabase.from('content_items').insert(clean).select('id').single()
  return error ? { error: error.message } : { id: data.id as string }
}

export async function transitionContent(id: string, to: ContentStatus, note?: string): Promise<string | undefined> {
  if (!supabase) return 'Real accounts are not set up on this deployment.'
  const { error } = await supabase.rpc('content_transition', { p_id: id, p_to: to, p_note: note ?? null })
  return error?.message
}

export async function fetchContentEvents(id: string): Promise<ContentEvent[]> {
  if (!supabase) return []
  const { data } = await supabase.from('content_events').select('*').eq('content_id', id).order('at')
  return (data ?? []) as ContentEvent[]
}

export async function addContentEditor(email: string, canReview: boolean): Promise<{ found?: boolean; error?: string }> {
  if (!supabase) return { error: 'Real accounts are not set up on this deployment.' }
  const { data, error } = await supabase.rpc('add_content_editor', { p_email: email, p_can_review: canReview })
  if (error) return { error: error.message }
  return { found: Boolean(data) }
}

/** The next steps an item can take, and who may take them (mirrors content_transition). */
export function nextSteps(item: ContentItem, me: string, reviewer: boolean): { to: ContentStatus; label: string }[] {
  switch (item.status) {
    case 'draft':
      return [{ to: 'review', label: 'Submit for review' }]
    case 'review':
      return [
        ...(reviewer && item.created_by !== me ? [{ to: 'approved' as const, label: 'Approve' }] : []),
        { to: 'draft', label: 'Send back to draft' },
      ]
    case 'approved':
      return reviewer
        ? [
            { to: 'published', label: 'Publish' },
            { to: 'draft', label: 'Send back to draft' },
          ]
        : []
    case 'published':
      return reviewer
        ? [
            { to: 'archived', label: 'Archive' },
            { to: 'draft', label: 'Unpublish to edit' },
          ]
        : []
    case 'archived':
      return [{ to: 'draft', label: 'Restore to draft' }]
  }
}
