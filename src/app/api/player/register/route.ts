import { NextResponse } from "next/server";

import {
  getPlayerScores,
  getTotalScore,
  registerOrGetPlayer,
} from "@/lib/player-service";
import {
  isValidMobile,
  normalizeMobile,
  registerPlayerSchema,
} from "@/lib/player-validation";
import { setPlayerSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerPlayerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const mobile = normalizeMobile(parsed.data.mobile);
    if (!isValidMobile(mobile)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit Indian mobile number." },
        { status: 400 },
      );
    }

    const player = await registerOrGetPlayer({
      name: parsed.data.name,
      mobile,
    });
    await setPlayerSession(player.id);
    const scores = await getPlayerScores(player.id);

    return NextResponse.json({
      player,
      scores,
      totalScore: getTotalScore(scores),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to register player.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
