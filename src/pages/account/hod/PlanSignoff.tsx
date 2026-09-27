import { useEffect, useMemo, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { scopeSubjectFor } from '@/lib/teacherScope'
import { subjects } from '@/data/subjects'
import { atpFor } from '@/data/atp'
import { questionsForSubject } from '@/data/questionBank'
import { buildLessonPlan, type LessonLength } from '@/data/lessonPlans'
import {
  fetchRecordsForReview,
  formatDay,
  reviewRecord,
  STATUS_LABEL,
  type LessonPlanRecord,
  type RecordStatus,
} from '@/lib/lessonPlanRecords'
import { STATUS_BADGE } from '@/components/lessons/PlanRecordPanel'
import { PlanCover } from '@/pages/teacher/LessonPlans'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { CalendarIcon, PrinterIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { Question } from '@/types'

type Tab = Exclude<RecordStatus, 'draft'>
const TABS: { id: Tab; label: string }[] = [
  { id: 'submitted', label: 'Waiting' },
  { id: 'returned', label: 'Returned' },
  { id: 'signed', label: 'Signed off' },
]

const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id

/**
 * The head of department's sign-off on the weeks their teachers recorded.
 *
 * A teacher records a week they taught from a lesson plan -- dates, lessons
 * taught, a reflection -- and submits it. Here the HOD reads it next to the
 * plan it was taught from (rebuilt from the same choices), and signs it off
 * or returns it saying what to change. The signed list prints as a register
 * for the department file. A principal sees every subject; an HOD their own.
 */
export function PlanSignoff() {
  const { profile } = useAccountAuth()
  const scope = scopeSubjectFor(profile)
  const [records, setRecords] = useState<LessonPlanRecord[] | null>(null)
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const [notSetUp, setNotSetUp] = useState(false)
  const [tab, setTab] = useState<Tab>('submitted')
  const [grade, setGrade] = useState<'all' | number>('all')
  const [teacher, setTeacher] = useState('all')

  useEffect(() => {
    if (!profile?.school_id) return
    let live = true
    fetchRecordsForReview(profile.school_id, scope).then((r) => {
      if (!live) return
      setRecords(r.records)
      setNames(r.names)
      setNotSetUp(r.notSetUp)
    })
    return () => {
      live = false
    }
  }, [profile?.school_id, scope])

  const teachers = useMemo(() => [...new Set((records ?? []).map((r) => r.teacher_id))], [records])
  const shown = (records ?? []).filter(
    (r) => r.status === tab && (grade === 'all' || r.grade === grade) && (teacher === 'all' || r.teacher_id === teacher),
  )
  const count = (t: Tab) => (records ?? []).filter((r) => r.status === t).length

  if (!profile) return null

  const replace = (r: LessonPlanRecord) => setRecords((rs) => (rs ?? []).map((x) => (x.id === r.id ? r : x)))

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Lesson plans"
        title="Plan sign-off"
        description={`Weeks your ${scope ? `${subjectName(scope)} ` : ''}teachers have taught and recorded. Read each one next to the plan it was taught from, then sign it off or return it saying what to change.`}
      />

      {records === null ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : notSetUp ? (
        <EmptyState
          icon={<CalendarIcon className="h-6 w-6" />}
          title="Not set up yet"
          description="Plan sign-off needs STEP 20 of the database set-up. Ask whoever runs your school’s DONE WELL account to add it."
        />
      ) : (
        <>
          <div className="card flex flex-wrap items-end gap-3 p-4">
            <div className="flex rounded-lg border border-navy-200 bg-white p-1" role="group" aria-label="Which records">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', tab === t.id ? 'bg-navy-900 text-white' : 'text-navy-600')}
                >
                  {t.label} <span className="tabular-nums opacity-70">{count(t.id)}</span>
                </button>
              ))}
            </div>
            <select className="select w-auto" aria-label="Grade" value={String(grade)} onChange={(e) => setGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
              <option value="all">All grades</option>
              {[10, 11, 12].map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
            <select className="select w-auto" aria-label="Teacher" value={teacher} onChange={(e) => setTeacher(e.target.value)}>
              <option value="all">All teachers</option>
              {teachers.map((id) => (
                <option key={id} value={id}>
                  {names.get(id) ?? 'A departed teacher'}
                </option>
              ))}
            </select>
            {tab === 'signed' && shown.length ? (
              <button type="button" onClick={() => window.print()} className="btn-primary ml-auto inline-flex items-center gap-2">
                <PrinterIcon className="h-4 w-4" /> Print register
              </button>
            ) : null}
          </div>

          {shown.length === 0 ? (
            <EmptyState
              icon={<CalendarIcon className="h-6 w-6" />}
              title={tab === 'submitted' ? 'Nothing waiting for you' : tab === 'returned' ? 'Nothing returned' : 'Nothing signed off yet'}
              description={
                tab === 'submitted'
                  ? 'When a teacher records a week they taught and submits it, it appears here and you are notified.'
                  : 'Records move here as you review them.'
              }
            />
          ) : (
            <div className="space-y-4">
              {shown.map((r) => (
                <RecordCard key={r.id} record={r} names={names} selfId={profile.id} onReviewed={replace} />
              ))}
            </div>
          )}

          {tab === 'signed' && shown.length ? <Register records={shown} names={names} scope={scope} /> : null}
        </>
      )}
    </div>
  )
}

