"use client";

import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface PermissionDeniedCardProps {
  role?: string;
  message?: string;
}

export default function PermissionDeniedCard({
  role = "admin",
  message = "You do not have access to this dashboard. If you believe this is a mistake, please contact support.",
}: PermissionDeniedCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className="flex min-h-[80dvh] items-center justify-center">
      <div
        className={`transform transition-all duration-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <Card className="relative w-full max-w-md overflow-hidden border border-gray-200 bg-white text-gray-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-100 to-pink-100 blur-3xl" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBjMCAxNi41NjktMTMuNDMxIDMwLTMwIDMwQzEzLjQzMSA2MCAwIDQ2LjU2OSAwIDMwIDAgMTMuNDMxIDEzLjQzMSAwIDMwIDBjMTYuNTY5IDAgMzAgMTMuNDMxIDMwIDMweiIgc3Ryb2tlPSIjZWVlIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTYwIDYwTDAgME02MCAwTDAgNjAiIHN0cm9rZT0iI2VlZSIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')] opacity-10" />

          <div className="relative z-10 p-8">
            {/* Lock icon with glow */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-300/30 blur-xl" />
                <div className="relative rounded-full border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 shadow-xl">
                  <Lock className="text-primary h-8 w-8" />
                </div>
              </div>
            </div>

            {/* Content */}
            <h2 className="from-primary to-primary/90 mb-2 bg-gradient-to-r bg-clip-text text-center text-2xl font-bold tracking-tight text-transparent">
              Access Restricted
            </h2>

            <div className="mx-auto mb-6 h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            <p className="mb-6 text-center text-gray-600">{message}</p>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm backdrop-blur-sm">
              <p className="flex items-center justify-between text-sm text-gray-500">
                <span>Current Access Level</span>
                <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                  {role}
                </span>
              </p>
            </div>

            {/* NYC skyline silhouette */}
            <div className="mt-8 h-12 w-full opacity-20">
              <svg
                viewBox="0 0 1200 200"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
              >
                <path
                  fill="currentColor"
                  d="M0,200 L50,200 L50,120 L80,120 L80,200 L120,200 L120,100 L160,100 L160,200 L200,200 L200,150 L240,150 L240,200 L280,200 L280,180 L320,180 L320,200 L360,200 L360,140 L400,140 L400,200 L440,200 L440,160 L480,160 L480,200 L520,200 L520,170 L560,170 L560,200 L600,200 L600,130 L640,130 L640,200 L680,200 L680,110 L720,110 L720,200 L760,200 L760,90 L800,90 L800,200 L840,200 L840,180 L880,180 L880,200 L920,200 L920,70 L960,70 L960,200 L1000,200 L1000,150 L1040,150 L1040,200 L1080,200 L1080,120 L1120,120 L1120,200 L1160,200 L1160,80 L1200,80 L1200,200 L0,200 Z"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
