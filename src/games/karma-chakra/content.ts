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

export const CHAKRA_COACH =
  "Drag the prakriti to its karma petal — or tap a petal";

/** Localized instructional copy only; buttons and chrome use GAME_UI. */
export const CHAKRA_CONTENT: Record<Lang, { rules: string }> = {
  en: {
    rules: "60 seconds · match each prakriti to its karma petal.",
  },
  hi: {
    rules: "60 सेकंड · प्रत्येक प्रकृति को उसकी कर्म पंखुड़ी से मिलाएँ।",
  },
  gu: {
    rules: "60 સેકન્ડ · દરેક પ્રકૃતિને તેની કર્મ પાંખડી સાથે જોડો.",
  },
};

export function formatKarmaName(enName: string[]): string {
  const joined = enName.join(" ");
  return joined.charAt(0).toUpperCase() + joined.slice(1).toLowerCase();
}
