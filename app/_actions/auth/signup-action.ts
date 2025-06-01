"use server";

import { db } from "@/app/_db";
import { companyProfile, user } from "@/app/_db/schema";
import { signIn } from "@/lib/auth";
import { signupSchema } from "@/lib/zod/auth";
import { SignupState } from "@/lib/zod/types/auth";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Signup action
/**
 * Handles the signup action.
 *
 * @param prevState - The form state right before submission.
 * @param formData - The form data as a FormData object.
 * @returns A result object with a success flag and either a user object or an error message/object.
 */
export async function signupAction(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  // 1. Validate form data
  const raw = Object.fromEntries(formData.entries());
  const parsed = signupSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { email, firstName, lastName, companyName, password } = parsed.data;

  // 2. Check if email already exists
  try {
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, errors: { email: ["Email already exists"] } };
    }
  } catch (dbErr) {
    console.error("DB error checking user:", dbErr);
    return {
      success: false,
      message:
        "Unable to verify email uniqueness right now. Please try again later.",
    };
  }

  // 3. Hash the password + make iDs
  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 14);
  } catch (hashErr) {
    console.error("Error hashing password:", hashErr);
    return {
      success: false,
      message: "Internal error encrypting your password. Please try again.",
    };
  }

  // 4. Upsert company; find existing by name, else create new
  let companyId: string;
  try {
    const [existingCompany] = await db
      .select()
      .from(companyProfile)
      .where(
        eq(
          // wrap the column in a LOWER(...) call
          sql`LOWER(${companyProfile.companyName})`,
          companyName.trim().toLowerCase(),
        ),
      )
      .limit(1);

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      companyId = uuidv4();
      // 4a. Insert company profile (minimal fields for now)
      await db.insert(companyProfile).values({
        id: companyId,
        companyName,
        // everything else (companyHq, registrationStatusId, licenseNumber,
        // estimatedAnnualRevenueId) will default to NULL until collected
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (companyErr) {
    console.error("Error handling company record:", companyErr);
    return {
      success: false,
      message:
        "Could not create or find company record. Please try again later.",
    };
  }

  // 5. Create the user inside a transaction
  const userId = uuidv4();
  try {
    await db.transaction(async (tx) => {
      // 5a. Insert user
      await tx.insert(user).values({
        id: userId,
        email: email,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        username: email,
        image: "",
        companyId,
        isRegistrationComplete: true,
        // role defaults to "client" per the enum default
        // isActive, isSuperUser defaults as defined in the schema
        dateJoined: new Date(),
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  } catch (createErr) {
    console.error("Error creating user:", createErr);
    return {
      success: false,
      message: "Failed to create your account. Please try again.",
    };
  }

  // 6a. Automatically sign in the user
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (signInErr) {
    console.error("Error signing in new user:", signInErr);
    // Not fatal; signup succeeded but sign-in failed
    return {
      success: true,
      message:
        "Signup succeeded, but we couldn't sign you in automatically. Please log in manually.",
    };
  }

  // 7. Only now do we return the “all good” result
  return { success: true, message: "Signup successful!" };
}
