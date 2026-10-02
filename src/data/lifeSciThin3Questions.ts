/**
 * The third round of Life Sciences questions for the thinnest sub-topics, as
 * the sub-topic coverage report counted them before this file:
 *
 *   Reproduction in vertebrates (Grade 12): fertilisation -- 8.
 *   Meiosis (Grade 12): meiosis II -- 8.
 *   Biodiversity in animals (Grade 11): key terms in animal classification -- 8.
 *   Micro-organisms (Grade 11): roles of micro-organisms -- 8.
 *   Photosynthesis (Grade 11): the light phase -- 9; limiting factors -- 9.
 *   Genetics (Grade 12): dihybrid crosses and pedigrees -- 9.
 *   Plant responses (Grade 12): why tropisms matter -- 9.
 *   Human responses (Grade 12): key terms in responding to the environment -- 9.
 *   Animal nutrition (Grade 11): enzymes and their products -- 10.
 *   Respiration (Grade 11): key terms in respiration -- 10.
 *   Population ecology (Grade 11): sampling and interactions -- 10.
 *
 * Six more each, across the four cognitive levels: recall, explanation,
 * application to a new case, and data or evaluation questions in the style of
 * the NSC. Where a question has numbers, they are computed from the values
 * declared with it, so the question, answer and memo cannot disagree.
 */
import type { Question } from '@/types'

/** A number with a decimal comma, to `dp` places, trailing zeros dropped. */
const n = (v: number, dp = 1): string => {
  const r = Math.round(v * 10 ** dp) / 10 ** dp
  const [whole, dec] = String(Math.abs(r)).split('.')
  return (r < 0 ? '−' : '') + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (dec ? `,${dec}` : '')
}

const out: Question[] = []

/* ===================================================================== */
/* Reproduction in vertebrates, Grade 12: fertilisation                   */
/* ===================================================================== */

const repro = { topicId: 'life-sci-reproduction-vertebrates', grade: 12 } as const

{
  const [released, percent] = [2_500_000, 0.4]
  const fertilised = (released * percent) / 100
  out.push({
    ...repro,
    id: 'ls5-12-spawning-fertilised-count',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A female fish releases ${n(released, 0)} gametes into the sea in one spawning, and only ${n(percent)}% of them are fertilised. Calculate how many are fertilised, and explain why so small a percentage is fertilised with external fertilisation.`,
    answer: `${n(percent)} ÷ 100 × ${n(released, 0)} = ${n(fertilised, 0)} fertilised. With external fertilisation the gametes are released into open water, where currents scatter them, many are eaten, and sperm and ova may never meet, so the chance of each one being fertilised is low.`,
    explanation:
      'This is why animals with external fertilisation release such huge numbers of gametes: the low chance for each is made up for by the sheer number released.',
    memo: [
      { code: 'M', marks: 1, text: `${n(percent)} ÷ 100 × ${n(released, 0)}` },
      { code: 'CA', marks: 1, text: `${n(fertilised, 0)}` },
      { code: 'A', marks: 1, text: 'Gametes are scattered by water currents / eaten by other animals' },
      { code: 'A', marks: 1, text: 'So sperm and ova may never meet: a low chance of fertilisation for each' },
    ],
  })
}

out.push(
  {
    ...repro,
    id: 'ls5-12-frog-pond-fertilisation-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'A female frog releases her gametes into pond water and a male releases sperm over them. Which type of fertilisation is this?',
    options: [
      { id: 'a', label: 'Internal fertilisation' },
      { id: 'b', label: 'External fertilisation' },
      { id: 'c', label: 'Self-fertilisation' },
      { id: 'd', label: 'Vivipary' },
    ],
    correctOptionId: 'b',
    answer: 'External fertilisation',
    explanation: 'The sperm and ova meet outside the female’s body, in the water, so this is external fertilisation. Vivipary describes how an embryo develops, not how fertilisation happens.',
    memo: [{ code: 'A', marks: 2, text: 'B: external fertilisation' }],
  },
  {
    ...repro,
    id: 'ls5-12-external-large-numbers',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why fish that use external fertilisation release very large numbers of gametes.',
    answer:
      'In external fertilisation most gametes are lost: they are scattered by the water or eaten, so each has only a small chance of being fertilised. Releasing very large numbers makes sure that at least some are fertilised.',
    explanation: 'A low chance per gamete multiplied by a very large number still gives enough fertilised ova for the species to survive.',
    memo: [
      { code: 'A', marks: 1, text: 'Each gamete has a low chance of being fertilised / many are lost' },
      { code: 'A', marks: 1, text: 'Large numbers make sure that some are fertilised' },
    ],
  },
  {
    ...repro,
    id: 'ls5-12-internal-dry-land',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why internal fertilisation is necessary for animals that reproduce on dry land.',
    answer:
      'Sperm need a liquid to swim in and both gametes would dry out in air. Internal fertilisation places the sperm directly inside the moist reproductive tract of the female, so the sperm can swim to the ova and neither gamete dries out.',
    explanation: 'This is one of the reasons reptiles, birds and mammals could live their whole lives away from water while amphibians must return to it to breed.',
    memo: [
      { code: 'A', marks: 1, text: 'Gametes would dry out in air' },
      { code: 'A', marks: 1, text: 'Sperm need a liquid medium to swim' },
      { code: 'A', marks: 1, text: 'Inside the female the tract is moist, so the sperm reach the ova' },
    ],
  },
  {
    ...repro,
    id: 'ls5-12-shark-internal-advantages',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'Sharks use internal fertilisation even though they live in water. Suggest TWO advantages to a shark of internal fertilisation compared with external fertilisation in the open sea.',
    answer:
      'The chance of fertilisation is much higher, because the sperm are placed close to the ova and are not scattered by currents, so the female needs to produce far fewer gametes. Fertilisation inside the body also allows the embryos to develop inside the mother (ovovivipary or vivipary), where they are protected from predators.',
    explanation: 'Internal fertilisation is a prerequisite for keeping the developing young inside the body, which many sharks do.',
    memo: [
      { code: 'A', marks: 1, text: 'Higher chance of fertilisation: sperm placed close to the ova' },
      { code: 'A', marks: 1, text: 'So fewer gametes need to be produced: less energy wasted' },
      { code: 'A', marks: 1, text: 'Allows the embryos to develop inside the mother' },
      { code: 'A', marks: 1, text: 'Where they are protected from predators' },
    ],
  },
  {
    ...repro,
    id: 'ls5-12-gamete-numbers-evaluate',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt:
      'Use the data to evaluate the statement: “Animals with internal fertilisation release fewer female gametes than animals with external fertilisation.” Give a biological reason for the pattern.',
    context:
      'Female gametes (ova) released per breeding season, and the type of fertilisation:\nCod — 5 000 000 — external\nCommon frog — 2 000 — external\nNile crocodile — 50 — internal\nChicken — 300 — internal\nHuman — 13 — internal',
    answer:
      'The data support the statement: the two animals with external fertilisation release 2 000 and 5 000 000 ova, while the three with internal fertilisation release only 13 to 300. The data come from only five animals, so the statement can be supported but not proved for all animals. The reason: with internal fertilisation the sperm are placed close to the ova, so each ovum has a high chance of being fertilised and fewer need to be produced.',
    explanation:
      'An evaluation weighs the evidence: say whether it supports the claim, quote the numbers, note how far the evidence reaches, then give the biology behind the pattern.',
    memo: [
      { code: 'A', marks: 1, text: 'Supports the statement' },
      { code: 'A', marks: 1, text: 'Quotes figures: external 2 000 / 5 000 000 against internal 13–300' },
      { code: 'J', marks: 1, text: 'Only five animals: supports but does not prove it for all animals' },
      { code: 'R', marks: 1, text: 'Internal: sperm placed close to the ova, high chance of fertilisation' },
      { code: 'R', marks: 1, text: 'So fewer gametes need to be produced' },
    ],
  },
)

/* ===================================================================== */
/* Meiosis, Grade 12: meiosis II                                          */
/* ===================================================================== */

const meiosis = { topicId: 'life-sci-meiosis', grade: 12 } as const

{
  const diploid = 24
  const haploid = diploid / 2
  const chromatids = haploid * 2
  out.push({
    ...meiosis,
    id: 'ls5-12-second-division-counts',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A tomato plant has a diploid number of ${diploid}. For ONE cell at the start of the second division of meiosis, state how many chromosomes and how many chromatids it contains, and how many chromosomes each cell has at the end of telophase II.`,
    answer: `At the start of the second division each cell is already haploid: ${haploid} chromosomes, each made of two chromatids, so ${chromatids} chromatids. At the end of telophase II each cell has ${haploid} chromosomes, each now a single chromatid.`,
    explanation:
      'The chromosome number halves in the first division. The second division separates the sister chromatids, so the number of chromosomes per cell stays the same while the number of chromatids per cell halves.',
    memo: [
      { code: 'A', marks: 1, text: `${haploid} chromosomes at the start of meiosis II` },
      { code: 'CA', marks: 1, text: `${chromatids} chromatids` },
      { code: 'CA', marks: 1, text: `${haploid} chromosomes at the end of telophase II` },
      { code: 'A', marks: 1, text: 'Each now a single chromatid / chromatids have separated' },
    ],
  })
}

