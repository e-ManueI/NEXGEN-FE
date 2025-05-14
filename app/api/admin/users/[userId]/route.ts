import { db } from "@/app/_db";
import { user, companyProfile, UserType } from "@/app/_db/schema";
import { eq } from "drizzle-orm";
import {
  success,
  failure,
  unauthorized,
  badRequest,
  notFound,
  conflict,
  forbidden,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { editUserSchema } from "@/lib/zod/auth";
import { UserProfile } from "@/app/_types/user-info";

/**
 * Handles the GET request to fetch a user's details.
 * This endpoint is protected and requires authentication. 
 * 
 * Only users with the "admin" role
 * are authorized to access this resource. If the user is not authenticated or does not have
 * the required role, an unauthorized response is returned.
 *
 * The function queries the database to retrieve user information, including their ID, name,
 * email, role, active status, company name, date joined, last login, and last updated.
 * The data is returned in a success response if the query is successful. In case of an error
 * during the database query, a failure response is returned.
 *
 * @param req - The incoming request object, which includes authentication information.
 * @param params - The route parameters, containing the user ID to fetch
 * @returns A response object containing the user details or an error message
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await auth();
  if (!session) {
    return unauthorized();
  }

  if (session.user.role !== UserType.ADMIN) {
    return forbidden("Access denied: Required role missing");
  }

  const { userId } = await params;
  console.log("userId", userId);

  try {
    // 2) Fetch user + company
    const [u] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        companyName: companyProfile.companyName,
        joinDate: user.dateJoined,
        lastLogin: user.lastLogin,
        lastUpdated: user.updatedAt,
      })
      .from(user)
      .leftJoin(companyProfile, eq(user.companyId, companyProfile.id))
      .where(eq(user.id, userId));

    if (!u) {
      return failure("User not found", 404);
    }

    // 4) Return both in one payload
    return success(u, "User details fetched");
  } catch (err) {
    console.error(err);
    return failure("Failed to fetch user details");
  }
}

/**
 * Handles the PATCH request to update a user's profile.
 *
 * @param req - The incoming request object.
 * @param context - The route parameters, containing the user ID to update.
 * @returns A response object containing the updated user or an error message.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await auth();
  if (!session) {
    return unauthorized("Authentication Required.");
  }

  if (session.user.role !== UserType.ADMIN) {
    return unauthorized("Access Denied: Required role missing.", 403);
  }

  const { userId } = await params;

  // Validate UUID format of user ID
  if (
    !userId ||
    !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      userId,
    )
  ) {
    return badRequest("Invalid user ID format.");
  }

  let reqBody;
  try {
    reqBody = await req.json();
  } catch (error) {
    console.error(error);
    return badRequest("Invalid JSON payload.");
  }

  const parsed = editUserSchema.safeParse(reqBody);

  if (!parsed.success) {
    return badRequest(
      "Validation failed",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const { firstName, lastName, email, role } = parsed.data;

  try {
    // Fetch the user to be edited
    const [userToEdit] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userToEdit) {
      return notFound("User not found.");
    }

    const updatePayload: Partial<UserProfile> = {};

    // Update name logic
    if (firstName || lastName) {
      const currentNames = userToEdit.name ? userToEdit.name.split(" ") : [];
      const currentFirstName = currentNames[0] || "";
      const currentLastName = currentNames.slice(1).join(" ") || "";

      updatePayload.name =
        `${firstName || currentFirstName} ${lastName || currentLastName}`.trim();
    }

    // Check and update email if necessary
    if (email && email !== userToEdit.email) {
      const [existingEmailUser] = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, email))
        .limit(1);
      if (existingEmailUser) {
        return conflict("New email address is already in use.");
      }
      updatePayload.email = email;
      updatePayload.username = email; // Assuming username is tied to email
    }

    // Update role if provided
    if (role) {
      updatePayload.role = role;
    }

    // Check if there are any changes to update
    if (Object.keys(updatePayload).length === 0) {
      return badRequest("No changes provided to update.");
    }

    updatePayload.updatedAt = new Date();

    // Update user in the database
    await db.update(user).set(updatePayload).where(eq(user.id, userId));

    // Refetch the user to return updated data, excluding password
    const [updatedUser] = await db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        companyId: user.companyId,
        role: user.role,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return success({ user: updatedUser }, "User updated successfully.");
  } catch (err) {
    console.error("Error updating user:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return failure(`Failed to update user: ${errorMessage}`, 500);
  }
}
