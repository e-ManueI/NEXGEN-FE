import { CreateUserPayload, CreateUserResponse } from "@/app/_types/user-info";

/**
 * Creates a new user via the API.
 *
 * @param payload - The user data to send to the API.
 * @returns A Promise resolving to the created user object.
 * @throws An error if the API response is not successful or if JSON parsing fails.
 */
export default async function createUser(
  payload: CreateUserPayload,
): Promise<CreateUserResponse> {
  const res = await fetch("/api/admin/users", {
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
