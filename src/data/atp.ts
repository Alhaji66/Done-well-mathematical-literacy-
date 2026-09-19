/**
 * The Annual Teaching Plan, week by week.
 *
 * WHY THIS EXISTS. A teacher does not think in topics, they think in weeks:
 * "I am doing conversions next week." The question bank was organised the
 * other way round -- pick Measurement and you get every measurement question
 * in the grade, over 150 of them, with no way to take just the part being
 * taught. Printing meant printing all of it.
 *
 * So each ATP entry names the weeks, the dates, and the SUB-TOPICS that fall
 * in them. Choosing a week then selects exactly those sub-topics in the bank,
 * and the worksheet is the week's work rather than the year's.
 *
 * THE SUB-TOPIC NAMES ARE NOT FREE TEXT. Every name in `subtopics` must match
 * a sub-topic in that topic's note in topicNotes.ts, exactly -- that is what
 * ties an ATP week to the questions. `npm run check:atp` fails the build on
 * any name that does not, so a typo here cannot quietly produce an empty
 * worksheet.
 *
 * WEEKS WITH NO TOPIC. Revision and examination weeks carry no topicId. They
 * are listed anyway, because a teacher looking for "where am I in the year"
 * needs to see them, and because leaving them out would make the week numbers
 * lie.
 *
 * SOURCE. WCED Mathematical Literacy ATP 2026, Grades 11 and 12. Other grades
 * and subjects are absent rather than guessed: an ATP differs by province and
 * by year, and inventing one would put a teacher in front of a class with the
 * wrong work prepared. `atpFor()` returns undefined for those, and the UI
 * falls back to choosing sub-topics directly.
 */

export interface AtpWeek {
  term: 1 | 2 | 3 | 4
  /** As the ATP writes it: "2 – 4", "8", "9 – 12". */
  weeks: string
  /** As the ATP writes it: "19 Jan – 6 Feb". */
  dates: string
  /** The CAPS topic heading from the ATP, or what the weeks are for. */
  label: string
  /** The topic in this app the week's work belongs to. Absent for revision and exams. */
  topicId?: string
  /** Sub-topic names within that topic. Must match topicNotes.ts exactly. */
  subtopics?: string[]
  /** Anything the ATP says that the topic and sub-topics do not carry. */
  note?: string
}

export interface Atp {
  subjectId: string
  grade: number
  /** Whose plan this is, and for which year. Shown to the teacher. */
  source: string
  weeks: AtpWeek[]
}

