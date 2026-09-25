import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { subjects } from '@/data/subjects'
import { topics as allTopics, getTopic } from '@/data/topics'
import { questionsForSubject } from '@/data/questionBank'
import { papersForSubject } from '@/data/papers'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { KIND_LABEL, fetchContent, type ContentItem } from '@/lib/content'
import type { Question } from '@/types'

const subjectName = (id: string | null | undefined) => subjects.find((s) => s.id === id)?.name ?? ''
const MAX = 12

interface Hit {
  key: string
  title: string
  detail: string
  to: string
}

/** Every word of the query appears somewhere in the text. */
const matches = (text: string, words: string[]) => {
  const t = text.toLowerCase()
  return words.every((w) => t.includes(w))
}

/**
 * Search across topics, lessons and resources, papers and questions.
 *
 * It respects permissions the same way the rest of the app does: resources
 * come from the database, which returns teacher-only items to staff alone, and
 * a parent -- who has no practise or papers pages -- is shown topics and
 * resources only.
 */
export function Search() {
  const { profile } = useAccountAuth()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)
  const [groups, setGroups] = useState<{ label: string; hits: Hit[]; more: number }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => setInput(q), [q])

  useEffect(() => {
    if (!profile) return
    const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 1)
    if (!words.length) {
      setGroups([])
      return
    }
    let active = true
    setLoading(true)
    const role = profile.role
    const learner = role === 'learner'
    const staff = role === 'teacher' || role === 'hod' || role === 'school'
    // Search the learner's or teacher's own subject first -- that is where the
    // answer usually is -- and the others after.
    const subjectOrder = [...subjects].sort((a, b) => (a.id === profile.subject_id ? -1 : b.id === profile.subject_id ? 1 : 0))

    ;(async () => {
      const topicHits: Hit[] = allTopics
        .filter((t) => matches(`${t.name} ${t.description}`, words))
        .map((t) => ({
          key: `t:${t.id}`,
          title: t.name,
          detail: `${subjectName(t.subjectId)} · Grades ${t.grades.join(', ')}`,
          to: learner ? `practise?subject=${t.subjectId}&topic=${t.id}` : `resources/topic/${t.id}`,
        }))

      const content: ContentItem[] = (await fetchContent()).filter((c) => c.status === 'published')
      const lessonHits: Hit[] = []
      const resourceHits: Hit[] = []
      for (const c of content) {
        if (!matches(`${c.title} ${c.summary} ${c.body}`, words)) continue
        const hit = {
          key: `c:${c.id}`,
          title: c.title,
          detail: [KIND_LABEL[c.kind], subjectName(c.subject_id), c.grade ? `Grade ${c.grade}` : ''].filter(Boolean).join(' · '),
          to: `resources/item/${c.id}`,
        }
        if (c.kind === 'lesson' || c.kind === 'study_guide') lessonHits.push(hit)
        else if (c.kind !== 'question' || learner || staff) resourceHits.push(hit)
      }

      const paperHits: Hit[] = []
      const questionHits: Hit[] = []
      if (learner || staff) {
        for (const s of subjectOrder) {
          const [papers, pool] = await Promise.all([papersForSubject(s.id), questionsForSubject(s.id)])
          for (const p of papers) {
            if (matches(`${p.title} ${s.name}`, words)) {
              paperHits.push({ key: `p:${p.id}`, title: p.title, detail: `${s.name} · ${p.totalMarks} marks`, to: `assessments/${p.id}` })
            }
          }
          for (const qn of pool as Question[]) {
            if (questionHits.length > 60) break
            if (matches(`${qn.prompt} ${qn.context ?? ''}`, words)) {
              const topic = getTopic(qn.topicId)
              questionHits.push({
                key: `q:${qn.id}`,
                title: qn.prompt.length > 140 ? `${qn.prompt.slice(0, 140)}…` : qn.prompt,
                detail: `${s.name} · ${topic?.name ?? ''} · Grade ${qn.grade} · ${qn.marks} marks`,
                to: learner ? `practise?subject=${s.id}&topic=${qn.topicId}` : 'question-bank',
              })
            }
          }
          if (!active) return
        }
      }

      if (!active) return
      const cut = (label: string, hits: Hit[]) => ({ label, hits: hits.slice(0, MAX), more: Math.max(0, hits.length - MAX) })
      setGroups(
        [
          cut('Topics', topicHits),
          cut('Lessons and study guides', lessonHits),
          cut('Resources', resourceHits),
          cut('Assessments', paperHits),
          cut('Questions', questionHits),
        ].filter((g) => g.hits.length),
      )
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [q, profile])

  if (!profile) return null

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Search" title="Search DONE WELL" description="Topics, lessons, resources, papers and questions." />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setParams(input.trim() ? { q: input.trim() } : {})
        }}
        className="flex gap-2"
      >
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. compound interest, hyperbola, meiosis…"
          className="input flex-1"
          aria-label="Search"
          autoFocus
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {loading ? <p className="text-sm text-navy-500">Searching…</p> : null}
      {!loading && q && groups.length === 0 ? (
        <p className="text-sm text-navy-600">Nothing found for “{q}”. Try a different word, or fewer words.</p>
      ) : null}

      {groups.map((g) => (
        <section key={g.label} className="space-y-2">
          <h3 className="font-bold text-navy-900">
            {g.label} <span className="text-sm font-normal text-navy-500">{g.hits.length + g.more}</span>
          </h3>
          <ul className="card divide-y divide-navy-100">
            {g.hits.map((h) => (
              <li key={h.key}>
                <Link to={`../${h.to}`} relative="path" className="block p-3 hover:bg-navy-50">
                  <span className="block text-sm font-medium text-navy-900">{h.title}</span>
                  <span className="block text-xs text-navy-500">{h.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
          {g.more ? <p className="text-xs text-navy-500">and {g.more} more — add a word to narrow it down.</p> : null}
        </section>
      ))}
    </div>
  )
}
