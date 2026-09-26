import type { Paper } from './types'

/**
 * Mathematical Literacy Grade 12, 2024 Paper 2 -- in the NSC format.
 *
 * Rebuilt the same way as the 2025 papers (see mat-lit-g12-2025-p1.ts for why):
 * 150 marks, 3 hours, five questions. Its shape follows the real November 2024
 * Paper 2 and its marking guidelines -- questions of 26, 31, 31, 29 and 33
 * marks; Question 1 all short Level 1 items (terms, a garden wall, a bench's
 * parts list); a layout plan and a route's height profile; perimeter, circles
 * and cubes; a temperature conversion, an open cylinder and a double brick
 * wall; and a tour with distances, heights and population density to finish.
 * The marks at each cognitive level match the real memo's: 48, 47, 23 and 32.
 *
 * Everything here is ORIGINAL. Only the structure, mark layout and kinds of
 * question mirror the real paper, which is the Department of Basic
 * Education's copyright. Plans and maps are described in words and tables,
 * with the measurements a learner would take off the drawing given in the
 * text, as in the 2025 Paper 2.
 *
 * Every item carries its own data in `context`, because items are also shown
 * one at a time outside the paper (see tools/check-orphans.mts).
 */

// ---------------------------------------------------------------- contexts

const TERMS =
  'TABLE 1 gives definitions of some terms used in Mathematical Literacy.\n' +
  '|+ TABLE 1: DEFINITIONS OF TERMS\n| Letter | Definition |\n|---|---|\n' +
  '| A | A drawing that shows a building from the front, back or side |\n' +
  '| B | A list that explains what the symbols on a map or plan mean |\n' +
  '| C | The space inside a three-dimensional object, measured in cubic units |\n' +
  '| D | The distance around the edge of a circle |\n' +
  '| E | The mass of an object divided by its volume |\n' +
  '| F | A drawing of a building as seen from directly above |\n' +
  '| G | The amount of liquid a container can hold |\n' +
  '| H | A straight line from the centre of a circle to its edge |\n' +
  'Match each term with its definition. Write only the letter (A–H).'

const WALL =
  'Lerato builds a garden wall from cement blocks. Each block is 390 mm long, 190 mm high and 140 mm wide. ' +
  'The mortar joint between two blocks, and between two rows, is 10 mm thick. The wall is 4 m long.'

const BENCH =
  'Themba builds a wooden garden bench from the parts in TABLE 2.\n' +
  '|+ TABLE 2: PARTS LIST FOR THE BENCH (MEASUREMENTS IN mm)\n| Part | No. | Length | Width | Thickness |\n|---|---|---|---|---|\n' +
  '| Seat slat | 6 | 1 200 | 65 | 19 |\n| Back slat | 3 | 1 200 | 90 | 19 |\n| Leg | 4 | 450 | 70 | 70 |\n' +
  '| Cross piece | 2 | 440 | 70 | 45 |\n| Back support | 2 | 800 | 70 | 45 |\n' +
  'Each seat slat is fixed to each cross piece with 2 screws. The seat is 440 mm deep from front to back. ' +
  'The 6 seat slats run side by side across it with equal gaps between them, and no gap at the front or back edge.'

const CAMP =
  'The layout plan of a camp site is drawn to a scale of 1 : 1 000, with north at the top of the plan. TABLE 3 describes what the plan shows.\n' +
  '|+ TABLE 3: WHAT THE CAMP SITE PLAN SHOWS\n| Feature | Details |\n|---|---|\n' +
  '| Camp stands | 24 stands, numbered 1 to 24; at most 6 campers per stand |\n' +
  '| Stands with electricity | Stands 1 to 10, the ten stands closest to the reception |\n' +
  '| Ablution block | In the centre of the site: 8 toilets, 4 showers for men and 6 showers for women |\n' +
  '| Reception | At the main gate, in the south-west corner of the site |\n' +
  '| Swimming pool | North-east of the ablution block |\n' +
  'On the plan, the straight path from the reception to the ablution block is 82 mm long.'

const PROFILE =
  'A group of cyclists rides a three-day tour. TABLE 4 shows the height above sea level at points along the Day 2 route.\n' +
  '|+ TABLE 4: HEIGHT ABOVE SEA LEVEL ALONG THE DAY 2 ROUTE\n| Distance from start (km) | Height above sea level (m) |\n|---|---|\n' +
  '| 0 | 1 380 |\n| 10 | 1 455 |\n| 20 | 1 520 |\n| 30 | 1 490 |\n| 40 | 1 310 |\n| 50 | 1 105 |\n| 60 | 960 |\n| 70 | 1 020 |'

const CUSHIONS =
  'Zanele sews cushions to sell. One morning she started sewing at 08:40 and finished a batch at 11:25. ' +
  'Each cushion is a 45 cm by 45 cm square and is 12 cm thick when filled. She stores the cushions stacked on a cupboard shelf with 50 cm of space above it. ' +
  'She sews piping (a cord) all the way around the edge of each cushion, and buys the piping in rolls of 20 m.'

