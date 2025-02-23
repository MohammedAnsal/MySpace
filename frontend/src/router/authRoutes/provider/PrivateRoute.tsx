// import { useSelector } from "react-redux";
// import { RootState } from "../../../redux/store/store";
// import { Navigate } from "react-router-dom";

// interface PrivateRouteProps {
//   element: React.ReactNode;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
//   const isAuth = useSelector(
//     (state: RootState) => state.provider.isAuthenticated
//   );
//   return isAuth ? <>{element}</> : <Navigate to={"/provider/signIn"} />;
// };

// export default PrivateRoute;

import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuth = useSelector(
    (state: RootState) => state.provider.isAuthenticated
  );
  const role = localStorage.getItem("role"); // Getting role from localStorage
  const location = useLocation();

  // If the provider is authenticated but tries to access a user route, redirect to dashboard
  if (
    isAuth &&
    role === "provider" &&
    !location.pathname.startsWith("/provider")
  ) {
    return <Navigate to="/provider/dashboard" replace />;
  }

  return isAuth ? <>{element}</> : <Navigate to="/provider/signIn" replace />;
};

export default PrivateRoute;
