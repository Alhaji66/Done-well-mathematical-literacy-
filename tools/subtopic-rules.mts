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
 *
 * DEAD STEM covers two failures with the same symptom. One is the truncated
 * word above. The other is structural and needs no corpus at all: an
 * alternative inside \b(...)\b that starts or ends with a non-word character
 * -- "x²", "√", "n!", "30°", "f″", "∑" -- can never satisfy the boundary beside
 * it. Thirty-six stems were dead that way when the second test was added,
 * almost all of them symbolic stems written precisely because the symbol is
 * what the question prints.
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
 * Split a `\b( a | b | c )\b` group's inside on its top-level pipes. Nested
 * groups and character classes are stepped over rather than split naively --
 * "must (be|sit|stand)" would otherwise look like an alternative called "sit".
 */
function splitAlternatives(inside: string): string[] {
  const out: string[] = []
  let depth = 0
  let inClass = false
  let current = ''
  for (let i = 0; i < inside.length; i++) {
    const ch = inside[i]
    if (ch === '\\') {
      current += ch + (inside[i + 1] ?? '')
      i++
      continue
    }
    if (inClass) {
      inClass = ch !== ']'
      current += ch
      continue
    }
    if (ch === '[') {
      inClass = true
      current += ch
      continue
    }
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === '|' && depth === 0) {
      out.push(current)
      current = ''
    } else current += ch
  }
  out.push(current)
  return out
}

/**
 * Every `\b( ... )\b` group in a rule, wherever it sits in the source.
 *
 * Rules are no longer all of the form `\b(...)\b` -- the symbolic stems now sit
 * outside the group, as `\b(words)\b|x²` -- so a check that only recognised a
 * whole-source match would quietly stop inspecting the rules it had just been
 * used to repair.
 */
function boundedGroups(re: RegExp): string[] {
  return [...re.source.matchAll(/\\b\(((?:[^()\\]|\\.|\((?:[^()\\]|\\.)*\))*)\)\\b/g)].map((m) => m[1])
}

/** The plain-word alternatives of a rule. Anything with regex syntax is deliberate. */
function plainAlternatives(re: RegExp): string[] {
  return boundedGroups(re)
    .flatMap(splitAlternatives)
    .filter((a) => /^[a-z][a-z ]*$/i.test(a))
}

const isWordChar = (c: string) => /[A-Za-z0-9_]/.test(c)

/**
 * Alternatives inside a `\b(...)\b` group that the word boundaries forbid
 * outright, whatever the corpus contains.
 *
 * A \b needs a word character on exactly one side of it. So an alternative that
 * ENDS in a non-word character -- "x²", "30°", "n!", "p(a)" -- can never satisfy
 * the group's trailing \b when the next character in the text is a space, and an
 * alternative that STARTS with one -- "√", "∑", "∩" -- can never satisfy the
 * leading \b either. The stem sits there looking correct and never fires once.
 *
 * Thirty-six stems were dead this way when the check was written, every one of
 * them a symbolic stem added precisely because symbols are what the question
 * says: √, x², sin², f″, ∑, tₙ, ŷ, n!, ∪, ∩, ε =, 10 %. The fix is always to
 * move the alternative OUT of the group -- `\b(words)\b|x²` -- keeping a leading
 * \b on it only where the stem starts with a word character and a longer number
 * or name should not match it, as in `\b(30|45|60)°`.
 */
function boundaryBlocked(re: RegExp): string[] {
  const blocked: string[] = []
  for (const group of boundedGroups(re)) {
    for (const alt of splitAlternatives(group)) {
      if (!alt) continue
      const first = /^(\\.|.)/s.exec(alt)![1]
      const last = /(\\.|.)$/s.exec(alt)![1]
      // An escaped character is always a literal. A bare one may be regex
      // syntax -- a quantifier or a closing bracket -- which says nothing about
      // what the match ends on, so those are left alone.
      const badStart = first.length === 2 ? !isWordChar(first[1]) : !isWordChar(first) && !'(['.includes(first)
      const badEnd = last.length === 2 ? !isWordChar(last[1]) : !isWordChar(last) && !'*+?)]}'.includes(last)
      const which = [badStart && 'leading', badEnd && 'trailing'].filter(Boolean).join(' and ')
      if (which) blocked.push(`"${alt}" -- the ${which} \\b can never hold against it`)
    }
  }
  return blocked
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
      // A stem the word boundaries forbid outright. This is checked before the
      // corpus test because it does not depend on the corpus at all: the stem
      // could not fire against any text whatsoever.
      for (const why of boundaryBlocked(rule.match)) {
        deadStems.push(`${topic.id} / ${rule.name}: ${why}. Move it outside the \\b(...)\\b group.`)
      }

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
