export type GameCategory = "challenge" | "growth";

export type KarmaGame = {
  id: string;
  title: string;
  category: GameCategory;
  description: string;
  concept: string;
  status: "available" | "coming-soon";
  href: string;
};

export const karmaGames: KarmaGame[] = [
  {
    id: "karma-chakra",
    title: "Karma Chakra",
    category: "challenge",
    description:
      "Eight karmas bind the soul. Catch each bond as it falls and release it before it reaches the jīva.",
    concept: "Eight Karmas · Ghāti & Aghāti",
    status: "available",
    href: "/games/karma-chakra",
  },
  {
    id: "why-me",
    title: "Why Me?",
    category: "challenge",
    description:
      "Navigate life's unexpected turns and discover how past actions echo in the present.",
    concept: "Cause & Effect",
    status: "coming-soon",
    href: "/games/why-me",
  },
  {
    id: "karma-balance",
    title: "Karma Balance",
    category: "challenge",
    description:
      "Weigh choices on the scale of dharma—every decision tips the balance of your soul.",
    concept: "Pain · Mistakes · Suffering",
    status: "coming-soon",
    href: "/games/karma-balance",
  },
  {
    id: "deed-chain",
    title: "Deed Chain",
    category: "challenge",
    description:
      "Trace the invisible threads linking one action to its distant consequences.",
    concept: "Mistakes",
    status: "coming-soon",
    href: "/games/deed-chain",
  },
  {
    id: "ahimsa-path",
    title: "Ahimsa Path",
    category: "growth",
    description:
      "Walk the path of non-violence—protect all living beings through mindful choices.",
    concept: "Kindness",
    status: "coming-soon",
    href: "/games/ahimsa-path",
  },
  {
    id: "dana-giving",
    title: "Dana Giving",
    category: "growth",
    description:
      "Practice selfless giving and watch how generosity transforms your inner world.",
    concept: "Good Deeds",
    status: "coming-soon",
    href: "/games/dana-giving",
  },
  {
    id: "mindful-light",
    title: "Mindful Light",
    category: "growth",
    description:
      "Cultivate equanimity through meditation-inspired puzzles and serene challenges.",
    concept: "Positivity",
    status: "coming-soon",
    href: "/games/mindful-light",
  },
];
