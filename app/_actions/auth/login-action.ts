"use server";

import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/zod/auth";
import { LoginState } from "@/lib/zod/types/auth";

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

  // 2. Attempt to sign in
  try {
    // This throws on invalid credentials
    await signIn("credentials", { email, password, redirect: false });
  } catch (err: unknown) {
    console.error("[auth][error]", err);

    // pick a generic message
    const msg =
      (err as { code?: string })?.code === "credentials"
        ? "Invalid email or password"
        : "Something went wrong. Please try again.";

    return {
      success: false,
      message: msg,
    };
  }

  return { success: true, message: "Login successful" };
}
