export interface HomeAction {
  id: string
  topicId: string
  title: string
  detail: string
}

export const homeActions: HomeAction[] = [
  {
    id: 'ha-1',
    topicId: 'maps-plans',
    title: 'Practise reading scale together',
    detail: 'Next time you use a paper map or app map, ask Karabo to estimate the real distance between two places using the scale. No maths background needed — just look at the numbers together.',
  },
  {
    id: 'ha-2',
    topicId: 'profit-loss-breakeven',
    title: 'Talk through a household budget item',
    detail: 'Pick one monthly cost (e.g. airtime or transport) and ask Karabo to explain what it would take to "break even" if they were selling something to cover that cost.',
  },
  {
    id: 'ha-3',
    topicId: 'finance',
    title: 'Review a real account or till slip',
    detail: 'Show Karabo a municipal bill or grocery receipt and ask them to identify the fixed and variable charges. This builds real-world financial confidence.',
  },
]

export const parentGuidanceIntro =
  "You don't need to be a maths expert to help. These simple, everyday actions reinforce what Karabo is learning on Done Well — just 10–15 minutes a week makes a difference."
