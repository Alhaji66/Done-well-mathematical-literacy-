import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { pricingTiers } from "../../data/pricing";
import { resourceTypeLabels } from "../../data/resources";
import {
  IconArrowRight,
  IconCheck,
  IconLearner,
  IconParent,
  IconSchool,
  IconTeacher,
} from "../../lib/icons";
import type { RoleId } from "../../types";

const roleCards: {
  role: RoleId;
  icon: typeof IconLearner;
  title: string;
  quote: string;
  anchor: string;
}[] = [
  {
    role: "learner",
    icon: IconLearner,
    title: "Learners",
    quote: "I want to improve my marks.",
    anchor: "learners",
  },
  {
    role: "parent",
    icon: IconParent,
    title: "Parents",
    quote: "I want to support my child.",
    anchor: "parents",
  },
  {
    role: "teacher",
    icon: IconTeacher,
    title: "Teachers",
    quote: "I need resources and tools.",
    anchor: "teachers",
  },
  {
    role: "school",
    icon: IconSchool,
    title: "Schools",
    quote: "I want school-wide support.",
    anchor: "schools",
  },
];

const publicationSteps: { type: keyof typeof resourceTypeLabels; description: string }[] = [
  { type: "learner-book", description: "Clear, CAPS-aligned content learners can study from directly." },
  { type: "workbook", description: "Structured practice exercises that build topic mastery step by step." },
  { type: "teacher-guide", description: "Pacing, teaching notes and guidance to support every lesson." },
  { type: "test", description: "Weekly and revision tests with memos to check real understanding." },
];

const howItWorks = [
  { step: "Learn", detail: "Browse clear, grade-specific content by topic." },
  { step: "Practise", detail: "Work through questions at your own level and pace." },
  { step: "Assess", detail: "Take short tests to check understanding." },
  { step: "Analyse", detail: "See exactly where marks are being lost." },
  { step: "Improve", detail: "Get a clear plan for what to focus on next." },
];

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(230,172,46,0.35), transparent 40%), radial-gradient(circle at 85% 0%, rgba(79,127,174,0.4), transparent 45%)",
          }}
        />
        <div className="container-page relative py-16 sm:py-24">
          <Badge tone="gold">Done Well Publications · South Africa</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            Everything you need to help learners succeed.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-navy-200">
            DONE WELL® combines quality educational resources, practice, assessment and progress support in one
            affordable hub — for learners, parents, teachers and schools.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="link" to="/sign-in" variant="secondary" size="lg" icon={<IconArrowRight className="h-5 w-5" />} iconPosition="right">
              Try the demo
            </Button>
            <Button
              as="a"
              href="#publications"
              variant="outline"
              size="lg"
              className="border-navy-700 bg-transparent text-white hover:bg-white/10"
            >
              See publications
            </Button>
          </div>
        </div>
      </section>

      {/* Role cards */}
      <section className="container-page -mt-8 relative pb-4 sm:-mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roleCards.map(({ role, icon: Icon, title, quote, anchor }) => (
            <Card key={role} id={anchor} className="scroll-mt-24">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-navy-900">{title}</p>
              <p className="mt-1 text-sm italic text-navy-500">“{quote}”</p>
              <Link
                to="/sign-in"
                state={{ intendedRole: role }}
                className="focus-ring mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-gold-600"
              >
                Explore {title.toLowerCase()} demo
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Publications */}
      <section id="publications" className="container-page scroll-mt-20 py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">Our publications</p>
          <h2 className="mt-1.5 text-2xl font-bold text-navy-900 sm:text-3xl">
            Built on trusted Done Well content
          </h2>
          <p className="mt-2 max-w-2xl text-navy-500">
            Every practice question and test on the platform connects back to Done Well's published resources.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {publicationSteps.map(({ type, description }) => (
            <Card key={type}>
              <Badge tone="navy">{resourceTypeLabels[type]}</Badge>
              <p className="mt-3 text-sm text-navy-600">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy-50/60 py-16">
        <div className="container-page">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">How it works</p>
            <h2 className="mt-1.5 text-2xl font-bold text-navy-900 sm:text-3xl">
              From publication to progress
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-5">
            {howItWorks.map(({ step, detail }, i) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 font-display text-lg font-bold text-gold-400">
                  {i + 1}
                </div>
                <p className="mt-3 font-display font-semibold text-navy-900">{step}</p>
                <p className="mt-1 text-sm text-navy-500">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section id="pricing" className="container-page scroll-mt-20 py-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">Simple, affordable pricing</p>
          <h2 className="mt-1.5 text-2xl font-bold text-navy-900 sm:text-3xl">No unnecessary complexity</h2>
          <p className="mx-auto mt-2 max-w-xl text-navy-500">
            Start free. Upgrade only when you need more — pricing shown is for preview in this prototype.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.id}
              className={tier.highlighted ? "border-gold-400 ring-2 ring-gold-300" : ""}
            >
              {tier.highlighted ? <Badge tone="gold">Most popular</Badge> : null}
              <p className="mt-2 font-display text-lg font-semibold text-navy-900">{tier.name}</p>
              <p className="mt-1">
                <span className="text-2xl font-bold text-navy-900">{tier.price}</span>
                {tier.period ? <span className="text-sm text-navy-400">{tier.period}</span> : null}
              </p>
              <p className="mt-2 text-sm text-navy-500">{tier.description}</p>
              <ul className="mt-4 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-navy-600">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                as="link"
                to="/sign-in"
                variant={tier.highlighted ? "primary" : "outline"}
                className="mt-5 w-full"
              >
                {tier.ctaLabel}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy-900 py-14">
        <div className="container-page flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">Ready to see it in action?</h2>
            <p className="mt-1 text-navy-300">Explore a live demo dashboard for any role — free, no signup.</p>
          </div>
          <Button as="link" to="/sign-in" variant="secondary" size="lg">
            Try the demo
          </Button>
        </div>
      </section>
    </div>
  );
}
