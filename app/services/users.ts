import { ApiResponse } from "../_types/api-response";
import {
  CreateUserPayload,
  CreateUserResponse,
  UserAnalyticsResponse,
  UserDetailResponse,
  UserInfo,
} from "../_types/user-info";

// ======================================================
// GET User Analytics
// ======================================================

/**
 * Fetches user analytics data from the API.
 *
 * @returns A Promise resolving to the user analytics response.
 * @throws An error if the API response is not successful or the JSON parsing fails.
 */
export async function fetchUserAnalytics(): Promise<UserAnalyticsResponse> {
  // Fetch the user analytics data from the specified endpoint
  const res = await fetch("/api/users/analytics");

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

/**
 * Fetches a list of users from the API.
 *
 * @returns A Promise resolving to an array of user information.
 * @throws An error if the API response is not successful or if JSON parsing fails.
 */
export async function fetchUsers(): Promise<UserInfo[]> {
  // Send a request to the '/api/users' endpoint
  const res = await fetch("/api/users");

  let body: ApiResponse<{ users: UserInfo[] }>;
  try {
    // Attempt to parse the response body as JSON
    body = await res.json();
  } catch {
    // Throw an error if JSON parsing fails
    throw new Error("Failed to parse users response");
  }

  console.log("API /users returned:", body.data);

  // Check if the response status is not OK or if the API returned an error code
  if (!res.ok || body.code !== 200) {
    // Throw an error with the message from the response or a default message
    throw new Error(body.message || "Failed to fetch users");
  }

  // Return the array of users from the response
  return body.data.users;
}

// app/hooks/fetchers.ts

/**
 * Generic fetcher for your /api/users/:id endpoint.
 * @param url - should be `/api/users/${userId}`
 */
export async function fetchUserDetail(
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

// ======================================================
// POST
// ======================================================
/**
 * Creates a new user via the API.
 *
 * @param payload - The user data to send to the API.
 * @returns A Promise resolving to the created user object.
 * @throws An error if the API response is not successful or if JSON parsing fails.
 */
export async function createUser(
  payload: CreateUserPayload,
): Promise<CreateUserResponse> {
  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.log("service error", res);
    const errBody = await res.json().catch(() => ({}));
    const error = new Error(errBody.message || "Failed to create user");
    error.cause = errBody.fieldErrors || {}; // Attach fieldErrors to cause
    throw error;
  }

  return res.json();
}
// ======================================================
// PATCH
// ======================================================
/**
 * Edits a user via the API.
 *
 * @param url - The base URL of the API endpoint.
 * @param arg - The user data to send to the API.
 * @returns A Promise resolving to the edited user object.
 * @throws An error if the API response is not successful or if JSON parsing fails.
 */
export async function editUserFetcher(
  url: string,
  { arg }: { arg: Partial<UserInfo> & { id: string } },
) {
  // Send a PATCH request to the API with the user data
  const res = await fetch(`${url}/${arg.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: arg.firstName,
      lastName: arg.lastName,
      email: arg.email,
      role: arg.role,
    }),
  });

  // Check if the response is not OK
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const error = new Error(errBody.message || "Failed to edit user");
    error.cause = errBody.fieldErrors || {}; // Attach fieldErrors to cause
    throw error;
  }

  // Return the edited user object
  return res.json();
}
