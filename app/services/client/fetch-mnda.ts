import { ApiResponse } from "@/app/_types/api-response";
import { MndaResultResponse } from "@/app/_types/mnda";

/**
 * Fetches the MNDA policy data from the specified API endpoint.
 *
 * @param url - The URL of the API endpoint to fetch the MNDA data from.
 * @returns A Promise resolving to the MNDA policy data.
 * @throws An error if the API response is not successful or if JSON parsing fails.
 */
export default async function fetchMnda(
  url: string,
): Promise<MndaResultResponse> {
  // Perform a fetch request to the given URL
  const res = await fetch(url);

  // Declare a variable to store the response body
  let body: ApiResponse<MndaResultResponse>;
  try {
    // Attempt to parse the response body as JSON
    body = await res.json();
  } catch {
    // Throw an error if JSON parsing fails
    throw new Error("Failed to parse mnda response");
  }

  // Check if the response status is not OK or if the API returned an error code
  if (!res.ok || body.code !== 200) {
    // Throw an error with the message from the response or a default message
    throw new Error(body.message || "Failed to fetch mnda");
  }

  // Return the MNDA policy data from the response
  return body.data;
}
