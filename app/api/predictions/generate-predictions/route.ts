import { UserType } from "@/app/_db/enum";
import { AnalysisResponse } from "@/app/_types/prediction";
import { failure, forbidden, success } from "@/lib/api-response";
import { auth } from "@/lib/auth";

export const POST = auth(async (req) => {
  if (!req.auth || !req.auth.user) {
    return forbidden();
  }

  console.log("Generating predictions for role:", req.auth.user.role);

  const rawRole = req.nextUrl.searchParams.get("role");
  console.log("roleParam:", rawRole, "allowed:", Object.values(UserType));

  if (!rawRole || !Object.values(UserType).includes(rawRole as UserType)) {
    return failure("Invalid or missing role parameter", 400);
  }
  const roleParam = rawRole as UserType;

  if (req.auth.user.role !== roleParam) {
    return forbidden("You are not allowed to act as this role");
  }

  const apiConfig = {
    [UserType.ADMIN]: {
      url: "/generate_lithium_analysis_from_parameters_internal",
      key: process.env.ANALYSIS_API_KEY,
    },
    [UserType.EXPERT]: {
      url: "/generate_lithium_analysis_from_parameters_internal",
      key: process.env.ANALYSIS_API_KEY,
    },
    [UserType.CLIENT]: {
      url: "/generate_lithium_analysis_from_parameters",
      key: process.env.ANALYSIS_API_KEY,
    },
  }[roleParam];

  if (!apiConfig?.url || !apiConfig?.key) {
    console.error("Missing API configuration for role:", roleParam);
    return failure("Server configuration error", 500);
  }

  try {
    const body = await req.json();

    if (!body) {
      return failure("Missing request body", 400);
    }
    console.log("Generating analysis:", body);

    const response = await fetch(
      `${process.env.ANALYSIS_API_URL}${apiConfig.url}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiConfig.key,
        },
        body: JSON.stringify(body),
      },
    );

    if (response.ok) {
      const data: AnalysisResponse = await response.json();
      console.log("Generated analysis:", data);
      return success(data, data.message ?? "Analysis generated successfully");
    } else {
      const errorData = await response.json();
      console.error("Failed to generate analysis:", errorData);
      return failure(
        errorData.message ?? "Failed to generate analysis",
        response.status,
      );
    }
  } catch (error) {
    console.error(error);
    return failure("Failed to generate analysis", 500);
  }
});
