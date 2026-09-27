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
import { fetchDepartmentTeachers, fetchSchoolTeachers } from '@/lib/schoolStaff'
import { fetchClasses } from '@/lib/classes'
import { CELL_CLASS, CELL_LABEL, coverageFor, teachingWeeks, type CellState } from '@/lib/planCoverage'
import { STATUS_BADGE } from '@/components/lessons/PlanRecordPanel'
import { PlanCover } from '@/pages/teacher/LessonPlans'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { CalendarIcon, PrinterIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'
import type { Question } from '@/types'

type Tab = Exclude<RecordStatus, 'draft'> | 'coverage'
const TABS: { id: Tab; label: string }[] = [
  { id: 'submitted', label: 'Waiting' },
  { id: 'returned', label: 'Returned' },
  { id: 'signed', label: 'Signed off' },
  { id: 'coverage', label: 'Coverage' },
]

const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id

/** A teacher in the department, with the grades they teach each subject in. */
export interface PlanStaff {
  id: string
  name: string
  /** Subject id to the grades taught in it. */
  teaches: Record<string, number[]>
}

/** Sign off or return a record; resolves to an error message, or undefined on success. */
export type ReviewFn = (record: LessonPlanRecord, sign: boolean, comment: string) => Promise<string | undefined>

/**
 * The head of department's sign-off on the weeks their teachers recorded.
 *
 * A teacher records a week they taught from a lesson plan -- dates, lessons
 * taught, a reflection -- and submits it. Here the HOD reads it next to the
 * plan it was taught from (rebuilt from the same choices), and signs it off
 * or returns it saying what to change. The signed list prints as a register
 * for the department file, and Coverage shows, teacher by teacher, which ATP
 * weeks have been recorded and which are overdue. A principal sees every
 * subject; an HOD their own.
 */
export function PlanSignoff() {
  const { profile } = useAccountAuth()
  const scope = scopeSubjectFor(profile)
  const [records, setRecords] = useState<LessonPlanRecord[] | null>(null)
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const [staff, setStaff] = useState<PlanStaff[]>([])
  const [notSetUp, setNotSetUp] = useState(false)

  useEffect(() => {
    if (!profile?.school_id) return
    const school = profile.school_id
    let live = true
    Promise.all([
      fetchRecordsForReview(school, scope),
      scope ? fetchDepartmentTeachers(school, scope) : fetchSchoolTeachers(school),
      fetchClasses(school),
    ]).then(([r, teachers, { classes }]) => {
      if (!live) return
      setRecords(r.records)
      setNames(r.names)
      setNotSetUp(r.notSetUp)
      // What each teacher teaches comes from their classes, plus any grade they
      // have already recorded a week in -- a teacher whose classes are not set
      // up yet still shows for the weeks they have sent in.
      const byId = new Map<string, PlanStaff>()
      const add = (id: string, subject: string, grade: number) => {
        if (scope && subject !== scope) return
        const t = byId.get(id) ?? { id, name: r.names.get(id) ?? 'A teacher', teaches: {} }
        const grades = new Set(t.teaches[subject] ?? [])
        grades.add(grade)
        t.teaches[subject] = [...grades].sort((a, b) => a - b)
        byId.set(id, t)
      }
      for (const t of teachers) byId.set(t.id, byId.get(t.id) ?? { id: t.id, name: t.full_name, teaches: {} })
      for (const c of classes) if (c.teacher_id) add(c.teacher_id, c.subject_id, c.grade)
      for (const rec of r.records) add(rec.teacher_id, rec.subject_id, rec.grade)
      setStaff([...byId.values()].sort((a, b) => a.name.localeCompare(b.name)))
    })
    return () => {
      live = false
    }
  }, [profile?.school_id, scope])

  if (!profile) return null
  return (
    <PlanSignoffView
      scope={scope}
      records={records}
      setRecords={setRecords}
      names={names}
      staff={staff}
      selfId={profile.id}
      notSetUp={notSetUp}
      review={(r, sign, comment) => reviewRecord(r.id, sign, comment)}
    />
  )
}

/** The page itself, shared by the real account and the demo, which differ only in where records come from. */
export function PlanSignoffView(props: {
  scope: string | null
  records: LessonPlanRecord[] | null
  setRecords: (update: (rs: LessonPlanRecord[] | null) => LessonPlanRecord[] | null) => void
  names: Map<string, string>
  staff: PlanStaff[]
  selfId: string
  notSetUp: boolean
  review: ReviewFn
  /** Shown above the page, e.g. to say the demo's records are samples. */
  banner?: string
  /** The date to judge "overdue" by. Defaults to today. */
  today?: Date
}) {
  const { scope, records, setRecords, names, staff, selfId, notSetUp, review, banner } = props
  const [tab, setTab] = useState<Tab>('submitted')
  const [grade, setGrade] = useState<'all' | number>('all')
  const [teacher, setTeacher] = useState('all')

  const teachers = useMemo(() => [...new Set((records ?? []).map((r) => r.teacher_id))], [records])
  const shown = (records ?? []).filter(
    (r) => r.status === tab && (grade === 'all' || r.grade === grade) && (teacher === 'all' || r.teacher_id === teacher),
  )
  const count = (t: Tab) => (records ?? []).filter((r) => r.status === t).length
  const replace = (r: LessonPlanRecord) => setRecords((rs) => (rs ?? []).map((x) => (x.id === r.id ? r : x)))

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Lesson plans"
        title="Plan sign-off"
        description={`Weeks your ${scope ? `${subjectName(scope)} ` : ''}teachers have taught and recorded. Read each one next to the plan it was taught from, then sign it off or return it saying what to change. Coverage shows which weeks of the ATP each teacher has recorded.`}
      />
      {banner ? <p className="rounded-lg bg-gold-50 p-3 text-sm text-gold-900">{banner}</p> : null}

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
            <div className="flex flex-wrap rounded-lg border border-navy-200 bg-white p-1" role="group" aria-label="Which records">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', tab === t.id ? 'bg-navy-900 text-white' : 'text-navy-600')}
                >
                  {t.label} {t.id === 'coverage' ? null : <span className="tabular-nums opacity-70">{count(t.id)}</span>}
                </button>
              ))}
            </div>
            {tab === 'coverage' ? null : (
              <>
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
              </>
            )}
            {tab === 'signed' && shown.length ? (
              <button type="button" onClick={() => window.print()} className="btn-primary ml-auto inline-flex items-center gap-2">
                <PrinterIcon className="h-4 w-4" /> Print register
              </button>
            ) : null}
          </div>

          {tab === 'coverage' ? (
            <Coverage scope={scope} records={records} staff={staff} today={props.today ?? new Date()} />
          ) : shown.length === 0 ? (
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
                <RecordCard key={r.id} record={r} names={names} selfId={selfId} review={review} onReviewed={replace} />
              ))}
            </div>
          )}

          {tab === 'signed' && shown.length ? <Register records={shown} names={names} scope={scope} /> : null}
        </>
      )}
    </div>
  )
}

