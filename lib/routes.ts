// This contains the paths to the assets used in the web application.
export const AppRoutes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  mnda: "/signup/mnda",

  // Dashboard routes
  dashboard: "/dashboard",
  makePredictions: "/dashboard/predictions/make-predictions",
  users: "/dashboard/users",
  docIngestion: "/dashboard/doc-ingestion",
  predictionDetails: (id: string) => `/dashboard/predictions/${id}`,
} as const;


// TODO: MOVE THE API ROUTES INTO THIS FILE
// export const API = {
//   admin: {
//     users: "/api/admin/users" as const,
//     userDetail: (id: string) => `/api/admin/users/${id}`,
//     analytics: "/api/admin/users/analytics" as const,
//   },
// };
// fetch(API.admin.users, { … })
// useSWR(API.admin.analytics, fetchAnalytics)