const TABLECLOTH =
  'Zanele also makes a round tablecloth for a round table with a diameter of 1,2 m. The tablecloth must hang 25 cm over the edge of the table all the way round. ' +
  'Use π = 3,142. Circumference = π × diameter; Area of a circle = π × radius².'

const BOXES =
  'Cube-shaped gift boxes have sides of 15 cm. They are packed upright into a carton that is 60 cm long, 45 cm wide and 30 cm high. ' +
  'Volume of a cube = side × side × side, and 1 000 cm³ = 1 litre.'

const FOODS =
  'A food label from the USA gives temperatures in degrees Fahrenheit (°F). TABLE 5 shows the highest temperature at which some foods should be stored.\n' +
  '|+ TABLE 5: MAXIMUM STORAGE TEMPERATURES\n| Food | Maximum storage temperature |\n|---|---|\n' +
  '| Ice cream | 0 °F |\n| Frozen vegetables | 5 °F |\n| Fresh milk | 40 °F |\n| Butter | 45 °F |\n| Potatoes | 50 °F |\n' +
  'Temperature in °C = (temperature in °F − 32) ÷ 1,8'

const TANK =
  'A dairy stores milk in a cylindrical steel tank that is open at the top. The tank has a diameter of 1,4 m and a height of 1,6 m. ' +
  'The inside of the tank (the base and the curved side) must be painted with a food-safe paint; one litre covers 6 m².\n' +
  'Surface area of an open cylinder = π × radius² + 2 × π × radius × height, using π = 3,142.'

const BRICKS =
  'Sipho builds a double brick wall (two bricks thick) that is 6 m long and 1,8 m high. A brick is 222 mm long, 106 mm wide and 73 mm high, ' +
  'and every mortar joint is 10 mm thick. Bricks are delivered on pallets of 500 bricks.'

const TOUR =
  'A tour group visits Namibia. TABLE 6 shows some towns on their route. (Distances and temperatures are approximate.)\n' +
  '|+ TABLE 6: TOWNS ON THE TOUR\n| Town | Region | km from Windhoek | Jan. max. (°C) |\n|---|---|---|---|\n' +
  '| Windhoek | Khomas | 0 | 30 |\n| Okahandja | Otjozondjupa | 71 | 32 |\n| Swakopmund | Erongo | 356 | 23 |\n' +
  '| Walvis Bay | Erongo | 390 | 24 |\n| Sesriem | Hardap | 305 | 36 |\n| Lüderitz | Karas | 690 | 22 |'

const VISITORS =
  'TABLE 7 shows the number of visitors to a national park each month for one year. (The figures are invented for practice.)\n' +
  '|+ TABLE 7: VISITORS TO A NATIONAL PARK\n| Month | Visitors |\n|---|---|\n' +
  '| Jan | 18 450 |\n| Feb | 12 300 |\n| Mar | 14 980 |\n| Apr | 21 600 |\n| May | 16 200 |\n| Jun | 19 750 |\n' +
  '| Jul | 26 400 |\n| Aug | 28 150 |\n| Sep | 24 900 |\n| Oct | 22 300 |\n| Nov | 15 600 |\n| Dec | W |\n| TOTAL | 240 500 |'

const HEIGHTS =
  'Three well-known heights: Big Daddy, a sand dune near Sesriem, is about 325 m high; Table Mountain is about 1 085 m high; ' +
  'the Burj Khalifa building in Dubai is 2 717 feet tall. 1 foot = 0,3048 m.'

const DENSITY =
  'Namibia has an area of about 825 600 km² and a population of about 3 022 000. The Erongo region covers about 63 600 km² and has about 240 000 people; ' +
  'the Khomas region, which contains Windhoek, covers about 36 960 km² and has about 494 600 people. (The figures are approximate.)\n' +
  'Population density = number of people ÷ area'

// ---------------------------------------------------------------- paper

