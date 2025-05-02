CREATE TYPE "public"."registration_status_enum" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "company_profile" ALTER COLUMN "company_hq" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "company_profile" ALTER COLUMN "registration_status_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "company_profile" ALTER COLUMN "license_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "company_profile" ALTER COLUMN "estimated_annual_revenue_id" DROP NOT NULL;