out.push(
  {
    ...meiosis,
    id: 'ls5-12-chromatids-poles-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'During which phase of the second division of meiosis do sister chromatids move to opposite poles?',
    options: [
      { id: 'a', label: 'Prophase II' },
      { id: 'b', label: 'Metaphase II' },
      { id: 'c', label: 'Anaphase II' },
      { id: 'd', label: 'Telophase II' },
    ],
    correctOptionId: 'c',
    answer: 'Anaphase II',
    explanation: 'In anaphase II the centromeres split and the spindle fibres pull the sister chromatids of each chromosome to opposite poles.',
    memo: [{ code: 'A', marks: 2, text: 'C: anaphase II' }],
  },
  {
    ...meiosis,
    id: 'ls5-12-metaphase-ii-describe',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Describe what happens to the chromosomes during metaphase II.',
    answer:
      'The chromosomes line up singly (not in pairs) at the equator of the cell. Each chromosome is still made of two chromatids, and spindle fibres attach to the centromere of each one from opposite poles.',
    explanation: 'Contrast this with metaphase of the first division, where homologous chromosomes line up in pairs.',
    memo: [
      { code: 'A', marks: 1, text: 'Chromosomes line up at the equator' },
      { code: 'A', marks: 1, text: 'Singly, not in homologous pairs' },
      { code: 'A', marks: 1, text: 'Spindle fibres attach to each centromere' },
    ],
  },
  {
    ...meiosis,
    id: 'ls5-12-second-division-vs-mitosis',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'State TWO ways in which the second division of meiosis differs from mitosis.',
    answer:
      'The second division of meiosis starts with haploid cells, while mitosis starts with diploid cells. The cells it produces are genetically different from one another (because of crossing over earlier), while mitosis gives genetically identical cells.',
    explanation: 'The mechanics are the same as mitosis, which is why the second division is often called “mitosis-like”, but what goes in and what comes out differ.',
    memo: [
      { code: 'A', marks: 1, text: 'Starts with haploid cells; mitosis starts with diploid cells' },
      { code: 'A', marks: 1, text: 'Daughter cells genetically different; mitosis gives identical cells' },
    ],
  },
  {
    ...meiosis,
    id: 'ls5-12-anaphase-ii-failure',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'In a human cell with 23 chromosomes at the start of meiosis II, the sister chromatids of one chromosome fail to separate during anaphase II. Predict the number of chromosomes in each of the FOUR gametes that come from the original cell.',
    answer:
      'The cell in which the failure happened gives one gamete with 24 chromosomes (both chromatids went to it) and one with 22 (it received neither). The other cell from the first division divides normally, giving two gametes with 23 chromosomes each. So the four gametes have 24, 22, 23 and 23.',
    explanation:
      'A failure in the second division affects only one of the two cells, so half the gametes are normal. A failure in the first division affects both cells, so all four gametes are abnormal.',
    memo: [
      { code: 'A', marks: 1, text: 'One gamete with 24' },
      { code: 'A', marks: 1, text: 'One gamete with 22' },
      { code: 'A', marks: 1, text: 'Two gametes with 23' },
      { code: 'R', marks: 1, text: 'Only one of the two cells is affected in the second division' },
    ],
  },
  {
    ...meiosis,
    id: 'ls5-12-second-division-just-mitosis',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'A learner says the second division of meiosis is “just mitosis”. Evaluate this statement.',
    answer:
      'The statement is partly true. The events are the same as in mitosis: chromosomes line up singly at the equator and sister chromatids are pulled to opposite poles. But it is not just mitosis: it starts with haploid cells, not diploid ones, and because of crossing over the sister chromatids are no longer identical, so the cells produced are genetically different, not identical.',
    explanation: 'An evaluation needs both sides: what is true in the claim, what is false, and a judgement.',
    memo: [
      { code: 'J', marks: 1, text: 'Partly true' },
      { code: 'A', marks: 1, text: 'Same events: single chromosomes at the equator, chromatids separate' },
      { code: 'A', marks: 1, text: 'Different: starts with haploid cells' },
      { code: 'A', marks: 1, text: 'Different: chromatids not identical after crossing over, so cells differ' },
    ],
  },
)

/* ===================================================================== */
/* Biodiversity in animals, Grade 11: key terms in classification         */
/* ===================================================================== */

const animals = { topicId: 'life-sci-biodiversity-animals', grade: 11 } as const

out.push(
  {
    ...animals,
    id: 'ls5-11-one-plane-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which term describes a body that can be cut into two mirror-image halves along only one plane?',
    options: [
      { id: 'a', label: 'Radial symmetry' },
      { id: 'b', label: 'Bilateral symmetry' },
      { id: 'c', label: 'Asymmetry' },
      { id: 'd', label: 'Cephalisation' },
    ],
    correctOptionId: 'b',
    answer: 'Bilateral symmetry',
    explanation: 'Radial symmetry gives similar halves through many planes; bilateral symmetry gives mirror-image left and right halves through one plane only.',
    memo: [{ code: 'A', marks: 2, text: 'B: bilateral symmetry' }],
  },
  {
    ...animals,
    id: 'ls5-11-cephalisation-bilateral',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Define cephalisation and explain why it is linked to bilateral symmetry.',
    answer:
      'Cephalisation is the concentration of sense organs and nerve tissue at the front (head) end of the body. An animal with bilateral symmetry moves with one end first, so that end meets food and danger first; having the sense organs and a brain there lets it detect and respond to them quickly.',
    explanation: 'Animals with radial symmetry meet their surroundings equally from all sides, so they gain nothing from a head.',
    memo: [
      { code: 'A', marks: 1, text: 'Sense organs and nerve tissue concentrated at the head end' },
      { code: 'A', marks: 1, text: 'Bilateral animals move with one end first' },
      { code: 'A', marks: 1, text: 'That end meets food/danger first, so senses there are an advantage' },
    ],
  },
  {
    ...animals,
    id: 'ls5-11-endotherm-ectotherm',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Distinguish between an endotherm and an ectotherm, and give ONE example of each.',
    answer:
      'An endotherm keeps its body temperature constant using heat from its own metabolism, for example a dog or an eagle. An ectotherm’s body temperature changes with its surroundings, and it gains heat from the environment, for example a lizard or a frog.',
    explanation: 'Endotherms can stay active in the cold but must eat much more food to fuel the heat they produce.',
    memo: [
      { code: 'A', marks: 1, text: 'Endotherm: constant temperature from its own metabolic heat' },
      { code: 'A', marks: 1, text: 'Example of an endotherm (any mammal or bird)' },
      { code: 'A', marks: 1, text: 'Ectotherm: temperature depends on / heat from the surroundings' },
      { code: 'A', marks: 1, text: 'Example of an ectotherm (any reptile, amphibian or fish)' },
    ],
  },
  {
    ...animals,
    id: 'ls5-11-lizard-basking-ectotherm',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A lizard lies on a sunny rock every morning before it starts to hunt. Use the term ectotherm to explain this behaviour.',
    answer:
      'A lizard is an ectotherm: it cannot make enough heat itself, so after a cold night its body is cold and its muscles work slowly. By basking it absorbs heat from the sun and the rock, its body temperature rises, its metabolism speeds up, and it can then move fast enough to catch prey.',
    explanation: 'Behaviour such as basking and moving into the shade is how ectotherms control their temperature.',
    memo: [
      { code: 'A', marks: 1, text: 'Ectotherm: gets its heat from the surroundings' },
      { code: 'A', marks: 1, text: 'Basking raises its body temperature' },
      { code: 'A', marks: 1, text: 'Faster metabolism/muscles, so it can hunt' },
    ],
  },
  {
    ...animals,
    id: 'ls5-11-coelom-body-plans',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Distinguish between an acoelomate, a pseudocoelomate and a coelomate body plan.',
    answer:
      'An acoelomate has no body cavity between the gut and the body wall. A pseudocoelomate has a fluid-filled cavity that is only partly lined by mesoderm. A coelomate has a true coelom: a body cavity completely lined by mesoderm.',
    explanation: 'A true coelom gives the organs room to grow and move independently of the body wall.',
    memo: [
      { code: 'A', marks: 1, text: 'Acoelomate: no body cavity' },
      { code: 'A', marks: 1, text: 'Pseudocoelomate: cavity partly lined by mesoderm' },
      { code: 'A', marks: 1, text: 'Coelomate: cavity completely lined by mesoderm' },
    ],
  },
  {
    ...animals,
    id: 'ls5-11-unknown-animal-terms',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt:
      'An unknown marine animal has radial symmetry, a body made of two tissue layers (diploblastic), no coelom and a single opening to its gut. Explain what each key term tells you about the animal, and suggest the phylum it belongs to.',
    answer:
      'Radial symmetry: it can meet food or danger from any direction, so it is probably slow-moving or attached. Diploblastic: its body has only an outer ectoderm and inner endoderm, with no mesoderm, so it has no complex organs. No coelom: there is no body cavity. One opening: food enters and waste leaves through the same opening. Together these suggest the phylum Cnidaria (such as a jellyfish or sea anemone).',
    explanation: 'Classification keys use exactly these terms: symmetry, number of tissue layers, the body cavity and the number of gut openings.',
    memo: [
      { code: 'A', marks: 1, text: 'Radial symmetry: meets surroundings from all sides / sessile or slow' },
      { code: 'A', marks: 1, text: 'Diploblastic: two layers, no mesoderm' },
      { code: 'A', marks: 1, text: 'No coelom: no body cavity' },
      { code: 'A', marks: 1, text: 'One opening: mouth also used to remove waste' },
      { code: 'A', marks: 1, text: 'Cnidaria' },
    ],
  },
)

