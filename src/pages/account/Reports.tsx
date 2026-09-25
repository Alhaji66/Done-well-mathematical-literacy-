import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { supabase } from '@/lib/supabaseClient'
import { subjects } from '@/data/subjects'
import { getTopic, topicsForSubject } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { DownloadIcon, PrinterIcon } from '@/components/ui/Icons'
import { classesInView, fetchClassMembers, fetchClasses, type ClassMember, type SchoolClass } from '@/lib/classes'
import {
  averageMastery,
  fetchProgressForLearners,
  fetchSchoolLearners,
  type RosterLearner,
  type RosterProgressRow,
} from '@/lib/teacherRoster'
import { fetchSchoolTeachers, type SchoolTeacher } from '@/lib/schoolStaff'
import { learnersInScope, progressInScope, scopeSubjectFor } from '@/lib/teacherScope'
import { fetchAttemptsForTest, fetchTestsForSchool, type TestAttempt, type WeeklyTest } from '@/lib/weeklyTests'
import { fetchMistakes, type Mistake } from '@/lib/mistakes'
import { fetchParticipation, type Participation } from '@/lib/activity'
import {
  attemptPercent,
  fetchInterventionLearners,
  fetchInterventions,
  outcomesFor,
  type Intervention,
  type InterventionLearner,
} from '@/lib/interventions'

type Kind = 'school' | 'class' | 'learner'

const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id
const pctText = (v: number | null | undefined) => (v === null || v === undefined ? '—' : `${v}%`)
const mean = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null)

