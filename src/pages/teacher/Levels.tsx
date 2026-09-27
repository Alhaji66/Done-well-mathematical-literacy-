import { useState } from 'react'
import { demoLevelData } from '@/data/demoLevels'
import { LevelsView } from '@/components/levels/LevelsView'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * The demo levels page. The teacher sees each learner in their three sample
 * Mathematical Literacy classes; the head of department sees those classes'
 * tally; the principal sees the tally for a class in every subject.
 */
export function DemoLevels({ scope }: { scope: 'teacher' | 'hod' | 'school' }) {
  const [data] = useState(() => demoLevelData(scope))
  const teacher = scope === 'teacher'
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="CAPS levels · sample data"
        title={teacher ? 'My learners’ levels' : scope === 'hod' ? 'Levels in the department' : 'Levels across the school'}
        description={
          teacher
            ? 'Each learner’s level, 1 to 7, on every weekly test and SBA task, and for the term or year.'
            : 'How many learners are at each level, 1 to 7, by subject and grade. Open a row to see each class and each test.'
        }
      />
      <LevelsView data={data} mode={teacher ? 'learners' : 'tally'} />
    </div>
  )
}