function RecordCard({
  record: r,
  names,
  selfId,
  onReviewed,
}: {
  record: LessonPlanRecord
  names: Map<string, string>
  selfId: string
  onReviewed: (r: LessonPlanRecord) => void
}) {
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [showPlan, setShowPlan] = useState(false)
  const own = r.teacher_id === selfId

  const review = async (sign: boolean) => {
    if (!sign && !comment.trim()) {
      setError('Say what to change before returning it.')
      return
    }
    setBusy(true)
    setError('')
    const failed = await reviewRecord(r.id, sign, comment)
    setBusy(false)
    if (failed) {
      setError(failed)
      return
    }
    onReviewed({
      ...r,
      status: sign ? 'signed' : 'returned',
      review_comment: comment.trim(),
      reviewed_by: selfId,
      reviewed_at: new Date().toISOString(),
    })
  }

  return (
    <article className="card space-y-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
            {subjectName(r.subject_id)} · Grade {r.grade}
          </p>
          <h3 className="font-bold text-navy-900 [text-wrap:balance]">{r.title}</h3>
          <p className="text-xs text-navy-500">
            {names.get(r.teacher_id) ?? 'A departed teacher'} · submitted {formatDay(r.submitted_at)}
          </p>
        </div>
        <span className={STATUS_BADGE[r.status]}>{r.status === 'returned' ? 'Returned' : STATUS_LABEL[r.status]}</span>
      </div>

      <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <div>
          <dt className="inline text-navy-500">Dates taught: </dt>
          <dd className="inline text-navy-900">{r.dates || '—'}</dd>
        </div>
        <div>
          <dt className="inline text-navy-500">Lessons taught: </dt>
          <dd className={cn('inline tabular-nums', r.lessons_taught < r.lessons_planned ? 'font-semibold text-rose-700' : 'text-navy-900')}>
            {r.lessons_taught} of {r.lessons_planned}
          </dd>
        </div>
      </dl>
      <div className="rounded-lg bg-navy-50 p-3 text-sm text-navy-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Teacher’s reflection</p>
        <p className="mt-1 whitespace-pre-line">{r.reflection || 'No reflection written.'}</p>
      </div>

      <button type="button" className="text-sm font-semibold text-navy-700 hover:underline" onClick={() => setShowPlan((v) => !v)}>
        {showPlan ? 'Hide the plan' : 'Show the plan it was taught from'}
      </button>
      {showPlan ? <RecordPlan record={r} /> : null}

      {r.status === 'submitted' ? (
        own ? (
          <p className="text-sm text-navy-500">This is your own record. Another head of department or the principal signs it off.</p>
        ) : (
          <div className="space-y-2 border-t border-navy-100 pt-3">
            <label className="text-xs font-medium text-navy-500" htmlFor={`c-${r.id}`}>
              Comment for the teacher
            </label>
            <textarea
              id={`c-${r.id}`}
              className="input min-h-[4.5rem]"
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional when signing off. Needed when returning: say what to change."
            />
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primary" disabled={busy} onClick={() => review(true)}>
                Sign off
              </button>
              <button type="button" className="btn-outline" disabled={busy} onClick={() => review(false)}>
                Return to teacher
              </button>
            </div>
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          </div>
        )
      ) : (
        <p className="border-t border-navy-100 pt-3 text-sm text-navy-700">
          <span className="font-semibold">
            {r.status === 'signed' ? 'Signed off' : 'Returned'} by {names.get(r.reviewed_by ?? '') ?? 'a reviewer'} on {formatDay(r.reviewed_at)}.
          </span>
          {r.review_comment ? <span className="block whitespace-pre-line">{r.review_comment}</span> : null}
        </p>
      )}
    </article>
  )
}

