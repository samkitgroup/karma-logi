export const GAME_DURATION_MS = 90_000;
export const GAME_DURATION_SEC = 90;

export function formatGameTime(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
