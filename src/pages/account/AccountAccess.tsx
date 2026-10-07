import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { ConsoleShell } from '@/components/layout/ConsoleShell'
import { ACCESS_CONTACT, TRIAL_DAYS, daysUntil, fetchMyAccess, longDate, type MyAccess } from '@/lib/access'
import { cn } from '@/lib/utils'

/**
 * "Your access": what this account can use and why, and how to get the whole
 * question bank -- through the school's licence, or a personal plan paid by
 * EFT and switched on by DONE WELL. There is no card payment in the app yet,
 * so the page hands the person to WhatsApp or email with their sign-in email
 * already written in, which is all DONE WELL needs to find the account.
 */
export function AccountAccess() {
  const { session, profile } = useAccountAuth()
  const [access, setAccess] = useState<MyAccess | null | undefined>(undefined)
  const email = session?.user.email ?? ''

  useEffect(() => {
    let active = true
    fetchMyAccess(session?.user.id).then((a) => {
      if (active) setAccess(a)
    })
    return () => {
      active = false
    }
  }, [session?.user.id])

  const isLead = profile?.role === 'school' || profile?.role === 'hod'
  const askPlan = `Hello DONE WELL. I would like a personal plan. My sign-in email is ${email || '(my email)'}.`
  const askSchool = `Hello DONE WELL. I am writing about a DONE WELL licence for ${profile?.role === 'learner' || profile?.role === 'parent' ? 'my school' : 'our school'}. My sign-in email is ${email || '(my email)'}.`

  return (
    <ConsoleShell title="Your access">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 [text-wrap:balance]">Your access to DONE WELL</h1>
          <p className="mt-1 text-sm text-navy-600">
            Every account starts with a {TRIAL_DAYS}-day free trial of the whole question bank. After that, the full bank
            comes with a school licence or a personal plan. A sample of every topic stays free.
          </p>
        </div>

        <StatusCard access={access} />

        <section aria-labelledby="ways" className="space-y-3">
          <h2 id="ways" className="text-sm font-semibold uppercase tracking-wide text-navy-500">
            Ways to get every question and paper
          </h2>

          <div className="card p-5">
            <h3 className="font-bold text-navy-900">Through your school</h3>
            <p className="mt-1 text-sm text-navy-700">
              When a school takes a DONE WELL licence, every learner and teacher it approves gets the full bank, the
              weekly tests and the class reports. A school can start with a free pilot for one term.
            </p>
            {access?.schoolState === 'waiting' ? (
              <p className="mt-2 text-sm text-amber-800">Your school has not approved your account yet. Ask your teacher to approve you.</p>
            ) : null}
            <p className="mt-2 text-sm text-navy-700">
              {isLead
                ? 'Contact us to start or renew your school’s licence.'
                : 'Ask your principal or head of department to contact us, or send us the school’s name and we will contact them.'}
            </p>
            <ContactButtons message={askSchool} subject="DONE WELL school licence" />
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-navy-900">A personal plan</h3>
            <p className="mt-1 text-sm text-navy-700">For a learner, or a parent paying for their child’s account.</p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-navy-700">
              <li>Send us your sign-in email on WhatsApp or by email. The buttons below write the message for you.</li>
              <li>We reply with the price and our banking details.</li>
              <li>Pay by EFT, with your sign-in email as the reference.</li>
              <li>We switch your plan on, usually within one working day. Sign out and in again to see it.</li>
            </ol>
            {email ? (
              <p className="mt-3 rounded-lg bg-navy-50 px-3 py-2 text-sm text-navy-700">
                Your sign-in email: <span className="font-semibold text-navy-900">{email}</span>
              </p>
            ) : null}
            <ContactButtons message={askPlan} subject="DONE WELL personal plan" />
          </div>
        </section>

        <p className="text-sm text-navy-600">
          <Link to="/account" className="font-semibold text-navy-900 underline">
            Back to my account
          </Link>
        </p>
      </div>
    </ConsoleShell>
  )
}

function StatusCard({ access }: { access: MyAccess | null | undefined }) {
  if (access === undefined) return <p className="text-sm text-navy-500">Checking your access…</p>
  if (access === null) {
    return (
      <div className="card p-5 text-sm text-navy-700">
        We could not check your access just now. Check your connection and open this page again.
      </div>
    )
  }

  let title: string
  let detail: string
  let full = true
  switch (access.reason) {
    case 'admin':
    case 'editor':
      title = 'Full access'
      detail = 'You are part of the DONE WELL team.'
      break
    case 'school':
      title = 'Full access through your school'
      detail =
        access.schoolState === 'overdue'
          ? 'Your school’s licence payment is overdue, but everything still works for now.'
          : access.licenceEndsOn
            ? `Your school’s licence runs until ${longDate(access.licenceEndsOn)}.`
            : 'Your school’s licence covers you.'
      break
    case 'plan':
      title = 'Full access with your personal plan'
      detail = access.planEndsOn ? `Your plan runs until ${longDate(access.planEndsOn)}.` : 'Your plan is active.'
      break
    case 'trial': {
      const days = access.trialEndsAt ? Math.max(0, daysUntil(access.trialEndsAt)) : 0
      title = 'Free trial'
      detail = access.trialEndsAt
        ? `Every question and paper until ${longDate(access.trialEndsAt)}: ${days === 0 ? 'ends today' : `${days} day${days === 1 ? '' : 's'} left`}.`
        : 'Every question and paper for now.'
      break
    }
    default:
      full = false
      title = 'Sample only'
      detail =
        access.schoolState === 'ended'
          ? `Your school’s licence ended${access.licenceEndsOn ? ` on ${longDate(access.licenceEndsOn)}` : ''}. You can still practise a sample of every topic, and your progress is kept.`
          : access.planEndsOn
            ? `Your plan ended on ${longDate(access.planEndsOn)}. You can still practise a sample of every topic, and your progress is kept.`
            : 'Your free trial has ended. You can still practise a sample of every topic, and your progress is kept.'
  }

  return (
    <div className={cn('card border-l-0 p-5', full ? 'bg-emerald-50/60' : 'bg-amber-50')}>
      <p className={cn('text-xs font-semibold uppercase tracking-wide', full ? 'text-emerald-800' : 'text-amber-800')}>Right now</p>
      <p className="mt-1 text-lg font-bold text-navy-900">{title}</p>
      <p className="mt-1 text-sm text-navy-700">{detail}</p>
    </div>
  )
}

function ContactButtons({ message, subject }: { message: string; subject: string }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <a
        href={`https://wa.me/${ACCESS_CONTACT.whatsapp}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary btn-sm"
      >
        WhatsApp {ACCESS_CONTACT.whatsappLabel}
      </a>
      <a
        href={`mailto:${ACCESS_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
        className="btn-outline btn-sm"
      >
        Email us
      </a>
    </div>
  )
}
