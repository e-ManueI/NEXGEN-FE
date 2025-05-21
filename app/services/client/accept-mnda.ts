import { ApiResponse } from "@/app/_types/api-response";

/**
 * Fetches the API endpoint to accept the MNDA policy.
 *
 * @param url - The URL of the API endpoint to accept the MNDA policy.
 * @param arg - An object containing the policy ID to accept.
 * @returns A Promise resolving to an object with a boolean value indicating
 *          whether the policy was accepted successfully.
 * @throws An error if the API responds with a non-200 status or if there is an
 *         error parsing the response.
 */
export default async function acceptPolicyFetcher(
  url: string,
  { arg }: { arg: { policyId: string } },
): Promise<ApiResponse<boolean>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg),
    });

    if (!res.ok) {
      /**
       * If the API response is not successful, throw an error with the message
       * from the response or a default message.
       */
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || "Failed to accept policy");
    }

    // TODO: MODIFY ERROR PASSING FROM API TO THE CLIENT SIDE
    return await res.json();
  } catch (err) {
    console.error("Error accepting policy:", err);
    throw err;
  }
}
