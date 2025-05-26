import { db } from "@/app/_db";
import { PredictionStatus, UserType } from "@/app/_db/enum";
import { predictionResult, reviewedPredictionResult } from "@/app/_db/schema";
import {
  failure,
  forbidden,
  notFound,
  success,
  unauthorized,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { eq, and, ne } from "drizzle-orm";

/**
 * Handles POST requests to /api/internal/reviewed-predictions/approve.
 *
 * This endpoint is used by the Expert Dashboard to approve or disapprove
 * reviewed predictions. It expects a JSON payload with the following fields:
 *
 * - `approve`: A boolean indicating whether the reviewed prediction should
 *   be approved or disapproved.
 * - `reviewedPredictionId`: The ID of the reviewed prediction that should
 *   be approved or disapproved.
 *
 * The endpoint returns a JSON response with the following fields:
 *
 * - `updatedVersion`: The updated reviewed prediction version, with the
 *   `isApproved` field set to the value of `approve`.
 *
 * If the request is invalid, the endpoint returns a 404 error. If the
 * request is unauthorized, the endpoint returns a 401 error. If the
 * request is forbidden (i.e., if the user does not have the required
 * role), the endpoint returns a 403 error. If the request is successful,
 * the endpoint returns a 200 status code.
 */
export const POST = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return unauthorized();
  }

  if (
    session.user.role !== UserType.ADMIN &&
    session.user.role !== UserType.EXPERT
  ) {
    return forbidden("Access Denied: Required role missing");
  }

  try {
    const { approve, reviewedPredictionId } = await req.json();

    if (typeof approve !== "boolean") {
      return notFound("Invalid approve value");
    }

    if (!reviewedPredictionId) {
      return notFound("Invalid reviewed prediction ID");
    }

    // Fetch the target review
    const [target] = await db
      .select({
        id: reviewedPredictionResult.id,
        predictionResultId: reviewedPredictionResult.predictionResultId,
      })
      .from(reviewedPredictionResult)
      .where(eq(reviewedPredictionResult.id, reviewedPredictionId))
      .limit(1);

    if (!target) {
      return notFound("Reviewed Prediction version not found", 200);
    }

    // Fetch the original prediction to check its status
    const [originalPrediction] = await db
      .select({ status: predictionResult.predictionStatus })
      .from(predictionResult)
      .where(eq(predictionResult.id, target.predictionResultId))
      .limit(1);

    // Block action if the original prediction status is is_pending
    if (originalPrediction.status === PredictionStatus.IN_PROGRESS) {
      return forbidden(
        "This action is not allowed while the prediction status is pending.",
      );
    }

    if (approve) {
      // Check if another version for this prediction is already approved
      const [alreadyApproved] = await db
        .select()
        .from(reviewedPredictionResult)
        .where(
          and(
            eq(
              reviewedPredictionResult.predictionResultId,
              target.predictionResultId,
            ),
            eq(reviewedPredictionResult.isApproved, true),
            ne(reviewedPredictionResult.id, reviewedPredictionId),
          ),
        )
        .limit(1);

      if (alreadyApproved) {
        return forbidden(
          "Another version for this prediction has already been approved",
        );
      }
    }

    // Update the reviewed prediction's approval status
    const [updatedVersion] = await db
      .update(reviewedPredictionResult)
      .set({ isApproved: approve, updatedAt: new Date() })
      .where(eq(reviewedPredictionResult.id, reviewedPredictionId))
      .returning({
        id: reviewedPredictionResult.id,
        modelVersion: reviewedPredictionResult.modelVersion,
        isApproved: reviewedPredictionResult.isApproved,
        createdAt: reviewedPredictionResult.createdAt,
        updatedAt: reviewedPredictionResult.updatedAt,
      });

    if (!updatedVersion) {
      return notFound("Reviewed Prediction version not found", 200);
    }

    return success(
      { updatedVersion },
      approve
        ? "Version approved successfully"
        : "Version disapproved successfully",
    );
  } catch (error) {
    console.error("Error approving reviewed version:", error);
    return failure("Error approving reviewed version");
  }
});
