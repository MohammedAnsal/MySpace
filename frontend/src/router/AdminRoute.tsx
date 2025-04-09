import { RouteObject } from "react-router-dom";
import AdminSignIn from "../pages/admin/Auth/SignIn";
import Home from "../pages/admin/Home/HomeLayout";
import { ProtectedRoute } from "./authRoutes/admin/ProtectRoute";
import Users from "@/pages/admin/Home/User/Users";
import Providers from "@/pages/admin/Home/Provider/Providers";
import Dash from "@/pages/admin/Home/Dashboard/Dashboard";
import { PublicRoute } from "./authRoutes/admin/PublicRoute";
import { Role } from "@/types/types";
import { Requests } from "@/pages/admin/Home/Hostel/Requests";
import HostelsList from "@/pages/admin/Home/Hostel/HostelsList";
import HostelDetails from "@/pages/admin/Home/Hostel/HostelDetails";

export const AdminRouter: RouteObject[] = [
  {
    path: "/admin/signIn",
    element: <PublicRoute element={<AdminSignIn />} route="/admin/dashboard" />,
  },
  {
    element: (
      <ProtectedRoute allowedRole={Role.ADMIN}>{<Home />}</ProtectedRoute>
    ),
    children: [
      {
        path: "admin",
        children: [
          {
            path: "dashboard",
            element: <Dash />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "providers",
            element: <Providers />,
          },
          {
            path: "accommodations/requests",
            element: <Requests />,
          },
          {
            path: "accommodations",
            element: <HostelsList />,
          },
          {
            path: "accommodations/:id",
            element: <HostelDetails />,
          },
        ],
      },
    ],
  },
];
