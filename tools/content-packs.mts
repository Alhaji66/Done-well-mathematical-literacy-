/**
 * Content packs: the question bank, kept off the website.
 *
 *   npx tsx tools/content-packs.mts --write-samples   regenerate src/data/samples/*.json
 *   npx tsx tools/content-packs.mts --check           fail if the samples are out of date
 *   npx tsx tools/content-packs.mts --build           write the full packs to content-packs/
 *   npx tsx tools/content-packs.mts --upload          build, then upload to Supabase Storage
 *
 * A FULL PACK is one subject's papers and standalone questions as one JSON file
 * (plus a gzipped copy). It is uploaded to the private `content` bucket (STEP 36
 * of supabase/schema.sql), from which only a signed-in account can download it.
 * The packs are named by a hash of their contents, so a pack never changes once
 * uploaded; manifest.json, uploaded LAST, says which pack is current. A browser
 * therefore never sees a manifest pointing at a pack that is not there yet.
 *
 * A SAMPLE PACK is a small taste of each subject -- a few questions per topic and
 * grade, and one paper per grade -- bundled into the website for the demo and for
 * anyone not signed in. It is the ONLY content the website itself carries.
 *
 * --upload needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.
 * The service-role key bypasses every access rule: it belongs in the deploy's
 * secrets, never in the app and never in a VITE_ variable.
 */
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
import { subjectContent } from '../src/data/contentSource'
import { questionsForSubject } from '../src/data/questionBank'
import { topicsForSubject } from '../src/data/topics'
import type { Paper } from '../src/data/papers/types'
import type { Question } from '../src/types'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SUBJECTS = ['mat-lit', 'mathematics', 'physical-sciences', 'life-sciences'] as const
const SAMPLE_DIR = join(root, 'src/data/samples')
const PACK_DIR = join(root, 'content-packs')
const PER_TOPIC_AND_GRADE = 3

const arg = process.argv[2] ?? ''

/**
 * Questions the demo screens name by id -- the teacher's question chart, the
 * learner's example mistakes. They must be in the samples or those screens
 * show a blank. Read from the source text, so a new demo id is picked up.
 */
const DEMO_ID_FILES = ['src/data/teacherSchool.ts', 'src/lib/demoMistakes.ts']
const demoIds = new Set(
  DEMO_ID_FILES.flatMap((f) => [...readFileSync(join(root, f), 'utf8').matchAll(/questionId: '([\w-]+)'/g)].map((m) => m[1])),
)
const hash = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16)

/** One paper per grade: the predicted Set A Paper 1 where there is one. */
function samplePapers(papers: Paper[]): Paper[] {
  const picked: Paper[] = []
  for (const grade of [10, 11, 12] as const) {
    const ofGrade = papers.filter((p) => p.grade === grade)
    const best = ofGrade.find((p) => p.kind === 'predicted' && p.setLabel === 'A' && p.paperNumber === 1) ?? ofGrade[0]
    if (best) picked.push(best)
  }
  return picked
}

/** A few practice questions per topic and grade, plus any the demo screens name. */
async function sampleQuestions(subjectId: string, papers: Paper[]): Promise<Question[]> {
  const pool = await questionsForSubject(subjectId)
  const inSamplePapers = new Set(papers.flatMap((p) => p.sections.flatMap((s) => s.items.map((i) => i.id))))
  const kept: Question[] = []
  for (const topic of topicsForSubject(subjectId)) {
    for (const grade of [10, 11, 12]) {
      kept.push(
        ...pool.filter((q) => q.topicId === topic.id && q.grade === grade && !inSamplePapers.has(q.id)).slice(0, PER_TOPIC_AND_GRADE),
      )
    }
  }
  for (const q of pool) if (demoIds.has(q.id) && !kept.includes(q)) kept.push(q)
  // A demo id can also be a paper item that practice leaves out of the pool.
  const content = await subjectContent(subjectId)
  for (const p of content.papers)
    for (const sec of p.sections) for (const i of sec.items) if (demoIds.has(i.id) && !kept.some((k) => k.id === i.id)) kept.push(i)
  for (const q of content.questions) if (demoIds.has(q.id) && !kept.some((k) => k.id === q.id)) kept.push(q)
  return kept
}

