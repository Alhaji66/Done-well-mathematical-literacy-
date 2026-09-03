import { useState } from 'react'
import { schoolGradeSummaries, classLearners } from '@/data/teacherSchool'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatCard } from '@/components/ui/StatCard'
import { RiskBadge } from '@/components/ui/Badges'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { UsersIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

export function SchoolLearners() {
  const [grade, setGrade] = useState<number | 'all'>('all')
  const totalLearners = schoolGradeSummaries.reduce((s, g) => s + g.learnerCount, 0)

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Learners" title="Learner overview" description="School-wide learner participation, shown here with a representative sample class." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total learners" value={totalLearners.toLocaleString()} icon={<UsersIcon className="h-4 w-4" />} />
        <StatCard label="Grades" value="10 – 12" tone="gold" />
        <StatCard label="Avg. test completion" value={`${Math.round(schoolGradeSummaries.reduce((s, g) => s + g.testCompletionPercent, 0) / schoolGradeSummaries.length)}%`} tone="green" />
      </div>

      <div className="inline-flex flex-wrap gap-1 rounded-lg border border-navy-200 bg-white p-1">
        {(['all', 10, 11, 12] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGrade(g)}
            className={cn('rounded-md px-3.5 py-1.5 text-sm font-semibold', grade === g ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50')}
          >
            {g === 'all' ? 'All grades' : `Grade ${g}`}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {schoolGradeSummaries
          .filter((g) => grade === 'all' || g.grade === grade)
          .map((g) => (
            <div key={g.grade} className="card p-5">
              <p className="text-xs font-semibold uppercase text-navy-500">Grade {g.grade}</p>
              <p className="mt-1 text-2xl font-bold text-navy-900">{g.learnerCount} learners</p>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-navy-500">
                  <span>Average score</span>
                  <span>{g.averageScore}%</span>
                </div>
                <ProgressBar percent={g.averageScore} size="sm" />
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-navy-500">
                  <span>Test completion</span>
                  <span>{g.testCompletionPercent}%</span>
                </div>
                <ProgressBar percent={g.testCompletionPercent} size="sm" />
              </div>
            </div>
          ))}
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-navy-900">Sample class — Grade 12 Mathematical Literacy</h3>
        <p className="mt-1 text-sm text-navy-500">Illustrative learner-level detail as it would appear once real class data is connected.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-navy-500">
                <th className="pb-2 font-medium">Learner</th>
                <th className="pb-2 font-medium">Mastery</th>
                <th className="pb-2 font-medium">Last active</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {classLearners.map((l) => (
                <tr key={l.id}>
                  <td className="py-2.5 font-medium text-navy-900">{l.name}</td>
                  <td className="py-2.5 text-navy-700">{l.masteryPercent}%</td>
                  <td className="py-2.5 text-navy-500">{l.lastActive}</td>
                  <td className="py-2.5">
                    <RiskBadge level={l.riskLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
