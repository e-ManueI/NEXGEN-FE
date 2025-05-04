DROP TABLE "user_type" CASCADE;--> statement-breakpoint
DROP TABLE "user_user_type" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_type_enum" DEFAULT 'client' NOT NULL;