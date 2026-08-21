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

const gameIcons: Record<string, React.ReactNode> = {
  "karma-quest": (
    <svg className="w-5.5 h-5.5 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "karma-chakra": (
    <svg className="w-5.5 h-5.5 text-teal-400 drop-shadow-[0_0_8px_rgba(0,240,181,0.7)]" style={{ animation: "chakra-spin 16s linear infinite" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.02 12.02l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  ),
  "karma-scramble": (
    <svg className="w-5.5 h-5.5 text-gold drop-shadow-[0_0_8px_rgba(255,184,0,0.7)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  ),
};

export function GameCard({ game, played = false, score, onSelect }: GameCardProps) {
  const isAvailable = game.status === "available" && !played;
  const isLocked = game.status === "available" && played;

  const className = `game-card-link game-card ${accentStripeClass[game.accent]} glass-panel relative block w-full overflow-hidden rounded-2xl p-4.5 text-left transition duration-300 sm:p-5.5 ${
    isAvailable
      ? "game-card-live active:scale-[0.985] sm:hover:glow-gold"
      : isLocked
        ? "opacity-75 active:scale-[0.99] sm:hover:opacity-90"
        : "opacity-80"
  }`;

  const badgeElement =
    game.status === "coming-soon" ? (
      <span className="shrink-0 rounded-xl bg-white/5 border border-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-subtle">
        Soon
      </span>
    ) : played ? (
      <span className="shrink-0 rounded-xl bg-green-500/10 border border-green-500/30 px-3 py-1.5 text-xs font-extrabold text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.15)] flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {score ?? 0} pts
      </span>
    ) : (
      <span className="shrink-0 rounded-xl bg-gold/15 border border-gold/30 px-3.5 py-1.5 text-xs font-extrabold text-gold shadow-[0_0_12px_rgba(0,229,255,0.2)] flex items-center gap-1.5">
        Play
        <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    );

  return (
    <button
      type="button"
      className={className}
      onClick={() => onSelect(game.id)}
      disabled={game.status !== "available"}
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <div className={`game-icon ${accentIconClass[game.accent]}`}>
          {gameIcons[game.id] ?? game.number}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold tracking-wide text-foreground sm:text-lg">
              {game.title}
            </h3>
            {badgeElement}
          </div>

          <p className="mt-2 text-sm leading-relaxed text-gold-dim">{game.description}</p>
          
          {!played && (
            <div className="mt-3 flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-text-subtle">
              <span>{`${GAME_DURATION_SEC}s Challenge`}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
