import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { linkChoice } from '@/lib/linkChoice'
import { subjects } from '@/data/subjects'
import { topics } from '@/data/topics'
import { atpFor } from '@/data/atp'
import { questionsForSubject } from '@/data/questionBank'
import {
  buildLessonPlan,
  defaultWeeksFor,
  LESSON_LENGTHS,
  marksOf,
  teachableSubtopics,
  weekSpan,
  type Lesson,
  type LessonLength,
  type LessonPlanDoc,
  type TeacherNotes,
} from '@/data/lessonPlans'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { BookIcon, CalendarIcon, PrinterIcon } from '@/components/ui/Icons'
import { MathText } from '@/components/practise/MathText'
import { TreeDiagram, VennDiagram } from '@/components/practise/ProbabilityDiagrams'
import { PrintQuestion } from '@/components/lessons/PrintQuestion'
import { PlanRecordPanel } from '@/components/lessons/PlanRecordPanel'
import { useOptionalAccountAuth } from '@/context/AccountAuthContext'
import type { LessonPlanRecord } from '@/lib/lessonPlanRecords'
import { cn } from '@/lib/utils'
import type { Grade, Question } from '@/types'

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

const teachableSubjects = subjects.filter((s) => topics.some((t) => t.subjectId === s.id))

/**
 * Lesson plans and teacher notes for any week of the Annual Teaching Plan,
 * laid out to print.
 *
 * The teacher picks the week they are teaching, as in the Question Bank, and
 * gets the week's lessons -- objectives, content, timed phases, classwork,
 * homework, support and extension -- followed by teacher notes for the topic.
 * Each lesson starts on a new printed page, so a teacher can print the week
 * once and file a page per lesson, or print just today's.
 *
 * Everything is built by src/data/lessonPlans.ts from the ATP, the topic notes
 * and the question bank; this page only chooses and lays out.
 */
