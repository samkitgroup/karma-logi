import { and, desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/db";
import { gameScores, players } from "@/db/schema";
import { karmaGames } from "@/lib/games";
import {
  normalizeMobile,
  type RegisterPlayerInput,
  type SubmitScoreInput,
} from "@/lib/player-validation";
import type {
  LeaderboardEntry,
  PlayerScoreMap,
  ScorecardGameRow,
} from "@/lib/player-types";
import { toPlayerSession } from "@/lib/session";

export async function registerOrGetPlayer(input: RegisterPlayerInput) {
  const db = getDb();
  const mobile = normalizeMobile(input.mobile);
  const name = input.name.trim();

  const [existing] = await db
    .select()
    .from(players)
    .where(eq(players.mobile, mobile))
    .limit(1);

  if (existing) {
    if (existing.name !== name) {
      const [updated] = await db
        .update(players)
        .set({ name })
        .where(eq(players.id, existing.id))
        .returning();
      return toPlayerSession(updated ?? existing);
    }

    return toPlayerSession(existing);
  }

  const [created] = await db
    .insert(players)
    .values({ name, mobile })
    .returning();

  if (!created) {
    throw new Error("Unable to create player.");
  }

  return toPlayerSession(created);
}

export async function getPlayerById(playerId: number) {
  const db = getDb();
  const [player] = await db
    .select()
    .from(players)
    .where(eq(players.id, playerId))
    .limit(1);

  return player ? toPlayerSession(player) : null;
}

export async function getPlayerScores(playerId: number): Promise<PlayerScoreMap> {
  const db = getDb();
  const rows = await db
    .select({
      gameId: gameScores.gameId,
      score: gameScores.score,
    })
    .from(gameScores)
    .where(eq(gameScores.playerId, playerId));

  return Object.fromEntries(rows.map((row) => [row.gameId, row.score]));
}

export async function hasPlayedGame(
  playerId: number,
  gameId: string,
): Promise<boolean> {
  const db = getDb();
  const [row] = await db
    .select({ id: gameScores.id })
    .from(gameScores)
    .where(
      and(eq(gameScores.playerId, playerId), eq(gameScores.gameId, gameId)),
    )
    .limit(1);

  return Boolean(row);
}

export async function submitGameScore(
  playerId: number,
  input: SubmitScoreInput,
) {
  const db = getDb();
  const alreadyPlayed = await hasPlayedGame(playerId, input.gameId);

  if (alreadyPlayed) {
    return { ok: false as const, reason: "already_played" as const };
  }

  try {
    const [created] = await db
      .insert(gameScores)
      .values({
        playerId,
        gameId: input.gameId,
        score: input.score,
      })
      .returning();

    if (!created) {
      throw new Error("Score was not saved.");
    }

    return { ok: true as const, score: created.score };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("game_scores_player_game_unique")) {
      return { ok: false as const, reason: "already_played" as const };
    }

    throw error;
  }
}

export function buildScorecardRows(scores: PlayerScoreMap): ScorecardGameRow[] {
  return karmaGames.map((game) => {
    const score = scores[game.id];

    return {
      gameId: game.id,
      title: game.title,
      score: score ?? null,
      played: score !== undefined,
    };
  });
}

export function getTotalScore(scores: PlayerScoreMap): number {
  return Object.values(scores).reduce((sum, score) => sum + score, 0);
}

export async function getLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const db = getDb();
  const rows = await db
    .select({
      name: players.name,
      mobile: players.mobile,
      totalScore: sql<number>`coalesce(sum(${gameScores.score}), 0)`.mapWith(Number),
      gamesPlayed: sql<number>`count(${gameScores.id})`.mapWith(Number),
    })
    .from(players)
    .leftJoin(gameScores, eq(gameScores.playerId, players.id))
    .groupBy(players.id, players.name, players.mobile)
    .having(sql`coalesce(sum(${gameScores.score}), 0) > 0`)
    .orderBy(desc(sql`coalesce(sum(${gameScores.score}), 0)`))
    .limit(limit);

  return rows.map((row, index) => ({
    rank: index + 1,
    name: row.name,
    mobile: row.mobile,
    totalScore: row.totalScore,
    gamesPlayed: row.gamesPlayed,
  }));
}
