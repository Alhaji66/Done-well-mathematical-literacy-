/**
 * Choose which Mathematics items to split, and write the split.py batch.
 *
 * HOW MUCH COMES OFF EACH ITEM. An item of 4 marks or more gives up 2, and a
 * 3-mark item gives up 1. Nothing smaller is touched: a 2-mark item split in
 * two leaves a 1-mark remainder of what was a multi-step question, which is
 * not a question any more.
 *
 * WHERE THE MARKS COME FROM. The peel is spread across the papers in a cell in
 * proportion to what each can supply, and within a paper it cycles through the
 * topics, so a paper ends up with short recall parts spread through it rather
 * than a block of them in one question. That also keeps each individual paper
 * near the cell's weighting, which matters because a learner sits one paper,
 * not a cell.
 *
 * WHY THE INDEX FILE. gen-l1.mts guarantees distinct prompts for distinct
 * indices, so the index must never be reused. scratchpad/l1-index.json carries
 * the next free index per (topic, marks) ACROSS runs and across cells, which is
 * what stops a Grade 10 question reappearing in Grade 12.
 *
 * Usage:  npx tsx scratchpad/pick-l1.mts <grade> <paper> <fromL2> <fromL3> > batch.json
 *         add --commit to advance the index file (do this only when the batch
 *         is actually applied)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { papersForSubject } from '../src/data/papers/index.ts'
import { generate, capacity } from './gen-l1.mts'

const grade = Number(process.argv[2])
const paperNo = Number(process.argv[3])
const want: Record<number, number> = { 2: Number(process.argv[4]), 3: Number(process.argv[5]) }
const commit = process.argv.includes('--commit')
const INDEX = 'scratchpad/l1-index.json'

const all: any[] = (await papersForSubject('mathematics')) as any

/** Every prompt already in the Mathematics corpus, so a generated one cannot collide. */
const taken = new Set<string>()
for (const p of all) for (const s of p.sections) for (const i of s.items) taken.add(i.prompt.trim())

const next: Record<string, number> = existsSync(INDEX) ? JSON.parse(readFileSync(INDEX, 'utf-8')) : {}

type Cand = { id: string; take: 1 | 2; topic: string; paper: string }

const papers = all
  .filter((p) => p.grade === grade && p.paperNumber === paperNo)
  .sort((a, b) => a.id.localeCompare(b.id))

/** Candidates in one paper at one level, cycled through the paper's topics. */
const candidates = (paper: any, level: number): Cand[] => {
  const byTopic = new Map<string, Cand[]>()
  for (const s of paper.sections)
    for (const i of s.items) {
      if (i.cognitiveLevel !== level) continue
      const take = i.marks >= 4 ? 2 : i.marks === 3 ? 1 : 0
      if (!take) continue
      const list = byTopic.get(i.topicId) ?? []
      list.push({ id: i.id, take: take as 1 | 2, topic: i.topicId, paper: paper.id })
      byTopic.set(i.topicId, list)
    }
  const keys = [...byTopic.keys()].sort()
  const out: Cand[] = []
  for (let r = 0; ; r++) {
    let added = false
    for (const k of keys) {
      const list = byTopic.get(k)!
      if (r < list.length) { out.push(list[r]); added = true }
    }
    if (!added) break
  }
  return out
}

const batch: any[] = []
const usedPerTopic = new Map<string, number>()
let short = 0

for (const level of [2, 3]) {
  const target = want[level] ?? 0
  if (target <= 0) continue
  // Spread across the papers in proportion to what each can supply.
  const pools = papers.map((p) => ({ paper: p, cands: candidates(p, level) }))
  const supply = pools.map((x) => x.cands.reduce((s, c) => s + c.take, 0))
  const total = supply.reduce((a, b) => a + b, 0)
  if (total < target) {
    console.error(`G${grade} P${paperNo} L${level}: supply ${total} < target ${target}`)
    process.exit(1)
  }
  const quota = supply.map((s) => Math.round((s / total) * target))
  // Rounding can leave the quotas a mark or two off; settle it on the biggest pool.
  let drift = target - quota.reduce((a, b) => a + b, 0)
  for (let k = 0; drift !== 0; k = (k + 1) % quota.length) {
    const step = drift > 0 ? 1 : -1
    if (quota[k] + step >= 0 && quota[k] + step <= supply[k]) { quota[k] += step; drift -= step }
  }

  pools.forEach((pool, k) => {
    let got = 0
    for (const c of pool.cands) {
      if (got >= quota[k]) break
      if (got + c.take > quota[k]) continue
      const key = `${c.topic}|${c.take}`
      let n = next[key] ?? 0
      const cap = capacity(c.topic, c.take)
      // Step past any generated prompt that the corpus already contains.
      let item = null
      while (n < cap) {
        const cand = generate(c.topic, c.take, n)
        if (!taken.has(cand.prompt.trim())) { item = cand; break }
        n++
      }
      if (!item) { short += c.take; continue }
      taken.add(item.prompt.trim())
      next[key] = n + 1
      usedPerTopic.set(c.topic, (usedPerTopic.get(c.topic) ?? 0) + c.take)
      batch.push({ id: c.id, marks: c.take, prompt: item.prompt, answer: item.answer, explanation: item.explanation })
      got += c.take
    }
    if (got < quota[k]) console.error(`  ${pool.paper.id} L${level}: only ${got} of ${quota[k]} marks`)
  })
}

const moved = batch.reduce((s, b) => s + b.marks, 0)
console.error(`G${grade} P${paperNo}: ${batch.length} splits, ${moved} marks into Level 1${short ? ` (${short} short: generator exhausted)` : ''}`)
for (const [t, m] of [...usedPerTopic].sort()) console.error(`   ${t.padEnd(28)} ${m} marks`)
if (commit) writeFileSync(INDEX, JSON.stringify(next, null, 2))
console.log(JSON.stringify(batch, null, 1))
