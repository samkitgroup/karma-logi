import Link from "next/link";

import { ScorecardView } from "@/components/scorecard-view";
import {
  buildScorecardRows,
  getLeaderboard,
  getPlayerById,
  getPlayerScores,
  getTotalScore,
} from "@/lib/player-service";
import { getPlayerIdFromSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function ScorecardFallback({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="cosmic-vignette relative min-h-dvh cosmic-bg">
      <main className="safe-x safe-bottom mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 max-w-md text-sm text-text-muted">{message}</p>
        <Link href="/" className="home-scorecard-link mt-8">
          Go to home
        </Link>
      </main>
    </div>
  );
}

export default async function ScorecardPage() {
  const playerId = await getPlayerIdFromSession();

  if (!playerId) {
    return (
      <ScorecardFallback
        title="Scorecard"
        message="Register with your name and mobile on the home page to view your scorecard."
      />
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
      <ScorecardFallback
        title="Scorecard"
        message={loadError || "Unable to load scorecard."}
      />
    );
  }

  return (
    <ScorecardView
      playerName={player.name}
      playerMobile={player.mobile}
      totalScore={totalScore}
      rows={rows}
      leaderboard={leaderboard}
    />
  );
}
