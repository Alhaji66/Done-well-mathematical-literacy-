import { useEffect, useMemo, useState } from 'react'
import { subjects } from '@/data/subjects'
import { topicsForSubject } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WEIGHTING_TOLERANCE } from '@/data/capsWeighting'
import {
  buildCoverage,
  sharePercent,
  THIN_TOPIC_THRESHOLD,
  UNTRACKED,
  type Finding,
  type GradeCoverage,
  type SubjectCoverage,
} from '@/lib/coverage'
import type { Grade } from '@/types'
import { cn } from '@/lib/utils'

/**
 * Curriculum coverage, for Teachers and Schools.
 *
 * This page deliberately leads with what is MISSING. An external review of
 * the app made the point plainly: a large sample count is not evidence of
 * curriculum completeness, and a catalogue that advertises big numbers while
 * a topic sits half-empty is misleading rather than informative. So the
 * findings list comes first, the per-topic table second, and the totals are
 * kept small and late.
 *
 * It also names the things it cannot measure. See UNTRACKED in lib/coverage.
 */

// Only subjects that carry content, so a subject registered ahead of its
// topics cannot show up here as an empty coverage row.
const coverageSubjects = subjects.filter((s) => topicsForSubject(s.id).length > 0)

const findingTone: Record<Finding['severity'], string> = {
  gap: 'border-rose-200 bg-rose-50 text-rose-800',
  watch: 'border-gold-200 bg-gold-50 text-gold-800',
}

const findingLabel: Record<Finding['severity'], string> = {
  gap: 'Gap',
  watch: 'Watch',
}

function LevelBar({ split, className }: { split: { easy: number; moderate: number; challenge: number; total: number }; className?: string }) {
  if (split.total === 0) return null
  const easy = sharePercent(split.easy, split.total)
  const moderate = sharePercent(split.moderate, split.total)
  const challenge = 100 - easy - moderate
  return (
    <div className={cn('flex h-2.5 overflow-hidden rounded-full bg-navy-100', className)} aria-hidden="true">
      <div className="bg-navy-300" style={{ width: `${easy}%` }} />
      <div className="bg-navy-500" style={{ width: `${moderate}%` }} />
      <div className="bg-gold-500" style={{ width: `${challenge}%` }} />
    </div>
  )
}

