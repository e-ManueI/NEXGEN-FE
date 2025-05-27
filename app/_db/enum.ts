import { pgEnum } from "drizzle-orm/pg-core";
/// TODO: MODIFY TO USE THE USER TYPE ENUM FOR DRIZZLE V0.43+
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

// Enum for user types that should be in sync with [userTypeEnum] above
export enum UserType {
  ADMIN = "admin",
  EXPERT = "expert",
  CLIENT = "client",
}

export enum AnalysisMembraneEnum {
  CATION_EXCHANGE = "Cation-Exchange",
  ANION_EXCHANGE = "Anion-Exchange",
  BIPOLAR = "Bipolar",
}

export const PredictionStatus = {
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const ChartTimeRangeEnum = {
  LAST_3MONTHS: "90d",
  LAST_30DAYS: "30d",
  LAST_7DAYS: "7d",
};
