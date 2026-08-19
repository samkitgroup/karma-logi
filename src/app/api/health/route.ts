import { sql } from "drizzle-orm";

import { getDb } from "@/db";

export async function GET() {
  try {
    await getDb().execute(sql`select 1`);
    return Response.json({ ok: true, database: "connected" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database connection failed";

    return Response.json({ ok: false, database: message }, { status: 503 });
  }
}
