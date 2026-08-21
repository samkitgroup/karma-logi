import type { GameAccent, KarmaGame } from "@/lib/games";

type GameCardProps = {
  game: KarmaGame;
  played?: boolean;
  score?: number;
  disabled?: boolean;
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

const gameIcons: Record<string, React.ReactNode> = {
  "karma-quest": (
    <svg
      className="h-5 w-5 text-cyan-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  "karma-chakra": (
    <svg
      className="h-5 w-5 text-teal-400"
      style={{ animation: "chakra-spin 16s linear infinite" }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.02 12.02l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
      />
    </svg>
  ),
  "karma-scramble": (
    <svg
      className="h-5 w-5 text-amber-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16m-7 6h7"
      />
    </svg>
  ),
};

export function GameCard({
  game,
  played = false,
  score,
  disabled = false,
  onSelect,
}: GameCardProps) {
  const isAvailable = game.status === "available" && !played;
  const isLocked = game.status === "available" && played;

  const className = `game-card-link game-card ${accentStripeClass[game.accent]} glass-panel relative block w-full overflow-hidden rounded-2xl p-4 text-left transition duration-300 sm:p-4.5 ${
    isAvailable
      ? "game-card-live active:scale-[0.985]"
      : isLocked
        ? "opacity-75 active:scale-[0.99]"
        : "opacity-80"
  }`;

  const badgeElement =
    game.status === "coming-soon" ? (
      <span className="game-card-badge game-card-badge--muted">Soon</span>
    ) : played ? (
      <span className="game-card-badge game-card-badge--done">
        {score ?? 0} pts
      </span>
    ) : (
      <span className="game-card-badge game-card-badge--play">Play →</span>
    );

  return (
    <button
      type="button"
      className={className}
      onClick={() => onSelect(game.id)}
      disabled={game.status !== "available" || played || disabled}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        <div className="game-icon-wrap">
          <div className={`game-icon ${accentIconClass[game.accent]}`}>
            {gameIcons[game.id] ?? game.number}
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-foreground sm:text-[17px]">
              {game.title}
            </h3>
            {badgeElement}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gold-dim">
            {game.description}
          </p>
        </div>
      </div>
    </button>
  );
}
