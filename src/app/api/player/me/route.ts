import { NextResponse } from "next/server";

import {
  getPlayerById,
  getPlayerScores,
  getTotalScore,
} from "@/lib/player-service";
import { getPlayerIdFromSession } from "@/lib/session";

export async function GET() {
  try {
    const playerId = await getPlayerIdFromSession();

    if (!playerId) {
      return NextResponse.json({
        player: null,
        scores: {},
        totalScore: 0,
      });
    }

    const player = await getPlayerById(playerId);
    if (!player) {
      return NextResponse.json({
        player: null,
        scores: {},
        totalScore: 0,
      });
    }

    const scores = await getPlayerScores(playerId);

    return NextResponse.json({
      player,
      scores,
      totalScore: getTotalScore(scores),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load player session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
