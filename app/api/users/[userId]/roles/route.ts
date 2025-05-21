import { NextRequest, URLPattern } from "next/server";
import { eq } from "drizzle-orm";
import {
  failure,
  forbidden,
  notFound,
  success,
  unauthorized,
} from "@/lib/api-response";
import { user } from "@/app/_db/schema";
import { db } from "@/app/_db";
import { auth } from "@/lib/auth";

/**
 * Handles the GET request to fetch a user's role.
 *
 * @param req - The incoming request object.
 * @returns A response object containing the user's role or an error message.
 *
 * ## Authentication
 * - No authentication: 401
 * - Non-matching user ID: 403
 * - Successful authentication: Proceeds to query
 *
 * ## URL Pattern Matching
 * - Extracts the user ID from the URL using the `:userId` pattern
 *
 * ## Query
 * - Fetches the user's role from the database
 * - Enforces that the logged-in user can only fetch their own role (optional)
 * - Returns a 404 if the user is not found
 *
 * ## Response
 * - On success: Returns a list containing the user's role
 * - On failure: Returns an error message with an appropriate HTTP status code
 *
 * ## Errors
 * - 400: User ID is missing
 * - 401: Unauthenticated
 * - 403: Forbidden
 * - 404: User not found
 * - 500: Failed to fetch user roles
 */
export async function GET(req: NextRequest) {
  // 1) Check authentication:
  const session = await auth();
  if (!session) {
    // no session → 401
    return unauthorized("Unauthenticated");
  }

  // 2) Use URL pattern matching to extract userId
  const urlPattern = new URLPattern({ pathname: "/api/users/:userId/roles" });
  const match = urlPattern.exec(req.url);
  const userId = match?.pathname.groups.userId;

  if (!userId) {
    return failure("User ID is missing", 400);
  }

  // 3) (Optional) enforce that the logged-in user can only fetch their own role
  if (session.user.id !== userId) {
    return forbidden();
  }

  try {
    // 3) Now safe to query
    const result = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (result.length === 0) {
      return notFound("User not found", 200);
    }

    // Wrap it in an array for backwards compatibility
    const roles = [result[0].role];

    return success({ roles }, "User roles fetched successfully");
  } catch (err) {
    console.error("getUserRole error:", err);
    return failure("Failed to fetch user roles", 500);
  }
}
