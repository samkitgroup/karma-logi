import Link from "next/link";

import type { KarmaGame } from "@/lib/games";

type GameCardProps = {
  game: KarmaGame;
};

export function GameCard({ game }: GameCardProps) {
  const isGrowth = game.category === "growth";
  const isAvailable = game.status === "available";

  const cardContent = (
    <div className="flex gap-4">
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16 ${
          isGrowth ? "orb-light glow-gold" : "orb-shadow glow-shadow"
        }`}
      >
        <span
          className={`font-serif text-lg font-semibold sm:text-xl ${
            isGrowth ? "text-gold-gradient" : "text-gold-bright"
          }`}
        >
          {game.title.charAt(0)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
              isGrowth
                ? "border border-gold/30 bg-gold/10 text-gold-bright"
                : "border border-gold-dim/40 bg-black/20 text-text-muted"
            }`}
          >
            {game.concept}
          </span>
          <span
            className={`shrink-0 text-[9px] font-semibold uppercase tracking-wider ${
              isAvailable ? "text-ghati" : "text-gold-dim"
            }`}
          >
            {isAvailable ? "Play" : "Soon"}
          </span>
        </div>

        <h3 className="mt-2 font-serif text-lg tracking-wide text-gold-gradient sm:text-xl">
          {game.title}
        </h3>

        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
          {game.description}
        </p>
      </div>
    </div>
  );

  const className = `glass-panel block rounded-2xl p-4 transition duration-300 active:scale-[0.99] sm:p-5 ${
    isAvailable
      ? "cursor-pointer sm:hover:border-gold/35 sm:hover:glow-gold"
      : "cursor-default opacity-75"
  }`;

  if (isAvailable) {
    return (
      <Link href={game.href} className={className}>
        {cardContent}
      </Link>
    );
  }

  return <article className={className}>{cardContent}</article>;
}
