/**
 * Life Sciences questions for the thinnest sub-topics -- the parts of a topic
 * a weekly test ran out of first, as the sub-topic coverage report counted
 * them before this file:
 *
 *   Excretion (Grade 11): excretory organs -- 1.
 *   Biodiversity in animals (Grade 11): structure and lifestyle -- 1.
 *   Biodiversity in plants (Grade 11): the four groups -- 2.
 *   Ecosystem energy flow (Grade 10): effects of change -- 2.
 *   Chemistry of life (Grade 10): organic compounds and food tests -- 3.
 *   Micro-organisms (Grade 11): roles of micro-organisms -- 4.
 *   Meiosis (Grade 12): meiosis II -- 4.
 *   Genetics (Grade 12): dihybrid crosses and pedigrees -- 4.
 *   Mitosis (Grade 10): cytokinesis and cancer -- 5.
 *
 * Where a question has numbers, they are computed from the values declared
 * with it, so the question, answer and memo cannot disagree.
 */
import type { Question } from '@/types'

const out: Question[] = []

/* ===================================================================== */
/* Excretion, Grade 11: excretory organs                                  */
/* ===================================================================== */

const excretion = { topicId: 'life-sci-excretion', grade: 11 } as const

out.push(
  {
    ...excretion,
    id: 'lsg-11-excretory-organ-each',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 3,
    prompt: 'Name the excretory organ that removes each of the following from the body: (a) carbon dioxide, (b) nitrogenous waste in urine, (c) water and salts in sweat.',
    answer: '(a) Lungs. (b) Kidneys. (c) Skin.',
    explanation:
      'Excretion is the removal of waste made by the body’s own metabolism, and four organs share the work: the lungs breathe out carbon dioxide and some water vapour, the kidneys make urine that carries urea, excess water and salts, the skin loses water, salts and a little urea in sweat, and the liver makes the urea in the first place.',
    memo: [
      { code: 'A', marks: 1, text: 'Lungs' },
      { code: 'A', marks: 1, text: 'Kidneys' },
      { code: 'A', marks: 1, text: 'Skin' },
    ],
  },
  {
    ...excretion,
    id: 'lsg-11-liver-deamination',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Explain why the liver is counted as an excretory organ even though no waste leaves the body through the liver itself.',
    answer:
      'Excess amino acids cannot be stored. In the liver the amino group is removed from each excess amino acid (deamination) and converted to urea. The urea is released into the blood and carried to the kidneys, which excrete it in urine. The liver therefore makes the waste product that the kidneys remove.',
    explanation:
      'Excretion includes making a waste product safe to remove, not only removing it. Ammonia from the amino groups is toxic, so the liver converts it to urea, which is far less toxic and can travel in the blood to the kidneys.',
    memo: [
      { code: 'A', marks: 1, text: 'Excess amino acids cannot be stored' },
      { code: 'A', marks: 1, text: 'Deamination: the amino group is removed in the liver' },
      { code: 'A', marks: 1, text: 'and converted to urea' },
      { code: 'R', marks: 1, text: 'Urea is carried in the blood to the kidneys and excreted in urine' },
    ],
  },
  {
    ...excretion,
    id: 'lsg-11-lungs-excretory',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'A learner says the lungs belong only to the breathing system and are not excretory organs. Explain why the lungs are also excretory organs.',
    answer:
      'Carbon dioxide (and some water vapour) is a waste product of cellular respiration in the body’s cells. The lungs remove this carbon dioxide from the body when we breathe out, so they excrete a metabolic waste.',
    explanation:
      'An organ is excretory if it removes a waste product of the body’s metabolism. Carbon dioxide is made by respiration inside cells, so removing it is excretion, even though the lungs are also used for gaseous exchange.',
    memo: [
      { code: 'A', marks: 1, text: 'Carbon dioxide is a waste product of cellular respiration' },
      { code: 'R', marks: 1, text: 'The lungs remove it from the body when exhaling' },
    ],
  },
  {
    ...excretion,
    id: 'lsg-11-lungs-skin-compare',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Compare the lungs and the skin as excretory organs: name the main waste each removes, and the process in body cells that produces the main waste of the lungs.',
    answer: 'The lungs remove carbon dioxide (and some water vapour). The skin removes water and salts (and a little urea) in sweat. The carbon dioxide is produced by cellular respiration.',
    explanation: 'Both organs have other jobs -- gaseous exchange and temperature control -- but each also removes a waste product of metabolism, which is what makes it excretory.',
    memo: [
      { code: 'A', marks: 1, text: 'Lungs: carbon dioxide' },
      { code: 'A', marks: 1, text: 'Skin: water and salts in sweat' },
      { code: 'A', marks: 1, text: 'Cellular respiration' },
    ],
  },
)

