/**
 * Repair the last under-specified items by recovering their data from their
 * own worked explanations.
 *
 * These are the ones neither automated route could reach: they name no part
 * ("using your answer to 3.1") and share no numbers with the nearest context,
 * so the only place the missing quantity survives is the memo. Each rule below
 * reads a specific explanation shape and puts the quantity back where the
 * learner can see it -- in the prompt when it is one or two values, as a
 * context when it is a data set.
 *
 * Every rule is anchored to the full prompt, so a rule cannot fire on an item
 * it was not written for, and the script reports anything it could not match
 * rather than passing over it.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import { writeFileSync } from 'node:fs'

type Fix = { context?: string; prompt?: string }
const rules: { when: RegExp; make: (expl: string) => Fix | null }[] = [
  {
    when: /^Calculate the mean number of packets sold per week over the 6 weeks\.$/,
    make: (e) => {
      const m = e.match(/^([\d +]+?) = [\d ]+\./)
      return m ? { context: `Packets sold per week: ${m[1].split('+').map((s) => s.trim()).join(', ')}` } : null
    },
  },
  {
    when: /^Calculate the mean weekly spending over the 6 weeks\.$/,
    make: (e) => {
      const m = e.match(/^([\d +]+?) = [\d ]+\./)
      return m ? { context: `Weekly spending (R): ${m[1].split('+').map((s) => s.trim()).join(', ')}` } : null
    },
  },
  {
    when: /^Calculate the range of (marks|attendance|sales income)\.$/,
    make: (e) => {
      const m = e.match(/^Highest = (R?[\d  ]+)(?: \(([^)]+)\))?\. Lowest = (R?[\d  ]+)(?: \(([^)]+)\))?\./)
      if (!m) return null
      const hi = m[2] ? `${m[1].trim()} (${m[2]})` : m[1].trim()
      const lo = m[4] ? `${m[3].trim()} (${m[4]})` : m[3].trim()
      return { context: `Highest value recorded: ${hi}. Lowest value recorded: ${lo}.` }
    },
  },
  {
    when: /^Calculate the total amount to be repaid \(loan \+ interest\)\.$/,
    make: (e) => {
      const m = e.match(/^R([\d  ]+) \+ R([\d  ]+) = R[\d  ]+\.$/)
      return m
        ? { prompt: `A loan of R${m[1].trim()} attracts R${m[2].trim()} in interest. Calculate the total amount to be repaid (loan + interest).` }
        : null
    },
  },
  {
    when: /^Calculate the equal monthly instalment if this is repaid over 5 years \(60 months\)\.$/,
    make: (e) => {
      const m = e.match(/^R([\d  ]+) ÷ 60/)
      return m
        ? { prompt: `A total of R${m[1].trim()} is repaid over 5 years (60 months). Calculate the equal monthly instalment.` }
        : null
    },
  },
  {
    when: /^Calculate the wasted \(excess\) tiled area beyond what the floor needs, and state whether this exceeds 1 m²\.$/,
    make: (e) => {
      const m = e.match(/^Wasted area = ([\d.,]+) m² − ([\d.,]+) m²/)
      return m
        ? { prompt: `The tiles bought cover ${m[1]} m² and the floor needs ${m[2]} m². Calculate the wasted (excess) tiled area beyond what the floor needs, and state whether this exceeds 1 m².` }
        : null
    },
  },
  {
    when: /^Calculate the total amount already paid after (\d+) months\.$/,
    make: (e) => {
      const m = e.match(/^R([\d  ]+) × (\d+) = R[\d  ]+\.$/)
      return m
        ? { prompt: `The instalment is R${m[1].trim()} a month. Calculate the total amount already paid after ${m[2]} months.` }
        : null
    },
  },
  {
    when: /^Tiles are sold in boxes of 20 tiles\. Calculate the area covered by one box\.$/,
    make: (e) => {
      const m = e.match(/^20 × ([\d.]+) m²/)
      return m
        ? { prompt: `Each tile covers ${m[1]} m², and tiles are sold in boxes of 20. Calculate the area covered by one box.` }
        : null
    },
  },
  {
    when: /^Determine the equation of the line AB\.$/,
    make: (e) => {
      const m = e.match(/^Using (A\([^)]*\)) and m = (\S+?):/)
      return m ? { context: `${m[1]} lies on the line AB, and the gradient of AB is ${m[2]}.` } : null
    },
  },
  {
    when: /^Write down the equation of the axis of symmetry of g, and state the range of g\.$/,
    make: (e) => {
      const m = e.match(/so x = ([\d.−-]+)\..*turning point at y = ([\d.−-]+)\)/)
      return m ? { context: `g is a parabola opening upward, with a minimum turning point at (${m[1]} ; ${m[2]}).` } : null
    },
  },
]

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
const valuesOf = (s: string): number[] => {
  const c = s.replace(/(\d)[  ](?=\d{3}\b)/g, '$1').replace(/(\d),(\d)/g, '$1.$2')
  return (c.match(/\d+(?:\.\d+)?/g) ?? []).map(Number).sort((a, b) => a - b)
}
const disagree = (a: string, b: string) => {
  const x = valuesOf(a)
  const y = valuesOf(b)
  if (!x.length || !y.length) return false
  for (let k = 0; k < Math.min(x.length, y.length); k++) {
    const sc = Math.max(Math.abs(x[k]), Math.abs(y[k]), 1e-30)
    if (Math.abs(x[k] - y[k]) / sc > 0.01) return true
  }
  return false
}

const out: any[] = []
const missed: string[] = []
for (const subject of ['mat-lit', 'mathematics']) {
  const list: any[] = (await papersForSubject(subject)) as any
  const g = new Map<string, any[]>()
  for (const p of list)
    for (const s of p.sections)
      for (const i of s.items) {
        const k = `${norm(i.prompt)}||${norm(i.context ?? '')}`
        g.set(k, [...(g.get(k) ?? []), i])
      }
  for (const [, v] of g) {
    if (v.length < 2 || !v.some((i: any) => disagree(i.answer, v[0].answer))) continue
    for (const item of v) {
      const rule = rules.find((r) => r.when.test(item.prompt))
      const fix = rule?.make(item.explanation) ?? null
      if (!fix) {
        missed.push(`${item.id}  ${item.prompt.slice(0, 70)}`)
        continue
      }
      out.push({
        subject,
        id: item.id,
        marks: item.marks,
        difficulty: item.difficulty,
        cognitiveLevel: item.cognitiveLevel,
        ...(fix.context ? { context: fix.context } : item.context ? { context: item.context } : {}),
        prompt: fix.prompt ?? item.prompt,
        answer: item.answer,
        explanation: item.explanation,
      })
    }
  }
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1))
console.log(`${out.length} repaired, ${missed.length} not matched`)
for (const m of missed) console.log(`   MISSED ${m}`)
for (const o of out.slice(0, 5)) console.log(`   ${o.id.padEnd(20)} ${o.context ? 'CTX: ' + o.context.slice(0, 80) : 'Q: ' + o.prompt.slice(0, 80)}`)
