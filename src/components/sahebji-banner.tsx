import { auspices, sahebjis } from "@/lib/event";

type SahebjiBannerProps = {
  variant?: "full" | "compact" | "splash";
};

export function SahebjiBanner({ variant = "full" }: SahebjiBannerProps) {
  const showAuspices = variant === "full";

  return (
    <section
      className={`mx-auto w-full text-center ${variant === "splash" ? "max-w-none" : "max-w-[340px]"}`}
    >
      {showAuspices ? (
        <>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-gold-bright sm:text-xs">
            Under the auspices of
          </p>
          <p className="mt-1.5 font-serif text-sm uppercase tracking-[0.1em] text-gold-gradient sm:text-base">
            {auspices}
          </p>
        </>
      ) : null}

      <div
        className={`sahebji-credit ${showAuspices ? "mt-6" : ""} ${
          variant === "splash"
            ? "sahebji-credit-splash"
            : variant === "compact"
              ? "sahebji-credit-compact"
              : ""
        }`}
      >
        Inspiration &amp; Guidance
        {sahebjis.map((sahebji) => (
          <div key={sahebji.id} className="sahebji-entry">
            <span className="sahebji-entry-title">{sahebji.title}</span>
            <span className="sahebji-entry-name">{sahebji.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
