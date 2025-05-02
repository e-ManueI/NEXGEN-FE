"use server";

import { db } from "@/app/_db";
import { companyProfile, user, userType, userUserType } from "@/app/_db/schema";
import { signIn } from "@/lib/auth";
import { signupSchema } from "@/lib/zod/auth";
import { SignupState } from "@/lib/zod/types/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Signup action
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

  // TODO: Replace this with actual logic (DB call, auth, etc.)
  console.log("Signup attempt:", {
    email,
    firstName,
    lastName,
    companyName,
    password,
  });

  // 2. Check if email already exists
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, errors: { email: ["Email already exists"] } };
  }

  // 3. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = uuidv4();
  const companyId = uuidv4();

  // 4. Create the user
  try {
    await db.transaction(async (tx) => {
      // Insert company profile (minimal fields for now)
      await tx.insert(companyProfile).values({
        id: companyId,
        companyName: companyName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Insert user
      await tx.insert(user).values({
        id: userId,
        email: email,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        username: email,
        image: "",
        companyId,
        isRegistrationComplete: true,
        dateJoined: new Date(),
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Assign 'client' role
      let clientType = await tx
        .select({ id: userType.id })
        .from(userType)
        .where(eq(userType.userTypeOption, "client"))
        .limit(1);

      if (!clientType[0]) {
        const newClientTypeId = uuidv4();
        await tx.insert(userType).values({
          id: newClientTypeId,
          userTypeOption: "client",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        clientType = [{ id: newClientTypeId }];
      }

      await tx.insert(userUserType).values({
        userId,
        userTypeId: clientType[0].id,
      });
    });

    // 5. Sign in the user
    await signIn("credentials", { email, password, redirect: false });

    return { success: true, message: "Signup successful!" };
  } catch (error) {
    console.error("[signup[]][error]", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
