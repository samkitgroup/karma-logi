import type { PlayerScoreMap, PlayerSession } from "@/lib/player-types";

type ApiError = { error: string; reason?: string };

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T | ApiError;

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? data.error
        : "Request failed";
    const error = new Error(message) as Error & { reason?: string; status?: number };
    if (typeof data === "object" && data !== null && "reason" in data) {
      error.reason = data.reason;
    }
    error.status = response.status;
    throw error;
  }

  return data as T;
}

export type PlayerMeResponse = {
  player: PlayerSession | null;
  scores: PlayerScoreMap;
  totalScore: number;
};

export async function fetchPlayerMe(): Promise<PlayerMeResponse> {
  const response = await fetch("/api/player/me", { cache: "no-store" });
  return parseJson(response);
}

export async function registerPlayer(input: {
  name: string;
  mobile: string;
}): Promise<PlayerMeResponse & { player: PlayerSession }> {
  const response = await fetch("/api/player/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson(response);
}

export async function submitPlayerScore(input: {
  gameId: string;
  score: number;
}): Promise<{
  score: number;
  scores: PlayerScoreMap;
  totalScore: number;
}> {
  const response = await fetch("/api/player/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson(response);
}

export type LeaderboardResponse = {
  entries: Array<{
    rank: number;
    name: string;
    mobile: string;
    totalScore: number;
    gamesPlayed: number;
  }>;
};

export async function fetchLeaderboard(): Promise<LeaderboardResponse> {
  const response = await fetch("/api/leaderboard", { cache: "no-store" });
  return parseJson(response);
}
