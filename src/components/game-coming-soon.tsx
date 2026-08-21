import { ChakraMotif } from "@/components/chakra-motif";
import { GAME_DURATION_SEC } from "@/lib/game-config";
import type { GameAccent, KarmaGame } from "@/lib/games";

type GameComingSoonProps = {
  game: KarmaGame;
  onClose: () => void;
};

const accentIconClass: Record<GameAccent, string> = {
  cyan: "game-icon-cyan",
  teal: "game-icon-teal",
  gold: "game-icon-gold",
  crimson: "game-icon-crimson",
};

export function GameComingSoon({ game, onClose }: GameComingSoonProps) {
  return (
    <div className="cosmic-vignette fixed inset-0 z-50 flex min-h-[100dvh] flex-col overflow-x-hidden cosmic-bg">
      <header className="safe-top relative z-20 border-b border-white/10 bg-black/30 px-4 pb-3 backdrop-blur-md sm:px-6">
        <button
          type="button"
          className="touch-target inline-flex items-center gap-2 text-sm font-medium text-gold-dim transition hover:text-gold-bright"
          onClick={onClose}
        >
          ← Back
        </button>
      </header>

      <main className="safe-x safe-bottom relative z-10 mx-auto flex flex-1 max-w-lg flex-col items-center justify-center px-4 py-8 text-center sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 opacity-40">
          <ChakraMotif size={260} />
        </div>

        <div className={`game-icon ${accentIconClass[game.accent]} relative z-10 mb-6 animate-float`}>
          {game.number}
        </div>

        <h1 className="relative z-10 text-3xl font-semibold tracking-wide text-gold-gradient">
          {game.title}
        </h1>

        <p className="relative z-10 mt-4 text-base font-medium text-foreground">
          {game.description}
        </p>

        <div className="glass-panel relative z-10 mt-10 w-full rounded-2xl px-5 py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-dim">
            Coming soon · {GAME_DURATION_SEC}s rounds
          </p>
        </div>
      </main>
    </div>
  );
}
