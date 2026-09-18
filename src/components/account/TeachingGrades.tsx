import { ALL_GRADES, writeTeachingGrades } from '@/lib/teacherScope'
import { cn } from '@/lib/utils'

/**
 * Which grades a teacher's roster and analytics cover.
 *
 * Shown as three toggles rather than a dropdown because teaching more than one
 * grade is normal -- a dropdown would force "all or one" and most teachers are
 * neither.
 */
export function TeachingGrades({
  profileId,
  grades,
  onChange,
}: {
  profileId: string
  grades: number[]
  onChange: (grades: number[]) => void
}) {
  const toggle = (grade: number) => {
    const next = grades.includes(grade) ? grades.filter((g) => g !== grade) : [...grades, grade].sort()
    // Turning the last one off would leave an empty screen with no way to read
    // why, so the last selected grade stays on.
    if (next.length === 0) return
    writeTeachingGrades(profileId, next)
    onChange(next)
  }

  const all = grades.length === ALL_GRADES.length

  return (
    <div className="card flex flex-wrap items-center gap-3 p-4">
      <p className="min-w-0 flex-1 text-sm text-navy-700">
        {all ? (
          <>Showing <strong className="font-semibold text-navy-900">all grades</strong>. Turn off the ones you do not teach.</>
        ) : (
          <>
            Showing{' '}
            <strong className="font-semibold text-navy-900">
              Grade {grades.join(' and Grade ')}
            </strong>{' '}
            only.
          </>
        )}
      </p>
      <div className="flex shrink-0 gap-2">
        {ALL_GRADES.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={grades.includes(g)}
            onClick={() => toggle(g)}
            className={cn(
              'rounded-lg border px-3 py-2 text-xs font-semibold transition-colors',
              grades.includes(g)
                ? 'border-gold-500 bg-gold-500 text-navy-900'
                : 'border-navy-200 bg-white text-navy-500 hover:bg-navy-50',
            )}
          >
            Gr {g}
          </button>
        ))}
      </div>
    </div>
  )
}
