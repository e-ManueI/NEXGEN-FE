"use server";

import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/zod/auth";
import { LoginState } from "@/lib/zod/types/auth";
import { signOut } from "next-auth/react";

/**
 * Handles the login action.
 *
 * @param formData - The user's login data in key-value pair form.
 * @returns A result object with a success flag and either a user object or an error message/object.
 */
export async function loginAction(formData: FormData): Promise<LoginState> {
  // 1. Validate form data
  const raw = Object.fromEntries(formData.entries());
  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  // 2. Sign out the current user if authenticated
  try {
    // Optionally check for an existing session (if needed)
    // Note: getSession is client-side; for server-side, use next-auth's getServerSession
    await signOut({ redirect: false }); // Server-side signOut
  } catch (err) {
    console.error("[auth][signOut][error]", err);
    // Continue with sign-in even if sign-out fails, as it may already be signed out
  }

  // 3. Attempt to sign in
  try {
    await signIn("credentials", { email, password, redirect: false });
    return { success: true, message: "Login successful", errors: {} };
  } catch (err: unknown) {
    console.error("[auth][signIn][error]", err);
    const msg =
      (err as { code?: string })?.code === "credentials"
        ? "Invalid email or password"
        : "Something went wrong. Please try again.";
    return {
      success: false,
      message: msg,
      errors: {},
    };
  }
}
