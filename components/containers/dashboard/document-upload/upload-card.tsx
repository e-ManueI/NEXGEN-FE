// components/upload-card.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useUploadDocuments } from "@/app/hooks/internal/use-upload-docs";
import { useUploadStore } from "@/app/_store/uploadStore";

// Define the SWR mutation key (should match the one in useUploadDocuments)
const UPLOAD_API_KEY = "/api/internal/upload-doc-ingestion";

export default function UploadCard() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>("electrodialysis");

  const { upload } = useUploadDocuments(); // We only need the upload trigger here

  // Get the current upload state from Zustand store
  const uploadState = useUploadStore((state) =>
    state.uploads.get(UPLOAD_API_KEY),
  );
  const isUploading = uploadState?.status === "pending";
  const uploadResult = uploadState?.data || null;
  const uploadError = uploadState?.error || null;

  // State to manage errors displayed in the UI (e.g., file validation errors or on-page upload errors)
  const [displayError, setDisplayError] = useState<string | null>(null);

  // Effect to update displayError on the form based on upload errors from Zustand
  React.useEffect(() => {
    if (uploadError) {
      setDisplayError(
        uploadError.message || "An unknown error occurred during upload.",
      );
      // Optionally clear files after a failed upload for user to retry
      setSelectedFiles([]);
      const fileInput = document.getElementById(
        "pdf-upload",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else if (uploadResult) {
      setDisplayError(null);
      // Clear files after successful upload (this is also handled by SonnerManager cleanup, but good for local form reset)
      setSelectedFiles([]);
      const fileInput = document.getElementById(
        "pdf-upload",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  }, [uploadError, uploadResult]);

  const documentTypes = [
    { value: "electrodialysis", label: "Electrodialysis" },
    { value: "chloralkali", label: "Chloralkali" },
    { value: "brine", label: "Brine" },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: File[] = [];
      const invalidFiles: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === "application/pdf") {
          if (
            !selectedFiles.some(
              (existingFile) => existingFile.name === file.name,
            )
          ) {
            newFiles.push(file);
          }
        } else {
          invalidFiles.push(file.name);
        }
      }

      if (invalidFiles.length > 0) {
        setDisplayError(
          `The following files are not PDFs and were not added: ${invalidFiles.join(", ")}`,
        );
      } else {
        setDisplayError(null);
      }

      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
    event.target.value = "";
  };

  const handleRemoveFile = (fileNameToRemove: string) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileNameToRemove),
    );
    if (selectedFiles.length === 1 && displayError?.includes("not PDFs")) {
      setDisplayError(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setDisplayError("Please select at least one PDF file");
      return;
    }

    setDisplayError(null); // Clear any existing errors before starting a new upload

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      const originalName = file.name;
      const fileExtension = originalName.substring(
        originalName.lastIndexOf("."),
      );
      const fileNameWithoutExt = originalName.substring(
        0,
        originalName.lastIndexOf("."),
      );
      const prefixedFileName = `${documentType}_${fileNameWithoutExt}${fileExtension}`;
      const renamedFile = new File([file], prefixedFileName, {
        type: file.type,
        lastModified: file.lastModified,
      });
      formData.append("files", renamedFile);
    });

    // Trigger the upload. The Zustand store will handle the status updates and toasts.
    upload(formData).catch((err) => {
      console.error("Error initiating upload promise from component:", err);
      // The error is already being stored in Zustand and handled by SonnerManager
    });
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setDisplayError(null);
    setDocumentType("electrodialysis");
    const fileInput = document.getElementById("pdf-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    // When resetting the form, also explicitly remove the upload state from Zustand
    useUploadStore.getState().removeUpload(UPLOAD_API_KEY);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Document Ingestion</h1>
        <p className="text-muted-foreground">
          Upload scientific PDF documents for processing and vector storage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Document(s)
          </CardTitle>
          <CardDescription>
            Select PDF document(s) and specify their type for processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Document Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Document Type</Label>
            <RadioGroup
              value={documentType}
              onValueChange={setDocumentType}
              className="flex flex-wrap gap-4"
            >
              {documentTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="pdf-upload" className="text-base font-medium">
              PDF Document(s)
            </Label>
            <Input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              multiple
              className="focus:ring-primary"
            />
            {/* Display selected files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium">
                  Selected Files:
                </p>
                {selectedFiles.map((file, index) => (
                  <div
                    key={file.name + index}
                    className="text-muted-foreground bg-muted flex items-center justify-between gap-2 rounded-md p-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                      <Badge variant="outline">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFile(file.name)}
                      disabled={isUploading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {selectedFiles.length > 0 && (
              <div className="text-muted-foreground text-sm">
                Files will be saved with prefix:{" "}
                <code className="bg-muted rounded px-1">
                  {documentType}_[original_filename]
                </code>
              </div>
            )}
          </div>

          {/* Error Display */}
          {displayError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          {/* Upload Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Process
                </>
              )}
            </Button>
            {(uploadResult || displayError || selectedFiles.length > 0) && (
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {/* Show results only when uploadResult is available AND we are not currently uploading */}
      {uploadResult && !isUploading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {uploadResult.status === "completed" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Processing Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall Status */}
            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <span className="font-medium">Overall Status:</span>
              <Badge
                variant={
                  uploadResult.status === "completed"
                    ? "default"
                    : "destructive"
                }
              >
                {uploadResult.status}
              </Badge>
            </div>

            {/* Individual File Results */}
            {uploadResult.results.map((result, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2 font-medium">
                        <FileText className="h-4 w-4" />
                        {result.filename}
                      </h4>
                      <Badge
                        variant={
                          result.status === "success"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {result.status}
                      </Badge>
                    </div>

                    {result.status === "success" ? (
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div>
                          <Label className="text-muted-foreground text-xs">
                            Metadata Output
                          </Label>
                          <p className="bg-muted rounded p-2 font-mono text-xs">
                            {result.metadata_output}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">
                            Markdown Output
                          </Label>
                          <p className="bg-muted rounded p-2 font-mono text-xs">
                            {result.markdown_output}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">
                            Text Nodes
                          </Label>
                          <p className="text-lg font-semibold">
                            {result.text_node_count}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{result.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Summary Statistics */}
            {uploadResult.status === "completed" && (
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {uploadResult.total_nodes}
                  </p>
                  <p className="text-muted-foreground text-sm">Total Nodes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {uploadResult.total_text_nodes}
                  </p>
                  <p className="text-muted-foreground text-sm">Text Nodes</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
