import fs from 'fs'; import vm from 'vm'
const [file] = process.argv.slice(2)
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx)
const L = ctx.window.LESSON
console.log(JSON.stringify({ id: L.id, scenes: L.scenes.map((s) => ({ id: s.id, say: s.say })) }))
