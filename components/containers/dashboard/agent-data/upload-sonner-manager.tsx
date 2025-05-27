"use client";

import { API } from "@/lib/routes";
import { useUploadStore } from "@/app/_store/uploadStore";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const UPLOAD_API_KEY = API.internal.docIngestionUpload;

const UploadToastManager = () => {
  // Select the specific upload state we care about from the store
  const uploadState = useUploadStore((state) =>
    state.uploads.get(UPLOAD_API_KEY),
  );
  // Destructure actions needed for cleanup
  const { updateUpload, removeUpload } = useUploadStore();

  // Use a ref to store the toast ID for the specific UPLOAD_API_KEY
  const currentToastIdRef = useRef<string | number | undefined>(undefined);

  // Effect to manage toast notifications based on the global upload state
  useEffect(() => {
    // If there's an ongoing upload state in the store
    if (uploadState) {
      // If the toast ID for this upload is not yet stored in our ref
      if (!currentToastIdRef.current && uploadState.toastId) {
        // If the store already has a toastId (from a previous render or hydrate), use it
        currentToastIdRef.current = uploadState.toastId;
      }

      switch (uploadState.status) {
        case "pending":
          if (!currentToastIdRef.current) {
            // Create a new loading toast if none exists for this upload
            const newToastId = toast.loading(
              "Document(s) upload initiated...",
              {
                description:
                  "Adding to Knowledge Base. This may take 2-3 minutes.",
                duration: Infinity, // Keep open until manually dismissed or updated
              },
            );
            currentToastIdRef.current = newToastId;
            // IMPORTANT: Store the toast ID back into the Zustand store for persistence
            updateUpload(UPLOAD_API_KEY, { toastId: newToastId });
          } else {
            // Update existing toast message if it's still pending
            toast.message("Document(s) upload in progress...", {
              id: currentToastIdRef.current,
              description:
                "Still adding to Knowledge Base. This may take 2-3 minutes.",
            });
          }
          break;

        case "success":
          if (currentToastIdRef.current) {
            toast.success("Document(s) processed!", {
              id: currentToastIdRef.current, // Update the existing toast
              description: "Successfully added to Knowledge Base.",
              duration: Infinity, // Auto-dismiss after 5 seconds
              closeButton: true,
            });
          }
          // Clean up: remove the toast ID from ref and the upload entry from store
          currentToastIdRef.current = undefined;
          removeUpload(UPLOAD_API_KEY);
          break;

        case "error":
          if (currentToastIdRef.current) {
            toast.error("Document(s) upload failed!", {
              id: currentToastIdRef.current, // Update the existing toast
              description: uploadState.error?.message || "Please try again.",
              duration: Infinity,
              closeButton: true,
            });
          }
          // Clean up: remove the toast ID from ref and the upload entry from store
          currentToastIdRef.current = undefined;
          removeUpload(UPLOAD_API_KEY);
          break;
      }
    } else {
      // If uploadState is null/undefined, it means the upload was completed/removed from the store.
      // Ensure any lingering toast is dismissed.
      if (currentToastIdRef.current) {
        toast.dismiss(currentToastIdRef.current);
        currentToastIdRef.current = undefined;
      }
    }
  }, [uploadState, updateUpload, removeUpload]); // Re-run effect whenever `uploadState` changes

  return null; // This component renders nothing visually itself
};

export default UploadToastManager;
