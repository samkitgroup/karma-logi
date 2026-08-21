import type { GameAccent, KarmaGame } from "@/lib/games";
import { GAME_DURATION_SEC } from "@/lib/game-config";

type GameCardProps = {
  game: KarmaGame;
  played?: boolean;
  score?: number;
  onSelect: (gameId: string) => void;
};

const accentIconClass: Record<GameAccent, string> = {
  cyan: "game-icon-cyan",
  teal: "game-icon-teal",
  gold: "game-icon-gold",
  crimson: "game-icon-crimson",
};

const accentStripeClass: Record<GameAccent, string> = {
  cyan: "game-card-stripe-cyan",
  teal: "game-card-stripe-teal",
  gold: "game-card-stripe-gold",
  crimson: "game-card-stripe-crimson",
};

export function GameCard({ game, played = false, score, onSelect }: GameCardProps) {
  const isAvailable = game.status === "available" && !played;
  const isLocked = game.status === "available" && played;

  const className = `game-card-link game-card ${accentStripeClass[game.accent]} glass-panel relative block w-full overflow-hidden rounded-2xl p-4 text-left transition duration-300 sm:p-5 ${
    isAvailable
      ? "game-card-live active:scale-[0.98] sm:hover:glow-gold"
      : isLocked
        ? "opacity-70"
        : "opacity-80"
  }`;

  const badgeLabel =
    game.status === "coming-soon"
      ? "Soon"
      : played
        ? `Played · ${score ?? 0}`
        : "Play";

  return (
    <button
      type="button"
      className={className}
      onClick={() => onSelect(game.id)}
      disabled={game.status !== "available"}
    >
      <div className="flex items-center gap-3.5 sm:gap-4">
        <div className={`game-icon ${accentIconClass[game.accent]}`}>
          {game.number}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold tracking-wide text-foreground sm:text-xl">
              {game.title}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                isAvailable
                  ? "bg-gold/20 text-gold shadow-[0_0_14px_rgba(0,229,255,0.45)]"
                  : played
                    ? "bg-white/10 text-text-muted"
                    : "bg-white/5 text-text-subtle"
              }`}
            >
              {badgeLabel}
            </span>
          </div>

          <p className="mt-1.5 text-sm leading-snug text-gold-dim">{game.description}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-text-subtle">
            {played ? "Completed" : `${GAME_DURATION_SEC}s round`}
          </p>
        </div>
      </div>
    </button>
  );
}
