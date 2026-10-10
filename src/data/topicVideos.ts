import type { Grade } from '@/types'

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

export const topicVideos: TopicVideo[] = [
  {
    "id": "matlit-interest",
    "subjectId": "mat-lit",
    "topicId": "finance",
    "grades": [
      10,
      11,
      12
    ],
    "title": "Simple and compound interest",
    "summary": "The difference between simple and compound interest, with a worked example calculated both ways.",
    "file": "matlit-interest.mp4",
    "poster": "matlit-interest.jpg",
    "seconds": 144,
    "megabytes": 3.9,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn the difference between simple and compound interest, and how to calculate each one, step by step.",
      "Interest is extra money. You pay it when you borrow, and you earn it when you save. The amount you start with is called the principal. The interest rate is a percentage, usually per year. With simple interest, the interest is worked out on the original amount, every single year. With compound interest, each year's interest is worked out on the new balance, so you also earn interest on the interest.",
      "Let's work through an example. Thabo invests five thousand rand for three years, at eight percent per year. How much will he have at the end, with simple interest, and with compound interest?",
      "Simple interest first. Eight percent of five thousand rand is four hundred rand. That is the interest every year. Over three years, three times four hundred rand is one thousand two hundred rand. So with simple interest, Thabo ends with six thousand two hundred rand.",
      "Now compound interest. Work it out year by year. In year one, eight percent of five thousand rand is four hundred rand, so the balance becomes five thousand four hundred rand. In year two, the interest is on five thousand four hundred rand. That is four hundred and thirty two rand, giving five thousand eight hundred and thirty two rand. In year three, eight percent of five thousand eight hundred and thirty two rand is four hundred and sixty six rand, fifty six cents. So the final balance is six thousand two hundred and ninety eight rand, fifty six cents.",
      "Compare the two answers. Compound interest gives ninety eight rand, fifty six cents more, because from the second year, interest is also earned on the interest. You can check it on your calculator: five thousand, times one comma zero eight, three times, gives the same six thousand two hundred and ninety eight rand, fifty six.",
      "Watch out for three common mistakes. Simple interest is always calculated on the original amount, never on a new balance. Compound interest uses the new balance every year, not the original amount. And write money to two decimal places, rounding only at the very end.",
      "Now it's your turn. Open Finance in DONE WELL and practise interest questions, with every mark explained."
    ]
  },
  {
    "id": "maths-first-principles",
    "subjectId": "mathematics",
    "topicId": "math-calculus",
    "grades": [
      12
    ],
    "title": "The derivative from first principles",
    "summary": "Where the definition comes from, and a full first-principles example, line by line.",
    "file": "maths-first-principles.mp4",
    "poster": "maths-first-principles.jpg",
    "seconds": 150,
    "megabytes": 4,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will see where the derivative comes from, and how to find it from first principles, line by line.",
      "The derivative tells you the gradient of a curve at any point. That is the gradient of the tangent to the curve. Take two points on the curve. P is at x, and Q is a small distance h further along. The gradient of the line through P and Q is the change in y, which is f of x plus h, minus f of x, divided by the change in x, which is h. Now let h get smaller and smaller. Q slides towards P, and the line through P and Q becomes the tangent at P.",
      "That gives the definition. f prime of x is the limit, as h tends to zero, of f of x plus h, minus f of x, all over h. In an exam, from first principles means you must use this definition. The shortcut rules do not earn the marks.",
      "Here is an example. Determine f prime of x from first principles, if f of x equals two x squared, minus three x. First, find f of x plus h. Replace every x with x plus h. Expand the brackets fully. That gives two x squared, plus four x h, plus two h squared, minus three x, minus three h. Now subtract f of x. The two x squared and the minus three x cancel, leaving four x h, plus two h squared, minus three h.",
      "Put this into the definition, over h. Every term on top contains an h, so take h out as a common factor, and cancel it with the h underneath. Only now let h tend to zero. Two h becomes zero. So f prime of x equals four x, minus three.",
      "You can check your answer with the power rule. The derivative of two x squared is four x, and of minus three x is minus three. It matches. Use the rule to check yourself, but in a first principles question, only the full method earns the marks.",
      "Three mistakes to avoid. Keep writing the limit on every line, until you actually let h tend to zero. Expand x plus h, all squared, properly. It is x squared, plus two x h, plus h squared, not just x squared plus h squared. And never put h equal to zero while h is still in the denominator. Factorise and cancel first.",
      "Now it's your turn. Open Differential Calculus in DONE WELL, and practise first principles questions with every step explained."
    ]
  },
  {
    "id": "physics-momentum-impulse",
    "subjectId": "physical-sciences",
    "topicId": "phys-momentum-impulse",
    "grades": [
      12
    ],
    "title": "Momentum and impulse",
    "summary": "Momentum, impulse and Newton’s second law, with a ball rebounding off a wall worked in full.",
    "file": "physics-momentum-impulse.mp4",
    "poster": "physics-momentum-impulse.jpg",
    "seconds": 176,
    "megabytes": 4.6,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn what momentum and impulse are, how they are connected, and how to solve a typical exam question.",
      "Momentum is the product of an object's mass and its velocity. p equals m v. Momentum is a vector, so it always has a direction. You must choose a positive direction. It is measured in kilogram metres per second. For example, a one thousand five hundred kilogram car moving at twelve metres per second north has a momentum of eighteen thousand kilogram metres per second, north.",
      "Impulse is the product of the net force and the time for which it acts. And impulse equals the change in momentum. So F net times delta t equals m v final, minus m v initial. Impulse is measured in newton seconds, which is the same as kilogram metres per second. Rearranged, this is Newton's second law in terms of momentum: the net force equals the rate of change of momentum.",
      "Here is an example. A zero comma one five kilogram ball hits a wall at twenty metres per second, and bounces straight back at fifteen metres per second. It is in contact with the wall for zero comma zero five seconds. Calculate the change in momentum of the ball, and the average force that the wall exerts on it. First, choose a positive direction. Take towards the wall as positive, so the final velocity is negative fifteen metres per second.",
      "The change in momentum is m v final, minus m v initial. That is zero comma one five times negative fifteen, minus zero comma one five times twenty. Negative two comma two five, minus three, gives negative five comma two five kilogram metres per second. That is five comma two five, away from the wall. The average force is the change in momentum divided by the contact time. Negative five comma two five, divided by zero comma zero five, is negative one hundred and five newtons. So the wall exerts an average force of one hundred and five newtons on the ball, away from the wall.",
      "This explains many safety features. In a crash, the change in the passenger's momentum is fixed. An airbag or a crumple zone makes the collision last longer. Since the net force equals the change in momentum divided by the time, a longer time means a smaller force on the passenger. Remember, they do not reduce the change in momentum. They spread it over a longer time.",
      "Three mistakes to avoid. Always choose a positive direction. A velocity after a rebound is negative. Give a direction with every momentum, impulse and force answer. And the change in momentum is final minus initial, never the other way round.",
      "Now it's your turn. Open Momentum and Impulse in DONE WELL, and practise exam questions with every step explained."
    ]
  },
  {
    "id": "lifesci-meiosis",
    "subjectId": "life-sciences",
    "topicId": "life-sci-meiosis",
    "grades": [
      12
    ],
    "title": "Meiosis: making gametes",
    "summary": "Meiosis I and II with diagrams, the three sources of variation, and how it differs from mitosis.",
    "file": "lifesci-meiosis.mp4",
    "poster": "lifesci-meiosis.jpg",
    "seconds": 167,
    "megabytes": 4.3,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will follow meiosis step by step, and see how it makes every gamete genetically different.",
      "Meiosis is the cell division that makes gametes, the sex cells. It turns one diploid cell, with two sets of chromosomes, into four haploid cells, each with one set. In humans, body cells have forty six chromosomes, and gametes have twenty three. At fertilisation, two gametes join. Twenty three plus twenty three gives forty six again. Without meiosis, the number would double every generation.",
      "Meiosis happens in two divisions. In meiosis one, the homologous chromosomes are separated. Here the red chromosomes came from one parent, and the blue from the other. In prophase one, homologous chromosomes pair up, and crossing over swaps pieces between non-sister chromatids. In metaphase one, the pairs line up at the equator. Which way each pair faces is random. This is random assortment. In anaphase one, whole chromosomes of each pair move to opposite poles. This is when the chromosome number is halved. In telophase one, two haploid cells form. Each chromosome still has two chromatids.",
      "Meiosis two is like mitosis, but it starts with the two haploid cells. In metaphase two, the chromosomes line up singly at the equator. In anaphase two, the sister chromatids separate and move to opposite poles. In telophase two, four haploid cells form, and because of crossing over and random assortment, they are all genetically different.",
      "So where does the variation come from? There are three sources. Crossing over, in prophase one, makes new combinations of alleles on a single chromosome. Random assortment, in metaphase one, makes many different combinations of whole chromosomes. And random fertilisation means any sperm can fertilise any egg, which multiplies the variation even further.",
      "Do not confuse meiosis with mitosis. Mitosis has one division, and makes two identical diploid cells. Meiosis has two divisions, and makes four different haploid cells. Mitosis is for growth and repair. Meiosis is for making gametes.",
      "Three mistakes to avoid. The chromosome number is halved in anaphase one, when whole chromosomes separate, not in anaphase two. In metaphase one, chromosomes line up in pairs. In metaphase two, they line up singly. And know non-disjunction. If chromosomes fail to separate, a gamete gets one too many or one too few. Down syndrome is an example.",
      "Now it's your turn. Open Meiosis in DONE WELL, and practise exam questions with diagrams and every mark explained."
    ]
  },
  {
    "id": "matlit-data-summary",
    "subjectId": "mat-lit",
    "topicId": "data-handling",
    "grades": [
      10,
      11,
      12
    ],
    "title": "Mean, median, mode, range and quartiles",
    "summary": "Summarising a data set step by step, the box-and-whisker plot, and finding a missing value from the mean.",
    "file": "matlit-data-summary.mp4",
    "poster": "matlit-data-summary.jpg",
    "seconds": 182,
    "megabytes": 4.8,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to summarise a set of data with the mean, the median, the mode, the range and the quartiles, and how to work backwards from the mean to find a missing value.",
      "Here are the test marks of eleven learners, out of twenty. Before you calculate anything, write the data in order, from smallest to largest. Seven, nine, eleven, twelve, fourteen, fifteen, fifteen, fifteen, sixteen, eighteen, twenty. Count the values. There are eleven, so n equals eleven.",
      "The mean is the average. Add all the values, and divide by how many there are. The sum of the eleven marks is one hundred and fifty two. One hundred and fifty two divided by eleven is thirteen comma eight one eight. So the mean is about thirteen comma eight marks.",
      "The median is the middle value of the sorted data. Its position is n plus one, divided by two. Eleven plus one, divided by two, is six. So the median is the sixth value, which is fifteen. With an even number of values, there are two middle values, and the median is halfway between them. The mode is the value that appears most often. Fifteen appears three times, so the mode is fifteen.",
      "The range is the largest value minus the smallest value. Twenty minus seven is thirteen. In Grade twelve you also need the quartiles. The median splits the data into a lower half and an upper half. The lower quartile, Q one, is the median of the lower half: seven, nine, eleven, twelve, fourteen. That is eleven. The upper quartile, Q three, is the median of the upper half: fifteen, fifteen, sixteen, eighteen, twenty. That is sixteen. The interquartile range is Q three minus Q one. Sixteen minus eleven is five. It tells you how spread out the middle half of the data is.",
      "These five numbers are the five-number summary: the minimum, Q one, the median, Q three and the maximum. A box-and-whisker plot shows them on a number line. The box runs from Q one to Q three, with a line at the median, and the whiskers reach out to the minimum and the maximum. Here the median is close to Q three, so the top half of the middle marks is bunched together.",
      "Examiners often turn the question around. The mean of five marks is fourteen. Four of the marks are twelve, fifteen, nine and eighteen. Determine the fifth mark. If the mean of five marks is fourteen, then the five marks add up to five times fourteen, which is seventy. The four known marks add up to fifty four. So the missing mark is seventy minus fifty four, which is sixteen. Check: seventy divided by five is fourteen.",
      "Three mistakes to avoid. Never find the median before sorting the data. The median is a value, not a position. Say fifteen, not \"the sixth\". And the range is one number, the difference. Thirteen, not \"seven to twenty\".",
      "Now it's your turn. Open Data Handling in DONE WELL, and practise these questions, with every mark explained."
    ]
  },
  {
    "id": "maths-reduction-formulae",
    "subjectId": "mathematics",
    "topicId": "math-trigonometry",
    "grades": [
      11,
      12
    ],
    "title": "Reduction formulae and the CAST diagram",
    "summary": "Signs from CAST, the reduction formulae and co-functions, with two \"without a calculator\" examples.",
    "file": "maths-reduction-formulae.mp4",
    "poster": "maths-reduction-formulae.jpg",
    "seconds": 236,
    "megabytes": 5.9,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn the reduction formulae: how to change the trig ratio of any angle into a ratio of an acute angle, with the correct sign, and how to simplify expressions without a calculator.",
      "Angles are measured anticlockwise from the positive x axis, and the sign of each ratio depends on the quadrant the angle ends in. In the first quadrant, from zero to ninety degrees, all the ratios are positive. In the second quadrant, only sine is positive. In the third quadrant, only tangent is positive. And in the fourth quadrant, only cosine is positive. Read anticlockwise from the fourth quadrant, the letters spell C A S T.",
      "With one hundred and eighty or three hundred and sixty degrees, the ratio stays the same, and CAST gives the sign. One hundred and eighty minus theta is in the second quadrant, so sine stays positive, and cosine and tangent become negative. One hundred and eighty plus theta is in the third quadrant, so only tangent stays positive. Three hundred and sixty minus theta, and negative theta, are in the fourth quadrant, so only cosine stays positive. With ninety degrees, the ratio changes to its co-function: sine becomes cosine, and cosine becomes sine. Sine of ninety plus theta is cos theta, and cos of ninety plus theta is negative sine theta.",
      "Here is an example. Without a calculator, determine sin one hundred and fifty degrees, times cos two hundred and forty degrees, divided by tan three hundred and fifteen degrees. One hundred and fifty degrees is one hundred and eighty minus thirty. It is in the second quadrant, where sine is positive, so sin one hundred and fifty equals sin thirty, which is one half. Two hundred and forty degrees is one hundred and eighty plus sixty, in the third quadrant, where cosine is negative. So cos two hundred and forty is negative cos sixty, which is negative one half. Three hundred and fifteen degrees is three hundred and sixty minus forty five, in the fourth quadrant, where tangent is negative. So tan three hundred and fifteen is negative tan forty five, which is negative one. Substitute: one half times negative one half is negative one quarter. Divided by negative one, that gives positive one quarter.",
      "Now simplify sin of one hundred and eighty minus x, times cos of negative x, all over cos of ninety plus x, times cos of three hundred and sixty minus x. Sin of one hundred and eighty minus x is sin x. Cos of negative x is cos x. So the top is sin x cos x. Cos of ninety plus x is negative sin x, a co-function, and cos of three hundred and sixty minus x is cos x. So the bottom is negative sin x cos x. Everything cancels, except the minus sign. The answer is negative one.",
      "For an angle bigger than three hundred and sixty degrees, first subtract three hundred and sixty, as many times as you need. The ratios repeat every full turn. Cos four hundred and eighty degrees equals cos of four hundred and eighty minus three hundred and sixty, which is cos one hundred and twenty. Then cos one hundred and twenty is cos of one hundred and eighty minus sixty, which is negative cos sixty, negative one half.",
      "Three mistakes to avoid. The sign comes from the quadrant of the original angle. Sin of two hundred and ten degrees is negative, because two hundred and ten is in the third quadrant. Only ninety degrees changes sine into cosine. One hundred and eighty and three hundred and sixty never change the ratio. And show every reduction step. In a \"without a calculator\" question, the answer alone earns very few marks.",
      "Now it's your turn. Open Trigonometry in DONE WELL, and practise reduction formulae with every step explained."
    ]
  },
  {
    "id": "chem-organic-naming",
    "subjectId": "physical-sciences",
    "topicId": "phys-organic-chemistry",
    "grades": [
      12
    ],
    "title": "Naming organic molecules",
    "summary": "The IUPAC rules step by step: chain, numbering, branches, punctuation and esters, with five named examples.",
    "file": "chem-organic-naming.mp4",
    "poster": "chem-organic-naming.jpg",
    "seconds": 208,
    "megabytes": 5.3,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to give an organic molecule its IUPAC name, step by step, and how to avoid the mistakes that cost marks.",
      "Every IUPAC name is built from three parts. The stem tells you how many carbons are in the longest chain. Meth is one, eth is two, prop is three, but is four, pent is five, hex is six, hept is seven, and oct is eight. The ending tells you the functional group. An alkane ends in A N E, an alkene in E N E, an alcohol in O L, an aldehyde in A L, a ketone in O N E, and a carboxylic acid in O I C acid. And the prefix names any branches, such as methyl or ethyl, and halogen atoms, such as chloro or bromo.",
      "Use the same four steps every time. First, find the longest continuous chain of carbon atoms that contains the functional group. It does not have to be drawn in a straight line. Second, number the chain from the end that gives the functional group the lowest possible number. If there is no functional group, start from the end nearest the first branch. Third, name each branch, with the number of the carbon it is on, and list the branches in alphabetical order. Fourth, punctuation. Put commas between numbers, and hyphens between numbers and words.",
      "Example one. The longest chain has four carbons, and all the bonds are single, so the name ends in butane. Number the chain from the end nearest the branch. Then the branch, a methyl group, is on carbon two. Numbering from the other end would put it on carbon three, which is higher. So the name is two methyl butane, written as one word, with a hyphen after the two.",
      "Example two contains an O H group, so it is an alcohol, and the name ends in O L. Number from the end nearest the O H group. From the right, the O H is on carbon two. The chain has four carbons, so the stem is butan. The name is butan two ol, with the number between the stem and the ending.",
      "Example three has a double bond, so it is an alkene, ending in E N E. The double bond must get the lowest number, so number from the left. The double bond starts at carbon one. Now the methyl branch is on carbon three. The double bond decides the numbering, not the branch. The name is three methyl but one ene.",
      "When the same branch appears more than once, use di for two, tri for three, and tetra for four. This chain has five carbons, so it is pentane. There are methyl groups on carbons two and three. That is two comma three dimethyl. The name is two comma three dimethyl pentane: a comma between the numbers, and a hyphen before the word.",
      "Esters are named in two words. An ester forms when an alcohol reacts with a carboxylic acid. For example, ethanol and propanoic acid. The alcohol gives the first word, ending in Y L. The acid gives the second word, ending in O A T E. So this ester is ethyl propanoate.",
      "Three mistakes to avoid. Choosing a chain that is not the longest. A chain can bend, so check every path. Numbering from the wrong end. The functional group gets the lowest number first, and only then the branches. And punctuation. Commas between numbers, hyphens between numbers and letters, and no spaces in the name.",
      "Now it's your turn. Open Organic Chemistry in DONE WELL, and practise naming molecules, with every mark explained."
    ]
  },
  {
    "id": "lifesci-monohybrid",
    "subjectId": "life-sciences",
    "topicId": "life-sci-genetics",
    "grades": [
      12
    ],
    "title": "Monohybrid crosses",
    "summary": "The key terms of genetics, a full genetic cross set out the way the memo marks it, a Punnett square and a test cross.",
    "file": "lifesci-monohybrid.mp4",
    "poster": "lifesci-monohybrid.jpg",
    "seconds": 201,
    "megabytes": 5.2,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn the key terms of genetics, and how to set out a monohybrid cross, step by step, the way the examiners mark it.",
      "Alleles are different forms of the same gene. In pea plants, the gene for flower colour has an allele for purple and an allele for white. A dominant allele shows its effect whenever it is present. We write it with a capital letter. A recessive allele only shows when there are two of them, and we write it with the small letter. The genotype is the pair of alleles an organism has, such as capital P small p. The phenotype is the characteristic you can see, such as purple flowers. Homozygous means the two alleles are the same, like capital P capital P, or small p small p. Heterozygous means they are different: capital P small p.",
      "Here is a typical question. In pea plants, purple flowers, capital P, are dominant over white flowers, small p. Two plants that are heterozygous for flower colour are crossed. Represent a genetic cross to show the possible genotypes and phenotypes of the offspring. Heterozygous means each parent is capital P small p, so both parents have purple flowers.",
      "Start with the parents, labelled P one. Write their phenotypes, purple times purple, and their genotypes, capital P small p times capital P small p. Next write meiosis, and the gametes each parent makes. Each gamete gets only one allele, so each parent makes gametes with capital P and gametes with small p. Then write fertilisation: any gamete from one parent can join any gamete from the other. The offspring, labelled F one, have the genotypes capital P capital P, capital P small p, capital P small p, and small p small p. So the phenotypes are three purple to one white.",
      "A Punnett square shows fertilisation clearly. Put one parent's gametes across the top, and the other parent's down the side, and fill in each box. The genotype ratio is one capital P capital P, to two capital P small p, to one small p small p. Three of the four boxes have at least one capital P, so the phenotype ratio is three purple to one white. So each offspring has a one in four chance, twenty five percent, of having white flowers.",
      "A purple plant could be capital P capital P or capital P small p. You cannot tell by looking. So cross it with a white plant, small p small p, which can only give small p gametes. If all the offspring are purple, the purple parent was most likely homozygous, capital P capital P. If any offspring are white, the purple parent must have given a small p, so it is heterozygous, capital P small p.",
      "Three mistakes to avoid. Use the same letter for both alleles of a gene: capital P and small p. Never P for purple and W for white. Label every line: P one, meiosis, gametes, fertilisation and F one. Each of these labels earns marks. And three to one is a probability for each offspring. Four seeds will not always give exactly three purple plants and one white.",
      "Now it's your turn. Open Genetics and Inheritance in DONE WELL, and practise genetic crosses, with every mark explained."
    ]
  },
  {
    "id": "matlit-income-tax",
    "subjectId": "mat-lit",
    "topicId": "finance",
    "grades": [
      12
    ],
    "title": "Income tax and the tax threshold",
    "summary": "Taxable income, the SARS tax table and rebates worked in full, and how to find each tax threshold yourself.",
    "file": "matlit-income-tax.mp4",
    "poster": "matlit-income-tax.jpg",
    "seconds": 304,
    "megabytes": 8.4,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to calculate income tax from the SARS tax table, and how to find the tax threshold yourself, step by step.",
      "Income tax is one chain of steps, and you always do them in the same order. First, subtract pension or retirement contributions from the gross income. What is left is the taxable income. Second, find the row of the SARS tax table that the taxable income falls in, and calculate the tax. Third, subtract the rebates for the person's age. That gives the tax for the year. Divide by twelve for the tax each month, called PAYE.",
      "Here are the first three rows of the SARS table for the twenty twenty six, twenty twenty seven tax year. In the first row, up to two hundred and forty five thousand one hundred rand, the tax is simply eighteen percent of the taxable income. In the second row, the tax is forty four thousand one hundred and eighteen rand, plus twenty six percent of the part above two hundred and forty five thousand one hundred rand. Every other row works the same way: a fixed amount, plus a percentage of only the part above where that row starts. Then the rebates. Everyone gets the primary rebate of seventeen thousand eight hundred and twenty rand. At sixty five or older, add the secondary rebate. At seventy five or older, add the tertiary rebate as well.",
      "Let's work through an example. Nomsa is forty one years old and earns three hundred and forty eight thousand rand a year. She contributes seven comma five percent of her gross income to a pension fund. Calculate her income tax for the year, and her tax each month.",
      "Seven comma five percent of three hundred and forty eight thousand rand is twenty six thousand one hundred rand. So her taxable income is three hundred and twenty one thousand nine hundred rand. That falls in the second row of the table. The tax is forty four thousand one hundred and eighteen rand, plus twenty six percent of the part above two hundred and forty five thousand one hundred. That part is seventy six thousand eight hundred rand. Twenty six percent of seventy six thousand eight hundred is nineteen thousand nine hundred and sixty eight rand, so the tax from the table is sixty four thousand and eighty six rand. Nomsa is under sixty five, so she gets only the primary rebate. Sixty four thousand and eighty six, minus seventeen thousand eight hundred and twenty, is forty six thousand two hundred and sixty six rand for the year. Divide by twelve: her tax is three thousand eight hundred and fifty five rand, fifty cents a month.",
      "Now the tax threshold. Many learners think it is a separate rule to memorise. It is not. The threshold is the income at which the tax from the table is exactly cancelled by the rebates. Below it, the rebates are bigger than the tax, so no tax is paid at all. Above it, tax is paid, and you work it out with the table and the rebates as normal. Every threshold falls in the first row of the table, where the tax is just eighteen percent of the income. So eighteen percent of the threshold equals the rebates. That means the threshold is the rebates divided by zero comma one eight.",
      "Let's find all three thresholds. Under sixty five, there is only the primary rebate. Seventeen thousand eight hundred and twenty, divided by zero comma one eight, is ninety nine thousand rand. Check it. Eighteen percent of ninety nine thousand is seventeen thousand eight hundred and twenty, and taking off the rebate leaves exactly zero. From sixty five, add the secondary rebate: twenty seven thousand five hundred and eighty five rand. Divided by zero comma one eight, that is one hundred and fifty three thousand two hundred and fifty rand. From seventy five, add the tertiary rebate as well: thirty thousand eight hundred and thirty four rand. Divided by zero comma one eight, that is one hundred and seventy one thousand three hundred rand.",
      "Here is how a question uses it. Mr Dlamini is seventy, with a taxable income of one hundred and forty thousand rand. Does he pay tax? He is between sixty five and seventy four, so his threshold is one hundred and fifty three thousand two hundred and fifty rand. His income is below it. You can check: eighteen percent of one hundred and forty thousand is twenty five thousand two hundred rand, which is less than his rebates of twenty seven thousand five hundred and eighty five rand. So he pays no income tax. Never write a negative tax. The answer is zero.",
      "Watch out for four common mistakes. Subtract pension contributions before you use the table, not after. Apply the row's percentage only to the part above where the row starts. Never to the whole income. Rebates add up with age. Someone who is sixty five or older gets the primary and the secondary rebate together. And the table gives the tax for a year. Divide by twelve only when the question asks for a month.",
      "Now it's your turn. Open Finance in DONE WELL and practise taxation questions, with every mark explained."
    ]
  },
  {
    "id": "matlit-measurement",
    "subjectId": "mat-lit",
    "topicId": "measurement",
    "grades": [
      10,
      11,
      12
    ],
    "title": "Area, volume and converting units",
    "summary": "Perimeter, area and volume, why square and cubic units convert differently, a water tank in litres and a wall to paint.",
    "file": "matlit-measurement.mp4",
    "poster": "matlit-measurement.jpg",
    "seconds": 188,
    "megabytes": 5.1,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn the difference between perimeter, area and volume, how to convert their units, and how to answer two typical exam questions.",
      "Measurement questions ask one of three different things. Perimeter is the distance around a shape, in metres. You need it for fencing, or a border. Area is the surface a shape covers, in square metres. You need it for paint, tiles or carpet. Volume is the space inside a solid, in cubic metres. You need it for water in a tank, or concrete. The exam gives you the formulas, so your job is to choose the right one and use the right units.",
      "Converting units is where most marks are lost. For length you multiply or divide by ten, one hundred or one thousand. One metre is one hundred centimetres. But a square metre is one hundred centimetres by one hundred centimetres, so one square metre is ten thousand square centimetres, not one hundred. And a cubic metre is one hundred times one hundred times one hundred, which is one million cubic centimetres. For capacity, remember: one cubic metre holds one thousand litres, and one cubic centimetre is one millilitre.",
      "Here is a typical question. A cylindrical water tank has a radius of zero comma six metres and a height of one comma five metres. How many litres does it hold? Substitute into the formula. Three comma one four two, times zero comma six squared, times one comma five. Square the radius first: zero comma three six. That gives one comma six nine seven cubic metres, rounded. Then convert. Each cubic metre holds one thousand litres, so the tank holds about one thousand six hundred and ninety seven litres. Convert using the unrounded value, and round only at the end.",
      "Now an area question. A wall is four comma five metres long and two comma seven metres high, with a door of zero comma nine by two comma one metres. It needs two coats, and one litre of paint covers eight square metres. The wall is four comma five times two comma seven, which is twelve comma one five square metres. The door is one comma eight nine square metres. Subtract the door, because it is not painted: ten comma two six square metres. Two coats doubles it, to twenty comma five two square metres. Divide by eight square metres per litre: two comma five six five litres. You cannot buy part of a tin, and two tins would run out, so you must round up. The answer is three tins.",
      "Watch out for four common mistakes. Converting square metres to square centimetres by multiplying by one hundred. It is ten thousand. Mixing units. Change every length to the same unit before you calculate. Rounding down when you have to buy whole items. Tins, bags and tiles always round up. And forgetting to subtract doors and windows, or to multiply by the number of coats.",
      "Now it's your turn. Open Measurement in DONE WELL and practise area, volume and conversion questions, with every mark explained."
    ]
  },
  {
    "id": "maths-circle-geometry",
    "subjectId": "mathematics",
    "topicId": "math-euclidean-geometry",
    "grades": [
      11,
      12
    ],
    "title": "Circle geometry: the angle theorems",
    "summary": "The four angle theorems, a worked example with the centre, same segment and cyclic quadrilateral, and statements with reasons.",
    "file": "maths-circle-geometry.mp4",
    "poster": "maths-circle-geometry.jpg",
    "seconds": 147,
    "megabytes": 4,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn the angle theorems of circle geometry, how to set out each step with its reason, and how to solve a typical exam question.",
      "Four angle theorems do most of the work in circle geometry. First: the angle at the centre is twice the angle at the circumference, when both stand on the same arc. Second: angles in the same segment are equal. They stand on the same chord, on the same side. Third: the opposite angles of a cyclic quadrilateral add up to one hundred and eighty degrees. A cyclic quadrilateral has all four corners on the circle. Fourth: the angle between a tangent and a chord equals the angle in the alternate segment.",
      "Here is a typical question. O is the centre of the circle, and angle A O C is one hundred and thirty degrees. Find the angles at B, E and D. Angle A B C stands on the same arc as the angle at the centre, so it is half of one hundred and thirty degrees: sixty five degrees. Angle A E C is in the same segment as angle A B C, both standing on chord A C, so it is also sixty five degrees. A B C D is a cyclic quadrilateral, so angle A D C is one hundred and eighty minus sixty five: one hundred and fifteen degrees.",
      "In the exam, write every step as a statement with its reason. A correct angle without a reason earns only half the marks. Angle A B C equals sixty five degrees. Reason: angle at centre equals twice the angle at the circumference. Angle A E C equals sixty five degrees. Reason: angles in the same segment. Angle A D C equals one hundred and fifteen degrees. Reason: opposite angles of cyclic quadrilateral A B C D. Name the quadrilateral, so the marker knows which one you mean.",
      "Watch out for three common mistakes. Halving the wrong angle. The angle at the centre and the angle at the circumference must stand on the same arc. Check which arc each one faces. Calling a quadrilateral cyclic when one of its corners is not on the circle. The centre O is never on the circle, so a quadrilateral that uses O is not cyclic. And writing an angle with no reason, or with a vague one like circle theorem. Give the exact theorem.",
      "Now it's your turn. Open Euclidean Geometry in DONE WELL and practise circle geometry, with every statement and reason explained."
    ]
  },
  {
    "id": "physics-newtons-laws",
    "subjectId": "physical-sciences",
    "topicId": "phys-newtons-laws",
    "grades": [
      11,
      12
    ],
    "title": "Newton's laws and free-body diagrams",
    "summary": "The three laws in plain words, a free-body diagram with friction, the second law worked in full, and third-law pairs.",
    "file": "physics-newtons-laws.mp4",
    "poster": "physics-newtons-laws.jpg",
    "seconds": 174,
    "megabytes": 4.6,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn Newton's three laws, how to draw a free-body diagram, and how to use the second law to solve a problem with friction.",
      "Here are Newton's three laws in plain words. The first law is about inertia. An object stays at rest, or keeps moving at a constant velocity, unless a net force acts on it. The second law says that a net force makes an object accelerate, in the direction of the net force. The net force equals mass times acceleration. The third law says that when object A pushes on object B, B pushes back on A with a force that is equal in size and opposite in direction.",
      "Here is a typical question. A five kilogram crate is pulled along a rough floor by a horizontal force of forty newtons. The coefficient of kinetic friction is zero comma three. First, draw a free-body diagram: the crate as a box, and an arrow for every force acting on it. The applied force is forty newtons, to the right. The weight is mass times g: five times nine comma eight, which is forty nine newtons, downwards. The floor pushes up with a normal force of forty nine newtons, because the crate does not move up or down. Friction acts against the motion. It is the coefficient times the normal force: zero comma three times forty nine, which is fourteen comma seven newtons, to the left.",
      "Now use the second law along the direction of motion. Choose a positive direction. Take to the right as positive. The net force is forty newtons plus negative fourteen comma seven newtons, which is twenty five comma three newtons to the right. The weight and the normal force cancel, so they do not appear. Net force equals mass times acceleration: twenty five comma three equals five times a. So the acceleration is five comma zero six metres per second squared, to the right.",
      "A last word on the third law, because it is often confused. The crate pushes down on the floor, and the floor pushes up on the crate. That is a third-law pair. The weight and the normal force are not a third-law pair, even though they are equal and opposite here. They both act on the same object, the crate. The partner of the crate's weight is the crate pulling the Earth upwards with forty nine newtons.",
      "Watch out for four common mistakes. Using the applied force instead of the net force in F equals m a. Confusing mass, in kilograms, with weight, in newtons. Weight is mass times g. Drawing forces that the object exerts on other things, or forgetting to label the arrows. A free-body diagram shows only the forces acting on the object. And leaving out the direction of a force or an acceleration. Both are vectors.",
      "Now it's your turn. Open Newton's Laws in DONE WELL and practise free-body diagrams and the second law, with every mark explained."
    ]
  },
  {
    "id": "lifesci-natural-selection",
    "subjectId": "life-sciences",
    "topicId": "life-sci-evolution",
    "grades": [
      12
    ],
    "title": "Evolution by natural selection",
    "summary": "Darwin's theory step by step, drug-resistant TB as an example, Lamarck compared, and speciation through geographic isolation.",
    "file": "lifesci-natural-selection.mp4",
    "poster": "lifesci-natural-selection.jpg",
    "seconds": 178,
    "megabytes": 5.1,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how evolution happens by natural selection, how to explain it step by step in an exam, and how new species form.",
      "Darwin's theory of natural selection has five steps, and the memo marks them in this order. One. There is variation among the individuals of a population, and much of it is inherited. Two. More offspring are produced than can survive, so there is competition for food, space and mates. Three. Individuals with favourable characteristics are more likely to survive and reproduce. Those without them are more likely to die. Four. The survivors pass the alleles for the favourable characteristic to their offspring. Five. Over many generations, the favourable characteristic becomes more common in the population.",
      "South Africa has a clear example: drug-resistant tuberculosis. In a population of TB bacteria, a few carry a mutation that makes them resistant to an antibiotic. That is the variation. When a patient stops taking the treatment too early, the antibiotic has killed only the bacteria that are not resistant. The resistant bacteria survive, reproduce, and pass the resistance allele on. Soon most of the population is resistant, and the disease no longer responds to that drug. This is why patients must finish their treatment.",
      "Exams often ask you to compare Lamarck and Darwin, using the giraffe. Lamarck said giraffes stretched their necks to reach leaves, the necks grew longer through use, and the longer neck was passed on to the offspring. Darwin said giraffes already varied in neck length. Those with longer necks reached more food, survived, and passed on the alleles for long necks. Lamarck was wrong, because characteristics acquired during a lifetime are not inherited. Stretching a neck does not change the DNA in the gametes.",
      "New species form in a similar way, through geographic isolation. A barrier, such as a river, a mountain range or the sea, divides one population into two. The two groups can no longer interbreed, so there is no gene flow between them. Each group undergoes natural selection in its own environment, and over many generations they become more and more different. If they meet again and can no longer interbreed to produce fertile offspring, they have become two separate species.",
      "Watch out for three common mistakes. Writing that the bacteria became resistant because they needed to. That is Lamarck. The resistance was already present in a few bacteria before the antibiotic was used. Writing that an individual evolves. Populations evolve. One organism cannot change its genes. And leaving out a step. Variation, competition, survival, inheritance, over many generations: each step earns a mark.",
      "Now it's your turn. Open Evolution in DONE WELL and practise natural selection and speciation questions, with every mark explained."
    ]
  },
  {
    "id": "matlit-map-scale",
    "subjectId": "mat-lit",
    "topicId": "maps-plans",
    "grades": [
      10,
      11,
      12
    ],
    "title": "Using a scale on maps and plans",
    "summary": "Number and bar scales, map distance to real distance and back, a floor plan, and turning a bar scale into a number scale.",
    "file": "matlit-map-scale.mp4",
    "poster": "matlit-map-scale.jpg",
    "seconds": 164,
    "megabytes": 4.4,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to use the scale on a map or a plan, how to change a measured distance into a real distance and back, and how to avoid the usual mistakes.",
      "Maps and plans use two kinds of scale. A number scale, such as one to fifty thousand, has no units. One unit on the map stands for fifty thousand of the same unit in real life. So one centimetre on the map is fifty thousand centimetres on the ground. A bar scale is a line drawn on the map. Measure it with your ruler, for example two centimetres equals one kilometre. A bar scale stays correct even if the map is enlarged or reduced, because the bar changes size with it.",
      "Here is a typical question. On a map with a scale of one to fifty thousand, two towns are six comma four centimetres apart. How far apart are they in real life? Multiply by the scale: six comma four centimetres times fifty thousand is three hundred and twenty thousand centimetres. Change to metres by dividing by one hundred: three thousand two hundred metres. Change to kilometres by dividing by one thousand: three comma two kilometres. Remember, this is the distance in a straight line. A road that bends is longer.",
      "Now the other way. A room is four comma five metres long. How long is it on a floor plan drawn at a scale of one to fifty? First change to the unit you will measure in on the plan: four comma five metres is four hundred and fifty centimetres. Real life to plan means divide by the scale: four hundred and fifty divided by fifty is nine centimetres. Check by going back: nine centimetres times fifty is four hundred and fifty centimetres, which is four comma five metres.",
      "Exams also ask you to turn a bar scale into a number scale. Suppose two comma five centimetres on the bar stands for one kilometre. Write both in the same unit. One kilometre is one hundred thousand centimetres. So the ratio is two comma five to one hundred thousand. Divide both sides by two comma five, so the first number is one. The number scale is one to forty thousand.",
      "Watch out for three common mistakes. Getting the direction wrong. From the map to real life you multiply by the scale. From real life to the map you divide. Mixing units in a number scale. Both sides must be in the same unit, so change kilometres to centimetres before you write it. And giving an answer in a silly unit. Use kilometres for the distance between towns, and metres for a room.",
      "Now it's your turn. Open Maps and Plans in DONE WELL and practise scale questions, with every mark explained."
    ]
  },
  {
    "id": "maths-sketch-parabola",
    "subjectId": "mathematics",
    "topicId": "math-functions",
    "grades": [
      10,
      11,
      12
    ],
    "title": "Sketching a parabola",
    "summary": "Shape, intercepts and the turning point step by step, the labelled sketch, its range and axis of symmetry.",
    "file": "maths-sketch-parabola.mp4",
    "poster": "maths-sketch-parabola.jpg",
    "seconds": 138,
    "megabytes": 3.5,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to sketch a parabola step by step: the shape, the intercepts, the turning point, and then the sketch itself.",
      "Let's sketch y equals negative x squared plus two x plus eight. Step one, the shape. The coefficient of x squared is negative one, which is less than zero, so the parabola opens downwards and has a maximum. Step two, the y intercept. Let x be zero: y is eight. So the graph cuts the y axis at zero, eight. Step three, the x intercepts. Let y be zero, and multiply through by negative one to get x squared minus two x minus eight equals zero. This factorises as x minus four, times x plus two. So x is four, or x is negative two. The graph cuts the x axis at four, zero and at negative two, zero.",
      "Step four, the turning point. The x value is negative b divided by two a. Here b is two and a is negative one, so x is negative two divided by negative two, which is one. Substitute x equals one into the equation: negative one, plus two, plus eight, which is nine. So the turning point is one, nine, and it is a maximum. Check it: the turning point always lies halfway between the x intercepts. Negative two plus four, divided by two, is one. It matches.",
      "Now plot what you found. The y intercept at zero, eight. The x intercepts at negative two and at four. And the turning point at one, nine. Draw one smooth curve through the points, symmetrical about the line x equals one, and label every point. The examiner marks the labels, not your artwork. The range is y less than or equal to nine, because nine is the highest point. The axis of symmetry is x equals one.",
      "Watch out for three common mistakes. Drawing the wrong shape. Always check the sign of a first. Negative a opens downwards. Sign errors in negative b over two a, when a or b is negative. Write the values in brackets. And unlabelled points, or a sharp point at the turning point instead of a smooth turn.",
      "Now it's your turn. Open Functions and Graphs in DONE WELL and practise sketching parabolas, with every mark explained."
    ]
  },
  {
    "id": "physics-series-parallel",
    "subjectId": "physical-sciences",
    "topicId": "phys-electric-circuits-g11",
    "grades": [
      11
    ],
    "title": "Series and parallel circuits",
    "summary": "How current and voltage share out in series and parallel, and a full circuit worked out with Ohm's law.",
    "file": "physics-series-parallel.mp4",
    "poster": "physics-series-parallel.jpg",
    "seconds": 144,
    "megabytes": 3.7,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how current and potential difference behave in series and parallel circuits, and how to work out every current and voltage in a circuit using Ohm's law.",
      "Here are the rules you need. In series, the same current flows through every resistor, and the voltages across them add up to the total. The resistances simply add. In parallel, every branch has the same voltage across it, and the currents in the branches add up to the total current. For the resistance, one over R parallel is one over R one plus one over R two. And Ohm's law, V equals I R, works for every part of the circuit.",
      "Here is the circuit. A twelve volt battery, with a four ohm resistor in series with a six ohm and a three ohm resistor in parallel. Ignore the internal resistance of the battery. Start with the parallel part. One over R parallel is one sixth plus one third, which is one half. So R parallel is two ohms. That two ohms is in series with the four ohm resistor, so the total resistance is six ohms. The current from the battery is the voltage divided by the total resistance: twelve divided by six, which is two amperes.",
      "Now find each part. All two amperes pass through the four ohm resistor, so the voltage across it is two times four, which is eight volts. The voltages in series add up to twelve, so the parallel part has twelve minus eight, which is four volts, across both branches. The current in the six ohm branch is four divided by six: zero comma six seven amperes. The current in the three ohm branch is four divided by three: one comma three three amperes. Check: the branch currents add up to two amperes, the current from the battery. The smaller resistance takes the bigger current.",
      "Watch out for three common mistakes. Forgetting to invert at the end. If one over R parallel is a half, then R parallel is two ohms, not zero comma five. Using the full twelve volts across a resistor that only gets part of it. Use V equals I R on that resistor. And adding parallel resistors. A parallel combination is always smaller than the smallest resistor in it.",
      "Now it's your turn. Open Electric Circuits in DONE WELL and practise series and parallel circuits, with every mark explained."
    ]
  },
  {
    "id": "lifesci-protein-synthesis",
    "subjectId": "life-sciences",
    "topicId": "life-sci-dna-code",
    "grades": [
      12
    ],
    "title": "Protein synthesis: transcription and translation",
    "summary": "Where each stage happens, base pairing with uracil, and a DNA template worked through to its amino acids.",
    "file": "lifesci-protein-synthesis.mp4",
    "poster": "lifesci-protein-synthesis.jpg",
    "seconds": 140,
    "megabytes": 3.7,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how the code in DNA is used to make a protein, in two stages, transcription and translation, and how to work out an amino acid sequence step by step.",
      "Protein synthesis happens in two stages. The first stage is transcription, in the nucleus. The DNA molecule unwinds, and one strand acts as a template. Free RNA nucleotides pair with it to form messenger RNA, which leaves the nucleus through a nuclear pore. The second stage is translation, at a ribosome in the cytoplasm. Each codon of three bases on the messenger RNA is matched by the anticodon of a transfer RNA. Each transfer RNA brings a particular amino acid, and the amino acids are joined by peptide bonds to form the protein.",
      "The bases pair the same way as in DNA, with one difference: RNA has uracil instead of thymine. So adenine on the DNA template pairs with uracil on the messenger RNA, and thymine pairs with adenine. Cytosine pairs with guanine, and guanine with cytosine.",
      "Here is a typical question. The template strand of DNA reads T A C, G G A, C T T. Give the messenger RNA, the transfer RNA anticodons, and the amino acids. Transcription: pair each base, remembering U instead of T. The messenger RNA codons are A U G, C C U, G A A. The transfer RNA anticodons pair with the codons: U A C, G G A, C U U. Then read each codon, not the anticodon, from the codon table you are given: A U G is methionine, C C U is proline, and G A A is glutamic acid. So this part of the protein is methionine, proline, glutamic acid.",
      "Watch out for three common mistakes. Writing T in messenger RNA or transfer RNA. RNA uses U, uracil. Looking up the anticodon in the codon table. The table uses the messenger RNA codons. And mixing up where each stage happens. Transcription is in the nucleus, and translation is at the ribosome in the cytoplasm.",
      "Now it's your turn. Open DNA: Code of Life in DONE WELL and practise protein synthesis, with every mark explained."
    ]
  }
]

export const getVideo = (id: string): TopicVideo | undefined => topicVideos.find((v) => v.id === id)

export const videosForTopic = (topicId: string): TopicVideo[] => topicVideos.filter((v) => v.topicId === topicId)

export const videoMinutes = (v: TopicVideo): number => Math.max(1, Math.round(v.seconds / 60))
