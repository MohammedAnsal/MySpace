// import { PropsWithChildren } from "react";
// import { useAuth } from "../../../context/user/AuthContext";
// import { User } from "../../../types/User";

import { RootState } from "@/redux/store/store";
import { Role } from "@/types/types";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// type ProtectedRouteProps = PropsWithChildren & {
//   allowedRoles?: User["role"][];
// };

// export default function ProtectedRoute({
//   allowedRoles,
//   children,
// }: ProtectedRouteProps) {
//   const { currentUser } = useAuth();

//   // Show loading if currentUser is still being fetched
//   if (currentUser === undefined) {
//     return <div>Loading...</div>; // Maybe replace with a spinner later
//   }

//   if (
//     currentUser === null ||
//     (allowedRoles && !allowedRoles.includes(currentUser.role))
//   ) {
//     return <div>Permission Denided</div>;
//   }

//   // All good, show the protected content
//   return <>{children}</>;
// }

interface ProtectedRouteProps {
  allowedRole: Role;
  children: React.ReactNode;
}

export const ProtecteddRoute = ({
  allowedRole,
  children,
}: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={"/"} state={{ from: location }} replace />;
  }

  if (role != allowedRole) {
    const rePath = role == Role.PROVIDER ? "/provider/dashboard" : "/home";

    return <Navigate to={rePath} replace />;
  }

  return <>{children}</>;
};
