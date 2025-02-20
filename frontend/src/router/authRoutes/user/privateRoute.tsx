import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const authenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  if (!authenticated) return <Navigate to="/auth/signup" replace />;
  return authenticated ? element : <Navigate to="/auth/signup" replace />;
};

export default PrivateRoute;
