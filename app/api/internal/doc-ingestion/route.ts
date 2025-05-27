import { UserType } from "@/app/_db/enum";
import { failure, forbidden, unauthorized, success } from "@/lib/api-response";
import { auth } from "@/lib/auth";

export const GET = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return unauthorized();
  }

  if (
    session.user.role !== UserType.ADMIN &&
    session.user.role !== UserType.EXPERT
  ) {
    return forbidden("Access Denied: Required role missing");
  }

  const DOCUMENT_INGESTION_API_URL = process.env.DOCUMENT_INGESTION_API_URL;

  if (!DOCUMENT_INGESTION_API_URL) {
    return failure(
      "Server configuration error: Document ingestion API URL is missing",
    );
  }

  try {
    const res = await fetch(`${DOCUMENT_INGESTION_API_URL}/file-names/`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return failure("Failed to fetch file list", 500);
    }
    const data = await res.json();
    const fileNames: string[] = data.file_names || [];
    const statusResults = await Promise.all(
      fileNames.map(async (filename) => {
        try {
          const statusRes = await fetch(
            `${DOCUMENT_INGESTION_API_URL}/check-file/${encodeURIComponent(filename)}`,
            { cache: "no-store" },
          );
          if (!statusRes.ok) {
            return { filename, status: "error", exists: false };
          }
          const statusData = await statusRes.json();
          return { ...statusData };
        } catch {
          return { filename, status: "error", exists: false };
        }
      }),
    );
    return success(statusResults, "Fetched document statuses successfully");
  } catch (error) {
    console.error("Error in docs-proxy GET:", error);
    return failure("Unexpected error while fetching document statuses", 500);
  }
});

export const DELETE = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return unauthorized();
  }

  if (
    session.user.role !== UserType.ADMIN &&
    session.user.role !== UserType.EXPERT
  ) {
    return forbidden("Access Denied: Required role missing");
  }

  const DOCUMENT_INGESTION_API_URL = process.env.DOCUMENT_INGESTION_API_URL;

  if (!DOCUMENT_INGESTION_API_URL) {
    return failure(
      "Server configuration error: Document ingestion API URL is missing",
    );
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  if (!filename) {
    return failure("Missing filename param", 400);
  }
  try {
    const res = await fetch(
      `${DOCUMENT_INGESTION_API_URL}/delete-file/${encodeURIComponent(filename)}`,
      { method: "DELETE" },
    );
    const data = await res.json();
    if (!res.ok) {
      return failure(data.message || "Failed to delete file", res.status);
    }
    return success(data, "File deleted successfully");
  } catch (error) {
    console.error("Error in docs-proxy DELETE:", error);
    return failure("Unexpected error while deleting file", 500);
  }
});
