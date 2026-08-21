import type { Lang } from "@/lib/language";

export const QUEST_LABELS: Record<
  Lang,
  {
    title: string;
    subtitle: string;
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
    playAgain: string;
    back: string;
  }
> = {
  en: {
    title: "Karma Quest",
    subtitle: "Read the situation. Identify the karma.",
    begin: "BEGIN",
    badge: "Which karma is at work?",
    prompt: "Tap one of four karmas",
    ghati: "Ghāti",
    aghati: "Aghāti",
    skip: "Skip",
    solved: "Correct!",
    wrong: "Not quite",
    skipped: "Skipped",
    score: "TOTAL SCORE",
    solvedCount: "CORRECT",
    accuracy: "ACCURACY",
    bestStreak: "BEST STREAK",
    timeUp: "TIME'S UP",
    playAgain: "PLAY AGAIN",
    back: "← Back",
  },
  hi: {
    title: "Karma Quest",
    subtitle: "परिस्थिति पढ़ें। कर्म पहचानें।",
    begin: "शुरू करें",
    badge: "कौन सा कर्म कार्यरत है?",
    prompt: "चार कर्मों में से एक चुनें",
    ghati: "घाती",
    aghati: "अघाती",
    skip: "छोड़ें",
    solved: "सही!",
    wrong: "फिर से प्रयास करें",
    skipped: "छोड़ा गया",
    score: "कुल अंक",
    solvedCount: "सही",
    accuracy: "शुद्धता",
    bestStreak: "सर्वश्रेष्ठ स्ट्रीक",
    timeUp: "समय समाप्त",
    playAgain: "फिर खेलें",
    back: "← वापस",
  },
  gu: {
    title: "Karma Quest",
    subtitle: "પરિસ્થિતિ વાંચો. કર્મ ઓળખો.",
    begin: "શરૂ કરો",
    badge: "કયું કર્મ કાર્યરત છે?",
    prompt: "ચાર કર્મમાંથી એક પસંદ કરો",
    ghati: "ઘાતી",
    aghati: "અઘાતી",
    skip: "છોડો",
    solved: "સાચું!",
    wrong: "ફરી પ્રયાસ કરો",
    skipped: "છોડ્યું",
    score: "કુલ સ્કોર",
    solvedCount: "સાચા",
    accuracy: "ચોકસાઈ",
    bestStreak: "શ્રેષ્ઠ સ્ટ્રીક",
    timeUp: "સમય પૂરો",
    playAgain: "ફરી રમો",
    back: "← પાછા",
  },
};
