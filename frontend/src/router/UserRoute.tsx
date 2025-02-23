import { Navigate, RouteObject } from "react-router-dom";
import SignUp from "../pages/user/Auth/SignUp";
import SignIn from "../pages/user/Auth/SignIn";
import HomePage from "../pages/user/Home/Home";
import Auth from "../pages/user/Auth/Auth";
import PublicRoute from "./authRoutes/user/publicRoute";
import OTPVerification from "../pages/user/Auth/Otp";
import NotFound from "../components/global/NotFound";
import ProtectRoute from "./authRoutes/user/ProtectRoute";

export const UserRoutes: RouteObject[] = [
  // AUTH ROUTES
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "",
        element: <Navigate to="/auth/signUp" replace />,
      },
      {
        path: "signUp",
        element: <PublicRoute element={<SignUp />} route="/home" />,
      },
      {
        path: "signIn",
        element: <PublicRoute element={<SignIn />} route="/home" />,
      },
    ],
  },

  {
    path: "/auth/verify-otp",
    element: <PublicRoute element={<OTPVerification />} route="/home" />,
  },

  // PROTECTED ROUTE
  {
    path: "/home",
    element: (
      <ProtectRoute allowedRoles={["user"]}>
        <HomePage />
      </ProtectRoute>
    ),
  },

  // NOT FOUND PAGE
  {
    path: "*",
    element: <NotFound />,
  },
];
