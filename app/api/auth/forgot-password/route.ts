import { db } from "@/app/_db";
import { user } from "@/app/_db/schema";
import { passwordResetToken } from "@/app/_db/schema";
import { v4 as uuidv4 } from "uuid";
import { addMinutes } from "date-fns";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { AppRoutes } from "@/lib/routes";
import { eq } from "drizzle-orm";
import { success } from "@/lib/api-response";

/**
 * Handles password reset request. Sends email with reset link if the user exists.
 */
export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return new Response("Missing email", { status: 400 });

  // Find user by email
  const [foundUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  if (!foundUser) {
    // Always respond with success for security reasons to avoid exposing if email exists
    return success("If this email exists, a reset link has been sent.");
  }

  // Generate token and hash
  const token = uuidv4();
  const tokenHash = await bcrypt.hash(token, 14);
  const expiresAt = addMinutes(new Date(), 60); // 1 hour expiry

  // Store token in DB
  await db.insert(passwordResetToken).values({
    userId: foundUser.id,
    tokenHash,
    expiresAt,
    createdAt: new Date(),
  });

  // Send email
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${AppRoutes.resetPassword}?token=${token}`;
  await sendEmail({
    to: [email],
    subject: "Reset your password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
  });

  return success("If this email exists, a reset link has been sent.");
}
