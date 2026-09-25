import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { subjects } from '@/data/subjects'
import { getTopic, topicsForSubject } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { TargetIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import { classesInView, fetchClassMembers, fetchClasses, type ClassMember, type SchoolClass } from '@/lib/classes'
import { fetchProgressForLearners, fetchSchoolLearners, type RosterLearner, type RosterProgressRow } from '@/lib/teacherRoster'
import { fetchSchoolTeachers, type SchoolTeacher } from '@/lib/schoolStaff'
import { createTest, fetchAttemptsForTest, fetchTestsForSchool, type TestAttempt, type WeeklyTest } from '@/lib/weeklyTests'
import {
  attemptPercent,
  fetchInterventionLearners,
  fetchInterventions,
  outcomesFor,
  removeInterventionLearner,
  setInterventionStatus,
  startIntervention,
  type Intervention,
  type InterventionLearner,
} from '@/lib/interventions'
import type { Grade } from '@/types'

const GRADES: Grade[] = [10, 11, 12]
/** Below this starting point a learner is suggested for the group. */
const SUGGEST_BELOW = 50

const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id
const topicName = (id: string) => getTopic(id)?.name ?? id
const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })

function weekFromToday(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 10)
}

const STATUS_STYLE: Record<Intervention['status'], string> = {
  active: 'badge-gold',
  completed: 'badge-green',
  cancelled: 'badge-slate',
}
const STATUS_LABEL: Record<Intervention['status'], string> = {
  active: 'Running',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

/**
 * Catch-up groups: diagnose, intervene, reassess.
 *
 * A group is started from evidence -- a class's weak topic, or a weekly test
 * -- and every learner's starting point is recorded when they are added. The
 * reassessment is a weekly test only the group sits, and the page puts the two
 * numbers side by side.
 */
export function Interventions() {
  const { profile } = useAccountAuth()
  const [params, setParams] = useSearchParams()
  const schoolId = profile?.school_id ?? null
  const leader = profile?.role === 'school' || profile?.role === 'hod'

  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [members, setMembers] = useState<InterventionLearner[]>([])
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [classMembers, setClassMembers] = useState<ClassMember[]>([])
  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [staff, setStaff] = useState<SchoolTeacher[]>([])
  const [tests, setTests] = useState<WeeklyTest[]>([])
  const [attempts, setAttempts] = useState<Record<string, TestAttempt[]>>({})
  const [loading, setLoading] = useState(true)
  const [notSetUp, setNotSetUp] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async (id: string) => {
    const [iv, cl, roster, teachers, schoolTests] = await Promise.all([
      fetchInterventions(id),
      fetchClasses(id),
      fetchSchoolLearners(id),
      fetchSchoolTeachers(id),
      fetchTestsForSchool(id),
    ])
    setInterventions(iv.interventions)
    setNotSetUp(iv.notSetUp)
    setClasses(cl.classes)
    setLearners(roster)
    setStaff(teachers)
    setTests(schoolTests)
    const [ivMembers, clMembers, rows] = await Promise.all([
      fetchInterventionLearners(iv.interventions.map((i) => i.id)),
      fetchClassMembers(cl.classes.map((c) => c.id)),
      fetchProgressForLearners(roster.map((l) => l.id)),
    ])
    setMembers(ivMembers)
    setClassMembers(clMembers)
    setProgress(rows)
    const byTest: Record<string, TestAttempt[]> = {}
    await Promise.all(schoolTests.map(async (t) => (byTest[t.id] = await fetchAttemptsForTest(t.id))))
    setAttempts(byTest)
  }

  useEffect(() => {
    if (!schoolId) {
      setLoading(false)
      return
    }
    let active = true
    load(schoolId).then(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId])

  // ---------------------------------------------------------------- the form
  const [showForm, setShowForm] = useState(false)
  const [classId, setClassId] = useState('')
  const [grade, setGrade] = useState<Grade>(12)
  const [subjectId, setSubjectId] = useState(profile?.subject_id ?? 'mat-lit')
  const [topicId, setTopicId] = useState('')
  /** 'practice' or a weekly test id. */
  const [source, setSource] = useState('practice')
  const [picked, setPicked] = useState<string[]>([])
  const [plan, setPlan] = useState('')

  const myClasses = classesInView(profile, classes)
  const chosenClass = classes.find((c) => c.id === classId) ?? null
  const formGrade = chosenClass?.grade ?? grade
  const formSubject = chosenClass?.subject_id ?? subjectId

  // Arriving from a class page ("?class=&topic=") or a weekly test ("?test=")
  // opens the form already filled in from that evidence.
  useEffect(() => {
    if (loading) return
    const fromTest = params.get('test')
    const fromClass = params.get('class')
    const fromTopic = params.get('topic')
    if (!fromTest && !fromClass && !fromTopic) return
    const test = tests.find((t) => t.id === fromTest)
    if (test) {
      setClassId(test.class_id ?? '')
      setGrade(test.grade)
      setSubjectId(test.subject_id)
      setTopicId(fromTopic ?? test.topic_ids[0] ?? '')
      setSource(test.id)
    } else {
      const cls = classes.find((c) => c.id === fromClass)
      if (cls) setClassId(cls.id)
      if (fromTopic) setTopicId(fromTopic)
      setSource('practice')
    }
    setShowForm(true)
    setParams({}, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  // The learners the group could draw from: the class, or the whole grade.
  const pool = useMemo(() => {
    if (chosenClass) {
      const ids = new Set(classMembers.filter((m) => m.class_id === chosenClass.id).map((m) => m.learner_id))
      return learners.filter((l) => ids.has(l.id))
    }
    return learners.filter((l) => l.grade === formGrade && (l.subject_id === null || l.subject_id === formSubject))
  }, [chosenClass, classMembers, learners, formGrade, formSubject])

  // Each learner's starting point, from the chosen evidence.
  const baselineOf = (learnerId: string): number | null => {
    if (source !== 'practice') {
      const a = (attempts[source] ?? []).find((x) => x.learner_id === learnerId && x.submitted_at)
      return a ? attemptPercent(a) : null
    }
    return progress.find((p) => p.learner_id === learnerId && p.topic_id === topicId)?.mastery_percent ?? null
  }

  // Pre-tick everyone below the line whenever the evidence changes.
  useEffect(() => {
    setPicked(pool.filter((l) => {
      const b = baselineOf(l.id)
      return b !== null && b < SUGGEST_BELOW
    }).map((l) => l.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, source, topicId, attempts, progress])

  const diagnosticTests = tests.filter(
    (t) =>
      !t.intervention_id &&
      t.subject_id === formSubject &&
      t.grade === formGrade &&
      (!chosenClass || !t.class_id || t.class_id === chosenClass.id) &&
      (!topicId || t.topic_ids.includes(topicId)),
  )

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!schoolId || !profile) return
    if (!topicId) {
      setError('Choose the topic the group needs help with.')
      return
    }
    if (picked.length === 0) {
      setError('Choose at least one learner for the group.')
      return
    }
    setBusy(true)
    setError('')
    const result = await startIntervention({
      schoolId,
      createdBy: profile.id,
      classId: chosenClass?.id ?? null,
      subjectId: formSubject,
      grade: formGrade,
      topicId,
      subtopic: null,
      plan,
      diagnosticTestId: source === 'practice' ? null : source,
      learners: picked.map((id) => ({ id, baseline: baselineOf(id) })),
    })
    setBusy(false)
    if (result.error) setError(result.error)
    if (result.intervention) {
      setShowForm(false)
      setPlan('')
      await load(schoolId)
    }
  }

  // ------------------------------------------------------------ the groups
  const [reassessing, setReassessing] = useState<string | null>(null)
  const [reCount, setReCount] = useState(8)
  const [reDue, setReDue] = useState(weekFromToday())

  const setReassessment = async (iv: Intervention) => {
    if (!schoolId || !profile) return
    setBusy(true)
    setError('')
    const { error: e } = await createTest({
      schoolId,
      createdBy: profile.id,
      title: `Catch-up reassessment: ${topicName(iv.topic_id)}`,
      subjectId: iv.subject_id,
      grade: iv.grade,
      topicIds: [iv.topic_id],
      subtopics: iv.subtopic ? [iv.subtopic] : [],
      questionCount: reCount,
      dueAt: new Date(`${reDue}T23:59:59`).toISOString(),
      interventionId: iv.id,
    })
    setBusy(false)
    if (e) {
      setError(e)
      return
    }
    setReassessing(null)
    await load(schoolId)
  }

  const act = async (fn: () => Promise<string | undefined>) => {
    if (!schoolId) return
    setBusy(true)
    const message = await fn()
    setBusy(false)
    if (message) setError(message)
    else await load(schoolId)
  }

  if (!profile) return null

  const heading = (
    <SectionHeading
      eyebrow="Intervention"
      title="Catch-up groups"
      description="Group the learners who are behind on a topic, record where each one started, then reassess them with a test only they sit — and see whether it worked."
    />
  )

  if (!schoolId) {
    return (
      <div className="space-y-6">
        {heading}
        <EmptyState
          icon={<TargetIcon className="h-6 w-6" />}
          title="Your account is not linked to a school"
          description="Catch-up groups belong to a school. Sign up again with your school's code, or ask an administrator."
        />
      </div>
    )
  }
  if (loading) {
    return (
      <div className="space-y-6">
        {heading}
        <p className="text-sm text-navy-500">Loading catch-up groups…</p>
      </div>
    )
  }
  if (notSetUp) {
    return (
      <div className="space-y-6">
        {heading}
        <div className="card border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Catch-up groups are not switched on yet. Your administrator needs to run the latest database update (STEP 15 in
          supabase/schema.sql).
        </div>
      </div>
    )
  }

  const nameOf = (id: string | null) =>
    id === null ? 'a former member of staff' : id === profile.id ? 'you' : (staff.find((s) => s.id === id)?.full_name ?? 'a colleague')
  const learnerName = (id: string) => learners.find((l) => l.id === id)?.full_name ?? 'A learner who has left'
  const canManage = (iv: Intervention) => leader || iv.created_by === profile.id

  const visible = interventions.filter((iv) =>
    profile.role === 'teacher'
      ? iv.created_by === profile.id
      : profile.role === 'hod' && profile.subject_id
        ? iv.subject_id === profile.subject_id
        : true,
  )
  const running = visible.filter((iv) => iv.status === 'active')
  const closed = visible.filter((iv) => iv.status !== 'active')

  const renderGroup = (iv: Intervention) => {
    const group = members.filter((m) => m.intervention_id === iv.id)
    const reassessments = tests.filter((t) => t.intervention_id === iv.id)
    const outcomes = outcomesFor(group, reassessments, attempts)
    const measured = outcomes.filter((o) => o.change !== null)
    const improved = measured.filter((o) => (o.change ?? 0) > 0).length
    const diagnostic = tests.find((t) => t.id === iv.diagnostic_test_id)
    const cls = classes.find((c) => c.id === iv.class_id)

    return (
      <article key={iv.id} className="card space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-navy-900">{topicName(iv.topic_id)}</h3>
              <span className={STATUS_STYLE[iv.status]}>{STATUS_LABEL[iv.status]}</span>
            </div>
            <p className="mt-0.5 text-xs text-navy-500">
              {cls ? cls.name : `Grade ${iv.grade} ${subjectName(iv.subject_id)}`} · started by {nameOf(iv.created_by)} on{' '}
              {shortDate(iv.created_at)} · starting points from {diagnostic ? `“${diagnostic.title}”` : 'practice mastery'}
            </p>
          </div>
          {measured.length ? (
            <p className="text-sm font-semibold tabular-nums text-navy-800">
              {improved} of {measured.length} improved
            </p>
          ) : null}
        </div>

        {iv.plan ? <p className="whitespace-pre-line rounded-lg bg-navy-50 p-3 text-sm text-navy-700">{iv.plan}</p> : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[22rem] text-sm">
            <thead>
              <tr className="text-left text-xs text-navy-500">
                <th className="pb-2 font-medium">Learner</th>
                <th className="pb-2 text-right font-medium">Start</th>
                <th className="pb-2 text-right font-medium">Reassessed</th>
                <th className="pb-2 text-right font-medium">Change</th>
                {canManage(iv) && iv.status === 'active' ? <th className="pb-2" /> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 tabular-nums">
              {outcomes.map((o) => (
                <tr key={o.learnerId}>
                  <td className="py-2 pr-2 text-navy-900">{learnerName(o.learnerId)}</td>
                  <td className="py-2 text-right text-navy-700">{o.baseline === null ? '—' : `${o.baseline}%`}</td>
                  <td className="py-2 text-right text-navy-700">{o.latest === null ? '—' : `${o.latest}%`}</td>
                  <td
                    className={cn(
                      'py-2 text-right font-semibold',
                      o.change === null ? 'text-navy-400' : o.change > 0 ? 'text-emerald-700' : o.change < 0 ? 'text-rose-700' : 'text-navy-600',
                    )}
                  >
                    {o.change === null ? '—' : `${o.change > 0 ? '+' : ''}${o.change}`}
                  </td>
                  {canManage(iv) && iv.status === 'active' ? (
                    <td className="py-2 pl-2 text-right">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => act(() => removeInterventionLearner(iv.id, o.learnerId))}
                        className="text-xs text-navy-400 underline hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reassessments.length ? (
          <p className="text-xs text-navy-500">
            Reassessment{reassessments.length === 1 ? '' : 's'}:{' '}
            {reassessments
              .map((t) => {
                const handed = (attempts[t.id] ?? []).filter((a) => a.submitted_at).length
                return `${t.title} (due ${shortDate(t.due_at)}, ${handed}/${group.length} handed in)`
              })
              .join('; ')}
          </p>
        ) : null}

        {canManage(iv) ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-navy-100 pt-4">
            {iv.status === 'active' ? (
              reassessing === iv.id ? (
                <div className="flex w-full flex-wrap items-end gap-2">
                  <label className="text-xs text-navy-500">
                    Questions
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={reCount}
                      onChange={(e) => setReCount(Number(e.target.value))}
                      className="input mt-1 w-24"
                    />
                  </label>
                  <label className="text-xs text-navy-500">
                    Due
                    <input type="date" value={reDue} onChange={(e) => setReDue(e.target.value)} className="input mt-1" />
                  </label>
                  <button type="button" disabled={busy} onClick={() => setReassessment(iv)} className="btn-primary">
                    Set the reassessment
                  </button>
                  <button type="button" onClick={() => setReassessing(null)} className="btn-ghost">
                    Cancel
                  </button>
                  <p className="w-full text-xs text-navy-400">
                    A weekly test on {topicName(iv.topic_id)} that only the {group.length} learner
                    {group.length === 1 ? '' : 's'} in this group will see.
                  </p>
                </div>
              ) : (
                <>
                  <button type="button" onClick={() => setReassessing(iv.id)} className="btn-outline btn-sm">
                    {reassessments.length ? 'Set another reassessment' : 'Set a reassessment test'}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => act(() => setInterventionStatus(iv.id, 'completed'))}
                    className="btn-outline btn-sm"
                  >
                    Mark complete
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => act(() => setInterventionStatus(iv.id, 'cancelled'))}
                    className="btn-ghost btn-sm"
                  >
                    Cancel group
                  </button>
                </>
              )
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => act(() => setInterventionStatus(iv.id, 'active'))}
                className="btn-ghost btn-sm"
              >
                Reopen
              </button>
            )}
          </div>
        ) : null}
      </article>
    )
  }

  const formTopics = topicsForSubject(formSubject, formGrade)

  return (
    <div className="space-y-6">
      {heading}

      {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      {!showForm ? (
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
          Start a catch-up group
        </button>
      ) : (
        <form onSubmit={submit} className="card space-y-4 p-5">
          <h2 className="text-base font-bold text-navy-900">New catch-up group</h2>

          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="ivClass">
              From
            </label>
            <select id="ivClass" className="select mt-1" value={classId} onChange={(e) => setClassId(e.target.value)}>
              <option value="">A whole grade</option>
              {myClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {!chosenClass ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-navy-500" htmlFor="ivGrade">
                  Grade
                </label>
                <select id="ivGrade" className="select mt-1" value={grade} onChange={(e) => setGrade(Number(e.target.value) as Grade)}>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-navy-500" htmlFor="ivSubject">
                  Subject
                </label>
                <select id="ivSubject" className="select mt-1" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="ivTopic">
              Topic the group needs help with
            </label>
            <select id="ivTopic" className="select mt-1" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              <option value="">Choose a topic…</option>
              {formTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="ivSource">
              Starting point from
            </label>
            <select id="ivSource" className="select mt-1" value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="practice">Their practice mastery on this topic</option>
              {diagnosticTests.map((t) => (
                <option key={t.id} value={t.id}>
                  Weekly test: {t.title} ({shortDate(t.due_at)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-xs font-medium text-navy-500">
              Learners ({picked.length} chosen) — those below {SUGGEST_BELOW}% are suggested
            </p>
            {pool.length === 0 ? (
              <p className="mt-1.5 text-sm text-navy-500">No learners in {chosenClass ? 'this class' : 'this grade and subject'} yet.</p>
            ) : (
              <div className="mt-1.5 max-h-64 space-y-1 overflow-y-auto rounded-lg border border-navy-200 p-2">
                {[...pool]
                  .sort((a, b) => (baselineOf(a.id) ?? 101) - (baselineOf(b.id) ?? 101))
                  .map((l) => {
                    const on = picked.includes(l.id)
                    const b = baselineOf(l.id)
                    return (
                      <label
                        key={l.id}
                        className={cn('flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm', on ? 'bg-gold-50' : 'hover:bg-navy-50')}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setPicked(on ? picked.filter((x) => x !== l.id) : [...picked, l.id])}
                          className="h-4 w-4 shrink-0 rounded border-navy-300"
                        />
                        <span className="flex-1 text-navy-800">{l.full_name}</span>
                        <span className={cn('text-xs tabular-nums', b !== null && b < SUGGEST_BELOW ? 'font-semibold text-rose-700' : 'text-navy-400')}>
                          {b === null ? 'no result' : `${b}%`}
                        </span>
                      </label>
                    )
                  })}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="ivPlan">
              Plan
            </label>
            <textarea
              id="ivPlan"
              rows={3}
              maxLength={2000}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="e.g. Two lunchtime sessions on reading payslips, then a short reassessment on Friday."
              className="input mt-1"
            />
            <p className="mt-1 text-xs text-navy-400">
              The learners in the group and their linked parents can read this, so write it for them.
            </p>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={busy} className="btn-primary flex-1">
              {busy ? 'Starting…' : 'Start the group'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setError('')
              }}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {running.length === 0 && closed.length === 0 ? (
        <EmptyState
          icon={<TargetIcon className="h-6 w-6" />}
          title="No catch-up groups yet"
          description="Start one from a topic your class is struggling with, or from a weekly test's results."
        />
      ) : null}

      {running.length ? (
        <section className="space-y-3">
          <h3 className="font-bold text-navy-900">Running</h3>
          {running.map(renderGroup)}
        </section>
      ) : null}

      {closed.length ? (
        <section className="space-y-3">
          <h3 className="font-bold text-navy-900">Finished</h3>
          {closed.map(renderGroup)}
        </section>
      ) : null}
    </div>
  )
}
