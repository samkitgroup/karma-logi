import { auspices } from "@/lib/event";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-lg px-4 pb-6 pt-10 text-center">
      <div className="section-rule mx-auto w-24" />
      <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-parch/30">
        Karma-Logi
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-parch/20">
        {auspices}
      </p>
    </footer>
  );
}
