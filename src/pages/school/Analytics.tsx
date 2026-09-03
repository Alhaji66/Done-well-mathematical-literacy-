import { schoolStats, schoolGradeSummaries, schoolTeachers, interventionPriorities } from '@/data/teacherSchool'
import { getTopic } from '@/data/topics'
import { getSubject } from '@/data/subjects'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { BarChartIcon, UsersIcon, TrendingUpIcon, AlertIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

export function SchoolAnalytics() {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Analytics" title="School-wide analytics" description="A simple, uncomplicated view — not a full BI system." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg. practice score" value={`${schoolStats.averagePracticeScore}%`} icon={<BarChartIcon className="h-4 w-4" />} />
        <StatCard label="Active learners" value={schoolStats.activeLearners.toLocaleString()} icon={<UsersIcon className="h-4 w-4" />} tone="green" />
        <StatCard label="Test completion" value={`${schoolStats.testCompletionPercent}%`} icon={<TrendingUpIcon className="h-4 w-4" />} tone="gold" />
        <StatCard label="Priorities flagged" value={String(interventionPriorities.length)} icon={<AlertIcon className="h-4 w-4" />} tone="red" />
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-navy-900">Average score by grade</h3>
        <div className="mt-4 space-y-4">
          {schoolGradeSummaries.map((g) => (
            <div key={g.grade}>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-navy-900">Grade {g.grade} · {g.learnerCount} learners</span>
                <span className="text-navy-600">{g.averageScore}%</span>
              </div>
              <ProgressBar percent={g.averageScore} className="mt-1.5" />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-navy-900">Class averages by teacher</h3>
        <div className="mt-4 space-y-4">
          {schoolTeachers.map((t) => (
            <div key={t.id}>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-navy-900">
                  {t.name} <span className="font-normal text-navy-500">· {getSubject(t.subjectId)?.name}</span>
                </span>
                <span className="text-navy-600">{t.classAverage}%</span>
              </div>
              <ProgressBar percent={t.classAverage} className="mt-1.5" />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <SectionHeading title="Intervention priorities" />
        <div className="mt-4 space-y-3">
          {interventionPriorities.map((ip) => (
            <div key={ip.id} className={cn('flex items-start gap-3 rounded-lg border p-4', ip.severity === 'high' ? 'border-rose-200 bg-rose-50' : 'border-gold-200 bg-gold-50')}>
              <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white', ip.severity === 'high' ? 'bg-rose-500' : 'bg-gold-500')}>
                <AlertIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-navy-900">{ip.label}</p>
                <p className="mt-1 text-sm text-navy-600">{ip.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-bold text-emerald-700">Strongest topic</h3>
          <p className="mt-2 font-semibold text-navy-900">{getTopic(schoolStats.strongestTopicId)?.name}</p>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-rose-700">Weakest topic</h3>
          <p className="mt-2 font-semibold text-navy-900">{getTopic(schoolStats.weakestTopicId)?.name}</p>
        </div>
      </div>
    </div>
  )
}
