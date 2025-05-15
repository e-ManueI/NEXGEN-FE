// app/actions/createUserAction.ts
"use server";

import { db } from "@/app/_db";
import { companyProfile, user } from "@/app/_db/schema";

import { UserType } from "@/app/_db/enum";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createUserSchema } from "@/lib/zod/auth";
import { auth } from "@/lib/auth";

type Result =
  | {
      success: true;
      user: { id: string; name: string; email: string; role: UserType };
    }
  | { success: false; errors?: Record<string, string[]>; message?: string };

/**
 * Creates a new user.
 *
 * @param formData - The user's data in key-value pair form.
 * @returns A result object with a success flag and either a user object or an error message/object.
 */
export async function createUserAction(formData: FormData): Promise<Result> {
  // 1. Validate session
  const session = await auth();
  if (!session) {
    return { success: false, message: "Unauthorized access" };
  }
  if (session.user.role !== UserType.ADMIN) {
    return {
      success: false,
      message: "Access denied: Required role missing",
    };
  }

  // 2. Parse and validate form data
  const raw = Object.fromEntries(formData.entries());
  const parsed = createUserSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  const { firstName, lastName, companyName, email, password, role } =
    parsed.data;

  // 3. Check if email already exists
  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  if (existing.length > 0) {
    return {
      success: false,
      errors: { email: ["Email already exists"] },
    };
  }

  try {
    // 4. Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // 5. Upsert the company
    let companyId: string;
    const [cmp] = await db
      .select({ id: companyProfile.id })
      .from(companyProfile)
      .where(
        sql`LOWER(${companyProfile.companyName}) = ${companyName
          .trim()
          .toLowerCase()}`,
      )
      .limit(1);
    if (cmp) {
      companyId = cmp.id;
    } else {
      companyId = uuidv4();
      await db.insert(companyProfile).values({
        id: companyId,
        companyName: companyName.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 6. Create the user
    const userId = uuidv4();
    await db.insert(user).values({
      id: userId,
      email,
      name: `${firstName} ${lastName}`,
      password: hashed,
      username: email,
      image: "",
      companyId,
      role,
      isRegistrationComplete: true,
      dateJoined: new Date(),
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      user: { id: userId, name: `${firstName} ${lastName}`, email, role },
    };
  } catch (err) {
    console.error("Create user failed:", err);
    return {
      success: false,
      message: "Internal server error. Please try again.",
    };
  }
}
