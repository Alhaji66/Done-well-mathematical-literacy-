import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  icon?: ReactNode
  hint?: string
  tone?: 'navy' | 'gold' | 'green' | 'red'
  className?: string
}

const toneMap = {
  navy: 'bg-navy-50 text-navy-700',
  gold: 'bg-gold-100 text-gold-700',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-rose-50 text-rose-700',
}

export function StatCard({ label, value, icon, hint, tone = 'navy', className }: StatCardProps) {
  return (
    <div className={cn('card flex flex-col gap-3 p-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-navy-500">{label}</span>
        {icon ? <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', toneMap[tone])}>{icon}</span> : null}
      </div>
      <div className="text-2xl font-bold text-navy-900">{value}</div>
      {hint ? <p className="text-xs text-navy-500">{hint}</p> : null}
    </div>
  )
}
