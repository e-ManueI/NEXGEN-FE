import useSWR from "swr";
import { Prediction } from "../_types/prediction";
import { fetchPredictions } from "../services/predictions";

export function usePredictions(userId?: string) {
  const key =
    userId !== undefined
      ? `/api/predictions?user=${userId}`
      : `/api/predictions`;

  const { data, error, isValidating, mutate } = useSWR<Prediction[]>(
    key,
    fetchPredictions,
  );

  return {
    predictions: data ?? [],
    loading: isValidating,
    error,
    refresh: () => mutate(),
  };
}
