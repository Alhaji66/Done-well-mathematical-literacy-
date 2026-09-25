import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { subjects } from '@/data/subjects'
import { getTopic, topicsForSubject } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { BookIcon, ChevronRightIcon } from '@/components/ui/Icons'
import { fetchLinkedChildren } from '@/lib/parentLinks'
import { KIND_LABEL, RESOURCE_KINDS, fetchContent, type ContentKind } from '@/lib/content'
import { builtInEntries, contentEntries, filterCatalogue, type CatalogueEntry } from '@/lib/resourceCatalogue'
import { logActivity } from '@/lib/activity'
import type { Difficulty, Grade } from '@/types'

const GRADES: Grade[] = [10, 11, 12]
const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenge']
const PAGE = 40

/**
 * The resource centre: everything a person can open, searchable and filtered
 * the way the spec asks -- grade, subject, topic, resource type, difficulty.
 * Teacher resources appear only for school staff; the database decides that,
 * so a learner's list simply never contains them.
 */
export function ResourceCentre() {
  const { profile } = useAccountAuth()
  const [params, setParams] = useSearchParams()

  const [entries, setEntries] = useState<CatalogueEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [shown, setShown] = useState(PAGE)

  const text = params.get('q') ?? ''
  const subjectId = params.get('subject') ?? profile?.subject_id ?? subjects[0].id
  const grade = params.get('grade') ? (Number(params.get('grade')) as Grade) : null
  const topicId = params.get('topic')
  const kind = (params.get('type') as ContentKind | null) ?? null
  const difficulty = (params.get('difficulty') as Difficulty | null) ?? null

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key === 'subject') next.delete('topic')
    setParams(next, { replace: true })
    setShown(PAGE)
  }

  // A learner starts in their own grade; a parent in their first child's.
  useEffect(() => {
    if (!profile || params.get('grade') || params.get('subject')) return
    if (profile.role === 'learner' && profile.grade) set('grade', String(profile.grade))
    if (profile.role === 'parent') {
      fetchLinkedChildren(profile.id).then((kids) => {
        const first = kids[0]
        if (!first) return
        const next = new URLSearchParams(params)
        if (first.grade) next.set('grade', String(first.grade))
        if (first.subject_id) next.set('subject', first.subject_id)
        setParams(next, { replace: true })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id])

  useEffect(() => {
    if (!profile) return
    let active = true
    setLoading(true)
    Promise.all([builtInEntries(subjectId, profile.role), fetchContent()]).then(([built, items]) => {
      if (!active) return
      setEntries([...contentEntries(items), ...built])
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [subjectId, profile])

  const results = useMemo(
    () => filterCatalogue(entries, { text, grade, subjectId, topicId, kind, difficulty }),
    [entries, text, grade, subjectId, topicId, kind, difficulty],
  )

  if (!profile) return null
  const topics = topicsForSubject(subjectId, grade ?? undefined)

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Resources"
        title="Resource centre"
        description="Study guides, practice, papers with memos, and lessons, videos and worksheets from DONE WELL — searchable and filtered by grade, subject, topic, type and difficulty."
      />

      <div className="card space-y-3 p-4">
        <input
          type="search"
          value={text}
          onChange={(e) => set('q', e.target.value)}
          placeholder="Search resources…"
          className="input"
          aria-label="Search resources"
        />
        <div className="grid gap-2 sm:grid-cols-5">
          <select className="select" value={grade ?? ''} onChange={(e) => set('grade', e.target.value || null)} aria-label="Grade">
            <option value="">All grades</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
          <select className="select" value={subjectId} onChange={(e) => set('subject', e.target.value)} aria-label="Subject">
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select className="select" value={topicId ?? ''} onChange={(e) => set('topic', e.target.value || null)} aria-label="Topic">
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select className="select" value={kind ?? ''} onChange={(e) => set('type', e.target.value || null)} aria-label="Resource type">
            <option value="">All types</option>
            {RESOURCE_KINDS.filter((k) => k !== 'teacher_resource' || profile.role !== 'learner').map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={difficulty ?? ''}
            onChange={(e) => set('difficulty', e.target.value || null)}
            aria-label="Difficulty"
          >
            <option value="">Any difficulty</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-navy-500">
          {loading ? 'Loading…' : `${results.length} resource${results.length === 1 ? '' : 's'}`}
        </p>
      </div>

      {!loading && results.length === 0 ? (
        <EmptyState
          icon={<BookIcon className="h-6 w-6" />}
          title="Nothing matches"
          description="Try fewer words, or clear a filter. Difficulty applies only to resources that have one."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {results.slice(0, shown).map((e) => (
            <li key={e.key}>
              <Link
                to={`../${e.to}`}
                relative="path"
                onClick={() => {
                  if (e.source === 'content') void logActivity(profile.id, 'resource_opened', e.topicId ?? undefined)
                }}
                className="card group flex h-full flex-col gap-2 p-4 transition hover:border-navy-300"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="badge-navy">{KIND_LABEL[e.kind]}</span>
                  {e.teachersOnly ? <span className="badge-gold">Teachers only</span> : null}
                  {e.difficulty ? <span className="badge-slate">{e.difficulty}</span> : null}
                  {e.grades.length === 1 ? <span className="badge-slate">Grade {e.grades[0]}</span> : null}
                </div>
                <p className="font-semibold text-navy-900 group-hover:underline">{e.title}</p>
                {e.summary ? <p className="line-clamp-2 text-sm text-navy-600">{e.summary}</p> : null}
                <p className="mt-auto flex items-center justify-between text-xs text-navy-400">
                  <span>{e.topicId ? getTopic(e.topicId)?.name : ''}</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {results.length > shown ? (
        <button type="button" onClick={() => setShown(shown + PAGE)} className="btn-outline">
          Show more ({results.length - shown} left)
        </button>
      ) : null}
    </div>
  )
}
