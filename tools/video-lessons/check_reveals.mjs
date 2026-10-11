// Every element that appears with a sentence (data-at="n") must have a sentence n
// to appear with, or the renderer fails part-way through a video.
// Usage: node check_reveals.mjs l_a.js [l_b.js ...]
import fs from 'fs'; import vm from 'vm'
let bad = 0
for (const file of process.argv.slice(2)) {
  const ctx = { window: {} }
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx)
  for (const s of ctx.window.LESSON.scenes) {
    const at = [...s.html.matchAll(/data-at="(\d+)"/g)].map((m) => +m[1])
    const max = at.length ? Math.max(...at) : 0
    if (max >= s.say.length) {
      console.log(`${file} · ${s.id}: reveals at ${max} but has only ${s.say.length} sentence(s)`)
      bad++
    }
  }
}
console.log(bad ? `${bad} problem(s)` : 'Every reveal has its sentence.')
process.exit(bad ? 1 : 0)