export function TeacherLessonPlans() {
  // A link from the resource centre opens at its subject, grade and ATP week.
  const [params] = useSearchParams()
  const [start] = useState(() => linkChoice(params))
  const [subjectId, setSubjectId] = useState(start.subjectId ?? 'mat-lit')
  const [grade, setGrade] = useState<Grade>(start.grade ?? 12)
  const linkedWeek = useRef(start.week)
  const [weekKey, setWeekKey] = useState('')
  const [lessonMinutes, setLessonMinutes] = useState<LessonLength>(60)
  const [weeksOverride, setWeeksOverride] = useState<number | undefined>()
  const [only, setOnly] = useState<'all' | number>('all')
  const [showPlans, setShowPlans] = useState(true)
  const [showNotes, setShowNotes] = useState(true)
  const [showAnswers, setShowAnswers] = useState(true)
  const [copy, setCopy] = useState<'teacher' | 'learner'>('teacher')
  const [datesOverride, setDatesOverride] = useState<string | undefined>()
  const [questions, setQuestions] = useState<Question[] | null>(null)
  // A signed-in teacher can record the week for their HOD; the demo cannot.
  const profile = useOptionalAccountAuth()?.profile
  // A record opened from the teacher's list, waiting for its subject and grade to load.
  const opening = useRef<LessonPlanRecord | null>(null)

  const atp = atpFor(subjectId, grade)

  useEffect(() => {
    let live = true
    setQuestions(null)
    questionsForSubject(subjectId).then((qs) => {
      if (live) setQuestions(qs)
    })
    return () => {
      live = false
    }
  }, [subjectId])

  // A new subject or grade has a different plan: start again from its first teaching week.
  useEffect(() => {
    const r = opening.current
    if (r && r.subject_id === subjectId && r.grade === grade) {
      opening.current = null
      showRecord(r)
      return
    }
    const first = atp?.weeks.findIndex((w) => w.topicId) ?? -1
    const linked = linkedWeek.current
    linkedWeek.current = undefined
    setWeekKey(linked !== undefined && atp?.weeks[linked] ? String(linked) : first >= 0 ? String(first) : '')
    setWeeksOverride(undefined)
    setDatesOverride(undefined)
    setOnly('all')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, grade])

  // Put a recorded week back on the screen exactly as the teacher planned it.
  function showRecord(r: LessonPlanRecord) {
    setWeekKey(String(r.week_index))
    setWeeksOverride(r.weeks ?? undefined)
    if ((LESSON_LENGTHS as readonly number[]).includes(r.lesson_minutes)) setLessonMinutes(r.lesson_minutes as LessonLength)
    setDatesOverride(r.dates || undefined)
    setOnly('all')
  }

  const openRecord = (r: LessonPlanRecord) => {
    if (r.subject_id === subjectId && r.grade === grade) showRecord(r)
    else {
      opening.current = r
      setSubjectId(r.subject_id)
      setGrade(r.grade)
    }
  }

  const weekIndex = weekKey === '' ? -1 : Number(weekKey)
  const week = atp && weekIndex >= 0 ? atp.weeks[weekIndex] : undefined
  // A provincial ATP fixes the weeks; a suggested plan's weeks are the teacher's to change.
  const adjustable = atp?.detail !== 'week' && !!week?.topicId
  const suggestedWeeks =
    (week && weekSpan(week.weeks)) ??
    (atp && week && questions ? defaultWeeksFor(teachableSubtopics(atp, weekIndex, grade, questions).length) : 1)

  const plan: LessonPlanDoc | undefined = useMemo(() => {
    if (!atp || weekIndex < 0 || !questions) return undefined
    return buildLessonPlan({ atp, weekIndex, grade, questions, lessonMinutes, weeksOverride })
  }, [atp, weekIndex, grade, questions, lessonMinutes, weeksOverride])

  const lessons = plan ? (only === 'all' ? plan.lessons : plan.lessons.filter((l) => l.number === only)) : []
  // The teacher can write in their own dates; the plan's are printed otherwise.
  const shown = plan && datesOverride !== undefined ? { ...plan, when: datesOverride || plan.when } : plan

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Lesson plans"
        title="Lesson plans and teacher notes for the week"
        description="Choose the week you are teaching. You get a plan for every lesson in the week, with timed activities, classwork, homework and support ideas, followed by teacher notes on the topic. Print it all or just one lesson."
      />

      <div className="card space-y-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="lp-subject">
              Subject
            </label>
            <select id="lp-subject" className="select mt-1" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {teachableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="lp-grade">
              Grade
            </label>
            <select id="lp-grade" className="select mt-1" value={grade} onChange={(e) => setGrade(Number(e.target.value) as Grade)}>
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
              <option value={12}>Grade 12</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="lp-length">
              Period length
            </label>
            <select
              id="lp-length"
              className="select mt-1"
              value={lessonMinutes}
              onChange={(e) => setLessonMinutes(Number(e.target.value) as LessonLength)}
            >
              {LESSON_LENGTHS.map((m) => (
                <option key={m} value={m}>
                  {m} minutes
                </option>
              ))}
            </select>
          </div>
          {adjustable ? (
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="lp-weeks">
                Weeks for this topic
              </label>
              <select
                id="lp-weeks"
                className="select mt-1"
                value={weeksOverride ?? suggestedWeeks}
                onChange={(e) => {
                  const n = Number(e.target.value)
                  setWeeksOverride(n === suggestedWeeks ? undefined : n)
                  setOnly('all')
                }}
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'week' : 'weeks'}
                    {n === suggestedWeeks ? ' (suggested)' : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        {atp ? (
          <div>
            <label className="text-xs font-medium text-navy-500" htmlFor="lp-week">
              What are you teaching?
            </label>
            <select
              id="lp-week"
              className="select mt-1"
              value={weekKey}
              onChange={(e) => {
                setWeekKey(e.target.value)
                setWeeksOverride(undefined)
                setDatesOverride(undefined)
                setOnly('all')
              }}
            >
              {[1, 2, 3, 4].map((term) => (
                <optgroup key={term} label={`Term ${term}`}>
                  {atp.weeks.map((w, i) =>
                    w.term === term ? (
                      <option key={i} value={String(i)}>
                        {w.dates ? `Week ${w.weeks} (${w.dates})` : w.weeks} — {w.label}
                      </option>
                    ) : null,
                  )}
                </optgroup>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-navy-400">
              {atp.source}
              {atp.detail === 'suggested'
                ? ' · the weeks and dates are a suggestion. Change the weeks for the topic and type your own dates to match your school’s plan.'
                : ''}
            </p>
          </div>
        ) : (
          <p className="text-sm text-navy-500">There is no teaching plan for this subject and grade yet.</p>
        )}

        {plan && !plan.examOnly ? (
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3 border-t border-navy-100 pt-4">
            <div>
              <label className="text-xs font-medium text-navy-500" htmlFor="lp-only">
                Lessons
              </label>
              <select
                id="lp-only"
                className="select mt-1"
                value={String(only)}
                onChange={(e) => setOnly(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              >
                <option value="all">All {plan.lessons.length} lessons</option>
                {plan.lessons.map((l) => (
                  <option key={l.number} value={l.number}>
                    Lesson {l.number}: {l.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[min(16rem,100%)]">
              <label className="text-xs font-medium text-navy-500" htmlFor="lp-dates">
                Dates printed on the plan
              </label>
              <input
                id="lp-dates"
                className="input mt-1"
                value={datesOverride ?? plan.when}
                onChange={(e) => setDatesOverride(e.target.value)}
                placeholder="e.g. 3 Feb – 21 Feb"
              />
            </div>
            <div>
              <span className="text-xs font-medium text-navy-500">Print</span>
              <div className="mt-1 flex rounded-lg border border-navy-200 bg-white p-1" role="group" aria-label="Which copy">
                {(['teacher', 'learner'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={copy === c}
                    onClick={() => setCopy(c)}
                    className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', copy === c ? 'bg-navy-900 text-white' : 'text-navy-600')}
                  >
                    {c === 'teacher' ? 'Teacher plan' : 'Learner handout'}
                  </button>
                ))}
              </div>
            </div>
            <fieldset className={cn('flex flex-wrap gap-x-5 gap-y-2 pb-2 text-sm text-navy-700', copy === 'learner' && 'hidden')}>
              <legend className="sr-only">What to include</legend>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={showPlans} onChange={(e) => setShowPlans(e.target.checked)} /> Lesson plans
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={showNotes} onChange={(e) => setShowNotes(e.target.checked)} /> Teacher notes
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} /> Answers and memos
              </label>
            </fieldset>
            <button type="button" onClick={() => window.print()} className="btn-primary ml-auto inline-flex items-center gap-2">
              <PrinterIcon className="h-4 w-4" /> Print / Save PDF
            </button>
          </div>
        ) : null}
      </div>

      {profile?.role === 'teacher' && plan && shown && !plan.examOnly ? (
        <PlanRecordPanel
          profile={profile}
          plan={plan}
          subjectId={subjectId}
          grade={grade}
          weekIndex={weekIndex}
          weeksOverride={weeksOverride}
          lessonMinutes={lessonMinutes}
          dates={shown.when}
          onOpen={openRecord}
        />
      ) : null}

      {!atp ? null : !questions ? (
        <p className="text-sm text-navy-500">Loading the question bank…</p>
      ) : !plan ? (
        <EmptyState icon={<CalendarIcon className="h-6 w-6" />} title="Choose a week" description="Pick the week you are teaching to see its lesson plans." />
      ) : plan.examOnly ? (
        <EmptyState
          icon={<CalendarIcon className="h-6 w-6" />}
          title="Examination week"
          description="There are no lessons to plan in an examination week. Choose a revision week for revision lessons."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="print-area p-5 sm:p-8">
            {copy === 'learner' && shown ? (
              lessons.map((l, i) => <LearnerSheet key={l.number} plan={shown} lesson={l} first={i === 0} />)
            ) : shown ? (
              <>
                <PlanCover plan={shown} lessons={lessons} />
                {showPlans ? lessons.map((l) => <LessonPage key={l.number} plan={shown} lesson={l} showAnswers={showAnswers} />) : null}
                {showNotes ? shown.notes.map((n) => <NotesPages key={n.topicId} plan={shown} notes={n} />) : null}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

function DocHeader({ plan, title }: { plan: LessonPlanDoc; title: string }) {
  return (
    <div className="border-b-2 border-navy-900 pb-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">
        DONE WELL® {plan.subjectName} · Grade {plan.grade} · Term {plan.term}
        {plan.when === `Term ${plan.term}` ? '' : ` · ${plan.when}`}
      </p>
      <h2 className="mt-1 text-lg font-bold text-navy-900 [text-wrap:balance]">{title}</h2>
    </div>
  )
}

export function PlanCover({ plan, lessons }: { plan: LessonPlanDoc; lessons: Lesson[] }) {
  return (
    <section className="print-avoid-break">
      <DocHeader plan={plan} title={`${plan.label}${plan.topicName && plan.topicName !== plan.label ? ` — ${plan.topicName}` : ''}`} />
      <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        <Row label="Time">
          {plan.weeks} {plan.weeks === 1 ? 'week' : 'weeks'} × {String(plan.hoursPerWeek).replace('.', ',')} hours (CAPS) → {plan.lessons.length} lessons of {plan.lessonMinutes} minutes
        </Row>
        <Row label="Teaching plan">{plan.source}</Row>
        {plan.subtopics.length ? <Row label="CAPS sub-topics">{plan.subtopics.join(' · ')}</Row> : null}
        {plan.note ? <Row label="ATP note">{plan.note}</Row> : null}
      </dl>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-200 text-left text-xs uppercase tracking-wide text-navy-500">
              <th className="py-1.5 pr-3 font-semibold">Lesson</th>
              <th className="py-1.5 pr-3 font-semibold">Sub-topic</th>
              <th className="py-1.5 pr-3 font-semibold">Focus</th>
              <th className="py-1.5 pr-3 text-right font-semibold">Classwork</th>
              <th className="py-1.5 font-semibold">Date taught</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.number} className="border-b border-navy-100 align-top">
                <td className="py-1.5 pr-3 tabular-nums">{l.number}</td>
                <td className="py-1.5 pr-3">{l.title}</td>
                <td className="py-1.5 pr-3 text-navy-600">{l.focus}</td>
                <td className="py-1.5 pr-3 text-right tabular-nums text-navy-600">
                  {l.classwork.length ? `${l.classwork.length} q · ${plural(marksOf(l.classwork), 'mark')}` : '—'}
                </td>
                <td className="py-1.5 text-navy-300">______________</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 font-semibold text-navy-700">{label}</dt>
      <dd className="min-w-0 text-navy-700">{children}</dd>
    </div>
  )
}

function Heading({ children }: { children: ReactNode }) {
  return <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-navy-500">{children}</h4>
}

function LessonPage({ plan, lesson, showAnswers }: { plan: LessonPlanDoc; lesson: Lesson; showAnswers: boolean }) {
  return (
    <section className="print-break-before mt-10 border-t border-dashed border-navy-200 pt-6 print:mt-0 print:border-0 print:pt-0">
      <DocHeader plan={plan} title={`Lesson ${lesson.number}: ${lesson.title}`} />
      <p className="mt-1.5 text-sm text-navy-600">
        <span className={cn('rounded px-1.5 py-0.5 text-xs font-semibold', 'bg-gold-50 text-gold-800')}>{lesson.focus}</span>
        <span className="ml-2">{plan.lessonMinutes} minutes · Date: ______________ · Class: ________</span>
      </p>

      <Heading>Lesson objectives</Heading>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-navy-800">
        {lesson.objectives.map((o, i) => (
          <li key={i}>
            <MathText>{o}</MathText>
          </li>
        ))}
      </ul>

      {lesson.content.length ? (
        <>
          <Heading>Content to teach</Heading>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-navy-800">
            {lesson.content.map((c, i) => (
              <li key={i}>
                <MathText>{c}</MathText>
              </li>
            ))}
          </ol>
        </>
      ) : null}

      {lesson.example ? (
        <div className="print-avoid-break mt-3 rounded-lg bg-navy-50 p-3 text-sm">
          <p className="font-semibold text-navy-900">
            Worked example: <MathText>{lesson.example.problem}</MathText>
          </p>
          <ol className="mt-1.5 list-decimal space-y-0.5 pl-5 text-navy-700">
            {lesson.example.steps.map((s, i) => (
              <li key={i}>
                <MathText>{s}</MathText>
              </li>
            ))}
          </ol>
          <p className="mt-1.5 font-semibold text-navy-900">
            Answer: <MathText>{lesson.example.answer}</MathText>
          </p>
        </div>
      ) : null}

      <Heading>Lesson phases</Heading>
      <div className="mt-1 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-navy-200 text-left text-xs uppercase tracking-wide text-navy-500">
              <th className="w-32 py-1.5 pr-3 font-semibold">Phase</th>
              <th className="py-1.5 pr-3 font-semibold">Teacher</th>
              <th className="py-1.5 font-semibold">Learners</th>
            </tr>
          </thead>
          <tbody>
            {lesson.phases.map((p) => (
              <tr key={p.name} className="print-avoid-break border-b border-navy-100 align-top">
                <td className="py-1.5 pr-3 font-semibold text-navy-800">
                  {p.name}
                  <span className="block text-xs font-normal tabular-nums text-navy-500">{p.minutes} min</span>
                </td>
                <td className="py-1.5 pr-3 text-navy-700">
                  <ul className="list-disc space-y-0.5 pl-4">
                    {p.teacher.map((t, i) => (
                      <li key={i}>
                        <MathText>{t}</MathText>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-1.5 text-navy-700">
                  <ul className="list-disc space-y-0.5 pl-4">
                    {p.learners.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lesson.warmUp ? (
        <>
          <Heading>Warm-up</Heading>
          <div className="mt-1.5">
            <PrintQuestion question={lesson.warmUp} number="Warm-up" showAnswer={showAnswers} />
          </div>
        </>
      ) : null}

      <Heading>
        {lesson.focus === 'Consolidate and assess' ? 'Informal class test' : 'Classwork'}
        {lesson.classwork.length ? ` · ${plural(marksOf(lesson.classwork), 'mark')}` : ''}
      </Heading>
      {lesson.classwork.length ? (
        <div className="mt-1.5 space-y-3">
          {lesson.classwork.map((q, i) => (
            <PrintQuestion key={q.id} question={q} number={`Question ${i + 1}`} showAnswer={showAnswers} />
          ))}
        </div>
      ) : (
        <p className="mt-1 text-sm text-navy-600">
          The question bank has no questions on this sub-topic for this grade yet. Set a textbook exercise: ______________________
        </p>
      )}

      {lesson.homework.length ? (
        <>
          <Heading>Homework · {plural(marksOf(lesson.homework), 'mark')}</Heading>
          <div className="mt-1.5 space-y-3">
            {lesson.homework.map((q, i) => (
              <PrintQuestion key={q.id} question={q} number={`Homework ${i + 1}`} showAnswer={showAnswers} />
            ))}
          </div>
        </>
      ) : null}

      <div className="print-avoid-break">
        <Heading>Differentiation</Heading>
        <dl className="mt-1 space-y-1 text-sm">
          <Row label="Support">{lesson.support}</Row>
          <Row label="Extension">{lesson.extension}</Row>
        </dl>

        <Heading>Reflection (after the lesson)</Heading>
        <div className="mt-1 space-y-3 text-sm text-navy-600">
          <p>Objectives met? Yes / Partly / No · Learners who need support: ________________________________</p>
          <p>What to change next time: ______________________________________________________________</p>
        </div>
      </div>
    </section>
  )
}

function NotesPages({ plan, notes }: { plan: LessonPlanDoc; notes: TeacherNotes }) {
  return (
    <section className="print-break-before mt-10 border-t border-dashed border-navy-200 pt-6 print:mt-0 print:border-0 print:pt-0">
      <DocHeader plan={plan} title={`Teacher notes: ${notes.topicName}`} />
      <p className="mt-2 text-sm text-navy-700">{notes.summary}</p>

      <Heading>Key ideas</Heading>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-navy-800">
        {notes.keyIdeas.map((k, i) => (
          <li key={i}>
            <MathText>{k}</MathText>
          </li>
        ))}
      </ul>

      {notes.subtopics.map((s) => (
        <div key={s.name} className="print-avoid-break mt-3 rounded-lg border border-navy-100 p-3">
          <h5 className="text-sm font-bold text-navy-900">{s.name}</h5>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-navy-700">
            {s.points.map((p, i) => (
              <li key={i}>
                <MathText>{p}</MathText>
              </li>
            ))}
          </ul>
          {s.tree ? <TreeDiagram spec={s.tree} /> : null}
          {s.venn ? <VennDiagram spec={s.venn} /> : null}
        </div>
      ))}

      {notes.formulae.length ? (
        <>
          <Heading>Formulae and definitions learners must know</Heading>
          <ul className="mt-1 space-y-1 text-sm">
            {notes.formulae.map((f, i) => (
              <li key={i} className="rounded bg-navy-50 px-2 py-1 font-medium text-navy-800">
                <MathText>{f}</MathText>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {notes.commonMistakes.length ? (
        <>
          <Heading>Common mistakes to address</Heading>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-navy-800">
            {notes.commonMistakes.map((m, i) => (
              <li key={i}>
                <MathText>{m}</MathText>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <Heading>Worked examples</Heading>
      <div className="mt-1.5 space-y-3">
        {notes.examples.map((ex, i) => (
          <div key={i} className="print-avoid-break rounded-lg bg-navy-50 p-3 text-sm">
            <p className="font-semibold text-navy-900">
              {i + 1}. <MathText>{ex.problem}</MathText>
            </p>
            <ol className="mt-1.5 list-decimal space-y-0.5 pl-5 text-navy-700">
              {ex.steps.map((s, j) => (
                <li key={j}>
                  <MathText>{s}</MathText>
                </li>
              ))}
            </ol>
            <p className="mt-1.5 font-semibold text-navy-900">
              Answer: <MathText>{ex.answer}</MathText>
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-xs text-navy-400">
        <BookIcon className="h-3.5 w-3.5" /> Built from the CAPS topic notes and question bank in DONE WELL. Adapt it to your class.
      </p>
    </section>
  )
}

/** Writing lines under a question: roughly one line per mark, between two and eight. */
function AnswerSpace({ marks }: { marks: number }) {
  const lines = Math.min(8, Math.max(2, marks))
  return (
    <div className="mt-2" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="h-7 border-b border-navy-200" />
      ))}
    </div>
  )
}

/**
 * The learner's copy of a lesson: the same questions as the teacher's plan,
 * with room to write and no answers, levels or teaching notes. One lesson to a
 * sheet, so a teacher can run off a class set of just today's.
 */
function LearnerSheet({ plan, lesson, first }: { plan: LessonPlanDoc; lesson: Lesson; first: boolean }) {
  const work = lesson.classwork
  const test = lesson.focus === 'Consolidate and assess'
  return (
    <section className={cn(!first && 'print-break-before mt-10 border-t border-dashed border-navy-200 pt-6 print:mt-0 print:border-0 print:pt-0')}>
      <div className="border-b-2 border-navy-900 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">
          DONE WELL® {plan.subjectName} · Grade {plan.grade}
        </p>
        <h2 className="mt-1 text-lg font-bold text-navy-900 [text-wrap:balance]">
          {test ? 'Class test' : 'Classwork'}: {lesson.title}
        </h2>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-700">
        <span>Name: ______________________________</span>
        <span>Class: ________</span>
        <span>Date: ______________</span>
        {work.length ? <span className="font-semibold">Total: {plural(marksOf(work), 'mark')}</span> : null}
      </div>

      {lesson.warmUp ? (
        <div className="mt-4">
          <Heading>Warm-up</Heading>
          <div className="mt-1.5">
            <LearnerQuestion question={lesson.warmUp} number="Warm-up" />
          </div>
        </div>
      ) : null}

      {work.length ? (
        <div className="mt-4">
          <Heading>{test ? 'Answer all the questions' : 'Classwork'}</Heading>
          <div className="mt-1.5 space-y-4">
            {work.map((q, i) => (
              <LearnerQuestion key={q.id} question={q} number={`Question ${i + 1}`} />
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-navy-600">Your teacher will give you the exercise for this lesson.</p>
      )}

      {lesson.homework.length ? (
        <div className="mt-5">
          <Heading>Homework</Heading>
          <div className="mt-1.5 space-y-4">
            {lesson.homework.map((q, i) => (
              <LearnerQuestion key={q.id} question={q} number={`Homework ${i + 1}`} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function LearnerQuestion({ question, number }: { question: Question; number: string }) {
  return (
    <div className="print-avoid-break">
      <PrintQuestion question={question} number={number} showAnswer={false} learner />
      {question.options?.length ? null : <AnswerSpace marks={question.marks} />}
    </div>
  )
}
