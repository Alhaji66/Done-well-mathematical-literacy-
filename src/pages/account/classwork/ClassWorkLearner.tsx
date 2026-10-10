import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { RouteLoading } from '@/components/layout/RouteLoading'
import { UploadIcon } from '@/components/ui/Icons'
import { WorkFiles } from '@/components/classwork/WorkFiles'
import { getSubject } from '@/data/subjects'
import { LEVEL_NAMES, levelOf } from '@/lib/levels'
import { timeLeft } from '@/lib/paperAttempts'
import {
  OVERALL,
  fetchClassWork,
  fetchMySubmissions,
  fetchWork,
  filePath,
  handIn,
  letter,
  memoIsOpen,
  removeFile,
  saveAnswers,
  startWork,
  uploadFile,
  type ClassWork,
  type Submission,
  type WorkMemo,
} from '@/lib/classWork'
import { cn } from '@/lib/utils'

/**
 * Class work, for learners (STEP 42): the work their teachers set, written in
 * the app or on paper and handed in as photos. The memo opens at the due date.
 */
export function ClassWorkLearner() {
  const { id } = useParams()
  return id ? <WorkPage id={id} /> : <WorkList />
}

const when = (iso: string) => new Date(iso).toLocaleString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

function statusOf(w: ClassWork, s: Submission | undefined, now = Date.now()) {
  if (s?.status === 'marked') return { text: `Marked: ${Math.round(s.percent ?? 0)}%`, tone: 'bg-emerald-50 text-emerald-800' }
  if (s?.submitted_at) return { text: 'Handed in', tone: 'bg-navy-100 text-navy-700' }
  if (new Date(w.due_at).getTime() <= now || (s && new Date(s.deadline).getTime() <= now)) return { text: 'Closed', tone: 'bg-rose-50 text-rose-700' }
  if (s) return { text: 'Started: hand it in', tone: 'bg-gold-50 text-gold-800' }
  return { text: `Due ${when(w.due_at)}`, tone: 'bg-gold-50 text-gold-800' }
}

