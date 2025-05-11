import { ApiResponse } from "../_types/api-response";
import { Prediction } from "../_types/prediction";

export async function fetchPredictions(userId?: string): Promise<Prediction[]> {
  const res = await fetch(`/api/predictions?user=${userId}`);

  let body: ApiResponse<{ prediction: Prediction[] }>;
  try {
    body = await res.json();
  } catch {
    throw new Error("Failed to parse prediction response");
  }

  if (!res.ok || body.code !== 200) {
    throw new Error(body.message || "Failed to fetch prediction");
  }

  return body.data.prediction;
}
