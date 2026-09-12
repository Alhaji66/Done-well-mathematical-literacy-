export interface WorkedExample {
  problem: string
  steps: string[]
  answer: string
}

/**
 * A CAPS topic is really a bundle of sub-topics -- "Electric Circuits" covers
 * series, parallel, internal resistance and power -- and a learner revising one
 * of them needs that sub-topic, not a summary of the whole bundle. So a note
 * carries a section per sub-topic under the topic's key ideas.
 */
export interface SubtopicNote {
  name: string
  points: string[]
}

export interface TopicNote {
  topicId: string
  summary: string
  keyIdeas: string[]
  subtopics?: SubtopicNote[]
  /** Formulae, laws or definitions a learner is expected to reproduce. */
  formulae?: string[]
  /** Mistakes that cost marks in this topic, phrased as the correction. */
  commonMistakes?: string[]
  example: WorkedExample
  /** Further worked examples, shown after the first. */
  moreExamples?: WorkedExample[]
}

export const topicNotes: TopicNote[] = [
  // Mathematical Literacy
  {
    topicId: 'finance',
    summary:
      'Working with money in everyday and business contexts — reading financial documents, planning budgets, and comparing loans, interest, tax and tariffs.',
    keyIdeas: [
      'Budget: income − expenses = balance (a positive balance is a surplus, a negative one is a shortfall)',
      'Simple interest: the same amount of interest is added each year, always calculated on the original amount',
      'Compound interest: work it out year by year — each year\'s interest is calculated on the previous year\'s new balance, not the original amount',
      'Tariffs (electricity, water, airtime, municipal accounts): total cost = fixed charge + (rate × amount used)',
      'Break-even: the point where income from sales equals total costs — below it there is a loss, above it a profit',
    ],
    subtopics: [
      {
        name: 'Number formats, rounding and percentages',
        points: [
          'Money is written to two decimal places: R1 234,50 — not R1 234,5.',
          'Round only at the very end of a calculation. Rounding partway through and carrying that rounded value forward is the commonest way to lose marks in this topic.',
          'To find a percentage of an amount, multiply: 15% of R240 = 0,15 × R240 = R36.',
          'To write one amount as a percentage of another, divide then multiply by 100: R36 out of R240 = 36 ÷ 240 × 100 = 15%.',
          'A percentage increase or decrease is always worked out on the ORIGINAL amount, never on the new one.',
        ],
      },
      {
        name: 'Income, expenditure and household budgets',
        points: [
          'Income is money coming in, expenditure is money going out, and balance = income − expenditure.',
          'A positive balance is a surplus; a negative balance is a shortfall (a deficit).',
          'Fixed expenses stay the same every month — rent, school fees, insurance. Variable expenses change — electricity, food, transport.',
          'A budget is a plan made in advance; actual figures are what really happened. Questions often ask you to compare the two and explain the difference.',
          'When asked to advise someone who is short of money, cut variable expenses first: fixed expenses are usually contractual and cannot simply be reduced.',
        ],
      },
      {
        name: 'Financial documents: payslips, bills and statements',
        points: [
          'A payslip shows gross salary, deductions (tax, UIF, pension, medical aid) and net salary. Net salary = gross salary − total deductions.',
          'Gross is before deductions; net is what actually reaches the bank account. Reading the wrong one is a frequent error.',
          'A bank statement lists deposits (money in), withdrawals (money out) and a running balance. A negative balance means the account is overdrawn.',
          'A till slip or invoice shows the VAT-exclusive amount, the VAT, and the VAT-inclusive total.',
          'A municipal account shows the previous balance, payments received, new charges and the amount now due.',
        ],
      },
      {
        name: 'Tariffs and municipal accounts',
        points: [
          'Total cost = fixed charge + (rate × units used). The fixed charge is paid even in a month when nothing is used.',
          'A stepped (block) tariff charges a different rate for each block of usage. Charge each block at its own rate and add the results — do NOT put the whole amount through the highest rate.',
          'Read the block boundaries carefully: "the next 150 kWh" means the 150 units after the first block, not the first 150.',
          'Comparing two tariff options means finding the usage at which they cost the same, then saying which is cheaper on each side of that point.',
          'Electricity is measured in kilowatt-hours (kWh), water in kilolitres (kℓ), and calls usually per second or per minute.',
        ],
      },
      {
        name: 'Interest, loans and investments',
        points: [
          'Simple interest adds the same amount every year, always calculated on the original amount.',
          'Compound interest calculates each year\'s interest on the new balance, so the amount added grows every year.',
          'Over the same period and rate, compound interest always yields more than simple interest — a standard "explain why" question.',
          'On a loan, total repaid = monthly instalment × number of instalments, and the cost of the loan = total repaid − amount borrowed.',
          'A longer loan term means smaller instalments but more interest in total. Be ready to explain that trade-off in words.',
        ],
      },
      {
        name: 'Taxation: income tax, VAT and UIF',
        points: [
          'Income tax is read off a bracket table: find the bracket, take the fixed amount, then add the stated percentage of the income ABOVE that bracket\'s lower limit.',
          'Never apply the bracket percentage to the whole income — only to the portion above the threshold shown in that row.',
          'Rebates are subtracted after the tax has been calculated. The primary rebate applies to everyone; secondary and tertiary rebates apply from age 65 and 75.',
          'VAT in South Africa is 15%. To add VAT, multiply by 1,15. To find the VAT inside an inclusive price, multiply by 15 and divide by 115.',
          'To get back to the exclusive price from an inclusive one, divide by 1,15. Subtracting 15% is wrong and is heavily penalised.',
          'Zero-rated items such as brown bread, maize meal, rice, milk, fruit, vegetables and paraffin carry no VAT.',
          'UIF is 1% of gross salary from the employee and 1% from the employer, up to a monthly earnings ceiling.',
        ],
      },
      {
        name: 'Break-even, profit and business decisions',
        points: [
          'Fixed costs do not change with the number of items made; variable costs do.',
          'Total cost = fixed cost + (variable cost per item × number of items), and income = selling price × number sold.',
          'Break-even is where income equals total cost. Below it the business runs at a loss; above it, at a profit.',
          'Profit = income − total cost. Percentage profit is taken on the cost price unless the question says otherwise.',
          'Where a graph is given, the break-even point is where the income line crosses the cost line — read it off rather than calculating it again.',
        ],
      },
      {
        name: 'Exchange rates and inflation',
        points: [
          'A rate such as R18,50 = $1 converts one way by multiplying and the other by dividing. Decide which way you are going before you touch the calculator.',
          'A weaker rand means more rands per dollar: imports cost more, and exports become cheaper for overseas buyers.',
          'Inflation is the percentage rise in prices over a year. Applied over several years it is a compound calculation, not a simple one.',
          'To compare prices across two countries, convert both to the same currency first, then compare.',
        ],
      },
    ],
    formulae: [
      'Balance = income − expenditure',
      'Total tariff cost = fixed charge + (rate × units used)',
      'Simple interest: A = P(1 + i × n)',
      'Compound interest: A = P(1 + i)ⁿ',
      'VAT at 15%: inclusive = exclusive × 1,15  |  VAT inside an inclusive price = price × 15 ÷ 115',
      'Break-even: selling price × n = fixed cost + (variable cost × n)',
      'Percentage change = (new − old) ÷ old × 100',
    ],
    commonMistakes: [
      'Applying a tax-bracket percentage to the whole income instead of only the part above the threshold.',
      'Putting all electricity or water usage through the highest tariff block instead of charging each block at its own rate.',
      'Confusing gross and net salary on a payslip.',
      'Working out a percentage increase on the new amount instead of the original.',
      'Rounding money partway through a calculation and carrying the rounded figure forward.',
      'Subtracting 15% to get a VAT-exclusive price, instead of dividing by 1,15.',
    ],
    example: {
      problem:
        'A cellphone contract costs a fixed R99 per month plus R1.50 per minute of calls. Calculate the total bill for a month with 40 minutes of calls.',
      steps: [
        'Identify the fixed part and the variable part: fixed = R99, variable = R1.50 per minute.',
        'Multiply the rate by the number of minutes used: R1.50 × 40 = R60.',
        'Add the fixed charge to the variable amount: R99 + R60 = R159.',
      ],
      answer: 'R159',
    },
  },
  {
    topicId: 'data-handling',
    summary:
      'Collecting, organising and summarising sets of data using tables and graphs, then interpreting what the numbers mean — including basic probability.',
    keyIdeas: [
      'Mean (average) = sum of all values ÷ number of values',
      'Median = the middle value once the data is arranged from smallest to largest (average the two middle values if there is an even number of values)',
      'Mode = the value that occurs most often',
      'Range = highest value − lowest value, a simple measure of spread',
      'Probability of an event = number of favourable outcomes ÷ total number of possible outcomes',
    ],
    subtopics: [
      {
        name: 'Collecting and organising data',
        points: [
          'The population is everyone the study is about; a sample is the part actually asked. A sample must be representative or the conclusion is unreliable.',
          'Discrete data is counted (number of learners); continuous data is measured (height, mass, time).',
          'A tally and frequency table turns a raw list into something readable. Check that the frequencies add up to the number of data values.',
          'Grouped data uses class intervals such as 10 – 19, 20 – 29. Intervals must not overlap and must not leave gaps.',
        ],
      },
      {
        name: 'Mean, median and mode',
        points: [
          'Mean = sum of all values ÷ number of values. It uses every value, so one extreme value pulls it.',
          'Median = the middle value once the data is in order. With an even number of values, average the two middle ones.',
          'Mode = the value that appears most often. A set can have no mode, or more than one.',
          'Always arrange the data in order before finding the median. Forgetting to sort is the commonest error in this section.',
          'Where there is an outlier, the median is the better measure, because it is not dragged by one unusually large or small value.',
        ],
      },
      {
        name: 'Spread: range, quartiles and box-and-whisker',
        points: [
          'Range = highest − lowest. Simple, but it uses only two values.',
          'The quartiles split ordered data into four equal parts: Q1, the median (Q2), and Q3.',
          'Interquartile range = Q3 − Q1. It describes the middle half of the data and ignores the extremes.',
          'The five-number summary is minimum, Q1, median, Q3, maximum — exactly what a box-and-whisker diagram draws.',
          'A long whisker on one side means the data is spread out on that side; a short box means the middle half is tightly bunched.',
        ],
      },
      {
        name: 'Representing data in tables and graphs',
        points: [
          'Bar graphs compare separate categories, so the bars have gaps between them.',
          'Histograms show grouped numerical data, so the bars touch — the intervals run continuously.',
          'Line graphs show change over time. Pie charts show parts of a whole, each slice being a percentage of 360°.',
          'A compound (stacked) bar graph shows totals and their parts at the same time.',
          'Every graph needs a title, labelled axes with units, and a sensible scale. Questions do ask you to name what is missing.',
        ],
      },
      {
        name: 'Interpreting and comparing graphs',
        points: [
          'Read the axis labels and the scale before reading any value off the graph.',
          'When comparing two data sets, compare both a centre (mean or median) and a spread (range or IQR) — one alone is not an answer.',
          'A trend is the general direction over time, not every individual rise and fall.',
          'When asked to justify, quote the actual numbers. "It is higher" earns nothing; "it rose from 42% to 67%" earns the mark.',
        ],
      },
      {
        name: 'Misleading graphs and data quality',
        points: [
          'A vertical axis that does not start at zero exaggerates differences. This is the most commonly examined trick.',
          'Unequal intervals on an axis, or pictures drawn at different sizes, distort the comparison.',
          'A small or self-selected sample cannot support a claim about a whole population.',
          'When asked whether a conclusion is valid, name the specific flaw in the data or the graph, then say what it does to the conclusion.',
        ],
      },
      {
        name: 'Probability, chance and relative frequency',
        points: [
          'Probability = favourable outcomes ÷ total possible outcomes, written as a fraction, decimal or percentage between 0 and 1.',
          'Theoretical probability comes from the situation itself; relative frequency comes from what actually happened in a trial.',
          'The more trials are run, the closer relative frequency tends to get to theoretical probability.',
          'P(not A) = 1 − P(A).',
          'A two-way table or a tree diagram organises two-stage situations. Read the total you need from the correct row, column or branch.',
        ],
      },
    ],
    formulae: [
      'Mean = sum of values ÷ number of values',
      'Range = maximum − minimum',
      'Interquartile range = Q3 − Q1',
      'P(event) = favourable outcomes ÷ total outcomes',
      'P(not A) = 1 − P(A)',
      'Relative frequency = number of times the event happened ÷ number of trials',
    ],
    commonMistakes: [
      'Finding the median without first arranging the data in order.',
      'Reading a value off a graph without checking where the scale starts.',
      'Giving the frequency instead of the data value when asked for the mode.',
      'Comparing two data sets using only the mean, with nothing said about spread.',
      'Writing a probability greater than 1, or adding probabilities that should have been multiplied.',
      'Saying a graph is misleading without naming what exactly is wrong with it.',
    ],
    example: {
      problem: 'Seven learners scored these marks out of 100 in a test: 45, 60, 55, 70, 60, 80, 50. Find the mean, median and mode.',
      steps: [
        'Arrange the data in order: 45, 50, 55, 60, 60, 70, 80.',
        'Median: with 7 values, the 4th value is the middle one → median = 60.',
        'Mode: the value that repeats most often is 60 (it appears twice).',
        'Mean: add all values (45+50+55+60+60+70+80 = 420) and divide by 7 → 420 ÷ 7 = 60.',
      ],
      answer: 'Mean = 60, Median = 60, Mode = 60',
    },
  },
  {
    topicId: 'maps-plans',
    summary: 'Reading and interpreting scale, distance, direction and layout on maps, elevation drawings and floor plans.',
    keyIdeas: [
      'A scale like 1:50 000 means 1 unit on the map represents 50 000 of the same units in real life',
      'Actual distance = map distance × scale factor (then convert units, e.g. cm to m or km, as needed)',
      'Compass directions and bearings describe the direction from one point to another',
      'Floor plans use a scale to show real room dimensions on paper — always check the scale given before measuring',
    ],
    subtopics: [
      {
        name: 'Scale: number scales and bar scales',
        points: [
          'A number scale such as 1 : 500 means one unit on the plan stands for 500 of the same units in real life.',
          'Real distance = map distance × scale. Map distance = real distance ÷ scale.',
          'Convert units at the end: 1 : 500 with a 4 cm measurement gives 2 000 cm, which is 20 m.',
          'A bar scale is measured with a ruler against the printed bar. It stays correct even if the page is enlarged or reduced; a number scale does not.',
          'A larger second number means a more zoomed-out map: 1 : 50 000 shows far more ground than 1 : 1 000.',
        ],
      },
      {
        name: 'Distance, direction and bearings',
        points: [
          'The compass directions run N, NE, E, SE, S, SW, W, NW clockwise from north.',
          'A true bearing is measured clockwise from north and is always written with three digits: 045°, 130°, 270°.',
          'To describe the way back along the same line, add or subtract 180°.',
          'On a street map, give directions as a sequence someone could actually follow: which street, which way to turn, how far.',
        ],
      },
      {
        name: 'Route planning and travel time',
        points: [
          'Distance = speed × time, time = distance ÷ speed, speed = distance ÷ time.',
          'Convert time properly: 1 h 30 min is 1,5 hours, not 1,3.',
          'A distance table between towns is read where the row and the column meet. Read it once, carefully.',
          'The shortest route is not always the quickest — road type, stops and traffic matter, and questions often ask you to justify a choice.',
          'Add rest stops and border or fuel delays to the driving time when the question gives them.',
        ],
      },
      {
        name: 'Floor plans and elevation drawings',
        points: [
          'A floor plan is the view looking straight down from above; an elevation is the view of one side from ground level.',
          'North, south, east and west elevations each show a different face of the same building.',
          'Use the scale to turn plan measurements into real room dimensions, then use those for area, perimeter, flooring or paint quantities.',
          'Doors, windows and fittings have standard symbols. Read the key before answering.',
          'For flooring or tiles, work out the room area, divide by the area one unit covers, then round UP — you cannot buy part of a tile.',
        ],
      },
      {
        name: 'Seating, layout and packing plans',
        points: [
          'A seating or stand plan question is usually about counting rows and seats, or finding a seat from a block, row and number.',
          'Packing questions ask how many small items fit into a larger space: divide along each dimension separately and round each one DOWN before multiplying.',
          'Never simply divide the big volume by the small volume — that ignores the wasted space where items do not fit whole.',
          'Check whether items may be turned on their side or stacked; the question normally says.',
        ],
      },
      {
        name: 'Models, assembly diagrams and instructions',
        points: [
          'A model is a scaled physical version. If lengths are scaled by k, areas scale by k² and volumes by k³.',
          'Assembly instructions are read in order; questions test whether you can follow a sequence and identify the parts needed.',
          'When asked whether something will fit, compare every dimension, not only the largest one.',
        ],
      },
    ],
    formulae: [
      'Real distance = map distance × scale factor',
      'Map distance = real distance ÷ scale factor',
      'Distance = speed × time',
      'Items that fit along a side = length available ÷ length of one item, rounded down',
      'Scaling a model: length × k, area × k², volume × k³',
    ],
    commonMistakes: [
      'Forgetting to convert centimetres to metres or kilometres after applying the scale.',
      'Writing a bearing with fewer than three digits.',
      'Reading 1 h 45 min as 1,45 hours instead of 1,75 hours.',
      'Dividing total volume by item volume in a packing question instead of fitting along each dimension.',
      'Rounding down the number of tiles or tins of paint needed instead of up.',
      'Using a number scale on a map that has been photocopied at a different size.',
    ],
    example: {
      problem: 'A map has a scale of 1 : 50 000. The distance between two towns measured on the map is 8 cm. Find the actual distance in kilometres.',
      steps: [
        'Multiply the map distance by the scale factor: 8 cm × 50 000 = 400 000 cm.',
        'Convert centimetres to metres: 400 000 cm ÷ 100 = 4 000 m.',
        'Convert metres to kilometres: 4 000 m ÷ 1 000 = 4 km.',
      ],
      answer: '4 km',
    },
  },
  {
    topicId: 'measurement',
    summary: 'Working with length, weight, volume, perimeter and area in real-life objects and spaces, and converting between units.',
    keyIdeas: [
      'Perimeter = the total distance around the outside of a shape',
      'Area of a rectangle = length × breadth; area of a triangle = ½ × base × height',
      'Volume of a rectangular prism (box) = length × breadth × height',
      'Common conversions: 1 m = 100 cm, 1 kg = 1 000 g, 1 kl = 1 000 l, 1 m³ = 1 000 litres',
    ],
    subtopics: [
      {
        name: 'Units and conversions',
        points: [
          'Length: 10 mm = 1 cm, 100 cm = 1 m, 1 000 m = 1 km.',
          'Mass: 1 000 mg = 1 g, 1 000 g = 1 kg, 1 000 kg = 1 t.',
          'Capacity: 1 000 mℓ = 1 ℓ, 1 000 ℓ = 1 kℓ. And 1 cm³ = 1 mℓ, so 1 000 cm³ = 1 ℓ and 1 m³ = 1 000 ℓ.',
          'Going to a smaller unit multiplies; going to a larger unit divides. Decide which way first, then convert.',
          'Area units square the conversion: 1 m² = 10 000 cm². Volume units cube it: 1 m³ = 1 000 000 cm³.',
        ],
      },
      {
        name: 'Perimeter and distance around a shape',
        points: [
          'Perimeter is the total distance around the outside, measured in ordinary length units.',
          'Rectangle: P = 2(l + b). For a circle the perimeter is called the circumference, C = 2πr or πd.',
          'For an irregular shape, add every outside edge. Missing side lengths can usually be worked out from the sides that are given.',
          'Fencing, skirting and edging questions are perimeter questions.',
        ],
      },
      {
        name: 'Area',
        points: [
          'Rectangle: A = l × b. Triangle: A = ½ × base × perpendicular height. Circle: A = πr².',
          'The height of a triangle must be perpendicular to the base you used — not a slanted side.',
          'Break a composite shape into rectangles, triangles and part-circles, find each area, then add (or subtract for a hole).',
          'Paint, tiling, carpeting and lawn questions are area questions: divide the area by the coverage of one unit, then round up.',
          'Area is always in square units: m², cm², km².',
        ],
      },
      {
        name: 'Volume and capacity',
        points: [
          'Rectangular prism: V = l × b × h. Cylinder: V = πr²h. For any prism, V = area of base × height.',
          'Volume is the space inside; capacity is how much liquid it holds. They are linked by 1 cm³ = 1 mℓ and 1 m³ = 1 000 ℓ.',
          'Watch the radius: tanks and pipes are usually described by diameter, and r = d ÷ 2.',
          'A tank filled to a stated depth uses that depth as the height, not the full height of the tank.',
          'Volume is in cubic units: m³, cm³, mm³.',
        ],
      },
      {
        name: 'Surface area',
        points: [
          'Surface area is the total area of every face — it is an area, so it is measured in square units.',
          'Rectangular prism: SA = 2(lb + lh + bh).',
          'Closed cylinder: SA = 2πr² + 2πrh. An open cylinder drops one circle: SA = πr² + 2πrh.',
          'Read whether the object is open or closed, and whether the base is included. That decides which faces you count.',
          'Painting the outside of a container is a surface-area question; filling it is a volume question.',
        ],
      },
      {
        name: 'Mass, rates and practical calculations',
        points: [
          'A rate links two different quantities: R/kg, km/ℓ, ℓ per 100 km, litres per minute.',
          'To use a rate, multiply or divide so that the unwanted unit cancels.',
          'Fuel given as ℓ per 100 km: litres needed = distance ÷ 100 × consumption.',
          'A flow rate fills a container: time = volume ÷ flow rate, with both in matching units.',
          'Cooking and dosage questions scale a recipe or a dose in proportion — set up the ratio and keep the units consistent.',
        ],
      },
      {
        name: 'Time, temperature and reading instruments',
        points: [
          'The 24-hour clock runs 00:00 to 23:59, so 14:30 is half past two in the afternoon.',
          'Time differences are worked out in hours and minutes, not decimal hours, unless decimals are asked for.',
          'Temperature in °C: water freezes at 0 °C and boils at 100 °C. °F = °C × 1,8 + 32.',
          'Reading a measuring jug, thermometer or tape means first working out what one small division is worth.',
        ],
      },
    ],
    formulae: [
      'Rectangle: P = 2(l + b), A = l × b',
      'Triangle: A = ½ × base × perpendicular height',
      'Circle: C = 2πr, A = πr²',
      'Rectangular prism: V = l × b × h, SA = 2(lb + lh + bh)',
      'Cylinder: V = πr²h, closed SA = 2πr² + 2πrh',
      'Any prism: V = area of base × height',
      '1 cm³ = 1 mℓ, 1 m³ = 1 000 ℓ',
      '°F = °C × 1,8 + 32',
    ],
    commonMistakes: [
      'Using a slanted side as the height of a triangle instead of the perpendicular height.',
      'Using the diameter in place of the radius in πr² or πr²h.',
      'Converting area with a single factor (×100) instead of squaring it (×10 000).',
      'Giving a surface area in cubic units, or a volume in square units.',
      'Including the lid of an open container in a surface-area calculation.',
      'Rounding down the number of tins, tiles or bags needed instead of up.',
    ],
    example: {
      problem: 'A rectangular water tank is 2 m long, 1.5 m wide and 1.2 m high. Calculate how many litres of water it can hold.',
      steps: [
        'Calculate the volume in cubic metres: 2 m × 1.5 m × 1.2 m = 3.6 m³.',
        'Convert cubic metres to litres using 1 m³ = 1 000 litres: 3.6 × 1 000 = 3 600 litres.',
      ],
      answer: '3 600 litres',
    },
  },

  // Mathematics
  {
    topicId: 'math-algebra',
    summary: 'Simplifying and factorising algebraic expressions, and solving linear, quadratic and simultaneous equations and inequalities.',
    keyIdeas: [
      'Always factorise fully before solving: look for a common factor, a difference of squares, or a trinomial pattern',
      'Quadratic formula: x = [−b ± √(b² − 4ac)] ÷ 2a, used when a quadratic will not factorise easily',
      'Simultaneous equations can be solved by substitution or elimination',
      'When multiplying or dividing an inequality by a negative number, the inequality sign must flip direction',
    ],
    subtopics: [
      {
        name: 'Exponents and surds',
        points: [
          'The laws: aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ, a⁰ = 1, a⁻ⁿ = 1 ÷ aⁿ.',
          'A fractional exponent is a root: a^(m/n) is the n-th root of aᵐ.',
          'Before applying a law, write every base as a power of the same number: 8 = 2³, 27 = 3³, 0,25 = 2⁻².',
          'Rationalising a denominator means multiplying top and bottom by the surd, or by the conjugate when the denominator is a binomial.',
          'Exponential equations are solved by making the bases equal and then equating the exponents.',
        ],
      },
      {
        name: 'Simplifying and factorising expressions',
        points: [
          'Always take out the highest common factor first. Many questions are only difficult because this step was skipped.',
          'Difference of two squares: a² − b² = (a − b)(a + b).',
          'Trinomials: find two numbers that multiply to give the product of the first and last coefficients and add to give the middle one.',
          'Sum and difference of two cubes: a³ + b³ = (a + b)(a² − ab + b²) and a³ − b³ = (a − b)(a² + ab + b²).',
          'Grouping in pairs handles four-term expressions: factorise each pair, then take out the common bracket.',
        ],
      },
      {
        name: 'Algebraic fractions',
        points: [
          'Factorise every numerator and denominator before cancelling anything.',
          'You may cancel factors, never terms. Cancelling across a + or − sign is always wrong.',
          'To add or subtract, find the lowest common denominator from the factorised forms.',
          'To divide, multiply by the reciprocal of the second fraction.',
          'State any restrictions: a denominator can never equal zero.',
        ],
      },
      {
        name: 'Linear equations and inequalities',
        points: [
          'Whatever you do to one side you must do to the other.',
          'Clear fractions early by multiplying every term by the lowest common denominator.',
          'When you multiply or divide an inequality by a negative number, the inequality sign turns around.',
          'Give inequality answers in the form asked for: interval notation, set-builder notation, or on a number line.',
        ],
      },
      {
        name: 'Quadratic equations',
        points: [
          'Get everything to one side so the equation reads = 0 before you factorise.',
          'If the product of two factors is zero, at least one of them is zero — that is why the = 0 step matters.',
          'The quadratic formula x = (−b ± √(b² − 4ac)) ÷ 2a works for every quadratic, factorising or not.',
          'Completing the square rewrites ax² + bx + c in the form a(x + p)² + q, which also gives the turning point.',
          'A k-substitution turns an equation such as x⁴ − 5x² + 4 = 0 into a quadratic in k = x².',
        ],
      },
      {
        name: 'Nature of the roots',
        points: [
          'The discriminant is Δ = b² − 4ac.',
          'Δ > 0 gives two real unequal roots; Δ = 0 gives two real equal roots; Δ < 0 gives no real roots.',
          'If Δ is a perfect square (and a, b, c are rational) the roots are rational; otherwise they are irrational.',
          'Questions asking for the values of k that make roots real, equal or non-real are discriminant questions — set up the inequality in k.',
        ],
      },
      {
        name: 'Simultaneous equations',
        points: [
          'Two linear equations can be solved by substitution or by elimination.',
          'With one linear and one quadratic equation, always make a variable the subject of the LINEAR one and substitute into the quadratic.',
          'Each value of x has its own matching value of y. Pair them correctly and state both solutions.',
          'Check a solution by substituting into the equation you did not use to find it.',
        ],
      },
      {
        name: 'Word problems and setting up equations',
        points: [
          'Say clearly what the variable stands for, with units, before writing anything else.',
          'Translate each sentence into one equation; the number of equations usually matches the number of unknowns.',
          'Consecutive numbers are n, n + 1, n + 2. Consecutive even or odd numbers are n, n + 2, n + 4.',
          'Check the answer against the situation and reject any root that makes no sense — a negative length or a fractional person.',
        ],
      },
    ],
    formulae: [
      'x = (−b ± √(b² − 4ac)) ÷ 2a',
      'Δ = b² − 4ac',
      'a² − b² = (a − b)(a + b)',
      'a³ ± b³ = (a ± b)(a² ∓ ab + b²)',
      'aᵐ × aⁿ = aᵐ⁺ⁿ,  (aᵐ)ⁿ = aᵐⁿ,  a⁻ⁿ = 1 ÷ aⁿ',
    ],
    commonMistakes: [
      'Solving a quadratic by factorising without first moving everything to one side of the equals sign.',
      'Cancelling a term rather than a factor in an algebraic fraction.',
      'Forgetting to reverse the inequality sign after multiplying or dividing by a negative.',
      'Substituting the quadratic equation into the linear one instead of the other way round.',
      'Losing the second root of a quadratic by dividing both sides by x.',
      'Giving the discriminant as b² − 4ac but then testing it against the wrong inequality.',
    ],
    example: {
      problem: 'Solve for x: x² − 5x + 6 = 0',
      steps: [
        'Factorise the trinomial: find two numbers that multiply to 6 and add to −5 → −2 and −3.',
        'Write the factors: (x − 2)(x − 3) = 0.',
        'Set each factor equal to zero: x − 2 = 0 or x − 3 = 0.',
      ],
      answer: 'x = 2 or x = 3',
    },
  },
  {
    topicId: 'math-functions',
    summary: 'Sketching and interpreting linear, quadratic, exponential and hyperbolic graphs — their intercepts, turning points and asymptotes.',
    keyIdeas: [
      'y-intercept: substitute x = 0 into the equation; x-intercept(s): set y = 0 and solve for x',
      'For a parabola y = ax² + bx + c, the turning point has x-coordinate = −b ÷ 2a',
      'An exponential function y = a·bˣ + q has a horizontal asymptote at y = q',
      'A hyperbola y = a ÷ (x − p) + q has asymptotes at x = p and y = q',
    ],
    subtopics: [
      {
        name: 'Linear functions',
        points: [
          'y = mx + c, where m is the gradient and c is the y-intercept.',
          'The x-intercept is found by setting y = 0; the y-intercept by setting x = 0.',
          'A positive gradient rises from left to right; a negative gradient falls.',
          'Parallel lines have equal gradients; perpendicular lines have gradients whose product is −1.',
        ],
      },
      {
        name: 'Quadratic functions (parabolas)',
        points: [
          'Standard form y = ax² + bx + c, turning-point form y = a(x − p)² + q with turning point (p, q).',
          'The axis of symmetry is x = −b ÷ 2a, and that x-value gives the turning point.',
          'a > 0 opens upwards and has a minimum; a < 0 opens downwards and has a maximum.',
          'The x-intercepts are the roots of ax² + bx + c = 0. No real roots means the graph never crosses the x-axis.',
          'Domain is always x ∈ ℝ; the range depends on the turning point and which way the parabola opens.',
        ],
      },
      {
        name: 'Hyperbolic functions',
        points: [
          'y = a ÷ (x − p) + q has a vertical asymptote at x = p and a horizontal asymptote at y = q.',
          'The graph never touches either asymptote, so x ≠ p and y ≠ q — that is the domain and range.',
          'The two branches sit in opposite quadrants relative to the asymptotes; the sign of a says which pair.',
          'The axes of symmetry pass through the point where the asymptotes cross, with gradients 1 and −1.',
        ],
      },
      {
        name: 'Exponential and logarithmic functions',
        points: [
          'y = a·bˣ + q has a horizontal asymptote at y = q and no vertical asymptote.',
          'b > 1 gives growth; 0 < b < 1 gives decay.',
          'The logarithmic function y = log_b x is the inverse of y = bˣ, so its graph is the reflection in the line y = x.',
          'For y = log_b x the domain is x > 0 and the range is y ∈ ℝ — the exact swap of the exponential\'s.',
        ],
      },
      {
        name: 'Transformations of graphs',
        points: [
          'y = f(x) + q shifts the graph q units up; y = f(x − p) shifts it p units right.',
          'y = −f(x) reflects in the x-axis; y = f(−x) reflects in the y-axis.',
          'y = a·f(x) stretches vertically by a factor of a.',
          'Describe a transformation in words when asked, and give the new turning point or asymptote to prove it.',
        ],
      },
      {
        name: 'Inverse functions',
        points: [
          'To find an inverse, swap x and y and then make y the subject.',
          'The graph of an inverse is the reflection of the original in the line y = x.',
          'The domain of the inverse is the range of the original, and vice versa.',
          'y = x² is not one-to-one, so its inverse is only a function once the domain is restricted to x ≥ 0 or x ≤ 0.',
        ],
      },
      {
        name: 'Interpreting graphs',
        points: [
          'Points of intersection are found by setting the two functions equal to each other.',
          'f(x) > 0 means the graph lies above the x-axis; f(x) > g(x) means one graph lies above the other.',
          'The maximum vertical distance between two graphs is found by writing f(x) − g(x) and maximising it.',
          'Always state a domain or range using the correct notation, and check whether the endpoint is included.',
        ],
      },
    ],
    formulae: [
      'Straight line: y = mx + c',
      'Parabola: y = a(x − p)² + q, axis of symmetry x = −b ÷ 2a',
      'Hyperbola: y = a ÷ (x − p) + q, asymptotes x = p and y = q',
      'Exponential: y = a·b^(x − p) + q, asymptote y = q',
      'Inverse: swap x and y, then make y the subject',
    ],
    commonMistakes: [
      'Reading the turning point of y = a(x − p)² + q as (−p, q) instead of (p, q).',
      'Giving the range of a parabola as all real numbers.',
      'Forgetting to exclude the asymptote values from the domain and range of a hyperbola.',
      'Writing the inverse of an exponential without restricting x > 0 in the domain.',
      'Confusing f(x) > 0 (above the x-axis) with x > 0 (right of the y-axis).',
    ],
    example: {
      problem: 'For f(x) = x² − 2x − 8, find the y-intercept, the x-intercepts, and the turning point.',
      steps: [
        'y-intercept: f(0) = 0 − 0 − 8 = −8.',
        'x-intercepts: solve x² − 2x − 8 = 0 → (x − 4)(x + 2) = 0 → x = 4 or x = −2.',
        'Turning point x-coordinate: −b ÷ 2a = −(−2) ÷ 2(1) = 1. Then f(1) = 1 − 2 − 8 = −9.',
      ],
      answer: 'y-intercept (0, −8); x-intercepts (4, 0) and (−2, 0); turning point (1, −9)',
    },
  },
  {
    topicId: 'math-trigonometry',
    summary: 'Trig ratios and identities, reduction formulae, and using trigonometry to solve equations and find unknown sides or angles in triangles.',
    keyIdeas: [
      'SOH CAH TOA for right-angled triangles: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent',
      'Identity: sin²θ + cos²θ = 1',
      'Reduction formulae relate angles in different quadrants, e.g. sin(180° − θ) = sin θ and cos(180° − θ) = −cos θ',
      'The sine rule and cosine rule are used to solve triangles that do not have a right angle',
    ],
    subtopics: [
      {
        name: 'Trig ratios in right-angled triangles',
        points: [
          'sin θ = opposite ÷ hypotenuse, cos θ = adjacent ÷ hypotenuse, tan θ = opposite ÷ adjacent.',
          'Label the sides relative to the angle you are using, not relative to the page.',
          'In the Cartesian plane with a point (x, y) and r = √(x² + y²): sin θ = y ÷ r, cos θ = x ÷ r, tan θ = y ÷ x.',
          'Given one ratio, sketch the triangle in the correct quadrant and use Pythagoras to find the third side before answering.',
        ],
      },
      {
        name: 'Special angles and the calculator',
        points: [
          'Know the exact values for 0°, 30°, 45°, 60° and 90° without a calculator.',
          'sin 30° = ½, cos 60° = ½, tan 45° = 1, sin 60° = √3 ÷ 2, cos 30° = √3 ÷ 2.',
          'Make sure the calculator is in degree mode before any numerical trig work.',
          'Give answers to the number of decimal places asked for, and round only at the end.',
        ],
      },
      {
        name: 'Reduction formulae and the CAST diagram',
        points: [
          'CAST: all ratios are positive in the first quadrant, only sine in the second, only tangent in the third, only cosine in the fourth.',
          'sin(180° − θ) = sin θ, cos(180° − θ) = −cos θ, tan(180° + θ) = tan θ.',
          'sin(−θ) = −sin θ and cos(−θ) = cos θ.',
          'Co-functions: sin(90° − θ) = cos θ and cos(90° − θ) = sin θ.',
          'Reduce to an acute angle first, then evaluate. Work in one step at a time and write the reduction you used.',
        ],
      },
      {
        name: 'Identities',
        points: [
          'The square identity: sin²θ + cos²θ = 1, which rearranges to sin²θ = 1 − cos²θ.',
          'The quotient identity: tan θ = sin θ ÷ cos θ.',
          'Compound angles: sin(A ± B) = sin A cos B ± cos A sin B, and cos(A ± B) = cos A cos B ∓ sin A sin B.',
          'Double angles: sin 2A = 2 sin A cos A, and cos 2A = cos²A − sin²A = 1 − 2sin²A = 2cos²A − 1.',
          'When proving an identity, work on one side only until it matches the other. Never move terms across the equals sign.',
        ],
      },
      {
        name: 'Trigonometric equations and general solution',
        points: [
          'Solve for the reference angle first, then use CAST to find every quadrant that works.',
          'The general solution for sine and cosine adds k·360°; for tangent it adds k·180°, with k ∈ ℤ.',
          'For sin θ = a the second solution is 180° − reference angle; for cos θ = a it is 360° − reference angle.',
          'Once you have the general solution, substitute values of k to list the specific solutions inside the given interval.',
        ],
      },
      {
        name: 'Trigonometric graphs',
        points: [
          'y = sin x and y = cos x have period 360° and range [−1, 1]; y = tan x has period 180° and asymptotes at 90° + k·180°.',
          'In y = a·sin(bx) + q, a changes the amplitude, b changes the period to 360° ÷ b, and q shifts the graph vertically.',
          'A horizontal shift comes from y = sin(x − p), moving the graph p units right.',
          'Read amplitude, period and asymptotes off a given graph before trying to write its equation.',
        ],
      },
      {
        name: 'Sine, cosine and area rules in 2D and 3D',
        points: [
          'Sine rule: a ÷ sin A = b ÷ sin B = c ÷ sin C. Use it with two angles and a side, or two sides and a non-included angle.',
          'Cosine rule: a² = b² + c² − 2bc·cos A. Use it with three sides, or two sides and the included angle.',
          'Area of a triangle = ½·ab·sin C, using the angle between the two sides.',
          'The ambiguous case can give two possible triangles when using the sine rule with two sides and a non-included angle.',
          'In a 3D problem, pick out one triangle at a time, redraw it flat, and mark what is known before choosing a rule.',
        ],
      },
    ],
    formulae: [
      'sin²θ + cos²θ = 1',
      'tan θ = sin θ ÷ cos θ',
      'sin(A ± B) = sin A cos B ± cos A sin B',
      'cos(A ± B) = cos A cos B ∓ sin A sin B',
      'sin 2A = 2 sin A cos A,  cos 2A = 1 − 2sin²A',
      'Sine rule: a ÷ sin A = b ÷ sin B',
      'Cosine rule: a² = b² + c² − 2bc·cos A',
      'Area = ½·ab·sin C',
    ],
    commonMistakes: [
      'Leaving the calculator in radian mode.',
      'Giving only the first-quadrant solution to a trig equation and missing the others.',
      'Moving terms across the equals sign while proving an identity.',
      'Using the cosine rule when only one side is known, or the sine rule when no angle-side pair is complete.',
      'Reading the period of y = sin 2x as 720° instead of 180°.',
      'Using the wrong angle in the area rule — it must be the angle between the two sides.',
    ],
    example: {
      problem: 'In a right-angled triangle, the side opposite angle θ is 5 units and the hypotenuse is 13 units. Find θ, rounded to two decimal places.',
      steps: [
        'Identify the ratio to use: opposite and hypotenuse are given, so use sine.',
        'Write the equation: sin θ = 5 ÷ 13.',
        'Use inverse sine to find the angle: θ = sin⁻¹(5 ÷ 13).',
      ],
      answer: 'θ ≈ 22.62°',
    },
  },
  {
    topicId: 'math-analytical-geometry',
    summary: 'Using formulae to find distance, gradient and midpoint between points, and to write equations of lines and circles on the Cartesian plane.',
    keyIdeas: [
      'Distance formula: d = √[(x₂ − x₁)² + (y₂ − y₁)²]',
      'Gradient formula: m = (y₂ − y₁) ÷ (x₂ − x₁)',
      'Midpoint formula: ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2)',
      'A circle centred at the origin with radius r has equation x² + y² = r²',
    ],
    subtopics: [
      {
        name: 'Distance between two points',
        points: [
          'd = √((x₂ − x₁)² + (y₂ − y₁)²).',
          'The order of the points does not matter, because the differences are squared.',
          'Use distance to prove a shape: equal sides for a rhombus, equal diagonals for a rectangle.',
          'Leave the answer in surd form unless a decimal is asked for.',
        ],
      },
      {
        name: 'Midpoint',
        points: [
          'M = ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2) — the average of the coordinates.',
          'If the midpoint and one endpoint are given, work backwards: x₂ = 2x_M − x₁.',
          'Diagonals of a parallelogram bisect each other, so their midpoints coincide. That is a standard proof.',
          'The midpoint of a circle\'s diameter is the centre of the circle.',
        ],
      },
      {
        name: 'Gradient, parallel and perpendicular lines',
        points: [
          'm = (y₂ − y₁) ÷ (x₂ − x₁).',
          'Parallel lines have equal gradients: m₁ = m₂.',
          'Perpendicular lines have m₁ × m₂ = −1.',
          'A horizontal line has gradient 0; a vertical line has an undefined gradient.',
          'Three points are collinear when the gradient between any two pairs is the same.',
        ],
      },
      {
        name: 'Equation of a straight line',
        points: [
          'Point-gradient form: y − y₁ = m(x − x₁).',
          'With two points, find the gradient first, then substitute either point.',
          'For a perpendicular bisector, use the midpoint of the segment and the negative reciprocal of its gradient.',
          'A median joins a vertex to the midpoint of the opposite side; an altitude is perpendicular to the opposite side.',
        ],
      },
      {
        name: 'Angle of inclination',
        points: [
          'tan θ = m, where θ is the angle the line makes with the positive x-axis.',
          'If the gradient is negative, the calculator gives a negative angle — add 180° to get the inclination between 0° and 180°.',
          'The angle between two lines is the difference of their inclinations.',
          'State the angle to one decimal place unless told otherwise.',
        ],
      },
      {
        name: 'Circles in the Cartesian plane',
        points: [
          'Centre at the origin: x² + y² = r².',
          'Centre at (a, b): (x − a)² + (y − b)² = r².',
          'Complete the square on both x and y to turn a general equation into centre-radius form.',
          'A point lies inside, on, or outside the circle according to whether its distance from the centre is less than, equal to, or greater than r.',
        ],
      },
      {
        name: 'Tangents to a circle',
        points: [
          'The tangent at a point is perpendicular to the radius drawn to that point.',
          'Find the gradient of the radius, take the negative reciprocal, then use point-gradient form at the point of contact.',
          'The distance from the centre to a tangent line equals the radius.',
          'Two circles touch externally when the distance between their centres equals the sum of their radii.',
        ],
      },
    ],
    formulae: [
      'd = √((x₂ − x₁)² + (y₂ − y₁)²)',
      'M = ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2)',
      'm = (y₂ − y₁) ÷ (x₂ − x₁)',
      'y − y₁ = m(x − x₁)',
      'm₁ × m₂ = −1 for perpendicular lines',
      'tan θ = m',
      '(x − a)² + (y − b)² = r²',
    ],
    commonMistakes: [
      'Subtracting the coordinates in a different order in the numerator and the denominator of the gradient.',
      'Reading the centre of (x − 3)² + (y + 2)² = 25 as (−3, 2) instead of (3, −2).',
      'Giving a negative angle of inclination instead of adding 180°.',
      'Using the gradient of the radius as the gradient of the tangent.',
      'Forgetting to halve the coefficient before squaring when completing the square.',
    ],
    example: {
      problem: 'Find the distance between A(1, 2) and B(4, 6), and the midpoint of AB.',
      steps: [
        'Distance: d = √[(4 − 1)² + (6 − 2)²] = √(9 + 16) = √25.',
        'Midpoint: ((1 + 4) ÷ 2, (2 + 6) ÷ 2) = (2.5, 4).',
      ],
      answer: 'Distance = 5 units; midpoint = (2.5, 4)',
    },
  },
  {
    topicId: 'math-statistics',
    summary: 'Describing data sets using measures of central tendency and spread, including standard deviation, and interpreting statistical graphs.',
    keyIdeas: [
      'Mean, median and mode summarise the "centre" of a data set',
      'Standard deviation measures how spread out the data is from the mean — a larger value means more variability',
      'The five-number summary (minimum, lower quartile, median, upper quartile, maximum) is used to draw a box-and-whisker plot',
      'A data set with values clustered close to the mean has a small standard deviation',
    ],
    subtopics: [
      {
        name: 'Measures of central tendency',
        points: [
          'Mean = Σx ÷ n. Median is the middle value of ordered data. Mode is the most frequent value.',
          'For grouped data, the estimated mean uses the midpoint of each interval: Σ(f × midpoint) ÷ Σf.',
          'The modal class is the interval with the highest frequency, not the frequency itself.',
          'The mean is affected by outliers; the median is not. Say which is more appropriate and why.',
        ],
      },
      {
        name: 'Measures of dispersion',
        points: [
          'Range = maximum − minimum. Interquartile range = Q3 − Q1.',
          'Standard deviation measures how far, on average, the values sit from the mean. A larger value means more spread.',
          'Use the calculator\'s statistics mode for standard deviation; you are not expected to compute it by hand.',
          'Adding the same constant to every value leaves the standard deviation unchanged; multiplying every value by k multiplies it by k.',
          'Values within one standard deviation of the mean lie between x̄ − σ and x̄ + σ.',
        ],
      },
      {
        name: 'Five-number summary and box-and-whisker plots',
        points: [
          'The five-number summary is minimum, Q1, median, Q3, maximum.',
          'With n values, Q1 sits at position (n + 1) ÷ 4 and Q3 at 3(n + 1) ÷ 4.',
          'A box-and-whisker diagram is drawn to scale against a number line.',
          'Skewness shows in the plot: a longer right whisker means positively skewed, a longer left whisker means negatively skewed.',
          'An outlier is usually taken as any value more than 1,5 × IQR beyond Q1 or Q3.',
        ],
      },
      {
        name: 'Grouped data, histograms and frequency polygons',
        points: [
          'Class intervals must not overlap and must cover the whole range.',
          'A histogram\'s bars touch, because the horizontal scale is continuous.',
          'A frequency polygon joins the midpoints of the tops of the bars.',
          'When reading a histogram, read the frequency off the vertical axis and the interval off the horizontal one.',
        ],
      },
      {
        name: 'Ogives (cumulative frequency curves)',
        points: [
          'Cumulative frequency is a running total. Plot it against the UPPER boundary of each interval.',
          'The curve starts on the horizontal axis at the lower boundary of the first interval.',
          'Read the median at half the total frequency, Q1 at a quarter and Q3 at three quarters.',
          'To find how many values exceed a given amount, read up from that value and subtract from the total.',
        ],
      },
      {
        name: 'Scatter plots, correlation and regression',
        points: [
          'A scatter plot shows the relationship between two variables; describe it as strong or weak, positive or negative, linear or not.',
          'The least-squares regression line is ŷ = a + bx, found with the calculator\'s statistics mode.',
          'The correlation coefficient r lies between −1 and 1. Values near ±1 mean a strong linear relationship, near 0 mean almost none.',
          'Correlation is not causation. Say so when asked to comment on a relationship.',
          'Interpolating inside the data range is reasonable; extrapolating far beyond it is not reliable.',
        ],
      },
      {
        name: 'Outliers and their effect',
        points: [
          'An outlier is a value that sits far from the rest of the data.',
          'Outliers pull the mean and inflate the standard deviation and the range; the median and IQR barely move.',
          'On a scatter plot, one outlier can noticeably shift the regression line.',
          'Never simply delete an outlier — say what effect it has, and whether it is likely to be a genuine value or an error.',
        ],
      },
    ],
    formulae: [
      'Mean: x̄ = Σx ÷ n',
      'Estimated mean for grouped data: Σ(f × midpoint) ÷ Σf',
      'IQR = Q3 − Q1',
      'Outlier boundaries: Q1 − 1,5 × IQR and Q3 + 1,5 × IQR',
      'Regression line: ŷ = a + bx',
      'Correlation coefficient: −1 ≤ r ≤ 1',
    ],
    commonMistakes: [
      'Plotting an ogive against the midpoint of each interval instead of the upper boundary.',
      'Giving the modal frequency when the modal class was asked for.',
      'Computing the median of grouped data without first ordering or cumulating.',
      'Claiming that a strong correlation proves that one variable causes the other.',
      'Using the lower boundary of the first interval as the first cumulative frequency point.',
    ],
    example: {
      problem: 'Find the mean of the data set: 2, 4, 4, 4, 5, 5, 7, 9.',
      steps: [
        'Add all the values: 2 + 4 + 4 + 4 + 5 + 5 + 7 + 9 = 40.',
        'Divide by the number of values: 40 ÷ 8 = 5.',
        '(Standard deviation would then measure how far each value lies from this mean of 5 — usually calculated with a calculator\'s statistics mode in the exam.)',
      ],
      answer: 'Mean = 5',
    },
  },
  {
    topicId: 'math-finance-growth',
    summary: 'Using algebraic formulae for simple and compound growth and decay, and for annuities, to solve financial problems.',
    keyIdeas: [
      'Simple growth: A = P(1 + i·n)',
      'Compound growth: A = P(1 + i)ⁿ',
      'Compound decay: A = P(1 − i)ⁿ',
      'P = original amount, i = interest rate (as a decimal), n = number of periods, A = final amount',
    ],
    subtopics: [
      {
        name: 'Simple and compound interest',
        points: [
          'Simple interest: A = P(1 + in). Compound interest: A = P(1 + i)ⁿ.',
          'i is the interest rate per period written as a decimal, and n is the number of periods.',
          'If interest is compounded monthly, divide the annual rate by 12 and multiply the number of years by 12.',
          'Compound interest always exceeds simple interest over the same rate and period beyond the first.',
        ],
      },
      {
        name: 'Nominal and effective interest rates',
        points: [
          'A nominal rate is quoted per year but compounded more often; an effective rate is the true annual rate.',
          '1 + i_eff = (1 + i_nom ÷ m)^m, where m is the number of compounding periods in a year.',
          'Compare two investments by converting both to effective annual rates first.',
          'More frequent compounding at the same nominal rate gives a higher effective rate.',
        ],
      },
      {
        name: 'Depreciation',
        points: [
          'Straight-line (simple) depreciation: A = P(1 − in) — the same amount is lost each year.',
          'Reducing-balance depreciation: A = P(1 − i)ⁿ — the loss is calculated on the current value each year.',
          'Reducing balance never reaches zero; straight-line depreciation eventually does.',
          'Read the wording carefully: "on a reducing balance" or "on the diminishing value" signals the second formula.',
        ],
      },
      {
        name: 'Timelines and changing interest rates',
        points: [
          'Draw a timeline first, marking every deposit, withdrawal and rate change.',
          'Move each amount to the required date separately, then add.',
          'A withdrawal reduces the balance at that point and everything after it grows from the reduced figure.',
          'When the rate changes, split the calculation at the change and apply each rate over its own period only.',
        ],
      },
      {
        name: 'Future value annuities',
        points: [
          'F = x[(1 + i)ⁿ − 1] ÷ i, where x is the regular payment.',
          'This applies when equal payments are made at the end of each period — a savings plan or a sinking fund.',
          'n counts the number of payments, not the number of years, unless payments are annual.',
          'A sinking fund question usually asks for the payment x needed to reach a target F; rearrange the formula.',
        ],
      },
      {
        name: 'Present value annuities and loans',
        points: [
          'P = x[1 − (1 + i)⁻ⁿ] ÷ i.',
          'This is the loan amount that a series of equal repayments will settle — a bond or a vehicle finance agreement.',
          'If repayments start later than one period after the loan is taken, grow the loan forward to one period before the first payment, then apply the formula.',
          'A longer term reduces the instalment but increases the total interest paid.',
        ],
      },
      {
        name: 'Outstanding balance',
        points: [
          'The balance outstanding equals the present value of the payments still to be made.',
          'Alternatively, grow the original loan forward and subtract the future value of the payments already made. Both methods must agree.',
          'Count the remaining payments carefully — an off-by-one in n is the usual source of a wrong answer.',
          'The final payment is often smaller than the rest; questions ask you to find it.',
        ],
      },
    ],
    formulae: [
      'Simple interest: A = P(1 + in)',
      'Compound interest: A = P(1 + i)ⁿ',
      'Simple depreciation: A = P(1 − in)',
      'Reducing-balance depreciation: A = P(1 − i)ⁿ',
      'Effective rate: 1 + i_eff = (1 + i_nom ÷ m)^m',
      'Future value annuity: F = x[(1 + i)ⁿ − 1] ÷ i',
      'Present value annuity: P = x[1 − (1 + i)⁻ⁿ] ÷ i',
    ],
    commonMistakes: [
      'Using the annual rate without dividing by 12 when interest compounds monthly.',
      'Counting years instead of payments for n in an annuity formula.',
      'Using the future value formula for a loan repayment question.',
      'Applying a single rate across a period in which the rate changed.',
      'Forgetting to grow the loan forward when the first repayment is deferred.',
    ],
    example: {
      problem: 'R5 000 is invested at 8% p.a. compound interest for 3 years. Calculate the final amount.',
      steps: [
        'Write down the compound growth formula: A = P(1 + i)ⁿ.',
        'Substitute the values: A = 5 000(1 + 0.08)³ = 5 000(1.08)³.',
        'Calculate: (1.08)³ = 1.259712, so A = 5 000 × 1.259712.',
      ],
      answer: 'A = R6 298.56',
    },
  },
  {
    topicId: 'math-number-patterns',
    summary: 'Finding and describing patterns in arithmetic and geometric sequences, and using formulae to find terms and sums of series.',
    keyIdeas: [
      'Arithmetic sequence (constant difference d): Tₙ = a + (n − 1)d',
      'Geometric sequence (constant ratio r): Tₙ = a·rⁿ⁻¹',
      'Sum of an arithmetic series: Sₙ = n/2 [2a + (n − 1)d]',
      'Sum of a geometric series: Sₙ = a(rⁿ − 1) ÷ (r − 1), for r ≠ 1',
    ],
    subtopics: [
      {
        name: 'Linear (arithmetic) patterns',
        points: [
          'The first difference between consecutive terms is constant.',
          'General term: Tₙ = a + (n − 1)d, where a is the first term and d the common difference.',
          'To test whether a value is a term of the sequence, set Tₙ equal to it and check that n is a positive whole number.',
          'The common difference can be negative, giving a decreasing sequence.',
        ],
      },
      {
        name: 'Quadratic patterns',
        points: [
          'The SECOND difference is constant. The first differences themselves form a linear pattern.',
          'General term: Tₙ = an² + bn + c, with 2a = second difference.',
          'Find a from the second difference, then use T₁ and T₂ to solve for b and c.',
          'The maximum or minimum term occurs where the first difference changes sign.',
        ],
      },
      {
        name: 'Arithmetic sequences and series',
        points: [
          'A series is the sum of a sequence\'s terms.',
          'Sₙ = n ÷ 2 [2a + (n − 1)d], or Sₙ = n ÷ 2 (a + l) when the last term l is known.',
          'To find how many terms give a particular sum, set Sₙ equal to it and solve the resulting quadratic in n.',
          'Reject any solution for n that is negative or not a whole number.',
        ],
      },
      {
        name: 'Geometric sequences and series',
        points: [
          'Each term is the previous one multiplied by a constant ratio r, so r = Tₙ ÷ Tₙ₋₁.',
          'General term: Tₙ = a·r^(n − 1).',
          'Sum: Sₙ = a(rⁿ − 1) ÷ (r − 1) for r > 1, or a(1 − rⁿ) ÷ (1 − r) for r < 1.',
          'Check that the ratio is genuinely constant between several pairs of terms before assuming the sequence is geometric.',
        ],
      },
      {
        name: 'Sigma notation',
        points: [
          'Σ from k = 1 to n of Tₖ means add the terms from k = 1 up to k = n.',
          'The number of terms is (upper limit − lower limit + 1), not just the upper limit.',
          'Identify whether the expression inside is arithmetic or geometric, then use the matching sum formula.',
          'A sum starting at k = 3 can be handled by taking the full sum from k = 1 and subtracting the first two terms.',
        ],
      },
      {
        name: 'Convergence and the sum to infinity',
        points: [
          'An infinite geometric series converges only when −1 < r < 1.',
          'S∞ = a ÷ (1 − r).',
          'Questions asking for the values of x for which a series converges are inequality questions in r; solve −1 < r < 1.',
          'A recurring decimal can be written as an infinite geometric series and summed to give its exact fraction.',
        ],
      },
    ],
    formulae: [
      'Arithmetic: Tₙ = a + (n − 1)d',
      'Arithmetic sum: Sₙ = n ÷ 2 [2a + (n − 1)d]',
      'Quadratic pattern: Tₙ = an² + bn + c, 2a = second difference',
      'Geometric: Tₙ = a·r^(n − 1)',
      'Geometric sum: Sₙ = a(rⁿ − 1) ÷ (r − 1)',
      'Sum to infinity: S∞ = a ÷ (1 − r), valid only for −1 < r < 1',
    ],
    commonMistakes: [
      'Using Tₙ = a + nd instead of a + (n − 1)d.',
      'Assuming a pattern is quadratic after checking only one second difference.',
      'Counting the terms in a sigma sum as the upper limit, ignoring where it started.',
      'Applying the sum-to-infinity formula when |r| ≥ 1.',
      'Taking r as the difference between terms instead of the ratio.',
    ],
    example: {
      problem: 'Find the 10th term of the arithmetic sequence 3, 7, 11, 15, ...',
      steps: [
        'Identify a (first term) and d (common difference): a = 3, d = 4.',
        'Substitute into Tₙ = a + (n − 1)d with n = 10: T₁₀ = 3 + (10 − 1)(4).',
        'Calculate: T₁₀ = 3 + 9 × 4 = 3 + 36.',
      ],
      answer: 'T₁₀ = 39',
    },
  },
  {
    topicId: 'math-calculus',
    summary: 'Finding derivatives from first principles and using differentiation rules to analyse and sketch cubic graphs.',
    keyIdeas: [
      'Derivative from first principles: f\'(x) = lim(h→0) [f(x + h) − f(x)] ÷ h',
      'Power rule (once first principles is understood): d/dx[xⁿ] = n·xⁿ⁻¹',
      'Stationary (turning) points occur where f\'(x) = 0',
      'The derivative shows where a graph is increasing (f\'(x) > 0) or decreasing (f\'(x) < 0)',
    ],
    subtopics: [
      {
        name: 'Limits and differentiation from first principles',
        points: [
          'f′(x) = lim(h→0) [f(x + h) − f(x)] ÷ h.',
          'Expand f(x + h) fully, subtract f(x), and simplify before dividing by h.',
          'Only once every remaining term contains an h may you cancel and let h → 0.',
          'Keep the notation: the limit sign must appear on every line until you take the limit.',
        ],
      },
      {
        name: 'Rules of differentiation',
        points: [
          'If y = axⁿ then dy/dx = anx^(n − 1).',
          'The derivative of a constant is 0.',
          'Rewrite roots and fractions as powers before differentiating: √x is x^(1/2), and 1 ÷ x² is x⁻².',
          'Differentiate term by term; you may not differentiate a numerator and denominator separately.',
          'Notation: D_x[...], dy/dx and f′(x) all mean the same thing.',
        ],
      },
      {
        name: 'Gradients and equations of tangents',
        points: [
          'The derivative gives the gradient of the tangent at any point.',
          'Substitute the x-value into f′(x) to get the gradient, and into f(x) to get the y-coordinate.',
          'Then use y − y₁ = m(x − x₁) for the tangent\'s equation.',
          'A tangent parallel to a given line has the same gradient — set f′(x) equal to that gradient and solve.',
        ],
      },
      {
        name: 'Sketching cubic graphs',
        points: [
          'Find the y-intercept by setting x = 0, and the x-intercepts by factorising f(x) = 0.',
          'Find the stationary points by solving f′(x) = 0.',
          'The point of inflection is where f″(x) = 0, and for a cubic it lies midway between the turning points.',
          'A positive leading coefficient means the graph rises to the right; a negative one means it falls.',
          'Label every intercept and turning point on the sketch — marks are given for each.',
        ],
      },
      {
        name: 'Stationary points and concavity',
        points: [
          'Stationary points occur where f′(x) = 0.',
          'f″(x) < 0 at a local maximum; f″(x) > 0 at a local minimum.',
          'Concave up means the curve holds water; concave down means it sheds it. Concavity changes at the point of inflection.',
          'f′(x) > 0 means the function is increasing; f′(x) < 0 means it is decreasing.',
        ],
      },
      {
        name: 'Optimisation',
        points: [
          'Write the quantity to be maximised or minimised as a function of one variable.',
          'Use the constraint given in the question to eliminate the second variable.',
          'Differentiate, set the derivative equal to zero, and solve.',
          'Check that the answer makes sense in context and reject impossible values such as a negative length.',
          'Answer the question actually asked — sometimes it wants the maximum value, sometimes the x that produces it.',
        ],
      },
      {
        name: 'Rates of change',
        points: [
          'The derivative is a rate of change: how fast one quantity changes with respect to another.',
          'For motion, if s(t) is distance then s′(t) is velocity and s″(t) is acceleration.',
          '"The rate at which" always signals differentiation.',
          'Include the units in the answer: metres per second, litres per minute, rands per item.',
        ],
      },
    ],
    formulae: [
      'f′(x) = lim(h→0) [f(x + h) − f(x)] ÷ h',
      'd/dx (axⁿ) = anx^(n − 1)',
      'Tangent: y − y₁ = f′(x₁)(x − x₁)',
      'Stationary points: f′(x) = 0',
      'Point of inflection of a cubic: f″(x) = 0',
      'Velocity = s′(t), acceleration = s″(t)',
    ],
    commonMistakes: [
      'Dropping the limit notation while working from first principles.',
      'Cancelling h before every remaining term contains a factor of h.',
      'Differentiating a fraction by differentiating the numerator and denominator separately.',
      'Giving the x-value of a turning point when the y-value was asked for.',
      'Forgetting to use the constraint to reduce an optimisation problem to one variable.',
      'Leaving out units in a rate-of-change answer.',
    ],
    example: {
      problem: 'Differentiate f(x) = x³ − 3x² + 2 and find its stationary points.',
      steps: [
        'Apply the power rule to each term: f\'(x) = 3x² − 6x.',
        'Set the derivative equal to zero to find stationary points: 3x² − 6x = 0.',
        'Factorise: 3x(x − 2) = 0, so x = 0 or x = 2.',
      ],
      answer: 'f\'(x) = 3x² − 6x; stationary points at x = 0 and x = 2',
    },
  },
  {
    topicId: 'math-counting-probability',
    summary: 'Using Venn diagrams, tree diagrams and counting rules to calculate probabilities and count possible outcomes.',
    keyIdeas: [
      'Addition rule: P(A or B) = P(A) + P(B) − P(A and B)',
      'Mutually exclusive events cannot happen together: P(A and B) = 0',
      'Independent events: P(A and B) = P(A) × P(B)',
      'Fundamental counting principle: multiply the number of choices available at each stage to find the total number of outcomes',
    ],
    subtopics: [
      {
        name: 'Basic probability',
        points: [
          'P(A) = number of favourable outcomes ÷ total number of possible outcomes.',
          'Every probability lies between 0 and 1 inclusive.',
          'P(not A) = 1 − P(A). This complementary rule often turns a long calculation into a short one.',
          'The probabilities of all possible outcomes of one experiment add to 1.',
        ],
      },
      {
        name: 'Venn diagrams',
        points: [
          'Fill in the intersection first, then work outwards, subtracting as you go.',
          'n(A ∪ B) is everything in either set; n(A ∩ B) is only what is in both.',
          'Anything outside both circles still belongs to the sample space and must be counted.',
          'Check that all the regions add up to the total given in the question before answering.',
        ],
      },
      {
        name: 'Mutually exclusive and complementary events',
        points: [
          'Mutually exclusive events cannot happen together, so P(A and B) = 0.',
          'For mutually exclusive events, P(A or B) = P(A) + P(B).',
          'Complementary events are mutually exclusive AND cover everything, so their probabilities add to 1.',
          'Two events can be mutually exclusive without being complementary.',
        ],
      },
      {
        name: 'The addition rule',
        points: [
          'P(A or B) = P(A) + P(B) − P(A and B).',
          'The subtraction is needed because the overlap would otherwise be counted twice.',
          'If the events are mutually exclusive the last term is zero and the rule simplifies.',
          'Use the rule in reverse to find a missing intersection when the other three values are given.',
        ],
      },
      {
        name: 'Independent events and the product rule',
        points: [
          'Events are independent when one happening does not change the probability of the other.',
          'For independent events, P(A and B) = P(A) × P(B). This equality is also the test for independence.',
          'Drawing with replacement gives independent events; drawing without replacement does not.',
          'Independent and mutually exclusive are different ideas — do not use one to justify the other.',
        ],
      },
      {
        name: 'Tree diagrams and two-way tables',
        points: [
          'Multiply along the branches of a tree; add across separate branches that both satisfy the condition.',
          'The probabilities leaving any one node must add to 1.',
          'Without replacement, the denominator drops by one at the second stage — and the numerator too, if the same kind was taken.',
          'A two-way table suits two categorical variables; read the row total, column total or grand total that the question needs.',
        ],
      },
      {
        name: 'The fundamental counting principle',
        points: [
          'If one choice can be made in m ways and the next in n ways, together they can be made in m × n ways.',
          'The number of arrangements of n different objects is n!.',
          'If r objects are chosen from n and order matters, the count is n × (n − 1) × … down to r factors.',
          'Identical items are handled by dividing by the factorial of the number of repeats.',
        ],
      },
      {
        name: 'Arrangements with restrictions',
        points: [
          'If certain items must stay together, treat the group as a single unit, then multiply by the arrangements within it.',
          'If two items may not be adjacent, count all arrangements and subtract those where they are together.',
          'For a position restriction — a letter first, a digit last — fill the restricted positions first.',
          'Probability from counting is the number of favourable arrangements ÷ the total number of arrangements.',
        ],
      },
    ],
    formulae: [
      'P(A) = favourable outcomes ÷ total outcomes',
      'P(not A) = 1 − P(A)',
      'P(A or B) = P(A) + P(B) − P(A and B)',
      'Independent events: P(A and B) = P(A) × P(B)',
      'Counting principle: m × n ways',
      'Arrangements of n different objects: n!',
    ],
    commonMistakes: [
      'Adding probabilities that should be multiplied, or the other way round.',
      'Treating mutually exclusive events as independent.',
      'Forgetting to subtract the overlap in the addition rule.',
      'Keeping the same denominator at the second stage of a without-replacement tree diagram.',
      'Ignoring the region outside both circles in a Venn diagram.',
      'Counting arrangements as though repeated identical letters were different.',
    ],
    example: {
      problem: 'A restaurant offers 3 starters and 4 main courses. How many different starter-and-main combinations are possible?',
      steps: [
        'Identify the number of choices at each stage: 3 starters, 4 mains.',
        'Apply the fundamental counting principle by multiplying the choices: 3 × 4.',
      ],
      answer: '12 combinations',
    },
  },
  {
    topicId: 'math-euclidean-geometry',
    summary: 'Applying circle theorems and similar-triangle rules to prove riders and calculate unknown angles and lengths.',
    keyIdeas: [
      'The angle at the centre of a circle is twice the angle at the circumference subtended by the same arc',
      'Angles in the same segment of a circle, subtended by the same arc, are equal',
      'Opposite angles of a cyclic quadrilateral are supplementary (add up to 180°)',
      'Proportionality theorem: a line drawn parallel to one side of a triangle divides the other two sides in the same proportion',
    ],
    subtopics: [
      {
        name: 'Lines, angles and triangles',
        points: [
          'Angles on a straight line add to 180°; angles around a point add to 360°.',
          'With parallel lines: corresponding angles are equal, alternate angles are equal, and co-interior angles add to 180°.',
          'The angles of a triangle add to 180°; an exterior angle equals the sum of the two opposite interior angles.',
          'Always give the reason next to each statement. In this topic the reason carries the mark.',
        ],
      },
      {
        name: 'Congruency and similarity',
        points: [
          'Congruent triangles are identical in shape and size: SSS, SAS, AAS or RHS.',
          'Similar triangles have equal angles and sides in proportion (AAA, or three sides in proportion).',
          'Name corresponding vertices in the same order when writing a congruency or similarity statement.',
          'Similarity gives you a ratio to solve for an unknown side; congruency gives you equality directly.',
        ],
      },
      {
        name: 'Properties of quadrilaterals',
        points: [
          'A parallelogram has both pairs of opposite sides parallel and equal, and its diagonals bisect each other.',
          'A rectangle is a parallelogram with equal diagonals; a rhombus is a parallelogram with diagonals that bisect at right angles.',
          'A square is both a rectangle and a rhombus.',
          'To prove a shape, prove the minimum set of properties the definition needs — not every property it happens to have.',
        ],
      },
      {
        name: 'Circle geometry: centre and chord theorems',
        points: [
          'The line from the centre perpendicular to a chord bisects that chord, and the converse also holds.',
          'The angle at the centre is twice the angle at the circumference on the same arc.',
          'The angle in a semicircle is 90°.',
          'Equal chords are equidistant from the centre.',
        ],
      },
      {
        name: 'Circle geometry: same segment and cyclic quadrilaterals',
        points: [
          'Angles in the same segment, subtended by the same chord, are equal.',
          'Opposite angles of a cyclic quadrilateral add to 180°.',
          'The exterior angle of a cyclic quadrilateral equals the interior opposite angle.',
          'To prove points concyclic, show either that opposite angles sum to 180° or that two angles on the same side of a line segment are equal.',
        ],
      },
      {
        name: 'Tangents and the tan-chord theorem',
        points: [
          'A tangent is perpendicular to the radius at the point of contact.',
          'Two tangents drawn from the same external point are equal in length.',
          'Tan-chord: the angle between a tangent and a chord equals the angle in the alternate segment.',
          'Tan-chord is the theorem most often needed and most often missed — look for it whenever a tangent appears in a diagram.',
        ],
      },
      {
        name: 'Proportionality and the mid-point theorem',
        points: [
          'A line parallel to one side of a triangle divides the other two sides proportionally.',
          'The mid-point theorem: the line joining the midpoints of two sides is parallel to the third side and half its length.',
          'The converse holds: a line through one midpoint parallel to another side bisects the third side.',
          'In similar triangles, the ratio of the areas is the square of the ratio of corresponding sides.',
        ],
      },
      {
        name: 'Writing a geometry proof',
        points: [
          'Mark everything you are given onto the diagram before writing anything.',
          'Write one statement per line with its reason beside it, in the accepted wording.',
          'Work backwards from what is to be proved to see which theorem would deliver it, then write the proof forwards.',
          'Redraw a crowded diagram, or the one triangle you need, separately — most lost marks in this topic come from misreading the figure.',
        ],
      },
    ],
    formulae: [
      'Angles on a straight line = 180°, angles round a point = 360°',
      'Angle at centre = 2 × angle at circumference',
      'Opposite angles of a cyclic quadrilateral add to 180°',
      'Tan-chord: angle between tangent and chord = angle in alternate segment',
      'Mid-point theorem: the joining line is parallel to the third side and half its length',
      'Similar triangles: ratio of areas = (ratio of sides)²',
    ],
    commonMistakes: [
      'Giving a correct statement with no reason, or with a reason that does not match it.',
      'Assuming a line is a diameter or a tangent because it looks like one in the diagram.',
      'Naming corresponding vertices out of order in a similarity statement.',
      'Using the angle-at-centre theorem when the two angles are not on the same arc.',
      'Missing the tan-chord theorem whenever a tangent appears.',
      'Taking the ratio of areas as the ratio of sides instead of its square.',
    ],
    example: {
      problem: 'ABCD is a cyclic quadrilateral. Angle A = 110°. Find angle C.',
      steps: [
        'Recall the rule: opposite angles of a cyclic quadrilateral are supplementary.',
        'Set up the equation: angle A + angle C = 180°.',
        'Substitute and solve: 110° + angle C = 180° → angle C = 180° − 110°.',
      ],
      answer: 'Angle C = 70°',
    },
  },
  {
    topicId: 'life-sci-chemistry-of-life',
    summary: 'The inorganic and organic compounds that make up living cells, the food tests that identify them, and why enzymes control almost every reaction in the body.',
    keyIdeas: [
      'Water is the medium for every reaction in a cell: it dissolves substances, transports them, and resists temperature change',
      'Organic compounds all contain carbon; the four groups are carbohydrates, lipids, proteins and nucleic acids',
      'Carbohydrates and lipids contain only C, H and O; proteins add nitrogen (N), and often sulfur',
      'Enzymes are biological catalysts made of protein: they speed up reactions without being used up',
      'Enzyme action is specific because the shape of the active site fits only one substrate',
    ],
    subtopics: [
      {
        name: 'Inorganic compounds',
        points: [
          'Water: high specific heat capacity, universal solvent, transport medium, reactant in photosynthesis',
          'Mineral salts: calcium and phosphate for bones and teeth, iron for haemoglobin, iodine for thyroxin',
          'A deficiency disease names the missing mineral: anaemia points to iron, goitre to iodine',
        ],
      },
      {
        name: 'Organic compounds and food tests',
        points: [
          'Carbohydrates: monosaccharides (glucose), disaccharides (sucrose), polysaccharides (starch, cellulose, glycogen)',
          'Lipids: one glycerol plus three fatty acids; store more energy per gram than carbohydrates',
          'Proteins: chains of amino acids; used for growth, repair, enzymes, antibodies and haemoglobin',
          'Tests: iodine turns blue-black for starch; Benedicts turns brick-red on heating for reducing sugar; the grease spot is translucent for lipids; Biuret turns violet for protein',
        ],
      },
      {
        name: 'Enzymes',
        points: [
          'Lock-and-key model: the substrate fits the active site of one particular enzyme',
          'Optimum temperature is about 37 degrees Celsius in humans; above it the enzyme denatures and the active site changes shape permanently',
          'Optimum pH differs by enzyme: pepsin works at about pH 2 in the stomach, amylase at about pH 7 in the mouth',
          'Denaturing is permanent; slowing down in the cold is not',
        ],
      },
    ],
    commonMistakes: [
      'An enzyme that is denatured has not been used up or killed: its active site has changed shape, so it can no longer bind the substrate',
      'Cellulose and starch are both made of glucose, but only starch is a storage compound; cellulose builds the cell wall',
      'Benedicts solution must be heated before the colour change means anything',
    ],
    example: {
      problem: 'A learner tests a food sample. Iodine turns blue-black, Biuret stays blue, and a grease spot appears on paper. State which food groups are present and which is absent.',
      steps: [
        'Iodine turning blue-black is a positive test for starch, so a carbohydrate is present.',
        'Biuret staying blue is a negative result, so protein is absent.',
        'A translucent grease spot is a positive test for lipids, so lipids are present.',
      ],
      answer: 'Starch and lipids are present; protein is absent.',
    },
    moreExamples: [
      {
        problem: 'An enzyme works best at 37 degrees Celsius. Explain what happens to its rate of reaction at 10 degrees Celsius and at 70 degrees Celsius.',
        steps: [
          'At 10 degrees Celsius the molecules move slowly, so there are fewer collisions between enzyme and substrate and the rate is low.',
          'This slowing is temporary: warming the enzyme back to 37 degrees Celsius restores the rate.',
          'At 70 degrees Celsius the heat breaks the bonds holding the enzyme in shape, so the active site changes shape and the enzyme denatures.',
          'Denaturing is permanent, so cooling back to 37 degrees Celsius does not restore the rate.',
        ],
        answer: 'Slow but recoverable at 10 degrees Celsius; denatured and permanently inactive at 70 degrees Celsius.',
      },
    ],
  },
  {
    topicId: 'life-sci-cells',
    summary: 'The structure of plant and animal cells under the microscope, what each organelle does, how substances move across the cell membrane, and how magnification is calculated.',
    keyIdeas: [
      'The cell is the smallest unit of life; all organisms are made of one or more cells',
      'Plant cells have a cell wall, chloroplasts and one large vacuole; animal cells have none of these',
      'The cell membrane is selectively permeable: it controls what enters and leaves',
      'Diffusion and osmosis are passive and need no energy; active transport moves substances against the concentration gradient and needs ATP',
      'Magnification = size of the drawing divided by the real size of the object',
    ],
    subtopics: [
      {
        name: 'Organelles and their functions',
        points: [
          'Nucleus: contains DNA and controls all cell activities',
          'Mitochondrion: site of aerobic respiration, releasing ATP; has its own DNA',
          'Chloroplast: site of photosynthesis; contains chlorophyll; found in plant cells only',
          'Ribosome: site of protein synthesis',
          'Vacuole: stores cell sap and keeps the plant cell turgid',
        ],
      },
      {
        name: 'Movement across the membrane',
        points: [
          'Diffusion: movement of particles from high to low concentration until evenly spread',
          'Osmosis: movement of water only, across a selectively permeable membrane, from a high to a low water concentration',
          'Active transport: movement against the gradient, using energy from ATP, for example mineral uptake by root hairs',
          'A plant cell in a strong salt solution loses water and becomes plasmolysed; an animal cell in pure water bursts (lysis)',
        ],
      },
      {
        name: 'Microscopy and magnification',
        points: [
          'Total magnification = eyepiece magnification multiplied by objective lens magnification',
          'For a drawing: magnification = drawing size divided by actual size, written as a number with a multiplication sign',
          'Keep both measurements in the same unit before dividing',
        ],
      },
    ],
    formulae: [
      'Magnification = drawing (or image) size / actual size',
      'Total magnification = eyepiece x objective',
      '1 mm = 1 000 micrometres',
    ],
    commonMistakes: [
      'Osmosis is the movement of water, not of the dissolved salt or sugar',
      'Magnification has no unit; it is a ratio, so the two lengths must be converted to the same unit first',
      'A plant cell does not burst in pure water, because the cell wall resists the pressure',
    ],
    example: {
      problem: 'A cell is drawn 40 mm long. The actual cell is 20 micrometres long. Calculate the magnification of the drawing.',
      steps: [
        'Convert both to the same unit: 40 mm = 40 000 micrometres.',
        'Magnification = drawing size divided by actual size = 40 000 / 20.',
        'Work out the division: 40 000 / 20 = 2 000.',
      ],
      answer: 'x 2 000',
    },
    moreExamples: [
      {
        problem: 'A plant cell is placed in a concentrated sugar solution. Describe and explain what happens to the cell.',
        steps: [
          'The water concentration outside the cell is lower than inside the cell sap.',
          'Water therefore moves out of the vacuole by osmosis, across the selectively permeable membrane.',
          'The vacuole shrinks and the cell membrane pulls away from the cell wall.',
          'The cell is now plasmolysed and flaccid, though the rigid cell wall keeps its overall shape.',
        ],
        answer: 'The cell loses water by osmosis and becomes plasmolysed (flaccid).',
      },
    ],
  },
  {
    topicId: 'life-sci-mitosis',
    summary: 'How one cell divides into two genetically identical daughter cells, the events of each phase, and what happens when the process is no longer controlled.',
    keyIdeas: [
      'Mitosis produces two daughter cells that are genetically identical to each other and to the parent cell',
      'The chromosome number stays the same: a diploid cell produces diploid cells',
      'Mitosis is used for growth, for repair of damaged tissue, and for asexual reproduction',
      'Interphase is not part of mitosis: it is the growth phase in which DNA is replicated',
      'Uncontrolled mitosis produces a tumour, which may be benign or malignant',
    ],
    subtopics: [
      {
        name: 'Interphase',
        points: [
          'G1: the cell grows and makes new organelles',
          'S: DNA replicates, so each chromosome now has two identical chromatids',
          'G2: the cell prepares the proteins needed for division',
        ],
      },
      {
        name: 'The four phases',
        points: [
          'Prophase: chromosomes shorten and thicken and become visible; the nuclear membrane breaks down; spindle fibres form',
          'Metaphase: chromosomes line up singly along the equator of the cell',
          'Anaphase: the chromatids are pulled apart to opposite poles by the spindle fibres',
          'Telophase: chromosomes reach the poles, uncoil, and two new nuclear membranes form',
        ],
      },
      {
        name: 'Cytokinesis and cancer',
        points: [
          'In animal cells the membrane pinches inwards; in plant cells a cell plate forms between the two nuclei',
          'A tumour is a mass of cells produced by mitosis that is no longer controlled',
          'Benign tumours stay in one place; malignant tumours spread to other organs, which is called metastasis',
        ],
      },
    ],
    commonMistakes: [
      'Chromosomes line up singly in metaphase of mitosis; lining up in pairs happens in meiosis I',
      'DNA replicates in interphase, not in prophase',
      'Cytokinesis is the division of the cytoplasm and is separate from mitosis, which divides the nucleus',
    ],
    example: {
      problem: 'A cell with 46 chromosomes undergoes mitosis. State the number of daughter cells produced and the number of chromosomes in each.',
      steps: [
        'Mitosis produces two daughter cells from one parent cell.',
        'Mitosis is a division that keeps the chromosome number the same.',
        'Each daughter cell therefore has the same 46 chromosomes as the parent cell.',
      ],
      answer: 'Two daughter cells, each with 46 chromosomes.',
    },
    moreExamples: [
      {
        problem: 'Explain why the daughter cells produced by mitosis are genetically identical to the parent cell.',
        steps: [
          'During the S phase of interphase, each chromosome is copied exactly to form two identical chromatids.',
          'In metaphase the chromosomes line up singly along the equator.',
          'In anaphase the two identical chromatids of each chromosome are separated and pulled to opposite poles.',
          'Each pole therefore receives one exact copy of every chromosome, so both daughter nuclei carry identical DNA.',
        ],
        answer: 'Because DNA is replicated exactly in interphase and the identical chromatids are then separated equally between the two cells.',
      },
    ],
  },
  {
    topicId: 'life-sci-plant-tissues',
    summary: 'The tissues that make up a dicotyledonous plant, where each one sits in root, stem and leaf, and how structure fits function.',
    keyIdeas: [
      'Meristematic tissue is the only plant tissue that divides; it is found at root and shoot tips and in the cambium',
      'Epidermis is a single protective layer, often with a waxy cuticle that reduces water loss',
      'Parenchyma is packing tissue; when it contains chloroplasts in the leaf it is called chlorenchyma and carries out photosynthesis',
      'Xylem carries water and mineral salts upwards only; its vessels are dead, hollow and lignified',
      'Phloem carries manufactured food in both directions; its sieve tubes are living and have companion cells',
    ],
    subtopics: [
      {
        name: 'Ground and protective tissues',
        points: [
          'Parenchyma: thin-walled living cells that store food and water',
          'Collenchyma: thickened corners give flexible support to young stems',
          'Sclerenchyma: dead, heavily lignified cells that give rigid support',
          'Epidermis with cuticle: reduces transpiration; guard cells in the leaf epidermis control the stomata',
        ],
      },
      {
        name: 'Vascular tissue',
        points: [
          'Xylem: vessels and tracheids, dead at maturity, no end walls, lignified for strength; transport is one way, upwards',
          'Phloem: sieve tubes with perforated sieve plates, kept alive by companion cells; transport is two way',
          'In a dicot root the xylem forms a star shape in the centre; in a dicot stem the bundles form a ring with xylem inside and phloem outside',
        ],
      },
      {
        name: 'The leaf in section',
        points: [
          'Upper epidermis with cuticle, then palisade mesophyll packed with chloroplasts, then spongy mesophyll with air spaces, then lower epidermis with most of the stomata',
          'Palisade cells are long and vertical so that more chloroplasts sit near the light',
          'Air spaces in the spongy layer allow carbon dioxide to diffuse to the photosynthesising cells',
        ],
      },
    ],
    commonMistakes: [
      'Xylem transport is upwards only; saying it moves food in both directions confuses it with phloem',
      'Xylem vessels are dead at maturity, which is why they are hollow and offer no resistance to flow',
      'Stomata are mostly in the lower epidermis of a leaf, which reduces water loss in direct sun',
    ],
    example: {
      problem: 'Name the tissue that transports water in a plant, and give TWO structural features that suit it to this function.',
      steps: [
        'Water and dissolved mineral salts are transported by xylem.',
        'The cells are dead and hollow with no cross walls, so water flows through an unobstructed tube.',
        'The walls are strengthened with lignin, so the vessel does not collapse under the tension of the transpiration stream.',
      ],
      answer: 'Xylem; it is a hollow tube of dead cells with no end walls, and its walls are lignified for strength.',
    },
    moreExamples: [
      {
        problem: 'Explain why palisade mesophyll cells are found in the upper half of a leaf rather than the lower half.',
        steps: [
          'Palisade cells contain the largest number of chloroplasts in the leaf.',
          'Light strikes the upper surface of the leaf first and is absorbed as it passes down through the tissue.',
          'Placing the palisade layer directly beneath the upper epidermis exposes those chloroplasts to the strongest light.',
          'The rate of photosynthesis is therefore as high as possible.',
        ],
        answer: 'Because they hold the most chloroplasts, so they are positioned where the light is strongest.',
      },
    ],
  },
  {
    topicId: 'life-sci-animal-tissues',
    summary: 'The four basic animal tissue types, examples of each, and how their structure matches the job they do in the body.',
    keyIdeas: [
      'The four tissue types are epithelial, connective, muscle and nervous tissue',
      'Epithelial tissue covers surfaces and lines cavities; it sits on a basement membrane and has almost no intercellular space',
      'Connective tissue has few cells and a large amount of matrix between them',
      'Muscle tissue contracts; nervous tissue conducts impulses',
      'Tissues combine to form organs, and organs combine to form systems',
    ],
    subtopics: [
      {
        name: 'Epithelial tissue',
        points: [
          'Squamous: flat, thin cells for diffusion, as in the alveoli and blood capillaries',
          'Cuboidal and columnar: taller cells for secretion and absorption, as in glands and the small intestine',
          'Ciliated columnar: bears cilia that sweep mucus along, as in the trachea',
        ],
      },
      {
        name: 'Connective tissue',
        points: [
          'Areolar tissue binds organs and fills spaces',
          'Adipose tissue stores fat, insulates and cushions',
          'Cartilage is firm but flexible; bone is hard because the matrix contains calcium salts',
          'Blood is a connective tissue: its matrix is the liquid plasma',
        ],
      },
      {
        name: 'Muscle and nervous tissue',
        points: [
          'Skeletal muscle: striated, attached to bone, under voluntary control',
          'Cardiac muscle: striated and branched, found only in the heart, involuntary and never tires',
          'Smooth muscle: not striated, found in the gut and blood vessel walls, involuntary',
          'Neurons carry impulses; the cell body, dendrites and axon each have a distinct role',
        ],
      },
    ],
    commonMistakes: [
      'Blood and bone are both connective tissues, because both consist of cells scattered in a matrix',
      'Cardiac muscle is striated like skeletal muscle but is involuntary like smooth muscle',
      'Squamous epithelium is thin because its job is diffusion, not protection',
    ],
    example: {
      problem: 'Blood and bone are both classified as connective tissue. Justify this classification.',
      steps: [
        'Connective tissue is defined by having relatively few cells separated by a large amount of matrix.',
        'In bone, the cells sit in a hard matrix containing calcium salts.',
        'In blood, the cells are suspended in the liquid matrix called plasma.',
        'Both therefore match the definition, even though one matrix is solid and the other liquid.',
      ],
      answer: 'Both consist of cells scattered in a large amount of matrix: a hard calcium matrix in bone and liquid plasma in blood.',
    },
    moreExamples: [
      {
        problem: 'Explain why the alveoli of the lungs are lined with squamous epithelium rather than columnar epithelium.',
        steps: [
          'Squamous epithelial cells are extremely flat and thin.',
          'Gases must diffuse between the air in the alveolus and the blood in the capillary.',
          'A thin lining gives a short diffusion distance, so gases cross quickly.',
          'Columnar cells are much taller and would slow diffusion down.',
        ],
        answer: 'Because squamous cells are very thin, giving the short diffusion distance that rapid gaseous exchange needs.',
      },
    ],
  },
  {
    topicId: 'life-sci-transport-plants',
    summary: 'How water travels from the soil to the leaves, what drives transpiration, and how plants are supported and adapted to conserve water.',
    keyIdeas: [
      'Water enters through root hairs by osmosis, moves across the root, and rises in the xylem to the leaves',
      'Transpiration is the loss of water vapour from the leaves, mostly through the stomata',
      'The transpiration stream is driven by evaporation at the leaf, which pulls the water column upwards',
      'Cohesion between water molecules and adhesion to the xylem wall keep the column unbroken',
      'Turgor pressure in parenchyma cells supports soft, non-woody plants',
    ],
    subtopics: [
      {
        name: 'Water uptake and pathway',
        points: [
          'Root hairs give a very large surface area for absorption',
          'Water enters by osmosis; mineral salts often enter by active transport, using ATP',
          'Pathway: root hair, root cortex, root xylem, stem xylem, leaf xylem, mesophyll, stomata',
        ],
      },
      {
        name: 'Transpiration and its rate',
        points: [
          'Rate increases with higher temperature, more wind, lower humidity and more light (stomata open)',
          'Rate decreases in still, humid, cool or dark conditions',
          'Guard cells become turgid and open the stoma when water is plentiful and light is available',
        ],
      },
      {
        name: 'Adaptations to reduce water loss',
        points: [
          'Thick waxy cuticle, sunken stomata, rolled leaves, hairs on the leaf surface, reduced leaf area (spines)',
          'These adaptations trap a layer of humid air next to the stomata, lowering the rate of diffusion out of the leaf',
        ],
      },
    ],
    commonMistakes: [
      'Water is pulled up by evaporation at the top, not pushed up from the root; root pressure alone cannot explain the height of a tall tree',
      'Transpiration is the loss of water vapour; the movement of water up the stem is the transpiration stream',
      'Closing stomata saves water but also stops carbon dioxide entering, so photosynthesis slows',
    ],
    example: {
      problem: 'Explain why the rate of transpiration increases on a hot, windy day.',
      steps: [
        'Higher temperature gives water molecules more energy, so evaporation from the mesophyll cell surfaces speeds up.',
        'Wind blows away the humid air that collects just outside the stomata.',
        'This keeps the water vapour concentration outside the leaf low, so the concentration gradient between the leaf and the air stays steep.',
        'Water vapour therefore diffuses out of the stomata faster.',
      ],
      answer: 'Heat speeds up evaporation inside the leaf and wind keeps the outside air dry, so the diffusion gradient stays steep.',
    },
    moreExamples: [
      {
        problem: 'A plant that has not been watered for several days begins to wilt. Explain why.',
        steps: [
          'With little soil water, the plant absorbs less water than it loses through transpiration.',
          'The vacuoles of the parenchyma cells lose water and shrink.',
          'The cells lose turgor pressure and become flaccid, so they no longer press against one another.',
          'Soft tissues depend on this turgor for support, so the leaves and stem droop.',
        ],
        answer: 'The cells lose turgor pressure, and soft plant tissue relies on turgor for support.',
      },
    ],
  },
  {
    topicId: 'life-sci-skeletal-system',
    summary: 'The parts of the human skeleton, the structure of joints, how muscles work in antagonistic pairs, and the main disorders of bones and joints.',
    keyIdeas: [
      'The skeleton gives support, protection, movement, mineral storage and blood cell production',
      'The axial skeleton is the skull, vertebral column, ribs and sternum; the appendicular skeleton is the limbs and girdles',
      'A joint is where two bones meet; synovial joints allow the freest movement',
      'Muscles can only pull, never push, so they work in antagonistic pairs',
      'Ligaments join bone to bone; tendons join muscle to bone',
    ],
    subtopics: [
      {
        name: 'Structure of the skeleton',
        points: [
          'Axial: skull protects the brain, ribs and sternum protect heart and lungs, vertebral column protects the spinal cord',
          'Appendicular: pectoral girdle and arms, pelvic girdle and legs',
          'Long bone structure: compact bone outside, spongy bone at the ends, marrow cavity inside, cartilage at the joint surfaces',
        ],
      },
      {
        name: 'Joints',
        points: [
          'Fibrous (immovable), for example the sutures of the skull',
          'Cartilaginous (slightly movable), for example between vertebrae',
          'Synovial (freely movable): hinge at the elbow and knee, ball-and-socket at the shoulder and hip',
          'Synovial fluid lubricates; cartilage cushions; the capsule and ligaments hold the joint together',
        ],
      },
      {
        name: 'Muscles and disorders',
        points: [
          'Biceps and triceps are antagonistic: when the biceps contracts the arm bends and the triceps relaxes',
          'Arthritis is inflammation of a joint; osteoporosis is loss of bone density making bones brittle',
          'Rickets follows a shortage of vitamin D or calcium, so bones soften and bend',
        ],
      },
    ],
    commonMistakes: [
      'A hinge joint moves in one plane only; the shoulder and hip are ball-and-socket and rotate',
      'Tendons attach muscle to bone and ligaments attach bone to bone, not the other way round',
      'A muscle relaxing is not the same as a muscle pushing; the opposite muscle does the pulling',
    ],
    example: {
      problem: 'Explain how the biceps and triceps work together to straighten the arm at the elbow.',
      steps: [
        'Muscles can only pull when they contract, so one muscle cannot both bend and straighten a joint.',
        'To straighten the arm the triceps contracts and pulls on the ulna.',
        'At the same time the biceps relaxes, allowing the joint to open.',
        'The two muscles therefore form an antagonistic pair working across the same hinge joint.',
      ],
      answer: 'The triceps contracts while the biceps relaxes, because muscles can only pull and so must work in antagonistic pairs.',
    },
    moreExamples: [
      {
        problem: 'State the type of joint found at the hip, and explain why this type suits the movement required there.',
        steps: [
          'The hip is a ball-and-socket joint: the rounded head of the femur sits in the socket of the pelvic girdle.',
          'A ball-and-socket joint allows movement in all planes, as well as rotation.',
          'Walking, running and climbing all require the leg to swing forwards, backwards, sideways and to rotate.',
          'A hinge joint would allow movement in only one plane and could not do this.',
        ],
        answer: 'A ball-and-socket joint, because it permits movement in every plane and rotation, which walking and running require.',
      },
    ],
  },
  {
    topicId: 'life-sci-circulatory-system',
    summary: 'The structure of the human heart, the double circulation, the blood vessels and blood components, and the lifestyle diseases that affect the system.',
    keyIdeas: [
      'Humans have a closed, double circulation: blood passes through the heart twice for each full circuit',
      'The pulmonary circuit carries blood to the lungs; the systemic circuit carries it to the rest of the body',
      'The left ventricle has the thickest wall because it pumps blood to the whole body',
      'Valves prevent the backflow of blood',
      'Arteries carry blood away from the heart, veins carry blood back to it',
    ],
    subtopics: [
      {
        name: 'The heart',
        points: [
          'Four chambers: right atrium, right ventricle, left atrium, left ventricle',
          'Right side carries deoxygenated blood, left side oxygenated; the septum keeps them apart',
          'Tricuspid valve on the right and bicuspid on the left prevent backflow into the atria; semilunar valves prevent backflow into the ventricles',
          'Coronary arteries supply the heart muscle itself with oxygen',
        ],
      },
      {
        name: 'Blood vessels',
        points: [
          'Arteries: thick, muscular, elastic walls and a narrow lumen, to withstand high pressure; no valves',
          'Veins: thin walls and a wide lumen, low pressure, with valves to stop backflow',
          'Capillaries: one cell thick, for exchange of gases, nutrients and wastes with the tissues',
        ],
      },
      {
        name: 'Blood and disorders',
        points: [
          'Plasma carries dissolved substances; red blood cells carry oxygen using haemoglobin; white blood cells fight infection; platelets clot blood',
          'Red blood cells have no nucleus and are biconcave, giving more room for haemoglobin and a larger surface area',
          'Atherosclerosis is the narrowing of arteries by fatty deposits; it raises blood pressure and can cause a heart attack or stroke',
        ],
      },
    ],
    commonMistakes: [
      'The pulmonary artery carries deoxygenated blood and the pulmonary vein carries oxygenated blood; vessels are named by direction of flow, not by what they carry',
      'Blood flows through the heart twice per circuit, which is why this is called a double circulation',
      'Capillaries are thin for exchange, not for strength',
    ],
    example: {
      problem: 'Explain why the wall of the left ventricle is thicker than the wall of the right ventricle.',
      steps: [
        'The right ventricle pumps blood only as far as the lungs, which lie next to the heart.',
        'The left ventricle pumps blood to the whole body, including the head and the legs.',
        'A greater distance and greater resistance require a higher pressure.',
        'More cardiac muscle in the wall generates that higher pressure.',
      ],
      answer: 'Because it pumps blood to the whole body rather than only to the nearby lungs, which needs a much higher pressure.',
    },
    moreExamples: [
      {
        problem: 'Describe the path of a red blood cell from the vena cava until it leaves the heart in the aorta.',
        steps: [
          'The vena cava empties deoxygenated blood into the right atrium.',
          'The right atrium contracts and blood passes through the tricuspid valve into the right ventricle.',
          'The right ventricle contracts and pushes blood through the pulmonary artery to the lungs, where it is oxygenated.',
          'Oxygenated blood returns through the pulmonary vein to the left atrium, passes the bicuspid valve into the left ventricle, and is pumped out through the aorta.',
        ],
        answer: 'Vena cava, right atrium, right ventricle, pulmonary artery, lungs, pulmonary vein, left atrium, left ventricle, aorta.',
      },
    ],
  },
  {
    topicId: 'life-sci-ecosystem-energy-flow',
    summary: 'How energy entering an ecosystem as sunlight passes along food chains and webs, and why the amount available falls sharply at each level.',
    keyIdeas: [
      'Energy enters as sunlight and is trapped by producers during photosynthesis',
      'A food chain shows one pathway; a food web shows many interlinked chains',
      'Each feeding stage is a trophic level: producer, primary consumer, secondary consumer, tertiary consumer',
      'Only about 10% of the energy at one trophic level is passed on to the next',
      'Energy flows one way and is lost as heat; nutrients, by contrast, are recycled',
    ],
    subtopics: [
      {
        name: 'Food chains and webs',
        points: [
          'Arrows point in the direction the energy flows, that is from the eaten to the eater',
          'Producers are green plants; herbivores are primary consumers; carnivores are secondary or tertiary consumers',
          'Decomposers break down dead material and release nutrients back into the soil',
        ],
      },
      {
        name: 'Energy loss',
        points: [
          'Energy is lost at each level through respiration, movement, heat, excretion and undigested remains',
          'This is why food chains rarely have more than four or five links',
          'Pyramids of numbers can be inverted (one tree feeding many insects), but a pyramid of energy is always upright',
        ],
      },
      {
        name: 'Effects of change',
        points: [
          'Removing one species affects every organism linked to it in the web',
          'A predator removed means its prey increases, which then over-grazes its own food source',
          'Bioaccumulation: substances such as DDT become more concentrated at each trophic level',
        ],
      },
    ],
    formulae: [
      'Percentage energy transferred = (energy at the higher level / energy at the lower level) x 100',
    ],
    commonMistakes: [
      'Arrows in a food chain show the flow of energy, so they point towards the consumer, not towards the food',
      'Energy is not recycled; only nutrients are',
      'A pyramid of numbers can be upside down, but a pyramid of energy cannot',
    ],
    example: {
      problem: 'A producer level contains 10 000 kJ of energy and the primary consumer level contains 900 kJ. Calculate the percentage of energy transferred, and state whether this is typical.',
      steps: [
        'Percentage transferred = (energy at the higher level / energy at the lower level) x 100.',
        'Substitute the values: (900 / 10 000) x 100.',
        'Work it out: 0.09 x 100 = 9%.',
        'The usual figure quoted is about 10%, so 9% is typical.',
      ],
      answer: '9%, which is close to the usual 10% and therefore typical.',
    },
    moreExamples: [
      {
        problem: 'In a food web, owls eat both mice and snakes, and snakes also eat mice. Predict and explain the effect on the mouse population if all the snakes were removed.',
        steps: [
          'Removing snakes removes one of the two predators of the mice, so fewer mice are eaten.',
          'The mouse population would therefore be expected to increase at first.',
          'However, owls now have only mice to eat, so owls would eat more mice than before.',
          'The increase would therefore be smaller than expected, and the mouse population may settle at a new level rather than rising without limit.',
        ],
        answer: 'The mouse population rises at first, but less than expected, because the owls switch to feeding on mice alone.',
      },
    ],
  },
  {
    topicId: 'life-sci-nutrient-cycling',
    summary: 'How carbon, water and nitrogen move repeatedly between the living and non-living parts of an ecosystem, and how human activity disturbs these cycles.',
    keyIdeas: [
      'Nutrients are recycled, unlike energy, which flows through an ecosystem once',
      'Photosynthesis removes carbon dioxide from the air; respiration, decomposition and combustion return it',
      'Decomposers are essential to every cycle: without them nutrients stay locked in dead material',
      'Nitrogen gas makes up about 78% of the air but cannot be used by plants directly',
      'Human activity shifts cycles out of balance, for example by burning fossil fuels or over-applying fertiliser',
    ],
    subtopics: [
      {
        name: 'The carbon cycle',
        points: [
          'Carbon enters the living world through photosynthesis and leaves it through respiration',
          'Decomposition releases carbon from dead organisms; combustion releases carbon stored in fossil fuels',
          'Burning fossil fuels and deforestation raise atmospheric carbon dioxide, strengthening the greenhouse effect',
        ],
      },
      {
        name: 'The water cycle',
        points: [
          'Evaporation and transpiration put water vapour into the air; condensation forms clouds; precipitation returns water to the ground',
          'Water then runs off into rivers or infiltrates to become groundwater',
          'Removing vegetation reduces transpiration and increases run-off, which causes erosion and flooding',
        ],
      },
      {
        name: 'The nitrogen cycle',
        points: [
          'Nitrogen fixation: bacteria in root nodules of legumes, and lightning, convert nitrogen gas into nitrates',
          'Nitrification: bacteria convert ammonia to nitrites and then to nitrates, which plants absorb',
          'Denitrification: bacteria return nitrogen gas to the air',
          'Eutrophication: fertiliser runoff causes algal blooms, which block light and use up oxygen when they decompose, killing fish',
        ],
      },
    ],
    commonMistakes: [
      'Plants absorb nitrates from the soil, not nitrogen gas from the air',
      'Decomposers release nutrients; they do not consume the ecosystem energy budget in the way consumers do',
      'Eutrophication kills fish through oxygen depletion during decomposition, not through the fertiliser being poisonous',
    ],
    example: {
      problem: 'Explain why farmers plant legumes such as beans in a field between crops of maize.',
      steps: [
        'Legumes have root nodules containing nitrogen-fixing bacteria.',
        'These bacteria convert nitrogen gas from the air into nitrates in the soil.',
        'This raises the nitrate content of the soil without the cost of artificial fertiliser.',
        'The maize planted afterwards can absorb these nitrates and grow better.',
      ],
      answer: 'Because nitrogen-fixing bacteria in the root nodules of legumes enrich the soil with nitrates for the next crop.',
    },
    moreExamples: [
      {
        problem: 'A river downstream of a farm develops a thick algal bloom, and fish later die. Explain the sequence of events.',
        steps: [
          'Fertiliser containing nitrates runs off the farm into the river.',
          'The extra nitrates allow algae to grow rapidly, forming a bloom on the surface.',
          'The bloom blocks light from reaching plants below, which die, and the algae themselves soon die.',
          'Decomposers multiply as they break down all this dead material, and their respiration uses up the dissolved oxygen, so the fish suffocate.',
        ],
        answer: 'Nitrate runoff causes an algal bloom; when the algae die, decomposers use up the dissolved oxygen and the fish die of oxygen starvation.',
      },
    ],
  },
  {
    topicId: 'life-sci-photosynthesis',
    summary: 'How green plants trap light energy to build glucose, the two stages of the process, and the factors that limit the rate.',
    keyIdeas: [
      'Photosynthesis converts light energy into chemical energy stored in glucose',
      'It takes place in the chloroplasts, where chlorophyll absorbs mainly red and blue light',
      'The light phase happens in the grana and needs light; the dark phase happens in the stroma and does not',
      'Oxygen released comes from the splitting of water, not from carbon dioxide',
      'A limiting factor is the factor in shortest supply, which alone sets the rate',
    ],
    subtopics: [
      {
        name: 'The light phase',
        points: [
          'Takes place in the grana of the chloroplast',
          'Chlorophyll absorbs light energy, which splits water into hydrogen and oxygen (photolysis)',
          'Oxygen is released as a by-product; hydrogen is carried to the dark phase',
          'ATP is produced and also passed to the dark phase',
        ],
      },
      {
        name: 'The dark phase (Calvin cycle)',
        points: [
          'Takes place in the stroma and does not require light directly',
          'Carbon dioxide is fixed and reduced using the hydrogen and ATP from the light phase',
          'Glucose is formed, which may be converted to starch for storage',
        ],
      },
      {
        name: 'Limiting factors',
        points: [
          'Light intensity, carbon dioxide concentration and temperature can each limit the rate',
          'As one factor is increased the rate rises, then levels off when a different factor becomes limiting',
          'On a rate graph the plateau shows that light is no longer the limiting factor',
          'Very high temperature lowers the rate because the enzymes of the dark phase denature',
        ],
      },
    ],
    formulae: [
      '6CO2 + 12H2O, in the presence of light energy and chlorophyll, gives C6H12O6 + 6O2 + 6H2O',
    ],
    commonMistakes: [
      'The oxygen given off comes from water, not from carbon dioxide',
      'The dark phase does not need darkness; it simply does not need light directly, and it runs during the day using products of the light phase',
      'A plateau on a light-intensity graph does not mean the plant has stopped photosynthesising, only that another factor has become limiting',
    ],
    example: {
      problem: 'A learner measures the rate of photosynthesis in pondweed at increasing light intensities: 100 lux gives 5 bubbles/min, 200 gives 12, 300 gives 20, 400 gives 22 and 500 gives 22. Describe the trend and explain why the rate levels off.',
      steps: [
        'From 100 to 300 lux the rate rises steeply, from 5 to 20 bubbles per minute, so light intensity is the limiting factor over this range.',
        'From 300 to 400 lux the rate rises only slightly, from 20 to 22.',
        'From 400 to 500 lux the rate does not change at all, staying at 22 bubbles per minute.',
        'The plateau shows that light is no longer limiting: some other factor, such as carbon dioxide concentration or temperature, has become the factor in shortest supply.',
      ],
      answer: 'The rate rises steeply and then levels off at 22 bubbles/min because a factor other than light, such as carbon dioxide concentration or temperature, has become limiting.',
    },
    moreExamples: [
      {
        problem: 'Explain why a plant kept in complete darkness for several days will eventually die.',
        steps: [
          'Without light the light phase cannot occur, so no ATP or hydrogen is produced for the dark phase.',
          'No glucose can therefore be manufactured.',
          'The plant continues to respire, using up its stored starch reserves to release energy.',
          'Once the reserves are exhausted the plant has no energy source and dies.',
        ],
        answer: 'It cannot photosynthesise, so once its stored starch is used up by respiration it has no energy source.',
      },
    ],
  },
  {
    topicId: 'life-sci-animal-nutrition',
    summary: 'How food is taken in, digested, absorbed and assimilated in humans, the enzymes involved at each stage, and the effects of diet on health.',
    keyIdeas: [
      'Digestion breaks large insoluble molecules into small soluble ones that can be absorbed',
      'Mechanical digestion increases surface area; chemical digestion uses enzymes to break bonds',
      'Each enzyme works on one type of food and at a particular pH',
      'Absorption happens mainly in the small intestine, which is adapted with villi',
      'The liver assimilates absorbed nutrients and regulates blood glucose',
    ],
    subtopics: [
      {
        name: 'The alimentary canal',
        points: [
          'Mouth: teeth chew; salivary amylase begins starch digestion at about pH 7',
          'Stomach: hydrochloric acid gives about pH 2, kills bacteria and activates pepsin, which digests protein',
          'Small intestine: bile emulsifies fats; pancreatic and intestinal enzymes complete digestion at about pH 8',
          'Large intestine: water and mineral salts are absorbed; remaining material is egested',
        ],
      },
      {
        name: 'Enzymes and their products',
        points: [
          'Amylase: starch to maltose',
          'Pepsin and trypsin: proteins to peptides; peptidase: peptides to amino acids',
          'Lipase: lipids to fatty acids and glycerol',
          'Maltase: maltose to glucose',
        ],
      },
      {
        name: 'Absorption and assimilation',
        points: [
          'Villi and microvilli give a very large surface area; each villus is one cell thick with a rich blood supply and a lacteal',
          'Glucose and amino acids pass into the blood capillaries; fatty acids and glycerol pass into the lacteal',
          'The hepatic portal vein carries absorbed nutrients to the liver, which stores excess glucose as glycogen',
        ],
      },
    ],
    commonMistakes: [
      'Bile is not an enzyme: it emulsifies fat into small droplets to increase surface area for lipase',
      'Pepsin needs acid conditions; it would be denatured at the pH of the small intestine',
      'Absorption is the passage of digested food into the blood; assimilation is its use by the body cells',
    ],
    example: {
      problem: 'Explain why a person whose gall bladder has been removed is advised to eat a low-fat diet.',
      steps: [
        'The gall bladder stores bile, which is made in the liver.',
        'Bile emulsifies fats, breaking large fat droplets into many small ones and greatly increasing the surface area for lipase.',
        'Without stored bile, less is available at once when a fatty meal arrives.',
        'Fat digestion is therefore slower and less complete, so a low-fat diet avoids discomfort and poor absorption.',
      ],
      answer: 'Without stored bile there is less emulsification of fat, so lipase works more slowly and fat is poorly digested.',
    },
    moreExamples: [
      {
        problem: 'Describe THREE ways in which the small intestine is adapted for absorption.',
        steps: [
          'It is very long, giving a large area and a long time for absorption to occur.',
          'Its inner surface is folded into villi, each covered in microvilli, which multiplies the surface area many times.',
          'Each villus wall is only one cell thick, giving a short diffusion distance.',
          'Each villus has a dense capillary network and a lacteal, which carry absorbed products away and keep the concentration gradient steep.',
        ],
        answer: 'A long length, a surface folded into villi and microvilli, a wall one cell thick, and a rich blood and lymph supply.',
      },
    ],
  },
  {
    topicId: 'life-sci-respiration',
    summary: 'How cells release energy from glucose, the difference between aerobic and anaerobic pathways, and how respiration compares with photosynthesis.',
    keyIdeas: [
      'Respiration releases energy from glucose and stores it as ATP',
      'Aerobic respiration needs oxygen and releases about 38 ATP per glucose molecule',
      'Anaerobic respiration occurs without oxygen and releases only 2 ATP per glucose molecule',
      'Glycolysis happens in the cytoplasm; the Krebs cycle and oxidative phosphorylation happen in the mitochondrion',
      'Respiration happens in every living cell, all the time, in plants as well as animals',
    ],
    subtopics: [
      {
        name: 'Aerobic respiration',
        points: [
          'Glycolysis in the cytoplasm splits glucose into two pyruvic acid molecules, releasing 2 ATP',
          'Pyruvic acid enters the mitochondrion, where the Krebs cycle releases carbon dioxide and hydrogen',
          'Hydrogen passes along the electron transport chain; oxygen is the final hydrogen acceptor, forming water',
          'Total yield is about 38 ATP per glucose molecule',
        ],
      },
      {
        name: 'Anaerobic respiration',
        points: [
          'In muscle cells: glucose to lactic acid, releasing 2 ATP; lactic acid build-up causes muscle fatigue and oxygen debt',
          'In yeast: glucose to ethanol and carbon dioxide, which is the basis of brewing and baking',
          'Far less energy is released because the glucose is only partly broken down',
        ],
      },
      {
        name: 'Comparison with photosynthesis',
        points: [
          'Photosynthesis stores energy and builds glucose; respiration releases energy and breaks glucose down',
          'Photosynthesis uses carbon dioxide and water and produces oxygen; respiration does the reverse',
          'Photosynthesis occurs only in light and only in cells with chloroplasts; respiration occurs in all living cells at all times',
        ],
      },
    ],
    formulae: [
      'Aerobic: C6H12O6 + 6O2 gives 6CO2 + 6H2O + energy (about 38 ATP)',
      'Anaerobic in muscle: C6H12O6 gives 2 lactic acid + energy (2 ATP)',
      'Anaerobic in yeast: C6H12O6 gives 2 ethanol + 2CO2 + energy (2 ATP)',
    ],
    commonMistakes: [
      'Plants respire all the time, including in daylight; they do not only photosynthesise',
      'Breathing is the movement of air; respiration is the chemical release of energy inside cells',
      'Anaerobic respiration is not more efficient or faster at making ATP overall; it simply works without oxygen',
    ],
    example: {
      problem: 'Explain why a sprinter continues to breathe deeply for several minutes after finishing a 100 m race.',
      steps: [
        'During the sprint the muscles use oxygen faster than the blood can supply it.',
        'The muscles then respire anaerobically, producing lactic acid and building an oxygen debt.',
        'After the race the extra oxygen taken in is used to break the accumulated lactic acid down.',
        'Deep breathing continues until that oxygen debt has been repaid.',
      ],
      answer: 'To repay the oxygen debt, supplying the oxygen needed to break down the lactic acid built up during anaerobic respiration.',
    },
    moreExamples: [
      {
        problem: 'Aerobic respiration yields about 38 ATP per glucose molecule while anaerobic respiration yields 2. Explain this difference.',
        steps: [
          'In anaerobic respiration glucose is only partly broken down, to lactic acid or to ethanol.',
          'These products still contain a large amount of unreleased chemical energy.',
          'In aerobic respiration the glucose is broken down completely to carbon dioxide and water.',
          'Oxygen acts as the final hydrogen acceptor, allowing the electron transport chain to run and release far more ATP.',
        ],
        answer: 'Anaerobic respiration breaks glucose down only partly, so most of the energy stays locked in lactic acid or ethanol.',
      },
    ],
  },
  {
    topicId: 'life-sci-gaseous-exchange',
    summary: 'The properties every gaseous exchange surface shares, the structure of the human breathing system, and how breathing is controlled.',
    keyIdeas: [
      'Gaseous exchange surfaces are thin, moist, permeable, have a large surface area and a good transport system',
      'Ventilation is the mechanical movement of air; gaseous exchange is the diffusion of gases across a surface',
      'Diffusion is passive and driven by a concentration gradient',
      'Inhalation is active: the diaphragm contracts and flattens, and the ribs move up and out',
      'Exhalation at rest is passive: the muscles relax and the elastic lungs recoil',
    ],
    subtopics: [
      {
        name: 'Requirements of a gas exchange surface',
        points: [
          'Large surface area: about 300 million alveoli in human lungs',
          'Thin: alveolus wall and capillary wall are each one cell thick',
          'Moist: gases must dissolve before they can diffuse',
          'Permeable and well supplied with blood, to maintain a steep concentration gradient',
        ],
      },
      {
        name: 'Human breathing system',
        points: [
          'Air passes nose, pharynx, larynx, trachea, bronchi, bronchioles, alveoli',
          'Cartilage rings hold the trachea open; cilia and mucus trap and sweep out dust and bacteria',
          'The pleural membranes and fluid reduce friction as the lungs move',
        ],
      },
      {
        name: 'Mechanism and control',
        points: [
          'Inhalation: diaphragm contracts and flattens, ribs move up and out, thoracic volume increases, pressure drops, air enters',
          'Exhalation: muscles relax, volume decreases, pressure rises, air leaves',
          'Breathing rate is controlled by the medulla oblongata, which responds mainly to rising carbon dioxide in the blood',
        ],
      },
    ],
    commonMistakes: [
      'The diaphragm flattens when it contracts; it does not dome upwards during inhalation',
      'The main stimulus for faster breathing is a rise in carbon dioxide, not a fall in oxygen',
      'Air moves because of a pressure difference created by volume change, not because the lungs pull it in',
    ],
    example: {
      problem: 'Explain why the alveoli of the lungs are surrounded by a dense network of capillaries.',
      steps: [
        'Gases diffuse across the alveolus wall down a concentration gradient.',
        'Blood arriving in the capillaries is low in oxygen and high in carbon dioxide.',
        'Continuous blood flow carries oxygen away as soon as it diffuses in and brings fresh carbon dioxide.',
        'This keeps the concentration gradient steep, so diffusion continues rapidly in both directions.',
      ],
      answer: 'The flowing blood keeps the concentration gradients steep, so oxygen and carbon dioxide continue to diffuse rapidly.',
    },
    moreExamples: [
      {
        problem: 'Describe what happens in the thoracic cavity during inhalation, and explain why air moves into the lungs.',
        steps: [
          'The diaphragm contracts and flattens, moving downwards.',
          'The external intercostal muscles contract, lifting the ribs upwards and outwards.',
          'These movements increase the volume of the thoracic cavity.',
          'An increase in volume lowers the air pressure inside the lungs below atmospheric pressure, so air flows in down the pressure gradient.',
        ],
        answer: 'The diaphragm flattens and the ribs lift, increasing thoracic volume and lowering the internal pressure, so air flows in.',
      },
    ],
  },
  {
    topicId: 'life-sci-excretion',
    summary: 'How the body removes metabolic wastes, the structure of the kidney and nephron, the formation of urine, and homeostatic control of water and salts.',
    keyIdeas: [
      'Excretion is the removal of wastes made by the body itself; egestion is the removal of undigested food',
      'The kidneys excrete urea, excess water and excess salts',
      'The nephron is the functional unit of the kidney: filtration, reabsorption, then secretion',
      'Osmoregulation keeps the water and salt content of the blood constant',
      'ADH from the pituitary controls how much water is reabsorbed',
    ],
    subtopics: [
      {
        name: 'Excretory organs',
        points: [
          'Kidneys: urea, excess water, excess salts',
          'Lungs: carbon dioxide and some water vapour',
          'Skin: water, salts and a little urea in sweat',
          'Liver: makes urea from excess amino acids by deamination',
        ],
      },
      {
        name: 'The nephron',
        points: [
          'Ultrafiltration in the glomerulus and Bowmans capsule: high pressure forces water, glucose, salts and urea out; proteins and blood cells stay behind',
          'Selective reabsorption in the proximal tubule: all glucose, most water and useful salts return to the blood',
          'The loop of Henle concentrates the salt in the medulla, allowing water to be reabsorbed from the collecting duct',
          'Remaining fluid is urine: water, urea and excess salts',
        ],
      },
      {
        name: 'Homeostasis',
        points: [
          'Low blood water: the pituitary releases more ADH, the collecting duct becomes more permeable, more water is reabsorbed, and a small volume of concentrated urine is produced',
          'High blood water: less ADH is released, less water is reabsorbed, and a large volume of dilute urine is produced',
          'Kidney failure is treated by dialysis or by transplant',
        ],
      },
    ],
    commonMistakes: [
      'Glucose in the urine is abnormal: a healthy nephron reabsorbs all of it, so its presence suggests diabetes',
      'Proteins and blood cells are too large to be filtered, so finding them in urine indicates damage to the filter',
      'ADH increases water reabsorption, so more ADH means less urine, not more',
    ],
    example: {
      problem: 'A person drinks two litres of water quickly. Describe how the body responds to restore the normal water balance.',
      steps: [
        'The water content of the blood rises, so the blood becomes more dilute.',
        'Receptors in the hypothalamus detect this, and the pituitary releases less ADH.',
        'With less ADH, the walls of the collecting ducts become less permeable to water.',
        'Less water is reabsorbed into the blood, so a large volume of dilute urine is produced and the blood water level returns to normal.',
      ],
      answer: 'Less ADH is released, so less water is reabsorbed and a large volume of dilute urine is produced.',
    },
    moreExamples: [
      {
        problem: 'Explain why glucose is present in the glomerular filtrate but absent from the urine of a healthy person.',
        steps: [
          'Glucose molecules are small enough to pass through the filter during ultrafiltration, so they enter the filtrate.',
          'Glucose is a valuable respiratory substrate and must not be lost.',
          'In the proximal convoluted tubule all the glucose is reabsorbed into the blood by active transport.',
          'Since reabsorption is complete, no glucose remains by the time the fluid reaches the collecting duct.',
        ],
        answer: 'It is small enough to be filtered, but all of it is then reabsorbed by active transport in the proximal tubule.',
      },
    ],
  },
  {
    topicId: 'life-sci-biodiversity-microorganisms',
    summary: 'How living things are classified, the five kingdoms, the main groups of micro-organisms, and their useful and harmful roles.',
    keyIdeas: [
      'Classification groups organisms by shared features, from kingdom down to species',
      'The five-kingdom system is Monera, Protista, Fungi, Plantae and Animalia',
      'Binomial nomenclature gives every species a two-part Latin name: genus then species',
      'Viruses are not placed in any kingdom because they are not cellular and cannot reproduce on their own',
      'Micro-organisms are both essential (decomposition, medicine, food) and harmful (disease)',
    ],
    subtopics: [
      {
        name: 'Classification',
        points: [
          'Hierarchy: kingdom, phylum, class, order, family, genus, species',
          'The genus name is capitalised and the species name is not; both are italicised or underlined',
          'A species is a group whose members can interbreed to produce fertile offspring',
        ],
      },
      {
        name: 'The main groups',
        points: [
          'Monera (bacteria): prokaryotic, no true nucleus, no membrane-bound organelles',
          'Protista: eukaryotic and mostly unicellular, such as Amoeba and Plasmodium',
          'Fungi: eukaryotic, cell walls of chitin, absorb food after digesting it externally, so they are heterotrophic',
          'Viruses: protein coat around nucleic acid; only reproduce inside a host cell',
        ],
      },
      {
        name: 'Roles of micro-organisms',
        points: [
          'Useful: decomposition and nutrient cycling, antibiotic production, baking and brewing, yoghurt and cheese, nitrogen fixation',
          'Harmful: bacterial diseases such as tuberculosis and cholera, viral diseases such as HIV and influenza, fungal diseases such as ringworm',
          'Antibiotics kill bacteria but have no effect on viruses',
        ],
      },
    ],
    commonMistakes: [
      'Antibiotics do not work against viruses, because viruses have no cell structure for the antibiotic to attack',
      'Fungi are not plants: they have no chlorophyll and cannot photosynthesise, so they are heterotrophic',
      'Bacteria are prokaryotic and have no nucleus; protists are eukaryotic and do',
    ],
    example: {
      problem: 'Explain why fungi are classified in their own separate kingdom, rather than being grouped with plants.',
      steps: [
        'Fungi have no chlorophyll, so they cannot photosynthesise and are heterotrophic, whereas plants are autotrophic.',
        'Fungal cell walls are made of chitin, while plant cell walls are made of cellulose.',
        'Fungi feed by secreting enzymes onto food and absorbing the digested products, which no plant does.',
        'These fundamental differences in nutrition and cell structure justify a separate kingdom.',
      ],
      answer: 'Because they lack chlorophyll and feed heterotrophically by external digestion, and their cell walls are chitin rather than cellulose.',
    },
    moreExamples: [
      {
        problem: 'A doctor refuses to prescribe antibiotics for a patient with influenza. Explain the reasoning.',
        steps: [
          'Influenza is caused by a virus, not by a bacterium.',
          'Antibiotics work by attacking structures found in bacterial cells, such as the cell wall or bacterial ribosomes.',
          'A virus has no such structures: it is only nucleic acid inside a protein coat and reproduces inside the patients own cells.',
          'The antibiotic would therefore have no effect, and unnecessary use encourages antibiotic resistance in other bacteria.',
        ],
        answer: 'Influenza is viral, and antibiotics attack bacterial structures that viruses do not have; needless use also promotes resistance.',
      },
    ],
  },
  {
    topicId: 'life-sci-biodiversity-plants',
    summary: 'The four main plant groups and how each is adapted to life on land, together with the reproductive strategies that allowed plants to colonise dry habitats.',
    keyIdeas: [
      'The four groups are bryophytes, pteridophytes, gymnosperms and angiosperms',
      'Moving from water to land required support, transport tissue, protection against drying out, and reproduction without free water',
      'Bryophytes and pteridophytes still need water for the sperm to swim to the egg',
      'Seeds and pollen freed gymnosperms and angiosperms from that dependence',
      'Angiosperms are the most successful and diverse group of plants',
    ],
    subtopics: [
      {
        name: 'The four groups',
        points: [
          'Bryophytes (mosses): no true roots, stems or leaves, no vascular tissue, small and confined to damp places',
          'Pteridophytes (ferns): true roots, stems and leaves with vascular tissue, reproduce by spores, still need water for fertilisation',
          'Gymnosperms (conifers): seeds borne naked on cones, pollen carried by wind, needle-like leaves reduce water loss',
          'Angiosperms (flowering plants): seeds enclosed in a fruit, flowers attract pollinators, most diverse group',
        ],
      },
      {
        name: 'Adaptations to land',
        points: [
          'Waxy cuticle and stomata reduce water loss while allowing gas exchange',
          'Vascular tissue transports water upwards and food throughout, and lignin gives support',
          'Roots anchor the plant and absorb water',
          'Pollen replaces swimming sperm, and seeds protect and feed the embryo',
        ],
      },
      {
        name: 'Reproduction in angiosperms',
        points: [
          'Pollination is the transfer of pollen from anther to stigma; fertilisation is the fusion of gametes',
          'Insect-pollinated flowers are large, coloured and scented with nectar; wind-pollinated flowers are small, dull, with feathery stigmas and exposed anthers',
          'After fertilisation the ovule becomes the seed and the ovary becomes the fruit',
        ],
      },
    ],
    commonMistakes: [
      'Pollination and fertilisation are different events: pollination is transfer, fertilisation is fusion of nuclei',
      'Ferns have vascular tissue; mosses do not, which is why mosses stay small',
      'A seed is not the same as a fruit: the ovule forms the seed and the ovary forms the fruit',
    ],
    example: {
      problem: 'Explain why mosses are restricted to damp, shaded habitats while conifers are not.',
      steps: [
        'Mosses have no vascular tissue, so water can only travel a short distance through the plant by diffusion and osmosis.',
        'They also have no true roots and only a thin cuticle, so they lose water easily.',
        'Their male gametes must swim through a film of water to reach the egg, so fertilisation cannot occur when it is dry.',
        'Conifers have vascular tissue, a thick cuticle on needle leaves, roots, and wind-borne pollen, so none of these limits apply.',
      ],
      answer: 'Mosses lack vascular tissue and need free water for fertilisation, while conifers have vascular tissue, water-conserving leaves and wind-borne pollen.',
    },
    moreExamples: [
      {
        problem: 'A flower is small, green, has no scent, hangs outside the leaves and has a large feathery stigma. Deduce its method of pollination and justify your answer.',
        steps: [
          'Bright colour, scent and nectar attract insects; this flower has none of these.',
          'Hanging outside the foliage exposes the anthers to moving air.',
          'A large feathery stigma presents a wide surface for catching pollen grains carried at random in the air.',
          'These features together are adaptations for wind pollination.',
        ],
        answer: 'Wind pollination, shown by the absence of colour and scent, the exposed anthers and the large feathery stigma.',
      },
    ],
  },
  {
    topicId: 'life-sci-biodiversity-animals',
    summary: 'The main animal phyla, the features used to classify them, and how body plan relates to the way an animal lives.',
    keyIdeas: [
      'Animals are classified by symmetry, body cavity, number of body layers and segmentation',
      'Radial symmetry suits sessile or drifting animals; bilateral symmetry suits animals that move forwards',
      'Cephalisation, the concentration of sense organs at the head end, accompanies bilateral symmetry',
      'Vertebrates are chordates with a backbone; invertebrates have none',
      'An exoskeleton protects and supports but must be shed for the animal to grow',
    ],
    subtopics: [
      {
        name: 'Invertebrate phyla',
        points: [
          'Porifera (sponges): no true tissues, no symmetry, filter feeders',
          'Cnidaria (jellyfish, sea anemones): radial symmetry, stinging cells, one body opening',
          'Platyhelminthes (flatworms): bilateral, flattened, no body cavity',
          'Annelida (earthworms): segmented, true body cavity',
          'Mollusca (snails, octopus): soft body, muscular foot, usually a shell',
          'Arthropoda (insects, spiders, crabs): jointed legs, exoskeleton of chitin, segmented body',
        ],
      },
      {
        name: 'Chordates',
        points: [
          'Fish: gills, scales, external fertilisation',
          'Amphibians: moist skin, larval stage in water',
          'Reptiles: dry scaly skin, amniotic eggs with leathery shells',
          'Birds: feathers, hollow bones, endothermic',
          'Mammals: hair, mammary glands, endothermic',
        ],
      },
      {
        name: 'Structure and lifestyle',
        points: [
          'Birds are adapted for flight by hollow bones, feathers, a keeled sternum for flight muscles and forelimbs modified as wings',
          'An exoskeleton limits size and requires moulting, during which the animal is vulnerable',
          'Radial symmetry allows an animal to meet food or danger from any direction equally well',
        ],
      },
    ],
    commonMistakes: [
      'Insects are arthropods, not a separate phylum; spiders and crabs are arthropods too',
      'Not all invertebrates are small or simple: the octopus is a mollusc with complex behaviour',
      'Amphibians are not reptiles: their skin is moist and their eggs have no shell',
    ],
    example: {
      problem: 'Describe THREE structural adaptations of a bird that suit it to a flying lifestyle.',
      steps: [
        'The bones are hollow, which reduces the mass that has to be lifted.',
        'The forelimbs are modified into wings, and feathers give a large, light surface for generating lift.',
        'The sternum has a deep keel, providing a large area for the attachment of powerful flight muscles.',
        'Together these reduce weight and increase the power available for flight.',
      ],
      answer: 'Hollow bones to reduce mass, wings with feathers to generate lift, and a keeled sternum anchoring large flight muscles.',
    },
    moreExamples: [
      {
        problem: 'Explain why an insect must moult in order to grow, and state ONE disadvantage of this.',
        steps: [
          'An insect is enclosed in a rigid exoskeleton made of chitin, which cannot stretch.',
          'To increase in size the insect must shed the old exoskeleton and expand before the new one hardens.',
          'While the new exoskeleton is still soft the insect has little protection and little support.',
          'It is therefore vulnerable to predators and to drying out during this period.',
        ],
        answer: 'The rigid exoskeleton cannot grow, so it must be shed; while the new one hardens the insect is soft and vulnerable to predators.',
      },
    ],
  },
  {
    topicId: 'life-sci-population-ecology',
    summary: 'How populations grow, what limits them, how ecologists estimate their size, and the ways species interact within a community.',
    keyIdeas: [
      'A population is all the members of one species living in the same area at the same time',
      'Population size changes through births, deaths, immigration and emigration',
      'Exponential growth cannot continue: limiting factors bring the population towards the carrying capacity',
      'Density-dependent factors act more strongly as the population becomes crowded',
      'Carrying capacity is the maximum population an environment can support indefinitely',
    ],
    subtopics: [
      {
        name: 'Growth curves',
        points: [
          'The J-curve shows unlimited exponential growth, which is only ever temporary',
          'The S-curve (sigmoid) shows a lag phase, an exponential phase, then levelling off at the carrying capacity',
          'A population can overshoot the carrying capacity and then crash',
        ],
      },
      {
        name: 'Limiting factors',
        points: [
          'Density-dependent: competition for food, water and space, predation, disease and parasitism',
          'Density-independent: fire, flood, drought and extreme cold affect the same proportion whatever the density',
          'Density-dependent factors are what actually hold a population near its carrying capacity',
        ],
      },
      {
        name: 'Sampling and interactions',
        points: [
          'Quadrats estimate the density of plants and slow-moving animals',
          'Mark-recapture estimates mobile animals: population = (first catch x second catch) / number recaptured',
          'Predation, competition, parasitism, mutualism and commensalism describe how species affect each other',
        ],
      },
    ],
    formulae: [
      'Population density = number of individuals / area',
      'Mark-recapture estimate = (number marked in first sample x total in second sample) / number of marked individuals recaptured',
    ],
    commonMistakes: [
      'Drought and fire are density-independent: they do not hit harder simply because the population is crowded',
      'Carrying capacity is a property of the environment, not of the species',
      'A population at carrying capacity is not static; births and deaths continue and roughly balance',
    ],
    example: {
      problem: 'Ecologists catch and mark 40 fish, release them, and later catch 50 fish of which 8 are marked. Estimate the population.',
      steps: [
        'Use the mark-recapture formula: population = (first catch x second catch) / number recaptured.',
        'Substitute the values: (40 x 50) / 8.',
        'Work out the numerator: 40 x 50 = 2 000.',
        'Divide: 2 000 / 8 = 250.',
      ],
      answer: 'About 250 fish',
    },
    moreExamples: [
      {
        problem: 'Explain what is meant by a density-dependent limiting factor, giving TWO examples other than food supply.',
        steps: [
          'A density-dependent factor is one whose effect becomes stronger as the number of individuals per unit area increases.',
          'Disease spreads more readily when individuals are crowded together, so a larger proportion is affected in a dense population.',
          'Predators are attracted to and find prey more easily where prey is abundant, so predation pressure rises with density.',
          'Such factors therefore act to slow growth as a population approaches its carrying capacity.',
        ],
        answer: 'A factor whose effect intensifies as population density rises; for example disease and predation.',
      },
    ],
  },
  {
    topicId: 'life-sci-human-impact',
    summary: 'How human activity affects the atmosphere, water, soil and biodiversity, and what can be done to reduce the damage.',
    keyIdeas: [
      'Human population growth raises demand for food, water, energy and space',
      'Burning fossil fuels raises atmospheric carbon dioxide and strengthens the greenhouse effect',
      'Loss of habitat is the largest single cause of falling biodiversity',
      'Water is a limited resource in South Africa, and its quality as well as its quantity matters',
      'Sustainable use means meeting present needs without preventing future generations from meeting theirs',
    ],
    subtopics: [
      {
        name: 'Atmosphere',
        points: [
          'Greenhouse gases (carbon dioxide, methane) trap outgoing heat, raising global temperatures',
          'Consequences include melting ice, rising sea level, shifting rainfall and more extreme weather',
          'Ozone depletion by CFCs lets through more ultraviolet radiation, raising skin cancer risk',
          'Acid rain from sulfur dioxide and nitrogen oxides damages forests, soils and buildings',
        ],
      },
      {
        name: 'Water and soil',
        points: [
          'Eutrophication: fertiliser runoff causes algal blooms, oxygen depletion and fish deaths',
          'Water quality is threatened by sewage, industrial effluent and acid mine drainage',
          'Soil erosion follows the removal of vegetation; overgrazing and monoculture reduce fertility',
          'Desertification turns productive land into desert, often after overgrazing in dry areas',
        ],
      },
      {
        name: 'Biodiversity and solutions',
        points: [
          'Threats: habitat destruction, poaching, alien invasive species, pollution and climate change',
          'Alien invasive plants such as black wattle use far more water than indigenous species',
          'Solutions: protected areas, recycling, renewable energy, alien clearing programmes such as Working for Water, and legislation',
        ],
      },
    ],
    commonMistakes: [
      'The greenhouse effect is natural and necessary; the problem is its strengthening by extra greenhouse gases',
      'Ozone depletion and global warming are different problems with different causes',
      'Alien species are only invasive when they spread and outcompete indigenous species',
    ],
    example: {
      problem: 'Explain why clearing alien invasive trees such as black wattle from a river catchment increases the amount of water in the river.',
      steps: [
        'Alien invasive trees such as black wattle grow densely and have deep root systems.',
        'They take up and transpire far more water than the indigenous vegetation they replace.',
        'Water transpired into the air is water that never reaches the river.',
        'Removing them therefore leaves more groundwater and run-off to feed the river.',
      ],
      answer: 'They transpire much more water than indigenous plants, so removing them leaves more water to reach the river.',
    },
    moreExamples: [
      {
        problem: 'A community is deciding whether to allow a coal-fired power station nearby. Give ONE argument in favour and ONE against, and state what additional information would help them decide.',
        steps: [
          'In favour: the station would supply electricity and create jobs in the area, which supports local livelihoods.',
          'Against: burning coal releases carbon dioxide, which strengthens the greenhouse effect, and sulfur dioxide, which causes acid rain and respiratory illness.',
          'Useful additional information would include the emissions the station is expected to produce and what controls are planned.',
          'Also useful would be the number of local jobs, and whether a renewable alternative could supply the same electricity.',
        ],
        answer: 'In favour: electricity supply and local jobs. Against: carbon dioxide and sulfur dioxide emissions. They would need the projected emissions, the planned controls, the real number of local jobs, and the renewable alternatives.',
      },
    ],
  },
  {
    topicId: 'life-sci-reproduction-vertebrates',
    summary: 'The reproductive strategies of vertebrates, the trade-off between the number of offspring and the care given to each, and how they relate to the habitat.',
    keyIdeas: [
      'External fertilisation happens outside the body and needs water; internal fertilisation happens inside the female',
      'Ovipary lays eggs, ovovivipary retains eggs inside the mother until they hatch, and vivipary gives birth to live young',
      'Species producing many offspring usually give little parental care; species producing few usually give much',
      'An amniotic egg, with its shell and membranes, freed reptiles and birds from breeding in water',
      'Precocial young are mobile soon after birth; altricial young are helpless and need extended care',
    ],
    subtopics: [
      {
        name: 'Fertilisation',
        points: [
          'External: large numbers of gametes released into water, low chance of each being fertilised, as in most fish and amphibians',
          'Internal: fewer gametes, much higher chance of fertilisation, and it works on dry land',
          'Internal fertilisation is a prerequisite for ovovivipary and vivipary',
        ],
      },
      {
        name: 'Development of the embryo',
        points: [
          'Ovipary: eggs laid and developed outside the mother, nourished by yolk, as in birds and most reptiles',
          'Ovovivipary: eggs kept inside the mother and nourished by yolk, hatching internally, as in some sharks',
          'Vivipary: embryo nourished directly by the mother through a placenta, as in mammals',
        ],
      },
      {
        name: 'Parental care and amniotic eggs',
        points: [
          'Many offspring plus little care, as in fish, balances a high mortality rate',
          'Few offspring plus much care, as in mammals, raises the survival rate of each',
          'Amniotic egg membranes: amnion cushions the embryo, allantois stores waste and exchanges gases, chorion surrounds everything, yolk sac feeds the embryo',
          'The shell prevents desiccation, which is what allowed full colonisation of land',
        ],
      },
    ],
    commonMistakes: [
      'Ovovivipary and vivipary both produce live young, but only in vivipary does the mother nourish the embryo directly',
      'External fertilisation is not the same as ovipary: a bird uses internal fertilisation and still lays eggs',
      'Producing many offspring is not a poorer strategy; it is a different one, matched to the level of care given',
    ],
    example: {
      problem: 'A fish releases 2 million eggs into the water and gives no parental care, while an elephant produces one calf every four years and cares for it for years. Explain how both strategies can be successful.',
      steps: [
        'The fish uses external fertilisation, so many gametes are lost and most eggs are never fertilised or are eaten.',
        'Producing enormous numbers means that even a very small percentage surviving is enough to replace the parents.',
        'The elephant uses internal fertilisation and vivipary, so almost every embryo is fertilised and protected.',
        'Prolonged parental care means a very high proportion of the few calves born reach adulthood, which replaces the parents just as effectively.',
      ],
      answer: 'Both replace their parents: the fish through vast numbers offsetting heavy losses, the elephant through very high survival of very few offspring.',
    },
    moreExamples: [
      {
        problem: 'Explain how the amniotic egg allowed reptiles to colonise dry land fully, when amphibians could not.',
        steps: [
          'Amphibian eggs have no shell and dry out quickly, so they must be laid in water.',
          'The amniotic egg has a leathery or hard shell that prevents desiccation while still allowing gases through.',
          'Inside, the amnion holds fluid that cushions the embryo, providing the watery environment development needs.',
          'The yolk sac supplies food and the allantois stores waste, so the egg is a self-contained system that can be laid anywhere.',
        ],
        answer: 'Its shell prevents drying out and the amnion supplies the fluid environment the embryo needs, so the egg no longer has to be laid in water.',
      },
    ],
  },
  {
    topicId: 'life-sci-human-reproduction',
    summary: 'The human reproductive organs, gametogenesis, the menstrual cycle and its hormones, fertilisation, and development in the uterus.',
    keyIdeas: [
      'Gametogenesis uses meiosis, so gametes are haploid and genetically varied',
      'The menstrual cycle averages 28 days and is controlled by FSH, LH, oestrogen and progesterone',
      'Ovulation occurs at about day 14, triggered by a surge in LH',
      'Fertilisation normally occurs in the fallopian tube; implantation occurs in the uterus lining about a week later',
      'The placenta supplies the foetus with oxygen and nutrients and removes its wastes, without the two bloodstreams mixing',
    ],
    subtopics: [
      {
        name: 'Gametogenesis',
        points: [
          'Spermatogenesis in the seminiferous tubules of the testes produces four sperm from each parent cell, continuously from puberty',
          'Oogenesis in the ovaries produces one ovum plus polar bodies, and begins before birth',
          'Seminal vesicles and prostate add fluid that nourishes sperm and neutralises vaginal acidity',
          'The testes lie outside the body because sperm production needs a temperature slightly below body temperature',
        ],
      },
      {
        name: 'The menstrual cycle',
        points: [
          'Days 1 to 5, menstruation: the uterus lining is shed because progesterone has fallen',
          'Follicular phase: FSH from the pituitary stimulates a follicle to develop, which secretes oestrogen; oestrogen rebuilds the uterus lining',
          'Day 14, ovulation: a surge of LH releases the ovum from the follicle',
          'Luteal phase: LH turns the follicle into the corpus luteum, which secretes progesterone to maintain the lining; if no fertilisation occurs it degenerates and the cycle restarts',
        ],
      },
      {
        name: 'Fertilisation and development',
        points: [
          'Fertilisation in the fallopian tube produces a diploid zygote',
          'The zygote divides by mitosis to a morula, then a blastocyst, which implants in the endometrium',
          'The placenta allows exchange of oxygen, nutrients, carbon dioxide and urea by diffusion; the two bloodstreams stay separate',
          'The umbilical cord carries two arteries and one vein between foetus and placenta; the amnion protects the foetus in amniotic fluid',
        ],
      },
    ],
    formulae: [
      'FSH stimulates follicle development and oestrogen secretion',
      'LH triggers ovulation and forms the corpus luteum',
      'Oestrogen rebuilds the endometrium; progesterone maintains it',
    ],
    commonMistakes: [
      'Maternal and foetal blood do not mix in the placenta; substances cross by diffusion across a barrier',
      'Ovulation is caused by the LH surge, not by FSH',
      'The corpus luteum forms from the follicle after ovulation, so it cannot secrete progesterone before then',
    ],
    example: {
      problem: 'Explain why menstruation occurs if the ovum is not fertilised.',
      steps: [
        'After ovulation the follicle becomes the corpus luteum, which secretes progesterone.',
        'Progesterone maintains the thickened endometrium in readiness for implantation.',
        'If no fertilisation and implantation occur, the corpus luteum degenerates after about ten days.',
        'Progesterone levels then fall sharply, the lining can no longer be maintained, and it breaks down and is shed as menstruation.',
      ],
      answer: 'The corpus luteum degenerates, progesterone falls, and the endometrium can no longer be maintained, so it is shed.',
    },
    moreExamples: [
      {
        problem: 'Describe the structure and function of the placenta.',
        steps: [
          'The placenta is a disc-shaped organ attached to the uterus wall, with finger-like villi that project into maternal blood spaces.',
          'The villi give a very large surface area, and the barrier between the two bloodstreams is extremely thin.',
          'Oxygen, glucose, amino acids, minerals and antibodies diffuse from mother to foetus.',
          'Carbon dioxide and urea diffuse from foetus to mother; the placenta also secretes progesterone to maintain the pregnancy.',
        ],
        answer: 'A villus-covered organ giving a large surface area and thin barrier, across which nutrients and oxygen pass to the foetus and wastes pass back, while also secreting progesterone.',
      },
    ],
  },
  {
    topicId: 'life-sci-response-humans',
    summary: 'How the human nervous system detects and responds to stimuli, the reflex arc, and the structure of the eye and the ear.',
    keyIdeas: [
      'The nervous system is the central nervous system (brain and spinal cord) plus the peripheral nervous system',
      'A reflex action is rapid and involuntary, and its pathway does not require the brain to initiate it',
      'A neuron carries an impulse one way: dendrites to cell body to axon',
      'The eye converts light into nerve impulses; the ear converts sound vibrations into nerve impulses',
      'Homeostatic responses are usually negative feedback: a change triggers the response that reverses it',
    ],
    subtopics: [
      {
        name: 'Nervous system and the reflex arc',
        points: [
          'Cerebrum controls thought and voluntary action; cerebellum controls balance and coordination; medulla oblongata controls heartbeat and breathing',
          'Reflex arc: receptor, sensory neuron, interneuron in the spinal cord, motor neuron, effector',
          'The impulse crosses a synapse by means of a neurotransmitter, which is why it travels one way only',
          'A reflex protects the body because it is completed before the brain has interpreted the stimulus',
        ],
      },
      {
        name: 'The eye',
        points: [
          'Cornea and lens refract light; the iris controls how much light enters through the pupil',
          'Accommodation: for a near object the ciliary muscles contract, the suspensory ligaments slacken and the lens becomes more convex',
          'Rods work in dim light and give black-and-white vision; cones need bright light and give colour vision and detail',
          'The fovea is packed with cones and gives the sharpest image; the blind spot has no receptors',
        ],
      },
      {
        name: 'The ear',
        points: [
          'Pinna collects sound; the tympanic membrane vibrates; the ossicles amplify the vibration and pass it to the oval window',
          'The cochlea converts vibrations into nerve impulses, carried by the auditory nerve to the temporal lobe',
          'The semicircular canals detect movement of the head and the vestibule detects position, giving balance',
          'The Eustachian tube equalises pressure on the two sides of the tympanic membrane',
        ],
      },
    ],
    commonMistakes: [
      'The lens becomes more convex for near vision, not flatter',
      'In a reflex the brain is informed afterwards; it does not initiate the response',
      'Balance is the job of the semicircular canals and vestibule, not the cochlea',
    ],
    example: {
      problem: 'Describe the pathway of the impulse when a person pulls their hand away from a hot surface.',
      steps: [
        'Heat receptors in the skin of the hand detect the stimulus and generate an impulse.',
        'A sensory neuron carries the impulse to the spinal cord.',
        'An interneuron inside the spinal cord passes the impulse straight to a motor neuron.',
        'The motor neuron carries it to the biceps muscle, the effector, which contracts and withdraws the hand; only afterwards does the brain register the pain.',
      ],
      answer: 'Receptor in the skin, sensory neuron, interneuron in the spinal cord, motor neuron, muscle (effector) which contracts to withdraw the hand.',
    },
    moreExamples: [
      {
        problem: 'A person walks from bright sunlight into a dark room and cannot see for a few moments. Explain why, and explain what then happens.',
        steps: [
          'In bright light the cones were active and the rod pigment rhodopsin had been bleached.',
          'In the dark there is too little light for the cones to work, and the rods cannot yet function without rhodopsin.',
          'The iris muscles then relax the circular muscles and contract the radial muscles, widening the pupil to let in more light.',
          'Rhodopsin is gradually regenerated in the rods, restoring dim-light vision over several minutes.',
        ],
        answer: 'The cones cannot work in dim light and the rod pigment has been bleached; the pupil then dilates and rhodopsin regenerates, restoring vision.',
      },
    ],
  },
  {
    topicId: 'life-sci-response-plants',
    summary: 'How plants respond to stimuli through growth, the role of auxins, and the tropisms that orient roots and shoots.',
    keyIdeas: [
      'A tropism is a growth response in which the direction is determined by the direction of the stimulus',
      'Positive tropism grows towards the stimulus; negative grows away from it',
      'Auxins are plant hormones produced at the shoot tip that stimulate cell elongation',
      'Auxin has opposite effects in shoots and roots: it promotes elongation in shoots and inhibits it in roots',
      'Plants respond by growing, so their responses are slower and usually permanent',
    ],
    subtopics: [
      {
        name: 'Types of tropism',
        points: [
          'Phototropism: response to light; shoots are positively phototropic, roots negatively so',
          'Geotropism (gravitropism): response to gravity; roots are positively geotropic, shoots negatively so',
          'Hydrotropism: roots grow towards water',
          'Thigmotropism: tendrils grow in response to touch, coiling around a support',
        ],
      },
      {
        name: 'Auxin action',
        points: [
          'Auxin is made at the shoot tip and moves down the shaded side of the stem',
          'In the shoot, the higher auxin concentration on the shaded side causes those cells to elongate more, so the shoot bends towards the light',
          'In the root, higher auxin on the lower side inhibits elongation there, so the upper side grows faster and the root bends downwards',
          'Removing the tip removes the auxin source and the response stops',
        ],
      },
      {
        name: 'Why tropisms matter',
        points: [
          'Shoots growing towards light maximise the light available for photosynthesis',
          'Roots growing downwards and towards water secure anchorage and water uptake',
          'Tendrils coiling around a support raise the leaves into the light without the cost of a thick stem',
        ],
      },
    ],
    commonMistakes: [
      'The shoot bends because the shaded side grows faster, not because the lit side shrinks',
      'Auxin inhibits elongation in roots and promotes it in shoots; the same hormone gives opposite results',
      'A tropism is a directional growth response, unlike a nastic response, where direction does not depend on the stimulus',
    ],
    example: {
      problem: 'A potted plant on a windowsill bends towards the window. Explain this response in terms of auxins.',
      steps: [
        'Auxin is produced at the shoot tip and is distributed away from the light.',
        'More auxin therefore accumulates on the shaded side of the stem than on the lit side.',
        'Auxin stimulates cell elongation in shoots, so the cells on the shaded side grow longer than those on the lit side.',
        'Unequal elongation makes the shoot curve towards the light, which is positive phototropism.',
      ],
      answer: 'Auxin accumulates on the shaded side and stimulates the cells there to elongate more, so the shoot curves towards the light.',
    },
    moreExamples: [
      {
        problem: 'A seed germinates on its side underground. Explain how the root and the shoot each end up growing in the correct direction.',
        steps: [
          'Gravity causes auxin to accumulate on the lower side of both the root and the shoot.',
          'In the shoot, auxin promotes elongation, so the lower side grows faster and the shoot curves upwards: negative geotropism.',
          'In the root, auxin inhibits elongation, so the lower side grows more slowly than the upper side and the root curves downwards: positive geotropism.',
          'The shoot therefore reaches the light and the root reaches water and anchorage, whichever way the seed happened to land.',
        ],
        answer: 'Auxin gathers on the lower side of both; it promotes elongation in the shoot so it bends up, and inhibits it in the root so it bends down.',
      },
    ],
  },
  {
    topicId: 'life-sci-endocrine-homeostasis',
    summary: 'The endocrine glands and their hormones, and how negative feedback keeps blood glucose, water and temperature within narrow limits.',
    keyIdeas: [
      'A hormone is a chemical messenger secreted by an endocrine gland directly into the blood',
      'Hormones act on specific target organs and their effects are slower but longer lasting than nerve impulses',
      'Homeostasis is the maintenance of a constant internal environment despite external change',
      'Negative feedback reverses a change: a rise triggers the response that lowers it',
      'The hypothalamus and pituitary coordinate much of the endocrine system',
    ],
    subtopics: [
      {
        name: 'Glands and hormones',
        points: [
          'Pituitary: FSH, LH, ADH, growth hormone; often called the master gland',
          'Thyroid: thyroxin, which controls the metabolic rate and needs iodine',
          'Pancreas: insulin and glucagon from the islets of Langerhans',
          'Adrenal glands: adrenalin for the fight-or-flight response',
          'Ovaries and testes: oestrogen, progesterone and testosterone',
        ],
      },
      {
        name: 'Blood glucose control',
        points: [
          'Blood glucose too high: the pancreas secretes insulin, so the liver converts glucose to glycogen and cells take up more glucose',
          'Blood glucose too low: the pancreas secretes glucagon, so the liver converts glycogen back to glucose',
          'Type 1 diabetes: too little insulin is produced, so injections are needed',
          'Type 2 diabetes: cells respond poorly to insulin, and it is often managed at first by diet and exercise',
        ],
      },
      {
        name: 'Temperature and water',
        points: [
          'Too hot: vasodilation of skin arterioles, sweating, hairs lie flat, so heat is lost',
          'Too cold: vasoconstriction, shivering, hairs stand erect, so heat is conserved and generated',
          'Water balance is controlled by ADH acting on the collecting ducts of the nephron',
          'Thermoregulation and osmoregulation are both negative feedback systems',
        ],
      },
    ],
    commonMistakes: [
      'Insulin lowers blood glucose and glucagon raises it; the names are easily swapped',
      'Vasodilation and vasoconstriction happen in the arterioles of the skin, not in the capillaries themselves',
      'Negative feedback does not mean a harmful effect: it means the response opposes the change',
    ],
    example: {
      problem: 'Explain why a person with type 1 diabetes requires regular insulin injections.',
      steps: [
        'Type 1 diabetes means the pancreas produces little or no insulin.',
        'Without insulin, the liver does not convert excess glucose to glycogen and body cells take up less glucose.',
        'Blood glucose therefore stays dangerously high after a meal, and glucose appears in the urine.',
        'Injected insulin replaces the missing hormone, allowing blood glucose to be brought back to the normal range.',
      ],
      answer: 'Their pancreas produces too little insulin, so without injections blood glucose cannot be lowered after eating.',
    },
    moreExamples: [
      {
        problem: 'Describe how the body responds when a person becomes very cold.',
        steps: [
          'Thermoreceptors in the skin and the hypothalamus detect the fall in temperature.',
          'Arterioles in the skin constrict, so less blood flows near the surface and less heat is lost by radiation.',
          'The erector muscles contract so hairs stand erect, trapping an insulating layer of air.',
          'Shivering begins: rapid involuntary muscle contraction releases heat from respiration, and the metabolic rate may be raised by thyroxin.',
        ],
        answer: 'Vasoconstriction reduces heat loss, erect hairs trap insulating air, and shivering generates heat, all coordinated by the hypothalamus.',
      },
    ],
  },
  {
    topicId: 'life-sci-dna-code',
    summary: 'The structure of DNA and RNA, how DNA replicates, how the code is used to build proteins, and how mutations change the outcome.',
    keyIdeas: [
      'DNA is a double helix of two antiparallel strands held by hydrogen bonds between complementary bases',
      'Base pairing is A with T and C with G in DNA; in RNA uracil replaces thymine',
      'A nucleotide is a phosphate, a deoxyribose sugar and a nitrogenous base',
      'Replication is semi-conservative: each new molecule keeps one original strand',
      'Protein synthesis is transcription in the nucleus followed by translation at the ribosome',
    ],
    subtopics: [
      {
        name: 'Structure',
        points: [
          'DNA: double stranded, deoxyribose sugar, bases A, T, C, G, found in the nucleus',
          'RNA: single stranded, ribose sugar, bases A, U, C, G; mRNA carries the code, tRNA carries amino acids',
          'A triplet of bases on DNA corresponds to a codon on mRNA and an anticodon on tRNA',
          'Three bases code for one amino acid, giving 64 possible combinations for 20 amino acids',
        ],
      },
      {
        name: 'Replication',
        points: [
          'The two strands unwind and the hydrogen bonds break',
          'Each strand acts as a template, and free nucleotides pair with the exposed bases',
          'Two identical molecules result, each with one old and one new strand, which is why it is called semi-conservative',
          'Replication happens during the S phase of interphase, before cell division',
        ],
      },
      {
        name: 'Protein synthesis and mutation',
        points: [
          'Transcription: mRNA is built against the DNA template strand in the nucleus, then leaves through a nuclear pore',
          'Translation: the ribosome reads the mRNA codon by codon; tRNA brings the matching amino acid; a peptide bond joins them',
          'Gene mutation: substitution changes one base; insertion or deletion shifts the reading frame and changes every codon that follows',
          'Chromosome mutation: non-disjunction gives a gamete with the wrong number of chromosomes, as in Down syndrome',
        ],
      },
    ],
    formulae: [
      'DNA base pairing: A-T and C-G',
      'DNA to mRNA: A gives U, T gives A, C gives G, G gives C',
    ],
    commonMistakes: [
      'A frameshift mutation is usually far more damaging than a substitution, because every codon downstream is altered',
      'mRNA is built from the template strand, so it matches the coding strand except that U replaces T',
      'Replication copies DNA; transcription makes RNA from DNA. They are different processes',
    ],
    example: {
      problem: 'A DNA template strand reads C G A T T A G C C. Determine the mRNA sequence transcribed from it, and state how many amino acids it codes for.',
      steps: [
        'Transcription pairs each DNA base with its RNA partner: C gives G, G gives C, A gives U and T gives A.',
        'C G A becomes G C U.',
        'T T A becomes A A U, and G C C becomes C G G.',
        'The mRNA is G C U A A U C G G, which is 9 bases, and since three bases code for one amino acid, it codes for 3 amino acids.',
      ],
      answer: 'mRNA = GCU AAU CGG; it codes for 3 amino acids.',
    },
    moreExamples: [
      {
        problem: 'Explain why a mutation that inserts a single base into a gene is usually more harmful than one that substitutes a single base.',
        steps: [
          'The ribosome reads mRNA in consecutive groups of three bases, so the reading frame matters.',
          'A substitution changes only the one codon in which it occurs, and because the code is degenerate it may not even change the amino acid.',
          'An insertion shifts every base after the insertion point by one place, altering every codon from there onwards.',
          'The protein produced after that point therefore has an entirely different amino acid sequence, and is usually non-functional.',
        ],
        answer: 'An insertion shifts the reading frame so every subsequent codon changes, whereas a substitution alters at most one amino acid.',
      },
    ],
  },
  {
    topicId: 'life-sci-meiosis',
    summary: 'The two-stage reduction division that produces haploid gametes, and the two mechanisms within it that generate genetic variation.',
    keyIdeas: [
      'Meiosis halves the chromosome number, producing haploid cells from a diploid cell',
      'One parent cell produces four genetically different daughter cells',
      'Crossing over in prophase I and independent assortment in metaphase I create variation',
      'Meiosis I separates homologous pairs; meiosis II separates chromatids',
      'Non-disjunction is the failure of chromosomes or chromatids to separate, giving gametes with the wrong number',
    ],
    subtopics: [
      {
        name: 'Meiosis I',
        points: [
          'Prophase I: homologous chromosomes pair up and crossing over exchanges segments between non-sister chromatids',
          'Metaphase I: the homologous pairs line up at the equator, and which member of each pair faces which pole is random, giving independent assortment',
          'Anaphase I: whole chromosomes of each pair are pulled to opposite poles, which is what halves the number',
          'Telophase I: two haploid nuclei form, each chromosome still having two chromatids',
        ],
      },
      {
        name: 'Meiosis II',
        points: [
          'Resembles mitosis, but starts with haploid cells',
          'Metaphase II: chromosomes line up singly at the equator',
          'Anaphase II: chromatids separate to opposite poles',
          'Result: four haploid cells, all genetically different from one another',
        ],
      },
      {
        name: 'Variation and errors',
        points: [
          'Crossing over produces new combinations of alleles on a single chromosome',
          'Independent assortment produces many possible combinations of whole chromosomes',
          'Random fertilisation then multiplies the variation further',
          'Non-disjunction in meiosis I or II gives a gamete with an extra or missing chromosome; fertilisation then produces conditions such as Down syndrome',
        ],
      },
    ],
    commonMistakes: [
      'The chromosome number is halved in anaphase I, when whole chromosomes separate, not in anaphase II',
      'Chromosomes line up in pairs at metaphase I but singly at metaphase II',
      'Meiosis produces four different cells; mitosis produces two identical ones',
    ],
    example: {
      problem: 'Explain how crossing over and independent assortment together ensure that no two gametes from one person are genetically identical.',
      steps: [
        'In prophase I, crossing over exchanges segments between non-sister chromatids of a homologous pair, producing chromosomes with new allele combinations.',
        'In metaphase I, each homologous pair lines up independently of the others, so the maternal and paternal chromosomes are mixed differently each time.',
        'With 23 pairs this alone gives over 8 million possible combinations, and crossing over multiplies that further.',
        'The chance of two gametes receiving exactly the same combination is therefore vanishingly small.',
      ],
      answer: 'Crossing over creates new allele combinations within chromosomes and independent assortment mixes whole chromosomes, giving an astronomically large number of possible gametes.',
    },
    moreExamples: [
      {
        problem: 'Explain why the risk of a child being born with a condition caused by non-disjunction increases with the age of the mother.',
        steps: [
          'A female is born with all her primary oocytes already formed and arrested part way through prophase I.',
          'An oocyte released at age 40 has therefore been held in that arrested state for about 40 years.',
          'Over that time the proteins holding the chromosomes together, and the spindle apparatus, deteriorate.',
          'Homologous chromosomes are then more likely to fail to separate at anaphase I, producing a gamete with an extra or missing chromosome.',
        ],
        answer: 'Her oocytes are arrested in prophase I from before birth, so the older they are the more the spindle and cohesion proteins have degraded, making non-disjunction more likely.',
      },
    ],
  },
  {
    topicId: 'life-sci-genetics',
    summary: 'How characteristics are inherited, how to work with monohybrid and dihybrid crosses, sex linkage and pedigrees, and the uses of DNA profiling.',
    keyIdeas: [
      'A gene is a length of DNA coding for a characteristic; alleles are its alternative forms',
      'Genotype is the alleles an organism carries; phenotype is the characteristic that can be seen',
      'Homozygous means two identical alleles; heterozygous means two different ones',
      'A monohybrid cross follows one characteristic; a dihybrid cross follows two',
      'Sex-linked alleles are carried on the X chromosome, so males, having one X, are affected far more often',
    ],
    subtopics: [
      {
        name: 'Monohybrid crosses',
        points: [
          'Heterozygous x heterozygous (Tt x Tt) gives a 3 : 1 phenotypic ratio and a 1 : 2 : 1 genotypic ratio',
          'Heterozygous x homozygous recessive (Tt x tt) gives a 1 : 1 phenotypic ratio, which is the basis of the test cross',
          'A test cross uses a homozygous recessive partner to reveal an unknown genotype',
          'Incomplete dominance blends the phenotypes (red x white gives pink); codominance shows both fully, as in AB blood group',
        ],
      },
      {
        name: 'Dihybrid crosses and pedigrees',
        points: [
          'A dihybrid cross between two double heterozygotes gives a 9 : 3 : 3 : 1 phenotypic ratio',
          'Each parent heterozygous for two genes produces four gamete types, so the Punnett square has 16 blocks',
          'In a pedigree, two unaffected parents with an affected child means the condition is recessive',
          'If a condition appears in every generation and affects both sexes equally, it is likely to be dominant and autosomal',
        ],
      },
      {
        name: 'Sex linkage and DNA profiling',
        points: [
          'A male is XY, so a single recessive allele on his X is always expressed; he cannot be a carrier',
          'An affected male inherits the allele from his mother, since his only X comes from her',
          'DNA profiling: restriction enzymes cut the DNA, gel electrophoresis separates the fragments by length, and the banding pattern is compared',
          'Uses include criminal investigation, paternity testing, and tracing the origin of confiscated wildlife products',
        ],
      },
    ],
    formulae: [
      'Monohybrid Tt x Tt gives 3 : 1 phenotypic, 1 : 2 : 1 genotypic',
      'Dihybrid TtYy x TtYy gives 9 : 3 : 3 : 1 phenotypic',
      'Probability of two independent events = probability of the first x probability of the second',
    ],
    commonMistakes: [
      'Genotypic and phenotypic ratios differ: Tt x Tt gives 3 : 1 by appearance but 1 : 2 : 1 by genotype',
      'A father cannot pass an X-linked allele to his son, because he gives his son the Y chromosome',
      'Combine independent probabilities by multiplying them, not by adding them',
    ],
    example: {
      problem: 'A heterozygous tall plant (Tt) is crossed with a homozygous short plant (tt). Draw the Punnett square and state the genotypic and phenotypic ratios.',
      steps: [
        'The Tt parent produces two kinds of gamete, T and t; the tt parent produces only t.',
        'Fill the 2 x 2 square: T with t gives Tt, and t with t gives tt, each appearing twice.',
        'Genotypes are therefore 2 Tt and 2 tt, which is a genotypic ratio of 1 Tt : 1 tt.',
        'Tall is dominant, so Tt plants are tall and tt plants are short, giving 1 tall : 1 short.',
      ],
      answer: 'Genotypic ratio 1 Tt : 1 tt; phenotypic ratio 1 tall : 1 short.',
    },
    moreExamples: [
      {
        problem: 'Both parents are unaffected carriers for a recessive disorder (Aa). Determine the probability that their child is a carrier but does not have the disorder.',
        steps: [
          'Cross Aa x Aa. The Punnett square gives AA, Aa, aA and aa.',
          'The genotypic ratio is 1 AA : 2 Aa : 1 aa.',
          'A carrier who does not have the disorder is heterozygous, that is Aa.',
          'Two of the four outcomes are Aa, so the probability is 2/4 = 1/2 = 50%.',
        ],
        answer: '50%',
      },
    ],
  },
  {
    topicId: 'life-sci-evolution',
    summary: 'The evidence that species change over time, how natural selection works, how new species form, and the fossil record of human evolution.',
    keyIdeas: [
      'Evolution is change in the inherited characteristics of a population over many generations',
      'Variation already exists in a population; natural selection acts on it and does not create it',
      'Individuals do not evolve; populations do',
      'Speciation requires reproductive isolation, so that two populations no longer interbreed',
      'Evidence comes from fossils, comparative anatomy, biogeography and molecular biology',
    ],
    subtopics: [
      {
        name: 'Natural selection',
        points: [
          'Variation exists within a population, largely through meiosis, mutation and random fertilisation',
          'More offspring are produced than the environment can support, so there is a struggle for existence',
          'Individuals with favourable variations survive longer and reproduce more, so those alleles become more common',
          'Darwin and Wallace proposed this independently; Lamarck was wrong because acquired characteristics are not inherited',
        ],
      },
      {
        name: 'Evidence for evolution',
        points: [
          'Fossils show change over time and transitional forms; dating uses radiometric methods such as carbon-14 for recent remains',
          'Homologous structures share a common origin but differ in function, indicating divergent evolution and a common ancestor',
          'Analogous structures share a function but not an origin, indicating convergent evolution',
          'Vestigial structures, such as the human appendix and the pelvic remnants of a python, only make sense as inheritance from an ancestor',
        ],
      },
      {
        name: 'Speciation and human evolution',
        points: [
          'Allopatric speciation: a geographic barrier splits a population, which then diverges until the two can no longer interbreed',
          'Sympatric speciation: reproductive isolation arises without a geographic barrier, for example through polyploidy in plants',
          'Genetic drift, the founder effect and bottlenecks change allele frequencies by chance, especially in small populations',
          'Hominid trends: bipedalism, an increasing cranial capacity, smaller jaws and teeth, and a flatter face; African fossils such as Australopithecus africanus and Homo naledi are central evidence',
        ],
      },
    ],
    commonMistakes: [
      'Organisms do not develop features because they need them: the variation must already exist for selection to act on',
      'Natural selection cannot create new alleles; only mutation does that',
      'Africa is the origin of modern humans, supported by the oldest hominid fossils and the greatest human genetic diversity',
    ],
    example: {
      problem: 'Explain how the use of antibiotics has led to populations of resistant bacteria.',
      steps: [
        'A bacterial population already contains variation, and by chance a few individuals carry an allele giving resistance, arising through random mutation.',
        'When the antibiotic is applied it kills the non-resistant bacteria, which is the selection pressure.',
        'The resistant individuals survive and reproduce, passing the resistance allele to their offspring.',
        'Over many generations the proportion of resistant bacteria rises until the antibiotic is no longer effective.',
      ],
      answer: 'Random mutation produces resistant individuals; the antibiotic selects against the rest, so the resistant survivors reproduce and the allele becomes common.',
    },
    moreExamples: [
      {
        problem: 'Explain the process of allopatric speciation, using a mountain range forming across the range of one species as the example.',
        steps: [
          'The mountain range acts as a geographic barrier, splitting the original population into two that can no longer interbreed.',
          'Conditions on the two sides differ, so different variations are favoured by natural selection on each side.',
          'Mutation, genetic drift and different selection pressures cause the gene pools to diverge over many generations.',
          'Eventually the two populations differ so much that they could not produce fertile offspring even if the barrier were removed, so they are separate species.',
        ],
        answer: 'A geographic barrier isolates two populations; different selection pressures and drift cause their gene pools to diverge until they can no longer interbreed.',
      },
    ],
  },
  {
    topicId: 'phys-vectors-scalars-g10',
    summary: 'The difference between scalars and vectors, and how to add vectors in one dimension to find a resultant.',
    keyIdeas: [
      'A scalar has magnitude only; a vector has magnitude and direction',
      'Distance and speed are scalars; displacement, velocity, acceleration and force are vectors',
      'A vector is drawn as an arrow: its length shows the magnitude and the arrowhead shows the direction',
      'The resultant is the single vector that has the same effect as all the vectors together',
      'Choose a positive direction first, then treat vectors in the opposite direction as negative',
    ],
    subtopics: [
      {
        name: 'Scalars and vectors',
        points: [
          'Scalars: distance, speed, mass, time, energy, temperature',
          'Vectors: displacement, velocity, acceleration, force, momentum, weight',
          'A vector answer is incomplete without a direction, for example 15 N to the right',
        ],
      },
      {
        name: 'Adding vectors in one dimension',
        points: [
          'Set a positive direction and state it, for example take right as positive',
          'Add the vectors algebraically, using a negative sign for the opposite direction',
          'A negative resultant simply means the resultant points in the negative direction you chose',
        ],
      },
      {
        name: 'Resultant and equilibrant',
        points: [
          'The resultant replaces all the vectors acting together',
          'The equilibrant is equal in magnitude to the resultant but opposite in direction, so it produces equilibrium',
          'When forces are balanced the resultant is zero and the object does not accelerate',
        ],
      },
    ],
    commonMistakes: [
      'Distance and displacement differ: a runner completing one lap has run a distance but has zero displacement',
      'A vector answer without a direction loses a mark',
      'The negative sign in a vector answer is a direction, not a smaller quantity',
    ],
    example: {
      problem: 'A learner walks 12 m east, then 5 m west. Calculate the distance walked and the resultant displacement.',
      steps: [
        'Distance is a scalar, so add the path lengths without regard to direction: 12 + 5 = 17 m.',
        'For displacement, take east as positive, so the two vectors are +12 m and -5 m.',
        'Add them: (+12) + (-5) = +7 m.',
        'The positive sign means the resultant points east.',
      ],
      answer: 'Distance = 17 m; displacement = 7 m east.',
    },
    moreExamples: [
      {
        problem: 'Two forces act on a box along the same line: 25 N to the right and 40 N to the left. Determine the resultant force and the equilibrant.',
        steps: [
          'Take right as positive, so the forces are +25 N and -40 N.',
          'Resultant = (+25) + (-40) = -15 N, which is 15 N to the left.',
          'The equilibrant has the same magnitude but the opposite direction.',
          'The equilibrant is therefore 15 N to the right.',
        ],
        answer: 'Resultant = 15 N to the left; equilibrant = 15 N to the right.',
      },
    ],
  },
  {
    topicId: 'phys-motion-1d',
    summary: 'Describing motion in a straight line using position, displacement, velocity and acceleration, the equations of motion, and motion graphs.',
    keyIdeas: [
      'Average speed uses distance; average velocity uses displacement',
      'Acceleration is the rate of change of velocity, so it is zero when velocity is constant',
      'The equations of motion apply only when acceleration is uniform',
      'On a position-time graph the gradient gives velocity; on a velocity-time graph the gradient gives acceleration and the area gives displacement',
      'Free fall means gravity is the only force acting, giving an acceleration of 9.8 m/s2 downwards',
    ],
    subtopics: [
      {
        name: 'Quantities',
        points: [
          'Position is measured from a chosen reference point; displacement is the change in position',
          'Average velocity = displacement / time; average speed = distance / time',
          'Instantaneous velocity is the velocity at one moment, given by the gradient of the tangent',
        ],
      },
      {
        name: 'Equations of motion',
        points: [
          'Use them only for uniform acceleration, and keep one consistent positive direction throughout',
          'List what is given and what is required before choosing the equation',
          'In free fall a = 9.8 m/s2 downwards, whether the object is rising or falling',
        ],
      },
      {
        name: 'Motion graphs',
        points: [
          'Position-time: gradient is velocity; a horizontal line means at rest',
          'Velocity-time: gradient is acceleration; area under the graph is displacement',
          'Acceleration-time: area under the graph is the change in velocity',
          'A curved position-time graph means the velocity is changing, so there is acceleration',
        ],
      },
    ],
    formulae: [
      'vf = vi + a t',
      'dx = vi t + 1/2 a t^2',
      'vf^2 = vi^2 + 2 a dx',
      'dx = ((vi + vf) / 2) t',
    ],
    commonMistakes: [
      'A ball at the top of its flight has zero velocity but its acceleration is still 9.8 m/s2 downwards',
      'Choose one positive direction and keep it for the whole problem, including for gravity',
      'Area under a velocity-time graph below the axis is negative displacement',
    ],
    example: {
      problem: 'A car accelerates uniformly from rest to 20 m/s in 8 s. Calculate the acceleration and the distance travelled.',
      steps: [
        'List the values: vi = 0 m/s, vf = 20 m/s, t = 8 s.',
        'Use vf = vi + a t, so 20 = 0 + a(8), giving a = 20 / 8 = 2.5 m/s2.',
        'For the distance use dx = ((vi + vf) / 2) t = ((0 + 20) / 2) x 8.',
        'Work it out: 10 x 8 = 80 m.',
      ],
      answer: 'a = 2.5 m/s2 in the direction of motion; distance = 80 m.',
    },
    moreExamples: [
      {
        problem: 'A stone is thrown straight up at 15 m/s. Calculate the maximum height it reaches. Ignore air resistance.',
        steps: [
          'Take upwards as positive, so vi = +15 m/s and a = -9.8 m/s2.',
          'At the maximum height the stone is momentarily at rest, so vf = 0 m/s.',
          'Use vf^2 = vi^2 + 2 a dx: 0 = 15^2 + 2(-9.8) dx.',
          'So 0 = 225 - 19.6 dx, giving dx = 225 / 19.6 = 11.48 m.',
        ],
        answer: 'About 11.5 m above the throwing point.',
      },
    ],
  },
  {
    topicId: 'phys-mechanical-energy-g10',
    summary: 'Gravitational potential energy, kinetic energy, and the conservation of mechanical energy in the absence of friction.',
    keyIdeas: [
      'Gravitational potential energy depends on mass, gravity and height above a reference point',
      'Kinetic energy depends on mass and the square of the speed',
      'Mechanical energy is the sum of potential and kinetic energy',
      'In the absence of friction, mechanical energy is conserved: what is lost as potential energy is gained as kinetic energy',
      'Energy is a scalar, so it has no direction',
    ],
    subtopics: [
      {
        name: 'Potential and kinetic energy',
        points: [
          'Ep = m g h, measured from a stated reference level, usually the ground',
          'Ek = 1/2 m v^2, so doubling the speed gives four times the kinetic energy',
          'Both are measured in joules',
        ],
      },
      {
        name: 'Conservation of mechanical energy',
        points: [
          'Total mechanical energy at the start equals total mechanical energy at the end, when only gravity does work',
          'At the highest point the energy is all potential; just before landing it is nearly all kinetic',
          'Mass often cancels from both sides, so the final speed of a falling object does not depend on its mass',
        ],
      },
      {
        name: 'When friction acts',
        points: [
          'With friction, mechanical energy is no longer conserved: some is transferred to heat and sound',
          'The object then arrives with less kinetic energy than the conservation calculation predicts',
          'The energy is not destroyed; the total energy of the system is still conserved',
        ],
      },
    ],
    formulae: [
      'Ep = m g h',
      'Ek = 1/2 m v^2',
      'Emechanical = Ep + Ek',
      'Ep(start) + Ek(start) = Ep(end) + Ek(end), if friction is absent',
    ],
    commonMistakes: [
      'Kinetic energy depends on v squared, so tripling the speed gives nine times the energy, not three times',
      'Height must be measured from the stated reference level, not from the nearest surface',
      'Energy is a scalar and is never negative because of direction',
    ],
    example: {
      problem: 'A 2 kg ball is dropped from a height of 5 m. Calculate its speed just before it hits the ground. Ignore friction. Use g = 9.8 m/s2.',
      steps: [
        'At the top the ball is at rest, so all its mechanical energy is potential: Ep = m g h = 2 x 9.8 x 5 = 98 J.',
        'Just before landing the height is zero, so all of it is kinetic: Ek = 98 J.',
        'Use Ek = 1/2 m v^2: 98 = 1/2 x 2 x v^2, so 98 = v^2.',
        'Take the square root: v = 9.90 m/s.',
      ],
      answer: 'About 9.9 m/s downwards.',
    },
    moreExamples: [
      {
        problem: 'The same ball, dropped from the same height, lands at 8 m/s instead of 9.9 m/s. Calculate the energy lost and explain where it went.',
        steps: [
          'Kinetic energy on landing = 1/2 x 2 x 8^2 = 64 J.',
          'Potential energy at the top was 98 J.',
          'Energy lost = 98 - 64 = 34 J.',
          'Mechanical energy was not conserved because air resistance did work on the ball; the 34 J was transferred to heat and sound in the surrounding air.',
        ],
        answer: '34 J was lost, transferred to heat and sound by air resistance.',
      },
    ],
  },
  {
    topicId: 'phys-transverse-waves-g10',
    summary: 'Pulses and transverse waves, the quantities that describe them, and what happens when waves meet or reach a boundary.',
    keyIdeas: [
      'In a transverse wave the particles vibrate perpendicular to the direction the wave travels',
      'Amplitude is the maximum displacement from the rest position and is linked to the energy carried',
      'Wavelength is the distance between two successive points in phase, such as crest to crest',
      'Frequency is the number of waves passing a point each second, measured in hertz',
      'The wave equation links them: v = f x wavelength',
    ],
    subtopics: [
      {
        name: 'Describing a wave',
        points: [
          'Crest is the highest point, trough the lowest',
          'Period T is the time for one complete wave, and f = 1 / T',
          'Points in phase are at the same position in their cycle and moving the same way',
          'A wave transfers energy without transferring matter',
        ],
      },
      {
        name: 'Superposition',
        points: [
          'Constructive interference: two crests meet, and the amplitudes add to give a larger pulse',
          'Destructive interference: a crest meets a trough, and the amplitudes subtract',
          'After passing through each other the pulses continue unchanged',
        ],
      },
      {
        name: 'Reflection',
        points: [
          'A pulse reflected from a fixed end is inverted, that is the phase changes by 180 degrees',
          'A pulse reflected from a free end is not inverted',
          'Reflection changes direction but not the speed or the wavelength in the same medium',
        ],
      },
    ],
    formulae: [
      'v = f x wavelength',
      'T = 1 / f',
      'f = 1 / T',
    ],
    commonMistakes: [
      'A wave transfers energy, not matter: the particles vibrate about a fixed point and do not travel with the wave',
      'Reflection at a fixed end inverts the pulse; at a free end it does not',
      'Amplitude is measured from the rest position to the crest, not from trough to crest',
    ],
    example: {
      problem: 'A transverse wave has a frequency of 5 Hz and a wavelength of 0.4 m. Calculate its speed and its period.',
      steps: [
        'Use the wave equation v = f x wavelength.',
        'Substitute: v = 5 x 0.4 = 2 m/s.',
        'The period is the reciprocal of the frequency: T = 1 / f.',
        'T = 1 / 5 = 0.2 s.',
      ],
      answer: 'v = 2 m/s; T = 0.2 s.',
    },
    moreExamples: [
      {
        problem: 'Two pulses travel towards each other on a rope. One has an amplitude of 3 cm upwards and the other 2 cm downwards. Describe what happens as they meet and after they have passed.',
        steps: [
          'As they overlap the principle of superposition applies, so the displacements add algebraically.',
          'Taking upwards as positive: (+3) + (-2) = +1 cm, so at the moment of full overlap the rope shows a single pulse 1 cm high.',
          'This is destructive interference, because the resulting amplitude is smaller than the larger original.',
          'After passing, each pulse continues unchanged with its original amplitude and direction.',
        ],
        answer: 'They interfere destructively to give a 1 cm upward pulse while overlapping, then continue unchanged at 3 cm up and 2 cm down.',
      },
    ],
  },
  {
    topicId: 'phys-longitudinal-waves-g10',
    summary: 'Longitudinal waves, how they differ from transverse waves, and the quantities used to describe them.',
    keyIdeas: [
      'In a longitudinal wave the particles vibrate parallel to the direction the wave travels',
      'A compression is a region where the particles are close together; a rarefaction is where they are spread apart',
      'Wavelength is the distance from one compression to the next',
      'Longitudinal waves need a medium, so they cannot travel through a vacuum',
      'The same wave equation applies: v = f x wavelength',
    ],
    subtopics: [
      {
        name: 'Structure of a longitudinal wave',
        points: [
          'Compressions correspond to high pressure and rarefactions to low pressure',
          'One wavelength is compression to compression, or rarefaction to rarefaction',
          'Amplitude relates to how much the particles are displaced from their rest positions',
        ],
      },
      {
        name: 'Comparison with transverse waves',
        points: [
          'Transverse: particle motion perpendicular to wave motion; examples are light and water ripples',
          'Longitudinal: particle motion parallel to wave motion; the main example is sound',
          'Only transverse waves can be polarised',
          'Electromagnetic waves are transverse and need no medium; sound is longitudinal and does',
        ],
      },
      {
        name: 'Speed in different media',
        points: [
          'Sound travels fastest in solids, slower in liquids and slowest in gases',
          'Closer particles transmit the vibration more quickly, which is why solids are fastest',
          'A vacuum has no particles, so sound cannot travel through it at all',
        ],
      },
    ],
    formulae: [
      'v = f x wavelength',
      'T = 1 / f',
    ],
    commonMistakes: [
      'Sound cannot travel through a vacuum, because there are no particles to compress',
      'Compressions are high-pressure regions, not regions where the wave is stronger',
      'Longitudinal waves cannot be polarised',
    ],
    example: {
      problem: 'A sound wave in air has a frequency of 440 Hz. The speed of sound in air is 340 m/s. Calculate its wavelength.',
      steps: [
        'Use the wave equation v = f x wavelength, rearranged as wavelength = v / f.',
        'Substitute the values: wavelength = 340 / 440.',
        'Work it out: 0.7727 m.',
        'Round appropriately: about 0.77 m.',
      ],
      answer: 'About 0.77 m',
    },
    moreExamples: [
      {
        problem: 'An astronaut on the Moon strikes a metal rod but hears nothing, although a second astronaut touching the rod feels the vibration. Explain.',
        steps: [
          'Sound is a longitudinal wave and requires a medium whose particles can be compressed and rarefied.',
          'The Moon has effectively no atmosphere, so there are no air particles between the rod and the astronaut ear.',
          'The vibration therefore cannot be transmitted through the space around the rod and no sound is heard.',
          'The rod itself is a solid medium, so the vibration travels through it and can be felt by direct contact.',
        ],
        answer: 'Sound needs a medium; there is no air on the Moon to carry it, though the solid rod can still transmit the vibration by contact.',
      },
    ],
  },
  {
    topicId: 'phys-sound-g10',
    summary: 'How sound is produced and transmitted, the link between the physical properties of a sound wave and what we hear, and the uses of ultrasound.',
    keyIdeas: [
      'Sound is produced by a vibrating object and travels as a longitudinal wave',
      'Pitch is determined by frequency: higher frequency gives a higher pitch',
      'Loudness is determined by amplitude: larger amplitude gives a louder sound',
      'The human audible range is about 20 Hz to 20 000 Hz',
      'Ultrasound is sound above 20 000 Hz, which is above the human hearing range',
    ],
    subtopics: [
      {
        name: 'Properties of sound',
        points: [
          'Pitch depends on frequency, measured in hertz',
          'Loudness depends on amplitude, and intensity is measured in decibels',
          'Quality, or timbre, is why a guitar and a piano playing the same note sound different',
        ],
      },
      {
        name: 'Transmission and speed',
        points: [
          'Sound needs a medium and travels fastest in solids, then liquids, then gases',
          'In air at about 20 degrees Celsius the speed is roughly 340 m/s',
          'Speed increases with temperature in a gas, because the particles move faster',
        ],
      },
      {
        name: 'Ultrasound and hearing damage',
        points: [
          'Ultrasound is used for prenatal imaging, for detecting flaws in metal, and by bats and dolphins for echolocation',
          'Echo timing gives distance: the wave travels there and back, so the distance is half the total path',
          'Prolonged exposure above about 85 decibels damages hearing permanently',
        ],
      },
    ],
    formulae: [
      'v = f x wavelength',
      'Distance to a reflector = (v x t) / 2, where t is the total echo time',
    ],
    commonMistakes: [
      'Pitch is set by frequency and loudness by amplitude; the two are often swapped',
      'In an echo calculation the sound travels to the object and back, so the distance is half the total path',
      'Sound travels faster in solids than in air, not slower',
    ],
    example: {
      problem: 'A ship sends a sonar pulse to the seabed and receives the echo 0.4 s later. Sound travels at 1 500 m/s in seawater. Calculate the depth.',
      steps: [
        'The pulse travels down to the seabed and back, so the total path takes 0.4 s.',
        'Total distance = v x t = 1 500 x 0.4 = 600 m.',
        'The depth is half the total distance, because the path there and back are equal.',
        'Depth = 600 / 2 = 300 m.',
      ],
      answer: '300 m',
    },
    moreExamples: [
      {
        problem: 'Two guitar strings are plucked. String A sounds higher and softer than string B. Compare the frequency and amplitude of the two waves.',
        steps: [
          'Pitch is determined by frequency, and string A sounds higher.',
          'String A therefore has the higher frequency.',
          'Loudness is determined by amplitude, and string A sounds softer.',
          'String A therefore has the smaller amplitude, so string B has the lower frequency and the larger amplitude.',
        ],
        answer: 'String A has a higher frequency and a smaller amplitude; string B has a lower frequency and a larger amplitude.',
      },
    ],
  },
  {
    topicId: 'phys-em-radiation-g10',
    summary: 'The electromagnetic spectrum, the dual nature of light, and the relationship between frequency, wavelength and photon energy.',
    keyIdeas: [
      'Electromagnetic waves are transverse and travel through a vacuum at 3 x 10^8 m/s',
      'The spectrum runs from radio waves, through microwaves, infrared, visible light, ultraviolet and X-rays, to gamma rays',
      'Frequency and wavelength are inversely proportional, since c is constant',
      'Photon energy is proportional to frequency, so gamma rays carry the most energy per photon',
      'Light behaves as both a wave and a particle, which is its dual nature',
    ],
    subtopics: [
      {
        name: 'The spectrum',
        points: [
          'In order of increasing frequency: radio, microwave, infrared, visible, ultraviolet, X-ray, gamma',
          'Visible light runs from red, which has the longest wavelength, to violet, which has the shortest',
          'All electromagnetic waves travel at the same speed in a vacuum',
        ],
      },
      {
        name: 'Wave and particle nature',
        points: [
          'Wave nature is shown by diffraction and interference',
          'Particle nature is shown by the photoelectric effect, where light behaves as photons',
          'A photon is a packet of energy given by E = h f',
        ],
      },
      {
        name: 'Effects and uses',
        points: [
          'Radio and microwave: communication and cooking',
          'Infrared: heating and thermal imaging; ultraviolet: causes sunburn and skin cancer',
          'X-rays and gamma rays are ionising and damage living tissue, so exposure must be limited',
        ],
      },
    ],
    formulae: [
      'c = f x wavelength, with c = 3 x 10^8 m/s',
      'E = h f, with h = 6.63 x 10^-34 J s',
      'E = h c / wavelength',
    ],
    commonMistakes: [
      'All electromagnetic waves travel at the same speed in a vacuum; only their frequency and wavelength differ',
      'Higher frequency means shorter wavelength, because their product is constant',
      'The energy of a photon depends on frequency, not on the brightness of the source',
    ],
    example: {
      problem: 'Green light has a wavelength of 5.5 x 10^-7 m. Calculate its frequency and the energy of one photon.',
      steps: [
        'Use c = f x wavelength, rearranged as f = c / wavelength.',
        'f = (3 x 10^8) / (5.5 x 10^-7) = 5.45 x 10^14 Hz.',
        'Use E = h f with h = 6.63 x 10^-34 J s.',
        'E = (6.63 x 10^-34) x (5.45 x 10^14) = 3.61 x 10^-19 J.',
      ],
      answer: 'f = 5.45 x 10^14 Hz; E = 3.61 x 10^-19 J.',
    },
    moreExamples: [
      {
        problem: 'Explain why ultraviolet radiation can cause skin cancer but visible light cannot, even when the visible light is much brighter.',
        steps: [
          'The energy carried by a single photon is given by E = h f, so it depends only on the frequency.',
          'Ultraviolet has a higher frequency than visible light, so each ultraviolet photon carries more energy.',
          'Ultraviolet photons carry enough energy to ionise molecules and damage DNA in skin cells; visible photons do not.',
          'Increasing the brightness of visible light delivers more photons, but each one is still too weak to cause that damage.',
        ],
        answer: 'Photon energy depends on frequency, not brightness; ultraviolet photons are energetic enough to damage DNA while visible photons are not, however many arrive.',
      },
    ],
  },
  {
    topicId: 'phys-classification-matter',
    summary: 'How matter is classified into mixtures and pure substances, and the physical methods used to separate mixtures.',
    keyIdeas: [
      'Matter is either a mixture or a pure substance',
      'A pure substance is either an element or a compound, and has a fixed composition and a sharp melting point',
      'A mixture contains two or more substances not chemically joined, in any proportion',
      'Homogeneous mixtures are uniform throughout; heterogeneous mixtures are not',
      'Mixtures are separated by physical methods that exploit a difference in physical properties',
    ],
    subtopics: [
      {
        name: 'Pure substances',
        points: [
          'An element cannot be broken down chemically and contains one kind of atom',
          'A compound contains two or more elements chemically bonded in a fixed ratio',
          'A compound has properties quite different from the elements it is made of',
          'A pure substance melts and boils at one sharp temperature',
        ],
      },
      {
        name: 'Mixtures',
        points: [
          'Homogeneous: a solution such as salt water, uniform throughout, with particles that cannot be seen',
          'Heterogeneous: sand and water, or granite, with visibly distinct parts',
          'The components keep their own properties and can be present in any ratio',
        ],
      },
      {
        name: 'Separation methods',
        points: [
          'Filtration separates an insoluble solid from a liquid',
          'Evaporation or crystallisation recovers a dissolved solid from a solution',
          'Distillation separates liquids with different boiling points, and recovers the solvent',
          'Chromatography separates dissolved substances by how far they travel; magnetism separates magnetic material; a separating funnel separates immiscible liquids',
        ],
      },
    ],
    commonMistakes: [
      'A compound has fixed proportions and needs a chemical reaction to separate; a mixture does not',
      'Filtration cannot remove a dissolved solid, because the particles pass through the filter paper',
      'Air is a mixture, not a compound, which is why its composition can vary',
    ],
    example: {
      problem: 'A sample is a mixture of insoluble chalk powder and potassium permanganate, which dissolves in water. Describe, with reasons, how you would separate the two.',
      steps: [
        'Add water and stir: the potassium permanganate dissolves to form a purple solution while the chalk does not dissolve.',
        'Filter the mixture: the insoluble chalk is trapped as residue on the filter paper and can be dried.',
        'Collect the purple filtrate, which contains the dissolved potassium permanganate.',
        'Evaporate the water from the filtrate, or allow it to crystallise, to recover the solid potassium permanganate.',
      ],
      answer: 'Dissolve in water, filter off the chalk as residue, then evaporate or crystallise the filtrate to recover the potassium permanganate.',
    },
    moreExamples: [
      {
        problem: 'A learner is given a colourless liquid and asked to decide whether it is pure water or salt water, without tasting it. Describe a test.',
        steps: [
          'Heat the liquid and record the temperature at which it boils, using a thermometer.',
          'Pure water boils at exactly 100 degrees Celsius at sea level, and the temperature stays constant while it boils.',
          'A solution boils above 100 degrees Celsius, and the boiling point rises as the solution becomes more concentrated.',
          'A sharp, constant boiling point at 100 degrees Celsius therefore indicates pure water.',
        ],
        answer: 'Measure the boiling point: pure water boils sharply at 100 degrees Celsius, while salt water boils higher and over a rising range.',
      },
    ],
  },
  {
    topicId: 'phys-states-matter-kmt',
    summary: 'The kinetic molecular theory, how it explains the three states of matter and the changes between them, and how it accounts for diffusion and pressure.',
    keyIdeas: [
      'All matter is made of particles that are in constant motion',
      'Temperature is a measure of the average kinetic energy of the particles',
      'The state of a substance depends on the strength of the forces between its particles relative to their kinetic energy',
      'During a change of state the temperature stays constant while the forces between particles are overcome',
      'Pressure in a gas is caused by particles colliding with the container walls',
    ],
    subtopics: [
      {
        name: 'The three states',
        points: [
          'Solid: particles closely packed in a fixed pattern, vibrating in place; fixed shape and volume',
          'Liquid: particles close but able to slide past one another; fixed volume, takes the shape of the container',
          'Gas: particles far apart and moving rapidly at random; no fixed shape or volume, and compressible',
        ],
      },
      {
        name: 'Changes of state',
        points: [
          'Melting, evaporation and sublimation absorb energy; freezing, condensation and deposition release it',
          'During melting or boiling the temperature does not rise, because the energy goes into breaking the forces between particles, not into speeding them up',
          'A heating curve therefore shows flat sections at the melting and boiling points',
        ],
      },
      {
        name: 'Diffusion and pressure',
        points: [
          'Diffusion is the spreading of particles from high to low concentration due to their random motion',
          'Lighter particles diffuse faster at the same temperature, because they move faster',
          'Gas pressure rises if the temperature rises, if the volume decreases, or if more gas is added',
        ],
      },
    ],
    commonMistakes: [
      'The temperature does not rise while a substance is melting or boiling, even though heat is still being supplied',
      'Particles in a solid are still moving: they vibrate about fixed positions',
      'Gas pressure comes from particle collisions with the walls, not from the particles pushing each other',
    ],
    example: {
      problem: 'A liquid is heated steadily until it boils. Describe, using the kinetic molecular theory, what happens to the temperature and the particles during boiling.',
      steps: [
        'Before boiling, the supplied energy increases the average kinetic energy of the particles, so the temperature rises.',
        'At the boiling point the temperature stops rising and remains constant, even though heating continues.',
        'The energy supplied is used to overcome the forces of attraction between the liquid particles rather than to speed them up.',
        'Once the particles are free of these forces they escape as a gas, and only then does further heating raise the temperature again.',
      ],
      answer: 'The temperature stays constant during boiling because the energy supplied breaks the forces between particles instead of increasing their kinetic energy.',
    },
    moreExamples: [
      {
        problem: 'A bottle of perfume is opened at the front of a classroom and the smell reaches the back a little later. Explain using the kinetic molecular theory, and state what would happen on a colder day.',
        steps: [
          'The perfume particles evaporate and move randomly at high speed in all directions.',
          'They spread from the high concentration near the bottle to the lower concentration across the room, which is diffusion.',
          'They collide constantly with air particles, so their path is indirect, which is why it takes time rather than arriving instantly.',
          'On a colder day the particles have less average kinetic energy and move more slowly, so diffusion is slower and the smell takes longer to reach the back.',
        ],
        answer: 'Random particle motion causes diffusion from high to low concentration; on a colder day the particles move more slowly, so it takes longer.',
      },
    ],
  },
  {
    topicId: 'phys-the-atom',
    summary: 'The structure of the atom, the meaning of atomic number and mass number, isotopes, and how electrons are arranged.',
    keyIdeas: [
      'An atom has a small dense nucleus of protons and neutrons, surrounded by electrons',
      'Protons are positive, electrons negative and neutrons neutral; an atom overall is neutral',
      'Atomic number Z is the number of protons and identifies the element',
      'Mass number A is the number of protons plus neutrons',
      'Isotopes are atoms of the same element with different numbers of neutrons',
    ],
    subtopics: [
      {
        name: 'Subatomic particles',
        points: [
          'Proton: charge +1, mass 1 unit, in the nucleus',
          'Neutron: charge 0, mass 1 unit, in the nucleus',
          'Electron: charge -1, negligible mass, in energy levels around the nucleus',
          'In a neutral atom the number of electrons equals the number of protons',
        ],
      },
      {
        name: 'Isotopes and relative atomic mass',
        points: [
          'Isotopes have the same atomic number but different mass numbers',
          'They have identical chemical properties, because chemistry is decided by the electrons',
          'Relative atomic mass is the weighted average of the isotope masses, according to their abundance',
          'This is why relative atomic masses on the periodic table are rarely whole numbers',
        ],
      },
      {
        name: 'Electron arrangement',
        points: [
          'Energy levels fill from the lowest upwards; the first holds 2 electrons and the second holds 8',
          'Valence electrons are those in the outermost energy level and determine chemical behaviour',
          'Atoms react so as to achieve a full outer energy level',
        ],
      },
    ],
    formulae: [
      'Number of neutrons = A - Z',
      'Relative atomic mass = sum of (isotope mass x percentage abundance) / 100',
    ],
    commonMistakes: [
      'Isotopes differ in neutrons, not in protons; changing the protons changes the element',
      'Almost all the mass of an atom is in the nucleus, even though the nucleus is tiny',
      'An ion is charged because it has gained or lost electrons, not protons',
    ],
    example: {
      problem: 'An atom has a mass number of 39 and an atomic number of 19. State the numbers of protons, neutrons and electrons.',
      steps: [
        'The atomic number is the number of protons, so there are 19 protons.',
        'The atom is neutral, so the number of electrons equals the number of protons: 19 electrons.',
        'Neutrons = mass number - atomic number = 39 - 19.',
        'That gives 20 neutrons.',
      ],
      answer: '19 protons, 20 neutrons and 19 electrons.',
    },
    moreExamples: [
      {
        problem: 'Chlorine exists as two isotopes: 75% chlorine-35 and 25% chlorine-37. Calculate the relative atomic mass, and explain why the isotopes behave identically in chemical reactions.',
        steps: [
          'Relative atomic mass = (35 x 75 + 37 x 25) / 100.',
          'That is (2 625 + 925) / 100 = 3 550 / 100 = 35.5.',
          'Chemical behaviour is determined by the valence electrons, and both isotopes have 17 protons and therefore 17 electrons.',
          'Since the electron arrangement is identical, the two isotopes react in exactly the same way; only their masses differ.',
        ],
        answer: 'Relative atomic mass = 35.5; the isotopes react identically because they have the same electron arrangement and differ only in neutrons.',
      },
    ],
  },
  {
    topicId: 'phys-periodic-table',
    summary: 'How the periodic table is arranged, the trends down groups and across periods, and how position predicts chemical behaviour.',
    keyIdeas: [
      'Elements are arranged in order of increasing atomic number',
      'A group is a vertical column; all its members have the same number of valence electrons',
      'A period is a horizontal row; the energy level being filled is the same across it',
      'Chemical properties repeat periodically because the valence electron arrangement repeats',
      'Metals are on the left, non-metals on the right, with a staircase of semi-metals between',
    ],
    subtopics: [
      {
        name: 'Groups',
        points: [
          'Group 1, alkali metals: one valence electron, very reactive, reactivity increases down the group',
          'Group 2, alkaline earth metals: two valence electrons',
          'Group 17, halogens: seven valence electrons, very reactive non-metals, reactivity decreases down the group',
          'Group 18, noble gases: full outer energy level, so they are unreactive',
        ],
      },
      {
        name: 'Trends',
        points: [
          'Atomic radius increases down a group, as energy levels are added',
          'Atomic radius decreases across a period, as the increasing nuclear charge pulls the same energy level inwards',
          'Ionisation energy decreases down a group and increases across a period',
          'Metallic character decreases across a period and increases down a group',
        ],
      },
      {
        name: 'Predicting behaviour',
        points: [
          'Metals lose electrons to form positive ions; non-metals gain electrons to form negative ions',
          'An element in group 1 loses one electron to form a 1+ ion; one in group 17 gains one to form a 1- ion',
          'Elements in the same group react similarly because they have the same number of valence electrons',
        ],
      },
    ],
    commonMistakes: [
      'Atomic radius decreases across a period even though electrons are being added, because the nuclear charge rises and pulls the same shell inwards',
      'Group 1 reactivity increases downwards, while group 17 reactivity decreases downwards',
      'Noble gases are unreactive because their outer level is full, not because they have no electrons to spare',
    ],
    example: {
      problem: 'Explain why sodium (group 1) is far more reactive than magnesium (group 2).',
      steps: [
        'Sodium has one valence electron and magnesium has two.',
        'To react, a metal must lose its valence electrons and form a positive ion.',
        'Losing one electron requires less energy than losing two, so sodium forms its ion more readily.',
        'Sodium therefore reacts more vigorously, for example with water.',
      ],
      answer: 'Sodium needs to lose only one valence electron while magnesium must lose two, which takes more energy.',
    },
    moreExamples: [
      {
        problem: 'Predict the formula of the compound formed between magnesium and chlorine, and explain your reasoning from their positions in the periodic table.',
        steps: [
          'Magnesium is in group 2, so it has two valence electrons and loses both to form Mg2+.',
          'Chlorine is in group 17, so it has seven valence electrons and gains one to form Cl-.',
          'The compound must be electrically neutral, so two chloride ions are needed to balance one magnesium ion.',
          'The formula is therefore MgCl2.',
        ],
        answer: 'MgCl2, because Mg loses 2 electrons to form Mg2+ and each Cl gains 1 to form Cl-, so two chlorides balance one magnesium.',
      },
    ],
  },
  {
    topicId: 'phys-chemical-bonding-g10',
    summary: 'Why atoms bond, the three main types of bond, and how the type of bonding explains the properties of a substance.',
    keyIdeas: [
      'Atoms bond to achieve a full outer energy level, which is a more stable arrangement',
      'Ionic bonding transfers electrons from a metal to a non-metal',
      'Covalent bonding shares electrons between non-metals',
      'Metallic bonding is positive ions in a sea of delocalised electrons',
      'The properties of a substance follow directly from its bonding and structure',
    ],
    subtopics: [
      {
        name: 'Ionic bonding',
        points: [
          'A metal loses electrons to form a cation and a non-metal gains them to form an anion',
          'The oppositely charged ions attract in a giant lattice',
          'High melting point, brittle, and conducts electricity only when molten or dissolved, because only then are the ions free to move',
        ],
      },
      {
        name: 'Covalent bonding',
        points: [
          'Two non-metal atoms share one or more pairs of electrons',
          'A single bond shares one pair, a double bond two pairs, a triple bond three',
          'Simple molecular substances have low melting points, because the weak forces between molecules are easily overcome, not the strong bonds within them',
          'They generally do not conduct electricity, because there are no free charged particles',
        ],
      },
      {
        name: 'Metallic bonding',
        points: [
          'Positive metal ions in a lattice, with delocalised valence electrons free to move',
          'Good conductors of heat and electricity, because the delocalised electrons carry charge and energy',
          'Malleable and ductile, because layers of ions can slide over one another without breaking the bond',
        ],
      },
    ],
    commonMistakes: [
      'Melting a simple covalent substance breaks the weak forces between molecules, not the covalent bonds inside them',
      'An ionic solid does not conduct, because its ions are locked in the lattice; it conducts only when molten or dissolved',
      'Metals conduct because of delocalised electrons, not because of their ions moving',
    ],
    example: {
      problem: 'Sodium chloride has a melting point of 801 degrees Celsius, while chlorine gas melts at -101 degrees Celsius. Explain the difference in terms of bonding.',
      steps: [
        'Sodium chloride is ionic: oppositely charged ions are held in a giant lattice by strong electrostatic forces acting in all directions.',
        'Melting it requires breaking many of these strong forces, so a very high temperature is needed.',
        'Chlorine is a simple covalent molecule, Cl2. The covalent bond within each molecule is strong, but the forces between separate molecules are very weak.',
        'Melting chlorine only requires overcoming those weak intermolecular forces, so a very low temperature suffices.',
      ],
      answer: 'Sodium chloride has a giant ionic lattice held by strong electrostatic forces, while chlorine is made of separate molecules held together only by weak intermolecular forces.',
    },
    moreExamples: [
      {
        problem: 'Explain why copper wire is used for electrical cables and why it can be drawn into a thin wire without snapping.',
        steps: [
          'Copper is a metal, so it consists of positive ions in a lattice surrounded by delocalised valence electrons.',
          'These delocalised electrons are free to move through the whole structure, so they carry charge and copper conducts electricity well.',
          'When a force is applied, the layers of positive ions slide over one another.',
          'The delocalised electrons continue to hold the structure together as the layers move, so the metal deforms rather than shattering, which makes it ductile.',
        ],
        answer: 'Its delocalised electrons are free to move and carry charge, and they hold the lattice together as ion layers slide, so it conducts well and is ductile.',
      },
    ],
  },
  {
    topicId: 'phys-physical-chemical-change',
    summary: 'Distinguishing physical from chemical change, and applying conservation of mass and energy to chemical reactions.',
    keyIdeas: [
      'In a physical change no new substance is formed, and the change is usually easy to reverse',
      'In a chemical change a new substance with new properties is formed, and bonds are broken and made',
      'Mass is conserved in a chemical reaction: the total mass of reactants equals the total mass of products',
      'An exothermic reaction releases energy and the temperature of the surroundings rises',
      'An endothermic reaction absorbs energy and the temperature of the surroundings falls',
    ],
    subtopics: [
      {
        name: 'Telling them apart',
        points: [
          'Signs of chemical change: a colour change, a gas given off, a precipitate forming, a temperature change, or light produced',
          'Physical changes include changes of state, dissolving, and cutting or crushing',
          'In a physical change the particles themselves are unchanged; only their arrangement or separation changes',
        ],
      },
      {
        name: 'Conservation of mass',
        points: [
          'Atoms are neither created nor destroyed, only rearranged',
          'A balanced equation therefore has the same number of each kind of atom on both sides',
          'If a gas escapes, the mass in an open container appears to fall, but the total mass is still conserved',
        ],
      },
      {
        name: 'Energy in reactions',
        points: [
          'Breaking bonds absorbs energy; making bonds releases energy',
          'Exothermic: more energy is released in making bonds than is absorbed in breaking them, so the container feels warm',
          'Endothermic: more energy is absorbed than released, so the container feels cold',
          'Combustion and neutralisation are exothermic; photosynthesis and thermal decomposition are endothermic',
        ],
      },
    ],
    commonMistakes: [
      'Dissolving salt in water is a physical change: the salt can be recovered by evaporation and no new substance forms',
      'Mass is still conserved when a gas escapes; it only appears to be lost because the gas has left the container',
      'Exothermic means the surroundings warm up, so the reaction itself is losing energy',
    ],
    example: {
      problem: 'A 5 g strip of magnesium is burnt in air and the ash produced has a mass of 8.3 g. Explain why the mass increased, and state whether the law of conservation of mass has been broken.',
      steps: [
        'Burning magnesium is a chemical change: magnesium reacts with oxygen from the air to form magnesium oxide.',
        'The oxygen atoms that join the magnesium come from the air and add to the mass of the solid product.',
        'The mass increase of 3.3 g is therefore the mass of oxygen that reacted.',
        'The law is not broken: the total mass of magnesium plus oxygen equals the mass of magnesium oxide formed.',
      ],
      answer: 'Oxygen from the air combined with the magnesium, adding 3.3 g; the law of conservation of mass holds once that oxygen is counted.',
    },
    moreExamples: [
      {
        problem: 'A learner mixes two solutions in a beaker and the beaker becomes noticeably cold. Classify the reaction and explain what is happening in terms of bonds.',
        steps: [
          'The beaker becoming cold means energy has been taken from the surroundings, so the reaction is endothermic.',
          'Breaking the bonds in the reactants absorbs energy from the surroundings.',
          'Forming the bonds in the products releases energy back.',
          'In this reaction more energy is absorbed in breaking bonds than is released in forming them, so there is a net absorption and the surroundings cool.',
        ],
        answer: 'It is endothermic: more energy is absorbed breaking reactant bonds than is released forming product bonds, so energy is taken from the surroundings.',
      },
    ],
  },
  {
    topicId: 'phys-vectors-2d',
    summary: 'Resolving vectors into perpendicular components and finding the resultant of vectors that are not in a straight line.',
    keyIdeas: [
      'Any vector can be replaced by two perpendicular components that together have the same effect',
      'The horizontal component is F cos(theta) and the vertical component is F sin(theta), with theta measured from the horizontal',
      'Components along the same line add algebraically',
      'The resultant magnitude comes from Pythagoras and its direction from the tangent ratio',
      'A body in equilibrium has a zero resultant, so the components in each direction must cancel',
    ],
    subtopics: [
      {
        name: 'Resolving into components',
        points: [
          'Draw the vector and the angle clearly before resolving',
          'Fx = F cos(theta), Fy = F sin(theta), when theta is measured from the horizontal',
          'Give each component a sign according to the positive directions you chose',
        ],
      },
      {
        name: 'Finding the resultant',
        points: [
          'Add all horizontal components to get Rx, and all vertical components to get Ry',
          'Magnitude R = square root of (Rx squared + Ry squared)',
          'Direction: tan(theta) = Ry / Rx, then state the angle relative to a named direction',
        ],
      },
      {
        name: 'Equilibrium',
        points: [
          'In equilibrium the resultant is zero, so Rx = 0 and Ry = 0',
          'The equilibrant is equal in magnitude and opposite in direction to the resultant',
          'For three forces in equilibrium, any one is the equilibrant of the other two',
        ],
      },
    ],
    formulae: [
      'Fx = F cos(theta); Fy = F sin(theta)',
      'R = sqrt(Rx^2 + Ry^2)',
      'tan(theta) = Ry / Rx',
    ],
    commonMistakes: [
      'Which component uses cosine depends on where the angle is measured from; always mark the angle on a sketch first',
      'Components must be given signs, or opposing forces will be added instead of subtracted',
      'The resultant of two vectors at an angle is not the sum of their magnitudes',
    ],
    example: {
      problem: 'A force of 50 N acts at 30 degrees above the horizontal. Calculate its horizontal and vertical components.',
      steps: [
        'The angle is measured from the horizontal, so the horizontal component uses cosine.',
        'Fx = 50 cos(30) = 50 x 0.866 = 43.3 N.',
        'The vertical component uses sine: Fy = 50 sin(30).',
        'Fy = 50 x 0.5 = 25 N.',
      ],
      answer: 'Fx = 43.3 N horizontally; Fy = 25 N vertically upwards.',
    },
    moreExamples: [
      {
        problem: 'Two forces act on an object: 40 N due east and 30 N due north. Calculate the magnitude and direction of the resultant.',
        steps: [
          'The forces are already perpendicular, so Rx = 40 N east and Ry = 30 N north.',
          'Magnitude R = sqrt(40^2 + 30^2) = sqrt(1600 + 900) = sqrt(2500) = 50 N.',
          'Direction: tan(theta) = Ry / Rx = 30 / 40 = 0.75.',
          'theta = 36.87 degrees, measured north of east.',
        ],
        answer: '50 N at 36.9 degrees north of east.',
      },
    ],
  },
  {
    topicId: 'phys-newtons-laws',
    summary: 'Newton\'s three laws of motion, friction, the normal force, and how to apply them to objects on horizontal surfaces, inclines and connected systems.',
    keyIdeas: [
      'A free-body diagram is the first step in every problem: draw only the forces acting on the one chosen object',
      'Newton\'s First Law: an object stays at rest or in uniform motion unless a net force acts on it',
      'Newton\'s Second Law: Fnet = m a, with the acceleration in the direction of the net force',
      'Newton\'s Third Law: forces occur in pairs, equal in magnitude and opposite in direction, acting on different objects',
      'Friction always opposes the motion, or the tendency to move',
    ],
    subtopics: [
      {
        name: 'Friction and the normal force',
        points: [
          'The normal force N is perpendicular to the surface; on a horizontal surface with no vertical applied force, N = m g',
          'Static friction holds an object still up to a maximum value; kinetic friction acts once it is moving',
          'Kinetic friction f = mu(k) x N, so friction depends on the surface and on the normal force, not on the contact area',
          'On an incline the normal force is N = m g cos(theta), so friction there is less than on a flat surface',
        ],
      },
      {
        name: 'Applying Fnet = m a',
        points: [
          'Choose a positive direction, resolve all forces along it, then sum them to get Fnet',
          'Fnet is the vector sum: subtract friction from the applied force when they oppose',
          'A constant velocity means a = 0, so Fnet = 0, which does not mean no forces act',
          'Solve connected bodies either as one system, or object by object using the shared tension',
        ],
      },
      {
        name: 'Newton\'s Third Law pairs',
        points: [
          'Action and reaction act on two different objects, so they never cancel each other out',
          'The weight of a book and the normal force on it are not a Third Law pair: both act on the book',
          'A correct pair example: the Earth pulls the book down, and the book pulls the Earth up with equal force',
        ],
      },
    ],
    formulae: [
      'Fnet = m a',
      'f(kinetic) = mu(k) x N',
      'N = m g on a horizontal surface; N = m g cos(theta) on an incline',
      'w = m g',
    ],
    commonMistakes: [
      'Newton\'s Third Law pairs act on different objects, so they cannot cancel',
      'A constant velocity means zero net force, not zero force',
      'Friction depends on the normal force and the coefficient, not on how large the contact area is',
    ],
    example: {
      problem: 'A 2 kg block is pulled across a rough horizontal surface by a constant force of 15 N. The coefficient of kinetic friction is 0.2. Calculate the frictional force, the net force and the acceleration. Use g = 9.8 m/s2.',
      steps: [
        'On a horizontal surface with a horizontal applied force, N = m g = 2 x 9.8 = 19.6 N.',
        'Frictional force f = mu x N = 0.2 x 19.6 = 3.92 N, acting opposite to the motion.',
        'Taking the direction of motion as positive, Fnet = 15 - 3.92 = 11.08 N.',
        'From Fnet = m a, a = 11.08 / 2 = 5.54 m/s2 in the direction of the applied force.',
      ],
      answer: 'Friction = 3.92 N; net force = 11.08 N; acceleration = 5.54 m/s2 in the direction of the pull.',
    },
    moreExamples: [
      {
        problem: 'Explain how the coefficient of friction affects motion in real-life situations, giving one case where a high value is wanted and one where a low value is wanted.',
        steps: [
          'The coefficient of friction sets how much frictional force a surface pair produces for a given normal force, through f = mu x N.',
          'A high coefficient is wanted between a tyre and the road: it gives a large friction force, which is what allows a car to accelerate, turn and brake without skidding.',
          'On a wet or icy road mu falls sharply, the maximum available friction drops, and the braking distance increases, which is why crashes are more likely.',
          'A low coefficient is wanted between moving machine parts, so oil is used to reduce mu, cutting wear and the energy wasted as heat.',
        ],
        answer: 'mu determines the friction available for a given normal force: high mu is wanted for tyre grip and braking, and low mu is wanted between lubricated machine parts to reduce wear and energy loss.',
      },
    ],
  },
  {
    topicId: 'phys-geometric-optics',
    summary: 'Refraction of light at a boundary, Snell\'s law, total internal reflection and its applications.',
    keyIdeas: [
      'Refraction is the change of direction of light when it passes between media of different optical density',
      'Light bends towards the normal entering a denser medium and away from the normal leaving it',
      'The refractive index n = c / v, so a larger n means light travels more slowly in that medium',
      'Snell\'s law: n1 sin(theta1) = n2 sin(theta2)',
      'Total internal reflection occurs only when light travels from a denser to a less dense medium at more than the critical angle',
    ],
    subtopics: [
      {
        name: 'Refraction',
        points: [
          'The normal is the line perpendicular to the surface at the point of incidence',
          'Angles are always measured from the normal, never from the surface',
          'The frequency of the light does not change on refraction; the speed and the wavelength do',
          'Light entering along the normal is not bent, though its speed still changes',
        ],
      },
      {
        name: 'Snell\'s law',
        points: [
          'n1 sin(theta1) = n2 sin(theta2), where 1 is the incident medium',
          'Refractive index of a vacuum is 1, of air about 1.0003, of water 1.33 and of glass about 1.5',
          'n = c / v, so v = c / n gives the speed of light in the medium',
        ],
      },
      {
        name: 'Total internal reflection',
        points: [
          'Two conditions: light travels from a more dense to a less dense medium, and the angle of incidence exceeds the critical angle',
          'sin(critical angle) = n2 / n1',
          'Applications: optical fibres for communication and endoscopy, and prisms in binoculars and periscopes',
        ],
      },
    ],
    formulae: [
      'n = c / v',
      'n1 sin(theta1) = n2 sin(theta2)',
      'sin(theta c) = n2 / n1',
    ],
    commonMistakes: [
      'Angles in Snell\'s law are measured from the normal, not from the surface',
      'Total internal reflection cannot happen going from less dense to more dense, whatever the angle',
      'Frequency is unchanged by refraction; it is the speed and wavelength that change',
    ],
    example: {
      problem: 'Light travels from air (n = 1) into glass (n = 1.5) with an angle of incidence of 30 degrees. Calculate the angle of refraction.',
      steps: [
        'Apply Snell\'s law: n1 sin(theta1) = n2 sin(theta2).',
        'Substitute: 1 x sin(30) = 1.5 x sin(theta2), so 0.5 = 1.5 sin(theta2).',
        'sin(theta2) = 0.5 / 1.5 = 0.3333.',
        'theta2 = 19.47 degrees, which is smaller than 30 degrees, as expected when entering a denser medium.',
      ],
      answer: 'About 19.5 degrees from the normal.',
    },
    moreExamples: [
      {
        problem: 'Calculate the critical angle for a water-to-air boundary, given that water has a refractive index of 1.33, and explain why a diver looking up sees a bright circle surrounded by darkness.',
        steps: [
          'Use sin(theta c) = n2 / n1 = 1 / 1.33 = 0.7519.',
          'theta c = 48.75 degrees.',
          'Light from above the surface can only reach the diver by refracting into the water, and all of it arrives within a cone of half-angle 48.75 degrees.',
          'Beyond that angle the water surface totally internally reflects light from below, so the diver sees the reflected dark water instead of the sky.',
        ],
        answer: 'About 48.8 degrees; outside that cone the surface totally internally reflects, so the diver sees darkness rather than sky.',
      },
    ],
  },
  {
    topicId: 'phys-wavefronts',
    summary: 'Wavefronts, Huygens\' principle, diffraction through a slit, and the conditions that make diffraction noticeable.',
    keyIdeas: [
      'A wavefront joins points that are in phase, and it travels perpendicular to itself',
      'Huygens\' principle: every point on a wavefront acts as a source of secondary wavelets',
      'Diffraction is the spreading of a wave as it passes through an opening or around an obstacle',
      'Diffraction is most noticeable when the slit width is comparable to the wavelength',
      'Diffraction does not change the frequency, the wavelength or the speed of the wave',
    ],
    subtopics: [
      {
        name: 'Wavefronts',
        points: [
          'Wavefronts are drawn as lines or curves joining points in phase, usually crests',
          'Rays are drawn perpendicular to wavefronts and show the direction of travel',
          'Far from a point source the wavefronts are almost straight, so they are treated as plane waves',
        ],
      },
      {
        name: 'Diffraction through a single slit',
        points: [
          'A narrow slit spreads the wave more; a wide slit spreads it less',
          'The amount of spreading depends on the ratio of wavelength to slit width',
          'A central bright band is flanked by dark bands where destructive interference occurs',
          'Dark bands occur where sin(theta) = m x wavelength / a, with m = 1, 2, 3 and a the slit width',
        ],
      },
      {
        name: 'Everyday evidence',
        points: [
          'Sound diffracts around a doorway because its wavelength is of a similar size to the opening',
          'Light diffracts very little through the same doorway because its wavelength is far smaller',
          'This is why you can hear around a corner but cannot see around it',
        ],
      },
    ],
    formulae: [
      'sin(theta) = m x wavelength / a, for dark bands in single-slit diffraction',
    ],
    commonMistakes: [
      'Diffraction does not change the wavelength or speed; it changes the direction and shape of the wavefront',
      'A narrower slit gives more spreading, not less',
      'Light does diffract, but its wavelength is so small that everyday openings produce almost no visible spreading',
    ],
    example: {
      problem: 'Monochromatic light of wavelength 600 nm passes through a slit 0.02 mm wide. Calculate the angle of the first dark band.',
      steps: [
        'Convert to metres: wavelength = 600 x 10^-9 m and a = 0.02 x 10^-3 m = 2 x 10^-5 m.',
        'Use sin(theta) = m x wavelength / a with m = 1.',
        'sin(theta) = (600 x 10^-9) / (2 x 10^-5) = 0.03.',
        'theta = 1.72 degrees.',
      ],
      answer: 'About 1.7 degrees from the centre.',
    },
    moreExamples: [
      {
        problem: 'Explain why a person can hear someone talking around the corner of a building but cannot see them.',
        steps: [
          'Both sound and light are waves, and both diffract when they pass an obstacle edge.',
          'The amount of diffraction depends on the ratio of the wavelength to the size of the opening or obstacle.',
          'Audible sound has wavelengths of roughly a metre, comparable to the size of the corner, so it spreads a great deal around it.',
          'Visible light has a wavelength of around 500 nanometres, vastly smaller than the corner, so it diffracts far too little to be noticed.',
        ],
        answer: 'Sound wavelengths are comparable to the size of the corner so sound diffracts strongly, while light wavelengths are far too small for noticeable diffraction.',
      },
    ],
  },
  {
    topicId: 'phys-electrostatics-g11',
    summary: 'Charge, Coulomb\'s law, and the electric field around point charges.',
    keyIdeas: [
      'Like charges repel and unlike charges attract',
      'Charge is quantised: Q = n x e, where e is 1.6 x 10^-19 C',
      'Charge is conserved: when identical spheres touch, the total charge is shared equally',
      'Coulomb\'s law gives the force between two point charges, and it is an inverse square law',
      'The electric field E is the force per unit positive charge at a point',
    ],
    subtopics: [
      {
        name: 'Charge',
        points: [
          'An object becomes negatively charged by gaining electrons and positively charged by losing them',
          'Q = n e, so the number of electrons transferred is n = Q / e',
          'When two identical conducting spheres touch, each ends with (Q1 + Q2) / 2',
        ],
      },
      {
        name: 'Coulomb\'s law',
        points: [
          'F = k Q1 Q2 / r^2, with k = 9 x 10^9 N m^2 / C^2',
          'Use magnitudes in the calculation and decide attraction or repulsion from the signs separately',
          'Doubling the separation divides the force by four, because it is an inverse square law',
          'For more than two charges, find each force separately and then add them as vectors',
        ],
      },
      {
        name: 'Electric fields',
        points: [
          'E = F / q, measured in N/C, and E = k Q / r^2 for a point charge',
          'Field lines point away from a positive charge and towards a negative charge',
          'Field lines never cross, and their density shows the field strength',
          'The field is zero at a point where the contributions of all charges cancel',
        ],
      },
    ],
    formulae: [
      'F = k Q1 Q2 / r^2, with k = 9 x 10^9',
      'E = F / q',
      'E = k Q / r^2',
      'Q = n e, with e = 1.6 x 10^-19 C',
    ],
    commonMistakes: [
      'Substitute magnitudes into Coulomb\'s law and decide the direction separately, rather than letting signs run through the arithmetic',
      'Distance is squared, so halving the separation multiplies the force by four, not by two',
      'Electric field strength is force per unit charge, so it exists even when no test charge is present',
    ],
    example: {
      problem: 'Two point charges of +3 microcoulomb and -2 microcoulomb are 0.05 m apart. Calculate the magnitude of the force between them and state whether it is attraction or repulsion.',
      steps: [
        'Use F = k Q1 Q2 / r^2 with magnitudes: Q1 = 3 x 10^-6 C, Q2 = 2 x 10^-6 C, r = 0.05 m.',
        'Numerator: 9 x 10^9 x 3 x 10^-6 x 2 x 10^-6 = 5.4 x 10^-2.',
        'Denominator: r^2 = 0.05^2 = 2.5 x 10^-3.',
        'F = 5.4 x 10^-2 / 2.5 x 10^-3 = 21.6 N. The charges have opposite signs, so the force is attractive.',
      ],
      answer: '21.6 N, attractive.',
    },
    moreExamples: [
      {
        problem: 'Two identical metal spheres carry charges of +8 nC and -2 nC. They are touched together and then separated. Calculate the charge on each afterwards, and the number of electrons transferred to the sphere that gains charge.',
        steps: [
          'Charge is conserved and the spheres are identical, so the total is shared equally.',
          'Total charge = (+8) + (-2) = +6 nC, so each sphere carries +3 nC.',
          'The sphere that was -2 nC becomes +3 nC, a change of +5 nC, so it lost 5 nC of negative charge.',
          'n = Q / e = (5 x 10^-9) / (1.6 x 10^-19) = 3.13 x 10^10 electrons left that sphere.',
        ],
        answer: 'Each carries +3 nC; about 3.13 x 10^10 electrons were transferred off the initially negative sphere.',
      },
    ],
  },
  {
    topicId: 'phys-electromagnetism',
    summary: 'The magnetic field produced by a current, and the induction of an emf by a changing magnetic flux.',
    keyIdeas: [
      'A current in a conductor produces a magnetic field around it',
      'The right-hand rule gives the direction of the field around a straight conductor',
      'A solenoid produces a field like that of a bar magnet, with a north and a south end',
      'Faraday\'s law: an emf is induced when the magnetic flux through a coil changes',
      'Lenz\'s law: the induced current opposes the change that produced it',
    ],
    subtopics: [
      {
        name: 'Magnetic field from a current',
        points: [
          'Straight conductor: grip the wire with the right hand, thumb along the current, and the fingers curl in the direction of the field',
          'The field is circular around the wire and weakens with distance',
          'Solenoid: curl the right-hand fingers along the current and the thumb points to the north pole',
          'Field strength increases with more current, more turns, and an iron core',
        ],
      },
      {
        name: 'Faraday\'s law',
        points: [
          'Magnetic flux = B A cos(theta), measured in webers',
          'An emf is induced only while the flux is changing',
          'Induced emf = -N x (change in flux) / (change in time)',
          'A faster change, more turns, or a stronger field all give a larger emf',
        ],
      },
      {
        name: 'Lenz\'s law and applications',
        points: [
          'The minus sign in Faraday\'s law expresses Lenz\'s law: the induced current opposes the change causing it',
          'Pushing a north pole into a coil induces a current that makes the near face a north pole, which repels the magnet',
          'This is a consequence of the conservation of energy: work must be done to keep the magnet moving',
          'Applications include generators, transformers and induction cooktops',
        ],
      },
    ],
    formulae: [
      'Magnetic flux = B A cos(theta)',
      'Induced emf = -N x (change in flux) / (change in time)',
    ],
    commonMistakes: [
      'A steady magnetic field induces no emf; only a changing flux does',
      'A magnet held still inside a coil induces nothing, however strong it is',
      'Lenz\'s law describes opposition to the change in flux, not to the flux itself',
    ],
    example: {
      problem: 'A coil of 200 turns has the magnetic flux through it change from 0.004 Wb to 0.010 Wb in 0.03 s. Calculate the magnitude of the induced emf.',
      steps: [
        'Change in flux = 0.010 - 0.004 = 0.006 Wb.',
        'Use emf = N x (change in flux) / (change in time), taking magnitude only.',
        'emf = 200 x 0.006 / 0.03.',
        'emf = 1.2 / 0.03 = 40 V.',
      ],
      answer: '40 V',
    },
    moreExamples: [
      {
        problem: 'A bar magnet is pushed north-pole-first into a coil connected to a galvanometer. Describe what happens, and explain why more force is needed than to move the magnet through empty space.',
        steps: [
          'As the magnet approaches, the magnetic flux through the coil increases, so by Faraday\'s law an emf is induced and the galvanometer deflects.',
          'By Lenz\'s law the induced current flows so as to oppose the increase in flux.',
          'The coil face nearest the magnet therefore becomes a north pole, which repels the approaching north pole of the magnet.',
          'Work must be done against this repulsion, and that work is what becomes the electrical energy in the coil, as the conservation of energy requires.',
        ],
        answer: 'A current is induced that makes the near coil face a north pole, repelling the magnet; the extra work done against that repulsion is what supplies the electrical energy.',
      },
    ],
  },
  {
    topicId: 'phys-electric-circuits-g11',
    summary: 'Current, potential difference and resistance, how they combine in series and parallel, and the effect of the internal resistance of a battery.',
    keyIdeas: [
      'Current is the rate of flow of charge; potential difference is the energy transferred per coulomb',
      'Ohm\'s law: V = I R, for an ohmic conductor at constant temperature',
      'In series the current is the same everywhere and the potential differences add',
      'In parallel the potential difference is the same across each branch and the currents add',
      'Emf is the total energy per coulomb supplied by the cell, and some of it is lost across the internal resistance',
    ],
    subtopics: [
      {
        name: 'Series circuits',
        points: [
          'Total resistance: Rs = R1 + R2 + R3, so adding a resistor always increases the total',
          'The same current flows through every component',
          'The supply potential difference is shared, and the largest resistance takes the largest share',
          'One break stops the current everywhere',
        ],
      },
      {
        name: 'Parallel circuits',
        points: [
          'Total resistance: 1 / Rp = 1 / R1 + 1 / R2, so the total is always less than the smallest branch',
          'Each branch has the full potential difference across it',
          'The current divides between branches, with more current through the smaller resistance',
          'One branch breaking leaves the others working',
        ],
      },
      {
        name: 'Internal resistance and power',
        points: [
          'emf = I(R + r), so the terminal potential difference V = emf - I r',
          'The terminal potential difference falls as the current drawn increases',
          'Power: P = V I = I^2 R = V^2 / R',
          'Energy: E = P t, measured in joules, or in kilowatt hours for electricity accounts',
        ],
      },
    ],
    formulae: [
      'V = I R',
      'Rs = R1 + R2 + R3',
      '1 / Rp = 1 / R1 + 1 / R2',
      'emf = I(R + r); V(terminal) = emf - I r',
      'P = V I = I^2 R = V^2 / R',
    ],
    commonMistakes: [
      'Adding a resistor in parallel decreases the total resistance, because it adds another path for the current',
      'The terminal potential difference is less than the emf whenever current flows, because of internal resistance',
      'In parallel the potential difference is the same across each branch; it is not divided between them',
    ],
    example: {
      problem: 'A 12 V battery is connected in series with two resistors of 4 ohm and 6 ohm. Calculate the total resistance, the current in the circuit, and the potential difference across the 6 ohm resistor.',
      steps: [
        'In series the resistances add: Rs = 4 + 6 = 10 ohm.',
        'Apply Ohm\'s law to the whole circuit: I = V / R = 12 / 10 = 1.2 A.',
        'In series the same current flows through both resistors, so 1.2 A flows through the 6 ohm resistor.',
        'Potential difference across it: V = I R = 1.2 x 6 = 7.2 V.',
      ],
      answer: 'Total resistance = 10 ohm; current = 1.2 A; potential difference across the 6 ohm resistor = 7.2 V.',
    },
    moreExamples: [
      {
        problem: 'A battery of emf 9 V and internal resistance 0.5 ohm is connected to a 4 ohm resistor. Calculate the current and the terminal potential difference, and explain why the terminal potential difference is less than the emf.',
        steps: [
          'Use emf = I(R + r): 9 = I(4 + 0.5) = I(4.5).',
          'Therefore I = 9 / 4.5 = 2 A.',
          'Terminal potential difference V = emf - I r = 9 - (2 x 0.5) = 9 - 1 = 8 V.',
          'The terminal value is lower because the current also passes through the internal resistance of the cell, so 1 V of energy per coulomb is used inside the battery itself.',
        ],
        answer: 'I = 2 A and V = 8 V; the missing 1 V is lost across the internal resistance inside the battery.',
      },
    ],
  },
  {
    topicId: 'phys-atomic-combinations',
    summary: 'Covalent bonding, Lewis structures, molecular shape from VSEPR theory, electronegativity and bond polarity.',
    keyIdeas: [
      'A covalent bond is a shared pair of electrons between two non-metal atoms',
      'A Lewis structure shows all valence electrons as bonding pairs and lone pairs',
      'VSEPR: electron pairs around the central atom repel and arrange themselves as far apart as possible',
      'Lone pairs repel more strongly than bonding pairs, so they squeeze the bond angles',
      'Electronegativity difference decides whether a bond is non-polar, polar covalent or ionic',
    ],
    subtopics: [
      {
        name: 'Lewis structures',
        points: [
          'Count the total valence electrons available',
          'Place a bonding pair between each pair of bonded atoms, then complete the octets with lone pairs',
          'Use double or triple bonds if there are not enough electrons to complete every octet',
          'Hydrogen needs only two electrons, not eight',
        ],
      },
      {
        name: 'Molecular shape',
        points: [
          '2 bonding pairs, no lone pairs: linear, 180 degrees',
          '3 bonding pairs, no lone pairs: trigonal planar, 120 degrees',
          '4 bonding pairs, no lone pairs: tetrahedral, 109.5 degrees',
          '3 bonding pairs and 1 lone pair: trigonal pyramidal, about 107 degrees; 2 bonding and 2 lone pairs: angular, about 104.5 degrees',
        ],
      },
      {
        name: 'Polarity',
        points: [
          'Electronegativity increases across a period and decreases down a group',
          'Difference less than 0.5 is non-polar covalent; 0.5 to 2.1 is polar covalent; above 2.1 is ionic',
          'A molecule is polar only if it has polar bonds AND an asymmetrical shape',
          'Symmetrical molecules such as CO2 and CCl4 are non-polar overall even though their bonds are polar',
        ],
      },
    ],
    formulae: [
      'Electronegativity difference = larger value minus smaller value',
      'Bond order: single = 1 shared pair, double = 2, triple = 3',
    ],
    commonMistakes: [
      'Polar bonds do not guarantee a polar molecule: the shape must also be asymmetrical',
      'Lone pairs affect the shape even though they are not drawn as bonds',
      'Molecular shape is named from the positions of the atoms, not of the lone pairs',
    ],
    example: {
      problem: 'Determine the shape of a water molecule and state the approximate bond angle.',
      steps: [
        'Oxygen has 6 valence electrons; two are shared with the two hydrogen atoms, leaving 2 lone pairs.',
        'The central oxygen therefore has 4 electron pairs: 2 bonding and 2 lone.',
        'Four pairs arrange themselves tetrahedrally, but the shape is named from the atom positions only, giving an angular (bent) molecule.',
        'The two lone pairs repel more strongly than bonding pairs, compressing the angle from 109.5 to about 104.5 degrees.',
      ],
      answer: 'Angular (bent), with a bond angle of about 104.5 degrees.',
    },
    moreExamples: [
      {
        problem: 'Tetrachloromethane, CCl4, contains four polar C-Cl bonds, yet the molecule is non-polar overall. Explain.',
        steps: [
          'Chlorine is more electronegative than carbon, so each C-Cl bond is polar, with the chlorine end slightly negative.',
          'The carbon atom has four bonding pairs and no lone pairs, so the molecule is tetrahedral and perfectly symmetrical.',
          'Each bond dipole is matched by an identical dipole pointing in the opposite sense across the molecule.',
          'The four bond dipoles therefore cancel as vectors, so the net dipole moment is zero and the molecule is non-polar.',
        ],
        answer: 'Its tetrahedral symmetry means the four equal bond dipoles cancel as vectors, leaving no net dipole.',
      },
    ],
  },
  {
    topicId: 'phys-intermolecular-forces',
    summary: 'The forces between molecules, how they differ from the bonds within molecules, and how they explain physical properties.',
    keyIdeas: [
      'Intermolecular forces act between molecules; intramolecular bonds act within them and are far stronger',
      'London (dispersion) forces exist between all molecules and strengthen with molecular size',
      'Dipole-dipole forces act between polar molecules',
      'Hydrogen bonding is the strongest, occurring when H is bonded to N, O or F',
      'Melting point, boiling point, viscosity and solubility all follow from the strength of these forces',
    ],
    subtopics: [
      {
        name: 'The three types',
        points: [
          'London forces: caused by momentary uneven electron distribution; present in every molecule, and stronger in larger molecules',
          'Dipole-dipole: between permanent dipoles in polar molecules',
          'Hydrogen bonding: a special, strong dipole-dipole force where H is bonded directly to N, O or F',
        ],
      },
      {
        name: 'Effects on properties',
        points: [
          'Stronger intermolecular forces give higher melting and boiling points, because more energy is needed to separate the molecules',
          'Stronger forces also give higher viscosity and higher surface tension, and lower vapour pressure',
          'Water has anomalously high boiling point, surface tension and specific heat capacity because of hydrogen bonding',
          'Ice is less dense than water because hydrogen bonds hold the molecules in an open lattice',
        ],
      },
      {
        name: 'Solubility',
        points: [
          'Like dissolves like: polar solutes dissolve in polar solvents, non-polar in non-polar',
          'A solute dissolves when solute-solvent forces are comparable to those being broken',
          'Oil does not dissolve in water because non-polar oil molecules cannot form hydrogen bonds with water',
        ],
      },
    ],
    commonMistakes: [
      'Boiling a molecular substance breaks intermolecular forces, not the covalent bonds inside molecules',
      'London forces exist in polar molecules too; they are not exclusive to non-polar ones',
      'Hydrogen bonding requires H bonded directly to N, O or F, not merely the presence of hydrogen',
    ],
    example: {
      problem: 'Water boils at 100 degrees Celsius while hydrogen sulfide, a molecule of similar size, boils at -60 degrees Celsius. Explain.',
      steps: [
        'Both are angular molecules of comparable size, so the difference is not one of London forces.',
        'In water, hydrogen is bonded directly to oxygen, which is highly electronegative, so the molecules form hydrogen bonds.',
        'In hydrogen sulfide, sulfur is much less electronegative, so only weaker dipole-dipole and London forces act.',
        'Far more energy is needed to overcome hydrogen bonds, so water boils at a much higher temperature.',
      ],
      answer: 'Water molecules form strong hydrogen bonds because H is bonded to O, while hydrogen sulfide has only weaker dipole-dipole and London forces.',
    },
    moreExamples: [
      {
        problem: 'Explain why ice floats on water, and state one environmental consequence.',
        steps: [
          'In liquid water, hydrogen bonds constantly break and reform, allowing the molecules to pack fairly closely.',
          'When water freezes, each molecule forms hydrogen bonds to four others in a fixed tetrahedral arrangement.',
          'This open lattice holds the molecules further apart on average than in the liquid, so ice is less dense and floats.',
          'As a consequence, a lake freezes from the top down, and the ice layer insulates the water below so aquatic life can survive the winter.',
        ],
        answer: 'Hydrogen bonding holds ice in an open lattice that is less dense than liquid water, so lakes freeze from the top and insulate the life below.',
      },
    ],
  },
  {
    topicId: 'phys-ideal-gases',
    summary: 'The gas laws, the ideal gas equation, and how the kinetic molecular theory explains gas behaviour.',
    keyIdeas: [
      'Temperature in every gas law must be in kelvin: K = degrees Celsius + 273',
      'Boyle\'s law: at constant temperature, pressure and volume are inversely proportional',
      'Charles\'s law: at constant pressure, volume is directly proportional to absolute temperature',
      'The general gas equation combines them: P1 V1 / T1 = P2 V2 / T2',
      'The ideal gas equation is p V = n R T, with R = 8.31 J per K per mol',
    ],
    subtopics: [
      {
        name: 'The gas laws',
        points: [
          'Boyle: P1 V1 = P2 V2 at constant T, giving a curved pressure-volume graph and a straight line against 1/V',
          'Charles: V1 / T1 = V2 / T2 at constant P',
          'Gay-Lussac: P1 / T1 = P2 / T2 at constant V',
          'Extrapolating a volume-temperature graph to zero volume gives absolute zero at -273 degrees Celsius',
        ],
      },
      {
        name: 'The ideal gas equation',
        points: [
          'p V = n R T, with p in pascal, V in cubic metres, n in moles and T in kelvin',
          'n = m / M, so the equation can also give the mass or the molar mass of a gas',
          'One mole of any gas occupies 22.4 dm3 at standard temperature and pressure',
        ],
      },
      {
        name: 'Kinetic explanation',
        points: [
          'Pressure arises from collisions of particles with the container walls',
          'Reducing volume gives more collisions per second on a smaller area, so pressure rises',
          'Raising temperature makes the particles move faster, so collisions are more frequent and harder',
          'A real gas departs from ideal behaviour at high pressure and low temperature, where intermolecular forces and particle volume matter',
        ],
      },
    ],
    formulae: [
      'P1 V1 / T1 = P2 V2 / T2',
      'p V = n R T, with R = 8.31',
      'K = degrees Celsius + 273',
      'n = m / M',
    ],
    commonMistakes: [
      'Temperature must be converted to kelvin before any gas law calculation',
      'Absolute zero is -273 degrees Celsius, which is 0 K, and no temperature can be lower',
      'Units must match R: pressure in pascal and volume in cubic metres',
    ],
    example: {
      problem: 'A gas occupies 2.5 dm3 at 27 degrees Celsius and 100 kPa. Calculate its volume at 77 degrees Celsius and 150 kPa.',
      steps: [
        'Convert temperatures to kelvin: T1 = 27 + 273 = 300 K, T2 = 77 + 273 = 350 K.',
        'Use P1 V1 / T1 = P2 V2 / T2, rearranged as V2 = P1 V1 T2 / (T1 P2).',
        'Substitute: V2 = (100 x 2.5 x 350) / (300 x 150).',
        'V2 = 87 500 / 45 000 = 1.94 dm3.',
      ],
      answer: 'About 1.94 dm3',
    },
    moreExamples: [
      {
        problem: 'Explain, using the kinetic molecular theory, why the pressure of a fixed mass of gas rises when it is heated at constant volume.',
        steps: [
          'Pressure is caused by gas particles colliding with the walls of the container.',
          'Heating the gas increases the average kinetic energy of the particles, so they move faster.',
          'Faster particles strike the walls more often in a given time, and each collision delivers a greater force.',
          'With the area of the walls unchanged, more frequent and harder collisions mean a greater force per unit area, so the pressure rises.',
        ],
        answer: 'Heating makes the particles move faster, so collisions with the walls are both more frequent and more forceful, raising the pressure.',
      },
    ],
  },
  {
    topicId: 'phys-quantitative-chem-change',
    summary: 'The mole concept, molar calculations, concentration, limiting reagents and percentage yield.',
    keyIdeas: [
      'One mole contains 6.02 x 10^23 particles, which is Avogadro\'s number',
      'n = m / M links moles, mass in grams and molar mass in grams per mole',
      'For solutions, c = n / V, with V in cubic decimetres',
      'For gases at STP, n = V / 22.4, with V in cubic decimetres',
      'The limiting reagent is the one that runs out first and therefore decides how much product forms',
    ],
    subtopics: [
      {
        name: 'Mole calculations',
        points: [
          'n = m / M for a solid or liquid of known mass',
          'n = N / NA when working with a number of particles',
          'n = c V for a solution; n = V / 22.4 for a gas at STP',
          'Always work through moles: convert to moles, use the mole ratio from the balanced equation, then convert back',
        ],
      },
      {
        name: 'Limiting reagents',
        points: [
          'Calculate the moles of each reactant available',
          'Divide each by its coefficient in the balanced equation; the smallest value identifies the limiting reagent',
          'Use the limiting reagent for all product calculations, since the other reactant is in excess',
        ],
      },
      {
        name: 'Yield and composition',
        points: [
          'Percentage yield = (actual yield / theoretical yield) x 100',
          'Yields fall short because of side reactions, incomplete reactions and losses in handling',
          'Percentage composition of an element = (mass of that element in one mole / molar mass) x 100',
          'Empirical formula is the simplest whole-number ratio of atoms; molecular formula is a whole-number multiple of it',
        ],
      },
    ],
    formulae: [
      'n = m / M',
      'n = N / NA, with NA = 6.02 x 10^23',
      'c = n / V (V in dm3)',
      'n = V / 22.4 at STP',
      'percentage yield = (actual / theoretical) x 100',
    ],
    commonMistakes: [
      'The mole ratio comes from the balanced equation, so the equation must be balanced first',
      'Volume must be in cubic decimetres for concentration, so millilitres have to be converted',
      'Never use mass ratios directly in place of mole ratios',
    ],
    example: {
      problem: 'Calculate the mass of carbon dioxide produced when 10 g of calcium carbonate decomposes completely. CaCO3 gives CaO + CO2. Molar masses: CaCO3 = 100 g/mol, CO2 = 44 g/mol.',
      steps: [
        'Moles of CaCO3 = m / M = 10 / 100 = 0.1 mol.',
        'From the balanced equation the mole ratio CaCO3 to CO2 is 1 to 1.',
        'So moles of CO2 = 0.1 mol.',
        'Mass of CO2 = n x M = 0.1 x 44 = 4.4 g.',
      ],
      answer: '4.4 g',
    },
    moreExamples: [
      {
        problem: '5.6 g of iron reacts with 4.0 g of sulfur to form iron(II) sulfide, FeS. Identify the limiting reagent and calculate the maximum mass of FeS. Molar masses: Fe = 56, S = 32, FeS = 88 g/mol.',
        steps: [
          'Moles of Fe = 5.6 / 56 = 0.1 mol; moles of S = 4.0 / 32 = 0.125 mol.',
          'The balanced equation Fe + S gives FeS has a 1 to 1 ratio, so 0.1 mol of Fe needs only 0.1 mol of S.',
          'Iron runs out first, so iron is the limiting reagent and 0.025 mol of sulfur is in excess.',
          'Moles of FeS = 0.1 mol, so mass = 0.1 x 88 = 8.8 g.',
        ],
        answer: 'Iron is limiting; the maximum mass of FeS is 8.8 g.',
      },
    ],
  },
  {
    topicId: 'phys-energy-chem-change',
    summary: 'Exothermic and endothermic reactions, activation energy, energy profile diagrams, and bond energy calculations.',
    keyIdeas: [
      'Breaking bonds absorbs energy; forming bonds releases energy',
      'Exothermic reactions release energy overall, so delta H is negative',
      'Endothermic reactions absorb energy overall, so delta H is positive',
      'Activation energy is the minimum energy needed for a successful collision',
      'A catalyst provides an alternative route with a lower activation energy, and is not used up',
    ],
    subtopics: [
      {
        name: 'Energy changes',
        points: [
          'Exothermic: products have less energy than reactants, and the surroundings warm up; examples are combustion and neutralisation',
          'Endothermic: products have more energy than reactants, and the surroundings cool; examples are photosynthesis and thermal decomposition',
          'delta H is the heat of reaction in kJ per mol',
        ],
      },
      {
        name: 'Energy profile diagrams',
        points: [
          'Show reactants on the left, products on the right, with the activation energy hump between',
          'For an exothermic reaction the products are drawn lower than the reactants; for endothermic, higher',
          'delta H is the vertical difference between reactants and products',
          'A catalyst lowers the hump, but does not change the position of reactants or products, so delta H is unchanged',
        ],
      },
      {
        name: 'Bond energy calculations',
        points: [
          'delta H = (total energy to break all reactant bonds) - (total energy released forming all product bonds)',
          'A negative result means exothermic and a positive result means endothermic',
          'Count every bond, including all the bonds in a polyatomic molecule',
        ],
      },
    ],
    formulae: [
      'delta H = energy of bonds broken - energy of bonds formed',
      'Exothermic: delta H is negative; endothermic: delta H is positive',
    ],
    commonMistakes: [
      'A catalyst changes the activation energy but never changes delta H',
      'delta H negative means energy is released, so the surroundings get hotter',
      'Bond breaking is endothermic and bond forming is exothermic, which is the reverse of many learners\' first instinct',
    ],
    example: {
      problem: 'For a reaction, breaking the reactant bonds requires 1 850 kJ and forming the product bonds releases 2 100 kJ. Calculate delta H and classify the reaction.',
      steps: [
        'Use delta H = energy of bonds broken - energy of bonds formed.',
        'Substitute: delta H = 1 850 - 2 100.',
        'delta H = -250 kJ.',
        'The value is negative, so more energy is released than absorbed and the reaction is exothermic.',
      ],
      answer: 'delta H = -250 kJ, an exothermic reaction.',
    },
    moreExamples: [
      {
        problem: 'A catalyst is added to a reaction. Describe the effect on the activation energy, on delta H, and on the energy profile diagram.',
        steps: [
          'The catalyst provides an alternative reaction pathway requiring less energy for a successful collision.',
          'The activation energy is therefore lowered, so a greater fraction of collisions are successful and the rate increases.',
          'The energies of the reactants and of the products are unchanged, because the catalyst is not consumed and does not appear in the overall equation.',
          'On the diagram the hump is lower, but the reactant and product levels, and hence the vertical gap that is delta H, stay exactly where they were.',
        ],
        answer: 'Activation energy falls and the rate rises, but delta H is unchanged: only the height of the hump changes on the profile.',
      },
    ],
  },
  {
    topicId: 'phys-types-of-reactions',
    summary: 'Acid-base and redox reactions, oxidation numbers, and how to recognise each reaction type.',
    keyIdeas: [
      'An acid donates a proton; a base accepts one, which is the Bronsted-Lowry definition',
      'Neutralisation produces a salt and water and is exothermic',
      'Oxidation is the loss of electrons and reduction is the gain of electrons',
      'In a redox reaction the oxidation number of at least one element changes',
      'The oxidising agent is itself reduced, and the reducing agent is itself oxidised',
    ],
    subtopics: [
      {
        name: 'Acids and bases',
        points: [
          'Strong acids ionise completely: HCl, HNO3, H2SO4; weak acids ionise partially, for example ethanoic acid',
          'Conjugate pairs differ by one proton, for example HCl and Cl-',
          'Acid plus metal hydroxide gives salt plus water; acid plus metal carbonate gives salt plus water plus carbon dioxide',
          'Amphoteric substances such as water can act as either acid or base',
        ],
      },
      {
        name: 'Oxidation numbers',
        points: [
          'An uncombined element has an oxidation number of 0',
          'Hydrogen is usually +1, oxygen usually -2, and the sum for a neutral compound is 0',
          'For an ion the sum equals the charge on the ion',
          'Compare the oxidation number before and after to identify what was oxidised and what was reduced',
        ],
      },
      {
        name: 'Recognising reaction types',
        points: [
          'Synthesis, decomposition, and displacement reactions are usually redox',
          'Precipitation and simple acid-base neutralisation are not redox, because no oxidation number changes',
          'A more reactive metal displaces a less reactive one from solution, which is a redox process',
        ],
      },
    ],
    formulae: [
      'Sum of oxidation numbers = 0 for a neutral compound, or the charge for an ion',
      'Oxidation is loss of electrons, reduction is gain: OIL RIG',
    ],
    commonMistakes: [
      'Neutralisation is not a redox reaction: no oxidation number changes',
      'The oxidising agent is reduced, not oxidised; it causes oxidation in something else',
      'Oxidation numbers are per atom, so they are not multiplied by the subscript when written',
    ],
    example: {
      problem: 'Determine the oxidation number of sulfur in H2SO4.',
      steps: [
        'Hydrogen is +1 and there are two of them, giving +2 in total.',
        'Oxygen is -2 and there are four of them, giving -8 in total.',
        'The compound is neutral, so the sum of all oxidation numbers is 0: (+2) + S + (-8) = 0.',
        'Therefore S - 6 = 0, so S = +6.',
      ],
      answer: '+6',
    },
    moreExamples: [
      {
        problem: 'Zinc metal is placed in copper(II) sulfate solution and a reddish-brown deposit forms. Identify what is oxidised, what is reduced, and name the oxidising agent.',
        steps: [
          'Zinc metal starts at oxidation number 0 and ends as Zn2+ in solution, so it loses two electrons and is oxidised.',
          'Copper starts as Cu2+ in solution and ends as copper metal at 0, so it gains two electrons and is reduced.',
          'The reddish-brown deposit is the copper metal formed.',
          'The species that is reduced is the oxidising agent, so Cu2+ is the oxidising agent and zinc is the reducing agent.',
        ],
        answer: 'Zinc is oxidised, Cu2+ is reduced, and Cu2+ is therefore the oxidising agent.',
      },
    ],
  },
  {
    topicId: 'phys-momentum-impulse',
    summary: 'Momentum, impulse and the conservation of momentum in collisions and explosions.',
    keyIdeas: [
      'Momentum p = m v is a vector, so direction matters and a positive direction must be chosen',
      'Impulse is the change in momentum, and equals the net force multiplied by the contact time',
      'Newton\'s Second Law in momentum form: Fnet = change in momentum / change in time',
      'Momentum is conserved in an isolated system, that is when no external net force acts',
      'Kinetic energy is conserved only in an elastic collision, never in an inelastic one',
    ],
    subtopics: [
      {
        name: 'Momentum and impulse',
        points: [
          'p = m v, measured in kg m/s',
          'Impulse = Fnet x change in time = change in momentum = m vf - m vi',
          'Units of impulse, N s, are equivalent to kg m/s',
          'Impulse is a vector in the direction of the net force',
        ],
      },
      {
        name: 'Conservation of momentum',
        points: [
          'Total momentum before = total momentum after, for an isolated system',
          'Elastic collision: both momentum and kinetic energy are conserved',
          'Inelastic collision: momentum is conserved but kinetic energy is not, as some becomes heat and sound',
          'In a perfectly inelastic collision the objects move off together with a common velocity',
        ],
      },
      {
        name: 'Safety applications',
        points: [
          'For a given change in momentum, extending the contact time reduces the force, since Fnet = change in momentum / change in time',
          'Airbags, crumple zones, helmet padding and bending the knees on landing all work this way',
          'They do not reduce the change in momentum; they spread it over a longer time',
        ],
      },
    ],
    formulae: [
      'p = m v',
      'Impulse = Fnet x change in time = change in p = m vf - m vi',
      'Fnet = change in p / change in t',
      'Total p before = total p after',
    ],
    commonMistakes: [
      'Momentum is a vector: opposite directions must be given opposite signs before adding',
      'An airbag does not reduce the change in momentum; it lengthens the time, which reduces the force',
      'Kinetic energy is not conserved in an inelastic collision, though momentum still is',
    ],
    example: {
      problem: 'A 1 200 kg car travelling east at 20 m/s collides with a stationary 800 kg car and they move off together. Calculate their common velocity.',
      steps: [
        'Take east as positive. Total momentum before = (1 200 x 20) + (800 x 0) = 24 000 kg m/s.',
        'The system is isolated, so total momentum after equals total momentum before.',
        'After the collision the combined mass is 1 200 + 800 = 2 000 kg moving at a common velocity v.',
        'So 2 000 v = 24 000, giving v = 12 m/s east.',
      ],
      answer: '12 m/s east',
    },
    moreExamples: [
      {
        problem: 'A 0.15 kg ball strikes a wall at 12 m/s and rebounds at 8 m/s. The contact lasts 0.05 s. Calculate the impulse and the average force on the ball.',
        steps: [
          'Take the direction towards the wall as positive, so vi = +12 m/s and vf = -8 m/s.',
          'Change in momentum = m vf - m vi = 0.15(-8) - 0.15(12) = -1.2 - 1.8 = -3 kg m/s.',
          'Impulse equals the change in momentum, so it is 3 N s directed away from the wall.',
          'Fnet = change in p / change in t = -3 / 0.05 = -60 N, that is 60 N directed away from the wall.',
        ],
        answer: 'Impulse = 3 N s and average force = 60 N, both directed away from the wall.',
      },
    ],
  },
  {
    topicId: 'phys-vertical-projectile',
    summary: 'Objects moving vertically under gravity alone, and how to read their position, velocity and acceleration graphs.',
    keyIdeas: [
      'A projectile in free fall has only gravity acting on it, so a = 9.8 m/s2 downwards at every moment',
      'Acceleration is constant throughout, including at the highest point where the velocity is zero',
      'Choose one positive direction and keep it for the whole problem, including for g',
      'Time up equals time down, and the speed on return to the launch height equals the launch speed',
      'The equations of motion apply because the acceleration is uniform',
    ],
    subtopics: [
      {
        name: 'Applying the equations',
        points: [
          'Taking upwards as positive makes g = -9.8 m/s2',
          'At the maximum height the velocity is zero, but the acceleration is still -9.8 m/s2',
          'Displacement is the change in position, so an object returning to its start has zero displacement',
          'For an object dropped from rest, vi = 0',
        ],
      },
      {
        name: 'Graphs',
        points: [
          'Position-time: a parabola, with the turning point at the maximum height',
          'Velocity-time: a straight line of gradient -9.8, crossing zero at the top of the flight',
          'Acceleration-time: a horizontal line at -9.8 throughout',
          'The area under the velocity-time graph gives the displacement, with area below the axis counted as negative',
        ],
      },
      {
        name: 'Bouncing objects',
        points: [
          'On each bounce the velocity reverses direction, shown as a sudden jump on the velocity-time graph',
          'If the collision is not elastic the rebound speed is lower, so each successive peak is lower',
          'During contact with the ground the acceleration is not -9.8, because the ground exerts a force too',
        ],
      },
    ],
    formulae: [
      'vf = vi + a t',
      'dy = vi t + 1/2 a t^2',
      'vf^2 = vi^2 + 2 a dy',
      'dy = ((vi + vf) / 2) t',
    ],
    commonMistakes: [
      'Acceleration is 9.8 m/s2 downwards at the top of the flight, even though the velocity is momentarily zero',
      'Distance and displacement differ for an object that goes up and comes back down',
      'Once a positive direction is chosen, g must carry the matching sign for the whole calculation',
    ],
    example: {
      problem: 'A ball is thrown vertically upwards at 20 m/s. Calculate the maximum height and the total time in the air before it returns to the throwing point.',
      steps: [
        'Take upwards as positive: vi = +20 m/s, a = -9.8 m/s2, and vf = 0 at the top.',
        'Use vf^2 = vi^2 + 2 a dy: 0 = 400 + 2(-9.8)dy, so dy = 400 / 19.6 = 20.41 m.',
        'Time to the top: vf = vi + a t gives 0 = 20 - 9.8 t, so t = 2.04 s.',
        'Time up equals time down, so the total time in the air is 2 x 2.04 = 4.08 s.',
      ],
      answer: 'Maximum height about 20.4 m; total time in the air about 4.08 s.',
    },
    moreExamples: [
      {
        problem: 'Sketch and describe the velocity-time graph for a ball thrown upwards that returns to the thrower\'s hand, taking upwards as positive.',
        steps: [
          'The graph starts at the positive launch velocity on the vertical axis.',
          'It is a straight line with a constant negative gradient of -9.8 m/s2, because the acceleration is constant.',
          'It crosses the time axis at the moment of maximum height, where the velocity is zero.',
          'It continues below the axis to a negative value equal in magnitude to the launch velocity, since the ball returns at the same speed but in the opposite direction.',
        ],
        answer: 'A straight line of gradient -9.8, starting positive, crossing zero at maximum height, and ending at the negative of the launch velocity.',
      },
    ],
  },
  {
    topicId: 'phys-work-energy-power',
    summary: 'Work done by a force, the work-energy theorem, conservation of mechanical energy, and power.',
    keyIdeas: [
      'Work is done only when a force has a component along the displacement',
      'W = F d cos(theta), where theta is the angle between the force and the displacement',
      'The work-energy theorem: the net work done equals the change in kinetic energy',
      'A force perpendicular to the motion does no work, which is why the normal force does none',
      'Power is the rate of doing work, measured in watts',
    ],
    subtopics: [
      {
        name: 'Work',
        points: [
          'W = F d cos(theta), in joules',
          'Work is positive when the force has a component along the motion and negative when it opposes it',
          'Friction always does negative work, removing kinetic energy',
          'Gravity does positive work on a falling object and negative work on a rising one',
        ],
      },
      {
        name: 'The work-energy theorem',
        points: [
          'Wnet = change in Ek = 1/2 m vf^2 - 1/2 m vi^2',
          'Wnet is the sum of the work done by every force, including friction',
          'This is often quicker than using the equations of motion, especially when the force varies',
        ],
      },
      {
        name: 'Conservative forces and power',
        points: [
          'Gravity is conservative: the work it does depends only on the height change, not on the path',
          'Friction is non-conservative: the work it does depends on the path taken',
          'Mechanical energy is conserved only when no non-conservative force does work',
          'P = W / t, and for a constant velocity against a resistive force, P = F v',
        ],
      },
    ],
    formulae: [
      'W = F d cos(theta)',
      'Wnet = change in Ek = 1/2 m vf^2 - 1/2 m vi^2',
      'P = W / t',
      'P = F v',
    ],
    commonMistakes: [
      'Carrying a box horizontally at constant speed does no work against gravity, because the force is perpendicular to the motion',
      'Friction does negative work, so it must be subtracted, not added, when finding net work',
      'Power and energy are different quantities: a more powerful machine does the same work in less time',
    ],
    example: {
      problem: 'A 5 kg box is pulled 8 m along a horizontal floor by a 30 N force parallel to the floor, against 10 N of friction. Calculate the net work done and the final speed if it started from rest.',
      steps: [
        'Work by the applied force = 30 x 8 x cos(0) = 240 J.',
        'Work by friction = 10 x 8 x cos(180) = -80 J. The normal force and weight do no work, since they are perpendicular to the motion.',
        'Net work = 240 - 80 = 160 J.',
        'By the work-energy theorem, 160 = 1/2 x 5 x vf^2 - 0, so vf^2 = 64 and vf = 8 m/s.',
      ],
      answer: 'Net work = 160 J; final speed = 8 m/s.',
    },
    moreExamples: [
      {
        problem: 'A 900 kg lift is raised 24 m in 16 s at constant speed. Calculate the power output of the motor. Use g = 9.8 m/s2.',
        steps: [
          'At constant speed there is no change in kinetic energy, so the motor works only against gravity.',
          'Force needed = weight = m g = 900 x 9.8 = 8 820 N.',
          'Work done = F d = 8 820 x 24 = 211 680 J.',
          'Power = W / t = 211 680 / 16 = 13 230 W, or about 13.2 kW.',
        ],
        answer: 'About 13.2 kW',
      },
    ],
  },
  {
    topicId: 'phys-doppler-effect',
    summary: 'The change in observed frequency when a source or observer moves, and its applications in medicine and astronomy.',
    keyIdeas: [
      'The Doppler effect is the apparent change in frequency caused by relative motion between source and observer',
      'Approaching means the observed frequency is higher than the emitted frequency',
      'Receding means the observed frequency is lower',
      'The source itself does not change what it emits; only the observed frequency changes',
      'For light, a receding source is red-shifted and an approaching source is blue-shifted',
    ],
    subtopics: [
      {
        name: 'The equation',
        points: [
          'fL = fs x (v plus or minus vL) / (v plus or minus vs)',
          'Use the sign that makes the observed frequency rise when they approach and fall when they separate',
          'v is the speed of sound in the medium, about 340 m/s in air',
          'Check the answer against physical sense before writing it down',
        ],
      },
      {
        name: 'Explanation',
        points: [
          'An approaching source catches up slightly with its own wavefronts, so they bunch and the wavelength shortens',
          'A receding source leaves its wavefronts behind, so they spread and the wavelength lengthens',
          'Since v = f x wavelength and v is fixed by the medium, a shorter wavelength means a higher frequency',
        ],
      },
      {
        name: 'Applications',
        points: [
          'An ambulance siren drops in pitch as it passes, because it changes from approaching to receding',
          'Doppler ultrasound measures the speed of blood flow and monitors a foetal heartbeat',
          'Red shift in the light from distant galaxies shows that they are receding, which is evidence for an expanding universe',
          'Doppler radar measures vehicle speed and tracks weather systems',
        ],
      },
    ],
    formulae: [
      'fL = fs (v plus or minus vL) / (v plus or minus vs)',
      'v = f x wavelength',
    ],
    commonMistakes: [
      'The pitch does not fall gradually as the siren approaches: it stays higher than normal, then drops as it passes',
      'The emitted frequency is unchanged; it is the observed frequency that differs',
      'The speed of the wave in the medium is unchanged by the motion of the source',
    ],
    example: {
      problem: 'An ambulance siren emits 800 Hz and moves towards a stationary observer at 30 m/s. The speed of sound is 340 m/s. Calculate the observed frequency.',
      steps: [
        'The observer is stationary, so vL = 0, and the source approaches, so the observed frequency must be higher.',
        'Use fL = fs x v / (v - vs) to make the result larger.',
        'fL = 800 x 340 / (340 - 30) = 800 x 340 / 310.',
        'fL = 272 000 / 310 = 877.4 Hz, which is indeed higher than 800 Hz.',
      ],
      answer: 'About 877 Hz',
    },
    moreExamples: [
      {
        problem: 'Light from a distant galaxy is found to be shifted towards the red end of the spectrum. State what this shows and explain the reasoning.',
        steps: [
          'Red light has a longer wavelength than the rest of the visible spectrum, so a red shift means the observed wavelength is longer than the wavelength emitted.',
          'By the Doppler effect, a longer observed wavelength, and so a lower observed frequency, means the source is moving away from the observer.',
          'The galaxy is therefore receding from Earth.',
          'Since almost all distant galaxies show a red shift, and the shift is larger for more distant ones, this is evidence that the universe is expanding.',
        ],
        answer: 'The galaxy is receding; the red shift means a longer observed wavelength, and the pattern across all galaxies is evidence for an expanding universe.',
      },
    ],
  },
  {
    topicId: 'phys-electrostatics',
    summary: 'Coulomb\'s law and electric fields for point charges, including the vector addition of forces and fields.',
    keyIdeas: [
      'Coulomb\'s law: F = k Q1 Q2 / r^2, an inverse square law',
      'Electric field strength E = F / q is the force per unit positive charge',
      'For a point charge, E = k Q / r^2',
      'Forces and fields from several charges are added as vectors, not as numbers',
      'Charge is conserved and quantised',
    ],
    subtopics: [
      {
        name: 'Coulomb\'s law',
        points: [
          'Substitute magnitudes and decide direction from the signs separately',
          'The force on each charge is equal in magnitude and opposite in direction, by Newton\'s Third Law',
          'Doubling one charge doubles the force; doubling the separation quarters it',
        ],
      },
      {
        name: 'Electric field',
        points: [
          'E is a vector, measured in N/C, pointing away from a positive source charge',
          'The field at a point due to several charges is the vector sum of the individual fields',
          'Between two equal and opposite charges the fields add along the line joining them',
          'Between two equal like charges the field is zero at the midpoint',
        ],
      },
      {
        name: 'Working in one dimension',
        points: [
          'Set a positive direction along the line of the charges',
          'Work out each contribution separately, with its sign, then add',
          'A zero-field point between two like charges lies nearer the smaller charge',
        ],
      },
    ],
    formulae: [
      'F = k Q1 Q2 / r^2, with k = 9 x 10^9',
      'E = F / q',
      'E = k Q / r^2',
    ],
    commonMistakes: [
      'Fields and forces from several charges must be added as vectors, so directions matter',
      'Distance is squared, so errors in r are magnified',
      'The field due to a point charge depends on the source charge only, not on the test charge placed there',
    ],
    example: {
      problem: 'Calculate the electric field strength 0.02 m from a point charge of +4 microcoulomb.',
      steps: [
        'Use E = k Q / r^2 for a point charge.',
        'Substitute: E = (9 x 10^9 x 4 x 10^-6) / (0.02)^2.',
        'Numerator = 3.6 x 10^4; denominator = 4 x 10^-4.',
        'E = 3.6 x 10^4 / 4 x 10^-4 = 9 x 10^7 N/C, directed away from the positive charge.',
      ],
      answer: '9 x 10^7 N/C directed away from the charge.',
    },
    moreExamples: [
      {
        problem: 'Charges Q1 = +5 nC and Q2 = -3 nC lie 0.04 m apart. Calculate the magnitude and direction of the net electric field at the midpoint between them.',
        steps: [
          'The midpoint is 0.02 m from each charge.',
          'Field from Q1: E1 = (9 x 10^9 x 5 x 10^-9) / (0.02)^2 = 45 / 4 x 10^-4 = 1.125 x 10^5 N/C, directed away from Q1, that is towards Q2.',
          'Field from Q2: E2 = (9 x 10^9 x 3 x 10^-9) / (0.02)^2 = 27 / 4 x 10^-4 = 6.75 x 10^4 N/C, directed towards Q2 since Q2 is negative.',
          'Both fields point the same way, so they add: E = 1.125 x 10^5 + 0.675 x 10^5 = 1.8 x 10^5 N/C, directed from Q1 towards Q2.',
        ],
        answer: '1.8 x 10^5 N/C, directed from the positive charge towards the negative charge.',
      },
    ],
  },
  {
    topicId: 'phys-electric-circuits',
    summary: 'Ohm\'s law, series and parallel combinations, internal resistance, and electrical power and cost.',
    keyIdeas: [
      'Ohm\'s law V = I R holds for an ohmic conductor at constant temperature',
      'Series: the current is the same throughout and the potential differences add',
      'Parallel: the potential difference is the same across each branch and the currents add',
      'emf = I(R + r), so the terminal potential difference falls as more current is drawn',
      'Power P = V I = I^2 R = V^2 / R',
    ],
    subtopics: [
      {
        name: 'Combining resistors',
        points: [
          'Rs = R1 + R2 + R3 in series',
          '1 / Rp = 1 / R1 + 1 / R2 in parallel, and the total is always smaller than the smallest branch',
          'For two resistors in parallel, Rp = R1 R2 / (R1 + R2)',
          'Reduce a complex network step by step, innermost combination first',
        ],
      },
      {
        name: 'Internal resistance',
        points: [
          'A real cell has internal resistance r, so some energy per coulomb is used inside it',
          'Terminal potential difference V = emf - I r, so it falls as the current rises',
          'Reading the emf requires an open circuit, when no current flows',
          'A short circuit draws a very large current, so the terminal potential difference collapses',
        ],
      },
      {
        name: 'Power and cost',
        points: [
          'P = V I, with the alternative forms I^2 R and V^2 / R',
          'Energy E = P t; for household accounts energy is billed in kilowatt hours',
          '1 kWh is the energy used by a 1 kW appliance running for 1 hour',
          'Cost = number of kilowatt hours multiplied by the tariff per kWh',
        ],
      },
    ],
    formulae: [
      'V = I R',
      'Rs = R1 + R2; 1 / Rp = 1 / R1 + 1 / R2',
      'emf = I(R + r); V = emf - I r',
      'P = V I = I^2 R = V^2 / R',
      'E = P t; 1 kWh = 3.6 x 10^6 J',
    ],
    commonMistakes: [
      'Adding a parallel branch lowers the total resistance and therefore raises the total current',
      'The potential difference across parallel branches is the same, not shared',
      'A voltmeter is connected in parallel and an ammeter in series',
    ],
    example: {
      problem: 'A 12 V battery of negligible internal resistance is connected to a 4 ohm resistor in series with two 6 ohm resistors in parallel. Calculate the total resistance and the current from the battery.',
      steps: [
        'First combine the parallel pair: Rp = (6 x 6) / (6 + 6) = 36 / 12 = 3 ohm.',
        'This 3 ohm is in series with the 4 ohm resistor, so Rtotal = 4 + 3 = 7 ohm.',
        'Apply Ohm\'s law to the whole circuit: I = V / R.',
        'I = 12 / 7 = 1.71 A.',
      ],
      answer: 'Total resistance = 7 ohm; current = 1.71 A.',
    },
    moreExamples: [
      {
        problem: 'A 2 000 W heater runs for 3 hours a day for 30 days. Electricity costs R2.60 per kWh. Calculate the monthly cost.',
        steps: [
          'Convert the power to kilowatts: 2 000 W = 2 kW.',
          'Energy per day = P t = 2 x 3 = 6 kWh.',
          'Energy per month = 6 x 30 = 180 kWh.',
          'Cost = 180 x R2.60 = R468.00.',
        ],
        answer: 'R468.00',
      },
    ],
  },
  {
    topicId: 'phys-electrodynamics',
    summary: 'Generators and motors, alternating current, and the calculation of rms values and average power.',
    keyIdeas: [
      'A generator converts mechanical energy into electrical energy using electromagnetic induction',
      'A motor converts electrical energy into mechanical energy using the force on a current-carrying conductor in a magnetic field',
      'An AC generator uses slip rings and a DC generator uses a split-ring commutator',
      'rms values are the DC equivalents that deliver the same average power',
      'Average power in an AC circuit uses rms values, not peak values',
    ],
    subtopics: [
      {
        name: 'Generators',
        points: [
          'Rotating the coil changes the flux through it, inducing an emf by Faraday\'s law',
          'AC generator: slip rings keep each end of the coil connected to the same brush, so the current reverses each half turn',
          'DC generator: the split-ring commutator reverses the connection each half turn, so the output stays one way',
          'The output is greatest when the coil is parallel to the field, since the flux is changing fastest',
        ],
      },
      {
        name: 'Motors',
        points: [
          'A current-carrying coil in a magnetic field experiences a force on each side, producing a turning effect',
          'A DC motor uses a commutator so the current reverses each half turn and rotation continues in one direction',
          'Applications include power tools, fans, pumps and electric vehicles',
        ],
      },
      {
        name: 'rms values',
        points: [
          'Irms = Imax / sqrt(2) and Vrms = Vmax / sqrt(2)',
          'Average power = Vrms x Irms = Imax Vmax / 2',
          'Mains electricity quoted as 220 V is an rms value, with a peak of about 311 V',
          'rms values are used because they give the same heating effect as the equivalent DC',
        ],
      },
    ],
    formulae: [
      'Irms = Imax / sqrt(2)',
      'Vrms = Vmax / sqrt(2)',
      'Paverage = Vrms Irms = Irms^2 R = Vrms^2 / R',
    ],
    commonMistakes: [
      'Mains voltage quoted as 220 V is rms, not peak; the peak is about 311 V',
      'Average power uses rms values, so using peak values overstates it by a factor of two',
      'A generator needs a changing flux, so a stationary coil produces nothing however strong the field',
    ],
    example: {
      problem: 'An AC supply has a peak voltage of 340 V and is connected to a 100 ohm resistor. Calculate the rms voltage and the average power dissipated.',
      steps: [
        'Vrms = Vmax / sqrt(2) = 340 / 1.414 = 240.4 V.',
        'Average power uses rms values: P = Vrms^2 / R.',
        'P = (240.4)^2 / 100 = 57 792 / 100.',
        'P = 577.9 W.',
      ],
      answer: 'Vrms = 240.4 V; average power = about 578 W.',
    },
    moreExamples: [
      {
        problem: 'Explain the difference between the slip rings of an AC generator and the split-ring commutator of a DC generator.',
        steps: [
          'In both machines the coil rotates in a magnetic field, and the emf induced in the coil itself reverses every half turn.',
          'Slip rings keep each end of the coil permanently connected to the same brush, so that reversal reaches the external circuit and the output is alternating.',
          'A split-ring commutator swaps which coil end touches which brush at the moment the emf reverses.',
          'The reversal inside the coil and the swap at the commutator cancel out, so the external current always flows in the same direction, giving a direct output.',
        ],
        answer: 'Slip rings pass the coil\'s natural reversal to the circuit giving AC, while the commutator swaps the connections at each reversal so the external current stays one way, giving DC.',
      },
    ],
  },
  {
    topicId: 'phys-em-radiation',
    summary: 'The dual nature of electromagnetic radiation, photon energy, and the photoelectric effect.',
    keyIdeas: [
      'Electromagnetic radiation shows both wave and particle behaviour, which is its dual nature',
      'Wave behaviour is shown by diffraction and interference; particle behaviour by the photoelectric effect',
      'A photon carries energy E = h f',
      'The work function is the minimum energy needed to free an electron from a metal surface',
      'There is a threshold frequency below which no electrons are emitted, whatever the intensity',
    ],
    subtopics: [
      {
        name: 'Photons',
        points: [
          'E = h f = h c / wavelength, with h = 6.63 x 10^-34 J s',
          'Higher frequency means a more energetic photon',
          'Greater intensity means more photons per second, not more energetic photons',
        ],
      },
      {
        name: 'The photoelectric effect',
        points: [
          'Light shining on a metal surface can eject electrons, called photoelectrons',
          'Emission happens only above the threshold frequency f0, and instantaneously when it does',
          'E(photon) = W0 + Ek(max), where W0 = h f0 is the work function',
          'Increasing the intensity above the threshold increases the number of electrons but not their maximum kinetic energy',
        ],
      },
      {
        name: 'Why it needed the photon model',
        points: [
          'A wave model predicts that any frequency should eventually free an electron if you wait long enough',
          'In fact nothing at all happens below the threshold frequency, however intense or prolonged the light',
          'This is explained if energy arrives in discrete photons and one photon is absorbed by one electron',
          'Applications include photocells, solar panels, light meters and automatic doors',
        ],
      },
    ],
    formulae: [
      'E = h f = h c / wavelength',
      'E(photon) = W0 + Ek(max)',
      'W0 = h f0',
      'Ek(max) = 1/2 m v(max)^2',
    ],
    commonMistakes: [
      'Increasing the intensity does not raise the maximum kinetic energy of the photoelectrons; only raising the frequency does',
      'Below the threshold frequency no electrons are emitted at all, no matter how long the light shines',
      'One photon is absorbed by one electron; an electron cannot accumulate energy from several photons',
    ],
    example: {
      problem: 'A metal has a work function of 3.2 x 10^-19 J. Light of frequency 7.5 x 10^14 Hz falls on it. Calculate the maximum kinetic energy of the emitted electrons.',
      steps: [
        'Photon energy E = h f = (6.63 x 10^-34) x (7.5 x 10^14) = 4.97 x 10^-19 J.',
        'Compare with the work function: 4.97 x 10^-19 is greater than 3.2 x 10^-19, so electrons are emitted.',
        'Use E(photon) = W0 + Ek(max), so Ek(max) = E(photon) - W0.',
        'Ek(max) = 4.97 x 10^-19 - 3.2 x 10^-19 = 1.77 x 10^-19 J.',
      ],
      answer: 'About 1.77 x 10^-19 J',
    },
    moreExamples: [
      {
        problem: 'A very bright red light produces no photoelectrons from a metal, while a dim violet light produces them immediately. Explain.',
        steps: [
          'Photon energy is given by E = h f, so it depends on frequency alone, not on brightness.',
          'Red light has a lower frequency than violet, so each red photon carries less energy than the work function of the metal.',
          'No single red photon can free an electron, and an electron cannot add up the energy of several photons, so no emission occurs however bright the light.',
          'Each violet photon carries more energy than the work function, so even a few of them free electrons at once.',
        ],
        answer: 'Emission depends on photon energy, set by frequency: red photons are individually too weak whatever their number, while violet photons each exceed the work function.',
      },
    ],
  },
  {
    topicId: 'phys-organic-chemistry',
    summary: 'Functional groups, IUPAC naming, isomers, physical property trends, and the main organic reactions.',
    keyIdeas: [
      'Organic compounds are based on carbon chains, and each family is defined by its functional group',
      'A homologous series shares a general formula and shows a gradual trend in physical properties',
      'IUPAC names give the longest chain, the substituents and their positions, and the functional group suffix',
      'Isomers have the same molecular formula but a different arrangement of atoms',
      'Boiling point rises with chain length and with the strength of the intermolecular forces',
    ],
    subtopics: [
      {
        name: 'Functional groups',
        points: [
          'Alkanes: C-C single bonds, saturated, suffix -ane',
          'Alkenes: C=C double bond, unsaturated, suffix -ene; alkynes have a triple bond, suffix -yne',
          'Alcohols: -OH, suffix -ol; carboxylic acids: -COOH, suffix -oic acid',
          'Aldehydes (-CHO, suffix -al), ketones (C=O within the chain, suffix -one), esters (suffix -oate), haloalkanes',
        ],
      },
      {
        name: 'Physical property trends',
        points: [
          'Longer chains have more surface contact, so London forces are stronger and boiling point rises',
          'Branching reduces surface contact, so a branched isomer boils lower than its straight-chain isomer',
          'Alcohols and carboxylic acids have much higher boiling points because they form hydrogen bonds',
          'Shorter alcohols and carboxylic acids dissolve in water; long hydrocarbon chains do not',
        ],
      },
      {
        name: 'Reaction types',
        points: [
          'Addition: an alkene plus hydrogen, a halogen, water or a hydrogen halide; the double bond opens',
          'Elimination: dehydrohalogenation of a haloalkane, or dehydration of an alcohol, both forming an alkene',
          'Substitution: a haloalkane with a base gives an alcohol; an alkane with a halogen in light',
          'Esterification: a carboxylic acid plus an alcohol, with concentrated sulfuric acid as catalyst, gives an ester and water',
          'Combustion of any hydrocarbon in excess oxygen gives carbon dioxide and water',
        ],
      },
    ],
    formulae: [
      'Alkanes CnH2n+2; alkenes CnH2n; alkynes CnH2n-2',
      'Alcohols CnH2n+1OH',
    ],
    commonMistakes: [
      'Number the longest chain from the end that gives the substituents the lowest possible numbers',
      'A branched isomer boils lower than the straight-chain isomer, because branching reduces contact area',
      'Addition reactions need an unsaturated starting material, so alkanes undergo substitution instead',
    ],
    example: {
      problem: 'Explain why butan-1-ol (boiling point 118 degrees Celsius) boils at a much higher temperature than butane (boiling point -1 degree Celsius), even though both have four carbon atoms.',
      steps: [
        'Both molecules have the same carbon chain length, so their London forces are similar.',
        'Butane is a non-polar alkane, so London forces are the only intermolecular force acting.',
        'Butan-1-ol has a hydroxyl group, so hydrogen bonds form between its molecules.',
        'Hydrogen bonds are much stronger than London forces, so far more energy is needed to separate the molecules and the boiling point is much higher.',
      ],
      answer: 'The -OH group in butan-1-ol allows hydrogen bonding between molecules, which is far stronger than the London forces alone that act between butane molecules.',
    },
    moreExamples: [
      {
        problem: 'Ethene reacts with steam in the presence of an acid catalyst. Name the type of reaction, give the product, and explain why ethane cannot undergo the same reaction.',
        steps: [
          'Ethene has a carbon-carbon double bond, so it is unsaturated.',
          'Steam adds across the double bond, which opens to accommodate the new atoms; this is an addition reaction, specifically hydration.',
          'The product is ethanol, CH3CH2OH.',
          'Ethane is saturated: it has only single bonds and no double bond to open, so it cannot undergo addition and reacts by substitution instead.',
        ],
        answer: 'Addition (hydration), giving ethanol; ethane is saturated and has no double bond to open, so it can only undergo substitution.',
      },
    ],
  },
  {
    topicId: 'phys-reaction-rate',
    summary: 'What determines how fast a reaction goes, measured by collision theory, and how rate is measured experimentally.',
    keyIdeas: [
      'Rate of reaction is the change in concentration, mass or volume per unit time',
      'Collision theory: a reaction occurs only when particles collide with enough energy and the correct orientation',
      'Activation energy is the minimum energy a collision must have to be successful',
      'Rate is increased by higher concentration, higher temperature, greater surface area, or a catalyst',
      'A catalyst lowers the activation energy and is not consumed',
    ],
    subtopics: [
      {
        name: 'Factors affecting rate',
        points: [
          'Concentration or pressure: more particles per unit volume, so more collisions per second',
          'Surface area: a powder reacts faster than a lump because more particles are exposed',
          'Temperature: particles move faster, so collisions are more frequent and a much larger fraction exceed the activation energy',
          'Catalyst: provides an alternative pathway with a lower activation energy',
        ],
      },
      {
        name: 'Measuring rate',
        points: [
          'Measure the volume of gas produced per unit time, the mass lost per unit time, or the time to a colour change',
          'Plot the measured quantity against time; the gradient of the tangent gives the instantaneous rate',
          'The graph is steepest at the start, when the concentration of the reactants is highest',
          'It levels off when a reactant is used up, and the final level shows the total amount of product',
        ],
      },
      {
        name: 'The Maxwell-Boltzmann distribution',
        points: [
          'Shows the spread of kinetic energies among the particles at a given temperature',
          'Only the particles to the right of the activation energy can react',
          'Raising the temperature shifts the curve right and flattens it, greatly increasing the fraction above the activation energy',
          'A catalyst moves the activation energy line to the left, so a larger fraction of the existing particles can react',
        ],
      },
    ],
    formulae: [
      'Rate = change in concentration / change in time',
      'Rate = change in volume of gas / change in time',
    ],
    commonMistakes: [
      'Raising the temperature works mainly by increasing the fraction of collisions above the activation energy, not just by making collisions more frequent',
      'A catalyst does not change the yield or the position of equilibrium, only the rate',
      'The reaction has not stopped when the graph levels off; the limiting reactant has simply been used up',
    ],
    example: {
      problem: 'In a reaction 48 cm3 of gas is collected in the first 20 s and a further 12 cm3 in the next 20 s. Calculate the average rate over each interval and explain the difference.',
      steps: [
        'First interval: rate = 48 / 20 = 2.4 cm3 per second.',
        'Second interval: rate = 12 / 20 = 0.6 cm3 per second.',
        'The rate has fallen because the reactants have been partly used up, so their concentration is lower.',
        'Fewer particles per unit volume means fewer collisions per second, so fewer successful collisions.',
      ],
      answer: '2.4 cm3/s then 0.6 cm3/s; the rate falls because the reactant concentration decreases as it is used up.',
    },
    moreExamples: [
      {
        problem: 'Explain, using the Maxwell-Boltzmann distribution, why a small rise in temperature can double the rate of a reaction.',
        steps: [
          'The distribution shows how kinetic energy is spread among the particles, with only those beyond the activation energy able to react.',
          'At the usual temperature only a very small fraction of particles lie beyond the activation energy, in the tail of the curve.',
          'Raising the temperature shifts the whole curve to the right and lowers its peak, so the tail beyond the activation energy grows.',
          'Because that tail is small to begin with, even a modest shift can double or more the number of particles able to react, which is why rate is so sensitive to temperature.',
        ],
        answer: 'Only the small tail of the distribution beyond the activation energy can react, so a modest shift of the curve multiplies that tail and hence the rate.',
      },
    ],
  },
  {
    topicId: 'phys-chemical-equilibrium',
    summary: 'Dynamic equilibrium, the equilibrium constant, and how Le Chatelier\'s principle predicts the effect of a change.',
    keyIdeas: [
      'A reversible reaction reaches dynamic equilibrium when the forward and reverse rates are equal',
      'At equilibrium the concentrations remain constant, but both reactions continue',
      'Kc is the equilibrium constant: products over reactants, each raised to its coefficient',
      'A large Kc means the products are favoured; a small Kc means the reactants are',
      'Le Chatelier: a system at equilibrium responds so as to oppose an imposed change',
    ],
    subtopics: [
      {
        name: 'Dynamic equilibrium',
        points: [
          'Requires a closed system, so nothing enters or leaves',
          'Concentrations are constant but not necessarily equal',
          'Both forward and reverse reactions are still happening at the same rate',
        ],
      },
      {
        name: 'The equilibrium constant',
        points: [
          'For aA + bB giving cC + dD, Kc = [C]^c [D]^d / ([A]^a [B]^b)',
          'Kc changes only with temperature, not with concentration, pressure or a catalyst',
          'Use an ICE table (initial, change, equilibrium) to work out equilibrium concentrations',
          'Pure solids and pure liquids are left out of the expression',
        ],
      },
      {
        name: 'Le Chatelier\'s principle',
        points: [
          'Increase a reactant concentration: the equilibrium shifts right to use it up',
          'Increase the pressure: it shifts towards the side with fewer moles of gas',
          'Increase the temperature: it shifts in the endothermic direction, which absorbs the added heat',
          'A catalyst speeds both directions equally, so equilibrium is reached sooner but its position is unchanged',
        ],
      },
    ],
    formulae: [
      'Kc = [products] raised to their coefficients / [reactants] raised to their coefficients',
      'Concentration = moles / volume',
    ],
    commonMistakes: [
      'Equal rates at equilibrium do not mean equal concentrations',
      'A catalyst does not shift the equilibrium position, only the time taken to reach it',
      'Kc is altered only by temperature; adding more reactant changes the concentrations but not Kc',
    ],
    example: {
      problem: 'For N2 + 3H2 giving 2NH3, equilibrium concentrations are [N2] = 0.20, [H2] = 0.30 and [NH3] = 0.60 mol/dm3. Calculate Kc.',
      steps: [
        'Write the expression: Kc = [NH3]^2 / ([N2] x [H2]^3).',
        'Numerator: (0.60)^2 = 0.36.',
        'Denominator: 0.20 x (0.30)^3 = 0.20 x 0.027 = 0.0054.',
        'Kc = 0.36 / 0.0054 = 66.7.',
      ],
      answer: 'Kc = 66.7',
    },
    moreExamples: [
      {
        problem: 'For N2 + 3H2 giving 2NH3, the forward reaction is exothermic. Predict the effect on the ammonia yield of raising the pressure and of raising the temperature.',
        steps: [
          'Raising the pressure: the left side has 4 moles of gas and the right side has 2, so the system shifts towards the side with fewer moles to relieve the pressure.',
          'The equilibrium therefore shifts right and the ammonia yield increases.',
          'Raising the temperature: the system shifts in the endothermic direction to absorb the added heat, which here is the reverse reaction.',
          'The equilibrium therefore shifts left and the ammonia yield decreases, which is why industrial ammonia production uses a compromise temperature with a catalyst.',
        ],
        answer: 'Higher pressure increases the yield by shifting towards the fewer gas moles; higher temperature decreases it by shifting in the endothermic reverse direction.',
      },
    ],
  },
  {
    topicId: 'phys-acids-bases',
    summary: 'Acid-base definitions, strength against concentration, pH, hydrolysis and titration calculations.',
    keyIdeas: [
      'Bronsted-Lowry: an acid donates a proton and a base accepts one',
      'Strength refers to how completely a substance ionises; concentration refers to how much is dissolved',
      'pH = -log[H3O+], so a lower pH means a higher hydronium concentration',
      'Conjugate acid-base pairs differ by exactly one proton',
      'At the equivalence point the moles of acid and base have reacted in the ratio of the balanced equation',
    ],
    subtopics: [
      {
        name: 'Strength and concentration',
        points: [
          'Strong acids ionise completely: HCl, HBr, HNO3, H2SO4',
          'Weak acids ionise only partially: ethanoic acid, oxalic acid, carbonic acid',
          'A dilute solution of a strong acid can have a higher pH than a concentrated solution of a weak acid',
          'Strong bases include NaOH and KOH; ammonia is a weak base',
        ],
      },
      {
        name: 'pH and Kw',
        points: [
          'pH = -log[H3O+], and [H3O+] = 10 to the power of -pH',
          'Kw = [H3O+][OH-] = 1 x 10^-14 at 25 degrees Celsius',
          'Neutral at 25 degrees Celsius means pH 7, where the two concentrations are equal',
        ],
      },
      {
        name: 'Titration and hydrolysis',
        points: [
          'Use n = c V, then apply the mole ratio from the balanced equation, then solve for the unknown',
          'Strong acid with strong base gives a neutral salt, pH 7 at the equivalence point',
          'Strong acid with weak base gives an acidic salt; weak acid with strong base gives a basic salt',
          'Choose the indicator whose range matches the pH at the equivalence point',
        ],
      },
    ],
    formulae: [
      'pH = -log[H3O+]',
      'Kw = [H3O+][OH-] = 1 x 10^-14',
      'n = c V',
      'ca Va / cb Vb = na / nb',
    ],
    commonMistakes: [
      'Strong and concentrated are different: strength is about the degree of ionisation, concentration about the amount dissolved',
      'The equivalence point of a weak acid with a strong base is above pH 7, not at 7',
      'pH is a logarithmic scale, so a change of one pH unit is a tenfold change in hydronium concentration',
    ],
    example: {
      problem: 'Calculate the pH of a 0.01 mol/dm3 solution of hydrochloric acid.',
      steps: [
        'Hydrochloric acid is a strong acid, so it ionises completely.',
        'Each HCl produces one H3O+, so [H3O+] = 0.01 = 1 x 10^-2 mol/dm3.',
        'pH = -log[H3O+] = -log(1 x 10^-2).',
        'pH = 2.',
      ],
      answer: 'pH = 2',
    },
    moreExamples: [
      {
        problem: '25 cm3 of sodium hydroxide solution is exactly neutralised by 20 cm3 of 0.1 mol/dm3 hydrochloric acid. Calculate the concentration of the sodium hydroxide.',
        steps: [
          'Convert volumes to cubic decimetres: 20 cm3 = 0.020 dm3 and 25 cm3 = 0.025 dm3.',
          'Moles of HCl = c V = 0.1 x 0.020 = 0.002 mol.',
          'The equation HCl + NaOH gives NaCl + H2O has a 1 to 1 ratio, so moles of NaOH = 0.002 mol.',
          'Concentration of NaOH = n / V = 0.002 / 0.025 = 0.08 mol/dm3.',
        ],
        answer: '0.08 mol/dm3',
      },
    ],
  },
  {
    topicId: 'phys-electrochemistry',
    summary: 'Galvanic and electrolytic cells, half-reactions, standard electrode potentials, and industrial applications.',
    keyIdeas: [
      'Oxidation always occurs at the anode and reduction always at the cathode',
      'In a galvanic cell a spontaneous redox reaction produces electricity; the anode is negative',
      'In an electrolytic cell electricity drives a non-spontaneous reaction; the anode is positive',
      'Electrons flow through the external circuit from anode to cathode in both cell types',
      'Standard cell potential = E of the cathode minus E of the anode',
    ],
    subtopics: [
      {
        name: 'Galvanic cells',
        points: [
          'Chemical energy converts to electrical energy, spontaneously',
          'The more negative electrode potential is the anode, where oxidation happens',
          'The salt bridge maintains electrical neutrality by allowing ions to move between the half-cells',
          'Cell notation: anode on the left, cathode on the right, with the double line marking the salt bridge',
        ],
      },
      {
        name: 'Electrolytic cells',
        points: [
          'Electrical energy drives a non-spontaneous chemical change',
          'The anode is connected to the positive terminal, and oxidation still occurs there',
          'Used for electroplating, refining copper, extracting aluminium, and the chlor-alkali process',
        ],
      },
      {
        name: 'Electrode potentials',
        points: [
          'Values are quoted against the standard hydrogen electrode, which is defined as 0 V',
          'A more positive value means a greater tendency to be reduced',
          'E(cell) = E(cathode) - E(anode), and a positive result means the reaction is spontaneous',
          'Reversing a half-reaction reverses the sign of its potential, but multiplying it does not change the value',
        ],
      },
    ],
    formulae: [
      'E(cell) = E(cathode) - E(anode)',
      'Oxidation at the anode, reduction at the cathode, in both cell types',
    ],
    commonMistakes: [
      'The anode is negative in a galvanic cell but positive in an electrolytic cell; oxidation happens there in both',
      'Multiplying a half-reaction to balance electrons does not change its electrode potential',
      'Electrons travel through the wire, not through the salt bridge; ions move through the salt bridge',
    ],
    example: {
      problem: 'A galvanic cell uses Zn/Zn2+ (E = -0.76 V) and Cu/Cu2+ (E = +0.34 V). Identify the anode and cathode and calculate the cell potential.',
      steps: [
        'The more negative electrode potential is oxidised, so zinc is the anode and copper is the cathode.',
        'At the anode: Zn gives Zn2+ plus 2 electrons. At the cathode: Cu2+ plus 2 electrons gives Cu.',
        'E(cell) = E(cathode) - E(anode) = (+0.34) - (-0.76).',
        'E(cell) = 0.34 + 0.76 = 1.10 V, and the positive value confirms the reaction is spontaneous.',
      ],
      answer: 'Zinc is the anode and copper the cathode; E(cell) = 1.10 V.',
    },
    moreExamples: [
      {
        problem: 'Explain the function of the salt bridge in a galvanic cell, and predict what happens if it is removed.',
        steps: [
          'As the cell runs, positive ions build up in the anode half-cell and are removed from the cathode half-cell.',
          'This would leave one half-cell positively charged and the other negatively charged, which opposes further electron flow.',
          'The salt bridge allows ions to migrate between the half-cells, keeping both electrically neutral and completing the circuit.',
          'If it is removed, charge builds up almost immediately, the potential difference collapses and the current stops.',
        ],
        answer: 'It keeps both half-cells electrically neutral and completes the circuit; without it charge builds up and the current stops almost at once.',
      },
    ],
  },
  {
    topicId: 'math-number-systems',
    summary: 'The real number system, rational and irrational numbers, recurring decimals, rounding, and estimating surds between integers.',
    keyIdeas: [
      'A rational number can be written as a fraction a/b with b not zero; its decimal form terminates or recurs',
      'An irrational number cannot be written as such a fraction; its decimal form neither terminates nor recurs',
      'The real numbers are the rationals together with the irrationals',
      'A surd such as the square root of 2 is irrational unless the number under the root is a perfect square',
      'To place a surd between two integers, find the perfect squares on either side of the number under the root',
    ],
    subtopics: [
      {
        name: 'The real number system',
        points: [
          'Natural numbers N: 1, 2, 3 and so on; whole numbers N0 include 0',
          'Integers Z include the negatives; rationals Q are all fractions a/b',
          'Irrationals are numbers such as pi and the square root of 2',
          'Every rational and every irrational is a real number',
        ],
      },
      {
        name: 'Decimals and fractions',
        points: [
          'A terminating decimal converts directly: 0.25 = 25/100 = 1/4',
          'For a recurring decimal, multiply by a power of 10 to line the repeat up, then subtract',
          'Rounding to n decimal places looks at the digit in the next place: 5 or more rounds up',
          'Rounding too early in a calculation accumulates error, so round only at the end',
        ],
      },
      {
        name: 'Estimating surds',
        points: [
          'The square root of 40 lies between 6 and 7, because 36 is less than 40, which is less than 49',
          'The same method works for cube roots, using perfect cubes',
          'For a sum of surds, square the whole expression or estimate each part and add',
        ],
      },
    ],
    formulae: [
      'A rational number can be written as a/b, with a and b integers and b not zero',
      'Recurring decimal: let x be the decimal, multiply to align the repeat, then subtract',
    ],
    commonMistakes: [
      'A recurring decimal is rational, not irrational, because it can always be written as a fraction',
      'The square root of 9 is 3, which is rational; only non-perfect squares give irrational roots',
      'Round only at the final step; rounding at each stage makes the answer drift',
    ],
    example: {
      problem: 'Determine between which two consecutive integers the square root of 40 lies.',
      steps: [
        'Find the perfect squares on either side of 40.',
        '6 squared is 36 and 7 squared is 49.',
        'Since 36 is less than 40, which is less than 49, the square root of 40 lies between the square roots of 36 and 49.',
        'Therefore the square root of 40 lies between 6 and 7.',
      ],
      answer: 'Between 6 and 7',
    },
    moreExamples: [
      {
        problem: 'Convert the recurring decimal 0.363636... into a fraction in simplest form.',
        steps: [
          'Let x = 0.363636..., where the repeating block 36 has two digits.',
          'Multiply by 100 to shift by one full block: 100x = 36.363636...',
          'Subtract the first equation from the second: 100x - x = 36.363636... - 0.363636..., giving 99x = 36.',
          'So x = 36/99, which simplifies by dividing both parts by 9 to give 4/11.',
        ],
        answer: '4/11',
      },
    ],
  },
]

export const getTopicNote = (topicId: string) => topicNotes.find((n) => n.topicId === topicId)
