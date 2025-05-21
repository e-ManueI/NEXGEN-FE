import { ApiResponse } from "@/app/_types/api-response";
import {
  ApproveReviewedVersionPayload,
  ApproveReviewedVersionResponse,
} from "@/app/_types/reviewed-predictions";

export default async function approveVersion(
  url: string,
  payload: ApproveReviewedVersionPayload,
): Promise<ApproveReviewedVersionResponse> {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  let body: ApiResponse<ApproveReviewedVersionResponse>;
  try {
    body = await res.json();
  } catch {
    throw new Error("Failed to parse approve reviewed version response");
  }

  if (!res.ok || body.code !== 200) {
    throw new Error(
      body.message || "Failed to approve reviewed version. Please try again",
    );
  }

  return body.data;
}
