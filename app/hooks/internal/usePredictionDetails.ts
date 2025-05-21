import { PredictionResultResponse } from "@/app/_types/prediction";
import fetchPredictionDetails from "@/app/services/internal/fetch-prediction-details";
import useSWR from "swr";

export function usePredictionDetails(predictionId: string) {
  const { data, error, isLoading } = useSWR<PredictionResultResponse>(
    predictionId ? `/api/internal/predictions/${predictionId}` : null,
    fetchPredictionDetails,
  );

  return { data, isLoading, isError: !!error };
}
