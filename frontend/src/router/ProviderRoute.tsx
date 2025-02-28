import { RouteObject } from "react-router-dom";
import ProviderSignup from "../pages/provider/Auth/SignUp";
import ProviderSignIn from "../pages/provider/Auth/SignIn";
import Dashboard from "../pages/provider/Home/Home";
import Analytics from "../pages/provider/Analytics/Analytics";
import AddProperty from "../pages/provider/AddProperty/AddProperty";
import Properties from "../pages/provider/Properties/Properties";
import Notifications from "../pages/provider/Notifications/Notifications";
import Profile from "../pages/provider/Profile/Profile";
import NotFound from "../components/global/NotFound";
import { ProtecteddRoute } from "./authRoutes/user/ProtectRoute";
import { Role } from "@/types/types";
import { PublicRoute } from "./authRoutes/user/publicRoute";

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
    path: "/provider/dashboard",
    element: (
      <ProtecteddRoute allowedRole={Role.PROVIDER}>
        <Dashboard />
      </ProtecteddRoute>
    ),
  },
  {
    path: "/provider/analytics",
    element: (
      <ProtecteddRoute allowedRole={Role.PROVIDER}>
        <Analytics />
      </ProtecteddRoute>
    ),
  },
  {
    path: "/provider/add",
    element: (
      <ProtecteddRoute allowedRole={Role.PROVIDER}>
        <AddProperty />
      </ProtecteddRoute>
    ),
  },
  {
    path: "/provider/properties",
    element: (
      <ProtecteddRoute allowedRole={Role.PROVIDER}>
        <Properties />
      </ProtecteddRoute>
    ),
  },
  {
    path: "/provider/notifications",
    element: (
      <ProtecteddRoute allowedRole={Role.PROVIDER}>
        <Notifications />
      </ProtecteddRoute>
    ),
  },
  {
    path: "/provider/profile",
    element: (
      <ProtecteddRoute allowedRole={Role.PROVIDER}>
        <Profile />
      </ProtecteddRoute>
    ),
  },

  // NOT FOUND PAGE
  {
    path: "*",
    element: <NotFound />,
  },
];
