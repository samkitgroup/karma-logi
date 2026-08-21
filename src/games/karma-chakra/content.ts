import {
  buildKarmasFromDataset,
  getDisplayLines,
  getKarmaDisplayName,
  getKarmaShortName,
  getKarmaWheelLines,
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
  getKarmaWheelLines,
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

export const CHAKRA_CONTENT: Record<
  Lang,
  {
    steps: readonly string[];
    timerNote: string;
  }
> = {
  en: {
    steps: [
      "A prakriti name appears in the centre of the chakra.",
      "Tap the matching karma petal around the wheel.",
      "Use Skip if you're unsure — wrong answers break your streak.",
    ],
    timerNote: "Timer starts when you tap Begin.",
  },
  hi: {
    steps: [
      "चक्र के बीच में प्रकृति का नाम दिखता है।",
      "चारों ओर की सही कर्म पंखुड़ी पर टैप करें।",
      "अनिश्चित हों तो Skip — गलत उत्तर से स्ट्रीक टूटती है।",
    ],
    timerNote: "टाइमर Begin दबाने पर ही शुरू होगा।",
  },
  gu: {
    steps: [
      "ચક્રની વચ્ચે પ્રકૃતિનું નામ દેખાય છે.",
      "ચારે બાજુની યોગ્ય કર્મ પાંખડી પર ટેપ કરો.",
      "ખાતરી ન હોય તો Skip — ખોટા જવાબથી સ્ટ્રીક તૂટે છે.",
    ],
    timerNote: "ટાઇમર Begin દબાવ્યા પછી જ શરૂ થશે.",
  },
};

export function formatKarmaName(enName: string[]): string {
  const joined = enName.join(" ");
  return joined.charAt(0).toUpperCase() + joined.slice(1).toLowerCase();
}
