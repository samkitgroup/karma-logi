import type { ScrambleItem } from "@/lib/karma-scramble-data";

export type LetterTile = {
  id: number;
  char: string;
};

export type LockedSlot = {
  char: string;
  kind: "starter" | "hint";
};

export type PuzzleState = {
  item: ScrambleItem;
  answer: string[];
  tiles: LetterTile[];
  selection: LetterTile[];
  locked: Record<number, LockedSlot>;
  manualHintsUsed: number;
};

export function shuffleLetters(letters: string[]): LetterTile[] {
  const tiles = letters.map((char, id) => ({ id, char }));
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  if (tiles.length > 1 && tiles.every((tile, index) => tile.char === letters[index])) {
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }

  return tiles;
}

export function pickStarterHintIndices(length: number): number[] {
  if (length <= 4) {
    return [];
  }

  const count = length <= 6 ? 1 : length <= 9 ? 2 : length <= 13 ? 3 : 4;
  const indices: number[] = [];

  for (let i = 0; i < count; i++) {
    const idx = Math.min(
      length - 1,
      Math.max(0, Math.round(((i + 1) / (count + 1)) * (length - 1))),
    );
    if (!indices.includes(idx)) {
      indices.push(idx);
    }
  }

  return indices.sort((a, b) => a - b);
}

export function buildLockedSlots(
  answer: string[],
  indices: number[],
  kind: LockedSlot["kind"],
): Record<number, LockedSlot> {
  const locked: Record<number, LockedSlot> = {};
  for (const index of indices) {
    locked[index] = { char: answer[index], kind };
  }
  return locked;
}

export function buildFillableIndices(
  answerLength: number,
  locked: Record<number, LockedSlot>,
): number[] {
  const lockedSet = new Set(Object.keys(locked).map(Number));
  return [...Array(answerLength).keys()].filter((index) => !lockedSet.has(index));
}

export function remainingLetters(
  answer: string[],
  locked: Record<number, LockedSlot>,
): string[] {
  const lockedCounts = new Map<string, number>();

  for (const index of Object.keys(locked).map(Number)) {
    const char = answer[index];
    lockedCounts.set(char, (lockedCounts.get(char) ?? 0) + 1);
  }

  const remaining: string[] = [];
  for (const char of answer) {
    const count = lockedCounts.get(char) ?? 0;
    if (count > 0) {
      lockedCounts.set(char, count - 1);
      continue;
    }
    remaining.push(char);
  }

  return remaining;
}

export function composeAnswer(
  answer: string[],
  locked: Record<number, LockedSlot>,
  selection: LetterTile[],
): string[] {
  const composed = [...answer];
  const fillable = buildFillableIndices(answer.length, locked);

  for (const [index, slot] of Object.entries(locked)) {
    composed[Number(index)] = slot.char;
  }

  fillable.forEach((index, selectionIndex) => {
    const tile = selection[selectionIndex];
    if (tile) {
      composed[index] = tile.char;
    }
  });

  return composed;
}

export function selectionMatchesAnswer(
  selection: LetterTile[],
  answer: string[],
  locked: Record<number, LockedSlot>,
): boolean {
  const fillable = buildFillableIndices(answer.length, locked);
  if (selection.length !== fillable.length) {
    return false;
  }

  const composed = composeAnswer(answer, locked, selection);
  return composed.every((char, index) => char === answer[index]);
}

export function getUnfilledFillableIndices(
  answer: string[],
  locked: Record<number, LockedSlot>,
  selection: LetterTile[],
): number[] {
  const fillable = buildFillableIndices(answer.length, locked);
  return fillable.filter((_, selectionIndex) => !selection[selectionIndex]);
}

export function applyManualHint(puzzle: PuzzleState): PuzzleState | null {
  const unfilled = getUnfilledFillableIndices(
    puzzle.answer,
    puzzle.locked,
    puzzle.selection,
  );
  if (unfilled.length === 0) {
    return null;
  }

  const targetIndex = unfilled[Math.floor(Math.random() * unfilled.length)];
  const char = puzzle.answer[targetIndex];
  const usedIds = new Set(puzzle.selection.map((tile) => tile.id));
  const tileIndex = puzzle.tiles.findIndex(
    (tile) => tile.char === char && !usedIds.has(tile.id),
  );

  const nextLocked = {
    ...puzzle.locked,
    [targetIndex]: { char, kind: "hint" as const },
  };

  let workingSelection = puzzle.selection;
  if (tileIndex < 0) {
    const dropFrom = workingSelection.findLastIndex((tile) => tile.char === char);
    if (dropFrom < 0) {
      return null;
    }
    workingSelection = workingSelection.filter((_, index) => index !== dropFrom);
  }

  const nextTiles =
    tileIndex >= 0
      ? puzzle.tiles.filter((_, index) => index !== tileIndex)
      : puzzle.tiles;

  const previousFillable = buildFillableIndices(
    puzzle.answer.length,
    puzzle.locked,
  );
  const nextFillable = buildFillableIndices(puzzle.answer.length, nextLocked);
  const nextSelection = nextFillable
    .map((index) => {
      const previousIndex = previousFillable.indexOf(index);
      return previousIndex >= 0
        ? workingSelection[previousIndex]
        : undefined;
    })
    .filter((tile): tile is LetterTile => Boolean(tile));

  return {
    ...puzzle,
    locked: nextLocked,
    tiles: nextTiles,
    selection: nextSelection,
    manualHintsUsed: puzzle.manualHintsUsed + 1,
  };
}

export function scoreForPuzzle(
  difficulty: number,
  streak: number,
  manualHintsUsed: number,
): number {
  const base = 80 + difficulty * 8;
  const bonus = Math.max(0, streak - 1) * 20;
  const total = base + bonus;
  const penalty = Math.round(total * 0.25 * manualHintsUsed);
  return Math.max(15, total - penalty);
}

export function hintPenaltyPercent(manualHintsUsed: number): number {
  return manualHintsUsed * 25;
}
