import { papersForSubject } from '../src/data/papers/index.ts'

// The current rule, and the same rule with ONE change: an optional possessive
// between the determiner and the noun. The noun list is untouched.
const OLD =
  /\b(do you agree|to what extent|design an? (investigation|experiment)|suggest (an improvement|a way to improve)|which .{0,40}would you (choose|recommend|support)|evaluate (the|this|their|his|her) (claim|statement|argument|conclusion|method|design|proposal|reasoning|explanation)|assess (the|this|their|whether)|whose (reasoning|argument|claim|method|approach|explanation)|criticis|advantages and disadvantages|discuss the ethical)\b/i
const NEW =
  /\b(do you agree|to what extent|design an? (investigation|experiment)|suggest (an improvement|a way to improve)|which .{0,40}would you (choose|recommend|support)|evaluate (the|this|that|their|his|her)( [\w-]+['’]s)? (claim|statement|argument|conclusion|method|design|proposal|reasoning|explanation)|assess (the|this|that|their|whether)( [\w-]+['’]s)?|whose (reasoning|argument|claim|method|approach|explanation)|criticis|advantages and disadvantages|discuss the ethical)\b/i

const list: any[] = (await papersForSubject('physical-sciences')) as any
const moved: any[] = []
let total = 0
for (const p of list)
  for (const s of p.sections)
    for (const i of s.items) {
      total++
      if (!OLD.test(i.prompt) && NEW.test(i.prompt)) moved.push({ ...i, paperId: p.id })
    }
console.log(`physical-sciences: ${total} items scanned`)
console.log(`newly matched by the widened rule: ${moved.length}`)
for (const m of moved) console.log(`  [stored L${m.cognitiveLevel}] ${m.id.padEnd(24)} ${m.prompt.slice(0, 120)}`)
