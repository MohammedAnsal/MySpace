import { RouteObject } from "react-router-dom";
import ProviderSignup from "../pages/provider/Auth/SignUp";
import ProviderSignIn from "../pages/provider/Auth/SignIn";
import Analytics from "../pages/provider/Analytics/Analytics";
import { AddProperty } from "../pages/provider/AddProperty/AddProperty";
import Properties from "../pages/provider/Properties/Properties";
import Notifications from "../pages/provider/Notifications/Notifications";
import Profile from "../pages/provider/Profile/Profile";
import NotFound from "../components/global/NotFound";
import { ProtecteddRoute } from "./authRoutes/user/ProtectRoute";
import { Role } from "@/types/types";
import { PublicRoute } from "./authRoutes/user/publicRoute";
import ProviderLayout from "@/components/provider/ProviderLayout";
import ProviderDashboard from "../pages/provider/Home/Home";
import { ManageFacilities } from "@/pages/provider/Facilities/ManageFacilities";

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
        path: "properties/add",
        element: <AddProperty />,
      },
      {
        path: "properties",
        element: <Properties />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "facilities",
        element: <ManageFacilities />,
      },
      {
        path: "notifications",
        element: <Notifications />,
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
