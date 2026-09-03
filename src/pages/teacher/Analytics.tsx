import { classTopicPerformance, questionPerformance, classLearners, demoTeacher } from '@/data/teacherSchool'
import { getTopic } from '@/data/topics'
import { questions } from '@/data/questions'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatCard } from '@/components/ui/StatCard'
import { RiskBadge } from '@/components/ui/Badges'
import { BarChartIcon, UsersIcon, AlertIcon } from '@/components/ui/Icons'

export function TeacherAnalytics() {
  const average = Math.round(classTopicPerformance.reduce((s, t) => s + t.averagePercent, 0) / classTopicPerformance.length)
  const totalLearners = demoTeacher.classes.reduce((s, c) => s + c.learnerCount, 0)
  const weakest = [...classTopicPerformance].sort((a, b) => a.averagePercent - b.averagePercent)[0]

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Analytics" title="Class performance" description="A clear view of results — by topic, by question, and where to intervene." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Class average" value={`${average}%`} icon={<BarChartIcon className="h-4 w-4" />} />
        <StatCard label="Total learners" value={String(totalLearners)} icon={<UsersIcon className="h-4 w-4" />} tone="gold" />
        <StatCard label="Priority topic" value={getTopic(weakest.topicId)?.name ?? ''} icon={<AlertIcon className="h-4 w-4" />} tone="red" />
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-navy-900">Performance by topic</h3>
        <div className="mt-4 space-y-3">
          {classTopicPerformance.map((tp) => {
            const topic = getTopic(tp.topicId)
            return (
              <div key={tp.topicId}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-navy-900">{topic?.name}</span>
                  <span className="text-navy-600">{tp.averagePercent}%</span>
                </div>
                <ProgressBar percent={tp.averagePercent} className="mt-1.5" />
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-navy-900">Performance by question</h3>
        <p className="mt-1 text-sm text-navy-500">Percentage of learners who answered each question correctly.</p>
        <div className="mt-4 space-y-3">
          {questionPerformance.map((qp) => {
            const q = questions.find((x) => x.id === qp.questionId)
            return (
              <div key={qp.questionId}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0 flex-1 truncate font-medium text-navy-900">{q?.prompt}</span>
                  <span className="shrink-0 text-navy-600">{qp.correctPercent}%</span>
                </div>
                <ProgressBar percent={qp.correctPercent} size="sm" className="mt-1.5" />
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-navy-900">Learners</h3>
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

      <div className="card border-rose-200 bg-rose-50 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-white">
            <AlertIcon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-bold text-navy-900">Intervention recommendation</h3>
            <p className="mt-1 text-sm text-navy-700">
              {getTopic(weakest.topicId)?.name} is your class's weakest topic at {weakest.averagePercent}% average. Consider a
              focused revision session and assigning targeted practice via the Question Bank before the next formal test.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
