import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { ConsoleShell } from '@/components/layout/ConsoleShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RichText } from '@/components/content/RichText'
import { subjects } from '@/data/subjects'
import { topicsForSubject, getTopic } from '@/data/topics'
import { cn } from '@/lib/utils'
import {
  KIND_LABEL,
  STATUS_LABEL,
  fetchContent,
  fetchContentEvents,
  nextSteps,
  saveContent,
  transitionContent,
  useContentAccess,
  type ContentDraft,
  type ContentEvent,
  type ContentItem,
  type ContentKind,
  type ContentStatus,
} from '@/lib/content'
import type { Difficulty, Grade } from '@/types'

const STATUSES: ContentStatus[] = ['draft', 'review', 'approved', 'published', 'archived']
const KINDS = Object.keys(KIND_LABEL) as ContentKind[]

const STATUS_STYLE: Record<ContentStatus, string> = {
  draft: 'badge-slate',
  review: 'badge-gold',
  approved: 'badge-navy',
  published: 'badge-green',
  archived: 'badge-slate',
}

const blank = (): ContentDraft => ({
  kind: 'lesson',
  title: '',
  summary: '',
  body: '',
  url: null,
  subject_id: 'mat-lit',
  grade: 12,
  topic_id: null,
  difficulty: null,
  answer: null,
  marks: null,
  audience: 'everyone',
})

/**
 * The content studio: where DONE WELL's editors write lessons, worksheets,
 * video links and questions, and move them through
 * Draft -> Review -> Approved -> Published -> Archived.
 *
 * The rules live in the database: nobody approves their own work, only
 * reviewers publish, and a published item has to go back to draft to be
 * changed. The buttons here only offer what the database will accept.
 */