/* ===================================================================== */
/* Biodiversity in animals, Grade 11: structure and lifestyle             */
/* ===================================================================== */

const animals = { topicId: 'life-sci-biodiversity-animals', grade: 11 } as const

out.push(
  {
    ...animals,
    id: 'lsg-11-bird-flight',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 6,
    prompt: 'Using a pigeon as the example, explain how THREE structural features adapt an animal for flight.',
    answer:
      'Hollow bones make the skeleton light, so less energy is needed to stay in the air. Feathers provide a large, light surface for lift and streamlining. A keeled sternum gives a large area for attaching the powerful flight muscles. (Also accepted: forelimbs modified as wings that push against the air.)',
    explanation: 'Each mark pair is a feature and what it does for flight; naming a feature without saying how it helps earns only half.',
    memo: [
      { code: 'A', marks: 1, text: 'Hollow bones' },
      { code: 'R', marks: 1, text: 'make the body light' },
      { code: 'A', marks: 1, text: 'Feathers / forelimbs modified as wings' },
      { code: 'R', marks: 1, text: 'give a large surface for lift' },
      { code: 'A', marks: 1, text: 'Keeled sternum' },
      { code: 'R', marks: 1, text: 'for attachment of large flight muscles' },
    ],
  },
  {
    ...animals,
    id: 'lsg-11-exoskeleton-limits',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Many animals have an exoskeleton. Explain TWO disadvantages of an exoskeleton for an animal’s size and lifestyle.',
    answer:
      'An exoskeleton becomes too heavy to support and move if the animal is large, so it limits the animal’s size. It cannot grow, so the animal must moult to grow; while the new exoskeleton hardens after moulting, the animal is soft and vulnerable to predators.',
    explanation: 'Both disadvantages come from the skeleton being a rigid outer case rather than living bone inside the body.',
    memo: [
      { code: 'A', marks: 1, text: 'Limits size' },
      { code: 'R', marks: 1, text: 'a large exoskeleton would be too heavy' },
      { code: 'A', marks: 1, text: 'Must moult to grow' },
      { code: 'R', marks: 1, text: 'vulnerable to predators until the new exoskeleton hardens' },
    ],
  },
  {
    ...animals,
    id: 'lsg-11-radial-symmetry-jellyfish',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'A jellyfish’s body parts are arranged evenly around a central point, and it drifts with the currents. Explain how this body plan suits its lifestyle.',
    answer:
      'With radial symmetry the body is the same all round, so a drifting animal can detect and catch food, or meet danger, coming from any direction equally well.',
    explanation: 'An animal that does not move in one direction has no "front"; radial symmetry lets it respond equally on every side.',
    memo: [
      { code: 'A', marks: 1, text: 'Body parts arranged equally around a centre' },
      { code: 'R', marks: 1, text: 'Can meet food or danger from any direction' },
    ],
  },
  {
    ...animals,
    id: 'lsg-11-bilateral-head-end',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt:
      'Most animals that move actively in one direction have a distinct head end where their sense organs are grouped. Explain why this body structure suits an actively moving lifestyle.',
    answer:
      'With bilateral symmetry the animal has a front and back, so one end always meets the environment first as it moves. Sense organs and the brain are concentrated at that head end (cephalisation), so the animal detects food, prey or danger in the direction it is moving and can respond quickly.',
    explanation: 'Radial symmetry suits drifting or attached animals; bilateral symmetry suits animals that move forward through their surroundings.',
    memo: [
      { code: 'A', marks: 1, text: 'Has a front end that leads in movement' },
      { code: 'A', marks: 1, text: 'Sense organs and nerve tissue concentrated at the head (cephalisation)' },
      { code: 'R', marks: 1, text: 'Detects and responds to what lies ahead in the direction of movement' },
    ],
  },
)

/* ===================================================================== */
/* Biodiversity in plants, Grade 11: the four groups                      */
/* ===================================================================== */

const plants = { topicId: 'life-sci-biodiversity-plants', grade: 11 } as const

