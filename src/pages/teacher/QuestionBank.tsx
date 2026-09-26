import { useEffect, useMemo, useState } from 'react'
import { filterSubjectQuestions } from '@/data/questionBank'
import { topics, getTopic } from '@/data/topics'
import { subjects } from '@/data/subjects'
import { groupBySubtopic, type SubtopicGroup } from '@/data/subtopics'
import { atpFor, type AtpWeek } from '@/data/atp'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { DifficultyBadge } from '@/components/ui/Badges'
import { EmptyState } from '@/components/ui/EmptyState'
import { SparkleIcon, DownloadIcon, ClipboardIcon } from '@/components/ui/Icons'
import { QuestionText } from '@/components/practise/QuestionText'
import { cn } from '@/lib/utils'
import type { Difficulty, Grade, Question } from '@/types'

// Every subject that actually has topics -- previously hardcoded to the two
// maths subjects, which hid Physical and Life Sciences from teachers.
const teachableSubjects = subjects.filter((s) => topics.some((t) => t.subjectId === s.id))

/** One shared empty set, so `chosen` keeps a stable identity between renders. */
const EMPTY: ReadonlySet<string> = new Set()

/** Worksheet lengths a teacher actually sets. 'all' keeps the old behaviour. */
const LENGTHS = [10, 15, 20, 25, 'all'] as const
type Length = (typeof LENGTHS)[number]

/** Easiest first, so a worksheet opens the way a paper does. */
const byDemand = (qs: Question[]) =>
  [...qs].sort((a, b) => (a.cognitiveLevel ?? 2) - (b.cognitiveLevel ?? 2))

/**
 * Cut a selection down to `limit` questions without emptying out one end of it.
 *
 * Taking the first N would hand back whatever the papers happen to list first,
 * which in practice is a block of the same cognitive level. So the questions
 * are bucketed by level and taken round-robin: every level present keeps a
 * share, and a 10-question worksheet still runs from recall to reasoning.
 */
function pick(qs: Question[], limit: Length): Question[] {
  if (limit === 'all' || qs.length <= limit) return byDemand(qs)

  const buckets = new Map<number, Question[]>()
  for (const q of qs) {
    const level = q.cognitiveLevel ?? 2
    const bucket = buckets.get(level)
    if (bucket) bucket.push(q)
    else buckets.set(level, [q])
  }

  const levels = [...buckets.keys()].sort((a, b) => a - b)
  const out: Question[] = []
  for (let round = 0; out.length < limit; round++) {
    let added = false
    for (const level of levels) {
      const bucket = buckets.get(level)!
      if (round < bucket.length && out.length < limit) {
        out.push(bucket[round])
        added = true
      }
    }
    if (!added) break
  }
  return byDemand(out)
}

