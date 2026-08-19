import { auspices } from "@/lib/event";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-lg px-4 pb-6 pt-10 text-center">
      <div className="section-rule mx-auto w-24" />
      <p className="mt-4 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-gold-dim">
        Karma-Logi
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-text-subtle">
        {auspices}
      </p>
    </footer>
  );
}