out.push(
  {
    ...plants,
    id: 'lsg-11-plant-group-each',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 4,
    prompt:
      'Name the plant group (bryophytes, pteridophytes, gymnosperms or angiosperms) described by each statement: (a) seeds enclosed in a fruit; (b) no vascular tissue and no true roots; (c) seeds borne naked on cones; (d) vascular tissue but reproduces by spores.',
    answer: '(a) Angiosperms. (b) Bryophytes. (c) Gymnosperms. (d) Pteridophytes.',
    explanation: 'The four groups are told apart by vascular tissue (absent only in bryophytes), and then by spores, naked seeds or seeds in a fruit.',
    memo: [
      { code: 'A', marks: 1, text: 'Angiosperms' },
      { code: 'A', marks: 1, text: 'Bryophytes' },
      { code: 'A', marks: 1, text: 'Gymnosperms' },
      { code: 'A', marks: 1, text: 'Pteridophytes' },
    ],
  },
  {
    ...plants,
    id: 'lsg-11-mosses-small-damp',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why bryophytes such as mosses are small and are found only in damp places.',
    answer:
      'Mosses have no vascular tissue (no xylem or phloem), so water and food can move only short distances from cell to cell; they cannot grow tall. They have no true roots to absorb water from deep in the soil, and their sperm must swim through a film of water to reach the egg, so they need damp places.',
    explanation: 'Size is limited by transport without vascular tissue; habitat is limited by water for absorption and for fertilisation.',
    memo: [
      { code: 'A', marks: 1, text: 'No vascular tissue, so transport is only over short distances -- small' },
      { code: 'A', marks: 1, text: 'No true roots to absorb water' },
      { code: 'R', marks: 1, text: 'Sperm need water to swim to the egg, so damp places' },
    ],
  },
  {
    ...plants,
    id: 'lsg-11-gymnosperms-dry',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Gymnosperms such as pine trees grow in cold, dry places where ferns cannot. Explain TWO features of gymnosperms that make this possible.',
    answer:
      'Their needle-like leaves have a small surface area and a thick cuticle, which reduces water loss. Their pollen is carried by the wind, so fertilisation does not need water, unlike ferns, whose sperm must swim.',
    explanation: 'Ferns are vascular but still depend on water for fertilisation; gymnosperms were the first group freed from that by pollen and seeds.',
    memo: [
      { code: 'A', marks: 1, text: 'Needle-like leaves' },
      { code: 'R', marks: 1, text: 'reduce water loss' },
      { code: 'A', marks: 1, text: 'Pollen carried by wind / seeds' },
      { code: 'R', marks: 1, text: 'fertilisation does not need water' },
    ],
  },
  {
    ...plants,
    id: 'lsg-11-angiosperms-diverse',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Angiosperms are the most diverse of the four plant groups. Suggest TWO reasons for their success, referring to their flowers and their fruit.',
    answer:
      'Flowers attract animal pollinators, which carry pollen directly from plant to plant, so pollination is efficient even when plants are far apart. Seeds are enclosed in a fruit, which protects them and is eaten or carried by animals, dispersing the seeds over a wide area into new habitats.',
    explanation: 'Efficient pollination and wide seed dispersal let flowering plants reproduce reliably and colonise new habitats, which drives diversity.',
    memo: [
      { code: 'A', marks: 1, text: 'Flowers attract pollinators' },
      { code: 'R', marks: 1, text: 'more efficient pollination' },
      { code: 'A', marks: 1, text: 'Seeds enclosed in a fruit' },
      { code: 'R', marks: 1, text: 'protects seeds and helps dispersal to new habitats' },
    ],
  },
)

/* ===================================================================== */
/* Ecosystem energy flow, Grade 10: effects of change                     */
/* ===================================================================== */

const eco = { topicId: 'life-sci-ecosystem-energy-flow', grade: 10 } as const

{
  const ppm = { water: 0.00005, plankton: 0.04, smallFish: 0.5, largeFish: 2, birds: 25 }
  const times = ppm.birds / ppm.smallFish
  out.push({
    ...eco,
    id: 'lsg-10-ddt-bioaccumulation',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    context: `DDT, a pesticide, was washed into a lake. The table shows its concentration in parts per million (ppm) at each level of the food chain.\n|+ TABLE: DDT IN A LAKE FOOD CHAIN\n| Level | DDT (ppm) |\n|---|---|\n| Water | ${String(ppm.water).replace('.', ',')} |\n| Plankton | ${String(ppm.plankton).replace('.', ',')} |\n| Small fish | ${String(ppm.smallFish).replace('.', ',')} |\n| Large fish | ${ppm.largeFish} |\n| Fish-eating birds | ${ppm.birds} |`,
    prompt: 'Calculate how many times more concentrated DDT is in the fish-eating birds than in the small fish, and explain why the pesticide has its greatest effect on the birds.',
    answer: `${ppm.birds} ÷ ${String(ppm.smallFish).replace('.', ',')} = ${times} times. DDT is not broken down or excreted, so it is stored in the body. Each consumer eats many organisms from the level below and keeps the DDT from all of them, so the concentration increases at each trophic level.`,
    explanation: 'Bioaccumulation explains why top predators are harmed first by a pesticide that is found only in tiny amounts in the water.',
    memo: [
      { code: 'RT', marks: 1, text: `${ppm.birds} and ${String(ppm.smallFish).replace('.', ',')} read from the table` },
      { code: 'A', marks: 1, text: `${times} times` },
      { code: 'R', marks: 1, text: 'DDT is stored, not broken down or excreted' },
      { code: 'R', marks: 1, text: 'Each consumer eats many organisms, so it becomes more concentrated at each trophic level' },
    ],
  })
}

