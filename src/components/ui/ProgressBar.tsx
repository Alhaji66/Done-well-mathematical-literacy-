import { cn } from '@/lib/utils'

interface ProgressBarProps {
  percent: number
  className?: string
  trackClassName?: string
  barClassName?: string
  size?: 'sm' | 'md'
}

export function ProgressBar({ percent, className, trackClassName, barClassName, size = 'md' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  const color =
    clamped >= 70 ? 'bg-emerald-500' : clamped >= 45 ? 'bg-gold-500' : 'bg-rose-500'
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-navy-100', size === 'sm' ? 'h-1.5' : 'h-2.5', trackClassName, className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500', barClassName ?? color)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