/* ===================================================================== */
/* Micro-organisms, Grade 11: roles of micro-organisms                    */
/* ===================================================================== */

const microbes = { topicId: 'life-sci-biodiversity-microorganisms', grade: 11 } as const

{
  const [start, doublingMinutes, hours] = [1000, 30, 4]
  const doublings = (hours * 60) / doublingMinutes
  const final = start * 2 ** doublings
  out.push({
    ...microbes,
    id: 'ls5-11-yoghurt-culture-doubling',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `During the fermentation of milk into yoghurt, the micro-organisms double in number every ${doublingMinutes} minutes. If there are ${n(start, 0)} per millilitre at the start, calculate how many there are per millilitre after ${hours} hours, and state why the milk turns sour.`,
    answer: `${hours} h × 60 ÷ ${doublingMinutes} = ${doublings} doublings. ${n(start, 0)} × 2^${doublings} = ${n(final, 0)} per millilitre. The milk turns sour because the micro-organisms convert the milk sugar (lactose) into lactic acid.`,
    explanation: 'Each doubling multiplies the number by 2, so after d doublings the number is multiplied by 2^d -- not by 2 × d.',
    memo: [
      { code: 'M', marks: 1, text: `${doublings} doublings` },
      { code: 'M', marks: 1, text: `${n(start, 0)} × 2^${doublings}` },
      { code: 'CA', marks: 1, text: `${n(final, 0)} per ml` },
      { code: 'A', marks: 1, text: 'Lactose converted to lactic acid' },
    ],
  })
}

{
  const years = [2015, 2018, 2021, 2024]
  const pct = [8, 15, 27, 41]
  out.push({
    ...microbes,
    id: 'ls5-11-antibiotic-resistance-trend',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt:
      'Describe the trend in the data, explain how overuse of the antibiotic could cause it, and suggest ONE way a hospital could slow it down.',
    context: `Percentage of infections in a hospital that did not respond to a common antibiotic:\n${years.map((y, i) => `${y} — ${pct[i]}%`).join('\n')}`,
    answer: `The percentage of infections that did not respond rose steadily, from ${pct[0]}% in ${years[0]} to ${pct[pct.length - 1]}% in ${years[years.length - 1]}. Each time the antibiotic is used, the micro-organisms it kills die, but any that happen to be resistant survive and multiply, so the resistant type becomes more common; using the antibiotic often, or for infections it cannot treat, speeds this up. The hospital could prescribe the antibiotic only when it is really needed, and make sure patients finish the full course.`,
    explanation: 'Resistance is natural selection: the antibiotic does not create resistance, it selects the few resistant individuals that were already present.',
    memo: [
      { code: 'A', marks: 1, text: `Increase from ${pct[0]}% to ${pct[pct.length - 1]}%` },
      { code: 'A', marks: 1, text: 'Antibiotic kills the non-resistant micro-organisms' },
      { code: 'A', marks: 1, text: 'Resistant ones survive and reproduce' },
      { code: 'A', marks: 1, text: 'Overuse increases this selection, so resistance spreads' },
      { code: 'A', marks: 1, text: 'Prescribe only when needed / finish the full course / hygiene' },
    ],
  })
}

out.push(
  {
    ...microbes,
    id: 'ls5-11-beneficial-use-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which of the following is a beneficial use of micro-organisms?',
    options: [
      { id: 'a', label: 'Causing tuberculosis' },
      { id: 'b', label: 'Spoiling stored bread' },
      { id: 'c', label: 'Making yoghurt from milk' },
      { id: 'd', label: 'Causing ringworm' },
    ],
    correctOptionId: 'c',
    answer: 'Making yoghurt from milk',
    explanation: 'Tuberculosis and ringworm are diseases, and spoiling food wastes it. Turning milk into yoghurt is a useful process that people rely on micro-organisms for.',
    memo: [{ code: 'A', marks: 2, text: 'C: making yoghurt' }],
  },
  {
    ...microbes,
    id: 'ls5-11-decomposers-nutrient-cycle',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why micro-organisms that break down dead plants and animals are beneficial to the cycling of nutrients in an ecosystem.',
    answer:
      'Decomposers break down dead plants, animals and wastes. This releases the nutrients locked up in them, such as nitrogen and phosphorus compounds, back into the soil. Plants absorb these nutrients again, so without decomposers the nutrients would stay locked in dead matter and plants would run short of them.',
    explanation: 'The amount of each element on Earth is fixed, so it must be recycled rather than used up.',
    memo: [
      { code: 'A', marks: 1, text: 'Break down dead organisms and wastes' },
      { code: 'A', marks: 1, text: 'Release nutrients back into the soil' },
      { code: 'A', marks: 1, text: 'So plants can absorb and reuse them' },
    ],
  },
  {
    ...microbes,
    id: 'ls5-11-antibiotics-flu',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'A patient with influenza (flu) asks a doctor for antibiotics. Explain why the doctor refuses.',
    answer:
      'Influenza is caused by a virus. Antibiotics act on structures and processes found only in bacteria, such as their cell walls, and a virus has none of these, so antibiotics cannot kill it. Using them unnecessarily also helps resistance to spread.',
    explanation: 'Viral diseases are prevented with vaccines and treated by relieving symptoms or with antiviral drugs.',
    memo: [
      { code: 'A', marks: 1, text: 'Flu is caused by a virus' },
      { code: 'A', marks: 1, text: 'Antibiotics only work against bacteria' },
    ],
  },
  {
    ...microbes,
    id: 'ls5-11-legume-nitrogen-fixing',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt:
      'A farmer grows beans in a field before planting maize there the next season. Explain how nitrogen-fixing micro-organisms in the root nodules of the beans benefit the maize.',
    answer:
      'The nitrogen-fixing micro-organisms in the bean root nodules convert nitrogen gas from the air into nitrogen compounds. When the bean plants die and decompose, these compounds are released into the soil. The maize absorbs them and uses them to make proteins, so it grows better with less fertiliser.',
    explanation: 'This is the reasoning behind crop rotation with legumes.',
    memo: [
      { code: 'A', marks: 1, text: 'Convert atmospheric nitrogen into nitrogen compounds' },
      { code: 'A', marks: 1, text: 'Compounds added to the soil when the beans die/decompose' },
      { code: 'A', marks: 1, text: 'Maize uses them for protein, so grows better/needs less fertiliser' },
    ],
  },
)

/* ===================================================================== */
/* Photosynthesis, Grade 11: the light phase                              */
/* ===================================================================== */

const photo = { topicId: 'life-sci-photosynthesis', grade: 11 } as const

{
  const water = 1200
  const oxygen = water / 2
  const hydrogen = water * 2
  out.push({
    ...photo,
    id: 'ls5-11-photolysis-counts',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `In photolysis, 2 H₂O → 4 H + O₂. During the light phase, a sample of algae splits ${n(water, 0)} water molecules. Calculate how many oxygen molecules are released and how many hydrogen atoms are passed to the Calvin cycle.`,
    answer: `Every 2 water molecules give 1 O₂, so ${n(water, 0)} ÷ 2 = ${n(oxygen, 0)} oxygen molecules. Every water molecule gives 2 H, so ${n(water, 0)} × 2 = ${n(hydrogen, 0)} hydrogen atoms.`,
    explanation: 'Read the ratios straight off the equation: 2 water to 1 oxygen, and 2 water to 4 hydrogen.',
    memo: [
      { code: 'M', marks: 1, text: `${n(water, 0)} ÷ 2` },
      { code: 'CA', marks: 1, text: `${n(oxygen, 0)} O₂` },
      { code: 'CA', marks: 1, text: `${n(hydrogen, 0)} H atoms` },
    ],
  })
}

