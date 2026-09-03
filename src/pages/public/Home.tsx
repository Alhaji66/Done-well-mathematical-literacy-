import { Link } from 'react-router-dom'
import {
  BookIcon,
  PencilIcon,
  ClipboardIcon,
  TrendingUpIcon,
  UserIcon,
  HeartHandshakeIcon,
  SchoolIcon,
  CheckIcon,
  StarIcon,
} from '@/components/ui/Icons'
import { cn } from '@/lib/utils'

const roleCards = [
  {
    to: '/sign-in?role=learner',
    icon: UserIcon,
    title: 'Learners',
    quote: '“I want to improve my marks.”',
    description: 'Practise topic-by-topic, take weekly tests, and see exactly what to study next.',
    accent: 'bg-navy-900 text-white',
  },
  {
    to: '/sign-in?role=parent',
    icon: HeartHandshakeIcon,
    title: 'Parents',
    quote: '“I want to support my child.”',
    description: 'Understand progress in plain language and get simple ways to help at home.',
    accent: 'bg-white text-navy-900 border border-navy-100',
  },
  {
    to: '/sign-in?role=teacher',
    icon: BookIcon,
    title: 'Teachers',
    quote: '“I need resources and tools.”',
    description: 'Ready-made resources, a question bank, worksheets and class analytics.',
    accent: 'bg-white text-navy-900 border border-navy-100',
  },
  {
    to: '/sign-in?role=school',
    icon: SchoolIcon,
    title: 'Schools',
    quote: '“I want school-wide support.”',
    description: 'A whole-school view of performance, participation and where to intervene.',
    accent: 'bg-white text-navy-900 border border-navy-100',
  },
]

const publications = [
  { title: 'Learner Book', desc: 'Full CAPS-aligned content with worked examples in real South African contexts.' },
  { title: 'Workbook', desc: 'Extra structured practice for daily consolidation and confidence-building.' },
  { title: 'Teacher Guide', desc: 'Pacing, teaching notes and full memoranda to save planning time.' },
  { title: 'Tests & Memos', desc: 'Topic tests, revision tests and formal assessments with marking guidelines.' },
]

const steps = [
  { label: 'Learn', desc: 'Browse topics by grade and subject.' },
  { label: 'Practise', desc: 'Try graded questions with instant feedback.' },
  { label: 'Assess', desc: 'Sit weekly and revision tests.' },
  { label: 'Analyse', desc: 'See strengths and gaps clearly.' },
  { label: 'Improve', desc: 'Follow a clear next step, every time.' },
]

