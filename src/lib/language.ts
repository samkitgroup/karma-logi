export type Lang = "en" | "hi" | "gu";

export const DEFAULT_LANG: Lang = "gu";

export const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
  { value: "gu", label: "ગુજરાતી" },
];
