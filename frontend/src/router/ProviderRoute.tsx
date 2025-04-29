import { RouteObject } from "react-router-dom";
import ProviderSignup from "../pages/provider/Auth/SignUp";
import ProviderSignIn from "../pages/provider/Auth/SignIn";
import { AddHostel } from "../pages/provider/AddProperty/AddHostel";
import Notifications from "../pages/provider/Notifications/Notifications";
import Profile from "../pages/provider/Profile/Profile";
import NotFound from "../components/global/NotFound";
import { ProtecteddRoute } from "./authRoutes/user/ProtectRoute";
import { Role } from "@/types/types";
import { PublicRoute } from "./authRoutes/user/publicRoute";
import ProviderLayout from "@/components/provider/ProviderLayout";
import ProviderDashboard from "../pages/provider/Home/Home";
import { ManageFacilities } from "@/pages/provider/Facilities/ManageFacilities";
import Hostels from "../pages/provider/Hostels/Hostels";
import EditHostel from "@/pages/provider/Hostels/components/EditHostel";
import { Bookings } from "@/pages/provider/Bookings/Bookings";
import Wallet from "@/pages/provider/wallet/Wallet";
import { Chat } from "@/pages/provider/Chat/Chat";

export const ProviderRouter: RouteObject[] = [
  // Public Routes
  {
    path: "/provider/signUp",
    element: (
      <PublicRoute routeType={Role.PROVIDER}>
        <ProviderSignup />
      </PublicRoute>
    ),
  },
  {
    path: "/provider/signIn",
    element: (
      <PublicRoute routeType={Role.PROVIDER}>
        <ProviderSignIn />
      </PublicRoute>
    ),
  },

  // Protected Routes
  {
    path: "/provider",
    element: (
      <ProtecteddRoute allowedRole={Role.PROVIDER}>
        <ProviderLayout />
      </ProtecteddRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <ProviderDashboard />,
      },
      {
        path: "hostel/add",
        element: <AddHostel />,
      },
      {
        path: "hostels",
        element: <Hostels />,
      },
      {
        path: "hostel/edit/:hostelId",
        element: <EditHostel />,
      },
      {
        path: "bookings",
        element: <Bookings />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "wallet",
        element: <Wallet />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },

  // NOT FOUND PAGE
  {
    path: "*",
    element: <NotFound />,
  },
];
