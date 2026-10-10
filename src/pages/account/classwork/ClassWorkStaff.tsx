import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { RouteLoading } from '@/components/layout/RouteLoading'
import { PlusIcon, UploadIcon } from '@/components/ui/Icons'
import { WorkFiles } from '@/components/classwork/WorkFiles'
import { subjects, getSubject } from '@/data/subjects'
import { classesInView, fetchClassMembers, fetchClasses, type SchoolClass } from '@/lib/classes'
import { fetchSchoolLearners } from '@/lib/teacherRoster'
import { LEVEL_NAMES, LEVELS, levelOf } from '@/lib/levels'
import {
  OVERALL,
  deleteWork,
  fetchClassWork,
  fetchSubmissions,
  fetchWork,
  filePath,
  letter,
  markSubmission,
  memoIsOpen,
  removeFile,
  saveWork,
  uploadFile,
  type ClassWork,
  type ItemMark,
  type Submission,
  type WorkItem,
  type WorkMemo,
} from '@/lib/classWork'
import type { Grade } from '@/types'
import { cn } from '@/lib/utils'

/**
 * Class work, for staff (STEP 42): set your own work for your classes -- an
 * uploaded paper, typed questions, or both -- then see who handed in and mark
 * it. The marks reach the learner, Levels and the early warnings.
 */
export function ClassWorkStaff() {
  const { id } = useParams()
  const edit = useLocation().pathname.endsWith('/edit')
  if (id === 'new' || (id && edit)) return <WorkEditor id={id === 'new' ? null : id} />
  if (id) return <WorkResults id={id} />
  return <WorkList />
}

/** This role's area, e.g. /account/teacher, from wherever in Class work we are. */
const useArea = () => {
  const path = useLocation().pathname
  return path.slice(0, path.indexOf('/class-work'))
}

const when = (iso: string) => new Date(iso).toLocaleString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

// ---------------------------------------------------------------------- list

