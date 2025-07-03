import { RouteObject } from "react-router-dom";
import SignUp from "@/pages/user/auth/SignUp";
import SignIn from "@/pages/user/auth/SignIn";
import HomePage from "@/pages/user/home/Home";
import Auth from "@/pages/user/auth/Auth";
import { PublicRoute } from "@/router/authRoutes/user/publicRoute";
import OTPVerification from "@/pages/user/auth/Otp";
import NotFound from "@/components/global/notFound";
import { Role } from "@/types/types";
import { ProtecteddRoute } from "@/router/authRoutes/user/protectRoute";
import ForgotPassword from "@/pages/user/auth/ForgotPassword";
import ResetPassword from "@/pages/user/auth/ResetPassword";
import ProfileLayout from "@/pages/user/home/profile/components/ProfileLayout";
import UserProfile from "@/pages/user/home/profile/UserProfile";
import Hostels from "@/pages/user/home/hostel/Hostels";
import HostelDetails from "@/pages/user/home/hostel/HostelDetails";
import Checkout from "@/pages/user/home/booking/BookingHostel";
import { SuccessPayment } from "@/components/client/payment/successPayment";
import { CancelPayment } from "@/components/client/payment/cancelPayment";
import { MyBookings } from "@/pages/user/home/profile/bookings/MyBookings";
import RootPage from "@/router/rootpage";
import Contact from "@/pages/user/home/contact/Contact";
import About from "@/pages/user/home/about/About";
import BookingDetailsPage from "@/pages/user/home/profile/bookings/BookingDetailsPage";
import Wallet from "@/pages/user/home/profile/wallet/Wallet";
import Chat from "@/pages/user/home/profile/chat/Chat";
import { MyFacility } from "@/pages/user/home/profile/facility/MyFacility";
import Food from "@/pages/user/home/profile/facility/components/food/Food";
import Washing from "@/pages/user/home/profile/facility/components/washing/Washing";
import Cleaning from "@/pages/user/home/profile/facility/components/cleaning/Cleaning";
import Notification from "@/pages/user/home/notification/Notification";

export const UserRoutes: RouteObject[] = [
  // AUTH ROUTES
  {
    path: "/auth",
    element: <Auth />,
    children: [
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
      {
        path: "bookings/:bookingId",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <BookingDetailsPage />
          </ProtecteddRoute>
        ),
      },
      {
        path: "wallet",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Wallet />
          </ProtecteddRoute>
        ),
      },
      {
        path: "notification",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Notification />
          </ProtecteddRoute>
        ),
      },
      {
        path: "chat",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Chat />
          </ProtecteddRoute>
        ),
      },
      {
        path: "facility",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <MyFacility />
          </ProtecteddRoute>
        ),
      },
      {
        path: "facility/food/:facilityId/:hostelId",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Food />
          </ProtecteddRoute>
        ),
      },
      {
        path: "facility/washing/:facilityId/:hostelId/:providerId",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Washing />
          </ProtecteddRoute>
        ),
      },

      {
        path: "facility/cleaning/:facilityId/:hostelId/:providerId",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Cleaning />
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
    path: "/checkout/:hostelId",
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
    path: "/contact",
    element: <Contact />,
  },

  {
    path: "/about",
    element: <About />,
  },

  //  Landing Page
  {
    path: "/",
    element: <RootPage />,
  },

  // NOT FOUND PAGE
  {
    path: "*",
    element: <NotFound />,
  },
];
