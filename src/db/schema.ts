import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
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

export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;
