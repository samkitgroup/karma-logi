import Link from "next/link";

import {
  buildScorecardRows,
  getLeaderboard,
  getPlayerById,
  getPlayerScores,
  getTotalScore,
} from "@/lib/player-service";
import { maskMobile } from "@/lib/player-validation";
import { getPlayerIdFromSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ScorecardPage() {
  const playerId = await getPlayerIdFromSession();

  if (!playerId) {
    return (
      <div className="cosmic-vignette relative min-h-[100dvh] cosmic-bg">
        <main className="safe-x safe-bottom mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold text-gold-gradient">Scorecard</h1>
          <p className="mt-4 max-w-md text-text-muted">
            Register with your name and mobile on the home page to view your
            scorecard.
          </p>
          <Link
            href="/"
            className="mt-8 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-gold-bright"
          >
            Go to home
          </Link>
        </main>
      </div>
    );
  }

  let player;
  let rows;
  let totalScore = 0;
  let leaderboard;
  let loadError = "";

  try {
    player = await getPlayerById(playerId);
    if (!player) {
      loadError = "Session expired. Please register again.";
    } else {
      const scores = await getPlayerScores(playerId);
      rows = buildScorecardRows(scores);
      totalScore = getTotalScore(scores);
      leaderboard = await getLeaderboard(25);
    }
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Unable to load scorecard.";
  }

  if (loadError || !player || !rows || !leaderboard) {
    return (
      <div className="cosmic-vignette relative min-h-[100dvh] cosmic-bg">
        <main className="safe-x safe-bottom mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold text-gold-gradient">Scorecard</h1>
          <p className="mt-4 max-w-md text-rust">{loadError || "Unable to load scorecard."}</p>
          <Link
            href="/"
            className="mt-8 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-gold-bright"
          >
            Go to home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="cosmic-vignette relative min-h-[100dvh] overflow-x-hidden cosmic-bg">
      <main className="safe-x safe-bottom relative z-10 mx-auto max-w-2xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gold-dim transition hover:text-gold-bright"
          >
            ← Back to games
          </Link>
          <h1 className="mt-4 text-center text-2xl font-semibold text-gold-gradient sm:text-3xl">
            Scorecard
          </h1>
          <div className="section-rule mx-auto mt-4 w-20" aria-hidden />
          <p className="mt-4 text-center text-sm text-text-muted">
            {player.name} · {player.mobile}
          </p>
        </header>

        <section className="glass-panel rounded-2xl p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-dim">
            Total score
          </p>
          <p className="mt-2 text-4xl font-bold text-gold-bright">{totalScore}</p>
          <p className="mt-2 text-sm text-text-muted">
            Sum of all game scores below
          </p>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gold-dim">
            Your games
          </h2>
          <ul className="flex flex-col gap-3">
            {rows.map((row) => (
              <li
                key={row.gameId}
                className="glass-panel flex items-center justify-between rounded-2xl px-4 py-4 sm:px-5"
              >
                <div>
                  <p className="font-semibold text-foreground">{row.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-text-subtle">
                    {row.played ? "Completed" : "Not played yet"}
                  </p>
                </div>
                <p className="text-xl font-bold text-gold-bright">
                  {row.played ? row.score : "—"}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gold-dim">
            Leaderboard
          </h2>
          <div className="glass-panel overflow-hidden rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.14em] text-text-subtle">
                  <th className="px-4 py-3 sm:px-5">#</th>
                  <th className="px-4 py-3 sm:px-5">Player</th>
                  <th className="px-4 py-3 sm:px-5">Mobile</th>
                  <th className="px-4 py-3 text-right sm:px-5">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-text-muted sm:px-5"
                    >
                      No scores yet. Be the first to play.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry) => (
                    <tr
                      key={`${entry.rank}-${entry.mobile}`}
                      className="border-b border-white/5 last:border-b-0"
                    >
                      <td className="px-4 py-3 font-semibold text-gold sm:px-5">
                        {entry.rank}
                      </td>
                      <td className="px-4 py-3 text-foreground sm:px-5">
                        {entry.name}
                      </td>
                      <td className="px-4 py-3 text-text-muted sm:px-5">
                        {maskMobile(entry.mobile)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gold-bright sm:px-5">
                        {entry.totalScore}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
