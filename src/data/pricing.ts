export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    price: "R0",
    description: "Explore the platform and try sample practice for any grade.",
    features: ["Sample practice questions", "1 topic per subject", "Progress preview"],
    ctaLabel: "Get started free",
  },
  {
    id: "learner",
    name: "Learner",
    price: "R39",
    period: "/month",
    description: "Full practice, tests and progress tracking for one learner.",
    features: [
      "Unlimited practice, all topics",
      "Weekly tests & memos",
      "Progress tracking & recommendations",
      "Learner Book & Workbook access",
    ],
    ctaLabel: "Upgrade Learner",
    highlighted: true,
  },
  {
    id: "teacher",
    name: "Teacher",
    price: "R99",
    period: "/month",
    description: "Resources, question bank and analytics for one class.",
    features: [
      "Everything in Learner",
      "Worksheet & memo generator",
      "Class analytics & interventions",
      "Downloadable Teacher Guides",
    ],
    ctaLabel: "Upgrade Teacher",
  },
  {
    id: "school",
    name: "School",
    price: "Custom",
    description: "School-wide access, admin tools and dedicated support.",
    features: [
      "Everything in Teacher, all classes",
      "School-wide analytics",
      "Bulk learner & teacher accounts",
      "Priority WhatsApp support",
    ],
    ctaLabel: "Talk to us",
  },
];
