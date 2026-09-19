import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { subjects } from '@/data/subjects'
import { topicsForSubject } from '@/data/topics'
import {
  createTest,
  deleteTest,
  fetchTestsForSchool,
  fetchAttemptsForTest,
  type WeeklyTest,
  type TestAttempt,
} from '@/lib/weeklyTests'
import { fetchSchoolLearners, type RosterLearner } from '@/lib/teacherRoster'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ClipboardIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import { filterSubjectQuestions } from '@/data/questionBank'
import { groupBySubtopic } from '@/data/subtopics'
import { qualify } from '@/lib/testPaper'
import { atpFor, type AtpWeek } from '@/data/atp'
import type { Grade } from '@/types'

/** A date input wants yyyy-mm-dd; default to a week today, which is what "weekly" means. */
function weekFromToday(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 10)
}

const gradeOptions: Grade[] = [10, 11, 12]

export function WeeklyTests() {
  const { profile } = useAccountAuth()
  const schoolId = profile?.school_id ?? null

  const [tests, setTests] = useState<WeeklyTest[]>([])
  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [attempts, setAttempts] = useState<Record<string, TestAttempt[]>>({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? 'mat-lit')
  const [grade, setGrade] = useState<Grade>(12)
  const [topicIds, setTopicIds] = useState<string[]>([])
  /** Qualified `topicId::name`. Empty means the whole topic. */
  const [subtopics, setSubtopics] = useState<string[]>([])
  const [atpKey, setAtpKey] = useState('')
  const [questionCount, setQuestionCount] = useState(8)
  const [dueDate, setDueDate] = useState(weekFromToday())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const topics = useMemo(() => topicsForSubject(subjectId, grade), [subjectId, grade])

  const reload = async (id: string) => {
    const rows = await fetchTestsForSchool(id)
    setTests(rows)
    const byTest: Record<string, TestAttempt[]> = {}
    for (const t of rows) byTest[t.id] = await fetchAttemptsForTest(t.id)
    setAttempts(byTest)
  }

  useEffect(() => {
    if (!schoolId) {
      setLoading(false)
      return
    }
    let active = true
    Promise.all([fetchTestsForSchool(schoolId), fetchSchoolLearners(schoolId)]).then(async ([rows, roster]) => {
      if (!active) return
      setTests(rows)
      setLearners(roster)
      const byTest: Record<string, TestAttempt[]> = {}
      for (const t of rows) byTest[t.id] = await fetchAttemptsForTest(t.id)
      if (active) {
        setAttempts(byTest)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [schoolId])

  // Changing subject or grade invalidates the topic choices, which belong to
  // the old pair -- keeping them would set a test on topics that are not in it.
  useEffect(() => {
    setTopicIds([])
    setSubtopics([])
    setAtpKey('')
  }, [subjectId, grade])

  /*
   * The sub-topics available across whichever topics are ticked, with how many
   * questions sit behind each.
   *
   * A test set on a whole topic covers every sub-topic in it -- buildTestPaper
   * takes questions round-robin -- so these chips are for NARROWING a test to
   * the week's work, not for making a topic test complete. That is why leaving
   * them all off is the normal case and is labelled as the whole topic.
   */
  const [available, setAvailable] = useState<{ key: string; name: string; topic: string; count: number }[]>([])
  useEffect(() => {
    let live = true
    if (!topicIds.length) {
      setAvailable([])
      return
    }
    Promise.all(
      topicIds.map(async (id) => {
        const qs = await filterSubjectQuestions(subjectId, { topicId: id, grade })
        const topicName = topics.find((t) => t.id === id)?.name ?? id
        return groupBySubtopic(id, qs).map((g) => ({
          key: qualify(id, g.name),
          name: g.name,
          topic: topicName,
          count: g.questions.length,
        }))
      }),
    ).then((lists) => {
      if (live) setAvailable(lists.flat())
    })
    return () => {
      live = false
    }
  }, [subjectId, grade, topicIds, topics])

  // Sub-topics belonging to a topic that has since been unticked must go too,
  // or the test would be limited to something it no longer draws from.
  useEffect(() => {
    setSubtopics((prev) => prev.filter((k) => topicIds.includes(k.split('::')[0])))
  }, [topicIds])

  const atp = atpFor(subjectId, grade)
  const chosenWeek = atpKey && atp ? (atp.weeks[Number(atpKey)] as AtpWeek | undefined) : undefined

  /** Pick an ATP week: set the topic and that week's sub-topics together. */
  const applyWeek = (key: string) => {
    setAtpKey(key)
    if (!key || !atp) return
    const week = atp.weeks[Number(key)]
    if (!week?.topicId) return
    setTopicIds([week.topicId])
    setSubtopics((week.subtopics ?? []).map((n) => qualify(week.topicId!, n)))
    if (!title.trim()) setTitle(`Weekly Test: ${week.label}`)
  }

  /*
   * How many sub-topics the test will actually reach. A whole-topic test is
   * built to cover all of them, so a count lower than the number of sub-topics
   * is the one thing that stops it -- and the teacher should be told before
   * they set it, not after the class has sat it.
   */
  const targeted = subtopics.length ? subtopics.length : available.length
  const uncovered = Math.max(0, targeted - questionCount)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!schoolId || !profile) return
    if (!title.trim()) {
      setError('Give the test a title your learners will recognise.')
      return
    }
    if (topicIds.length === 0) {
      setError('Choose at least one topic for the test to draw its questions from.')
      return
    }
    setSaving(true)
    setError('')
    const { error: createError } = await createTest({
      schoolId,
      createdBy: profile.id,
      title,
      subjectId,
      grade,
      topicIds,
      subtopics,
      questionCount,
      // End of the chosen day, not midnight at its start -- a test "due Friday"
      // is due at the end of Friday, which is what a learner expects.
      dueAt: new Date(`${dueDate}T23:59:59`).toISOString(),
    })
    setSaving(false)
    if (createError) {
      setError(createError)
      return
    }
    setTitle('')
    setTopicIds([])
    setSubtopics([])
    setAtpKey('')
    setShowForm(false)
    await reload(schoolId)
  }

  const remove = async (test: WeeklyTest) => {
    if (!schoolId) return
    const message = await deleteTest(test.id)
    if (message) {
      setError(message)
      return
    }
    await reload(schoolId)
  }

  if (!profile) return null

  if (!schoolId) {
    return (
      <div className="space-y-6">
        <SectionHeading eyebrow="Weekly tests" title="Weekly tests" description="Set a short test for your class." />
        <EmptyState
          icon={<ClipboardIcon className="h-6 w-6" />}
          title="Your account is not linked to a school"
          description="A test is set for a school, so this needs to be sorted out first. Sign up again with your school's code, or ask an administrator to add you."
        />
      </div>
    )
  }

  const expected = learners.filter((l) => l.grade !== null)

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Weekly tests"
        title="Weekly tests"
        description="Set a short test from any topic. Learners sit it in the app, mark it against the memo, and the result comes back here."
      />

      <div className="rounded-lg border border-navy-200 bg-navy-50 p-4 text-xs leading-relaxed text-navy-700">
        <strong className="font-semibold text-navy-900">How these are marked.</strong> Almost every question here is
        answered in prose against an NSC-style memo, which no machine can mark. The learner marks their own answer
        against the memo, question by question, and you see what they awarded themselves. Treat it as a diagnostic of
        where the class is struggling, not as a mark for a report.
      </div>

      {!showForm ? (
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
          Set a new test
        </button>
      ) : (
        <form onSubmit={submit} className="card space-y-4 p-5">
          <h2 className="text-base font-bold text-navy-900">New weekly test</h2>

          {atp ? (
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="testWeek">
                What did you teach this week?
              </label>
              <select id="testWeek" className="select mt-1" value={atpKey} onChange={(e) => applyWeek(e.target.value)}>
                <option value="">Choose a week from the teaching plan…</option>
                {[1, 2, 3, 4].map((term) => (
                  <optgroup key={term} label={`Term ${term}`}>
                    {atp.weeks.map((w, i) =>
                      w.term === term ? (
                        <option key={i} value={String(i)} disabled={!w.topicId}>
                          Week {w.weeks} ({w.dates}) — {w.label}
                          {w.topicId ? '' : ' · no questions'}
                        </option>
                      ) : null,
                    )}
                  </optgroup>
                ))}
              </select>
              <p className="mt-1 text-xs text-navy-400">{atp.source}</p>
            </div>
          ) : null}

          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="testTitle">
              Title
            </label>
            <input
              id="testTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Test: Evolution"
              className="input mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="testSubject">
                Subject
              </label>
              <select
                id="testSubject"
                className="select mt-1"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="testGrade">
                Grade
              </label>
              <select
                id="testGrade"
                className="select mt-1"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) as Grade)}
              >
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-navy-500">Topics ({topicIds.length} chosen)</label>
            <div className="mt-1.5 max-h-52 space-y-1 overflow-y-auto rounded-lg border border-navy-200 p-2">
              {topics.length === 0 ? (
                <p className="p-2 text-xs text-navy-500">No topics for this subject and grade.</p>
              ) : (
                topics.map((t) => {
                  const on = topicIds.includes(t.id)
                  return (
                    <label
                      key={t.id}
                      className={cn(
                        'flex cursor-pointer items-start gap-2 rounded-md p-2 text-sm',
                        on ? 'bg-gold-50' : 'hover:bg-navy-50',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          setTopicIds(on ? topicIds.filter((id) => id !== t.id) : [...topicIds, t.id])
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-navy-300"
                      />
                      <span className="text-navy-800">{t.name}</span>
                    </label>
                  )
                })
              )}
            </div>
          </div>

          {available.length ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-medium text-navy-500">
                  Sub-topics{' '}
                  {subtopics.length ? (
                    <span className="text-navy-800">· {subtopics.length} chosen</span>
                  ) : (
                    <span className="text-navy-400">· the whole topic, every sub-topic covered</span>
                  )}
                </label>
                {subtopics.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSubtopics([])
                      setAtpKey('')
                    }}
                    className="text-xs font-semibold text-gold-700 underline"
                  >
                    Test the whole topic
                  </button>
                ) : null}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {available.map((sub) => {
                  const on = subtopics.includes(sub.key)
                  return (
                    <button
                      key={sub.key}
                      type="button"
                      aria-pressed={on}
                      title={sub.topic}
                      onClick={() => {
                        setAtpKey('')
                        setSubtopics((prev) =>
                          prev.includes(sub.key) ? prev.filter((k) => k !== sub.key) : [...prev, sub.key],
                        )
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                        on
                          ? 'border-navy-900 bg-navy-900 text-white'
                          : 'border-navy-200 bg-white text-navy-700 hover:border-navy-400',
                      )}
                    >
                      {sub.name}{' '}
                      <span className={cn('ml-1 tabular-nums', on ? 'text-white/70' : 'text-navy-400')}>
                        {sub.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="qCount">
                Questions
              </label>
              <input
                id="qCount"
                type="number"
                min={1}
                max={30}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="dueDate">
                Due
              </label>
              <input
                id="dueDate"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input mt-1"
              />
            </div>
          </div>

          {/*
            A topic test is built to reach every sub-topic, so the only thing
            that can stop it is being too short. Say so here, with the number to
            raise it to, rather than letting the class sit a test that silently
            skips a third of the topic.
          */}
          {uncovered > 0 ? (
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              {questionCount} question{questionCount === 1 ? '' : 's'} cannot reach all {targeted} sub-topics
              {subtopics.length ? ' you chose' : ' in this topic'} — {uncovered} would go untested. Raise it to{' '}
              <button type="button" onClick={() => setQuestionCount(Math.min(30, targeted))} className="font-semibold underline">
                {Math.min(30, targeted)}
              </button>{' '}
              to cover them all.
            </p>
          ) : targeted > 0 ? (
            <p className="text-xs text-navy-500">
              Covers all {targeted} sub-topic{targeted === 1 ? '' : 's'}
              {subtopics.length ? ' you chose' : ' in this topic'}.
            </p>
          ) : null}

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Setting…' : 'Set the test'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setError('') }} className="btn-outline">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-navy-500">Loading your tests…</p>
      ) : tests.length === 0 ? (
        <EmptyState
          icon={<ClipboardIcon className="h-6 w-6" />}
          title="No tests set yet"
          description="Set one above and it appears for every learner at your school in that subject and grade."
        />
      ) : (
        <div className="space-y-4">
          {tests.map((test) => {
            const rows = (attempts[test.id] ?? []).filter((a) => a.submitted_at)
            const forGrade = expected.filter((l) => l.grade === test.grade && l.subject_id === test.subject_id)
            const average =
              rows.length > 0
                ? Math.round(
                    (rows.reduce((s, a) => s + (a.marks_awarded ?? 0), 0) /
                      Math.max(1, rows.reduce((s, a) => s + (a.marks_total ?? 0), 0))) *
                      100,
                  )
                : null
            const due = new Date(test.due_at)
            const overdue = due.getTime() < Date.now()

            return (
              <article key={test.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-navy-900">{test.title}</h3>
                    <p className="mt-0.5 text-xs text-navy-500">
                      Grade {test.grade} · {test.question_count} questions ·{' '}
                      {test.subtopics?.length
                        ? `${test.subtopics.length} sub-topic${test.subtopics.length === 1 ? '' : 's'}`
                        : `${test.topic_ids.length} topic${test.topic_ids.length === 1 ? '' : 's'}, all sub-topics`}{' '}
                      ·{' '}
                      <span className={overdue ? 'text-navy-500' : 'font-semibold text-navy-700'}>
                        {overdue ? 'closed' : 'due'} {due.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                      </span>
                    </p>
                  </div>
                  <button type="button" onClick={() => remove(test)} className="btn-outline text-xs">
                    Delete
                  </button>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-navy-500">Handed in</dt>
                    <dd className="text-lg font-bold tabular-nums text-navy-900">
                      {rows.length}
                      <span className="text-sm font-normal text-navy-400"> / {forGrade.length || '—'}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-navy-500">Class average</dt>
                    <dd className="text-lg font-bold tabular-nums text-navy-900">
                      {average === null ? '—' : `${average}%`}
                    </dd>
                  </div>
                </dl>

                {rows.length > 0 ? (
                  <ul className="mt-4 space-y-2 border-t border-navy-100 pt-4">
                    {rows.map((a) => {
                      const learner = learners.find((l) => l.id === a.learner_id)
                      const pct =
                        a.marks_total && a.marks_total > 0
                          ? Math.round(((a.marks_awarded ?? 0) / a.marks_total) * 100)
                          : 0
                      return (
                        <li key={a.id} className="flex items-center gap-3">
                          <span className="w-32 shrink-0 truncate text-sm text-navy-800">
                            {learner?.full_name ?? 'A learner'}
                          </span>
                          <span className="flex-1">
                            <ProgressBar percent={pct} label={`${learner?.full_name ?? 'A learner'} test score`} size="sm" />
                          </span>
                          <span className="w-20 shrink-0 text-right text-sm tabular-nums text-navy-700">
                            {a.marks_awarded}/{a.marks_total}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
