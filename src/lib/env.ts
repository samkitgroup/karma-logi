function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Pooled connection for app runtime (Route Handlers, Server Components). */
export function getDatabaseUrl(): string {
  return (
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL ??
    requireEnv("POSTGRES_URL")
  );
}

/** Direct connection for migrations and DDL (non-pooled). */
export function getMigrationDatabaseUrl(): string {
  return (
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL_UNPOOLED ??
    getDatabaseUrl()
  );
}
