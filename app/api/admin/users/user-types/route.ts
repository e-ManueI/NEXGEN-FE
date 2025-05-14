import { db } from "@/app/_db";
import { UserType } from "@/app/_db/enum";
import { success, failure, forbidden } from "@/lib/api-response";
import { auth } from "@/lib/auth";

/**
 * Handles the GET request to fetch all user roles from the database.
 * 
 * This endpoint is protected and requires authentication. Only users with
 * the `ADMIN` role are authorized to access this resource. It retrieves
 * the list of roles from the `user_type_enum` enum in the database.
 * 
 * @param req - The incoming request object, which includes authentication details.
 * @returns A response containing the list of roles if successful, or an error
 *          response if the user is unauthorized or an error occurs during the
 *          database query.
 * 
 * @throws {Error} If there is an issue executing the database query.
 */
export const GET = auth(async (req) => {
  if (!req.auth) {
    return forbidden();
  }

  // only admins may list all roles
  if (req.auth.user.role !== UserType.ADMIN) {
    return forbidden("Access denied: Required role missing", 403);
  }

  try {
    // Raw SQL to unnest the enum type into its individual values
    const { rows } = await db.execute(`
      SELECT unnest(enum_range(NULL::public.user_type_enum)) AS role
    `);

    // Depending on your DB client, it might be `rows` or `rows` under `result.rows`
    const roles = ((rows as { role: string }[]) ?? []).map((r) => r.role);

    return success({ roles }, "Roles fetched successfully");
  } catch (err) {
    console.error(err);
    return failure("Failed to fetch roles");
  }
});
