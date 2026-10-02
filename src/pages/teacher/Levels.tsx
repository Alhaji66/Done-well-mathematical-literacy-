import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { demoLevelData, demoToday } from '@/data/demoLevels'
import { LevelsView } from '@/components/levels/LevelsView'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CatchUpImpactPanel } from '@/components/interventions/CatchUpImpact'
import { demoImpactGroups } from '@/data/demoCatchUp'

/**
 * The demo levels page. The teacher sees each learner in their three sample
 * Mathematical Literacy classes; the head of department sees those classes'
 * tally and can switch to each learner; the principal sees the tally for a
 * class in every subject.
 */
export function DemoLevels({ scope }: { scope: 'teacher' | 'hod' | 'school' }) {
  const [data] = useState(() => demoLevelData(scope))
  const [today] = useState(() => demoToday(data))
  const [groups] = useState(() => demoImpactGroups(scope))
  const { hash } = useLocation()
  // Arriving from the dashboard's catch-up card opens at the breakdown.
  useEffect(() => {
    if (hash === '#catch-up') document.getElementById('catch-up')?.scrollIntoView()
  }, [hash])
  const teacher = scope === 'teacher'
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="CAPS levels · sample data"
        title={teacher ? 'My learners’ levels' : scope === 'hod' ? 'Levels in the department' : 'Levels across the school'}
        description={
          teacher
            ? 'Each learner’s level, 1 to 7, on every weekly test and SBA task, and for the term or year.'
            : scope === 'hod'
              ? 'How many learners in your subject are at each level, 1 to 7. Switch to Learners to see each learner’s level, class by class.'
              : 'How many learners are at each level, 1 to 7, by subject and grade. Open a row to see each class and each test.'
        }
      />
      <LevelsView
        data={data}
        mode={teacher ? 'learners' : scope === 'hod' ? 'both' : 'tally'}
        today={today}
        // The demo has no database: the group is not saved, and says so.
        onStartGroup={async () => undefined}
        groupsLink={<span className="text-emerald-800">(Demo: the group is not saved.)</span>}
      />
      <div id="catch-up" className="scroll-mt-20">
        <CatchUpImpactPanel
          groups={groups}
          teacherName={(name) => name ?? 'A former member of staff'}
          views={scope === 'school' ? ['subject', 'teacher', 'topic'] : scope === 'hod' ? ['teacher', 'topic'] : ['topic']}
          action={
            <Link to={`/app/${scope}/intervention-report`} className="text-sm font-semibold text-navy-700 underline-offset-2 hover:underline">
              Print the term report →
            </Link>
          }
        />
      </div>
    </div>
  )
}