/** The plan the teacher taught from, rebuilt from the choices they saved. */
function RecordPlan({ record: r }: { record: LessonPlanRecord }) {
  const [questions, setQuestions] = useState<Question[] | null>(null)
  useEffect(() => {
    let live = true
    questionsForSubject(r.subject_id).then((qs) => live && setQuestions(qs))
    return () => {
      live = false
    }
  }, [r.subject_id])

  const atp = atpFor(r.subject_id, r.grade)
  const plan = useMemo(
    () =>
      atp && questions && atp.weeks[r.week_index]
        ? buildLessonPlan({
            atp,
            weekIndex: r.week_index,
            grade: r.grade,
            questions,
            lessonMinutes: r.lesson_minutes as LessonLength,
            weeksOverride: r.weeks ?? undefined,
          })
        : undefined,
    [atp, questions, r],
  )

  if (!questions) return <p className="text-sm text-navy-500">Loading the plan…</p>
  if (!plan) return <p className="text-sm text-navy-500">This week is no longer in the teaching plan, so the plan cannot be shown.</p>
  return (
    <div className="rounded-lg border border-navy-100 p-4">
      <PlanCover plan={{ ...plan, when: r.dates || plan.when }} lessons={plan.lessons} />
    </div>
  )
}

/** The signed records as one table, for the department file. Printed only. */
function Register({ records, names, scope }: { records: LessonPlanRecord[]; names: Map<string, string>; scope: string | null }) {
  const sorted = [...records].sort((a, b) => a.grade - b.grade || a.week_index - b.week_index)
  return (
    <div className="hidden print:block">
      <div className="print-area">
        <div className="border-b-2 border-navy-900 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">DONE WELL® Record of teaching</p>
          <h2 className="mt-1 text-lg font-bold text-navy-900">
            {scope ? subjectName(scope) : 'All subjects'} — lesson plans signed off, {new Date().getFullYear()}
          </h2>
        </div>
        <table className="mt-3 w-full border-collapse text-xs">
          <thead>
            <tr className="text-left">
              {['Grade', 'Week and topic', 'Teacher', 'Dates taught', 'Lessons', 'Signed off'].map((h) => (
                <th key={h} className="border border-navy-300 px-1.5 py-1">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="border border-navy-200 px-1.5 py-1">
                  {scope ? '' : `${subjectName(r.subject_id)} `}
                  {r.grade}
                </td>
                <td className="border border-navy-200 px-1.5 py-1">{r.title}</td>
                <td className="border border-navy-200 px-1.5 py-1">{names.get(r.teacher_id) ?? '—'}</td>
                <td className="border border-navy-200 px-1.5 py-1">{r.dates}</td>
                <td className="border border-navy-200 px-1.5 py-1 tabular-nums">
                  {r.lessons_taught}/{r.lessons_planned}
                </td>
                <td className="border border-navy-200 px-1.5 py-1">
                  {names.get(r.reviewed_by ?? '') ?? '—'}, {formatDay(r.reviewed_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-navy-600">Head of department: ______________________ · Signature: ______________ · Date: ______________</p>
      </div>
    </div>
  )
}
