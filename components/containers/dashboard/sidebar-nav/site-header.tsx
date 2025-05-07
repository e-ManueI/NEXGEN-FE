import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

export async function SiteHeader() {
  const session = await auth();

  // Map each role to its title
  const titles: Record<string, string> = {
    admin: "Admin Dashboard",
    expert: "Expert Dashboard",
    client: "Client Dashboard",
  };

  // Fallback if somehow role is missing or unexpected
  const title = titles[session?.user?.role ?? ""] ?? "Dashboard";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {session?.user?.role === "admin" ||
        session?.user?.role === "expert" ||
        session?.user?.role === "client" ? (
          <h1 className="text-base font-medium">{title}</h1>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          {/* TODO: Put user avatar here / Something here  */}
        </div>
      </div>
    </header>
  );
}
