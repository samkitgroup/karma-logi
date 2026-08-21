import type { Lang } from "@/lib/language";

export const QUEST_LABELS: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    steps: readonly string[];
    timerNote: string;
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
    howToPlay: string;
    timeLeft: string;
  }
> = {
  en: {
    title: "Karma Quest",
    subtitle: "Read the situation. Identify the karma.",
    steps: [
      "Read the everyday situation on screen.",
      "Tap the karma that best matches it.",
      "Use Skip if you're unsure — wrong answers break your streak.",
    ],
    timerNote: "60 seconds — timer starts only when you tap Begin.",
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
    howToPlay: "How to Play",
    timeLeft: "Time left",
  },
  hi: {
    title: "Karma Quest",
    subtitle: "परिस्थिति पढ़ें। कर्म पहचानें।",
    steps: [
      "स्क्रीन पर दिखाई देने वाली परिस्थिति पढ़ें।",
      "सबसे मेल खाने वाला कर्म टैप करें।",
      "अनिश्चित हों तो Skip दबाएँ — गलत उत्तर से स्ट्रीक टूटती है।",
    ],
    timerNote: "60 सेकंड — टाइमर Begin दबाने पर ही शुरू होगा।",
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
    howToPlay: "कैसे खेलें",
    timeLeft: "समय",
  },
  gu: {
    title: "Karma Quest",
    subtitle: "પરિસ્થિતિ વાંચો. કર્મ ઓળખો.",
    steps: [
      "સ્ક્રીન પરની પરિસ્થિતિ વાંચો.",
      "સૌથી સારું મળતું કર્મ ટેપ કરો.",
      "ખાતરી ન હોય તો Skip દબાવો — ખોટા જવાબથી સ્ટ્રીક તૂટે છે.",
    ],
    timerNote: "60 સેકન્ડ — ટાઇમર Begin દબાવ્યા પછી જ શરૂ થશે.",
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
    howToPlay: "કેવી રીતે રમવું",
    timeLeft: "સમય",
  },
};
