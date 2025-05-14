// This contains the paths to the assets used in the web application.
export const AppRoutes = {
  home: "/",
  login: "/login",
  signup: "/signup",

  // Dashboard routes
  dashboard: "/dashboard",
  makePredictions: "/dashboard/predictions/make-predictions",
  users: "/dashboard/users",
  predictionDetails: (id: string) => `/dashboard/predictions/${id}`,
} as const;
