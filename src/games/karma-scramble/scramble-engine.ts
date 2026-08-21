export type LetterTile = {
  id: number;
  char: string;
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

export function selectionMatchesAnswer(
  selection: LetterTile[],
  answer: string[],
): boolean {
  if (selection.length !== answer.length) {
    return false;
  }
  return selection.every((tile, index) => tile.char === answer[index]);
}

export function scoreForPuzzle(difficulty: number, streak: number): number {
  const base = 80 + difficulty * 8;
  const bonus = Math.max(0, streak - 1) * 20;
  return base + bonus;
}
