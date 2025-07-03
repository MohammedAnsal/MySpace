// ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Bell,
  Calendar,
  LogOut,
  MessageSquareText,
  SquareLibrary,
  User,
  Wallet,
} from "lucide-react";
import Scroll from "@/components/global/scroll";
import { userLogout } from "@/services/Api/userApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slice/userSlice";
import Footer from "@/components/layouts/footer";
import Navbar from "@/components/layouts/navbar";
import socketService from "@/services/socket/socket.service";
import { useNotifications } from "@/contexts/notificationContext";

const ProfileLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullWidthChat, setIsFullWidthChat] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { unreadCount } = useNotifications();

  const menuItems = [
    { name: "My Profile", path: "/user/profile", icon: <User /> },
    { name: "My Bookings", path: "/user/bookings", icon: <Calendar /> },
    { name: "My Wallet", path: "/user/wallet", icon: <Wallet /> },
    { name: "My Facility", path: "/user/facility", icon: <SquareLibrary /> },
    {
      name: "My Notification",
      path: "/user/notification",
      icon: <Bell />,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { name: "My Chat", path: "/user/chat", icon: <MessageSquareText /> },
  ];

  // Check if we're on the chat page
  const isChatPage = location.pathname === "/user/chat";

  // Add window resize effect to handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Set full width chat when screen width is below 1080px and on chat page
      setIsFullWidthChat(window.innerWidth < 1080 && isChatPage);
    };

    // Initialize on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [isChatPage]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle logout functionality
  const handleLogout = async () => {
    const response = await userLogout();
    if (response.data) {
      toast.success(response.data.message);
      socketService.disconnect();
      localStorage.removeItem("access-token");
      dispatch(logout());
    }
  };

  // If we're on chat page and screen is smaller than 1080px, use a different layout
  if (isFullWidthChat) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#E2E1DF]">
          <div className="flex flex-col max-w-screen-2xl mx-auto">
            <main className="flex-1 p-0 sm:p-2">
              <Outlet />
            </main>
          </div>
        </div>
        <Scroll />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#E2E1DF]">
        <div className="flex flex-col md:flex-row max-w-screen-2xl mx-auto">
          {/* Mobile menu button */}
          <div className="md:hidden p-4 bg-white flex justify-between items-center shadow">
            <h1 className="text-xl font-semibold text-[#b9a089]">My Profile</h1>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Sidebar - Fixed height and position */}
          <div className="md:w-64 md:ml-10 md:mt-10 md:sticky md:top-4 flex-shrink-0 mb-4">
            <aside
              className={`
                bg-[#b9a089] text-white w-full rounded-lg h-full
                md:flex md:flex-col 
                ${isMobileMenuOpen ? "block" : "hidden md:block"}
                transition-all duration-300 ease-in-out
              `}
            >
              <div className="p-6 space-y-8 h-full flex flex-col">
                <div className="space-y-6 flex-grow">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`
                        flex items-center justify-between py-2 px-3 rounded-md
                        hover:bg-white/10 transition duration-150
                        font-dm_sans
                        ${location.pathname === item.path ? "bg-white/20" : ""}
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{item.icon}</span>
                        <span className="font-light tracking-wider text-lg">
                          {item.name}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="bg-white text-[#b9a089] px-2 py-0.5 rounded-full text-sm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 py-2 px-3 rounded-md w-full
                  hover:bg-white/10 transition duration-150"
                >
                  <LogOut />
                  <span className="font-light tracking-wider text-lg">
                    Logout
                  </span>
                </button>
              </div>
            </aside>
          </div>

          {/* Main content - With flex-grow */}
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <Scroll />
      <Footer />
    </>
  );
};

export default ProfileLayout;
