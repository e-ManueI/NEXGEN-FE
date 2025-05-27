import { ApiResponse } from "@/app/_types/api-response";
import { UserDetailResponse } from "@/app/_types/user-info";

/**
 * Generic fetcher for your API.admin.userDetail endpoint.
 * @param url - should be API.admin.userDetail(userId)
 */
export default async function fetchUserDetail(
  url: string,
): Promise<UserDetailResponse> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch (networkError) {
    throw new Error(`Network error while fetching user: ${networkError}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Error fetching user (status ${res.status}): ${text || res.statusText}`,
    );
  }

  let body: ApiResponse<UserDetailResponse>;
  try {
    body = await res.json();
  } catch (parseError) {
    throw new Error(`Invalid JSON in user response: ${parseError}`);
  }

  if (body.code !== 200) {
    throw new Error(body.message || `API error code ${body.code}`);
  }

  return body.data;
}