out.push(
  {
    ...photo,
    id: 'ls5-11-light-phase-byproduct-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which gas is released as a by-product of the light phase?',
    options: [
      { id: 'a', label: 'Carbon dioxide' },
      { id: 'b', label: 'Oxygen' },
      { id: 'c', label: 'Nitrogen' },
      { id: 'd', label: 'Hydrogen' },
    ],
    correctOptionId: 'b',
    answer: 'Oxygen',
    explanation: 'Water is split in the light phase; its hydrogen is kept for making glucose and its oxygen is released.',
    memo: [{ code: 'A', marks: 2, text: 'B: oxygen' }],
  },
  {
    ...photo,
    id: 'ls5-11-photolysis-describe',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Describe what happens during photolysis in the light phase.',
    answer:
      'Light energy absorbed by chlorophyll is used to split water molecules into hydrogen and oxygen. The oxygen is released as a by-product, and the hydrogen is carried to the dark phase to be used in making glucose.',
    explanation: '“Photo” means light and “lysis” means splitting: photolysis is the splitting of water by light energy.',
    memo: [
      { code: 'A', marks: 1, text: 'Light energy splits water' },
      { code: 'A', marks: 1, text: 'Into hydrogen and oxygen; oxygen released' },
      { code: 'A', marks: 1, text: 'Hydrogen carried to the dark phase' },
    ],
  },
  {
    ...photo,
    id: 'ls5-11-light-phase-to-calvin',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Name the TWO products of the light phase that are passed on to the Calvin cycle, and state the role of each there.',
    answer:
      'ATP, which provides the energy for the reactions that build glucose. Hydrogen (carried by NADP as NADPH), which is used to reduce carbon dioxide to form glucose.',
    explanation: 'This is why the dark phase stops soon after the light is switched off: it runs out of ATP and hydrogen.',
    memo: [
      { code: 'A', marks: 1, text: 'ATP' },
      { code: 'A', marks: 1, text: 'Provides energy' },
      { code: 'A', marks: 1, text: 'Hydrogen / NADPH' },
      { code: 'A', marks: 1, text: 'Reduces carbon dioxide to glucose' },
    ],
  },
  {
    ...photo,
    id: 'ls5-11-heavy-oxygen-source',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt:
      'Scientists gave a plant water made with a heavy form of oxygen (¹⁸O) and ordinary carbon dioxide. The oxygen gas the plant released contained ¹⁸O. Explain what this shows about the light phase.',
    answer:
      'The heavy oxygen could only have come from the water, so the oxygen released in photosynthesis comes from water, not from carbon dioxide. This shows that water is split in the light phase (photolysis) and its oxygen is given off.',
    explanation: 'A labelled atom is a tracer: wherever it turns up shows where that atom went.',
    memo: [
      { code: 'A', marks: 1, text: 'The ¹⁸O came from the water' },
      { code: 'A', marks: 1, text: 'So released oxygen comes from water, not carbon dioxide' },
      { code: 'A', marks: 1, text: 'Water is split in the light phase (photolysis)' },
    ],
  },
  {
    ...photo,
    id: 'ls5-11-herbicide-light-dependent',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt:
      'A herbicide blocks the light-dependent reactions. Predict and explain the effect on glucose production in a sprayed plant, even though carbon dioxide is still available.',
    answer:
      'Glucose production stops. With the light-dependent reactions blocked, no ATP is made and no hydrogen is released from water. The Calvin cycle needs ATP for energy and hydrogen to reduce carbon dioxide, so even with plenty of carbon dioxide it cannot make glucose, and the plant eventually dies from lack of food.',
    explanation: 'The two phases are linked: the dark phase depends entirely on the products of the light phase.',
    memo: [
      { code: 'A', marks: 1, text: 'Glucose production stops' },
      { code: 'A', marks: 1, text: 'No ATP produced' },
      { code: 'A', marks: 1, text: 'No hydrogen from photolysis' },
      { code: 'A', marks: 1, text: 'Calvin cycle needs both to reduce carbon dioxide' },
    ],
  },
)

/* ===================================================================== */
/* Photosynthesis, Grade 11: limiting factors                             */
/* ===================================================================== */