export const matLitG12P2Y2024: Paper = {
  id: 'ml-p2-2024',
  subjectId: 'mat-lit',
  paperNumber: 2,
  grade: 12,
  kind: 'past',
  year: 2024,
  title: '2024 Paper 2',
  durationMinutes: 180,
  totalMarks: 150,
  sections: [
    {
      number: 1,
      title: 'Terms, a garden wall and a bench',
      topicId: 'measurement',
      marks: 26,
      items: [
        ...(
          [
            ['1.1.1', 'LEGEND (KEY)', 'B', ['F', 'B', 'A', 'G'], 'A legend (or key) explains the symbols on a map or plan.'],
            ['1.1.2', 'VOLUME', 'C', ['G', 'E', 'C', 'D'], 'Volume is the space inside a 3-D object; G, capacity, is how much liquid it holds.'],
            ['1.1.3', 'ELEVATION', 'A', ['A', 'F', 'B', 'H'], 'An elevation shows one side of a building; F, a floor plan, shows it from above.'],
            ['1.1.4', 'RADIUS', 'H', ['D', 'C', 'E', 'H'], 'The radius runs from the centre of a circle to its edge; D is the circumference.'],
          ] as const
        ).map(([label, term, right, letters, why], k) => ({
          id: 'ml-p2-24n-1-1-' + (k + 1),
          label,
          topicId: k === 0 || k === 2 ? 'maps-plans' : 'measurement',
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
          id: 'ml-p2-24n-1-2-1',
          label: '1.2.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: WALL,
          prompt: 'Convert the length of one block to metres.',
          answer: '0,39 m',
          explanation: 'There are 1 000 mm in a metre: 390 mm ÷ 1 000 = 0,39 m.',
          memo: [
            { code: 'M', marks: 1, text: '390 ÷ 1 000' },
            { code: 'A', marks: 1, text: '0,39 m' },
          ],
        },
        {
          id: 'ml-p2-24n-1-2-2',
          label: '1.2.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: WALL,
          prompt: 'Which ONE of the following units is the most suitable for the AREA of the wall?',
          options: [
            { id: 'a', label: 'm³' },
            { id: 'b', label: 'm²' },
            { id: 'c', label: 'ℓ' },
            { id: 'd', label: 'kg' },
          ],
          correctOptionId: 'b',
          answer: 'm²',
          explanation: 'Area is measured in square units. m³ is for volume, litres for capacity and kilograms for mass.',
          memo: [{ code: 'A', marks: 2, text: 'm²' }],
        },
        {
          id: 'ml-p2-24n-1-2-3',
          label: '1.2.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: WALL,
          prompt: 'Calculate the number of blocks in ONE row of the wall.',
          answer: '10 blocks',
          explanation: 'Each block takes up its own 390 mm plus a 10 mm joint: 400 mm. The wall is 4 m = 4 000 mm long, so 4 000 ÷ 400 = 10 blocks.',
          memo: [
            { code: 'RT', marks: 1, text: '390 mm + 10 mm = 400 mm' },
            { code: 'M', marks: 1, text: '4 000 ÷ 400' },
            { code: 'A', marks: 1, text: '10 blocks' },
          ],
        },
        {
          id: 'ml-p2-24n-1-3-1',
          label: '1.3.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: BENCH,
          prompt: 'Write down the total number of slats (seat and back) in the bench.',
          answer: '9 slats',
          explanation: '6 seat slats + 3 back slats = 9.',
          memo: [{ code: 'A', marks: 2, text: '9' }],
        },
        {
          id: 'ml-p2-24n-1-3-2',
          label: '1.3.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: BENCH,
          prompt: 'Calculate the number of screws needed to fix the seat slats to the cross pieces.',
          answer: '24 screws',
          explanation: 'Each of the 6 seat slats is fixed to each of the 2 cross pieces with 2 screws: 6 × 2 × 2 = 24.',
          memo: [
            { code: 'RT', marks: 1, text: '6 seat slats and 2 cross pieces' },
            { code: 'M', marks: 1, text: '6 × 2 × 2' },
            { code: 'A', marks: 1, text: '24' },
          ],
        },
        {
          id: 'ml-p2-24n-1-3-3',
          label: '1.3.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: BENCH,
          prompt: 'Name the longest part of the bench that is NOT a slat.',
          answer: 'The back support (800 mm)',
          explanation: 'Leaving out the 1 200 mm slats, the longest part is the back support at 800 mm.',
          memo: [{ code: 'RT', marks: 2, text: 'Back support' }],
        },
        {
          id: 'ml-p2-24n-1-3-4',
          label: '1.3.4',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: BENCH,
          prompt: 'Write down the thickness of a seat slat in centimetres.',
          answer: '1,9 cm',
          explanation: '19 mm ÷ 10 = 1,9 cm.',
          memo: [{ code: 'A', marks: 2, text: '1,9 cm' }],
        },
        {
          id: 'ml-p2-24n-1-3-5',
          label: '1.3.5',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: BENCH,
          prompt: 'Calculate the width of each gap between two seat slats, in mm.',
          answer: '10 mm',
          explanation: 'The slats fill 6 × 65 = 390 mm of the 440 mm seat, leaving 50 mm. Six slats side by side have 5 gaps between them: 50 ÷ 5 = 10 mm.',
          memo: [
            { code: 'M', marks: 1, text: '(440 − 6 × 65) ÷ 5' },
            { code: 'A', marks: 1, text: '10 mm' },
          ],
        },
      ],
    },
    {
      number: 2,
      title: 'A camp site and a cycle tour',
      topicId: 'maps-plans',
      marks: 31,
      items: [
        {
          id: 'ml-p2-24n-2-1-1',
          label: '2.1.1',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CAMP,
          prompt: 'From which view is a layout plan drawn?',
          answer: 'From above (a top view)',
          explanation: 'A layout plan shows the site as seen from directly above.',
          memo: [{ code: 'A', marks: 2, text: 'From above / top view' }],
        },
        {
          id: 'ml-p2-24n-2-1-2',
          label: '2.1.2',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: CAMP,
          prompt: 'Calculate the maximum number of campers the camp site can hold.',
          answer: '144 campers',
          explanation: '24 stands × 6 campers per stand = 144.',
          memo: [
            { code: 'RT', marks: 1, text: '24 stands and 6 campers' },
            { code: 'M', marks: 1, text: '24 × 6' },
            { code: 'A', marks: 1, text: '144' },
          ],
        },
        {
          id: 'ml-p2-24n-2-1-3',
          label: '2.1.3',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CAMP,
          prompt: 'In which general direction would you walk from the ablution block to the reception?',
          answer: 'South-west',
          explanation: 'The ablution block is in the centre of the site and the reception is in the south-west corner.',
          memo: [{ code: 'A', marks: 2, text: 'South-west' }],
        },
        {
          id: 'ml-p2-24n-2-1-4',
          label: '2.1.4',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: CAMP,
          prompt: 'How many stands do NOT have electricity?',
          answer: '14 stands',
          explanation: 'Stands 1 to 10 have electricity, so 24 − 10 = 14 do not.',
          memo: [
            { code: 'M', marks: 1, text: '24 − 10' },
            { code: 'A', marks: 1, text: '14' },
          ],
        },
        {
          id: 'ml-p2-24n-2-1-5',
          label: '2.1.5',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: CAMP,
          prompt: 'A family is given a stand at random. Determine, as a percentage, the probability that their stand has electricity.',
          answer: '≈ 41,7%',
          explanation: '10 of the 24 stands have electricity: 10/24 × 100% = 41,7%.',
          memo: [
            { code: 'A', marks: 1, text: 'Numerator 10' },
            { code: 'A', marks: 1, text: 'Denominator 24' },
            { code: 'CA', marks: 1, text: '41,7%' },
          ],
        },
        {
          id: 'ml-p2-24n-2-1-6a',
          label: '2.1.6(a)',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: CAMP,
          prompt: 'Write down the total number of showers in the ablution block.',
          answer: '10 showers',
          explanation: '4 showers for men + 6 showers for women = 10.',
          memo: [{ code: 'A', marks: 2, text: '10' }],
        },
        {
          id: 'ml-p2-24n-2-1-6b',
          label: '2.1.6(b)',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: CAMP,
          prompt: 'Use the scale to calculate the actual length of the path from the reception to the ablution block, in metres.',
          answer: '82 m',
          explanation: 'At 1 : 1 000, every 1 mm on the plan is 1 000 mm in real life: 82 mm × 1 000 = 82 000 mm = 82 m.',
          memo: [
            { code: 'RT', marks: 1, text: '82 mm' },
            { code: 'M', marks: 1, text: '× 1 000' },
            { code: 'C', marks: 1, text: '82 000 mm to metres' },
            { code: 'CA', marks: 1, text: '82 m' },
          ],
        },
        {
          id: 'ml-p2-24n-2-1-6c',
          label: '2.1.6(c)',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: CAMP,
          prompt: 'Give ONE reason why the stands with electricity are the ones closest to the reception.',
          answer: 'The electricity supply comes in at the main gate, so shorter cables to the nearest stands are cheaper and easier to install and check.',
          explanation: 'Other valid reasons: staff at the reception can keep an eye on the power points, or campers who pay extra for power are near the office.',
          memo: [{ code: 'J', marks: 2, text: 'Any valid reason, e.g. shorter, cheaper cable runs from the supply at the gate' }],
        },
        {
          id: 'ml-p2-24n-2-2-1',
          label: '2.2.1',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: PROFILE,
          prompt: 'Write down the distance from the start at which the Day 2 route reaches its highest point.',
          answer: '20 km',
          explanation: 'The greatest height in the table is 1 520 m, at 20 km.',
          memo: [{ code: 'RT', marks: 2, text: '20 km' }],
        },
        {
          id: 'ml-p2-24n-2-2-2',
          label: '2.2.2',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: PROFILE,
          prompt: 'Which ONE of these sections of the route goes UPHILL?',
          options: [
            { id: 'a', label: '20 km to 30 km' },
            { id: 'b', label: '30 km to 40 km' },
            { id: 'c', label: '60 km to 70 km' },
            { id: 'd', label: '40 km to 50 km' },
          ],
          correctOptionId: 'c',
          answer: '60 km to 70 km',
          explanation: 'The height rises from 960 m to 1 020 m between 60 km and 70 km. In the other three sections it falls.',
          memo: [{ code: 'RT', marks: 2, text: '60 km to 70 km' }],
        },
        {
          id: 'ml-p2-24n-2-2-3',
          label: '2.2.3',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: PROFILE,
          prompt: 'Calculate the difference in height between the highest and the lowest points of the Day 2 route.',
          answer: '560 m',
          explanation: 'Highest 1 520 m (at 20 km), lowest 960 m (at 60 km): 1 520 − 960 = 560 m.',
          memo: [
            { code: 'RT', marks: 1, text: '1 520 m and 960 m' },
            { code: 'A', marks: 1, text: '560 m' },
          ],
        },
        {
          id: 'ml-p2-24n-2-2-4',
          label: '2.2.4',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: PROFILE,
          prompt: 'Explain why the section from 30 km to 60 km should be the easiest part of the Day 2 route to ride.',
          answer: 'The height drops at every point from 30 km to 60 km (1 490 m → 1 310 m → 1 105 m → 960 m), so that whole section is downhill.',
          explanation: 'A falling height means the road goes downhill, which takes the least effort on a bicycle.',
          memo: [{ code: 'J', marks: 2, text: 'The height keeps decreasing, so it is all downhill' }],
        },
        {
          id: 'ml-p2-24n-2-2-5',
          label: '2.2.5',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: PROFILE,
          prompt: 'A cyclist says the route climbs more than TWICE as much in the first 20 km as it does between 60 km and 70 km. Verify whether she is correct.',
          answer: 'First 20 km: 1 520 − 1 380 = 140 m. 60 km to 70 km: 1 020 − 960 = 60 m. 140 m is more than 2 × 60 m = 120 m, so she is CORRECT.',
          explanation: 'Work out each climb as a difference in height, then compare the first with twice the second.',
          memo: [
            { code: 'A', marks: 1, text: '140 m' },
            { code: 'A', marks: 1, text: '60 m' },
            { code: 'J', marks: 1, text: 'CORRECT' },
          ],
        },
      ],
    },
    {
      number: 3,
      title: 'Cushions, a round tablecloth and gift boxes',
      topicId: 'measurement',
      marks: 31,
      items: [
        {
          id: 'ml-p2-24n-3-1-1',
          label: '3.1.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: CUSHIONS,
          prompt: 'Calculate how long Zanele sewed that morning, in hours and minutes.',
          answer: '2 hours 45 minutes',
          explanation: 'From 08:40 to 11:25: 08:40 to 11:40 would be 3 hours, and 11:25 is 15 minutes earlier, so 2 h 45 min.',
          memo: [
            { code: 'M', marks: 1, text: '11:25 − 08:40' },
            { code: 'A', marks: 1, text: '2 h 45 min' },
          ],
        },
        {
          id: 'ml-p2-24n-3-1-2',
          label: '3.1.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: CUSHIONS,
          prompt: 'Determine how many cushions fit on one shelf, stacked on top of each other, and how much space is left above the stack.',
          answer: '4 cushions, with 2 cm left above them',
          explanation: '50 ÷ 12 = 4,17, so only 4 whole cushions fit. They take 4 × 12 = 48 cm, leaving 50 − 48 = 2 cm.',
          memo: [
            { code: 'M', marks: 1, text: '50 ÷ 12' },
            { code: 'CA', marks: 1, text: '4 cushions' },
            { code: 'M', marks: 1, text: '50 − 4 × 12' },
            { code: 'CA', marks: 1, text: '2 cm' },
          ],
        },
        {
          id: 'ml-p2-24n-3-1-3',
          label: '3.1.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 5,
          context: CUSHIONS + '\nPerimeter of a square = 2 × (length + width)',
          prompt: 'Calculate the number of cushions Zanele can pipe with ONE roll of piping.',
          answer: '11 cushions',
          explanation: 'Perimeter of one cushion = 2 × (45 + 45) = 180 cm = 1,8 m. 20 m ÷ 1,8 m = 11,1, so 11 whole cushions (the rest is too short for a 12th).',
          memo: [
            { code: 'SF', marks: 1, text: '2 × (45 + 45)' },
            { code: 'A', marks: 1, text: '180 cm' },
            { code: 'C', marks: 1, text: '1,8 m' },
            { code: 'M', marks: 1, text: '20 ÷ 1,8' },
            { code: 'CA', marks: 1, text: '11 cushions' },
          ],
        },
        {
          id: 'ml-p2-24n-3-2-1',
          label: '3.2.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: TABLECLOTH,
          prompt: 'Calculate the circumference of the table top, in metres.',
          answer: '≈ 3,77 m',
          explanation: 'Circumference = 3,142 × 1,2 m = 3,77 m.',
          memo: [
            { code: 'SF', marks: 1, text: '3,142 × 1,2' },
            { code: 'CA', marks: 1, text: '3,77 m' },
          ],
        },
        {
          id: 'ml-p2-24n-3-2-2',
          label: '3.2.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TABLECLOTH,
          prompt: 'Determine the radius of the tablecloth, in cm.',
          answer: '85 cm',
          explanation: 'The table’s radius is 1,2 m ÷ 2 = 0,6 m = 60 cm, and the cloth hangs 25 cm further: 60 + 25 = 85 cm.',
          memo: [
            { code: 'M', marks: 1, text: '60 cm + 25 cm' },
            { code: 'A', marks: 1, text: '85 cm' },
          ],
        },
        {
          id: 'ml-p2-24n-3-2-3',
          label: '3.2.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 9,
          context: TABLECLOTH + '\nThe tablecloth has a radius of 85 cm.',
          prompt: 'Zanele says that ONE square piece of fabric measuring 1,8 m by 1,8 m is big enough to cut the tablecloth from, and that LESS than a third of the square will be wasted. Verify, showing ALL calculations, whether BOTH parts of her statement are correct.',
          answer: 'The cloth is 170 cm across, which fits in 180 cm. Waste = 3,24 − 2,27 = 0,97 m², which is 29,9% of the square — less than a third. Her statement is CORRECT.',
          explanation:
            'Diameter of the cloth = 2 × 85 = 170 cm = 1,7 m, less than 1,8 m, so it fits. Area of the cloth = 3,142 × 0,85² = 2,27 m². ' +
            'Area of the square = 1,8 × 1,8 = 3,24 m². Waste = 3,24 − 2,27 = 0,97 m², and 0,97 ÷ 3,24 = 29,9%, which is less than 33,3%.',
          memo: [
            { code: 'M', marks: 1, text: 'Diameter 2 × 85 cm' },
            { code: 'A', marks: 1, text: '170 cm is less than 180 cm, so it fits' },
            { code: 'SF', marks: 1, text: '3,142 × 0,85²' },
            { code: 'CA', marks: 1, text: '2,27 m²' },
            { code: 'M', marks: 1, text: '1,8 × 1,8' },
            { code: 'A', marks: 1, text: '3,24 m²' },
            { code: 'M', marks: 1, text: 'Waste 3,24 − 2,27 as a fraction of 3,24' },
            { code: 'CA', marks: 1, text: '29,9% (less than a third)' },
            { code: 'J', marks: 1, text: 'CORRECT' },
          ],
        },
        {
          id: 'ml-p2-24n-3-3-1',
          label: '3.3.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: BOXES,
          prompt: 'Calculate the volume of ONE gift box, in litres.',
          answer: '3,375 litres',
          explanation: '15 × 15 × 15 = 3 375 cm³, and 3 375 ÷ 1 000 = 3,375 litres.',
          memo: [
            { code: 'SF', marks: 1, text: '15 × 15 × 15' },
            { code: 'A', marks: 1, text: '3 375 cm³' },
            { code: 'C', marks: 1, text: '÷ 1 000' },
            { code: 'CA', marks: 1, text: '3,375 ℓ' },
          ],
        },
        {
          id: 'ml-p2-24n-3-3-2',
          label: '3.3.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: BOXES,
          prompt: 'Calculate the number of gift boxes that fit in one carton.',
          answer: '24 boxes',
          explanation: 'Along the length 60 ÷ 15 = 4, across the width 45 ÷ 15 = 3, and up the height 30 ÷ 15 = 2: 4 × 3 × 2 = 24.',
          memo: [
            { code: 'M', marks: 1, text: 'Dividing each carton measurement by 15' },
            { code: 'A', marks: 1, text: '4, 3 and 2' },
            { code: 'CA', marks: 1, text: '24' },
          ],
        },
      ],
    },
    {
      number: 4,
      title: 'Storing food, a milk tank and a brick wall',
      topicId: 'measurement',
      marks: 29,
      items: [
        {
          id: 'ml-p2-24n-4-1-1',
          label: '4.1.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: FOODS,
          prompt: 'Name the food that must be stored at the LOWEST temperature.',
          answer: 'Ice cream',
          explanation: 'Ice cream has the lowest maximum storage temperature in the table: 0 °F.',
          memo: [{ code: 'RT', marks: 2, text: 'Ice cream' }],
        },
        {
          id: 'ml-p2-24n-4-1-2',
          label: '4.1.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: FOODS,
          prompt: 'Name the food with a maximum storage temperature of 50 °F.',
          answer: 'Potatoes',
          explanation: 'Read from the table: potatoes, 50 °F.',
          memo: [{ code: 'RT', marks: 2, text: 'Potatoes' }],
        },
        {
          id: 'ml-p2-24n-4-1-3',
          label: '4.1.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 4,
          context: FOODS,
          prompt: 'A fridge is set at 4 °C. Convert the maximum storage temperature of fresh milk to °C, and say whether the fridge keeps milk cold enough.',
          answer: '40 °F ≈ 4,4 °C. The fridge (4 °C) is colder than that, so it keeps milk cold enough.',
          explanation: '(40 − 32) ÷ 1,8 = 8 ÷ 1,8 = 4,4 °C. Milk must be kept at 4,4 °C or colder, and 4 °C is colder.',
          memo: [
            { code: 'SF', marks: 1, text: '(40 − 32) ÷ 1,8' },
            { code: 'S', marks: 1, text: '8 ÷ 1,8' },
            { code: 'CA', marks: 1, text: '4,4 °C' },
            { code: 'J', marks: 1, text: 'Yes, 4 °C is colder than 4,4 °C' },
          ],
        },
        {
          id: 'ml-p2-24n-4-1-4',
          label: '4.1.4',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 7,
          context: TANK,
          prompt: 'Calculate the number of whole litres of paint needed to give the inside of the tank one coat.',
          answer: '2 litres',
          explanation:
            'Radius = 1,4 ÷ 2 = 0,7 m. Base = 3,142 × 0,7² = 1,54 m². Curved side = 2 × 3,142 × 0,7 × 1,6 = 7,04 m². ' +
            'Total = 8,58 m². 8,58 ÷ 6 = 1,43 litres, and paint is bought in whole litres, so 2 litres.',
          memo: [
            { code: 'A', marks: 1, text: 'Radius 0,7 m' },
            { code: 'SF', marks: 1, text: '3,142 × 0,7²' },
            { code: 'SF', marks: 1, text: '2 × 3,142 × 0,7 × 1,6' },
            { code: 'CA', marks: 1, text: '8,58 m²' },
            { code: 'M', marks: 1, text: '÷ 6' },
            { code: 'CA', marks: 1, text: '1,43 ℓ' },
            { code: 'R', marks: 1, text: '2 litres (rounded up)' },
          ],
        },
        {
          id: 'ml-p2-24n-4-2-1',
          label: '4.2.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 5,
          context: BRICKS,
          prompt: 'Calculate the number of bricks in ONE row of the double wall. A brick that has to be cut to fit still counts as a whole brick.',
          answer: '52 bricks',
          explanation:
            'Each brick with its joint takes 222 + 10 = 232 mm. The wall is 6 m = 6 000 mm long: 6 000 ÷ 232 = 25,86, so 26 bricks in each layer. ' +
            'The wall is two bricks thick: 26 × 2 = 52 bricks in a row.',
          memo: [
            { code: 'A', marks: 1, text: '232 mm' },
            { code: 'C', marks: 1, text: '6 m = 6 000 mm' },
            { code: 'M', marks: 1, text: '6 000 ÷ 232' },
            { code: 'CA', marks: 1, text: '26 (rounded up)' },
            { code: 'CA', marks: 1, text: '26 × 2 = 52' },
          ],
        },
        {
          id: 'ml-p2-24n-4-2-2',
          label: '4.2.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 7,
          context: BRICKS + '\nThere are 52 bricks in one row of the double wall.',
          prompt: 'Sipho says that TWO pallets of bricks will be enough for the whole wall. Verify, showing ALL calculations, whether he is correct.',
          answer: '22 rows × 52 = 1 144 bricks are needed, but two pallets hold only 1 000. He is NOT correct.',
          explanation:
            'Each row with its joint is 73 + 10 = 83 mm high. The wall is 1,8 m = 1 800 mm high: 1 800 ÷ 83 = 21,7, so 22 rows. ' +
            '22 × 52 = 1 144 bricks, and 2 × 500 = 1 000 bricks — 144 short.',
          memo: [
            { code: 'A', marks: 1, text: '83 mm per row' },
            { code: 'M', marks: 1, text: '1 800 ÷ 83' },
            { code: 'CA', marks: 1, text: '22 rows' },
            { code: 'M', marks: 1, text: '22 × 52' },
            { code: 'CA', marks: 1, text: '1 144 bricks' },
            { code: 'A', marks: 1, text: '2 × 500 = 1 000' },
            { code: 'J', marks: 1, text: 'NOT correct' },
          ],
        },
        {
          id: 'ml-p2-24n-4-2-3',
          label: '4.2.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 4,
          marks: 2,
          context: BRICKS,
          prompt: 'Give ONE reason why a builder usually orders more bricks than the number calculated.',
          answer: 'Some bricks break during delivery or when they are cut, so extra bricks cover the waste.',
          explanation: 'Other valid reasons: rounding and cutting at the ends of rows, or bricks from a later order may not match in colour.',
          memo: [{ code: 'J', marks: 2, text: 'Any valid reason, e.g. breakages and cutting waste' }],
        },
      ],
    },
    {
      number: 5,
      title: 'A tour of Namibia',
      topicId: 'maps-plans',
      marks: 33,
      items: [
        {
          id: 'ml-p2-24n-5-1-1',
          label: '5.1.1',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TOUR,
          prompt: 'Name the TWO towns in the Erongo region.',
          answer: 'Swakopmund and Walvis Bay',
          explanation: 'Read from the Region column.',
          memo: [
            { code: 'RT', marks: 1, text: 'Swakopmund' },
            { code: 'RT', marks: 1, text: 'Walvis Bay' },
          ],
        },
        {
          id: 'ml-p2-24n-5-1-2',
          label: '5.1.2',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 3,
          context: VISITORS,
          prompt: 'Write down ALL the months from January to November in which more than 20 000 people visited the park.',
          answer: 'April, July, August, September and October',
          explanation: 'Apr 21 600, Jul 26 400, Aug 28 150, Sep 24 900 and Oct 22 300 are the only values above 20 000.',
          memo: [
            { code: 'RT', marks: 1, text: 'April' },
            { code: 'RT', marks: 1, text: 'July and August' },
            { code: 'RT', marks: 1, text: 'September and October' },
          ],
        },
        {
          id: 'ml-p2-24n-5-1-3',
          label: '5.1.3',
          topicId: 'data-handling',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: VISITORS,
          prompt: 'Calculate W, the number of visitors in December.',
          answer: '19 870',
          explanation: 'The eleven known months add up to 220 630. W = 240 500 − 220 630 = 19 870.',
          memo: [
            { code: 'RT', marks: 1, text: 'ALL eleven monthly values and the total' },
            { code: 'M', marks: 1, text: '240 500 − their sum' },
            { code: 'A', marks: 1, text: '19 870' },
          ],
        },
        {
          id: 'ml-p2-24n-5-1-4',
          label: '5.1.4',
          topicId: 'maps-plans',
          grade: 12,
          difficulty: 'Easy',
          cognitiveLevel: 1,
          marks: 2,
          context: TOUR,
          prompt: 'Which town has the LOWEST average maximum temperature in January?',
          answer: 'Lüderitz (22 °C)',
          explanation: 'The lowest value in the temperature column is 22 °C, for Lüderitz.',
          memo: [{ code: 'RT', marks: 2, text: 'Lüderitz' }],
        },
        {
          id: 'ml-p2-24n-5-1-5',
          label: '5.1.5',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: TOUR + '\nTime = distance ÷ speed',
          prompt: 'The tour bus drives from Windhoek to Swakopmund at an average speed of 85 km/h. Calculate the travelling time, in hours and minutes.',
          answer: '≈ 4 hours 11 minutes',
          explanation: 'Time = 356 km ÷ 85 km/h = 4,19 hours. 0,19 × 60 = 11 minutes, so about 4 h 11 min.',
          memo: [
            { code: 'SF', marks: 1, text: '356 ÷ 85' },
            { code: 'CA', marks: 1, text: '4,19 hours' },
            { code: 'C', marks: 1, text: '0,19 × 60 minutes' },
            { code: 'CA', marks: 1, text: '4 h 11 min' },
          ],
        },
        {
          id: 'ml-p2-24n-5-2-1',
          label: '5.2.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 3,
          context: HEIGHTS,
          prompt: 'Convert the height of the Burj Khalifa to metres.',
          answer: '≈ 828 m',
          explanation: '2 717 feet × 0,3048 = 828,1 m.',
          memo: [
            { code: 'RT', marks: 1, text: '2 717 feet' },
            { code: 'M', marks: 1, text: '× 0,3048' },
            { code: 'CA', marks: 1, text: '828 m' },
          ],
        },
        {
          id: 'ml-p2-24n-5-2-2',
          label: '5.2.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 4,
          context: HEIGHTS + '\nThe Burj Khalifa is about 828 m tall.',
          prompt: 'Write the heights Big Daddy : Table Mountain : Burj Khalifa as a ratio in the form 1 : ... : ..., rounded to two decimal places.',
          answer: '1 : 3,34 : 2,55',
          explanation: '325 : 1 085 : 828. Divide every term by 325: 1 : 3,34 : 2,55.',
          memo: [
            { code: 'A', marks: 1, text: '325 : 1 085 : 828 in the correct order' },
            { code: 'M', marks: 1, text: 'Dividing every term by 325' },
            { code: 'CA', marks: 1, text: '3,34' },
            { code: 'CA', marks: 1, text: '2,55' },
          ],
        },
        {
          id: 'ml-p2-24n-5-3-1',
          label: '5.3.1',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Moderate',
          cognitiveLevel: 2,
          marks: 2,
          context: DENSITY,
          prompt: 'National parks and reserves cover about 17% of Namibia. Calculate this area, in km².',
          answer: '≈ 140 352 km²',
          explanation: '17% × 825 600 km² = 0,17 × 825 600 = 140 352 km².',
          memo: [
            { code: 'M', marks: 1, text: '17% × 825 600' },
            { code: 'A', marks: 1, text: '140 352 km²' },
          ],
        },
        {
          id: 'ml-p2-24n-5-3-2',
          label: '5.3.2',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 3,
          marks: 3,
          context: DENSITY,
          prompt: 'Calculate the population density of Namibia as a whole, in people per km².',
          answer: '≈ 3,66 people per km²',
          explanation: '3 022 000 ÷ 825 600 = 3,66 people per km².',
          memo: [
            { code: 'SF', marks: 1, text: '3 022 000 ÷ 825 600' },
            { code: 'CA', marks: 1, text: '3,66' },
            { code: 'A', marks: 1, text: 'Unit: people per km²' },
          ],
        },
        {
          id: 'ml-p2-24n-5-3-3',
          label: '5.3.3',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 3,
          context: DENSITY + '\nNamibia as a whole has about 3,66 people per km².',
          prompt: 'Show, with a calculation, whether the Erongo region is MORE or LESS densely populated than Namibia as a whole.',
          answer: 'Erongo: 240 000 ÷ 63 600 ≈ 3,77 people per km², slightly MORE than 3,66 for the country.',
          explanation: 'Compare densities, not populations: Erongo has far fewer people than the country but also a much smaller area.',
          memo: [
            { code: 'M', marks: 1, text: '240 000 ÷ 63 600' },
            { code: 'CA', marks: 1, text: '3,77' },
            { code: 'J', marks: 1, text: 'MORE densely populated' },
          ],
        },
        {
          id: 'ml-p2-24n-5-3-4',
          label: '5.3.4',
          topicId: 'measurement',
          grade: 12,
          difficulty: 'Challenge',
          cognitiveLevel: 4,
          marks: 4,
          context: DENSITY + '\nNamibia as a whole has about 3,66 people per km².',
          prompt: 'A newspaper says that "fewer than 4 people live on each square kilometre of Namibia". Use the Khomas region to explain why this can be misleading.',
          answer: 'Khomas: 494 600 ÷ 36 960 ≈ 13,4 people per km², more than three times the national figure. The national average hides the fact that many people are crowded into towns such as Windhoek while large areas are almost empty.',
          explanation: 'An average spreads everyone evenly over the whole country, which is not how people actually live.',
          memo: [
            { code: 'RT', marks: 1, text: '494 600 and 36 960' },
            { code: 'M', marks: 1, text: '494 600 ÷ 36 960' },
            { code: 'CA', marks: 1, text: '13,4 people per km²' },
            { code: 'J', marks: 1, text: 'The average hides how unevenly people are spread' },
          ],
        },
      ],
    },
  ],
}
