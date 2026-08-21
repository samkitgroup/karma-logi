import type { Lang } from "@/lib/language";

export const SCRAMBLE_LABELS: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    steps: readonly string[];
    timerNote: string;
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
    back: string;
    timeLeft: string;
    scoreLabel: string;
    streakLabel: string;
    solvedLabel: string;
    howToPlay: string;
  }
> = {
  en: {
    title: "Karma Scramble",
    subtitle: "Unscramble the letters. Discover the word.",
    steps: [
      "Read the clue about a Jain concept.",
      "Some letters may already be filled in — tap the rest in order.",
      "Use Hint if you need help, Clear to reset, or Skip.",
    ],
    timerNote: "Timer starts when you tap Begin.",
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
    back: "← Back",
    timeLeft: "Time left",
    scoreLabel: "Score",
    streakLabel: "Streak",
    solvedLabel: "Solved",
    howToPlay: "How to Play",
  },
  hi: {
    title: "Karma Scramble",
    subtitle: "अक्षर सही क्रम में लगाएँ। शब्द खोजें।",
    steps: [
      "जैन अवधारणा के बारे में संकेत पढ़ें।",
      "कुछ अक्षर पहले से भरे हो सकते हैं — बाकी सही क्रम में टैप करें।",
      "जरूरत हो तो Hint लें, Clear से साफ़ करें, या Skip करें।",
    ],
    timerNote: "टाइमर Begin दबाने पर ही शुरू होगा।",
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
    back: "← वापस",
    timeLeft: "समय",
    scoreLabel: "अंक",
    streakLabel: "स्ट्रीक",
    solvedLabel: "सही",
    howToPlay: "कैसे खेलें",
  },
  gu: {
    title: "Karma Scramble",
    subtitle: "અક્ષરો ગોઠવો. શબ્દ શોધો.",
    steps: [
      "જૈન ખ્યાલ વિશેની સંકેત વાંચો.",
      "કેટલાક અક્ષરો પહેલેથી ભરેલા હોઈ શકે — બાકીના સાચા ક્રમમાં ટેપ કરો.",
      "જરૂર પડે તો Hint લો, Clear થી સાફ કરો, અથવા Skip કરો.",
    ],
    timerNote: "ટાઇમર Begin દબાવ્યા પછી જ શરૂ થશે.",
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
    back: "← પાછા",
    timeLeft: "સમય",
    scoreLabel: "સ્કોર",
    streakLabel: "સ્ટ્રીક",
    solvedLabel: "સાચા",
    howToPlay: "કેવી રીતે રમવું",
  },
};
