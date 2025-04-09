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
import { logout } from "@/redux/slice/adminSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { admin_logout } from "@/services/Api/admin/adminApi";

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
      const response = await admin_logout();
      if (response.data) {
        dispatch(logout());
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
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mt-1"
            >
              <div
                className={`flex aspect-square ${
                  isOpen ? "size-10 md:size-10" : "size-12 md:size-10"
                } object-cover justify-center rounded-full overflow-hidden text-sidebar-primary-foreground transition-all duration-200`}
              >
                <img
                  src={czn}
                  className="h-full rounded-full w-full object-cover overflow-hidden"
                />
              </div>
              <div className="flex-1 grid text-left text-sm leading-tight">
                <span className="font-semibold truncate">admin</span>
                <span className="text-xs truncate">Admin</span>
              </div>
              {!isOpen && <ChevronsUpDown className="ml-auto" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="rounded-lg w-[--radix-dropdown-menu-trigger-width] min-w-56"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={handleLogout}
                className="p-2 gap-2"
              >
                <div className="flex border justify-center rounded-sm items-center size-6">
                  <team.logo className="shrink-0 size-4" />
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
