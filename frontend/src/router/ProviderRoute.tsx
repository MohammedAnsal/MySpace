import { RouteObject } from "react-router-dom";
import ProviderSignup from "../pages/provider/Auth/SignUp";
import PublicRoute from "./authRoutes/provider/publicRoute";
import ProviderSignIn from "../pages/provider/Auth/SignIn";
import Dashboard from "../pages/provider/Home/Home";
import NotFound from "../components/global/NotFound";
import ProtectedRoute from "./authRoutes/provider/ProtectRoute";

export const ProviderRouter: RouteObject[] = [
  
  {
    path: "/provider/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["provider"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/provider/signUp",
    element: (
      <PublicRoute element={<ProviderSignup />} route="/provider/dashboard" />
    ),
  },
  {
    path: "/provider/signIn",
    element: (
      <PublicRoute element={<ProviderSignIn />} route="/provider/dashboard" />
    ),
  },

  // NOT FOUND PAGE
  {
    path: "*",
    element: <NotFound />,
  },
];
