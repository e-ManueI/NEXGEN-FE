import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const getAccessControlOrigin = () => {
  if (allowedOrigins.length > 0) {
    return allowedOrigins.length === 1 ? allowedOrigins[0] : "*"; // Optional: support dynamic checks later
  }

  if (isDev) {
    return "*"; // Dev only fallback
  }

  // No origins set in production — fail securely
  console.warn("No ALLOWED_ORIGINS set in production! Blocking all origins.");
  return "null"; // Explicitly blocks CORS
};

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Apply these headers to all routes (or specify a more specific path like '/api/*')
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: getAccessControlOrigin(),
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400", // Cache preflight requests for 24 hours
          },
        ],
      },
    ];
  },
};

export default nextConfig;