{
  const trials = [18, 21, 24]
  const mean = trials.reduce((a, b) => a + b, 0) / trials.length
  out.push({
    ...photo,
    id: 'ls5-11-pondweed-mean-bubbles',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A pondweed was placed 10 cm from a lamp and the bubbles per minute were counted three times: ${trials.join(', ')}. Calculate the mean, and explain why counting bubbles is used to measure the rate of photosynthesis.`,
    answer: `(${trials.join(' + ')}) ÷ ${trials.length} = ${n(mean)} bubbles per minute. The bubbles are oxygen, which is produced by photosynthesis, so the faster the bubbles form, the faster the rate of photosynthesis.`,
    explanation: 'Repeating the count and taking a mean makes the result more reliable. Counting bubbles is a rough measure because bubbles can differ in size.',
    memo: [
      { code: 'M', marks: 1, text: `(${trials.join(' + ')}) ÷ ${trials.length}` },
      { code: 'CA', marks: 1, text: `${n(mean)} bubbles per minute` },
      { code: 'A', marks: 1, text: 'Bubbles are oxygen from photosynthesis' },
      { code: 'A', marks: 1, text: 'More bubbles per minute means a faster rate' },
    ],
  })
}

{
  const light = [1, 2, 3, 4, 5]
  const low = [10, 20, 26, 27, 27]
  const high = [10, 20, 30, 38, 40]
  out.push({
    ...photo,
    id: 'ls5-11-co2-light-table',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt:
      'Use the data to identify the limiting factor at light intensity 1 and at light intensity 5 for the plants at 0,04% carbon dioxide. Explain your answers using the data.',
    context: `The table shows the rate of photosynthesis (arbitrary units) at different light intensities.\n|+ TABLE: RATE OF PHOTOSYNTHESIS\n| Light intensity | At 0,04% carbon dioxide | At 0,1% carbon dioxide |\n|---|---|---|\n${light.map((l, i) => `| ${l} | ${low[i]} | ${high[i]} |`).join('\n')}`,
    answer: `At light intensity 1, light intensity is the limiting factor: both groups have the same rate (${low[0]}), so extra carbon dioxide makes no difference, while raising the light intensity raises the rate. At light intensity 5, carbon dioxide is the limiting factor: at 0,04% the rate has levelled off at ${low[4]}, so more light no longer helps, but the plants at 0,1% carbon dioxide reach ${high[4]} at the same light intensity.`,
    explanation: 'A factor is limiting when increasing it increases the rate. Where a curve levels off, look for which OTHER factor would raise it.',
    memo: [
      { code: 'A', marks: 1, text: 'At 1: light intensity' },
      { code: 'R', marks: 1, text: 'Same rate at both carbon dioxide levels / rate rises with more light' },
      { code: 'A', marks: 1, text: 'At 5: carbon dioxide' },
      { code: 'R', marks: 1, text: `Rate levels off at ${low[4]} at 0,04%` },
      { code: 'R', marks: 1, text: `Rate higher (${high[4]}) at 0,1% at the same light intensity` },
    ],
  })
}

out.push(
  {
    ...photo,
    id: 'ls5-11-low-light-limit-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'On a dull, cloudy morning with plenty of water and carbon dioxide, which factor is most likely to limit the rate of photosynthesis?',
    options: [
      { id: 'a', label: 'Light intensity' },
      { id: 'b', label: 'Carbon dioxide concentration' },
      { id: 'c', label: 'Water supply' },
      { id: 'd', label: 'Oxygen concentration' },
    ],
    correctOptionId: 'a',
    answer: 'Light intensity',
    explanation: 'The factor in shortest supply limits the rate. With water and carbon dioxide plentiful, the dim light is what holds photosynthesis back.',
    memo: [{ code: 'A', marks: 2, text: 'A: light intensity' }],
  },
  {
    ...photo,
    id: 'ls5-11-levels-off-high-light',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why the rate of photosynthesis levels off when the light intensity is increased beyond a certain point.',
    answer:
      'Beyond that point light is no longer the limiting factor: there is more light than the plant can use. Another factor, such as the carbon dioxide concentration or the temperature, is now in short supply and limits the rate.',
    explanation: 'The level part of the curve is called the plateau; to raise it you must increase whichever factor is now limiting.',
    memo: [
      { code: 'A', marks: 1, text: 'Light is no longer the limiting factor' },
      { code: 'A', marks: 1, text: 'Another factor (carbon dioxide/temperature) now limits the rate' },
    ],
  },
  {
    ...photo,
    id: 'ls5-11-very-high-temperature',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why a very high temperature lowers the rate of photosynthesis.',
    answer:
      'The reactions of photosynthesis are controlled by enzymes. At very high temperatures the enzymes are denatured: their active sites change shape so they can no longer bind their substrates. Fewer reactions take place, so the rate falls.',
    explanation: 'Up to the optimum temperature, warmth speeds the enzymes up; beyond it, denaturing takes over.',
    memo: [
      { code: 'A', marks: 1, text: 'Photosynthesis is controlled by enzymes' },
      { code: 'A', marks: 1, text: 'Enzymes are denatured at high temperatures' },
      { code: 'A', marks: 1, text: 'So fewer reactions: the rate falls' },
    ],
  },
  {
    ...photo,
    id: 'ls5-11-greenhouse-paraffin-heater',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'In winter a farmer burns a paraffin heater inside a tomato greenhouse. Use the idea of limiting factors to explain how this can increase the yield.',
    answer:
      'Burning paraffin releases heat and carbon dioxide. In winter both the low temperature and the low carbon dioxide concentration limit the rate of photosynthesis. Raising both lets the plants photosynthesise faster, so they make more glucose and produce a bigger crop.',
    explanation: 'Growers aim to raise whichever factor is limiting, because raising any other factor has no effect.',
    memo: [
      { code: 'A', marks: 1, text: 'Heater releases heat' },
      { code: 'A', marks: 1, text: 'And carbon dioxide' },
      { code: 'A', marks: 1, text: 'Temperature and carbon dioxide are limiting in winter' },
      { code: 'A', marks: 1, text: 'Faster photosynthesis: more glucose, bigger yield' },
    ],
  },
)

/* ===================================================================== */
/* Genetics, Grade 12: dihybrid crosses and pedigrees                     */
/* ===================================================================== */

const genetics = { topicId: 'life-sci-genetics', grade: 12 } as const

{
  const total = 640
  const bothRecessive = total / 16
  const bothDominant = (total * 9) / 16
  out.push({
    ...genetics,
    id: 'ls5-12-dihybrid-640-offspring',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `In a dihybrid cross RrYy × RrYy between pea plants (R: round seeds, r: wrinkled; Y: yellow, y: green), ${total} offspring were produced. Calculate how many are expected to have wrinkled green seeds and how many round yellow seeds.`,
    answer: `The expected ratio is 9 round yellow : 3 round green : 3 wrinkled yellow : 1 wrinkled green. Wrinkled green: 1/16 × ${total} = ${bothRecessive}. Round yellow: 9/16 × ${total} = ${bothDominant}.`,
    explanation: 'A cross between two double heterozygotes always gives 16 equally likely combinations, so divide the total by 16 and multiply by each part of the 9 : 3 : 3 : 1 ratio.',
    memo: [
      { code: 'A', marks: 1, text: '9 : 3 : 3 : 1' },
      { code: 'M', marks: 1, text: `1/16 × ${total}` },
      { code: 'CA', marks: 1, text: `${bothRecessive} wrinkled green` },
      { code: 'CA', marks: 1, text: `${bothDominant} round yellow` },
    ],
  })
}

out.push(
  {
    ...genetics,
    id: 'ls5-12-dihybrid-ratio-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'In a dihybrid cross between two organisms heterozygous for both genes, which phenotypic ratio is expected?',
    options: [
      { id: 'a', label: '3 : 1' },
      { id: 'b', label: '1 : 2 : 1' },
      { id: 'c', label: '9 : 3 : 3 : 1' },
      { id: 'd', label: '1 : 1 : 1 : 1' },
    ],
    correctOptionId: 'c',
    answer: '9 : 3 : 3 : 1',
    explanation: '3 : 1 and 1 : 2 : 1 belong to monohybrid crosses; 1 : 1 : 1 : 1 is the dihybrid test cross.',
    memo: [{ code: 'A', marks: 2, text: 'C: 9 : 3 : 3 : 1' }],
  },
  {
    ...genetics,
    id: 'ls5-12-dihybrid-four-gametes',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'In a dihybrid cross, list the FOUR types of gametes a plant with genotype RrYy can produce, and name the process that makes all four possible.',
    answer: 'RY, Ry, rY and ry. They are possible because of independent assortment (random arrangement of the chromosome pairs) during meiosis.',
    explanation: 'Each gamete gets one allele of each gene. Pair each allele of the first gene with each allele of the second: 2 × 2 = 4 combinations.',
    memo: [
      { code: 'A', marks: 1, text: 'RY and Ry' },
      { code: 'A', marks: 1, text: 'rY and ry' },
      { code: 'A', marks: 1, text: 'Independent assortment in meiosis' },
    ],
  },
  {
    ...genetics,
    id: 'ls5-12-pedigree-unaffected-parents',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'In a pedigree, two unaffected parents have an affected child. Explain what this tells you about the allele for the condition and about the parents.',
    answer:
      'The allele for the condition must be recessive: the child shows it, but neither parent does. The child must have received one recessive allele from each parent, so both parents are heterozygous carriers.',
    explanation: 'A dominant condition cannot skip a generation like this: an affected child of a dominant condition must have at least one affected parent.',
    memo: [
      { code: 'A', marks: 1, text: 'The allele is recessive' },
      { code: 'A', marks: 1, text: 'The child inherited one recessive allele from each parent' },
      { code: 'A', marks: 1, text: 'Both parents are heterozygous' },
    ],
  },
  {
    ...genetics,
    id: 'ls5-12-dihybrid-test-cross',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'In guinea pigs, black fur (B) is dominant to white (b) and rough fur (R) is dominant to smooth (r). A dihybrid test cross is made between a BbRr guinea pig and a bbrr guinea pig. Give the genotypes of the offspring and the expected phenotypic ratio.',
    answer:
      'The BbRr parent makes four gametes (BR, Br, bR, br); the bbrr parent makes only br. Offspring: BbRr (black rough), Bbrr (black smooth), bbRr (white rough), bbrr (white smooth), in a ratio of 1 : 1 : 1 : 1.',
    explanation: 'Because the test-cross parent only gives recessive alleles, each offspring’s phenotype shows exactly which gamete it got from the other parent.',
    memo: [
      { code: 'A', marks: 1, text: 'Gametes BR, Br, bR, br × br' },
      { code: 'A', marks: 1, text: 'Genotypes BbRr, Bbrr, bbRr, bbrr' },
      { code: 'A', marks: 1, text: 'Phenotypes: black rough, black smooth, white rough, white smooth' },
      { code: 'A', marks: 1, text: '1 : 1 : 1 : 1' },
    ],
  },
  {
    ...genetics,
    id: 'ls5-12-pedigree-family-probability',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt:
      'Use the pedigree to decide whether the condition is caused by a dominant or a recessive allele, give the genotypes of Thabo and Lindiwe (use A and a), and calculate the probability that their next child will be affected.',
    context:
      'Generation I: Thabo (unaffected male) and Lindiwe (unaffected female).\nGeneration II, their children: Sipho (affected male), Ayanda (unaffected female), Lerato (unaffected female).',
    answer:
      'Recessive: Thabo and Lindiwe are both unaffected, yet their son Sipho is affected. Sipho is aa, so he received an a from each parent; both parents are unaffected, so each must be Aa. Aa × Aa gives AA : Aa : aa in the ratio 1 : 2 : 1, so the probability of an affected (aa) child is 1/4 = 25%.',
    explanation: 'Each child is a separate event: having one affected child does not change the chance for the next.',
    memo: [
      { code: 'A', marks: 1, text: 'Recessive' },
      { code: 'R', marks: 1, text: 'Unaffected parents have an affected child' },
      { code: 'A', marks: 1, text: 'Thabo Aa and Lindiwe Aa' },
      { code: 'M', marks: 1, text: 'Aa × Aa cross shown' },
      { code: 'CA', marks: 1, text: '1/4 / 25%' },
    ],
  },
)

/* ===================================================================== */
/* Plant responses, Grade 12: why tropisms matter                         */
/* ===================================================================== */

const plants = { topicId: 'life-sci-response-plants', grade: 12 } as const

{
  const [bent, clipped] = [2.4, 1.6]
  const more = ((bent - clipped) / clipped) * 100
  out.push({
    ...plants,
    id: 'ls5-12-phototropism-dry-mass',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt:
      'Calculate the percentage by which the mean dry mass of group A is greater than that of group B, and explain what the results show about the adaptive significance of phototropism.',
    context: `Seedlings were grown for three weeks with light from one side only.\nGroup A: shoots free to bend towards the light — mean dry mass ${n(bent)} g.\nGroup B: shoots held upright by a clip so they could not bend — mean dry mass ${n(clipped)} g.`,
    answer: `(${n(bent)} − ${n(clipped)}) ÷ ${n(clipped)} × 100 = ${n(more, 0)}%. The seedlings that could bend towards the light gained more dry mass, which means they made more food. Phototropism places the leaves where they receive the most light, so the plant photosynthesises more and grows better: this is its adaptive significance.`,
    explanation: 'Dry mass measures the material the plant has built from the glucose it made, so it is a fair measure of photosynthesis over the three weeks.',
    memo: [
      { code: 'M', marks: 1, text: `(${n(bent)} − ${n(clipped)}) ÷ ${n(clipped)} × 100` },
      { code: 'CA', marks: 1, text: `${n(more, 0)}%` },
      { code: 'A', marks: 1, text: 'Bending seedlings made more food / grew more' },
      { code: 'A', marks: 1, text: 'Phototropism places the leaves in the most light' },
      { code: 'A', marks: 1, text: 'More photosynthesis: better growth and survival' },
    ],
  })
}

out.push(
  {
    ...plants,
    id: 'ls5-12-positive-phototropism-advantage-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'What is the main survival advantage to the plant of shoots that grow towards light?',
    options: [
      { id: 'a', label: 'Better anchorage in the soil' },
      { id: 'b', label: 'More light for photosynthesis' },
      { id: 'c', label: 'Easier uptake of water' },
      { id: 'd', label: 'Protection from grazing animals' },
    ],
    correctOptionId: 'b',
    answer: 'More light for photosynthesis',
    explanation: 'Anchorage and water uptake are the benefits of root responses, not shoot responses.',
    memo: [{ code: 'A', marks: 2, text: 'B: more light for photosynthesis' }],
  },
  {
    ...plants,
    id: 'ls5-12-geotropism-roots-significance',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain the adaptive significance of positive geotropism in roots.',
    answer: 'Roots grow downwards, deep into the soil. This anchors the plant firmly and lets the roots reach water and dissolved mineral salts.',
    explanation: 'Positive geotropism means growing towards the pull of gravity.',
    memo: [
      { code: 'A', marks: 1, text: 'Anchors the plant' },
      { code: 'A', marks: 1, text: 'Reaches water and mineral salts' },
    ],
  },
  {
    ...plants,
    id: 'ls5-12-tendril-benefit',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'A climbing bean has tendrils that coil around a pole when they touch it. Explain the benefit to the plant of this response.',
    answer:
      'Coiling around a support (thigmotropism) lets the thin stem climb upwards. This lifts the leaves above other plants into the light for photosynthesis, without the plant having to spend energy and materials growing a thick, strong stem.',
    explanation: 'Climbers borrow the strength of other structures instead of building their own.',
    memo: [
      { code: 'A', marks: 1, text: 'Allows the plant to climb / holds it up' },
      { code: 'A', marks: 1, text: 'Leaves reach more light for photosynthesis' },
      { code: 'A', marks: 1, text: 'No need to build a thick stem: saves energy/materials' },
    ],
  },
  {
    ...plants,
    id: 'ls5-12-upside-down-seed',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'A seed germinates upside down in the soil. Explain the advantage to the seedling of its root turning to grow downwards and its shoot turning to grow upwards.',
    answer:
      'The root is positively geotropic, so it turns downwards into the soil, where it anchors the seedling and absorbs water and minerals. The shoot is negatively geotropic, so it turns upwards and breaks through the soil surface, where its leaves can reach light and start photosynthesising before the food store in the seed runs out.',
    explanation: 'Gravity is a reliable cue underground, where there is no light to guide the shoot.',
    memo: [
      { code: 'A', marks: 1, text: 'Root grows down: positive geotropism' },
      { code: 'A', marks: 1, text: 'Anchorage and water/mineral uptake' },
      { code: 'A', marks: 1, text: 'Shoot grows up: negative geotropism' },
      { code: 'A', marks: 1, text: 'Reaches light to photosynthesise before the seed’s food runs out' },
    ],
  },
  {
    ...plants,
    id: 'ls5-12-roots-leaking-pipe',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt:
      'Roots of a tree near a leaking water pipe grow towards the leak and into the pipe. Name the response, explain the advantage to the plant, and give ONE problem it causes for people.',
    answer:
      'Positive hydrotropism. Growing towards water gives the tree a steady water supply for photosynthesis and transpiration, especially in dry weather. The roots can block or crack the pipe, causing more leaks and costly repairs.',
    explanation: 'A response that helps the plant survive is not necessarily convenient for people living nearby.',
    memo: [
      { code: 'A', marks: 1, text: 'Positive hydrotropism' },
      { code: 'A', marks: 1, text: 'Steady water supply for the tree' },
      { code: 'A', marks: 1, text: 'Roots block/crack the pipe' },
    ],
  },
)

/* ===================================================================== */
/* Human responses, Grade 12: key terms                                   */
/* ===================================================================== */

const humans = { topicId: 'life-sci-response-humans', grade: 12 } as const

{
  const drops = [18, 15, 12]
  const meanCm = drops.reduce((a, b) => a + b, 0) / drops.length
  const t = Math.sqrt((2 * (meanCm / 100)) / 9.8)
  out.push({
    ...humans,
    id: 'ls5-12-ruler-drop-response-time',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt: `In a ruler-drop test, a learner caught a falling ruler after it had dropped ${drops.join(' cm, ')} cm in three tries. Calculate the mean distance, then her mean response time using t = √(2d ÷ 9,8) with d in metres. Suggest why her response improved with each try.`,
    answer: `Mean distance = (${drops.join(' + ')}) ÷ ${drops.length} = ${n(meanCm)} cm = ${n(meanCm / 100, 2)} m. t = √(2 × ${n(meanCm / 100, 2)} ÷ 9,8) = ${n(t, 2)} s. Catching the ruler is a voluntary response; with practice she learned what to expect, so she could respond to the stimulus faster.`,
    explanation: 'Distances must be in metres before using the formula. A falling distance that gets shorter means a faster response.',
    memo: [
      { code: 'M', marks: 1, text: `(${drops.join(' + ')}) ÷ ${drops.length} = ${n(meanCm)} cm` },
      { code: 'A', marks: 1, text: `${n(meanCm / 100, 2)} m` },
      { code: 'M', marks: 1, text: `√(2 × ${n(meanCm / 100, 2)} ÷ 9,8)` },
      { code: 'CA', marks: 1, text: `${n(t, 2)} s` },
      { code: 'A', marks: 1, text: 'Voluntary response improves with practice / she learned what to expect' },
    ],
  })
}

out.push(
  {
    ...humans,
    id: 'ls5-12-stimulus-meaning-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'What is meant by a stimulus?',
    options: [
      { id: 'a', label: 'A change in the environment that an organism can detect' },
      { id: 'b', label: 'The reaction of an organism to a change' },
      { id: 'c', label: 'A message carried along a nerve' },
      { id: 'd', label: 'A chemical released into the blood' },
    ],
    correctOptionId: 'a',
    answer: 'A change in the environment that an organism can detect',
    explanation: 'The reaction to the change is the response; a message along a nerve is an impulse; a chemical in the blood is a hormone.',
    memo: [{ code: 'A', marks: 2, text: 'A: a detectable change in the environment' }],
  },
  {
    ...humans,
    id: 'ls5-12-voluntary-involuntary-examples',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Distinguish between a voluntary action and an involuntary action, and give ONE example of each.',
    answer:
      'A voluntary action is under conscious control and is decided on by the cerebrum, for example writing your name. An involuntary action happens automatically without conscious thought, for example blinking when something comes close to your face or the heart beating.',
    explanation: 'Some actions, such as breathing, can be either: you breathe without thinking, but you can also choose to hold your breath.',
    memo: [
      { code: 'A', marks: 1, text: 'Voluntary: under conscious control' },
      { code: 'A', marks: 1, text: 'Example of a voluntary action' },
      { code: 'A', marks: 1, text: 'Involuntary: automatic, without conscious thought' },
      { code: 'A', marks: 1, text: 'Example of an involuntary action' },
    ],
  },
  {
    ...humans,
    id: 'ls5-12-central-peripheral',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Distinguish between the central nervous system and the peripheral nervous system.',
    answer:
      'The central nervous system is made up of the brain and the spinal cord, and it processes information and coordinates responses. The peripheral nervous system is made up of all the nerves outside the brain and spinal cord, which connect the central nervous system to the rest of the body.',
    explanation: 'The peripheral system carries messages in from the sense organs and out to the muscles and glands; the central system decides what to do.',
    memo: [
      { code: 'A', marks: 1, text: 'CNS: brain and spinal cord' },
      { code: 'A', marks: 1, text: 'CNS processes information / coordinates' },
      { code: 'A', marks: 1, text: 'PNS: nerves outside the CNS, linking it to the body' },
    ],
  },
  {
    ...humans,
    id: 'ls5-12-name-called-stimulus',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'In a noisy classroom, a learner hears her name called from behind and turns around. Identify the stimulus and the response, and state whether the response is voluntary or involuntary.',
    answer:
      'The stimulus is the sound of her name being called. The response is turning around. The response is voluntary: she consciously decides to turn, and could choose not to.',
    explanation: 'Ask “what changed?” for the stimulus, and “what did she do about it?” for the response.',
    memo: [
      { code: 'A', marks: 1, text: 'Stimulus: the sound of her name' },
      { code: 'A', marks: 1, text: 'Response: turning around' },
      { code: 'A', marks: 1, text: 'Voluntary: a conscious decision' },
    ],
  },
  {
    ...humans,
    id: 'ls5-12-hot-plate-vs-pen',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'Explain why pulling your hand away from a hot plate is described as an involuntary response, while picking up a pen is a voluntary response. Suggest why the first kind of response is useful.',
    answer:
      'Pulling away from the hot plate happens automatically and very fast, before you are aware of the pain, and the cerebrum does not decide it, so it is involuntary. Picking up a pen is a conscious decision made by the cerebrum, so it is voluntary. The involuntary response is useful because it is so fast that it limits damage to the body.',
    explanation: 'Speed is the point of an involuntary protective response: thinking would take too long.',
    memo: [
      { code: 'A', marks: 1, text: 'Hot plate: automatic, without conscious thought' },
      { code: 'A', marks: 1, text: 'Pen: conscious decision of the cerebrum' },
      { code: 'A', marks: 1, text: 'Involuntary response is very fast' },
      { code: 'A', marks: 1, text: 'Protects the body from damage' },
    ],
  },
)

/* ===================================================================== */
/* Animal nutrition, Grade 11: enzymes and their products                 */
/* ===================================================================== */

const nutrition = { topicId: 'life-sci-animal-nutrition', grade: 11 } as const

{
  const [warmMin, coolMin] = [6, 15]
  const times = coolMin / warmMin
  out.push({
    ...nutrition,
    id: 'ls5-11-amylase-temperature-times',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Amylase took ${warmMin} minutes to digest all the starch in a test tube at 37 °C, and ${coolMin} minutes at 20 °C. Calculate how many times faster the amylase worked at 37 °C, and explain the difference.`,
    answer: `${coolMin} ÷ ${warmMin} = ${n(times)} times faster. 37 °C is close to the optimum temperature for human amylase. At 20 °C the enzyme and starch molecules move more slowly and collide less often, so fewer starch molecules are broken down to maltose each minute.`,
    explanation: 'The shorter the time, the faster the rate: rate is proportional to 1 ÷ time, so the ratio of the times gives the ratio of the rates.',
    memo: [
      { code: 'M', marks: 1, text: `${coolMin} ÷ ${warmMin}` },
      { code: 'CA', marks: 1, text: `${n(times)} times` },
      { code: 'A', marks: 1, text: '37 °C is near the optimum' },
      { code: 'A', marks: 1, text: 'At 20 °C fewer collisions / slower molecules' },
    ],
  })
}

