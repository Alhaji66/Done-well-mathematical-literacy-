import { useEffect, useMemo, useState } from 'react'
import type { AccountProfile } from '@/context/AccountAuthContext'
import { demoLevelData } from '@/data/demoLevels'
import { fetchLevelData } from '@/lib/levelData'
import { markReplyHandled } from '@/lib/parentReplies'
import type { LevelData } from '@/lib/levels'
import type { ParentReply } from '@/lib/parentReplyTypes'
import { shortDate } from '@/components/levels/warningText'
import { cn } from '@/lib/utils'

type Mark = (r: ParentReply, note: string, done: boolean) => Promise<string | undefined>

const keyOf = (r: ParentReply) => `${r.parent_id}|${r.learner_id}|${r.test_id}`

/**
 * "Calls to make": every parent who answered an early warning with "please
 * call me", about a learner in this person's classes, until someone marks
 * the call made -- with a note of what was agreed. The last few calls made
 * stay below, and can be put back on the list.
 */
export function CallsToMakeCard({ data, onMark, me, note }: { data: LevelData; onMark: Mark; me?: string; note?: string }) {
  const [replies, setReplies] = useState<ParentReply[]>(() => data.replies ?? [])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  // A teacher's learners are those in their classes; the replies the school can read may be wider.
  const mine = useMemo(() => new Set([...data.members.values()].flat()), [data.members])
  const testOf = useMemo(() => new Map(data.results.filter((r) => r.source === 'weekly').map((r) => [`${r.learnerId}|${r.itemId}`, r])), [data.results])
  const className = (id: string | null) => data.classes.find((c) => c.id === id)?.name ?? ''
  const contactOf = (parentId: string) => data.contacts?.find((c) => c.parent_id === parentId)

  const calls = replies.filter((r) => r.choice === 'call' && mine.has(r.learner_id))
  if (!calls.length) return null
  const open = calls.filter((r) => !r.handled_at).sort((a, b) => a.updated_at.localeCompare(b.updated_at))
  const done = calls.filter((r) => r.handled_at).sort((a, b) => b.handled_at!.localeCompare(a.handled_at!)).slice(0, 3)

  const mark = async (r: ParentReply, isDone: boolean) => {
    const k = keyOf(r)
    setBusy(k)
    setError('')
    const message = await onMark(r, notes[k] ?? '', isDone)
    setBusy('')
    if (message) return setError(message)
    setReplies((all) =>
      all.map((x) =>
        keyOf(x) === k
          ? { ...x, handled_at: isDone ? new Date().toISOString() : null, handled_by: isDone ? (me ?? null) : null, handled_note: isDone ? (notes[k] ?? '').trim() : '' }
          : x,
      ),
    )
  }

  const about = (r: ParentReply) => {
    const t = testOf.get(`${r.learner_id}|${r.test_id}`)
    return {
      name: data.names.get(r.learner_id) ?? 'A learner',
      cls: className(t?.classId ?? null),
      test: t ? `${t.title}${t.date ? ` · ${shortDate(t.date)}` : ''}` : 'an early warning',
    }
  }

  return (
    <section className={cn('card p-5', open.length ? 'border-amber-300' : '')}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-bold text-navy-900">Calls to make</h3>
        <p className={cn('text-sm font-semibold', open.length ? 'text-amber-800' : 'text-emerald-700')}>
          {open.length ? `${open.length} parent${open.length === 1 ? '' : 's'} asked for a call` : 'Every call made'}
        </p>
      </div>
      <p className="mt-1 text-xs text-navy-500">Parents who answered an early warning with “Please call me”.</p>

      {open.length ? (
        <ul className="mt-3 divide-y divide-navy-100">
          {open.map((r) => {
            const a = about(r)
            const k = keyOf(r)
            return (
              <li key={k} className="space-y-2 py-3">
                <div>
                  <p className="text-sm font-medium text-navy-900">
                    {a.name}’s parent {a.cls ? <span className="text-xs font-normal text-navy-500">· {a.cls}</span> : null}
                  </p>
                  <p className="text-xs text-navy-500">
                    About {a.test} · asked {shortDate(r.updated_at.slice(0, 10))}
                  </p>
                  {r.message ? <p className="mt-1 text-sm italic text-navy-700">“{r.message}”</p> : null}
                  {(() => {
                    const c = contactOf(r.parent_id)
                    return c ? (
                      <p className="mt-1 text-sm">
                        <a href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`} className="font-semibold text-navy-900 underline underline-offset-2">
                          {c.phone}
                        </a>
                        {c.best_time ? <span className="text-navy-600"> · {c.best_time}</span> : null}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-navy-500">No phone number given yet: use the number the school has on file.</p>
                    )
                  })()}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className="input min-w-0 flex-1 text-sm"
                    maxLength={300}
                    placeholder="What was agreed (optional)"
                    value={notes[k] ?? ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [k]: e.target.value }))}
                  />
                  <button type="button" disabled={busy === k} onClick={() => mark(r, true)} className="btn-primary btn-sm">
                    Called
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      ) : null}

      {done.length ? (
        <ul className="mt-3 space-y-1 border-t border-navy-100 pt-3 text-xs text-navy-600">
          {done.map((r) => {
            const a = about(r)
            return (
              <li key={keyOf(r)} className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-semibold text-emerald-700">✓ Called</span>
                <span>
                  {a.name}’s parent, {shortDate(r.handled_at!.slice(0, 10))}
                  {r.handled_by && r.handled_by === me ? ' by you' : ''}
                  {r.handled_note ? ` · ${r.handled_note}` : ''}
                </span>
                <button type="button" disabled={busy === keyOf(r)} onClick={() => mark(r, false)} className="text-navy-500 underline underline-offset-2">
                  Undo
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
      {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
      {note ? <p className="mt-2 text-[11px] text-navy-500">{note}</p> : null}
    </section>
  )
}

/** The card with live data, for the dashboards of teachers and HODs. */
export default function CallsToMake({ profile }: { profile: AccountProfile }) {
  const [data, setData] = useState<LevelData | null>(null)
  useEffect(() => {
    let live = true
    fetchLevelData(profile).then((d) => live && setData(d))
    return () => {
      live = false
    }
  }, [profile])
  return data ? <CallsToMakeCard data={data} me={profile.id} onMark={(r, note, done) => markReplyHandled(r, note, done)} /> : null
}

/** The card for the demo dashboards: marking a call works, but is not saved. */
export function DemoCallsToMake({ scope }: { scope: 'teacher' | 'hod' }) {
  const [data] = useState(() => demoLevelData(scope))
  return <CallsToMakeCard data={data} me="demo-me" onMark={async () => undefined} note="Demo: marking a call is not saved." />
}
