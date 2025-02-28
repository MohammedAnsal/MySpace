import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BarChart2,
  Users,
  Calendar,
  Bell,
  User,
  Menu,
  PlusCircle,
  X,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { user_Logout } from "@/services/Api/userApi";
import { logout } from "@/redux/slice/userSlice";

interface NavItem {
  id: string;
  title: string;
  icon: JSX.Element;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home size={24} className="text-gray-700" />,
    path: "/provider/dashboard"
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: <BarChart2 size={24} className="text-gray-700" />,
    path: "/provider/analytics"
  },
  {
    id: "add",
    title: "Add Property",
    icon: <PlusCircle size={24} className="text-gray-700" />,
    path: "/provider/add"
  },
  {
    id: "properties",
    title: "Properties",
    icon: <Home size={24} className="text-gray-700" />,
    path: "/provider/properties"
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: <Bell size={24} className="text-gray-700" />,
    path: "/provider/notifications"
  },
  {
    id: "profile",
    title: "Profile",
    icon: <User size={24} className="text-gray-700" />,
    path: "/provider/profile"
  }
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await user_Logout();
      if (response.data) {
        toast.success(response.data.message);
        localStorage.removeItem("access-token");
        dispatch(logout());
        navigate("/provider/signIn");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-amber-200 hover:bg-amber-300 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-gray-700" />
          ) : (
            <Menu size={24} className="text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out`}
      >
        <div className="w-64 lg:w-16 bg-amber-200 h-full flex flex-col items-center pt-16 lg:pt-4 space-y-8">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`w-full lg:w-auto px-4 lg:px-2 py-2 rounded-lg cursor-pointer hover:bg-amber-300 transition-colors flex items-center ${
                isActivePath(item.path) ? "bg-amber-300" : ""
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon}
              <span className="ml-3 lg:hidden">{item.title}</span>
            </div>
          ))}
          
          <div
            className="mt-auto mb-4 w-full lg:w-auto px-4 lg:px-2 py-2 rounded-lg cursor-pointer hover:bg-amber-300 transition-colors flex items-center text-red-600"
            onClick={handleLogout}
          >
            <LogOut size={24} className="text-current" />
            <span className="ml-3 lg:hidden">Logout</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