out.push(
  {
    ...nutrition,
    id: 'ls5-11-maltose-glucose-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which enzyme breaks maltose down into glucose?',
    options: [
      { id: 'a', label: 'Amylase' },
      { id: 'b', label: 'Maltase' },
      { id: 'c', label: 'Lipase' },
      { id: 'd', label: 'Pepsin' },
    ],
    correctOptionId: 'b',
    answer: 'Maltase',
    explanation: 'Amylase turns starch into maltose; maltase finishes the job by turning maltose into glucose.',
    memo: [{ code: 'A', marks: 2, text: 'B: maltase' }],
  },
  {
    ...nutrition,
    id: 'ls5-11-lipase-substrate-products',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'State the substrate of lipase, the products it forms, and where in the alimentary canal it acts.',
    answer: 'Lipase acts on lipids (fats and oils) and breaks them down into fatty acids and glycerol. It acts in the small intestine (duodenum).',
    explanation: 'Bile emulsifies the fats first, giving lipase a much larger surface to work on.',
    memo: [
      { code: 'A', marks: 1, text: 'Substrate: lipids' },
      { code: 'A', marks: 1, text: 'Products: fatty acids and glycerol' },
      { code: 'A', marks: 1, text: 'Small intestine / duodenum' },
    ],
  },
  {
    ...nutrition,
    id: 'ls5-11-pepsin-stops-duodenum',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why pepsin digests protein in the stomach but stops working when it reaches the duodenum.',
    answer:
      'Pepsin works best in acid conditions, about pH 2, which the hydrochloric acid in the stomach provides. In the duodenum the pH is about 8 (alkaline), because bile and pancreatic juice neutralise the acid, so pepsin’s active site changes shape and it stops working.',
    explanation: 'Each enzyme has an optimum pH; far from it, the enzyme is denatured or inactive.',
    memo: [
      { code: 'A', marks: 1, text: 'Pepsin works best in acid (about pH 2)' },
      { code: 'A', marks: 1, text: 'The duodenum is alkaline (about pH 8)' },
      { code: 'A', marks: 1, text: 'Pepsin is denatured / inactive there' },
    ],
  },
  {
    ...nutrition,
    id: 'ls5-11-pancreas-lipase-trypsin-shortage',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'A person’s pancreas produces too little lipase and trypsin. Predict TWO effects on digestion, and explain each.',
    answer:
      'Fats will not be fully digested, because too little lipase is available to break lipids into fatty acids and glycerol; undigested fat passes out in the faeces. Proteins will not be fully digested, because too little trypsin is available to break them into peptides; fewer amino acids are absorbed, so the person may lack the building blocks for growth and repair.',
    explanation: 'Pepsin in the stomach starts protein digestion, but most protein digestion happens in the small intestine.',
    memo: [
      { code: 'A', marks: 1, text: 'Fats not fully digested' },
      { code: 'A', marks: 1, text: 'Too little lipase to form fatty acids and glycerol' },
      { code: 'A', marks: 1, text: 'Proteins not fully digested' },
      { code: 'A', marks: 1, text: 'Too little trypsin: fewer amino acids absorbed' },
    ],
  },
  {
    ...nutrition,
    id: 'ls5-11-pepsin-trypsin-unnecessary',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'A learner claims that pepsin and trypsin do the same job, so the body does not need both. Evaluate this claim.',
    answer:
      'The claim is partly true: both enzymes break proteins down into peptides. But both are needed because they work in different places with different pH: pepsin in the acid stomach (pH about 2) and trypsin in the alkaline small intestine (pH about 8). Pepsin cannot work in the small intestine and trypsin cannot work in the stomach, so together they keep protein digestion going along the canal. The claim is therefore not valid.',
    explanation: 'Two enzymes with the same substrate can still both be needed if they work under different conditions.',
    memo: [
      { code: 'A', marks: 1, text: 'Both digest proteins to peptides' },
      { code: 'A', marks: 1, text: 'Pepsin works in the acid stomach' },
      { code: 'A', marks: 1, text: 'Trypsin works in the alkaline small intestine' },
      { code: 'J', marks: 1, text: 'Each cannot work where the other does: claim not valid' },
    ],
  },
)

