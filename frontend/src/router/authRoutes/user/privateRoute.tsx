import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Navigate } from "react-router";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  console.log("isAuth in private", isAuthenticated);

  return isAuthenticated ? <>{element}</> : <Navigate to="/auth/signIn" />;
};

export default PrivateRoute;
