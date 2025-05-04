import { db } from "@/app/_db";
import { success, failure, unauthorized } from "@/lib/api-response";
import { auth } from "@/lib/auth";

export const GET = auth(async (req) => {
  if (!req.auth) {
    return unauthorized();
  }

  // only admins may list all roles
  if (req.auth.user.role !== "admin") {
    return unauthorized("Access denied: Required role missing", 403);
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
