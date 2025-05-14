import { UserInfo } from "@/app/_types/user-info";

/**
 * Edits a user via the API.
 *
 * @param url - The base URL of the API endpoint.
 * @param arg - The user data to send to the API.
 * @returns A Promise resolving to the edited user object.
 * @throws An error if the API response is not successful or if JSON parsing fails.
 */
export default async function editUserFetcher(
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
