import { RouteObject } from "react-router-dom";
import ProviderSignup from "../pages/provider/Auth/SignUp";
import ProviderSignIn from "../pages/provider/Auth/SignIn";
import { AddHostel } from "../pages/provider/AddProperty/AddHostel";
import Notifications from "../pages/provider/Notifications/Notifications";
import Profile from "../pages/provider/Profile/Profile";
import NotFound from "../components/global/notFound";
import { ProtecteddRoute } from "./authRoutes/user/protectRoute";
import { Role } from "@/types/types";
import { PublicRoute } from "./authRoutes/user/publicRoute";
import ProviderLayout from "@/components/provider/providerLayout";
import ProviderDashboard from "../pages/provider/Home/Home";
import Hostels from "../pages/provider/Hostels/Hostels";
import EditHostel from "@/pages/provider/Hostels/components/EditHostel";
import { Bookings } from "@/pages/provider/Bookings/Bookings";
import Wallet from "@/pages/provider/wallet/Wallet";
import ProviderChat from "@/pages/provider/Chat/Chat";
import { ListHostelFacility } from "@/pages/provider/Facilities/ListHostelFacility";
import { Food } from "@/pages/provider/Facilities/components/Food";
import { Cleaning } from "@/pages/provider/Facilities/components/Cleaning";
import { Washing } from "@/pages/provider/Facilities/components/Washing";
import { ForgotPassword } from "@/pages/provider/Auth/ForgotPassword";

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
  {
    path: "/provider/forgot-password",
    element: (
      <PublicRoute routeType={Role.PROVIDER}>
        <ForgotPassword />
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
        path: "manage-facility",
        children: [
          {
            path: "",
            element: <ListHostelFacility />,
          },
          {
            path: ":hostelId/:facilityId/catering-service",
            element: <Food />,
          },
          {
            path: ":hostelId/deep-cleaning-service",
            element: <Cleaning />,
          },
          {
            path: ":hostelId/laundry-service",
            element: <Washing />,
          },
        ],
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
        element: <ProviderChat />,
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
