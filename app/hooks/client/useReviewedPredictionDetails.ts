import { PredictionResultResponse } from "@/app/_types/prediction";
import reviewedPredictionDetailsFetcher from "@/app/services/client/fetch-reviewed-prediction-details";
import useSWR from "swr";

/**
 * Custom hook to fetch and manage the state of reviewed prediction details.
 *
 * @param {string} id - The ID of the prediction to fetch details for.
 * @returns {Object} An object containing:
 *  - `data`: The prediction result response data.
 *  - `isLoading`: A boolean indicating if the data is still being fetched.
 *  - `isError`: A boolean indicating if there was an error fetching the data.
 */
export function useReviewedPredictionDetails(id: string) {
  // Use SWR to fetch prediction details if an ID is provided
  const { data, error, isLoading } = useSWR<PredictionResultResponse>(
    id ? `/api/client/predictions/${id}` : null,
    reviewedPredictionDetailsFetcher,
  );

  // Return the data, loading state, and error state
  return { data, isLoading, isError: !!error };
}
