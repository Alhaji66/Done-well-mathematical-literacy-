import { Link } from 'react-router-dom'
import { demoTeacher, classLearners, classTopicPerformance } from '@/data/teacherSchool'
import { getSubject } from '@/data/subjects'
import { getTopic } from '@/data/topics'
import { assessments } from '@/data/assessments'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RiskBadge, StatusBadge } from '@/components/ui/Badges'
import { formatDate } from '@/lib/utils'
import { UsersIcon, BarChartIcon, SparkleIcon, ClipboardIcon, ChevronRightIcon } from '@/components/ui/Icons'

export function TeacherDashboard() {
  const subject = getSubject(demoTeacher.subjectId)!
  const totalLearners = demoTeacher.classes.reduce((s, c) => s + c.learnerCount, 0)
  const classAverage = Math.round(classTopicPerformance.reduce((s, t) => s + t.averagePercent, 0) / classTopicPerformance.length)
  const strongest = [...classTopicPerformance].sort((a, b) => b.averagePercent - a.averagePercent)[0]
  const weakest = [...classTopicPerformance].sort((a, b) => a.averagePercent - b.averagePercent)[0]
  const recentAssessment = assessments.find((a) => a.status === 'completed')
  const atRisk = classLearners.filter((l) => l.riskLevel === 'high')

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{subject.name} · Grades {demoTeacher.grades.join(' & ')}</p>
        <h1 className="mt-1 text-2xl font-bold text-navy-900">Welcome back, {demoTeacher.name}</h1>
        <p className="mt-1 text-sm text-navy-600">Here's your class overview for this week.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total learners" value={String(totalLearners)} icon={<UsersIcon className="h-4 w-4" />} hint={`${demoTeacher.classes.length} classes`} />
        <StatCard label="Class average" value={`${classAverage}%`} icon={<BarChartIcon className="h-4 w-4" />} tone="gold" />
        <StatCard label="Strongest topic" value={strongest ? getTopic(strongest.topicId)?.name ?? '' : '—'} icon={<ChevronRightIcon className="h-4 w-4" />} tone="green" hint={strongest ? `${strongest.averagePercent}% average` : ''} />
        <StatCard label="Needs focus" value={weakest ? getTopic(weakest.topicId)?.name ?? '' : '—'} icon={<ClipboardIcon className="h-4 w-4" />} tone="red" hint={weakest ? `${weakest.averagePercent}% average` : ''} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/app/teacher/question-bank" className="card flex items-center gap-3 p-4 hover:border-gold-300">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
            <SparkleIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-navy-900">Generate worksheet</p>
            <p className="text-xs text-navy-500">Question Bank</p>
          </div>
        </Link>
        <Link to="/app/teacher/assessments" className="card flex items-center gap-3 p-4 hover:border-gold-300">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
            <ClipboardIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-navy-900">Create weekly test</p>
            <p className="text-xs text-navy-500">Assessments</p>
          </div>
        </Link>
        <Link to="/app/teacher/analytics" className="card flex items-center gap-3 p-4 hover:border-gold-300">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
            <BarChartIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-navy-900">View class analytics</p>
            <p className="text-xs text-navy-500">Analytics</p>
          </div>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <SectionHeading
            title="Topic strengths & weaknesses"
            action={
              <Link to="/app/teacher/analytics" className="text-sm font-semibold text-navy-700 hover:text-navy-900">
                Full analytics
              </Link>
            }
          />
          <div className="mt-4 space-y-3">
            {classTopicPerformance.map((tp) => {
              const topic = getTopic(tp.topicId)
              return (
                <div key={tp.topicId}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-navy-900">{topic?.name}</span>
                    <span className="text-navy-600">{tp.averagePercent}%</span>
                  </div>
                  <ProgressBar percent={tp.averagePercent} size="sm" className="mt-1.5" />
                </div>
              )
            })}
          </div>
        </div>

        <div className="card p-5">
          <SectionHeading title="Recent assessment" />
          {recentAssessment ? (
            <div className="mt-4">
              <p className="font-semibold text-navy-900">{recentAssessment.title}</p>
              <p className="mt-1 text-sm text-navy-500">
                {formatDate(recentAssessment.date)} · {recentAssessment.totalMarks} marks
              </p>
              <div className="mt-3">
                <StatusBadge status={recentAssessment.status} />
              </div>
            </div>
          ) : null}

          <h4 className="mt-6 text-sm font-semibold text-navy-900">Learners at risk</h4>
          <div className="mt-3 space-y-2">
            {atRisk.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-lg border border-navy-100 p-2.5">
                <span className="text-sm text-navy-800">{l.name}</span>
                <RiskBadge level={l.riskLevel} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
