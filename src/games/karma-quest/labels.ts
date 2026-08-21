import type { Lang } from "@/lib/language";

/** Localized instructional copy only; buttons and chrome use GAME_UI. */
export const QUEST_CONTENT: Record<
  Lang,
  {
    subtitle: string;
    rules: string;
  }
> = {
  en: {
    subtitle: "Read the situation. Identify the karma.",
    rules: "60 seconds · 30 situations · 4 options each.",
  },
  hi: {
    subtitle: "परिस्थिति पढ़ें। कर्म पहचानें।",
    rules: "60 सेकंड · 30 परिस्थितियाँ · प्रत्येक में 4 विकल्प।",
  },
  gu: {
    subtitle: "પરિસ્થિતિ વાંચો. કર્મ ઓળખો.",
    rules: "60 સેકન્ડ · 30 પરિસ્થિતિઓ · પ્રત્યેકમાં 4 વિકલ્પો.",
  },
};
