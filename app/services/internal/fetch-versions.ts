import { ApiResponse } from "@/app/_types/api-response";
import { ReviewedPredictionVersionsResponse } from "@/app/_types/reviewed-predictions";

export default async function versionsFetcher(
  url: string,
): Promise<ReviewedPredictionVersionsResponse> {
  const res = await fetch(url);

  let body: ApiResponse<ReviewedPredictionVersionsResponse>;
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
