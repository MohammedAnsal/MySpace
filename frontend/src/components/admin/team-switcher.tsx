import * as React from "react";
import czn from "@/assets/admin/czn.jpg";
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
import { logout as adminLogout } from "@/redux/slice/adminSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { logout } from "@/services/Api/adminApi";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.data) {
        dispatch(adminLogout());
        toast.success(response.data.message);
        navigate("/admin/signIn");
      }
    } catch (error) {
      toast.error("Failed logout");
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="mt-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={`flex aspect-square ${
                  isOpen ? "size-10 md:size-10" : "size-12 md:size-10"
                } object-cover justify-center rounded-full overflow-hidden text-sidebar-primary-foreground transition-all duration-200`}
              >
                <img
                  src={czn}
                  className="object-cover w-full rounded-full h-full overflow-hidden"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">admin</span>
                <span className="truncate text-xs">Admin</span>
              </div>
              {!isOpen && <ChevronsUpDown className="ml-auto" />}
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
                onClick={handleLogout}
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
