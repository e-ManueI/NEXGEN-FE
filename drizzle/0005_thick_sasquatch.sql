ALTER TABLE "prediction_result" ADD COLUMN "chloralkali_in_depth" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "prediction_result" ADD COLUMN "chloralkali_summary" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "prediction_result" ADD COLUMN "chloralkali_comparison" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "prediction_result" ADD COLUMN "electrodialysis_in_depth" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "prediction_result" ADD COLUMN "electrodialysis_summary" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "prediction_result" DROP COLUMN "prediction_path";