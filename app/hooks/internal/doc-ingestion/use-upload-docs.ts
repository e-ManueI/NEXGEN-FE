import { useUploadStore } from "@/app/_store/uploadStore";
import {
  DocumentUploadApiResponse,
  UseUploadDocumentsResult,
} from "@/app/_types/doc-ingestion";
import { uploadDocuments } from "@/app/services/internal/doc-ingestion/upload-documents";
import useSWRMutation from "swr/mutation";
import { API } from "@/lib/routes";

/**
 * Hook for uploading documents to the document ingestion system.
 *
 * It uses SWRMutation to handle the POST request and manage its state.
 * @returns An object with the upload trigger function, data, error, and loading state.
 */
export function useUploadDocuments(): UseUploadDocumentsResult {
  const apiRoute = API.internal.docIngestionUpload;
  const { startUpload, updateUpload } = useUploadStore();

  const {
    trigger,
    data: swrData,
    error: swrError,
    isMutating,
  } = useSWRMutation<DocumentUploadApiResponse, Error, string, FormData>(
    apiRoute,

    async (url, arg) => {
      startUpload(apiRoute);
      try {
        const result = await uploadDocuments(url, arg);
        updateUpload(apiRoute, { status: "success", data: result });
        return result;
      } catch (e) {
        updateUpload(apiRoute, { status: "error", error: e as Error });
        throw e;
      }
    },
  );

  const data = swrData ?? null;
  const error = swrError ?? null;

  const upload = async (
    formData: FormData,
  ): Promise<DocumentUploadApiResponse> => {
    try {
      const result = await trigger(formData);
      if (!result) {
        throw new Error("No data received in response from upload trigger.");
      }
      return result;
    } catch (error) {
      console.error("useUploadDocuments: Document upload failed:", error);
      throw error;
    }
  };

  return {
    upload,
    data,
    error,
    isUploading: isMutating,
  };
}
