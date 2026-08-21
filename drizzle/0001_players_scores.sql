CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"mobile" varchar(15) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "players_mobile_unique" ON "players" USING btree ("mobile");
--> statement-breakpoint
CREATE TABLE "game_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"game_id" varchar(64) NOT NULL,
	"score" integer NOT NULL,
	"played_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_scores" ADD CONSTRAINT "game_scores_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "game_scores_player_game_unique" ON "game_scores" USING btree ("player_id","game_id");