/* ===================================================================== */
/* Respiration, Grade 11: key terms                                       */
/* ===================================================================== */

const respiration = { topicId: 'life-sci-respiration', grade: 11 } as const

{
  const [atpPerGlucose, atpPerSecond] = [38, 1_900_000]
  const glucose = atpPerSecond / atpPerGlucose
  out.push({
    ...respiration,
    id: 'ls5-11-atp-glucose-per-second',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Cellular respiration of one glucose molecule, using oxygen, releases about ${atpPerGlucose} ATP. A working muscle cell uses ${n(atpPerSecond, 0)} ATP per second. Calculate how many glucose molecules it must respire each second, and state what the ATP is used for.`,
    answer: `${n(atpPerSecond, 0)} ÷ ${atpPerGlucose} = ${n(glucose, 0)} glucose molecules per second. The ATP supplies the energy for muscle contraction.`,
    explanation: 'ATP is the cell’s energy currency: respiration makes it, and work such as contraction, active transport and building molecules spends it.',
    memo: [
      { code: 'M', marks: 1, text: `${n(atpPerSecond, 0)} ÷ ${atpPerGlucose}` },
      { code: 'CA', marks: 1, text: `${n(glucose, 0)}` },
      { code: 'A', marks: 1, text: 'Energy for muscle contraction' },
    ],
  })
}

{
  const [rate, hours] = [0.4, 6]
  const total = rate * hours
  out.push({
    ...respiration,
    id: 'ls5-11-seeds-co2-control',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 5,
    prompt:
      'Calculate the total carbon dioxide the germinating seeds release in the time shown, explain why the boiled seeds were included, and state the conclusion about respiration.',
    context: `Carbon dioxide released, measured for ${hours} hours at 25 °C:\nGerminating seeds: ${n(rate)} cm³ per hour\nBoiled seeds (same mass): 0 cm³ per hour`,
    answer: `${n(rate)} × ${hours} = ${n(total)} cm³. The boiled seeds are the control: boiling kills them, so they show that the carbon dioxide comes from living seeds and not from something else in the apparatus. Conclusion: living (germinating) seeds carry out cellular respiration and release carbon dioxide.`,
    explanation: 'A control is identical except for the one factor being tested, here whether the seeds are alive.',
    memo: [
      { code: 'M', marks: 1, text: `${n(rate)} × ${hours}` },
      { code: 'CA', marks: 1, text: `${n(total)} cm³` },
      { code: 'A', marks: 1, text: 'Boiled seeds are the control / dead seeds' },
      { code: 'A', marks: 1, text: 'Show the carbon dioxide comes from living seeds' },
      { code: 'A', marks: 1, text: 'Germinating seeds respire and release carbon dioxide' },
    ],
  })
}

out.push(
  {
    ...respiration,
    id: 'ls5-11-cellular-respiration-meaning-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'What is meant by cellular respiration?',
    options: [
      { id: 'a', label: 'The movement of air into and out of the lungs' },
      { id: 'b', label: 'The controlled release of energy from glucose in living cells' },
      { id: 'c', label: 'The making of glucose using light energy' },
      { id: 'd', label: 'The exchange of gases across the alveoli' },
    ],
    correctOptionId: 'b',
    answer: 'The controlled release of energy from glucose in living cells',
    explanation: 'Option A is breathing, C is photosynthesis and D is gaseous exchange.',
    memo: [{ code: 'A', marks: 2, text: 'B' }],
  },
  {
    ...respiration,
    id: 'ls5-11-respiration-not-breathing',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why cellular respiration is not the same as breathing.',
    answer:
      'Breathing is the physical movement of air into and out of the lungs. Cellular respiration is a chemical process inside every living cell, in which glucose is broken down to release energy as ATP. Breathing supplies the oxygen that respiration uses and removes the carbon dioxide it produces, but it releases no energy itself.',
    explanation: 'Plants respire in every cell but do not breathe at all.',
    memo: [
      { code: 'A', marks: 1, text: 'Breathing: movement of air in and out of the lungs' },
      { code: 'A', marks: 1, text: 'Respiration: chemical breakdown of glucose in cells, releasing energy' },
      { code: 'A', marks: 1, text: 'Breathing supplies oxygen / removes carbon dioxide for respiration' },
    ],
  },
  {
    ...respiration,
    id: 'ls5-11-respiration-word-equation-oxygen',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Write the word equation for cellular respiration that uses oxygen.',
    answer: 'Glucose + oxygen → carbon dioxide + water + energy (ATP).',
    explanation: 'Compare it with the photosynthesis equation: the reactants and products swap sides.',
    memo: [
      { code: 'A', marks: 1, text: 'Glucose + oxygen' },
      { code: 'A', marks: 1, text: 'Carbon dioxide + water' },
      { code: 'A', marks: 1, text: 'Energy / ATP' },
    ],
  },
  {
    ...respiration,
    id: 'ls5-11-germinating-seeds-heat',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A flask of germinating seeds becomes warmer than a flask of dead seeds. Use the term cellular respiration to explain this.',
    answer:
      'The germinating seeds are alive and carry out cellular respiration rapidly to supply the energy for growth. Not all the energy released from glucose is captured as ATP; some is lost as heat, which warms the flask. Dead seeds do not respire, so they release no heat.',
    explanation: 'No energy conversion is 100% efficient: some energy always escapes as heat.',
    memo: [
      { code: 'A', marks: 1, text: 'Germinating seeds respire (for growth)' },
      { code: 'A', marks: 1, text: 'Some energy is released as heat' },
      { code: 'A', marks: 1, text: 'Dead seeds do not respire: no heat' },
    ],
  },
)

/* ===================================================================== */
/* Population ecology, Grade 11: sampling and interactions                */
/* ===================================================================== */

const population = { topicId: 'life-sci-population-ecology', grade: 11 } as const

{
  const [marked, secondCatch, recaptured] = [60, 50, 12]
  const estimate = (marked * secondCatch) / recaptured
  out.push({
    ...population,
    id: 'ls5-11-mark-recapture-lizards',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `To estimate a population of lizards using mark-recapture, ${marked} lizards were caught, marked and released. A week later ${secondCatch} were caught, of which ${recaptured} were marked. Estimate the population size.`,
    answer: `Population = (first catch × second catch) ÷ number recaptured = (${marked} × ${secondCatch}) ÷ ${recaptured} = ${n(estimate, 0)} lizards.`,
    explanation: 'The fraction marked in the second catch is taken to equal the fraction marked in the whole population.',
    memo: [
      { code: 'M', marks: 1, text: 'Formula: (first × second) ÷ recaptured' },
      { code: 'M', marks: 1, text: `(${marked} × ${secondCatch}) ÷ ${recaptured}` },
      { code: 'CA', marks: 1, text: `${n(estimate, 0)}` },
    ],
  })
}

{
  const counts = [4, 7, 3, 6, 5]
  const area = 200
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length
  const estimate = mean * area
  out.push({
    ...population,
    id: 'ls5-11-quadrat-aloe-field',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Five 1 m² quadrats were placed at random in a ${area} m² field, and the aloe plants in each were counted: ${counts.join(', ')}. Estimate the number of aloes in the field, and give ONE way to make the estimate more reliable.`,
    answer: `Mean per quadrat = (${counts.join(' + ')}) ÷ ${counts.length} = ${n(mean)} per m². Estimate = ${n(mean)} × ${area} = ${n(estimate, 0)} aloes. Use more quadrats (or place them randomly over the whole field) so the sample better represents the field.`,
    explanation: 'Sampling assumes the quadrats are typical of the whole area, which is more likely the more of them there are.',
    memo: [
      { code: 'M', marks: 1, text: `(${counts.join(' + ')}) ÷ ${counts.length}` },
      { code: 'CA', marks: 1, text: `${n(mean)} per m²` },
      { code: 'CA', marks: 1, text: `${n(estimate, 0)} aloes` },
      { code: 'A', marks: 1, text: 'More quadrats / random placement' },
    ],
  })
}

