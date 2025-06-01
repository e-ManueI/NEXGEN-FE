import useSWR, { mutate } from "swr";
import {
  fetchAllDocs,
  deleteDocByFilename,
} from "@/app/services/internal/doc-ingestion/docs-proxy";
import { API } from "@/lib/routes";

const API_ENDPOINT = API.internal.docIngestion;

/**
 * Hook to fetch and manage document statuses.
 *
 * @returns An object with the list of documents, loading state, error,
 *          function to fetch the documents, and a function to delete a document
 */
export function useDocs() {
  const {
    data: docs,
    error,
    isLoading: loading,
    isValidating: refreshing,
    mutate: mutateDocs,
  } = useSWR<string[]>(API_ENDPOINT, fetchAllDocs);

  const fetchDocs = () => mutate(API_ENDPOINT);

  /**
   * Deletes a document by filename
   *
   * @param filename the filename of the document to delete
   */
  const deleteDoc = async (filename: string) => {
    await deleteDocByFilename(API_ENDPOINT, filename);
    mutate(API_ENDPOINT);
  };

  return {
    docs: docs || [],
    loading,
    refreshing,
    error: error ? (error as Error).message : null,
    fetchDocs,
    deleteDoc,
    mutate: mutateDocs,
  };
}
