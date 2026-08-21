import questQuestions from "../../karma-quest-questions.json";

import {
  KARMA_WHEEL_IDS,
  type KarmaRecord,
  KARMA_DATASET,
} from "@/lib/karma-chakra-data";
import type { Lang } from "@/lib/language";

export type KarmaQuestId = (typeof KARMA_WHEEL_IDS)[number];

export type QuestQuestion = {
  id: string;
  karmaId: KarmaQuestId;
  situation: Record<Lang, string>;
};

const GHATI_IDS = new Set<KarmaQuestId>([
  "gyanavarniya",
  "darshnavarniya",
  "mohaniya",
  "antaraya",
]);

const ALL_QUESTIONS = questQuestions as QuestQuestion[];

const karmaById = new Map(KARMA_DATASET.map((karma) => [karma.id, karma]));

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildQuestDeck(): QuestQuestion[] {
  return shuffle(ALL_QUESTIONS);
}

export function getQuestQuestionCount(): number {
  return ALL_QUESTIONS.length;
}

export function getKarmaRecord(karmaId: KarmaQuestId): KarmaRecord {
  const karma = karmaById.get(karmaId);
  if (!karma) {
    throw new Error(`Missing karma: ${karmaId}`);
  }
  return karma;
}

export function isGhatiKarma(karmaId: KarmaQuestId): boolean {
  return GHATI_IDS.has(karmaId);
}

export type KarmaOption = {
  id: KarmaQuestId;
  name: Record<Lang, string>;
  ghati: boolean;
};

export function buildKarmaOptions(): KarmaOption[] {
  return KARMA_WHEEL_IDS.map((id) => ({
    id,
    name: getKarmaRecord(id).name,
    ghati: isGhatiKarma(id),
  }));
}

export const QUEST_OPTION_COUNT = 4;

/** Four options per question: the correct karma plus three random distractors. */
export function buildQuestionOptions(correctId: KarmaQuestId): KarmaOption[] {
  const all = buildKarmaOptions();
  const correct = all.find((option) => option.id === correctId);
  if (!correct) {
    throw new Error(`Missing karma option: ${correctId}`);
  }

  const distractors = shuffle(all.filter((option) => option.id !== correctId)).slice(
    0,
    QUEST_OPTION_COUNT - 1,
  );

  return shuffle([correct, ...distractors]);
}

export function shuffleKarmaOptions(options: KarmaOption[]): KarmaOption[] {
  return shuffle(options);
}

export function scoreQuestAnswer(streak: number): number {
  return 120 + Math.max(0, streak - 1) * 30;
}

export const KARMA_QUEST_QUESTIONS = ALL_QUESTIONS;
