import { db } from "@/app/_db";
import { UserType } from "@/app/_db/enum";
import { reviewedPredictionResult } from "@/app/_db/schema";
import {
  badRequest,
  failure,
  forbidden,
  notFound,
  success,
  unauthorized,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { uploadS3Object } from "@/lib/s3/s3";
import { eq, and, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// TODO: ADD ZOD VALIDATIONS TO POST PAYLOADS
/**
 * Handles GET requests for fetching the versions of a prediction.
 *
 * @param req - The incoming HTTP request object.
 * @param params - An object containing route parameters, including the prediction ID.
 *
 * @returns A response object containing the versions of the prediction.
 *
 * @throws UnauthorizedError - If the user is not authenticated.
 * @throws ForbiddenError - If the user does not have the required role.
 * @throws NotFoundError - If the prediction ID is invalid or no versions are found.
 * @throws InternalServerError - If an error occurs while fetching the versions.
 */
export const GET = auth(
  async (
    req: Request,
    { params }: { params: Promise<{ predictionId: string }> },
  ) => {
    const session = await auth();
    if (!session) {
      return unauthorized();
    }

    // Check if the user has the required role
    if (
      session.user.role !== UserType.ADMIN &&
      session.user.role !== UserType.EXPERT
    ) {
      return forbidden("Access Denied: Required role missing");
    }

    const { predictionId } = await params;
    console.log(
      "Fetching the versions for the predictions with ID:",
      predictionId,
    );
    // Check if the prediction ID is valid
    if (!predictionId) return notFound("Invalid prediction ID");

    try {
      // Fetch the versions from the database
      const versions = await db
        .select({
          id: reviewedPredictionResult.id,
          modelVersion: reviewedPredictionResult.modelVersion,
          isApproved: reviewedPredictionResult.isApproved,
          createdAt: reviewedPredictionResult.createdAt,
          updatedAt: reviewedPredictionResult.updatedAt,
        })
        .from(reviewedPredictionResult)
        .where(eq(reviewedPredictionResult.predictionResultId, predictionId))
        .orderBy(desc(reviewedPredictionResult.createdAt));

      // Check if there are no versions
      if (!versions.length) {
        return notFound("No versions found");
      }

      // Return the versions
      return success({ versions }, "Versions fetched successfully");
    } catch (error) {
      console.error("Error fetching prediction:", error);
      return failure("Error fetching prediction");
    }
  },
);

/**
 * Creates a new reviewed version for a prediction.
 *
 * @param req - The incoming HTTP request object.
 * @param params - An object containing route parameters, including the prediction ID.
 *
 * @returns A response object containing the newly created version details.
 *
 * @throws UnauthorizedError - If the user is not authenticated.
 * @throws ForbiddenError - If the user does not have the required role.
 * @throws NotFoundError - If the prediction ID is invalid.
 * @throws InternalServerError - If an error occurs while creating the new version.
 */
export const POST = auth(
  async (req, { params }: { params: Promise<{ predictionId: string }> }) => {
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

    const { predictionId } = await params;
    console.log(
      "Creating a new version for the predictions with ID:",
      predictionId,
    );
    if (!predictionId) return notFound("Invalid prediction ID");

    try {
      // Parse the request body
      const { content, modelVersion, approve } = await req.json();
      if (typeof approve !== "boolean") {
        return badRequest("Invalid approve value");
      }

      // ─── 1) If we're approving this new version, ensure no other is approved ───
      if (approve) {
        const [alreadyApproved] = await db
          .select()
          .from(reviewedPredictionResult)
          .where(
            and(
              eq(reviewedPredictionResult.predictionResultId, predictionId),
              eq(reviewedPredictionResult.isApproved, true),
            ),
          )
          .limit(1);

        if (alreadyApproved) {
          return forbidden(
            "Another version for this prediction has already been approved",
          );
        }
      }

      // ─── 2) Pull out all sub-blobs (defaults to empty string) ───
      const {
        chloralkaliInDepth = "",
        chloralkaliSummary = "",
        chloralkaliComparison = "",
        electrodialysisInDepth = "",
        electrodialysisSummary = "",
      } = content;

      // Generate a new UUID for the reviewed version
      const reviewedId = uuidv4();

      // Define the path for the new version in S3
      const basePath = process.env.AWS_S3_BASE_PATH;
      if (!basePath) {
        throw new Error("AWS_S3_BASE_PATH is not defined");
      }
      const fullPath = `${basePath}/${reviewedId}`;

      // Store the new version in S3
      const s3Paths = {
        chloralkaliInDepth: `${fullPath}/chloralkali-indepth-review.json`,
        chloralkaliSummary: `${fullPath}/chloralkali-summary-review.json`,
        chloralkaliComparison: `${fullPath}/chloralkali-comparison-review.json`,
        electrodialysisInDepth: `${fullPath}/electrodialysis-indepth-review.json`,
        electrodialysisSummary: `${fullPath}/electrodialysis-summary-review.json`,
      };

      await Promise.all([
        uploadS3Object(s3Paths.chloralkaliInDepth, chloralkaliInDepth),
        uploadS3Object(s3Paths.chloralkaliSummary, chloralkaliSummary),
        uploadS3Object(s3Paths.chloralkaliComparison, chloralkaliComparison),
        uploadS3Object(s3Paths.electrodialysisInDepth, electrodialysisInDepth),
        uploadS3Object(s3Paths.electrodialysisSummary, electrodialysisSummary),
      ]);

      // Insert the new version into the database
      const [newVersion] = await db
        .insert(reviewedPredictionResult)
        .values({
          id: reviewedId,
          modelVersion,
          predictionResultId: predictionId,
          chloralkaliInDepthPath: s3Paths.chloralkaliInDepth,
          chloralkaliSummaryPath: s3Paths.chloralkaliSummary,
          chloralkaliComparisonPath: s3Paths.chloralkaliComparison,
          electrodialysisInDepthPath: s3Paths.electrodialysisInDepth,
          electrodialysisSummaryPath: s3Paths.electrodialysisSummary,
          isApproved: approve,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({
          id: reviewedPredictionResult.id,
          modelVersion: reviewedPredictionResult.modelVersion,
          isApproved: reviewedPredictionResult.isApproved,
          createdAt: reviewedPredictionResult.createdAt,
          updatedAt: reviewedPredictionResult.updatedAt,
        });

      // Return the newly created version
      return success(
        newVersion,
        approve
          ? "Version saved and approved successfully"
          : "Version saved successfully",
      );
    } catch (error) {
      console.error("Error saving/approving reviewed version:", error);
      return failure("Error saving/approving reviewed version");
    }
  },
);