/** Turn rows into a CSV file and hand it to the browser. */
function downloadCsv(filename: string, header: string[], rows: (string | number | null)[][]) {
  const cell = (v: string | number | null) => {
    const s = v === null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const text = [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([`﻿${text}`], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Reports a school can print, file or send home: a school summary, a class
 * report and a learner report. Each is the same data the app already shows,
 * laid out for paper -- "Print" uses the browser's own print, which also saves
 * as PDF -- and the tables download as CSV for a spreadsheet.
 *
 * A report shows only what its reader may already see; every figure comes
 * through the same access rules as the rest of the app.
 */
export function Reports() {
  const { profile } = useAccountAuth()
  const schoolId = profile?.school_id ?? null
  const leader = profile?.role === 'school' || profile?.role === 'hod'

  const [kind, setKind] = useState<Kind>(leader ? 'school' : 'class')
  const [classId, setClassId] = useState('')
  const [learnerId, setLearnerId] = useState('')

  const [schoolName, setSchoolName] = useState('')
  const [learners, setLearners] = useState<RosterLearner[]>([])
  const [progress, setProgress] = useState<RosterProgressRow[]>([])
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [members, setMembers] = useState<ClassMember[]>([])
  const [staff, setStaff] = useState<SchoolTeacher[]>([])
  const [tests, setTests] = useState<WeeklyTest[]>([])
  const [attempts, setAttempts] = useState<Record<string, TestAttempt[]>>({})
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [week, setWeek] = useState<Map<string, Participation> | null>(null)
  const [groups, setGroups] = useState<Intervention[]>([])
  const [groupMembers, setGroupMembers] = useState<InterventionLearner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!schoolId || !profile) {
      setLoading(false)
      return
    }
    let active = true
    ;(async () => {
      const scope = scopeSubjectFor(profile)
      const [roster, cl, teachers, schoolTests, iv, part] = await Promise.all([
        fetchSchoolLearners(schoolId),
        fetchClasses(schoolId),
        fetchSchoolTeachers(schoolId),
        fetchTestsForSchool(schoolId),
        fetchInterventions(schoolId),
        fetchParticipation(7),
      ])
      if (supabase) {
        const { data } = await supabase.from('schools').select('name').eq('id', schoolId).maybeSingle()
        if (active) setSchoolName(data?.name ?? '')
      }
      const mine = learnersInScope(roster, scope)
      const ids = mine.map((l) => l.id)
      const [rows, clMembers, mis, ivMembers] = await Promise.all([
        fetchProgressForLearners(ids),
        fetchClassMembers(cl.classes.map((c) => c.id)),
        fetchMistakes(ids),
        fetchInterventionLearners(iv.interventions.map((i) => i.id)),
      ])
      const byTest: Record<string, TestAttempt[]> = {}
      await Promise.all(schoolTests.map(async (t) => (byTest[t.id] = await fetchAttemptsForTest(t.id))))
      if (!active) return
      setLearners(mine)
      setProgress(progressInScope(rows, scope))
      setClasses(classesInView(profile, cl.classes))
      setMembers(clMembers)
      setStaff(teachers)
      setTests(scope ? schoolTests.filter((t) => t.subject_id === scope) : schoolTests)
      setAttempts(byTest)
      setMistakes(mis.mistakes.filter((m) => !m.resolved_at))
      setWeek(part)
      setGroups(scope ? iv.interventions.filter((i) => i.subject_id === scope) : iv.interventions)
      setGroupMembers(ivMembers)
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [schoolId, profile])

  // Sensible first choices once the data is in.
  useEffect(() => {
    if (!classId && classes[0]) setClassId(classes[0].id)
    if (!learnerId && learners[0]) setLearnerId([...learners].sort((a, b) => a.full_name.localeCompare(b.full_name))[0].id)
  }, [classes, learners, classId, learnerId])

  const latestTestPct = (id: string, testList: WeeklyTest[]) => {
    const sorted = [...testList].sort((a, b) => b.due_at.localeCompare(a.due_at))
    for (const t of sorted) {
      const a = (attempts[t.id] ?? []).find((x) => x.learner_id === id && x.submitted_at)
      if (a) return attemptPercent(a)
    }
    return null
  }

  const learnerRow = (l: RosterLearner, testList: WeeklyTest[]) => ({
    learner: l,
    mastery: averageMastery(l.id, progress),
    activeDays: week?.get(l.id)?.active_days ?? 0,
    answers: week?.get(l.id)?.answers ?? 0,
    openMistakes: mistakes.filter((m) => m.learner_id === l.id).length,
    latestTest: latestTestPct(l.id, testList),
  })

  const today = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
  const sortedLearners = useMemo(() => [...learners].sort((a, b) => a.full_name.localeCompare(b.full_name)), [learners])

  if (!profile) return null

  const picker = (
    <div className="card flex flex-wrap items-end gap-3 p-5 print:hidden">
      <label className="text-xs font-medium text-navy-500">
        Report
        <select className="select mt-1" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
          {leader ? <option value="school">{profile.role === 'hod' ? 'Department summary' : 'School summary'}</option> : null}
          <option value="class">Class report</option>
          <option value="learner">Learner report</option>
        </select>
      </label>
      {kind === 'class' ? (
        <label className="text-xs font-medium text-navy-500">
          Class
          <select className="select mt-1" value={classId} onChange={(e) => setClassId(e.target.value)}>
            {classes.length === 0 ? <option value="">No classes yet</option> : null}
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {kind === 'learner' ? (
        <label className="text-xs font-medium text-navy-500">
          Learner
          <select className="select mt-1" value={learnerId} onChange={(e) => setLearnerId(e.target.value)}>
            {sortedLearners.map((l) => (
              <option key={l.id} value={l.id}>
                {l.full_name}
                {l.grade ? ` (Gr ${l.grade})` : ''}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <button type="button" onClick={() => window.print()} className="btn-primary inline-flex items-center gap-1.5">
        <PrinterIcon className="h-4 w-4" /> Print or save as PDF
      </button>
    </div>
  )

  const header = (title: string, sub: string) => (
    <header className="border-b border-navy-200 pb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">DONE WELL · {schoolName || 'Your school'}</p>
      <h2 className="mt-1 text-xl font-bold text-navy-900">{title}</h2>
      <p className="mt-0.5 text-sm text-navy-600">
        {sub} · produced {today}
      </p>
    </header>
  )

  const csvButton = (onClick: () => void) => (
    <button type="button" onClick={onClick} className="btn-outline btn-sm inline-flex items-center gap-1.5 print:hidden">
      <DownloadIcon className="h-4 w-4" /> Download CSV
    </button>
  )

  const learnerTable = (rows: ReturnType<typeof learnerRow>[], filename: string) => (
    <section className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-navy-900">Learners</h3>
        {csvButton(() =>
          downloadCsv(
            filename,
            ['Learner', 'Grade', 'Mastery %', 'Days active (7d)', 'Questions (7d)', 'Open mistakes', 'Latest test %'],
            rows.map((r) => [r.learner.full_name, r.learner.grade, r.mastery, r.activeDays, r.answers, r.openMistakes, r.latestTest]),
          ),
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-sm">
          <thead>
            <tr className="border-b border-navy-200 text-left text-xs text-navy-500">
              <th className="py-2 font-medium">Learner</th>
              <th className="py-2 text-right font-medium">Mastery</th>
              <th className="py-2 text-right font-medium">Days active</th>
              <th className="py-2 text-right font-medium">Questions</th>
              <th className="py-2 text-right font-medium">Open mistakes</th>
              <th className="py-2 text-right font-medium">Latest test</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100 tabular-nums">
            {rows.map((r) => (
              <tr key={r.learner.id} className="print-avoid-break">
                <td className="py-1.5 text-navy-900">{r.learner.full_name}</td>
                <td className="py-1.5 text-right">{pctText(r.mastery)}</td>
                <td className="py-1.5 text-right">{r.activeDays}</td>
                <td className="py-1.5 text-right">{r.answers}</td>
                <td className="py-1.5 text-right">{r.openMistakes}</td>
                <td className="py-1.5 text-right">{pctText(r.latestTest)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-navy-500">Days active and questions are for the last 7 days. Mastery is practice mastery in the subject.</p>
    </section>
  )

  const topicTable = (subjectId: string, grade: number, ids: string[]) => {
    const rows = topicsForSubject(subjectId, grade as 10 | 11 | 12)
      .map((t) => {
        const vals = progress.filter((p) => p.topic_id === t.id && ids.includes(p.learner_id)).map((p) => p.mastery_percent)
        return { topic: t.name, n: vals.length, avg: mean(vals) }
      })
      .filter((r) => r.n > 0)
    if (!rows.length) return <p className="text-sm text-navy-500">No practice recorded on this subject's topics yet.</p>
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy-200 text-left text-xs text-navy-500">
            <th className="py-2 font-medium">Topic</th>
            <th className="py-2 text-right font-medium">Learners practised</th>
            <th className="py-2 text-right font-medium">Average mastery</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100 tabular-nums">
          {rows.map((r) => (
            <tr key={r.topic} className="print-avoid-break">
              <td className="py-1.5 text-navy-900">{r.topic}</td>
              <td className="py-1.5 text-right">{r.n}</td>
              <td className={`py-1.5 text-right ${r.avg !== null && r.avg < 50 ? 'font-semibold text-rose-700' : ''}`}>{pctText(r.avg)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  // ------------------------------------------------------------- the reports
  let report: ReactNode = null

  if (kind === 'school' && leader) {
    const perGrade = [10, 11, 12]
      .map((g) => {
        const inGrade = learners.filter((l) => l.grade === g)
        const m = mean(inGrade.map((l) => averageMastery(l.id, progress)).filter((v): v is number => v !== null))
        const act = inGrade.filter((l) => week?.has(l.id)).length
        return { grade: g, learners: inGrade.length, classes: classes.filter((c) => c.grade === g).length, mastery: m, active: act }
      })
      .filter((g) => g.learners > 0)
    const groupStats = groups.map((iv) => {
      const outs = outcomesFor(
        groupMembers.filter((m) => m.intervention_id === iv.id),
        tests.filter((t) => t.intervention_id === iv.id),
        attempts,
      ).filter((o) => o.change !== null)
      return { iv, measured: outs.length, improved: outs.filter((o) => (o.change ?? 0) > 0).length }
    })
    const measured = groupStats.reduce((s, g) => s + g.measured, 0)
    const improved = groupStats.reduce((s, g) => s + g.improved, 0)
    const scope = scopeSubjectFor(profile)
    report = (
      <div className="print-area card space-y-6 p-6">
        {header(
          scope ? `${subjectName(scope)} department summary` : 'School summary',
          `${learners.length} learners · ${staff.length} teaching staff · ${classes.length} classes`,
        )}
        <section className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold text-navy-900">By grade</h3>
            {csvButton(() =>
              downloadCsv(
                'school-summary-by-grade.csv',
                ['Grade', 'Learners', 'Classes', 'Average mastery %', 'Active this week', 'Participation %'],
                perGrade.map((g) => [g.grade, g.learners, g.classes, g.mastery, g.active, Math.round((g.active / g.learners) * 100)]),
              ),
            )}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-left text-xs text-navy-500">
                <th className="py-2 font-medium">Grade</th>
                <th className="py-2 text-right font-medium">Learners</th>
                <th className="py-2 text-right font-medium">Classes</th>
                <th className="py-2 text-right font-medium">Average mastery</th>
                <th className="py-2 text-right font-medium">Active this week</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 tabular-nums">
              {perGrade.map((g) => (
                <tr key={g.grade}>
                  <td className="py-1.5 text-navy-900">Grade {g.grade}</td>
                  <td className="py-1.5 text-right">{g.learners}</td>
                  <td className="py-1.5 text-right">{g.classes}</td>
                  <td className="py-1.5 text-right">{pctText(g.mastery)}</td>
                  <td className="py-1.5 text-right">
                    {g.active} ({Math.round((g.active / g.learners) * 100)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="space-y-1">
          <h3 className="font-bold text-navy-900">Catch-up groups</h3>
          <p className="text-sm text-navy-700">
            {groups.filter((g) => g.status === 'active').length} running, {groups.filter((g) => g.status === 'completed').length}{' '}
            completed.{' '}
            {measured
              ? `Of ${measured} learner${measured === 1 ? '' : 's'} reassessed, ${improved} improved on their starting point.`
              : 'No learner has been reassessed yet.'}
          </p>
        </section>
        <section className="space-y-1">
          <h3 className="font-bold text-navy-900">Weekly tests</h3>
          <p className="text-sm text-navy-700">
            {tests.length} set.{' '}
            {(() => {
              const handed = tests.reduce((s, t) => s + (attempts[t.id] ?? []).filter((a) => a.submitted_at).length, 0)
              return `${handed} handed in altogether.`
            })()}
          </p>
        </section>
      </div>
    )
  }

  if (kind === 'class') {
    const cls = classes.find((c) => c.id === classId)
    if (cls) {
      const ids = members.filter((m) => m.class_id === cls.id).map((m) => m.learner_id)
      const inClass = sortedLearners.filter((l) => ids.includes(l.id))
      const classTests = tests.filter((t) => t.class_id === cls.id || (!t.class_id && !t.intervention_id && t.grade === cls.grade && t.subject_id === cls.subject_id))
      const rows = inClass.map((l) => learnerRow(l, classTests))
      const teacher = staff.find((s) => s.id === cls.teacher_id)?.full_name ?? (cls.teacher_id === profile.id ? profile.full_name : '—')
      const avg = mean(rows.map((r) => r.mastery).filter((v): v is number => v !== null))
      const act = rows.filter((r) => r.activeDays > 0).length
      report = (
        <div className="print-area card space-y-6 p-6">
          {header(`${cls.name} — class report`, `Grade ${cls.grade} ${subjectName(cls.subject_id)} · class teacher ${teacher}`)}
          <dl className="grid grid-cols-3 gap-4">
            <div>
              <dt className="text-xs text-navy-500">Learners</dt>
              <dd className="text-xl font-bold tabular-nums text-navy-900">{rows.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-navy-500">Average mastery</dt>
              <dd className="text-xl font-bold tabular-nums text-navy-900">{pctText(avg)}</dd>
            </div>
            <div>
              <dt className="text-xs text-navy-500">Active this week</dt>
              <dd className="text-xl font-bold tabular-nums text-navy-900">
                {act}/{rows.length}
              </dd>
            </div>
          </dl>
          <section className="space-y-2">
            <h3 className="font-bold text-navy-900">Topics</h3>
            {topicTable(cls.subject_id, cls.grade, ids)}
          </section>
          {learnerTable(rows, `${cls.name.replace(/[^\w-]+/g, '-')}-class-report.csv`)}
        </div>
      )
    } else {
      report = <p className="text-sm text-navy-500">Create a class first, on the Classes page.</p>
    }
  }

  if (kind === 'learner') {
    const l = learners.find((x) => x.id === learnerId)
    if (l) {
      const mine = progress.filter((p) => p.learner_id === l.id)
      const myTests = tests
        .map((t) => ({ t, a: (attempts[t.id] ?? []).find((x) => x.learner_id === l.id && x.submitted_at) }))
        .filter((x) => x.a)
        .sort((a, b) => b.t.due_at.localeCompare(a.t.due_at))
      const myMistakes = mistakes.filter((m) => m.learner_id === l.id)
      const mistakeTopics = [...new Set(myMistakes.map((m) => m.topic_id))]
        .map((t) => ({ t, n: myMistakes.filter((m) => m.topic_id === t).length }))
        .sort((a, b) => b.n - a.n)
      const myGroups = groupMembers.filter((m) => m.learner_id === l.id)
      const p = week?.get(l.id)
      report = (
        <div className="print-area card space-y-6 p-6">
          {header(`${l.full_name} — learner report`, `${l.grade ? `Grade ${l.grade}` : ''}${l.subject_id ? ` ${subjectName(l.subject_id)}` : ''}`)}
          <dl className="grid grid-cols-3 gap-4">
            <div>
              <dt className="text-xs text-navy-500">Overall mastery</dt>
              <dd className="text-xl font-bold tabular-nums text-navy-900">{pctText(averageMastery(l.id, progress))}</dd>
            </div>
            <div>
              <dt className="text-xs text-navy-500">Days active this week</dt>
              <dd className="text-xl font-bold tabular-nums text-navy-900">{p?.active_days ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-navy-500">Questions still to fix</dt>
              <dd className="text-xl font-bold tabular-nums text-navy-900">{myMistakes.length}</dd>
            </div>
          </dl>
          <section className="space-y-2">
            <h3 className="font-bold text-navy-900">Topic mastery</h3>
            {mine.length === 0 ? (
              <p className="text-sm text-navy-500">No practice recorded yet.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-navy-100 tabular-nums">
                  {[...mine]
                    .sort((a, b) => a.mastery_percent - b.mastery_percent)
                    .map((r) => (
                      <tr key={r.topic_id} className="print-avoid-break">
                        <td className="py-1.5 text-navy-900">{getTopic(r.topic_id)?.name ?? r.topic_id}</td>
                        <td className="py-1.5 text-right text-navy-500">{r.questions_attempted} answered</td>
                        <td className={`py-1.5 text-right ${r.mastery_percent < 50 ? 'font-semibold text-rose-700' : ''}`}>
                          {r.mastery_percent}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </section>
          <section className="space-y-2">
            <h3 className="font-bold text-navy-900">Weekly tests</h3>
            {myTests.length === 0 ? (
              <p className="text-sm text-navy-500">None handed in yet.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-navy-100 tabular-nums">
                  {myTests.map(({ t, a }) => (
                    <tr key={t.id} className="print-avoid-break">
                      <td className="py-1.5 text-navy-900">{t.title}</td>
                      <td className="py-1.5 text-right text-navy-500">
                        {new Date(t.due_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-1.5 text-right">
                        {a!.marks_awarded}/{a!.marks_total} ({pctText(attemptPercent(a!))})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="text-xs text-navy-500">Weekly tests are marked by the learner against the memo.</p>
          </section>
          {mistakeTopics.length ? (
            <section className="space-y-1">
              <h3 className="font-bold text-navy-900">Where the mistakes are</h3>
              <p className="text-sm text-navy-700">
                {mistakeTopics.map((m) => `${getTopic(m.t)?.name ?? m.t} (${m.n})`).join(', ')}
              </p>
            </section>
          ) : null}
          {myGroups.length ? (
            <section className="space-y-1">
              <h3 className="font-bold text-navy-900">Catch-up groups</h3>
              <ul className="text-sm text-navy-700">
                {myGroups.map((m) => {
                  const iv = groups.find((g) => g.id === m.intervention_id)
                  if (!iv) return null
                  const [o] = outcomesFor([m], tests.filter((t) => t.intervention_id === iv.id), attempts)
                  return (
                    <li key={m.intervention_id}>
                      {getTopic(iv.topic_id)?.name ?? iv.topic_id} ({iv.status}): started at {pctText(o.baseline)}, reassessed at{' '}
                      {pctText(o.latest)}
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <SectionHeading
          eyebrow="Reports"
          title="Reports"
          description="Print a report, save it as a PDF, or download its tables for a spreadsheet. Every figure is one you can already see in the app."
        />
      </div>
      {picker}
      {!schoolId ? (
        <p className="text-sm text-navy-500">Your account is not linked to a school.</p>
      ) : loading ? (
        <p className="text-sm text-navy-500">Gathering the figures…</p>
      ) : (
        report
      )}
    </div>
  )
}