export function TeacherQuestionBank() {
  const [subjectId, setSubjectId] = useState<string>('mat-lit')
  const [grade, setGrade] = useState<Grade>(12)
  const [topicId, setTopicId] = useState<string>(
    topics.find((t) => t.subjectId === 'mat-lit' && t.grades.includes(12))!.id,
  )
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [length, setLength] = useState<Length>(15)
  /*
   * Sub-topic names the teacher wants, and the topic they were chosen under.
   * Empty means the whole topic.
   *
   * The topic is stored WITH the names rather than cleared by an effect when
   * the topic changes. An effect would have to run after the topic is set,
   * which is a race with selecting an ATP week -- that sets the topic and the
   * sub-topics together, and the clearing effect would wipe the second half.
   * Holding both in one value means a stale selection simply does not apply.
   */
  const [chosenFor, setChosenFor] = useState<{ topicId: string; names: Set<string> }>({
    topicId,
    names: new Set(),
  })
  const chosen = chosenFor.topicId === topicId ? chosenFor.names : EMPTY
  const [worksheet, setWorksheet] = useState<Question[] | null>(null)
  const [view, setView] = useState<'worksheet' | 'memo'>('worksheet')
  const [atpKey, setAtpKey] = useState<string>('')

  /*
   * Topics are grade-scoped -- Human Reproduction is Grade 12, Cells is
   * Grade 10 -- so listing every topic in the subject let a teacher pick a
   * Grade 10 / Grade 12-topic pair that can never have questions, and the
   * page answered "0 questions" as though the bank were empty. Every one of
   * the 58 empty Life Sciences combinations was this, not missing content.
   */
  const topicOptions = topics.filter((t) => t.subjectId === subjectId && t.grades.includes(grade))

  /*
   * The pool is `@/data/questionBank`, NOT `@/data/questions`.
   *
   * This page read the second one, which holds only the small standalone set
   * -- 11 questions across the 29 Life Sciences topics, so 78 of that
   * subject's 87 topic/grade combinations came back empty and the Generate
   * button was permanently disabled. Mat Lit and Mathematics have 67 and 122
   * standalone questions, enough to look like the page worked.
   *
   * questionBank merges the standalone set with every paper item, which is
   * what Practise, Learn and the weekly tests have always used, and it is
   * where the 1 994 Life Sciences items actually live. It loads per subject,
   * so this is async.
   */
  const [matches, setMatches] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let live = true
    setLoading(true)
    filterSubjectQuestions(subjectId, {
      topicId,
      grade,
      difficulty: difficulty === 'All' ? undefined : difficulty,
    }).then((qs) => {
      if (!live) return
      setMatches(qs)
      setLoading(false)
    })
    return () => {
      live = false
    }
  }, [subjectId, topicId, grade, difficulty])

  /*
   * The whole point of this page's rewrite. A topic is not a lesson: Finance
   * in Grade 11 holds 164 questions across eight sub-topics, and a teacher
   * doing tariffs next week wants the 25 that are about tariffs. Without this
   * split the only options were print one question or print all 164.
   */
  const groups: SubtopicGroup[] = useMemo(
    () => (matches.length ? groupBySubtopic(topicId, matches) : []),
    [topicId, matches],
  )

  const selected = useMemo(() => {
    if (!chosen.size) return matches
    const wanted = new Set(chosen)
    return groups.filter((g) => wanted.has(g.name)).flatMap((g) => g.questions)
  }, [groups, chosen, matches])

  const preview = useMemo(() => pick(selected, length), [selected, length])
  const totalMarks = preview.reduce((s, q) => s + q.marks, 0)
  const topic = getTopic(topicId)
  const subjectName = subjects.find((s) => s.id === subjectId)?.name ?? ''
  const atp = atpFor(subjectId, grade)

  const changeSubject = (id: string) => {
    setSubjectId(id)
    setTopicId(topics.find((t) => t.subjectId === id && t.grades.includes(grade))?.id ?? '')
    setAtpKey('')
  }

  // Changing the grade can strand the selected topic in a grade that does not
  // teach it, which would leave the select showing a topic that is no longer
  // one of its options.
  useEffect(() => {
    if (topicOptions.some((t) => t.id === topicId)) return
    setTopicId(topicOptions[0]?.id ?? '')
  }, [topicOptions, topicId])

  /** Pick an ATP week: set the topic and the week's sub-topics in one go. */
  const applyWeek = (key: string) => {
    setAtpKey(key)
    if (!key || !atp) return
    const week = atp.weeks[Number(key)] as AtpWeek | undefined
    if (!week?.topicId) return
    setTopicId(week.topicId)
    setChosenFor({ topicId: week.topicId, names: new Set(week.subtopics ?? []) })
  }

  const chosenWeek = atpKey && atp ? atp.weeks[Number(atpKey)] : undefined

  const toggle = (name: string) => {
    setAtpKey('')
    setChosenFor((prev) => {
      const names = new Set(prev.topicId === topicId ? prev.names : [])
      if (names.has(name)) names.delete(name)
      else names.add(name)
      return { topicId, names }
    })
  }

  const generate = () => {
    setWorksheet(preview)
    setView('worksheet')
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Question Bank"
        title="Build a worksheet for the week"
        description="Pick the week you are teaching, or choose sub-topics by hand, then print just those questions with a matching memo."
      />

      {atp ? (
        <div className="card p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[min(18rem,100%)] flex-1">
              <label className="text-xs font-medium text-navy-500" htmlFor="atp-week">
                What are you teaching?
              </label>
              <select id="atp-week" className="select mt-1" value={atpKey} onChange={(e) => applyWeek(e.target.value)}>
                <option value="">Choose a week from the teaching plan…</option>
                {[1, 2, 3, 4].map((term) => (
                  <optgroup key={term} label={`Term ${term}`}>
                    {atp.weeks.map((w, i) =>
                      w.term === term ? (
                        <option key={i} value={String(i)} disabled={!w.topicId}>
                          {w.dates ? `Week ${w.weeks} (${w.dates})` : w.weeks} — {w.label}
                          {w.topicId ? '' : ' · no questions'}
                        </option>
                      ) : null,
                    )}
                  </optgroup>
                ))}
              </select>
            </div>
            <p className="pb-2 text-xs text-navy-400">{atp.source}
                {atp.detail === 'term'
                  ? ' · terms only, because the week a topic starts is set by your province. Send yours and this becomes week by week.'
                  : ''}</p>
          </div>
          {chosenWeek?.note ? (
            <p className="mt-3 rounded-lg bg-navy-50 p-3 text-sm text-navy-600">{chosenWeek.note}</p>
          ) : null}
        </div>
      ) : null}

      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="text-xs font-medium text-navy-500">Subject</label>
            <select className="select mt-1" value={subjectId} onChange={(e) => changeSubject(e.target.value)}>
              {teachableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500">Grade</label>
            <select className="select mt-1" value={grade} onChange={(e) => setGrade(Number(e.target.value) as Grade)}>
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
              <option value={12}>Grade 12</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500">Topic</label>
            <select className="select mt-1" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              {topicOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500">Difficulty</label>
            <select className="select mt-1" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty | 'All')}>
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenge">Challenge</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500">Length</label>
            <select className="select mt-1" value={String(length)} onChange={(e) => setLength(e.target.value === 'all' ? 'all' : (Number(e.target.value) as Length))}>
              {LENGTHS.map((l) => (
                <option key={String(l)} value={String(l)}>
                  {l === 'all' ? 'Every question' : `${l} questions`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/*
          Sub-topics, with the count of questions behind each. The counts are
          what make this usable: "Area (23)" tells a teacher there is enough
          for a worksheet before they commit to printing anything.
        */}
        <div className="mt-4 border-t border-navy-100 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-navy-500">
              Sub-topics in {topic?.name ?? 'this topic'}
              {chosen.size ? ` · ${chosen.size} chosen` : ' · all of them'}
            </p>
            {chosen.size ? (
              <button
                type="button"
                onClick={() => {
                  setChosenFor({ topicId, names: new Set() })
                  setAtpKey('')
                }}
                className="text-xs font-semibold text-gold-700 underline"
              >
                Use the whole topic
              </button>
            ) : null}
          </div>
          {loading ? (
            <p className="mt-2 text-sm text-navy-400">Loading…</p>
          ) : groups.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {groups.map((g) => {
                const on = chosen.has(g.name)
                return (
                  <button
                    key={g.name}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(g.name)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm font-medium transition',
                      on
                        ? 'border-navy-900 bg-navy-900 text-white'
                        : 'border-navy-200 bg-white text-navy-700 hover:border-navy-400',
                    )}
                  >
                    {g.name} <span className={cn('ml-1 tabular-nums', on ? 'text-white/70' : 'text-navy-400')}>{g.questions.length}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="mt-2 text-sm text-navy-400">No questions for this topic and grade yet.</p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-navy-100 pt-4">
          <button type="button" onClick={generate} disabled={loading || preview.length === 0} className="btn-primary inline-flex items-center gap-2">
            <SparkleIcon className="h-4 w-4" /> Generate worksheet
          </button>
          <p className="text-sm text-navy-500">
            {loading ? (
              'Loading…'
            ) : (
              <>
                <span className="font-semibold text-navy-800">{preview.length} questions</span>
                {' · '}
                <span className="font-semibold text-navy-800">{totalMarks} marks</span>
                {selected.length > preview.length ? ` (from ${selected.length} available)` : null}
              </>
            )}
          </p>
        </div>
      </div>

      {!worksheet ? (
        <EmptyState
          icon={<ClipboardIcon className="h-6 w-6" />}
          title="No worksheet generated yet"
          description="Choose a week or some sub-topics above, then click Generate worksheet to preview a printable learner worksheet and memo."
        />
      ) : worksheet.length === 0 ? (
        <EmptyState icon={<ClipboardIcon className="h-6 w-6" />} title="No questions match this selection" description="Try another sub-topic or difficulty." />
      ) : (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 p-4">
            <div className="inline-flex rounded-lg border border-navy-200 bg-white p-1">
              <button
                type="button"
                aria-pressed={view === 'worksheet'}
                onClick={() => setView('worksheet')}
                className={cn('rounded-md px-4 py-1.5 text-sm font-semibold', view === 'worksheet' ? 'bg-navy-900 text-white' : 'text-navy-600')}
              >
                Learner Worksheet
              </button>
              <button
                type="button"
                aria-pressed={view === 'memo'}
                onClick={() => setView('memo')}
                className={cn('rounded-md px-4 py-1.5 text-sm font-semibold', view === 'memo' ? 'bg-navy-900 text-white' : 'text-navy-600')}
              >
                Teacher Memo
              </button>
            </div>
            <button type="button" onClick={() => window.print()} className="btn-outline btn-sm inline-flex items-center gap-1.5">
              <DownloadIcon className="h-4 w-4" /> Print / Save PDF
            </button>
          </div>

          <div className="print-area p-6 sm:p-8">
            <div className="mb-6 border-b border-dashed border-navy-200 pb-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">DONE WELL® {subjectName}</p>
              <h2 className="mt-1 text-lg font-bold text-navy-900">
                Grade {grade} — {topic?.name} {view === 'memo' ? '(Teacher Memo)' : 'Worksheet'}
              </h2>
              {/*
                The sub-topics are printed on the sheet. A teacher who runs off
                four worksheets in a morning needs to tell them apart from the
                paper, not from the tab they were generated in.
              */}
              {chosen.size ? <p className="mt-1 text-xs font-medium text-navy-600">{[...chosen].join(' · ')}</p> : null}
              {chosenWeek ? (
                <p className="mt-1 text-xs text-navy-500">
                  {chosenWeek.dates
                    ? `Term ${chosenWeek.term}, week ${chosenWeek.weeks} (${chosenWeek.dates})`
                    : `Term ${chosenWeek.term} — ${chosenWeek.label}`}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-navy-500">
                {worksheet.length} questions · {worksheet.reduce((s, q) => s + q.marks, 0)} marks total
              </p>
              {view === 'worksheet' ? (
                <div className="mt-4 flex justify-center gap-8 text-sm text-navy-600">
                  <span>Name: _____________________________</span>
                  <span>Date: _______________</span>
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              {worksheet.map((q, i) => (
                <div key={q.id} className="print-avoid-break">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-navy-900">
                      {i + 1}. {q.prompt}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <DifficultyBadge difficulty={q.difficulty} />
                      <span className="badge-slate">{q.marks} marks</span>
                    </div>
                  </div>
                  {q.context ? (
                    <QuestionText className="mt-1.5 text-sm text-navy-500">{q.context}</QuestionText>
                  ) : null}
                  {q.options ? (
                    <ul className="mt-2 space-y-1 pl-4 text-sm text-navy-700">
                      {q.options.map((o) => (
                        <li key={o.id}>
                          {o.id.toUpperCase()}) {o.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-2 h-10 rounded border border-dashed border-navy-200" />
                  )}
                  {view === 'memo' ? (
                    <div className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                      <strong>Answer:</strong> {q.answer}
                      <p className="mt-1 text-emerald-700">{q.explanation}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
