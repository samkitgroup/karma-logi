import type { Lang } from "@/lib/language";

const graphemeSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function isCombiningMark(codePoint: number): boolean {
  if (codePoint >= 0x0300 && codePoint <= 0x036f) {
    return true;
  }
  if (codePoint >= 0x0900 && codePoint <= 0x0903) {
    return true;
  }
  if (codePoint >= 0x093a && codePoint <= 0x094f) {
    return true;
  }
  if (codePoint >= 0x0951 && codePoint <= 0x0957) {
    return true;
  }
  if (codePoint >= 0x0a81 && codePoint <= 0x0a83) {
    return true;
  }
  if (codePoint >= 0x0abe && codePoint <= 0x0acd) {
    return true;
  }
  if (codePoint >= 0x0ae2 && codePoint <= 0x0ae3) {
    return true;
  }
  if (codePoint === 0x200c || codePoint === 0x200d) {
    return true;
  }
  return false;
}

function mergeIndicGraphemes(text: string): string[] {
  const units: string[] = [];

  for (const ch of text) {
    const codePoint = ch.codePointAt(0);
    if (codePoint === undefined) {
      continue;
    }

    if (units.length === 0 || !isCombiningMark(codePoint)) {
      units.push(ch);
      continue;
    }

    units[units.length - 1] += ch;
  }

  return units;
}

export function splitTextUnits(text: string, lang: Lang): string[] {
  if (lang === "en") {
    return text
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase()
      .split("");
  }

  const cleaned = text.replace(/[\s\-–—]/g, "");
  if (!cleaned) {
    return [];
  }

  if (graphemeSegmenter) {
    return [...graphemeSegmenter.segment(cleaned)]
      .map((part) => part.segment)
      .filter(Boolean);
  }

  return mergeIndicGraphemes(cleaned);
}
