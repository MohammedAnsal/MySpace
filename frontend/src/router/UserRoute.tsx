import { RouteObject } from "react-router-dom";
import SignUp from "@/pages/user/Auth/SignUp";
import SignIn from "@/pages/user/Auth/SignIn";
import HomePage from "@/pages/user/Home/Home";
import Auth from "@/pages/user/Auth/Auth";
import { PublicRoute } from "@/router/authRoutes/user/publicRoute";
import OTPVerification from "@/pages/user/Auth/Otp";
import NotFound from "@/components/global/NotFound";
// import ProtectRoute from "./authRoutes/user/ProtectRoute";
import { Role } from "@/types/types";
import { ProtecteddRoute } from "@/router/authRoutes/user/ProtectRoute";
import ForgotPassword from "@/pages/user/Auth/ForgotPassword";
import ResetPassword from "@/pages/user/Auth/ResetPassword";
import ProfileLayout from "@/pages/user/Home/profile/components/ProfileLayout";
import UserProfile from "@/pages/user/Home/profile/UserProfile";
import Hostels from "@/pages/user/Home/hostel/Hostels";
import HostelDetails from "@/pages/user/Home/hostel/HostelDetails";
import Checkout from "@/pages/user/Home/booking/BookingHostel";
import { SuccessPayment } from "@/components/client/payment/SuccessPayment";
import { CancelPayment } from "@/components/client/payment/CancelPayment";
import { MyBookings } from "@/pages/user/Home/profile/bookings/MyBookings";
import RootPage from "@/router/Rootpage";
import Contact from "@/pages/user/Home/contact/Contact";
import About from "@/pages/user/Home/about/About";
import BookingDetailsPage from "@/pages/user/Home/profile/bookings/BookingDetailsPage";
import Wallet from "@/pages/user/Home/profile/wallet/Wallet";
import Chat from "@/pages/user/Home/profile/chat/Chat";
import { MyFacility } from "@/pages/user/Home/profile/facility/MyFacility";
import Food from "@/pages/user/Home/profile/facility/components/food/Food";
import Washing from "@/pages/user/Home/profile/facility/components/washing/Washing";
import Cleaning from "@/pages/user/Home/profile/facility/components/cleaning/Cleaning";
import Notification from "@/pages/user/Home/notification/Notification";

export const UserRoutes: RouteObject[] = [
  // AUTH ROUTES
  {
    path: "/auth",
    element: <Auth />,
    children: [
      // {
      //   path: "",
      //   element: <Navigate to="/auth/signUp" replace />,
      // },
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

  // {
  //   path: "/",
  //   element: (
  //     <PublicRoute routeType={Role.USER}>
  //       <HomePage />
  //     </PublicRoute>
  //   ),
  // },

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
