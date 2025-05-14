import { ApiResponse } from "../../_types/api-response";
import { UserAnalyticsResponse } from "../../_types/user-info";

/**
 * Fetches user analytics data from the API.
 *
 * @returns A Promise resolving to the user analytics response.
 * @throws An error if the API response is not successful or the JSON parsing fails.
 */
export default async function fetchUserAnalytics(
  url: string,
): Promise<UserAnalyticsResponse> {
  // Fetch the user analytics data from the specified endpoint
  const res = await fetch(url);

  let body: ApiResponse<UserAnalyticsResponse>;
  try {
    // Attempt to parse the response body as JSON
    body = await res.json();
  } catch {
    // Throw an error if JSON parsing fails
    throw new Error("Failed to parse analytics response");
  }

  // Check if the response status is not OK or if the API returned an error code
  if (!res.ok || body.code !== 200) {
    // Throw an error with the message from the response or a default message
    throw new Error(body.message || "Failed to fetch user analytics");
  }

  // Return the analytics data from the response
  return body.data;
}
