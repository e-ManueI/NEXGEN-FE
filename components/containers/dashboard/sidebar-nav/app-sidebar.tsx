"use client";

import * as React from "react";
import {
  Icon,
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

// import { NavModels } from "@/components/dashboard/nav/nav-documents";
// import { NavSecondary } from "@/components/dashboard/nav/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavUserWrapper from "./nav/nav-user/nav-user-wrapper";
import { AppRoutes } from "@/lib/routes";
import { useSession } from "next-auth/react";
import { NavMain } from "./nav/nav-main";
import { UserRole } from "@/app/_types/user-info";

export interface NavItem {
  title: string;
  url: string;
  icon: Icon;
  allowedRoles?: UserRole[]; // optional array of your allowed roles
}

export interface NavData {
  navMain: NavItem[];
  navSecondary: NavItem[];
  models: {
    name: string;
    url: string;
    icon: Icon;
  }[];
}

const data: NavData = {
  navMain: [
    {
      title: "Dashboard",
      url: AppRoutes.dashboard,
      icon: IconDashboard,
      allowedRoles: [],
    },
    {
      title: "Users",
      url: AppRoutes.users,
      icon: IconUsers,
      allowedRoles: ["admin"],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      allowedRoles: ["admin", "expert"],
    },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: IconHelp,
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  models: [
    {
      name: "Predictions",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  // Filter by role
  const visibleNavMain = data.navMain.filter((item) => {
    // if there’s no allowedRoles field, or it’s an empty array, show to everyone
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true;
    }
    // otherwise only show if the user has at least one of the allowed roles
    return Array.isArray(session?.user.role)
      ? session.user.role.some((r) => item.allowedRoles!.includes(r))
      : item.allowedRoles!.includes(session?.user.role as UserRole);
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">NexGen AI.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={visibleNavMain} />
        {/* <NavModels items={data.models} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUserWrapper />
      </SidebarFooter>
    </Sidebar>
  );
}
