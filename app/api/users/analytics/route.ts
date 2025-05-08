import { db } from "@/app/_db";
import { user } from "@/app/_db/schema";
import { failure, success, unauthorized } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { getDateRange } from "@/lib/get-range";
import { and, count, eq, gt, lt } from "drizzle-orm";

// Retrieves user analytics including total users, new users,
// active users, and deactivated users
export const GET = auth(async (req) => {
  if (!req.auth) {
    return unauthorized();
  }

  // only admins may get analytics
  if (req.auth.user.role !== "admin") {
    return unauthorized("Access denied: Required role missing", 403);
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
