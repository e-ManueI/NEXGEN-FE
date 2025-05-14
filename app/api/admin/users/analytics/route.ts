import { db } from "@/app/_db";
import { user, UserType } from "@/app/_db/schema";
import { failure, forbidden, success, unauthorized } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { getDateRange } from "@/lib/get-range";
import { and, count, eq, gt, lt } from "drizzle-orm";

// Retrieves user analytics including total users, new users,
// active users, and deactivated users
/**
 * Handles the GET request for fetching user analytics.
 * 
 * This endpoint is protected and requires authentication. Only users with the
 * `ADMIN` role are authorized to access this resource. The analytics data includes
 * the total number of users, new users within a specified date range, active users,
 * and deactivated users.
 * 
 * Query Parameters:
 * - `range` (optional): Specifies the date range for analytics. Accepted values are:
 *   - `"week"`: Analytics for the past week.
 *   - `"month"`: Analytics for the past month.
 *   - `"year"`: Analytics for the past year.
 * 
 * Responses:
 * - Success (200): Returns an object containing user analytics:
 *   - `totalUsers`: Total number of users in the system.
 *   - `newUsers`: Number of users created within the specified date range.
 *   - `activeUsers`: Number of currently active users.
 *   - `inactiveUsers`: Number of deactivated users.
 * - Unauthorized (401): If the request is unauthenticated.
 * - Forbidden (403): If the authenticated user does not have the `ADMIN` role.
 * - Failure (500): If an error occurs while fetching analytics.
 * 
 * @param req - The incoming request object containing authentication and query parameters.
 * @returns A response object with the analytics data or an error message.
 */
export const GET = auth(async (req) => {
  if (!req.auth) {
    return unauthorized();
  }

  // only admins may get analytics
  if (req.auth.user.role !== UserType.ADMIN) {
    return forbidden("Access denied: Required role missing", 403);
  }

  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range"); // "week" | "month" | "year"

    const { startDate, endDate } = getDateRange(range);

    // Query for total users
    const totalUsersQuery = await db.select({ count: count() }).from(user);

    // Query for new users
    const newUsersQuery = await db
      .select({ count: count() })
      .from(user)
      .where(and(gt(user.createdAt, startDate), lt(user.createdAt, endDate)));

    // Query for active users
    const activeUsersQuery = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.isActive, true));

    // Query for deactivated users
    const deactivatedUsersQuery = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.isActive, false));

    const analytics = {
      totalUsers: totalUsersQuery[0].count,
      newUsers: newUsersQuery[0].count,
      activeUsers: activeUsersQuery[0].count,
      inactiveUsers: deactivatedUsersQuery[0].count,
    };

    return success(analytics, "User Analytics fetched successfully");
  } catch (err) {
    console.error(err);
    return failure("Failed to user fetch analytics");
  }
});
