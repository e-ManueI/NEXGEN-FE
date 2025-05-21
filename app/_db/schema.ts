import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  bigint,
  integer,
  json,
  inet,
  date,
  text,
} from "drizzle-orm/pg-core";
import { userTypeEnum, predictionStatusEnum } from "./enum";

// === Tables ===
// This file defines the database schema for a PostgreSQL database using Drizzle ORM.
// It includes tables for user management, analytics, and policy management.
// The schema is organized into different sections, each representing a specific area of the application.
// The tables are defined using the `pgTable` function, which specifies the columns and their types.
export * from "./enum";

// User management tables
export const registrationStatus = pgTable("registration_status", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 20 }).unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const revenueRange = pgTable("revenue_range", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).unique(),
  minRevenue: bigint("min_revenue", { mode: "number" }).notNull(),
  maxRevenue: bigint("max_revenue", { mode: "number" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const companyProfile = pgTable("company_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  companyHq: varchar("company_hq", { length: 250 }), // TODO: not null
  registrationStatusId: uuid("registration_status_id").references(
    () => registrationStatus.id,
    { onDelete: "cascade" },
  ), // TODO: not null
  licenseNumber: varchar("license_number", { length: 50 }), // TODO: not null
  estimatedAnnualRevenueId: uuid("estimated_annual_revenue_id").references(
    () => revenueRange.id,
    { onDelete: "cascade" },
  ), // TODO: not null
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email").unique(),
  name: varchar("name"),
  password: varchar("password"),
  username: varchar("username").unique(),
  image: text("image"),
  isRegistrationComplete: boolean("is_registration_complete").default(false),
  role: userTypeEnum("role").notNull().default("client"),
  companyId: uuid("company_id")
    .references(() => companyProfile.id, {
      onDelete: "set null",
    })
    .notNull(),
  isActive: boolean("is_active").default(true),
  isSuperuser: boolean("is_superuser").default(false),
  dateJoined: timestamp("date_joined").notNull().defaultNow(),
  lastLogin: timestamp("last_login").defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const registrationProgress = pgTable("registration_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .unique()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  currentStep: integer("current_step").default(1), // Tracks current step 1-4
  formData: json("form_data").default({}), // Stores partial form data as JSON
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const trackActivity = pgTable("track_activity", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 250 }).notNull(),
  metadata: varchar("metadata", { length: 250 }).notNull(),
  ipAddress: inet("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Analytics tables
export const region = pgTable("region", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 250 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const regionLocation = pgTable("region_location", {
  id: uuid("id").primaryKey().defaultRandom(),
  regionId: uuid("region_id")
    .notNull()
    .references(() => region.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 250 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const companyBrineLocation = pgTable("company_brine_location", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companyProfile.id, { onDelete: "cascade" }),
  regionName: varchar("region_name", { length: 250 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const companyBrineSite = pgTable("company_brine_site", {
  id: uuid("id").primaryKey().defaultRandom(),
  brineLocationId: uuid("brine_location_id")
    .notNull()
    .references(() => companyBrineLocation.id, { onDelete: "cascade" }),
  powerAvailabilityPerBrine: varchar("power_availability_per_brine", {
    length: 250,
  }).notNull(),
  stressPerBrine: varchar("stress_per_brine", { length: 250 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const companyBrineSample = pgTable("company_brine_sample", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companyProfile.id, { onDelete: "cascade" }),
  brineSiteId: uuid("brine_site_id").references(() => companyBrineSite.id, {
    onDelete: "cascade",
  }),
  filePath: varchar("file_path").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const predictionResult = pgTable("prediction_result", {
  id: uuid("id").primaryKey().defaultRandom(),
  brineSampleId: uuid("brine_sample_id")
    .notNull()
    .references(() => companyBrineSample.id, { onDelete: "cascade" }),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companyProfile.id, { onDelete: "cascade" }),
  modelVersion: varchar("model_version", { length: 250 }).notNull(),
  predictionStatus: predictionStatusEnum("prediction_status")
    .notNull()
    .default("in_progress"),
  chloralkaliInDepthPath: varchar("chloralkali_in_depth_path"),
  chloralkaliSummaryPath: varchar("chloralkali_summary_path"),
  chloralkaliComparisonPath: varchar("chloralkali_comparison_path"),
  electrodialysisInDepthPath: varchar("electrodialysis_in_depth_path"),
  electrodialysisSummaryPath: varchar("electrodialysis_summary_path"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const reviewedPredictionResult = pgTable("reviewed_prediction_result", {
  id: uuid("id").primaryKey().defaultRandom(),
  predictionResultId: uuid("prediction_result_id")
    .notNull()
    .references(() => predictionResult.id, { onDelete: "cascade" }),
  modelVersion: varchar("model_version", { length: 250 }).notNull(),
  chloralkaliInDepthPath: varchar("chloralkali_in_depth_path").notNull(),
  chloralkaliSummaryPath: varchar("chloralkali_summary_path").notNull(),
  chloralkaliComparisonPath: varchar("chloralkali_comparison_path").notNull(),
  electrodialysisInDepthPath: varchar(
    "electrodialysis_in_depth_path",
  ).notNull(),
  electrodialysisSummaryPath: varchar("electrodialysis_summary_path").notNull(),
  isApproved: boolean("is_approved").default(false),
  rating: varchar("rating", { length: 250 }), // column use to be determined per project requirements
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const policyType = pgTable("policy_type", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).unique().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const policy = pgTable("policy", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 250 }).notNull(), // e.g. "Terms of use"
  description: varchar("description", { length: 250 }).notNull(),
  path: varchar("path").notNull(), // optional, e.g. /terms
  policyTypeId: uuid("policy_type_id")
    .notNull()
    .references(() => policyType.id, { onDelete: "cascade" }),
  version: varchar("version", { length: 50 }).notNull(), // eg. "v2.1"
  content: text("content").notNull(), // the full legal text
  effectiveDate: date("effective_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User policy agreement table
/// This table tracks the policies that users have agreed to.
/// Each user can agree to multiple policies, and each policy can be agreed to by multiple users.
/// The `agreedAt` column stores the timestamp of when the user agreed to the policy.
/// The `isAccepted` column indicates whether the user has accepted the policy.
/// The `userId` and `policyId` columns are foreign keys referencing the `user` and `policy` tables, respectively.
export const userPolicy = pgTable("user_policy", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  policyId: uuid("policy_id")
    .notNull()
    .references(() => policy.id, { onDelete: "cascade" }),
  agreedAt: timestamp("agreed_at").notNull().defaultNow(),
  isAccepted: boolean("is_accepted").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
