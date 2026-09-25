import type { Question, TreeSpec, VennSpec } from '@/types'
import { getTopicNote, type SubtopicNote } from '@/data/topicNotes'

/**
 * Which sub-topic a question belongs to.
 *
 * Practise used to render a topic as one undifferentiated list. Finance holds
 * well over a thousand items, so a learner who is weak on taxation had to read
 * past tariffs, budgets and break-even to find one. Grouping the list under the
 * sub-topic headings the notes already use fixes that, and lets the explanation
 * for a sub-topic sit directly above the questions that drill it.
 *
 * Questions carry no sub-topic field -- there are thousands of them across the
 * papers, and hand-tagging every one is not something anybody would ever finish
 * or keep up to date. So classification is done from the wording, by a short
 * ordered rule list per topic. The rules live here, in one reviewable file:
 * a mis-filed question is a one-line fix, not a data migration.
 *
 * Order matters -- the FIRST matching rule wins, so narrower rules come first.
 * "Calculate the VAT on the municipal account" must land in Taxation, not in
 * Tariffs, so the VAT rule is written above the tariff rule.
 *
 * Anything that matches nothing goes to the end, under its own heading, rather
 * than being silently dropped or forced into a sub-topic it does not belong to.
 */

export interface SubtopicRule {
  /** Must match a sub-topic `name` in the topic's note, exactly. */
  name: string
  match: RegExp
}

/** Questions that matched no rule. Named rather than hidden. */
export const UNSORTED = 'More questions on this topic'

