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
  "jnanavaraniya",
  "darshanavaraniya",
  "mohaniya",
  "antaraya",
  "vedaniya",
  "nama",
  "gotra",
  "ayushya",
] as const;

const GHATI_IDS = new Set<string>([
  "jnanavaraniya",
  "darshanavaraniya",
  "mohaniya",
  "antaraya",
]);

const GLYPH_BY_ID: Record<string, string> = {
  jnanavaraniya: "veil",
  darshanavaraniya: "gate",
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