function GradePanel({ grade, subject }: { grade: GradeCoverage; subject: SubjectCoverage }) {
  // The target is the grade's, not the subject's -- Mathematics sets a
  // different one for Grade 12 than for Grades 10 and 11.
  const { weighting } = grade
  const actualChallenge = sharePercent(grade.paperMarks.challenge, grade.paperMarks.total)
  const onTarget = weighting ? Math.abs(actualChallenge - weighting.level3and4) <= WEIGHTING_TOLERANCE : false

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-bold text-navy-900">Grade {grade.grade}</h3>
        <p className="text-sm text-navy-600">
          {grade.topics.length} topics · {grade.papers.length} papers ·{' '}
          {grade.topics.reduce((n, t) => n + t.questionCount, 0)} practice questions
        </p>
      </div>

      {grade.findings.length === 0 ? (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          No gaps found against the checks this page can run. That is not the same as complete — see what is not tracked, below.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {grade.findings.map((f, i) => (
            <li key={i} className={cn('flex gap-3 rounded-lg border p-3 text-sm', findingTone[f.severity])}>
              <span className="shrink-0 text-xs font-bold uppercase tracking-wide">{findingLabel[f.severity]}</span>
              <span>{f.message}</span>
            </li>
          ))}
        </ul>
      )}

      {weighting && grade.capsMarks.levelled > 0 ? (
        <div className="mt-5 rounded-lg border border-navy-200 bg-white p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-sm font-semibold text-navy-900">CAPS cognitive levels, by mark</h4>
            <span className="text-xs text-navy-500">
              {sharePercent(grade.capsMarks.levelled, grade.capsMarks.levelled + grade.capsMarks.unlevelled)}% of this
              grade carries an explicit level
            </span>
          </div>
          <dl className="mt-3 grid gap-2 sm:grid-cols-4">
            {([1, 2, 3, 4] as const).map((l) => {
              const target = l === 1 ? weighting.level1 : l === 2 ? weighting.level2 : l === 3 ? weighting.level3 : weighting.level4
              const actual = sharePercent(grade.capsMarks[l], grade.capsMarks.levelled)
              const off = Math.abs(actual - target) > WEIGHTING_TOLERANCE
              return (
                <div key={l} className="rounded-md border border-navy-100 p-2.5">
                  <dt className="text-xs font-medium text-navy-500">
                    Level {l} · {weighting.levelNames[l - 1]}
                  </dt>
                  <dd className={cn('mt-0.5 text-lg font-bold tabular-nums', off ? 'text-rose-700' : 'text-emerald-700')}>
                    {actual}%
                  </dd>
                  <dd className="text-xs text-navy-500">target {target}%</dd>
                </div>
              )
            })}
          </dl>
          {grade.capsMarks.unlevelled > 0 ? (
            <p className="mt-2.5 text-xs text-navy-500">
              {grade.capsMarks.unlevelled} marks are not levelled yet and are excluded from these percentages. They are
              the questions where the Level 2 / Level 3 boundary needs a subject specialist rather than a rule.
            </p>
          ) : null}
        </div>
      ) : null}

      {weighting && grade.paperMarks.total > 0 ? (
        <div className="mt-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-sm font-semibold text-navy-900">
              Cognitive levels across all Grade {grade.grade} papers, by mark
              <span className="ml-1.5 font-normal text-navy-500">(from author-assigned tags, not audited)</span>
            </h4>
            <span className={cn('text-sm font-semibold', onTarget ? 'text-emerald-700' : 'text-rose-700')}>
              Levels 3–4: {actualChallenge}% (target {weighting.level3and4}%)
            </span>
          </div>
          <LevelBar split={grade.paperMarks} className="mt-2" />
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-navy-600">
            <div className="flex gap-1.5">
              <dt className="font-medium">Level 1 {weighting.levelNames[0]}:</dt>
              <dd>
                {sharePercent(grade.paperMarks.easy, grade.paperMarks.total)}% (target {weighting.level1}%)
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-medium">Level 2 {weighting.levelNames[1]}:</dt>
              <dd>
                {sharePercent(grade.paperMarks.moderate, grade.paperMarks.total)}% (target {weighting.level2}%)
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="font-medium">Levels 3–4 combined:</dt>
              <dd>
                {actualChallenge}% (target {weighting.level3and4}%)
              </dd>
            </div>
          </dl>
          {/* Without this, two grades of one subject showing different targets
              reads as a bug in the page rather than as the curriculum. */}
          {subject.weightingVariesByGrade ? (
            <p className="mt-2 text-xs text-navy-500">
              {subject.subjectName} sets a different weighting per grade, so this target is not the one shown for
              the other grades on this page.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <caption className="sr-only">
            Practice question coverage by topic for Grade {grade.grade} {subject.subjectName}
          </caption>
          <thead>
            <tr className="border-b border-navy-100 text-xs uppercase tracking-wide text-navy-500">
              <th scope="col" className="pb-2 pr-4 font-semibold">
                Topic
              </th>
              <th scope="col" className="pb-2 pr-4 text-right font-semibold">
                Questions
              </th>
              <th scope="col" className="pb-2 pr-4 font-semibold">
                Easy / Moderate / Challenge
              </th>
              <th scope="col" className="pb-2 pr-4 text-right font-semibold">
                Sub-topic placed
              </th>
              <th scope="col" className="pb-2 font-semibold">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {grade.topics.map((t) => (
              <tr key={t.topicId} className="align-middle">
                <th scope="row" className="py-2.5 pr-4 font-medium text-navy-900">
                  {t.topicName}
                </th>
                <td
                  className={cn(
                    'py-2.5 pr-4 text-right tabular-nums',
                    t.questionCount === 0
                      ? 'font-bold text-rose-700'
                      : t.questionCount < THIN_TOPIC_THRESHOLD
                        ? 'font-semibold text-gold-700'
                        : 'text-navy-700',
                  )}
                >
                  {t.questionCount}
                </td>
                <td className="py-2.5 pr-4">
                  {t.questionCount === 0 ? (
                    <span className="text-xs text-navy-400">—</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LevelBar split={t.practice} className="w-24" />
                      <span className="whitespace-nowrap text-xs tabular-nums text-navy-600">
                        {t.practice.easy} / {t.practice.moderate} / {t.practice.challenge}
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-2.5 pr-4 text-right tabular-nums text-navy-700">
                  {t.placedPercent === null ? <span className="text-xs text-navy-400">—</span> : `${t.placedPercent}%`}
                </td>
                <td className="py-2.5 text-xs">
                  {t.hasNotes ? (
                    <span className="text-emerald-700">Yes</span>
                  ) : (
                    <span className="text-gold-700">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {grade.papers.length > 0 ? (
        <details className="mt-5">
          <summary className="cursor-pointer text-sm font-semibold text-navy-800">
            Per-paper cognitive weighting ({grade.papers.length} papers)
          </summary>
          <ul className="mt-3 space-y-1.5">
            {grade.papers.map((p) => {
              const off = Math.abs(p.challengeGap) > WEIGHTING_TOLERANCE
              return (
                <li key={p.paperId} className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="text-navy-700">{p.title}</span>
                  <span className={cn('tabular-nums', off ? 'font-semibold text-rose-700' : 'text-navy-600')}>
                    {p.challengePercent}% Levels 3–4 · {p.totalMarks} marks
                  </span>
                </li>
              )
            })}
          </ul>
        </details>
      ) : null}
    </div>
  )
}

export function CurriculumCoverage() {
  const [subjectId, setSubjectId] = useState(coverageSubjects[0]?.id ?? '')
  const [report, setReport] = useState<SubjectCoverage | null>(null)
  const [loading, setLoading] = useState(true)
  const [gradeFilter, setGradeFilter] = useState<Grade | 'all'>('all')

  useEffect(() => {
    let active = true
    setLoading(true)
    buildCoverage(subjectId).then((r) => {
      if (!active) return
      setReport(r)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [subjectId])

  const shownGrades = useMemo(
    () => (report ? report.grades.filter((g) => gradeFilter === 'all' || g.grade === gradeFilter) : []),
    [report, gradeFilter],
  )

  const totalFindings = report?.grades.reduce((n, g) => n + g.findings.length, 0) ?? 0

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Curriculum"
        title="Content coverage"
        description="Whether the content is complete enough to teach from, topic by topic and grade by grade. A large question count is not evidence of coverage, so this page leads with the gaps."
      />

      <div className="card p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="coverage-subject" className="block text-xs font-semibold uppercase tracking-wide text-navy-500">
              Subject
            </label>
            <select
              id="coverage-subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="mt-1 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900"
            >
              {coverageSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="coverage-grade" className="block text-xs font-semibold uppercase tracking-wide text-navy-500">
              Grade
            </label>
            <select
              id="coverage-grade"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value === 'all' ? 'all' : (Number(e.target.value) as Grade))}
              className="mt-1 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900"
            >
              <option value="all">All grades</option>
              {report?.grades.map((g) => (
                <option key={g.grade} value={g.grade}>
                  Grade {g.grade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : !report ? null : (
        <>
          <p className="text-sm text-navy-600">
            {totalFindings === 0
              ? `No gaps found in ${report.subjectName} against the checks below.`
              : `${totalFindings} item${totalFindings === 1 ? '' : 's'} to look at in ${report.subjectName}.`}
          </p>

          {shownGrades.map((g) => (
            <GradePanel key={g.grade} grade={g} subject={report} />
          ))}

          <div className="card border-navy-200 bg-navy-50 p-5">
            <h3 className="font-bold text-navy-900">What this page cannot tell you</h3>
            <p className="mt-1 text-sm text-navy-600">
              These were asked for and are not shown, because the app holds no data to answer them. They are listed rather
              than omitted: a dashboard of green panels that quietly drops the questions it cannot answer reads as a clean
              bill of health.
            </p>
            <dl className="mt-4 space-y-4">
              {UNTRACKED.map((u) => (
                <div key={u.title}>
                  <dt className="text-sm font-semibold text-navy-900">{u.title}</dt>
                  <dd className="mt-0.5 text-sm text-navy-600">{u.detail}</dd>
                  <dd className="mt-1 text-xs text-navy-500">
                    <span className="font-semibold">Needs:</span> {u.needs}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      )}
    </div>
  )
}