const rules: Record<string, SubtopicRule[]> = {
  // ---------------------------------------------------------------- Mat Lit
  finance: [
    {
      name: 'Taxation: income tax, VAT and UIF',
      match: /\b(vat|value[- ]added tax|income tax|tax(able|ation)?|sars|uif|rebate\w*|tax bracket|zero[- ]rated|paye|pension fund|tax threshold)\b/i,
    },
    {
      name: 'Exchange rates and inflation',
      match: /\b(exchange rate|inflation|currency|rand|dollar|euro|pound|usd|gbp|per dollar|cpi)\b/i,
    },
    {
      name: 'Break-even, profit and business decisions',
      match: /\b(break[- ]?even|profit|loss|selling price|cost price|mark[- ]?up|revenue|fixed cost\w*|variable cost|income and expenditure of the business)\b/i,
    },
    {
      name: 'Interest, loans and investments',
      match: /\b(interest|loan|invest(ment|ed|s)?|compound|simple interest|instalment|instalments|repay|borrow|bond|fixed deposit)\b/i,
    },
    {
      name: 'Tariffs and municipal accounts',
      match: /\b(tariff|kwh|kilowatt|municipal|electricity|water usage|kilolitre\w*|kl\b|airtime|cellphone contract|per minute|fixed charge|step(ped)? tariff|block)\b/i,
    },
    {
      name: 'Financial documents: payslips, bills and statements',
      match: /\b(payslip|pay slip|gross salary|net salary|deduction|bank statement|till slip|invoice|receipt|statement|pension|medical aid|basic salary)\b/i,
    },
    {
      name: 'Income, expenditure and household budgets',
      match: /\b(budget|expenditure|expenses?|income|surplus|shortfall|deficit|balance|savings?)\b/i,
    },
    {
      name: 'Number formats, rounding and percentages',
      match: /\b(round(ed|ing)?|percentage|percent\w*|decimal place|ratio|increase(d)? by|decrease(d)? by)\b/i,
    },
  ],

  'data-handling': [
    {
      name: 'Probability, chance and relative frequency',
      match: /\b(probabilit\w*|chance|likelihood|relative frequency|random(ly)?|at least one|outcome)\b/i,
    },
    {
      name: 'Misleading graphs and data quality',
      match: /\b(mislead\w*|distort\w*|biased|valid(ity)?|representative|does not start at zero|justify (the|this) conclusion)\b/i,
    },
    {
      name: 'Spread: range, quartiles, percentiles and box-and-whisker',
      // "percentile" is here because the Grade 12 ATP teaches it alongside the
      // quartiles, which are themselves the 25th and 75th percentiles -- and a
      // BMI-for-age chart is read by percentile. With no stem for it, those
      // questions fell through to Reading values off tables and graphs.
      match: /\b(range|quartile|q1|q3|interquartile|iqr|box[- ]and[- ]whisker|five[- ]number|spread|outlier|percentile\w*)\b/i,
    },
    {
      name: 'Representing data in tables and graphs',
      match: /\b(bar graph\w*|histogram\w*|pie chart\w*|line graph\w*|frequency polygon\w*|draw (a|the) graph|tally|frequency table\w*|compound bar|stacked)\b/i,
    },
    {
      name: 'Mean, median and mode',
      match: /\b(mean|median|mode|modal|average)\b/i,
    },
    {
      // Reading a value off has to be asked BEFORE interpreting, because the
      // interpreting rule matches "graph" on its own and would take every
      // read-off question that happens to mention one. These are the Level 1
      // half of the topic -- "write down the spending in Week 4", "in which
      // month was rainfall lowest" -- and 186 Data Handling questions were
      // unfiled, most of them this shape or a percentage.
      name: 'Reading values off tables and graphs',
      match:
        /\bwrite down the\b|\bin which (week|month|day|year|quarter|term|category)\b|\b(highest|lowest|most|fewest|greatest|smallest|maximum|minimum) (number|amount|value|sales|spending|income|rainfall|attendance)\b|\bwas (the )?(highest|lowest|fewest|most)\b|\bread off\b/i,
    },
    {
      name: 'Interpreting and comparing graphs',
      match: /\b(graph|trend|compare|interpret|according to the (graph|table)|increase(d)? from)\b/i,
    },
    {
      // Nearly half the unfiled Data Handling questions mentioned a
      // percentage. Working a proportion out of a data set is its own skill,
      // and it sits below the more specific rules so that "the mean
      // percentage" still goes to averages.
      name: 'Percentages and proportions in data',
      // "per cent" as two words is deliberately absent. It never fires -- this
      // corpus writes "percentage" -- and the fix the rule checker suggests for
      // a dead stem, "per cent\w*", would match "per centimetre", which is a
      // rate and not a percentage at all.
      match: /\b(percentage|percent\w*|proportion|as a fraction of|out of the total)\b/i,
    },
    {
      name: 'Collecting and organising data',
      match: /\b(sample|population|survey|questionnaire|collect\w*|discrete|continuous|class interval\w*|grouped data)\b/i,
    },
  ],

  'maps-plans': [
    {
      name: 'Models, assembly diagrams and instructions',
      // "net", "flat-pack" and "parts list" belong here too: a packaging net and
      // a flat-pack parts list are both the CAPS "models and assembly" skill,
      // and without them such questions were taken by the packing-plans and
      // floor-plans rules further down.
      match: /\b(model|assembl\w*|instruction|kit|scale model|prototype|flat[- ]?pack|parts list|net of|into a net)\b/i,
    },
    {
      name: 'Seating, layout and packing plans',
      match: /\b(seat(ing|s)?|pack(ing|ed)?|fit into|layout|arrangement|stand|row [a-z0-9]|how many .* fit)\b/i,
    },
    {
      name: 'Floor plans and elevation drawings',
      match: /\b(floor plan|elevation|building plan|room|tile|tiling|skirting|paint|window|door|north elevation|carpet)\b/i,
    },
    {
      name: 'Route planning and travel time',
      match: /\b(route|travel|journey|speed|km\/h|distance table|arrive|depart|petrol|fuel|trip|driving)\b/i,
    },
    {
      name: 'Distance, direction and bearings',
      match: /\b(bearing|direction|compass|north|south|east|west|degrees? (clockwise|from north))\b/i,
    },
    {
      name: 'Scale: number scales and bar scales',
      match: /\b(scale|1\s*:\s*\d|bar scale|number scale|actual (distance|length)|real (distance|length))\b/i,
    },
  ],

  measurement: [
    {
      // The degree symbols sit OUTSIDE the \b(...)\b group on purpose. A leading
      // \b before "°" demands a word character immediately before it, so "350 °F"
      // -- with the space a unit normally takes -- never matched, and every
      // temperature-conversion question fell through to another sub-topic.
      name: 'Time, temperature and reading instruments',
      match:
        /(°\s*[cf]\b)|\b(temperature|celsius|fahrenheit|thermometer|24[- ]hour|12[- ]hour|clock|time taken|time zone|what time|elapsed|reading on the|marked every|accurate to within)\b/i,
    },
    {
      // A question that SAYS convert is a conversion question, whatever unit it
      // happens to convert. This rule has to sit above the quantity rules
      // below, because they match on the unit: "Convert 6 000 litres to
      // kilolitres" was landing in Volume and capacity, and so were "Convert
      // 2,7 m³ to litres" and "Which unit is most appropriate for the height?"
      // -- 19 of the 76 questions in that bucket. The cost was paid by the one
      // week that most needs them: Conversions is an ATP heading of its own,
      // and its bucket was missing every conversion that named a volume.
      name: 'Units and conversions',
      match:
        /\b(convert|conversion table|conversion factor)\b|\b(which|what) unit\b|\bunit (used to measure|of measurement)\b|most appropriate (unit|instrument)\b/i,
    },
    {
      name: 'Mass, rates and practical calculations',
      // BMI is here because the formula is a mass divided by a squared length,
      // a practical calculation of exactly this kind, and the Grade 12 ATP
      // lists it under Measurement.
      match: /\b(rate|per (litre|kg|hour|minute)|consumption|flow|recipe|dosage|dose|fuel|BMI|body mass index)\b|ℓ\/100/i,
    },
    {
      name: 'Surface area',
      match: /\b(surface area|total area of (all|every|the) (faces?|sides?)|paint the outside|wrap)\b/i,
    },
    {
      // THE SUPERSCRIPT UNITS USED TO BE DEAD. "m³" and "cm³" sat inside the
      // \b(...)\b group, and a word boundary cannot follow "³" when the next
      // character is a space -- neither side is a word character, so there is
      // no boundary to match. The stems therefore never fired once in the
      // whole corpus, which is why "1 ton of maize occupies approximately
      // 1,3 m³" was landing in Units and conversions on the strength of the
      // word "in". This is the same bug as f′ in the Calculus rule and f⁻¹
      // before it: a superscript is not a word character, so it has to sit
      // OUTSIDE the group. "m³" also catches "cm³" as a suffix, which is the
      // same bucket, so one stem does both.
      //
      // "holds?" was a stem here too, and it was pulling in "whether the
      // guarantee holds" and "why the claim holds" -- neither of which is
      // about capacity -- along with "the 6 m² coop could hold", which is an
      // area question. Of the seven questions it placed on its own, three were
      // wrong, so it was dropped. Replacements that require a number after it
      // ("holds 10 tins") were tried and scored no better: they keep "Boxes
      // hold 20 tiles covering 0,8 m²" in the wrong bucket. Nothing was lost
      // that the fixed m³ stem does not now place correctly.
      name: 'Volume and capacity',
      match: /\b(volume|capacity|litres?|cubic|fill(ed)? (the|a)? ?(tank|container))\b|m³/i,
    },
    {
      // Same dead-stem fix as above: "m²" outside the group, where it can
      // actually match, and it covers "cm²" and "km²" as suffixes.
      name: 'Area',
      match: /\b(area|square metre|tiles? needed|coverage)\b|m²/i,
    },
    {
      // "fenc(e|ing)" used to be a stem here and was filing the wrong things:
      // "Calculate the AREA of the fence" and "the fence needs 3,6 litres of
      // paint" are not perimeter questions. Every genuine perimeter question in
      // the corpus says "perimeter" in so many words -- including the ones
      // about fencing, "Fencing the 320 m perimeter is quoted at R14 400" --
      // so the stem only ever cost accuracy.
      name: 'Perimeter and distance around a shape',
      match: /\b(perimeter|circumference|around the (outside|edge)|border)\b/i,
    },
    {
      name: 'Units and conversions',
      match: /\b(convert|conversion|in (millimetres|centimetres|metres|kilometres|grams|kilograms)|mm|cm|km|kg)\b|\bmℓ/i,
    },
  ],

  // ---------------------------------------------------------- Life Sciences
  //
  // Life Sciences was left almost entirely to the vocabulary scorer, and it was
  // the weakest subject for it: 530 of 2 144 questions, 24,7%, ended up in the
  // unsorted bucket, and Photosynthesis in Grade 11 put 40 of its 67 there.
  //
  // The reason was not that the scorer is bad. It was that the sub-topic NAMES
  // and the question WORDING are different vocabularies. A note headed "The
  // light phase" has to catch "describe the light-DEPENDENT reactions"; a topic
  // whose three headings are all about a process has nothing to catch "define
  // photosynthesis", "write the word equation" or "describe two structural
  // adaptations of a leaf" -- which between them were most of the bucket.
  //
  // So each topic below gets rules written against the words the questions
  // actually use, and the topics that were missing whole areas of their own
  // syllabus gained sub-topics for them, with the note content to match.
  //
  // ORDER IS SIGNIFICANT, first match wins. Structure rules come before process
  // rules, because "where in the chloroplast do the light-dependent reactions
  // occur" is a question about the chloroplast. Definition rules come LAST, as
  // the catch-all for "define", "what is meant by" and "state the equation".
  'life-sci-response-humans': [
    {
      name: 'The brain and its parts',
      match: /\b(brain|cerebrum|cerebral|cortex|cerebell\w*|medulla|hypothalamus|corpus callosum|mening\w*|cerebrospinal|hemisphere\w*)\b/i,
    },
    { name: 'The eye', match: /\b(eye|retina|cornea|lens|iris|pupil|optic nerve|rod\w*|cone\w*|accommodat\w*|blind spot|fovea|aqueous|vitreous)\b/i },
    { name: 'The ear', match: /\b(ear|cochlea|ossicle\w*|malleus|incus|stapes|eardrum|tympan\w*|semicircular|eustachian|auditory|balance)\b/i },
    {
      name: 'Nervous system and the reflex arc',
      match: /\b(reflex|neuron\w*|neurone\w*|synapse\w*|spinal cord|impulse\w*|myelin|axon|dendrite\w*|effector|receptor|motor|sensory)\b/i,
    },
    {
      name: 'Key terms in responding to the environment',
      match: /\b(define|what is meant by|stimulus|stimuli|response|voluntary|involuntary|central nervous|peripheral)\b/i,
    },
  ],
  'life-sci-endocrine-homeostasis': [
    { name: 'Blood glucose control', match: /\b(glucose|insulin|glucagon|glycogen|diabet\w*|pancreas|blood sugar)\b/i },
    {
      name: 'Temperature and water',
      match: /\b(thermoregulat\w*|temperature|sweat\w*|shiver\w*|vasodilat\w*|vasoconstrict\w*|ADH|osmoregulat\w*|water balance|aldosterone)\b/i,
    },
    {
      name: 'Glands and hormones',
      match: /\b(pituitary|thyroid|thyroxin\w*|adrenal|adrenalin\w*|gonad\w*|growth hormone|secret\w*|gland\w*)\b/i,
    },
    {
      name: 'Key terms, and the endocrine system compared with the nervous system',
      match: /\b(define|what is meant by|endocrine|hormone\w*|homeostasis|negative feedback|target organ|compare\w*|nervous system)\b/i,
    },
  ],
  'life-sci-dna-code': [
    { name: 'Replication', match: /\b(replicat\w*|semi[- ]conservative|DNA polymerase|unzip\w*|template strand)\b/i },
    {
      name: 'Protein synthesis and mutation',
      match: /\b(transcription|translation|mRNA|tRNA|ribosome\w*|codon\w*|anticodon\w*|polypeptide|mutation\w*|protein synthesis)\b/i,
    },
    {
      name: 'Structure',
      match: /\b(double helix|nucleotide\w*|deoxyribose|ribose|base pair\w*|adenine|thymine|guanine|cytosine|uracil|hydrogen bond\w*|structure)\b/i,
    },
    {
      name: 'Key terms in DNA and protein synthesis',
      match: /\b(define|what is meant by|gene\w*|allele\w*|chromosome\w*|chromatid\w*|genetic code|triplet|DNA|RNA)\b/i,
    },
  ],
  'life-sci-meiosis': [
    { name: 'Meiosis I', match: /\b(prophase i\b|metaphase i\b|anaphase i\b|telophase i\b|crossing over|chiasma\w*|bivalent|homologous pair\w*|random assortment|first division)\b/i },
    { name: 'Meiosis II', match: /\b(prophase ii|metaphase ii|anaphase ii|telophase ii|second division|sister chromatid\w* separate)\b/i },
    { name: 'Variation and errors', match: /\b(variation|non[- ]disjunction|down syndrome|trisomy|abnormal\w*|error\w*|mutation\w*)\b/i },
    {
      name: 'What meiosis is, and why it matters',
      match: /\b(define|what is meant by|meiosis|haploid|diploid|gamete\w*|halve\w*|significance|importance|compare\w* .*mitosis|differs? from mitosis)\b/i,
    },
  ],
  'life-sci-genetics': [
    { name: 'Dihybrid crosses and pedigrees', match: /\b(dihybrid|pedigree|family tree|9\s*:\s*3\s*:\s*3\s*:\s*1|two characteristic\w*)\b/i },
    { name: 'Sex linkage and DNA profiling', match: /\b(sex[- ]linked|sex linkage|colour blind\w*|haemophili\w*|X chromosome|Y chromosome|carrier\w*|DNA profil\w*|paternity|forensic\w*)\b/i },
    { name: 'Monohybrid crosses', match: /\b(monohybrid|punnett|cross\w*|f1|f2|3\s*:\s*1|1\s*:\s*1|offspring|ratio)\b/i },
    {
      name: 'Key terms in genetics',
      match: /\b(define|what is meant by|genotype\w*|phenotype\w*|homozygous|heterozygous|dominant|recessive|codominan\w*|incomplete dominance|test cross|locus|loci)\b/i,
    },
  ],
  'life-sci-respiration': [
    {
      name: 'Respiration during exercise and oxygen debt',
      match: /\b(exercise|athlete\w*|oxygen debt|lactic acid|fatigue|cramp\w*|vigorous|training|recover\w*|after .*stops?)\b/i,
    },
    { name: 'Anaerobic respiration', match: /\b(anaerobic|ferment\w*|ethanol|alcohol|yeast|without oxygen)\b/i },
    { name: 'Comparison with photosynthesis', match: /\b(compare\w* .*photosynthesis|photosynthesis and respiration|opposite\w*)\b/i },
    { name: 'Aerobic respiration', match: /\b(aerobic|mitochondri\w*|krebs|glycolysis|electron transport|oxidative)\b/i },
    {
      name: 'Key terms in respiration',
      match: /\b(define|what is meant by|cellular respiration|respiration|ATP|energy|word equation|breathing)\b/i,
    },
  ],
  'life-sci-excretion': [
    { name: 'The nephron', match: /\b(nephron|glomerul\w*|bowman\w*|convoluted tubule|loop of henle|collecting duct|ultrafiltration|reabsorb\w*|filtrate)\b/i },
    { name: 'Homeostasis', match: /\b(ADH|osmoregulat\w*|homeostasis|water balance|concentrated urine|dilute urine|negative feedback)\b/i },
    {
      name: 'The kidney: structure and key terms',
      match: /\b(define|what is meant by|kidney\w*|cortex|medulla|pelvis|renal|ureter\w*|urethra|bladder|deamination|urea|dialys\w*|excretion|egestion)\b/i,
    },
    { name: 'Excretory organs', match: /\b(lung\w*|skin|liver|sweat|excretory organ\w*)\b/i },
  ],
  'life-sci-biodiversity-animals': [
    { name: 'Invertebrate phyla', match: /\b(porifera|cnidaria|platyhelminth\w*|annelid\w*|arthropod\w*|mollusc\w*|echinoderm\w*|nematod\w*|sponge\w*|worm\w*|insect\w*)\b/i },
    { name: 'Chordates', match: /\b(chordate\w*|notochord|vertebrate\w*|fish|amphibian\w*|reptil\w*|bird\w*|mammal\w*)\b/i },
    {
      name: 'Key terms in animal classification',
      match: /\b(define|what is meant by|symmetr\w*|cephalisation|coelom\w*|endotherm\w*|ectotherm\w*|invertebrate\w*|bilateral|radial)\b/i,
    },
    { name: 'Structure and lifestyle', match: /\b(structure|lifestyle|habitat|adapt\w*|locomot\w*|feed\w*)\b/i },
  ],
  'life-sci-mitosis': [
    { name: 'The four phases', match: /\b(prophase|metaphase|anaphase|telophase|spindle|equator|centromere\w* split|phases? of mitosis)\b/i },
    { name: 'Cytokinesis and cancer', match: /\b(cytokinesis|cleavage furrow|cell plate|cancer|tumour|malignant|benign|metastas\w*|uncontrolled)\b/i },
    { name: 'Interphase', match: /\b(interphase|g1|g2|s phase|cell cycle|replicat\w*)\b/i },
    {
      name: 'What mitosis is, and why it matters',
      match: /\b(define|what is meant by|mitosis|growth|repair|asexual|identical|significance|importance|chromatid\w*)\b/i,
    },
  ],
  'life-sci-plant-tissues': [
    {
      name: 'Meristems and the dicotyledonous root and stem',
      match: /\b(meristem\w*|apical|lateral meristem\w*|intercalary|cambium|dicotyledonous|dicot|root hair\w*|pericycle|endodermis|cortex|secondary growth|stem)\b/i,
    },
    { name: 'Vascular tissue', match: /\b(xylem|phloem|vessel\w*|tracheid\w*|sieve tube\w*|companion cell\w*|lignin|vascular)\b/i },
    { name: 'The leaf in section', match: /\b(leaf|palisade|spongy|mesophyll|stoma|stomata|guard cell\w*|cuticle|epidermis)\b/i },
    { name: 'Ground and protective tissues', match: /\b(parenchyma|collenchyma|sclerenchyma|ground tissue|protective|epiderm\w*|cork)\b/i },
  ],
  'life-sci-animal-tissues': [
    { name: 'Muscle and nervous tissue', match: /\b(muscle|cardiac|skeletal|smooth muscle|striated|nervous tissue|neuron\w*|neurone\w*|axon|dendrite\w*)\b/i },
    { name: 'Connective tissue', match: /\b(connective|cartilage|bone|tendon\w*|ligament\w*|adipose|blood|matrix|collagen|fibroblast\w*)\b/i },
    { name: 'Epithelial tissue', match: /\b(epitheli\w*|squamous|cuboidal|columnar|ciliated|glandular|lining|cover\w*)\b/i },
    {
      name: 'Levels of organisation and what a tissue is',
      match: /\b(define|what is meant by|tissue\w*|organ\w*|level\w* of organisation|four (basic )?types)\b/i,
    },
  ],
  'life-sci-photosynthesis': [
    {
      name: 'The leaf and chloroplast as structures for photosynthesis',
      match:
        /\b(leaf|leaves|chloroplast\w*|organelle|palisade|mesophyll|stoma|stomata|guard cell\w*|grana|granum|thylakoid|stroma|vascular bundle\w*|xylem|phloem|vein\w*|chlorophyll|pigment|adaptation\w*|structural|cuticle|epidermis|air space\w*)\b/i,
    },
    {
      name: 'Limiting factors',
      match: /\b(limiting factor\w*|light intensity|rate of photosynthesis|plateau|levels? off|bubbles? per)\b/i,
    },
    {
      name: 'The light phase',
      match: /\b(light[- ]dependent|light phase|photolysis|split\w* of water|ADP|NADP|inorganic phosphate)\b/i,
    },
    {
      name: 'The dark phase (Calvin cycle)',
      match: /\b(dark phase|light[- ]independent|calvin|carbon (dioxide )?fixation|fixed and reduced)\b/i,
    },
    {
      name: 'What photosynthesis is, and its equation',
      match:
        /\b(define|what is meant by|word equation|overall equation|equation|raw materials?|products?|autotroph\w*|two (main )?stages|by-?product)\b/i,
    },
  ],
  'life-sci-biodiversity-microorganisms': [
    // "Name the kingdom fungi belong to" is a question about fungi, so naming a
    // group beats naming the hierarchy. Written the other way round this rule
    // was fully shadowed -- all 12 of its questions went to the two below it.
    { name: 'The main groups', match: /\b(fungi|fungus|protist\w*|algae|amoeba|paramecium|yeast|mould)\b/i },
    {
      name: 'Viruses and bacteria: structure and nutrition',
      match:
        /\b(virus\w*|viral|capsid|bacteri\w*|prokaryot\w*|plasmid|cocci|coccus|bacillus|bacilli|spirill\w*|saprophyt\w*|parasit\w*|heterotroph\w*|autotroph\w*|nutrition|living)\b/i,
    },
    {
      name: 'Key terms and the classification hierarchy',
      match:
        /\b(taxonom\w*|classif\w*|kingdom\w*|phylum|phyla|genus|species|binomial|nomenclature|hierarch\w*|define|what is meant by|monera|protista)\b/i,
    },
    {
      name: 'Roles of micro-organisms',
      match: /\b(beneficial|harmful|decompos\w*|nitrogen[- ]fixing|antibiotic\w*|ferment\w*|yoghurt|cheese|sewage|disease|spoil\w*)\b/i,
    },
  ],
  'life-sci-chemistry-of-life': [
    {
      name: 'Structure of the biological molecules',
      match:
        /\b(monosaccharide\w*|disaccharide\w*|polysaccharide\w*|glycerol|fatty acid\w*|triglyceride|saturated|unsaturated|amino acid\w*|peptide bond\w*|primary|secondary|tertiary|quaternary|nucleotide\w*|structure of|three[- ]dimensional)\b/i,
    },
    {
      name: 'Enzymes',
      match: /\b(enzym\w*|active site|substrate|denatur\w*|catalys\w*|optimum (pH|temperature)|lock and key)\b/i,
    },
    {
      name: 'Organic compounds and food tests',
      match: /\b(benedict\w*|iodine|biuret|emulsion test|food test\w*|test for (starch|glucose|protein|lipid))\b/i,
    },
    {
      name: 'Inorganic compounds',
      match: /\b(water|mineral\w*|inorganic|ion\w*|nitrate\w*|phosphate\w*|magnesium|calcium|iron)\b/i,
    },
    {
      name: 'Key terms and the molecules of life',
      match:
        /\b(define|what is meant by|organic|carbohydrate\w*|lipid\w*|protein\w*|nucleic acid\w*|monomer\w*|polymer\w*|condensation|hydrolysis|four (groups|types)|elements?)\b/i,
    },
  ],
  'life-sci-evolution': [
    {
      name: 'Fossils and the fossil record',
      match:
        /\b(fossil\w*|sediment\w*|trace fossil\w*|coprolite\w*|radiometric|relative dating|transitional|cradle of humankind|australopithecus|homo naledi|sediba|africanus|preserv\w*)\b/i,
    },
    {
      name: 'Speciation and human evolution',
      match: /\b(speciation|reproductive isolation|geographic\w* isolat\w*|allopatric|sympatric|hominid\w*|bipedal\w*|out of africa|common ancestor)\b/i,
    },
    {
      name: 'Evidence for evolution',
      match: /\b(homologous|analogous|vestigial|embryolog\w*|biogeograph\w*|comparative anatomy|evidence for)\b/i,
    },
    {
      name: 'Natural selection',
      match: /\b(natural selection|selective pressure|survival of the|darwin|lamarck|resistan\w*|selected (for|against)|overproduc\w*)\b/i,
    },
    {
      name: 'Key terms in evolution',
      match:
        /\b(define|what is meant by|evolution|variation|adaptation\w*|fitness|gene pool|allele frequenc\w*|population|term)\b/i,
    },
  ],
  'life-sci-biodiversity-plants': [
    // Naming a plant group is unambiguous, and must be asked before the flower
    // rule: written after it, a question about a fern's gametes or a conifer's
    // seeds went to "the flower", which has neither. Both of these rules were
    // fully shadowed until they were moved above it.
    {
      name: 'The four groups',
      match: /\b(bryophyt\w*|moss\w*|pteridophyt\w*|fern\w*|gymnosperm\w*|angiosperm\w*|conifer\w*|monocot\w*|dicot\w*|spore\w*|four groups)\b/i,
    },
    {
      name: 'Adaptations to land',
      match: /\b(adapt\w* to (life on )?land|terrestrial|desicc\w*|water loss|cuticle|waxy)\b/i,
    },
    {
      name: 'The flower, pollination and fertilisation',
      match:
        /\b(flower\w*|sepal\w*|petal\w*|stamen\w*|anther\w*|filament\w*|carpel\w*|pistil\w*|stigma\w*|style|ovary|ovule\w*|pollen|pollinat\w*|self[- ]pollinat\w*|cross[- ]pollinat\w*|fertilis\w*|seed\w*|fruit\w*|dispersal|gamete\w*|insect[- ]pollinated|wind[- ]pollinated)\b/i,
    },
    {
      name: 'Reproduction in angiosperms',
      match: /\b(define|what is meant by|alternation of generations|gametophyte|sporophyte|reproduc\w*)\b/i,
    },
  ],
  'life-sci-human-reproduction': [
    {
      name: 'Contraception and reproductive health',
      match:
        /\b(contracept\w*|condom\w*|diaphragm|the pill|vasectomy|tubal ligation|sterilis\w*|intra[- ]uterine|IUD|prevent\w* pregnanc\w*|sexually transmitted|STI\w*)\b/i,
    },
    {
      name: 'The menstrual cycle',
      match: /\b(menstrual|menstruation|ovulation|endometrium|FSH|LH|oestrogen|progesterone|day \d+ of the cycle)\b/i,
    },
    {
      name: 'Fertilisation and development',
      match: /\b(fertilis\w*|zygote|implant\w*|placenta|umbilical|amnion|amniotic|gestation|embryo|foetus|fetus)\b/i,
    },
    {
      name: 'Gametogenesis',
      match: /\b(gametogenesis|spermatogenesis|oogenesis|sperm\w*|ovum|ova|testis|testes|ovary|ovaries|seminiferous|reproductive system|vas deferens|fallopian|oviduct|uterus|scrotum|epididymis)\b/i,
    },
  ],
  'life-sci-population-ecology': [
    {
      name: 'Growth curves',
      match: /\b(growth curve\w*|exponential|logistic|lag phase|log phase|stationary|j[- ]shaped|s[- ]shaped|sigmoid)\b/i,
    },
    {
      name: 'Sampling and interactions',
      match:
        /\b(sampl\w*|quadrat\w*|mark[- ]recapture|transect|predation|competition|parasitism|mutualism|commensalism|symbio\w*|predator|prey)\b/i,
    },
    {
      name: 'Limiting factors',
      match: /\b(limiting factor\w*|density[- ]dependent|density[- ]independent|carrying capacity|resource\w* run)\b/i,
    },
    {
      name: 'Key terms and what changes population size',
      match:
        /\b(define|what is meant by|population|community|ecosystem|habitat|niche|immigration|emigration|birth rate|death rate|density|distribution|size)\b/i,
    },
  ],
  'life-sci-human-impact': [
    {
      name: 'Solid waste, plastic and what can be done',
      match:
        /\b(solid waste|plastic\w*|microplastic\w*|landfill\w*|recycl\w*|reuse|reduce|litter|packaging|marine|single[- ]use|strateg\w*|dispos\w*)\b/i,
    },
    {
      name: 'Atmosphere',
      match: /\b(atmospher\w*|greenhouse|global warming|climate change|ozone|carbon dioxide|acid rain|air pollut\w*|emission\w*)\b/i,
    },
    {
      name: 'Water and soil',
      match: /\b(water|eutrophication|algal bloom|sewage|soil|erosion|desertification|fertilis\w*|catchment|wetland\w*)\b/i,
    },
    {
      name: 'Biodiversity and solutions',
      match: /\b(biodiversity|extinct\w*|endangered|alien|invasive|indigenous|conserv\w*|poach\w*|deforest\w*|habitat loss)\b/i,
    },
    {
      name: 'Key terms, resources and sustainability',
      match:
        /\b(define|what is meant by|renewable|non[- ]renewable|sustainab\w*|ecological footprint|resource\w*)\b/i,
    },
  ],
  'life-sci-ecosystem-energy-flow': [
    {
      name: 'Key ecological terms and abiotic factors',
      match: /\b(define|what is meant by|ecological term|habitat\w*|niche\w*|biotic|abiotic|autotroph\w*|heterotroph\w*|community|ecosystem|apex predator\w*)\b/i,
    },
    { name: 'Energy loss', match: /\b(energy (loss|lost|flow|transfer\w*)|ten per cent|pyramid\w*|trophic level\w*|biomass)\b|\b10 ?%/i },
    { name: 'Effects of change', match: /\b(what would happen|removed|decline\w*|increase\w* in the population|disrupt\w*|introduc\w*|effect on the)\b/i },
    { name: 'Food chains and webs', match: /\b(food (chain|web)\w*|producer\w*|consumer\w*|decomposer\w*|predator\w*|prey|feeding relationship\w*)\b/i },
  ],
  'phys-momentum-impulse': [
    {
      name: 'Safety applications',
      match: /\b(airbag\w*|crumple zone\w*|seat ?belt\w*|helmet\w*|safety|padding|bend\w* (the|their) knees|follow through|tense the neck)\b/i,
    },
    {
      name: 'Conservation of momentum',
      match: /\b(conservation of momentum|collide\w*|collision\w*|lock together|recoil\w*|explode\w*|push off|isolated system|before and after)\b/i,
    },
    {
      name: 'Calculating momentum and impulse',
      match: /\b(momentum|impulse|change in momentum|kg·m·s|N·s|average force)\b/i,
    },
  ],
  'life-sci-transport-plants': [
    {
      name: 'Translocation in the phloem',
      match: /\b(translocat\w*|phloem|sieve (tube|plate)\w*|companion cell\w*|source|sink|sucrose|assimilate\w*)\b/i,
    },
    {
      name: 'Support in plants',
      match: /\b(support\w*|turgor|turgid|flaccid|wilt\w*|droop\w*|lignif\w*|sclerenchyma|collenchyma|rigid|dead at maturity)\b/i,
    },
    {
      name: 'Transpiration and its rate',
      match: /\b(transpir\w*|potometer|humidit\w*|wind speed|stomatal|rate of water loss|evaporat\w*)\b/i,
    },
    {
      name: 'Adaptations to reduce water loss',
      match: /\b(xerophyt\w*|sunken stomata|thick cuticle|hairs?|rolled leaf|reduce water loss|spine\w*)\b/i,
    },
    {
      name: 'Water uptake and pathway',
      match: /\b(root hair\w*|osmosis|xylem|cohesion|adhesion|transpiration stream|apoplast|symplast|uptake|pathway)\b/i,
    },
  ],
  'life-sci-response-plants': [
    {
      // Every tropism question mentions the tropism and most mention auxin, so
      // what marks this sub-topic out is the WHY -- the survival benefit --
      // rather than any term unique to it.
      name: 'Why tropisms matter',
      match:
        /\b(adaptive (significance|advantage)|survival (value|advantage)|why (this|the) (response|adaptation)|benefit to the plant|maximis\w* the light|advantage(ous)? (to|for) the (plant|seedling|root|shoot))\b/i,
    },
    { name: 'Auxin action', match: /\b(auxin|shaded side|elongat\w*|shoot tip|growing tip|hormone)\b/i },
    { name: 'Types of tropism', match: /\b(\w*tropism|\w*tropic|nastic|tendril)\b/i },
  ],
  'life-sci-animal-nutrition': [
    {
      // Named enzymes and their substrate-to-product conversions. The
      // alimentary canal rule below also talks about pepsin and amylase, so
      // this one has to come first or it is shadowed completely.
      name: 'Enzymes and their products',
      match:
        /\b(amylase|pepsin|trypsin|lipase|maltase|lactase|peptidase|name the enzyme|which enzyme|enzyme (found|secreted|produced|in)|(starch|protein|lipid|fat|maltose|peptide)s? (to|into) (maltose|amino acid|fatty acid|glucose|peptide))/i,
    },
    {
      name: 'Absorption and assimilation',
      match: /\b(absorb\w*|assimilat\w*|villus|villi|microvilli|lacteal|hepatic portal|glycogen)\b/i,
    },
    {
      name: 'The alimentary canal',
      match: /\b(alimentary|oesophagus|stomach|duodenum|small intestine|large intestine|peristalsis|bile|gall bladder|egest\w*|pH of)\b/i,
    },
  ],

  // ------------------------------------------------------ Physical Sciences
  //
  // The science subjects are otherwise classified by the vocabulary scorer
  // below, which works well where sub-topics use distinct words. These three
  // topics defeat it: their sub-topics share almost all their vocabulary, so
  // every photon question scored highest against "the photoelectric effect"
  // and every pH question against "strength and concentration", leaving
  // "Photons", "pH and Kw" and "Power and cost" permanently empty despite
  // 10, 14 and 25 questions being about exactly those things.
  //
  // Only the topics that need disambiguating are listed. A rule list does not
  // replace the scorer -- where no rule matches, the scorer still gets its
  // turn -- so these entries steer the ambiguous cases and leave the rest.
  'phys-electric-circuits': [
    {
      // Cost and the power formulae, rather than any mention of the word
      // "power", which appears throughout the internal-resistance questions.
      name: 'Power and cost',
      match:
        /\b(cost of|kilowatt[- ]?hour|kwh|units of electricity|electricity (bill|account|tariff)|power rating|rated at|energy consumed|P ?= ?VI|P ?= ?I ?²? ?R|P ?= ?V ?²? ?\/ ?R)\b/i,
    },
    {
      name: 'Internal resistance',
      match: /\b(internal resistance|emf|electromotive force|lost volts|terminal (potential|voltage))\b|ε ?=/i,
    },
    {
      name: 'Combining resistors',
      match: /\b(in series|in parallel|equivalent resistance|total resistance|combination of resistors)\b/i,
    },
  ],
  'phys-electric-circuits-g11': [
    {
      // Meter placement. The Grade 11 note has no sub-topic for it, and the
      // scorer places a question that only says "the learner connects the
      // ammeter across R2" nowhere at all. It belongs with the series work:
      // an ammeter goes in series BECAUSE the current is the same at every
      // point of a series path, which is the first point that sub-topic makes.
      // Only this one rule is written -- the rest of the topic classifies
      // well enough without help, and a fuller rule list would reshuffle
      // questions that are already in the right place.
      name: 'Series circuits',
      match: /\b(ammeter|voltmeter|circuit diagram)s?\b/i,
    },
  ],
  'phys-electrostatics': [
    {
      // Every question here is about Coulomb's law or the electric field, so
      // the scorer had nothing left to give "Working in one dimension". What
      // actually distinguishes it is the SETUP -- charges on a line, with the
      // contributions signed and added -- not the formula being used, so this
      // rule matches the arrangement and leaves the two-charge questions to
      // the scorer.
      name: 'Working in one dimension',
      match:
        /\b(on a straight line|on the x[- ]axis|collinear|same straight line|positive direction|net (electrostatic )?(force|field) (on|at)|resultant (force|field)|zero net|point where the (net )?(electric )?field is zero|midway between|three charges)\b/i,
    },
  ],
  'phys-em-radiation': [
    {
      name: 'Why it needed the photon model',
      match: /\b(wave (theory|model) (could not|cannot|fails)|classical (theory|physics)|intensity|predicted by the wave|instantaneous(ly)?)\b/i,
    },
    {
      name: 'Photons',
      match: /\b(E ?= ?hf|E ?= ?hc|planck|energy of (a|one|each|the) photon|photon energy|how many photons|number of photons)\b/i,
    },
    {
      name: 'The photoelectric effect',
      match: /\b(photoelectric|work function|threshold frequency|cut[- ]?off frequency|electrons? (are |is )?(emitted|ejected|released)|W0|maximum kinetic energy of the (emitted|ejected))\b/i,
    },
  ],
  'phys-organic-chemistry': [
    {
      name: 'Naming, formulae and isomers',
      match:
        /\b(iupac|name the following|structural formula|molecular formula|empirical formula|condensed|isomer\w*|homologous series|general formula|molar mass|aliphatic|saturated|unsaturated|draw the|longest (carbon )?chain|substituent\w*)\b/i,
    },
    {
      name: 'Reaction types',
      match:
        /\b(substitution|addition|elimination|cracking|esterification|hydrogenation|hydration|halogenation|dehydrat\w*|combustion|reaction of|react\w* with)\b/i,
    },
    {
      name: 'Physical property trends',
      match:
        /\b(boiling point\w*|melting point\w*|vapour pressure|viscosit\w*|intermolecular|van der waals|london|hydrogen bond\w*|solubilit\w*|trend|chain length|branch\w*)\b/i,
    },
    {
      name: 'Functional groups',
      match:
        /\b(functional group\w*|alkane\w*|alkene\w*|alkyne\w*|alcohol\w*|aldehyde\w*|ketone\w*|carboxyl\w*|ester\w*|haloalkane\w*|hydroxyl|carbonyl)\b/i,
    },
  ],
  'phys-acids-bases': [
    {
      name: 'Titration and hydrolysis',
      match: /\b(titrat\w*|equivalence point|end[- ]?point|indicator|burette|pipette|standard solution|hydrolys\w*|salt of a)\b/i,
    },
    {
      name: 'pH and Kw',
      match: /\b(pH|pOH|Kw|ionisation constant of water|hydronium (ion )?concentration)\b|\[H3O|\[OH/i,
    },
    {
      name: 'Strength and concentration',
      match: /\b(strong (acid|base)|weak (acid|base)|concentrated|dilute|degree of ionisation|ampholyte|conjugate)\b/i,
    },
  ],

  // ------------------------------------------------------------ Mathematics
  'math-number-systems': [
    // Estimating a surd and classifying a number both talk about "irrational"
    // and "√", so the scorer could not separate them. What is distinctive is
    // the ESTIMATING -- bracketing a surd between consecutive integers.
    {
      name: 'Estimating surds',
      match:
        /\b(estimat\w*|between which two|consecutive integers|closer to|without (using )?a calculator|perfect square|ascending order)\b/i,
    },
    { name: 'Decimals and fractions', match: /\b(recurring|terminating|decimal|fraction|numerator|denominator)\b/i },
    { name: 'The real number system', match: /\b(rational|irrational|integer|natural number|whole number|real number|undefined|non[- ]real)\b/i },
  ],

  'math-algebra': [
    // NOT "b² − 4ac": that string is the quadratic formula, which these papers
    // print in the `context` as a reference for any question that needs it. It
    // was therefore matching all 18 plain "solve using the quadratic formula"
    // questions and filing them under Nature of the roots, leaving Quadratic
    // equations permanently empty. A question that is genuinely about the
    // discriminant says so in the prompt.
    { name: 'Nature of the roots', match: /\b(nature of the roots|discriminant|real and (equal|unequal)|non[- ]real)\b/i },
    { name: 'Simultaneous equations', match: /\b(simultaneous|solve for x and y|two equations)\b/i },
    { name: 'Quadratic equations', match: /\b(quadratic|quadratic formula|complet(e|ing) the square|roots of the equation)\b|x²/i },
    { name: 'Algebraic fractions', match: /\b(fraction|denominator|numerator|lowest common denominator)\b|\bsimplify.*\//i },
    { name: 'Exponents and surds', match: /\b(exponent\w*|surd|power of|index|indices|rationalis|base)\b|√|\d\^/i },
    { name: 'Linear equations and inequalities', match: /\b(inequalit|interval notation|number line|solve for x\b|linear equation)\b/i },
    { name: 'Word problems and setting up equations', match: /\b(consecutive|the sum of two numbers|word problem|let x be|three times as)\b/i },
    { name: 'Simplifying and factorising expressions', match: /\b(factoris\w*|factor|simplify|expand\w*|difference of two squares|trinomial|grouping)\b/i },
  ],

  'math-functions': [
    // ⁻¹ against any function letter, not f alone: a question about g⁻¹ is no
    // less an inverse question, and "inverse" itself often appears only in the
    // answer, which the classifier does not read.
    // The ⁻¹ alternative sits OUTSIDE the \b(...)\b wrapper. A superscript is
    // not a word character, so a trailing \b after "g⁻¹" can never hold and the
    // alternative would silently never fire -- which is what the original
    // `f⁻¹` inside the group was doing.
    { name: 'Inverse functions', match: /\b(inverse|reflect\w* in the line y = x|one[- ]to[- ]one)\b|[a-z]⁻¹/i },
    { name: 'Transformations of graphs', match: /\b(transform\w*|shift\w*|translat\w*|reflect\w*|stretch\w*|shrink\w*|moved .* units)\b/i },
    { name: 'Exponential and logarithmic functions', match: /\b(exponential|logarith\w*|log\b|grow\w*|decay\w*|doubling time|half[- ]life|b\^x)\b/i },
    { name: 'Hyperbolic functions', match: /\b(hyperbola|hyperbolic|asymptote|a ÷ \(x)\b/i },
    { name: 'Quadratic functions (parabolas)', match: /\b(parabola|turning point|axis of symmetry|maximum value of the (function|graph))\b|x²/i },
    { name: 'Linear functions', match: /\b(straight line|linear function|y = mx|gradient of the line|y[- ]intercept)\b/i },
    {
      // Substituting a value into a named rule is its own skill and had no
      // rule at all: "given f(x) = 2x + 3, determine f(4)" was 77 unfiled
      // questions. It has to be asked before the graph rules, which match on
      // "intercept" and would take f(0).
      name: 'Function notation and evaluating a function',
      match: /\b[a-z]\((-?\d|x\)\s*=)/,
    },
    // This rule is fully shadowed, and deliberately so. Once the dead "x²" stem
    // above was repaired, every question it would have caught turned out to
    // name a function type as well -- "determine for which values of x the
    // graph of f(x) = x² − 4 lies below the x-axis" is a parabola question
    // whatever else it is, and a learner revising parabolas wants it in that
    // bucket. Reading the graph is a skill the other sub-topics all exercise
    // rather than a topic of its own, so the heading stays, holds nothing, and
    // Practise shows it as "none yet" -- which is the truth about this corpus.
    { name: 'Interpreting graphs', match: /\b(intercept|domain|range|point(s)? of intersection|f\(x\) *[<>]|read off the graph|sketch)\b/i },
  ],

  'math-trigonometry': [
    { name: 'Sine, cosine and area rules in 2D and 3D', match: /\b(sine rule|cosine rule|area rule|triangle abc|3d|three[- ]dimensional)\b/i },
    { name: 'Trigonometric graphs', match: /\b(period|amplitude|trig(onometric)? graph|(sketch|graphs? of|drawn) .{0,40}(sin|cos|tan))\b/i },
    { name: 'Trigonometric equations and general solution', match: /\b(general solution|solve the equation)\b|\bsolve for θ|\bk ?∈ ?ℤ/i },
    { name: 'Identities', match: /\b(identit\w*|prove that|compound angle|double angle|sin ?2|cos ?2)\b|\bsin²|\bcos²/i },
    // "cast diagram" and "cast rule", not a bare "cast" -- a shadow cast by a
    // flagpole is a perfectly ordinary trigonometry question about something
    // else entirely.
    // The 180°/360° alternatives sit OUTSIDE the \b(...)\b wrapper. They end
    // in an operator, and an operator is not a word character, so a trailing
    // \b after "180° +" can never hold -- both were silently dead.
    { name: 'Reduction formulae and the CAST diagram', match: /\b(reduction|cast (diagram|rule)|quadrant|co[- ]?function)\b|(180|360)° ?[−+]/i },
    { name: 'Special angles and the calculator', match: /\b(without (using )?a calculator|special angle|exact value\w*)\b|\b(30|45|60)°/i },
    { name: 'Trig ratios in right-angled triangles', match: /\b(sin|cos|tan|hypotenuse|opposite|adjacent|right[- ]angled)\b/i },
  ],

  'math-analytical-geometry': [
    { name: 'Tangents to a circle', match: /\b(tangent)\b/i },
    { name: 'Circles in the Cartesian plane', match: /\b(circle|centre|radius)\b|\(x ?− ?a\)²/i },
    { name: 'Angle of inclination', match: /\b(inclination|angle .* (positive )?x[- ]axis|tan ?θ ?= ?m)\b/i },
    { name: 'Equation of a straight line', match: /\b(equation of (the|a) line|perpendicular bisector|median|altitude)\b|\by ?− ?y₁/i },
    { name: 'Gradient, parallel and perpendicular lines', match: /\b(gradient|parallel|perpendicular|collinear)\b/i },
    { name: 'Midpoint', match: /\b(midpoint|mid[- ]point|bisect\w*)\b/i },
    // "perimeter" belongs here: the perimeter of a figure given by its vertices
    // is one distance calculation per side and nothing else. It sits last, so a
    // question that also asks for a gradient is still a gradient question.
    { name: 'Distance between two points', match: /\b(distance|length of|perimeter)\b/i },
  ],

  'math-statistics': [
    { name: 'Scatter plots, correlation and regression', match: /\b(scatter\w*|correlation|regression|least squares)\b|ŷ|\br ?=/i },
    { name: 'Ogives (cumulative frequency curves)', match: /\b(ogive|cumulative frequency)\b/i },
    { name: 'Outliers and their effect', match: /\b(outlier)\b/i },
    { name: 'Five-number summary and box-and-whisker plots', match: /\b(box[- ]and[- ]whisker|five[- ]number|skew)\b/i },
    { name: 'Measures of dispersion', match: /\b(standard deviation|variance|dispersion|interquartile|iqr|quartile|spread|range)\b/i },
    // "grouped data" needed the word "data" after it, so a table headed "Test
    // marks of 50 learners, GROUPED" did not match and the question under it went
    // to Measures of central tendency on the strength of the word "mean". In a
    // statistics topic "grouped" has only the one meaning, so the stem is widened.
    { name: 'Grouped data, histograms and frequency polygons', match: /\b(histogram|grouped\w*|class interval\w*|frequency polygon|modal class|midpoint of each)\b/i },
    { name: 'Measures of central tendency', match: /\b(mean|median|mode|modal|average)\b/i },
  ],

  'math-finance-growth': [
    // Hire purchase has to be asked BEFORE Outstanding balance. A hire-purchase
    // question says "the balance owing after the deposit", which the outstanding
    // balance rule matched -- so nine Grade 10 questions were filed under a Grade
    // 12 heading. They are different ideas: hire purchase is simple interest on
    // what is left after a deposit, while an outstanding balance is what is still
    // owed on an annuity-repaid loan partway through its term.
    { name: 'Hire purchase and instalment buying', match: /\bhire[- ]?purchase\b|\binstal?ment (plan|agreement|sale)\b/i },
    { name: 'Outstanding balance', match: /\b(outstanding|balance (owing|outstanding)|settle the loan|final payment)\b/i },
    { name: 'Present value annuities and loans', match: /\b(present value|loan|bond|mortgage|repay|instalment|monthly payment)\b/i },
    { name: 'Future value annuities', match: /\b(future value|sinking fund|save|savings|annuity|regular deposit)\b/i },
    { name: 'Nominal and effective interest rates', match: /\b(nominal|effective (annual )?(interest )?rate|compounded (monthly|quarterly|daily))\b/i },
    { name: 'Depreciation', match: /\b(depreciat\w*|reducing balance|diminishing|book value|straight[- ]line)\b/i },
    // "withdrawal" alone never fired: the prompts say withdrawals, withdrawing,
    // withdrawn and withdraws, and the trailing \b rejected every one of them.
    { name: 'Timelines and changing interest rates', match: /\b(timeline|time line|rate (then )?chang\w*|withdrew|withdraw\w*|deposited .* and .* later)\b/i },
    { name: 'Simple and compound interest', match: /\b(interest|compound|invest\w*)\b|\bp\(1 ?\+ ?i\)/i },
  ],

  'math-number-patterns': [
    { name: 'Convergence and the sum to infinity', match: /\b(converge\w*|sum to infinity|infinite (geometric )?series|recurring decimal)\b|\bs∞/i },
    { name: 'Sigma notation', match: /\b(sigma|sum from)\b|∑|σ notation/i },
    { name: 'Geometric sequences and series', match: /\b(geometric|common ratio)\b|\br ?=|\bar\^/i },
    { name: 'Arithmetic sequences and series', match: /\b(arithmetic (sequence|series)|sum of the first|common difference)\b|\bsₙ/i },
    { name: 'Quadratic patterns', match: /\b(quadratic (pattern|sequence)|second difference|an² ?\+ ?bn)\b/i },
    { name: 'Linear (arithmetic) patterns', match: /\b(pattern|sequence|nth term|first difference\w*)\b|\btₙ/i },
  ],

  'math-calculus': [
    { name: 'Rates of change', match: /\b(rate of change|velocit\w*|accelerat\w*|how fast|per second)\b|\bs\(t\)/i },
    { name: 'Optimisation', match: /\b(optimis\w*|minimis\w*|maximis\w*|maximum (volume|area|profit)|minimum (cost|surface area)|largest possible|least amount)\b/i },
    { name: 'Limits and differentiation from first principles', match: /\b(first principles|limit|lim|h ?→ ?0)\b/i },
    { name: 'Sketching cubic graphs', match: /\b(cubic|sketch the graph|point of inflection|x[- ]intercepts of f)\b/i },
    { name: 'Stationary points and concavity', match: /\b(stationary|turning point|concav\w*|increasing|decreasing|second derivative)\b|\bf″/i },
    { name: 'Gradients and equations of tangents', match: /\b(tangent|gradient of the (curve|tangent)|equation of the tangent)\b/i },
    {
      // The prime sits OUTSIDE the \b(...)\b wrapper, for the same reason the
      // inverse rule in math-functions does. U+2032 is not a word character, so
      // a trailing \b after "f′" asserts that the NEXT character is one -- and
      // in "f′(x)" it is a bracket. The alternative could never fire, and 33 of
      // this topic's 97 questions, all of them plain "determine f′(x)", were
      // unfiled because of it.
      name: 'Rules of differentiation',
      match: /\b(differentiat|derivative|dy\/dx|d_?x)\b|[a-z]′/i,
    },
  ],

  'math-counting-probability': [
    { name: 'Arrangements with restrictions', match: /\b(restriction|must( not)? (be|sit|stand) (together|next to)|(next to|beside) each other|cannot be (next|adjacent)|begins with|ends with|code|password|number plate)\b/i },
    { name: 'The fundamental counting principle', match: /\b(counting principle|how many (different )?(ways|arrangements)|arrange|factorial)\b|\bn!/i },
    { name: 'Tree diagrams and two-way tables', match: /\b(tree diagram|two[- ]way table|with(out)? replacement|first .* then)\b/i },
    { name: 'Independent events and the product rule', match: /\b(independent|product rule)\b|\bp\(a\) ?× ?p\(b\)/i },
    { name: 'The addition rule', match: /\b(addition rule|either .* or)\b|\bp\(a (or|∪) b\)/i },
    { name: 'Mutually exclusive and complementary events', match: /\b(mutually exclusive|complement\w*|exhaustive)\b|P\s*\(\s*not\b/i },
    { name: 'Venn diagrams', match: /\b(venn|intersection|union|neither)\b|∪|∩/i },
    { name: 'Basic probability', match: /\b(probabilit\w*|chance|likelihood|roll\w*|dice|die\b|coin\w*|spinner\w*|fair|six[- ]sided)\b/i },
  ],

  'math-euclidean-geometry': [
    {
      // Mensuration questions live in this topic and no rule reached them: 33
      // of 321, nearly all "determine the volume of the prism/cylinder".
      name: 'Volume and surface area of solids',
      match: /\b(volume|surface area|cylinder\w*|prism\w*|cone\w*|sphere\w*|pyramid\w*|cross[- ]section\w*|capacity)\b/i,
    },
    // The proportion theorem's own configuration had no stem, so "In triangle ABC,
    // D lies on AB and E lies on AC with DE parallel to BC" -- the sentence that
    // opens almost every question on it -- fell through to Lines, angles and
    // triangles, or to the proof bucket when it said "prove".
    {
      name: 'Proportionality and the mid-point theorem',
      match: /\b(proportion\w*|mid[- ]?point theorem|divides .* proportionally|ratio of the areas)\b|\b[A-Z] lies on [A-Z]{2}\b[^.]{0,80}\bparallel\b/i,
    },
    { name: 'Tangents and the tan-chord theorem', match: /\b(tangent|tan[- ]chord|alternate segment)\b/i },
    // "exterior angle of" was a stem here, for the cyclic-quadrilateral theorem
    // that an exterior angle equals the interior opposite angle. It was also
    // catching "the exterior angle of the triangle" and "each exterior angle of
    // a regular polygon", which are Grade 10 work and not circle geometry at all
    // -- eighteen questions. Every genuine cyclic-quadrilateral question in the
    // corpus says "cyclic", so the stem only ever cost accuracy.
    { name: 'Circle geometry: same segment and cyclic quadrilaterals', match: /\b(cyclic|same segment|concyclic)\b/i },
    { name: 'Circle geometry: centre and chord theorems', match: /\b(chord|centre of the circle|semicircle|arc|angle at the centre)\b/i },
    // "square" needs guarding: on its own it was claiming "the area is 32 SQUARE
    // UNITS" and "square root" for the quadrilateral bucket. The shape is the only
    // sense wanted here, so the unit and the root are excluded by name.
    {
      name: 'Properties of quadrilaterals',
      match: /\b(parallelogram|rhombus|rectangle|trapezium|kite|quadrilateral)\b|\bsquares?\b(?! units| root| centimetres| metres| metre)/i,
    },
    { name: 'Congruency and similarity', match: /\b(congruen|similar|sss|sas|aas|rhs)\b|\|\|\|/i },
    // Writing a proof sits DOWN HERE, below the rules that say what the proof is
    // about. Second in the list it took every proof question in the topic -- the
    // cyclic-quadrilateral theorem, the angle at the centre, the tangent-radius
    // theorem -- and hid them from the sub-topic a teacher would look under while
    // teaching exactly that. It now holds the proofs that name no particular
    // figure, which is what the heading really means.
    { name: 'Writing a geometry proof', match: /\b(prove that|proof|give (a )?reasons?|state the reason)\b/i },
    { name: 'Lines, angles and triangles', match: /\b(angle|triangle|parallel|straight line|degrees)\b/i },
  ],
}

/**
 * Topics with no hand-written rules are classified against the sub-topic's own
 * text instead -- its name and its explanation points, which is where a topic's
 * real vocabulary lives.
 *
 * Matching only the sub-topic NAME was tried first and placed barely a third of
 * the science questions: a name like "Structure and function of the nephron"
 * shares no wording with "Label part B" or "Explain how ADH affects
 * reabsorption". The points do carry that wording.
 *
 * So each sub-topic gets a weighted vocabulary. A term appearing under one
 * sub-topic only is a strong signal; a term appearing under most of them --
 * "cell", "water", "energy" -- is nearly worthless, and is weighted accordingly.
 * A question goes to the sub-topic it scores highest against, provided the score
 * clears MIN_SCORE; otherwise it is left unplaced rather than guessed at.
 */
const STOP_WORDS = new Set([
  'and', 'the', 'of', 'in', 'to', 'a', 'an', 'or', 'for', 'with', 'from', 'its',
  'their', 'how', 'what', 'why', 'that', 'this', 'as', 'on', 'at', 'by', 'is',
  'are', 'basic', 'other', 'more', 'using', 'between', 'into', 'each', 'than',
  'when', 'which', 'them', 'they', 'these', 'those', 'also', 'been', 'have',
  'has', 'was', 'were', 'will', 'can', 'not', 'but', 'one', 'two', 'both',
  'give', 'name', 'state', 'write', 'show', 'does', 'any', 'all', 'over',
  'under', 'same', 'different', 'first', 'second', 'must', 'may', 'only',
  'then', 'there', 'here', 'you', 'your', 'it', 'if', 'so', 'be', 'do',
  'question', 'answer', 'following', 'above', 'below', 'given', 'shown',
  'calculate', 'determine', 'explain', 'describe', 'define', 'identify',
])

const tokens = (text: string) =>
  (text.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? []).filter((w) => !STOP_WORDS.has(w))

/**
 * A term has to carry this much weight in total before a question is filed.
 * One shared word is not evidence; a couple of distinctive ones are.
 */
const MIN_SCORE = 1.2
/** The name is what the sub-topic is actually called, so its terms count double. */
const NAME_BOOST = 2

interface ScoredSubtopic {
  name: string
  weights: Map<string, number>
}

function scorersFromNotes(subs: SubtopicNote[]): ScoredSubtopic[] {
  const vocab = subs.map((sub) => {
    const counts = new Map<string, number>()
    for (const t of tokens(sub.name)) counts.set(t, (counts.get(t) ?? 0) + NAME_BOOST)
    for (const point of sub.points) {
      for (const t of tokens(point)) counts.set(t, (counts.get(t) ?? 0) + 1)
    }
    return { name: sub.name, counts }
  })

  // How many sub-topics each term appears under, within this topic.
  const spread = new Map<string, number>()
  for (const v of vocab) for (const t of v.counts.keys()) spread.set(t, (spread.get(t) ?? 0) + 1)

  return vocab.map((v) => {
    const weights = new Map<string, number>()
    for (const [term, count] of v.counts) {
      const df = spread.get(term) ?? 1
      // Unique to this sub-topic: full weight. Shared across many: almost none.
      const weight = (1 / df) * Math.min(count, 3)
      if (weight >= 0.4) weights.set(term, weight)
    }
    return { name: v.name, weights }
  })
}

const scorers = new Map<string, ScoredSubtopic[]>()

function scorersFor(topicId: string): ScoredSubtopic[] {
  const cached = scorers.get(topicId)
  if (cached) return cached
  const built = scorersFromNotes(getTopicNote(topicId)?.subtopics ?? [])
  scorers.set(topicId, built)
  return built
}

/**
 * The hand-written rules for a topic, in priority order.
 *
 * Exported so a check can verify that no rule is completely shadowed by an
 * earlier one -- a rule that never wins a question is invisible in the app but
 * looks perfectly reasonable in this file, which is exactly how a sub-topic
 * ends up permanently empty without anyone noticing.
 */
export const subtopicRulesFor = (topicId: string): SubtopicRule[] => rules[topicId] ?? []

/** The sub-topic a single question belongs to, or null if nothing places it. */
export function subtopicFor(q: Question): string | null {
  const text = `${q.prompt} ${q.context ?? ''}`

  // Hand-written rules decide first, because they encode orderings the scorer
  // cannot know -- "the VAT on the municipal account" is a taxation question,
  // not a tariff one. Where none of them matches, the scorer still gets a turn
  // rather than the question being dropped straight into the unsorted bucket.
  const written = rules[q.topicId]
  if (written) {
    for (const rule of written) if (rule.match.test(text)) return rule.name
  }

  let best: string | null = null
  let bestScore = 0
  const seen = new Set(tokens(text))
  for (const sub of scorersFor(q.topicId)) {
    let score = 0
    for (const term of seen) score += sub.weights.get(term) ?? 0
    if (score > bestScore) {
      bestScore = score
      best = sub.name
    }
  }
  return bestScore >= MIN_SCORE ? best : null
}

export interface SubtopicGroup {
  name: string
  /** The explanation for this sub-topic, from the topic's note. Absent for UNSORTED. */
  points?: string[]
  /** The note's model tree or Venn diagram, drawn under the points. */
  tree?: TreeSpec
  venn?: VennSpec
  questions: Question[]
}

/**
 * Split a topic's questions into its sub-topics, in the order the note lists
 * them, so the sequence a learner reads matches the sequence they were taught.
 * Empty sub-topics are dropped; unmatched questions come last under UNSORTED.
 */
export function groupBySubtopic(topicId: string, questions: Question[]): SubtopicGroup[] {
  const subs = getTopicNote(topicId)?.subtopics ?? []
  if (!subs.length) return [{ name: UNSORTED, questions }]

  const buckets = new Map<string, Question[]>(subs.map((s) => [s.name, []]))
  const unsorted: Question[] = []

  for (const q of questions) {
    const name = subtopicFor(q)
    const bucket = name ? buckets.get(name) : undefined
    if (bucket) bucket.push(q)
    else unsorted.push(q)
  }

  const groups: SubtopicGroup[] = []
  for (const sub of subs) {
    const qs = buckets.get(sub.name) ?? []
    if (qs.length) groups.push({ name: sub.name, points: sub.points, tree: sub.tree, venn: sub.venn, questions: qs })
  }
  if (unsorted.length) groups.push({ name: UNSORTED, questions: unsorted })
  return groups
}
