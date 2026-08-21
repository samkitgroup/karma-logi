import { KARMA_DATASET } from "@/lib/karma-chakra-data";
import { buildScrambleDescription } from "@/lib/karma-scramble-descriptions";
import type { Lang } from "@/lib/language";

export type ScrambleKind = "karma" | "prakriti";

export type ScrambleItem = {
  id: string;
  kind: ScrambleKind;
  karmaId: string;
  karmaName: Record<Lang, string>;
  answer: Record<Lang, string>;
  description: Record<Lang, string>;
  difficulty: number;
};

function scrambleUnits(name: string, lang: Lang): string[] {
  if (lang === "en") {
    return name
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .split("");
  }

  return [...name.replace(/[\s\-–—]/g, "")].filter(Boolean);
}

function difficultyFor(name: string, lang: Lang): number {
  return scrambleUnits(name, lang).length;
}

function localizedDescription(
  kind: ScrambleKind,
  karmaId: string,
  entityId: string,
  jsonDescription?: Partial<Record<Lang, string>>,
): Record<Lang, string> {
  const langs: Lang[] = ["en", "hi", "gu"];
  const description = {} as Record<Lang, string>;
  for (const lang of langs) {
    description[lang] = buildScrambleDescription(
      kind,
      karmaId,
      entityId,
      lang,
      jsonDescription,
    );
  }
  return description;
}

function buildItems(): ScrambleItem[] {
  const items: ScrambleItem[] = [];

  for (const karma of KARMA_DATASET) {
    items.push({
      id: `karma:${karma.id}`,
      kind: "karma",
      karmaId: karma.id,
      karmaName: karma.name,
      answer: karma.name,
      description: localizedDescription("karma", karma.id, karma.id, karma.description),
      difficulty: difficultyFor(karma.name.en, "en"),
    });

    for (const prakriti of karma.prakritis) {
      if (prakriti.active === 0) {
        continue;
      }
      items.push({
        id: `prakriti:${prakriti.id}`,
        kind: "prakriti",
        karmaId: karma.id,
        karmaName: karma.name,
        answer: prakriti.name,
        description: localizedDescription(
          "prakriti",
          karma.id,
          prakriti.id,
          prakriti.description,
        ),
        difficulty: difficultyFor(prakriti.name.en, "en"),
      });
    }
  }

  return items;
}

const ALL_ITEMS = buildItems();

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Easy → hard deck for a 60s round (English length tiers). */
export function buildSessionDeck(): ScrambleItem[] {
  const easy = shuffle(ALL_ITEMS.filter((item) => item.difficulty <= 7));
  const medium = shuffle(
    ALL_ITEMS.filter((item) => item.difficulty >= 8 && item.difficulty <= 14),
  );
  const hard = shuffle(ALL_ITEMS.filter((item) => item.difficulty >= 15));

  return [...easy, ...medium, ...hard];
}

export function getAnswerUnits(item: ScrambleItem, lang: Lang): string[] {
  return scrambleUnits(item.answer[lang], lang);
}

export function getDisplayAnswer(item: ScrambleItem, lang: Lang): string {
  return item.answer[lang];
}
