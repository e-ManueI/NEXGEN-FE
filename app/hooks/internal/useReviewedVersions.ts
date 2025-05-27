import {
  ApproveReviewedVersionPayload,
  ApproveReviewedVersionResponse,
  CreateNewVersionPayload,
  CreateNewVersionResponse,
  ReviewedPredictionVersionsResponse,
  ReviewedVersionContentResponse,
} from "@/app/_types/reviewed-predictions";
import approveVersion from "@/app/services/internal/approve-version";
import createNewVersion from "@/app/services/internal/create-version";
import versionContentFetcher from "@/app/services/internal/fetch-version-content";
import versionsFetcher from "@/app/services/internal/fetch-versions";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { API } from "@/lib/routes";

/**
 * A hook to fetch and manage the versions of a reviewed prediction.
 *
 * @param predictionId - The ID of the prediction to fetch versions for.
 * @returns An object containing:
 *   - `data`: The response data containing the versions of the reviewed prediction.
 *   - `isLoading`: A boolean indicating if the versions are still being fetched.
 *   - `isError`: A boolean indicating if there was an error fetching the versions.
 *   - `mutate`: A function to manually revalidate the data.
 */
export function useReviewedVersions(predictionId: string) {
  const { data, error, isLoading, mutate } =
    useSWR<ReviewedPredictionVersionsResponse>(
      predictionId ? API.internal.reviewedPredictions(predictionId) : null,
      versionsFetcher,
    );

  return { data, isLoading, isError: !!error, mutate };
}

/**
 * A hook to fetch the content of a reviewed prediction version.
 *
 * @param predictionId - The ID of the prediction to fetch the content for.
 * @param reviewedId - The ID of the specific reviewed version to fetch content for.
 * @returns An object containing:
 *   - `data`: The response from the API when the content is fetched successfully.
 *   - `isLoading`: A boolean indicating whether the content is still being fetched.
 *   - `isError`: A boolean indicating if there was an error fetching the content.
 */
export function useReviewedVersionContent(
  predictionId: string,
  reviewedId: string,
) {
  const { data, error, isLoading } = useSWR<ReviewedVersionContentResponse>(
    predictionId && reviewedId
      ? API.internal.reviewedPredictionVersion(predictionId, reviewedId)
      : null,
    versionContentFetcher,
  );

  return { data, isLoading, isError: !!error };
}

/**
 * A hook to create a new version of a reviewed prediction.
 *
 * @param predictionId - The ID of the prediction to create a new version for.
 * @returns An object with the following properties:
 *   - `createNewVersion`: A function to trigger the creation of a new version of the reviewed prediction.
 *   - `data`: The response from the API when the new version is created successfully.
 *   - `error`: An error object if there was an error creating the new version.
 *   - `isCreating`: A boolean indicating whether the new version is currently being created.
 */
export function useCreateNewVersion(predictionId: string) {
  if (!predictionId) {
    throw new Error("predictionId is required");
  }

  const apiUrl = API.internal.reviewedPredictions(predictionId);

  const { trigger, data, error, isMutating } = useSWRMutation<
    CreateNewVersionResponse,
    Error,
    string,
    CreateNewVersionPayload
  >(apiUrl, async (url, { arg: payload }) => {
    if (!payload) {
      throw new Error("Payload is required");
    }

    return createNewVersion(url, payload);
  });

  return {
    createNewVersion: trigger,
    data,
    error,
    isCreating: isMutating,
  };
}

/**
 * A hook to approve a reviewed prediction version.
 *
 * @returns An object with the following properties:
 *   - `approveVersion`: A function to trigger the approval of the reviewed prediction version.
 *   - `data`: The response from the API when the reviewed prediction version is approved successfully.
 *   - `error`: An error object if there was an error approving the reviewed prediction version.
 *   - `isApproving`: A boolean indicating whether the reviewed prediction version is currently being approved.
 */
export function useApproveVersion() {
  const apiUrl = API.internal.reviewedPredictionsApprove;

  const { trigger, data, error, isMutating } = useSWRMutation<
    ApproveReviewedVersionResponse,
    Error,
    string,
    ApproveReviewedVersionPayload
  >(apiUrl, async (url, { arg: payload }) => {
    if (!payload) throw new Error("Payload required");

    return approveVersion(url, payload);
  });

  return {
    approveVersion: trigger,
    data,
    error,
    isApproving: isMutating,
  };
}
