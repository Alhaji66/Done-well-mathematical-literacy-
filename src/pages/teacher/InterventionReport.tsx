import { useState } from 'react'
import { demoLevelData, demoToday } from '@/data/demoLevels'
import { DEMO_CLASS_TEACHER, demoImpactGroups } from '@/data/demoCatchUp'
import { flaggedBetween, termOfDate } from '@/lib/levels'
import { groupsIn, periodLabel, periodRange, type Period } from '@/lib/catchUpImpact'
import { InterventionReport } from '@/components/interventions/InterventionReport'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PrinterIcon } from '@/components/ui/Icons'
import { getSubject } from '@/data/subjects'

/**
 * The demo's intervention report, from its sample classes, tests and
 * catch-up groups: the teacher's own groups, the Mathematical Literacy
 * department's, or the whole school's.
 */
export function DemoInterventionReport({ scope }: { scope: 'teacher' | 'hod' | 'school' }) {
  const [data] = useState(() => demoLevelData(scope))
  const [today] = useState(() => demoToday(data))
  const [groups] = useState(() => demoImpactGroups(scope))
  const [period, setPeriod] = useState<Period>(() => termOfDate(today.toISOString().slice(0, 10)))
  const year = today.getFullYear()
  const { from, to } = periodRange(period, year)
  const inPeriod = groupsIn(groups, period, year)
  // The demo teacher, Alhaji T, sees the learners in the classes they teach.
  const flagged = flaggedBetween(data.results, {}, from, to).filter((f) => scope !== 'teacher' || DEMO_CLASS_TEACHER[f.classId ?? ''] === 'Alhaji T')

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <SectionHeading
          eyebrow="Reports · sample data"
          title="Intervention report"
          description="Who the early warnings flagged this term, who was helped in a catch-up group, whether it worked, and who still needs help: one report to print for an SMT or district meeting, or save as a PDF."
        />
      </div>
      <div className="card flex flex-wrap items-end gap-3 p-5 print:hidden">
        <label className="text-xs font-medium text-navy-500">
          Period
          <select className="select mt-1" value={String(period)} onChange={(e) => setPeriod(e.target.value === 'year' ? 'year' : (Number(e.target.value) as Period))}>
            {[1, 2, 3, 4].map((t) => (
              <option key={t} value={t}>
                Term {t}
              </option>
            ))}
            <option value="year">The whole year</option>
          </select>
        </label>
        <button type="button" onClick={() => window.print()} className="btn-primary inline-flex items-center gap-1.5">
          <PrinterIcon className="h-4 w-4" /> Print or save as PDF
        </button>
      </div>
      <InterventionReport
        school={data.school ?? 'Your school'}
        scopeLabel={scope === 'teacher' ? 'Alhaji T’s catch-up groups' : scope === 'hod' ? 'Mathematical Literacy department' : 'Whole school'}
        period={periodLabel(period, year)}
        groups={inPeriod}
        flagged={flagged}
        named={scope !== 'school'}
        learnerName={(id) => data.names.get(id) ?? 'Learner'}
        teacherName={(name) => name ?? 'A former member of staff'}
        className={(id, grade, subject) => data.classes.find((c) => c.id === id)?.name ?? `Grade ${grade} ${getSubject(subject)?.name ?? subject}`}
        views={scope === 'school' ? ['subject', 'teacher'] : scope === 'hod' ? ['teacher', 'topic'] : ['topic']}
        csvName={`intervention-report-${period === 'year' ? year : `term-${period}-${year}`}.csv`}
      />
    </div>
  )
}
