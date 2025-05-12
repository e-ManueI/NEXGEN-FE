import { ApiResponse } from "../_types/api-response";
import { Prediction } from "../_types/prediction";

/**
 * Fetches a list of predictions from the API.
 *
 * The URL provided should include the query parameter `?user=…`
 * to fetch predictions for a specific user.
 *
 * @param url - The URL to fetch, including the query parameter `?user=…`
 * @returns A list of Predictions.
 * @throws An error if the API responds with a non-200 status or if the response cannot be parsed as JSON.
 */
export async function fetchPredictions(url: string): Promise<Prediction[]> {
  // The URL you pass in will already include the query param `?user=…`
  const res = await fetch(url);

  let body: ApiResponse<{ prediction: Prediction[] }>;
  try {
    body = await res.json();
  } catch {
    throw new Error("Failed to parse prediction response");
  }

  if (!res.ok || body.code !== 200) {
    throw new Error(body.message || "Failed to fetch predictions");
  }

  return body.data.prediction;
}
