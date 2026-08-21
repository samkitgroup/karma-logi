import type { Lang } from "@/lib/language";

/** Localized instructional copy only; buttons and chrome use GAME_UI. */
export const SCRAMBLE_CONTENT: Record<
  Lang,
  {
    subtitle: string;
    rules: string;
  }
> = {
  en: {
    subtitle: "Unscramble the letters. Discover the word.",
    rules: "60 seconds · easy names first, then harder.",
  },
  hi: {
    subtitle: "अक्षर सही क्रम में लगाएँ। शब्द खोजें।",
    rules: "60 सेकंड · पहले आसान नाम, फिर कठिन।",
  },
  gu: {
    subtitle: "અક્ષરો ગોઠવો. શબ્દ શોધો.",
    rules: "60 સેકન્ડ · પહેલાં સરળ નામો, પછી અઘરાં.",
  },
};
