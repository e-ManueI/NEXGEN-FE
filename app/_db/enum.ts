import { pgEnum } from "drizzle-orm/pg-core";

export const userTypeEnum = pgEnum("user_type_enum", [
  "admin",
  "expert",
  "client",
]);

export const registrationEnum = pgEnum("registration_status_enum", [
  "pending",
  "approved",
  "rejected",
]);

export const predictionStatusEnum = pgEnum("prediction_status_enum", [
  "in_progress",
  "done",
]);
