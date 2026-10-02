import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchLevelData } from '@/lib/levelData'
import type { LevelData } from '@/lib/levels'
import { LevelsView } from '@/components/levels/LevelsView'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { startIntervention } from '@/lib/interventions'

/**
 * Learners' levels, 1 to 7, from weekly tests and SBA tasks. A class teacher
 * sees each of their learners; a head of department sees how many learners
 * in their subject are at each level and, class by class, who they are; a
 * principal sees how many learners in the school are at each level.
 */
export function Levels() {
  const { profile } = useAccountAuth()
  const [data, setData] = useState<LevelData | null>(null)
  const teacher = profile?.role === 'teacher'
  const hod = profile?.role === 'hod'

  useEffect(() => {
    if (!profile) return
    let live = true
    fetchLevelData(profile).then((d) => live && setData(d))
    return () => {
      live = false
    }
  }, [profile])

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="CAPS levels"
        title={teacher ? 'My learners’ levels' : 'Levels across the school'}
        description={
          teacher
            ? 'Each learner’s level, 1 to 7, on every weekly test and SBA task, and for the term or year.'
            : profile?.role === 'hod'
              ? 'How many learners in your subject are at each level, 1 to 7, by grade, class and test. Switch to Learners to see each learner’s level, class by class.'
              : 'How many learners are at each level, 1 to 7, in every subject and grade, then by class and by test.'
        }
      />
      {data ? (
        <LevelsView
          data={data}
          mode={teacher ? 'learners' : hod ? 'both' : 'tally'}
          onStartGroup={async ({ classId, learners, topicId, plan }) => {
            const cls = data.classes.find((c) => c.id === classId)
            if (!profile?.school_id || !cls) return 'Your account is not linked to a school.'
            const result = await startIntervention({
              schoolId: profile.school_id,
              createdBy: profile.id,
              classId,
              subjectId: cls.subject_id,
              grade: cls.grade,
              topicId,
              subtopic: null,
              plan,
              diagnosticTestId: null,
              learners,
            })
            return result.error
          }}
          groupsLink={
            <Link to="../interventions" relative="path" className="font-semibold underline">
              Open Catch-up groups
            </Link>
          }
        />
      ) : (
        <p className="text-sm text-navy-500">Loading levels…</p>
      )}
    </div>
  )
}