out.push(
  {
    ...population,
    id: 'ls5-11-oxpecker-symbiosis-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Oxpeckers eat ticks off a buffalo’s skin: the birds get food and the buffalo is rid of parasites. Which type of symbiosis is this?',
    options: [
      { id: 'a', label: 'Parasitism' },
      { id: 'b', label: 'Commensalism' },
      { id: 'c', label: 'Mutualism' },
      { id: 'd', label: 'Competition' },
    ],
    correctOptionId: 'c',
    answer: 'Mutualism',
    explanation: 'Both species benefit, which is mutualism. In commensalism only one benefits and the other is unaffected.',
    memo: [{ code: 'A', marks: 2, text: 'C: mutualism' }],
  },
  {
    ...population,
    id: 'ls5-11-quadrat-method-describe',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Describe how quadrats are used to estimate the number of a plant species in a field.',
    answer:
      'Measure the area of the field. Place a quadrat of known area (for example 1 m²) at random positions in the field, and count the plants of that species inside it each time. Work out the mean number per quadrat, then multiply by the number of quadrats that would fit into the field (field area ÷ quadrat area).',
    explanation: 'Random placement avoids the bias of choosing spots where there happen to be many or few plants.',
    memo: [
      { code: 'A', marks: 1, text: 'Quadrats placed at random' },
      { code: 'A', marks: 1, text: 'Count the plants in each quadrat' },
      { code: 'A', marks: 1, text: 'Calculate the mean per quadrat' },
      { code: 'A', marks: 1, text: 'Multiply by field area ÷ quadrat area' },
    ],
  },
  {
    ...population,
    id: 'ls5-11-commensalism-vs-parasitism',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Distinguish between commensalism and parasitism, giving ONE example of each.',
    answer:
      'In commensalism one species benefits and the other is neither helped nor harmed, for example barnacles living on a whale’s skin. In parasitism one species (the parasite) benefits and the other (the host) is harmed, for example a tapeworm in a human’s intestine.',
    explanation: 'The test is what happens to the second species: unaffected means commensalism, harmed means parasitism.',
    memo: [
      { code: 'A', marks: 1, text: 'Commensalism: one benefits, the other unaffected' },
      { code: 'A', marks: 1, text: 'Example of commensalism' },
      { code: 'A', marks: 1, text: 'Parasitism: one benefits, the host is harmed' },
      { code: 'A', marks: 1, text: 'Example of parasitism' },
    ],
  },
  {
    ...population,
    id: 'ls5-11-mark-recapture-assumptions',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'State TWO assumptions of the mark-recapture method, and explain how breaking each one would make the estimate too high or too low.',
    answer:
      'The marks are not lost and do not harm the animal: if marks rub off, fewer marked animals are recaptured, so the estimate is too high. Marked animals mix fully with the population before the second catch: if they stay close to where they were released, more of them are recaptured, so the estimate is too low. (Also accepted: no births, deaths or migration between the catches; marking does not make animals easier or harder to catch.)',
    explanation: 'The recaptured number is the divisor in the formula, so anything that lowers it raises the estimate, and anything that raises it lowers the estimate.',
    memo: [
      { code: 'A', marks: 1, text: 'Assumption 1 (e.g. marks not lost)' },
      { code: 'R', marks: 1, text: 'Effect explained (fewer recaptured: estimate too high)' },
      { code: 'A', marks: 1, text: 'Assumption 2 (e.g. marked animals mix fully)' },
      { code: 'R', marks: 1, text: 'Effect explained (more recaptured: estimate too low)' },
    ],
  },
)

export const lifeSciThin3Questions: Question[] = out
