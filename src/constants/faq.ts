// ---------------------------------------------------------------------------
// FAQ - Single Source of Truth (Figma nodes 48:9426 / 60:18380 / 48:8801)
// ---------------------------------------------------------------------------

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How long will my project take?",
    answer:
      "Project timelines depend on scope. A kitchen remodel typically runs 3-6 weeks, while a full home renovation can take 8-16 weeks. We provide a clear timeline estimate at the proposal stage so you know what to expect before we start.",
  },
  {
    question: "How long have you been in business?",
    answer:
      "Master Cabinets has been serving South Florida homeowners for over 25 years. In that time we've completed thousands of kitchen, bathroom, and whole-home remodels across Collier, Broward, and Miami-Dade counties.",
  },
  {
    question: "Do you handle full home renovations?",
    answer:
      "Yes. We coordinate cabinetry, flooring, painting, electrical, and outdoor work through one dedicated team. This eliminates the scheduling conflicts and communication gaps that come from managing multiple contractors.",
  },
  {
    question: "Do you offer free quotes?",
    answer:
      "Absolutely. We walk the space, scope the work, and give you a real number in writing: no fee, no obligation, and no pressure to move forward. Use the form on this page or call us directly to get started.",
  },
  {
    question: "Do you provide a warranty?",
    answer:
      "We stand behind our workmanship with a 1-year warranty covering installation defects on every remodel and custom cabinetry project. This gives you real peace of mind long after the project is complete.",
  },
];
