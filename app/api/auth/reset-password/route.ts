import { db } from "@/app/_db";
import { user, passwordResetToken } from "@/app/_db/schema";
import { badRequest, notFound, success } from "@/lib/api-response";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

/**
 * Handles the password reset request. Validates the token and updates the user's password.
 *
 * @param req - The incoming request containing the token and new password.
 * @returns A response indicating the status of the password reset operation.
 */
export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) return notFound("Missing token or password");

  // Retrieve all password reset tokens from the database
  const allTokens = await db
    .select({
      id: passwordResetToken.id,
      userId: passwordResetToken.userId,
      tokenHash: passwordResetToken.tokenHash,
      expiresAt: passwordResetToken.expiresAt,
    })
    .from(passwordResetToken);

  let matched = null;
  for (const t of allTokens) {
    if (await bcrypt.compare(token, t.tokenHash)) {
      matched = t;
      break;
    }
  }
  if (!matched) return badRequest("Invalid or expired token");
  if (new Date(matched.expiresAt) < new Date())
    return badRequest("Token has expired");

  // Update user password
  const passwordHash = await bcrypt.hash(password, 14);
  await db
    .update(user)
    .set({ password: passwordHash })
    .where(eq(user.id, matched.userId));

  // Delete the token
  await db
    .delete(passwordResetToken)
    .where(eq(passwordResetToken.id, matched.id));

  return success("Password reset successfully");
}
