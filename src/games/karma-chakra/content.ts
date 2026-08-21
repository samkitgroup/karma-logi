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
    reached: string;
    next: string;
    begin: string;
  }
> = {
  en: {
    ghati: "GHĀTI · SOUL-HARMING",
    aghati: "AGHĀTI · NON-HARMING",
    released: "RELEASED",
    bound: "BOUND",
    coach: "DRAG THE PRAKRITI TO ITS KARMA — OR TAP",
    reached: "THE PRAKRITI REACHED THE JĪVA",
    next: "NEXT",
    begin: "BEGIN",
  },
  hi: {
    ghati: "घाती · आत्मघातक",
    aghati: "अघाती · अघातक",
    released: "मुक्त",
    bound: "बंध",
    coach: "प्रकृति को उसके कर्म तक खींचें — या स्पर्श करें",
    reached: "प्रकृति जीव तक पहुँची",
    next: "आगे",
    begin: "प्रारंभ",
  },
  gu: {
    ghati: "ઘાતી · આત્મઘાતક",
    aghati: "અઘાતી · અઘાતક",
    released: "મુક્ત",
    bound: "બંધ",
    coach: "પ્રકૃતિને તેના કર્મ સુધી ખેંચો — અથવા સ્પર્શ કરો",
    reached: "પ્રકૃતિ જીવ સુધી પહોંચી",
    next: "આગળ",
    begin: "શરૂ",
  },
};

export function formatKarmaName(enName: string[]): string {
  const joined = enName.join(" ");
  return joined.charAt(0).toUpperCase() + joined.slice(1).toLowerCase();
}
