import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { linkChoice } from '@/lib/linkChoice'
import { Link, useSearchParams } from 'react-router-dom'
import { subjects, getSubject } from '@/data/subjects'
import { topics } from '@/data/topics'
import { questionsForSubject } from '@/data/questionBank'
import { papersForSubject } from '@/data/papers'
import {
  buildTest,
  extraSheets,
  markSplitFor,
  programmeFor,
  PROGRAMME_SOURCE,
  sbaMark,
  sheetForTask,
  topicNames,
  topicsFor,
  type SbaTask,
} from '@/data/sba'
import { sheetMarks, type TaskSheet } from '@/data/sbaTaskSheets'
import { capsWeightingFor } from '@/data/capsWeighting'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PrinterIcon, SparkleIcon } from '@/components/ui/Icons'
import { PrintQuestion } from '@/components/lessons/PrintQuestion'
import { cn } from '@/lib/utils'
import type { Grade, Question } from '@/types'
import type { Paper } from '@/data/papers/types'

const teachableSubjects = subjects.filter((s) => topics.some((t) => t.subjectId === s.id))
type Copy = 'learner' | 'memo' | 'marksheet'

/**
 * The formal assessment tasks for a subject and grade, term by term, each
 * ready to print as a learner copy, a memo or rubric, and a class mark sheet.
 * Everything is assembled by src/data/sba.ts; this page chooses and lays out.
 */
