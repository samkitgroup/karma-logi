import {
  buildKarmasFromDataset,
  getKarmaDisplayName,
  pickRandomPrakriti,
  findPrakritiById,
  getPrakritisForKarma,
  PRAKRITI_ITEMS,
} from "@/lib/karma-chakra-data";
import type { Lang } from "@/lib/language";
import type { KarmaEntry } from "./types";

export {
  findPrakritiById,
  getKarmaDisplayName,
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
      "60 seconds · match each prakriti to its karma petal · drag or tap",
    howToPlay: "How to Play",
    accuracy: "Accuracy",
    bestStreak: "Best Streak",
    roundComplete: "ROUND COMPLETE",
    timeLeft: "Time left",
    steps: [
      "A Jain word (prakriti) falls from the top of the screen.",
      "Read the karma label on the word — it tells you which petal to match.",
      "Drag the word to that petal — or tap the petal directly.",
      "Match before it reaches the center (Jīva), or you lose that round.",
    ],
    timerNote: "60 seconds — timer starts only when you tap Begin.",
    ghatiShort: "Ghāti",
    aghatiShort: "Aghāti",
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
      "60 सेकंड · प्रत्येक प्रकृति को उसकी कर्म पंखुड़ी से मिलाएँ · खींचें या टैप करें",
    howToPlay: "कैसे खेलें",
    accuracy: "सटीकता",
    bestStreak: "सर्वश्रेष्ठ स्ट्रीक",
    roundComplete: "राउंड पूर्ण",
    timeLeft: "समय",
    steps: [
      "एक जैन शब्द (प्रकृति) स्क्रीन के ऊपर से गिरता है।",
      "शब्द पर कर्म लेबल पढ़ें — वह बताता है किस पंखुड़ी से मिलान करना है।",
      "शब्द को उस पंखुड़ी तक खींचें — या सीधे पंखुड़ी पर टैप करें।",
      "केंद्र (जीव) तक पहुँचने से पहले मिलाएँ, नहीं तो वह राउंड चूक जाएगा।",
    ],
    timerNote: "60 सेकंड — टाइमर Begin दबाने पर ही शुरू होगा।",
    ghatiShort: "घाती",
    aghatiShort: "अघाती",
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
      "60 સેકન્ડ · દરેક પ્રકૃતિને તેની કર્મ પાંખડી સાથે જોડો · ખેંચો અથવા ટેપ કરો",
    howToPlay: "કેવી રીતે રમવું",
    accuracy: "ચોકસાઈ",
    bestStreak: "શ્રેષ્ઠ સ્ટ્રીક",
    roundComplete: "રાઉન્ડ પૂર્ણ",
    timeLeft: "સમય",
    steps: [
      "એક જૈન શબ્દ (પ્રકૃતિ) સ્ક્રીનની ઉપરથી પડે છે.",
      "શબ્દ પરનું કર્મ લેબલ વાંચો — તે કઈ પાંખડી સાથે જોડવું તે બતાવે છે.",
      "શબ્દને તે પાંખડી સુધી ખેંચો — અથવા સીધી પાંખડી પર ટેપ કરો.",
      "કેન્દ્ર (જીવ) સુધી પહોંચે તે પહેલાં જોડો, નહીં તો તે રાઉન્ડ ચૂકી જશે.",
    ],
    timerNote: "60 સેકન્ડ — ટાઇમર Begin દબાવ્યા પછી જ શરૂ થશે.",
    ghatiShort: "ઘાતી",
    aghatiShort: "અઘાતી",
  },
};

export function formatKarmaName(enName: string[]): string {
  const joined = enName.join(" ");
  return joined.charAt(0).toUpperCase() + joined.slice(1).toLowerCase();
}
