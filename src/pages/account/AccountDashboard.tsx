import { useEffect, useState } from 'react'
import { useAccountAuth } from '@/context/AccountAuthContext'
import { supabase } from '@/lib/supabaseClient'
import { topicsForSubject } from '@/data/topics'
import { LogOutIcon } from '@/components/ui/Icons'

interface ProgressRow {
  topic_id: string
  mastery_percent: number
  questions_attempted: number
}

const roleLabels: Record<string, string> = {
  learner: 'Learner',
  parent: 'Parent',
  teacher: 'Teacher',
  school: 'School',
}

const subjectNames: Record<string, string> = {
  'mat-lit': 'Mathematical Literacy',
  mathematics: 'Mathematics',
}

export function AccountDashboard() {
  const { profile, signOut } = useAccountAuth()
  const [schoolName, setSchoolName] = useState<string | null>(null)
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [topicId, setTopicId] = useState('')
  const [mastery, setMastery] = useState(50)
  const [saving, setSaving] = useState(false)

  const topics = profile?.subject_id ? topicsForSubject(profile.subject_id, profile.grade ?? undefined) : []

  useEffect(() => {
    if (!supabase || !profile) return

    if (profile.school_id) {
      supabase
        .from('schools')
        .select('name')
        .eq('id', profile.school_id)
        .maybeSingle()
        .then(({ data }) => setSchoolName(data?.name ?? null))
    }

    if (profile.role === 'learner') {
      supabase
        .from('learner_progress')
        .select('topic_id, mastery_percent, questions_attempted')
        .eq('learner_id', profile.id)
        .then(({ data }) => setProgress(data ?? []))
    }
    // profile identity (id) is what actually changes here; re-running per new profile object is intended.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id])

  useEffect(() => {
    if (topics.length && !topicId) setTopicId(topics[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics.length])

  const logProgress = async () => {
    if (!supabase || !profile || !topicId) return
    setSaving(true)
    const existing = progress.find((p) => p.topic_id === topicId)
    const { error } = await supabase.from('learner_progress').upsert({
      learner_id: profile.id,
      topic_id: topicId,
      mastery_percent: mastery,
      questions_attempted: (existing?.questions_attempted ?? 0) + 1,
      updated_at: new Date().toISOString(),
    })
    if (!error) {
      const { data } = await supabase
        .from('learner_progress')
        .select('topic_id, mastery_percent, questions_attempted')
        .eq('learner_id', profile.id)
      setProgress(data ?? [])
    }
    setSaving(false)
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-navy-50 px-4 py-10">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{roleLabels[profile.role]} account</p>
              <h1 className="mt-1 truncate text-xl font-bold text-navy-900">Welcome, {profile.full_name}</h1>
              {schoolName ? <p className="mt-1 text-sm text-navy-500">{schoolName}</p> : null}
              {profile.role === 'learner' && profile.subject_id ? (
                <p className="mt-1 text-sm text-navy-500">
                  Grade {profile.grade} · {subjectNames[profile.subject_id] ?? profile.subject_id}
                </p>
              ) : null}
            </div>
            <button type="button" onClick={signOut} className="btn-ghost btn-sm inline-flex shrink-0 items-center gap-1.5">
              <LogOutIcon className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gold-200 bg-gold-50 p-4 text-sm text-navy-700">
          <strong>This is a real account.</strong> Full Learner/Parent/Teacher/School dashboards (Learn, Practise,
          Tests, Resources, Analytics) are still being built on top of this. For now this page proves the pipeline
          works end to end: your sign-in, your profile, and -- for learners -- real saved progress, all backed by an
          actual database instead of demo data.
        </div>

        {profile.role === 'learner' ? (
          <div className="card p-6">
            <h2 className="font-bold text-navy-900">Log practice progress</h2>
            <p className="mt-1 text-sm text-navy-500">A real, saved record -- refresh the page and it's still here.</p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-navy-500">Topic</label>
                <select className="select mt-1" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-navy-500">Mastery: {mastery}%</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={mastery}
                  onChange={(e) => setMastery(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </div>
              <button type="button" onClick={logProgress} disabled={saving || !topicId} className="btn-primary w-full">
                {saving ? 'Saving…' : 'Save progress'}
              </button>
            </div>

            {progress.length ? (
              <ul className="mt-5 space-y-2 border-t border-navy-100 pt-4">
                {progress.map((p) => (
                  <li key={p.topic_id} className="flex items-center justify-between text-sm">
                    <span className="text-navy-700">{topics.find((t) => t.id === p.topic_id)?.name ?? p.topic_id}</span>
                    <span className="font-semibold text-navy-900">
                      {p.mastery_percent}% · {p.questions_attempted} {p.questions_attempted === 1 ? 'attempt' : 'attempts'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
