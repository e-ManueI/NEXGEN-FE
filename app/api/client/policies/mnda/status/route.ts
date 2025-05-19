import { db } from "@/app/_db";
import { policy, policyType, userPolicy, UserType } from "@/app/_db/schema";
import { failure, forbidden, success, unauthorized } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

/**
 * Handles GET requests to check if the authenticated client has accepted the MNDA policy.
 *
 * @returns A response indicating whether the MNDA policy has been accepted by the user.
 */
export async function GET() {
  // Authenticate the user session
  const session = await auth();
  if (!session || !session.user) {
    return unauthorized();
  }

  // Only clients are allowed to access this endpoint
  if (session.user.role !== UserType.CLIENT) {
    return forbidden();
  }

  const userId = session.user.id;
  const type = "mnda";

  // 1. Pull the policy_type row (if any)
  const [policyTypeRow] = await db
    .select({ id: policyType.id })
    .from(policyType)
    .where(eq(policyType.name, type))
    .limit(1);

  console.log("policyTypeRow", policyTypeRow);
  // 2. Guard against “not found”
  if (!policyTypeRow) {
    console.error(`No policy_type named "${type}"`);
    return failure(`Policy type "${type}" not found`);
  }

  try {
    // Check if the user has accepted the MNDA policy
    const agreements = await db
      .select()
      .from(userPolicy)
      .innerJoin(policy, eq(policy.id, userPolicy.policyId))
      .innerJoin(policyType, eq(policyType.id, policy.policyTypeId))
      .where(
        and(
          eq(userPolicy.userId, userId),
          eq(policyType.id, policyTypeRow.id),
          eq(userPolicy.isAccepted, true),
        ),
      )
      .limit(1);

    // Return success if the MNDA policy has been accepted
    return success({ hasAgreed: agreements.length > 0 }, "Checked MNDA status");
  } catch (err) {
    console.error("Error checking MNDA status:", err);
    return failure("Failed to check MNDA status");
  }
}
