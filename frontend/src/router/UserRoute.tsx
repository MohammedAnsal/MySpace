import { createBrowserRouter, Navigate } from "react-router-dom";
import SignUp from "../pages/user/Auth/SignUp";
import SignIn from "../pages/user/Auth/SignIn";
// import OTPVerification from "../pages/user/Auth/Otp";
import HomePage from "../pages/user/Home/Home";
import Auth from "../pages/user/Auth/Auth";
import PublicRoute from "./authRoutes/user/publicRoute";
import OTPVerification from "../pages/user/Auth/Otp";
// import PrivateRoute from "./authRoutes/user/privateRoute";

export const Router = createBrowserRouter([
  // AUTH ROUTES
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        // element: <SideTextSection />, // Common layout for Auth pages
        children: [
          {
            path: "",
            element: <Navigate to="/auth/signUp" />,
          },
          {
            path: "signUp",
            element: <PublicRoute element={<SignUp />} route="/" />,
          },
          {
            path: "signIn",
            element: <PublicRoute element={<SignIn />} route="/" />,
          },
          // {
          //   path: "otp/resend",
          //   element: (
          //     <ProtectedRoute element={<ResendOtp />} store="otp-token" />
          //   ),
          // },
        ],
      },
    ],
  },

  {
    path: "/auth/verify-otp",
    element: <PublicRoute element={<OTPVerification />} route="/" />,
  },

  // OTHER ROUTES
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "home",
        element: <Navigate to="/" />,
      },
    ],
  },

  // NOT FOUND PAGE
  // {
  //   path: "*",
  //    : <NotFoundPage />,
  // },
]);
