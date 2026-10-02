/**
 * Proves the built website does not carry the question bank.
 *
 *   npm run build && npm run verify:bundle
 *
 * Every question and paper id outside the bundled samples is looked for in the
 * built JavaScript. Finding even one means some page has imported the source
 * modules again (see src/data/contentSource.ts), and the whole bank is back in
 * the website for anyone to download -- so the deploy stops here.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { subjectContent } from '../src/data/contentSource'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const assets = join(root, 'dist/assets')
const SUBJECTS = ['mat-lit', 'mathematics', 'physical-sciences', 'life-sciences']

const sampleIds = new Set<string>()
for (const s of SUBJECTS) {
  const sample = JSON.parse(readFileSync(join(root, 'src/data/samples', `${s}.json`), 'utf8'))
  for (const q of sample.questions) sampleIds.add(q.id)
  for (const p of sample.papers) {
    sampleIds.add(p.id)
    for (const sec of p.sections) for (const i of sec.items) sampleIds.add(i.id)
  }
}

const privateIds = new Set<string>()
for (const s of SUBJECTS) {
  const { papers, questions } = await subjectContent(s)
  for (const q of questions) if (!sampleIds.has(q.id)) privateIds.add(q.id)
  for (const p of papers) {
    if (!sampleIds.has(p.id)) privateIds.add(p.id)
    for (const sec of p.sections) for (const i of sec.items) if (!sampleIds.has(i.id)) privateIds.add(i.id)
  }
}

let files: string[]
try {
  files = readdirSync(assets).filter((f) => f.endsWith('.js'))
} catch {
  console.error('No dist/assets: run `npm run build` first.')
  process.exit(2)
}

const leaks: string[] = []
for (const f of files) {
  const text = readFileSync(join(assets, f), 'utf8')
  // A question or paper RECORD -- `id:"…"` -- for a private id is a leak. A
  // private id merely MENTIONED is not: diagram maps and demo data are keyed by
  // question id and carry no question text.
  for (const m of text.matchAll(/\bid:\s*["'`]([\w-]{3,80})["'`]/g)) {
    if (privateIds.has(m[1])) {
      leaks.push(`${f}: ${m[1]}`)
      if (leaks.length >= 10) break
    }
  }
}

if (leaks.length) {
  console.error(`The built website contains question-bank content that should only be in the content packs:\n  ${leaks.join('\n  ')}`)
  process.exit(1)
}
console.log(`No question-bank content in the build: ${privateIds.size} private ids checked against ${files.length} files.`)
