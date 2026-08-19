import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import { getDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

type Db = NeonHttpDatabase<typeof schema>;

let dbInstance: Db | null = null;

export function getDb(): Db {
  if (!dbInstance) {
    const sql = neon(getDatabaseUrl());
    dbInstance = drizzle(sql, { schema });
  }

  return dbInstance;
}
