// This contains the paths to the assets used in the web application.
export const AppRoutes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  mnda: "/signup/mnda",
  resetPassword: "/reset-password",
  forgotPassword: "/forgot-password",

  // Dashboard routes
  dashboard: "/dashboard",
  makePredictions: "/dashboard/predictions/make-predictions",
  users: "/dashboard/users",
  docIngestion: "/dashboard/doc-ingestion",
  predictionDetails: (id: string) => `/dashboard/predictions/${id}`,
} as const;

// This contains the API endpoints used in the web application.
export const API = {
  admin: {
    users: "/api/admin/users" as const,
    userDetail: (id: string) => `/api/admin/users/${id}`,
    analytics: "/api/admin/users/analytics" as const,
  },
  internal: {
    docIngestion: "/api/internal/doc-ingestion" as const,
    docIngestionUpload: "/api/internal/doc-ingestion/upload" as const,
    predictions: (id: string) => `/api/internal/predictions/${id}`,
    reviewedPredictions: (id: string) =>
      `/api/internal/reviewed-predictions/${id}/versions`,
    reviewedPredictionVersion: (predictionId: string, reviewedId: string) =>
      `/api/internal/reviewed-predictions/${predictionId}/versions/${reviewedId}`,
    reviewedPredictionsApprove:
      "/api/internal/reviewed-predictions/approve/" as const,
  },
  client: {
    mnda: "/api/client/policies/mnda" as const,
    mndaStatus: "/api/client/policies/mnda/status" as const,
  },
  predictions: {
    root: "/api/predictions" as const,
    byUser: (userId: string) => `/api/predictions?user=${userId}`,
    generate: (role: string) =>
      `/api/predictions/generate-predictions?role=${role}`,
    details: (id: string) => `/api/predictions/${id}`,
  },
  analytics: {
    predictionStats: (timeRange: string) =>
      `/api/admin/analytics/prediction-stats?timeRange=${timeRange}`,
  },
  auth: {
    resetPassword: "/api/auth/reset-password" as const,
    forgotPassword: "/api/auth/forgot-password" as const,
  },
};
