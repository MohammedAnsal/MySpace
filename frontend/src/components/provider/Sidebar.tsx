import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BarChart2,
  Bell,
  User,
  Menu,
  PlusCircle,
  X,
  Pen,
  LogOut,
  ChevronLeft,
  ChevronRight,
  NotebookPen
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { providerLogout } from "@/services/Api/providerApi";
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
    icon: <BarChart2 size={20} className="text-gray-700" />,
    path: "/provider/dashboard",
  },
  {
    id: "add",
    title: "Add Property",
    icon: <PlusCircle size={20} className="text-gray-700" />,
    path: "/provider/properties/add",
  },
  {
    id: "properties",
    title: "Properties",
    icon: <Home size={20} className="text-gray-700" />,
    path: "/provider/properties",
  },
  {
    id: "analytics",
    title: "Manage Properties",
    icon: <NotebookPen size={20} className="text-gray-700" />,
    path: "/provider/analytics",
  },
  {
    id: "facilities",
    title: "Facilities",
    icon: <Pen size={20} className="text-gray-700" />,
    path: "/provider/facilities",
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: <Bell size={20} className="text-gray-700" />,
    path: "/provider/notifications",
  },
  {
    id: "profile",
    title: "Profile",
    icon: <User size={20} className="text-gray-700" />,
    path: "/provider/profile",
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsExpanded(false);
      } else {
        setIsMobile(false);
        setIsExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await providerLogout();
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

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-amber-200 hover:bg-amber-300 transition-colors shadow-md"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
        } lg:translate-x-0 fixed lg:static top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out shadow-xl`}
      >
        <div 
          className={`${
            isExpanded ? "w-64" : "w-20"
          } h-full bg-gradient-to-b from-amber-200 to-amber-100 flex flex-col overflow-hidden transition-all duration-300`}
        >
          {/* Logo Area */}
          <div className="p-4 flex items-center justify-center border-b border-amber-300">
            <div className="font-bold text-gray-800 text-xl flex items-center">
              {isExpanded ? (
                <div className="flex items-center">
                  {/* <Home size={24} className="text-amber-600 mr-2" /> */}
                  <span>MySpace</span>
                </div>
              ) : (
                <Home size={24} className="text-amber-600" />
              )}
            </div>
          </div>

          {/* Toggle Button (Desktop only) */}
          <div className="hidden lg:flex justify-end pr-3 pt-2">
            <button 
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4 space-y-1">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`mx-2 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
                  isActivePath(item.path) 
                    ? "bg-amber-400 text-gray-900 shadow-md" 
                    : "hover:bg-amber-300 text-gray-600"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <div className={`${isExpanded ? "" : "mx-auto"}`}>
                  {React.cloneElement(item.icon, { 
                    className: isActivePath(item.path) ? "text-gray-900" : "text-gray-600"
                  })}
                </div>
                {isExpanded && (
                  <span className="ml-3 font-medium">{item.title}</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Logout Button */}
          <div className="p-4 border-t border-amber-300">
            <div
              className={`px-3 py-3 rounded-lg cursor-pointer hover:bg-red-100 transition-colors flex items-center text-red-600 ${
                isExpanded ? "" : "justify-center"
              }`}
              onClick={handleLogout}
            >
              <LogOut size={20} />
              {isExpanded && <span className="ml-3 font-medium">Logout</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
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