import * as React from "react";
import {
  LogOut,
  SquareTerminal,
  SquareStack,
  Users,
  HomeIcon,
  House,
  NotebookTabs,
} from "lucide-react";
import { NavMain } from "../../components/admin/nav-main";
import { TeamSwitcher } from "@/components/admin/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  teams: [
    {
      name: "LogOut",
      logo: LogOut,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Clients",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "User",
          url: "/admin/users",
        },
        {
          title: "Provider",
          url: "/admin/providers",
        },
      ],
    },
    {
      title: "Accommodations",
      url: "/admin/accommodations",
      icon: HomeIcon,
      items: [
        {
          title: "Requests",
          url: "/admin/accommodations/requests",
        },
      ],
    },
    {
      title: "Facility",
      url: "/admin/facility",
      icon: SquareStack,
      isActive: true,
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: NotebookTabs,
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    // <SidebarProvider>
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>

    // </SidebarProvider>
  );
}
