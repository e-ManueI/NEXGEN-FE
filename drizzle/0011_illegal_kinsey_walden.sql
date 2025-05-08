ALTER TABLE "prediction_result" ALTER COLUMN "chloralkali_in_depth_path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "prediction_result" ALTER COLUMN "chloralkali_summary_path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "prediction_result" ALTER COLUMN "chloralkali_comparison_path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "prediction_result" ALTER COLUMN "electrodialysis_in_depth_path" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "prediction_result" ALTER COLUMN "electrodialysis_summary_path" DROP NOT NULL;