out.push(
  {
    ...eco,
    id: 'lsg-10-jackals-removed',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'In a food web on a farm, jackals eat rabbits and rabbits eat grass. A farmer shoots all the jackals, so the predator is removed. Predict and explain the effect on the rabbits and on the grass.',
    answer:
      'With the predator removed, fewer rabbits are eaten, so the rabbit population increases. The larger rabbit population eats more grass, so the grass is over-grazed and decreases. Eventually the rabbits run short of food and their numbers may fall again.',
    explanation: 'Removing one species changes every organism linked to it in the web, not only its direct prey.',
    memo: [
      { code: 'A', marks: 1, text: 'Rabbit population increases' },
      { code: 'R', marks: 1, text: 'fewer are eaten by predators' },
      { code: 'A', marks: 1, text: 'Grass decreases / is over-grazed' },
      { code: 'R', marks: 1, text: 'more rabbits feeding on it' },
    ],
  },
  {
    ...eco,
    id: 'lsg-10-remove-species-web',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'Explain why one species being removed from a food web can have an effect on the organisms that never feed on it directly.',
    answer:
      'Organisms in a food web are linked through many feeding relationships. A change in one population changes the populations that eat it and that it eats, and those changes pass on to the organisms linked to them in turn.',
    explanation: 'The effect of a change spreads along every link in the web.',
    memo: [
      { code: 'A', marks: 1, text: 'Organisms are interlinked in the web' },
      { code: 'R', marks: 1, text: 'A change in one population passes on through the populations linked to it' },
    ],
  },
  {
    ...eco,
    id: 'lsg-10-owls-poisoned',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt:
      'A farmer puts out rat poison. Owls that eat poisoned rats die, and a year later the farm has more rats than before. Explain why the rat population increased after the owls were removed from the food web, and recommend a better way to control the rats.',
    answer:
      'The poison removed the rats’ predator: owls ate poisoned rats and the poison killed them. With fewer owls, fewer rats were eaten, so the surviving rats bred and their population increased. A better method is to encourage natural predators, for example by putting up owl boxes, instead of using poison.',
    explanation: 'A poison that passes along the food chain can remove the predator that was keeping the pest under control.',
    memo: [
      { code: 'A', marks: 1, text: 'Owls killed by eating poisoned rats' },
      { code: 'R', marks: 1, text: 'Fewer predators, so fewer rats are eaten' },
      { code: 'A', marks: 1, text: 'Surviving rats breed and increase' },
      { code: 'J', marks: 1, text: 'Recommend biological control, e.g. owl boxes' },
    ],
  },
)

/* ===================================================================== */
/* Chemistry of life, Grade 10: organic compounds and food tests          */
/* ===================================================================== */

const chem = { topicId: 'life-sci-chemistry-of-life', grade: 10 } as const

