/**
 * The second round of Life Sciences questions for the thinnest sub-topics, as
 * the sub-topic coverage report counted them before this file:
 *
 *   Biodiversity in animals (Grade 11): structure and lifestyle -- 5.
 *   Excretion (Grade 11): excretory organs -- 5.
 *   Biodiversity in plants (Grade 11): the four groups -- 6.
 *   Ecosystem energy flow (Grade 10): effects of change -- 6.
 *   Circulatory system (Grade 10): blood vessels -- 7.
 *   Meiosis (Grade 12): variation and errors -- 7.
 *   Photosynthesis (Grade 11): the dark phase (Calvin cycle) -- 7.
 *   Skeletal system (Grade 10): muscles and disorders -- 7.
 *
 * Nine more each, across the four cognitive levels: recall, explanation,
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
/* Biodiversity in animals, Grade 11: structure and lifestyle             */
/* ===================================================================== */

const animals = { topicId: 'life-sci-biodiversity-animals', grade: 11 } as const

out.push(
  {
    ...animals,
    id: 'ls4-11-sessile-filter-feeder',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'An animal stays fixed to a rock for its whole adult life and feeds by drawing water through pores in its body wall. Which TWO words describe this lifestyle?',
    options: [
      { id: 'a', label: 'Free-living and predatory' },
      { id: 'b', label: 'Sessile and filter-feeding' },
      { id: 'c', label: 'Parasitic and burrowing' },
      { id: 'd', label: 'Swimming and grazing' },
    ],
    correctOptionId: 'b',
    answer: 'Sessile and filter-feeding',
    explanation:
      'An animal that cannot move from place to place is sessile. Because it cannot hunt, it feeds by straining tiny food particles out of the water that flows through it -- filter feeding. Sponges live like this.',
    memo: [{ code: 'A', marks: 2, text: 'B: sessile and filter-feeding' }],
  },
  {
    ...animals,
    id: 'ls4-11-tapeworm-no-gut',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'A tapeworm lives in the small intestine of its host and has no gut of its own. Explain how its body structure suits this lifestyle.',
    answer:
      'It lives surrounded by food the host has already digested, so it does not need a gut. It absorbs dissolved nutrients directly through its body surface. Its body is long and flat, which gives a large surface area for absorption, and hooks and suckers on its head hold it to the intestine wall so it is not carried away.',
    explanation:
      'Parasites often lose structures their host does the work of. A flat body means every cell is close to the surface, so absorption and diffusion are enough without a gut or a blood system.',
    memo: [
      { code: 'A', marks: 1, text: 'Absorbs digested food through its body surface, so needs no gut' },
      { code: 'A', marks: 1, text: 'Long, flat body gives a large surface area for absorption' },
      { code: 'A', marks: 1, text: 'Hooks/suckers attach it so it is not carried away' },
    ],
  },
  {
    ...animals,
    id: 'ls4-11-earthworm-burrowing',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Describe FOUR features of the body structure of an earthworm that suit its burrowing lifestyle in damp soil.',
    answer:
      'A long, thin, tube-shaped body pushes easily through soil. The body is divided into segments, so circular and longitudinal muscles can lengthen and shorten parts of it in turn. Tiny bristles (chaetae) grip the soil so the worm does not slip back. A moist, thin skin lets gases diffuse in and out, since it has no lungs.',
    explanation:
      'Locomotion through soil needs a narrow body and a way to anchor one part while another part moves forward; segments with their own muscles and bristles provide both. Gas exchange through the skin only works while the skin is moist, which ties the earthworm to damp soil.',
    memo: [
      { code: 'A', marks: 1, text: 'Long, thin, cylindrical body' },
      { code: 'A', marks: 1, text: 'Segmented body with muscles that contract in waves' },
      { code: 'A', marks: 1, text: 'Bristles/chaetae grip the soil' },
      { code: 'A', marks: 1, text: 'Thin, moist skin for gas exchange' },
    ],
  },
  {
    ...animals,
    id: 'ls4-11-hydra-two-layers',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Hydra has a body wall only two cell layers thick and a single opening that is both mouth and anus. Explain why this simple structure is enough for its lifestyle, but would not be enough for a large, active animal.',
    answer:
      'Hydra is small and slow-moving and lives in water, so every cell is close to the water or the gut cavity and gets oxygen and food by diffusion. A large, active animal has many cells far from any surface and needs far more energy, so diffusion would be too slow; it needs a through-gut and a transport system.',
    explanation:
      'Diffusion only works over short distances. Body size and activity level decide whether a simple sac-like structure is enough or whether specialised systems for digestion and transport are needed.',
    memo: [
      { code: 'A', marks: 1, text: 'Every cell is close to the water/gut cavity' },
      { code: 'A', marks: 1, text: 'so diffusion supplies oxygen and food' },
      { code: 'R', marks: 1, text: 'A large, active animal has cells too far from a surface, so diffusion is too slow' },
    ],
  },
  {
    ...animals,
    id: 'ls4-11-squid-vs-snail',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'A snail and a squid are closely related, but the snail crawls slowly on land while the squid is a fast hunter in the sea. Suggest how the body structure of each suits its own lifestyle.',
    answer:
      'Snail: a heavy shell protects its soft body from drying out and from predators, which suits a slow animal on land; it moves on a muscular foot over a layer of mucus. Squid: it has no heavy outer shell, a streamlined body, and moves fast by jet propulsion, squirting water from its body cavity; its tentacles with suckers catch prey and it has large, well-developed eyes for hunting.',
    explanation:
      'Related animals share a basic body plan but adapt it to different habitats. Protection against drying out matters most on land; speed, streamlining and good senses matter most for a hunter in open water.',
    memo: [
      { code: 'A', marks: 1, text: 'Snail: shell protects against drying out/predators' },
      { code: 'A', marks: 1, text: 'Snail: moves slowly on a muscular foot with mucus' },
      { code: 'A', marks: 1, text: 'Squid: streamlined, no heavy shell, jet propulsion for speed' },
      { code: 'A', marks: 1, text: 'Squid: tentacles/suckers and large eyes for catching prey' },
    ],
  },
  {
    ...animals,
    id: 'ls4-11-starfish-tube-feet',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'A starfish moves slowly over rocks using hundreds of tube feet, and feeds on mussels. Explain how its tube feet help it both to move and to feed.',
    answer:
      'Each tube foot ends in a sucker that grips the rock; the feet stretch out, grip and pull in turn, so the starfish creeps forward. When feeding, the tube feet grip the two halves of a mussel shell and pull steadily until the shell opens, so the starfish can digest the mussel.',
    explanation:
      'The same structure can serve more than one function. A slow, steady pull from many small suckers is weak for speed but strong enough to tire the muscle that holds a mussel shut.',
    memo: [
      { code: 'A', marks: 1, text: 'Tube feet have suckers that grip the surface' },
      { code: 'A', marks: 1, text: 'They stretch, grip and pull in turn to move the animal' },
      { code: 'A', marks: 1, text: 'They pull the mussel shell open so it can feed' },
    ],
  },
  {
    ...animals,
    id: 'ls4-11-spider-exoskeleton-moult',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'A spider has a hard outer covering and jointed legs. Explain ONE advantage and ONE disadvantage of this structure, and how the spider overcomes the disadvantage as it grows.',
    answer:
      'Advantage: the hard covering supports and protects the body and reduces water loss, and jointed legs allow fast, precise movement on land. Disadvantage: the covering cannot stretch, so it limits growth. The spider overcomes this by moulting: it sheds the old covering, expands while the new one is still soft, and the new covering then hardens.',
    explanation:
      'An external skeleton is a trade-off. It is excellent for support and waterproofing on land, but the animal can only grow in steps, and is vulnerable to predators just after each moult.',
    memo: [
      { code: 'A', marks: 1, text: 'Advantage: support/protection/reduced water loss, or jointed legs for movement' },
      { code: 'A', marks: 1, text: 'Disadvantage: the covering cannot grow/stretch' },
      { code: 'A', marks: 1, text: 'It moults: sheds the old covering' },
      { code: 'A', marks: 1, text: 'and expands before the new covering hardens' },
    ],
  },
  {
    ...animals,
    id: 'ls4-11-body-plan-table',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Four animals A to D are described below. Identify which ONE is best suited to an active, hunting lifestyle, and justify your choice with THREE features from the descriptions.',
    context:
      'A: sac-like body with one opening, tentacles round the mouth, stays attached to a rock.\nB: soft body, a single muscular foot, a coiled shell, moves very slowly.\nC: streamlined body, a head with large eyes and a concentration of nerve cells, a gut with a separate mouth and anus, fast muscles along the body.\nD: flat body with no gut, attached by hooks inside another animal.',
    answer:
      'Animal C. Its streamlined body reduces drag for fast movement; a head with large eyes and concentrated nerve cells lets it detect and track prey; a gut with a separate mouth and anus processes large meals efficiently; and fast muscles power quick chases.',
    explanation:
      'Hunting needs speed, good senses at the front end where the animal meets its prey first, and a gut that can digest a large meal while the animal keeps feeding. A is sessile, B is slow, and D does not hunt at all.',
    memo: [
      { code: 'A', marks: 1, text: 'Animal C' },
      { code: 'J', marks: 1, text: 'Streamlined body / fast muscles for speed' },
      { code: 'J', marks: 1, text: 'Head with large eyes and concentrated nerve cells to find prey' },
      { code: 'J', marks: 1, text: 'Separate mouth and anus: an efficient through-gut' },
    ],
  },
  {
    ...animals,
    id: 'ls4-11-desert-beetle-water',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt:
      'A beetle in the Namib Desert stands on dune crests on foggy mornings with its back tilted into the wind, and drinks the water that collects on its back. Suggest how this behaviour and its hard, waxy outer covering adapt it to its habitat.',
    answer:
      'Fog is almost the only source of water, so tilting its back into the wind lets droplets condense on its body and run down to its mouth. The hard, waxy covering stops water evaporating from its body in the hot, dry air.',
    explanation:
      'In a desert an animal must both gain water and keep it. The beetle uses behaviour to gain water and its body structure to keep it.',
    memo: [
      { code: 'A', marks: 1, text: 'Fog droplets collect on its back and run to its mouth' },
      { code: 'A', marks: 1, text: 'This is its main source of water in the desert' },
      { code: 'A', marks: 1, text: 'The waxy covering reduces water loss by evaporation' },
    ],
  },
)

