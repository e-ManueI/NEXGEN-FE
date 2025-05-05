import * as schema from "@/app/_db/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Database connection instance.
 * This instance is used to interact with the PostgreSQL database.
 */
export const db = drizzle(pool, {
  schema,
  logger: true,
});

/**
 * Fetches the current PostgreSQL database version.
 *
 * @returns The current PostgreSQL database version.
 */
export const getDBVersion = async () => {
  const response = await pool.query("SELECT version()");
  const version = response.rows[0].version;
  return version;
};
