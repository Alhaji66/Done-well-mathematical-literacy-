import { Link } from 'react-router-dom'
import { demoLearner } from '@/data/learner'
import { getSubject } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { assessments } from '@/data/assessments'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { BarChart } from '@/components/ui/BarChart'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatusBadge, TrendBadge } from '@/components/ui/Badges'
import { formatDate } from '@/lib/utils'
import {
  TrendingUpIcon,
  ClockIcon,
  ClipboardIcon,
  StarIcon,
  ChevronRightIcon,
} from '@/components/ui/Icons'

export function LearnerDashboard() {
  const subject = getSubject(demoLearner.subjectId)!
  const weeklyMinutes = demoLearner.weeklyActivity.reduce((sum, d) => sum + d.minutes, 0)
  const upcoming = assessments.find((a) => a.status === 'upcoming')
  const weakest = [...demoLearner.topicProgress].sort((a, b) => a.masteryPercent - b.masteryPercent)[0]
  const weakestTopic = getTopic(weakest.topicId)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
          Grade {demoLearner.grade} · {subject.name}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-navy-900">Welcome back, {demoLearner.name.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-navy-600">Here's how your week is going and what to focus on next.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Overall mastery"
          value={`${demoLearner.overallMasteryPercent}%`}
          icon={<TrendingUpIcon className="h-4 w-4" />}
          hint="Across all Mat Lit topics"
        />
        <StatCard
          label="This week"
          value={`${weeklyMinutes} min`}
          icon={<ClockIcon className="h-4 w-4" />}
          hint="Time spent practising"
          tone="gold"
        />
        <StatCard
          label="Day streak"
          value={`${demoLearner.streakDays} days`}
          icon={<StarIcon className="h-4 w-4" />}
          hint="Keep it going!"
          tone="green"
        />
        <StatCard
          label="Next test"
          value={upcoming ? formatDate(upcoming.date) : '—'}
          icon={<ClipboardIcon className="h-4 w-4" />}
          hint={upcoming?.title}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <SectionHeading title="Weekly activity" description="Minutes spent practising each day this week." />
          <BarChart className="mt-6" unit=" min" data={demoLearner.weeklyActivity.map((d) => ({ label: d.label, value: d.minutes }))} />
        </div>

        <div className="card flex flex-col gap-4 p-5">
          <h3 className="font-bold text-navy-900">Recommended practice</h3>
          <div className="rounded-xl bg-navy-50 p-4">
            <p className="text-xs font-semibold uppercase text-gold-600">Focus topic</p>
            <p className="mt-1 font-semibold text-navy-900">{weakestTopic?.name}</p>
            <p className="mt-1 text-sm text-navy-600">{weakestTopic?.description}</p>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-navy-500">
                <span>Mastery</span>
                <span>{weakest.masteryPercent}%</span>
              </div>
              <ProgressBar percent={weakest.masteryPercent} />
            </div>
            <Link
              to={`/app/learner/practise?topic=${weakest.topicId}`}
              className="btn-primary btn-sm mt-4 w-full"
            >
              Practise now
            </Link>
          </div>
          <Link to="/app/learner/progress" className="inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:text-navy-900">
            View full progress <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <SectionHeading
            title="Upcoming test"
            action={
              <Link to="/app/learner/tests" className="text-sm font-semibold text-navy-700 hover:text-navy-900">
                All tests
              </Link>
            }
          />
          {upcoming ? (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-navy-100 p-4">
              <div>
                <p className="font-semibold text-navy-900">{upcoming.title}</p>
                <p className="mt-1 text-sm text-navy-500">
                  {formatDate(upcoming.date)} · {upcoming.totalMarks} marks · {upcoming.durationMinutes} min
                </p>
              </div>
              <StatusBadge status={upcoming.status} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-navy-500">No upcoming tests scheduled. Great time to revise!</p>
          )}
        </div>

        <div className="card p-5">
          <SectionHeading
            title="Recent scores"
            action={
              <Link to="/app/learner/progress" className="text-sm font-semibold text-navy-700 hover:text-navy-900">
                Progress
              </Link>
            }
          />
          <ul className="mt-4 space-y-3">
            {demoLearner.recentScores.map((s) => (
              <li key={s.assessmentId} className="flex items-center justify-between gap-3 rounded-lg border border-navy-100 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy-900">{s.label}</p>
                  <p className="text-xs text-navy-500">{formatDate(s.date)}</p>
                </div>
                <span className={`badge-${s.percent >= 70 ? 'green' : s.percent >= 50 ? 'gold' : 'red'} shrink-0`}>
                  {s.percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card p-5">
        <SectionHeading title="Topic progress snapshot" description="Full breakdown available on the Progress page." />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {demoLearner.topicProgress.map((tp) => {
            const topic = getTopic(tp.topicId)
            if (!topic) return null
            return (
              <div key={tp.topicId} className="rounded-lg border border-navy-100 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-navy-900">{topic.name}</p>
                  <TrendBadge trend={tp.trend} />
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <ProgressBar percent={tp.masteryPercent} className="flex-1" size="sm" />
                  <span className="w-10 text-right text-xs font-semibold text-navy-600">{tp.masteryPercent}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
