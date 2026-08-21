import type { Lang } from "@/lib/language";

export const QUEST_LABELS: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    rules: string;
    begin: string;
    badge: string;
    prompt: string;
    ghati: string;
    aghati: string;
    skip: string;
    solved: string;
    wrong: string;
    skipped: string;
    score: string;
    solvedCount: string;
    accuracy: string;
    bestStreak: string;
    timeUp: string;
    back: string;
    scoreLabel: string;
    streakLabel: string;
    correctLabel: string;
  }
> = {
  en: {
    title: "Karma Quest",
    subtitle: "Read the situation. Identify the karma.",
    rules: "60 seconds · 30 situations · 4 options each.",
    begin: "BEGIN",
    badge: "Which karma is at work?",
    prompt: "Choose the karma",
    ghati: "Ghāti",
    aghati: "Aghāti",
    skip: "Skip",
    solved: "Correct!",
    wrong: "Wrong",
    skipped: "Skipped",
    score: "TOTAL SCORE",
    solvedCount: "CORRECT",
    accuracy: "ACCURACY",
    bestStreak: "BEST STREAK",
    timeUp: "TIME'S UP",
    back: "← Back",
    scoreLabel: "Score",
    streakLabel: "Streak",
    correctLabel: "Correct",
  },
  hi: {
    title: "Karma Quest",
    subtitle: "परिस्थिति पढ़ें। कर्म पहचानें।",
    rules: "60 सेकंड · 30 परिस्थितियाँ · प्रत्येक में 4 विकल्प।",
    begin: "शुरू करें",
    badge: "कौन सा कर्म कार्यरत है?",
    prompt: "कर्म चुनें",
    ghati: "घाती",
    aghati: "अघाती",
    skip: "छोड़ें",
    solved: "सही!",
    wrong: "गलत",
    skipped: "छोड़ा गया",
    score: "कुल अंक",
    solvedCount: "सही",
    accuracy: "शुद्धता",
    bestStreak: "सर्वश्रेष्ठ स्ट्रीक",
    timeUp: "समय समाप्त",
    back: "← वापस",
    scoreLabel: "अंक",
    streakLabel: "स्ट्रीक",
    correctLabel: "सही",
  },
  gu: {
    title: "Karma Quest",
    subtitle: "પરિસ્થિતિ વાંચો. કર્મ ઓળખો.",
    rules: "60 સેકન્ડ · 30 પરિસ્થિતિઓ · પ્રત્યેકમાં 4 વિકલ્પો.",
    begin: "શરૂ કરો",
    badge: "કયું કર્મ કાર્યરત છે?",
    prompt: "કર્મ પસંદ કરો",
    ghati: "ઘાતી",
    aghati: "અઘાતી",
    skip: "છોડો",
    solved: "સાચું!",
    wrong: "ખોટું",
    skipped: "છોડ્યું",
    score: "કુલ સ્કોર",
    solvedCount: "સાચા",
    accuracy: "ચોકસાઈ",
    bestStreak: "શ્રેષ્ઠ સ્ટ્રીક",
    timeUp: "સમય પૂરો",
    back: "← પાછા",
    scoreLabel: "સ્કોર",
    streakLabel: "સ્ટ્રીક",
    correctLabel: "સાચા",
  },
};
