import { RouteObject } from "react-router-dom";
import AdminSignIn from "../pages/admin/Auth/SignIn";
import Home from "../pages/admin/Home/HomeLayout";
// import ProtectRoute from "./authRoutes/admin/ProtectRoute";
import Users from "@/pages/admin/Home/Users";
import Providers from "@/pages/admin/Home/Providers";
import Dash from "@/pages/admin/Home/Dashboard";

export const AdminRouter: RouteObject[] = [
  {
    path: "/admin/signIn",
    element: <AdminSignIn />,
  },
  {
    path: "admin",
    element: <Home />,
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
];
