import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { PublicRoute } from "@/router/authRoutes/user/PublicRoute";
import { ProtecteddRoute } from "@/router/authRoutes/user/ProtectRoute";
import { Role } from "@/types/types";
import Loading from "@/components/global/Loading"; // fallback loader
import NotFound from "@/components/global/NotFound"; // keep as normal import (small, global)
import RootPage from "@/router/Rootpage"; // can stay normal (landing)

const Auth = lazy(() => import("@/pages/user/auth/Auth"));
const SignUp = lazy(() => import("@/pages/user/auth/SignUp"));
const SignIn = lazy(() => import("@/pages/user/auth/SignIn"));
const OTPVerification = lazy(() => import("@/pages/user/auth/Otp"));
const ForgotPassword = lazy(() => import("@/pages/user/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/user/auth/ResetPassword"));
const HomePage = lazy(() => import("@/pages/user/home/Home"));
const ProfileLayout = lazy(
  () => import("@/pages/user/home/profile/components/ProfileLayout")
);
const UserProfile = lazy(() => import("@/pages/user/home/profile/UserProfile"));
const MyBookings = lazy(
  () => import("@/pages/user/home/profile/bookings/MyBookings")
);
const BookingDetailsPage = lazy(
  () => import("@/pages/user/home/profile/bookings/BookingDetailsPage")
);
const Wallet = lazy(() => import("@/pages/user/home/profile/wallet/Wallet"));
const Notification = lazy(
  () => import("@/pages/user/home/notification/Notification")
);
const Chat = lazy(() => import("@/pages/user/home/profile/chat/Chat"));
const MyFacility = lazy(
  () => import("@/pages/user/home/profile/facility/MyFacility")
);
const Food = lazy(
  () => import("@/pages/user/home/profile/facility/components/food/Food")
);
const Washing = lazy(
  () => import("@/pages/user/home/profile/facility/components/washing/Washing")
);
const Cleaning = lazy(
  () =>
    import("@/pages/user/home/profile/facility/components/cleaning/Cleaning")
);
const Hostels = lazy(() => import("@/pages/user/home/hostel/Hostels"));
const HostelDetails = lazy(
  () => import("@/pages/user/home/hostel/HostelDetails")
);
const Checkout = lazy(() => import("@/pages/user/home/booking/BookingHostel"));
const SuccessPayment = lazy(
  () => import("@/components/client/payment/SuccessPaymentt")
);
const CancelPayment = lazy(
  () => import("@/components/client/payment/CancelPaymentt")
);
const Contact = lazy(() => import("@/pages/user/home/contact/Contact"));
const About = lazy(() => import("@/pages/user/home/about/About"));

export const UserRoutes: RouteObject[] = [
  // AUTH ROUTES
  {
    path: "/auth",
    element: (
      <Suspense fallback={<Loading />}>
        <Auth />
      </Suspense>
    ),
    children: [
      {
        path: "signUp",
        element: (
          <PublicRoute routeType={Role.USER}>
            <Suspense fallback={<Loading />}>
              <SignUp />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: "signIn",
        element: (
          <PublicRoute routeType={Role.USER}>
            <Suspense fallback={<Loading />}>
              <SignIn />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <PublicRoute routeType={Role.USER}>
            <Suspense fallback={<Loading />}>
              <ForgotPassword />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: "reset-password",
        element: (
          <PublicRoute routeType={Role.USER}>
            <Suspense fallback={<Loading />}>
              <ResetPassword />
            </Suspense>
          </PublicRoute>
        ),
      },
    ],
  },

  {
    path: "/auth/verify-otp",
    element: (
      <PublicRoute routeType={Role.USER}>
        <Suspense fallback={<Loading />}>
          <OTPVerification />
        </Suspense>
      </PublicRoute>
    ),
  },

  // PROTECTED ROUTE
  {
    path: "/home",
    element: (
      <ProtecteddRoute allowedRole={Role.USER}>
        <Suspense fallback={<Loading />}>
          <HomePage />
        </Suspense>
      </ProtecteddRoute>
    ),
  },

  {
    path: "/user",
    element: (
      <Suspense fallback={<Loading />}>
        <ProfileLayout />
      </Suspense>
    ),
    children: [
      {
        path: "profile",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <UserProfile />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
      {
        path: "bookings",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <MyBookings />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
      {
        path: "bookings/:bookingId",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <BookingDetailsPage />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
      {
        path: "wallet",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <Wallet />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
      {
        path: "notification",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <Notification />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
      {
        path: "chat",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <Chat />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
      {
        path: "facility",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <MyFacility />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
      {
        path: "facility/food/:facilityId/:hostelId",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <Food />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
      {
        path: "facility/washing/:facilityId/:hostelId/:providerId",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <Washing />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
      {
        path: "facility/cleaning/:facilityId/:hostelId/:providerId",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <Cleaning />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
    ],
  },

  {
    path: "/accommodations",
    element: (
      <ProtecteddRoute allowedRole={Role.USER}>
        <Suspense fallback={<Loading />}>
          <Hostels />
        </Suspense>
      </ProtecteddRoute>
    ),
  },

  {
    path: "/accommodations/:id",
    element: (
      <ProtecteddRoute allowedRole={Role.USER}>
        <Suspense fallback={<Loading />}>
          <HostelDetails />
        </Suspense>
      </ProtecteddRoute>
    ),
  },

  {
    path: "/checkout/:hostelId",
    element: (
      <ProtecteddRoute allowedRole={Role.USER}>
        <Suspense fallback={<Loading />}>
          <Checkout />
        </Suspense>
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
            <Suspense fallback={<Loading />}>
              <SuccessPayment />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
      {
        path: "cancel",
        element: (
          <ProtecteddRoute allowedRole={Role.USER}>
            <Suspense fallback={<Loading />}>
              <CancelPayment />
            </Suspense>
          </ProtecteddRoute>
        ),
      },
    ],
  },

  {
    path: "/contact",
    element: (
      <Suspense fallback={<Loading />}>
        <Contact />
      </Suspense>
    ),
  },

  {
    path: "/about",
    element: (
      <Suspense fallback={<Loading />}>
        <About />
      </Suspense>
    ),
  },

  // Landing Page
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
