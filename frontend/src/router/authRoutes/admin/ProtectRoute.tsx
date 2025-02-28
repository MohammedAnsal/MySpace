import { RootState } from "@/redux/store/store";
import { Role } from "@/types/types";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRole: Role;
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  allowedRole,
  children,
}: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.admin
  );

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={"/admin/signIn"} state={{ from: location }} replace />;
  }

  if (role != allowedRole) {
    const rePath = role == Role.PROVIDER ? "/provider/dashboard" : "/home";

    return <Navigate to={rePath} replace />;
  }

  // if (role !== Role.USER) {
  //   return <Navigate to={location} state={{ from: location }} replace />;
  // }

  return <>{children}</>;
};
