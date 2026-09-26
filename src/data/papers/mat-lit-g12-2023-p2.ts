import type { Paper } from './types'

/**
 * Mathematical Literacy Grade 12, 2023 Paper 2 -- in the NSC format.
 *
 * Rebuilt the same way as the 2024 and 2025 papers (see mat-lit-g12-2025-p1.ts
 * for why): 150 marks, 3 hours, five questions. Its shape follows the real
 * November 2023 Paper 2 and its marking guidelines -- questions of 25, 35, 33,
 * 30 and 27 marks; Question 1 all short Level 1 items; a hall layout plan and
 * a sketch map; concrete, a pool cover and area conversions; a fashion-show
 * runway and BMI; and ice and a ship's voyage to finish. The marks at each
 * cognitive level match the real memo's: 41, 47, 36 and 26.
 *
 * Everything here is ORIGINAL. Only the structure, mark layout and kinds of
 * question mirror the real paper, which is the Department of Basic
 * Education's copyright; where a first draft happened to reuse one of the
 * real paper's numbers, the number was changed. Plans and maps are described
 * in words, with the measurements a learner would take off the drawing given
 * in the text.
 *
 * Every item carries its own data in `context`, because items are also shown
 * one at a time outside the paper (see tools/check-orphans.mts).
 */

// ---------------------------------------------------------------- contexts

const TERMS =
  'TABLE 1 gives definitions of some terms used in Mathematical Literacy.\n' +
  '|+ TABLE 1: DEFINITIONS OF TERMS\n| Letter | Definition |\n|---|---|\n' +
  '| A | The distance from one side of a circle to the other, through the centre |\n' +
  '| B | A scale drawn as a line divided into equal parts |\n' +
  '| C | The amount of flat surface a shape covers |\n' +
  '| D | How heavy an object is |\n' +
  '| E | A scale written as a ratio, such as 1 : 50 000 |\n' +
  '| F | The total distance around the outside of a shape |\n' +
  '| G | The direction measured in degrees clockwise from north |\n' +
  '| H | The mass of an object divided by its volume |\n' +
  'Match each term with its definition. Write only the letter (A–H).'

const ROUTE =
  'Lindi walks from home to school. She walks 450 m along Main Road, turns left into Church Street and walks 320 m, ' +
  'turns right into Station Road and walks 610 m, then turns left into School Lane and walks 180 m to the school gate.'

const DESK =
  'Farai assembles a flat-pack desk. TABLE 2 lists the fittings in the box.\n' +
  '|+ TABLE 2: FITTINGS SUPPLIED\n| Fitting | Label | Quantity |\n|---|---|---|\n' +
  '| Long screw (40 mm) | S1 | 8 |\n| Short screw (16 mm) | S2 | 12 |\n| Wooden dowel | D | 6 |\n| Cam lock | C | 4 |\n| Shelf peg | P | 4 |\n' +
  'Tools needed: a Phillips screwdriver (not supplied) and the Allen key supplied in the box. ' +
  'Step 3 of the instructions uses 4 cam locks and 4 short screws to fix the side panels to the top.'

const HALL =
  'The layout plan of a wedding hall shows 8 round tables that each seat 10 guests, and one long main table for 12 people against the north wall. ' +
  'The dance floor is in the centre of the hall, the bar is in the south-east corner and the kitchen door is in the west wall. ' +
  'On the plan the hall is 16,0 cm long; the real hall is 24 m long.'

const MAIN_TABLE =
  'The main table at the wedding is made of rectangular tables, each 1,8 m long, placed end to end. The 12 guests at the main table all sit along ONE side, ' +
  'facing the other guests, and each guest needs 60 cm of table length. The main table stands against the north wall, which is 9,5 m long, ' +
  'and the organiser wants at least 1 m of free space at each end of the table.'

const MAP =
  'A sketch map, NOT drawn to scale, shows the route from the bus station to the wedding venue: from the station, go east along Long Street for 1,2 km; ' +
  'turn right (south) into Bree Street for 800 m; then turn left (east) into Wale Street. The venue is 500 m along Wale Street. ' +
  'A shuttle bus leaves the station at 13:20 and travels at an average speed of 20 km/h. The ceremony starts at 13:30.'

const EGGS =
  'A bakery buys 5 trays of large eggs. Each tray holds 30 eggs. On average a large egg has a mass of 55 g, and an empty tray has a mass of 70 g.'

const POSTS =
  'Themba sets 8 fence posts in concrete. Each hole is a rectangular prism 30 cm long, 30 cm wide and 70 cm deep. ' +
  'Each post is 10 cm by 10 cm and stands on the bottom of its hole, filling a 10 cm × 10 cm × 70 cm part of it. ' +
  'One 50 kg bag of cement makes 0,15 m³ of concrete.\n' +
  'Volume of a rectangular prism = length × width × height; 1 m³ = 1 000 000 cm³.'

