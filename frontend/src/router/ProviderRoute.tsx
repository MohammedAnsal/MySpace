import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { ProtecteddRoute } from "./authRoutes/user/ProtectRoute";
import { PublicRoute } from "./authRoutes/user/PublicRoute";
import { Role } from "@/types/types";
import Loading from "@/components/global/Loading"; // use your global loading spinner

const ProviderSignup = lazy(() => import("../pages/provider/Auth/SignUp"));
const ProviderSignIn = lazy(() => import("../pages/provider/Auth/SignIn"));
const ForgotPassword = lazy(
  () => import("../pages/provider/Auth/ForgotPassword")
);

const ProviderLayout = lazy(
  () => import("@/components/provider/ProviderLayout")
);
const ProviderDashboard = lazy(() => import("../pages/provider/Home/Home"));
const AddHostel = lazy(() => import("../pages/provider/AddProperty/AddHostel"));
const Hostels = lazy(() => import("../pages/provider/Hostels/Hostels"));
const EditHostel = lazy(
  () => import("@/pages/provider/Hostels/components/EditHostel")
);
const Bookings = lazy(() => import("@/pages/provider/Bookings/Bookings"));
const ListHostelFacility = lazy(
  () => import("@/pages/provider/Facilities/ListHostelFacility")
);
const Food = lazy(() => import("@/pages/provider/Facilities/components/Food"));
const Cleaning = lazy(
  () => import("@/pages/provider/Facilities/components/Cleaning")
);
const Washing = lazy(
  () => import("@/pages/provider/Facilities/components/Washing")
);
const Notifications = lazy(
  () => import("../pages/provider/Notifications/Notifications")
);
const Wallet = lazy(() => import("@/pages/provider/wallet/Wallet"));
const ProviderChat = lazy(() => import("@/pages/provider/Chat/Chat"));
const Profile = lazy(() => import("../pages/provider/Profile/Profile"));
const NotFound = lazy(() => import("../components/global/notFound"));

export const ProviderRouter: RouteObject[] = [
  // Public Routes
  {
    path: "/provider/signUp",
    element: (
      <Suspense fallback={<Loading />}>
        <PublicRoute routeType={Role.PROVIDER}>
          <ProviderSignup />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/provider/signIn",
    element: (
      <Suspense fallback={<Loading />}>
        <PublicRoute routeType={Role.PROVIDER}>
          <ProviderSignIn />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/provider/forgot-password",
    element: (
      <Suspense fallback={<Loading />}>
        <PublicRoute routeType={Role.PROVIDER}>
          <ForgotPassword />
        </PublicRoute>
      </Suspense>
    ),
  },

  // Protected Routes
  {
    path: "/provider",
    element: (
      <Suspense fallback={<Loading />}>
        <ProtecteddRoute allowedRole={Role.PROVIDER}>
          <ProviderLayout />
        </ProtecteddRoute>
      </Suspense>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Loading />}>
            <ProviderDashboard />
          </Suspense>
        ),
      },
      {
        path: "hostel/add",
        element: (
          <Suspense fallback={<Loading />}>
            <AddHostel />
          </Suspense>
        ),
      },
      {
        path: "hostels",
        element: (
          <Suspense fallback={<Loading />}>
            <Hostels />
          </Suspense>
        ),
      },
      {
        path: "hostel/edit/:hostelId",
        element: (
          <Suspense fallback={<Loading />}>
            <EditHostel />
          </Suspense>
        ),
      },
      {
        path: "bookings",
        element: (
          <Suspense fallback={<Loading />}>
            <Bookings />
          </Suspense>
        ),
      },
      {
        path: "manage-facility",
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <ListHostelFacility />
              </Suspense>
            ),
          },
          {
            path: ":hostelId/:facilityId/catering-service",
            element: (
              <Suspense fallback={<Loading />}>
                <Food />
              </Suspense>
            ),
          },
          {
            path: ":hostelId/deep-cleaning-service",
            element: (
              <Suspense fallback={<Loading />}>
                <Cleaning />
              </Suspense>
            ),
          },
          {
            path: ":hostelId/laundry-service",
            element: (
              <Suspense fallback={<Loading />}>
                <Washing />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "notifications",
        element: (
          <Suspense fallback={<Loading />}>
            <Notifications />
          </Suspense>
        ),
      },
      {
        path: "wallet",
        element: (
          <Suspense fallback={<Loading />}>
            <Wallet />
          </Suspense>
        ),
      },
      {
        path: "chat",
        element: (
          <Suspense fallback={<Loading />}>
            <ProviderChat />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        ),
      },
    ],
  },

  // NOT FOUND PAGE
  {
    path: "*",
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ),
  },
];
