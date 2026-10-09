import fs from 'fs'; import vm from 'vm'; import path from 'path'; import { fileURLToPath } from 'url'
const D = path.dirname(fileURLToPath(import.meta.url))
const B = `${D}/build`
const META = {
  'matlit-interest': { file: 'l_interest.js', subjectId: 'mat-lit', topicId: 'finance', grades: [10, 11, 12], title: 'Simple and compound interest', summary: 'The difference between simple and compound interest, with a worked example calculated both ways.' },
  'maths-first-principles': { file: 'l_calculus.js', subjectId: 'mathematics', topicId: 'math-calculus', grades: [12], title: 'The derivative from first principles', summary: 'Where the definition comes from, and a full first-principles example, line by line.' },
  'physics-momentum-impulse': { file: 'l_momentum.js', subjectId: 'physical-sciences', topicId: 'phys-momentum-impulse', grades: [12], title: 'Momentum and impulse', summary: 'Momentum, impulse and Newton’s second law, with a ball rebounding off a wall worked in full.' },
  'lifesci-meiosis': { file: 'l_meiosis.js', subjectId: 'life-sciences', topicId: 'life-sci-meiosis', grades: [12], title: 'Meiosis: making gametes', summary: 'Meiosis I and II with diagrams, the three sources of variation, and how it differs from mitosis.' },
  'matlit-data-summary': { file: 'l_data.js', subjectId: 'mat-lit', topicId: 'data-handling', grades: [10, 11, 12], title: 'Mean, median, mode, range and quartiles', summary: 'Summarising a data set step by step, the box-and-whisker plot, and finding a missing value from the mean.' },
  'maths-reduction-formulae': { file: 'l_reduction.js', subjectId: 'mathematics', topicId: 'math-trigonometry', grades: [11, 12], title: 'Reduction formulae and the CAST diagram', summary: 'Signs from CAST, the reduction formulae and co-functions, with two "without a calculator" examples.' },
  'chem-organic-naming': { file: 'l_organic.js', subjectId: 'physical-sciences', topicId: 'phys-organic-chemistry', grades: [12], title: 'Naming organic molecules', summary: 'The IUPAC rules step by step: chain, numbering, branches, punctuation and esters, with five named examples.' },
  'lifesci-monohybrid': { file: 'l_monohybrid.js', subjectId: 'life-sciences', topicId: 'life-sci-genetics', grades: [12], title: 'Monohybrid crosses', summary: 'The key terms of genetics, a full genetic cross set out the way the memo marks it, a Punnett square and a test cross.' },
}
const out = []
for (const [id, m] of Object.entries(META)) {
  const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(`${D}/${m.file}`, 'utf8'), ctx)
  const timing = JSON.parse(fs.readFileSync(`${B}/${id}_timing.json`))
  const seconds = Math.round(timing.reduce((s, sc) => s + sc.dur + (sc.id === 'title' ? 0.9 : 0.5) + (sc.id === 'outro' ? 2.2 : 0.9), 0))
  const bytes = fs.statSync(`${B}/${id}.mp4`).size
  out.push({ id, subjectId: m.subjectId, topicId: m.topicId, grades: m.grades, title: m.title, summary: m.summary, file: `${id}.mp4`, poster: `${id}.jpg`, seconds, megabytes: +(bytes / 1048576).toFixed(1),
    transcript: ctx.window.LESSON.scenes.map((s) => s.say.join(' ')) })
}
const ts = `import type { Grade } from '@/types'

/**
 * DONE WELL's own video lessons: short narrated lessons on a topic, each
 * with a worked example, built from the same notes the app teaches from. The
 * files live in public/videos (an MP4 and its poster frame); the transcript
 * is the narration word for word, for reading instead of watching.
 *
 * Generated from tools/video-lessons -- edit a lesson there and rebuild it,
 * rather than editing this list by hand.
 */
export interface TopicVideo {
  id: string
  subjectId: string
  topicId: string
  grades: Grade[]
  title: string
  summary: string
  /** In public/videos. */
  file: string
  poster: string
  seconds: number
  megabytes: number
  /** The narration, one paragraph per section. */
  transcript: string[]
}

export const topicVideos: TopicVideo[] = ${JSON.stringify(out, null, 2)}

export const getVideo = (id: string): TopicVideo | undefined => topicVideos.find((v) => v.id === id)

export const videosForTopic = (topicId: string): TopicVideo[] => topicVideos.filter((v) => v.topicId === topicId)

export const videoMinutes = (v: TopicVideo): number => Math.max(1, Math.round(v.seconds / 60))
`
fs.writeFileSync(`${D}/../../src/data/topicVideos.ts`, ts)
for (const id of Object.keys(META)) {
  fs.copyFileSync(`${B}/${id}.mp4`, `${D}/../../public/videos/${id}.mp4`)
}
console.log(out.map((o) => `${o.id} ${o.seconds}s ${o.megabytes}MB`).join('\n'))
