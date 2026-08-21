function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Pooled connection for app runtime (Route Handlers, Server Components). */
export function getDatabaseUrl(): string {
  return process.env.DATABASE_URL ?? requireEnv("DATABASE_URL");
}

/** Direct connection for migrations and DDL (non-pooled). */
export function getMigrationDatabaseUrl(): string {
  return process.env.DATABASE_URL_NON_POOLING ?? getDatabaseUrl();
}
