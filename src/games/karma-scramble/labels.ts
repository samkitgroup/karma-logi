import type { Lang } from "@/lib/language";

export const SCRAMBLE_LABELS: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    begin: string;
    badge: string;
    kindKarma: string;
    kindPrakriti: string;
    tapLetters: string;
    clear: string;
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
    title: "Karma Scramble",
    subtitle: "Unscramble the letters. Discover the word.",
    begin: "BEGIN",
    badge: "Unscramble this Jain concept",
    kindKarma: "Eight karmas",
    kindPrakriti: "Prakriti",
    tapLetters: "Tap letters below",
    clear: "Clear selection",
    skip: "Skip",
    solved: "Correct!",
    wrong: "Not quite — try again",
    skipped: "Skipped",
    score: "TOTAL SCORE",
    solvedCount: "SOLVED",
    accuracy: "ACCURACY",
    bestStreak: "BEST STREAK",
    timeUp: "TIME'S UP",
    playAgain: "PLAY AGAIN",
    back: "← Back",
  },
  hi: {
    title: "Karma Scramble",
    subtitle: "अक्षर सही क्रम में लगाएँ। शब्द खोजें।",
    begin: "शुरू करें",
    badge: "इस जैन अवधारणा को सही करें",
    kindKarma: "आठ कर्म",
    kindPrakriti: "प्रकृति",
    tapLetters: "नीचे अक्षर चुनें",
    clear: "चयन साफ़ करें",
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
    title: "Karma Scramble",
    subtitle: "અક્ષરો ગોઠવો. શબ્દ શોધો.",
    begin: "શરૂ કરો",
    badge: "આ જૈન ખ્યાલ ઉકેલો",
    kindKarma: "આઠ કર્મ",
    kindPrakriti: "પ્રકૃતિ",
    tapLetters: "નીચે અક્ષરો પસંદ કરો",
    clear: "પસંદગી સાફ કરો",
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