out.push(
  {
    ...chem,
    id: 'lsg-10-food-test-reagents',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 4,
    prompt: 'State the positive result of each food test: (a) iodine solution for starch; (b) Benedict’s solution, heated, for reducing sugar; (c) Biuret reagent for protein; (d) the grease-spot test for lipids.',
    answer: '(a) Blue-black. (b) Brick-red (orange) precipitate. (c) Violet / purple. (d) A translucent spot on the paper.',
    explanation: 'Benedict’s must be heated; the other three tests work at room temperature.',
    memo: [
      { code: 'A', marks: 1, text: 'Blue-black' },
      { code: 'A', marks: 1, text: 'Brick-red' },
      { code: 'A', marks: 1, text: 'Violet / purple' },
      { code: 'A', marks: 1, text: 'Translucent spot' },
    ],
  },
  {
    ...chem,
    id: 'lsg-10-unknown-solution-tests',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt:
      'A learner tests an unknown food solution. Iodine solution stays yellow-brown, Benedict’s solution stays blue after heating, and Biuret reagent turns violet. Deduce which organic compound the food contains and which it does not, giving the evidence for each.',
    answer:
      'It contains protein, because Biuret turned violet. It contains no starch, because iodine stayed yellow-brown, and no reducing sugar, because Benedict’s stayed blue.',
    explanation: 'A negative test result is evidence too: the reagent keeps its own colour when the compound is absent.',
    memo: [
      { code: 'A', marks: 1, text: 'Protein present -- Biuret violet' },
      { code: 'A', marks: 1, text: 'No starch -- iodine stayed yellow-brown' },
      { code: 'A', marks: 1, text: 'No reducing sugar -- Benedict’s stayed blue' },
    ],
  },
  {
    ...chem,
    id: 'lsg-10-glucose-or-starch',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Two unlabelled beakers hold colourless solutions: one is glucose and one is starch. Describe a food test that would tell them apart, and the result you would expect for each solution.',
    answer:
      'Add a few drops of iodine solution to a sample of each. The starch solution turns blue-black; the glucose solution stays yellow-brown. (Also accepted: heat each with Benedict’s solution -- glucose gives a brick-red precipitate, starch stays blue.)',
    explanation: 'Either test works because each reagent detects only one of the two carbohydrates; the other keeps the reagent’s own colour.',
    memo: [
      { code: 'A', marks: 1, text: 'Iodine solution (or Benedict’s, heated)' },
      { code: 'A', marks: 1, text: 'Added to a sample of each solution' },
      { code: 'A', marks: 1, text: 'Starch: blue-black (Benedict’s: stays blue)' },
      { code: 'A', marks: 1, text: 'Glucose: stays yellow-brown (Benedict’s: brick-red)' },
    ],
  },
  {
    ...chem,
    id: 'lsg-10-benedicts-not-heated',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 2,
    prompt: 'A learner adds Benedict’s solution to fruit juice that contains glucose, but forgets to heat it. Predict the result of this food test and explain it.',
    answer: 'The solution stays blue, a false negative. Benedict’s solution only reacts with a reducing sugar when it is heated in a water bath.',
    explanation: 'A food test is only valid if its method is followed; a missed step can hide a substance that is present.',
    memo: [
      { code: 'A', marks: 1, text: 'Stays blue (no brick-red precipitate)' },
      { code: 'R', marks: 1, text: 'Benedict’s needs heating to react with reducing sugar' },
    ],
  },
  {
    ...chem,
    id: 'lsg-10-biuret-egg-sugar',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'A learner does the Biuret test on egg white and on sugar water. Predict the colour for each, and explain the difference.',
    answer: 'Egg white turns violet (purple); the sugar water stays blue. Egg white contains protein, which Biuret reagent detects; sugar water has no protein.',
    explanation: 'Biuret reagent is blue and turns violet only where protein is present.',
    memo: [
      { code: 'A', marks: 1, text: 'Egg white: violet' },
      { code: 'A', marks: 1, text: 'Sugar water: stays blue' },
      { code: 'R', marks: 1, text: 'Egg white contains protein; sugar water does not' },
    ],
  },
)

/* ===================================================================== */
/* Micro-organisms, Grade 11: roles of micro-organisms                    */
/* ===================================================================== */

const micro = { topicId: 'life-sci-biodiversity-microorganisms', grade: 11 } as const

out.push(
  {
    ...micro,
    id: 'lsg-11-useful-microbes',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 4,
    prompt: 'Give TWO ways micro-organisms are beneficial in making food, and TWO ways they are beneficial in the environment.',
    answer:
      'Food: yeast in baking bread and brewing; bacteria in making yoghurt and cheese. Environment: decomposition of dead matter, which recycles nutrients; nitrogen fixation by bacteria, which adds nitrogen to the soil.',
    explanation: 'Antibiotic production is also accepted as a useful role, but it is neither food nor environment.',
    memo: [
      { code: 'A', marks: 1, text: 'Baking / brewing (yeast)' },
      { code: 'A', marks: 1, text: 'Yoghurt / cheese (bacteria)' },
      { code: 'A', marks: 1, text: 'Decomposition / nutrient cycling' },
      { code: 'A', marks: 1, text: 'Nitrogen fixation' },
    ],
  },
  {
    ...micro,
    id: 'lsg-11-antibiotics-flu',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'A doctor refuses to prescribe antibiotics to a patient with influenza. Explain why.',
    answer: 'Influenza is caused by a virus. Antibiotics kill bacteria but have no effect on viruses, so they would not cure the illness (and unnecessary use helps bacteria become resistant).',
    explanation: 'Viruses have no cell wall or bacterial machinery for the antibiotic to attack.',
    memo: [
      { code: 'A', marks: 1, text: 'Influenza is caused by a virus' },
      { code: 'R', marks: 1, text: 'Antibiotics have no effect on viruses' },
    ],
  },
  {
    ...micro,
    id: 'lsg-11-harmful-microbe-diseases',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 3,
    prompt: 'Micro-organisms can be harmful. Name THREE human diseases, each caused by a different kind of micro-organism, and name the kind of micro-organism that causes each.',
    answer: 'Bacterium: tuberculosis (or cholera). Virus: HIV/AIDS (or influenza, measles). Fungus: ringworm (or athlete’s foot, thrush).',
    explanation: 'Knowing the cause decides the treatment: antibiotics for bacteria, antivirals for some viruses, antifungals for fungi.',
    memo: [
      { code: 'A', marks: 1, text: 'Bacterial: TB / cholera' },
      { code: 'A', marks: 1, text: 'Viral: HIV / influenza' },
      { code: 'A', marks: 1, text: 'Fungal: ringworm / athlete’s foot' },
    ],
  },
  {
    ...micro,
    id: 'lsg-11-nitrogen-fixing-legumes',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A farmer plants beans in a field before planting maize. Explain how micro-organisms make this a useful practice.',
    answer:
      'Nitrogen-fixing bacteria live in nodules on the roots of beans (legumes). They convert nitrogen gas from the air into nitrogen compounds the plants can use. When the bean plants decay, these compounds stay in the soil, so the following maize crop has more nitrogen and the farmer needs less fertiliser.',
    explanation: 'Crop rotation with legumes is a use of micro-organisms to recycle nitrogen.',
    memo: [
      { code: 'A', marks: 1, text: 'Nitrogen-fixing bacteria in root nodules of legumes' },
      { code: 'A', marks: 1, text: 'Convert nitrogen gas into usable nitrogen compounds' },
      { code: 'R', marks: 1, text: 'Soil is enriched for the maize -- less fertiliser needed' },
    ],
  },
)

