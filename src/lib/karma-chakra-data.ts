import karmaDataset from "../../data.json";

import type { BondFx, KarmaEntry } from "@/games/karma-chakra/types";
import type { Lang } from "@/lib/language";

export type KarmaRecord = {
  id: string;
  order: number;
  name: Record<Lang, string>;
  description?: Partial<Record<Lang, string>>;
  prakritiCount: number;
  prakritis: PrakritiRecord[];
};

export type PrakritiRecord = {
  id: string;
  order: number;
  name: Record<Lang, string>;
  description?: Partial<Record<Lang, string>>;
  active?: number;
};

/** Petal order: ghāti karmas (0–3), then aghāti (4–7). */
export const KARMA_WHEEL_IDS = [
  "gyanavarniya",
  "darshnavarniya",
  "mohaniya",
  "antaraya",
  "vedaniya",
  "nama",
  "gotra",
  "ayushya",
] as const;

const GHATI_IDS = new Set<string>([
  "gyanavarniya",
  "darshnavarniya",
  "mohaniya",
  "antaraya",
]);

const GLYPH_BY_ID: Record<string, string> = {
  gyanavarniya: "veil",
  darshnavarniya: "gate",
  mohaniya: "cup",
  antaraya: "chest",
  vedaniya: "sword",
  nama: "brush",
  gotra: "pots",
  ayushya: "shackle",
};

const FX_CYCLE: BondFx[] = ["veil", "pulse", "shift", "echo", "bars", "glow"];

const dataset = karmaDataset as KarmaRecord[];

const karmaById = new Map(dataset.map((karma) => [karma.id, karma]));

function getKarmaRecord(id: string): KarmaRecord {
  const karma = karmaById.get(id);
  if (!karma) {
    throw new Error(`Missing karma in data.json: ${id}`);
  }
  return karma;
}

function splitNameLines(name: string, lang: Lang): string[] {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) {
    return [lang === "en" ? name.toUpperCase() : name];
  }
  const mid = Math.ceil(parts.length / 2);
  const first = parts.slice(0, mid).join(" ");
  const second = parts.slice(mid).join(" ");
  return lang === "en" ? [first.toUpperCase(), second.toUpperCase()] : [first, second];
}

/** Split labels for narrow grid cells (multi-word or long single tokens). */
export function getDisplayLines(text: string, lang: Lang): string[] {
  const trimmed = text.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) {
    const mid = Math.ceil(parts.length / 2);
    return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
  }
  if (trimmed.length <= 10) {
    return [trimmed];
  }

  if (lang === "en") {
    const lower = trimmed.toLowerCase();
    for (const suffix of ["avarniya", "varniya"]) {
      const index = lower.indexOf(suffix);
      if (index > 2) {
        return [trimmed.slice(0, index), trimmed.slice(index)];
      }
    }
  }

  const mid = Math.ceil(trimmed.length / 2);
  return [trimmed.slice(0, mid), trimmed.slice(mid)];
}

/** Curated two-line labels for the octagonal ring (readable, consistent splits). */
const KARMA_WHEEL_LINES: Record<string, Record<Lang, string[]>> = {
  gyanavarniya: {
    en: ["Gyana", "varniya"],
    hi: ["ज्ञान", "ावरणीय"],
    gu: ["જ્ઞાન", "ાવરણીય"],
  },
  darshnavarniya: {
    en: ["Darshna", "varniya"],
    hi: ["दर्शन", "ावरणीय"],
    gu: ["દર્શન", "ાવરણીય"],
  },
  mohaniya: {
    en: ["Mohaniya"],
    hi: ["मोहनीय"],
    gu: ["મોહનીય"],
  },
  antaraya: {
    en: ["Antaraya"],
    hi: ["अंतराय"],
    gu: ["અંતરાય"],
  },
  vedaniya: {
    en: ["Vedaniya"],
    hi: ["वेदनीय"],
    gu: ["વેદનીય"],
  },
  nama: {
    en: ["Nama"],
    hi: ["नाम"],
    gu: ["નામ"],
  },
  gotra: {
    en: ["Gotra"],
    hi: ["गोत्र"],
    gu: ["ગોત્ર"],
  },
  ayushya: {
    en: ["Ayushya"],
    hi: ["आयुष्य"],
    gu: ["આયુષ્ય"],
  },
};