const matLitG11: Atp = {
  subjectId: 'mat-lit',
  grade: 11,
  source: 'WCED Mathematical Literacy Grade 11 ATP 2026',
  weeks: [
    {
      term: 1,
      weeks: '1',
      dates: '14 Jan – 16 Jan',
      label: 'Revise Grade 10 Probability',
      topicId: 'data-handling',
      subtopics: ['Probability, chance and relative frequency'],
    },
    {
      term: 1,
      weeks: '2 – 4',
      dates: '19 Jan – 6 Feb',
      label: 'Data Handling',
      topicId: 'data-handling',
      subtopics: [
        'Collecting and organising data',
        'Mean, median and mode',
        'Spread: range, quartiles and box-and-whisker',
        'Representing data in tables and graphs',
        'Interpreting and comparing graphs',
      ],
      note: 'New to Grade 11: multiple bar graphs, compound graphs, scatter plots.',
    },
    {
      term: 1,
      weeks: '5 – 9',
      dates: '9 Feb – 13 March',
      label: 'Measurement',
      topicId: 'measurement',
      subtopics: [
        'Units and conversions',
        'Time, temperature and reading instruments',
        'Mass, rates and practical calculations',
        'Perimeter and distance around a shape',
        'Area',
        'Volume and capacity',
        'Surface area',
      ],
      note: 'New to Grade 11: metric to imperial, °C to °F, surface area and volume. Cost calculations may apply.',
    },
    { term: 1, weeks: '10 – 11', dates: '16 March – 27 March', label: 'Revision of Term 1' },

    {
      term: 2,
      weeks: '1 – 4',
      dates: '8 April – 30 April',
      label: 'Finance',
      topicId: 'finance',
      subtopics: [
        'Taxation: income tax, VAT and UIF',
        'Exchange rates and inflation',
        'Financial documents: payslips, bills and statements',
        'Income, expenditure and household budgets',
      ],
      note: 'New to Grade 11: UIF, and currency conversion tables.',
    },
    {
      term: 2,
      weeks: '5 – 7',
      dates: '4 May – 22 May',
      label: 'Maps, Plans and Other Representations',
      topicId: 'maps-plans',
      subtopics: [
        'Scale: number scales and bar scales',
        'Distance, direction and bearings',
        'Route planning and travel time',
        'Floor plans and elevation drawings',
        'Seating, layout and packing plans',
      ],
      note: 'New to Grade 11: street maps, road and rail maps, residential maps, strip charts, elevation maps.',
    },
    {
      term: 2,
      weeks: '8',
      dates: '25 May – 29 May',
      label: 'Probability',
      topicId: 'data-handling',
      subtopics: ['Probability, chance and relative frequency'],
      note: 'Simple and compound events, tree diagrams, two-way tables.',
    },
    {
      term: 2,
      weeks: '9 – 12',
      dates: '1 June – 26 June',
      label: 'Revision and Mid-Year Examination',
      note: 'Two papers, 75 marks each. P1 Finance, Data Handling and Probability. P2 Maps and Plans, Measurement and Probability.',
    },

    {
      term: 3,
      weeks: '1 – 2',
      dates: '21 July – 31 July',
      label: 'Finance: income, expenditure, profit and loss',
      topicId: 'finance',
      subtopics: [
        'Income, expenditure and household budgets',
        'Break-even, profit and business decisions',
      ],
      note: 'New to Grade 11: business finance, comparing two years, projected vs actual budgets.',
    },
    {
      term: 3,
      weeks: '3 – 4',
      dates: '3 Aug – 14 Aug',
      label: 'Finance: cost price and selling price',
      topicId: 'finance',
      subtopics: ['Break-even, profit and business decisions'],
      note: 'New to Grade 11: cost of producing, appropriate selling price, percentage profit.',
    },
    {
      term: 3,
      weeks: '5 – 6',
      dates: '17 Aug – 28 Aug',
      label: 'Finance: tariff systems',
      topicId: 'finance',
      subtopics: ['Tariffs and municipal accounts'],
      note: 'Municipal, telephone, transport and bank tariffs. New to Grade 11: comparing two options.',
    },
    {
      term: 3,
      weeks: '7 – 8',
      dates: '31 Aug – 11 Sept',
      label: 'Finance: patterns, relationships and break-even',
      topicId: 'finance',
      subtopics: ['Break-even, profit and business decisions'],
      note: 'New to Grade 11: two relationships at once, and break-even values from formulae and graphs.',
    },
    {
      term: 3,
      weeks: '9 – 10',
      dates: '14 Sept – 23 Sept',
      label: 'Finance: interest, loans and banking',
      topicId: 'finance',
      subtopics: ['Interest, loans and investments'],
      note: 'Bank accounts and interest without the formulae. New to Grade 11: loans and investments.',
    },

    {
      term: 4,
      weeks: '1 – 3',
      dates: '6 Oct – 23 Oct',
      label: 'Maps, Plans: models and assembly',
      topicId: 'maps-plans',
      subtopics: [
        'Models, assembly diagrams and instructions',
        'Seating, layout and packing plans',
      ],
      note: 'Packaging and best fit by practical method; assembly instructions for plugs, furniture, appliances.',
    },
    { term: 4, weeks: '4 – 6', dates: '26 Oct – 13 Nov', label: 'Revision and consolidation' },
    {
      term: 4,
      weeks: '7 – 10',
      dates: '16 Nov – 9 Dec',
      label: 'End-of-year examination',
      note: 'Two papers, 100 marks each, 2 hours. P1 Finance, Data Handling and Probability. P2 Maps and Plans, Measurement and Probability.',
    },
  ],
}

