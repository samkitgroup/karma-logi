import { NextResponse } from "next/server";

import {
  getPlayerScores,
  getTotalScore,
  submitGameScore,
} from "@/lib/player-service";
import { submitScoreSchema } from "@/lib/player-validation";
import { getPlayerIdFromSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const playerId = await getPlayerIdFromSession();

    if (!playerId) {
      return NextResponse.json(
        { error: "Sign in with your name and mobile first." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = submitScoreSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid score payload." },
        { status: 400 },
      );
    }

    const result = await submitGameScore(playerId, parsed.data);

    if (!result.ok) {
      return NextResponse.json(
        {
          error: "You have already played this game with this mobile number.",
          reason: result.reason,
        },
        { status: 409 },
      );
    }

    const scores = await getPlayerScores(playerId);

    return NextResponse.json({
      score: result.score,
      scores,
      totalScore: getTotalScore(scores),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save score.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
