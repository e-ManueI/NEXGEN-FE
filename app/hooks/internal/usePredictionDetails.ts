import { PredictionResultResponse } from "@/app/_types/prediction";
import fetchPredictionDetails from "@/app/services/internal/fetch-prediction-details";
import useSWR from "swr";

export function usePredictionDetails(id: string) {
  const { data, error, isLoading } = useSWR<PredictionResultResponse>(
    id ? `/api/internal/predictions/${id}` : null,
    fetchPredictionDetails,
  );

  return { data, isLoading, isError: !!error };
}
