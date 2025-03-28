// ProfilePage.tsx
import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Calendar,
  LogOut,
  MapPin,
  SquareLibrary,
  User,
  Wallet,
} from "lucide-react";
import { userLogout } from "@/services/Api/userApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slice/userSlice";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

// Menu items for the sidebar
const menuItems = [
  { name: "My Account", path: "/user/profile", icon: <User /> },
  { name: "My Bookings", path: "/bookings", icon: <Calendar /> },
  { name: "My Address", path: "/address", icon: <MapPin /> },
  { name: "My Wallet", path: "/wallet", icon: <Wallet /> },
  { name: "My Facility", path: "/facility", icon: <SquareLibrary /> },
];

const ProfileLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle logout functionality
  const handleLogout = async () => {
    const response = await userLogout();
    if (response.data) {
      toast.success(response.data.message);
      localStorage.removeItem("access-token");
      dispatch(logout());
    }
  };

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
          <div className="md:w-64 md:ml-10 md:mt-16 md:sticky md:self-start md:top-4">
            <aside
              className={`
                bg-[#b9a089] text-white w-full rounded-lg
                md:flex md:flex-col md:h-auto
                ${isMobileMenuOpen ? "block" : "hidden md:block"}
                transition-all duration-300 ease-in-out
              `}
            >
              <div className="p-6 space-y-8">
                <div className="space-y-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`
                      flex items-center space-x-3 py-2 px-3 rounded-md
                      hover:bg-white/10 transition duration-150
                      font-dm_sans
                      ${location.pathname === item.path ? "bg-white/20" : ""}
                    `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.icon}</span>
                      <span className="font-light tracking-wider text-lg">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 py-2 px-3 rounded-md w-full
                  hover:bg-white/10 transition duration-150 mt-auto"
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
      <Footer />
    </>
  );
};

export default ProfileLayout;
