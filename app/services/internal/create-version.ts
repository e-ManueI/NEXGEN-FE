import { ApiResponse } from "@/app/_types/api-response";
import {
  CreateNewVersionPayload,
  CreateNewVersionResponse,
} from "@/app/_types/reviewed-predictions";

export default async function createNewVersion(
  url: string,
  payload: CreateNewVersionPayload,
): Promise<CreateNewVersionResponse> {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  let body: ApiResponse<CreateNewVersionResponse>;
  try {
    body = await res.json();
  } catch {
    throw new Error("Failed to parse new version details response");
  }

  if (!res.ok || body.code !== 200) {
    throw new Error(
      body.message || "Failed to create new reviewed version. Please try again",
    );
  }

  return body.data;
}
