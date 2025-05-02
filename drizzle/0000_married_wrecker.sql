CREATE TABLE "company_brine_location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"region_name" varchar(250) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_brine_sample" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brine_site_id" uuid NOT NULL,
	"file_path" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_brine_site" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brine_location_id" uuid NOT NULL,
	"power_availability_per_brine" varchar(250) NOT NULL,
	"stress_per_brine" varchar(250) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" varchar(200) NOT NULL,
	"company_hq" varchar(250) NOT NULL,
	"registration_status_id" uuid NOT NULL,
	"license_number" varchar(50) NOT NULL,
	"estimated_annual_revenue_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(250) NOT NULL,
	"description" varchar(250) NOT NULL,
	"path" varchar NOT NULL,
	"policy_type_id" uuid NOT NULL,
	"version" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"effective_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "policy_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "policy_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "prediction_result" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brine_sample_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"model_version" varchar(250) NOT NULL,
	"prediction_path" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "region" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(250) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "region_location" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"region_id" uuid NOT NULL,
	"name" varchar(250) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registration_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"current_step" integer DEFAULT 1,
	"form_data" json DEFAULT '{}'::json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "registration_progress_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "registration_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "registration_status_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "revenue_range" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50),
	"min_revenue" bigint NOT NULL,
	"max_revenue" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "revenue_range_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "reviewed_prediction_result" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prediction_result_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"final_result_path" varchar NOT NULL,
	"is_approved" boolean DEFAULT false,
	"rating" varchar(250) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reviewed_prediction_result_prediction_result_id_unique" UNIQUE("prediction_result_id")
);
--> statement-breakpoint
CREATE TABLE "track_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"action" varchar(250) NOT NULL,
	"metadata" varchar(250) NOT NULL,
	"ip_address" "inet",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"password" varchar,
	"username" varchar,
	"is_registration_complete" boolean DEFAULT false,
	"company_id" uuid,
	"is_active" boolean DEFAULT true,
	"is_superuser" boolean DEFAULT false,
	"date_joined" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "user_policy" (
	"user_id" uuid NOT NULL,
	"policy_id" uuid NOT NULL,
	"agreed_at" timestamp DEFAULT now() NOT NULL,
	"is_accepted" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_type_option" "user_type_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_type_user_type_option_unique" UNIQUE("user_type_option")
);
--> statement-breakpoint
CREATE TABLE "user_user_type" (
	"user_id" uuid NOT NULL,
	"user_type_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_brine_location" ADD CONSTRAINT "company_brine_location_company_id_company_profile_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_brine_sample" ADD CONSTRAINT "company_brine_sample_brine_site_id_company_brine_site_id_fk" FOREIGN KEY ("brine_site_id") REFERENCES "public"."company_brine_site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_brine_site" ADD CONSTRAINT "company_brine_site_brine_location_id_company_brine_location_id_fk" FOREIGN KEY ("brine_location_id") REFERENCES "public"."company_brine_location"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_registration_status_id_registration_status_id_fk" FOREIGN KEY ("registration_status_id") REFERENCES "public"."registration_status"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_profile" ADD CONSTRAINT "company_profile_estimated_annual_revenue_id_revenue_range_id_fk" FOREIGN KEY ("estimated_annual_revenue_id") REFERENCES "public"."revenue_range"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policy" ADD CONSTRAINT "policy_policy_type_id_policy_type_id_fk" FOREIGN KEY ("policy_type_id") REFERENCES "public"."policy_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prediction_result" ADD CONSTRAINT "prediction_result_brine_sample_id_company_brine_sample_id_fk" FOREIGN KEY ("brine_sample_id") REFERENCES "public"."company_brine_sample"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prediction_result" ADD CONSTRAINT "prediction_result_company_id_company_profile_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_location" ADD CONSTRAINT "region_location_region_id_region_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."region"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_progress" ADD CONSTRAINT "registration_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewed_prediction_result" ADD CONSTRAINT "reviewed_prediction_result_prediction_result_id_prediction_result_id_fk" FOREIGN KEY ("prediction_result_id") REFERENCES "public"."prediction_result"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviewed_prediction_result" ADD CONSTRAINT "reviewed_prediction_result_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_activity" ADD CONSTRAINT "track_activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_company_id_company_profile_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company_profile"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_policy" ADD CONSTRAINT "user_policy_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_policy" ADD CONSTRAINT "user_policy_policy_id_policy_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policy"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_user_type" ADD CONSTRAINT "user_user_type_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_user_type" ADD CONSTRAINT "user_user_type_user_type_id_user_type_id_fk" FOREIGN KEY ("user_type_id") REFERENCES "public"."user_type"("id") ON DELETE cascade ON UPDATE no action;