/* ===================================================================== */
/* Excretion, Grade 11: excretory organs                                  */
/* ===================================================================== */

const excretion = { topicId: 'life-sci-excretion', grade: 11 } as const

{
  // Sweat lost by a learner running a race on a hot day.
  const [hours, litresPerHour, saltGPerLitre] = [1.5, 1.2, 2.5]
  const litres = hours * litresPerHour
  const salt = litres * saltGPerLitre
  out.push({
    ...excretion,
    id: 'ls4-11-sweat-volume-salt',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `During a ${n(hours)}-hour race on a hot day, a runner loses sweat at ${n(litresPerHour)} litres per hour, and each litre of sweat contains ${n(saltGPerLitre)} g of salt. Calculate the mass of salt the skin removes during the race, and state why the runner should drink more than plain water afterwards.`,
    answer: `Sweat lost = ${n(hours)} × ${n(litresPerHour)} = ${n(litres)} litres. Salt lost = ${n(litres)} × ${n(saltGPerLitre)} = ${n(salt)} g. Salts as well as water are lost in sweat, so the runner should replace both, for example with a drink that contains salts.`,
    explanation:
      'The skin is an excretory organ as well as a cooling organ: sweat removes water, salts and a little urea. A large loss of salts upsets the balance of body fluids, which is why oral rehydration drinks contain salt and sugar.',
    memo: [
      { code: 'M', marks: 1, text: `${n(hours)} × ${n(litresPerHour)}` },
      { code: 'CA', marks: 1, text: `= ${n(litres)} litres of sweat` },
      { code: 'CA', marks: 1, text: `× ${n(saltGPerLitre)} g = ${n(salt)} g of salt` },
      { code: 'R', marks: 1, text: 'Salts are lost too, so replace salts as well as water' },
    ],
  })
}

