import { Link } from 'react-router-dom'
import { schoolStats, schoolGradeSummaries, interventionPriorities } from '@/data/teacherSchool'
import { getTopic } from '@/data/topics'
import { StatCard } from '@/components/ui/StatCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { UsersIcon, TrendingUpIcon, ClipboardIcon, AlertIcon, ChevronRightIcon } from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

export function SchoolDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">School Overview</p>
        <h1 className="mt-1 text-2xl font-bold text-navy-900">Thuto Secondary School</h1>
        <p className="mt-1 text-sm text-navy-600">A whole-school snapshot of participation and performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Learners" value={schoolStats.learnerCount.toLocaleString()} icon={<UsersIcon className="h-4 w-4" />} />
        <StatCard
          label="Active learners"
          value={schoolStats.activeLearners.toLocaleString()}
          icon={<TrendingUpIcon className="h-4 w-4" />}
          tone="green"
          hint={`${Math.round((schoolStats.activeLearners / schoolStats.learnerCount) * 100)}% of learners active this week`}
        />
        <StatCard label="Avg. practice score" value={`${schoolStats.averagePracticeScore}%`} icon={<ClipboardIcon className="h-4 w-4" />} tone="gold" />
        <StatCard label="Test completion" value={`${schoolStats.testCompletionPercent}%`} icon={<ClipboardIcon className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-bold text-emerald-700">Strongest topic school-wide</h3>
          <p className="mt-2 text-lg font-semibold text-navy-900">{getTopic(schoolStats.strongestTopicId)?.name}</p>
          <p className="mt-1 text-sm text-navy-600">{getTopic(schoolStats.strongestTopicId)?.description}</p>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-rose-700">Weakest topic school-wide</h3>
          <p className="mt-2 text-lg font-semibold text-navy-900">{getTopic(schoolStats.weakestTopicId)?.name}</p>
          <p className="mt-1 text-sm text-navy-600">{getTopic(schoolStats.weakestTopicId)?.description}</p>
        </div>
      </div>

      <div className="card p-5">
        <SectionHeading
          title="Performance by grade"
          action={
            <Link to="/app/school/analytics" className="text-sm font-semibold text-navy-700 hover:text-navy-900">
              Full analytics
            </Link>
          }
        />
        <div className="mt-4 space-y-4">
          {schoolGradeSummaries.map((g) => (
            <div key={g.grade}>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-navy-900">Grade {g.grade} · {g.learnerCount} learners</span>
                <span className="text-navy-600">{g.averageScore}% average</span>
              </div>
              <ProgressBar percent={g.averageScore} className="mt-1.5" />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <SectionHeading title="Intervention priorities" description="Where extra support will make the biggest difference." />
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
        <Link to="/app/school/analytics" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:text-navy-900">
          View full school analytics <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
