import { cookies } from "next/headers";

import {
  PLAYER_SESSION_COOKIE,
  SESSION_MAX_AGE_SEC,
  type PlayerSession,
} from "@/lib/player-types";

export async function getPlayerIdFromSession(): Promise<number | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(PLAYER_SESSION_COOKIE)?.value;

  if (!value) {
    return null;
  }

  const playerId = Number.parseInt(value, 10);
  return Number.isFinite(playerId) && playerId > 0 ? playerId : null;
}

export async function setPlayerSession(playerId: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(PLAYER_SESSION_COOKIE, String(playerId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SEC,
    path: "/",
  });
}

export async function clearPlayerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(PLAYER_SESSION_COOKIE);
}

export function toPlayerSession(player: {
  id: number;
  name: string;
  mobile: string;
}): PlayerSession {
  return {
    id: player.id,
    name: player.name,
    mobile: player.mobile,
  };
}
