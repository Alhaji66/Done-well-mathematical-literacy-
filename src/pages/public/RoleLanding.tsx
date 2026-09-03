import { Link } from 'react-router-dom'
import {
  UserIcon,
  HeartHandshakeIcon,
  BookIcon,
  SchoolIcon,
  CheckIcon,
  PencilIcon,
  ClipboardIcon,
  TrendingUpIcon,
  SparkleIcon,
  BarChartIcon,
  UsersIcon,
} from '@/components/ui/Icons'
import type { DemoRole } from '@/context/DemoAuthContext'

interface RoleContent {
  icon: (p: { className?: string }) => JSX.Element
  eyebrow: string
  title: string
  description: string
  points: { icon: (p: { className?: string }) => JSX.Element; title: string; desc: string }[]
}

const content: Record<DemoRole, RoleContent> = {
  learner: {
    icon: UserIcon,
    eyebrow: 'For Learners',
    title: 'I want to improve my marks.',
    description:
      'Practise the topics that matter, sit realistic tests, and always know exactly what to study next — starting with Grade 12 Mathematical Literacy.',
    points: [
      { icon: BookIcon, title: 'Browse by grade & topic', desc: 'Finance, Data Handling, Maps and Plans, Measurement, Probability, Tariffs and more.' },
      { icon: PencilIcon, title: 'Practise with instant feedback', desc: 'Easy, Moderate and Challenge questions with full explanations after every attempt.' },
      { icon: ClipboardIcon, title: 'Sit weekly & revision tests', desc: 'Get comfortable with real assessment conditions before exam day.' },
      { icon: TrendingUpIcon, title: 'Track your progress', desc: 'See mastery by topic and a clear recommendation for what to practise next.' },
    ],
  },
  parent: {
    icon: HeartHandshakeIcon,
    eyebrow: 'For Parents',
    title: 'I want to support my child.',
    description:
      'You don’t need to be a maths expert. Done Well translates your child’s progress into plain language and simple, practical ways to help at home.',
    points: [
      { icon: UserIcon, title: 'A clear child profile', desc: 'See subject progress, strengths and areas that need attention at a glance.' },
      { icon: ClipboardIcon, title: 'Upcoming assessments', desc: 'Know what’s coming up so you can plan support time together.' },
      { icon: HeartHandshakeIcon, title: '"How can I help?" guidance', desc: 'Practical home actions translated from academic weak points — no maths background required.' },
      { icon: BookIcon, title: 'Access to resources', desc: 'View the same learner materials your child is using at school.' },
    ],
  },
  teacher: {
    icon: BookIcon,
    eyebrow: 'For Teachers',
    title: 'I need resources and tools.',
    description:
      'Save planning time with ready resources, a curated question bank, printable worksheets and class analytics that point straight to what needs attention.',
    points: [
      { icon: BookIcon, title: 'Filterable resource library', desc: 'Grade, subject, topic and resource type — find what you need in seconds.' },
      { icon: SparkleIcon, title: 'Question bank & worksheet builder', desc: 'Generate a clean printable worksheet with a matching memo in a few clicks.' },
      { icon: ClipboardIcon, title: 'Weekly test management', desc: 'Create and assign tests with learner versions and full marking guidelines.' },
      { icon: BarChartIcon, title: 'Class analytics', desc: 'Performance by topic and by question, with clear intervention recommendations.' },
    ],
  },
  school: {
    icon: SchoolIcon,
    eyebrow: 'For Schools',
    title: 'I want school-wide support.',
    description:
      'A single, uncomplicated view of performance across your school — learners, teachers, assessments and where to focus intervention resources.',
    points: [
      { icon: UsersIcon, title: 'Whole-school overview', desc: 'Learner counts, active learners and average practice performance in one view.' },
      { icon: SchoolIcon, title: 'Teacher & class summaries', desc: 'See every teacher’s classes and subject averages at a glance.' },
      { icon: ClipboardIcon, title: 'Test completion tracking', desc: 'Understand participation across grades, not just results.' },
      { icon: TrendingUpIcon, title: 'Intervention priorities', desc: 'A ranked list of where extra support will make the biggest difference.' },
    ],
  },
}

export function RoleLanding({ role }: { role: DemoRole }) {
  const data = content[role]

  return (
    <div>
      <section className="bg-navy-50">
        <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
              <data.icon className="h-6 w-6" />
            </span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gold-600">{data.eyebrow}</p>
            <h1 className="mt-1 text-2xl font-extrabold text-navy-900 sm:text-4xl">{data.title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-navy-600 sm:text-base">{data.description}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to={`/sign-in?role=${role}`} className="btn-primary">
                Try the {role} demo
              </Link>
              <Link to="/publications" className="btn-outline">
                See publications
              </Link>
            </div>
          </div>
          <div className="card overflow-hidden p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">What you get</p>
            <ul className="mt-4 space-y-4">
              {data.points.map((pt) => (
                <li key={pt.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                    <pt.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{pt.title}</p>
                    <p className="text-sm text-navy-600">{pt.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-16">
        <div className="card flex flex-col items-center gap-4 p-8 text-center sm:p-12">
          <CheckIcon className="h-8 w-8 text-emerald-500" />
          <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">No sign-up needed to explore</h2>
          <p className="max-w-lg text-sm text-navy-600">
            This is a live prototype using demo data. Jump straight into a full {role} dashboard and see how Done
            Well works end to end.
          </p>
          <Link to={`/sign-in?role=${role}`} className="btn-primary">
            Enter {role} dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}
