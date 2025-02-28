import { RouteObject } from "react-router-dom";
import AdminSignIn from "../pages/admin/Auth/SignIn";
import Home from "../pages/admin/Home/HomeLayout";
import { ProtectedRoute } from "./authRoutes/admin/ProtectRoute";
import Users from "@/pages/admin/Home/Users";
import Providers from "@/pages/admin/Home/Providers";
import Dash from "@/pages/admin/Home/Dashboard";
import { PublicRoute } from "./authRoutes/admin/PublicRoute";
import { Role } from "@/types/types";

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
        ],
      },
    ],
  },
];