const pricingTiers = [
  { name: 'Free', price: 'R0', desc: 'Explore sample resources and try demo dashboards.', features: ['Sample practice questions', 'Public publications preview', 'Demo dashboards'], cta: 'Get started', highlight: false },
  { name: 'Learner', price: 'R49', period: '/month', desc: 'Full practice, tests and progress tracking for one learner.', features: ['Unlimited practice questions', 'Weekly & revision tests', 'Progress tracking'], cta: 'Try the demo', highlight: true },
  { name: 'Teacher', price: 'R99', period: '/month', desc: 'Resources, question bank and class analytics.', features: ['Downloadable resources', 'Worksheet generator', 'Class analytics'], cta: 'Try the demo', highlight: false },
  { name: 'School', price: 'Custom', desc: 'School-wide access, support and reporting.', features: ['Whole-school analytics', 'Multiple teacher seats', 'Priority support'], cta: 'Contact us', highlight: false },
]

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden>
          <svg width="100%" height="100%">
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container-page relative py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="badge-gold">Done Well Publications · School Support Platform</span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Everything you need to help learners succeed.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-navy-200 sm:text-lg">
              DONE WELL® brings together quality educational resources, guided practice, assessment and progress
              support — in one affordable, easy-to-use hub for learners, parents, teachers and schools.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/sign-in" className="btn-primary">
                Try the free demo
              </Link>
              <Link to="/publications" className="btn bg-white/10 text-white hover:bg-white/20">
                View publications
              </Link>
            </div>
            <p className="mt-4 text-xs text-navy-300">Resources. Practice. Support. Progress.</p>
          </div>
        </div>
      </section>

      {/* Role cards */}
      <section className="container-page -mt-8 pb-4 sm:-mt-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roleCards.map((role) => (
            <Link
              key={role.title}
              to={role.to}
              className={cn(
                'group flex flex-col gap-4 rounded-2xl p-5 shadow-panel transition-transform hover:-translate-y-0.5',
                role.accent,
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  role.accent.includes('bg-navy-900') ? 'bg-white/15 text-gold-400' : 'bg-navy-50 text-navy-700',
                )}
              >
                <role.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold">{role.title}</h3>
                <p className={cn('mt-1 text-sm italic', role.accent.includes('bg-navy-900') ? 'text-navy-200' : 'text-navy-500')}>
                  {role.quote}
                </p>
                <p className={cn('mt-2 text-sm', role.accent.includes('bg-navy-900') ? 'text-navy-200' : 'text-navy-600')}>
                  {role.description}
                </p>
              </div>
              <span
                className={cn(
                  'mt-auto inline-flex items-center gap-1 text-sm font-semibold',
                  role.accent.includes('bg-navy-900') ? 'text-gold-400' : 'text-navy-700',
                )}
              >
                Enter demo →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Publications */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">Built on Done Well Publications</p>
            <h2 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">One connected set of resources</h2>
            <p className="mt-2 max-w-2xl text-sm text-navy-600 sm:text-base">
              Learner Book → Workbook → Teacher Guide → Tests → Memos — every resource on Done Well connects to real
              classroom practice.
            </p>
          </div>
          <Link to="/publications" className="btn-outline shrink-0">
            See all publications
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {publications.map((pub) => (
            <div key={pub.title} className="card p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                <BookIcon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-navy-900">{pub.title}</h3>
              <p className="mt-1.5 text-sm text-navy-600">{pub.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy-50 py-16 sm:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">How it works</p>
            <h2 className="mt-1 text-2xl font-bold text-navy-900 sm:text-3xl">A simple loop that drives real progress</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div key={step.label} className="card relative p-5">
                <span className="text-xs font-bold text-gold-600">STEP {i + 1}</span>
                <h3 className="mt-1 text-base font-bold text-navy-900">{step.label}</h3>
                <p className="mt-1.5 text-sm text-navy-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Icons row: learn/practise/test/progress */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookIcon, title: 'Learn', desc: 'Grade-appropriate topic breakdowns learners can browse anytime.' },
            { icon: PencilIcon, title: 'Practise', desc: 'Graded questions from Easy to Challenge with worked explanations.' },
            { icon: ClipboardIcon, title: 'Assess', desc: 'Weekly tests and revision tests that mirror real assessments.' },
            { icon: TrendingUpIcon, title: 'Improve', desc: 'Clear, topic-level progress so nobody has to guess what to do next.' },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="font-bold text-navy-900">{f.title}</h3>
              <p className="text-sm text-navy-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-navy-900 py-16 sm:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">Simple, affordable pricing</p>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">No unnecessary complexity</h2>
            <p className="mt-2 text-sm text-navy-300 sm:text-base">
              Start free. Upgrade only when you need more. Pricing shown is illustrative for this prototype — no
              payment is processed yet.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  'flex flex-col rounded-2xl p-5',
                  tier.highlight ? 'bg-gold-500 text-navy-900 shadow-panel' : 'bg-navy-800 text-white',
                )}
              >
                {tier.highlight ? (
                  <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-navy-900/10 px-2.5 py-1 text-xs font-bold">
                    <StarIcon className="h-3.5 w-3.5" /> Most popular
                  </span>
                ) : null}
                <h3 className="text-lg font-bold">{tier.name}</h3>
                <p className="mt-1 text-2xl font-extrabold">
                  {tier.price}
                  {tier.period ? <span className="text-sm font-medium opacity-70">{tier.period}</span> : null}
                </p>
                <p className={cn('mt-2 text-sm', tier.highlight ? 'text-navy-800' : 'text-navy-300')}>{tier.desc}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckIcon className={cn('mt-0.5 h-4 w-4 shrink-0', tier.highlight ? 'text-navy-900' : 'text-gold-400')} />
                      <span className={tier.highlight ? 'text-navy-800' : 'text-navy-200'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/sign-in"
                  className={cn(
                    'mt-5 btn w-full',
                    tier.highlight ? 'bg-navy-900 text-white hover:bg-navy-800' : 'border border-white/20 text-white hover:bg-white/10',
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page py-16 text-center sm:py-20">
        <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">Ready to see it in action?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-navy-600 sm:text-base">
          Explore a full demo dashboard for learners, parents or teachers — no sign-up required.
        </p>
        <Link to="/sign-in" className="btn-primary mt-6 inline-flex">
          Try the demo now
        </Link>
      </section>
    </div>
  )
}
