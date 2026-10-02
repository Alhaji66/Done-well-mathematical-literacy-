import { useEffect, useState } from 'react'
import { fetchLevelsFor } from '@/lib/myLevels'
import type { LevelResult } from '@/lib/levels'
import { MyLevelsCard } from '@/components/levels/MyLevelsCard'

/** The card with live data, for a learner (their own) or a parent (one card per linked child). */
export default function MyLevels({ learners }: { learners: { id: string; name?: string }[] }) {
  const [data, setData] = useState<{ results: LevelResult[]; hiddenTests: Map<string, number> } | null>(null)
  const ids = learners.map((l) => l.id).join(',')

  useEffect(() => {
    if (!ids) return
    let live = true
    fetchLevelsFor(ids.split(',')).then((d) => live && setData(d))
    return () => {
      live = false
    }
  }, [ids])

  if (!data) return null
  return (
    <>
      {learners.map((l) => (
        <MyLevelsCard
          key={l.id}
          title={l.name ? `${l.name}’s levels` : 'My levels'}
          results={data.results.filter((r) => r.learnerId === l.id)}
          hiddenTests={data.hiddenTests.get(l.id) ?? 0}
          child={l.name}
        />
      ))}
    </>
  )
}
