import { useState } from 'react'
import { demoLearner } from '@/data/learner'
import { demoMyLevels, demoToday } from '@/data/demoLevels'
import { MyLevelsCard } from '@/components/levels/MyLevelsCard'

/** The demo learner's levels card; the parent demo shows the same child. */
export default function DemoMyLevels({ parent = false }: { parent?: boolean }) {
  const [results] = useState(() => demoMyLevels())
  const [today] = useState(() => demoToday({ results }))
  const first = demoLearner.name.split(' ')[0]
  return <MyLevelsCard results={results} title={parent ? `${first}’s levels` : 'My levels'} child={parent ? first : undefined} today={today} />
}
