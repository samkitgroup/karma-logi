import {
  buildKarmasFromDataset,
  getDisplayLines,
  getKarmaDisplayName,
  getKarmaShortName,
  pickRandomPrakriti,
  findPrakritiById,
  getPrakritisForKarma,
  PRAKRITI_ITEMS,
} from "@/lib/karma-chakra-data";
import type { Lang } from "@/lib/language";
import type { KarmaEntry } from "./types";

export {
  findPrakritiById,
  getDisplayLines,
  getKarmaDisplayName,
  getKarmaShortName,
  getPrakritisForKarma,
  pickRandomPrakriti,
  PRAKRITI_ITEMS,
};

export const COLORS = {
  ink: "#090b1e",
  inkMid: "#141842",
  inkDeep: "#060818",
  hair: "rgba(0, 229, 255, 0.28)",
  gold: "#00e5ff",
  goldHi: "#f0feff",
  goldDim: "#67e8ff",
  parch: "#f0f4ff",
  ghati: "#ff4da6",
  aghati: "#00f0b5",
  rust: "#ff6363",
  correct: "#4ade80",
  mute: "#96a4c8",
  accentCyan: "#00b4d8",
  accentViolet: "#a855f7",
  star: "#00e5ff",
  mandala: "rgba(168, 85, 247, 0.35)",
  petal: "#121538",
  petalGhati: "#1a1030",
  petalAghati: "#0a2030",
  petalActive: "#1e2858",
  panel: "rgba(12, 14, 36, 0.9)",
  panelBorder: "rgba(0, 229, 255, 0.32)",
} as const;

export const GAME_TITLE = "KARMA CHAKRA";
export const GAME_SUBTITLE = "EIGHT KARMAS · GHĀTI & AGHĀTI";

export const KARMAS: KarmaEntry[] = buildKarmasFromDataset();

export const LABELS: Record<
  Lang,
  {
    ghati: string;
    aghati: string;
    released: string;
    bound: string;
    coach: string;
    coachHint: string;
    reached: string;
    next: string;
    begin: string;
    back: string;
    score: string;
    streak: string;
    correct: string;
    timeUp: string;
    totalScore: string;
    rules: string;
    howToPlay: string;
    accuracy: string;
    bestStreak: string;
    roundComplete: string;
    timeLeft: string;
    steps: readonly string[];
    timerNote: string;
    ghatiShort: string;
    aghatiShort: string;
    matchThis: string;
    tapKarma: string;
    skip: string;
    wrong: string;
    skipped: string;
    scoreLabel: string;
    streakLabel: string;
    correctLabel: string;
  }
