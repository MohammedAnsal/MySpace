import { RouteObject } from "react-router-dom";
import ProviderSignup from "../pages/provider/Auth/SignUp";
// import PublicRoute from "./authRoutes/provider/publicRoute";
import ProviderSignIn from "../pages/provider/Auth/SignIn";
import Dashboard from "../pages/provider/Home/Home";
import NotFound from "../components/global/NotFound";
import ProtectedRoute from "./authRoutes/provider/ProtectRoute";
import { ProtecteddRoute } from "./authRoutes/user/ProtectRoute";
import { Role } from "@/types/types";
import { PublicRoute } from "./authRoutes/user/publicRoute";

export const ProviderRouter: RouteObject[] = [
  {
    path: "/provider/dashboard",
    element: (
      <ProtecteddRoute allowedRole={Role.PROVIDER}>
        <Dashboard />
      </ProtecteddRoute>
    ),
  },
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

  // NOT FOUND PAGE
  {
    path: "*",
    element: <NotFound />,
  },
];
