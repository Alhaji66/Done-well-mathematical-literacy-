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
  }
]

export const getVideo = (id: string): TopicVideo | undefined => topicVideos.find((v) => v.id === id)

export const videosForTopic = (topicId: string): TopicVideo[] => topicVideos.filter((v) => v.topicId === topicId)

export const videoMinutes = (v: TopicVideo): number => Math.max(1, Math.round(v.seconds / 60))
