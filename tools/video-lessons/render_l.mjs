import { chromium } from 'playwright'
import path from 'path'; import { fileURLToPath } from 'url'
import fs from 'fs'; import { spawn, spawnSync } from 'child_process'
const [file, id, mode = 'video', ...stills] = process.argv.slice(2)
const D = path.dirname(fileURLToPath(import.meta.url)), B = `${D}/build`
const timing = JSON.parse(fs.readFileSync(`${B}/${id}_timing.json`))
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.goto(`file://${D}/lesson.html`)
await p.evaluate((t) => { window.TIMING = t }, timing)
await p.addScriptTag({ path: `${D}/${file}` })
const total = await p.evaluate(() => window.setup())
await p.evaluate(() => document.fonts.ready)
const plan = await p.evaluate(() => window.LESSON.scenes.map((s) => ({ id: s.id, t0: s.t0, lead: s.lead })))
console.log(id, 'total', total.toFixed(1), 's')
if (mode === 'stills') {
  for (const t of stills) { await p.evaluate((t) => window.render(t), +t); await p.screenshot({ path: `${B}/${id}_still_${t}.jpg`, type: 'jpeg', quality: 85 }) }
} else {
  if (mode !== 'mux') {
  const FPS = 24, N = Math.ceil(total * FPS)
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', `${B}/${id}_v.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] })
  for (let i = 0; i < N; i++) {
    await p.evaluate((t) => window.render(t), i / FPS)
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 })
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r))
  }
  // Lay each scene's narration at its start, then mux.
  const inputs = ['-i', `${B}/${id}_v.mp4`], filt = [], labels = []
  plan.forEach((s, i) => { inputs.push('-i', `${B}/${id}_${s.id}.wav`); const ms = Math.round((s.t0 + s.lead) * 1000); filt.push(`[${i + 1}:a]aresample=44100,adelay=${ms}|${ms},apad[a${i}]`); labels.push(`[a${i}]`) })
  filt.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:duration=longest,loudnorm=I=-16:TP=-1.5:LRA=9[out]`)
  const r = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', filt.join(';'), '-map', '0:v', '-map', '[out]', '-t', total.toFixed(2), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '96k', '-ac', '1', '-ar', '44100', '-movflags', '+faststart', `${B}/${id}.mp4`], { stdio: 'inherit' })
  console.log('wrote', `${B}/${id}.mp4`, r.status)
}
await b.close()
