import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { supabase } from '@/lib/supabaseClient'
import { fetchLearnerProgress, type ProgressRow } from '@/lib/learnerProgress'
import { getTopic } from '@/data/topics'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { PencilIcon, TrendingUpIcon, ClipboardIcon, CheckIcon } from '@/components/ui/Icons'

function FamilyLinkCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be blocked (older browsers, permissions) --
      // the code is still selectable text, so this is a nice-to-have.
    }
  }

  return (
    <div className="card p-5">
      <h3 className="font-bold text-navy-900">Family link code</h3>
      <p className="mt-1 text-sm text-navy-600">Share this with a parent so they can follow your progress -- they'll paste it into their Dashboard.</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code className="select-all break-all rounded-lg bg-navy-50 px-3 py-2 text-xs text-navy-700">{code}</code>
        <button type="button" onClick={copy} className="btn-outline btn-sm inline-flex shrink-0 items-center gap-1.5">
          {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

const subjectNames: Record<string, string> = {
  'mat-lit': 'Mathematical Literacy',
  mathematics: 'Mathematics',
}

export function LearnerDashboard() {
  const { profile } = useAccountAuth()
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    let active = true

    fetchLearnerProgress(profile.id).then((rows) => {
      if (active) {
        setProgress(rows)
        setLoading(false)
      }
    })

    if (profile.school_id && supabase) {
      supabase
        .from('schools')
        .select('name')
        .eq('id', profile.school_id)
        .maybeSingle()
        .then(({ data }) => {
          if (active) setSchoolName(data?.name ?? null)
        })
    }

    return () => {
      active = false
    }
  }, [profile])

  if (!profile) return null

  const overallMastery = progress.length
    ? Math.round(progress.reduce((s, p) => s + p.mastery_percent, 0) / progress.length)
    : 0
  const totalAttempts = progress.reduce((s, p) => s + p.questions_attempted, 0)

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Dashboard"
        title={`Welcome, ${profile.full_name}`}
        description={`Grade ${profile.grade} — ${profile.subject_id ? subjectNames[profile.subject_id] ?? profile.subject_id : ''}${schoolName ? ` · ${schoolName}` : ''}`}
      />

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-navy-900">Overall mastery</h3>
          <span className="text-xl font-extrabold text-navy-900">{overallMastery}%</span>
        </div>
        <ProgressBar percent={overallMastery} className="mt-3" />
        <p className="mt-2 text-xs text-navy-500">
          {loading ? 'Loading…' : `Based on ${totalAttempts} practice ${totalAttempts === 1 ? 'attempt' : 'attempts'} across ${progress.length} ${progress.length === 1 ? 'topic' : 'topics'}.`}
        </p>
      </div>

      {!loading && progress.length === 0 ? (
        <EmptyState
          icon={<PencilIcon className="h-6 w-6" />}
          title="You haven't practised anything yet"
          description="Start a practice session and your progress will show up here — for real, saved to your account."
          action={
            <Link to="/account/learner/practise" className="btn-primary btn-sm">
              Start practising
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {progress
            .slice()
            .sort((a, b) => a.mastery_percent - b.mastery_percent)
            .map((p) => {
              const topic = getTopic(p.topic_id)
              return (
                <div key={p.topic_id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-navy-900">{topic?.name ?? p.topic_id}</h3>
                      <p className="text-xs text-navy-500">{p.questions_attempted} questions attempted</p>
                    </div>
                    <span className="text-lg font-bold text-navy-900">{p.mastery_percent}%</span>
                  </div>
                  <ProgressBar percent={p.mastery_percent} className="mt-3" />
                </div>
              )
            })}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link to="/account/learner/practise" className="btn-primary inline-flex items-center gap-2">
          <PencilIcon className="h-4 w-4" /> Practise a topic
        </Link>
        <Link to="/account/learner/progress" className="btn-outline inline-flex items-center gap-2">
          <TrendingUpIcon className="h-4 w-4" /> View full progress
        </Link>
      </div>

      <FamilyLinkCode code={profile.id} />
    </div>
  )
}