/** Two-line labels for the chakra ring — never breaks mid-word in CSS. */
export function getKarmaWheelLines(karmaIndex: number, lang: Lang): string[] {
  const id = KARMA_WHEEL_IDS[karmaIndex];
  const curated = KARMA_WHEEL_LINES[id]?.[lang];
  if (curated) {
    return curated;
  }

  const name = getKarmaDisplayName(karmaIndex, lang).trim();
  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    if (parts.length === 2) {
      return parts;
    }
    return [parts.slice(0, -1).join(" "), parts[parts.length - 1]!];
  }

  if (name.length <= 9) {
    return [name];
  }

  if (lang === "en") {
    const lower = name.toLowerCase();
    for (const suffix of ["avarniya", "varniya", "aniya", "iya"]) {
      const index = lower.lastIndexOf(suffix);
      if (index > 2) {
        return [name.slice(0, index), name.slice(index)];
      }
    }
  }

  if (lang !== "en" && name.length > 10) {
    const mid = Math.ceil(name.length / 2);
    return [name.slice(0, mid), name.slice(mid)];
  }

  return [name];
}

export type PrakritiItem = {
  id: string;
  karmaIndex: number;
  karmaId: string;
  names: Record<Lang, string>;
  fx: BondFx;
};

function buildPrakritiItems(): PrakritiItem[] {
  const items: PrakritiItem[] = [];

  KARMA_WHEEL_IDS.forEach((karmaId, karmaIndex) => {
    const karma = getKarmaRecord(karmaId);
    karma.prakritis.forEach((prakriti, index) => {
      if (prakriti.active === 0) {
        return;
      }
      items.push({
        id: prakriti.id,
        karmaIndex,
        karmaId,
        names: prakriti.name,
        fx: FX_CYCLE[index % FX_CYCLE.length],
      });
    });
  });

  return items;
}

export const PRAKRITI_ITEMS = buildPrakritiItems();

const prakritiById = new Map(PRAKRITI_ITEMS.map((item) => [item.id, item]));

export function findPrakritiById(id: string): PrakritiItem | undefined {
  return prakritiById.get(id);
}

export function getPrakritisForKarma(karmaIndex: number): PrakritiItem[] {
  return PRAKRITI_ITEMS.filter((item) => item.karmaIndex === karmaIndex);
}

export function getKarmaDisplayName(karmaIndex: number, lang: Lang): string {
  const karma = getKarmaRecord(KARMA_WHEEL_IDS[karmaIndex]);
  return karma.name[lang];
}

const KARMA_SHORT_NAMES: Record<string, Record<Lang, string>> = {
  gyanavarniya: { en: "Jnana", hi: "ज्ञान", gu: "જ્ઞાન" },
  darshnavarniya: { en: "Darshan", hi: "दर्शन", gu: "દર્શન" },
  mohaniya: { en: "Mohan", hi: "मोह", gu: "મોહ" },
  antaraya: { en: "Antar", hi: "अंतराय", gu: "અંતરાય" },
  vedaniya: { en: "Vedan", hi: "वेदन", gu: "વેદન" },
  nama: { en: "Nama", hi: "नाम", gu: "નામ" },
  gotra: { en: "Gotra", hi: "गोत्र", gu: "ગોત્ર" },
  ayushya: { en: "Ayush", hi: "आयुष", gu: "આયુષ" },
};

/** Compact label for karma option buttons. */
export function getKarmaShortName(karmaIndex: number, lang: Lang): string {
  const id = KARMA_WHEEL_IDS[karmaIndex];
  return KARMA_SHORT_NAMES[id]?.[lang] ?? getKarmaDisplayName(karmaIndex, lang);
}

export function buildKarmasFromDataset(): KarmaEntry[] {
  return KARMA_WHEEL_IDS.map((id) => {
    const karma = getKarmaRecord(id);
    const isGhati = GHATI_IDS.has(id);

    return {
      g: isGhati ? 1 : 0,
      glyph: GLYPH_BY_ID[id] ?? "veil",
      n: {
        en: splitNameLines(karma.name.en, "en"),
        hi: splitNameLines(karma.name.hi, "hi"),
        gu: splitNameLines(karma.name.gu, "gu"),
      },
      s: {
        en: `${karma.prakritiCount} prakritis`,
        hi: `${karma.prakritiCount} प्रकृतियाँ`,
        gu: `${karma.prakritiCount} પ્રકૃતિઓ`,
      },
      f: {
        en: `Release each prakriti to ${karma.name.en}.`,
        hi: `प्रत्येक प्रकृति को ${karma.name.hi} में मुक्त करें।`,
        gu: `દરેક પ્રકૃતિને ${karma.name.gu} સુધી મુક્ત કરો.`,
      },
    };
  });
}

export function pickRandomPrakriti(karmaIndex: number): PrakritiItem {
  const pool = getPrakritisForKarma(karmaIndex);
  if (pool.length === 0) {
    throw new Error(`No prakritis for karma index ${karmaIndex}`);
  }
  return pool[(Math.random() * pool.length) | 0];
}

export const KARMA_DATASET = dataset;
