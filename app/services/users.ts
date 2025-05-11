import { ApiResponse } from "../_types/api-response";
import {
  CreateUserPayload,
  CreateUserResponse,
  UserAnalyticsResponse,
  UserDetailResponse,
  UserInfo,
} from "../_types/user-info";

// ======================================================
// GET
// ======================================================
export async function fetchUserAnalytics(): Promise<UserAnalyticsResponse> {
  const res = await fetch("/api/users/analytics");

  let body: ApiResponse<UserAnalyticsResponse>;
  try {
    body = await res.json();
  } catch {
    throw new Error("Failed to parse analytics response");
  }

  if (!res.ok || body.code !== 200) {
    throw new Error(body.message || "Failed to fetch user analytics");
  }

  return body.data;
}

export async function fetchUsers(): Promise<UserInfo[]> {
  const res = await fetch("/api/users");

  let body: ApiResponse<{ users: UserInfo[] }>;
  try {
    body = await res.json();
  } catch {
    throw new Error("Failed to parse users response");
  }

  console.log("API /users returned:", body.data);
  if (!res.ok || body.code !== 200) {
    throw new Error(body.message || "Failed to fetch users");
  }

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
export async function editUserFetcher(
  url: string,
  { arg }: { arg: Partial<UserInfo> & { id: string } },
) {
  console.log("Editing user user", url);
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
  if (!res.ok) {
    console.log("Editing error", res);
    const errBody = await res.json().catch(() => ({}));
    const error = new Error(errBody.message || "Failed to edit user");
    error.cause = errBody.fieldErrors || {}; // Attach fieldErrors to cause
    throw error;
  }
  return res.json();
}
