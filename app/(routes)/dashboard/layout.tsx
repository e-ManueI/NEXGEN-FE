import { AppSidebar } from "@/components/dashboard/sidebar-nav/app-sidebar";
import { SiteHeader } from "@/components/dashboard/sidebar-nav/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {" "}
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="px-4 py-4 md:py-6 lg:px-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
