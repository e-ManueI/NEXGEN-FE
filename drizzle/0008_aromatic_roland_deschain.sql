ALTER TABLE "reviewed_prediction_result" DROP CONSTRAINT "reviewed_prediction_result_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "company_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reviewed_prediction_result" ADD COLUMN "model_version" varchar(250) NOT NULL;--> statement-breakpoint
ALTER TABLE "reviewed_prediction_result" ADD COLUMN "chloralkali_in_depth_path" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "reviewed_prediction_result" ADD COLUMN "chloralkali_summary_path" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "reviewed_prediction_result" ADD COLUMN "chloralkali_comparison_path" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "reviewed_prediction_result" ADD COLUMN "electrodialysis_in_depth_path" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "reviewed_prediction_result" ADD COLUMN "electrodialysis_summary_path" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "reviewed_prediction_result" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "reviewed_prediction_result" DROP COLUMN "final_result_path";