import { ApiResponse } from "@/app/_types/api-response";
import { DocumentUploadApiResponse } from "@/app/_types/doc-ingestion";

/**
 * Service function to upload documents to the vector database for agents.
 *
 * This function is used by the useSWRMutation hook.
 *
 * It sends the FormData to your Next.js API route, which then proxies it to the backend.
 * @param url The URL of the Next.js API route.
 * @param arg The FormData object containing the files and document type.
 * @returns A Promise that resolves with the API response from the document ingestion system.
 */
type UploadDocumentsFetcherArgs = {
  arg: FormData;
};

export const uploadDocuments = async (
  url: string,
  { arg: formData }: UploadDocumentsFetcherArgs,
): Promise<DocumentUploadApiResponse> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const responseData: ApiResponse<DocumentUploadApiResponse> =
      await response.json();

    if (!responseData.data || !responseData.data) {
      throw new Error(responseData.message || "No data received in response");
    }

    return responseData.data;
  } catch (error) {
    console.error("uploadDocuments: Failed to upload documents:", error);
    throw error;
  }
};
