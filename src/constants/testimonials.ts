// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Reviews - Single Source of Truth
//
// These are the client's real Google reviews, transcribed from the Business
// Profile (CID 7209192084505606319). Wording is kept as written; the only edits
// are capitalisation, obvious typos ("definately" -> "definitely", "buisness"
// -> "business", "fast paste" -> "fast paced") and terminal punctuation.
//
// Several reviews arrive from Google truncated with a "...More" link. Those are
// cut at the last complete clause rather than being continued - the rest of the
// sentence is not ours to write. Reviews with no substance beyond "great"
// were left out.
//
// Tags are only populated where the reviewer actually says so. Most people do
// not name the service or the city, so most cards carry Google's own attribute
// chip ("Great price", "Reasonable price") and nothing else.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

/** Filter chips shared by the Reviews and Gallery pages (Figma 60:18380 / 60:12187). */
export const MC_FILTER_CATEGORIES = [
  "All",
  "Home remodel",
  "Kitchens",
  "Bathrooms",
  "Carpentry",
  "Living spaces",
  "Tiling",
  "Other",
] as const;

export type McFilterCategory = (typeof MC_FILTER_CATEGORIES)[number];

export interface McReview {
  authorName: string;
  rating: number;
  quote: string;
  /**
   * Up to two pills. Only ever what the review or the Google profile actually
   * states: the work named by the reviewer, the city they mention, or Google's
   * attribute chip.
   */
  tags: readonly string[];
  /**
   * Every trade the reviewer actually names. Several name more than one,
   * so this is a list rather than a single bucket - and reviews that name
   * nothing sit under the client's own umbrella term, Home remodel.
   */
  categories: readonly Exclude<McFilterCategory, "All">[];
}

export const MC_REVIEWS: McReview[] = [
  {
    authorName: "Tay McAlevy",
    rating: 5,
    quote:
      "Great company and great quality work! Everything came out exactly how we wanted, and the cabinets look amazing. The team was professional, reliable, and easy to work with. Definitely recommend them to anyone looking for quality cabinet work!",
    tags: ["Custom Cabinetry", "Great price"],
    categories: ["Kitchens", "Carpentry"],
  },
  {
    authorName: "Ariana Asuaje",
    rating: 5,
    quote:
      "I've had a great experience with Master Cabinets. Their service is excellent, they're professional and reliable, and they do beautiful work. I highly recommend them for kitchen cabinets, bathroom cabinets, and closets in the Naples area!",
    tags: ["Kitchen & Bath Cabinets", "Naples, FL"],
    categories: ["Kitchens", "Bathrooms", "Living spaces"],
  },
  {
    authorName: "Leslie Babb",
    rating: 5,
    quote:
      "We had Master Cabinets redo our floors, painting throughout, trim, refinish kitchen cabinets!! Did a great job throughout!!",
    tags: ["Flooring & Painting", "Reasonable price"],
    categories: ["Home remodel", "Kitchens", "Carpentry"],
  },
  {
    authorName: "Alexa M.",
    rating: 5,
    quote:
      "Nickolas is amazing. Nickolas helped me with picking out my floors and my cabinets to complement my house. His family business is amazing, everyone is so kind and helpful. Definitely recommend for next house upgrades or projects.",
    tags: ["Flooring & Cabinets", "Great price"],
    categories: ["Home remodel", "Kitchens"],
  },
  {
    authorName: "Sue B.",
    rating: 5,
    quote:
      "We had been with three other builders before finding Joanna and Julio from Master Cabinets. As soon as we met them, our gut told us to go with them. From the very beginning, they got back to us immediately with our estimate and plans.",
    tags: ["Full Remodel", "Great price"],
    categories: ["Home remodel"],
  },
  {
    authorName: "Sebastian Esch",
    rating: 5,
    quote:
      "Nick knows what he's doing, he's got great customer service and has knowledge about his business. Give him a try, you won't regret it.",
    tags: [],
    categories: ["Home remodel"],
  },
  {
    authorName: "Gabriel Lopez",
    rating: 5,
    quote:
      "Amazing company! Great communication throughout the entire process of my project. Thank you so much Master Cabinets!",
    tags: ["Great price"],
    categories: ["Home remodel"],
  },
  {
    authorName: "Gigii",
    rating: 5,
    quote:
      "People are very good to work with, had no issues with them and very good pricing as well! Definitely would have them work on my house again.",
    tags: ["Reasonable price"],
    categories: ["Home remodel"],
  },
  {
    authorName: "Alex Legra",
    rating: 5,
    quote:
      "Nick is a great worker, he worked diligently on my home, and at a below market average price. Would recommend to anyone looking to do some renovations to their home.",
    tags: ["Great price"],
    categories: ["Home remodel"],
  },
  {
    authorName: "Brian Tellez",
    rating: 5,
    quote:
      "Definitely worth the company to touch base with. Fast paced work. Tremendous efficiency. Beautiful work!",
    tags: ["Great price"],
    categories: ["Home remodel"],
  },
  {
    authorName: "Anthony S.",
    rating: 5,
    quote: "Great team and amazing experience. Their work was phenomenal.",
    tags: ["Great price"],
    categories: ["Home remodel"],
  },
  {
    authorName: "Jesus Gonzalez",
    rating: 5,
    quote:
      "Fantastic team. I received amazing service, and I am super satisfied! Highly recommend!!!",
    tags: ["Great price"],
    categories: ["Home remodel"],
  },
  {
    authorName: "Anthony Trejo",
    rating: 5,
    quote: "Quality work every time. 2nd time using them!!",
    tags: ["Great price"],
    categories: ["Home remodel"],
  },
  {
    authorName: "Joselin Torres",
    rating: 5,
    quote: "Great service throughout my whole process. Good company.",
    tags: ["Reasonable price"],
    categories: ["Home remodel"],
  },
  {
    authorName: "Jaylen Colon",
    rating: 5,
    quote: "Great customer service. Would definitely recommend.",
    tags: ["Great price"],
    categories: ["Home remodel"],
  },
  {
    authorName: "Ayden Young",
    rating: 5,
    quote: "Really happy with my experience with Master Cabinets.",
    tags: ["Great price"],
    categories: ["Home remodel"],
  },
];

/** First four cards shown on the homepage rail - the most substantial ones. */
export const HOME_REVIEWS = MC_REVIEWS.slice(0, 4);
