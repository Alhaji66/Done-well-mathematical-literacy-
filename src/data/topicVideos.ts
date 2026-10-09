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
  }
]

export const getVideo = (id: string): TopicVideo | undefined => topicVideos.find((v) => v.id === id)

export const videosForTopic = (topicId: string): TopicVideo[] => topicVideos.filter((v) => v.topicId === topicId)

export const videoMinutes = (v: TopicVideo): number => Math.max(1, Math.round(v.seconds / 60))
