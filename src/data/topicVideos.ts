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
  },
  {
    "id": "matlit-break-even",
    "subjectId": "mat-lit",
    "topicId": "finance",
    "grades": [
      10,
      11,
      12
    ],
    "title": "Break-even analysis",
    "summary": "Fixed and variable costs, cost and income formulas, the break-even point by calculation and on a graph, and profit.",
    "file": "matlit-break-even.mp4",
    "poster": "matlit-break-even.jpg",
    "seconds": 138,
    "megabytes": 3.6,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to find the break-even point of a small business, by calculation and from a graph, and how to work out its profit.",
      "Sipho sells vetkoek from a stall. He pays a fixed cost of six hundred rand a month for the stall. It stays the same however many he sells. Each vetkoek costs three rand fifty to make. That is a variable cost: it grows with every vetkoek. He sells them at eight rand each. So for n vetkoek, his total cost is six hundred plus three comma five zero times n, and his income is eight times n.",
      "The break-even point is where the income exactly covers the costs: no profit and no loss. Set income equal to cost: eight n equals six hundred plus three comma five zero n. Subtract three comma five zero n from both sides: four comma five zero n equals six hundred, so n is one hundred and thirty three comma three. He cannot sell part of a vetkoek, and one hundred and thirty three would leave a small loss, so he must sell one hundred and thirty four to break even.",
      "The same thing on a graph. The cost line starts at six hundred rand, the fixed cost, and rises by three rand fifty for each vetkoek. The income line starts at zero and rises more steeply, by eight rand for each one. The lines cross at the break-even point, about one hundred and thirty three vetkoek. To the left the cost line is higher, so he makes a loss. To the right the income line is higher, so he makes a profit.",
      "Now the profit if he sells two hundred vetkoek in a month. Income: eight times two hundred is one thousand six hundred rand. Cost: six hundred plus three comma five zero times two hundred, which is one thousand three hundred rand. Profit is income minus cost: three hundred rand.",
      "Watch out for three common mistakes. Forgetting the fixed cost. It has to be paid even if nothing is sold. Rounding the break-even point down. Round up to the next whole item, or there is still a small loss. And calling the break-even point a profit. At break-even, the profit is zero.",
      "Now it's your turn. Open Finance in DONE WELL and practise break-even questions, with every mark explained."
    ]
  },
  {
    "id": "maths-optimisation",
    "subjectId": "mathematics",
    "topicId": "math-calculus",
    "grades": [
      12
    ],
    "title": "Optimisation: the largest box",
    "summary": "The four steps of an optimisation question, worked on the open-box problem, with a check that it is a maximum.",
    "file": "maths-optimisation.mp4",
    "poster": "maths-optimisation.jpg",
    "seconds": 156,
    "megabytes": 4,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to use calculus to find a maximum or a minimum, with a classic exam problem: the largest box you can make from a sheet of card.",
      "Every optimisation question uses the same four steps. First, write the quantity you want to make as large or as small as possible in terms of one variable. Second, differentiate. Third, set the derivative equal to zero and solve. At a maximum or a minimum, the gradient is zero. Fourth, choose the answer that makes sense in the situation, and answer the question that was asked.",
      "Here is the problem. A square piece of card is twenty four centimetres wide. A square of side x is cut from each corner, and the sides are folded up to make an open box. Find the value of x that gives the largest volume. Cutting x from both ends of each side leaves a base of twenty four minus two x by twenty four minus two x. The height of the box is x. So the volume is x times twenty four minus two x, squared. Expand it: five hundred and seventy six x, minus ninety six x squared, plus four x cubed. And x must be between zero and twelve, or there is no box.",
      "Differentiate: dV by dx is five hundred and seventy six, minus one hundred and ninety two x, plus twelve x squared. Set it equal to zero. Take out the common factor twelve, and factorise: twelve, times x minus four, times x minus twelve, equals zero. So x is four, or x is twelve. But x equals twelve cuts the whole card away and leaves no box, so x is four centimetres. The largest volume is four times sixteen squared, which is one thousand and twenty four cubic centimetres.",
      "How do you know it is a maximum and not a minimum? Check a value on either side. At three, the volume is nine hundred and seventy two. At four, it is one thousand and twenty four. At five, it is nine hundred and eighty. The volume is largest at four, so x equals four gives the maximum.",
      "Watch out for three common mistakes. Differentiating before the quantity is written in one variable. Use the information given to get rid of the others first. Keeping an answer that is impossible in the situation, like a box with no base. And stopping at x equals four when the question asks for the largest volume. Read the question again before you finish.",
      "Now it's your turn. Open Differential Calculus in DONE WELL and practise optimisation, with every mark explained."
    ]
  },
  {
    "id": "chem-le-chatelier",
    "subjectId": "physical-sciences",
    "topicId": "phys-chemical-equilibrium",
    "grades": [
      12
    ],
    "title": "Le Chatelier's principle",
    "summary": "How the Haber equilibrium responds to concentration, pressure, temperature and a catalyst, and when Kc changes.",
    "file": "chem-le-chatelier.mp4",
    "poster": "chem-le-chatelier.jpg",
    "seconds": 136,
    "megabytes": 3.7,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn Le Chatelier's principle, and how to predict what happens to an equilibrium when you change the concentration, the pressure or the temperature.",
      "Le Chatelier's principle says that a system at equilibrium opposes any change made to it. In the words the memo wants: when the equilibrium in a closed system is disturbed, the system re-instates a new equilibrium by favouring the reaction that opposes the disturbance. We will use the Haber process: nitrogen plus three hydrogen forms two ammonia. The forward reaction is exothermic, with delta H negative ninety two kilojoules per mole.",
      "Here is what happens with each change. Add nitrogen: the system opposes it by using nitrogen up, so the forward reaction is favoured and more ammonia forms. Increase the pressure: the system opposes it by reducing the number of gas molecules. There are four moles of gas on the left and two on the right, so the forward reaction is favoured, and more ammonia forms. Increase the temperature: the system opposes it by absorbing heat, so the endothermic reaction is favoured. Here that is the reverse reaction, so less ammonia forms. Add a catalyst: both reactions speed up equally, so the equilibrium is reached faster, but the yield does not change.",
      "What about the equilibrium constant? K c is the concentration of ammonia squared, divided by the concentration of nitrogen times the concentration of hydrogen cubed. Changing a concentration or the pressure shifts the position of the equilibrium, but K c stays the same. Only a change in temperature changes K c. Here, raising the temperature favours the reverse reaction, so K c decreases.",
      "Watch out for three common mistakes. Saying a catalyst increases the yield. It speeds up both reactions equally, so the yield stays the same. Counting the moles of every substance when the pressure changes. Count only the gases. And explaining without naming the favoured reaction. Always say forward or reverse, and why.",
      "Now it's your turn. Open Chemical Equilibrium in DONE WELL and practise Le Chatelier's principle, with every mark explained."
    ]
  },
  {
    "id": "lifesci-dihybrid",
    "subjectId": "life-sciences",
    "topicId": "life-sci-genetics",
    "grades": [
      12
    ],
    "title": "Dihybrid crosses",
    "summary": "Two characteristics at once: gametes, the 16-box Punnett square, the 9 : 3 : 3 : 1 ratio and independent assortment.",
    "file": "lifesci-dihybrid.mp4",
    "poster": "lifesci-dihybrid.jpg",
    "seconds": 122,
    "megabytes": 3.2,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to do a dihybrid cross, following two characteristics at the same time, and why it gives the ratio nine, three, three, one.",
      "In pea plants, round seeds are dominant to wrinkled, and yellow seeds are dominant to green. A pure-breeding round yellow plant, R R Y Y, is crossed with a wrinkled green plant, r r y y. Every offspring in the first generation is R r Y y, so all of them have round, yellow seeds. Now cross two of these F one plants: R r Y y times R r Y y.",
      "First, the gametes. Each gamete gets one allele of each gene, so an R r Y y plant makes four kinds of gamete: R Y, R small y, small r Y, and small r small y. All four are possible because the alleles of the two genes separate independently of each other during meiosis. That is the law of independent assortment.",
      "Now the Punnett square. Write the four gametes of one parent along the top, and the four of the other down the side. Fill in each box by combining the gametes. That gives sixteen combinations. Sort them by phenotype. Any box with at least one capital R is round, and any box with at least one capital Y is yellow. There are nine round yellow, three round green, three wrinkled yellow, and one wrinkled green. The phenotypic ratio is nine to three to three to one.",
      "Watch out for three common mistakes. Writing gametes with two alleles of the same gene, like R R. Each gamete carries one allele for seed shape and one for seed colour. Giving the genotype ratio when the question asks for the phenotype ratio. Nine to three to three to one is the phenotype ratio. And leaving out the labels of a genetic cross: P one, F one, meiosis and fertilisation. Each one earns a mark.",
      "Now it's your turn. Open Genetics and Inheritance in DONE WELL and practise dihybrid crosses, with every mark explained."
    ]
  },
  {
    "id": "matlit-probability",
    "subjectId": "mat-lit",
    "topicId": "data-handling",
    "grades": [
      10,
      11,
      12
    ],
    "title": "Probability: chance, outcomes and relative frequency",
    "summary": "The probability scale, a probability from outcomes, theory against an experiment, and two dice at once.",
    "file": "matlit-probability.mp4",
    "poster": "matlit-probability.jpg",
    "seconds": 145,
    "megabytes": 3.9,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to work out a probability, how it compares with what happens in an experiment, and how to handle two events at once.",
      "Every probability lies between zero and one. Zero means impossible, like rolling a seven on an ordinary die. Zero comma five means an even chance, like getting heads when you toss a coin. And one means certain. The probability of an event is the number of favourable outcomes, divided by the total number of possible outcomes. You can give it as a fraction, a decimal or a percentage.",
      "Here is a typical question. A bag holds five red, three blue and two green sweets. One sweet is taken out without looking. First find the total: five plus three plus two is ten sweets. The probability of blue is three out of ten: zero comma three, or thirty percent. The probability that it is not red is the blue and green together, five out of ten: zero comma five, or fifty percent.",
      "Now compare theory with an experiment. A spinner has four equal sections, one of them red. It is spun fifty times and lands on red twelve times. In theory, the probability of red is one out of four: zero comma two five. In the experiment, the relative frequency is twelve out of fifty: zero comma two four. They are close but not the same. The more times you spin, the closer the relative frequency usually gets to the theoretical probability.",
      "With two events, list or count every outcome. Two dice are rolled. What is the probability that the total is seven? Each die has six faces, so there are six times six, thirty six, equally likely pairs. Six of them add up to seven: one and six, two and five, three and four, and the same three the other way round. So the probability is six out of thirty six, which is one sixth, about seventeen percent.",
      "Watch out for three common mistakes. A probability bigger than one, or negative, is always wrong. Check your answer. Dividing by the wrong total. Count every possible outcome, not just some of them. And mixing up relative frequency, which is what actually happened, with probability, which is what you expect.",
      "Now it's your turn. Open Data Handling in DONE WELL and practise probability questions, with every mark explained."
    ]
  },
  {
    "id": "maths-trig-identities",
    "subjectId": "mathematics",
    "topicId": "math-trigonometry",
    "grades": [
      11,
      12
    ],
    "title": "Proving trigonometric identities",
    "summary": "The quotient and square identities, a method that always works, and two proofs set out step by step.",
    "file": "maths-trig-identities.mp4",
    "poster": "maths-trig-identities.jpg",
    "seconds": 134,
    "megabytes": 3.4,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to prove trigonometric identities, with a method that works every time, and two proofs set out the way the memo marks them.",
      "Two identities do most of the work. The quotient identity: tan x equals sin x divided by cos x. And the square identity: sin squared x plus cos squared x equals one. Rearranged, one minus cos squared x is sin squared x, and one minus sin squared x is cos squared x.",
      "Here is a method that always works. Start with the more complicated side. Change tan into sin over cos, and look for one minus cos squared, or one minus sin squared. Write everything as a single fraction, then simplify. Finish by showing it equals the right-hand side. Never move terms across the equals sign: an identity is proved one side at a time.",
      "Prove that one minus cos squared x, divided by sin x cos x, equals tan x. Start on the left. One minus cos squared x is sin squared x. Cancel one sin x from the top and the bottom, which leaves sin x over cos x. And sin x over cos x is tan x, which is the right-hand side.",
      "A second one. Prove that one over cos x, minus cos x, equals sin x tan x. Start on the left and write it as one fraction, over cos x: one minus cos squared x, all over cos x. One minus cos squared x is sin squared x. Split sin squared x over cos x into sin x, times sin x over cos x. That is sin x tan x, the right-hand side.",
      "Watch out for three common mistakes. Working on both sides at once, or cross-multiplying. That assumes the identity is true before you have proved it. Writing sin squared x as sin of x squared, or cancelling terms that are added rather than multiplied. And forgetting where the identity is undefined. Here, it is undefined wherever cos x is zero, because you cannot divide by zero.",
      "Now it's your turn. Open Trigonometry in DONE WELL and practise proving identities, with every step explained."
    ]
  },
  {
    "id": "chem-acids-titration",
    "subjectId": "physical-sciences",
    "topicId": "phys-acids-bases",
    "grades": [
      12
    ],
    "title": "Acids, bases, pH and titration",
    "summary": "Lowry-Brønsted definitions, strong against concentrated, pH from a concentration, and a titration worked in full.",
    "file": "chem-acids-titration.mp4",
    "poster": "chem-acids-titration.jpg",
    "seconds": 178,
    "megabytes": 4.5,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn what acids and bases are, how to calculate pH, and how to work out a titration, step by step.",
      "In the Lowry-Brønsted theory, acids and bases are defined by protons. An acid is a proton donor. Hydrogen chloride gives its proton to water, forming hydronium ions. A base is a proton acceptor. Ammonia accepts a proton from water, forming hydroxide ions. Strong and concentrated are different things. A strong acid ionises completely in water. A concentrated acid has a lot of acid dissolved in a small volume. A weak acid can be concentrated, and a strong acid can be dilute.",
      "pH is the negative log of the hydronium ion concentration. And at twenty five degrees, the hydronium and hydroxide concentrations multiply to ten to the minus fourteen. Hydrochloric acid of zero comma zero one moles per cubic decimetre is a strong acid, so the hydronium concentration is zero comma zero one. Its pH is the negative log of zero comma zero one, which is two. Sodium hydroxide of zero comma zero zero one moles per cubic decimetre gives a hydroxide concentration of zero comma zero zero one. So the hydronium concentration is ten to the minus fourteen divided by ten to the minus three: ten to the minus eleven. Its pH is eleven.",
      "Now a titration. Twenty five cubic centimetres of sodium hydroxide is neutralised by twenty cubic centimetres of hydrochloric acid of zero comma one moles per cubic decimetre. Find the concentration of the sodium hydroxide. Write the balanced equation. Hydrochloric acid and sodium hydroxide react in a one to one ratio. Find the moles of acid: n equals c times V. Change the volume to cubic decimetres first: twenty cubic centimetres is zero comma zero two zero. So n is zero comma zero zero two moles. The ratio is one to one, so there are also zero comma zero zero two moles of sodium hydroxide. Its concentration is n divided by V: zero comma zero zero two divided by zero comma zero two five, which is zero comma zero eight moles per cubic decimetre.",
      "Watch out for three common mistakes. Using cubic centimetres in n equals c V. Divide by one thousand to get cubic decimetres. Ignoring the mole ratio. Sulfuric acid reacts with sodium hydroxide in a one to two ratio, not one to one. And calling a dilute strong acid weak. Strength is about how completely it ionises, not how much is dissolved.",
      "Now it's your turn. Open Acids and Bases in DONE WELL and practise pH and titration calculations, with every mark explained."
    ]
  },
  {
    "id": "lifesci-menstrual-cycle",
    "subjectId": "life-sciences",
    "topicId": "life-sci-human-reproduction",
    "grades": [
      12
    ],
    "title": "The menstrual cycle and its hormones",
    "summary": "FSH, oestrogen, LH and progesterone, the 28-day cycle day by day, and the negative feedback that links them.",
    "file": "lifesci-menstrual-cycle.mp4",
    "poster": "lifesci-menstrual-cycle.jpg",
    "seconds": 146,
    "megabytes": 4.1,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how the menstrual cycle works, which hormones control it, and how negative feedback links them, the way exam questions ask it.",
      "Four hormones control the cycle: two from the pituitary gland, and two from the ovary. F S H, follicle stimulating hormone, from the pituitary, makes a follicle develop in the ovary. The follicle produces oestrogen. Oestrogen makes the endometrium, the lining of the uterus, thicken. It also inhibits the production of F S H. L H, luteinising hormone, from the pituitary, causes ovulation. The empty follicle then becomes the corpus luteum. The corpus luteum produces progesterone, which keeps the endometrium thick and ready for an embryo. Progesterone inhibits F S H and L H.",
      "Here is a typical twenty eight day cycle. Days one to five: menstruation, when the endometrium is shed. Days six to thirteen: F S H makes a follicle develop. It produces oestrogen, and the endometrium thickens. Around day fourteen, a surge of L H causes ovulation: the ovum is released. Days fifteen to twenty eight: the corpus luteum produces progesterone, which keeps the endometrium thick. If there is no embryo, the corpus luteum breaks down, progesterone levels fall, and the endometrium is shed. The next cycle begins.",
      "The hormones are linked by negative feedback: a high level of one hormone switches off the production of another. While the progesterone level is high, it inhibits F S H, so no new follicle develops while the endometrium is ready for an embryo. When the progesterone level falls, F S H is no longer inhibited, and a new follicle, and a new cycle, begins. The contraceptive pill works the same way. Its hormones keep F S H and L H low, so no ovulation takes place.",
      "Watch out for three common mistakes. Saying the pituitary gland makes oestrogen or progesterone. Those come from the ovary. Mixing up the roles of the pituitary hormones. F S H develops the follicle, and L H causes ovulation. And forgetting what the corpus luteum makes. Its job is to produce progesterone.",
      "Now it's your turn. Open Human Reproduction in DONE WELL and practise the menstrual cycle, with every mark explained."
    ]
  },
  {
    "id": "matlit-budget-inflation",
    "subjectId": "mat-lit",
    "topicId": "finance",
    "grades": [
      10,
      11,
      12
    ],
    "title": "Household budgets and inflation",
    "summary": "A family budget, surplus or deficit, a share of income, and inflation over one and two years.",
    "file": "matlit-budget-inflation.mp4",
    "poster": "matlit-budget-inflation.jpg",
    "seconds": 155,
    "megabytes": 4.1,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to read a household budget, find a surplus or a deficit, and work out what inflation does to prices next year.",
      "Here is the Mokoena family's budget for one month. Their income is a net salary of twelve thousand six hundred rand, and child support grants of one thousand one hundred and twenty rand. Their expenses are rent, groceries, transport, electricity and water, and school and clothing. The total income is thirteen thousand seven hundred and twenty rand, and the total expenses are twelve thousand nine hundred and forty rand.",
      "Subtract the expenses from the income. Thirteen thousand seven hundred and twenty minus twelve thousand nine hundred and forty is seven hundred and eighty rand. It is positive, so the family has a surplus of seven hundred and eighty rand, which they can save. If it were negative, it would be a deficit. Exams also ask for a percentage: groceries are four thousand two hundred and fifty out of thirteen thousand seven hundred and twenty, which is thirty one percent of the income.",
      "Inflation is the rise in prices over time. If inflation is five comma five percent, what will the same groceries cost next year? The increase is five comma five percent of four thousand two hundred and fifty rand: two hundred and thirty three rand, seventy five cents. So next year they cost four thousand four hundred and eighty three rand, seventy five. The shortcut is to multiply by one comma zero five five. For a second year, the inflation is worked on the new price, not the old one: four thousand four hundred and eighty three, seventy five, times one comma zero five five, which is four thousand seven hundred and thirty rand, thirty six cents.",
      "What does that mean for the family? If only the groceries rise, they cost two hundred and thirty three rand, seventy five more each month. If the salary stays the same, the surplus drops from seven hundred and eighty rand to five hundred and forty six rand, twenty five, from groceries alone. That is why salary increases are compared with inflation.",
      "Watch out for three common mistakes. Using the gross salary when the budget is built on net, take-home pay. Working the second year of inflation on the original price. Use the new price. And calling a negative difference a surplus. Negative is a deficit.",
      "Now it's your turn. Open Finance in DONE WELL and practise budget and inflation questions, with every mark explained."
    ]
  },
  {
    "id": "maths-analytical-geometry",
    "subjectId": "mathematics",
    "topicId": "math-analytical-geometry",
    "grades": [
      10,
      11
    ],
    "title": "Analytical geometry: two points, everything else",
    "summary": "Distance, midpoint and gradient, the equation of the line, a perpendicular gradient and the angle of inclination.",
    "file": "maths-analytical-geometry.mp4",
    "poster": "maths-analytical-geometry.jpg",
    "seconds": 158,
    "megabytes": 4,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how to get almost everything from just two points: the distance, the midpoint, the gradient, the equation of the line, and its angle of inclination.",
      "For two points, A and B, there are three formulae on the formula sheet. The distance between them: the square root of the difference in x squared, plus the difference in y squared. The midpoint: the average of the x values, and the average of the y values. And the gradient: the difference in y divided by the difference in x.",
      "Let's use the points A, negative two, three, and B, four, negative one. The distance: four minus negative two is six, and negative one minus three is negative four. Six squared plus negative four squared is fifty two, so A B is the square root of fifty two, about seven comma two one. The midpoint: negative two plus four, over two, is one. Three plus negative one, over two, is one. So M is one, one. The gradient: negative four over six, which is negative two thirds.",
      "In Grade eleven, you find the equation of the line. Use y minus y one equals m, times x minus x one, with the gradient negative two thirds and the point A. Substitute: y minus three equals negative two thirds, times x plus two. Simplify: y equals negative two thirds x, plus five thirds. Check it with the other point. When x is four, y is negative eight thirds plus five thirds, which is negative one. That is point B, so the equation is right.",
      "Two more things you are often asked. A line perpendicular to A B has the negative reciprocal gradient: three over two, because negative two thirds times three halves is negative one. The angle of inclination, theta, satisfies tan theta equals the gradient. Tan theta is negative two thirds, and the calculator gives a reference angle of thirty three comma six nine degrees. The gradient is negative, so the line slopes down and theta is obtuse: one hundred and eighty minus thirty three comma six nine, which is one hundred and forty six comma three one degrees.",
      "Watch out for three common mistakes. Sign errors with negative coordinates. Write four minus negative two, in brackets. Mixing the order. If y two comes from B, then x two must come from B too. And giving a negative angle of inclination. When the gradient is negative, add one hundred and eighty degrees to the calculator answer.",
      "Now it's your turn. Open Analytical Geometry in DONE WELL and practise with every mark explained."
    ]
  },
  {
    "id": "physics-generators-ac",
    "subjectId": "physical-sciences",
    "topicId": "phys-electrodynamics",
    "grades": [
      12
    ],
    "title": "Generators, motors and alternating current",
    "summary": "How a generator works, slip rings against a split-ring commutator, rms values and a kettle worked in full.",
    "file": "physics-generators-ac.mp4",
    "poster": "physics-generators-ac.jpg",
    "seconds": 159,
    "megabytes": 4.2,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how a generator works, how AC and DC generators differ, and how to use rms values in an AC calculation.",
      "A generator changes mechanical energy into electrical energy, with a coil turning in a magnetic field. As the coil rotates, the magnetic flux through it keeps changing. By Faraday's law of electromagnetic induction, a changing flux induces an emf, and a current flows in the circuit. A motor works the other way round: a current in a coil in a magnetic field experiences a force that makes it turn. It changes electrical energy into mechanical energy.",
      "AC and DC generators differ in one part: how the coil connects to the outside circuit. An AC generator uses slip rings. Each end of the coil stays connected to the same brush, so the current reverses direction every half turn. That is alternating current. A DC generator uses a split-ring commutator. It swaps the connections every half turn, so the current in the outside circuit always flows in the same direction.",
      "An AC voltage keeps changing, so we use its root mean square value: the DC value that would give the same power. The rms voltage is the maximum voltage divided by the square root of two. The same goes for current. The average power is the rms voltage times the rms current. South African mains electricity peaks at about three hundred and twenty five volts. Divided by the square root of two, that is about two hundred and thirty volts rms, the value printed on appliances.",
      "Here is a typical question. A two thousand watt kettle runs on two hundred and thirty volts rms. Find the rms current and the maximum current. Average power is V rms times I rms, so I rms is two thousand divided by two hundred and thirty: eight comma seven zero amperes. The maximum current is the rms current times the square root of two: twelve comma three zero amperes.",
      "Watch out for three common mistakes. Using the maximum voltage in P equals V I. Power calculations use rms values. Multiplying by the square root of two when you should divide. The rms value is always smaller than the maximum. And mixing up slip rings, which give AC, with the split-ring commutator, which gives DC.",
      "Now it's your turn. Open Electrodynamics in DONE WELL and practise generators and AC, with every mark explained."
    ]
  },
  {
    "id": "lifesci-reflex-arc",
    "subjectId": "life-sciences",
    "topicId": "life-sci-response-humans",
    "grades": [
      12
    ],
    "title": "The nervous system and the reflex arc",
    "summary": "The CNS and PNS, three kinds of neuron, the reflex arc step by step, and why it is fast.",
    "file": "lifesci-reflex-arc.mp4",
    "poster": "lifesci-reflex-arc.jpg",
    "seconds": 128,
    "megabytes": 3.6,
    "transcript": [
      "Welcome to DONE WELL. In this lesson you will learn how the nervous system is organised, the three kinds of neuron, and how a reflex arc works, step by step.",
      "The nervous system has two parts. The central nervous system is the brain and the spinal cord. It processes information and decides on a response. The peripheral nervous system is made up of the nerves that carry impulses between the central nervous system and the rest of the body. There are three kinds of neuron. Sensory neurons carry impulses to the central nervous system. Interneurons connect neurons inside it. Motor neurons carry impulses to effectors, the muscles and glands.",
      "A reflex is a quick, automatic response. Suppose you touch a hot plate. Heat receptors in the skin are stimulated, and an impulse starts. A sensory neuron carries the impulse to the spinal cord. In the spinal cord, an interneuron passes the impulse on. A motor neuron carries the impulse to the effector, a muscle in the arm. The muscle contracts, and your hand is pulled away before the brain has even registered the pain.",
      "Why is a reflex so fast? The impulse travels a short pathway through the spinal cord, with only a few synapses, instead of going all the way to the brain and back. That protects the body from damage before you have time to think. At each synapse, the gap between two neurons, a chemical called a neurotransmitter carries the impulse across. It can only cross in one direction, so impulses always travel one way along the arc.",
      "Watch out for three common mistakes. Saying the brain controls the reflex. The response is coordinated in the spinal cord. Mixing up sensory and motor neurons. Sensory neurons carry impulses to the central nervous system, and motor neurons carry them away from it. And leaving out a step of the arc. Receptor, sensory neuron, interneuron, motor neuron, effector: each one earns a mark.",
      "Now it's your turn. Open Responding to the Environment in DONE WELL and practise the nervous system, with every mark explained."
    ]
  }
]

export const getVideo = (id: string): TopicVideo | undefined => topicVideos.find((v) => v.id === id)

export const videosForTopic = (topicId: string): TopicVideo[] => topicVideos.filter((v) => v.topicId === topicId)

export const videoMinutes = (v: TopicVideo): number => Math.max(1, Math.round(v.seconds / 60))
