import { Navigate, RouteObject } from "react-router-dom";
import SignUp from "../pages/user/Auth/SignUp";
import SignIn from "../pages/user/Auth/SignIn";
import HomePage from "../pages/user/Home/Home";
import Auth from "../pages/user/Auth/Auth";
import { PublicRoute } from "./authRoutes/user/publicRoute";
import OTPVerification from "../pages/user/Auth/Otp";
import NotFound from "../components/global/NotFound";
// import ProtectRoute from "./authRoutes/user/ProtectRoute";
import { Role } from "@/types/types";
import { ProtecteddRoute } from "./authRoutes/user/ProtectRoute";
import ForgotPassword from "@/pages/user/Auth/ForgotPassword";
import ResetPassword from "@/pages/user/Auth/ResetPassword";
import ProfileLayout from "@/components/client/profile/ProfileLayout";
import UserProfile from "@/pages/user/Home/profile/UserProfile";
import Hostels from "@/pages/user/Home/hostel/Hostels";
import HostelDetails from "@/pages/user/Home/hostel/HostelDetails";
import Checkout from "@/pages/user/Home/booking/BookingHostel";
import { SuccessPayment } from "@/components/client/payment/SuccessPayment";
import { CancelPayment } from "@/components/client/payment/CancelPayment";
import { MyBookings } from "@/pages/user/Home/profile/bookings/MyBookings";

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
        element: (
          <PublicRoute routeType={Role.USER}>
            <SignUp />
          </PublicRoute>
        ),
      },
      {
        path: "signIn",
        element: (
          <PublicRoute routeType={Role.USER}>
            <SignIn />
          </PublicRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <PublicRoute routeType={Role.USER}>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      {
        path: "reset-password",
        element: (
          <PublicRoute routeType={Role.USER}>
            <ResetPassword />
          </PublicRoute>
        ),
      },
    ],
  },

  {
    path: "/auth/verify-otp",
    element: (
      <PublicRoute routeType={Role.USER}>
        <OTPVerification />
      </PublicRoute>
    ),
  },

  // PROTECTED ROUTE
  {
    path: "/home",
    element: (
      <ProtecteddRoute allowedRole={Role.USER}>
        <HomePage />
      </ProtecteddRoute>
    ),
  },

  {
    path: "/user",
    element: <ProfileLayout />,
    children: [
      {
        path: "profile",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <UserProfile />
          </ProtecteddRoute>
        ),
      },
      {
        path: "bookings",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <MyBookings />
          </ProtecteddRoute>
        ),
      },
    ],
  },

  {
    path: "/accommodations",
    element: (
      <ProtecteddRoute allowedRole={Role.USER}>
        <Hostels />
      </ProtecteddRoute>
    ),
  },

  {
    path: "/accommodations/:id",
    element: (
      <ProtecteddRoute allowedRole={Role.USER}>
        <HostelDetails />
      </ProtecteddRoute>
    ),
  },

  {
    path: "/checkout",
    element: (
      <ProtecteddRoute allowedRole={Role.USER}>
        <Checkout />
      </ProtecteddRoute>
    ),
  },

  {
    path: "/booking",
    children: [
      {
        path: "success",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <SuccessPayment />
          </ProtecteddRoute>
        ),
      },
      {
        path: "cancel",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <CancelPayment />
          </ProtecteddRoute>
        ),
      },
    ],
  },

  {
    path: "/",
    element: (
      <PublicRoute routeType={Role.USER}>
        <HomePage />
      </PublicRoute>
    ),
  },

  // NOT FOUND PAGE
  {
    path: "*",
    element: <NotFound />,
  },
];
