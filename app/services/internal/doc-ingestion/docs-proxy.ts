// Service to fetch and delete document status via the Next.js API proxy

/**
 * Fetches a list of document status from the Next.js API proxy.
 * @param {string} endpoint The URL of the API endpoint to fetch the document status from.
 * @returns {Promise<DocumentStatus[]>} A Promise resolving to an array of document status.
 * @throws {Error} if the API responds with a non-200 status or if the response cannot be parsed as JSON.
 */
export async function fetchAllDocsStatus(endpoint: string) {
  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch document status");
  const data = await res.json();
  if (!data.data) throw new Error(data.message || "No data received");
  return data.data;
}

/**
 * Deletes a document by filename from the Next.js API proxy.
 * @param {string} endpoint The URL of the API endpoint to delete the document from.
 * @param {string} filename The filename of the document to delete.
 * @returns {Promise<ApiResponse>} A Promise resolving to the API response.
 * @throws {Error} if the API responds with a non-200 status or if the response cannot be parsed as JSON.
 */
export async function deleteDocByFilename(endpoint: string, filename: string) {
  const res = await fetch(
    `${endpoint}?filename=${encodeURIComponent(filename)}`,
    {
      method: "DELETE",
    },
  );
  if (!res.ok) throw new Error("Failed to delete file");
  const data = await res.json();
  if (!data || !data.data) throw new Error(data?.message || "No data received");
  return data.data;
}
