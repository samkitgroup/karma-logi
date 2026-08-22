import { KARMA_DATASET } from "@/lib/karma-chakra-data";
import { buildScrambleDescription } from "@/lib/karma-scramble-descriptions";
import { dedupeByKey, shuffleItems } from "@/lib/session-deck";
import { splitTextUnits } from "@/lib/text-units";
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
  return splitTextUnits(name, lang);
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

/** Easy → hard deck for a 90s round (English length tiers). */
export function buildSessionDeck(): ScrambleItem[] {
  const unique = dedupeByKey(ALL_ITEMS, (item) => item.id);
  const easy = shuffleItems(unique.filter((item) => item.difficulty <= 7));
  const medium = shuffleItems(
    unique.filter((item) => item.difficulty >= 8 && item.difficulty <= 14),
  );
  const hard = shuffleItems(unique.filter((item) => item.difficulty >= 15));

  return [...easy, ...medium, ...hard];
}

export function getAnswerUnits(item: ScrambleItem, lang: Lang): string[] {
  return scrambleUnits(item.answer[lang], lang);
}

export function getDisplayAnswer(item: ScrambleItem, lang: Lang): string {
  return item.answer[lang];
}
