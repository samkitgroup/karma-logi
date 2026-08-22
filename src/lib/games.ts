export type GameAccent = "cyan" | "teal" | "gold" | "crimson";

export type GameStatus = "available" | "coming-soon";

export type KarmaGame = {
  id: string;
  number: number;
  title: string;
  description: string;
  example: string;
  status: GameStatus;
  accent: GameAccent;
};

export const karmaGames: KarmaGame[] = [
  {
    id: "karma-quest",
    number: 1,
    title: "Karma Quest",
    description: "Read the situation. Identify the Karma.",
    example: "Situation → 4 random Karma options → player selects the correct one.",
    status: "available",
    accent: "teal",
  },
  {
    id: "karma-chakra",
    number: 2,
    title: "Karma Chakra",
    description: "Place each Prakriti under the correct Karma.",
    example:
      "Mati Gyanavarniya → player selects Gyanavarniya from the 8 Karma categories.",
    status: "available",
    accent: "cyan",
  },
  {
    id: "karma-scramble",
    number: 3,
    title: "Karma Scramble",
    description: "Unscramble the letters. Discover the word.",
    example: "Scrambled letters → player arranges them to reveal the Karma term.",
    status: "available",
    accent: "gold",
  },
];

export function getGameById(id: string): KarmaGame | undefined {
  return karmaGames.find((game) => game.id === id);
}

export function getAvailableGames(): KarmaGame[] {
  return karmaGames.filter((game) => game.status === "available");
}

export function hasCompletedAllGames(scores: Record<string, number | undefined>): boolean {
  return getAvailableGames().every((game) => scores[game.id] !== undefined);
}
