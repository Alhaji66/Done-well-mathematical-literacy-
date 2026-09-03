import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@/components/ui/Icons'

interface LegalLayoutProps {
  title: string
  updated: string
  children: ReactNode
}

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <div className="container-page py-12 sm:py-16">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-navy-600 hover:text-navy-900">
        <ArrowLeftIcon className="h-4 w-4" /> Back to homepage
      </Link>

      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-navy-500">Last updated: {updated}</p>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-navy-700">{children}</div>
      </div>
    </div>
  )
}
