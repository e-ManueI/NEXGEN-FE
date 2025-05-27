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
import { API } from "@/lib/routes";

interface UseGenerateAnalysisOptions {
  role: UserType;
}

/**
 * Fetches a list of predictions from the API.
 *
 * If the user ID is provided, fetches the predictions for the given user.
 * Otherwise, fetches all predictions.
 *
 * @param {string | undefined} userId - The ID of the user to fetch predictions
 *   for. If undefined, fetches all predictions.
 * @returns An object with the following properties:
 *   - `predictions`: An array of Prediction objects.
 *   - `loading`: A boolean indicating whether the data is currently being
 *     fetched.
 *   - `error`: An error object if there was an issue fetching the data.
 *   - `refresh`: A function to manually refresh/re-fetch the predictions.
 */
export function usePredictions(userId?: string) {
  const key =
    userId !== undefined
      ? API.predictions.byUser(userId)
      : API.predictions.root;

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

/**
 * Custom hook to generate analysis based on the user's role.
 *
 * @param {UseGenerateAnalysisOptions} options - Options containing the user role.
 * @returns An object with the following properties:
 *   - `generateAnalysis`: A function to trigger the analysis generation.
 *   - `isGenerating`: A boolean indicating whether the analysis is currently being generated.
 *   - `generateError`: An error object if the analysis could not be generated.
 */
export function useGenerateAnalysis({ role }: UseGenerateAnalysisOptions) {
  const { refresh: refreshPredictions } = usePredictions();
  const apiRoute = API.predictions.generate(role);

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