async function samples() {
  const out: Record<string, string> = {}
  for (const s of SUBJECTS) {
    const { papers } = await subjectContent(s)
    const sp = samplePapers(papers)
    const sample = { subject: s, sample: true, papers: sp, questions: await sampleQuestions(s, sp) }
    out[s] = JSON.stringify(sample)
  }
  return out
}

async function fullPacks() {
  const packs: { subject: string; version: string; json: string }[] = []
  for (const s of SUBJECTS) {
    const content = await subjectContent(s)
    const body = JSON.stringify({ subject: s, papers: content.papers, questions: content.questions })
    const version = hash(body)
    packs.push({ subject: s, version, json: JSON.stringify({ subject: s, version, papers: content.papers, questions: content.questions }) })
  }
  return packs
}

if (arg === '--write-samples' || arg === '--check') {
  const generated = await samples()
  let stale = 0
  mkdirSync(SAMPLE_DIR, { recursive: true })
  for (const [s, json] of Object.entries(generated)) {
    const file = join(SAMPLE_DIR, `${s}.json`)
    const current = existsSync(file) ? readFileSync(file, 'utf8') : ''
    if (arg === '--write-samples') {
      writeFileSync(file, json)
      const parsed = JSON.parse(json)
      console.log(`${s}: ${parsed.papers.length} paper(s), ${parsed.questions.length} question(s), ${(json.length / 1024).toFixed(0)} KB`)
    } else if (current !== json) {
      stale++
      console.log(`src/data/samples/${s}.json is out of date.`)
    }
  }
  if (stale) {
    console.log('Run `npm run content:samples` and commit the result.')
    process.exit(1)
  }
  if (arg === '--check') console.log(`Sample packs are current for ${SUBJECTS.length} subjects.`)
} else if (arg === '--build' || arg === '--upload') {
  const packs = await fullPacks()
  mkdirSync(PACK_DIR, { recursive: true })
  const manifest: Record<string, { version: string; file: string; gzip: string; bytes: number }> = {}
  for (const p of packs) {
    const file = `packs/${p.subject}-${p.version}.json`
    writeFileSync(join(PACK_DIR, `${p.subject}-${p.version}.json`), p.json)
    writeFileSync(join(PACK_DIR, `${p.subject}-${p.version}.json.gz`), gzipSync(p.json, { level: 9 }))
    manifest[p.subject] = { version: p.version, file, gzip: `${file}.gz`, bytes: gzipSync(p.json).length }
    console.log(`${p.subject}: version ${p.version}, ${(p.json.length / 1e6).toFixed(2)} MB (${(manifest[p.subject].bytes / 1e6).toFixed(2)} MB gzipped)`)
  }
  const manifestJson = JSON.stringify({ generated_at: new Date().toISOString(), subjects: manifest }, null, 2)
  writeFileSync(join(PACK_DIR, 'manifest.json'), manifestJson)

  if (arg === '--upload') {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to upload the content packs.')
      process.exit(1)
    }
    const { createClient } = await import('@supabase/supabase-js')
    const admin = createClient(url, key, { auth: { persistSession: false } })
    const put = async (path: string, body: Buffer | string, contentType: string, upsert: boolean) => {
      const { error } = await admin.storage.from('content').upload(path, body, { contentType, upsert, cacheControl: upsert ? '60' : '31536000' })
      // A versioned pack that is already there is the same bytes: nothing to do.
      if (error && !(upsert === false && /exists|duplicate/i.test(error.message))) throw new Error(`${path}: ${error.message}`)
    }
    for (const p of packs) {
      const base = `${p.subject}-${p.version}.json`
      await put(`packs/${base}`, readFileSync(join(PACK_DIR, base)), 'application/json', false)
      await put(`packs/${base}.gz`, readFileSync(join(PACK_DIR, `${base}.gz`)), 'application/gzip', false)
    }
    await put('manifest.json', manifestJson, 'application/json', true)
    console.log('Uploaded the content packs and the manifest to the `content` bucket.')
  }
} else {
  console.error('Usage: tsx tools/content-packs.mts --write-samples | --check | --build | --upload')
  process.exit(2)
}
