export type MndaResultResponse = {
  id: string;
  name: string;
  description: string;
  content: string;
  version: string;
  effectiveDate: string;
  updatedAt: string;
};

export interface AcceptPolicyResponse {
  success: boolean;
  message: string;
}

export interface UseAcceptPolicyResult {
  accept: (policyId: string) => Promise<ApiResponse<boolean>>;
  data: ApiResponse<boolean> | undefined;
  error: Error | undefined;
  isLoading: boolean;
}