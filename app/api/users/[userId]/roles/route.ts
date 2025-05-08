import { NextRequest, URLPattern } from "next/server";
import { eq } from "drizzle-orm";
import { failure, notFound, success, unauthorized } from "@/lib/api-response";
import { user } from "@/app/_db/schema";
import { db } from "@/app/_db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // 1) Check authentication:
  const session = await auth();
  if (!session) {
    // no session → 401
    return unauthorized("Unauthenticated", 401);
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
    return unauthorized("Forbidden", 403);
  }

  try {
    // 3) Now safe to query
    const result = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (result.length === 0) {
      return notFound("User not found", 404);
    }

    // Wrap it in an array for backwards compatibility
    const roles = [result[0].role];

    return success({ roles }, "User roles fetched successfully");
  } catch (err) {
    console.error("getUserRole error:", err);
    return failure("Failed to fetch user roles", 500);
  }
}