export function TeacherAssessmentTasks() {
  // A link from the resource centre opens at its subject and grade.
  const [params] = useSearchParams()
  const [start] = useState(() => linkChoice(params))
  const [subjectId, setSubjectId] = useState(start.subjectId ?? 'mathematics')
  const [grade, setGrade] = useState<Grade>(start.grade ?? 12)
  const [taskKey, setTaskKey] = useState('')
  const [copy, setCopy] = useState<Copy>('learner')
  const [version, setVersion] = useState(0)
  const [rows, setRows] = useState(40)
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [papers, setPapers] = useState<Paper[]>([])

  const [sba, setSba] = useState('60')
  const [taskMarks, setTaskMarks] = useState<Record<string, number>>({})

  const programme = useMemo(() => programmeFor(subjectId, grade), [subjectId, grade])
  // Task sheets the formal programme does not use, offered as extra practical work.
  const extras = useMemo<SbaTask[]>(
    () =>
      extraSheets(subjectId, grade).map((sh) => ({
        key: `extra-${sh.id}`,
        slot: `extra-${sh.id}`,
        term: sh.term,
        kind: sh.kind,
        title: `${sh.kind}: ${sh.title}`,
        marks: sheetMarks(sh),
      })),
    [subjectId, grade],
  )
  const task = [...programme, ...extras].find((t) => t.key === taskKey) ?? programme[0]

  useEffect(() => {
    let live = true
    setQuestions(null)
    questionsForSubject(subjectId).then((qs) => live && setQuestions(qs))
    return () => {
      live = false
    }
  }, [subjectId])

  useEffect(() => {
    let live = true
    papersForSubject(subjectId, undefined, grade).then((ps) => live && setPapers(ps))
    return () => {
      live = false
    }
  }, [subjectId, grade])

  useEffect(() => {
    setTaskKey('')
    setVersion(0)
    setTaskMarks({})
  }, [subjectId, grade])

  const topicIds = task ? topicsFor(subjectId, grade, task) : []
  const sheet = task ? sheetForTask(subjectId, grade, task) : undefined
  const built = useMemo(() => {
    if (!task || !questions || !(task.kind === 'Test' || task.kind === 'Assignment')) return undefined
    return buildTest({ subjectId, grade, topicIds, questions, marks: task.marks!, kind: task.kind, version })
    // topicIds is derived from task, subject and grade.
  }, [task, questions, subjectId, grade, version]) // eslint-disable-line react-hooks/exhaustive-deps

  const subjectName = getSubject(subjectId)?.name ?? ''

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Formal assessment"
        title="School-based assessment tasks"
        description="The formal tasks for the year, term by term, each ready to print: the learner copy, the memo or rubric, and a class mark sheet."
      />

      <div className="card space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="sba-subject">
              Subject
            </label>
            <select id="sba-subject" className="select mt-1" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {teachableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="sba-grade">
              Grade
            </label>
            <select id="sba-grade" className="select mt-1" value={grade} onChange={(e) => setGrade(Number(e.target.value) as Grade)}>
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
              <option value={12}>Grade 12</option>
            </select>
          </div>
        </div>
        <YearMark grade={grade} sba={sba} setSba={setSba} />
        <ProgrammeTable
          programme={programme}
          marks={taskMarks}
          setMarks={setTaskMarks}
          onUse={(pct) => setSba(String(Math.round(pct * 10) / 10).replace('.', ','))}
        />
        <p className="rounded-lg bg-navy-50 p-3 text-xs text-navy-600">
          The tasks, raw totals and weights are the national {PROGRAMME_SOURCE}. Check your province’s circulars for the year’s dates and any
          common tasks it sets. Tap a task to print it.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((term) => (
            <div key={term} className="rounded-lg border border-navy-100 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-navy-500">Term {term}</p>
              <ul className="mt-2 space-y-1.5">
                {programme
                  .filter((t) => t.term === term)
                  .map((t) => (
                    <li key={t.key}>
                      <button
                        type="button"
                        onClick={() => {
                          setTaskKey(t.key)
                          setVersion(0)
                          setCopy('learner')
                        }}
                        aria-pressed={task?.key === t.key}
                        className={cn(
                          'w-full rounded-md px-2 py-1.5 text-left text-sm transition',
                          task?.key === t.key ? 'bg-navy-900 text-white' : 'text-navy-700 hover:bg-navy-50',
                        )}
                      >
                        {t.title}
                        {t.sbaWeight ? (
                          <span className={cn('ml-1 text-xs tabular-nums', task?.key === t.key ? 'text-navy-200' : 'text-navy-400')}>
                            · {pct(t.sbaWeight)} of SBA
                          </span>
                        ) : null}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        {extras.length ? (
          <div className="text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Extra practical work (not part of the formal programme)</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {extras.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={task?.key === t.key}
                  onClick={() => {
                    setTaskKey(t.key)
                    setCopy('learner')
                  }}
                  className={cn('rounded-md border px-2 py-1 text-left', task?.key === t.key ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-200 text-navy-700')}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {task ? (
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-end gap-3 border-b border-navy-100 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">Term {task.term}</p>
              <h3 className="text-base font-bold text-navy-900">{task.title}</h3>
              <p className="text-xs text-navy-500">
                {task.papers ?? `Out of ${task.marks}`}
                {task.sbaWeight ? ` · ${pct(task.sbaWeight)} of the SBA` : task.key.startsWith('extra-') ? ' · practice, not recorded for SBA' : ''}
                {task.termWeight !== undefined && task.sbaWeight ? ` (${pct(task.termWeight)} of the term mark)` : ''}
              </p>
              {!task.exam && topicIds.length ? (
                <p className="text-xs text-navy-500">Covers: {topicNames(sheet ? [sheet.topicId] : topicIds).join(' · ')}</p>
              ) : null}
            </div>
            {task.exam ? null : (
              <div className="ml-auto flex flex-wrap items-end gap-3">
                <div className="flex rounded-lg border border-navy-200 bg-white p-1" role="group" aria-label="Which copy">
                  {(['learner', 'memo', 'marksheet'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={copy === c}
                      onClick={() => setCopy(c)}
                      className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', copy === c ? 'bg-navy-900 text-white' : 'text-navy-600')}
                    >
                      {c === 'learner' ? 'Learner copy' : c === 'memo' ? (sheet ? 'Rubric and notes' : 'Memo') : 'Mark sheet'}
                    </button>
                  ))}
                </div>
                {copy === 'marksheet' ? (
                  <select className="select w-auto" value={rows} onChange={(e) => setRows(Number(e.target.value))} aria-label="Rows on the mark sheet">
                    {[30, 40, 50].map((n) => (
                      <option key={n} value={n}>
                        {n} learners
                      </option>
                    ))}
                  </select>
                ) : null}
                {built ? (
                  <button type="button" onClick={() => setVersion((v) => v + 1)} className="btn-outline btn-sm inline-flex items-center gap-1.5">
                    <SparkleIcon className="h-4 w-4" /> Another version
                  </button>
                ) : null}
                <button type="button" onClick={() => window.print()} className="btn-primary inline-flex items-center gap-2">
                  <PrinterIcon className="h-4 w-4" /> Print / Save PDF
                </button>
              </div>
            )}
          </div>

          {task.exam ? (
            <ExamPanel task={task} papers={papers} />
          ) : sheet ? (
            <div className="print-area p-5 sm:p-8">
              {copy === 'marksheet' ? (
                <MarkSheet
                  title={`${subjectName} Grade ${grade} · Term ${task.term} · ${task.title}`}
                  columns={sheet.rubric.map((r, i) => ({ label: `${i + 1}`, marks: r.marks, hint: r.criterion }))}
                  rows={rows}
                />
              ) : (
                <SheetDoc subjectName={subjectName} grade={grade} task={task} sheet={sheet} teacher={copy === 'memo'} />
              )}
            </div>
          ) : !questions ? (
            <p className="p-5 text-sm text-navy-500">Loading the question bank…</p>
          ) : built ? (
            <>
              <LevelBar built={built} subjectId={subjectId} grade={grade} />
              <div className="print-area p-5 sm:p-8">
                {copy === 'marksheet' ? (
                  <MarkSheet
                    title={`${subjectName} Grade ${grade} · Term ${task.term} · ${task.title}`}
                    columns={built.questions.map((q, i) => ({ label: `Q${i + 1}`, marks: q.marks }))}
                    rows={rows}
                  />
                ) : (
                  <TestDoc subjectId={subjectId} subjectName={subjectName} grade={grade} task={task} questions={built.questions} marks={built.marks} memo={copy === 'memo'} topics={topicNames(topicIds)} />
                )}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function LevelBar({ built, subjectId, grade }: { built: ReturnType<typeof buildTest>; subjectId: string; grade: Grade }) {
  const names = capsWeightingFor(subjectId, grade)?.levelNames
  return (
    <div className="border-b border-navy-100 px-4 py-3 text-xs text-navy-600">
      <p className="font-semibold text-navy-700">Marks per cognitive level (built to the CAPS weighting)</p>
      <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1">
        {built.levels.map((m, i) => (
          <span key={i} title={names?.[i]}>
            Level {i + 1}: <span className="font-semibold tabular-nums text-navy-800">{m}</span>
            <span className="text-navy-400"> (target {built.targets[i]})</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Header({ subjectName, grade, title, children }: { subjectName: string; grade: Grade; title: string; children?: ReactNode }) {
  return (
    <div className="border-b-2 border-navy-900 pb-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">
        DONE WELL® {subjectName} · Grade {grade} · Formal assessment
      </p>
      <h2 className="mt-1 text-lg font-bold text-navy-900 [text-wrap:balance]">{title}</h2>
      {children}
    </div>
  )
}

function NameLines() {
  return (
    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-700">
      <span>Name: ______________________________</span>
      <span>Class: ________</span>
      <span>Date: ______________</span>
    </div>
  )
}

function TestDoc(props: {
  subjectId: string
  subjectName: string
  grade: Grade
  task: SbaTask
  questions: Question[]
  marks: number
  memo: boolean
  topics: string[]
}) {
  const { subjectId, subjectName, grade, task, questions, marks, memo, topics: covered } = props
  // Life Sciences answers are written, not calculated: no calculator or rounding rules.
  const written = subjectId === 'life-sciences'
  return (
    <section>
      <Header subjectName={subjectName} grade={grade} title={`Term ${task.term} ${task.title}${memo ? ' — Memorandum' : ''}`}>
        <p className="mt-1 text-sm text-navy-600">
          Marks: {marks} · Time: {task.minutes} minutes · Topics: {covered.join(', ')}
        </p>
      </Header>
      {memo ? null : (
        <>
          <NameLines />
          <div className="mt-3 rounded-lg border border-navy-200 p-3 text-sm text-navy-700">
            <p className="font-semibold text-navy-900">Instructions</p>
            <ol className="mt-1 list-decimal space-y-0.5 pl-5">
              <li>Answer ALL the questions{task.kind === 'Assignment' ? ' on separate paper' : ' in the spaces or on the answer paper provided'}.</li>
              {written ? (
                <>
                  <li>Use the marks next to each question as a guide to how much to write.</li>
                  <li>Where a calculation is asked for, show your working.</li>
                  <li>Draw diagrams and graphs in pencil, with a heading and labels.</li>
                </>
              ) : (
                <>
                  <li>Show all your working; marks are given for method.</li>
                  <li>You may use an approved calculator unless a question says otherwise.</li>
                  <li>Round final answers to TWO decimal places unless stated otherwise.</li>
                </>
              )}
              {task.kind === 'Assignment' ? <li>This is an individual task. You may use your notes and textbook.</li> : null}
            </ol>
          </div>
        </>
      )}
      <div className="mt-5 space-y-4">
        {questions.map((q, i) => (
          <PrintQuestion key={q.id} question={q} number={`Question ${i + 1}`} showAnswer={memo} learner={!memo} />
        ))}
      </div>
      <p className="mt-6 text-right text-sm font-semibold text-navy-900">TOTAL: {marks}</p>
    </section>
  )
}

function SheetDoc({ subjectName, grade, task, sheet, teacher }: { subjectName: string; grade: Grade; task: SbaTask; sheet: TaskSheet; teacher: boolean }) {
  return (
    <section>
      <Header subjectName={subjectName} grade={grade} title={`Term ${task.term} ${sheet.kind}: ${sheet.title}${teacher ? ' — Rubric and teacher notes' : ''}`}>
        <p className="mt-1 text-sm text-navy-600">
          Marks: {sheetMarks(sheet)} · Time: {sheet.time}
        </p>
      </Header>
      {teacher ? null : <NameLines />}
      <p className="mt-3 text-sm leading-relaxed text-navy-800">{sheet.intro}</p>
      {sheet.materials?.length ? (
        <>
          <H>You will need</H>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-navy-800">
            {sheet.materials.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </>
      ) : null}
      {sheet.safety?.length ? (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          <p className="font-semibold">Safety</p>
          <ul className="mt-0.5 list-disc pl-5">
            {sheet.safety.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <H>What to do</H>
      <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-navy-800">
        {sheet.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <H>Hand in</H>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-navy-800">
        {sheet.handIn.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <div className="print-avoid-break">
        <H>How your work will be marked</H>
        <div className="mt-1 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-left text-xs uppercase tracking-wide text-navy-500">
                <th className="py-1.5 pr-2 font-semibold">Criterion</th>
                <th className="py-1.5 pr-2 font-semibold">Not yet</th>
                <th className="py-1.5 pr-2 font-semibold">Partly</th>
                <th className="py-1.5 pr-2 font-semibold">Fully</th>
                <th className="py-1.5 text-right font-semibold">Marks</th>
              </tr>
            </thead>
            <tbody>
              {sheet.rubric.map((r) => (
                <tr key={r.criterion} className="border-b border-navy-100 align-top">
                  <td className="py-1.5 pr-2 font-medium text-navy-900">{r.criterion}</td>
                  {r.levels.map((l, i) => (
                    <td key={i} className="py-1.5 pr-2 text-navy-700">
                      {l}
                    </td>
                  ))}
                  <td className="py-1.5 text-right tabular-nums text-navy-800">{teacher ? `___ / ${r.marks}` : r.marks}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="py-1.5 text-right font-semibold text-navy-900">
                  Total
                </td>
                <td className="py-1.5 text-right font-semibold tabular-nums text-navy-900">{teacher ? `___ / ${sheetMarks(sheet)}` : sheetMarks(sheet)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {teacher ? (
        <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
          <p className="font-semibold">Teacher notes</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {sheet.teacherNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p className="mt-2 text-emerald-800">Marking guide: award the low band up to a third of the marks, the middle band up to two thirds, and the full band above that.</p>
        </div>
      ) : null}
    </section>
  )
}

function H({ children }: { children: ReactNode }) {
  return <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-navy-500">{children}</h4>
}

function MarkSheet({ title, columns, rows }: { title: string; columns: { label: string; marks: number; hint?: string }[]; rows: number }) {
  const total = columns.reduce((a, c) => a + c.marks, 0)
  return (
    <section className="mark-sheet">
      <div className="border-b-2 border-navy-900 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">DONE WELL® Mark sheet</p>
        <h2 className="mt-1 text-base font-bold text-navy-900">{title}</h2>
        <p className="mt-1 text-xs text-navy-600">Teacher: ______________________ · Class: ________ · Date: ______________</p>
      </div>
      {columns.some((c) => c.hint) ? (
        <p className="mt-2 text-xs text-navy-600">
          {columns.map((c) => `${c.label}. ${c.hint}`).join(' · ')}
        </p>
      ) : null}
      <div className="mark-sheet-scroll mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="text-navy-700">
              <th className="mark-sheet-no border border-navy-300 px-1 py-1 text-left">No.</th>
              <th className="mark-sheet-name min-w-[10rem] border border-navy-300 px-1 py-1 text-left">Learner</th>
              {columns.map((c) => (
                <th key={c.label} className="border border-navy-300 px-1 py-1 text-center tabular-nums">
                  {c.label}
                  <span className="block font-normal text-navy-500">/{c.marks}</span>
                </th>
              ))}
              <th className="border border-navy-300 px-1 py-1 text-center">
                Total<span className="block font-normal text-navy-500">/{total}</span>
              </th>
              <th className="border border-navy-300 px-1 py-1 text-center">%</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, i) => (
              <tr key={i} className="h-6">
                <td className="border border-navy-200 px-1 text-navy-500 tabular-nums">{i + 1}</td>
                <td className="border border-navy-200" />
                {columns.map((c) => (
                  <td key={c.label} className="border border-navy-200" />
                ))}
                <td className="border border-navy-200" />
                <td className="border border-navy-200" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-navy-500">Moderated by: ______________________ · Signature: ______________ · Date: ______________</p>
    </section>
  )
}

function ExamPanel({ task, papers }: { task: SbaTask; papers: Paper[] }) {
  const sorted = [...papers].sort((a, b) => (a.kind === b.kind ? (b.year ?? 0) - (a.year ?? 0) : a.kind === 'predicted' ? -1 : 1) || a.paperNumber - b.paperNumber)
  return (
    <div className="space-y-3 p-5 text-sm text-navy-700">
      <p>
        {task.exam === 'final'
          ? 'The NSC final examination is set and marked externally. Use the full papers below for revision and a final mock.'
          : 'Use a full Paper 1 and Paper 2 from Assessments. Each has its complete marking memo and prints in the NSC layout.'}
        {task.exam === 'mid-year' ? ' A mid-year paper should cover only the Term 1 and 2 topics, so choose one whose questions match what you have taught, or drop the questions on later topics.' : ''}
      </p>
      {sorted.length ? (
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {sorted.map((p) => (
            <li key={p.id}>
              <Link to={`../assessments/${p.id}`} relative="path" className="text-gold-700 underline">
                {p.title}
              </Link>
              <span className="text-navy-400"> · {p.totalMarks} marks</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>There are no full papers for this subject and grade yet.</p>
      )}
    </div>
  )
}

/**
 * How the final mark is made up for the grade, and a quick calculator: the
 * final mark from an SBA and an examination mark, and the examination mark a
 * learner needs to reach a target -- the question every learner asks.
 */
function YearMark({ grade, sba, setSba }: { grade: Grade; sba: string; setSba: (v: string) => void }) {
  const split = markSplitFor(grade)
  const [exam, setExam] = useState('')
  const sbaN = Number(sba.replace(',', '.'))
  const examN = Number(exam.replace(',', '.'))
  const valid = (v: string, n: number) => v.trim() !== '' && Number.isFinite(n) && n >= 0 && n <= 100
  const final = valid(sba, sbaN) && valid(exam, examN) ? (sbaN * split.sba + examN * split.exam) / 100 : undefined
  const needed = (target: number) => (target * 100 - sbaN * split.sba) / split.exam
  const round = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')

  return (
    <div className="rounded-lg border border-navy-100 p-3">
      <p className="text-sm font-semibold text-navy-900">
        Grade {grade} final mark: SBA {split.sba}% + {split.examName} {split.exam}%
      </p>
      <div className="mt-2 flex h-3 overflow-hidden rounded-full" aria-hidden>
        <span className="bg-gold-400" style={{ width: `${split.sba}%` }} />
        <span className="bg-navy-700" style={{ width: `${split.exam}%` }} />
      </div>
      <p className="mt-1 text-xs text-navy-500">
        National: {split.source}.{grade === 12 ? '' : ' The June examination is one of the SBA tasks.'}
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-3 text-sm">
        <label className="text-xs font-medium text-navy-500">
          SBA mark (%)
          <input className="input mt-1 w-24" inputMode="decimal" value={sba} onChange={(e) => setSba(e.target.value)} />
        </label>
        <label className="text-xs font-medium text-navy-500">
          Exam mark (%)
          <input className="input mt-1 w-24" inputMode="decimal" value={exam} onChange={(e) => setExam(e.target.value)} placeholder="optional" />
        </label>
        {final !== undefined ? (
          <p className="pb-2 font-semibold text-navy-900">Final mark: {round(final)}%</p>
        ) : null}
      </div>
      {valid(sba, sbaN) ? (
        <p className="mt-2 text-xs text-navy-600">
          With {round(sbaN)}% for SBA, the exam mark needed for a final mark of{' '}
          {[30, 40, 50, 70]
            .map((t) => {
              const n = needed(t)
              return `${t}%: ${n <= 0 ? 'already reached' : n > 100 ? 'not reachable' : `${round(Math.ceil(n * 10) / 10)}%`}`
            })
            .join(' · ')}
        </p>
      ) : null}
    </div>
  )
}

/** A percentage as the programme prints it: 12,5% keeps its decimal comma. */
const pct = (n: number) => `${String(n).replace('.', ',')}%`

/**
 * The Programme of Assessment as a table, with a place to type a learner's
 * mark for each task. The SBA mark is each task's mark over its raw total,
 * times its SBA weight -- the way the DBE programme combines them -- so a
 * teacher can check a learner's SBA mark, or its value so far.
 */
function ProgrammeTable({
  programme,
  marks,
  setMarks,
  onUse,
}: {
  programme: SbaTask[]
  marks: Record<string, number>
  setMarks: (update: (m: Record<string, number>) => Record<string, number>) => void
  onUse: (percent: number) => void
}) {
  const { percent, covered } = sbaMark(programme, marks)
  const round = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')
  return (
    <details className="rounded-lg border border-navy-100 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-navy-900">Programme of Assessment and SBA calculator</summary>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="text-left text-navy-500">
              <th className="border-b border-navy-200 py-1.5 pr-2 font-semibold">Task</th>
              <th className="border-b border-navy-200 py-1.5 pr-2 text-right font-semibold">Out of</th>
              <th className="hidden border-b border-navy-200 py-1.5 pr-2 text-right font-semibold sm:table-cell">Term weight</th>
              <th className="border-b border-navy-200 py-1.5 pr-2 text-right font-semibold">SBA weight</th>
              <th className="border-b border-navy-200 py-1.5 text-right font-semibold">Learner’s mark</th>
            </tr>
          </thead>
          <tbody>
            {programme.map((t) => (
              <tr key={t.key} className="align-middle">
                <td className="border-b border-navy-100 py-1 pr-2 text-navy-900">
                  <span className="text-navy-500">T{t.term} · </span>
                  {t.title}
                  {t.papers ? <span className="block text-navy-500">{t.papers}</span> : null}
                </td>
                <td className="border-b border-navy-100 py-1 pr-2 text-right tabular-nums">{t.marks}</td>
                <td className="hidden border-b border-navy-100 py-1 pr-2 text-right tabular-nums sm:table-cell">
                  {t.termWeight === undefined ? '—' : pct(t.termWeight)}
                </td>
                <td className="border-b border-navy-100 py-1 pr-2 text-right font-semibold tabular-nums">{t.sbaWeight ? pct(t.sbaWeight) : '—'}</td>
                <td className="border-b border-navy-100 py-1 text-right">
                  {t.sbaWeight ? (
                    <input
                      className="input w-16 px-1.5 py-1 text-right text-xs"
                      inputMode="decimal"
                      aria-label={`Mark for ${t.title}, out of ${t.marks}`}
                      placeholder={`/${t.marks}`}
                      value={marks[t.key] ?? ''}
                      onChange={(e) => {
                        const v = e.target.value.replace(',', '.')
                        setMarks((m) => {
                          const next = { ...m }
                          if (v.trim() === '' || !Number.isFinite(Number(v))) delete next[t.key]
                          else next[t.key] = Number(v)
                          return next
                        })
                      }}
                    />
                  ) : (
                    <span className="text-navy-400">exam</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {covered ? (
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <p className="font-semibold text-navy-900">
            SBA mark{covered < 100 ? ' so far' : ''}: {round(percent)}%
            {covered < 100 ? <span className="font-normal text-navy-500"> (from tasks worth {round(covered)}% of the SBA)</span> : null}
          </p>
          <button type="button" className="btn-outline btn-sm" onClick={() => onUse(percent)}>
            Use in the final-mark calculator
          </button>
        </div>
      ) : (
        <p className="mt-2 text-xs text-navy-500">Type a learner’s marks to work out their SBA mark.</p>
      )}
    </details>
  )
}