const matLitG12: Atp = {
  subjectId: 'mat-lit',
  grade: 12,
  source: 'WCED Mathematical Literacy Grade 12 ATP 2026',
  weeks: [
    {
      term: 1,
      weeks: '1',
      dates: '14 Jan – 16 Jan',
      label: 'Revise Grade 10 and 11 Probability',
      topicId: 'data-handling',
      subtopics: ['Probability, chance and relative frequency'],
    },
    {
      term: 1,
      weeks: '2 – 5',
      dates: '19 Jan – 13 Feb',
      label: 'Finance',
      topicId: 'finance',
      subtopics: [
        'Financial documents: payslips, bills and statements',
        'Taxation: income tax, VAT and UIF',
        'Tariffs and municipal accounts',
        'Income, expenditure and household budgets',
        'Break-even, profit and business decisions',
      ],
      note: 'Introduced in Grade 12: tax rate tables and IRP5, loan documents, personal income tax, taxable and non-taxable income, rebates.',
    },
    {
      term: 1,
      weeks: '6 – 8',
      dates: '16 Feb – 6 March',
      label: 'Data Handling',
      topicId: 'data-handling',
      subtopics: [
        'Collecting and organising data',
        'Mean, median and mode',
        'Spread: range, quartiles and box-and-whisker',
        'Representing data in tables and graphs',
        'Interpreting and comparing graphs',
      ],
      note: 'Introduced in Grade 12: quartiles, inter-quartile range, percentiles, box-and-whisker plots.',
    },
    { term: 1, weeks: '9 – 11', dates: '9 March – 27 March', label: 'Revision of Term 1' },

    {
      term: 2,
      weeks: '1 – 5',
      dates: '8 April – 8 May',
      label: 'Measurement',
      topicId: 'measurement',
      subtopics: [
        'Units and conversions',
        'Time, temperature and reading instruments',
        'Perimeter and distance around a shape',
        'Area',
        'Volume and capacity',
        'Surface area',
        'Mass, rates and practical calculations',
      ],
      note: 'Conversion factors and tables, metric to imperial, °C to °F, timetables, BMI. Cost calculations may apply.',
    },
    {
      term: 2,
      weeks: '6 – 8',
      dates: '11 May – 29 May',
      label: 'Maps, Plans and Other Representations',
      topicId: 'maps-plans',
      subtopics: [
        'Scale: number scales and bar scales',
        'Distance, direction and bearings',
        'Route planning and travel time',
      ],
      note: 'All Grade 10 to 12 map types, grid references, compass directions, slope on a map.',
    },
    {
      term: 2,
      weeks: '9 – 12',
      dates: '1 June – 26 June',
      label: 'Revision and Internal Examinations',
      note: 'Two papers, 100 marks each, 2 hours. Question 1 is 20% of the total and all Level 1.',
    },

    {
      term: 3,
      weeks: '1 – 2',
      dates: '21 July – 31 July',
      label: 'Finance: banking, inflation and exchange rates',
      topicId: 'finance',
      subtopics: ['Interest, loans and investments', 'Exchange rates and inflation'],
      note: 'Investments, insurance, hire purchase, residual and balloon payments, loans; buying power over time.',
    },
    {
      term: 3,
      weeks: '3 – 5',
      dates: '3 Aug – 21 Aug',
      label: 'Maps, Plans: plans and models',
      topicId: 'maps-plans',
      subtopics: [
        'Floor plans and elevation drawings',
        'Models, assembly diagrams and instructions',
        'Seating, layout and packing plans',
      ],
      note: 'Assembly instructions, symbols and notation, actual dimensions from a scale, 2D floor and elevation plans, 3D scale models, packaging.',
    },
    { term: 3, weeks: '6', dates: '24 Aug – 28 Aug', label: 'Revision' },
    {
      term: 3,
      weeks: '7 – 10',
      dates: '31 Aug – 23 Sept',
      label: 'Preparatory Examinations',
      note: 'Two papers, 150 marks each, 3 hours.',
    },

    {
      term: 4,
      weeks: '1 – 2',
      dates: '6 Oct – 16 Oct',
      label: 'Revision and examination preparation',
      note: 'P1 Finance, Data Handling and Probability. P2 Maps and Plans, Measurement and Probability.',
    },
    { term: 4, weeks: '3+', dates: 'From 19 Oct', label: 'Final Examination' },
  ],
}

const plans: Atp[] = [matLitG11, matLitG12]

/** The ATP for a subject and grade, or undefined where none has been supplied. */
export function atpFor(subjectId: string, grade: number): Atp | undefined {
  return plans.find((p) => p.subjectId === subjectId && p.grade === grade)
}

/** Every plan held, for the build check and for telling a teacher what is covered. */
export const allAtps = plans
