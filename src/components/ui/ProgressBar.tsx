import { cn } from '@/lib/utils'

interface ProgressBarProps {
  percent: number
  /**
   * What this bar is measuring, for a screen reader -- "Overall mastery",
   * "Grade 11 average". A progressbar with no name is announced as a bare
   * percentage with nothing to attach it to, which is the one thing a person
   * who cannot see the surrounding heading actually needs.
   */
  label?: string
  className?: string
  trackClassName?: string
  barClassName?: string
  size?: 'sm' | 'md'
}

export function ProgressBar({ percent, label, className, trackClassName, barClassName, size = 'md' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  const color =
    clamped >= 70 ? 'bg-emerald-500' : clamped >= 45 ? 'bg-gold-500' : 'bg-rose-500'
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-navy-100', size === 'sm' ? 'h-1.5' : 'h-2.5', trackClassName, className)}
      role="progressbar"
      aria-label={label ?? 'Progress'}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${Math.round(clamped)}%`}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500', barClassName ?? color)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
