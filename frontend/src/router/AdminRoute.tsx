import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "./authRoutes/admin/ProtectRoute";
import { PublicRoute } from "./authRoutes/admin/PublicRoute";
import { Role } from "@/types/types";
import Loading from "@/components/global/Loading";

const AdminSignIn = lazy(() => import("../pages/admin/Auth/SignIn"));
const ForgotPassword = lazy(() => import("@/pages/admin/Auth/ForgotPassword"));
const Home = lazy(() => import("../pages/admin/Home/HomeLayout"));
const Dash = lazy(() => import("@/pages/admin/Home/Dashboard/Dashboard"));
const Users = lazy(() => import("@/pages/admin/Home/User/Users"));
const Providers = lazy(() => import("@/pages/admin/Home/Provider/Providers"));
const Requests = lazy(() => import("@/pages/admin/Home/Hostel/Requests"));
const HostelsList = lazy(() => import("@/pages/admin/Home/Hostel/HostelsList"));
const HostelDetails = lazy(
  () => import("@/pages/admin/Home/Hostel/HostelDetails")
);
const AdminManageFacilities = lazy(
  () => import("@/pages/admin/Home/Facility/ManageFacilities")
);
const Bookings = lazy(() => import("@/pages/admin/Home/Bookings/Bookings"));
const Wallet = lazy(() => import("@/pages/admin/Home/Wallet/Wallet"));

export const AdminRouter: RouteObject[] = [
  // 🔹 Public Routes
  {
    path: "/admin/signIn",
    element: (
      <Suspense fallback={<Loading />}>
        <PublicRoute element={<AdminSignIn />} route="/admin/dashboard" />
      </Suspense>
    ),
  },
  {
    path: "/admin/forgot-password",
    element: (
      <Suspense fallback={<Loading />}>
        <PublicRoute element={<ForgotPassword />} route="/admin/signIn" />
      </Suspense>
    ),
  },

  // 🔹 Protected Routes
  {
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute allowedRole={Role.ADMIN}>
          <Home />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        path: "admin",
        children: [
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<Loading />}>
                <Dash />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback={<Loading />}>
                <Users />
              </Suspense>
            ),
          },
          {
            path: "providers",
            element: (
              <Suspense fallback={<Loading />}>
                <Providers />
              </Suspense>
            ),
          },
          {
            path: "accommodations/requests",
            element: (
              <Suspense fallback={<Loading />}>
                <Requests />
              </Suspense>
            ),
          },
          {
            path: "accommodations",
            element: (
              <Suspense fallback={<Loading />}>
                <HostelsList />
              </Suspense>
            ),
          },
          {
            path: "accommodations/:id",
            element: (
              <Suspense fallback={<Loading />}>
                <HostelDetails />
              </Suspense>
            ),
          },
          {
            path: "facility",
            element: (
              <Suspense fallback={<Loading />}>
                <AdminManageFacilities />
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
            path: "wallet",
            element: (
              <Suspense fallback={<Loading />}>
                <Wallet />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];
