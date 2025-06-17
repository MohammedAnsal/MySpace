import { RootState } from "@/redux/store/store";
import { Role } from "@/types/types";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
  routeType: Role;
}

export const PublicRoute = ({ children, routeType }: PublicRouteProps) => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );

  const location = useLocation();
  const from = location.state?.from?.pathname;

  if (isAuthenticated) {
    if (routeType == "provider" && role == Role.PROVIDER) {
      return <Navigate to={from || "/provider/dashboard"} replace />;
    }

    if (routeType == "user" && role == Role.USER) {
      return <Navigate to={from || "/home"} replace />;
    }

    return (
      <Navigate
        to={role == Role.PROVIDER ? "/provider/dashboard" : "/home"}
        replace
      />
    );
  }

  return <>{children}</>;
};
