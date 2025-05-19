import useSWR, { useSWRConfig } from "swr";
import { MndaResultResponse, UseAcceptPolicyResult } from "../../_types/mnda";
import fetchMnda from "../../services/client/fetch-mnda";
import { ApiResponse } from "../../_types/api-response";
import useSWRMutation from "swr/mutation";
import acceptPolicyFetcher from "../../services/client/accept-mnda";
import { checkMndaStatus } from "../../services/client/check-mnda-status";

/**
 * Fetches the MndaResultResponse from the API.
 * @returns An object with keys: data, isLoading, and isError.
 * - data: The MndaResultResponse from the API.
 * - isLoading: A boolean indicating if the data is currently being fetched.
 * - isError: A boolean indicating if there was an error fetching the data.
 */
export function useMnda(): {
  data: MndaResultResponse | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error, isLoading } = useSWR<MndaResultResponse>(
    "/api/client/policies/mnda",
    fetchMnda,
  );
  return {
    data,
    isLoading,
    isError: !!error,
  };
}

/**
 * Accepts the MNDA policy.
 *
 * @returns An object with the following properties:
 * - accept: A function to accept the MNDA policy.
 * - data: The response from the API when the user accepts the policy.
 * - error: An error object if there was an error accepting the policy.
 * - isLoading: A boolean indicating if the policy is currently being accepted.
 */
export function useAcceptPolicy(): UseAcceptPolicyResult {
  const apiRoute = `/api/client/policies/mnda`;
  const { trigger, data, error, isMutating } = useSWRMutation<
    ApiResponse<boolean>,
    Error,
    string,
    { policyId: string }
  >(apiRoute, acceptPolicyFetcher);

  // grab the global mutate function
  const { mutate } = useSWRConfig();

  /**
   * Accepts the MNDA policy.
   *
   * @param policyId - The ID of the policy to accept.
   */
  const accept = async (policyId: string) => {
    try {
      // 1) send the POST
      const result = await trigger({ policyId });

      // 2) re-fetch the status endpoint so
      //    useMndaCheck() sees the new `true` value
      await mutate("/api/client/policies/mnda/status");
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    accept,
    data,
    error,
    isLoading: isMutating,
  };
}

/**
 * Checks if the user has accepted the MNDA policy.
 * @returns An object with the following properties:
 * - hasAgreed: A boolean indicating if the user has accepted the MNDA policy.
 * - isLoading: A boolean indicating if the data is currently being fetched.
 * - isError: A boolean indicating if there was an error fetching the data.
 */
export function useMndaCheck(): {
  hasAgreed: boolean;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error, isLoading } = useSWR(
    "/api/client/policies/mnda/status",
    checkMndaStatus,
    {
      /**
       * Do not revalidate the data when the user comes back to the page.
       * This is because the data is not expected to change, and we want to
       * avoid unnecessary requests to the server.
       */
      revalidateOnFocus: false,

      /**
       * Do not refresh the data at a regular interval.
       * This is because the data is not expected to change, and we want to
       * avoid unnecessary requests to the server.
       */
      refreshInterval: 0,
    },
  );
  return {
    hasAgreed: data || false,
    isLoading,
    isError: !!error,
  };
}
