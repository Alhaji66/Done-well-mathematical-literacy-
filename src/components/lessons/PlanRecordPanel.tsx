import { useEffect, useState } from 'react'
import type { AccountProfile } from '@/context/AccountAuthContext'
import type { LessonPlanDoc } from '@/data/lessonPlans'
import {
  deleteRecord,
  fetchMyRecords,
  formatDay,
  saveRecord,
  STATUS_LABEL,
  type LessonPlanRecord,
  type RecordDraft,
} from '@/lib/lessonPlanRecords'
import { supabase } from '@/lib/supabaseClient'
import { cn } from '@/lib/utils'
import { subjects } from '@/data/subjects'
import type { Grade } from '@/types'

export const STATUS_BADGE: Record<LessonPlanRecord['status'], string> = {
  draft: 'badge-slate',
  submitted: 'badge-gold',
  signed: 'badge-green',
  returned: 'badge-red',
}

/** The name a record is listed under: the week and what was taught. */
export function recordTitle(plan: LessonPlanDoc): string {
  const when = plan.when === `Term ${plan.term}` ? `Term ${plan.term}` : `Term ${plan.term} · ${plan.when}`
  const what = plan.topicName && plan.topicName !== plan.label ? `${plan.label} — ${plan.topicName}` : plan.label
  return `${when} · ${what}`.slice(0, 200)
}

/**
 * Below the plan on a signed-in teacher's screen: record the week as taught --
 * the dates, how many of the planned lessons, and a short reflection -- and
 * submit it to the head of department to sign off. Not printed.
 *
 * Also lists the teacher's records for the year, so a returned one is easy to
 * find: opening one puts its week back on the screen.
 */
