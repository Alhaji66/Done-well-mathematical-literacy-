import { useEffect, useState, type FormEvent } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { fetchLinkedChildren, linkChild, type LinkedChild } from '@/lib/parentLinks'
import { fetchLearnerProgress, type ProgressRow } from '@/lib/learnerProgress'
import { getTopic } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { HeartHandshakeIcon } from '@/components/ui/Icons'

const subjectNames: Record<string, string> = {
  'mat-lit': 'Mathematical Literacy',
  mathematics: 'Mathematics',
}

function ChildCard({ child }: { child: LinkedChild }) {
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchLearnerProgress(child.id).then((rows) => {
      if (active) {
        setProgress(rows)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [child.id])

  const overallMastery = progress.length
    ? Math.round(progress.reduce((s, p) => s + p.mastery_percent, 0) / progress.length)
    : 0
  const sorted = progress.slice().sort((a, b) => b.mastery_percent - a.mastery_percent)
  // Only split into separate strengths/weaknesses lists once there are
  // enough topics that the two lists can't share a topic -- with 3 or
  // fewer practised topics, "top 2" and "bottom 2" overlap and the same
  // topic would show up (confusingly) in both lists.
  const canSplit = sorted.length >= 4
  const strengths = canSplit ? sorted.slice(0, 2) : sorted
  const weaknesses = canSplit ? sorted.slice(-2).reverse() : []

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-navy-900">{child.full_name}</h3>
          <p className="text-xs text-navy-500">
            {child.grade ? `Grade ${child.grade}` : ''}
            {child.subject_id ? ` · ${subjectNames[child.subject_id] ?? child.subject_id}` : ''}
          </p>
        </div>
        <span className="text-lg font-bold text-navy-900">{loading ? '—' : `${overallMastery}%`}</span>
      </div>
      <ProgressBar percent={overallMastery} className="mt-3" />

      {!loading && progress.length === 0 ? (
        <p className="mt-3 text-xs text-navy-400">No practice recorded yet.</p>
      ) : !loading && canSplit ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Strengths</h4>
            <div className="mt-2 space-y-2">
              {strengths.map((s) => (
                <div key={s.topic_id} className="flex justify-between text-sm">
                  <span className="text-navy-700">{getTopic(s.topic_id)?.name ?? s.topic_id}</span>
                  <span className="font-semibold text-navy-900">{s.mastery_percent}%</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-rose-700">Needs attention</h4>
            <div className="mt-2 space-y-2">
              {weaknesses.map((s) => (
                <div key={s.topic_id} className="flex justify-between text-sm">
                  <span className="text-navy-700">{getTopic(s.topic_id)?.name ?? s.topic_id}</span>
                  <span className="font-semibold text-navy-900">{s.mastery_percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : !loading ? (
        <div className="mt-4 space-y-2">
          {sorted.map((s) => (
            <div key={s.topic_id} className="flex justify-between text-sm">
              <span className="text-navy-700">{getTopic(s.topic_id)?.name ?? s.topic_id}</span>
              <span className="font-semibold text-navy-900">{s.mastery_percent}%</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function ParentDashboard() {
  const { profile } = useAccountAuth()
  const [children, setChildren] = useState<LinkedChild[]>([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [linking, setLinking] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadChildren = () => {
    if (!profile) return
    fetchLinkedChildren(profile.id).then((rows) => {
      setChildren(rows)
      setLoading(false)
    })
  }

  useEffect(loadChildren, [profile])

  if (!profile) return null

  const submitCode = async (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLinking(true)
    setError('')
    setSuccess('')
    try {
      const { learnerFullName } = await linkChild(code)
      setCode('')
      setSuccess(`Linked to ${learnerFullName}.`)
      loadChildren()
    } catch (err) {
      const message = typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setLinking(false)
    }
  }

  const linkForm = (
    <form onSubmit={submitCode} className="card space-y-3 p-5">
      <div>
        <h3 className="font-bold text-navy-900">Link a child</h3>
        <p className="mt-1 text-sm text-navy-600">
          Ask your child to open their Dashboard and copy their family link code, then paste it here.
        </p>
      </div>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste the code from your child's dashboard"
        className="input"
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      <button type="submit" disabled={linking} className="btn-primary btn-sm">
        {linking ? 'Linking…' : 'Link child'}
      </button>
    </form>
  )

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Dashboard" title={`Welcome, ${profile.full_name}`} />

      {loading ? (
        <p className="text-sm text-navy-500">Loading…</p>
      ) : children.length === 0 ? (
        <>
          <EmptyState
            icon={<HeartHandshakeIcon className="h-6 w-6" />}
            title="You haven't linked a child yet"
            description="Once you link your child's account, their practice progress will show up here."
          />
          {linkForm}
        </>
      ) : (
        <>
          <div className="space-y-4">
            {children.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>
          {linkForm}
        </>
      )}
    </div>
  )
}
