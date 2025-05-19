/**
 * Fetches the MNDA status from the API.
 *
 * @param url - The URL of the API endpoint to fetch the MNDA status from.
 * @returns A Promise resolving to a boolean indicating whether the user has
 * accepted the MNDA policy.
 * @throws An error if the API responds with a non-200 status or if JSON
 * parsing fails.
 */
export async function checkMndaStatus(url: string): Promise<boolean> {
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to check MNDA status");
  }

  const json = await response.json();

  if (json.code !== 200) {
    throw new Error(json.message || "Failed to check MNDA status");
  }

  const { hasAgreed } = json.data;
  return hasAgreed;
}
