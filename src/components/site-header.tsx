import Link from "next/link";

type SiteHeaderProps = {
  active?: "home" | "games";
};

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  return (
    <header className="relative z-20 flex items-center justify-between gap-3 border-b border-gold/10 bg-black/20 px-4 py-3 backdrop-blur-md sm:px-6 md:px-10">
      <Link href="/" className="group flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="block truncate font-serif text-base tracking-[0.12em] text-gold-gradient sm:text-lg">
          KARMA<span className="text-ghati">-</span>LOGI
        </span>
        <span className="hidden text-[10px] uppercase tracking-[0.18em] text-parch/40 sm:block">
          Jain Scientific Expo
        </span>
      </Link>

      <nav
        className="flex shrink-0 items-center gap-0.5 rounded-full border border-gold/15 bg-black/40 p-0.5"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className={`rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition sm:px-4 sm:text-xs ${
            active === "home"
              ? "bg-gold/20 text-gold-bright"
              : "text-parch/45 hover:text-gold-bright"
          }`}
        >
          Intro
        </Link>
        <Link
          href="/games"
          className={`rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition sm:px-4 sm:text-xs ${
            active === "games"
              ? "bg-gold/20 text-gold-bright"
              : "text-parch/45 hover:text-gold-bright"
          }`}
        >
          Games
        </Link>
      </nav>
    </header>
  );
}