/* ===================================================================== */
/* Meiosis, Grade 12: meiosis II                                          */
/* ===================================================================== */

const meiosis = { topicId: 'life-sci-meiosis', grade: 12 } as const

{
  const diploid = 46
  const haploid = diploid / 2
  out.push({
    ...meiosis,
    id: 'lsg-12-meiosis-ii-counts',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `A human cell (2n = ${diploid}) undergoes meiosis. State the number of chromosomes in each cell at the start of meiosis II, and the number of chromatids in each cell at metaphase II. Explain your answer.`,
    answer: `${haploid} chromosomes and ${haploid * 2} chromatids. Meiosis I separated the homologous pairs, so each cell entering meiosis II is haploid with ${haploid} chromosomes, but each chromosome still has two chromatids until the centromeres split in anaphase II.`,
    explanation: 'The chromosome number halves in meiosis I; the chromatids only separate in anaphase II.',
    memo: [
      { code: 'A', marks: 1, text: `${haploid} chromosomes` },
      { code: 'A', marks: 1, text: `${haploid * 2} chromatids` },
      { code: 'R', marks: 1, text: 'Homologues separated in meiosis I; chromatids still joined until anaphase II' },
    ],
  })
}

out.push(
  {
    ...meiosis,
    id: 'lsg-12-meiosis-ii-like-mitosis',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Meiosis II, the second division of meiosis, is often said to resemble mitosis. Give TWO ways in which it is like mitosis, and ONE way in which it is different.',
    answer:
      'Like mitosis: chromosomes line up singly at the equator (metaphase II); chromatids separate to opposite poles when the centromeres split (anaphase II). Different: meiosis II starts with haploid cells, so the cells produced are haploid (and not genetically identical).',
    explanation: 'Meiosis II separates chromatids exactly as mitosis does, but the cells it starts with have already been halved by meiosis I.',
    memo: [
      { code: 'A', marks: 1, text: 'Chromosomes line up singly at the equator' },
      { code: 'A', marks: 1, text: 'Chromatids separate to opposite poles' },
      { code: 'A', marks: 1, text: 'Starts with haploid cells / products not identical' },
    ],
  },
  {
    ...meiosis,
    id: 'lsg-12-four-cells-different',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Explain why the four haploid cells at the end of the second division (meiosis II) are all genetically different from one another.',
    answer:
      'Crossing over in prophase I exchanged genetic material between homologous chromosomes, so the two chromatids of each chromosome are no longer identical. Random arrangement of the homologous pairs in metaphase I gave each cell a different mix of maternal and paternal chromosomes. When the non-identical chromatids separate in anaphase II, each of the four cells receives a different combination.',
    explanation: 'Meiosis II itself only separates chromatids; the differences were created in meiosis I.',
    memo: [
      { code: 'A', marks: 1, text: 'Crossing over makes the chromatids non-identical' },
      { code: 'A', marks: 1, text: 'Random arrangement of homologous pairs in metaphase I' },
      { code: 'R', marks: 1, text: 'Separation of these chromatids in anaphase II gives each cell a different combination' },
    ],
  },
  {
    ...meiosis,
    id: 'lsg-12-anaphase-ii-error',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 3,
    prompt: 'In one cell during anaphase II the two chromatids of chromosome 21 fail to separate. Predict the chromosome numbers of the gametes formed from this cell, and the effect on a zygote formed from the abnormal gamete with 24 chromosomes.',
    answer:
      'One gamete receives both chromatids and has 24 chromosomes; the other has 22. (The two gametes from the other cell of meiosis I are normal, with 23.) A zygote from the 24-chromosome gamete and a normal gamete has 47 chromosomes, with three copies of chromosome 21 -- Down syndrome.',
    explanation: 'Non-disjunction can happen in meiosis II as well as meiosis I; here it affects only the two gametes from one cell.',
    memo: [
      { code: 'A', marks: 1, text: 'One gamete 24, the other 22' },
      { code: 'A', marks: 1, text: 'Zygote has 47 chromosomes' },
      { code: 'R', marks: 1, text: 'Three copies of chromosome 21 -- Down syndrome' },
    ],
  },
)

