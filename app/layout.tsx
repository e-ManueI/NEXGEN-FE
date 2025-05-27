import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "./_config/site";
import { geistMono, latoSans } from "./_config/fonts";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import UploadToastManager from "@/components/containers/dashboard/agent-data/upload-sonner-manager";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Polyfill for markdown-it’s missing isSpace when using Turbopack */}
        <Script id="markdown-it-isSpace" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined' && typeof window.isSpace === 'undefined') {
              window.isSpace = function(code) {
                // match markdown-it’s definition: tab, space, newline, etc.
                return code === 0x20 /*SPACE*/ ||
                       code === 0x09 /*TAB*/   ||
                       (code >= 0x0A && code <= 0x0D); /*LF, CR, VT, FF*/
              };
            }
          `}
        </Script>
      </head>
      <body
        className={`${latoSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>{children}</main>
        <Toaster richColors />
        <UploadToastManager />
      </body>
    </html>
  );
}