function WorkList() {
  const { profile } = useAccountAuth()
  const [rows, setRows] = useState<ClassWork[] | null>(null)
  const [notSetUp, setNotSetUp] = useState(false)
  const [classes, setClasses] = useState<SchoolClass[]>([])

  useEffect(() => {
    if (!profile?.school_id) return
    Promise.all([fetchClassWork(), fetchClasses(profile.school_id)]).then(([w, c]) => {
      setRows(w.rows)
      setNotSetUp(w.notSetUp)
      setClasses(c.classes)
    })
  }, [profile?.school_id])

  if (!rows) return <RouteLoading />
  const className = new Map(classes.map((c) => [c.id, c.name]))

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Class work"
        title="Your own work for your classes"
        description="Upload a question paper (a district test, a DBE past paper, your own worksheet) or type the questions, add the memo and a due date. Learners hand in typed answers or photos of their work; the memo opens at the due date."
        action={
          <Link to="new" className="btn-primary">
            <PlusIcon className="h-4 w-4" /> Set new work
          </Link>
        }
      />
      {notSetUp ? (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Class work is not switched on yet: run STEP 42 of supabase/schema.sql.</p>
      ) : null}
      {rows.length === 0 ? (
        <EmptyState icon={<UploadIcon className="h-6 w-6" />} title="No class work yet" description="Set your first piece of work: upload the paper or type the questions." />
      ) : (
        <ul className="space-y-3">
          {rows.map((w) => (
            <li key={w.id}>
              <Link to={w.id} className="card block p-4 transition hover:border-navy-300">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-navy-900">{w.title}</p>
                    <p className="text-xs text-navy-500">
                      {getSubject(w.subject_id)?.name} · Grade {w.grade} · {w.class_ids.map((c) => className.get(c) ?? 'a class').join(', ')} · {w.total_marks} marks
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      w.status === 'draft' ? 'bg-navy-100 text-navy-700' : new Date(w.due_at) > new Date() ? 'bg-emerald-50 text-emerald-800' : 'bg-gold-50 text-gold-800',
                    )}
                  >
                    {w.status === 'draft' ? 'Draft' : new Date(w.due_at) > new Date() ? `Due ${when(w.due_at)}` : 'Closed: mark it'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// -------------------------------------------------------------------- editor

const toLocal = (iso: string) => {
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}
const fromLocal = (v: string) => new Date(v).toISOString()

interface Pending {
  folder: 'paper' | 'memo'
  file: File
}

function WorkEditor({ id }: { id: string | null }) {
  const { profile } = useAccountAuth()
  const navigate = useNavigate()
  const area = useArea()
  const [workId] = useState(() => id ?? crypto.randomUUID())
  const [loaded, setLoaded] = useState(!id)
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState(profile?.subject_id ?? 'mat-lit')
  const [grade, setGrade] = useState<Grade>(12)
  const [classIds, setClassIds] = useState<string[]>([])
  const [instructions, setInstructions] = useState('')
  const [items, setItems] = useState<WorkItem[]>([])
  const [memoAnswers, setMemoAnswers] = useState<WorkMemo['answers']>({})
  const [memoText, setMemoText] = useState('')
  const [paperFiles, setPaperFiles] = useState<string[]>([])
  const [memoFiles, setMemoFiles] = useState<string[]>([])
  const [pending, setPending] = useState<Pending[]>([])
  const [removed, setRemoved] = useState<string[]>([])
  const [totalMarks, setTotalMarks] = useState(50)
  const [minutes, setMinutes] = useState('')
  const [opensAt, setOpensAt] = useState(toLocal(new Date().toISOString()))
  const [dueAt, setDueAt] = useState(toLocal(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 11) + '15:00:00.000Z'))
  const [memoReleased, setMemoReleased] = useState<string | null>(null)
  const [wasPublished, setWasPublished] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!profile?.school_id) return
    fetchClasses(profile.school_id).then(({ classes: all }) => setClasses(classesInView(profile, all)))
  }, [profile])

  useEffect(() => {
    if (!id) return
    fetchWork(id).then(({ work, memo }) => {
      if (!work) {
        setError('This work could not be found, or is not yours.')
        setLoaded(true)
        return
      }
      setTitle(work.title)
      setSubjectId(work.subject_id)
      setGrade(work.grade)
      setClassIds(work.class_ids)
      setInstructions(work.instructions)
      setItems(work.items)
      setPaperFiles(work.paper_files)
      setTotalMarks(work.total_marks)
      setMinutes(work.minutes ? String(work.minutes) : '')
      setOpensAt(toLocal(work.opens_at))
      setDueAt(toLocal(work.due_at))
      setMemoReleased(work.memo_released_at)
      setWasPublished(work.status === 'published')
      if (memo) {
        setMemoAnswers(memo.answers ?? {})
        setMemoText(memo.memo_text)
        setMemoFiles(memo.memo_files ?? [])
      }
      setLoaded(true)
    })
  }, [id])

  const itemMarks = items.reduce((s, i) => s + (Number(i.marks) || 0), 0)
  const hasPaper = paperFiles.length + pending.filter((p) => p.folder === 'paper').length > 0
  // Typed questions alone: the total is theirs. With an uploaded paper, the teacher says.
  const total = hasPaper ? totalMarks : itemMarks || totalMarks
  const offered = classes.filter((c) => c.subject_id === subjectId && c.grade === grade)
  const subjectChoices = profile?.role === 'school' ? subjects : subjects.filter((s) => s.id === subjectId || s.id === profile?.subject_id)

  const updateItem = (i: number, patch: Partial<WorkItem>) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const addItem = (kind: WorkItem['kind']) =>
    setItems((xs) => [
      ...xs,
      { id: `q${Date.now().toString(36)}`, label: `${xs.length + 1}`, prompt: '', marks: kind === 'mcq' ? 1 : 2, kind, ...(kind === 'mcq' ? { options: ['', '', '', ''] } : {}) },
    ])

  const save = async (publish: boolean) => {
    setError('')
    if (!title.trim()) return setError('Give the work a title.')
    if (!classIds.length) return setError('Choose at least one class.')
    if (!hasPaper && !items.length) return setError('Upload the question paper or type at least one question.')
    if (items.some((i) => !i.prompt.trim() || !(Number(i.marks) > 0))) return setError('Every typed question needs its wording and its marks.')
    if (items.some((i) => i.kind === 'mcq' && !(memoAnswers[i.id]?.correct ?? ''))) return setError('Choose the correct option for every multiple-choice question.')
    if (!(total >= 1 && total <= 300)) return setError('The total must be between 1 and 300 marks.')
    if (new Date(dueAt) <= new Date(opensAt)) return setError('The due date must be after the opening time.')
    if (!profile?.school_id) return
    setBusy(true)
    const draft = {
      subject_id: subjectId,
      grade,
      title: title.trim(),
      instructions,
      class_ids: classIds,
      items: items.map((i) => ({ ...i, marks: Number(i.marks), options: i.kind === 'mcq' ? (i.options ?? []).map((o) => o.trim()) : undefined })),
      paper_files: paperFiles,
      total_marks: total,
      minutes: minutes ? Number(minutes) : null,
      opens_at: fromLocal(opensAt),
      due_at: fromLocal(dueAt),
      memo_released_at: memoReleased,
      status: (publish || wasPublished ? 'published' : 'draft') as ClassWork['status'],
    }
    const memo = { answers: memoAnswers, memo_text: memoText, memo_files: memoFiles }
    // The work must exist before files can be put in its folder, so a first save
    // goes in as it is, the files follow, and a second save lists them.
    let saved = await saveWork(workId, pending.length ? { ...draft, status: wasPublished ? 'published' : 'draft' } : draft, memo)
    if (saved.error) {
      setBusy(false)
      return setError(saved.error)
    }
    if (pending.length) {
      const paper = [...paperFiles]
      const memoF = [...memoFiles]
      for (const p of pending) {
        const r = await uploadFile(filePath(profile.school_id, workId, p.folder, p.file), p.file)
        if (r.error) {
          setBusy(false)
          setPaperFiles(paper)
          setMemoFiles(memoF)
          setPending([])
          return setError(r.error)
        }
        ;(p.folder === 'paper' ? paper : memoF).push(r.path!)
      }
      saved = await saveWork(workId, { ...draft, paper_files: paper }, { ...memo, memo_files: memoF })
      if (saved.error) {
        setBusy(false)
        return setError(saved.error)
      }
    }
    for (const r of removed) await removeFile(r)
    setBusy(false)
    navigate(`${area}/class-work/${workId}`)
  }

  if (!loaded) return <RouteLoading />

  const filePicker = (folder: Pending['folder'], label: string) => (
    <label className="btn-outline btn-sm cursor-pointer">
      <UploadIcon className="h-4 w-4" /> {label}
      <input
        type="file"
        multiple
        accept="application/pdf,image/*,.doc,.docx"
        className="sr-only"
        onChange={(e) => {
          const files = [...(e.target.files ?? [])]
          setPending((xs) => [...xs, ...files.map((file) => ({ folder, file }))])
          e.target.value = ''
        }}
      />
    </label>
  )
  const pendingList = (folder: Pending['folder']) =>
    pending.filter((p) => p.folder === folder).length ? (
      <ul className="mt-2 space-y-1 text-sm text-navy-700">
        {pending
          .filter((p) => p.folder === folder)
          .map((p) => (
            <li key={p.file.name + p.file.size} className="flex items-center justify-between gap-2 rounded border border-dashed border-navy-200 px-2 py-1">
              <span className="break-all">{p.file.name} (uploads when you save)</span>
              <button type="button" className="text-xs font-semibold text-rose-700 underline" onClick={() => setPending((xs) => xs.filter((x) => x !== p))}>
                Remove
              </button>
            </li>
          ))}
      </ul>
    ) : null

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Class work" title={id ? 'Edit class work' : 'Set new work'} />
      <div className="card space-y-4 p-5">
        <label className="block">
          <span className="text-xs font-medium text-navy-500">Title</span>
          <input className="input mt-1" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Term 3 district common test: Finance" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-navy-500">Subject</span>
            <select className="select mt-1" value={subjectId} onChange={(e) => (setSubjectId(e.target.value), setClassIds([]))}>
              {subjectChoices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-navy-500">Grade</span>
            <select className="select mt-1" value={grade} onChange={(e) => (setGrade(Number(e.target.value) as Grade), setClassIds([]))}>
              {[10, 11, 12].map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </label>
        </div>
        <fieldset>
          <legend className="text-xs font-medium text-navy-500">Classes</legend>
          {offered.length ? (
            <div className="mt-1.5 flex flex-wrap gap-2">
              {offered.map((c) => (
                <label key={c.id} className={cn('flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm', classIds.includes(c.id) ? 'border-navy-700 bg-navy-50' : 'border-navy-200')}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-navy-300"
                    checked={classIds.includes(c.id)}
                    onChange={(e) => setClassIds((xs) => (e.target.checked ? [...xs, c.id] : xs.filter((x) => x !== c.id)))}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm text-navy-500">
              You have no {getSubject(subjectId)?.name} Grade {grade} class yet. Create one under <Link to={`${area}/classes`} className="underline">Classes</Link>.
            </p>
          )}
        </fieldset>
        <label className="block">
          <span className="text-xs font-medium text-navy-500">Instructions for learners (optional)</span>
          <textarea className="input mt-1 min-h-[5rem]" value={instructions} maxLength={5000} onChange={(e) => setInstructions(e.target.value)} placeholder="e.g. Answer all questions. Show your working. Photograph each page clearly." />
        </label>
      </div>

      <div className="card space-y-3 p-5">
        <h3 className="text-base font-bold text-navy-900">Question paper</h3>
        <p className="text-sm text-navy-600">Upload the paper as a PDF or photos (up to 15 MB each). Learners open it, write on paper, and hand in photos of their work or typed answers.</p>
        <WorkFiles paths={paperFiles} onRemove={(p) => (setPaperFiles((xs) => xs.filter((x) => x !== p)), setRemoved((xs) => [...xs, p]))} />
        {pendingList('paper')}
        {filePicker('paper', 'Upload the paper')}
      </div>

      <div className="card space-y-4 p-5">
        <div>
          <h3 className="text-base font-bold text-navy-900">Typed questions (optional)</h3>
          <p className="text-sm text-navy-600">Type questions learners answer in the app. Multiple choice is marked automatically when they hand in; you mark the rest.</p>
        </div>
        {items.map((it, i) => (
          <div key={it.id} className="space-y-2 rounded-lg border border-navy-200 p-3">
            <div className="flex flex-wrap items-end gap-2">
              <label className="w-20">
                <span className="text-xs font-medium text-navy-500">Number</span>
                <input className="input mt-1" value={it.label} maxLength={10} onChange={(e) => updateItem(i, { label: e.target.value })} />
              </label>
              <label className="w-20">
                <span className="text-xs font-medium text-navy-500">Marks</span>
                <input className="input mt-1" type="number" min={1} max={50} value={it.marks} onChange={(e) => updateItem(i, { marks: Number(e.target.value) })} />
              </label>
              <span className="pb-2 text-xs font-semibold text-navy-500">{it.kind === 'mcq' ? 'Multiple choice' : 'Written answer'}</span>
              <button type="button" className="ml-auto pb-2 text-xs font-semibold text-rose-700 underline" onClick={() => setItems((xs) => xs.filter((_, j) => j !== i))}>
                Remove
              </button>
            </div>
            <textarea className="input min-h-[4rem]" value={it.prompt} placeholder="The question" onChange={(e) => updateItem(i, { prompt: e.target.value })} />
            {it.kind === 'mcq' ? (
              <div className="space-y-1.5">
                {(it.options ?? []).map((o, k) => (
                  <label key={k} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={`correct-${it.id}`}
                      checked={memoAnswers[it.id]?.correct === letter(k)}
                      onChange={() => setMemoAnswers((m) => ({ ...m, [it.id]: { correct: letter(k) } }))}
                      aria-label={`Option ${letter(k)} is correct`}
                    />
                    <span className="w-5 font-semibold text-navy-600">{letter(k)}</span>
                    <input
                      className="input"
                      value={o}
                      placeholder={`Option ${letter(k)}`}
                      onChange={(e) => updateItem(i, { options: (it.options ?? []).map((x, j) => (j === k ? e.target.value : x)) })}
                    />
                  </label>
                ))}
                <p className="text-xs text-navy-500">Tick the correct option. It stays hidden from learners until the memo opens.</p>
              </div>
            ) : (
              <label className="block">
                <span className="text-xs font-medium text-navy-500">Memo for this question</span>
                <textarea
                  className="input mt-1 min-h-[3rem]"
                  value={memoAnswers[it.id]?.answer ?? ''}
                  onChange={(e) => setMemoAnswers((m) => ({ ...m, [it.id]: { answer: e.target.value } }))}
                />
              </label>
            )}
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-outline btn-sm" onClick={() => addItem('written')}>
            <PlusIcon className="h-4 w-4" /> Written question
          </button>
          <button type="button" className="btn-outline btn-sm" onClick={() => addItem('mcq')}>
            <PlusIcon className="h-4 w-4" /> Multiple-choice question
          </button>
        </div>
      </div>

      <div className="card space-y-3 p-5">
        <h3 className="text-base font-bold text-navy-900">Memo</h3>
        <p className="text-sm text-navy-600">Learners see the memo only from the due date, or when you release it.</p>
        <textarea className="input min-h-[5rem]" value={memoText} maxLength={20000} onChange={(e) => setMemoText(e.target.value)} placeholder="Type the memo, or upload it below" />
        <WorkFiles paths={memoFiles} onRemove={(p) => (setMemoFiles((xs) => xs.filter((x) => x !== p)), setRemoved((xs) => [...xs, p]))} />
        {pendingList('memo')}
        {filePicker('memo', 'Upload the memo')}
      </div>

      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium text-navy-500">Total marks</span>
          {hasPaper ? (
            <input className="input mt-1" type="number" min={1} max={300} value={totalMarks} onChange={(e) => setTotalMarks(Number(e.target.value))} />
          ) : (
            <p className="mt-2 text-lg font-bold tabular-nums text-navy-900">{itemMarks || '—'}</p>
          )}
          {hasPaper && itemMarks ? <span className="mt-1 block text-xs text-navy-500">Typed questions carry {itemMarks} of these marks.</span> : null}
        </label>
        <label className="block">
          <span className="text-xs font-medium text-navy-500">Time limit in minutes (optional)</span>
          <input className="input mt-1" type="number" min={5} max={300} value={minutes} placeholder="No time limit" onChange={(e) => setMinutes(e.target.value)} />
          <span className="mt-1 block text-xs text-navy-500">With a time limit, the clock starts when the learner opens the work.</span>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-navy-500">Opens</span>
          <input className="input mt-1" type="datetime-local" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-navy-500">Due (the memo opens then)</span>
          <input className="input mt-1" type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
        </label>
      </div>

      {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        {!wasPublished ? (
          <button type="button" disabled={busy} className="btn-outline" onClick={() => void save(false)}>
            Save as draft
          </button>
        ) : null}
        <button type="button" disabled={busy} className="btn-primary" onClick={() => void save(true)}>
          {busy ? 'Saving…' : wasPublished ? 'Save changes' : 'Publish to the classes'}
        </button>
      </div>
      <p className="text-xs text-navy-500">Only upload work you may share with your learners. DBE past papers may be used for teaching.</p>
    </div>
  )
}

// ------------------------------------------------------------------- results

function WorkResults({ id }: { id: string }) {
  const { profile } = useAccountAuth()
  const navigate = useNavigate()
  const area = useArea()
  const [work, setWork] = useState<ClassWork | null | undefined>(undefined)
  const [memo, setMemo] = useState<WorkMemo | null>(null)
  const [subs, setSubs] = useState<Submission[]>([])
  const [learners, setLearners] = useState<string[]>([])
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const [, setTick] = useState(0)

  const load = async () => {
    if (!profile?.school_id) return
    const [{ work: w, memo: m }, s, c, roster] = await Promise.all([fetchWork(id), fetchSubmissions(id), fetchClasses(profile.school_id), fetchSchoolLearners(profile.school_id)])
    setWork(w)
    setMemo(m)
    setSubs(s)
    setClasses(c.classes)
    setNames(new Map(roster.map((l) => [l.id, l.full_name])))
    if (w) setLearners([...new Set((await fetchClassMembers(w.class_ids)).map((x) => x.learner_id))])
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, profile?.school_id])

  const bySub = useMemo(() => new Map(subs.map((s) => [s.learner_id, s])), [subs])
  const marked = subs.filter((s) => s.status === 'marked' && s.percent !== null)
  const average = marked.length ? marked.reduce((t, s) => t + (s.percent ?? 0), 0) / marked.length : null

  if (work === undefined) return <RouteLoading />
  if (!work) return <p className="text-sm text-navy-600">This work could not be found, or is not in your view.</p>

  const closed = new Date(work.due_at) <= new Date()
  const nameOf = (l: string) => names.get(l) ?? 'Learner'
  const order = [...learners].sort((a, b) => nameOf(a).localeCompare(nameOf(b)))
  const notIn = order.filter((l) => !bySub.get(l)?.submitted_at && closed)
  const className = new Map(classes.map((c) => [c.id, c.name]))

  const releaseMemo = async () => {
    const m = memo ?? { answers: {}, memo_text: '', memo_files: [] }
    const { id: _id, school_id: _s, created_by: _c, created_at: _ca, updated_at: _u, ...rest } = work
    const r = await saveWork(work.id, { ...rest, memo_released_at: new Date().toISOString() }, { answers: m.answers, memo_text: m.memo_text, memo_files: m.memo_files })
    if (r.work) setWork(r.work)
    setTick((t) => t + 1)
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Class work"
        title={work.title}
        description={`${getSubject(work.subject_id)?.name} · Grade ${work.grade} · ${work.class_ids.map((c) => className.get(c) ?? 'a class').join(', ')} · ${work.total_marks} marks · due ${when(work.due_at)}${work.minutes ? ` · ${work.minutes} minutes once opened` : ''}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="edit" className="btn-outline btn-sm">
              Edit
            </Link>
            <button
              type="button"
              className="btn-ghost btn-sm text-rose-700"
              onClick={async () => {
                if (!window.confirm('Delete this work, with every learner\'s answers and marks? This cannot be undone.')) return
                if (await deleteWork(work.id)) navigate(`${area}/class-work`)
              }}
            >
              Delete
            </button>
          </div>
        }
      />
      {work.status === 'draft' ? <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">This is a draft: learners cannot see it until you publish it (Edit → Publish).</p> : null}
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
        <span className="text-navy-700">
          {memoIsOpen(work) ? <b>The memo is open to the class.</b> : <>The memo opens to the class on <b>{when(work.due_at)}</b>.</>}
        </span>
        {!memoIsOpen(work) ? (
          <button type="button" className="btn-outline btn-sm" onClick={() => void releaseMemo()}>
            Release the memo now
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Handed in</p>
          <p className="text-2xl font-extrabold tabular-nums text-navy-900">
            {subs.filter((s) => s.submitted_at).length} / {learners.length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Marked</p>
          <p className="text-2xl font-extrabold tabular-nums text-navy-900">{marked.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Average</p>
          <p className="text-2xl font-extrabold tabular-nums text-navy-900">{average === null ? '—' : `${Math.round(average)}%`}</p>
          {average !== null ? <p className="text-xs text-navy-600">Level {levelOf(average)}</p> : null}
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Levels</p>
          <p className="text-xs leading-5 text-navy-700">
            {LEVELS.slice()
              .reverse()
              .map((lv) => `L${lv}: ${marked.filter((s) => levelOf(s.percent ?? 0) === lv).length}`)
              .join(' · ')}
          </p>
        </div>
      </div>

      {notIn.length ? (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
          <b>Not handed in ({notIn.length}):</b> {notIn.map(nameOf).join(', ')}
        </p>
      ) : null}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-left text-xs uppercase tracking-wide text-navy-500">
              <th className="p-3">Learner</th>
              <th className="p-3">Status</th>
              <th className="p-3">Mark</th>
              <th className="p-3">Level</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {order.map((l) => {
              const s = bySub.get(l)
              const status = !s ? (closed ? 'Not handed in' : 'Not started') : s.status === 'marked' ? 'Marked' : s.submitted_at ? 'Handed in: mark it' : 'Writing'
              return (
                <tr key={l} className={cn('border-b border-navy-50', open === s?.id && 'bg-gold-50')}>
                  <td className="p-3 font-medium text-navy-800">{nameOf(l)}</td>
                  <td className="p-3 text-navy-600">{status}</td>
                  <td className="p-3 tabular-nums">{s?.status === 'marked' ? `${s.marks_awarded} / ${s.marks_total} (${Math.round(s.percent ?? 0)}%)` : '—'}</td>
                  <td className="p-3">{s?.status === 'marked' ? `L${levelOf(s.percent ?? 0)}` : '—'}</td>
                  <td className="p-3 text-right">
                    {s && (s.submitted_at || new Date(s.deadline) <= new Date()) ? (
                      <button type="button" className="btn-outline btn-sm" onClick={() => setOpen(open === s.id ? null : s.id)}>
                        {s.status === 'marked' ? 'Change marks' : 'Mark'}
                      </button>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {open && bySub.size ? (
        <MarkPanel
          key={open}
          work={work}
          memo={memo}
          sub={subs.find((s) => s.id === open)!}
          name={nameOf(subs.find((s) => s.id === open)!.learner_id)}
          onSaved={(s) => {
            setSubs((xs) => xs.map((x) => (x.id === s.id ? s : x)))
            const next = order.map((l) => bySub.get(l)).find((x) => x && x.id !== s.id && x.submitted_at && x.status !== 'marked')
            setOpen(next?.id ?? null)
          }}
        />
      ) : null}
    </div>
  )
}

function MarkPanel({ work, memo, sub, name, onSaved }: { work: ClassWork; memo: WorkMemo | null; sub: Submission; name: string; onSaved: (s: Submission) => void }) {
  const itemTotal = work.items.reduce((t, i) => t + i.marks, 0)
  const rest = Math.max(0, work.total_marks - itemTotal)
  const [marks, setMarks] = useState<Record<string, ItemMark>>(() => {
    const m: Record<string, ItemMark> = { ...sub.marking }
    for (const i of work.items) if (!m[i.id]) m[i.id] = { awarded: 0 }
    if (rest && !m[OVERALL]) m[OVERALL] = { awarded: 0 }
    return m
  })
  const [comment, setComment] = useState(sub.comment ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const sum = Object.values(marks).reduce((t, m) => t + (Number(m.awarded) || 0), 0)
  const set = (key: string, patch: Partial<ItemMark>) => setMarks((m) => ({ ...m, [key]: { ...m[key], ...patch } }))

  return (
    <div className="card space-y-4 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-bold text-navy-900">Marking: {name}</h3>
        <span className="text-sm tabular-nums text-navy-700">
          {Math.min(sum, work.total_marks)} / {work.total_marks}
        </span>
      </div>
      {sub.submitted_at ? <p className="text-xs text-navy-500">Handed in {when(sub.submitted_at)}.</p> : <p className="text-xs text-navy-500">Not handed in: the time ran out. Marking what was saved.</p>}
      {sub.files.length ? (
        <div>
          <p className="mb-2 text-sm font-semibold text-navy-800">Their work</p>
          <WorkFiles paths={sub.files} />
        </div>
      ) : null}
      {work.items.map((it) => (
        <div key={it.id} className="space-y-2 rounded-lg border border-navy-200 p-3 text-sm">
          <p className="font-medium text-navy-900">
            {it.label} {it.prompt} <span className="text-navy-500">({it.marks})</span>
          </p>
          <p className="whitespace-pre-wrap rounded bg-navy-50 p-2 text-navy-800">
            <span className="text-xs font-semibold text-navy-500">Answer: </span>
            {it.kind === 'mcq' && sub.answers[it.id] ? `${sub.answers[it.id]}. ${(it.options ?? [])[sub.answers[it.id].charCodeAt(0) - 65] ?? ''}` : sub.answers[it.id] || '(blank)'}
          </p>
          <p className="whitespace-pre-wrap text-xs text-navy-600">
            <span className="font-semibold">Memo: </span>
            {it.kind === 'mcq' ? memo?.answers[it.id]?.correct ?? '—' : memo?.answers[it.id]?.answer || '—'}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="input w-20"
              type="number"
              min={0}
              max={it.marks}
              step={0.5}
              value={marks[it.id]?.awarded ?? 0}
              onChange={(e) => set(it.id, { awarded: Math.max(0, Math.min(it.marks, Number(e.target.value))), auto: false })}
              aria-label={`Marks for ${it.label}`}
            />
            <span className="text-xs text-navy-500">/ {it.marks}</span>
            <input className="input flex-1" placeholder="Feedback (optional)" value={marks[it.id]?.feedback ?? ''} onChange={(e) => set(it.id, { feedback: e.target.value })} />
          </div>
        </div>
      ))}
      {rest ? (
        <label className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-navy-800">{work.items.length ? 'Marks for the uploaded paper' : 'Mark'}</span>
          <input
            className="input w-24"
            type="number"
            min={0}
            max={rest}
            step={0.5}
            value={marks[OVERALL]?.awarded ?? 0}
            onChange={(e) => set(OVERALL, { awarded: Math.max(0, Math.min(rest, Number(e.target.value))) })}
          />
          <span className="text-xs text-navy-500">/ {rest}</span>
        </label>
      ) : null}
      <label className="block">
        <span className="text-xs font-medium text-navy-500">Comment to the learner (optional)</span>
        <textarea className="input mt-1 min-h-[3rem]" value={comment} maxLength={2000} onChange={(e) => setComment(e.target.value)} />
      </label>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <button
        type="button"
        disabled={busy}
        className="btn-primary"
        onClick={async () => {
          setBusy(true)
          setError('')
          const r = await markSubmission(sub.id, marks, comment)
          setBusy(false)
          if (r.error) return setError(r.error)
          onSaved(r.submission!)
        }}
      >
        {busy ? 'Saving…' : 'Save marks and tell the learner'}
      </button>
      <p className="text-xs text-navy-500">Level {levelOf((Math.min(sum, work.total_marks) / work.total_marks) * 100)}: {LEVEL_NAMES[levelOf((Math.min(sum, work.total_marks) / work.total_marks) * 100)]}</p>
    </div>
  )
}
