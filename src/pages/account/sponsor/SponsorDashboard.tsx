import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { ConsoleShell } from '@/components/layout/ConsoleShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PrinterIcon } from '@/components/ui/Icons'
import {
  fetchProgrammeTotals,
  fetchSponsorsAndProgrammes,
  usePlatformAccess,
  type Programme,
  type ProgrammeTotals,
  type Sponsor,
} from '@/lib/platform'

const val = (v: number | null, suffix = '') => (v === null ? '—' : `${v}${suffix}`)

/**
 * What a sponsor sees: each school in their programme, in totals.
 *
 * Deliberately no learner names, no learner rows and no drill-down -- the
 * database function behind this page returns only per-school counts, and
 * withholds a school's figures entirely when it has fewer than five learners.
 */
export function SponsorDashboard() {
  const { session } = useAccountAuth()
  const access = usePlatformAccess(session?.user.id)
  const [params, setParams] = useSearchParams()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [rows, setRows] = useState<ProgrammeTotals[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const programmeId = params.get('programme') ?? programmes[0]?.id ?? ''

  useEffect(() => {
    if (!access.checked) return
    fetchSponsorsAndProgrammes().then((r) => {
      setSponsors(r.sponsors)
      setProgrammes(r.programmes)
      setLoading(false)
    })
  }, [access.checked])

  useEffect(() => {
    if (!programmeId) return
    setRows([])
    fetchProgrammeTotals(programmeId).then((r) => {
      setRows(r.rows)
      setError(r.error ?? '')
    })
  }, [programmeId])

  if (!access.checked || loading) {
    return (
      <ConsoleShell title="Sponsor dashboard">
        <p className="text-sm text-navy-500">Loading…</p>
      </ConsoleShell>
    )
  }

  if (!access.sponsor && !access.admin) {
    return (
      <ConsoleShell title="Sponsor dashboard">
        <div className="card max-w-xl p-6 text-sm text-navy-700">
          <h2 className="text-lg font-bold text-navy-900">This page is for programme sponsors</h2>
          <p className="mt-2">
            Your account is not linked to a sponsor. If your organisation sponsors DONE WELL in schools, ask DONE WELL to
            give this sign-in access.
          </p>
          <Link to="/account" className="btn-outline btn-sm mt-4 inline-flex">
            Back to my account
          </Link>
        </div>
      </ConsoleShell>
    )
  }

  const programme = programmes.find((p) => p.id === programmeId)
  const shown = rows.filter((r) => !r.withheld)
  const sum = (k: keyof ProgrammeTotals) => shown.reduce((a, r) => a + ((r[k] as number | null) ?? 0), 0)
  const learners = sum('learners')
  const active = sum('active_7d')
  const reassessed = sum('reassessed')
  const improved = sum('improved')

  return (
    <ConsoleShell title="Sponsor dashboard">
      <div className="print-area space-y-6">
        <SectionHeading
          eyebrow={sponsors.find((s) => s.id === programme?.sponsor_id)?.name ?? 'Sponsor'}
          title={programme?.name ?? 'Your programme'}
          description="How the schools in this programme are using DONE WELL, in totals. No learner is named or listed; a school with fewer than five learners is withheld."
          action={
            <div className="flex flex-wrap gap-2 print:hidden">
              {programmes.length > 1 ? (
                <select className="select" value={programmeId} onChange={(e) => setParams({ programme: e.target.value })} aria-label="Programme">
                  {programmes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              ) : null}
              <button type="button" onClick={() => window.print()} className="btn-outline inline-flex items-center gap-1.5">
                <PrinterIcon className="h-4 w-4" /> Print
              </button>
            </div>
          }
        />

        {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

        {programmes.length === 0 ? (
          <p className="text-sm text-navy-500">No programme has been set up for your organisation yet.</p>
        ) : (
          <>
            <dl className="grid gap-4 sm:grid-cols-4">
              {[
                ['Schools', rows.length],
                ['Learners', learners],
                ['Active this week', learners ? `${active} (${Math.round((active / learners) * 100)}%)` : '—'],
                ['Improved after catch-up', reassessed ? `${improved} of ${reassessed}` : '—'],
              ].map(([label, value]) => (
                <div key={label} className="card p-5">
                  <dt className="text-xs font-medium text-navy-500">{label}</dt>
                  <dd className="mt-1 text-2xl font-extrabold tabular-nums text-navy-900">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="card overflow-x-auto">
              <table className="w-full min-w-[44rem] text-sm">
                <thead>
                  <tr className="border-b border-navy-100 text-left text-xs text-navy-500">
                    <th className="p-3 font-medium">School</th>
                    <th className="p-3 text-right font-medium">Learners</th>
                    <th className="p-3 text-right font-medium">Active (7d)</th>
                    <th className="p-3 text-right font-medium">Questions (7d)</th>
                    <th className="p-3 text-right font-medium">Average mastery</th>
                    <th className="p-3 text-right font-medium">Tests handed in</th>
                    <th className="p-3 text-right font-medium">Improved / reassessed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50 tabular-nums">
                  {rows.map((r) => (
                    <tr key={r.school_id} className="print-avoid-break">
                      <td className="p-3 font-medium text-navy-900">{r.school_name}</td>
                      {r.withheld ? (
                        <td colSpan={6} className="p-3 text-right text-xs text-navy-500">
                          Withheld — fewer than five learners so far
                        </td>
                      ) : (
                        <>
                          <td className="p-3 text-right">{val(r.learners)}</td>
                          <td className="p-3 text-right">{val(r.active_7d)}</td>
                          <td className="p-3 text-right">{val(r.answers_7d)}</td>
                          <td className="p-3 text-right">{val(r.average_mastery, '%')}</td>
                          <td className="p-3 text-right">{val(r.tests_handed_in)}</td>
                          <td className="p-3 text-right">{r.reassessed ? `${r.improved} / ${r.reassessed}` : '—'}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-navy-500">
              Active means signed in or practised on at least one day in the last seven. Average mastery is practice mastery
              across all topics. "Improved" compares a learner's reassessment with where they started in a catch-up group.
            </p>
          </>
        )}
      </div>
    </ConsoleShell>
  )
}
