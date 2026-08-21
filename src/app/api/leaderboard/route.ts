import { NextResponse } from "next/server";

import { getLeaderboard } from "@/lib/player-service";

export async function GET() {
  try {
    const entries = await getLeaderboard(25);
    return NextResponse.json({ entries });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load leaderboard.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