> = {
  en: {
    ghati: "GHĀTI · SOUL-HARMING",
    aghati: "AGHĀTI · NON-HARMING",
    released: "RELEASED",
    bound: "BOUND",
    coach: "Drag the word down to its karma petal",
    coachHint: "or tap a petal directly",
    reached: "THE PRAKRITI REACHED THE JĪVA",
    next: "NEXT",
    begin: "BEGIN",
    back: "← Back",
    score: "Score",
    streak: "Streak",
    correct: "Correct",
    timeUp: "TIME'S UP",
    totalScore: "TOTAL NIRJARĀ",
    rules:
      "Match each prakriti to its karma petal · Drag or tap to place · Score for correct matches",
    howToPlay: "How to Play",
    accuracy: "Accuracy",
    bestStreak: "Best Streak",
    roundComplete: "ROUND COMPLETE",
    timeLeft: "Time left",
    steps: [
      "A prakriti name appears at the top of the card.",
      "Tap the karma it belongs to from the eight options below.",
      "Pink labels are ghāti karmas; teal labels are aghāti karmas.",
      "Use Skip if you're unsure — wrong answers break your streak.",
    ],
    timerNote: "Timer starts when you tap Begin.",
    ghatiShort: "Ghāti",
    aghatiShort: "Aghāti",
    matchThis: "Match this prakriti",
    tapKarma: "Tap the karma it belongs to",
    skip: "Skip",
    wrong: "Wrong karma",
    skipped: "Skipped",
    scoreLabel: "Score",
    streakLabel: "Streak",
    correctLabel: "Correct",
  },
  hi: {
    ghati: "घाती · आत्मघातक",
    aghati: "अघाती · अघातक",
    released: "मुक्त",
    bound: "बंध",
    coach: "शब्द को उसकी कर्म पंखुड़ी तक नीचे खींचें",
    coachHint: "या सीधे पंखुड़ी पर टैप करें",
    reached: "प्रकृति जीव तक पहुँची",
    next: "आगे",
    begin: "प्रारंभ",
    back: "← वापस",
    score: "अंक",
    streak: "स्ट्रीक",
    correct: "सही",
    timeUp: "समय समाप्त",
    totalScore: "कुल निर्जरा",
    rules:
      "प्रत्येक प्रकृति को सही कर्म पंखुड़ी से मिलाएँ · खींचें या टैप करें · सही जवाब पर अंक",
    howToPlay: "कैसे खेलें",
    accuracy: "सटीकता",
    bestStreak: "सर्वश्रेष्ठ स्ट्रीक",
    roundComplete: "राउंड पूर्ण",
    timeLeft: "समय",
    steps: [
      "कार्ड के ऊपर प्रकृति का नाम दिखता है।",
      "नीचे आठ विकल्पों में से सही कर्म पर टैप करें।",
      "गुलाबी घाती कर्म हैं; हरे-नीले अघाती कर्म हैं।",
      "अनिश्चित हों तो Skip — गलत उत्तर से स्ट्रीक टूटती है।",
    ],
    timerNote: "टाइमर Begin दबाने पर ही शुरू होगा।",
    ghatiShort: "घाती",
    aghatiShort: "अघाती",
    matchThis: "इस प्रकृति से मिलाएँ",
    tapKarma: "सही कर्म पर टैप करें",
    skip: "छोड़ें",
    wrong: "गलत कर्म",
    skipped: "छोड़ा गया",
    scoreLabel: "अंक",
    streakLabel: "स्ट्रीक",
    correctLabel: "सही",
  },
  gu: {
    ghati: "ઘાતી · આત્મઘાતક",
    aghati: "અઘાતી · અઘાતક",
    released: "મુક્ત",
    bound: "બંધ",
    coach: "શબ્દને તેની કર્મ પાંખડી સુધી નીચે ખેંચો",
    coachHint: "અથવા સીધી પાંખડી પર ટેપ કરો",
    reached: "પ્રકૃતિ જીવ સુધી પહોંચી",
    next: "આગળ",
    begin: "શરૂ",
    back: "← પાછા",
    score: "સ્કોર",
    streak: "સ્ટ્રીક",
    correct: "સાચા",
    timeUp: "સમય પૂરો",
    totalScore: "કુલ નિર્જરા",
    rules:
      "દરેક પ્રકૃતિને સાચી કર્મ પાંખડી સાથે જોડો · ખેંચો અથવા ટેપ કરો · સાચા જવાબે અંક",
    howToPlay: "કેવી રીતે રમવું",
    accuracy: "ચોકસાઈ",
    bestStreak: "શ્રેષ્ઠ સ્ટ્રીક",
    roundComplete: "રાઉન્ડ પૂર્ણ",
    timeLeft: "સમય",
    steps: [
      "કાર્ડની ટોચ પર પ્રકૃતિનું નામ દેખાય છે.",
      "નીચેના આઠ વિકલ્પોમાંથી યોગ્ય કર્મ ટેપ કરો.",
      "ગુલાબી ઘાતી કર્મ; લીલ-નીલા અઘાતી કર્મ.",
      "ખાતરી ન હોય તો Skip — ખોટા જવાબથી સ્ટ્રીક તૂટે છે.",
    ],
    timerNote: "ટાઇમર Begin દબાવ્યા પછી જ શરૂ થશે.",
    ghatiShort: "ઘાતી",
    aghatiShort: "અઘાતી",
    matchThis: "આ પ્રકૃતિ જોડો",
    tapKarma: "યોગ્ય કર્મ પર ટેપ કરો",
    skip: "છોડો",
    wrong: "ખોટું કર્મ",
    skipped: "છોડ્યું",
    scoreLabel: "સ્કોર",
    streakLabel: "સ્ટ્રીક",
    correctLabel: "સાચા",
  },
};

export function formatKarmaName(enName: string[]): string {
  const joined = enName.join(" ");
  return joined.charAt(0).toUpperCase() + joined.slice(1).toLowerCase();
}
