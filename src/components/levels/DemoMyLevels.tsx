import { useState } from 'react'
import { demoLearner } from '@/data/learner'
import { demoMyLevels } from '@/data/demoLevels'
import { MyLevelsCard } from '@/components/levels/MyLevelsCard'

/** The demo learner's levels card; the parent demo shows the same child. */
export default function DemoMyLevels({ parent = false }: { parent?: boolean }) {
  const [results] = useState(() => demoMyLevels())
  return <MyLevelsCard results={results} title={parent ? `${demoLearner.name.split(' ')[0]}’s levels` : 'My levels'} />
}
