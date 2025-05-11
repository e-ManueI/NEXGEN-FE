import { db } from "@/app/_db";
import {
  companyProfile,
  predictionResult,
  reviewedPredictionResult,
} from "@/app/_db/schema";
import { failure, notFound, success, unauthorized } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
/**
 * Handles the GET request to fetch a prediction by ID.
 *
 * @param req - The incoming request object.
 * @param context - The route parameters, containing the prediction ID to fetch.
 * @returns A response object containing the prediction details or an error message.
 */
export async function GET(
  req: Request,
  context: { params: { predictionId: string } },
): Promise<Response> {
  const session = await auth();
  if (!session) {
    return unauthorized();
  }

  const user = session.user;
  const { predictionId } = await context.params;

  try {
    // Base query to fetch prediction details with joins
    // We join the prediction results with the reviewed prediction results and the company profile
    // to fetch the prediction details and the company name
    const predictions = (await db
      .select({
        predictionId: predictionResult.id,
        companyName: companyProfile.companyName,
        modelVersion: predictionResult.modelVersion,
        status: predictionResult.predictionStatus,
        approvedAt: reviewedPredictionResult.updatedAt,
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
      )
      // Filter by the prediction ID and company ID if the user is not an admin or expert
      // Otherwise, we fetch all predictions
      .where(
        user.role === "admin" || user.role === "expert"
          ? eq(predictionResult.id, predictionId)
          : and(
              eq(predictionResult.id, predictionId),
              eq(predictionResult.companyId, user.companyId),
            ),
      )) as Array<{
      predictionId: string;
      companyName: string;
      modelVersion: string;
      status: string;
      approvedAt: Date | null;
      isApproved: boolean | null;
    }>;

    // Get the first prediction (since we're querying by ID)
    const prediction = predictions[0];
    // Check if prediction exists
    if (!prediction) {
      return notFound("Submission not found", 404);
    }

    // Return the prediction as JSON
    return success({ prediction }, "Submission fetched successfully");
  } catch (err) {
    console.error(err);
    return failure("Failed to fetch prediction");
  }
}
