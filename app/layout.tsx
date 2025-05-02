import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "./_config/site";
import { geistMono, latoSans } from "./_config/fonts";
import { Toaster } from "@/components/ui/sonner";
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
      <body
        className={`${latoSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
