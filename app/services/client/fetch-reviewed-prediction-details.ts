import { ApiResponse } from "@/app/_types/api-response";
import { PredictionResultResponse } from "@/app/_types/prediction";

/**
 * Fetches a ClientPredictionResultResponse from the given URL.
 * @param url - the URL of the API endpoint to fetch the prediction details from.
 * @returns a Promise resolving to a PredictionResultResponse.
 * @throws an error if the API responds with a non-200 status or if the response cannot be parsed as JSON.
 */
export default async function reviewedPredictionDetailsFetcher(
  url: string,
): Promise<PredictionResultResponse> {
  const res = await fetch(url);

  // try to parse the response body as JSON
  let body: ApiResponse<PredictionResultResponse>;
  try {
    body = await res.json();
  } catch {
    throw new Error("Failed to parse prediction details response");
  }

  console.log("API client/predictions/id returned:", body.data);

  // check if the response status is not OK or if the API returned an error code
  if (!res.ok || body.code !== 200) {
    throw new Error(body.message || "Failed to fetch prediction details");
  }

  // return the data payload from the response
  return body.data;
}
