import { db } from "@/app/_db";
import {
  companyProfile,
  predictionResult,
  reviewedPredictionResult,
  UserType,
} from "@/app/_db/schema";
import { failure, notFound, success, unauthorized } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { fetchS3Object } from "@/lib/s3/s3";
import { stripS3Url } from "@/lib/s3/s3-utils";
import { eq, and } from "drizzle-orm";

/**
 * Fetches details of an approved review for a prediction ID
 *
 * Handles GET requests to `/api/predictions/[id]`.
 * Authenticates the user using the `auth` middleware and checks
 * if the user is a client.
 *
 * If the user is authenticated and authorized, it fetches the
 * approved review for the given prediction ID and returns it.
 * @param req The incoming request.
 * @param params The request parameters, which contains the prediction ID.
 */
export const GET = auth(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const session = await auth();
    if (!session) return unauthorized();

    const { id: predictionId } = await params;
    const { role: userRole, companyId: userCompanyId } = session.user;
    console.log(
      `Fetching approved review for prediction ID ${predictionId}` +
        (userRole === UserType.CLIENT
          ? ` (scoped to company ${userCompanyId})`
          : ""),
    );
    try {
      // 1) Build dynamic WHERE clauses based on role
      const conditions = [
        eq(reviewedPredictionResult.predictionResultId, predictionId),
        eq(reviewedPredictionResult.isApproved, true),
      ];

      // If the caller is a CLIENT, also enforce company ownership
      if (userRole === UserType.CLIENT) {
        conditions.push(eq(predictionResult.companyId, userCompanyId));
      }

      // 1) Select the joined record
      const [record] = await db
        .select({
          predictionId: predictionResult.id,
          companyName: companyProfile.companyName,
          submissionDate: predictionResult.createdAt,
          predictionStatus: predictionResult.predictionStatus,
          processedBy: reviewedPredictionResult.modelVersion,
          chloralkaliInDepthPath:
            reviewedPredictionResult.chloralkaliInDepthPath,
          chloralkaliSummaryPath:
            reviewedPredictionResult.chloralkaliSummaryPath,
          chloralkaliComparisonPath:
            reviewedPredictionResult.chloralkaliComparisonPath,
          electrodialysisInDepthPath:
            reviewedPredictionResult.electrodialysisInDepthPath,
          electrodialysisSummaryPath:
            reviewedPredictionResult.electrodialysisSummaryPath,
        })
        .from(reviewedPredictionResult)
        // join back to the original prediction_result to get its dates & status
        .innerJoin(
          predictionResult,
          eq(reviewedPredictionResult.predictionResultId, predictionResult.id),
        )
        // join company_profile for the companyName
        .leftJoin(
          companyProfile,
          eq(predictionResult.companyId, companyProfile.id),
        )
        // only approved reviews for this prediction
        .where(and(...conditions));

      if (!record) {
        return notFound("No approved reviewed result found for this ID");
      }

      // 2) Stream all the S3 files in parallel (or null if missing)
      const [
        chloralkaliInDepth,
        chloralkaliSummary,
        chloralkaliComparison,
        electrodialysisInDepth,
        electrodialysisSummary,
      ] = await Promise.all([
        record.chloralkaliInDepthPath
          ? fetchS3Object(stripS3Url(record.chloralkaliInDepthPath))
          : null,
        record.chloralkaliSummaryPath
          ? fetchS3Object(stripS3Url(record.chloralkaliSummaryPath))
          : null,
        record.chloralkaliComparisonPath
          ? fetchS3Object(stripS3Url(record.chloralkaliComparisonPath))
          : null,
        record.electrodialysisInDepthPath
          ? fetchS3Object(stripS3Url(record.electrodialysisInDepthPath))
          : null,
        record.electrodialysisSummaryPath
          ? fetchS3Object(stripS3Url(record.electrodialysisSummaryPath))
          : null,
      ]);

      // 3) Return exactly the shape the client needs
      return success(
        {
          prediction: {
            id: record.predictionId,
            companyName: record.companyName,
            submissionDate: record.submissionDate,
            predictionStatus: record.predictionStatus,
            processedBy: record.processedBy,
            reviewStatus: "Approved",
          },
          chloralkaliInDepth,
          chloralkaliSummary,
          chloralkaliComparison,
          electrodialysisInDepth,
          electrodialysisSummary,
        },
        "Prediction Result fetched successfully",
      );
    } catch (err) {
      console.error("Error fetching Prediction results:", err);
      return failure("Error fetching Predictions results");
    }
  },
);
