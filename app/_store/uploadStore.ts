// app/store/uploadStore.ts
import { create } from "zustand";
import { DocumentUploadApiResponse } from "@/app/_types/doc-ingestion"; // Adjust path if needed

// Interface for a single upload's state
interface UploadState {
  key: string; // The SWR mutation key (e.g., '/api/internal/up...')
  status: "pending" | "success" | "error";
  data?: DocumentUploadApiResponse;
  error?: Error;
  toastId?: string | number; // Sonner toast ID for this specific upload
  initiatedAt: number;
}

// Interface for the Zustand store itself
interface UploadStore {
  uploads: Map<string, UploadState>; // Map to store multiple uploads, keyed by their mutation key

  // Actions
  startUpload: (key: string) => void;
  // `updates` uses Partial<Omit<...>> to ensure 'key' and 'initiatedAt' aren't accidentally changed
  updateUpload: (
    key: string,
    updates: Partial<Omit<UploadState, "key" | "initiatedAt">>,
  ) => void;
  removeUpload: (key: string) => void;
  resetUploads: () => void; // Optional: to clear all uploads
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: new Map(),

  startUpload: (key: string) => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      if (!newUploads.has(key)) {
        // Only add if not already present (prevents re-initiating toast on remount)
        newUploads.set(key, {
          key,
          status: "pending",
          initiatedAt: Date.now(),
        });
      }
      return { uploads: newUploads };
    });
  },

  updateUpload: (
    key: string,
    updates: Partial<Omit<UploadState, "key" | "initiatedAt">>,
  ) => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      const existingUpload = newUploads.get(key);
      if (existingUpload) {
        newUploads.set(key, { ...existingUpload, ...updates });
      } else {
        // This case should ideally not happen if `startUpload` is called first.
        // It could indicate a race condition or an attempt to update a non-existent upload.
        console.warn(
          `Attempted to update non-existent upload key: ${key}. Initializing as pending.`,
        );
        newUploads.set(key, {
          key,
          status: updates.status || "pending", // Use provided status or default to pending
          initiatedAt: Date.now(),
          ...updates, // Merge all updates
        });
      }
      return { uploads: newUploads };
    });
  },

  removeUpload: (key: string) => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      newUploads.delete(key);
      return { uploads: newUploads };
    });
  },

  resetUploads: () => {
    set({ uploads: new Map() });
  },
}));