/* ===================================================================== */
/* Genetics, Grade 12: dihybrid crosses and pedigrees                     */
/* ===================================================================== */

const genetics = { topicId: 'life-sci-genetics', grade: 12 } as const

out.push({
  ...genetics,
  id: 'lsg-12-dihybrid-gametes',
  difficulty: 'Easy',
  cognitiveLevel: 2,
  marks: 2,
  prompt: 'In pea plants round seeds (R) are dominant to wrinkled (r), and yellow seeds (Y) are dominant to green (y). Give all the possible gametes of a plant with the genotype RrYy in a dihybrid cross.',
  answer: 'RY, Ry, rY, ry.',
  explanation: 'Each gamete gets one allele of each gene; independent assortment gives all four combinations in equal proportions.',
  memo: [
    { code: 'A', marks: 1, text: 'RY and Ry' },
    { code: 'A', marks: 1, text: 'rY and ry' },
  ],
})

{
  const offspring = 320
  const roundGreen = (offspring * 3) / 16
  out.push({
    ...genetics,
    id: 'lsg-12-dihybrid-expected-number',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Two pea plants, both RrYy (round, yellow), are crossed in a dihybrid cross and produce ${offspring} seeds. Calculate how many round, green seeds are expected.`,
    answer: `The cross gives a 9 : 3 : 3 : 1 ratio of round yellow : round green : wrinkled yellow : wrinkled green. Round green = 3/16 × ${offspring} = ${roundGreen}.`,
    explanation: 'A cross of two double heterozygotes has a 16-block Punnett square; round green (R_yy) fills 3 of the 16 blocks.',
    memo: [
      { code: 'A', marks: 1, text: '9 : 3 : 3 : 1 ratio' },
      { code: 'M', marks: 1, text: `3/16 × ${offspring}` },
      { code: 'A', marks: 1, text: `${roundGreen}` },
    ],
  })
}

{
  const offspring = 200
  out.push({
    ...genetics,
    id: 'lsg-12-dihybrid-test-cross',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `A round, yellow plant (RrYy) is crossed with a wrinkled, green plant (rryy) in a dihybrid cross, giving ${offspring} offspring. State the phenotypic ratio expected and the number of each phenotype.`,
    answer: `The rryy parent gives only ry gametes, so the four gametes of the RrYy parent each show in the offspring: 1 round yellow : 1 round green : 1 wrinkled yellow : 1 wrinkled green, i.e. ${offspring / 4} of each.`,
    explanation: 'Crossing with a double recessive (a test cross) reveals the gametes of the other parent directly.',
    memo: [
      { code: 'A', marks: 1, text: 'rryy gives only ry gametes' },
      { code: 'A', marks: 1, text: 'RrYy gives RY, Ry, rY, ry' },
      { code: 'A', marks: 1, text: '1 : 1 : 1 : 1' },
      { code: 'A', marks: 1, text: `${offspring / 4} of each phenotype` },
    ],
  })
}

out.push(
  {
    ...genetics,
    id: 'lsg-12-pedigree-recessive',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    context:
      'A pedigree shows a family in which neither parent, Thabo nor Lindiwe, has albinism. Of their three children, one daughter has albinism. Albinism is controlled by one gene with two alleles: A (normal pigment) and a.',
    prompt: 'Use the pedigree to explain whether albinism is dominant or recessive, give the genotypes of both parents, and state the chance that their next child will have albinism.',
    answer:
      'Recessive: two unaffected parents have an affected child, so each parent must carry a hidden allele for albinism. Both parents are Aa. Aa × Aa gives 1 AA : 2 Aa : 1 aa, so the chance is 1/4 (25%).',
    explanation: 'In a pedigree, an affected child of two unaffected parents always means the allele is recessive and both parents are heterozygous.',
    memo: [
      { code: 'A', marks: 1, text: 'Recessive' },
      { code: 'R', marks: 1, text: 'Unaffected parents have an affected child' },
      { code: 'A', marks: 1, text: 'Both parents Aa' },
      { code: 'A', marks: 1, text: '1/4 / 25%' },
    ],
  },
  {
    ...genetics,
    id: 'lsg-12-pedigree-dominant',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 3,
    context:
      'A pedigree of four generations shows a condition in every generation. It affects males and females equally, and every affected child has at least one affected parent. In one family two affected parents have an unaffected son.',
    prompt: 'Explain what the pedigree suggests about whether the condition is dominant or recessive, and use the unaffected son to justify your answer.',
    answer:
      'The condition is likely dominant (and autosomal): it appears in every generation and in both sexes equally. Two affected parents can have an unaffected son only if both are heterozygous and each passed on the recessive normal allele; this is impossible if the condition were recessive, since two affected (homozygous recessive) parents could have only affected children.',
    explanation: 'For a recessive condition, two affected parents can only produce affected children; an unaffected child of two affected parents proves dominance.',
    memo: [
      { code: 'A', marks: 1, text: 'Dominant' },
      { code: 'R', marks: 1, text: 'Appears in every generation, both sexes' },
      { code: 'J', marks: 1, text: 'Two affected parents with an unaffected child: both heterozygous, so the condition cannot be recessive' },
    ],
  },
)

/* ===================================================================== */
/* Mitosis, Grade 10: cytokinesis and cancer                              */
/* ===================================================================== */

const mitosis = { topicId: 'life-sci-mitosis', grade: 10 } as const

out.push(
  {
    ...mitosis,
    id: 'lsg-10-cytokinesis-animal-plant',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Describe how cytokinesis takes place in an animal cell and in a plant cell, and explain why the two are different.',
    answer:
      'In an animal cell the cell membrane pinches inwards (furrows) until the cytoplasm divides into two cells. In a plant cell a cell plate forms between the two nuclei and grows outwards to become the new cell wall. The difference is because the rigid cell wall of a plant cell cannot pinch in.',
    explanation: 'Cytokinesis is the division of the cytoplasm after the nucleus has divided.',
    memo: [
      { code: 'A', marks: 1, text: 'Animal: membrane pinches in / furrows' },
      { code: 'A', marks: 1, text: 'Plant: cell plate forms between the nuclei' },
      { code: 'A', marks: 1, text: 'Cell plate becomes the new cell wall' },
      { code: 'R', marks: 1, text: 'Rigid cell wall cannot pinch in' },
    ],
  },
  {
    ...mitosis,
    id: 'lsg-10-benign-malignant',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 3,
    prompt: 'Distinguish between a benign tumour and a malignant tumour, and name the process by which cancer spreads.',
    answer: 'A benign tumour stays in one place. A malignant tumour invades nearby tissue and spreads to other organs. The spreading is called metastasis.',
    explanation: 'Only malignant tumours are cancers; benign tumours can still cause harm by pressing on organs.',
    memo: [
      { code: 'A', marks: 1, text: 'Benign: stays in one place' },
      { code: 'A', marks: 1, text: 'Malignant: spreads to other organs' },
      { code: 'A', marks: 1, text: 'Metastasis' },
    ],
  },
  {
    ...mitosis,
    id: 'lsg-10-chemo-hair-loss',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Chemotherapy drugs stop cells dividing by mitosis. Explain why chemotherapy shrinks a tumour, and why patients often lose their hair during treatment.',
    answer:
      'A tumour is a mass of cells dividing by uncontrolled mitosis, so stopping mitosis stops it growing and it shrinks. The drugs also act on normal cells that divide rapidly, such as hair-follicle cells, so hair stops growing and falls out.',
    explanation: 'The drugs target dividing cells in general, not cancer cells only, which is why side effects appear in tissues that divide often.',
    memo: [
      { code: 'A', marks: 1, text: 'Tumour cells divide rapidly by uncontrolled mitosis' },
      { code: 'R', marks: 1, text: 'Stopping mitosis stops tumour growth' },
      { code: 'R', marks: 1, text: 'Hair-follicle cells also divide rapidly, so are affected' },
    ],
  },
  {
    ...mitosis,
    id: 'lsg-10-cancer-risk-factors',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Give TWO cancer risk factors a person can avoid, and explain in general how they can lead to a tumour.',
    answer:
      'Any two: smoking, too much exposure to UV light (sunburn), some chemicals, excessive alcohol. These damage the DNA that controls when a cell divides, so the cell may divide by mitosis without control and form a tumour.',
    explanation: 'Cancer arises when the controls on mitosis fail; avoidable risk factors increase the chance of that damage.',
    memo: [
      { code: 'A', marks: 1, text: 'First risk factor, e.g. smoking' },
      { code: 'A', marks: 1, text: 'Second risk factor, e.g. UV exposure' },
      { code: 'R', marks: 1, text: 'Damage to DNA controlling cell division leads to uncontrolled mitosis' },
    ],
  },
)

export const lifeSciGapQuestions: Question[] = out
