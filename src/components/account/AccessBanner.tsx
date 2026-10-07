import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { daysUntil, fetchMyAccess, longDate, type MyAccess } from '@/lib/access'
import { cn } from '@/lib/utils'

/**
 * One line on a dashboard about the account's access to the full question
 * bank (STEP 39), only when there is something to know: a trial counting
 * down, a trial or plan that has ended, a plan about to end, or -- for the
 * principal and HODs, who deal with DONE WELL -- the school's licence ending,
 * overdue or ended. Quiet otherwise.
 */
export function AccessBanner() {
  const { profile } = useAccountAuth()
  const { pathname } = useLocation()
  const [access, setAccess] = useState<MyAccess | null>(null)
  const onDashboard = pathname.endsWith('/dashboard')

  useEffect(() => {
    if (!onDashboard) return
    let active = true
    fetchMyAccess(profile?.id).then((a) => {
      if (active) setAccess(a)
    })
    return () => {
      active = false
    }
  }, [profile?.id, onDashboard])

  if (!onDashboard || !access || !profile) return null
  const message = bannerFor(access, profile.role === 'school' || profile.role === 'hod')
  if (!message) return null

  return (
    <div
      role="status"
      className={cn(
        'mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border px-4 py-3 text-sm',
        message.tone === 'warn' ? 'border-amber-300 bg-amber-50 text-amber-950' : 'border-navy-100 bg-white text-navy-700',
      )}
    >
      <p>{message.text}</p>
      <Link to="/account/access" className={cn('btn-sm shrink-0', message.tone === 'warn' ? 'btn-primary' : 'btn-outline')}>
        {message.action}
      </Link>
    </div>
  )
}

interface Banner {
  text: string
  action: string
  tone: 'info' | 'warn'
}

function bannerFor(a: MyAccess, schoolLead: boolean): Banner | null {
  // The principal and HODs hear about the licence first: it covers everyone.
  if (schoolLead) {
    if (a.schoolState === 'ended') {
      return {
        text: `Your school's DONE WELL licence ended${a.licenceEndsOn ? ` on ${longDate(a.licenceEndsOn)}` : ''}. New learners wait to be let in, and your learners and teachers see only a sample of the question bank.`,
        action: 'Renew the licence',
        tone: 'warn',
      }
    }
    if (a.schoolState === 'overdue') {
      return {
        text: 'Payment for your school’s DONE WELL licence is overdue. Everything still works for now.',
        action: 'Contact DONE WELL',
        tone: 'warn',
      }
    }
    if (a.schoolState === 'current' && a.licenceEndsOn && daysUntil(a.licenceEndsOn) <= 30) {
      return {
        text: `Your school's DONE WELL licence ends on ${longDate(a.licenceEndsOn)}.`,
        action: 'Renew the licence',
        tone: 'info',
      }
    }
  }
  if (a.reason === null) {
    return {
      text:
        a.schoolState === 'ended'
          ? 'Your school’s DONE WELL licence has ended, so you see a sample of each topic.'
          : a.planEndsOn
            ? 'Your plan has ended, so you see a sample of each topic.'
            : 'Your free trial has ended, so you see a sample of each topic.',
      action: 'Get full access',
      tone: 'warn',
    }
  }
  if (a.reason === 'trial' && a.trialEndsAt) {
    const days = Math.max(0, daysUntil(a.trialEndsAt))
    return {
      text: `Free trial: ${days === 0 ? 'ends today' : `${days} day${days === 1 ? '' : 's'} left`} with every question and paper.`,
      action: 'Keep full access',
      tone: days <= 3 ? 'warn' : 'info',
    }
  }
  if (a.reason === 'plan' && a.planEndsOn && daysUntil(a.planEndsOn) <= 7) {
    return { text: `Your plan ends on ${longDate(a.planEndsOn)}.`, action: 'Renew', tone: 'info' }
  }
  return null
}
