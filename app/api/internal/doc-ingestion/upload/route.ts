import { UserType } from "@/app/_db/enum";
import { failure, forbidden, success, unauthorized } from "@/lib/api-response";
import { auth } from "@/lib/auth";

export const POST = auth(async (req) => {
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
    const formData = await req.formData();
    const backendResponse = await fetch(
      `${DOCUMENT_INGESTION_API_URL}/upload-pdfs/`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({
        message: `Doc Ingestion Service error: ${backendResponse.statusText}`,
      }));
      return failure(
        errorData.message ||
          "Failed to process documents on the document ingestion service",
        backendResponse.status,
      );
    }

    const data = await backendResponse.json();
    return success(data, "Documents processed successfully");
  } catch (error) {
    console.error("Error in API route:", error);
    return failure("An unexpected error occurred during document upload", 500);
  }
});
