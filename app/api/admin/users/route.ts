import { db } from "@/app/_db";
import { user, companyProfile, UserType } from "@/app/_db/schema";
import {
  badRequest,
  conflict,
  failure,
  forbidden,
  success,
  unauthorized,
} from "@/lib/api-response";
import { eq, ne, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { createUserSchema } from "@/lib/zod/auth";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Fetches users with their associated company information
/**
 * Handles the GET request to fetch a list of users with their associated company profile data.
 *
 * This endpoint is protected and requires authentication. Only users with the "admin" role
 * are authorized to access this resource. If the user is not authenticated or does not have
 * the required role, an unauthorized response is returned.
 *
 * The function queries the database to retrieve user information, including their ID, name,
 * email, role, active status, and associated company name. The data is returned in a success
 * response if the query is successful. In case of an error during the database query, a failure
 * response is returned.
 *
 * @param req - The incoming request object, which includes authentication information.
 * @returns A response object containing the list of users or an error message.
 */
export const GET = auth(async (req) => {
  if (!req.auth) {
    return unauthorized();
  }

  // only admins may list all users
  if (req.auth.user.role !== UserType.ADMIN) {
    return forbidden("Access denied: Required role missing");
  }

  const authUser = req.auth?.user;
  const authUserId = authUser?.id;

  console.log(authUserId);

  try {
    // Query users with joined company profile data
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        companyName: companyProfile.companyName,
        role: user.role,
        isActive: user.isActive,
      })
      .from(user)
      .leftJoin(companyProfile, eq(user.companyId, companyProfile.id))
      .where(ne(user.id, authUserId));

    return success({ users }, "Users fetched successfully");
  } catch (err) {
    console.error(err);
    return failure("Failed to fetch users");
  }
});

// Creates a new user
/**
 * Handles the POST request to create a new user.
 *
 * This endpoint is protected and requires authentication. Only users with the "admin" role
 * are authorized to access this resource. If the user is not authenticated or does not have
 * the required role, an unauthorized response is returned.
 *
 * The function receives a JSON payload containing user information, including email, first name,
 * last name, company name, password, and role. The function validates the payload using
 * zod schema, and if the validation fails, a failure response is returned.
 * If the validation succeeds, the function checks if the email already exists in the database.
 * If the email already exists, a conflict response is returned.
 * If the email does not exist, the function creates a new user in the database.
 * The function returns a success response if the user is created successfully.
 * In case of an error during the database operation, a failure response is returned.
 *
 * @param req - The incoming request object, which includes authentication information.
 * @returns A response object containing the newly created user or an error message.
 * */
export const POST = auth(async (req) => {
  if (!req.auth || !req.auth.user) {
    return unauthorized("Authentication required.");
  }

  if (req.auth.user.role !== UserType.ADMIN) {
    return forbidden("Forbidden: Admin access required.");
  }

  let reqBody;
  try {
    reqBody = await req.json();
  } catch (error) {
    console.error(error);
    return badRequest("Invalid JSON payload.");
  }

  const parsed = createUserSchema.safeParse(reqBody);

  if (!parsed.success) {
    console.log("Parsed:", parsed.error.flatten().fieldErrors);

    return badRequest(
      "Validation failed. Please fill in all the required fields",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const { email, firstName, lastName, companyName, password, role } =
    parsed.data;

  try {
    // 1. Check if email already exists
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return conflict("Email already exists.");
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 14);

    // 3. Upsert company
    let companyId: string;
    const [existingCompany] = await db
      .select({ id: companyProfile.id })
      .from(companyProfile)
      .where(
        sql`LOWER(${companyProfile.companyName}) = ${companyName.trim().toLowerCase()}`,
      )
      .limit(1);

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      companyId = uuidv4();
      const newCompany = {
        id: companyId,
        companyName: companyName.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        // Other fields will use defaults or be NULL
      };
      await db.insert(companyProfile).values(newCompany);
    }

    // 4. Create the user
    const userId = uuidv4();
    const newUserPayload = {
      id: userId,
      email: email,
      name: `${firstName} ${lastName}`,
      password: hashedPassword,
      username: email, // Default username to email
      image: "", // Default image
      companyId: companyId,
      role: role,
      isRegistrationComplete: true,
      dateJoined: new Date(),
      lastLogin: new Date(), // Or null if user hasn't logged in
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(user).values(newUserPayload);

    const createdUserResponse = {
      id: userId,
      email: newUserPayload.email,
      name: newUserPayload.name,
      companyId: newUserPayload.companyId,
      role: newUserPayload.role,
    };

    return success(
      { user: createdUserResponse },
      "User created successfully.",
      201,
    );
  } catch (err) {
    console.error("Error creating user:", err);

    return failure(`Failed to create user`, 500);
  }
});
