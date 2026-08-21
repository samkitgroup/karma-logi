import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const url =
  process.env.DATABASE_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/karma_logi";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