const POOL =
  'The plan of a swimming pool is drawn to a scale of 1 : 100. The pool is a rectangle with a semicircle at one end. ' +
  'On the plan, the rectangular part measures 80 mm by 40 mm, and the semicircle has a diameter of 40 mm. ' +
  'A pool cover costs R185 per square metre. Use π = 3,142; area of a circle = π × radius².'

const RUNWAY =
  'For a school fashion show, 5 teachers and 30 learners model clothes on a runway. The runway is built from stage blocks, each 1,2 m long and 0,6 m wide: ' +
  '2 rows of 9 blocks laid end to end. At the end of the runway is a round turning platform with a diameter of 8 feet, 20 cm higher than the runway. ' +
  '1 foot = 0,3048 m. Use π = 3,142; circumference = π × diameter.'

const MODELS =
  'TABLE 3 shows the height and mass of five models.\n' +
  '|+ TABLE 3: THE MODELS\n| Model | Height (m) | Mass (kg) | Size |\n|---|---|---|---|\n' +
  '| Aya | 1,62 | 52 | S |\n| Bongi | 1,75 | 61 | M |\n| Chris | 1,80 | 74 | L |\n| Dineo | 1,58 | 48 | XS |\n| Eli | 1,68 | 66 | M |\n' +
  'BMI = mass (kg) ÷ height² (m²). A BMI of 18,5 to 24,9 is in the healthy range.'

const ICE =
  'A fish market uses cube-shaped blocks of ice with sides of 25 cm. Ice has a density of 0,92 g/cm³ (mass = volume × density), and 1 ton = 1 000 kg.'

const VOYAGE =
  'A cargo ship sails from Durban to Singapore, a distance of about 5 450 nautical miles (1 nautical mile = 1,852 km). ' +
  'On the way it passes Port Louis, Mauritius, which is 1 560 nautical miles from Durban. ' +
  'The ship leaves Durban on Monday 2 October 2023 at 06:00 South African time and sails at an average speed of 16 knots (1 knot = 1 nautical mile per hour). ' +
  'Singapore time is 6 hours ahead of South African time.'

// ---------------------------------------------------------------- paper

