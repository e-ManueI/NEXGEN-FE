import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  AnalysisResponse,
  GenerateAnalysisPayload,
  Prediction,
} from "../_types/prediction";
import {
  fetchPredictions,
  generateAnalysisFetcher,
} from "../services/predictions";
import { UserType } from "../_db/enum";

interface UseGenerateAnalysisOptions {
  role: UserType;
}

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

export function useGenerateAnalysis({ role }: UseGenerateAnalysisOptions) {
  const { refresh: refreshPredictions } = usePredictions();
  const apiRoute = `/api/predictions/generate-predictions?role=${role}`;

  const { trigger, isMutating, error } = useSWRMutation<
    AnalysisResponse,
    Error,
    string,
    GenerateAnalysisPayload
  >(apiRoute, generateAnalysisFetcher);

  const generateAnalysis = async (payload: GenerateAnalysisPayload) => {
    try {
      const result = await trigger(payload);
      await refreshPredictions();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return { generateAnalysis, isGenerating: isMutating, generateError: error };
}
