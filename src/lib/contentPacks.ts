import type { Question } from '@/types'
import type { Paper } from '@/data/papers/types'
import { supabase } from '@/lib/supabaseClient'

/**
 * The question bank, downloaded rather than bundled.
 *
 * The papers and questions are no longer part of the website's files: each
 * subject is a content pack in the private `content` bucket (STEP 36), which
 * only a signed-in account can download. The website itself carries only a
 * small sample of each subject, for the demo and for visitors who are not
 * signed in.
 *
 * For a signed-in account: read manifest.json to learn the current pack, use
 * the copy already saved on this device if it is that version, otherwise
 * download it (gzipped where the browser can unpack it) and save it. Offline,
 * or if the manifest cannot be read, the saved copy is used whatever its
 * version. Only with nothing saved does a signed-in account fall back to the
 * sample -- and that is reported, so a page can say so rather than quietly
 * showing three questions a topic.
 */

export interface SubjectPack {
  subject: string
  version?: string
  papers: Paper[]
  questions: Question[]
}

/** full: downloaded now; saved: this device's copy (offline); sample: not signed in; unavailable: signed in, but only the sample could be had. */
export type PackSource = 'full' | 'saved' | 'sample' | 'unavailable'

interface Manifest {
  subjects: Record<string, { version: string; file: string; gzip: string; bytes: number }>
}

const CACHE = 'subject-packs'
const SUBJECTS = ['mat-lit', 'mathematics', 'physical-sciences', 'life-sciences']

const sampleLoaders: Record<string, () => Promise<{ default: unknown }>> = {
  'mat-lit': () => import('@/data/samples/mat-lit.json'),
  mathematics: () => import('@/data/samples/mathematics.json'),
  'physical-sciences': () => import('@/data/samples/physical-sciences.json'),
  'life-sciences': () => import('@/data/samples/life-sciences.json'),
}

/** Where each subject's content came from this session, for pages that want to say so. */
const sources = new Map<string, PackSource>()
const listeners = new Set<() => void>()
const setSource = (subject: string, source: PackSource) => {
  sources.set(subject, source)
  listeners.forEach((l) => l())
}
export const packSource = (subject: string): PackSource | undefined => sources.get(subject)
export const onPackSource = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const cacheKey = (subject: string) => new URL(`packs/${subject}.json`, document.baseURI).toString()

async function readSaved(subject: string): Promise<SubjectPack | null> {
  try {
    if (!('caches' in window)) return null
    const hit = await (await caches.open(CACHE)).match(cacheKey(subject))
    return hit ? ((await hit.json()) as SubjectPack) : null
  } catch {
    return null
  }
}

async function save(pack: SubjectPack) {
  try {
    if (!('caches' in window)) return
    await (await caches.open(CACHE)).put(
      cacheKey(pack.subject),
      new Response(JSON.stringify(pack), { headers: { 'content-type': 'application/json' } }),
    )
  } catch {
    // Storage full or blocked: the pack still works for this visit.
  }
}

/** Is this subject saved on the device? For the "Use DONE WELL offline" card. */
export async function savedSubjects(): Promise<Set<string>> {
  const saved = new Set<string>()
  try {
    if (!('caches' in window)) return saved
    const keys = await (await caches.open(CACHE)).keys()
    for (const s of SUBJECTS) if (keys.some((r) => r.url === cacheKey(s))) saved.add(s)
  } catch {
    // Treated as nothing saved.
  }
  return saved
}

/** Called on sign-out: a shared school computer should not keep the bank for the next person. */
export async function forgetSavedPacks() {
  memo.clear()
  manifestPromise = null
  try {
    if ('caches' in window) await caches.delete(CACHE)
  } catch {
    // Nothing more to do.
  }
}

let manifestPromise: Promise<Manifest | null> | null = null
function manifest(): Promise<Manifest | null> {
  if (!manifestPromise) {
    manifestPromise = (async () => {
      if (!supabase) return null
      const { data, error } = await supabase.storage.from('content').download('manifest.json')
      if (error || !data) return null
      return JSON.parse(await data.text()) as Manifest
    })().catch(() => null)
    // A failed read is retried on the next request, not remembered for the session.
    void manifestPromise.then((m) => {
      if (!m) manifestPromise = null
    })
  }
  return manifestPromise
}

async function download(entry: Manifest['subjects'][string]): Promise<SubjectPack | null> {
  if (!supabase) return null
  const canUnzip = typeof DecompressionStream !== 'undefined'
  const { data, error } = await supabase.storage.from('content').download(canUnzip ? entry.gzip : entry.file)
  if (error || !data) return null
  const text = canUnzip
    ? await new Response(data.stream().pipeThrough(new DecompressionStream('gzip'))).text()
    : await data.text()
  return JSON.parse(text) as SubjectPack
}

async function sample(subject: string): Promise<SubjectPack> {
  const load = sampleLoaders[subject]
  if (!load) return { subject, papers: [], questions: [] }
  return (await load()).default as SubjectPack
}

async function signedIn(): Promise<string | null> {
  if (!supabase) return null
  try {
    const { data } = await supabase.auth.getSession()
    return data.session?.user.id ?? null
  } catch {
    return null
  }
}

async function load(subject: string): Promise<SubjectPack> {
  if (!sampleLoaders[subject]) return { subject, papers: [], questions: [] }
  if (!(await signedIn())) {
    setSource(subject, 'sample')
    return sample(subject)
  }
  const [m, saved] = await Promise.all([manifest(), readSaved(subject)])
  const entry = m?.subjects[subject]
  if (entry && saved?.version === entry.version) {
    setSource(subject, 'full')
    return saved
  }
  if (entry) {
    const fresh = await download(entry).catch(() => null)
    if (fresh) {
      void save(fresh)
      setSource(subject, 'full')
      return fresh
    }
  }
  if (saved) {
    setSource(subject, 'saved')
    return saved
  }
  setSource(subject, 'unavailable')
  return sample(subject)
}

// One load per subject per account; a new account (or signing in after the
// demo) loads afresh.
const memo = new Map<string, Promise<SubjectPack>>()

export async function subjectPack(subject: string): Promise<SubjectPack> {
  const key = `${subject}|${(await signedIn()) ?? 'anon'}`
  let hit = memo.get(key)
  if (!hit) {
    hit = load(subject)
    memo.set(key, hit)
    // A fall-back to the sample for a signed-in account is not kept: the next
    // page tries the download again.
    void hit.then(() => {
      if (sources.get(subject) === 'unavailable') memo.delete(key)
    })
  }
  return hit
}
