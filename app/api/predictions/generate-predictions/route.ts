import { UserType } from "@/app/_db/enum";
import { AnalysisResponse } from "@/app/_types/prediction";
import { failure, forbidden, success } from "@/lib/api-response";
import { auth } from "@/lib/auth";

/**
 * Handles the POST request to generate predictions based on the user's role and provided parameters.
 * 
 * This function is protected by authentication and authorization middleware. It validates the user's
 * role and ensures that the request body and query parameters are properly formatted before forwarding
 * the request to an external API for analysis generation.
 * 
 * @param req - The incoming HTTP request object, which includes authentication details, query parameters,
 *              and the request body.
 * 
 * @returns A response object indicating the success or failure of the prediction generation process.
 * 
 * Possible responses:
 * - 403 Forbidden: If the user is not authenticated or their role does not match the requested role.
 * - 400 Bad Request: If the role parameter is invalid or missing, or if the request body is missing.
 * - 500 Internal Server Error: If there is a server configuration issue or an unexpected error occurs.
 * - 200 OK: If the analysis is successfully generated, the response includes the analysis data.
 * 
 * @throws Will log errors to the console if the external API call fails or if unexpected issues occur.
 */
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
    console.log(
      "Generating analysis:",
      body,
      "for role:",
      roleParam,
      "API:",
      apiConfig.url,
    );

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
