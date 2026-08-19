import type { KarmaConcept } from "@/lib/karma-concepts";

type KarmaConceptBubbleProps = {
  concept: KarmaConcept;
  compact?: boolean;
};

export function KarmaConceptBubble({
  concept,
  compact = false,
}: KarmaConceptBubbleProps) {
  const isLight = concept.tone === "light";

  return (
    <article className="group flex flex-col items-center gap-2 text-center">
      <div
        className={`relative flex items-center justify-center rounded-full ${
          compact ? "h-[4.25rem] w-[4.25rem] sm:h-20 sm:w-20" : "h-20 w-20 sm:h-24 sm:w-24"
        } ${isLight ? "orb-light glow-gold-strong" : "orb-shadow glow-shadow"}`}
      >
        <div
          className={`absolute rounded-full border ${
            compact ? "inset-2" : "inset-2.5"
          } ${isLight ? "border-gold-bright/25" : "border-shadow-grey/20"}`}
        />
        <span
          className={`relative font-serif font-semibold uppercase tracking-[0.12em] ${
            compact ? "text-[7px] sm:text-[8px]" : "text-[8px] sm:text-[9px]"
          } ${isLight ? "text-gold-bright" : "text-shadow-grey"}`}
        >
          {concept.label}
        </span>
      </div>

      {!compact ? (
        <p
          className={`max-w-[7.5rem] text-[10px] leading-relaxed sm:max-w-[8.75rem] sm:text-[11px] ${
            isLight ? "text-cream/70" : "text-shadow-grey/80"
          }`}
        >
          {concept.description}
        </p>
      ) : null}
    </article>
  );
}