export function ContentStudio() {
  const { session } = useAccountAuth()
  const me = session?.user.id ?? ''
  const access = useContentAccess(me)

  const [items, setItems] = useState<ContentItem[]>([])
  const [tab, setTab] = useState<ContentStatus>('draft')
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [draft, setDraft] = useState<ContentDraft>(blank())
  const [preview, setPreview] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [events, setEvents] = useState<ContentEvent[]>([])
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => setItems(await fetchContent())
  useEffect(() => {
    if (access.editor) void load()
  }, [access.editor])

  useEffect(() => {
    if (open) fetchContentEvents(open).then(setEvents)
  }, [open])

  if (!access.checked) {
    return (
      <ConsoleShell title="Content studio">
        <p className="text-sm text-navy-500">Checking your access…</p>
      </ConsoleShell>
    )
  }
  if (!access.editor) {
    return (
      <ConsoleShell title="Content studio">
        <div className="card max-w-xl p-6 text-sm text-navy-700">
          <h2 className="text-lg font-bold text-navy-900">This page is for DONE WELL content editors</h2>
          <p className="mt-2">A platform administrator adds editors from the platform console.</p>
          <Link to="/account" className="btn-outline btn-sm mt-4 inline-flex">
            Back to my account
          </Link>
        </div>
      </ConsoleShell>
    )
  }

  const startEdit = (item?: ContentItem) => {
    setError('')
    setPreview(false)
    if (!item) {
      setDraft(blank())
      setEditing('new')
      return
    }
    const { kind, title, summary, body, url, subject_id, grade, topic_id, difficulty, answer, marks, audience } = item
    setDraft({ kind, title, summary, body, url, subject_id, grade, topic_id, difficulty, answer, marks, audience })
    setEditing(item.id)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const r = await saveContent(draft, editing === 'new' ? undefined : (editing ?? undefined))
    setBusy(false)
    if (r.error) {
      setError(r.error)
      return
    }
    setEditing(null)
    setTab('draft')
    await load()
  }

  const move = async (id: string, to: ContentStatus) => {
    setBusy(true)
    setError('')
    const message = await transitionContent(id, to, note)
    setBusy(false)
    if (message) {
      setError(message)
      return
    }
    setNote('')
    setTab(to)
    await load()
    setEvents(await fetchContentEvents(id))
  }

  const set = <K extends keyof ContentDraft>(k: K, v: ContentDraft[K]) => setDraft((d) => ({ ...d, [k]: v }))
  const shown = items.filter((i) => i.status === tab)
  const topics = draft.subject_id ? topicsForSubject(draft.subject_id, draft.grade ?? undefined) : []

  return (
    <ConsoleShell title="Content studio">
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Content"
          title="Content studio"
          description="Draft → Review → Approved → Published → Archived. Nothing reaches learners until a second person has approved it."
          action={
            editing ? null : (
              <button type="button" onClick={() => startEdit()} className="btn-primary">
                New item
              </button>
            )
          }
        />

        {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

        {editing ? (
          <form onSubmit={submit} className="card space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-navy-900">{editing === 'new' ? 'New item' : 'Edit draft'}</h2>
              <button type="button" onClick={() => setPreview(!preview)} className="btn-ghost btn-sm">
                {preview ? 'Back to editing' : 'Preview'}
              </button>
            </div>

            {preview ? (
              <div className="space-y-3 rounded-lg border border-navy-100 p-4">
                <p className="badge-navy inline-block">{KIND_LABEL[draft.kind]}</p>
                <h3 className="text-lg font-bold text-navy-900">{draft.title || 'Untitled'}</h3>
                {draft.summary ? <p className="font-medium text-navy-700">{draft.summary}</p> : null}
                {draft.body ? <RichText text={draft.body} /> : null}
                {draft.answer ? (
                  <div className="rounded-lg bg-navy-50 p-3">
                    <RichText text={draft.answer} />
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="text-xs font-medium text-navy-500">
                    Type
                    <select className="select mt-1" value={draft.kind} onChange={(e) => set('kind', e.target.value as ContentKind)}>
                      {KINDS.map((k) => (
                        <option key={k} value={k}>
                          {KIND_LABEL[k]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-medium text-navy-500">
                    Who can see it once published
                    <select
                      className="select mt-1"
                      value={draft.audience}
                      onChange={(e) => set('audience', e.target.value as 'everyone' | 'teachers')}
                    >
                      <option value="everyone">Everyone signed in</option>
                      <option value="teachers">Teachers only</option>
                    </select>
                  </label>
                  <label className="text-xs font-medium text-navy-500">
                    Difficulty
                    <select
                      className="select mt-1"
                      value={draft.difficulty ?? ''}
                      onChange={(e) => set('difficulty', (e.target.value || null) as Difficulty | null)}
                    >
                      <option value="">Not set</option>
                      {(['Easy', 'Moderate', 'Challenge'] as Difficulty[]).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block text-xs font-medium text-navy-500">
                  Title
                  <input className="input mt-1" required maxLength={200} value={draft.title} onChange={(e) => set('title', e.target.value)} />
                </label>
                <label className="block text-xs font-medium text-navy-500">
                  Summary (one or two sentences for the resource list)
                  <input className="input mt-1" maxLength={600} value={draft.summary} onChange={(e) => set('summary', e.target.value)} />
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="text-xs font-medium text-navy-500">
                    Subject
                    <select
                      className="select mt-1"
                      value={draft.subject_id ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, subject_id: e.target.value || null, topic_id: null }))}
                    >
                      <option value="">Any subject</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-medium text-navy-500">
                    Grade
                    <select
                      className="select mt-1"
                      value={draft.grade ?? ''}
                      onChange={(e) => set('grade', e.target.value ? (Number(e.target.value) as Grade) : null)}
                    >
                      <option value="">Any grade</option>
                      {[10, 11, 12].map((g) => (
                        <option key={g} value={g}>
                          Grade {g}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-medium text-navy-500">
                    Topic
                    <select className="select mt-1" value={draft.topic_id ?? ''} onChange={(e) => set('topic_id', e.target.value || null)}>
                      <option value="">No particular topic</option>
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {draft.kind === 'video' || draft.kind === 'worksheet' || draft.kind === 'memo' || draft.kind === 'teacher_resource' ? (
                  <label className="block text-xs font-medium text-navy-500">
                    Link (https) — {draft.kind === 'video' ? 'the video' : 'the document'}, if it lives elsewhere
                    <input
                      className="input mt-1"
                      type="url"
                      pattern="https://.*"
                      value={draft.url ?? ''}
                      onChange={(e) => set('url', e.target.value || null)}
                    />
                  </label>
                ) : null}
                <label className="block text-xs font-medium text-navy-500">
                  {draft.kind === 'question' ? 'The question' : 'Content'}
                  <textarea
                    className="input mt-1 font-mono text-sm"
                    rows={12}
                    maxLength={50000}
                    value={draft.body}
                    onChange={(e) => set('body', e.target.value)}
                  />
                  <span className="mt-1 block font-normal text-navy-400">
                    A blank line starts a new paragraph. Start a line with "# " for a heading and "- " for a bullet.
                  </span>
                </label>
                {draft.kind === 'question' ? (
                  <div className="grid gap-3 sm:grid-cols-4">
                    <label className="text-xs font-medium text-navy-500 sm:col-span-3">
                      Answer and memo
                      <textarea className="input mt-1" rows={4} value={draft.answer ?? ''} onChange={(e) => set('answer', e.target.value)} />
                    </label>
                    <label className="text-xs font-medium text-navy-500">
                      Marks
                      <input
                        type="number"
                        min={1}
                        max={50}
                        className="input mt-1"
                        value={draft.marks ?? ''}
                        onChange={(e) => set('marks', e.target.value ? Number(e.target.value) : null)}
                      />
                    </label>
                  </div>
                ) : null}
              </>
            )}
            <div className="flex gap-2">
              <button type="submit" disabled={busy} className="btn-primary">
                Save draft
              </button>
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        <div className="flex flex-wrap gap-2" role="tablist">
          {STATUSES.map((s) => {
            const n = items.filter((i) => i.status === s).length
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={tab === s}
                onClick={() => setTab(s)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm font-medium',
                  tab === s ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-200 bg-white text-navy-700',
                )}
              >
                {STATUS_LABEL[s]} <span className="ml-1 tabular-nums opacity-70">{n}</span>
              </button>
            )
          })}
        </div>

        {shown.length === 0 ? (
          <p className="text-sm text-navy-500">Nothing {STATUS_LABEL[tab].toLowerCase()}.</p>
        ) : (
          <ul className="space-y-3">
            {shown.map((item) => {
              const steps = nextSteps(item, me, access.reviewer)
              return (
                <li key={item.id} className="card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <button type="button" onClick={() => setOpen(open === item.id ? null : item.id)} className="min-w-0 text-left">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={STATUS_STYLE[item.status]}>{STATUS_LABEL[item.status]}</span>
                        <span className="badge-navy">{KIND_LABEL[item.kind]}</span>
                        {item.audience === 'teachers' ? <span className="badge-gold">Teachers only</span> : null}
                      </div>
                      <p className="mt-1.5 font-semibold text-navy-900">{item.title}</p>
                      <p className="text-xs text-navy-500">
                        {[item.subject_id && subjects.find((s) => s.id === item.subject_id)?.name, item.grade && `Grade ${item.grade}`, item.topic_id && getTopic(item.topic_id)?.name]
                          .filter(Boolean)
                          .join(' · ')}
                        {item.created_by === me ? ' · yours' : ''}
                      </p>
                    </button>
                    <div className="flex flex-wrap gap-2">
                      {item.status === 'draft' ? (
                        <button type="button" onClick={() => startEdit(item)} className="btn-outline btn-sm">
                          Edit
                        </button>
                      ) : null}
                      {steps.map((s) => (
                        <button
                          key={s.to}
                          type="button"
                          disabled={busy}
                          onClick={() => move(item.id, s.to)}
                          className={s.to === 'published' || s.to === 'approved' ? 'btn-primary btn-sm' : 'btn-outline btn-sm'}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {item.status === 'review' && item.created_by === me && access.reviewer ? (
                    <p className="mt-2 text-xs text-navy-500">Another reviewer has to approve this — you wrote it.</p>
                  ) : null}
                  {open === item.id ? (
                    <div className="mt-4 space-y-3 border-t border-navy-100 pt-4">
                      {item.summary ? <p className="text-sm font-medium text-navy-700">{item.summary}</p> : null}
                      {item.body ? <RichText text={item.body} /> : null}
                      <input
                        className="input"
                        placeholder="Note for the history (optional), e.g. why it was sent back"
                        value={note}
                        maxLength={1000}
                        onChange={(e) => setNote(e.target.value)}
                      />
                      <ol className="space-y-1 text-xs text-navy-500">
                        {events.map((ev) => (
                          <li key={ev.id}>
                            {new Date(ev.at).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} ·{' '}
                            {ev.from_status ? STATUS_LABEL[ev.from_status] : 'New'} → {STATUS_LABEL[ev.to_status]}
                            {ev.actor_id === me ? ' (you)' : ''}
                            {ev.note ? ` — “${ev.note}”` : ''}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </ConsoleShell>
  )
}
