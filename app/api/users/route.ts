import { db } from "@/app/_db";
import { user, companyProfile } from "@/app/_db/schema";
import { failure, success, unauthorized } from "@/lib/api-response";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

// Fetches users with their associated company information
export const GET = auth(async (req) => {
  if (!req.auth) {
    return unauthorized();
  }

  // only admins may list all users
  if (req.auth.user.role !== "admin") {
    return unauthorized("Access denied: Required role missing", 403);
  }

  try {
    // Query users with joined company profile data
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: companyProfile.companyName,
        role: user.role,
        isActive: user.isActive,
      })
      .from(user)
      .leftJoin(companyProfile, eq(user.companyId, companyProfile.id));

    return success({ users }, "Users fetched successfully");
  } catch (err) {
    console.error(err);
    return failure("Failed to fetch users");
  }
});
