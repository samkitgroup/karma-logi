import type { Lang } from "@/lib/language";
import { LANG_OPTIONS } from "@/lib/language";

type LanguageSelectorProps = {
  value: Lang;
  onChange: (lang: Lang) => void;
  className?: string;
};

export function LanguageSelector({
  value,
  onChange,
  className = "",
}: LanguageSelectorProps) {
  return (
    <div className={`language-row ${className}`} role="group" aria-label="Language">
      {LANG_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? "on" : undefined}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
