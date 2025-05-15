import { ApiResponse } from "@/app/_types/api-response";
import { UserDetailResponse } from "@/app/_types/user-info";

/**
 * Generic fetcher for your /api/admin/users/:id endpoint.
 * @param url - should be `/api/admin/users/${userId}`
 */
export default async function fetchUserDetail(
  url: string,
): Promise<UserDetailResponse> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch (networkError) {
    // e.g. offline, DNS failure
    throw new Error(`Network error while fetching user: ${networkError}`);
  }

  // If the HTTP status isn't 2xx, surface that
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Error fetching user (status ${res.status}): ${text || res.statusText}`,
    );
  }

  // Try to parse JSON
  let body: ApiResponse<UserDetailResponse>;
  try {
    body = await res.json();
  } catch (parseError) {
    throw new Error(`Invalid JSON in user response: ${parseError}`);
  }

  // Check your API’s own error contract
  if (body.code !== 200) {
    throw new Error(body.message || `API error code ${body.code}`);
  }

  // Finally, return the data payload
  return body.data;
}
