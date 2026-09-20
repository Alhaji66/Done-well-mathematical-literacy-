/**
 * Build a rewrite batch that makes every orphaned Mat Lit prompt self-contained.
 *
 * The value each item refers to is recoverable from its OWN answer, not from
 * the neighbour it points at, which is what makes this safe to do mechanically:
 * "Convert this volume to litres" answered "2 400 litres" can only have been
 * about 2,4 m³. Deriving it from the answer rather than from the previous item
 * also means a mis-ordered section cannot produce a wrong prompt.
 *
 * Restating the value inline is better exam practice as well as a bug fix: a
 * candidate who gets 4.1 wrong can still earn 4.2.
 */
import { papersForSubject } from '../src/data/papers/index.ts'
import { writeFileSync } from 'node:fs'

/** South African convention: comma for the decimal point, space for thousands. */
const za = (n: number) => {
  const [i, d] = String(n).split('.')
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return d ? `${int},${d}` : int
}
const num = (s: string) => Number(s.replace(/[^\d.,]/g, '').replace(/\s/g, '').replace(',', '.'))

/*
 * What the volume is OF, taken from the sibling that set the scene. Two papers
 * can legitimately arrive at the same number -- 2,4 m³ of soil and 2,4 m³ of
 * compost -- and without the material those two items would still be
 * word-for-word identical after the fix, which is half of what the fix is for.
 */
const material = (prev: any): string => {
  const m = (prev?.prompt ?? '').match(/\b(compost|topsoil|soil|water|sand|gravel|concrete)\b/i)
  return m ? ` of ${m[1].toLowerCase()}` : ''
}

const list: any[] = (await papersForSubject('mat-lit')) as any
const batch: any[] = []
for (const p of list)
  for (const s of p.sections)
    for (const [n, i] of s.items.entries()) {
      if (i.context) continue
      const stuff = material(s.items[n - 1])
      let prompt: string | null = null
      let explanation: string | null = null

      if (/^Convert this volume to litres \(1 m³ = 1 000 litres\)\.$/.test(i.prompt)) {
        const litres = num(i.answer)
        const m3 = litres / 1000
        prompt = `Convert ${za(m3)} m³${stuff} to litres (1 m³ = 1 000 litres).`
        explanation = `${za(m3)} × 1 000 = ${za(litres)} litres. A cubic metre is 1 000 litres, so the digits do not change — only where the comma sits.`
      } else if (/^Convert this volume to millilitres \(1 cm³ = 1 mℓ\)\.$/.test(i.prompt)) {
        const ml = num(i.answer)
        prompt = `Convert ${za(ml)} cm³${stuff} to millilitres (1 cm³ = 1 mℓ).`
        explanation = `${za(ml)} cm³ = ${za(ml)} mℓ. The two units are the same size, so the number is unchanged — the conversion is a relabelling, not a calculation.`
      } else if (/^Convert this volume to litres \(1 000 cm³ = 1 litre\)\.$/.test(i.prompt)) {
        const litres = num(i.answer)
        const cm3 = litres * 1000
        prompt = `Convert ${za(cm3)} cm³${stuff} to litres (1 000 cm³ = 1 litre).`
        explanation = `${za(cm3)} ÷ 1 000 = ${za(litres)} litres. Dividing, not multiplying: a litre is the LARGER unit, so the number must come down.`
      } else {
        const m = i.prompt.match(/^(\w+) spends this amount every day of the week\. Calculate the total weekly spend\.$/)
        if (m) {
          const week = num(i.answer)
          const day = week / 6
          prompt = `${m[1]} spends R${za(day)} a day on airtime and data, six days a week. Calculate the total weekly spend.`
          explanation = `R${za(day)} × 6 = R${za(week)}. Six days, not seven — the number of days is part of the question and worth reading twice.`
        }
      }
      if (!prompt) continue
      batch.push({
        id: i.id,
        marks: i.marks,
        difficulty: i.difficulty,
        cognitiveLevel: i.cognitiveLevel,
        prompt,
        answer: i.answer,
        explanation,
      })
    }

writeFileSync(process.argv[2], JSON.stringify(batch, null, 1))
console.log(`${batch.length} item(s) queued`)
for (const b of batch.slice(0, 4)) console.log(`  ${b.id.padEnd(22)} ${b.prompt}`)
