import { db } from "@/app/_db";
import {
  companyProfile,
  predictionResult,
  reviewedPredictionResult,
  user,
  UserType,
} from "@/app/_db/schema";
import { failure, forbidden, success, unauthorized } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { eq, desc, and, SQL, sql } from "drizzle-orm";

/**
 * Handles the GET request to fetch predictions based on the authenticated user's role and filters.
 *
 * @param req - The incoming request object containing authentication and query parameters.
 * @returns A response object containing the fetched predictions or an error message.
 *
 * ### Behavior:
 * - **Admin/Expert Users**:
 *   - Can fetch predictions for a specific company using the `companyId` query parameter.
 *   - Can fetch predictions for a specific user using the `user` query parameter.
 *   - If no valid filters are provided, all results are returned.
 * - **Client Users**:
 *   - Can only fetch predictions associated with their own company.
 *   - If the user is not associated with a company, a 403 error is returned.
 * - **Unauthorized Users**:
 *   - Access is denied with a 403 error if the user's role is not recognized or permitted.
 *
 * ### Query Parameters:
 * - `companyId` (optional): The UUID of the company to filter predictions by.
 * - `user` (optional): The UUID of the user whose company's predictions should be fetched.
 *
 * ### Response:
 * - On success: Returns a list of predictions with details such as prediction ID, company name, model version, status, approval status, and timestamps.
 * - On failure: Returns an error message with an appropriate HTTP status code.
 *
 * ### Errors:
 * - 403: Unauthorized access or client user not associated with a company.
 * - 500: Internal server error during query execution.
 *
 * ### Logs:
 * - Logs the role of the user fetching predictions.
 * - Logs errors and specific conditions when filters are applied or fail.
 */
export const GET = auth(async (req) => {
  if (!req.auth || !req.auth.user) {
    return forbidden();
  }

  const loggedInUserRole = req.auth.user.role;
  const loggedInUserCompanyId = req.auth.user.companyId;
  const filterByCompanyIdParam = req.nextUrl.searchParams.get("companyId");
  const filterByUserForCompanyIdParam = req.nextUrl.searchParams.get("user");

  try {
    const baseQuery = db
      .select({
        predictionId: predictionResult.id,
        companyName: companyProfile.companyName,
        modelVersion: predictionResult.modelVersion,
        status: predictionResult.predictionStatus,
        predictedAt: predictionResult.updatedAt,
        // So if there is at least one approved review, you’ll get the newest approved.
        // If there are no approved reviews at all, you’ll get the newest un-approved.
        // isApproved: sql`(
        //   SELECT r.is_approved
        //   FROM ${reviewedPredictionResult} AS r
        //   WHERE r.prediction_result_id = ${predictionResult.id}
        //   ORDER BY
        //     (r.is_approved IS TRUE) DESC,  -- put all approved rows first
        //     r.created_at DESC               -- then within each group, newest first
        //   LIMIT 1
        // )`,

        // Sometimes we don’t care when it was approved, only whether any review has ever been approved.
        // In this case, we can turn your subquery into a boolean aggregation:
        isApproved: sql`(
          SELECT BOOL_OR(r.is_approved)
          FROM ${reviewedPredictionResult} AS r
          WHERE r.prediction_result_id = ${predictionResult.id}
        )`,
      })
      .from(predictionResult)
      .leftJoin(
        companyProfile,
        eq(predictionResult.companyId, companyProfile.id),
      );

    const conditions: SQL[] = [];

    if (
      loggedInUserRole === UserType.ADMIN ||
      loggedInUserRole === UserType.EXPERT
    ) {
      console.log(`${loggedInUserRole} fetching predictions`);
      let companyIdToFilterBy: string | undefined = undefined;

      if (filterByCompanyIdParam) {
        // No parseInt, companyId is a UUID string
        companyIdToFilterBy = filterByCompanyIdParam;
      } else if (filterByUserForCompanyIdParam) {
        // filterByUserForCompanyIdParam is the user's UUID (string)
        const targetUser = await db
          .select({ companyId: user.companyId }) // companyId from user table is also a UUID string
          .from(user)
          .where(eq(user.id, filterByUserForCompanyIdParam)) // user.id is a UUID string
          .limit(1);

        if (targetUser.length > 0 && targetUser[0].companyId) {
          companyIdToFilterBy = targetUser[0].companyId;
        } else {
          console.log(
            `${loggedInUserRole} filter: User ${filterByUserForCompanyIdParam} not found or has no companyId. Applying filter to return no results.`,
          );
          conditions.push(sql`1 = 0`);
        }
      }

      if (companyIdToFilterBy) {
        // predictionResult.companyId is a UUID string
        conditions.push(eq(predictionResult.companyId, companyIdToFilterBy));
      }
    } else if (loggedInUserRole === UserType.CLIENT) {
      console.log("Client fetching their company's predictions");
      if (!loggedInUserCompanyId) {
        console.error("Client user does not have an associated companyId.");
        return failure("Client user is not associated with a company.", 403);
      }

      conditions.push(eq(predictionResult.companyId, loggedInUserCompanyId));
    } else {
      return unauthorized(
        "Access denied: User role not recognized or not permitted.",
        403,
      );
    }

    let finalQuery;
    if (conditions.length > 0) {
      finalQuery = baseQuery
        .where(and(...conditions))
        .orderBy(desc(predictionResult.createdAt));
    } else {
      finalQuery = baseQuery.orderBy(desc(predictionResult.createdAt));
    }

    const prediction = await finalQuery;

    return success({ prediction }, "Predictions fetched successfully");
  } catch (err) {
    console.error("Error details:", err);
    return failure("Failed to fetch predictions", 500);
  }
});
