import { Link } from 'react-router-dom'
import { demoLearner } from '@/data/learner'
import { getSubject } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { assessments } from '@/data/assessments'
import { homeActions, parentGuidanceIntro } from '@/data/parent'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatusBadge } from '@/components/ui/Badges'
import { formatDate } from '@/lib/utils'
import { TrendingUpIcon, ClipboardIcon, HeartHandshakeIcon, ChevronRightIcon } from '@/components/ui/Icons'

export function ParentDashboard() {
  const subject = getSubject(demoLearner.subjectId)!
  const upcoming = assessments.find((a) => a.status === 'upcoming')
  const strengths = [...demoLearner.topicProgress].sort((a, b) => b.masteryPercent - a.masteryPercent).slice(0, 2)
  const weaknesses = [...demoLearner.topicProgress].sort((a, b) => a.masteryPercent - b.masteryPercent).slice(0, 2)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Parent Dashboard</p>
        <h1 className="mt-1 text-2xl font-bold text-navy-900">
          {demoLearner.name}'s progress — Grade {demoLearner.grade} {subject.name}
        </h1>
        <p className="mt-1 text-sm text-navy-600">A simple overview of how {demoLearner.name.split(' ')[0]} is doing, and how you can help.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Overall mastery" value={`${demoLearner.overallMasteryPercent}%`} icon={<TrendingUpIcon className="h-4 w-4" />} />
        <StatCard
          label="Next assessment"
          value={upcoming ? formatDate(upcoming.date) : '—'}
          icon={<ClipboardIcon className="h-4 w-4" />}
          hint={upcoming?.title}
          tone="gold"
        />
        <StatCard label="Practice streak" value={`${demoLearner.streakDays} days`} icon={<HeartHandshakeIcon className="h-4 w-4" />} tone="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-bold text-emerald-700">Strengths</h3>
          <div className="mt-4 space-y-3">
            {strengths.map((s) => {
              const topic = getTopic(s.topicId)
              return (
                <div key={s.topicId}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-navy-900">{topic?.name}</span>
                    <span className="text-navy-600">{s.masteryPercent}%</span>
                  </div>
                  <ProgressBar percent={s.masteryPercent} size="sm" className="mt-1.5" barClassName="bg-emerald-500" />
                </div>
              )
            })}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-rose-700">Needs attention</h3>
          <div className="mt-4 space-y-3">
            {weaknesses.map((s) => {
              const topic = getTopic(s.topicId)
              return (
                <div key={s.topicId}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-navy-900">{topic?.name}</span>
                    <span className="text-navy-600">{s.masteryPercent}%</span>
                  </div>
                  <ProgressBar percent={s.masteryPercent} size="sm" className="mt-1.5" barClassName="bg-rose-500" />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="card border-gold-200 bg-gold-50 p-5">
        <SectionHeading
          title="How can I help?"
          description={parentGuidanceIntro}
          action={
            <Link to="/app/parent/support" className="btn-outline btn-sm inline-flex items-center gap-1">
              All support tips <ChevronRightIcon className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {homeActions.slice(0, 3).map((a) => (
            <div key={a.id} className="rounded-lg bg-white p-4">
              <p className="text-sm font-semibold text-navy-900">{a.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-navy-600">{a.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {upcoming ? (
        <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-navy-500">Upcoming assessment</p>
            <p className="mt-1 font-semibold text-navy-900">{upcoming.title}</p>
            <p className="text-sm text-navy-500">{formatDate(upcoming.date)} · {upcoming.totalMarks} marks</p>
          </div>
          <StatusBadge status={upcoming.status} />
        </div>
      ) : null}
    </div>
  )
}