function WorkList() {
  const [rows, setRows] = useState<ClassWork[] | null>(null)
  const [subs, setSubs] = useState<Map<string, Submission>>(new Map())

  useEffect(() => {
    Promise.all([fetchClassWork(), fetchMySubmissions()]).then(([w, s]) => {
      setRows(w.rows)
      setSubs(new Map(s.map((x) => [x.work_id, x])))
    })
  }, [])

  if (!rows) return <RouteLoading />
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Class work" title="Work from your teachers" description="Open it, write it, and hand it in before the due date. The memo opens at the due date." />
      {rows.length === 0 ? (
        <EmptyState icon={<UploadIcon className="h-6 w-6" />} title="No class work yet" description="When a teacher sets work for your class, it appears here and you get a notification." />
      ) : (
        <ul className="space-y-3">
          {rows.map((w) => {
            const st = statusOf(w, subs.get(w.id))
            return (
              <li key={w.id}>
                <Link to={w.id} className="card block p-4 transition hover:border-navy-300">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-navy-900">{w.title}</p>
                      <p className="text-xs text-navy-500">
                        {getSubject(w.subject_id)?.name} · {w.total_marks} marks{w.minutes ? ` · ${w.minutes} minutes` : ''}
                      </p>
                    </div>
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', st.tone)}>{st.text}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const SAVE_DELAY = 1500

function WorkPage({ id }: { id: string }) {
  const { profile } = useAccountAuth()
  const [work, setWork] = useState<ClassWork | null | undefined>(undefined)
  const [memo, setMemo] = useState<WorkMemo | null>(null)
  const [sub, setSub] = useState<Submission | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<string[]>([])
  const [saved, setSaved] = useState<'' | 'saving' | 'saved' | 'failed'>('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [now, setNow] = useState(Date.now())
  const timer = useRef<number | null>(null)
  const latest = useRef({ answers, files })
  latest.current = { answers, files }

  const load = useCallback(async () => {
    const [{ work: w, memo: m }, mine] = await Promise.all([fetchWork(id), fetchMySubmissions()])
    setWork(w)
    setMemo(m)
    const s = mine.find((x) => x.work_id === id) ?? null
    setSub(s)
    if (s) {
      setAnswers(s.answers)
      setFiles(s.files)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const writing = Boolean(sub && !sub.submitted_at && new Date(sub.deadline).getTime() > now)

  const flush = useCallback(async () => {
    if (!sub) return
    setSaved('saving')
    setSaved((await saveAnswers(sub.id, latest.current.answers, latest.current.files)) ? 'saved' : 'failed')
  }, [sub])

  const queueSave = () => {
    setSaved('saving')
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => void flush(), SAVE_DELAY)
  }

  const submit = useCallback(
    async (auto: boolean) => {
      if (!sub) return
      if (!auto && !window.confirm('Hand in your work? You cannot change it after this.')) return
      setBusy(true)
      if (timer.current) window.clearTimeout(timer.current)
      const done = await handIn(sub.id, latest.current.answers, latest.current.files)
      setBusy(false)
      if (!done) return setError('Your work could not be handed in. Check your connection and try again.')
      setSub(done)
      void load()
    },
    [sub, load],
  )

  // Time up while writing: hand in what is here, once. (Unsent, the database
  // still closes it at the deadline with what was saved.)
  const autoTried = useRef(false)
  useEffect(() => {
    if (sub && !sub.submitted_at && new Date(sub.deadline).getTime() <= now && !busy && !autoTried.current) {
      autoTried.current = true
      void submit(true)
    }
  }, [now, sub, busy, submit])

  if (work === undefined) return <RouteLoading />
  if (!work) return <p className="text-sm text-navy-600">This work could not be found. It may have been removed by your teacher.</p>

  const open = memoIsOpen(work, now)
  const closedUnstarted = !sub && new Date(work.due_at).getTime() <= now
  const marked = sub?.status === 'marked'

  const begin = async () => {
    setBusy(true)
    setError('')
    const r = await startWork(work.id)
    setBusy(false)
    if (r.error) return setError(r.error.includes('closed') ? 'This work has closed.' : 'The work could not be opened. Check your connection and try again.')
    setSub(r.submission!)
    setAnswers(r.submission!.answers)
    setFiles(r.submission!.files)
  }

  const addPhotos = async (list: File[]) => {
    if (!sub || !profile?.school_id) return
    setBusy(true)
    setError('')
    const next = [...latest.current.files]
    for (const f of list) {
      if (next.length >= 10) {
        setError('You can hand in at most 10 files.')
        break
      }
      const r = await uploadFile(filePath(sub.school_id, work.id, `answers/${sub.learner_id}`, f), f)
      if (r.error) {
        setError(r.error)
        break
      }
      next.push(r.path!)
    }
    setFiles(next)
    latest.current.files = next
    setBusy(false)
    await flush()
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow={`Class work · ${getSubject(work.subject_id)?.name ?? ''}`}
        title={work.title}
        description={`${work.total_marks} marks · due ${when(work.due_at)}${work.minutes ? ` · ${work.minutes} minutes once you start` : ''}`}
      />

      {writing ? (
        <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-navy-200 bg-white/95 p-3 shadow-sm backdrop-blur">
          <span className="text-xs text-navy-600">
            <b className="font-mono text-xl tabular-nums text-navy-900">{timeLeft(sub!.deadline, now)}</b> left
            {saved === 'saving' ? ' · saving…' : saved === 'saved' ? ' · saved' : saved === 'failed' ? ' · not saved: check your connection' : ''}
          </span>
          <button type="button" disabled={busy} className="btn-primary btn-sm" onClick={() => void submit(false)}>
            Hand in
          </button>
        </div>
      ) : null}
      {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      {work.instructions ? <p className="card whitespace-pre-wrap p-4 text-sm text-navy-800">{work.instructions}</p> : null}

      {!sub && !closedUnstarted ? (
        <div className="card space-y-3 p-5">
          <p className="text-sm text-navy-700">
            {work.minutes
              ? `You have ${work.minutes} minutes from when you start, and it must be in by ${when(work.due_at)}. The clock keeps running if you close the app.`
              : `Hand it in by ${when(work.due_at)}. Your answers are saved as you go.`}
          </p>
          <button type="button" disabled={busy} className="btn-primary" onClick={() => void begin()}>
            Start
          </button>
        </div>
      ) : null}
      {closedUnstarted ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">This work closed on {when(work.due_at)} and you did not hand it in.</p> : null}

      {sub ? (
        <>
          {work.paper_files.length ? (
            <div className="card space-y-3 p-5">
              <h3 className="text-base font-bold text-navy-900">Question paper</h3>
              <WorkFiles paths={work.paper_files} />
            </div>
          ) : null}

          {work.items.length ? (
            <div className="card space-y-4 p-5">
              <h3 className="text-base font-bold text-navy-900">Questions</h3>
              {work.items.map((it) => {
                const m = sub.marking[it.id]
                const memoLine = open && memo ? (it.kind === 'mcq' ? memo.answers[it.id]?.correct : memo.answers[it.id]?.answer) : undefined
                return (
                  <div key={it.id} className="space-y-2 border-b border-navy-100 pb-4 last:border-0">
                    <p className="whitespace-pre-wrap text-sm font-medium text-navy-900">
                      {it.label} {it.prompt} <span className="text-navy-500">({it.marks})</span>
                    </p>
                    {it.kind === 'mcq' ? (
                      <div className="space-y-1">
                        {(it.options ?? []).map((o, k) => (
                          <label key={k} className="flex items-center gap-2 text-sm text-navy-800">
                            <input
                              type="radio"
                              name={it.id}
                              disabled={!writing}
                              checked={answers[it.id] === letter(k)}
                              onChange={() => (setAnswers((a) => ({ ...a, [it.id]: letter(k) })), queueSave())}
                            />
                            <b className="w-5">{letter(k)}</b> {o}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        className="input min-h-[5rem]"
                        disabled={!writing}
                        value={answers[it.id] ?? ''}
                        onChange={(e) => (setAnswers((a) => ({ ...a, [it.id]: e.target.value })), queueSave())}
                        placeholder={writing ? 'Your answer, with your working' : ''}
                      />
                    )}
                    {marked && m ? (
                      <p className="text-sm font-semibold text-navy-800">
                        {m.awarded} / {it.marks}
                        {m.feedback ? <span className="font-normal text-navy-600"> · {m.feedback}</span> : null}
                      </p>
                    ) : null}
                    {memoLine ? (
                      <p className="whitespace-pre-wrap rounded bg-emerald-50 p-2 text-sm text-emerald-900">
                        <b>Memo:</b> {memoLine}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : null}

          <div className="card space-y-3 p-5">
            <h3 className="text-base font-bold text-navy-900">Your written work</h3>
            <p className="text-sm text-navy-600">
              {writing ? 'Write on paper, then photograph each page clearly, in order. You can add up to 10 photos or PDFs.' : files.length ? 'What you handed in:' : 'No photos were handed in.'}
            </p>
            <WorkFiles
              paths={files}
              onRemove={
                writing
                  ? (p) => {
                      const next = files.filter((x) => x !== p)
                      setFiles(next)
                      latest.current.files = next
                      void removeFile(p).then(() => flush())
                    }
                  : undefined
              }
            />
            {writing ? (
              <label className="btn-outline cursor-pointer">
                <UploadIcon className="h-4 w-4" /> {busy ? 'Uploading…' : 'Add photos of my work'}
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  capture="environment"
                  className="sr-only"
                  disabled={busy}
                  onChange={(e) => {
                    const list = [...(e.target.files ?? [])]
                    e.target.value = ''
                    void addPhotos(list)
                  }}
                />
              </label>
            ) : null}
          </div>

          {sub.submitted_at ? (
            <div className={cn('card space-y-2 p-5', marked && 'border-emerald-200')}>
              {marked ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Your mark</p>
                  <p className="text-3xl font-extrabold tabular-nums text-navy-900">
                    {sub.marks_awarded} / {sub.marks_total} <span className="text-xl text-navy-500">({Math.round(sub.percent ?? 0)}%)</span>
                  </p>
                  <p className="text-sm font-semibold text-navy-700">
                    Level {levelOf(sub.percent ?? 0)}: {LEVEL_NAMES[levelOf(sub.percent ?? 0)]}
                  </p>
                  {sub.marking[OVERALL] && work.items.length ? <p className="text-sm text-navy-700">Uploaded paper: {sub.marking[OVERALL].awarded} marks</p> : null}
                  {sub.comment ? <p className="whitespace-pre-wrap rounded bg-navy-50 p-3 text-sm text-navy-800">Your teacher: {sub.comment}</p> : null}
                </>
              ) : (
                <p className="text-sm text-navy-700">
                  <b>Handed in</b> {when(sub.submitted_at)}. Your teacher will mark it{work.items.some((i) => i.kind === 'written') || work.paper_files.length ? '' : ' soon'}; you will get a notification.
                </p>
              )}
            </div>
          ) : null}

          {sub.submitted_at || !writing ? (
            open ? (
              <div className="card space-y-3 p-5">
                <h3 className="text-base font-bold text-navy-900">Memo</h3>
                {memo?.memo_text ? <p className="whitespace-pre-wrap text-sm text-navy-800">{memo.memo_text}</p> : null}
                <WorkFiles paths={memo?.memo_files ?? []} emptyText={memo?.memo_text || work.items.length ? undefined : 'Your teacher has not added a memo.'} />
              </div>
            ) : (
              <p className="rounded-lg bg-navy-50 p-3 text-sm text-navy-700">The memo opens on {when(work.due_at)}, when the work closes for everyone.</p>
            )
          ) : null}
        </>
      ) : null}
    </div>
  )
}
