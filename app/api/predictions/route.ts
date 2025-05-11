import { db } from "@/app/_db";
import {
  companyProfile,
  predictionResult,
  reviewedPredictionResult,
  user,
  UserType,
} from "@/app/_db/schema";
import { failure, success, unauthorized } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { eq, desc, and, SQL, sql } from "drizzle-orm";

export const GET = auth(async (req) => {
  if (!req.auth || !req.auth.user) {
    return unauthorized();
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
        isApproved: reviewedPredictionResult.isApproved,
      })
      .from(predictionResult)
      .leftJoin(
        reviewedPredictionResult,
        eq(predictionResult.id, reviewedPredictionResult.predictionResultId),
      )
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
