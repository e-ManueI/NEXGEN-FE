import { ApiResponse } from "@/app/_types/api-response";
import { UserInfo } from "@/app/_types/user-info";

/**
 * Fetches a list of users from the API.
 *
 * @returns A Promise resolving to an array of user information.
 * @throws An error if the API response is not successful or if JSON parsing fails.
 */
export default async function fetchUsers(url: string): Promise<UserInfo[]> {
  const res = await fetch(url);

  let body: ApiResponse<{ users: UserInfo[] }>;
  try {
    // Attempt to parse the response body as JSON
    body = await res.json();
  } catch {
    // Throw an error if JSON parsing fails
    throw new Error("Failed to parse users response");
  }


  // Check if the response status is not OK or if the API returned an error code
  if (!res.ok || body.code !== 200) {
    // Throw an error with the message from the response or a default message
    throw new Error(body.message || "Failed to fetch users");
  }

  // Return the array of users from the response
  return body.data.users;
}
