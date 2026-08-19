CREATE TYPE "public"."shipment_status" AS ENUM('pending', 'in_transit', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TABLE "shipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"tracking_number" varchar(64) NOT NULL,
	"origin" varchar(255) NOT NULL,
	"destination" varchar(255) NOT NULL,
	"status" "shipment_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipments_tracking_number_unique" UNIQUE("tracking_number")
);