const LEGEND: CellState[] = ['signed', 'submitted', 'returned', 'overdue', 'due', 'upcoming']

/**
 * Teacher by teacher, which weeks of the ATP have been recorded. The summary
 * counts only the weeks already due; the table shows the whole year, so the
 * HOD can see what is coming as well as what is late.
 */
function Coverage({ scope, records, staff, today }: { scope: string | null; records: LessonPlanRecord[]; staff: PlanStaff[]; today: Date }) {
  const year = today.getFullYear()
  const subjectOptions = scope
    ? [scope]
    : subjects.map((s) => s.id).filter((id) => staff.some((t) => t.teaches[id]?.length) && [10, 11, 12].some((g) => atpFor(id, g)))
  const [subjectId, setSubjectId] = useState(subjectOptions[0] ?? '')
  const [grade, setGrade] = useState(() => {
    const first = [10, 11, 12].find((g) => staff.some((t) => t.teaches[subjectOptions[0] ?? '']?.includes(g)))
    return first ?? 12
  })

  const weeks = useMemo(() => teachingWeeks(subjectId, grade, year), [subjectId, grade, year])
  const teaching = staff.filter((t) => t.teaches[subjectId]?.includes(grade))
  const unplaced = staff.filter((t) => !Object.values(t.teaches).some((g) => g.length))
  const rows = teaching.map((t) => ({ t, ...coverageFor(weeks, records, t.id, subjectId, grade, year, today) }))

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-end gap-3 p-4">
        {scope ? null : (
          <select className="select w-auto" aria-label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            {subjectOptions.map((id) => (
              <option key={id} value={id}>
                {subjectName(id)}
              </option>
            ))}
          </select>
        )}
        <select className="select w-auto" aria-label="Grade" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
          {[10, 11, 12].map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
        {rows.length ? (
          <button type="button" onClick={() => window.print()} className="btn-outline ml-auto inline-flex items-center gap-2">
            <PrinterIcon className="h-4 w-4" /> Print coverage
          </button>
        ) : null}
      </div>

      {!subjectId || !weeks.length ? (
        <EmptyState icon={<CalendarIcon className="h-6 w-6" />} title="No teaching plan" description="There is no teaching plan for this subject and grade yet." />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="h-6 w-6" />}
          title={`Nobody is teaching Grade ${grade} ${subjectName(subjectId)} yet`}
          description="A teacher appears here once they have a class in this subject and grade, or have recorded a week for it."
        />
      ) : (
        <div className="print-area card space-y-4 p-4">
          <div className="hidden print:block">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">DONE WELL® ATP coverage</p>
            <h2 className="text-lg font-bold text-navy-900">
              {subjectName(subjectId)} Grade {grade} — lesson plans recorded, as at {formatDay(today.toISOString())}
            </h2>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {rows.map(({ t, tally }) => {
              const pct = (n: number) => (tally.due ? (n / tally.due) * 100 : 0)
              return (
                <li key={t.id} className="rounded-lg border border-navy-100 p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-navy-900">{t.name}</p>
                    <p className="text-xs tabular-nums text-navy-500">
                      {tally.signed} of {tally.due} due weeks signed off
                    </p>
                  </div>
                  <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-navy-100" aria-hidden>
                    <span className="bg-emerald-500" style={{ width: `${pct(tally.signed)}%` }} />
                    <span className="bg-gold-400" style={{ width: `${pct(tally.submitted)}%` }} />
                    <span className="bg-rose-300" style={{ width: `${pct(tally.returned)}%` }} />
                    <span className="bg-rose-600" style={{ width: `${pct(tally.overdue)}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs text-navy-600">
                    {tally.submitted ? `${tally.submitted} waiting · ` : ''}
                    {tally.returned ? `${tally.returned} returned · ` : ''}
                    {tally.overdue ? <span className="font-semibold text-rose-700">{tally.overdue} not submitted</span> : 'Nothing overdue'}
                  </p>
                </li>
              )
            })}
          </ul>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-navy-600">
            {LEGEND.map((s) => (
              <span key={s} className="inline-flex items-center gap-1">
                <span className={cn('inline-block h-3 w-3 rounded-sm border border-navy-200', CELL_CLASS[s])} /> {CELL_LABEL[s]}
              </span>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="text-left text-navy-500">
                  <th className="border-b border-navy-200 py-1.5 pr-2 font-semibold">Week and topic</th>
                  {rows.map(({ t }) => (
                    <th key={t.id} className="border-b border-navy-200 px-1 py-1.5 text-center font-semibold">
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((w, i) => (
                  <tr key={w.index} className="align-top">
                    <td className="border-b border-navy-100 py-1.5 pr-2">
                      <span className="block text-navy-900">{w.label}</span>
                      <span className="block text-navy-500">
                        Term {w.term} · {w.dates ?? `Week ${w.weeks}`}
                      </span>
                    </td>
                    {rows.map(({ t, states }) => (
                      <td key={t.id} className="whitespace-nowrap border-b border-navy-100 px-1 py-1 text-center">
                        <span className={cn('inline-block rounded px-1.5 py-0.5 font-semibold', CELL_CLASS[states[i]])}>
                          {states[i] === 'upcoming' ? '·' : CELL_LABEL[states[i]]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {unplaced.length ? (
        <p className="text-xs text-navy-500">
          Not shown, because no class or record says what they teach yet: {unplaced.map((t) => t.name).join(', ')}. Add their classes under Classes and
          they will appear here.
        </p>
      ) : null}
    </div>
  )
}

function RecordCard({
  record: r,
  names,
  selfId,
  review: reviewFn,
  onReviewed,
}: {
  record: LessonPlanRecord
  names: Map<string, string>
  selfId: string
  review: ReviewFn
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
    const failed = await reviewFn(r, sign, comment)
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
