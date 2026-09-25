import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  PLAN_LABEL,
  STATUS_LABEL,
  currentSubscription,
  fetchSponsorsAndProgrammes,
  fetchSubscriptions,
  type Programme,
  type Sponsor,
  type Subscription,
} from '@/lib/platform'
import { ProgressBar } from '@/components/ui/ProgressBar'

/**
 * The school's own licence: plan, status, seats used and when it ends, and any
 * sponsored programme it is part of. Going over the seat count never locks a
 * learner out -- it is flagged here so the school can sort it out with DONE WELL.
 */
export function SchoolLicence({ schoolId, learners }: { schoolId: string | null; learners: number }) {
  const [sub, setSub] = useState<Subscription | null | undefined>(undefined)
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    if (!schoolId || !supabase) return
    let active = true
    Promise.all([fetchSubscriptions(schoolId), fetchSponsorsAndProgrammes()]).then(([subs, sp]) => {
      if (!active) return
      setSub(currentSubscription(subs))
      setProgrammes(sp.programmes)
      setSponsors(sp.sponsors)
    })
    return () => {
      active = false
    }
  }, [schoolId])

  if (sub === undefined) return null

  const over = sub?.learner_seats != null && learners > sub.learner_seats
  const ending = sub?.ends_on ? Math.ceil((new Date(sub.ends_on).getTime() - Date.now()) / 86_400_000) : null

  return (
    <div className="card space-y-3 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-bold text-navy-900">Licence</h3>
        {sub ? (
          <span className={sub.status === 'active' ? 'badge-green' : 'badge-red'}>{STATUS_LABEL[sub.status]}</span>
        ) : null}
      </div>
      {!sub ? (
        <p className="text-sm text-navy-600">
          No licence is recorded for your school yet. Contact DONE WELL to set up a pilot or a school licence.
        </p>
      ) : (
        <>
          <p className="text-sm text-navy-700">
            {PLAN_LABEL[sub.plan]}
            {sub.ends_on
              ? ` · until ${new Date(sub.ends_on).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}`
              : ''}
            {ending !== null && ending >= 0 && ending <= 30 ? (
              <span className="ml-1 font-semibold text-amber-700">({ending} day{ending === 1 ? '' : 's'} left)</span>
            ) : null}
          </p>
          {sub.learner_seats != null ? (
            <div>
              <div className="flex justify-between text-xs text-navy-500">
                <span>Learner seats</span>
                <span className={over ? 'font-semibold text-rose-700' : 'tabular-nums'}>
                  {learners} of {sub.learner_seats}
                </span>
              </div>
              <ProgressBar
                percent={sub.learner_seats ? Math.min(100, Math.round((learners / sub.learner_seats) * 100)) : 100}
                size="sm"
                className="mt-1"
                label="Learner seats used"
              />
              {over ? (
                <p className="mt-2 text-xs text-rose-700">
                  More learners have joined than the licence covers. Nobody has been locked out — contact DONE WELL to
                  add seats.
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      )}
      {programmes.length ? (
        <p className="border-t border-navy-100 pt-3 text-sm text-navy-600">
          Part of{' '}
          {programmes
            .map((p) => `${p.name}${sponsors.find((s) => s.id === p.sponsor_id) ? `, sponsored by ${sponsors.find((s) => s.id === p.sponsor_id)!.name}` : ''}`)
            .join('; ')}
          . Sponsors see your school's totals only — never a learner's name or results.
        </p>
      ) : null}
    </div>
  )
}
