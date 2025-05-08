import { ApiResponse } from "../_types/api-response";
import { UserAnalytics } from "../_types/user-analytics";
import { UserInfo } from "../_types/user-info";

export async function fetchUserAnalytics(): Promise<UserAnalytics> {
  const res = await fetch("/api/users/analytics");

  let body: ApiResponse<UserAnalytics>;
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
