export const PLAYER_SESSION_COOKIE = "karma_player_id";

export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

export type PlayerSession = {
  id: number;
  name: string;
  mobile: string;
};

export type PlayerScoreMap = Record<string, number>;

export type LeaderboardEntry = {
  rank: number;
  name: string;
  mobile: string;
  totalScore: number;
  gamesPlayed: number;
};

export type ScorecardGameRow = {
  gameId: string;
  title: string;
  score: number | null;
  played: boolean;
};
