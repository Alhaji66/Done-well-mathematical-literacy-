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
  'matlit-income-tax': { file: 'l_tax.js', subjectId: 'mat-lit', topicId: 'finance', grades: [12], title: 'Income tax and the tax threshold', summary: 'Taxable income, the SARS tax table and rebates worked in full, and how to find each tax threshold yourself.' },
  'matlit-measurement': { file: 'l_measure.js', subjectId: 'mat-lit', topicId: 'measurement', grades: [10, 11, 12], title: 'Area, volume and converting units', summary: 'Perimeter, area and volume, why square and cubic units convert differently, a water tank in litres and a wall to paint.' },
  'maths-circle-geometry': { file: 'l_circles.js', subjectId: 'mathematics', topicId: 'math-euclidean-geometry', grades: [11, 12], title: 'Circle geometry: the angle theorems', summary: 'The four angle theorems, a worked example with the centre, same segment and cyclic quadrilateral, and statements with reasons.' },
  'physics-newtons-laws': { file: 'l_newton.js', subjectId: 'physical-sciences', topicId: 'phys-newtons-laws', grades: [11, 12], title: "Newton's laws and free-body diagrams", summary: "The three laws in plain words, a free-body diagram with friction, the second law worked in full, and third-law pairs." },
  'lifesci-natural-selection': { file: 'l_evolution.js', subjectId: 'life-sciences', topicId: 'life-sci-evolution', grades: [12], title: 'Evolution by natural selection', summary: "Darwin's theory step by step, drug-resistant TB as an example, Lamarck compared, and speciation through geographic isolation." },
  'matlit-map-scale': { file: 'l_maps.js', subjectId: 'mat-lit', topicId: 'maps-plans', grades: [10, 11, 12], title: 'Using a scale on maps and plans', summary: 'Number and bar scales, map distance to real distance and back, a floor plan, and turning a bar scale into a number scale.' },
  'maths-sketch-parabola': { file: 'l_parabola.js', subjectId: 'mathematics', topicId: 'math-functions', grades: [10, 11, 12], title: 'Sketching a parabola', summary: 'Shape, intercepts and the turning point step by step, the labelled sketch, its range and axis of symmetry.' },
  'physics-series-parallel': { file: 'l_circuits.js', subjectId: 'physical-sciences', topicId: 'phys-electric-circuits-g11', grades: [11], title: 'Series and parallel circuits', summary: "How current and voltage share out in series and parallel, and a full circuit worked out with Ohm's law." },
  'lifesci-protein-synthesis': { file: 'l_protein.js', subjectId: 'life-sciences', topicId: 'life-sci-dna-code', grades: [12], title: 'Protein synthesis: transcription and translation', summary: 'Where each stage happens, base pairing with uracil, and a DNA template worked through to its amino acids.' },
  'matlit-break-even': { file: 'l_breakeven.js', subjectId: 'mat-lit', topicId: 'finance', grades: [10, 11, 12], title: 'Break-even analysis', summary: 'Fixed and variable costs, cost and income formulas, the break-even point by calculation and on a graph, and profit.' },
  'maths-optimisation': { file: 'l_optimise.js', subjectId: 'mathematics', topicId: 'math-calculus', grades: [12], title: 'Optimisation: the largest box', summary: 'The four steps of an optimisation question, worked on the open-box problem, with a check that it is a maximum.' },
  'chem-le-chatelier': { file: 'l_lechatelier.js', subjectId: 'physical-sciences', topicId: 'phys-chemical-equilibrium', grades: [12], title: "Le Chatelier's principle", summary: 'How the Haber equilibrium responds to concentration, pressure, temperature and a catalyst, and when Kc changes.' },
  'lifesci-dihybrid': { file: 'l_dihybrid.js', subjectId: 'life-sciences', topicId: 'life-sci-genetics', grades: [12], title: 'Dihybrid crosses', summary: 'Two characteristics at once: gametes, the 16-box Punnett square, the 9 : 3 : 3 : 1 ratio and independent assortment.' },
  'matlit-probability': { file: 'l_probability.js', subjectId: 'mat-lit', topicId: 'data-handling', grades: [10, 11, 12], title: 'Probability: chance, outcomes and relative frequency', summary: 'The probability scale, a probability from outcomes, theory against an experiment, and two dice at once.' },
  'maths-trig-identities': { file: 'l_identities.js', subjectId: 'mathematics', topicId: 'math-trigonometry', grades: [11, 12], title: 'Proving trigonometric identities', summary: 'The quotient and square identities, a method that always works, and two proofs set out step by step.' },
  'chem-acids-titration': { file: 'l_acids.js', subjectId: 'physical-sciences', topicId: 'phys-acids-bases', grades: [12], title: 'Acids, bases, pH and titration', summary: 'Lowry-Brønsted definitions, strong against concentrated, pH from a concentration, and a titration worked in full.' },
  'lifesci-menstrual-cycle': { file: 'l_menstrual.js', subjectId: 'life-sciences', topicId: 'life-sci-human-reproduction', grades: [12], title: 'The menstrual cycle and its hormones', summary: 'FSH, oestrogen, LH and progesterone, the 28-day cycle day by day, and the negative feedback that links them.' },
  'matlit-budget-inflation': { file: 'l_budget.js', subjectId: 'mat-lit', topicId: 'finance', grades: [10, 11, 12], title: 'Household budgets and inflation', summary: 'A family budget, surplus or deficit, a share of income, and inflation over one and two years.' },
  'maths-analytical-geometry': { file: 'l_analytic.js', subjectId: 'mathematics', topicId: 'math-analytical-geometry', grades: [10, 11], title: 'Analytical geometry: two points, everything else', summary: 'Distance, midpoint and gradient, the equation of the line, a perpendicular gradient and the angle of inclination.' },
  'physics-generators-ac': { file: 'l_generators.js', subjectId: 'physical-sciences', topicId: 'phys-electrodynamics', grades: [12], title: 'Generators, motors and alternating current', summary: 'How a generator works, slip rings against a split-ring commutator, rms values and a kettle worked in full.' },
  'lifesci-reflex-arc': { file: 'l_reflex.js', subjectId: 'life-sciences', topicId: 'life-sci-response-humans', grades: [12], title: 'The nervous system and the reflex arc', summary: 'The CNS and PNS, three kinds of neuron, the reflex arc step by step, and why it is fast.' },
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
