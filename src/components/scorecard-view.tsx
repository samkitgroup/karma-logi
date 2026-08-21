import Link from "next/link";

import { getGameById } from "@/lib/games";
import type { LeaderboardEntry, ScorecardGameRow } from "@/lib/player-types";
import { maskMobile } from "@/lib/player-validation";

const accentStripeClass = {
  cyan: "game-card-stripe-cyan",
  teal: "game-card-stripe-teal",
  gold: "game-card-stripe-gold",
  crimson: "game-card-stripe-crimson",
} as const;

type ScorecardViewProps = {
  playerName: string;
  playerMobile: string;
  totalScore: number;
  rows: ScorecardGameRow[];
  leaderboard: LeaderboardEntry[];
};

export function ScorecardView({
  playerName,
  playerMobile,
  totalScore,
  rows,
  leaderboard,
}: ScorecardViewProps) {
  return (
    <div className="cosmic-vignette relative flex min-h-dvh flex-col overflow-x-hidden cosmic-bg">
      <main className="safe-x safe-bottom relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-8">
        <header className="space-y-4">
          <Link href="/" className="scorecard-back">
            ← Back to games
          </Link>

          <div className="home-profile glass-panel rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="home-avatar" aria-hidden>
                  {playerName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-foreground sm:text-xl">
                    {playerName}
                  </p>
                  <p className="mt-1 text-sm text-text-subtle">
                    {maskMobile(playerMobile)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-subtle">
                  Total
                </p>
                <p className="mt-0.5 text-2xl font-bold tabular-nums text-amber-400 sm:text-3xl">
                  {totalScore}
                  <span className="ml-1 text-xs font-semibold text-text-subtle">
                    pts
                  </span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <section>
          <h2 className="scorecard-section-label">Your games</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {rows.map((row) => {
              const game = getGameById(row.gameId);
              const stripeClass = game
                ? accentStripeClass[game.accent]
                : "game-card-stripe-cyan";

              return (
                <li
                  key={row.gameId}
                  className={`game-card ${stripeClass} glass-panel scorecard-game-row`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{row.title}</p>
                    <p className="mt-1 text-xs text-text-subtle">
                      {row.played ? "Completed" : "Not played yet"}
                    </p>
                  </div>
                  <p
                    className={
                      row.played
                        ? "scorecard-game-score"
                        : "scorecard-game-empty"
                    }
                  >
                    {row.played ? row.score : "—"}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="pb-2">
          <h2 className="scorecard-section-label">Leaderboard</h2>
          <div className="mt-3 glass-panel overflow-hidden rounded-2xl">
            {leaderboard.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-text-muted">
                No scores yet. Be the first to play.
              </p>
            ) : (
              <ul className="divide-y divide-white/5">
                {leaderboard.map((entry) => (
                  <li
                    key={`${entry.rank}-${entry.mobile}`}
                    className={`scorecard-leader-row ${
                      entry.rank === 1 ? "scorecard-leader-row--top" : ""
                    }`}
                  >
                    <span className="scorecard-leader-rank">{entry.rank}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {entry.name}
                      </p>
                      <p className="truncate text-xs text-text-subtle">
                        {maskMobile(entry.mobile)}
                      </p>
                    </div>
                    <span className="scorecard-leader-score">
                      {entry.totalScore}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
