/**
 * Checks the sub-topic classifier's hand-written rules against the real corpus.
 *
 * A rule that never wins a question is invisible in the app -- its sub-topic
 * shows "none yet" in the Practise picker -- while looking perfectly reasonable
 * in subtopics.ts. Three ways that happens, and this check separates them,
 * because the fix is different in each case:
 *
 *   DEAD STEM      the rule is written /\b(probabilit|...)\b/ and the trailing
 *                  \b forbids the very suffix the stem was truncated to catch,
 *                  so "probability" never matches. A regex bug: fix the rule.
 *                  This silently disabled 24 stems across all four subjects
 *                  before it was found, which is why it is checked for.
 *
 *   SHADOWED       an earlier rule claims every question this one would take.
 *                  Sometimes correct (a question about the outstanding balance
 *                  on a loan IS an outstanding-balance question) and sometimes
 *                  not, so it is reported for a human to judge rather than
 *                  failed automatically.
 *
 *   NO CONTENT     the rule is sound and nothing in the corpus is about that
 *                  sub-topic. Not a bug at all: a content gap, and the picker
 *                  is right to say "none yet".
 *
 * Only DEAD STEM fails the check, because only it is unambiguously a defect.
 */
import { questionsForSubject } from '../src/data/questionBank'
import { topicsForSubject } from '../src/data/topics'
import { subtopicRulesFor } from '../src/data/subtopics'
import { subjects } from '../src/data/subjects'

const subjectIds = subjects.map((s) => s.id)

/** Everything the classifier reads, across every subject. */
const corpusText: string[] = []
const bySubject = new Map<string, Awaited<ReturnType<typeof questionsForSubject>>>()
for (const id of subjectIds) {
  const pool = await questionsForSubject(id)
  bySubject.set(id, pool)
  for (const q of pool) corpusText.push(`${q.prompt} ${q.context ?? ''}`)
}
const corpus = corpusText.join('\n')

/**
 * The alternatives of a rule written in the `\b( a | b | c )\b` shape.
 * Nested groups are skipped rather than split naively -- "must (be|sit|stand)"
 * would otherwise look like an alternative called "sit".
 */
function plainAlternatives(re: RegExp): string[] {
  const m = /^\\b\((.*)\)\\b$/.exec(re.source)
  if (!m) return []
  const out: string[] = []
  let depth = 0
  let current = ''
  for (const ch of m[1]) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === '|' && depth === 0) {
      out.push(current)
      current = ''
    } else current += ch
  }
  out.push(current)
  // Only plain words can be stems; anything with regex syntax is deliberate.
  return out.filter((a) => /^[a-z][a-z ]*$/i.test(a))
}

const deadStems: string[] = []
const shadowed: string[] = []
const noContent: string[] = []

for (const subjectId of subjectIds) {
  const pool = bySubject.get(subjectId) ?? []
  for (const topic of topicsForSubject(subjectId)) {
    const rules = subtopicRulesFor(topic.id)
    if (!rules.length) continue
    const rows = pool.filter((q) => q.topicId === topic.id)
    const textOf = (q: (typeof rows)[number]) => `${q.prompt} ${q.context ?? ''}`

    for (const rule of rules) {
      // A stem that cannot fire anywhere in the corpus, but would if the
      // trailing \b let it. Reported per stem, since siblings may be fine.
      for (const alt of plainAlternatives(rule.match)) {
        const exact = new RegExp(`\\b${alt}\\b`, 'i').test(corpus)
        const withSuffix = new RegExp(`\\b${alt}\\w*\\b`, 'i').test(corpus)
        if (!exact && withSuffix) {
          const example = new RegExp(`\\b${alt}\\w*\\b`, 'i').exec(corpus)?.[0]
          deadStems.push(
            `${topic.id} / ${rule.name}: "${alt}" never fires -- the corpus has "${example}", ` +
              `which the trailing \\b rejects. Write "${alt}\\w*" if the suffix is wanted.`,
          )
        }
      }

      const would = rows.filter((q) => rule.match.test(textOf(q)))
      const keeps = would.filter((q) => rules.find((r) => r.match.test(textOf(q)))=== rule)
      if (keeps.length > 0) continue
      if (would.length === 0) {
        noContent.push(`${topic.id} / ${rule.name}`)
      } else {
        const takers = new Map<string, number>()
        for (const q of would) {
          const winner = rules.find((r) => r.match.test(textOf(q)))!
          takers.set(winner.name, (takers.get(winner.name) ?? 0) + 1)
        }
        const by = [...takers.entries()].sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n} (${c})`)
        shadowed.push(`${topic.id} / ${rule.name}: would match ${would.length}, all taken by ${by.join(', ')}`)
      }
    }
  }
}

if (noContent.length) {
  console.log(`${noContent.length} sub-topic(s) with a sound rule and no matching content yet:`)
  for (const n of noContent) console.log('  ' + n)
  console.log('  (Not a defect -- the Practise picker shows these as "none yet".)\n')
}

if (shadowed.length) {
  console.log(`${shadowed.length} rule(s) fully shadowed by an earlier rule -- check each is intended:`)
  for (const s of shadowed) console.log('  ' + s)
  console.log('')
}

if (deadStems.length) {
  console.log(`${deadStems.length} rule stem(s) that can never match:`)
  for (const d of deadStems) console.log('  ' + d)
  process.exit(1)
}

console.log('Every rule stem can fire. No rule is silently disabled by its own regex.')
