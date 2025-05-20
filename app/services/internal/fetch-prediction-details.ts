import { ApiResponse } from "@/app/_types/api-response";
import { PredictionResultResponse } from "@/app/_types/prediction";

export default async function fetchPredictionDetails(
  url: string,
): Promise<PredictionResultResponse> {
  const res = await fetch(url);

  let body: ApiResponse<PredictionResultResponse>;
  try {
    body = await res.json();
  } catch {
    throw new Error("Failed to parse prediction details response");
  }

  if (!res.ok || body.code !== 200) {
    throw new Error(body.message || "Failed to fetch prediction details");
  }

  return body.data;
}
