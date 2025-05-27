// Interface for each individual file's processing result
export interface ProcessingResult {
  filename: string;
  status: "success" | "error"; // "success" or "error" for individual files
  metadata_output?: string; // Path to the saved metadata JSON file (if successful).
  markdown_output?: string; // Path to the saved markdown file (if successful).
  text_node_count?: number; // Number of text nodes stored in Pinecone (if successful).
  message?: string; // Error description (if status is "error").
}

// Interface for the overall API response from /upload-pdfs/
// This matches the example response structure you provided.
export interface DocumentUploadApiResponse {
  status: "completed" | "error" | "processing"; // Overall status: "completed" if successful, "error" if overall failed.
  results: ProcessingResult[]; // Array of individual file processing outcomes.
  total_nodes: number; // Total number of nodes (text) stored across all PDFs.
  total_text_nodes: number; // Total number of text nodes stored.
}

// Type for the SWR Mutation hook's result
export interface UseUploadDocumentsResult {
  upload: (formData: FormData) => Promise<DocumentUploadApiResponse>;
  data: DocumentUploadApiResponse | null;
  error: Error | null;
  isUploading: boolean;
}

export interface DocStatusRow {
  filename: string;
  status: string;
  exists?: boolean;
  total_chunks?: number;
  doc_id?: string;
}