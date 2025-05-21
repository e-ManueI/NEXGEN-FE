import { db } from "@/app/_db";
import { UserType } from "@/app/_db/enum";
import { reviewedPredictionResult } from "@/app/_db/schema";
import {
  failure,
  forbidden,
  notFound,
  success,
  unauthorized,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { safeFetch } from "@/lib/s3/s3";
import { eq } from "drizzle-orm";

/**
 * Handles GET requests for fetching a specific prediction version by its ID.
 *
 * This function is protected by authentication and checks if the user has the
 * appropriate role (`ADMIN` or `EXPERT`). It retrieves the version details
 * from the database, including paths to relevant files stored in S3, and fetches
 * their content.
 *
 * @param req - The incoming HTTP request object.
 * @param params - An object containing route parameters, including the prediction and version IDs.
 * @returns A response object containing:
 * - `isApproved`: Approval status of the version.
 * - `content`: The content of each file if available.
 *
 * @throws UnauthorizedError - If the user is not authenticated.
 * @throws ForbiddenError - If the user does not have the required role.
 * @throws NotFoundError - If the prediction or version does not exist.
 */
export const GET = auth(
  async (
    req,
    {
      params,
    }: { params: Promise<{ predictionId: string; versionId: string }> },
  ) => {
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

    const { predictionId, versionId } = await params;
    console.log(
      "Fetching the prediction with ID:",
      predictionId,
      "versionId:",
      versionId,
    );
    if (!predictionId || !versionId)
      return notFound("Invalid prediction or version ID");

    try {
      // Fetch the specified version from the database
      const [version] = await db
        .select({
          isApproved: reviewedPredictionResult.isApproved,
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
        .where(eq(reviewedPredictionResult.id, versionId))
        .limit(1);

      if (!version) {
        return notFound("Versions not found", 200);
      }

      // Fetch content from S3 for each path associated with the version
      const [
        chloralkaliInDepth,
        chloralkaliSummary,
        chloralkaliComparison,
        electrodialysisInDepth,
        electrodialysisSummary,
      ] = await Promise.all([
        safeFetch(version.chloralkaliInDepthPath),
        safeFetch(version.chloralkaliSummaryPath),
        safeFetch(version.chloralkaliComparisonPath),
        safeFetch(version.electrodialysisInDepthPath),
        safeFetch(version.electrodialysisSummaryPath),
      ]);

      return success(
        {
          isApproved: version.isApproved,
          content: {
            chloralkaliInDepth,
            chloralkaliSummary,
            chloralkaliComparison,
            electrodialysisInDepth,
            electrodialysisSummary,
          },
        },
        "Versions fetched successfully",
      );
    } catch (error) {
      console.error("Error fetching prediction:", error);
      return failure("Error fetching prediction");
    }
  },
);
