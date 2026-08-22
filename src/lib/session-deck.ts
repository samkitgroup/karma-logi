/** In-session deck: shuffle once, draw without replacement, never repeat an id. */

export function shuffleItems<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function dedupeByKey<T>(
  items: readonly T[],
  getKey: (item: T) => string,
): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    const key = getKey(item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }

  return unique;
}

export class SessionDeck<T> {
  private readonly queue: T[];
  private index = 0;
  private readonly played = new Set<string>();

  constructor(
    items: readonly T[],
    getKey: (item: T) => string,
    options?: { shuffle?: boolean },
  ) {
    this.getKey = getKey;
    const unique = dedupeByKey(items, getKey);
    this.queue =
      options?.shuffle === false ? unique : shuffleItems(unique);
  }

  private readonly getKey: (item: T) => string;

  drawNext(): T | null {
    while (this.index < this.queue.length) {
      const item = this.queue[this.index];
      this.index += 1;

      const key = this.getKey(item);
      if (this.played.has(key)) {
        continue;
      }

      this.played.add(key);
      return item;
    }

    return null;
  }

  hasRemaining(): boolean {
    return this.index < this.queue.length;
  }
}
