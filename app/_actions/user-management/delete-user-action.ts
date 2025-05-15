"use server";

import { db } from "@/app/_db";
import { user, UserType } from "@/app/_db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export type ManageUserParams = {
  userId: string;
  operation: "delete" | "activate";
};

/**
 * Manages user actions such as delete and activate.
 *
 * @param {ManageUserParams} params - The parameters including userId and operation type.
 * @returns {Promise<{ success: true } | { success: false; message: string }>} - Result of the operation.
 */
export async function manageUserAction({
  userId,
  operation,
}: ManageUserParams): Promise<{ success: true } | { success: false; message: string }> {
  // Verify the session
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized access" };
  }
  
  // Check for admin role
  if (session.user.role !== UserType.ADMIN) {
    return {
      success: false,
      message: "Access denied: Required role missing",
    };
  }

  try {
    // Perform the specified operation
    if (operation === "delete") {
      // Deactivate the user
      await db.update(user).set({ isActive: false }).where(eq(user.id, userId));
    } else if (operation === "activate") {
      // Activate the user
      await db.update(user).set({ isActive: true }).where(eq(user.id, userId));
    }
    return { success: true };
  } catch (err) {
    console.error("manageUserAction error:", err);
    return { success: false, message: "Something went wrong" };
  }
}
