import { db } from "@/app/_db";
import { UserType } from "@/app/_db/enum";
import { policy, policyType } from "@/app/_db/schema";
import {
  badRequest,
  failure,
  forbidden,
  success,
  unauthorized,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { eq, desc, lte, and } from "drizzle-orm";
import { userPolicy } from "@/app/_db/schema";

/**
 * Handles GET requests for retrieving the latest effective MNDA policy for authenticated clients.
 *
 * @remarks
 * - Only users with the `CLIENT` role are authorized to access this endpoint.
 * - Returns the most recent MNDA policy whose effective date is less than or equal to today.
 * - Responds with appropriate error messages for unauthorized access or failures.
 *
 * @param req - The authenticated request object containing user information.
 * @returns A response containing the latest MNDA policy data on success, or an error message on failure.
 */
export const GET = auth(async (req) => {
  if (!req.auth) {
    return unauthorized();
  }

  // only clients may see the policy
  if (req.auth.user.role !== UserType.CLIENT) {
    return forbidden("Access denied: Required role missing");
  }

  const authUser = req.auth?.user;
  const authUserId = authUser?.id;

  console.log(authUserId);

  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    const [mnda] = await db
      .select({
        id: policy.id,
        name: policy.name,
        description: policy.description,
        content: policy.content,
        version: policy.version,
        effectiveDate: policy.effectiveDate,
        updatedAt: policy.updatedAt,
      })
      .from(policy)
      .innerJoin(policyType, eq(policy.policyTypeId, policyType.id))
      .where(
        and(eq(policyType.name, "mnda"), lte(policy.effectiveDate, todayStr)),
      )
      .orderBy(desc(policy.effectiveDate))
      .limit(1);

    return success(mnda);
  } catch (error) {
    console.error(error);
    return failure("Failed to fetch policy");
  }
});

/**
 * Handles the POST request to sign a policy.
 *
 * @param req - The HTTP request object.
 * @returns A response object containing:
 * - A status code indicating the success or failure of the request.
 * - A message describing the result of the request.
 */
export async function POST(req: Request) {
  // Authenticate the user
  const session = await auth();
  if (!session) {
    return unauthorized();
  }

  // Check if the user has the CLIENT role
  if (session.user.role !== UserType.CLIENT) {
    return forbidden();
  }

  // ─── Parse and validate the request body ────────────────────────────
  let body: { policyId?: string };
  try {
    body = await req.json();
    console.log("body", body);
  } catch {
    return badRequest("Invalid JSON");
  }
  const { policyId } = body;

  // Validate if policyId is present
  if (!policyId) {
    return badRequest("Missing policyId");
  }

  // Insert a new user-policy record or update the existing record if the user has already signed the policy
  // TODO: Add database constraints for this on confirmation from the P.Owner
  try {
    await db.transaction(async (tx) => {
      // 1. Ensure the policy exists
      const [pol] = await tx
        .select({ id: policy.id })
        .from(policy)
        .where(eq(policy.id, policyId))
        .limit(1);
      if (!pol) throw new Error("Invalid policyId");

      // 2. Check for an existing acceptance
      const existing = await tx
        .select({ userId: userPolicy.userId })
        .from(userPolicy)
        .where(
          and(
            eq(userPolicy.userId, session.user.id),
            eq(userPolicy.policyId, policyId),
          ),
        )
        .limit(1);

      if (existing.length) {
        // Update timestamp if the policy was previously accepted
        await tx
          .update(userPolicy)
          .set({
            isAccepted: true,
            agreedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(userPolicy.userId, session.user.id),
              eq(userPolicy.policyId, policyId),
            ),
          );
      } else {
        // Insert a new record if no previous acceptance exists
        await tx.insert(userPolicy).values({
          userId: session.user.id,
          policyId,
          isAccepted: true,
          agreedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    return success(true, "User signed with the policy successfully");
  } catch (error) {
    console.error("Error signing the user with the policy:", error);
    return failure(
      "Failed to accept the policy. Please try again.",
      500,
      false,
    );
  }
}
