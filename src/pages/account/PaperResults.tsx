import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RouteLoading } from '@/components/layout/RouteLoading'
import { getSubject } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { getPaper, type Paper } from '@/data/papers'
import { classesInView, fetchClassMembers, fetchClasses, type SchoolClass } from '@/lib/classes'
import { fetchSchoolLearners } from '@/lib/teacherRoster'
import { LEVEL_NAMES, LEVELS, levelOf } from '@/lib/levels'
import { fetchPaperResultsForStaff, type PaperAttempt } from '@/lib/paperAttempts'
import { cn } from '@/lib/utils'

/**
 * Paper results: every past or predicted paper a learner in this person's view
 * has written under exam conditions and had marked (STEP 41) -- the mark and
 * level the moment it is marked, the topics where the class lost marks, and
 * the learners to catch up.
 *
 * Teachers and HODs see learners by name; the principal sees the same totals,
 * topics and levels without names, as on Levels. Which attempts each person
 * may read is decided by the database, not here.
 */

const CATCH_UP_BELOW = 40
const TOPIC_WEAK_BELOW = 50

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0)

export function PaperResults() {
  const { profile } = useAccountAuth()
  const [params, setParams] = useSearchParams()
  const [attempts, setAttempts] = useState<PaperAttempt[] | null>(null)
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [members, setMembers] = useState<Map<string, string[]>>(new Map())
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState<number | 0>(0)
  const [classId, setClassId] = useState('')
  const [paperId, setPaperId] = useState('')
  const open = params.get('attempt')

  const named = profile?.role === 'teacher' || profile?.role === 'hod'

  useEffect(() => {
    if (!profile?.school_id) return
    const schoolId = profile.school_id
    const since = `${new Date().getFullYear()}-01-01`
    Promise.all([fetchPaperResultsForStaff(schoolId, since), fetchClasses(schoolId), named ? fetchSchoolLearners(schoolId) : Promise.resolve([])]).then(
      async ([rows, { classes: all }, roster]) => {
        const mine = classesInView(profile, all)
        const m = await fetchClassMembers(mine.map((c) => c.id))
        const byClass = new Map<string, string[]>()
        for (const x of m) byClass.set(x.class_id, [...(byClass.get(x.class_id) ?? []), x.learner_id])
        setClasses(mine)
        setMembers(byClass)
        setNames(new Map(roster.map((l) => [l.id, l.full_name])))
        setAttempts(rows)
        if (!subject && rows.length) setSubject(rows[0].subject_id)
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.school_id, profile?.role])

  const filtered = useMemo(() => {
    const inClass = classId ? new Set(members.get(classId) ?? []) : null
    return (attempts ?? []).filter(
      (a) => (!subject || a.subject_id === subject) && (!grade || a.grade === grade) && (!inClass || inClass.has(a.learner_id)) && (!paperId || a.paper_id === paperId),
    )
  }, [attempts, subject, grade, classId, paperId, members])

  // A learner's latest attempt at each paper, so a paper written twice counts once.
  const latest = useMemo(() => {
    const m = new Map<string, PaperAttempt>()
    for (const a of filtered) {
      const k = `${a.learner_id}|${a.paper_id}`
      const seen = m.get(k)
      if (!seen || (seen.submitted_at ?? '') < (a.submitted_at ?? '')) m.set(k, a)
    }
    return [...m.values()]
  }, [filtered])

  const topics = useMemo(() => {
    const agg = new Map<string, { awarded: number; outOf: number; weak: Set<string> }>()
    for (const a of latest)
      for (const [id, t] of Object.entries(a.per_topic ?? {})) {
        const x = agg.get(id) ?? { awarded: 0, outOf: 0, weak: new Set<string>() }
        x.awarded += t.awarded
        x.outOf += t.outOf
        if (pct(t.awarded, t.outOf) < TOPIC_WEAK_BELOW) x.weak.add(a.learner_id)
        agg.set(id, x)
      }
    return [...agg.entries()].map(([id, x]) => ({ id, name: getTopic(id)?.name ?? id, percent: pct(x.awarded, x.outOf), weak: [...x.weak] })).sort((a, b) => a.percent - b.percent)
  }, [latest])

  const catchUp = useMemo(() => latest.filter((a) => (a.percent ?? 0) < CATCH_UP_BELOW).sort((a, b) => (a.percent ?? 0) - (b.percent ?? 0)), [latest])

  if (!profile) return null
  if (!profile.school_id) return <p className="text-sm text-navy-600">Paper results are for staff at a school.</p>
  if (attempts === null) return <RouteLoading />

  const who = (id: string) => (named ? (names.get(id) ?? 'A learner') : 'Learner')
  const subjects = [...new Set(attempts.map((a) => a.subject_id))]
  const papers = [...new Map(attempts.filter((a) => !subject || a.subject_id === subject).map((a) => [a.paper_id, a.title])).entries()]
  const average = latest.length ? latest.reduce((s, a) => s + (a.percent ?? 0), 0) / latest.length : 0
  const tally = new Map<number, number>()
  for (const a of latest) tally.set(levelOf(a.percent ?? 0), (tally.get(levelOf(a.percent ?? 0)) ?? 0) + 1)
  const maxTally = Math.max(1, ...tally.values())
  const classOfLearner = (id: string) => classes.find((c) => c.subject_id === subject && (members.get(c.id) ?? []).includes(id))?.name ?? ''

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Assessments"
        title="Paper results"
        description="Past and predicted papers your learners wrote under exam conditions, marked as soon as they hand in: the marks, the levels, the topics to re-teach and the learners to catch up."
      />

      {attempts.length === 0 ? (
        <div className="card p-5 text-sm text-navy-600">
          No papers have been marked yet this year. When a learner writes a past or predicted paper in Assessments and hands it in, it is marked and
          appears here straight away.
        </div>
      ) : (
        <>
          <div className="card flex flex-wrap gap-3 p-4 text-sm">
            <label className="text-xs font-medium text-navy-500">
              Subject
              <select className="select mt-1" value={subject} onChange={(e) => (setSubject(e.target.value), setPaperId(''))}>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {getSubject(s)?.name ?? s}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-navy-500">
              Grade
              <select className="select mt-1" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
                <option value={0}>All grades</option>
                {[10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </label>
            {classes.length ? (
              <label className="text-xs font-medium text-navy-500">
                Class
                <select className="select mt-1" value={classId} onChange={(e) => setClassId(e.target.value)}>
                  <option value="">All my learners</option>
                  {classes
                    .filter((c) => !subject || c.subject_id === subject)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </label>
            ) : null}
            <label className="text-xs font-medium text-navy-500">
              Paper
              <select className="select mt-1 max-w-[18rem]" value={paperId} onChange={(e) => setPaperId(e.target.value)}>
                <option value="">All papers</option>
                {papers.map(([id, title]) => (
                  <option key={id} value={id}>
                    {title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Papers marked</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums text-navy-900">{latest.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Average</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums text-navy-900">
                {Math.round(average)}% <span className="text-base font-semibold text-navy-500">Level {levelOf(average)}</span>
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Learners at each level</p>
              <div className="mt-2 space-y-1">
                {LEVELS.map((l) => (
                  <div key={l} className="flex items-center gap-2 text-xs">
                    <span className="w-14 tabular-nums text-navy-600">Level {l}</span>
                    <div className="h-2 flex-1 rounded-full bg-navy-50">
                      <div className={cn('h-2 rounded-full', l >= 4 ? 'bg-emerald-500' : l === 3 ? 'bg-amber-500' : 'bg-rose-500')} style={{ width: `${((tally.get(l) ?? 0) / maxTally) * 100}%` }} />
                    </div>
                    <span className="w-6 text-right tabular-nums text-navy-700">{tally.get(l) ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="card space-y-3 p-5">
            <h3 className="font-bold text-navy-900">Topics to re-teach</h3>
            <p className="text-xs text-navy-500">Marks earned in each topic across these papers, weakest first, with the learners below {TOPIC_WEAK_BELOW}% in it.</p>
            <ul className="divide-y divide-navy-50">
              {topics.slice(0, 10).map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                  <span className="min-w-[12rem] flex-1 font-medium text-navy-800">{t.name}</span>
                  <span className={cn('tabular-nums font-semibold', t.percent < TOPIC_WEAK_BELOW ? 'text-rose-700' : 'text-navy-700')}>{Math.round(t.percent)}%</span>
                  <span className="text-xs text-navy-500">
                    {t.weak.length} learner{t.weak.length === 1 ? '' : 's'} below {TOPIC_WEAK_BELOW}%
                    {named && t.weak.length ? `: ${t.weak.slice(0, 6).map(who).join(', ')}${t.weak.length > 6 ? '…' : ''}` : ''}
                  </span>
                </li>
              ))}
            </ul>
            {named ? (
              <Link to="../interventions" relative="path" className="btn-outline btn-sm">
                Start a catch-up group
              </Link>
            ) : null}
          </section>

          <section className={cn('card space-y-3 p-5', catchUp.length ? 'border-rose-200' : '')}>
            <h3 className="font-bold text-navy-900">Learners to catch up</h3>
            <p className="text-xs text-navy-500">Their latest paper was below {CATCH_UP_BELOW}% (Level 1 or 2). Their weakest topics are listed.</p>
            {catchUp.length === 0 ? (
              <p className="text-sm text-navy-600">No learner is below {CATCH_UP_BELOW}% on these papers.</p>
            ) : (
              <ul className="divide-y divide-navy-50">
                {catchUp.map((a) => {
                  const weakest = Object.entries(a.per_topic ?? {})
                    .map(([id, t]) => ({ name: getTopic(id)?.name ?? id, p: pct(t.awarded, t.outOf) }))
                    .sort((x, y) => x.p - y.p)
                    .slice(0, 3)
                  return (
                    <li key={a.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                      <span className="min-w-[10rem] font-medium text-navy-800">{who(a.learner_id)}</span>
                      <span className="tabular-nums text-rose-700">
                        {Math.round(a.percent ?? 0)}% · Level {levelOf(a.percent ?? 0)}
                      </span>
                      <span className="flex-1 text-xs text-navy-500">{weakest.map((w) => `${w.name} ${Math.round(w.p)}%`).join(' · ')}</span>
                      <button type="button" className="btn-ghost btn-sm" onClick={() => setParams({ attempt: a.id })}>
                        See the paper
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="card overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead>
                <tr className="border-b border-navy-100 text-left text-xs text-navy-500">
                  <th className="p-3 font-medium">Learner</th>
                  <th className="p-3 font-medium">Paper</th>
                  <th className="p-3 font-medium">Handed in</th>
                  <th className="p-3 text-right font-medium">Mark</th>
                  <th className="p-3 font-medium">Level</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map((a) => (
                  <tr key={a.id} className={open === a.id ? 'bg-gold-50' : undefined}>
                    <td className="p-3 font-medium text-navy-900">
                      {who(a.learner_id)}
                      {classOfLearner(a.learner_id) ? <span className="ml-1 text-xs font-normal text-navy-500">{classOfLearner(a.learner_id)}</span> : null}
                    </td>
                    <td className="p-3 text-navy-700">{a.title}</td>
                    <td className="p-3 text-navy-600">{a.submitted_at ? fmtDate(a.submitted_at) : ''}</td>
                    <td className="p-3 text-right tabular-nums text-navy-900">
                      {a.marks_awarded}/{a.marks_total} ({Math.round(a.percent ?? 0)}%)
                    </td>
                    <td className="p-3 text-navy-700">
                      {levelOf(a.percent ?? 0)} · {LEVEL_NAMES[levelOf(a.percent ?? 0)]}
                      {a.provisional ? <span className="badge-gold ml-2">provisional</span> : null}
                    </td>
                    <td className="p-3 text-right">
                      <button type="button" className="btn-ghost btn-sm" onClick={() => setParams(open === a.id ? {} : { attempt: a.id })}>
                        {open === a.id ? 'Close' : 'Questions'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {open ? <AttemptDetail attempt={attempts.find((a) => a.id === open) ?? null} name={(id) => who(id)} onClose={() => setParams({})} /> : null}
        </>
      )}
    </div>
  )
}

/** One marked paper, question by question: the learner's answer, the marks and where they were lost. */
function AttemptDetail({ attempt, name, onClose }: { attempt: PaperAttempt | null; name: (id: string) => string; onClose: () => void }) {
  const [paper, setPaper] = useState<Paper | null | undefined>(undefined)
  useEffect(() => {
    if (!attempt) return
    setPaper(undefined)
    getPaper(attempt.paper_id).then((p) => setPaper(p ?? null))
  }, [attempt])
  if (!attempt) return <p className="text-sm text-navy-600">That paper is not in your view.</p>
  return (
    <section className="card space-y-3 p-5" id="paper-detail">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-navy-900">
            {name(attempt.learner_id)}: {attempt.title}
          </h3>
          <p className="text-sm text-navy-600">
            {attempt.marks_awarded}/{attempt.marks_total} ({Math.round(attempt.percent ?? 0)}%) · Level {levelOf(attempt.percent ?? 0)}
            {attempt.marked_by === 'ai' ? ' · marked against the memo' : ' · marked by the values in the memo'}
          </p>
        </div>
        <button type="button" className="btn-outline btn-sm" onClick={onClose}>
          Close
        </button>
      </div>
      {paper === undefined ? <p className="text-sm text-navy-500">Loading the paper…</p> : null}
      {paper === null ? <p className="text-sm text-navy-500">The paper’s questions could not be loaded; the marks above are complete.</p> : null}
      {paper ? (
        <div className="space-y-2">
          {paper.sections.flatMap((s) =>
            s.items.map((item) => {
              const m = attempt.marking?.[item.id]
              const answer = attempt.answers[item.id] ?? ''
              const shown = item.options?.length ? (item.options.find((o) => o.id === answer)?.label ?? answer) : answer
              return (
                <div key={item.id} className={cn('rounded-lg border p-3 text-sm', m && m.awarded >= m.outOf ? 'border-emerald-200' : m && m.awarded > 0 ? 'border-amber-200' : 'border-rose-200')}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-navy-900">
                      {item.label} <span className="font-normal text-navy-500">{getTopic(item.topicId)?.name ?? ''}</span>
                    </span>
                    <span className="tabular-nums font-semibold text-navy-800">
                      {m ? `${m.awarded}/${m.outOf}` : `–/${item.marks}`}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-navy-600">{item.prompt}</p>
                  <p className="mt-1 whitespace-pre-wrap text-navy-900">
                    <span className="text-xs font-semibold uppercase tracking-wide text-navy-500">Answer: </span>
                    {shown || <em className="text-navy-400">no answer</em>}
                  </p>
                  {m?.feedback ? <p className="mt-1 text-navy-700">{m.feedback}</p> : null}
                </div>
              )
            }),
          )}
        </div>
      ) : null}
    </section>
  )
}
