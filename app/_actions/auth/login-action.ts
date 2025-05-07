"use server";

import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/zod/auth";
import { LoginState } from "@/lib/zod/types/auth";

export async function loginAction(formData: FormData): Promise<LoginState> {
  // 1. Parse and validate form data
  const raw = Object.fromEntries(formData.entries());
  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  // TODO: Auth logic here
  console.log("Login Attempt:", email, password);

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
