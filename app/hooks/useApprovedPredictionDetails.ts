import { PredictionResultResponse } from "@/app/_types/prediction";
import approvedPredictionDetailsFetcher from "@/app/services/fetch-reviewed-prediction-details";
import useSWR from "swr";
import { API } from "@/lib/routes";

/**
 * Custom hook to fetch and manage the state of reviewed prediction details.
 *
 * @param {string} id - The ID of the prediction to fetch details for.
 * @returns {Object} An object containing:
 *  - `data`: The prediction result response data.
 *  - `isLoading`: A boolean indicating if the data is still being fetched.
 *  - `isError`: A boolean indicating if there was an error fetching the data.
 */
export function useApprovedPredictionDetails(id: string) {
  // Use SWR to fetch prediction details if an ID is provided
  const { data, error, isLoading } = useSWR<PredictionResultResponse>(
    id ? API.predictions.details(id) : null,
    approvedPredictionDetailsFetcher,
  );

  // Return the data, loading state, and error state
  return { data, isLoading, isError: !!error };
}
