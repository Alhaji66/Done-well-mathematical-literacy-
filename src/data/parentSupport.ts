export interface ParentSupportTip {
  topicId: string;
  whyItMatters: string;
  homeAction: string;
}

export const parentSupportTips: ParentSupportTip[] = [
  {
    topicId: "finance",
    whyItMatters: "Finance skills show up in every payslip, budget and loan decision your child will face as an adult.",
    homeAction:
      "Show your child a real household budget or account statement and ask them to identify income, expenses and any interest charges — you don't need to check the maths, just talk through it together.",
  },
  {
    topicId: "data-handling",
    whyItMatters: "Understanding data helps your child make sense of news, sports statistics and school reports.",
    homeAction:
      "Pick a table or graph from a newspaper, app or sports score and ask your child to explain what it shows in their own words.",
  },
  {
    topicId: "maps-plans",
    whyItMatters: "Reading maps and plans is a life skill used for travel, shopping centres and home layouts.",
    homeAction:
      "Next time you're using a maps app or a mall directory, hand your phone or the map to your child and let them navigate to the destination.",
  },
  {
    topicId: "measurement",
    whyItMatters: "Measurement comes up in cooking, DIY projects and buying the right amount of something.",
    homeAction:
      "Ask your child to help measure ingredients while cooking, or to work out how much paint or fabric would be needed for a small home project.",
  },
  {
    topicId: "probability",
    whyItMatters: "Probability builds sensible decision-making — from weather forecasts to weighing up risk.",
    homeAction:
      "When the weather app shows a chance of rain, ask your child what that percentage actually means and whether they'd take an umbrella.",
  },
  {
    topicId: "tariffs",
    whyItMatters: "Tariffs affect every household bill — electricity, water and airtime — for the rest of your child's life.",
    homeAction:
      "Look at your municipal or prepaid electricity account together and ask your child to point out the fixed charge versus the usage charge.",
  },
  {
    topicId: "profit-loss-breakeven",
    whyItMatters: "These ideas underpin running a small business, a school fundraiser, or managing personal spending.",
    homeAction:
      "If your child sells anything (sweets, airtime, a small side hustle) or takes part in a school fundraiser, ask them to work out how many items they need to sell to cover their costs.",
  },
];

export function getSupportTip(topicId: string) {
  return parentSupportTips.find((t) => t.topicId === topicId);
}