export function PlanRecordPanel(props: {
  profile: AccountProfile
  plan: LessonPlanDoc
  subjectId: string
  grade: Grade
  weekIndex: number
  weeksOverride: number | undefined
  lessonMinutes: number
  dates: string
  onOpen: (record: LessonPlanRecord) => void
}) {
  const { profile, plan, subjectId, grade, weekIndex, weeksOverride, lessonMinutes, dates, onOpen } = props
  const year = new Date().getFullYear()
  const [records, setRecords] = useState<LessonPlanRecord[] | null>(null)
  const [notSetUp, setNotSetUp] = useState(false)
  const [reviewer, setReviewer] = useState<string>('')
  const [form, setForm] = useState({ dates: '', taught: 0, reflection: '' })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    let live = true
    fetchMyRecords(profile.id).then(({ records: rows, notSetUp: missing }) => {
      if (!live) return
      setRecords(rows)
      setNotSetUp(missing)
    })
    return () => {
      live = false
    }
  }, [profile.id])

  const record = records?.find((r) => r.subject_id === subjectId && r.grade === grade && r.year === year && r.week_index === weekIndex)

  // Fill the form from the saved record, or start fresh for a week not yet recorded.
  useEffect(() => {
    setMessage(null)
    setForm(
      record
        ? { dates: record.dates, taught: record.lessons_taught, reflection: record.reflection }
        : { dates: '', taught: plan.lessons.length, reflection: '' },
    )
    // Only when the week, or the record's identity, changes -- not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.id, record?.updated_at, subjectId, grade, weekIndex, plan.lessons.length])

  useEffect(() => {
    setReviewer('')
    if (!record?.reviewed_by || !supabase) return
    let live = true
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', record.reviewed_by)
      .maybeSingle()
      .then(({ data }) => {
        if (live && data) setReviewer(data.full_name as string)
      })
    return () => {
      live = false
    }
  }, [record?.reviewed_by])

  if (records === null) return null
  if (notSetUp) {
    return (
      <p className="card p-4 text-sm text-navy-600">
        Recording weeks for sign-off needs STEP 20 of the database set-up. Ask whoever runs your school’s DONE WELL account to add it.
      </p>
    )
  }
  if (!profile.school_id) return null

  const locked = record?.status === 'signed'
  const mine = records.filter((r) => r.year === year)

  const save = async (status: 'draft' | 'submitted') => {
    setBusy(true)
    setMessage(null)
    const draft: RecordDraft = {
      subject_id: subjectId,
      grade,
      week_index: weekIndex,
      title: recordTitle(plan),
      term: plan.term,
      topic_id: plan.notes[0]?.topicId ?? null,
      weeks: weeksOverride ?? null,
      lesson_minutes: lessonMinutes,
      lessons_planned: plan.lessons.length,
      lessons_taught: form.taught,
      dates: form.dates.trim() || dates,
      reflection: form.reflection.trim(),
    }
    const { record: saved, error } = await saveRecord(record, draft, status, { teacherId: profile.id, schoolId: profile.school_id! })
    setBusy(false)
    if (error || !saved) {
      setMessage({ ok: false, text: `Not saved: ${error ?? 'unknown error'}` })
      return
    }
    setRecords((rs) => [saved, ...(rs ?? []).filter((r) => r.id !== saved.id)])
    setMessage({ ok: true, text: status === 'submitted' ? 'Submitted. Your head of department has been told.' : 'Saved as a draft. Only you can see it.' })
  }

  const remove = async () => {
    if (!record || !window.confirm('Delete this record of the week?')) return
    setBusy(true)
    const error = await deleteRecord(record.id)
    setBusy(false)
    if (error) {
      setMessage({ ok: false, text: `Not deleted: ${error}` })
      return
    }
    setRecords((rs) => (rs ?? []).filter((r) => r.id !== record.id))
  }

  return (
    <div className="card space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-navy-900">Record this week for sign-off</h3>
          <p className="text-xs text-navy-500">When you have taught it, note the dates and how it went, and submit it to your head of department.</p>
        </div>
        {record ? <span className={STATUS_BADGE[record.status]}>{STATUS_LABEL[record.status]}</span> : null}
      </div>

      {record?.status === 'returned' || (record?.status === 'signed' && record.review_comment) ? (
        <div
          className={cn(
            'rounded-lg p-3 text-sm',
            record.status === 'returned' ? 'bg-rose-50 text-rose-900' : 'bg-emerald-50 text-emerald-900',
          )}
        >
          <p className="font-semibold">
            {record.status === 'returned' ? 'Returned' : 'Signed off'} by {reviewer || 'your head of department'} on {formatDay(record.reviewed_at)}
          </p>
          {record.review_comment ? <p className="mt-0.5 whitespace-pre-line">{record.review_comment}</p> : null}
        </div>
      ) : record?.status === 'signed' ? (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
          Signed off by {reviewer || 'your head of department'} on {formatDay(record.reviewed_at)}.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="text-xs font-medium text-navy-500" htmlFor="rec-dates">
            Dates taught
          </label>
          <input
            id="rec-dates"
            className="input mt-1"
            value={form.dates}
            disabled={locked}
            maxLength={100}
            onChange={(e) => setForm((f) => ({ ...f, dates: e.target.value }))}
            placeholder={dates || 'e.g. 3 – 7 Feb'}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-navy-500" htmlFor="rec-taught">
            Lessons taught
          </label>
          <select
            id="rec-taught"
            className="select mt-1"
            value={form.taught}
            disabled={locked}
            onChange={(e) => setForm((f) => ({ ...f, taught: Number(e.target.value) }))}
          >
            {Array.from({ length: plan.lessons.length + 1 }, (_, n) => (
              <option key={n} value={n}>
                {n} of {plan.lessons.length}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-navy-500" htmlFor="rec-reflection">
          How did it go?
        </label>
        <textarea
          id="rec-reflection"
          className="input mt-1 min-h-[6rem]"
          value={form.reflection}
          disabled={locked}
          maxLength={2000}
          onChange={(e) => setForm((f) => ({ ...f, reflection: e.target.value }))}
          placeholder="What went well, what you would change, which learners need follow-up, and anything you did not get to."
        />
      </div>

      {locked ? null : (
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn-primary" disabled={busy} onClick={() => save('submitted')}>
            {record?.status === 'returned' ? 'Resubmit for sign-off' : record?.status === 'submitted' ? 'Update submission' : 'Submit for sign-off'}
          </button>
          <button type="button" className="btn-outline" disabled={busy} onClick={() => save('draft')}>
            {record?.status === 'submitted' ? 'Withdraw to draft' : 'Save draft'}
          </button>
          {record ? (
            <button type="button" className="ml-auto text-sm font-medium text-rose-700 hover:underline" disabled={busy} onClick={remove}>
              Delete
            </button>
          ) : null}
        </div>
      )}
      {message ? (
        <p role="status" className={cn('text-sm', message.ok ? 'text-emerald-700' : 'text-rose-700')}>
          {message.text}
        </p>
      ) : null}

      {mine.length ? (
        <details className="border-t border-navy-100 pt-3">
          <summary className="cursor-pointer text-sm font-semibold text-navy-800">Your recorded weeks this year ({mine.length})</summary>
          <ul className="mt-2 divide-y divide-navy-100">
            {mine.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm">
                <button type="button" className="min-w-0 flex-1 text-left text-navy-800 hover:underline" onClick={() => onOpen(r)}>
                  {subjects.find((x) => x.id === r.subject_id)?.name ?? r.subject_id} Grade {r.grade} · {r.title}
                </button>
                <span className={STATUS_BADGE[r.status]}>{STATUS_LABEL[r.status]}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}
