"use client";

import { useEffect, useState } from "react";

interface WebLoaderProps {
  size?: "small" | "medium" | "large";
  text?: string;
  showText?: boolean;
}

export default function WebLoader({
  size = "medium",
  text = "Loading...",
  showText = true,
}: WebLoaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Size mappings
  const sizeMap = {
    small: {
      container: "w-16 h-16",
      text: "text-sm",
      wrapper: "gap-2",
    },
    medium: {
      container: "w-24 h-24",
      text: "text-base",
      wrapper: "gap-3",
    },
    large: {
      container: "w-32 h-32",
      text: "text-lg",
      wrapper: "gap-4",
    },
  };

  const { container, text: textSize, wrapper } = sizeMap[size];

  return (
    <div
      className={`flex min-h-[80dvh] flex-col items-center justify-center ${wrapper}`}
      role="status"
    >
      <div
        className={`relative ${container} ${mounted ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      >
        {/* Web SVG */}
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Center dot */}
          <circle
            cx="100"
            cy="100"
            r="4"
            fill="#287ab8"
            className="animate-pulse"
          />

          {/* Web rings */}
          <g className="web-rings" stroke="#287ab8" fill="none" strokeWidth="1">
            <circle
              cx="100"
              cy="100"
              r="15"
              opacity="0.9"
              className="animate-web-spin-slow"
            />
            <circle
              cx="100"
              cy="100"
              r="30"
              opacity="0.8"
              className="animate-web-spin-slow animation-delay-300"
            />
            <circle
              cx="100"
              cy="100"
              r="45"
              opacity="0.7"
              className="animate-web-spin-slow animation-delay-600"
            />
            <circle
              cx="100"
              cy="100"
              r="60"
              opacity="0.6"
              className="animate-web-spin-slow animation-delay-900"
            />
            <circle
              cx="100"
              cy="100"
              r="75"
              opacity="0.5"
              className="animate-web-spin-slow animation-delay-1200"
            />
          </g>

          {/* Radial lines */}
          <g stroke="#287ab8" strokeWidth="0.5" opacity="0.7">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="10"
              className="animate-web-pulse animation-delay-100"
            />
            <line
              x1="100"
              y1="100"
              x2="163.4"
              y2="36.6"
              className="animate-web-pulse animation-delay-200"
            />
            <line
              x1="100"
              y1="100"
              x2="190"
              y2="100"
              className="animate-web-pulse animation-delay-300"
            />
            <line
              x1="100"
              y1="100"
              x2="163.4"
              y2="163.4"
              className="animate-web-pulse animation-delay-400"
            />
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="190"
              className="animate-web-pulse animation-delay-500"
            />
            <line
              x1="100"
              y1="100"
              x2="36.6"
              y2="163.4"
              className="animate-web-pulse animation-delay-600"
            />
            <line
              x1="100"
              y1="100"
              x2="10"
              y2="100"
              className="animate-web-pulse animation-delay-700"
            />
            <line
              x1="100"
              y1="100"
              x2="36.6"
              y2="36.6"
              className="animate-web-pulse animation-delay-800"
            />
          </g>

          {/* Connection dots */}
          <g fill="#287ab8">
            <circle
              cx="100"
              cy="10"
              r="2"
              className="animate-ping-slow animation-delay-100"
            />
            <circle
              cx="163.4"
              cy="36.6"
              r="2"
              className="animate-ping-slow animation-delay-200"
            />
            <circle
              cx="190"
              cy="100"
              r="2"
              className="animate-ping-slow animation-delay-300"
            />
            <circle
              cx="163.4"
              cy="163.4"
              r="2"
              className="animate-ping-slow animation-delay-400"
            />
            <circle
              cx="100"
              cy="190"
              r="2"
              className="animate-ping-slow animation-delay-500"
            />
            <circle
              cx="36.6"
              cy="163.4"
              r="2"
              className="animate-ping-slow animation-delay-600"
            />
            <circle
              cx="10"
              cy="100"
              r="2"
              className="animate-ping-slow animation-delay-700"
            />
            <circle
              cx="36.6"
              cy="36.6"
              r="2"
              className="animate-ping-slow animation-delay-800"
            />
          </g>

          {/* Rotating element */}
          <circle
            cx="100"
            cy="25"
            r="3"
            fill="#1F5C8B"
            className="animate-orbit"
          />
        </svg>
      </div>

      {/* Loading text */}
      {showText && (
        <p
          className={`font-medium text-[#287ab8] ${textSize} ${mounted ? "opacity-100" : "opacity-0"} transition-opacity delay-300 duration-500`}
        >
          {text}
        </p>
      )}

      {/* Screen reader text */}
      <span className="sr-only">Loading</span>

      {/* Animations */}
      <style jsx global>{`
        @keyframes web-spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes web-pulse {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes ping-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.4;
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(75px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(75px) rotate(-360deg);
          }
        }

        .animate-web-spin-slow {
          animation: web-spin-slow 12s linear infinite;
        }

        .animate-web-pulse {
          animation: web-pulse 3s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s ease-in-out infinite;
        }

        .animate-orbit {
          animation: orbit 8s linear infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }

        .animation-delay-900 {
          animation-delay: 900ms;
        }

        .animation-delay-1200 {
          animation-delay: 1200ms;
        }
      `}</style>
    </div>
  );
}
