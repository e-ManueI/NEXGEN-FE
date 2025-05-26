"use client";

import * as React from "react";
import {
  Icon,
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  // IconReport,
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
import { NavModels } from "./nav/nav-models";
import { UserType } from "@/app/_db/enum";

export const modelRoles = [UserType.ADMIN, UserType.EXPERT];
export interface NavItem {
  title: string;
  url: string;
  icon: Icon;
  allowedRoles?: UserRole[]; // optional array of your allowed roles
}

export interface NavData {
  navMain: NavItem[];
  navSecondary: NavItem[];
  models: NavItem[];
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
      allowedRoles: [UserType.ADMIN],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      allowedRoles: [UserType.ADMIN, UserType.EXPERT],
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
      title: "Doc Ingestion",
      url: AppRoutes.docIngestion,
      icon: IconDatabase,
      allowedRoles: modelRoles,
    },
    // {
    //   name: "Reports",
    //   url: "#",
    //   icon: IconReport,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const filterByRole = (items: NavItem[] | typeof data.models) => {
    return items.filter((item) => {
      // if there’s no allowedRoles field, or it’s an empty array, show to everyone
      if (!item.allowedRoles || item.allowedRoles.length === 0) {
        return true;
      }
      // otherwise only show if the user has at least one of the allowed roles
      return Array.isArray(session?.user.role)
        ? session.user.role.some((r) => item.allowedRoles!.includes(r))
        : item.allowedRoles!.includes(session?.user.role as UserRole);
    });
  };

  const visibleNavMain = filterByRole(data.navMain);
  const visibleModels = filterByRole(data.models);

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
        {modelRoles.includes(session?.user.role as UserType) && (
          <NavModels items={visibleModels} />
          // {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUserWrapper />
      </SidebarFooter>
    </Sidebar>
  );
}
