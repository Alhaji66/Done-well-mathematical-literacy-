import { useEffect, useState } from 'react'
import type { AccountProfile } from '@/context/AccountAuthContext'
import { fetchImpactGroups } from '@/lib/catchUpData'
import { demoImpactGroups } from '@/data/demoCatchUp'
import type { ImpactGroup } from '@/lib/catchUpImpact'
import { CatchUpImpactCard } from '@/components/interventions/CatchUpImpact'

/** The card with live data, for the account dashboards of teachers, HODs and principals. */
export default function CatchUpImpact({ profile, to }: { profile: AccountProfile; to: string }) {
  const [groups, setGroups] = useState<ImpactGroup[] | null>(null)

  useEffect(() => {
    let live = true
    fetchImpactGroups(profile).then((g) => live && setGroups(g))
    return () => {
      live = false
    }
  }, [profile])

  return groups ? <CatchUpImpactCard groups={groups} to={to} /> : null
}

/** The card for the demo dashboards, from the demo's sample catch-up groups. */
export function DemoCatchUpImpact({ scope, to }: { scope: 'teacher' | 'hod' | 'school'; to?: string }) {
  const [groups] = useState(() => demoImpactGroups(scope))
  return <CatchUpImpactCard groups={groups} to={to} linkLabel="See the breakdown →" />
}
