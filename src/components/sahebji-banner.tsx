import { auspices, sahebjis } from "@/lib/event";

type SahebjiBannerProps = {
  variant?: "full" | "compact";
};

export function SahebjiBanner({ variant = "full" }: SahebjiBannerProps) {
  const showAuspices = variant === "full";

  return (
    <section className="mx-auto w-full max-w-lg text-center">
      {showAuspices ? (
        <>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-gold-bright/70 sm:text-xs">
            Under the auspices of
          </p>
          <p className="mt-1.5 font-serif text-sm uppercase tracking-[0.1em] text-gold-gradient sm:text-base">
            {auspices}
          </p>
        </>
      ) : null}

      <div className={showAuspices ? "mt-6" : ""}>
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-dim sm:text-xs">
          Inspiration &amp; Guidance
        </p>

        <ul className="mt-4 flex flex-col gap-3">
          {sahebjis.map((sahebji) => (
            <li key={sahebji.id}>
              <div className="sahebji-capsule mx-auto rounded-full px-4 py-3 sm:px-6 sm:py-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-capsule-label sm:text-[11px]">
                  {sahebji.title}
                </p>
                <p className="mt-0.5 font-serif text-xs leading-snug tracking-wide text-capsule-text sm:text-sm">
                  {sahebji.name}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
