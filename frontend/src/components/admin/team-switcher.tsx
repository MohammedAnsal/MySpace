import * as React from "react";
import czn from '@/assets/admin/czn.jpg'
import { ChevronsUpDown, Plus } from "lucide-react";
// import { Logout } from "@/redux/slice/adminSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
// import { logoutAdmin } from "@/service/Api/adminApi";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
  }[];
}) {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
//   const LogoutAdmin = async () => {
//     try {
//       await logoutAdmin();
//       dispatch(Logout());
//       navigate("/admin/auth");
//       toast.success("Logged Out");
//     } catch (error) {
//       toast.error("failedf to logout");
//     }
//   };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="mt-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-12 object-cover justify-center rounded-full overflow-  text-sidebar-primary-foreground">
                <img
                  src={czn}
                  className="object-cover w-full rounded-full h-full overflow-hidden"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">admin</span>
                <span className="truncate text-xs">Admin</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                // onClick={LogoutAdmin}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
