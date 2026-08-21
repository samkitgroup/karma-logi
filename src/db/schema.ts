import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "pending",
  "in_transit",
  "delivered",
  "cancelled",
]);

export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  trackingNumber: varchar("tracking_number", { length: 64 }).notNull().unique(),
  origin: varchar("origin", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  status: shipmentStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const players = pgTable(
  "players",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    mobile: varchar("mobile", { length: 15 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("players_mobile_unique").on(table.mobile)],
);

export const gameScores = pgTable(
  "game_scores",
  {
    id: serial("id").primaryKey(),
    playerId: integer("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    gameId: varchar("game_id", { length: 64 }).notNull(),
    score: integer("score").notNull(),
    playedAt: timestamp("played_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("game_scores_player_game_unique").on(table.playerId, table.gameId),
  ],
);

export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type GameScore = typeof gameScores.$inferSelect;
export type NewGameScore = typeof gameScores.$inferInsert;
