import { useEffect, useState } from 'react'
import { getTopic } from '@/data/topics'
import { TargetIcon } from '@/components/ui/Icons'
import { fetchInterventionsFor, type Intervention, type InterventionLearner } from '@/lib/interventions'

/**
 * The catch-up groups some learners are in, as the learner or their parent
 * sees them: the topic, the teacher's plan, and where the learner started.
 * The database shows each viewer only the groups they are part of.
 */
export function CatchUpGroups({
  learnerIds,
  names,
  audience,
}: {
  learnerIds: string[]
  /** Learner names, for a parent with more than one child. */
  names?: Map<string, string>
  audience: 'learner' | 'parent'
}) {
  const [groups, setGroups] = useState<Intervention[]>([])
  const [places, setPlaces] = useState<InterventionLearner[]>([])
  const key = learnerIds.join(',')

  useEffect(() => {
    let active = true
    fetchInterventionsFor(learnerIds).then((r) => {
      if (!active) return
      setGroups(r.interventions.filter((g) => g.status === 'active'))
      setPlaces(r.places)
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (groups.length === 0) return null

  return (
    <section className="space-y-3">
      <h3 className="font-bold text-navy-900">{audience === 'learner' ? 'Your catch-up groups' : 'Extra help at school'}</h3>
      {groups.map((g) => {
        const mine = places.filter((p) => p.intervention_id === g.id)
        return (
          <div key={g.id} className="card flex gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
              <TargetIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 space-y-1.5">
              <p className="font-semibold text-navy-900">{getTopic(g.topic_id)?.name ?? 'A topic'}</p>
              <p className="text-sm text-navy-600">
                {audience === 'learner'
                  ? 'Your teacher has put you in a small group to catch up on this topic. A short test for the group will show how far you have come.'
                  : `${mine.map((p) => names?.get(p.learner_id) ?? 'Your child').join(' and ')} ${mine.length === 1 ? 'is' : 'are'} in a small catch-up group on this topic at school.`}
              </p>
              {g.plan ? <p className="whitespace-pre-line rounded-lg bg-navy-50 p-3 text-sm text-navy-700">{g.plan}</p> : null}
              {mine.some((p) => p.baseline_percent !== null) ? (
                <p className="text-xs text-navy-500">
                  Starting point:{' '}
                  {mine
                    .filter((p) => p.baseline_percent !== null)
                    .map((p) => `${names && mine.length > 1 ? `${names.get(p.learner_id) ?? ''} ` : ''}${p.baseline_percent}%`)
                    .join(', ')}
                </p>
              ) : null}
            </div>
          </div>
        )
      })}
    </section>
  )
}
