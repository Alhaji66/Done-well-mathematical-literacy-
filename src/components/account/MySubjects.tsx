import { useState } from 'react'
import { SubjectPicker } from '@/components/account/SubjectPicker'
import { LEARNER_SUBJECTS, saveMySubjects } from '@/lib/learnerSubjects'
import { cn } from '@/lib/utils'

const nameOf = (id: string) => LEARNER_SUBJECTS.find((s) => s.id === id)?.name ?? id

/**
 * The learner's subjects, on their dashboard. Tapping one shows that subject's
 * revision plan below; "Change my subjects" lets them tick the subjects they
 * take, so every one of their teachers can find them (STEP 38).
 */
export function MySubjects({
  subjects,
  active,
  onPick,
  onSaved,
}: {
  subjects: string[]
  active: string | null
  onPick: (id: string) => void
  onSaved: (next: string[]) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<string[]>(subjects)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    setSaving(true)
    setError('')
    const problem = await saveMySubjects(draft)
    setSaving(false)
    if (problem) {
      setError(problem)
      return
    }
    setEditing(false)
    onSaved(draft)
  }

  return (
    <div className="card space-y-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-navy-900">My subjects</h3>
        {editing ? null : (
          <button
            type="button"
            className="btn-ghost btn-sm"
            onClick={() => {
              setDraft(subjects)
              setEditing(true)
            }}
          >
            Change my subjects
          </button>
        )}
      </div>

      {editing ? (
        <>
          <p className="text-sm text-navy-600">Tick every subject you take. Each of your teachers will then see you in their subject.</p>
          <SubjectPicker value={draft} onChange={setDraft} />
          {error ? (
            <p role="alert" className="text-sm text-rose-600">
              {error}
            </p>
          ) : null}
          <div className="flex gap-2">
            <button type="button" className="btn-outline btn-sm" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </button>
            <button type="button" className="btn-primary btn-sm" onClick={() => void save()} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Show the revision plan for">
          {subjects.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={active === id}
              onClick={() => onPick(id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm font-semibold',
                active === id ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-200 text-navy-700 hover:border-navy-400',
              )}
            >
              {nameOf(id)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