export const matLitG12P2Y2023: Paper = {
  id: 'ml-p2-2023',
  subjectId: 'mat-lit',
  paperNumber: 2,
  grade: 12,
  kind: 'past',
  year: 2023,
  title: '2023 Paper 2',
  durationMinutes: 180,
  totalMarks: 150,
  sections: [
    {
      number: 1,
      title: 'Terms, a walk to school and a flat-pack desk',
      topicId: 'measurement',
      marks: 25,
      items: [
        ...(
          [
            ['1.1.1', 'NUMBER SCALE', 'E', ['B', 'E', 'G', 'A'], 'A number scale is written as a ratio; B is a bar scale, which is drawn as a line.'],
            ['1.1.2', 'MASS', 'D', ['H', 'C', 'D', 'F'], 'Mass is how heavy an object is; H, density, is mass divided by volume.'],
            ['1.1.3', 'DIAMETER', 'A', ['A', 'F', 'G', 'C'], 'The diameter goes across a circle through its centre.'],
            ['1.1.4', 'AREA', 'C', ['F', 'H', 'E', 'C'], 'Area is the flat surface a shape covers; F, perimeter, is the distance around it.'],
          ] as const
        ).map(([label, term, right, letters, why], k) => ({
          id: 'ml-p2-23n-1-1-' + (k + 1),
          label,
          topicId: k === 0 ? 'maps-plans' : 'measurement',
          grade: 12 as const,
          difficulty: 'Easy' as const,
          cognitiveLevel: 1 as const,
          marks: 2,
          context: TERMS,
          prompt: 'Which letter matches the term ' + term + '?',
          options: letters.map((l, i) => ({ id: 'abcd'[i], label: l })),
          correctOptionId: 'abcd'[(letters as readonly string[]).indexOf(right)],
          answer: right,
          explanation: why,
        })),
        {
          id: 'ml-p2-23n-1-2-1',
          label: '1.2.1',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: ROUTE,
          prompt: 'Along how many different streets does Lindi walk?',
          answer: '4',
          explanation: 'Main Road, Church Street, Station Road and School Lane.',
          memo: [{ code: 'A', marks: 2, text: '4' }],
        },
        {
          id: 'ml-p2-23n-1-2-2',
          label: '1.2.2',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: ROUTE,
          prompt: 'Name the street along which Lindi walks the LONGEST distance.',
          answer: 'Station Road (610 m)',
          explanation: 'The distances are 450 m, 320 m, 610 m and 180 m; the longest is along Station Road.',
          memo: [{ code: 'RT', marks: 2, text: 'Station Road' }],
        },
        {
          id: 'ml-p2-23n-1-2-3',
          label: '1.2.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: ROUTE,
          prompt: 'Calculate the total distance Lindi walks, in kilometres.',
          answer: '1,56 km',
          explanation: '450 + 320 + 610 + 180 = 1 560 m, and 1 560 ÷ 1 000 = 1,56 km.',
          memo: [
            { code: 'RT', marks: 1, text: 'ALL four distances' },
            { code: 'A', marks: 1, text: '1 560 m' },
            { code: 'C', marks: 1, text: '1,56 km' },
          ],
        },
        {
          id: 'ml-p2-23n-1-3-1',
          label: '1.3.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: DESK,
          prompt: 'How many different types of screws are supplied?',
          answer: '2',
          explanation: 'Long screws (S1) and short screws (S2).',
          memo: [{ code: 'A', marks: 2, text: '2' }],
        },
        {
          id: 'ml-p2-23n-1-3-2',
          label: '1.3.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: DESK,
          prompt: 'Write down the label of the fitting of which exactly 6 are supplied.',
          answer: 'D (wooden dowels)',
          explanation: 'Only the wooden dowels have a quantity of 6.',
          memo: [{ code: 'RT', marks: 2, text: 'D' }],
        },
        {
          id: 'ml-p2-23n-1-3-3',
          label: '1.3.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: DESK,
          prompt: 'How many fittings are supplied altogether?',
          answer: '34',
          explanation: '8 + 12 + 6 + 4 + 4 = 34.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding ALL the quantities' },
            { code: 'A', marks: 1, text: '34' },
          ],
        },
        {
          id: 'ml-p2-23n-1-3-4',
          label: '1.3.4',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: DESK,
          prompt: 'Name the tool Farai needs that is NOT supplied in the box.',
          answer: 'A Phillips screwdriver',
          explanation: 'The Allen key is supplied; the Phillips screwdriver is not.',
          memo: [{ code: 'RT', marks: 2, text: 'Phillips screwdriver' }],
        },
        {
          id: 'ml-p2-23n-1-3-5',
          label: '1.3.5',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: DESK,
          prompt: 'How many short screws are left after Step 3?',
          answer: '8',
          explanation: '12 short screws − 4 used in Step 3 = 8.',
          memo: [
            { code: 'M', marks: 1, text: '12 − 4' },
            { code: 'A', marks: 1, text: '8' },
          ],
        },
      ],
    },
    {
      number: 2,
      title: 'A wedding hall and the way there',
      topicId: 'maps-plans',
      marks: 35,
      items: [
        {
          id: 'ml-p2-23n-2-1-1',
          label: '2.1.1',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: HALL,
          prompt: 'Explain what a layout plan shows.',
          answer: 'How the furniture and other features are arranged in a space, as seen from above.',
          explanation: 'A layout plan shows where things are placed, not what a building looks like from the side.',
          memo: [{ code: 'A', marks: 2, text: 'The arrangement of items in a space, seen from above' }],
        },
        {
          id: 'ml-p2-23n-2-1-2',
          label: '2.1.2',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: HALL,
          prompt: 'Calculate the total number of guests who can be seated in the hall.',
          answer: '92 guests',
          explanation: '8 round tables × 10 guests + 12 at the main table = 80 + 12 = 92.',
          memo: [
            { code: 'M', marks: 1, text: '8 × 10 + 12' },
            { code: 'A', marks: 1, text: '92' },
          ],
        },
        {
          id: 'ml-p2-23n-2-1-3',
          label: '2.1.3',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: HALL,
          prompt: 'In which corner of the hall is the bar?',
          options: [
            { id: 'a', label: 'North-east' },
            { id: 'b', label: 'South-west' },
            { id: 'c', label: 'South-east' },
            { id: 'd', label: 'North-west' },
          ],
          correctOptionId: 'c',
          answer: 'South-east',
          explanation: 'The plan description places the bar in the south-east corner.',
          memo: [{ code: 'A', marks: 2, text: 'South-east' }],
        },
        {
          id: 'ml-p2-23n-2-1-4',
          label: '2.1.4',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: HALL,
          prompt: 'Give ONE reason why the dance floor is in the centre of the hall.',
          answer: 'Guests at every table can see the dancing and reach the floor easily.',
          explanation: 'Other valid reasons: it keeps the dancing away from the kitchen door and the bar, where people carry food and drinks.',
          memo: [{ code: 'J', marks: 2, text: 'Any valid reason, e.g. visible and reachable from all the tables' }],
        },
        {
          id: 'ml-p2-23n-2-1-5a',
          label: '2.1.5(a)',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: HALL,
          prompt: 'Write down the length of the hall on the plan, in mm.',
          answer: '160 mm',
          explanation: '16,0 cm × 10 = 160 mm.',
          memo: [
            { code: 'RT', marks: 1, text: '16,0 cm' },
            { code: 'C', marks: 1, text: '160 mm' },
          ],
        },
        {
          id: 'ml-p2-23n-2-1-5b',
          label: '2.1.5(b)',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: HALL,
          prompt: 'Determine the number scale of the plan, in the form 1 : ...',
          answer: '1 : 150',
          explanation: 'Plan : real = 16 cm : 24 m = 16 cm : 2 400 cm. Divide both by 16: 1 : 150.',
          memo: [
            { code: 'C', marks: 1, text: '24 m = 2 400 cm' },
            { code: 'M', marks: 1, text: '16 : 2 400, divided by 16' },
            { code: 'CA', marks: 1, text: '1 : 150' },
          ],
        },
        {
          id: 'ml-p2-23n-2-2',
          label: '2.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 8,
          context: MAIN_TABLE,
          prompt: 'Determine how many 1,8 m tables are needed for the main table, and whether the main table leaves at least 1 m of free space at each end of the north wall.',
          answer: '4 tables (7,2 m). That leaves 1,15 m at each end, so there is enough space.',
          explanation:
            'Table length needed = 12 × 0,6 m = 7,2 m. 7,2 ÷ 1,8 = 4 tables, which make exactly 7,2 m. ' +
            'Space left on the wall = 9,5 − 7,2 = 2,3 m, which is 1,15 m at each end — more than 1 m.',
          memo: [
            { code: 'M', marks: 1, text: '12 × 0,6 m' },
            { code: 'A', marks: 1, text: '7,2 m' },
            { code: 'M', marks: 1, text: '÷ 1,8' },
            { code: 'CA', marks: 1, text: '4 tables' },
            { code: 'M', marks: 1, text: '9,5 − 7,2' },
            { code: 'CA', marks: 1, text: '2,3 m' },
            { code: 'CA', marks: 1, text: '1,15 m at each end' },
            { code: 'J', marks: 1, text: 'Yes, more than 1 m at each end' },
          ],
        },
        {
          id: 'ml-p2-23n-2-3-1',
          label: '2.3.1',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: MAP,
          prompt: 'In which general direction is the venue from the bus station?',
          answer: 'South-east',
          explanation: 'The route goes east, then south, then east again, so the venue ends up to the south-east of the station.',
          memo: [{ code: 'A', marks: 2, text: 'South-east' }],
        },
        {
          id: 'ml-p2-23n-2-3-2',
          label: '2.3.2',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: MAP,
          prompt: 'Explain why the sketch map cannot be used to measure distances.',
          answer: 'It is not drawn to scale, so lengths on the map do not match real distances.',
          explanation: 'Without a scale there is no fixed link between a length on the map and a real distance.',
          memo: [{ code: 'A', marks: 2, text: 'Not drawn to scale' }],
        },
        {
          id: 'ml-p2-23n-2-3-3',
          label: '2.3.3',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: MAP,
          prompt: 'Name the TWO streets the shuttle drives along before it turns into Wale Street.',
          answer: 'Long Street and Bree Street',
          explanation: 'Read the route in order: Long Street, then Bree Street, then Wale Street.',
          memo: [
            { code: 'RT', marks: 1, text: 'Long Street' },
            { code: 'RT', marks: 1, text: 'Bree Street' },
          ],
        },
        {
          id: 'ml-p2-23n-2-3-4',
          label: '2.3.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: MAP,
          prompt: 'A driver follows the directions exactly. Write down the probability that the driver turns LEFT from Long Street into Bree Street.',
          answer: '0 (impossible)',
          explanation: 'The directions say to turn right into Bree Street, so turning left cannot happen when they are followed.',
          memo: [{ code: 'A', marks: 2, text: '0 / impossible' }],
        },
        {
          id: 'ml-p2-23n-2-3-5',
          label: '2.3.5',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: MAP,
          prompt: 'Give ONE reason why the shuttle could take LONGER than a calculation at 20 km/h suggests.',
          answer: 'Traffic, robots or roadworks in town can slow it down below its average speed.',
          explanation: 'Other valid reasons: stopping to pick up or drop off guests, or taking a detour.',
          memo: [{ code: 'J', marks: 2, text: 'Any valid reason, e.g. traffic or traffic lights' }],
        },
        {
          id: 'ml-p2-23n-2-3-6',
          label: '2.3.6',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 4,
          context: MAP + '\nTime = distance ÷ speed',
          prompt: 'Verify, showing ALL calculations, whether the shuttle arrives at the venue before the ceremony starts.',
          answer: 'Distance 2,5 km ÷ 20 km/h = 0,125 h = 7,5 min. It arrives at about 13:27½, before 13:30. It arrives in time.',
          explanation: 'Add the three parts of the route first: 1,2 km + 0,8 km + 0,5 km = 2,5 km.',
          memo: [
            { code: 'A', marks: 1, text: '2,5 km' },
            { code: 'M', marks: 1, text: '2,5 ÷ 20' },
            { code: 'CA', marks: 1, text: '7,5 minutes' },
            { code: 'J', marks: 1, text: 'Arrives about 13:27½, before 13:30' },
          ],
        },
      ],
    },
    {
      number: 3,
      title: 'Eggs, fence posts and a pool cover',
      topicId: 'measurement',
      marks: 33,
      items: [
        {
          id: 'ml-p2-23n-3-1-1',
          label: '3.1.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: EGGS,
          prompt: 'Calculate the number of eggs the bakery buys.',
          answer: '150 eggs',
          explanation: '5 trays × 30 eggs = 150.',
          memo: [
            { code: 'M', marks: 1, text: '5 × 30' },
            { code: 'A', marks: 1, text: '150' },
          ],
        },
        {
          id: 'ml-p2-23n-3-1-2',
          label: '3.1.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: EGGS,
          prompt: 'Calculate the total mass of the 5 full trays, in kg.',
          answer: '8,6 kg',
          explanation: 'Eggs: 150 × 55 g = 8 250 g. Trays: 5 × 70 g = 350 g. Total 8 600 g = 8,6 kg.',
          memo: [
            { code: 'M', marks: 1, text: '150 × 55 g + 5 × 70 g' },
            { code: 'CA', marks: 1, text: '8 600 g' },
            { code: 'C', marks: 1, text: '8,6 kg' },
          ],
        },
        {
          id: 'ml-p2-23n-3-2-1',
          label: '3.2.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: POSTS,
          prompt: 'Calculate the total volume of the 8 holes, in m³.',
          answer: '0,504 m³',
          explanation: 'One hole: 30 × 30 × 70 = 63 000 cm³ = 0,063 m³. Eight holes: 8 × 0,063 = 0,504 m³.',
          memo: [
            { code: 'SF', marks: 1, text: '30 × 30 × 70' },
            { code: 'A', marks: 1, text: '63 000 cm³' },
            { code: 'C', marks: 1, text: '0,063 m³' },
            { code: 'M', marks: 1, text: '× 8' },
            { code: 'CA', marks: 1, text: '0,504 m³' },
          ],
        },
        {
          id: 'ml-p2-23n-3-2-2',
          label: '3.2.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: POSTS,
          prompt: 'Explain why Themba needs LESS concrete than the total volume of the holes.',
          answer: 'The posts stand in the holes and take up part of the space, so only the space around each post is filled with concrete.',
          explanation: 'Concrete fills the hole minus the part of the post inside it.',
          memo: [{ code: 'J', marks: 2, text: 'The posts take up some of the space in the holes' }],
        },
        {
          id: 'ml-p2-23n-3-2-3',
          label: '3.2.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 6,
          context: POSTS + '\nThe 8 holes have a total volume of 0,504 m³.',
          prompt: 'Calculate the number of whole bags of cement Themba must buy.',
          answer: '3 bags',
          explanation:
            'One post in its hole: 10 × 10 × 70 = 7 000 cm³ = 0,007 m³; eight posts: 0,056 m³. ' +
            'Concrete = 0,504 − 0,056 = 0,448 m³. 0,448 ÷ 0,15 = 2,99, so 3 bags.',
          memo: [
            { code: 'SF', marks: 1, text: '10 × 10 × 70' },
            { code: 'CA', marks: 1, text: '8 posts: 0,056 m³' },
            { code: 'M', marks: 1, text: '0,504 − 0,056' },
            { code: 'CA', marks: 1, text: '0,448 m³' },
            { code: 'M', marks: 1, text: '÷ 0,15' },
            { code: 'R', marks: 1, text: '3 bags (rounded up)' },
          ],
        },
        {
          id: 'ml-p2-23n-3-3-1',
          label: '3.3.1',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: POOL,
          prompt: 'Calculate the real area of the rectangular part of the pool, in m².',
          answer: '32 m²',
          explanation: 'At 1 : 100, 80 mm → 8 000 mm = 8 m and 40 mm → 4 000 mm = 4 m. Area = 8 × 4 = 32 m².',
          memo: [
            { code: 'C', marks: 1, text: '80 mm → 8 m' },
            { code: 'C', marks: 1, text: '40 mm → 4 m' },
            { code: 'SF', marks: 1, text: '8 × 4' },
            { code: 'CA', marks: 1, text: '32 m²' },
          ],
        },
        {
          id: 'ml-p2-23n-3-3-2',
          label: '3.3.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 8,
          context: POOL + '\nThe rectangular part of the pool has a real area of 32 m².',
          prompt: 'The owner says a cover for the WHOLE pool will cost less than R7 000. Verify, showing ALL calculations, whether the owner is correct.',
          answer: 'Area = 32 + 6,284 = 38,28 m²; cost = 38,28 × R185 = R7 082,54, which is more than R7 000. The owner is NOT correct.',
          explanation:
            'The semicircle is 40 mm × 100 = 4 m across, so its radius is 2 m. Area = ½ × 3,142 × 2² = 6,284 m². ' +
            'Whole pool = 32 + 6,284 = 38,284 m². Cost = 38,284 × R185 = R7 082,54.',
          memo: [
            { code: 'A', marks: 1, text: 'Radius 2 m' },
            { code: 'SF', marks: 1, text: '½ × 3,142 × 2²' },
            { code: 'CA', marks: 1, text: '6,284 m²' },
            { code: 'M', marks: 1, text: 'Adding the rectangle' },
            { code: 'CA', marks: 1, text: '38,28 m²' },
            { code: 'M', marks: 1, text: '× R185' },
            { code: 'CA', marks: 1, text: 'R7 082,54' },
            { code: 'J', marks: 1, text: 'NOT correct' },
          ],
        },
        {
          id: 'ml-p2-23n-3-3-3',
          label: '3.3.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: POOL + '\nThe whole pool has an area of about 38,28 m².',
          prompt: 'Convert the area of the whole pool to cm².',
          answer: '382 800 cm²',
          explanation: '1 m = 100 cm, so 1 m² = 100 × 100 = 10 000 cm². 38,28 × 10 000 = 382 800 cm².',
          memo: [
            { code: 'C', marks: 1, text: '1 m² = 10 000 cm²' },
            { code: 'M', marks: 1, text: '38,28 × 10 000' },
            { code: 'CA', marks: 1, text: '382 800 cm²' },
          ],
        },
      ],
    },
    {
      number: 4,
      title: 'A fashion show',
      topicId: 'measurement',
      marks: 30,
      items: [
        {
          id: 'ml-p2-23n-4-1-1',
          label: '4.1.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: RUNWAY,
          prompt: 'Write the ratio of teachers to learners who model, in simplest form.',
          answer: '1 : 6',
          explanation: 'Teachers : learners = 5 : 30. Divide both by 5: 1 : 6.',
          memo: [
            { code: 'A', marks: 1, text: '5 : 30 in the correct order' },
            { code: 'M', marks: 1, text: 'Dividing both by 5' },
            { code: 'A', marks: 1, text: '1 : 6' },
          ],
        },
        {
          id: 'ml-p2-23n-4-1-2',
          label: '4.1.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: RUNWAY,
          prompt: 'Calculate the length of the runway, in metres.',
          answer: '10,8 m',
          explanation: 'Each row has 9 blocks laid end to end: 9 × 1,2 m = 10,8 m. (The two rows lie side by side, making the runway 1,2 m wide.)',
          memo: [
            { code: 'RT', marks: 1, text: '9 blocks of 1,2 m' },
            { code: 'M', marks: 1, text: '9 × 1,2' },
            { code: 'A', marks: 1, text: '10,8 m' },
          ],
        },
        {
          id: 'ml-p2-23n-4-1-3a',
          label: '4.1.3(a)',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: RUNWAY,
          prompt: 'Give ONE reason why the runway is built from separate blocks instead of one large piece.',
          answer: 'Blocks are easier to carry and store, and the runway can be made longer or shorter by adding or removing blocks.',
          explanation: 'Any sensible practical reason earns the marks.',
          memo: [{ code: 'J', marks: 2, text: 'Any valid reason, e.g. easy to move, store or resize' }],
        },
        {
          id: 'ml-p2-23n-4-1-3b',
          label: '4.1.3(b)',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: RUNWAY,
          prompt: 'The turning platform is 20 cm higher than the runway. Suggest ONE way to make the join safe for the models.',
          answer: 'Build a short ramp or a clearly marked step between the runway and the platform.',
          explanation: 'Other valid answers: bright tape on the edge, or lighting on the step, so models in heels do not trip.',
          memo: [{ code: 'J', marks: 2, text: 'Any valid safety measure, e.g. a ramp or a marked step' }],
        },
        {
          id: 'ml-p2-23n-4-1-4a',
          label: '4.1.4(a)',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: RUNWAY,
          prompt: 'Calculate the radius of the turning platform, in metres.',
          answer: '≈ 1,22 m',
          explanation: 'Diameter = 8 × 0,3048 = 2,4384 m. Radius = 2,4384 ÷ 2 = 1,2192 ≈ 1,22 m.',
          memo: [
            { code: 'C', marks: 1, text: '8 × 0,3048' },
            { code: 'A', marks: 1, text: 'Diameter 2,4384 m' },
            { code: 'CA', marks: 1, text: 'Radius 1,22 m' },
          ],
        },
        {
          id: 'ml-p2-23n-4-1-4b',
          label: '4.1.4(b)',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: RUNWAY + '\nThe platform has a diameter of 2,4384 m.',
          prompt: 'An LED light strip must go once around the edge of the platform. It is sold in 5 m rolls. Calculate the length of strip needed and the number of rolls to buy.',
          answer: '≈ 7,66 m; 2 rolls',
          explanation: 'Circumference = 3,142 × 2,4384 = 7,66 m. 7,66 ÷ 5 = 1,53, so 2 rolls.',
          memo: [
            { code: 'SF', marks: 1, text: '3,142 × 2,4384' },
            { code: 'CA', marks: 1, text: '7,66 m' },
            { code: 'M', marks: 1, text: '÷ 5' },
            { code: 'R', marks: 1, text: '2 rolls (rounded up)' },
          ],
        },
        {
          id: 'ml-p2-23n-4-2-1',
          label: '4.2.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: MODELS,
          prompt: 'Write down Bongi’s height.',
          answer: '1,75 m',
          explanation: 'Read from TABLE 3.',
          memo: [{ code: 'RT', marks: 2, text: '1,75 m' }],
        },
        {
          id: 'ml-p2-23n-4-2-2',
          label: '4.2.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: MODELS,
          prompt: 'Name the model with the greatest mass.',
          answer: 'Chris (74 kg)',
          explanation: 'The largest value in the mass column is 74 kg.',
          memo: [{ code: 'RT', marks: 2, text: 'Chris' }],
        },
        {
          id: 'ml-p2-23n-4-2-3',
          label: '4.2.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: MODELS,
          prompt: 'Calculate Aya’s BMI.',
          answer: '≈ 19,8',
          explanation: 'BMI = 52 ÷ 1,62² = 52 ÷ 2,6244 = 19,8.',
          memo: [
            { code: 'SF', marks: 1, text: '52 ÷ 1,62²' },
            { code: 'S', marks: 1, text: '52 ÷ 2,6244' },
            { code: 'CA', marks: 1, text: '19,8' },
          ],
        },
        {
          id: 'ml-p2-23n-4-2-4',
          label: '4.2.4',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: MODELS,
          prompt: 'One model is chosen at random. Write down, as a percentage, the probability that the model is taller than 1,50 m.',
          answer: '100%',
          explanation: 'All five models are taller than 1,50 m, so it is certain.',
          memo: [{ code: 'A', marks: 2, text: '100%' }],
        },
        {
          id: 'ml-p2-23n-4-2-5',
          label: '4.2.5',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 4,
          context: MODELS,
          prompt: 'The organiser says that Dineo, the lightest model, and Eli both have a BMI in the healthy range. Verify whether this is correct.',
          answer: 'Dineo: 48 ÷ 1,58² ≈ 19,2. Eli: 66 ÷ 1,68² ≈ 23,4. Both are between 18,5 and 24,9, so it is CORRECT.',
          explanation: 'Work out each BMI and check it against the healthy range 18,5–24,9.',
          memo: [
            { code: 'SF', marks: 1, text: '48 ÷ 1,58² and 66 ÷ 1,68²' },
            { code: 'CA', marks: 1, text: 'Dineo 19,2' },
            { code: 'CA', marks: 1, text: 'Eli 23,4' },
            { code: 'J', marks: 1, text: 'CORRECT: both in 18,5–24,9' },
          ],
        },
      ],
    },
    {
      number: 5,
      title: 'Ice blocks and a voyage to Singapore',
      topicId: 'measurement',
      marks: 27,
      items: [
        {
          id: 'ml-p2-23n-5-1',
          label: '5.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: ICE + '\nSurface area of a cube = 6 × side × side',
          prompt: 'Calculate the outside surface area of one ice block, in cm².',
          answer: '3 750 cm²',
          explanation: '6 × 25 × 25 = 6 × 625 = 3 750 cm².',
          memo: [
            { code: 'SF', marks: 1, text: '6 × 25 × 25' },
            { code: 'S', marks: 1, text: '6 × 625' },
            { code: 'CA', marks: 1, text: '3 750 cm²' },
          ],
        },
        {
          id: 'ml-p2-23n-5-2-1',
          label: '5.2.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 4,
          context: ICE,
          prompt: 'A truck delivers 80 ice blocks, each with a mass of 14,4 kg. Calculate the total mass of the ice, in tons.',
          answer: '1,152 tons',
          explanation: '80 × 14,4 kg = 1 152 kg, and 1 152 ÷ 1 000 = 1,152 tons.',
          memo: [
            { code: 'M', marks: 1, text: '80 × 14,4' },
            { code: 'A', marks: 1, text: '1 152 kg' },
            { code: 'C', marks: 1, text: '÷ 1 000' },
            { code: 'CA', marks: 1, text: '1,152 tons' },
          ],
        },
        {
          id: 'ml-p2-23n-5-2-2',
          label: '5.2.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: ICE,
          prompt: 'Use the density of ice to show that one block has a mass of about 14,4 kg.',
          answer: 'Volume = 25³ = 15 625 cm³; mass = 15 625 × 0,92 = 14 375 g ≈ 14,4 kg',
          explanation: 'Mass = volume × density; then 1 000 g = 1 kg.',
          memo: [
            { code: 'SF', marks: 1, text: '15 625 × 0,92' },
            { code: 'CA', marks: 1, text: '14 375 g' },
            { code: 'C', marks: 1, text: '≈ 14,4 kg' },
          ],
        },
        {
          id: 'ml-p2-23n-5-3-1',
          label: '5.3.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: VOYAGE,
          prompt: 'Calculate the distance from Port Louis to Singapore, in nautical miles.',
          answer: '3 890 nautical miles',
          explanation: '5 450 − 1 560 = 3 890 nautical miles.',
          memo: [
            { code: 'RT', marks: 1, text: '5 450 and 1 560' },
            { code: 'M', marks: 1, text: 'Subtracting' },
            { code: 'A', marks: 1, text: '3 890' },
          ],
        },
        {
          id: 'ml-p2-23n-5-3-2',
          label: '5.3.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: VOYAGE,
          prompt: 'Convert the distance from Durban to Singapore to kilometres, rounded to the nearest kilometre.',
          answer: '≈ 10 093 km',
          explanation: '5 450 × 1,852 = 10 093,4 km ≈ 10 093 km.',
          memo: [
            { code: 'RT', marks: 1, text: '5 450 nautical miles' },
            { code: 'C', marks: 1, text: '× 1,852' },
            { code: 'CA', marks: 1, text: '10 093,4 km' },
            { code: 'R', marks: 1, text: '10 093 km' },
          ],
        },
        {
          id: 'ml-p2-23n-5-3-3',
          label: '5.3.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: VOYAGE + '\nTime = distance ÷ speed',
          prompt: 'Calculate the sailing time from Durban to Singapore, in days, hours and minutes (to the nearest minute).',
          answer: '14 days 4 hours 38 minutes',
          explanation: '5 450 ÷ 16 = 340,625 hours. 340,625 ÷ 24 = 14 days and 4,625 hours; 0,625 h × 60 = 37,5 ≈ 38 minutes.',
          memo: [
            { code: 'SF', marks: 1, text: '5 450 ÷ 16' },
            { code: 'CA', marks: 1, text: '340,625 hours' },
            { code: 'C', marks: 1, text: '÷ 24: 14 days' },
            { code: 'CA', marks: 1, text: '4 h 38 min' },
          ],
        },
        {
          id: 'ml-p2-23n-5-3-4',
          label: '5.3.4',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 6,
          context: VOYAGE + '\nThe voyage takes 14 days 4 hours 38 minutes.',
          prompt: 'Determine the date and the SINGAPORE time, in the 24-hour clock format, at which the ship arrives in Singapore.',
          answer: 'Monday 16 October 2023 at 16:38 Singapore time',
          explanation:
            'Monday 2 October 06:00 + 14 days = Monday 16 October 06:00. + 4 h 38 min = 10:38 South African time. ' +
            'Singapore is 6 hours ahead: 10:38 + 6 h = 16:38.',
          memo: [
            { code: 'M', marks: 1, text: 'Adding 14 days' },
            { code: 'CA', marks: 1, text: '16 October' },
            { code: 'M', marks: 1, text: 'Adding 4 h 38 min' },
            { code: 'CA', marks: 1, text: '10:38 South African time' },
            { code: 'M', marks: 1, text: 'Adding 6 hours' },
            { code: 'CA', marks: 1, text: '16:38 Singapore time' },
          ],
        },
      ],
    },
  ],
}
