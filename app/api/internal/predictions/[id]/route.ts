import { db } from "@/app/_db";
import { UserType } from "@/app/_db/enum";
import { companyProfile, predictionResult } from "@/app/_db/schema";
import {
  failure,
  forbidden,
  notFound,
  success,
  unauthorized,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { fetchS3Object } from "@/lib/s3/s3";
import { stripS3Url } from "@/lib/s3/s3-utils";
import { eq, sql } from "drizzle-orm";

/**
 * Handles the GET request for fetching a prediction by its ID.
 * 
 * This function is protected by authentication and authorization middleware.
 * It ensures that only users with the roles `ADMIN` or `EXPERT` can access the prediction data.
 * 
 * The function retrieves the prediction details from the database, including associated metadata
 * such as company name, submission date, prediction status, and review status. Additionally, it
 * fetches related files from S3 storage if available.
 * 
 * @param req - The incoming HTTP request object.
 * @param context - An object containing route parameters, including the prediction ID.
 * 
 * @returns A response object containing:
 * - `prediction`: The prediction details including ID, company name, submission date, status, and review status.
 * - `chloralkaliInDepth`: The content of the chloralkali in-depth file, if available.
 * - `chloralkaliSummary`: The content of the chloralkali summary file, if available.
 * - `chloralkaliComparison`: The content of the chloralkali comparison file, if available.
 * - `electrodialysisInDepth`: The content of the electrodialysis in-depth file, if available.
 * - `electrodialysisSummary`: The content of the electrodialysis summary file, if available.
 * 
 * @throws UnauthorizedError - If the user is not authenticated.
 * @throws ForbiddenError - If the user does not have the required role.
 * @throws NotFoundError - If the prediction with the given ID is not found.
 * @throws Error - If an unexpected error occurs during the process.
 */
export const GET = auth(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth();
    if (!session) {
      return unauthorized();
    }

    if (
      session.user.role !== UserType.ADMIN &&
      session.user.role !== UserType.EXPERT
    ) {
      return forbidden("Access Denied: Required role missing");
    }

    const { id: predictionId } = await params;
    console.log("Fetching the prediction with ID:", predictionId);

    try {
      const [prediction] = await db
        .select({
          id: predictionResult.id,
          companyName: companyProfile.companyName,
          submissionDate: predictionResult.createdAt,
          predictionStatus: predictionResult.predictionStatus,
          processedBy: predictionResult.modelVersion,
          hasReview:
            sql<boolean>`EXISTS (SELECT 1 FROM reviewed_prediction_result WHERE prediction_result_id = ${predictionResult.id})`.as(
              "hasReview",
            ),
          chloralkaliInDepthPath: predictionResult.chloralkaliInDepthPath,
          chloralkaliSummaryPath: predictionResult.chloralkaliSummaryPath,
          chloralkaliComparisonPath: predictionResult.chloralkaliComparisonPath,
          electrodialysisInDepthPath:
            predictionResult.electrodialysisInDepthPath,
          electrodialysisSummaryPath:
            predictionResult.electrodialysisSummaryPath,
        })
        .from(predictionResult)
        .leftJoin(
          companyProfile,
          eq(predictionResult.companyId, companyProfile.id),
        )
        .where(eq(predictionResult.id, predictionId));

      if (!prediction) {
        return notFound("Prediction not found");
      }

      const reviewStatus = prediction.hasReview
        ? "Reviewed"
        : "Awaiting Expert Review";

      const [
        chloralkaliInDepth,
        chloralkaliSummary,
        chloralkaliComparison,
        electrodialysisInDepth,
        electrodialysisSummary,
      ] = await Promise.all([
        prediction.chloralkaliInDepthPath
          ? fetchS3Object(stripS3Url(prediction.chloralkaliInDepthPath))
          : null,
        prediction.chloralkaliSummaryPath
          ? fetchS3Object(stripS3Url(prediction.chloralkaliSummaryPath))
          : null,
        prediction.chloralkaliComparisonPath
          ? fetchS3Object(stripS3Url(prediction.chloralkaliComparisonPath))
          : null,
        prediction.electrodialysisInDepthPath
          ? fetchS3Object(stripS3Url(prediction.electrodialysisInDepthPath))
          : null,
        prediction.electrodialysisSummaryPath
          ? fetchS3Object(stripS3Url(prediction.electrodialysisSummaryPath))
          : null,
      ]);

      return success(
        {
          prediction: {
            id: prediction.id,
            companyName: prediction.companyName,
            submissionDate: prediction.submissionDate,
            predictionStatus: prediction.predictionStatus,
            processedBy: prediction.processedBy,
            reviewStatus: reviewStatus,
          },
          chloralkaliInDepth,
          chloralkaliSummary,
          chloralkaliComparison,
          electrodialysisInDepth,
          electrodialysisSummary,
        },
        "Prediction fetched successfully",
      );
    } catch (err) {
      console.error("Error fetching prediction:", err);
      return failure("Error fetching prediction");
    }
  },
);
