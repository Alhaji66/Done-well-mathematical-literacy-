import { LEARNER_SUBJECTS, toggleSubject } from '@/lib/learnerSubjects'
import { cn } from '@/lib/utils'

/**
 * Tick every subject the learner takes. Ticking Mathematics untoggles
 * Mathematical Literacy and the other way round, because CAPS allows only one
 * of the two; the last subject cannot be unticked.
 */
export function SubjectPicker({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {LEARNER_SUBJECTS.map((s) => {
        const on = value.includes(s.id)
        return (
          <button
            key={s.id}
            type="button"
            role="checkbox"
            aria-checked={on}
            onClick={() => onChange(toggleSubject(value, s.id))}
            className={cn(
              'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors',
              on ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-200 bg-white text-navy-700 hover:border-navy-400',
            )}
          >
            <span
              aria-hidden="true"
              className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]', on ? 'border-gold-400 bg-gold-400 text-navy-900' : 'border-navy-300')}
            >
              {on ? '✓' : ''}
            </span>
            {s.name}
          </button>
        )
      })}
    </div>
  )
}