out.push(
  {
    ...excretion,
    id: 'ls4-11-lungs-waste-products',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Name TWO waste products of cell respiration that leave the body through the lungs.',
    answer: 'Carbon dioxide and water vapour.',
    explanation:
      'Cellular respiration makes carbon dioxide and water as waste products. Blood carries the carbon dioxide to the lungs, where it diffuses into the alveoli and is breathed out with some water vapour.',
    memo: [
      { code: 'A', marks: 1, text: 'Carbon dioxide' },
      { code: 'A', marks: 1, text: 'Water (vapour)' },
    ],
  },
  {
    ...excretion,
    id: 'ls4-11-excretory-organ-mcq-liver',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which excretory organ breaks down old red blood cells and removes the products as bile pigments?',
    options: [
      { id: 'a', label: 'Lungs' },
      { id: 'b', label: 'Skin' },
      { id: 'c', label: 'Liver' },
      { id: 'd', label: 'Pancreas' },
    ],
    correctOptionId: 'c',
    answer: 'Liver',
    explanation:
      'The liver breaks down haemoglobin from worn-out red blood cells; the pigments are passed out in bile into the small intestine and leave with the faeces. That is why the liver counts as an excretory organ.',
    memo: [{ code: 'A', marks: 2, text: 'C: liver' }],
  },
  {
    ...excretion,
    id: 'ls4-11-skin-sweat-gland',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Describe how a sweat gland in the skin removes waste from the blood.',
    answer:
      'The coiled part of the sweat gland is surrounded by capillaries. Water, salts and a little urea pass from the blood into the gland. The sweat moves up the duct and leaves through a pore onto the surface of the skin.',
    explanation:
      'Sweat glands do two jobs: they cool the body as sweat evaporates, and they remove small amounts of waste. Their close contact with capillaries is what lets them draw substances out of the blood.',
    memo: [
      { code: 'A', marks: 1, text: 'The gland is surrounded by capillaries' },
      { code: 'A', marks: 1, text: 'Water, salts and urea pass from the blood into the gland' },
      { code: 'A', marks: 1, text: 'Sweat moves up the duct and out through a pore' },
    ],
  },
  {
    ...excretion,
    id: 'ls4-11-alveolus-co2-exit',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why carbon dioxide moves out of the blood into the air in the lungs, and name the process involved.',
    answer:
      'The blood arriving at the lungs has a higher concentration of carbon dioxide than the air in the alveoli, so carbon dioxide moves from the blood into the alveoli, down its concentration gradient, by diffusion. Breathing out keeps the concentration in the alveoli low.',
    explanation:
      'The lungs remove carbon dioxide only because a gradient is kept up: respiration in the tissues keeps adding it to the blood, and breathing keeps removing it from the alveoli.',
    memo: [
      { code: 'A', marks: 1, text: 'Higher concentration of CO₂ in the blood than in the alveoli' },
      { code: 'A', marks: 1, text: 'Diffusion' },
      { code: 'A', marks: 1, text: 'Breathing out keeps the alveolar concentration low' },
    ],
  },
  {
    ...excretion,
    id: 'ls4-11-liver-damage-effect',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A patient has liver damage. Suggest why the patient’s skin and the whites of the eyes may turn yellow.',
    answer:
      'The damaged liver cannot remove bile pigments from the blood or pass them out in bile. The yellow pigments build up in the blood and are deposited in the skin and eyes (jaundice).',
    explanation:
      'This is what happens when an excretory organ fails: the waste it normally removes stays in the body. Jaundice is a common sign of liver disease.',
    memo: [
      { code: 'A', marks: 1, text: 'The liver cannot remove bile pigments' },
      { code: 'A', marks: 1, text: 'Pigments build up in the blood' },
      { code: 'A', marks: 1, text: 'and colour the skin and eyes yellow (jaundice)' },
    ],
  },
  {
    ...excretion,
    id: 'ls4-11-excretory-organs-table',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Draw a table with TWO columns to show which excretory organ removes each of these from the body: excess water, bile pigments, carbon dioxide, excess salts.',
    answer:
      'Excess water: lungs, skin (and the urinary system). Bile pigments: liver. Carbon dioxide: lungs. Excess salts: skin (and the urinary system).',
    explanation:
      'Some wastes leave by more than one route. Water is lost in breath, sweat and urine; salts in sweat and urine. Only the lungs remove carbon dioxide, and only the liver excretes bile pigments.',
    memo: [
      { code: 'A', marks: 1, text: 'Excess water: lungs/skin' },
      { code: 'A', marks: 1, text: 'Bile pigments: liver' },
      { code: 'A', marks: 1, text: 'Carbon dioxide: lungs' },
      { code: 'A', marks: 1, text: 'Excess salts: skin' },
    ],
  },
  {
    ...excretion,
    id: 'ls4-11-cold-day-sweat',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'On a cold day a learner sweats very little but passes more urine than usual. Explain how the excretory organs share the work of removing water.',
    answer:
      'On a cold day the body conserves heat, so the skin makes little sweat and loses little water. The water still has to be removed to keep the body’s water balance, so more of it leaves in urine. On a hot day the opposite happens: more water is lost as sweat and less urine is made.',
    explanation:
      'The excretory organs work together. When one removes less water, another removes more, so the total water in the body stays close to constant.',
    memo: [
      { code: 'A', marks: 1, text: 'Little sweating on a cold day, so little water lost through the skin' },
      { code: 'A', marks: 1, text: 'More water must leave another way' },
      { code: 'A', marks: 1, text: 'so more urine is made' },
    ],
  },
  {
    ...excretion,
    id: 'ls4-11-skin-vs-lungs-evaluate',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt:
      'A learner claims that the skin is "the most important excretory organ because it is the largest organ of the body". Evaluate this claim.',
    answer:
      'The claim is not supported. Size does not decide importance in removing waste. The skin removes only small amounts of water, salts and urea, and mainly to cool the body. The lungs remove all the carbon dioxide the body makes, and the liver makes urea and excretes bile pigments; without these organs, toxic waste would quickly build up.',
    explanation:
      'To evaluate, weigh the evidence: compare how much waste each organ removes and what happens if it fails, rather than accepting a feature like size as proof.',
    memo: [
      { code: 'J', marks: 1, text: 'The claim is not supported: size does not decide importance' },
      { code: 'A', marks: 1, text: 'The skin removes only small amounts of water, salts and urea' },
      { code: 'A', marks: 1, text: 'The lungs remove all CO₂ / the liver makes urea and excretes bile pigments' },
      { code: 'R', marks: 1, text: 'Failure of those organs causes toxic build-up quickly' },
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
    id: 'ls4-11-four-groups-order',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 4,
    prompt: 'List the four groups of plants -- bryophytes, pteridophytes, gymnosperms and angiosperms -- and give ONE example of each.',
    answer:
      'Bryophytes: mosses. Pteridophytes: ferns. Gymnosperms: conifers such as pine and yellowwood, or cycads. Angiosperms: flowering plants such as maize, grass or a rose.',
    explanation:
      'The groups are usually listed in the order they appeared in evolution: mosses first, then ferns, then seed plants without flowers (gymnosperms), and finally flowering plants (angiosperms).',
    memo: [
      { code: 'A', marks: 1, text: 'Bryophytes, e.g. moss' },
      { code: 'A', marks: 1, text: 'Pteridophytes, e.g. fern' },
      { code: 'A', marks: 1, text: 'Gymnosperms, e.g. pine/yellowwood/cycad' },
      { code: 'A', marks: 1, text: 'Angiosperms, e.g. any flowering plant' },
    ],
  },
  {
    ...plants,
    id: 'ls4-11-moss-no-vascular',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why mosses grow only a few centimetres tall and usually in damp, shady places.',
    answer:
      'Mosses have no vascular tissue (no xylem or phloem) and no true roots, so water moves through them only by diffusion and osmosis from cell to cell, which is slow over large distances. Their male gametes must also swim to the egg through a film of water, so they need damp conditions to reproduce.',
    explanation:
      'Without xylem a plant cannot lift water far or support a tall body. Mosses stay small and keep close to moisture both for water and for fertilisation.',
    memo: [
      { code: 'A', marks: 1, text: 'No vascular tissue/xylem' },
      { code: 'A', marks: 1, text: 'Water moves only by diffusion/osmosis, so they cannot grow tall' },
      { code: 'A', marks: 1, text: 'Sperm need water to swim to the egg' },
    ],
  },
  {
    ...plants,
    id: 'ls4-11-fern-spores-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'The brown spots on the underside of a fern frond contain…',
    options: [
      { id: 'a', label: 'seeds' },
      { id: 'b', label: 'pollen grains' },
      { id: 'c', label: 'spores' },
      { id: 'd', label: 'fruits' },
    ],
    correctOptionId: 'c',
    answer: 'spores',
    explanation:
      'Ferns are pteridophytes: they have vascular tissue but no seeds. The brown spots are sori, clusters of sporangia that release spores.',
    memo: [{ code: 'A', marks: 2, text: 'C: spores' }],
  },
  {
    ...plants,
    id: 'ls4-11-gymnosperm-naked-seed',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'The word gymnosperm means "naked seed". Explain what this means, and how it differs from the seeds of angiosperms.',
    answer:
      'In gymnosperms such as pines the seeds develop exposed on the scales of a cone; they are not enclosed in an ovary. In angiosperms the ovules develop inside an ovary, which becomes a fruit around the seeds.',
    explanation:
      'Both groups make seeds, which is why they are called seed plants. The difference is protection: an angiosperm seed is enclosed in a fruit, which also helps with dispersal.',
    memo: [
      { code: 'A', marks: 1, text: 'Gymnosperm seeds lie exposed on cone scales' },
      { code: 'A', marks: 1, text: 'They are not enclosed in an ovary/fruit' },
      { code: 'A', marks: 1, text: 'Angiosperm seeds are enclosed in an ovary that becomes a fruit' },
    ],
  },
  {
    ...plants,
    id: 'ls4-11-conifer-dry-adaptations',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Pine trees (conifers) grow well in dry, windy places. Suggest TWO features of conifers that help them survive there, and explain each.',
    answer:
      'Needle-shaped leaves with a small surface area and a thick, waxy cuticle reduce water loss by transpiration. Sunken stomata trap moist air and slow water loss. Pollen is carried by the wind, so conifers do not need animals to pollinate them.',
    explanation:
      'Any two well-explained features earn the marks. Each feature has to be linked to the condition it helps with: dryness or wind.',
    memo: [
      { code: 'A', marks: 1, text: 'Needle leaves / thick waxy cuticle / sunken stomata' },
      { code: 'R', marks: 1, text: 'reduce water loss' },
      { code: 'A', marks: 1, text: 'A second feature explained, e.g. wind pollination needs no animals' },
    ],
  },
  {
    ...plants,
    id: 'ls4-11-monocot-dicot-table',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Tabulate TWO differences between monocotyledons and dicotyledons.',
    answer:
      'Monocots: one cotyledon in the seed; parallel leaf veins; flower parts in threes; scattered vascular bundles in the stem. Dicots: two cotyledons; net-like leaf veins; flower parts in fours or fives; vascular bundles in a ring.',
    explanation:
      'A table needs a heading for each group and features compared in the same row. Maize and grass are monocots; beans and sunflowers are dicots.',
    memo: [
      { code: 'S', marks: 1, text: 'Table with headings for both groups' },
      { code: 'A', marks: 1, text: 'One cotyledon vs two cotyledons' },
      { code: 'A', marks: 1, text: 'Parallel veins vs net veins (or another correct pair)' },
      { code: 'A', marks: 1, text: 'Differences paired correctly in rows' },
    ],
  },
  {
    ...plants,
    id: 'ls4-11-four-groups-key',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt:
      'Use the descriptions to identify plant groups P, Q, R and S as bryophytes, pteridophytes, gymnosperms or angiosperms.',
    context:
      'P: has vascular tissue, reproduces by spores, has large divided leaves (fronds).\nQ: has seeds inside fruits and produces flowers.\nR: has no vascular tissue, grows as a low green cushion, reproduces by spores.\nS: has seeds on the scales of cones and needle-like leaves.',
    answer: 'P: pteridophyte (fern). Q: angiosperm. R: bryophyte (moss). S: gymnosperm (conifer).',
    explanation:
      'Two questions sort the four groups: does it have vascular tissue, and does it make seeds? If it makes seeds, are they enclosed in a fruit?',
    memo: [
      { code: 'A', marks: 1, text: 'P: pteridophyte' },
      { code: 'A', marks: 1, text: 'Q: angiosperm' },
      { code: 'A', marks: 1, text: 'R: bryophyte' },
      { code: 'A', marks: 1, text: 'S: gymnosperm' },
    ],
  },
  {
    ...plants,
    id: 'ls4-11-angiosperm-success',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Angiosperms are the largest and most widespread of the four plant groups today. Give FOUR reasons, based on their structure and reproduction, why they have been so successful.',
    answer:
      'Seeds protected inside fruits; fruits help to disperse seeds far from the parent; flowers attract animal pollinators, so pollination is more reliable than by wind alone; double fertilisation provides a food store (endosperm) for the embryo; efficient xylem vessels transport water quickly; fertilisation does not need water, so they can live in dry places.',
    explanation:
      'Any four. Each reason should be a structure or process, linked to how it helps the plant survive or spread.',
    memo: [
      { code: 'A', marks: 1, text: 'Seeds protected in fruits / fruits aid dispersal' },
      { code: 'A', marks: 1, text: 'Flowers attract pollinators' },
      { code: 'A', marks: 1, text: 'Food store for the embryo / efficient xylem vessels' },
      { code: 'A', marks: 1, text: 'Fertilisation does not depend on water' },
    ],
  },
  {
    ...plants,
    id: 'ls4-11-alternation-moss-fern',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'In mosses the green plant you see is the gametophyte, but in ferns the green plant you see is the sporophyte. Explain what this difference shows about how plants changed as they moved onto land.',
    answer:
      'The gametophyte is haploid and its male gametes need water to swim. The sporophyte is diploid, has vascular tissue and makes spores that spread through the air. Over evolution the sporophyte became the larger, longer-lived stage, which suits life on dry land better.',
    explanation:
      'From mosses to ferns to seed plants, the gametophyte gets smaller and the sporophyte larger; in angiosperms the gametophyte is just a few cells inside the flower.',
    memo: [
      { code: 'A', marks: 1, text: 'Gametophyte is haploid and depends on water for fertilisation' },
      { code: 'A', marks: 1, text: 'Sporophyte is diploid, with vascular tissue and airborne spores' },
      { code: 'R', marks: 1, text: 'The sporophyte became dominant as plants adapted to land' },
    ],
  },
)

/* ===================================================================== */
/* Ecosystem structure and energy flow, Grade 10: effects of change       */
/* ===================================================================== */

const eco = { topicId: 'life-sci-ecosystem-energy-flow', grade: 10 } as const

{
  // Rabbits and the grass they graze, before and after a disease kills most of them.
  const [rabbitsBefore, rabbitsAfter] = [1200, 300]
  const fall = ((rabbitsBefore - rabbitsAfter) / rabbitsBefore) * 100
  out.push({
    ...eco,
    id: 'ls4-10-rabbit-disease-decline',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `In a grassland a disease reduced a rabbit population from ${n(rabbitsBefore, 0)} to ${n(rabbitsAfter, 0)}. Calculate the percentage decline, and predict TWO effects on the grassland.`,
    answer: `Percentage decline = (${n(rabbitsBefore, 0)} − ${n(rabbitsAfter, 0)}) ÷ ${n(rabbitsBefore, 0)} × 100 = ${n(fall, 0)}%. With fewer rabbits grazing, the grass would grow taller and thicker; the jackals and eagles that eat rabbits would have less food, so their numbers would fall or they would eat more of other prey.`,
    explanation: 'A change at one feeding level spreads both down (to the plants eaten) and up (to the predators that eat the rabbits).',
    memo: [
      { code: 'M', marks: 1, text: `(${n(rabbitsBefore, 0)} − ${n(rabbitsAfter, 0)}) ÷ ${n(rabbitsBefore, 0)} × 100` },
      { code: 'CA', marks: 1, text: `= ${n(fall, 0)}%` },
      { code: 'A', marks: 1, text: 'More grass, because there is less grazing' },
      { code: 'A', marks: 1, text: 'Fewer predators, or predators switch to other prey' },
    ],
  })
}

out.push(
  {
    ...eco,
    id: 'ls4-10-removed-top-predator',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Farmers removed all the leopards from a mountain area. Explain what would happen to the numbers of dassies (rock hyraxes), and then to the plants they eat.',
    answer:
      'Without leopards to eat them, the dassies would increase in number. More dassies would eat more of the plants, so the plants would decrease. Eventually there might not be enough food, and the dassie population could crash.',
    explanation:
      'Removing a predator takes away a check on its prey. The prey increase until food becomes the limiting factor.',
    memo: [
      { code: 'A', marks: 1, text: 'Dassies increase because there is no predator' },
      { code: 'A', marks: 1, text: 'Plants decrease from more grazing' },
      { code: 'A', marks: 1, text: 'Dassies may later decline from lack of food' },
    ],
  },
  {
    ...eco,
    id: 'ls4-10-introduced-alien-fish',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Trout were introduced into a mountain stream to provide fishing. Suggest the effect on the indigenous fish and frogs that already lived there.',
    answer:
      'Trout are predators and eat small indigenous fish, tadpoles and insect larvae. They also compete with indigenous fish for food. The indigenous species could decline or disappear from the stream.',
    explanation:
      'An introduced species often has no natural predators in its new home and can outcompete or eat the species that evolved there.',
    memo: [
      { code: 'A', marks: 1, text: 'Trout eat indigenous fish/tadpoles' },
      { code: 'A', marks: 1, text: 'Trout compete with indigenous fish for food' },
      { code: 'A', marks: 1, text: 'Indigenous species decline' },
    ],
  },
  {
    ...eco,
    id: 'ls4-10-pesticide-disrupt-pollinators',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A farmer sprays a pesticide that kills most bees on a fruit farm. Explain how this could disrupt both the fruit harvest and the birds that feed on fruit.',
    answer:
      'Bees pollinate the fruit-tree flowers. With fewer bees, fewer flowers are pollinated, so fewer fruits form and the harvest falls. Birds that eat the fruit then have less food, so their numbers may fall too.',
    explanation:
      'Organisms are linked by more than feeding: pollination is a service that other species depend on, so removing pollinators reaches species that never eat bees.',
    memo: [
      { code: 'A', marks: 1, text: 'Bees pollinate the flowers' },
      { code: 'A', marks: 1, text: 'Less pollination, so fewer fruits' },
      { code: 'A', marks: 1, text: 'Fruit-eating birds have less food' },
    ],
  },
  {
    ...eco,
    id: 'ls4-10-drought-effect-on-the-web',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'A long drought kills much of the grass in a savanna. Describe the effect on the zebra, the lions that hunt them, and the vultures that feed on carcasses.',
    answer:
      'Zebra have less food, so many become weak, die or migrate, and their numbers decline. At first lions may find weak zebra easy to catch, but as zebra numbers fall the lions have less food and their numbers decline. Vultures may have more carcasses to eat at first, then fewer as the herds shrink.',
    explanation:
      'Effects of change are often different in the short term and the long term. A good answer follows the change through each feeding level in turn.',
    memo: [
      { code: 'A', marks: 1, text: 'Zebra decline from lack of grass' },
      { code: 'A', marks: 1, text: 'Lions: easy prey at first, then less food, so they decline' },
      { code: 'A', marks: 1, text: 'Vultures: more carcasses at first' },
      { code: 'A', marks: 1, text: 'then fewer as the herds shrink' },
    ],
  },
  {
    ...eco,
    id: 'ls4-10-dam-nutrient-runoff',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: 'Fertiliser washes from farmland into a dam. Explain what would happen to the algae, the oxygen in the water, and the fish.',
    answer:
      'The extra nutrients make algae grow very fast (an algal bloom). When the algae die, bacteria decompose them and use up the oxygen in the water. The fish then do not have enough oxygen and many die.',
    explanation:
      'This chain of events is called eutrophication. An increase in one population (the algae) causes a decline in another (the fish) through a change in the water itself.',
    memo: [
      { code: 'A', marks: 1, text: 'Algae grow rapidly (algal bloom)' },
      { code: 'A', marks: 1, text: 'Dead algae are decomposed by bacteria' },
      { code: 'A', marks: 1, text: 'which use up the dissolved oxygen' },
      { code: 'A', marks: 1, text: 'Fish die from lack of oxygen' },
    ],
  },
  {
    ...eco,
    id: 'ls4-10-effect-mcq-snake-removed',
    difficulty: 'Easy',
    cognitiveLevel: 2,
    marks: 2,
    prompt: 'In a food chain grass → mouse → snake → eagle, the snakes are removed. What is most likely to happen first?',
    options: [
      { id: 'a', label: 'The grass increases' },
      { id: 'b', label: 'The mice increase' },
      { id: 'c', label: 'The eagles increase' },
      { id: 'd', label: 'Nothing changes' },
    ],
    correctOptionId: 'b',
    answer: 'The mice increase',
    explanation:
      'The snakes ate the mice, so without them the mice increase first. The eagles lose a food source and the grass is eaten more, but those changes follow later.',
    memo: [{ code: 'A', marks: 2, text: 'B: the mice increase' }],
  },
  {
    ...eco,
    id: 'ls4-10-bush-encroachment-data',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt:
      'Use the data to describe the effect on the grazing animals when bushes spread over a grassland, and suggest ONE way the farmer could restore the grass.',
    context:
      'Percentage of land covered by bushes: 2010 — 12%; 2015 — 25%; 2020 — 45%.\nNumber of grazing antelope counted: 2010 — 400; 2015 — 260; 2020 — 120.',
    answer:
      'As bush cover increased from 12% to 45%, the number of grazing antelope declined from 400 to 120, because bushes shade out the grass the antelope eat. The farmer could clear some bushes by cutting them, or use controlled burning, to let the grass grow back.',
    explanation:
      'Describe the trend in both sets of data and link them with a reason. A good suggestion has to be practical and reverse the cause.',
    memo: [
      { code: 'A', marks: 1, text: 'Bush cover increased (12% → 45%)' },
      { code: 'A', marks: 1, text: 'Antelope decreased (400 → 120)' },
      { code: 'R', marks: 1, text: 'Bushes replace the grass the antelope graze' },
      { code: 'A', marks: 1, text: 'Clear bushes / controlled burning' },
    ],
  },
  {
    ...eco,
    id: 'ls4-10-introduced-alien-plant-water',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Alien trees such as Port Jackson willows were introduced into the fynbos. Explain the effect on the indigenous plants and on the water in rivers.',
    answer:
      'The alien trees grow fast, have no natural enemies in South Africa and shade out the indigenous fynbos plants, which decline. Because they are large and use a lot of water, less water reaches the rivers.',
    explanation:
      'Invasive aliens change more than the plants around them: by taking up more water, they reduce stream flow for every organism downstream, including people.',
    memo: [
      { code: 'A', marks: 1, text: 'Aliens grow fast with no natural enemies' },
      { code: 'A', marks: 1, text: 'Indigenous plants are shaded out and decline' },
      { code: 'A', marks: 1, text: 'They use more water, so river flow drops' },
    ],
  },
)

/* ===================================================================== */
/* The circulatory system, Grade 10: blood vessels                        */
/* ===================================================================== */

const circ = { topicId: 'life-sci-circulatory-system', grade: 10 } as const

{
  // Blood slows as it spreads across far more capillaries than arteries.
  const [aortaSpeed, capillarySpeed] = [30, 0.03]
  const ratio = aortaSpeed / capillarySpeed
  out.push({
    ...circ,
    id: 'ls4-10-capillary-speed-ratio',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 4,
    prompt: `Blood flows at about ${n(aortaSpeed, 0)} cm/s in the largest artery but only about ${n(capillarySpeed, 2)} cm/s in the capillaries. Calculate how many times slower it flows in the capillaries, and explain why this slow flow is useful.`,
    answer: `${n(aortaSpeed, 0)} ÷ ${n(capillarySpeed, 2)} = ${n(ratio, 0)} times slower. Slow flow gives more time for oxygen, glucose and wastes to diffuse between the blood and the tissue cells through the thin capillary walls.`,
    explanation:
      'The capillaries together have a far larger cross-sectional area than the arteries feeding them, so the blood slows down there -- exactly where exchange with the tissues happens.',
    memo: [
      { code: 'M', marks: 1, text: `${n(aortaSpeed, 0)} ÷ ${n(capillarySpeed, 2)}` },
      { code: 'CA', marks: 1, text: `= ${n(ratio, 0)} times` },
      { code: 'A', marks: 1, text: 'More time for exchange' },
      { code: 'A', marks: 1, text: 'of oxygen/nutrients/wastes by diffusion through the thin walls' },
    ],
  })
}

out.push(
  {
    ...circ,
    id: 'ls4-10-vessel-wall-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Which blood vessel has walls only one cell thick?',
    options: [
      { id: 'a', label: 'Artery' },
      { id: 'b', label: 'Vein' },
      { id: 'c', label: 'Capillary' },
      { id: 'd', label: 'Aorta' },
    ],
    correctOptionId: 'c',
    answer: 'Capillary',
    explanation: 'Capillary walls are a single layer of flat cells, so substances can diffuse through them easily.',
    memo: [{ code: 'A', marks: 2, text: 'C: capillary' }],
  },
  {
    ...circ,
    id: 'ls4-10-artery-vein-table',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 5,
    prompt: 'Tabulate TWO structural differences between the walls of arteries and veins.',
    answer:
      'Artery: thick, muscular, elastic wall; narrow lumen; no valves (except at the base of the aorta and pulmonary artery). Vein: thin wall with less muscle; wide lumen; valves along its length.',
    explanation:
      'A table needs headings for both vessels, with each difference compared in the same row. Two correct, matched rows earn the marks.',
    memo: [
      { code: 'S', marks: 1, text: 'Table with headings for artery and vein' },
      { code: 'A', marks: 1, text: 'Artery: thick muscular wall' },
      { code: 'A', marks: 1, text: 'Vein: thin wall' },
      { code: 'A', marks: 1, text: 'Artery: narrow lumen / no valves' },
      { code: 'A', marks: 1, text: 'Vein: wide lumen / has valves' },
    ],
  },
  {
    ...circ,
    id: 'ls4-10-vein-valves-backflow',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why veins in the legs need valves, but arteries do not.',
    answer:
      'Blood in the veins is at low pressure and must flow upwards against gravity back to the heart, so it could flow backwards; valves close to stop backflow. Blood in arteries is pushed forward at high pressure by each heartbeat, so it does not flow backwards.',
    explanation:
      'Leg muscles squeeze the veins as they contract, pushing the blood upwards; the valves make sure it can only go towards the heart.',
    memo: [
      { code: 'A', marks: 1, text: 'Low pressure in veins, blood flows up against gravity' },
      { code: 'A', marks: 1, text: 'Valves prevent backflow' },
      { code: 'A', marks: 1, text: 'High pressure in arteries keeps the blood moving forward' },
    ],
  },
  {
    ...circ,
    id: 'ls4-10-artery-elastic-wall',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain how the elastic tissue in the wall of an artery helps to keep the blood flowing smoothly between heartbeats.',
    answer:
      'When the ventricle contracts, the surge of high-pressure blood stretches the elastic artery wall. Between beats, the wall recoils, pushing on the blood and keeping it moving forward. This evens out the flow and is felt as the pulse.',
    explanation:
      'Without elastic recoil the blood would flow in jerks, stopping between beats; the artery acts as a pressure store.',
    memo: [
      { code: 'A', marks: 1, text: 'The wall stretches with each surge of blood' },
      { code: 'A', marks: 1, text: 'and recoils between beats' },
      { code: 'A', marks: 1, text: 'pushing the blood forward to even out the flow' },
    ],
  },
  {
    ...circ,
    id: 'ls4-10-capillary-adaptations',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Describe THREE ways in which capillaries are suited to the exchange of substances with the tissues.',
    answer:
      'Their walls are one cell thick, giving a short diffusion distance. They form dense networks, so every cell is close to a capillary and there is a large surface area. Blood flows slowly through them, giving time for exchange. Their narrow lumen pushes red blood cells against the wall.',
    explanation: 'Any three. Each feature should be linked to faster or more complete exchange.',
    memo: [
      { code: 'A', marks: 1, text: 'Walls one cell thick: short diffusion distance' },
      { code: 'A', marks: 1, text: 'Dense networks: large surface area, close to every cell' },
      { code: 'A', marks: 1, text: 'Slow flow / narrow lumen: time and contact for exchange' },
    ],
  },
  {
    ...circ,
    id: 'ls4-10-varicose-veins',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A shop assistant who stands all day develops swollen, twisted veins in the legs (varicose veins). Suggest how damaged valves in these veins lead to the swelling.',
    answer:
      'If the valves are weak or damaged, they do not close properly, so blood flows backwards and collects in the veins of the lower leg. The extra blood stretches the thin vein walls, which become swollen and twisted.',
    explanation:
      'Standing still for long periods means the leg muscles are not squeezing the veins, so the valves have to hold up the blood on their own.',
    memo: [
      { code: 'A', marks: 1, text: 'Damaged valves do not close properly' },
      { code: 'A', marks: 1, text: 'Blood flows back and pools in the leg veins' },
      { code: 'A', marks: 1, text: 'The thin walls stretch and swell' },
    ],
  },
  {
    ...circ,
    id: 'ls4-10-pulmonary-vessels-blood',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'The pulmonary artery carries deoxygenated blood, yet it is classed with the arteries and not the veins. Explain why, referring to the direction of flow and the walls of the vessel.',
    answer:
      'Blood vessels are named by the direction of flow, not by the blood they carry. An artery carries blood away from the heart; the pulmonary artery carries blood from the right ventricle to the lungs, so it is an artery even though its blood is deoxygenated.',
    explanation: 'In the same way, the pulmonary vein carries oxygenated blood but is a vein, because it returns blood to the heart.',
    memo: [
      { code: 'A', marks: 1, text: 'Vessels are named by direction of flow' },
      { code: 'A', marks: 1, text: 'An artery carries blood away from the heart' },
      { code: 'A', marks: 1, text: 'The pulmonary artery carries blood from the heart to the lungs' },
    ],
  },
  {
    ...circ,
    id: 'ls4-10-pressure-graph-vessels',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt:
      'Use the blood pressure readings to identify which vessel is X, which is Y and which is Z, and explain the pattern.',
    context: 'Average blood pressure (kPa): vessel X — 13; vessel Y — 3; vessel Z — 1.',
    answer:
      'X: artery (highest pressure). Y: capillary. Z: vein (lowest pressure). Pressure is highest in the arteries, close to the pumping heart; it drops as blood passes through the narrow capillaries; it is lowest in the veins returning to the heart.',
    explanation:
      'Blood loses pressure as it moves further from the heart and through the resistance of the capillaries, which is why veins need valves.',
    memo: [
      { code: 'A', marks: 1, text: 'X: artery' },
      { code: 'A', marks: 1, text: 'Y: capillary' },
      { code: 'A', marks: 1, text: 'Z: vein' },
      { code: 'R', marks: 1, text: 'Pressure falls with distance from the heart / through the capillaries' },
    ],
  },
)

/* ===================================================================== */
/* Meiosis, Grade 12: variation and errors                               */
/* ===================================================================== */

const meiosis = { topicId: 'life-sci-meiosis', grade: 12 } as const

{
  // How many genetically different gametes one person could make from independent chromosome pairs alone.
  const pairs = 23
  const combos = 2 ** pairs
  out.push({
    ...meiosis,
    id: 'ls4-12-variation-combinations',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Humans have ${pairs} pairs of chromosomes. Calculate how many genetically different gametes one person could make from the arrangement of chromosomes alone, and explain how this contributes to variation.`,
    answer: `2²³ = ${n(combos, 0)} different combinations. Each pair lines up independently on the equator, so each gamete gets a different mix of chromosomes from the person's mother and father; two gametes are very unlikely to be the same, so siblings differ.`,
    explanation:
      'This number ignores crossing over, which shuffles alleles within chromosomes too; the true number of possible gametes is far larger.',
    memo: [
      { code: 'M', marks: 1, text: '2²³' },
      { code: 'CA', marks: 1, text: `= ${n(combos, 0)}` },
      { code: 'A', marks: 1, text: 'Each gamete gets a different mix of chromosomes, causing variation' },
    ],
  })
}

out.push(
  {
    ...meiosis,
    id: 'ls4-12-non-disjunction-define',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'What is non-disjunction?',
    answer: 'The failure of a pair of chromosomes, or of sister chromatids, to separate during meiosis.',
    explanation: 'The result is gametes with one chromosome too many or one too few.',
    memo: [
      { code: 'A', marks: 1, text: 'Failure of chromosomes/chromatids to separate' },
      { code: 'A', marks: 1, text: 'during meiosis' },
    ],
  },
  {
    ...meiosis,
    id: 'ls4-12-down-syndrome-cause',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Explain how non-disjunction can result in a child with Down syndrome.',
    answer:
      'During meiosis in a parent, chromosome pair 21 fails to separate. One gamete receives two copies of chromosome 21. If it is fertilised by a normal gamete with one copy, the zygote has three copies of chromosome 21 (trisomy 21), 47 chromosomes in all.',
    explanation: 'The extra chromosome is copied into every cell of the child by mitosis, which causes the features of Down syndrome.',
    memo: [
      { code: 'A', marks: 1, text: 'Chromosome pair 21 fails to separate' },
      { code: 'A', marks: 1, text: 'A gamete gets two copies of chromosome 21' },
      { code: 'A', marks: 1, text: 'It fuses with a normal gamete' },
      { code: 'A', marks: 1, text: 'The zygote has three copies (trisomy 21) / 47 chromosomes' },
    ],
  },
  {
    ...meiosis,
    id: 'ls4-12-abnormal-gamete-count',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'In a human cell undergoing meiosis, non-disjunction occurs: one pair of chromosomes fails to separate in meiosis I. How many chromosomes will the resulting abnormal gametes contain?',
    answer:
      'Two of the gametes will contain 24 chromosomes and two will contain 22 chromosomes, instead of the normal 23.',
    explanation:
      'If a pair fails to separate in meiosis I, both chromosomes of that pair go to one cell. That cell’s two gametes each get the extra chromosome, and the other cell’s two gametes each lack it.',
    memo: [
      { code: 'A', marks: 1, text: 'No gamete has the normal 23' },
      { code: 'A', marks: 1, text: 'Two gametes have 24' },
      { code: 'A', marks: 1, text: 'Two gametes have 22' },
    ],
  },
  {
    ...meiosis,
    id: 'ls4-12-maternal-age-data',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Describe the trend shown in the data, and give a possible reason for it.',
    context:
      'Approximate number of babies born with Down syndrome per 10 000 births, by mother’s age: 25 years — 8; 30 years — 11; 35 years — 28; 40 years — 100; 45 years — 330.',
    answer:
      'The chance of a baby with Down syndrome increases with the mother’s age, slowly up to about 30, then sharply after 35. A possible reason: a woman’s egg cells are present from birth and pause partway through meiosis for many years; the older the eggs, the more likely the chromosomes are to fail to separate when meiosis resumes.',
    explanation:
      'Describe the shape of the trend, not just "it goes up", and give a reason that links to how meiosis works in women.',
    memo: [
      { code: 'A', marks: 1, text: 'Chance increases with the mother’s age' },
      { code: 'A', marks: 1, text: 'sharply after about 35' },
      { code: 'R', marks: 1, text: 'Eggs are present from birth and stay paused in meiosis for years' },
      { code: 'R', marks: 1, text: 'so non-disjunction is more likely in older eggs' },
    ],
  },
  {
    ...meiosis,
    id: 'ls4-12-variation-siblings',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Two brothers have the same parents but look different. Explain how meiosis and fertilisation produce this variation.',
    answer:
      'During meiosis, homologous chromosomes exchange segments and line up in different combinations, so each gamete carries a different mix of alleles. At fertilisation any one sperm can fuse with any one egg, so each child receives a new, random combination of alleles.',
    explanation: 'Only identical twins, from the same zygote, share the same set of alleles.',
    memo: [
      { code: 'A', marks: 1, text: 'Exchange of segments in meiosis gives new allele combinations' },
      { code: 'A', marks: 1, text: 'Chromosomes line up in different combinations in each gamete' },
      { code: 'A', marks: 1, text: 'Random fertilisation of any egg by any sperm' },
    ],
  },
  {
    ...meiosis,
    id: 'ls4-12-trisomy-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'A person with trisomy 21 has how many chromosomes in each body cell?',
    options: [
      { id: 'a', label: '45' },
      { id: 'b', label: '46' },
      { id: 'c', label: '47' },
      { id: 'd', label: '69' },
    ],
    correctOptionId: 'c',
    answer: '47',
    explanation: 'A normal body cell has 46 chromosomes; trisomy 21 means one extra copy of chromosome 21, giving 47.',
    memo: [{ code: 'A', marks: 2, text: 'C: 47' }],
  },
  {
    ...meiosis,
    id: 'ls4-12-variation-survival',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Explain why the variation produced by meiosis is important for the survival of a species when its environment changes.',
    answer:
      'Because offspring differ, some may by chance have characteristics that suit the new conditions. These individuals are more likely to survive and reproduce, passing on their alleles. A species whose offspring were all identical could be wiped out by one change.',
    explanation: 'Variation is the raw material on which natural selection acts.',
    memo: [
      { code: 'A', marks: 1, text: 'Offspring differ, so some may suit the new conditions' },
      { code: 'A', marks: 1, text: 'They survive and reproduce, passing on their alleles' },
      { code: 'R', marks: 1, text: 'Identical offspring could all be wiped out' },
    ],
  },
  {
    ...meiosis,
    id: 'ls4-12-karyotype-error',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A karyotype of a baby shows only one X chromosome and no Y chromosome (45 chromosomes in all). Explain how an error in meiosis in one parent could cause this.',
    answer:
      'In one parent the sex chromosomes failed to separate during meiosis (non-disjunction), so one gamete received no sex chromosome at all. When this gamete fused with a normal gamete carrying an X chromosome, the zygote had only one X: 45 chromosomes in all.',
    explanation:
      'This condition is called Turner syndrome. Non-disjunction can affect any chromosome pair, including the sex chromosomes.',
    memo: [
      { code: 'A', marks: 1, text: 'Sex chromosomes failed to separate (non-disjunction)' },
      { code: 'A', marks: 1, text: 'One gamete had no sex chromosome' },
      { code: 'A', marks: 1, text: 'It fused with a gamete carrying an X, giving 45 chromosomes' },
    ],
  },
)

/* ===================================================================== */
/* Photosynthesis, Grade 11: the dark phase (Calvin cycle)               */
/* ===================================================================== */

const photo = { topicId: 'life-sci-photosynthesis', grade: 11 } as const

{
  // Carbon atoms: each turn of the Calvin cycle fixes one carbon dioxide molecule.
  const glucoseMolecules = 5
  const turns = glucoseMolecules * 6
  out.push({
    ...photo,
    id: 'ls4-11-calvin-turns-glucose',
    difficulty: 'Moderate',
    cognitiveLevel: 3,
    marks: 3,
    prompt: `Each turn of the Calvin cycle fixes one molecule of carbon dioxide, and glucose has six carbon atoms. How many turns of the cycle are needed to make ${glucoseMolecules} molecules of glucose? Show your working.`,
    answer: `One glucose needs 6 carbon atoms, so 6 turns. ${glucoseMolecules} glucose molecules need ${glucoseMolecules} × 6 = ${turns} turns.`,
    explanation: 'Every carbon atom in the glucose comes from a carbon dioxide molecule fixed in the light-independent reactions.',
    memo: [
      { code: 'A', marks: 1, text: '6 turns per glucose (6 carbon atoms)' },
      { code: 'M', marks: 1, text: `${glucoseMolecules} × 6` },
      { code: 'CA', marks: 1, text: `= ${turns} turns` },
    ],
  })
}

out.push(
  {
    ...photo,
    id: 'ls4-11-calvin-where-needs',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 3,
    prompt: 'Name THREE substances the Calvin cycle needs in order to run.',
    answer: 'Carbon dioxide, ATP and NADPH (hydrogen carried by NADP), all from the light phase except the carbon dioxide.',
    explanation: 'The light-independent reactions fix carbon dioxide and reduce it, using energy from ATP and hydrogen from NADPH.',
    memo: [
      { code: 'A', marks: 1, text: 'Carbon dioxide' },
      { code: 'A', marks: 1, text: 'ATP' },
      { code: 'A', marks: 1, text: 'NADPH / hydrogen' },
    ],
  },
  {
    ...photo,
    id: 'ls4-11-calvin-steps',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'Describe what happens to carbon dioxide during the Calvin cycle.',
    answer:
      'Carbon dioxide combines with a five-carbon compound (RuBP) — carbon fixation. The product is reduced, using hydrogen from NADPH and energy from ATP, to form a three-carbon sugar (PGAL/G3P). Some of this sugar is used to build glucose; the rest regenerates RuBP so the cycle can continue.',
    explanation: 'The cycle is called light-independent because it does not use light directly, but it stops in the dark once the ATP and NADPH from the light phase run out.',
    memo: [
      { code: 'A', marks: 1, text: 'CO₂ combines with a 5-carbon compound/RuBP (fixation)' },
      { code: 'A', marks: 1, text: 'Reduced using NADPH/hydrogen and ATP' },
      { code: 'A', marks: 1, text: 'to form a 3-carbon sugar (G3P/PGAL)' },
      { code: 'A', marks: 1, text: 'Some makes glucose; the rest regenerates RuBP' },
    ],
  },
  {
    ...photo,
    id: 'ls4-11-calvin-mcq-name',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'Another name for the Calvin cycle is the…',
    options: [
      { id: 'a', label: 'light-dependent phase' },
      { id: 'b', label: 'light-independent phase' },
      { id: 'c', label: 'Krebs cycle' },
      { id: 'd', label: 'photolysis' },
    ],
    correctOptionId: 'b',
    answer: 'light-independent phase',
    explanation: 'It is also called the dark phase, though it happens in daylight as well; the Krebs cycle belongs to respiration.',
    memo: [{ code: 'A', marks: 2, text: 'B: light-independent phase' }],
  },
  {
    ...photo,
    id: 'ls4-11-calvin-stops-dark',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'The Calvin cycle does not use light directly, yet it stops soon after a plant is put in the dark. Explain why.',
    answer:
      'The cycle needs ATP and NADPH, which are made only in the light-dependent phase. In the dark no more ATP and NADPH are made, so once the existing supply is used up, carbon dioxide can no longer be fixed and reduced.',
    explanation: 'The two phases depend on each other: the light phase supplies the energy and hydrogen, the Calvin cycle returns ADP and NADP to be reloaded.',
    memo: [
      { code: 'A', marks: 1, text: 'It needs ATP and NADPH' },
      { code: 'A', marks: 1, text: 'which are made only in the light phase' },
      { code: 'A', marks: 1, text: 'In the dark the supply runs out, so the cycle stops' },
    ],
  },
  {
    ...photo,
    id: 'ls4-11-calvin-radioactive-carbon',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Scientists supplied algae with carbon dioxide containing radioactive carbon, then killed samples after a few seconds and after a few minutes. Suggest where in the Calvin cycle the radioactive carbon would be found first, and where later.',
    answer:
      'After a few seconds it would be found first in the first product of carbon fixation, a three-carbon compound. After a few minutes it would be found in sugars such as glucose, and later in starch and other compounds made from them.',
    explanation:
      'Tracing labelled carbon over time is how the order of the steps in the Calvin cycle was first worked out.',
    memo: [
      { code: 'A', marks: 1, text: 'First in a 3-carbon compound (first product of fixation)' },
      { code: 'A', marks: 1, text: 'Later in glucose/sugars' },
      { code: 'A', marks: 1, text: 'Then in starch/other compounds' },
    ],
  },
  {
    ...photo,
    id: 'ls4-11-calvin-glucose-uses',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 4,
    prompt: 'List FOUR ways a plant uses the glucose made in the Calvin cycle.',
    answer:
      'For cellular respiration to release energy; converted to starch for storage; converted to cellulose for cell walls; converted to sucrose for transport in the phloem; used to make proteins and fats.',
    explanation: 'Any four. Glucose is both the plant’s fuel and its building material.',
    memo: [
      { code: 'A', marks: 1, text: 'Respiration' },
      { code: 'A', marks: 1, text: 'Stored as starch' },
      { code: 'A', marks: 1, text: 'Cellulose for cell walls' },
      { code: 'A', marks: 1, text: 'Sucrose for transport / proteins / fats' },
    ],
  },
  {
    ...photo,
    id: 'ls4-11-calvin-co2-greenhouse',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt:
      'A tomato farmer raises the carbon dioxide level in a well-lit greenhouse from 0,04% to 0,1%. Evaluate whether this is likely to increase the yield, with reference to the Calvin cycle.',
    answer:
      'Yes, it is likely to increase the yield. In bright light the ATP and NADPH supply is high, so carbon dioxide is the factor that limits the Calvin cycle. More carbon dioxide means more is fixed per minute, so more glucose is made, giving more growth and fruit. The increase will level off once another factor, such as temperature, becomes limiting.',
    explanation:
      'To evaluate, give a decision and back it with the mechanism; add the condition under which it stops being true.',
    memo: [
      { code: 'J', marks: 1, text: 'Yes, the yield is likely to increase' },
      { code: 'A', marks: 1, text: 'CO₂ limits the Calvin cycle when light is plentiful' },
      { code: 'A', marks: 1, text: 'More CO₂ fixed, so more glucose/growth' },
      { code: 'R', marks: 1, text: 'Until another factor (e.g. temperature) limits it' },
    ],
  },
  {
    ...photo,
    id: 'ls4-11-calvin-temperature',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'Explain why the Calvin cycle slows down at low temperatures, while the reactions that capture light energy are hardly affected.',
    answer:
      'Every step of the Calvin cycle is controlled by enzymes, which work slowly at low temperatures because molecules have less kinetic energy and collide less often. The capture of light energy is a physical process that depends little on temperature.',
    explanation: 'This is why temperature can be a limiting factor even on a bright day.',
    memo: [
      { code: 'A', marks: 1, text: 'The Calvin cycle is enzyme-controlled' },
      { code: 'A', marks: 1, text: 'Enzymes work slowly at low temperature (less kinetic energy/fewer collisions)' },
      { code: 'A', marks: 1, text: 'Light capture depends little on temperature' },
    ],
  },
)

/* ===================================================================== */
/* The skeletal system, Grade 10: muscles and disorders                   */
/* ===================================================================== */

const skeleton = { topicId: 'life-sci-skeletal-system', grade: 10 } as const

out.push(
  {
    ...skeleton,
    id: 'ls4-10-biceps-triceps-bend',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'When you bend your arm at the elbow, which muscle contracts and which muscle relaxes?',
    answer: 'The biceps contracts and the triceps relaxes.',
    explanation: 'To straighten the arm the opposite happens: the triceps contracts and the biceps relaxes.',
    memo: [
      { code: 'A', marks: 1, text: 'Biceps contracts' },
      { code: 'A', marks: 1, text: 'Triceps relaxes' },
    ],
  },
  {
    ...skeleton,
    id: 'ls4-10-antagonistic-why',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why skeletal muscles work in antagonistic pairs.',
    answer:
      'A muscle can only pull when it contracts; it cannot push. So a second muscle is needed to pull the bone back the other way. While one muscle of the pair contracts, the other relaxes.',
    explanation: 'Biceps and triceps, and the hamstrings and quadriceps of the thigh, are examples of antagonistic pairs.',
    memo: [
      { code: 'A', marks: 1, text: 'Muscles can only pull/contract, not push' },
      { code: 'A', marks: 1, text: 'A second muscle pulls the bone back the opposite way' },
      { code: 'A', marks: 1, text: 'One contracts while the other relaxes' },
    ],
  },
  {
    ...skeleton,
    id: 'ls4-10-osteoporosis-mcq',
    difficulty: 'Easy',
    cognitiveLevel: 1,
    marks: 2,
    prompt: 'A condition in which bones lose density and become brittle, so that they break easily, is called…',
    options: [
      { id: 'a', label: 'arthritis' },
      { id: 'b', label: 'osteoporosis' },
      { id: 'c', label: 'rickets' },
      { id: 'd', label: 'cramp' },
    ],
    correctOptionId: 'b',
    answer: 'osteoporosis',
    explanation: 'Osteoporosis is most common in older people, especially women after menopause.',
    memo: [{ code: 'A', marks: 2, text: 'B: osteoporosis' }],
  },
  {
    ...skeleton,
    id: 'ls4-10-rickets-cause-prevent',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'A child’s leg bones have softened and bowed outwards because of rickets. State the cause of rickets and TWO ways it can be prevented.',
    answer:
      'Cause: a shortage of vitamin D or calcium, so the bones do not harden properly and bend under the body’s weight. Prevention: a diet with enough calcium (milk, cheese, leafy vegetables) and vitamin D (eggs, fish), and enough time in sunlight so the skin can make vitamin D.',
    explanation: 'Vitamin D helps the body absorb calcium from food, so a shortage of either leads to soft bones.',
    memo: [
      { code: 'A', marks: 1, text: 'Shortage of vitamin D or calcium' },
      { code: 'A', marks: 1, text: 'Calcium/vitamin D in the diet' },
      { code: 'A', marks: 1, text: 'Enough sunlight' },
    ],
  },
  {
    ...skeleton,
    id: 'ls4-10-arthritis-effect',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain why a person with arthritis, an inflammation of the knee joint, finds it painful to walk.',
    answer:
      'In arthritis the joint becomes inflamed and the cartilage covering the ends of the bones wears away. Without the smooth cartilage the bones rub against each other, causing pain, swelling and stiffness when the knee moves.',
    explanation: 'Cartilage normally cushions the joint and lets the bones glide over each other with little friction.',
    memo: [
      { code: 'A', marks: 1, text: 'The joint is inflamed' },
      { code: 'A', marks: 1, text: 'Cartilage wears away' },
      { code: 'A', marks: 1, text: 'Bones rub together, causing pain/stiffness' },
    ],
  },
  {
    ...skeleton,
    id: 'ls4-10-muscle-cramp-exercise',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A soccer player’s calf muscles cramp near the end of a match on a hot day: a muscle contracts and no longer relaxes. Suggest TWO reasons for the cramp.',
    answer:
      'The muscle cells may have run short of oxygen and built up lactic acid from anaerobic respiration. Heavy sweating on a hot day may have caused dehydration and a loss of salts, which muscles need to contract and relax normally.',
    explanation: 'Stretching gently, drinking fluids with salts and resting help a cramp to pass.',
    memo: [
      { code: 'A', marks: 1, text: 'Lack of oxygen / lactic acid build-up' },
      { code: 'A', marks: 1, text: 'Dehydration' },
      { code: 'A', marks: 1, text: 'Loss of salts in sweat' },
    ],
  },
  {
    ...skeleton,
    id: 'ls4-10-bone-density-age-data',
    difficulty: 'Challenge',
    cognitiveLevel: 4,
    marks: 4,
    prompt: 'Describe the trend in the data, and suggest TWO things a young woman could do now to reduce her risk of osteoporosis later.',
    context: 'Average bone density in women (relative units) by age: 20 years — 100; 35 years — 100; 50 years — 92; 65 years — 78; 80 years — 68.',
    answer:
      'Bone density stays at its peak from about 20 to 35, then decreases, falling faster after 50. To reduce her risk: eat enough calcium and vitamin D now to build up a high peak bone density, and do regular weight-bearing exercise such as walking, running or dancing; avoid smoking and heavy drinking.',
    explanation: 'The higher the peak bone density built in youth, the longer it takes for bones to become dangerously brittle later.',
    memo: [
      { code: 'A', marks: 1, text: 'Density stays high until about 35' },
      { code: 'A', marks: 1, text: 'then falls, faster after 50' },
      { code: 'A', marks: 1, text: 'Calcium and vitamin D in the diet' },
      { code: 'A', marks: 1, text: 'Weight-bearing exercise / no smoking' },
    ],
  },
  {
    ...skeleton,
    id: 'ls4-10-tendon-muscle-pull',
    difficulty: 'Moderate',
    cognitiveLevel: 2,
    marks: 3,
    prompt: 'Explain how the biceps muscle is able to move the bones of the forearm.',
    answer:
      'The biceps is attached to the bones by tendons, which do not stretch. When the biceps contracts it shortens and pulls on the tendon attached to the radius, below the elbow. The elbow acts as a pivot, so the forearm is lifted.',
    explanation: 'The bones act as levers and the joint as the pivot; the muscle supplies the pulling force.',
    memo: [
      { code: 'A', marks: 1, text: 'Tendons attach the muscle to the bone' },
      { code: 'A', marks: 1, text: 'The contracting biceps pulls on the forearm bone' },
      { code: 'A', marks: 1, text: 'The elbow acts as a pivot, so the forearm lifts' },
    ],
  },
  {
    ...skeleton,
    id: 'ls4-10-sprain-vs-strain',
    difficulty: 'Challenge',
    cognitiveLevel: 3,
    marks: 3,
    prompt: 'A netball player twists her ankle and tears a ligament; another player overstretches the muscles of his thigh and tears some of their fibres. Explain why the first injury is a sprain and the second a strain.',
    answer:
      'A sprain is an injury to a ligament, which joins bone to bone at a joint, so the twisted ankle is a sprain. A strain is an injury to a muscle or the tendon that joins it to bone, so the torn thigh muscle fibres are a strain.',
    explanation: 'Both need rest, ice, compression and elevation at first; a badly torn ligament may need surgery.',
    memo: [
      { code: 'A', marks: 1, text: 'A sprain is an injury to a ligament (bone to bone)' },
      { code: 'A', marks: 1, text: 'A strain is an injury to a muscle/tendon' },
      { code: 'A', marks: 1, text: 'So the ankle is a sprain and the thigh a strain' },
    ],
  },
)

export const lifeSciThinQuestions: Question[] = out
